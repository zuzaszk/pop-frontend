<!-- <script>
  import { onMount } from "svelte";

  let userName = "User";
  let errorMessage = "";

  async function fetchUserInfo() {
    try {
      const response = await fetch("http://localhost:8080/user", {
        credentials: "include",
      });

      if (response.ok) {
        const user = await response.json();
        userName = user.name || user.firstName || "User";
      } else {
        errorMessage = "Failed to load user information.";
      }
    } catch (error) {
      errorMessage = "An error occurred while fetching user information.";
    }
  }

  onMount(fetchUserInfo);
</script>

<div class="message">
  <h1>Welcome to your Dashboard</h1>
  {#if errorMessage}
    <p class="error">{errorMessage}</p>
  {:else}
    <p>You are logged in as <span>{userName}</span>.</p>
  {/if}
  <a href="/logout">Logout</a>
</div>

<style>
  .message {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  .error {
    color: red;
    margin-top: 1em;
  }
</style> -->

<script>
  import { onMount } from "svelte";

  let user = null;
  let loading = true;
  let errorMessage = "";

  async function fetchUsers() {
    try {
      const response = await fetch("http://localhost:8080/user/listAll", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const users = await response.json();

        const email = decodeToken(localStorage.getItem("token")).email;

        user = users.find((u) => u.email === email);

        if (!user) {
          errorMessage = "User not found.";
        }
      } else {
        errorMessage = "Failed to load user details.";
      }
    } catch (err) {
      errorMessage = "Error fetching user details: " + err.message;
    } finally {
      loading = false;
    }
  }

  function decodeToken(token) {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  }

  onMount(fetchUsers);
</script>

{#if loading}
  <div class="flex justify-center items-center h-screen">
    <p class="text-xl text-gray-600">Loading user details...</p>
  </div>
{:else if errorMessage}
  <div class="flex justify-center items-center h-screen">
    <p class="text-xl text-red-500">{errorMessage}</p>
  </div>
{:else if user}
  <div class="container mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
    <h1 class="text-3xl font-bold text-gray-800 mb-4">
      Welcome, {user.firstName}
      {user.lastName}!
    </h1>
    <p class="text-lg text-gray-600">
      We're glad to have you back. Check your projects, tasks, or evaluations on
      the dashboard.
    </p>

    <div class="mt-6">
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        on:click={() => alert("Navigating to projects...")}
      >
        Go to Projects
      </button>
    </div>
  </div>
{:else}
  <div class="flex justify-center items-center h-screen">
    <p class="text-xl text-gray-500">No user data available.</p>
  </div>
{/if}

<style>
  .container {
    max-width: 800px;
  }
</style>
