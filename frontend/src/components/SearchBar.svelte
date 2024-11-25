<script>
  export let year;
  export let language;
  export let title;
  export let handleSearch;
</script>

<div class="search-bar flex items-center space-x-2 mb-6">
  <div class="dropdown-container">
    <select bind:value={year} class="dropdown">
      <option value="">Select Year</option>
      <option value="2025">2025</option>
      <option value="2024">2024</option>
      <option value="2023">2023</option>
      <option value="2022">2022</option>
      <option value="2021">2021</option>
      <option value="2020">2020</option>
      <option value="2019">2019</option>
      <option value="2018">2018</option>
      <option value="2017">2017</option>
      <option value="2016">2016</option>
      <option value="2015">2015</option>
    </select>

    <select bind:value={language} class="dropdown">
      <option value="">Select Language</option>
      <option value="EN">English</option>
      <option value="PL">Polish</option>
    </select>
  </div>

  <input
    bind:value={title}
    type="text"
    class="search-input"
    placeholder="Search by project name..."
  />

  <button on:click={handleSearch} class="search-button"> Search </button>
</div>

<style>
  .dropdown,
  .search-input {
    padding: 0.5rem;
    border: 1px solid #bdc3c7;
    border-radius: 8px;
    font-size: 0.875rem;
    color: #000;
    background-color: transparent;
  }

  .search-button {
    background-color: #e74c3c;
    color: #fff;
    padding: 0.5rem 1.25rem;
    border-radius: 8px;
    font-size: 0.875rem;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .search-button:hover {
    background-color: #c0392b;
  }

  .dropdown-container {
    display: flex;
    gap: 0.5rem;
  }

  @media (max-width: 768px) {
    .search-bar {
      flex-direction: column;
      gap: 0.5rem;
    }

    .dropdown-container {
      display: flex;
      flex-direction: row;
      gap: 0.5rem;
    }

    .dropdown,
    .search-input,
    .search-button {
      width: 90%;
    }
  }
</style>
