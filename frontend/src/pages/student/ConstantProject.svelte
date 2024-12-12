<script>
  import { onMount } from "svelte";
  import { currentProjectId } from "../../projectStore";
  import { authStore } from "../../stores/authStore";
  import { get } from "svelte/store";

  let projectId;
  let title = "";
  let edition = "";
  let acronym = "";
  let overview = "";
  let description = "";
  let language = "";
  let keywords = "";
  let errorMessage = "";
  let successMessage = "";
  let teamMembers = [];

  let token;
  $: {
    const auth = get(authStore);
    token = auth?.token || null;
  }

  $: currentProjectId.subscribe((value) => {
    projectId = value;
  });

  onMount(fetchProjectDetails);

  async function fetchProjectDetails() {
    if (!projectId) {
      errorMessage = "Project ID is missing";
      console.error(errorMessage);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/project/basicInfo?projectId=${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        title = data.title || "Untitled Project";
        edition = data.editions ? data.editions.year : "No edition specified";
        overview = data.overview || "";
        acronym = data.acronym || "";
        description = data.description || "";
        language = data.language ? String(data.language) : "";
        keywords = data.keywords || "";

        teamMembers = data.userRole
          .filter((member) => member.roles.roleId === 1)
          .map((student) => ({
            id: student.users.userId,
            name: `${student.users.firstName} ${student.users.lastName}`,
          }));

        console.log("Fetched project data:", data);
        console.log("Team members (students):", teamMembers);
      } else {
        errorMessage = `Failed to load project data (status ${response.status})`;
        console.error(errorMessage);
      }
    } catch (error) {
      console.error("Error loading project data:", error);
      errorMessage = "An error occurred while loading project data.";
    }
  }

  async function saveProject() {
    errorMessage = "";
    successMessage = "";

    const payload = {
      projectId,
      acronym,
      overview,
      description,
      language: parseInt(language),
      keywords,
    };

    console.log("Payload:", payload);

    try {
      const response = await fetch(
        "http://localhost:8080/project/saveBasicInfo",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include token in the request header
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        successMessage = "Project information saved successfully!";
        console.log(successMessage);
      } else {
        errorMessage = `Failed to save project information. Status: ${response.status}`;
        console.error(errorMessage);
      }
    } catch (error) {
      console.error("Error saving project:", error);
      errorMessage = "An error occurred while saving project information.";
    }
  }
</script>

<div class="container bg-white p-6 rounded-lg shadow-md mx-auto">
  <h1 class="text-3xl font-bold text-[#2C3E50] text-center mb-1">{title}</h1>
  <h2 class="text-lg text-gray-500 text-center mb-6">Edition: {edition}</h2>

  {#if errorMessage}
    <p class="text-red-600 text-center mb-4">{errorMessage}</p>
  {/if}
  {#if successMessage}
    <p class="text-green-600 text-center mb-4">{successMessage}</p>
  {/if}

  <div class="space-y-6">
    <div>
      <label class="block text-gray-700 font-semibold mb-2">Acronym</label>
      <input
        type="text"
        bind:value={acronym}
        placeholder="Enter project acronym"
        class="input-field"
      />
    </div>

    <div>
      <label class="block text-gray-700 font-semibold mb-2">Overview</label>
      <textarea
        bind:value={overview}
        placeholder="Enter project overview"
        rows="3"
        class="input-field"
      ></textarea>
    </div>

    <div>
      <label class="block text-gray-700 font-semibold mb-2"
        >Project Description</label
      >
      <textarea
        bind:value={description}
        placeholder="Enter project description"
        rows="4"
        class="input-field"
      ></textarea>
    </div>

    <div>
      <label class="block text-gray-700 font-semibold mb-2"
        >Technologies Used (Keywords)</label
      >
      <input
        type="text"
        bind:value={keywords}
        placeholder="Enter keywords (e.g., Java, Spring Boot)"
        class="input-field"
      />
    </div>

    <div>
      <label class="block text-gray-700 font-semibold mb-2">Language</label>
      <select bind:value={language} class="input-field">
        <option value="" disabled hidden>Select Language</option>
        <option value="1">English</option>
        <option value="2">Polish</option>
      </select>
    </div>
  </div>

  <div class="mt-8">
    <h3 class="text-xl font-semibold text-[#2C3E50] mb-4">Team Members</h3>
    <ul>
      {#each teamMembers as member}
        <li class="text-gray-700 mb-2">- {member.name}</li>
      {/each}
    </ul>
  </div>

  <div class="text-center mt-8">
    <button on:click={saveProject} class="submit-button"> Save Changes </button>
  </div>
</div>

<style>
  img {
    display: block;
    margin: auto;
  }

  .container {
    max-width: 80%;
    padding: 1.5rem;
    margin-top: 120px;
    margin-bottom: 20px;
  }

  .input-field {
    width: 100%;
    padding: 0.75rem;
    border-radius: 0.375rem;
    border: 1px solid #d1d5db;
    font-size: 1rem;
    background-color: #ffffff;
    color: #374151;
  }

  .input-field::placeholder {
    color: #7f8c8d;
  }

  .submit-button {
    width: 100%;
    padding: 0.75rem;
    background-color: #e74c3c;
    color: #ffffff;
    border-radius: 0.375rem;
    font-weight: bold;
  }

  select:invalid {
    color: #6b7280;
  }

  option {
    color: #374151;
  }

  @media (min-width: 1600px) {
    .container {
      max-width: 60%;
      margin-top: 150px;
    }

    .submit-button {
      font-size: 1.125rem;
      padding: 1rem;
    }
  }

  @media (max-width: 640px) {
    .container {
      max-width: 95%;
      padding: 1rem;
      margin-top: 90px;
    }
  }
</style>
