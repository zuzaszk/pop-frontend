<script>
  import { push } from "svelte-spa-router";

  let email = "";
  let loading = false;
  let errorMessage = "";
  let successMessage = "";

  async function handleForgotPassword() {
    if (!email || !email.includes("@")) {
      errorMessage = "Please provide a valid email address.";
      successMessage = "";
      return;
    }

    try {
      loading = true;

      const response = await fetch(
        "https://269593.kieg.science/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        successMessage = "A password reset link has been sent to your email.";
        errorMessage = "";
      } else {
        errorMessage =
          data.message || "Something went wrong. Please try again.";
        successMessage = "";
      }
    } catch (error) {
      errorMessage = "An error occurred. Please try again.";
      successMessage = "";
    } finally {
      loading = false;
    }
  }

  function backToLogin() {
    push("/");
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
    <h2 class="text-3xl font-bold text-gray-800 text-center mb-6">
      Forgot Password
    </h2>

    {#if successMessage}
      <p class="text-green-500 mb-4 text-center">{successMessage}</p>
    {/if}

    {#if errorMessage}
      <p class="text-red-500 mb-4 text-center">{errorMessage}</p>
    {/if}

    <div class="flex flex-col space-y-4">
      <input
        type="email"
        placeholder="Enter your email address"
        bind:value={email}
        class="w-full p-4 rounded-lg border border-gray-300 text-gray-900 bg-white focus:outline-none focus:border-gray-500"
        required
      />

      <button
        on:click={handleForgotPassword}
        class="w-full py-4 bg-red-600 text-white font-bold rounded-lg shadow-lg hover:bg-red-700"
        disabled={loading}
      >
        {#if loading}
          <span>Sending...</span>
        {:else}
          Send Reset Link
        {/if}
      </button>
    </div>

    <p class="mt-6 text-center text-gray-500">
      <a
        on:click={backToLogin}
        class="text-red-600 hover:underline cursor-pointer">Back to Login</a
      >
    </p>
  </div>
</div>
