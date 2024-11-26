<script>
  import { onMount } from "svelte";

  let projects = [];
  let editions = [];
  let selectedEditionId = "";
  let errorMessage = "";
  let loading = false;

  const columnMapping = {
    Reviewer: "AssignedToEvaluate",
    Supervisor: "SupervisorForTheProject",
    Teacher: "GeneralTeachingMember",
    Student: "Student",
    Spectator: "Spectator",
  };

  async function fetchProjects() {
    loading = true;
    errorMessage = "";
    try {
      const url = selectedEditionId
        ? `http://localhost:8080/zpi/statistic/evaluationDetails?editionId=${selectedEditionId}`
        : `http://localhost:8080/zpi/statistic/evaluationDetails`;

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        projects = data.map((project) => ({
          ...project,
          evaluations: project.evaluations || [],
        }));
      } else {
        errorMessage = "Failed to fetch project data.";
      }
    } catch (error) {
      errorMessage = "An error occurred while fetching projects.";
    } finally {
      loading = false;
    }
  }

  async function fetchEditions() {
    try {
      const response = await fetch(
        "http://localhost:8080/zpi/editions/listAll"
      );
      if (response.ok) {
        editions = await response.json();
      } else {
        errorMessage = "Failed to fetch editions.";
      }
    } catch (error) {
      errorMessage = "An error occurred while fetching editions.";
    }
  }

  function getEvaluationDetails(evaluations, roleKey) {
    const evaluation = evaluations.find(
      (evaluation) => evaluation.evaluationRole === roleKey
    );
    if (evaluation) {
      return {
        score: evaluation.averageScore.toFixed(2),
        count: evaluation.evaluationCount,
      };
    }
    return { score: "N/A", count: 0 };
  }

  function renderStars(score) {
    if (score === "N/A") return "N/A";

    const fullStars = Math.floor(score);
    const halfStar = score % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push("full");
    }
    if (halfStar) {
      stars.push("half");
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push("empty");
    }

    return stars;
  }

  function handleEditionChange(event) {
    event.preventDefault();
    fetchProjects();
  }

  onMount(() => {
    fetchEditions();
    fetchProjects();
  });
</script>

<div class="container mx-auto p-6 pt-40 min-h-screen">
  <h1 class="text-3xl font-extrabold text-[#2C3E50] mb-10 text-center">
    Evaluation Score Details
  </h1>

  <div class="flex justify-between items-center mb-6">
    <label
      for="edition-select"
      class="block text-lg font-medium text-[#2C3E50]"
    >
      Filter by Edition:
    </label>
    <select
      id="edition-select"
      bind:value={selectedEditionId}
      on:change={handleEditionChange}
      class="block p-2 border border-gray-300 rounded-lg bg-gray-100 text-[#2C3E50] focus:outline-none focus:ring focus:ring-[#E74C3C]"
    >
      <option value="">All Editions</option>
      {#each editions as edition}
        <option value={edition.editionId}>{edition.name}</option>
      {/each}
    </select>
  </div>

  {#if loading}
    <p class="text-center text-gray-500">Loading...</p>
  {:else if errorMessage}
    <p class="text-center text-red-500">{errorMessage}</p>
  {:else if projects.length === 0}
    <p class="text-center text-gray-500">No projects available.</p>
  {:else}
    <div class="overflow-x-auto">
      <table
        class="table-auto w-full bg-white shadow-md rounded-lg overflow-hidden text-sm"
      >
        <thead class="bg-[#E74C3C] text-white">
          <tr>
            <th class="p-3 text-left">Project Name</th>
            {#each Object.keys(columnMapping) as role}
              <th class="p-3 text-left">{role}</th>
            {/each}
            <th class="p-3 text-left">Overall</th>
          </tr>
        </thead>
        <tbody>
          {#each projects as project}
            <tr class="border-b hover:bg-gray-50">
              <td class="p-3 text-[#2C3E50] font-medium">
                {project.projectName || "Unnamed Project"}
              </td>
              {#each Object.keys(columnMapping) as role}
                <td class="p-3 text-[#2C3E50]">
                  {#if project.evaluations.length > 0}
                    <div>
                      <span class="font-bold">
                        {getEvaluationDetails(
                          project.evaluations,
                          columnMapping[role]
                        ).score}
                      </span>
                      <span class="text-xs text-gray-500">
                        ({getEvaluationDetails(
                          project.evaluations,
                          columnMapping[role]
                        ).count} Reviews)
                      </span>
                    </div>
                  {:else}
                    N/A
                  {/if}
                </td>
              {/each}
              <td class="p-3 text-[#2C3E50]">
                {#if project.finalWeightedScore !== undefined}
                  <div class="flex flex-col">
                    <span class="text-sm font-bold">
                      {project.finalWeightedScore.toFixed(2)}
                    </span>
                    <div class="flex items-center space-x-1 mt-1">
                      {#each renderStars(project.finalWeightedScore.toFixed(2)) as star}
                        {#if star === "full"}
                          <svg
                            class="w-4 h-4 text-yellow-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.956a1 1 0 00.95.69h4.188c.969 0 1.371 1.24.588 1.81l-3.393 2.462a1 1 0 00-.364 1.118l1.287 3.956c.3.921-.755 1.688-1.539 1.118l-3.393-2.462a1 1 0 00-1.176 0l-3.393 2.462c-.784.57-1.838-.197-1.539-1.118l1.287-3.956a1 1 0 00-.364-1.118L2.171 9.383c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 00.95-.69l1.286-3.956z"
                            />
                          </svg>
                        {:else if star === "half"}
                          <svg
                            class="w-4 h-4 text-yellow-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <defs>
                              <linearGradient id="half-star">
                                <stop offset="50%" stop-color="currentColor" />
                                <stop offset="50%" stop-color="transparent" />
                              </linearGradient>
                            </defs>
                            <path
                              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.956a1 1 0 00.95.69h4.188c.969 0 1.371 1.24.588 1.81l-3.393 2.462a1 1 0 00-.364 1.118l1.287 3.956c.3.921-.755 1.688-1.539 1.118l-3.393-2.462a1 1 0 00-1.176 0l-3.393 2.462c-.784.57-1.838-.197-1.539-1.118l1.287-3.956a1 1 0 00-.364-1.118L2.171 9.383c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 00.95-.69l1.286-3.956z"
                              fill="url(#half-star)"
                            />
                          </svg>
                        {:else}
                          <svg
                            class="w-4 h-4 text-gray-300"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.956a1 1 0 00.95.69h4.188c.969 0 1.371 1.24.588 1.81l-3.393 2.462a1 1 0 00-.364 1.118l1.287 3.956c.3.921-.755 1.688-1.539 1.118l-3.393-2.462a1 1 0 00-1.176 0l-3.393 2.462c-.784.57-1.838-.197-1.539-1.118l1.287-3.956a1 1 0 00-.364-1.118L2.171 9.383c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 00.95-.69l1.286-3.956z"
                            />
                          </svg>
                        {/if}
                      {/each}
                    </div>
                  </div>
                {:else}
                  N/A
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
    min-height: 100vh;
    padding-top: 80px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    overflow: hidden;
  }

  thead th {
    padding: 10px;
    font-size: 0.9rem;
    text-align: left;
    font-weight: bold;
    background-color: #e74c3c;
    color: #fff;
  }

  tbody td {
    padding: 8px;
    font-size: 0.85rem;
  }

  tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  tr:hover {
    background-color: #f2f2f2;
  }

  @media (min-width: 1600px) {
    .container {
      max-width: 1600px;
    }

    thead th {
      padding: 12px;
      font-size: 1rem;
    }

    tbody td {
      padding: 10px;
      font-size: 0.9rem;
    }
  }
</style>
