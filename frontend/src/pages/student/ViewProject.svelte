<script>
  import { onMount } from "svelte";
  import { currentProjectId } from "../../projectStore";

  let projectId = null;
  let project = {};
  let members = [];
  let loading = true;
  let error = "";
  let posterUrl = "";
  let uploadedFiles = [];

  $: currentProjectId.subscribe((value) => {
    projectId = value;
  });

  function getLanguageName(languageCode) {
    return languageCode === 1
      ? "English"
      : languageCode === 2
        ? "Polish"
        : "Unknown";
  }

  async function fetchProjectDetails() {
    if (!projectId) {
      error = "Project ID is missing";
      loading = false;
      return;
    }

    try {
      const response = await fetch(
        `http://192.168.0.102:8080/zpi/project/basicInfo?projectId=${projectId}`
      );
      if (response.ok) {
        const data = await response.json();

        project = data;
        members =
          project.userRole?.filter(
            (member) => member.roles?.roleName === "student"
          ) || [];
        fetchPoster(12);
        await fetchUploadedFiles();
      } else {
        error = "Failed to load project details.";
      }
    } catch (err) {
      error = `Error fetching project details: ${err.message}`;
    } finally {
      loading = false;
    }
  }

  async function fetchPoster(projectElementId) {
    try {
      const response = await fetch(
        `http://192.168.0.102:8080/zpi/projectElements/retrieve?projectElementId=${projectElementId}`
      );
      if (response.ok) {
        posterUrl = response.url;
      } else {
        console.error("Failed to fetch poster image.");
      }
    } catch (err) {
      console.error(`Error fetching poster image: ${err.message}`);
    }
  }

  async function fetchUploadedFiles() {
    try {
      const response = await fetch(
        `http://192.168.0.102:8080/zpi/project/files?projectId=${projectId}`
      );
      if (response.ok) {
        uploadedFiles = await response.json();
      } else {
        console.error("Failed to fetch uploaded files.");
      }
    } catch (err) {
      console.error(`Error fetching uploaded files: ${err.message}`);
    }
  }

  onMount(fetchProjectDetails);
</script>

{#if loading}
  <div class="text-center text-xl text-[#2C3E50]">
    Loading project details...
  </div>
{:else if error}
  <div class="text-center text-xl text-red-600">{error}</div>
{:else}
  <div
    class="zoom-container container mx-auto p-6 bg-white rounded-lg shadow-lg mt-20 max-w-6xl h-[650px] overflow-hidden"
  >
    <div class="h-full overflow-y-auto p-4">
      <div class="flex flex-col lg:flex-row justify-between">
        <div class="lg:w-2/3">
          <h1 class="text-4xl font-bold text-[#2C3E50] mb-4">
            {project.title} ({project.acronym || "N/A"})
          </h1>

          <h2 class="text-xl font-bold text-[#2C3E50] mb-2">
            Project Description
          </h2>
          <p class="text-lg text-[#7F8C8D] mb-6">
            {project.description || "No description available."}
          </p>

          <h3 class="text-lg font-bold text-[#2C3E50] mb-2">
            Technologies Used:
          </h3>
          <p class="text-[#7F8C8D] font-medium mb-6">
            {project.keywords || "Not specified"}
          </p>

          <div class="flex space-x-10 mb-6">
            <div>
              <h3 class="text-lg font-bold text-[#2C3E50]">Language:</h3>
              <p class="text-[#7F8C8D]">{getLanguageName(project.language)}</p>
            </div>
            <div>
              <h3 class="text-lg font-bold text-[#2C3E50]">Year:</h3>
              <p class="text-[#7F8C8D]">{project.year || "Not specified"}</p>
            </div>
          </div>

          <div class="bg-[#ECF0F1] p-4 rounded-lg mb-6">
            <h3 class="text-lg font-bold text-[#2C3E50] mb-4">Team Members</h3>
            <div class="grid grid-cols-2 gap-4">
              {#each members as member}
                <div
                  class="bg-white p-3 border-l-4 border-[#E74C3C] rounded-lg text-[#2C3E50] font-semibold"
                >
                  {member.users.firstName}
                  {member.users.lastName}
                </div>
              {/each}
            </div>
          </div>
        </div>

        <div class="lg:w-1/3 lg:pl-6 flex justify-center lg:justify-end">
          {#if posterUrl}
            <img
              src={posterUrl}
              alt="Project Poster"
              class="rounded-lg shadow-lg w-full lg:w-auto h-auto max-h-[600px]"
            />
          {/if}
        </div>
      </div>

      <div class="mt-10">
        <h2 class="text-2xl font-bold text-[#2C3E50] mb-4">Uploaded Files</h2>
        {#if uploadedFiles.length > 0}
          <ul class="list-disc list-inside text-[#34495E]">
            {#each uploadedFiles as file}
              <li>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-[#E74C3C] underline"
                  >{file.name || "Unnamed File"}</a
                >
              </li>
            {/each}
          </ul>
        {:else}
          <p class="text-gray-600">No files uploaded for this project.</p>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .zoom-container {
    transform: scale(0.85);
    transform-origin: center;
  }

  .container {
    max-width: 1200px;
    height: 700px;
  }

  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }

    h1 {
      font-size: 1.75rem;
    }

    h2,
    h3 {
      font-size: 1.25rem;
    }

    p,
    span {
      font-size: 0.875rem;
    }
  }
</style>
