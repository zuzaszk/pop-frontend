<script>
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";
  import { authStore } from "../../stores/authStore";
  import { get } from "svelte/store";

  export let params;

  // const userId = 29; 
  let projectId = null;
  let projectTitle = "Project";
  let elements = [];
  let elementTypes = {
    1: "Logo",
    3: "Source Code",
    4: "Premise",
    5: "Poster",
    6: "Thesis",
    7: "Roadmap",
    8: "Abstract",
  };

  let loading = true;
  let error = "";
  let commentText = {};
  let submittingComment = false;

  let token;
  let userId;

  $: {
    const auth = get(authStore);
    token = auth?.token;
    userId = auth?.user?.userId; 
  }


  onMount(() => {
    projectId = params?.projectId;
    if (projectId) {
      fetchProjectDetails();
    } else {
      error = "Project ID is missing.";
      loading = false;
    }
  });

  async function fetchProjectDetails() {
    try {
      const response = await fetch(
        `http://192.168.0.102:8080/project/basicInfo?projectId=${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        projectTitle = data.title || `Project ${projectId}`;
        elements = data.elements || [];
        elements.forEach((element) => {
          commentText[element.elementId] = "";
        });
      } else {
        error = "Failed to fetch project details.";
      }
    } catch (err) {
      error = `Error: ${err.message}`;
    } finally {
      loading = false;
    }
  }

  function navigateBack() {
    push(`/evaluations/${projectId}`);
  }

  async function submitComment(elementId) {
    const comment = commentText[elementId]?.trim();

    if (!comment) {
      alert("Comment cannot be empty.");
      return;
    }

    submittingComment = true;
    try {
      const response = await fetch(
        `http://192.168.0.102:8080/comments/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: userId, 
            elementId: elementId,
            comment: comment,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          alert("Comment added successfully.");
          commentText[elementId] = "";
        } else {
          alert(result.message || "Failed to add comment.");
        }
      } else {
        alert("Failed to add comment.");
      }
    } catch (err) {
      alert(`Error adding comment: ${err.message}`);
    } finally {
      submittingComment = false;
    }
  }
</script>

<div class="min-h-screen bg-[#F7F9F9] pt-24 px-6">
  {#if loading}
    <div class="flex items-center justify-center h-screen text-gray-500">
      <p>Loading project elements...</p>
    </div>
  {:else if error}
    <div class="flex items-center justify-center h-screen text-red-500">
      <p>{error}</p>
    </div>
  {:else}
   11 <div class="max-w-screen-lg mx-auto bg-white p-6 rounded-lg shadow">
      <div class="flex items-center justify-between mb-6">
        <button
          class="text-[#E74C3C] hover:text-red-600 text-sm"
          on:click={navigateBack}
        >
          ← Back to Evaluation
        </button>
        <h1 class="text-lg font-bold text-gray-700">
          Files for {projectTitle}
        </h1>
      </div>

      {#if elements.length > 0}
        <div class="table-container">
          <table class="w-full border-collapse border border-gray-300 bg-[#ECF0F1] rounded-lg">
            <thead>
              <tr class="bg-[#2C3E50] text-white">
                <th class="p-4 text-left">Type</th>
                <th class="p-4 text-left">Upload Date</th>
                <th class="p-4 text-left">Comment</th>
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
                  <td class="p-4">
                    <textarea
                      bind:value={commentText[element.elementId]}
                      placeholder="Write your comment here..."
                      rows="3"
                      class="w-full text-sm p-2 bg-white text-gray-800 border border-gray-300 rounded focus:ring-2 focus:ring-[#E74C3C] focus:outline-none"
                    ></textarea>
                    <button
                      class="mt-2 px-3 py-1 bg-[#E74C3C] hover:bg-red-600 text-white text-sm rounded transition"
                      on:click={() => submitComment(element.elementId)}
                      disabled={submittingComment}
                    >
                      {submittingComment ? "Submitting..." : "Submit"}
                    </button>
                  </td>
                  <td class="p-4 text-[#E74C3C]">
                    <a
                      href={`http://192.168.0.102:8080/zpi/projectElements/retrieve?projectElementId=${element.elementId}`}
                      target="_blank"
                      class="hover:underline"
                    >
                      Download
                    </a>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {:else}
        <p class="text-center text-gray-500 text-sm">
          No files found for this project.
        </p>
      {/if}
    </div>
  {/if}
</div>

<style>
  body {
    font-family: "Inter", sans-serif;
    background-color: #589bde;
  }

  .table-container {
    width: 100%;
    overflow-x: auto; /* Enable horizontal scrolling */
    margin-bottom: 1rem;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    min-width: 600px; /* Ensure table is scrollable */
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

  textarea:disabled {
    cursor: not-allowed;
    background-color: #f5f5f5;
  }

  button:disabled {
    cursor: not-allowed;
    background-color: #d3d3d3;
  }

  @media (min-width: 1600px) {
    .min-h-screen {
      padding-top: 8rem;
      font-size: 1.1rem;
    }

    .max-w-screen-lg {
      max-width: 1400px;
    }
  }

  @media (max-width: 768px) {
    .table-container {
      padding: 0;
    }

    table {
      min-width: 500px; /* Ensure content is scrollable on smaller devices */
    }

    th, td {
      padding: 0.75rem;
      font-size: 0.875rem; /* Adjust font size for mobile */
    }
  }
</style>
