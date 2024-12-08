<script>
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";
  import { authStore } from "../../stores/authStore";
  import { get } from "svelte/store";

  let editionName = "";
  let year = "";
  let semester = "";
  let isActive = false;
  let errorMessage = "";
  let isSubmitting = false;

  const { token } = get(authStore);


  async function createEdition() {
    if (!editionName || !year || !semester) {
      errorMessage = "Please fill in all the fields.";
      return;
    }

    isSubmitting = true;
    errorMessage = "";

    try {
      const response = await fetch("http://192.168.0.102:8080/edition/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({
          name: editionName,
          year: parseInt(year),
          semester: parseInt(semester),
          isActive: isActive,
        }),
      });

      if (response.ok) {
        push("/dashboard");
      } else {
        errorMessage = "Failed to create edition. Please try again.";
      }
    } catch (error) {
      errorMessage = "An error occurred during edition creation.";
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div
  class="container mx-auto pt-32 px-4 sm:px-0 flex justify-center items-center min-h-screen"
>
  <div
    class="bg-white p-10 rounded-lg shadow-lg max-w-xl w-full sm:w-3/4 lg:w-2/3 xl:w-1/2"
  >
    <h2 class="text-2xl font-bold text-[#2C3E50] mb-6 text-center">
      Create a New Edition
    </h2>

    {#if errorMessage}
      <p class="text-red-600 mb-4 text-center">{errorMessage}</p>
    {/if}

    <div class="space-y-6">
      <div>
        <label for="editionName" class="block text-gray-700 font-semibold mb-2">
          Edition Name
        </label>
        <input
          id="editionName"
          type="text"
          placeholder="Enter Edition Name"
          bind:value={editionName}
          class="w-full p-3 rounded-lg border border-gray-300 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#2C3E50]"
        />
      </div>

      <div>
        <label for="year" class="block text-gray-700 font-semibold mb-2">
          Year
        </label>
        <input
          id="year"
          type="number"
          placeholder="Enter Year"
          bind:value={year}
          class="w-full p-3 rounded-lg border border-gray-300 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#2C3E50]"
        />
      </div>

      <!-- Semester -->
      <div>
        <label for="semester" class="block text-gray-700 font-semibold mb-2">
          Semester
        </label>
        <select
          id="semester"
          bind:value={semester}
          class="w-full p-3 rounded-lg border border-gray-300 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#2C3E50]"
        >
          <option value="" disabled selected>Select Semester</option>
          <option value="1">Fall</option>
          <option value="2">Spring</option>
        </select>
      </div>

      <div>
        <label class="flex items-center space-x-3">
          <input
            type="checkbox"
            bind:checked={isActive}
            class="rounded text-[#E74C3C] focus:ring-2 focus:ring-[#E74C3C]"
          />
          <span class="text-gray-700">Mark as Active</span>
        </label>
      </div>

      <button
        on:click={createEdition}
        class="w-full p-3 rounded-lg bg-[#E74C3C] text-white font-semibold hover:bg-[#C0392B] transition duration-300"
        disabled={isSubmitting}
      >
        {#if isSubmitting}
          Creating Edition...
        {:else}
          Create Edition
        {/if}
      </button>
    </div>
  </div>
</div>

<style>
  .container {
    transform: scale(0.9);
  }

  .bg-white {
    background-color: #ffffff;
  }

  .rounded-lg {
    border-radius: 0.5rem;
  }

  .shadow-lg {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  .text-gray-800 {
    color: #4a4a4a;
  }

  .text-red-600 {
    color: #e74c3c;
  }

  .border-gray-300 {
    border-color: #d1d5db;
  }

  @media (max-width: 640px) {
    .container {
      padding: 2rem;
    }

    .rounded-lg {
      border-radius: 0.375rem;
    }
  }

  @media (min-width: 1600px) {
    .container {
      transform: scale(1.1);
    }

    .bg-white {
      padding: 2rem 3rem;
    }

    h2 {
      font-size: 2.5rem;
    }

    input,
    select {
      font-size: 1.1rem;
    }

    button {
      font-size: 1.2rem;
    }
  }
</style>
