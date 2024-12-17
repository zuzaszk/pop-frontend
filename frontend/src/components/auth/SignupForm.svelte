<script>
  import { createEventDispatcher } from "svelte";

  export let firstName = "";
  export let lastName = "";
  export let username = "";
  export let email = "";
  export let password = "";
  export let loading = false;

  const dispatch = createEventDispatcher();

  function submit() {
    console.log("Form Input Values:");
    console.log("First Name:", firstName);
    console.log("Last Name:", lastName);
    console.log("Username:", username);
    console.log("Email:", email);
    console.log("Password:", password);

    if (!firstName || !lastName || !username || !email || !password) {
      alert("All fields are required.");
      return;
    }

    dispatch("signUp", { firstName, lastName, username, email, password });
  }
</script>

<div>
  <h2 class="text-3xl font-bold mb-8 text-gray-800 text-center">
    Create an Account
  </h2>

  <form on:submit|preventDefault={submit} class="space-y-4">
    <input
      type="text"
      placeholder="First Name"
      bind:value={firstName}
      class="w-full p-4 rounded-lg border border-gray-300 text-gray-900 bg-white focus:outline-none"
      required
    />
    <input
      type="text"
      placeholder="Last Name"
      bind:value={lastName}
      class="w-full p-4 rounded-lg border border-gray-300 text-gray-900 bg-white focus:outline-none"
      required
    />
    <input
      type="text"
      placeholder="Username"
      bind:value={username}
      class="w-full p-4 rounded-lg border border-gray-300 text-gray-900 bg-white focus:outline-none"
      required
    />
    <input
      type="email"
      placeholder="Email"
      bind:value={email}
      class="w-full p-4 rounded-lg border border-gray-300 text-gray-900 bg-white focus:outline-none"
      required
    />
    <input
      type="password"
      placeholder="Password"
      bind:value={password}
      class="w-full p-4 rounded-lg border border-gray-300 text-gray-900 bg-white focus:outline-none"
      required
    />

    <button
      type="submit"
      class="w-full py-4 bg-red-600 text-white font-bold rounded-lg shadow-lg hover:bg-red-700"
      disabled={loading}
    >
      {loading ? "Signing Up..." : "Sign Up"}
    </button>
  </form>

  <p class="mt-6 text-center text-gray-500">
    Already have an account?
    <a href="/" class="text-red-600 hover:underline">Log In</a>
  </p>
</div>

<style>
  input {
    font-family: Arial, sans-serif;
  }

  button {
    font-family: Arial, sans-serif;
    cursor: pointer;
  }
</style>
