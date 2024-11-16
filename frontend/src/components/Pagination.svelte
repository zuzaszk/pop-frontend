<script>
  export let currentPage = 1;
  export let totalPages = 1;
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  function changePage(pageNumber) {
    dispatch("pageChange", pageNumber);
  }
</script>

<div class="pagination-container">
  {#if currentPage > 1}
    <button class="pagination-btn" on:click={() => changePage(currentPage - 1)}
      >Previous</button
    >
  {/if}
  {#each Array(totalPages)
    .fill(0)
    .map((_, index) => index + 1) as page}
    <button
      class="pagination-btn {page === currentPage ? 'active' : ''}"
      on:click={() => changePage(page)}
    >
      {page}
    </button>
  {/each}
  {#if currentPage < totalPages}
    <button class="pagination-btn" on:click={() => changePage(currentPage + 1)}
      >Next</button
    >
  {/if}
</div>

<style>
  .pagination-container {
    display: flex;
    gap: 6px;
    justify-content: center;
    align-items: center;
    padding: 16px 0;
  }

  .pagination-btn {
    padding: 8px 14px;
    margin: 0 4px;
    border: 1px solid #bdc3c7;
    border-radius: 5px;
    background-color: white;
    color: black;
    cursor: pointer;
    transition:
      background-color 0.3s ease,
      color 0.3s ease;
    font-size: 0.9rem;
  }

  .pagination-btn:hover,
  .pagination-btn.active {
    background-color: #e74c3c;
    color: white;
  }

  @media (max-width: 640px) {
    .pagination-container {
      gap: 4px;
      padding: 12px 0;
    }

    .pagination-btn {
      padding: 6px 10px;
      font-size: 0.8rem;
    }
  }
</style>
