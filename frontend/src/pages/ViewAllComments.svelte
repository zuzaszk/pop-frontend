<script>
  import { onMount } from "svelte";
  import Pagination from "../components/Pagination.svelte";
  import { push } from "svelte-spa-router";
  import { get } from "svelte/store"; 
  import { authStore } from "../stores/authStore";

  export let params;
  let projectId = null;
  let reviews = [];
  let paginatedComments = [];
  let currentPage = 1;
  const commentsPerPage = 25;
  let totalPages = 1;
  let loading = true;
  let error = "";

  const { token } = get(authStore); 

  onMount(() => {
    projectId = params?.projectId;
    if (projectId) {
      fetchComments();
    } else {
      error = "Project ID is missing";
      loading = false;
    }
  });

  async function fetchComments() {
    try {
      const response = await fetch(
        `https://269593.kieg.science/api/project/basicInfo?projectId=${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, 
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        reviews = data.reviews || [];
        totalPages = Math.ceil(reviews.length / commentsPerPage);
        paginateComments();
      } else {
        error = "Failed to load comments.";
      }
    } catch (err) {
      error = `Error fetching comments: ${err.message}`;
    } finally {
      loading = false;
    }
  }

  function paginateComments() {
    const start = (currentPage - 1) * commentsPerPage;
    const end = start + commentsPerPage;
    paginatedComments = reviews.slice(start, end);
  }

  function handlePageChange(pageNumber) {
    currentPage = pageNumber;
    paginateComments();
  }

  function goBack() {
    if (projectId) {
      push(`/projects/${projectId}`);
    } else {
      push("/projects");
    }
  }
</script>

{#if loading}
  <div class="text-center text-xl text-[#2C3E50]">Loading comments...</div>
{:else if error}
  <div class="text-center text-xl text-red-600">{error}</div>
{:else}
  <div class="container mx-auto p-6 bg-white rounded-lg shadow-lg mt-20">
    <div class="p-4">
      <div class="mb-6 flex items-center">
        <span
          class="text-red-600 underline cursor-pointer flex items-center gap-2"
          on:click={goBack}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5 h-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Back to Project
        </span>
      </div>

      <h1 class="text-3xl font-bold text-[#2C3E50] mb-6 text-left">
        All Comments
      </h1>

      {#if paginatedComments.length > 0}
        <div class="comments-container text-left">
          {#each paginatedComments as comment}
            <div class="bg-[#ECF0F1] p-4 rounded-lg mb-4">
              <p class="text-[#2C3E50] font-semibold">
                {comment.fullname || "Unknown User"}:
              </p>
              <p class="text-[#7F8C8D] font-medium">{comment.review}</p>
            </div>
          {/each}
        </div>
      {:else}
        <p class="text-[#7F8C8D] font-medium">No comments available.</p>
      {/if}

      <Pagination {currentPage} {totalPages} on:pageChange={handlePageChange} />
    </div>
  </div>
{/if}

<style>
  body {
    overflow-y: scroll;
  }

  .container {
    max-width: 1200px;
    transform: scale(0.85);
    margin: auto;
    padding: 2rem;
    background-color: #ffffff;
  }

  a {
    color: #e74c3c;
    text-decoration: underline;
    cursor: pointer;
  }

  .comments-container {
    margin-top: 1rem;
  }

  .flex svg {
    display: inline;
    vertical-align: middle;
  }

  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }

    h1 {
      font-size: 1.75rem;
    }

    p {
      font-size: 0.875rem;
    }
  }

  @media (min-width: 1600px) {
    .container {
      max-width: 1700px;
      transform: scale(1);
      padding: 3rem;
    }

    h1 {
      font-size: 2.5rem;
    }

    p {
      font-size: 1rem;
    }
  }
</style>
