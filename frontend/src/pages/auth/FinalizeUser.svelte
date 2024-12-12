<script>
  import { authStore } from "../../stores/authStore";
  import { push } from "svelte-spa-router";
  import { get } from "svelte/store";
  import { onMount } from "svelte";

  let email = "";
  let token = ""; 
  let errorMessage = "";
  let successMessage = "";
  let loading = false;

  onMount(() => {
  const hash = window.location.hash; // Extracts everything after '#'
  const query = hash.startsWith("#/finalize-user?")
    ? hash.substring("#/finalize-user?".length) // Removes the '#/finalize-user?' part
    : "";
  const params = new URLSearchParams(query);
  token = params.get("token");

  if (!token) {
    errorMessage = "Missing token in the URL. Please try logging in again.";
    console.error("Token is missing in the URL.");
  } else {
    console.log("Token extracted successfully:", token);
  }
});


  // Map role IDs to readable roles
  function mapRole(roleId) {
    switch (roleId) {
      case 1: return "student";
      case 2: return "supervisor";
      case 3: return "reviewer";
      case 4: return "chair";
      case 5: return "spectator";
      default: return "unknown";
    }
  }

  async function finalizeUser() {
  if (!email.trim()) {
    errorMessage = "Email is required.";
    return;
  }

  if (!token) {
    errorMessage = "Token is missing. Please try logging in again.";
    return;
  }

  try {
    loading = true;
    errorMessage = "";
    successMessage = "";

    const response = await fetch(
      `http://localhost:8080/usos/finalize-user?token=${encodeURIComponent(
        token
      )}&email=${encodeURIComponent(email)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log("Finalization response data:", data);

      // Check for user role
      const userRole = data.userRole && data.userRole[0];
      if (!userRole) {
        errorMessage = "User role information is missing. Please contact support.";
        console.error("No roles found in response:", data.userRole);
        return;
      }

      // Store the JWT token in cookies
      document.cookie = `authToken=${data.jwtToken}; path=/; max-age=86400;`;

      // Update the authStore with the user and token data
      authStore.set({
        token: data.jwtToken,
        user: data.user,
        role: mapRole(userRole.roleId),
        isAuthenticated: true,
      });

      console.log("AuthStore after finalization:", get(authStore));

      successMessage = "Your account has been successfully finalized! Redirecting...";

      // Redirect to the user's dashboard
      const role = mapRole(userRole.roleId);
      const dashboardRoutes = {
        student: "/student-dashboard",
        supervisor: "/supervisor-dashboard",
        reviewer: "/reviewer-dashboard",
        chair: "/chair-dashboard",
        spectator: "/projects",
      };
      setTimeout(() => push(dashboardRoutes[role] || "/projects"), 2000);
    } else {
      const errorResponse = await response.json();
      errorMessage =
        errorResponse.message || "Failed to finalize your account. Please try again.";
      console.error("Backend error:", errorResponse);
    }
  } catch (error) {
    errorMessage =
      "An error occurred while finalizing your account. Please try again.";
    console.error("Network error:", error);
  } finally {
    loading = false;
  }
}

</script>


<div
  class="flex items-center justify-center w-screen min-h-screen bg-cover bg-center bg-no-repeat relative bg-[url('../pwr4.JPG')]"
>
  <div
    class="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-50"
  ></div>

  <div
    class="relative z-10 w-full max-w-lg p-10 bg-white bg-opacity-90 rounded-lg shadow-lg transform scale-75 origin-center"
  >
    <h1 class="text-3xl font-bold text-gray-800 text-center mb-6">
      Complete Your Registration
    </h1>
    <p class="text-gray-600 text-center mb-6">
      Enter your email to link your USOS account.
    </p>

    {#if errorMessage}
      <div class="bg-red-100 text-red-800 p-3 rounded mb-4 text-center">{errorMessage}</div>
    {/if}

    {#if successMessage}
      <div class="bg-green-100 text-green-800 p-3 rounded mb-4 text-center">{successMessage}</div>
    {/if}

    <div class="flex flex-col space-y-4">
      <input
        type="email"
        bind:value={email}
        placeholder="Enter your email"
        class="w-full p-4 rounded-lg border border-gray-300 text-gray-900 bg-white focus:outline-none focus:border-gray-500"
      />
      <button
        on:click={finalizeUser}
        class="w-full py-4 bg-red-600 text-white font-bold rounded-lg shadow-lg hover:bg-red-700"
        disabled={loading}
      >
        {#if loading}
          Submitting...
        {:else}
          Submit
        {/if}
      </button>
    </div>
  </div>
</div>

<style>
  .flex {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .min-h-screen {
    min-height: 100vh;
  }
  .bg-gray-100 {
    background-color: #f7fafc;
  }
  .bg-white {
    background-color: #fff;
  }
  .text-gray-800 {
    color: #2d3748;
  }
  .text-gray-600 {
    color: #718096;
  }
  .text-red-800 {
    color: #c53030;
  }
  .text-green-800 {
    color: #2f855a;
  }
  .bg-red-100 {
    background-color: #fff5f5;
  }
  .bg-green-100 {
    background-color: #f0fff4;
  }
  .bg-blue-500 {
    background-color: #4299e1;
  }
  .hover\:bg-blue-600:hover {
    background-color: #3182ce;
  }
  .disabled\:opacity-50:disabled {
    opacity: 0.5;
  }
  .p-8 {
    padding: 2rem;
  }
  .rounded {
    border-radius: 0.375rem;
  }
  .rounded-lg {
    border-radius: 0.5rem;
  }
  .max-w-md {
    max-width: 28rem;
  }
</style>