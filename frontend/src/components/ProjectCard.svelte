<!-- <script>
  export let project;
</script>

<div
  class="card-container bg-white p-4 rounded-lg shadow-md text-center flex flex-col justify-between transform hover:scale-95 transition-transform duration-300 ease-in-out"
>
  <div>
    <h2 class="title text-lg font-bold text-[#2C3E50] mb-2">{project.title}</h2>
    <p class="acronym text-sm text-[#34495E] mb-2">
      Acronym: {project.acronym}
    </p>
    <p class="description text-xs text-[#7F8C8D] mb-4">{project.overview}</p>
  </div>
  <button
    class="view-button bg-[#E74C3C] text-white p-2 rounded-lg hover:bg-[#C0392B] text-sm mx-auto block"
    >View Details</button
  >
</div>

<style>
  .card-container {
    min-height: 200px;
    width: 100%;
    max-width: 320px;
    transition: transform 0.3s ease-in-out;
    padding: 1rem;
  }

  .title {
    font-size: 1rem;
  }

  .acronym {
    font-size: 0.875rem;
  }

  .description {
    font-size: 0.75rem;
  }

  .view-button {
    width: 120px;
    font-size: 0.875rem;
    padding: 0.5rem;
  }

  .card-container:hover {
    transform: scale(1.03);
  }
  @media (min-width: 1440px) {
    .card-container {
      max-width: 500px;
      padding: 1.25rem;
    }
  }

  @media (max-width: 640px) {
    .card-container {
      padding: 0.75rem;
      max-width: 100%;
    }

    .title {
      font-size: 0.9rem;
    }

    .acronym,
    .description {
      font-size: 0.75rem;
    }

    .view-button {
      width: 100%;
      padding: 0.5rem;
    }
  }
</style> -->

<!-- <script>
  export let project; // Ensure this is passed correctly when used
</script>

<div
  class="card-container bg-white p-4 rounded-lg shadow-md flex flex-col justify-between transform hover:scale-95 transition-transform duration-300 ease-in-out"
>
  <div class="card-content">
    <h2 class="title text-lg font-bold text-[#2C3E50] mb-2">
      {project.title || "Untitled Project"}
    </h2>
    <p class="acronym text-sm text-[#34495E] mb-2">
      Acronym: {project.acronym || "N/A"}
    </p>
    <p class="description text-xs text-[#7F8C8D]">
      {project.overview || "No overview available."}
    </p>
  </div>
  <button
    class="view-button bg-[#E74C3C] text-white p-2 rounded-lg hover:bg-[#C0392B] text-sm mx-auto block mt-4"
  >
    View Details
  </button>
</div>

<style>
  .card-container {
    height: 250px; /* Fixed height */
    width: 100%; /* Full width of container */
    max-width: 320px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .card-content {
    flex: 1;
    overflow: hidden;
  }

  .description {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3; /* Limit text to 3 lines */
    -webkit-box-orient: vertical;
    font-size: 0.75rem;
    color: #7f8c8d;
  }

  .view-button {
    width: 120px;
    font-size: 0.875rem;
    margin-top: auto;
    padding: 0.5rem;
  }

  .card-container:hover {
    transform: scale(1.03);
  }

  @media (min-width: 1440px) {
    .card-container {
      height: 300px;
    }
  }

  @media (max-width: 640px) {
    .card-container {
      height: 260px;
    }
  }
</style> -->


<script>
  export let project; // Ensure the project prop is passed correctly
</script>

<div
  class="card-container bg-white p-4 rounded-lg shadow-md flex flex-col justify-between transform hover:scale-95 transition-transform duration-300 ease-in-out"
>
  <div class="card-content">
    <h2 class="title text-lg font-bold text-[#2C3E50] mb-2">
      {project.title || "Untitled Project"}
    </h2>
    <p class="acronym text-sm text-[#34495E] mb-2">
      Acronym: {project.acronym || "N/A"}
    </p>
    <p class="description text-xs text-[#7F8C8D]">
      {project.overview || "No overview available."}
    </p>
  </div>
  <button
    class="view-button bg-[#E74C3C] text-white p-2 rounded-lg hover:bg-[#C0392B] text-sm mx-auto block mt-4"
  >
    View Details
  </button>
</div>

<style>
  /* Ensure all cards have the same fixed height */
  .card-container {
    height: 250px; /* Fixed height */
    width: 100%; /* Full width of container */
    max-width: 320px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    /* Add the corner radius */
    border-radius: 16px; /* Smooth corners */
  }

  /* Prevent content overflow */
  .card-content {
    flex: 1;
    overflow: hidden;
  }

  /* Limit description text length */
  .description {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3; /* Show a maximum of 3 lines */
    -webkit-box-orient: vertical;
  }

  /* Style the button */
  .view-button {
    width: 120px;
    font-size: 0.875rem;
    margin-top: auto;
    padding: 0.5rem;
  }

  /* Add hover effect for scaling */
  .card-container:hover {
    transform: scale(1.03);
  }

  /* Adjust for larger screens */
  /* @media (min-width: 1440px) {
    .card-container {
      height: 320px;
    }
  } */

  /* Adjust for smaller screens */
  /* @media (max-width: 640px) {
    .card-container {
      height: 260px;
    }
  } */
</style>
