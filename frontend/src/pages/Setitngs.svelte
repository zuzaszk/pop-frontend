<script>
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";

  let currentRoleId = null;
  let roles = [];
  let selectedRoleId = null;
  let successMessage = "";
  let errorMessage = "";

  async function fetchUserRoles() {
    const token = sessionStorage.getItem("authToken");

    try {
      const response = await fetch(`http://localhost:8080/user/roles`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        roles = await response.json();

        const currentRoleResponse = await fetch(
          `http://localhost:8080/user/currentRole`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (currentRoleResponse.ok) {
          currentRoleId = await currentRoleResponse.json();
          selectedRoleId = currentRoleId;
        } else {
          errorMessage = "Failed to fetch current role.";
        }
      } else {
        errorMessage = "Failed to fetch roles.";
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
      errorMessage = "An error occurred. Please try again.";
    }
  }

  async function switchRole() {
    const token = sessionStorage.getItem("authToken");

    if (!selectedRoleId || selectedRoleId === currentRoleId) {
      errorMessage = "Please select a different role to switch.";
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/user/switchRole?roleId=${selectedRoleId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        successMessage = "Role switched successfully!";
        currentRoleId = selectedRoleId;
      } else {
        errorMessage = "Failed to switch role.";
      }
    } catch (error) {
      console.error("Error switching role:", error);
      errorMessage = "An error occurred. Please try again.";
    }
  }

  onMount(fetchUserRoles);
</script>

<div
  class="container mx-auto p-6 bg-white rounded-lg shadow-lg mt-10 max-w-3xl"
>
  <h2 class="text-2xl font-bold text-[#2C3E50] mb-6">Settings</h2>

  <div class="mb-8">
    <h3 class="text-xl font-semibold text-[#2C3E50] mb-4">Switch Role</h3>

    {#if errorMessage}
      <div
        class="bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-4"
      >
        {errorMessage}
      </div>
    {/if}
    {#if successMessage}
      <div
        class="bg-green-100 border border-green-400 text-green-700 p-3 rounded mb-4"
      >
        {successMessage}
      </div>
    {/if}

    <div class="mb-4">
      <p class="text-gray-700">
        <strong>Current Role:</strong>
        {#if currentRoleId}
          {roles.find((role) => role.roleId === currentRoleId)?.roleName ||
            "Unknown"}
        {/if}
      </p>
    </div>

    <div class="flex flex-col md:flex-row gap-4 items-center">
      <select
        bind:value={selectedRoleId}
        class="p-3 border border-gray-300 rounded-lg flex-1 bg-white text-gray-700 focus:ring-2 focus:ring-[#E74C3E] focus:outline-none"
      >
        {#each roles as role}
          <option value={role.roleId} disabled={role.roleId === currentRoleId}>
            {role.roleName}
            {role.roleId === currentRoleId ? " (Current)" : ""}
          </option>
        {/each}
      </select>
      <button
        on:click={switchRole}
        class="bg-[#E74C3E] text-white py-2 px-4 rounded-lg hover:bg-[#C0392B] transition duration-200 focus:ring-2 focus:ring-[#E74C3E] focus:outline-none"
      >
        Switch Role
      </button>
    </div>
  </div>
</div>

<style>
  .container {
    max-width: 600px;
    margin: auto;
  }

  select {
    min-width: 200px;
    background-color: white;
    appearance: none;
    cursor: pointer;
  }

  select:focus {
    outline: none;
  }

  button:disabled {
    background-color: #f1f1f1;
    color: #b3b3b3;
    cursor: not-allowed;
  }
</style>
