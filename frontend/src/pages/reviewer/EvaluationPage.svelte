<!-- <script>
  import { onMount } from "svelte";
  import { loc, push } from "svelte-spa-router";

  let projectId = null;
  let project = {};
  let members = [];
  let selectedRating = 0;
  let evaluationComment = "";
  let submitting = false;
  let loading = true;
  let error = "";
  let notification = "";
  let posterUrl = "";

  const userId = 8;
  const roleId = 3;
  const evaluationRoleId = 1;

  $: loc.subscribe(($loc) => {
    const pathParts = $loc.location.split("/");
    projectId = pathParts[pathParts.length - 1];
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
      error = "Project ID is missing.";
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
        await fetchPoster(12);
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
        notification = "Failed to fetch poster image.";
      }
    } catch (err) {
      notification = `Error fetching poster image: ${err.message}`;
    }
  }

  async function fetchUserRating() {
    try {
      const response = await fetch(
        `http://192.168.0.102:8080/zpi/evaluations/getEvaluation?projectId=${projectId}&userId=${userId}&evaluationRoleId=${evaluationRoleId}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          return data.data;
        }
      }
      return null;
    } catch (err) {
      notification = `Error fetching user rating: ${err.message}`;
      return null;
    }
  }

  async function submitEvaluation() {
    if (!evaluationComment.trim()) {
      notification = "Please provide a comment for your evaluation.";
      return;
    }

    const existingRating = await fetchUserRating();
    if (existingRating) {
      notification = "You have already graded this project.";
      return;
    }

    submitting = true;
    try {
      const response = await fetch(
        `http://192.168.0.102:8080/zpi/evaluations/add`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId: projectId,
            userId: userId,
            evaluationRoleId,
            score: selectedRating,
            comment: evaluationComment,
            isPublic: 1,
          }),
        }
      );

      const responseData = await response.json();
      if (response.ok && responseData.success) {
        notification = "Evaluation submitted successfully.";
        evaluationComment = "";
        selectedRating = 0;
        await fetchProjectDetails();
      } else if (!responseData.success && responseData.message) {
        notification = responseData.message;
      } else {
        notification = "Failed to submit evaluation.";
      }
    } catch (err) {
      notification = `Error submitting evaluation: ${err.message}`;
    } finally {
      submitting = false;
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
    class="container mx-auto p-6 bg-white rounded-lg shadow-lg mt-20 max-w-6xl"
  >
    {#if notification}
      <div class="bg-yellow-100 text-yellow-800 p-4 rounded-md mb-4">
        {notification}
      </div>
    {/if}

    <div>
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

      <div class="bg-[#F5F5F5] p-6 rounded-lg shadow-inner mt-10">
        <h2 class="text-2xl font-bold text-[#2C3E50] mb-4">
          Provide Your Evaluation
        </h2>

        <div class="flex items-center mb-6">
          <p class="mr-4 font-semibold text-[#2C3E50]">Score:</p>
          {#each [1, 2, 3, 4, 5] as star}
            <span
              on:click={() => (selectedRating = star)}
              class="cursor-pointer mx-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={star <= selectedRating ? "#F59E0B" : "#D1D5DB"}
                class="w-8 h-8"
              >
                <path
                  d="M12 17.75l-5.45 3.6 1.95-6.22-5.5-4h6.78L12 4.5l1.72 6.64h6.78l-5.5 4 1.95 6.22z"
                />
              </svg>
            </span>
          {/each}
        </div>

        <textarea
          bind:value={evaluationComment}
          rows="4"
          placeholder="Write your feedback here..."
          class="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E74C3C] text-[#2C3E50] placeholder-gray-400 bg-white resize-none mb-4"
        ></textarea>

        <button
          on:click={submitEvaluation}
          class="bg-[#E74C3C] text-white py-2 px-6 rounded-md font-semibold hover:bg-[#C0392B] transition duration-200"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit Evaluation"}
        </button>
        <button
          on:click={() => push(`/files/${projectId}`)}
          class="bg-[#E74C3E] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#C0392B] mt-4"
        >
          View Files Uploaded
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .container {
    max-width: 1200px;
    transform: scale(0.9);
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

  @media (min-width: 1600px) {
    .container {
      max-width: 80%;
      padding: 2rem;
    }

    h1 {
      font-size: 2.5rem;
    }

    h2,
    h3 {
      font-size: 1.75rem;
    }

    p,
    span {
      font-size: 1rem;
    }
  }
</style> -->

<script>
  import { onMount } from "svelte";
  import { loc, push } from "svelte-spa-router";

  let projectId = null;
  let project = {};
  let members = [];
  let selectedRating = 0;
  let evaluationComment = "";
  let existingEvaluation = null; 
  let submitting = false;
  let loading = true;
  let error = "";
  let notification = "";
  let posterUrl = "";

  const userId = 8;
  const evaluationRoleId = 1;

  $: loc.subscribe(($loc) => {
    const pathParts = $loc.location.split("/");
    projectId = pathParts[pathParts.length - 1];
  });

  async function fetchProjectDetails() {
    if (!projectId) {
      error = "Project ID is missing.";
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
        await fetchPoster(project.posterElementId);
        await fetchUserRating(); 
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
    if (!projectElementId) return;
    try {
      const response = await fetch(
        `http://192.168.0.102:8080/zpi/projectElements/retrieve?projectElementId=${projectElementId}`
      );
      if (response.ok) {
        posterUrl = response.url;
      } else {
        notification = "Failed to fetch poster image.";
      }
    } catch (err) {
      notification = `Error fetching poster image: ${err.message}`;
    }
  }

  async function fetchUserRating() {
    try {
        const response = await fetch(
            `http://192.168.0.102:8080/zpi/evaluations/getEvaluation?projectId=${projectId}&userId=${userId}&evaluationRoleId=${evaluationRoleId}`
        );

        if (response.ok) {
            const data = await response.json();
            if (data.success && data.data) {
                existingEvaluation = data.data;
                
                if (existingEvaluation.evaluationId) {
                    selectedRating = existingEvaluation.score || 0;
                    evaluationComment = existingEvaluation.comment || "";
                } else {
                    existingEvaluation = null; 
                }
            }
        }
    } catch (err) {
        notification = `Error fetching user evaluation: ${err.message}`;
    }
}

async function submitEvaluation() {
    if (!evaluationComment.trim()) {
        notification = "Please provide a comment for your evaluation.";
        return;
    }

    submitting = true;
    try {
        const apiUrl = "http://192.168.0.102:8080/zpi/evaluations/add";

        const payload = {
            projectId,
            userId,
            evaluationRoleId,
            score: selectedRating,
            comment: evaluationComment,
            isPublic: 1,
        };

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const responseData = await response.json();
        if (response.ok && responseData.success) {
            notification = "Evaluation submitted successfully.";
            await fetchUserRating(); 
        } else {
            notification = responseData.message || "Failed to submit evaluation.";
        }
    } catch (err) {
        notification = `Error submitting evaluation: ${err.message}`;
    } finally {
        submitting = false;
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
    class="container mx-auto p-6 bg-white rounded-lg shadow-lg mt-20 max-w-6xl"
  >
    {#if notification}
      <div class="bg-yellow-100 text-yellow-800 p-4 rounded-md mb-4">
        {notification}
      </div>
    {/if}

    <div>
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

      <div class="bg-[#F5F5F5] p-6 rounded-lg shadow-inner mt-10">
        <h2 class="text-2xl font-bold text-[#2C3E50] mb-4">
          Provide Your Evaluation
        </h2>

        <div class="flex items-center mb-6">
          <p class="mr-4 font-semibold text-[#2C3E50]">Score:</p>
          {#each [1, 2, 3, 4, 5] as star}
            <span
              on:click={() => (selectedRating = star)}
              class="cursor-pointer mx-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={star <= selectedRating ? "#F59E0B" : "#D1D5DB"}
                class="w-8 h-8"
              >
                <path
                  d="M12 17.75l-5.45 3.6 1.95-6.22-5.5-4h6.78L12 4.5l1.72 6.64h6.78l-5.5 4 1.95 6.22z"
                />
              </svg>
            </span>
          {/each}
        </div>

        <textarea
          bind:value={evaluationComment}
          rows="4"
          placeholder="Write your feedback here..."
          class="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E74C3C] text-[#2C3E50] placeholder-gray-400 bg-white resize-none mb-4"
        ></textarea>

        <button
          on:click={submitEvaluation}
          class="bg-[#E74C3C] text-white py-2 px-6 rounded-md font-semibold hover:bg-[#C0392B] transition duration-200"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit Evaluation"}
        </button>
        <button
          on:click={() => push(`/files/${projectId}`)}
          class="bg-[#E74C3E] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#C0392B] mt-4"
        >
          View Files Uploaded
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .container {
    max-width: 1200px;
    transform: scale(0.9);
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

  @media (min-width: 1600px) {
    .container {
      max-width: 80%;
      padding: 2rem;
    }

    h1 {
      font-size: 2.5rem;
    }

    h2,
    h3 {
      font-size: 1.75rem;
    }

    p,
    span {
      font-size: 1rem;
    }
  }
</style>
