<script>
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";
  import Pagination from "../../components/Pagination.svelte";
  import { authStore } from "../../stores/authStore";
  import { get } from "svelte/store";

  // const userId = 8;
  // const evaluationRoleId = 1;

  let evaluations = [];
  let editions = [];
  let filteredEvaluations = [];
  let selectedEditionId = "";
  let selectedStatus = "";
  let errorMessage = "";
  let currentPage = 1;
  let totalPages = 1;
  let projectsPerPage = 4; 

  let token;
  let userId;


  // Fetch token and user details
  $: {
    const auth = get(authStore);
    token = auth?.token;
    userId = auth?.user?.userId;
  }


  function mapState(evaluationState) {
    if (evaluationState === 1) return "pending";
    if (evaluationState === 2) return "completed";
    return "unknown";
  }

  function calculateProjectsPerPage() {
    if (window.innerWidth >= 1600) {
      projectsPerPage = 6;
    } else {
      projectsPerPage = 4;
    }
    filterAndPaginateEvaluations(); 
  }

  async function fetchEvaluations() {
    try {
      const url = `https://269593.kieg.science/api/evaluations/assignedEvaluateList?userId=${userId}${
        selectedEditionId ? `&editionId=${selectedEditionId}` : ""
      }`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();

        evaluations = data.map((project) => {
          const teamMembers =
            project.userRole?.map(
              (role) => `${role.users.firstName} ${role.users.lastName}`
            ) || [];
          const projectState = mapState(project.evaluations[0]?.state || 0);

          return {
            id: project.projectId,
            title: project.title,
            teamMembers,
            status: projectState,
          };
        });

        filterAndPaginateEvaluations();
      } else {
        errorMessage = "Failed to load assigned projects for evaluation.";
      }
    } catch (err) {
      errorMessage = "An error occurred while loading projects.";
    }
  }

  function filterAndPaginateEvaluations() {
    let filtered = evaluations;
    if (selectedStatus) {
      filtered = evaluations.filter(
        (project) => project.status === selectedStatus
      );
    }

    totalPages = Math.ceil(filtered.length / projectsPerPage);
    const startIndex = (currentPage - 1) * projectsPerPage;
    const endIndex = startIndex + projectsPerPage;
    filteredEvaluations = filtered.slice(startIndex, endIndex);
  }

  async function fetchEditions() {
    try {
      const response = await fetch("https://269593.kieg.science/api/editions/listAll", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        editions = await response.json();
      } else {
        errorMessage = "Failed to load editions.";
      }
    } catch (err) {
      errorMessage = "An error occurred while loading editions.";
    }
  }

  function handleEditionChange() {
    currentPage = 1;
    fetchEvaluations();
  }

  function handleStatusChange() {
    currentPage = 1;
    fetchEvaluations();
  }

  function goToEvaluationPage(projectId) {
    push(`/evaluations/${projectId}`);
  }

  function handlePageChange(pageNumber) {
    currentPage = pageNumber;
    filterAndPaginateEvaluations();
  }

  onMount(() => {
    fetchEditions();
    fetchEvaluations();

   
    calculateProjectsPerPage();

    
    window.addEventListener("resize", calculateProjectsPerPage);

    return () => {
      window.removeEventListener("resize", calculateProjectsPerPage);
    };
  });
</script>

<div class="container mx-auto py-16 px-6 zoom-out-75 flex flex-col min-h-screen">
  <h1 class="text-2xl font-semibold text-center mb-8 text-[#2C3E50]">
    Assigned Projects for Evaluation
  </h1>

  <div class="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
    <select
      bind:value={selectedEditionId}
      on:change={handleEditionChange}
      class="bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700"
    >
      <option value="">All Editions</option>
      {#each editions as edition}
        <option value={edition.editionId}>
          {edition.name ||
            `Edition ${edition.year} - Semester ${edition.semester}`}
        </option>
      {/each}
    </select>

    <select
      bind:value={selectedStatus}
      on:change={handleStatusChange}
      class="bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700"
    >
      <option value="">All Statuses</option>
      <option value="pending">Pending</option>
      <option value="completed">Completed</option>
    </select>
  </div>

  {#if errorMessage}
    <div class="text-center text-red-500 mb-4">{errorMessage}</div>
  {/if}

  <div class="flex-grow">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      {#each filteredEvaluations as evaluation}
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold text-[#2C3E50]">
              {evaluation.title}
            </h2>
            {#if evaluation.status === "pending"}
              <span
                class="bg-red-500 text-white text-sm font-semibold px-2 py-1 rounded"
                >Pending Evaluation</span
              >
            {:else}
              <span
                class="bg-green-500 text-white text-sm font-semibold px-2 py-1 rounded"
                >Completed</span
              >
            {/if}
          </div>
          <p class="text-gray-600 mb-4">
            <strong>Team Members:</strong>
            {evaluation.teamMembers.length > 0
              ? evaluation.teamMembers.join(", ")
              : "No team members available"}
          </p>
          {#if evaluation.status === "pending"}
            <button
              on:click={() => goToEvaluationPage(evaluation.id)}
              class="bg-[#E74C3C] text-white py-2 px-4 rounded-md hover:bg-red-600 font-semibold"
            >
              Evaluate
            </button>
          {:else}
            <button
              class="bg-gray-300 text-gray-600 py-2 px-4 rounded-md font-semibold"
              disabled>Evaluated</button
            >
            <a
              href={`#/evaluations/${evaluation.id}`}
              class="text-sm text-red-500 underline hover:text-gray-700 mt-2 inline-block"
            >
              View Evaluation
            </a>
          {/if}
        </div>
      {/each}
    </div>
  </div>

  <Pagination
    {currentPage}
    {totalPages}
    on:pageChange={(e) => handlePageChange(e.detail)}
    class="mt-auto"
  />
</div>

<style>
  .container {
    max-width: 1200px;
    padding-top: 100px;
    transform: scale(0.85);
    transform-origin: center top;
  }

  .zoom-out-75 {
    margin-top: 50px;
  }

  select {
    width: auto;
    min-width: 200px;
    max-width: 300px;
  }

  .min-h-screen {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .mt-auto {
    margin-top: auto;
  }

  @media (min-width: 1600px) {
    .container {
      max-width: 2200px;
    }
  }
</style>
