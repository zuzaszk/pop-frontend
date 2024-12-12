<!-- <script>
  export let role = "";
  let showCreateDropdown = false;
  let showMyProjectsDropdown = false;
  let showMobileMenu = false;

  const dashboardRoutes = {
    student: "#/student-dashboard",
    supervisor: "#/supervisor-dashboard",
    reviewer: "#/reviewer-dashboard",
    chair: "#/chair-dashboard",
    spectator: "#/projects", 
  };

  function toggleDropdown(dropdown) {
    if (dropdown === "create") {
      showCreateDropdown = !showCreateDropdown;
      showMyProjectsDropdown = false;
    } else if (dropdown === "myProjects") {
      showMyProjectsDropdown = !showMyProjectsDropdown;
      showCreateDropdown = false;
    }
  }

  function toggleMobileMenu() {
    showMobileMenu = !showMobileMenu;
  }
</script>

<header class="bg-[#2c3e50] py-3 w-full fixed top-0 z-10 shadow-md">
  <div class="container flex items-center justify-between w-full px-6">
    <img src="/logo.jpg" alt="Logo" class="logo h-10" />

    <nav class="nav hidden md:flex ml-auto space-x-4 items-center">
      {#if role !== "spectator"}
        <a href={dashboardRoutes[role] || "#/dashboard"} class="nav-link"
          >Dashboard</a
        >
      {/if}

      <a href="#/projects" class="nav-link">Projects</a>

      {#if role === "chair" || role === "supervisor"}
        <a href="#/invitations" class="nav-link">Invitations</a>
      {/if}

      {#if role === "chair"}
        <div
          class="relative inline-block text-left"
          on:click={() => toggleDropdown("create")}
        >
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
        <div
          class="relative inline-block text-left"
          on:click={() => toggleDropdown("myProjects")}
        >
          <a class="nav-link cursor-pointer">My Projects ▼</a>
          {#if showMyProjectsDropdown}
            <div class="dropdown">
              <a href="#/my-projects/constant" class="dropdown-item">Constant</a
              >
              <a href="#/my-projects/dynamic" class="dropdown-item">Dynamic</a>
              <a href="#/my-projects/view" class="dropdown-item">View Project</a
              >
            </div>
          {/if}
        </div>
      {/if}

      {#if role === "reviewer"}
        <a href="#/evaluations" class="nav-link">Evaluations</a>
      {/if}

      <a href="#/settings" class="nav-link">Settings</a>
      <a href="#/logout" class="nav-link">Logout</a>
    </nav>

    <button
      class="mobile-menu-btn md:hidden text-white"
      on:click={toggleMobileMenu}
    >
      ☰
    </button>
  </div>

  {#if showMobileMenu}
    <div class="bg-[#2c3e50] md:hidden">
      <nav class="flex flex-col space-y-2 p-4">
        {#if role !== "spectator"}
          <a href={dashboardRoutes[role] || "#/dashboard"} class="nav-link"
            >Dashboard</a
          >
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
          <a href="#/my-projects/constant" class="nav-link"
            >My Projects (Constant)</a
          >
          <a href="#/my-projects/dynamic" class="nav-link"
            >My Projects (Dynamic)</a
          >
          <a href="#/my-projects/view" class="nav-link">View Project</a>
        {/if}

        {#if role === "reviewer"}
          <a href="#/evaluations" class="nav-link">Evaluations</a>
        {/if}

        <a href="#/settings" class="nav-link">Settings</a>
        <a href="#/logout" class="nav-link">Logout</a>
      </nav>
    </div>
  {/if}
</header>

<style>
  header {
    width: 100%;
    top: 0;
  }

  .container {
    max-width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .logo {
    margin-right: auto;
  }

  .nav-link {
    color: white;
    padding: 0.5rem 0.5rem;
    border-radius: 0.25rem;
    transition: background 0.3s;
  }

  .nav-link:hover {
    background-color: #e74c3c;
  }

  .dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 0.5rem;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  }

  .dropdown-item {
    display: block;
    padding: 0.5rem 1rem;
    color: #333;
    transition: background 0.2s;
  }

  .dropdown-item:hover {
    background-color: #f1f1f1;
  }

  .mobile-menu-btn {
    margin-left: auto;
  }
</style> -->


<!-- 
<script>
    import { push } from "svelte-spa-router";



  export let role = "";
  let showCreateDropdown = false;
  let showMyProjectsDropdown = false;
  let showMobileMenu = false;

  const dashboardRoutes = {
    student: "#/student-dashboard",
    supervisor: "#/supervisor-dashboard",
    reviewer: "#/reviewer-dashboard",
    chair: "#/chair-dashboard",
    spectator: "#/projects",
  };

  function logout() {
    authStore.set({ token: null, user: null, isAuthenticated: false });
    sessionStorage.clear();
    push("/login");
  }
  function toggleDropdown(dropdown) {
    if (dropdown === "create") {
      showCreateDropdown = !showCreateDropdown;
      showMyProjectsDropdown = false;
    } else if (dropdown === "myProjects") {
      showMyProjectsDropdown = !showMyProjectsDropdown;
      showCreateDropdown = false;
    }
  }

  function toggleMobileMenu() {
    showMobileMenu = !showMobileMenu;
  }
</script>

<header class="bg-[#2c3e50] py-3 w-full fixed top-0 z-10 shadow-md">
  <div class="container flex items-center justify-between w-full px-6">
    <a href="/" class="logo-link">
      <img src="/logo.jpg" alt="Logo" class="logo h-10" />
    </a>

    <nav class="nav hidden md:flex ml-auto space-x-4 items-center">
      {#if role !== "spectator"}
        <a href={dashboardRoutes[role] || "#/dashboard"} class="nav-link">
          Dashboard
        </a>
      {/if}
      <a href="#/projects" class="nav-link">Projects</a>

      {#if role === "chair" || role === "supervisor"}
        <a href="#/invitations" class="nav-link">Invitations</a>
      {/if}

      {#if role === "chair"}
        <div
          class="relative inline-block text-left"
          on:click={() => toggleDropdown("create")}
        >
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
        <div
          class="relative inline-block text-left"
          on:click={() => toggleDropdown("myProjects")}
        >
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
      <a href="#/logout" class="nav-link">Logout</a>
    </nav>

    <button
      class="mobile-menu-btn md:hidden text-white"
      on:click={toggleMobileMenu}
    >
      ☰
    </button>
  </div>

  {#if showMobileMenu}
    <div class="bg-[#2c3e50] md:hidden">
      <nav class="flex flex-col space-y-2 p-4">
        {#if role !== "spectator"}
          <a href={dashboardRoutes[role] || "#/dashboard"} class="nav-link">
            Dashboard
          </a>
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
          <a href="#/my-projects/constant" class="nav-link">
            My Projects (Constant)
          </a>
          <a href="#/my-projects/dynamic" class="nav-link">
            My Projects (Dynamic)
          </a>
          <a href="#/my-projects/view" class="nav-link">View Project</a>
        {/if}

        {#if role === "reviewer"}
          <a href="#/evaluations" class="nav-link">Evaluations</a>
        {/if}

        <a href="#/settings" class="nav-link">Settings</a>
        <a href="#/logout" class="nav-link">Logout</a>
      </nav>
    </div>
  {/if}
</header>

<style>
  header {
    width: 100%;
    top: 0;
  }

  .container {
    max-width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .logo {
    margin-right: auto;
  }

  .logo-link {
    display: inline-block;
  }

  .nav-link {
    color: white;
    padding: 0.5rem 0.5rem;
    border-radius: 0.25rem;
    transition: background 0.3s;
  }

  .nav-link:hover {
    background-color: #e74c3c;
  }

  .dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 0.5rem;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  }

  .dropdown-item {
    display: block;
    padding: 0.5rem 1rem;
    color: #333;
    transition: background 0.2s;
  }

  .dropdown-item:hover {
    background-color: #f1f1f1;
  }

  .mobile-menu-btn {
    margin-left: auto;
  }
</style>
-->


<!-- <script>
  import { push } from "svelte-spa-router";
  import { authStore } from "../stores/authStore";

  export let role = "";
  let showCreateDropdown = false;
  let showMyProjectsDropdown = false;
  let showMobileMenu = false;

  const dashboardRoutes = {
    student: "/student-dashboard",
    supervisor: "/supervisor-dashboard",
    reviewer: "/reviewer-dashboard",
    chair: "/chair-dashboard",
    spectator: "/projects",
  };

  function logout() {
  authStore.set({ token: null, user: null, isAuthenticated: false });
  sessionStorage.clear();

  window.location.replace("/login");
}


  function toggleDropdown(dropdown) {
    if (dropdown === "create") {
      showCreateDropdown = !showCreateDropdown;
      showMyProjectsDropdown = false;
    } else if (dropdown === "myProjects") {
      showMyProjectsDropdown = !showMyProjectsDropdown;
      showCreateDropdown = false;
    }
  }

  function toggleMobileMenu() {
    showMobileMenu = !showMobileMenu;
  }
</script>

<header class="bg-[#2c3e50] py-3 w-full fixed top-0 z-10 shadow-md">
  <div class="container flex items-center justify-between w-full px-6">
    
    <a href="/" class="logo-link">
      <img src="/logo.jpg" alt="Logo" class="logo h-10" />
    </a>

   
    <nav class="nav hidden md:flex ml-auto space-x-4 items-center">
      {#if role !== "spectator"}
        <a href={dashboardRoutes[role] || "/dashboard"} class="nav-link">
          Dashboard
        </a>
      {/if}
      <a href="#/projects" class="nav-link">Projects</a>

      {#if role === "chair" || role === "supervisor"}
        <a href="/invitations" class="nav-link">Invitations</a>
      {/if}

      {#if role === "chair"}
        <div
          class="relative inline-block text-left"
          on:click={() => toggleDropdown("create")}
        >
          <a class="nav-link cursor-pointer">Create ▼</a>
          {#if showCreateDropdown}
            <div class="dropdown">
              <a href="/create-project" class="dropdown-item">Project</a>
              <a href="/create-edition" class="dropdown-item">Edition</a>
            </div>
          {/if}
        </div>
      {/if}

      {#if role === "student"}
        <div
          class="relative inline-block text-left"
          on:click={() => toggleDropdown("myProjects")}
        >
          <a class="nav-link cursor-pointer">My Projects ▼</a>
          {#if showMyProjectsDropdown}
            <div class="dropdown">
              <a href="/my-projects/constant" class="dropdown-item">Constant</a>
              <a href="/my-projects/dynamic" class="dropdown-item">Dynamic</a>
              <a href="/my-projects/view" class="dropdown-item">View Project</a>
            </div>
          {/if}
        </div>
      {/if}

      {#if role === "reviewer"}
        <a href="/evaluations" class="nav-link">Evaluations</a>
      {/if}

      <a href="#/settings" class="nav-link">Settings</a>
      <a on:click={logout} class="nav-link cursor-pointer">Logout</a>
    </nav>

    
    <button
      class="mobile-menu-btn md:hidden text-white"
      on:click={toggleMobileMenu}
    >
      ☰
    </button>
  </div>

 
  {#if showMobileMenu}
    <div class="bg-[#2c3e50] md:hidden">
      <nav class="flex flex-col space-y-2 p-4">
        {#if role !== "spectator"}
          <a href={dashboardRoutes[role] || "/dashboard"} class="nav-link">
            Dashboard
          </a>
        {/if}
        <a href="#/projects" class="nav-link">Projects</a>

        {#if role === "chair" || role === "supervisor"}
          <a href="/invitations" class="nav-link">Invitations</a>
        {/if}

        {#if role === "chair"}
          <a href="/create-project" class="nav-link">Create Project</a>
          <a href="/create-edition" class="nav-link">Create Edition</a>
        {/if}

        {#if role === "student"}
          <a href="/my-projects/constant" class="nav-link">
            My Projects (Constant)
          </a>
          <a href="/my-projects/dynamic" class="nav-link">
            My Projects (Dynamic)
          </a>
          <a href="/my-projects/view" class="nav-link">View Project</a>
        {/if}

        {#if role === "reviewer"}
          <a href="/evaluations" class="nav-link">Evaluations</a>
        {/if}

        <a href="#/settings" class="nav-link">Settings</a>
        <a on:click={logout} class="nav-link cursor-pointer">Logout</a>
      </nav>
    </div>
  {/if}
</header>

<style>
  header {
    width: 100%;
    top: 0;
  }

  .container {
    max-width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .logo {
    margin-right: auto;
  }

  .logo-link {
    display: inline-block;
  }

  .nav-link {
    color: white;
    padding: 0.5rem 0.5rem;
    border-radius: 0.25rem;
    transition: background 0.3s;
  }

  .nav-link:hover {
    background-color: #e74c3c;
  }

  .dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 0.5rem;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  }

  .dropdown-item {
    display: block;
    padding: 0.5rem 1rem;
    color: #333;
    transition: background 0.2s;
  }

  .dropdown-item:hover {
    background-color: #f1f1f1;
  }

  .mobile-menu-btn {
    margin-left: auto;
  }
</style>  -->

<script>
  import { authStore, clearAuth } from "../stores/authStore";

  let role = "";
  let isAuthenticated = false;

  // Reactive subscription to authStore
  $: {
    role = $authStore?.role || ""; 
    isAuthenticated = $authStore?.isAuthenticated || false;
    console.log("Current role in header (reactive):", role); 
  }

  const dashboardRoutes = {
    student: "#/student-dashboard",
    supervisor: "#/supervisor-dashboard",
    reviewer: "#/reviewer-dashboard",
    chair: "#/chair-dashboard",
    spectator: "#/projects",
  };

  function logout() {
    authStore.set({ token: null, user: null, role: null, isAuthenticated: false });
    document.cookie = "authToken=; path=/; max-age=0;"; 
    document.cookie = "JSESSIONID=; path=/; max-age=0;";
    window.location.href = "/login"; 
  }

  let showCreateDropdown = false;
  let showMyProjectsDropdown = false;
  let showMobileMenu = false;

  function toggleDropdown(dropdown) {
    if (dropdown === "create") {
      showCreateDropdown = !showCreateDropdown;
      showMyProjectsDropdown = false;
    } else if (dropdown === "myProjects") {
      showMyProjectsDropdown = !showMyProjectsDropdown;
      showCreateDropdown = false;
    }
  }

  function toggleMobileMenu() {
    showMobileMenu = !showMobileMenu;
  }
</script>

<header class="bg-[#2c3e50] py-3 w-full fixed top-0 z-10 shadow-md">
  <div class="container flex items-center justify-between w-full px-6">
    <a href="/" class="logo-link">
      <img src="/logo.jpg" alt="Logo" class="logo h-10" />
    </a>

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

    <button class="mobile-menu-btn md:hidden text-white" on:click={toggleMobileMenu}>☰</button>
  </div>

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


<style>
  header {
    width: 100%;
    top: 0;
  }

  .container {
    max-width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .logo {
    margin-right: auto;
  }

  .logo-link {
    display: inline-block;
  }

  .nav-link {
    color: white;
    padding: 0.5rem 0.5rem;
    border-radius: 0.25rem;
    transition: background 0.3s;
  }

  .nav-link:hover {
    background-color: #e74c3c;
  }

  .dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 0.5rem;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  }

  .dropdown-item {
    display: block;
    padding: 0.5rem 1rem;
    color: #333;
    transition: background 0.2s;
  }

  .dropdown-item:hover {
    background-color: #f1f1f1;
  }

  .mobile-menu-btn {
    margin-left: auto;
  }
</style>
