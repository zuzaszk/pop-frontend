<script>
  import { get } from "svelte/store";
  import { authStore } from "../stores/authStore";

  let roles = [];
  let selectedRoleId = null;
  let successMessage = "";
  let errorMessage = "";
  let currentRoleId = null; 

  function mapRole(roleId) {
    switch (roleId) {
      case 1:
        return "student";
      case 2:
        return "supervisor";
      case 3:
        return "reviewer";
      case 4:
        return "chair";
      default:
        return "spectator";
    }
  }

  $: {
    const { user, role } = get(authStore);
    if (user) {
      roles = user.userRole || []; 
      currentRoleId = roles.find((r) => mapRole(r.roleId) === role)?.roleId || null; 
      if (!selectedRoleId) {
        selectedRoleId = currentRoleId; 
      }
    }
  }

  async function switchRole() {
  const token = get(authStore).token;

  if (!selectedRoleId || selectedRoleId === currentRoleId) {
    errorMessage = "Please select a different role to switch.";
    successMessage = ""; 
    return;
  }

  try {
    const userId = get(authStore).user.userId;

    const response = await fetch(
      `https://269593.kieg.science/api/user/switchRole?userId=${userId}&roleId=${selectedRoleId}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.ok) {
      successMessage = "Role switched successfully!";
      errorMessage = ""; 

      const newRole = mapRole(selectedRoleId);

      authStore.update((state) => ({
        ...state,
        role: newRole, 
        
      }));
      console.log("authStore updated:", get(authStore));

      currentRoleId = selectedRoleId;
      
    } else {
      const errorData = await response.json();
      errorMessage = errorData.message || "Failed to switch role.";
      successMessage = ""; 
    }
  } catch (error) {
    console.error("Error switching role:", error);
    errorMessage = "An error occurred. Please try again.";
    successMessage = ""; 
  }
}

</script>


<div class="container mx-auto p-6 bg-gray-100 rounded-lg shadow-lg mt-10 max-w-3xl">
  <h2 class="text-2xl font-bold text-gray-800 mb-6">Settings</h2>

  <div class="mb-8">
    <h3 class="text-xl font-semibold text-gray-800 mb-4">Switch Role</h3>


    {#if errorMessage}
      <div class="bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-4">
        {errorMessage}
      </div>
    {/if}

   
    {#if successMessage}
      <div class="bg-green-100 border border-green-400 text-green-700 p-3 rounded mb-4">
        {successMessage}
      </div>
    {/if}

    <div class="mb-4">
      <p class="text-gray-700">
        <strong>Current Role:</strong>
        {#if currentRoleId}
          {mapRole(currentRoleId)}
        {:else}
          Not assigned
        {/if}
      </p>
    </div>

    <div class="flex flex-col md:flex-row gap-4 items-center">
      <select
        bind:value={selectedRoleId}
        class="p-3 border border-gray-300 rounded-lg flex-1 bg-white text-gray-800 focus:ring-2 focus:ring-red-400 focus:outline-none"
      >
        {#each roles as role}
          <option value={role.roleId} disabled={role.roleId === currentRoleId}>
            {mapRole(role.roleId)} {role.roleId === currentRoleId ? "(Current)" : ""}
          </option>
        {/each}
      </select>
      <button
        on:click={switchRole}
        class="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200 focus:ring-2 focus:ring-red-400 focus:outline-none"
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
    background-color: #f9f9f9;
    border: 1px solid #e5e5e5;
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

