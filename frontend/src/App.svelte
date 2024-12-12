<!-- <script>
  import Router, { location } from "svelte-spa-router";
  import { routes } from "./routes";
  import Header from "./components/Header.svelte";
  

  import { onMount } from "svelte";

  let currentPath = "";
  let role = "reviewer";

  $: currentPath = $location;
</script>

<main class="bg-[#F7F9F9] min-h-screen flex flex-col">
  {#if currentPath !== "/login" && currentPath !== "/signup" && currentPath !== "/forgot-password" && currentPath != "/" && currentPath != "/reset-password"}
    <Header {role} />
  {/if}

  <Router {routes} />
</main>

<style>
  main {
    min-height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
</style> -->

<script>
  import Router, { location } from "svelte-spa-router";
  import { routes } from "./routes";
  import Header from "./components/Header.svelte";
  import { onMount } from "svelte";
  import { authStore } from "./stores/authStore";
  import { push } from "svelte-spa-router";


  let currentPath = "";
  let role = "";

  $: currentPath = $location;

  $: authStore.subscribe((auth) => {
    role = auth?.role || "";
  });
  console.log(currentPath);


</script>

<main class="bg-[#F7F9F9] min-h-screen flex flex-col">
  {#if currentPath !== "/login" && currentPath !== "/signup" && currentPath !== "/forgot-password" && currentPath !== "/" && currentPath !== "/reset-password" && currentPath != "/finalize-user"}
    <Header {role} />
  {/if}

  <Router {routes} />
</main>

<style>
  main {
    min-height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
</style>
