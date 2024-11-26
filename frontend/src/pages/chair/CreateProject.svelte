<!-- <script>
    import { onMount } from 'svelte';
    import { push } from 'svelte-spa-router';
  
    let projectName = ''; 
    let selectedEdition = ''; 
    let editions = []; 
    let errorMessage = ''; 
    let isSubmitting = false; 
  

    onMount(async () => {
      try {
        const response = await fetch('http://localhost:8080/zpi/editions/listAll');
        if (response.ok) {
          editions = await response.json();
          console.log("Editions data fetched:", editions); 
        } else {
          errorMessage = 'Failed to load editions.';
        }
      } catch (error) {
        console.error('Error fetching editions:', error);
        errorMessage = 'An error occurred while loading editions.';
      }
    });

    async function createProject() {
      console.log('Attempting to create project...'); 
      console.log('Project Name:', projectName); 
      console.log('Selected Edition:', selectedEdition); 
  
    
      if (!projectName || !selectedEdition) {
        errorMessage = 'Please enter a project name and select an edition.';
        return;
      }
  
      isSubmitting = true;
      errorMessage = '';
  
      try {
        const response = await fetch(
          `http://localhost:8080/zpi/project/create?title=${encodeURIComponent(projectName)}&editionId=${selectedEdition}`,
          {
            method: 'POST',
          }
        );
  
        if (response.ok) {
          console.log('Project created successfully!'); 
          push('/dashboard'); 
        } else {
          errorMessage = 'Failed to create project. Please try again.';
        }
      } catch (error) {
        console.error('Error creating project:', error);
        errorMessage = 'An error occurred during project creation.';
      } finally {
        isSubmitting = false;
      }
    }
  </script>
  

  <div class="container mx-auto pt-32 px-4 sm:px-0 flex justify-center items-center min-h-screen">
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full sm:w-3/4 lg:w-1/2">
      <h2 class="text-2xl font-bold text-[#2C3E50] mb-6 text-center">Create a New Project</h2>
  
      {#if errorMessage}
        <p class="text-red-600 mb-4 text-center">{errorMessage}</p>
      {/if}
  
      <div class="space-y-4">
     
        <input
          type="text"
          placeholder="Project Name"
          bind:value={projectName}
          class="w-full p-3 rounded-lg border border-gray-300 text-gray-800 bg-white focus:outline-none focus:border-[#2C3E50]"
        />
  
     
        <select
          bind:value={selectedEdition}
          class="w-full p-3 rounded-lg border border-gray-300 text-gray-800 bg-white focus:outline-none focus:border-[#2C3E50]"
        >
          <option value="" disabled selected>Select Edition</option>
          {#each editions as edition}
            <option value={edition.editionId}>{edition.name}</option>
          {/each}
        </select>
  
 
        <button
          on:click={createProject}
          class="w-full p-3 rounded-lg bg-[#E74C3C] text-white font-semibold hover:bg-[#C0392B] transition duration-300"
          disabled={isSubmitting}
        >
          {#if isSubmitting}
            Creating Project...
          {:else}
            Create Project
          {/if}
        </button>
      </div>
    </div>
  </div>
  
  <style>
   
    .container {
      max-width: 100%;
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
      color: #4A4A4A;
    }
  
    .text-red-600 {
      color: #E74C3C;
    }
  
    .border-gray-300 {
      border-color: #d1d5db;
    }
  
  
    @media (max-width: 640px) {
      .container {
        padding: 2rem;
      }
    }
  </style>
   -->

<!-- <script>
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";
  import { currentProjectId } from "../../projectStore";

  let projectName = "";
  let selectedEdition = "";
  let editions = [];
  let errorMessage = "";
  let isSubmitting = false;

  onMount(async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/zpi/editions/listAll"
      );
      if (response.ok) {
        editions = await response.json();
      } else {
        errorMessage = "Failed to load editions.";
      }
    } catch (error) {
      console.error("Error fetching editions:", error);
      errorMessage = "An error occurred while loading editions.";
    }
  });

  async function createProject() {
    if (!projectName || !selectedEdition) {
      errorMessage = "Please enter a project name and select an edition.";
      return;
    }

    isSubmitting = true;
    errorMessage = "";

    try {
      const response = await fetch(
        `http://localhost:8080/zpi/project/create?title=${encodeURIComponent(projectName)}&editionId=${selectedEdition}`,
        { method: "POST" }
      );

      if (response.ok) {
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          currentProjectId.set(data.projectId);
          push("/my-projects/constant");
        } else if (contentType && contentType.includes("text/plain")) {
          const text = await response.text();
          console.log("Plain text response:", text);
          if (text.includes("Project created successfully")) {
            currentProjectId.set(25);
            push("/my-projects/constant");
          } else {
            errorMessage = "Unexpected response from server: " + text;
          }
        } else {
          errorMessage = "Unexpected content type from server.";
        }
      } else {
        errorMessage = "Failed to create project. Please try again.";
      }
    } catch (error) {
      console.error("Error creating project:", error);
      errorMessage = "An error occurred during project creation.";
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div
  class="container mx-auto pt-32 px-4 sm:px-0 flex justify-center items-center min-h-screen"
>
  <div
    class="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full sm:w-3/4 lg:w-1/2"
  >
    <h2 class="text-2xl font-bold text-[#2C3E50] mb-6 text-center">
      Create a New Project
    </h2>

    {#if errorMessage}
      <p class="text-red-600 mb-4 text-center">{errorMessage}</p>
    {/if}

    <div class="space-y-4">
      <input
        type="text"
        placeholder="Project Name"
        bind:value={projectName}
        class="w-full p-3 rounded-lg border border-gray-300 text-gray-800 bg-white focus:outline-none focus:border-[#2C3E50]"
      />

      <select
        bind:value={selectedEdition}
        class="w-full p-3 rounded-lg border border-gray-300 text-gray-800 bg-white focus:outline-none focus:border-[#2C3E50]"
      >
        <option value="" disabled selected>Select Edition</option>
        {#each editions as edition}
          <option value={edition.editionId}>{edition.name}</option>
        {/each}
      </select>

      <button
        on:click={createProject}
        class="w-full p-3 rounded-lg bg-[#E74C3C] text-white font-semibold hover:bg-[#C0392B] transition duration-300"
        disabled={isSubmitting}
      >
        {#if isSubmitting}
          Creating Project...
        {:else}
          Create Project
        {/if}
      </button>
    </div>
  </div>
</div>

<style>
  .container {
    max-width: 100%;
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
  }
</style> -->
<script>
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";
  import { currentProjectId } from "../../projectStore";

  let projectName = "";
  let selectedEdition = "";
  let editions = [];
  let errorMessage = "";
  let isSubmitting = false;

  onMount(async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/zpi/editions/listAll"
      );
      if (response.ok) {
        editions = await response.json();
      } else {
        errorMessage = "Failed to load editions.";
      }
    } catch (error) {
      console.error("Error fetching editions:", error);
      errorMessage = "An error occurred while loading editions.";
    }
  });

  async function createProject() {
    if (!projectName || !selectedEdition) {
      errorMessage = "Please enter a project name and select an edition.";
      return;
    }

    isSubmitting = true;
    errorMessage = "";

    try {
      const response = await fetch(
        `http://localhost:8080/zpi/project/create?title=${encodeURIComponent(
          projectName
        )}&editionId=${selectedEdition}`,
        { method: "POST" }
      );

      if (response.ok) {
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          currentProjectId.set(data.projectId);
          push("/my-projects/constant");
        } else if (contentType && contentType.includes("text/plain")) {
          const text = await response.text();
          if (text.includes("Project created successfully")) {
            currentProjectId.set(25);
            push("/my-projects/constant");
          } else {
            errorMessage = "Unexpected response from server: " + text;
          }
        } else {
          errorMessage = "Unexpected content type from server.";
        }
      } else {
        errorMessage = "Failed to create project. Please try again.";
      }
    } catch (error) {
      console.error("Error creating project:", error);
      errorMessage = "An error occurred during project creation.";
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
      Create a New Project
    </h2>

    {#if errorMessage}
      <p class="text-red-600 mb-4 text-center">{errorMessage}</p>
    {/if}

    <div class="space-y-6">
      <div>
        <label for="projectName" class="block text-gray-700 font-semibold mb-2">
          Project Name
        </label>
        <input
          id="projectName"
          type="text"
          placeholder="Enter Project Name"
          bind:value={projectName}
          class="w-full p-3 rounded-lg border border-gray-300 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#2C3E50]"
        />
      </div>

      <div>
        <label for="edition" class="block text-gray-700 font-semibold mb-2">
          Select Edition
        </label>
        <select
          id="edition"
          bind:value={selectedEdition}
          class="w-full p-3 rounded-lg border border-gray-300 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#2C3E50]"
        >
          <option value="" disabled selected>Select Edition</option>
          {#each editions as edition}
            <option value={edition.editionId}>{edition.name}</option>
          {/each}
        </select>
      </div>

      <button
        on:click={createProject}
        class="w-full p-3 rounded-lg bg-[#E74C3C] text-white font-semibold hover:bg-[#C0392B] transition duration-300"
        disabled={isSubmitting}
      >
        {#if isSubmitting}
          Creating Project...
        {:else}
          Create Project
        {/if}
      </button>
    </div>
  </div>
</div>

<style>
  .container {
    max-width: 100%;
    transform: scale(0.95);
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
