<script>
    import { onMount } from "svelte";
    import { push } from "svelte-spa-router";
    import SearchBar from "../../components/SearchBar.svelte";
    import ProjectCard from "../../components/ProjectCard.svelte";
    import Pagination from "../../components/Pagination.svelte";
    import { authStore } from "../../stores/authStore"; 
    import { get } from "svelte/store";
  
    // let userId = 5; 
    // let roleId = 2; 
    let title = "";
    let year = "";
    let language = "";
    let allTeams = [];
    let displayedTeams = [];
    let currentPage = 1;
    let totalPages = 1;
    let error = "";
    let itemsPerPage = 8;

    let userId, roleId, token;

    $: {
    const auth = get(authStore);

    // Extract userId and token from authStore
    userId = auth?.user?.userId || null;
    token = auth?.token || null;

    // Map role names to roleIds
    const roleMapping = {
      student: 1,
      supervisor: 2,
      reviewer: 3,
      chair: 4,
      spectator: 5,
    };

    // Resolve roleId using current role
    if (auth?.user?.userRole && auth?.role) {
      const currentRole = roleMapping[auth.role];
      roleId = auth.user.userRole.find((r) => r.roleId === currentRole)?.roleId || null;
    } else {
      roleId = null; // Fallback
    }

    console.log("Auth object:", auth);
    console.log("User ID:", userId);
    console.log("Resolved roleId:", roleId);
    console.log("Token:", token);
  }


  
    async function fetchTeams() {
  try {
    error = "";

    console.log("Filters:", { year, language, title }); 

    const queryParams = [];
    if (year) queryParams.push(`year=${encodeURIComponent(year)}`);
    if (title.trim()) queryParams.push(`title=${encodeURIComponent(title)}`);

    let languageId;
    if (language === "EN") languageId = 1;
    else if (language === "PL") languageId = 2;

    if (languageId) queryParams.push(`language=${languageId}`);

    const queryString = queryParams.length ? `&${queryParams.join("&")}` : "";
    const timestamp = new Date().getTime();
    const url = `http://localhost:8080/project/getByUserRole?userId=${userId}&roleId=${roleId}${queryString}&_=${timestamp}`;

      console.log("Fetching URL:", url);

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }, // Include token in header
      });

    if (response.ok) {
      const result = await response.json();
      console.log("API Response:", result); 
      if (result.success) {
        allTeams = result.data;
        calculateItemsPerPage();
        totalPages = Math.ceil(allTeams.length / itemsPerPage);
        currentPage = 1;
        updateDisplayedTeams();
      } else {
        error = "Failed to retrieve teams.";
      }
    } else {
      error = "Error fetching teams.";
    }
  } catch (err) {
    error = `Error fetching teams: ${err.message}`;
    console.error(error);
  }
}

  
    function calculateItemsPerPage() {
      if (window.innerWidth >= 1600) {
        itemsPerPage = 16;
      } else {
        itemsPerPage = 8;
      }
    }
  
    function updateDisplayedTeams() {
      const startIndex = (currentPage - 1) * itemsPerPage;
      displayedTeams = allTeams.slice(startIndex, startIndex + itemsPerPage);
    }
  
    function goToTeamDetails(teamId) {
      if (!teamId) {
        console.error("Team ID is undefined");
        return;
      }
      push(`/teams/${teamId}`);
    }
  
    function changePage(page) {
      currentPage = page;
      updateDisplayedTeams();
    }
  
    function handleResize() {
      calculateItemsPerPage();
      totalPages = Math.ceil(allTeams.length / itemsPerPage);
      updateDisplayedTeams();
    }
  
    onMount(() => {
      fetchTeams();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    });
  </script>
  
  <div class="bg-[#F7F9F9] min-h-screen pt-24 flex flex-col justify-between">
    <div class="container mx-auto py-6 flex-grow px-4 sm:px-6">
      <div class="flex flex-col sm:flex-row justify-between items-center mb-6">
        <SearchBar
          bind:year
          bind:language
          bind:title
          handleSearch={fetchTeams}
        />
      </div>
  
      {#if error}
        <div class="text-red-600">{error}</div>
      {/if}
  
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-10">
        {#each displayedTeams as team}
          <div
            on:click={() => goToTeamDetails(team.projectId)}
            class="cursor-pointer"
          >
            <ProjectCard
              project={{
                title: team.title,
                acronym: team.acronym,
                overview: team.overview || "No overview available."
              }}
            />
          </div>
        {/each}
      </div>
    </div>
  
    <Pagination
      {currentPage}
      {totalPages}
      on:pageChange={(e) => changePage(e.detail)}
    />
  </div>
  
  <style>
    .container {
      max-width: 1400px;
    }
  
    @media (min-width: 1600px) {
      .container {
        max-width: 2200px;
      }
    }
  </style>
  