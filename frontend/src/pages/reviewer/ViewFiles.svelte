<!-- <script>
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";

  export let params;

  const userId = 29;
  let projectId = null;
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

  onMount(() => {
    projectId = params?.projectId;
    if (projectId) {
      fetchProjectElements();
    } else {
      error = "Project ID is missing.";
      loading = false;
    }
  });

  async function fetchProjectElements() {
    try {
      const response = await fetch(
        `http://localhost:8080/zpi/project/basicInfo?projectId=${projectId}`
      );
      if (response.ok) {
        const data = await response.json();
        elements = data.elements || [];
        elements.forEach((element) => {
          commentText[element.elementId] = "";
        });
      } else {
        error = "Failed to fetch project elements.";
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
        `http://localhost:8080/zpi/comments/add`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
    <div class="max-w-screen-lg mx-auto bg-white p-6 rounded-lg shadow">
      <div class="flex items-center justify-between mb-6">
        <button
          class="text-[#E74C3C] hover:text-red-600 text-sm"
          on:click={navigateBack}
        >
          ← Back to Evaluation
        </button>
        <h1 class="text-lg font-bold text-gray-700">
          Files for Project {projectId}
        </h1>
      </div>

      {#if elements.length > 0}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {#each elements as element}
            <div
              class="bg-gray-100 border border-gray-300 p-4 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <div class="mb-2">
                <h3 class="text-sm font-medium text-gray-800">
                  {elementTypes[element.elementTypeId] || "Unknown"}
                </h3>
                <span class="text-xs text-gray-500">
                  {new Date(element.createdAt).toLocaleString()}
                </span>
              </div>

              <p class="text-xs text-gray-600 truncate mb-2">
                {element.vfilePath.split("/").pop()}
              </p>
              <a
                href={`http://localhost:8080/zpi/projectElements/retrieve?projectElementId=${element.elementId}`}
                target="_blank"
                download
                class="block mb-4 text-sm text-gray-600 hover:text-gray-800 font-medium"
              >
                Download File
              </a>

              <textarea
                bind:value={commentText[element.elementId]}
                placeholder="Write your comment here..."
                rows="3"
                class="w-full text-sm p-2 bg-white text-gray-800 border border-gray-300 rounded focus:ring-2 focus:ring-[#E74C3C] focus:outline-none"
              ></textarea>
              <button
                class="mt-3 px-3 py-1 bg-[#E74C3C] hover:bg-red-600 text-white text-sm rounded transition"
                on:click={() => submitComment(element.elementId)}
                disabled={submittingComment}
              >
                {submittingComment ? "Submitting..." : "Submit"}
              </button>
            </div>
          {/each}
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

    h1 {
      font-size: 1.5rem;
    }

    .grid {
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
    }

    .p-4 {
      padding: 1.5rem;
    }
  }
</style> -->

<script>
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";

  export let params;

  const userId = 29;
  let projectId = null;
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

  onMount(() => {
    projectId = params?.projectId;
    if (projectId) {
      fetchProjectElements();
    } else {
      error = "Project ID is missing.";
      loading = false;
    }
  });

  async function fetchProjectElements() {
    try {
      const response = await fetch(
        `http://localhost:8080/zpi/project/basicInfo?projectId=${projectId}`
      );
      if (response.ok) {
        const data = await response.json();
        elements = data.elements || [];
        elements.forEach((element) => {
          commentText[element.elementId] = "";
        });
      } else {
        error = "Failed to fetch project elements.";
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
        `http://localhost:8080/zpi/comments/add`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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

---

### HTML Layout and Styling

```svelte
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
    <div class="max-w-screen-lg mx-auto bg-white p-6 rounded-lg shadow">
      <div class="flex items-center justify-between mb-6">
        <button
          class="text-[#E74C3C] hover:text-red-600 text-sm"
          on:click={navigateBack}
        >
          ← Back to Evaluation
        </button>
        <h1 class="text-lg font-bold text-gray-700">
          Files for Project {projectId}
        </h1>
      </div>

      {#if elements.length > 0}
        <div class="space-y-6">
          {#each elements as element}
            <div class="flex items-center gap-6 bg-gray-50 border border-gray-300 p-4 rounded-lg shadow-sm">
              <!-- File Details -->
              <div class="flex-1">
                <h3 class="text-sm font-medium text-gray-800">
                  {elementTypes[element.elementTypeId] || "Unknown"}
                </h3>
                <p class="text-xs text-gray-500">
                  {new Date(element.createdAt).toLocaleString()}
                </p>
                <a
                  href={`http://localhost:8080/zpi/projectElements/retrieve?projectElementId=${element.elementId}`}
                  target="_blank"
                  download
                  class="block mt-2 text-sm text-[#E74C3C] hover:underline"
                >
                  Download File
                </a>
              </div>

              <!-- Comment Section -->
              <div class="flex-1 flex flex-col">
                <textarea
                  bind:value={commentText[element.elementId]}
                  placeholder="Write your comment here..."
                  rows="3"
                  class="w-full text-sm p-2 bg-white text-gray-800 border border-gray-300 rounded focus:ring-2 focus:ring-[#E74C3C] focus:outline-none"
                ></textarea>
                <button
                  class="mt-3 px-3 py-1 bg-[#E74C3C] hover:bg-red-600 text-white text-sm rounded transition"
                  on:click={() => submitComment(element.elementId)}
                  disabled={submittingComment}
                >
                  {submittingComment ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          {/each}
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

    .space-y-6 {
      gap: 2rem;
    }
  }
</style>
