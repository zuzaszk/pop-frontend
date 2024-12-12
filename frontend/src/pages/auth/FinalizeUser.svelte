<script>
  import { authStore } from "../../stores/authStore";
  import { push } from "svelte-spa-router";
  import { get } from "svelte/store";

  let email = "";
  let token = ""; // The token extracted from the URL
  let errorMessage = "";
  let successMessage = "";
  let loading = false;

  // Extract token from URL on component mount
  onMount(() => {
    const query = window.location.search;
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

  // Finalize user registration
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

        console.log("Finalization successful:", data);

        // Store the JWT token in cookies
        document.cookie = `authToken=${data.jwtToken}; path=/; max-age=86400;`;

        // Update the authStore with the user and token data
        authStore.set({
          token: data.jwtToken,
          user: data.user,
          role: mapRole(data.userRole[0]?.roleId),
          isAuthenticated: true,
        });

        console.log("AuthStore after finalization:", get(authStore));

        // Show success message
        successMessage = "Your account has been successfully finalized! Redirecting...";
        
        // Redirect to the user's dashboard
        const role = mapRole(data.userRole[0]?.roleId);
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
          errorResponse.message ||
          "Failed to finalize your account. Please try again.";
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

<div class="flex justify-center items-center min-h-screen bg-gray-100">
  <div class="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
    <h1 class="text-2xl font-bold text-gray-800 mb-4">Complete Your Registration</h1>
    <p class="text-gray-600 mb-6">
      Enter your email to link your USOS account or create a new one.
    </p>

    {#if errorMessage}
      <div class="bg-red-100 text-red-800 p-3 rounded mb-4">{errorMessage}</div>
    {/if}

    {#if successMessage}
      <div class="bg-green-100 text-green-800 p-3 rounded mb-4">{successMessage}</div>
    {/if}

    <input
      type="email"
      bind:value={email}
      placeholder="Enter your email"
      class="w-full p-3 border border-gray-300 rounded mb-4 text-gray-800"
    />
    <button
      on:click={finalizeUser}
      class="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:opacity-50"
      disabled={loading}
    >
      {loading ? "Submitting..." : "Submit"}
    </button>
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
