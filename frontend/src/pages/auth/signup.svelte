<script>
  import SignupForm from "../../components/SignupForm.svelte";
  import { push } from "svelte-spa-router";

  let loading = false;
  let errorMessage = "";

  async function handleSignUp(event) {
    const { firstName, lastName, username, email, password } = event.detail;

    console.log("Received Data:", {
      firstName,
      lastName,
      username,
      email,
      password,
    });

    if (!firstName || !lastName || !username || !email || !password) {
      errorMessage = "All fields are required.";
      console.log("Validation Failed: Missing fields");
      return;
    }

    try {
      loading = true;
      console.log("Sending data to API...");

      const response = await fetch("http://192.168.0.107:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          username,
          email,
          password,
        }),
      });

      console.log("API Response Status:", response.status);

      const data = await response.clone().json();
      console.log("API Response Data:", data);

      if (response.ok) {
        console.log("User registered successfully!");
        push("/");
      } else {
        errorMessage = data.message || "Signup failed. Please try again.";
        console.error("Error Response Message:", errorMessage);
      }
    } catch (error) {
      errorMessage = "An error occurred during signup. Please try again later.";
      console.error("Error in API call:", error);
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
    <SignupForm on:signUp={handleSignUp} {loading} />

    {#if errorMessage}
      <p class="text-red-500 mt-4 text-center">{errorMessage}</p>
    {/if}
  </div>
</div>

<style>
  div {
    font-family: Arial, sans-serif;
  }

  .scaleContainer {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .scaleContainer .transform {
    transform: scale(0.65);
    transform-origin: center;
  }

  a {
    cursor: pointer;
  }
</style>
