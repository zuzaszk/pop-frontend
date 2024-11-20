<!-- <script>
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";

  const userId = 8;
  const evaluationRoleId = 1;

  let evaluations = [];
  let editions = [];
  let selectedEditionId = "";
  let selectedStatus = "";
  let errorMessage = "";

  function mapState(evaluationState) {
    if (evaluationState === 1) return "pending";
    if (evaluationState === 2) return "completed";
    return "unknown";
  }

  async function fetchEvaluations() {
    try {
      const url =
        `http://192.168.0.102:8080/zpi/evaluations/assignedEvaluateList?userId=${userId}&evaluationRoleId=${evaluationRoleId}` +
        (selectedEditionId ? `&editionId=${selectedEditionId}` : "");
      const response = await fetch(url);

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

        if (selectedStatus) {
          evaluations = evaluations.filter(
            (project) => project.status === selectedStatus
          );
        }
      } else {
        errorMessage = "Failed to load assigned projects for evaluation.";
      }
    } catch (err) {
      errorMessage = "An error occurred while loading projects.";
    }
  }

  async function fetchEditions() {
    try {
      const response = await fetch(
        "http://192.168.0.102:8080/zpi/editions/listAll"
      );
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
    fetchEvaluations();
  }

  function handleStatusChange() {
    fetchEvaluations();
  }

  function goToEvaluationPage(projectId) {
    push(`/evaluations/${projectId}`);
  }

  onMount(async () => {
    await fetchEditions();
    await fetchEvaluations();
  });
</script>

<div class="container mx-auto py-16 px-6 zoom-out-75">
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

  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    {#each evaluations as evaluation}
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
          >
        {/if}
      </div>
    {/each}
  </div>
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
</style> -->
<!-- <script>
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";

  const userId = 8;
  const evaluationRoleId = 1;

  let evaluations = [];
  let editions = [];
  let selectedEditionId = "";
  let selectedStatus = "";
  let errorMessage = "";

  function mapState(evaluationState) {
    if (evaluationState === 1) return "pending";
    if (evaluationState === 2) return "completed";
    return "unknown";
  }

  async function fetchEvaluations() {
    try {
      const url =
        `http://192.168.0.102:8080/zpi/evaluations/assignedEvaluateList?userId=${userId}&evaluationRoleId=${evaluationRoleId}` +
        (selectedEditionId ? `&editionId=${selectedEditionId}` : "");
      const response = await fetch(url);

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

        if (selectedStatus) {
          evaluations = evaluations.filter(
            (project) => project.status === selectedStatus
          );
        }
      } else {
        errorMessage = "Failed to load assigned projects for evaluation.";
      }
    } catch (err) {
      errorMessage = "An error occurred while loading projects.";
    }
  }

  async function fetchEditions() {
    try {
      const response = await fetch(
        "http://192.168.0.102:8080/zpi/editions/listAll"
      );
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
    fetchEvaluations();
  }

  function handleStatusChange() {
    fetchEvaluations();
  }

  function goToEvaluationPage(projectId) {
    push(`/evaluations/${projectId}`);
  }

  onMount(async () => {
    await fetchEditions();
    await fetchEvaluations();
  });
</script>

<div class="container mx-auto py-16 px-6 zoom-out-75">
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

  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    {#each evaluations as evaluation}
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
          >
        {/if}
      </div>
    {/each}
  </div>
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

  @media (min-width: 1600px) {
    .container {
      max-width: 2200px;
    }
  }
</style> -->
<script>
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";
  import Pagination from "../../components/Pagination.svelte";

  const userId = 8;
  const evaluationRoleId = 1;

  let evaluations = [];
  let editions = [];
  let filteredEvaluations = [];
  let selectedEditionId = "";
  let selectedStatus = "";
  let errorMessage = "";
  let currentPage = 1;
  let totalPages = 1;
  const projectsPerPage = 6;

  function mapState(evaluationState) {
    if (evaluationState === 1) return "pending";
    if (evaluationState === 2) return "completed";
    return "unknown";
  }

  async function fetchEvaluations() {
    try {
      const url =
        `http://192.168.0.102:8080/zpi/evaluations/assignedEvaluateList?userId=${userId}&evaluationRoleId=${evaluationRoleId}` +
        (selectedEditionId ? `&editionId=${selectedEditionId}` : "");
      const response = await fetch(url);

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
      const response = await fetch(
        "http://192.168.0.102:8080/zpi/editions/listAll"
      );
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

  onMount(async () => {
    await fetchEditions();
    await fetchEvaluations();
  });
</script>

<div class="container mx-auto py-16 px-6 zoom-out-75">
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
        {/if}
      </div>
    {/each}
  </div>

  <Pagination {currentPage} {totalPages} on:pageChange={handlePageChange} />
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

  @media (min-width: 1600px) {
    .container {
      max-width: 2200px;
    }
  }
</style>
