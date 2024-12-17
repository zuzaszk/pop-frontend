<script>
  import { authStore, clearAuth } from "../stores/authStore";

  // State variables
  let role = "";
  let isAuthenticated = false;
  let showCreateDropdown = false;
  let showMyProjectsDropdown = false;
  let showMobileMenu = false;


  // Dashboard routes based on role
  const dashboardRoutes = {
    student: "#/student-dashboard",
    supervisor: "#/supervisor-dashboard",
    reviewer: "#/reviewer-dashboard",
    chair: "#/chair-dashboard",
    spectator: "#/projects",
  };

  // Reactive subscription to authStore
  $: {
    role = $authStore?.role || ""; 
    isAuthenticated = $authStore?.isAuthenticated || false;
    console.log("Current role in header (reactive):", role); 
  }

// Logout function: Clears user state and cookies
  function logout() {
    authStore.set({ token: null, user: null, role: null, isAuthenticated: false });
    document.cookie = "authToken=; path=/; max-age=0;"; 
    document.cookie = "JSESSIONID=; path=/; max-age=0;";
    window.location.href = "/login"; 
  }

  // Toggle specific dropdowns
  function toggleDropdown(dropdown) {
    if (dropdown === "create") {
      showCreateDropdown = !showCreateDropdown;
      showMyProjectsDropdown = false;
    } else if (dropdown === "myProjects") {
      showMyProjectsDropdown = !showMyProjectsDropdown;
      showCreateDropdown = false;
    }
  }

  // Toggle mobile menu visibility
  function toggleMobileMenu() {
    showMobileMenu = !showMobileMenu;
  }
</script>

<header class="bg-[#2c3e50] py-3 w-full fixed top-0 z-10 shadow-md">
  <div class="container flex items-center justify-between w-full px-6">
    <!-- Logo -->
    <a href="/" class="logo-link">
      <img src="/logo.jpg" alt="Logo" class="logo h-10" />
    </a>

    <!-- Desktop Navigation -->
    <nav class="nav hidden md:flex ml-auto space-x-4 items-center">
      {#if role !== "spectator" && role}
        <a href={dashboardRoutes[role]} class="nav-link">Dashboard</a>
      {/if}
      <a href="#/projects" class="nav-link">Projects</a>

      {#if role === "chair" || role === "supervisor"}
        <a href="#/invitations" class="nav-link">Invitations</a>
      {/if}

      {#if role === "chair"}
        <div class="relative inline-block text-left" on:click={() => toggleDropdown("create")}>
          <a class="nav-link cursor-pointer">Create ▼</a>
          {#if showCreateDropdown}
            <div class="dropdown">
              <a href="#/create-project" class="dropdown-item">Project</a>
              <a href="#/create-edition" class="dropdown-item">Edition</a>
            </div>
          {/if}
        </div>
      {/if}

      {#if role === "student"}
        <div class="relative inline-block text-left" on:click={() => toggleDropdown("myProjects")}>
          <a class="nav-link cursor-pointer">My Projects ▼</a>
          {#if showMyProjectsDropdown}
            <div class="dropdown">
              <a href="#/my-projects/constant" class="dropdown-item">Constant</a>
              <a href="#/my-projects/dynamic" class="dropdown-item">Dynamic</a>
              <a href="#/my-projects/view" class="dropdown-item">View Project</a>
            </div>
          {/if}
        </div>
      {/if}

      {#if role === "reviewer"}
        <a href="#/evaluations" class="nav-link">Evaluations</a>
      {/if}

      <a href="#/settings" class="nav-link">Settings</a>
      <a on:click={logout} class="nav-link cursor-pointer">Logout</a>
    </nav>

    <!-- Mobile Menu Button -->
    <button class="mobile-menu-btn md:hidden text-white" on:click={toggleMobileMenu}>☰</button>
  </div>

  <!-- Mobile Navigation -->
  {#if showMobileMenu}
    <div class="bg-[#2c3e50] md:hidden">
      <nav class="flex flex-col space-y-2 p-4">
        {#if role !== "spectator" && role}
          <a href={dashboardRoutes[role]} class="nav-link">Dashboard</a>
        {/if}
        <a href="#/projects" class="nav-link">Projects</a>

        {#if role === "chair" || role === "supervisor"}
          <a href="#/invitations" class="nav-link">Invitations</a>
        {/if}

        {#if role === "chair"}
          <a href="#/create-project" class="nav-link">Create Project</a>
          <a href="#/create-edition" class="nav-link">Create Edition</a>
        {/if}

        {#if role === "student"}
          <a href="#/my-projects/constant" class="nav-link">My Projects (Constant)</a>
          <a href="#/my-projects/dynamic" class="nav-link">My Projects (Dynamic)</a>
          <a href="#/my-projects/view" class="nav-link">View Project</a>
        {/if}

        {#if role === "reviewer"}
          <a href="#/evaluations" class="nav-link">Evaluations</a>
        {/if}

        <a href="#/settings" class="nav-link">Settings</a>
        <a on:click={logout} class="nav-link cursor-pointer">Logout</a>
      </nav>
    </div>
  {/if}
</header>


<!-- Import external styles -->
<style>
  @import "../styles/components/Header.css";
</style>

