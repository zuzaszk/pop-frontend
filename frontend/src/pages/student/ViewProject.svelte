<script>
  import { onMount } from "svelte";
  import { currentProjectId } from "../../projectStore";
  import { authStore } from "../../stores/authStore";
  import { get } from "svelte/store"; 

  let projectId = null;
  let project = {};
  let members = [];
  let elements = [];
  let posterUrl = "";
  let loading = true;
  let error = "";

  const elementTypes = {
    1: "Logo",
    3: "Source Code",
    4: "Premise",
    5: "Poster",
    6: "Thesis",
    7: "Roadmap",
    8: "Abstract",
  };

  const elementIcons = {
    1: "../../icons/logo2.png",
    3: "../../icons/sourceCode.png",
    4: "../../icons/premise.png",
    5: "../../icons/poster.png",
    6: "../../icons/thesis.png",
    7: "../../icons/roadmap.png",
    8: "../../icons/abstract.png",
  };

  let token;

  $: {
    projectId = get(currentProjectId);
    const auth = get(authStore);
    token = auth?.token || null; 
  }

  function getLanguageName(languageCode) {
    return languageCode === 1
      ? "English"
      : languageCode === 2
      ? "Polish"
      : "Unknown";
  }

  async function fetchComments(elementId) {
    try {
      const response = await fetch(
        `http://192.168.0.102:8080/comments/getByElementId?elementId=${elementId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );
      if (response.ok) {
        const jsonData = await response.json();
        if (jsonData.success) {
          return jsonData.data;
        } else {
          console.error(`Failed to fetch comments: ${jsonData.message}`);
          return [];
        }
      } else {
        console.error(`HTTP Error for elementId ${elementId}: ${response.status}`);
        return [];
      }
    } catch (err) {
      console.error(`Error fetching comments for elementId ${elementId}: ${err.message}`);
      return [];
    }
  }


  async function previewFile(elementId) {
  try {
    const response = await fetch(
      `http://192.168.0.102:8080/projectElements/retrieve?projectElementId=${elementId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.redirected) {
      throw new Error("Unauthorized or session expired. Please log in again.");
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    const blob = await response.blob();
    const fileUrl = window.URL.createObjectURL(blob);

    // Open file in a new tab
    window.open(fileUrl, "_blank");
  } catch (error) {
    console.error("Error previewing file:", error);
    alert(error.message);
  }
}




  async function fetchProjectDetails() {
  if (!projectId) {
    error = "Project ID is missing.";
    loading = false;
    return;
  }

  try {
  
    const response = await fetch(
      `http://192.168.0.102:8080/project/basicInfo?projectId=${projectId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to load project details: ${response.statusText}`);
    }

    const data = await response.json();
    project = data;

    
    members =
      project.userRole?.filter(
        (member) => member.roles?.roleName === "student"
      ) || [];
    elements = project.elements || [];

 
    for (const element of elements) {
      element.comments = await fetchComments(element.elementId);
    }

  
    const posterElement = elements.find((el) => el.elementTypeId === 5);
    if (posterElement) {
      posterUrl = await fetchPosterUrl(posterElement.elementId);
    }
  } catch (err) {
    console.error(err);
    error = `Error fetching project details: ${err.message}`;
  } finally {
    loading = false;
  }
}



async function fetchPosterUrl(elementId) {
  try {
    const response = await fetch(
      `http://192.168.0.102:8080/projectElements/retrieve?projectElementId=${elementId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );

    if (response.redirected) {
      console.error("Poster request was redirected to:", response.url);
      throw new Error("Unauthorized or session expired. Please log in again.");
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch poster URL: ${response.statusText}`);
    }

    const blob = await response.blob(); // Convert to blob
    return URL.createObjectURL(blob); // Create object URL for the blob
  } catch (error) {
    console.error("Error fetching poster URL:", error);
    return "";
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
  <div class="container mx-auto p-6 bg-white rounded-lg shadow-lg mt-20 max-w-6xl">
    <div class="p-4">
      <div class="flex flex-col lg:flex-row justify-between">
        <div class="lg:w-2/3">
          <h1 class="text-4xl font-bold text-[#2C3E50] mb-4">
            {project.title} ({project.acronym || "N/A"})
          </h1>

          <h2 class="text-xl font-bold text-[#2C3E50] mb-2">Overview</h2>
          <p class="text-lg text-[#7F8C8D] mb-6">
            {project.overview || "No overview available."}
          </p>

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
        {#if elements.length > 0}
          <div class="table-container">
            <table class="w-full border-collapse border border-gray-300 bg-[#ECF0F1] rounded-lg">
              <thead>
                <tr class="bg-[#2C3E50] text-white">
                  <th class="p-4 text-left">Type</th>
                  <th class="p-4 text-left">Upload Date</th>
                  <th class="p-4 text-left">Comments</th>
                  <th class="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {#each elements as element}
                  <tr class="border-b border-gray-300">
                    <td class="p-4 text-[#2C3E50]">
                      {elementTypes[element.elementTypeId] || "Unknown"}
                    </td>
                    <td class="p-4 text-[#7F8C8D]">
                      {new Date(element.createdAt).toLocaleString()}
                    </td>
                    <td class="p-4 text-[#7F8C8D]">
                      {#if element.comments.length > 0}
                        <ul class="list-disc pl-4">
                          {#each element.comments as comment}
                            <li>{comment.comment}</li>
                          {/each}
                        </ul>
                      {:else}
                        <p>No comments available.</p>
                      {/if}
                    </td>
                    <td class="p-4 text-[#E74C3C]">
                      <button
                        class="hover:underline text-[#E74C3C] font-bold"
                        on:click={() => previewFile(element.elementId)}
                      >
                        Preview
                      </button>
                    </td>
                    
                    
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {:else}
          <p class="text-center text-gray-500 text-sm">
            No files uploaded for this project.
          </p>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  
  .table-container {
    width: 100%;
    overflow-x: auto; /* Enable horizontal scrolling */
    margin-bottom: 1rem;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    min-width: 600px; /* Ensure the table is scrollable */
  }

  th, td {
    padding: 1rem;
    text-align: left;
  }

  th {
    background-color: #2C3E50;
    color: white;
  }

  td {
    background-color: #ffffff;
    color: #2C3E50;
  }

  tr:nth-child(even) td {
    background-color: #F9FAFB;
  }

  @media (min-width: 1600px) {
    .container {
      max-width: 1400px;
    }

    .title {
      font-size: 2rem;
    }
  }

  @media (max-width: 768px) {
    .table-container {
      padding: 1rem;
    }

    th, td {
      padding: 0.75rem;
      font-size: 0.875rem; /* Smaller font size for smaller screens */
    }

    table {
      min-width: 500px; /* Adjust minimum width for smaller devices */
    }
  }
</style>
