<!-- <script>
  import { onMount } from "svelte";
  import { loc, push } from "svelte-spa-router";

  let projectId = null;
  let project = {};
  let members = [];
  let paginatedComments = [];
  let newComment = "";
  let submitCommentErrorMessage = "";
  let submitCommentSuccessMessage = "";
  let submitRatingErrorMessage = "";
  let submitRatingSuccessMessage = "";
  let submittingComment = false;
  let submittingRating = false;
  let loading = true;
  let error = "";
  let posterUrl = "";

  let showRatingModal = false;
  let userScore = 0;
  let existingRating = null;

  let currentPage = 1;
  const commentsPerPage = 5;
  let totalPages = 1;

  const userId = 8;
  const roleId = 3;
  const evaluationRoleId = 1;

  $: loc.subscribe(($loc) => {
    const pathParts = $loc.location.split("/");
    projectId = pathParts[pathParts.length - 1];
  });

  function getLanguageName(languageCode) {
    return languageCode === 1
      ? "English"
      : languageCode === 2
      ? "Polish"
      : "Unknown";
  }

  async function fetchProjectDetails() {
    if (!projectId) {
      error = "Project ID is missing.";
      loading = false;
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/zpi/project/basicInfo?projectId=${projectId}`
      );
      if (response.ok) {
        const data = await response.json();
        project = data;
        members =
          project.userRole?.filter(
            (member) => member.roles?.roleName === "student"
          ) || [];
        const reviews = project.reviews || [];

        totalPages = Math.ceil(reviews.length / commentsPerPage);
        paginateComments(reviews);

        await fetchUserRating();
        fetchPoster(12);
      } else {
        error = "Failed to load project details.";
      }
    } catch (err) {
      error = `Error fetching project details: ${err.message}`;
    } finally {
      loading = false;
    }
  }

  async function fetchUserRating() {
    try {
      const response = await fetch(
        `http://localhost:8080/zpi/evaluations/getEvaluation?projectId=${projectId}&userId=${userId}&evaluationRoleId=${evaluationRoleId}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          existingRating = data.data;
          userScore = data.data.score || 0;
        } else {
          existingRating = null;
        }
      }
    } catch (err) {
      console.error(`Error fetching user rating: ${err.message}`);
    }
  }

  function paginateComments(reviews) {
    const start = (currentPage - 1) * commentsPerPage;
    const end = start + commentsPerPage;
    paginatedComments = reviews.slice(start, end);
  }

  async function fetchPoster(projectElementId) {
    try {
      const response = await fetch(
        `http://localhost:8080/zpi/projectElements/retrieve?projectElementId=${projectElementId}`
      );
      if (response.ok) {
        posterUrl = response.url;
      }
    } catch (err) {
      console.error(`Error fetching poster: ${err.message}`);
    }
  }

  async function submitComment() {
    if (!newComment.trim()) {
      submitCommentErrorMessage = "Please provide a comment.";
      alert(submitCommentErrorMessage);
      return;
    }

    submittingComment = true;
    submitCommentErrorMessage = "";
    submitCommentSuccessMessage = "";

    const payload = {
      projectId,
      userId,
      roleId,
      review: newComment,
      isPublic: true,
    };

    try {
      const response = await fetch(
        `http://localhost:8080/zpi/reviews/add`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        submitCommentSuccessMessage = "Comment submitted successfully!";
        alert(submitCommentSuccessMessage);
        newComment = "";
        await fetchProjectDetails();
      } else {
        const result = await response.json();
        submitCommentErrorMessage =
          result.message || "Failed to submit the comment.";
        alert(submitCommentErrorMessage);
      }
    } catch (err) {
      submitCommentErrorMessage = `Error: ${err.message}`;
      alert(submitCommentErrorMessage);
    } finally {
      submittingComment = false;
      clearMessage("submitCommentSuccessMessage");
    }
  }

  async function submitRating() {
    if (userScore === 0) {
      submitRatingErrorMessage = "Please select a rating.";
      alert(submitRatingErrorMessage);
      return;
    }

    submittingRating = true;
    submitRatingErrorMessage = "";
    submitRatingSuccessMessage = "";

    const payload = existingRating
      ? { evaluationId: existingRating.evaluationId, score: userScore }
      : { projectId, userId, evaluationRoleId, score: userScore };

    const apiUrl = existingRating
      ? "http://localhost:8080/zpi/evaluations/update"
      : "http://localhost:8080/zpi/evaluations/add";

    const method = existingRating ? "PUT" : "POST";

    try {
      const response = await fetch(apiUrl, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        submitRatingSuccessMessage = existingRating
          ? "Rating updated successfully!"
          : "Rating submitted successfully!";
        alert(submitRatingSuccessMessage);
        existingRating = { ...existingRating, score: userScore };
        await fetchProjectDetails();
      } else {
        const result = await response.json();
        submitRatingErrorMessage =
          result.message || "Failed to submit the rating.";
        alert(submitRatingErrorMessage);
      }
    } catch (err) {
      submitRatingErrorMessage = `Error: ${err.message}`;
      alert(submitRatingErrorMessage);
    } finally {
      submittingRating = false;
      showRatingModal = false;
      clearMessage("submitRatingSuccessMessage");
    }
  }

  function clearMessage(field) {
    setTimeout(() => {
      if (field === "submitCommentSuccessMessage") {
        submitCommentSuccessMessage = "";
      } else if (field === "submitRatingSuccessMessage") {
        submitRatingSuccessMessage = "";
      }
    }, 3000);
  }

  function changePage(direction) {
    if (direction === "next" && currentPage < totalPages) {
      currentPage++;
    } else if (direction === "prev" && currentPage > 1) {
      currentPage--;
    }
    paginateComments(project.reviews);
  }

  function viewAllComments() {
    push(`/comments/${projectId}`);
  }

  onMount(fetchProjectDetails);
</script>

{#if loading}
  <div class="text-center text-xl text-[#2C3E50]">
    Loading project details...
  </div>
{:else if error}
  <div class="text-center text-xl text-red-600">{error}</div>
{:else}
  <div
    class="zoom-container container mx-auto p-6 bg-white rounded-lg shadow-lg mt-20 max-w-6xl"
  >
    <div class="p-4">
      <div class="flex flex-col lg:flex-row justify-between">
        <div class="lg:w-2/3">
          <h1 class="text-4xl font-bold text-[#2C3E50] mb-4">
            {project.title} ({project.acronym || "N/A"})
          </h1>
          <h2 class="text-xl font-bold text-[#2C3E50] mb-2">Overview</h2>
          <p class="text-lg text-[#7F8C8D] mb-6">
            {project.overview || "No overview available."}
          </p>
          <h2 class="text-xl font-bold text-[#2C3E50] mb-2">Description</h2>
          <p class="text-lg text-[#7F8C8D] mb-6">
            {project.description || "No description available."}
          </p>
          <h3 class="text-lg font-bold text-[#2C3E50]">Language:</h3>
          <p class="text-[#7F8C8D] font-medium mb-6">
            {getLanguageName(project.language)}
          </p>
          <div class="bg-[#ECF0F1] p-4 rounded-lg mb-6">
            <h3 class="text-lg font-bold text-[#2C3E50] mb-4">Team Members</h3>
            <div class="grid grid-cols-2 gap-4">
              {#each members as member}
                <div
                  class="bg-white p-3 border-l-4 border-[#E74C3C] rounded-lg text-[#2C3E50] font-semibold"
                >
                  {member.users.firstName}
                  {member.users.lastName}
                </div>
              {/each}
            </div>
          </div>
        </div>

        <div class="lg:w-1/3 lg:pl-6 flex justify-center lg:justify-end">
          {#if posterUrl}
            <img src={posterUrl} alt="Project Poster" class="poster-image" />
          {/if}
        </div>
      </div>

      <div class="mt-10">
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-bold text-[#2C3E50] mb-4">Comments</h2>
          <button
            on:click={() => (showRatingModal = true)}
            class="bg-[#E74C3E] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#C0392B]"
          >
            {existingRating ? "Edit Rating" : "Rate Project"}
          </button>
        </div>

        {#if submitCommentSuccessMessage}
          <div class="bg-green-100 text-green-700 p-4 rounded-md mb-4">
            {submitCommentSuccessMessage}
          </div>
        {/if}
        {#if submitRatingSuccessMessage}
          <div class="bg-green-100 text-green-700 p-4 rounded-md mb-4">
            {submitRatingSuccessMessage}
          </div>
        {/if}
        {#if submitCommentErrorMessage}
          <div class="bg-red-100 text-red-700 p-4 rounded-md mb-4">
            {submitCommentErrorMessage}
          </div>
        {/if}
        {#if submitRatingErrorMessage}
          <div class="bg-red-100 text-red-700 p-4 rounded-md mb-4">
            {submitRatingErrorMessage}
          </div>
        {/if}

        {#if paginatedComments.length > 0}
          <div class="comments-section mb-10">
            {#each paginatedComments as comment}
              <div class="bg-[#ECF0F1] p-4 rounded-lg mb-4">
                <p class="text-[#7F8C8D] font-medium">{comment.review}</p>
              </div>
            {/each}
          </div>
        {:else}
          <p>No comments available.</p>
        {/if}

        <div class="pagination-controls">
          {#if currentPage > 1}
            <button
              on:click={() => changePage("prev")}
              class="bg-[#2C3E50] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#34495E] mb-4"
            >
              Previous
            </button>
          {/if}
          {#if currentPage < totalPages}
            <button
              on:click={() => changePage("next")}
              class="bg-[#2C3E50] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#34495E] mb-4"
            >
              Next
            </button>
          {/if}
        </div>

        <textarea
          bind:value={newComment}
          placeholder="Write your comment here..."
          class="w-full h-24 p-3 border border-gray-300 rounded-lg mb-6 bg-white text-gray-800 font-semibold"
        ></textarea>
        <button
          on:click={submitComment}
          class="bg-[#E74C3E] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#C0392B]"
          disabled={submittingComment}
        >
          {submittingComment ? "Submitting..." : "Submit Comment"}
        </button>
        <button
          on:click={viewAllComments}
          class="mt-4 text-[#E74C3E] font-semibold underline hover:no-underline"
        >
          View All Comments
        </button>
      </div>
    </div>
  </div>

  {#if showRatingModal}
    <div
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 class="text-xl font-bold text-[#2C3E50] mb-4">Rate Project</h2>
        <div class="flex justify-center mb-4">
          {#each [1, 2, 3, 4, 5] as star}
            <span
              class="cursor-pointer mx-1"
              on:click={() => (userScore = star)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={star <= userScore ? "#F59E0B" : "#D1D5DB"}
                class="w-8 h-8"
              >
                <path
                  d="M12 17.75l-5.45 3.6 1.95-6.22-5.5-4h6.78L12 4.5l1.72 6.64h6.78l-5.5 4 1.95 6.22z"
                />
              </svg>
            </span>
          {/each}
        </div>
        <button
          on:click={submitRating}
          class="bg-[#E74C3E] text-white font-semibold py-2 px-6 rounded-lg hover:bg-[#C0392B] w-full"
          disabled={submittingRating}
        >
          {submittingRating
            ? "Submitting..."
            : existingRating
            ? "Update Rating"
            : "Submit Rating"}
        </button>
        <button
          on:click={() => (showRatingModal = false)}
          class="text-[#2C3E50] mt-4 text-sm underline w-full text-center"
        >
          Cancel
        </button>
      </div>
    </div>
  {/if}
{/if}

<style>
  .zoom-container {
    transform: scale(0.85);
    transform-origin: center;
  }

  .container {
    max-width: 1200px;
    margin: auto;
    padding: 1rem;
  }

  .poster-image {
    max-width: 100%;
    max-height: 600px;
    object-fit: cover;
    box-shadow: none;
  }

  .comments-section {
    min-height: 200px;
  }

  .pagination-controls {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  @media (min-width: 1600px) {
    .container {
      max-width: 2000px;
    }
  }

  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }
    h1 {
      font-size: 1.75rem;
    }
    h2,
    h3 {
      font-size: 1.25rem;
    }
    p,
    span {
      font-size: 0.875rem;
    }
  }
</style> -->

<script>
  import { onMount } from "svelte";
  import { loc, push } from "svelte-spa-router";
  import { get } from "svelte/store";
  import { authStore } from "../stores/authStore";

  let projectId = null;
  let project = {};
  let members = [];
  let paginatedComments = [];
  let newComment = "";
  let submitCommentErrorMessage = "";
  let submitCommentSuccessMessage = "";
  let submitRatingErrorMessage = "";
  let submitRatingSuccessMessage = "";
  let submittingComment = false;
  let submittingRating = false;
  let loading = true;
  let error = "";
  let posterUrl = "";

  let showRatingModal = false;
  let userScore = 0;
  let existingRating = null;

  let currentPage = 1;
  const commentsPerPage = 5;
  let totalPages = 1;

  let userId = null;
  let roleId = null;
  const evaluationRoleId = 1;


  $: loc.subscribe(($loc) => {
    const pathParts = $loc.location.split("/");
    projectId = pathParts[pathParts.length - 1];
  });


  $: {
    const { user } = get(authStore);
    userId = user?.userId;
    roleId = user?.userRole?.[0]?.roleId;
  }

  function getLanguageName(languageCode) {
    return languageCode === 1
      ? "English"
      : languageCode === 2
      ? "Polish"
      : "Unknown";
  }

  async function fetchProjectDetails() {
    if (!projectId) {
      error = "Project ID is missing.";
      loading = false;
      return;
    }

    try {
      const token = get(authStore)?.token;
      if (!token) {
        push("/login");
        return;
      }

      const response = await fetch(
        `http://localhost:8080/zpi/project/basicInfo?projectId=${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        project = data;
        members =
          project.userRole?.filter(
            (member) => member.roles?.roleName === "student"
          ) || [];
        const reviews = project.reviews || [];

        totalPages = Math.ceil(reviews.length / commentsPerPage);
        paginateComments(reviews);

        await fetchUserRating();
        fetchPoster(12);
      } else {
        error = "Failed to load project details.";
      }
    } catch (err) {
      error = `Error fetching project details: ${err.message}`;
    } finally {
      loading = false;
    }
  }

  async function fetchUserRating() {
    try {
      const token = get(authStore)?.token;
      if (!token) return;

      const response = await fetch(
        `http://localhost:8080/zpi/evaluations/getEvaluation?projectId=${projectId}&userId=${userId}&evaluationRoleId=${evaluationRoleId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          existingRating = data.data;
          userScore = data.data.score || 0;
        } else {
          existingRating = null;
        }
      }
    } catch (err) {
      console.error(`Error fetching user rating: ${err.message}`);
    }
  }

  function paginateComments(reviews) {
    const start = (currentPage - 1) * commentsPerPage;
    const end = start + commentsPerPage;
    paginatedComments = reviews.slice(start, end);
  }

  async function fetchPoster(projectElementId) {
    try {
      const token = get(authStore)?.token;
      if (!token) return;

      const response = await fetch(
        `http://localhost:8080/zpi/projectElements/retrieve?projectElementId=${projectElementId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        posterUrl = response.url;
      }
    } catch (err) {
      console.error(`Error fetching poster: ${err.message}`);
    }
  }

  async function submitComment() {
    if (!newComment.trim()) {
      submitCommentErrorMessage = "Please provide a comment.";
      alert(submitCommentErrorMessage);
      return;
    }

    submittingComment = true;
    submitCommentErrorMessage = "";
    submitCommentSuccessMessage = "";

    const payload = {
      projectId,
      userId,
      roleId,
      review: newComment,
      isPublic: true,
    };

    try {
      const token = get(authStore)?.token;
      if (!token) return;

      const response = await fetch(`http://localhost:8080/zpi/reviews/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        submitCommentSuccessMessage = "Comment submitted successfully!";
        alert(submitCommentSuccessMessage);
        newComment = "";
        await fetchProjectDetails();
      } else {
        const result = await response.json();
        submitCommentErrorMessage =
          result.message || "Failed to submit the comment.";
        alert(submitCommentErrorMessage);
      }
    } catch (err) {
      submitCommentErrorMessage = `Error: ${err.message}`;
      alert(submitCommentErrorMessage);
    } finally {
      submittingComment = false;
      clearMessage("submitCommentSuccessMessage");
    }
  }

  async function submitRating() {
    if (userScore === 0) {
      submitRatingErrorMessage = "Please select a rating.";
      alert(submitRatingErrorMessage);
      return;
    }

    submittingRating = true;
    submitRatingErrorMessage = "";
    submitRatingSuccessMessage = "";

    const payload = existingRating
      ? { evaluationId: existingRating.evaluationId, score: userScore }
      : { projectId, userId, evaluationRoleId, score: userScore };

    const apiUrl = existingRating
      ? "http://localhost:8080/zpi/evaluations/update"
      : "http://localhost:8080/zpi/evaluations/add";

    const method = existingRating ? "PUT" : "POST";

    try {
      const token = get(authStore)?.token;
      if (!token) return;

      const response = await fetch(apiUrl, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        submitRatingSuccessMessage = existingRating
          ? "Rating updated successfully!"
          : "Rating submitted successfully!";
        alert(submitRatingSuccessMessage);
        existingRating = { ...existingRating, score: userScore };
        await fetchProjectDetails();
      } else {
        const result = await response.json();
        submitRatingErrorMessage =
          result.message || "Failed to submit the rating.";
        alert(submitRatingErrorMessage);
      }
    } catch (err) {
      submitRatingErrorMessage = `Error: ${err.message}`;
      alert(submitRatingErrorMessage);
    } finally {
      submittingRating = false;
      showRatingModal = false;
      clearMessage("submitRatingSuccessMessage");
    }
  }

  function clearMessage(field) {
    setTimeout(() => {
      if (field === "submitCommentSuccessMessage") {
        submitCommentSuccessMessage = "";
      } else if (field === "submitRatingSuccessMessage") {
        submitRatingSuccessMessage = "";
      }
    }, 3000);
  }

  function changePage(direction) {
    if (direction === "next" && currentPage < totalPages) {
      currentPage++;
    } else if (direction === "prev" && currentPage > 1) {
      currentPage--;
    }
    paginateComments(project.reviews);
  }

  function viewAllComments() {
    push(`/comments/${projectId}`);
  }

  onMount(fetchProjectDetails);
</script>


{#if loading}
  <div class="text-center text-xl text-[#2C3E50]">
    Loading project details...
  </div>
{:else if error}
  <div class="text-center text-xl text-red-600">{error}</div>
{:else}
  <div
    class="zoom-container container mx-auto p-6 bg-white rounded-lg shadow-lg mt-20 max-w-6xl"
  >
    <div class="p-4">
      <div class="flex flex-col lg:flex-row justify-between">
        <div class="lg:w-2/3">
          <h1 class="text-4xl font-bold text-[#2C3E50] mb-4">
            {project.title} ({project.acronym || "N/A"})
          </h1>
          <h2 class="text-xl font-bold text-[#2C3E50] mb-2">Overview</h2>
          <p class="text-lg text-[#7F8C8D] mb-6">
            {project.overview || "No overview available."}
          </p>
          <h2 class="text-xl font-bold text-[#2C3E50] mb-2">Description</h2>
          <p class="text-lg text-[#7F8C8D] mb-6">
            {project.description || "No description available."}
          </p>
          <h3 class="text-lg font-bold text-[#2C3E50]">Language:</h3>
          <p class="text-[#7F8C8D] font-medium mb-6">
            {getLanguageName(project.language)}
          </p>
          <div class="bg-[#ECF0F1] p-4 rounded-lg mb-6">
            <h3 class="text-lg font-bold text-[#2C3E50] mb-4">Team Members</h3>
            <div class="grid grid-cols-2 gap-4">
              {#each members as member}
                <div
                  class="bg-white p-3 border-l-4 border-[#E74C3C] rounded-lg text-[#2C3E50] font-semibold"
                >
                  {member.users.firstName}
                  {member.users.lastName}
                </div>
              {/each}
            </div>
          </div>
        </div>

        <div class="lg:w-1/3 lg:pl-6 flex justify-center lg:justify-end">
          {#if posterUrl}
            <img src={posterUrl} alt="Project Poster" class="poster-image" />
          {/if}
        </div>
      </div>

      <!-- Comments Section -->
      <div class="mt-10">
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-bold text-[#2C3E50] mb-4">Comments</h2>
          <button
            on:click={() => (showRatingModal = true)}
            class="bg-[#E74C3E] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#C0392B]"
          >
            {existingRating ? "Edit Rating" : "Rate Project"}
          </button>
        </div>

        {#if submitCommentSuccessMessage}
          <div class="bg-green-100 text-green-700 p-4 rounded-md mb-4">
            {submitCommentSuccessMessage}
          </div>
        {/if}
        {#if submitRatingSuccessMessage}
          <div class="bg-green-100 text-green-700 p-4 rounded-md mb-4">
            {submitRatingSuccessMessage}
          </div>
        {/if}
        {#if submitCommentErrorMessage}
          <div class="bg-red-100 text-red-700 p-4 rounded-md mb-4">
            {submitCommentErrorMessage}
          </div>
        {/if}
        {#if submitRatingErrorMessage}
          <div class="bg-red-100 text-red-700 p-4 rounded-md mb-4">
            {submitRatingErrorMessage}
          </div>
        {/if}

        {#if paginatedComments.length > 0}
          <div class="comments-section mb-10">
            {#each paginatedComments as comment}
              <div class="bg-[#ECF0F1] p-4 rounded-lg mb-4">
                <p class="text-[#7F8C8D] font-medium">{comment.review}</p>
              </div>
            {/each}
          </div>
        {:else}
          <p>No comments available.</p>
        {/if}

        <div class="pagination-controls">
          {#if currentPage > 1}
            <button
              on:click={() => changePage("prev")}
              class="bg-[#2C3E50] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#34495E] mb-4"
            >
              Previous
            </button>
          {/if}
          {#if currentPage < totalPages}
            <button
              on:click={() => changePage("next")}
              class="bg-[#2C3E50] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#34495E] mb-4"
            >
              Next
            </button>
          {/if}
        </div>

        <textarea
          bind:value={newComment}
          placeholder="Write your comment here..."
          class="w-full h-24 p-3 border border-gray-300 rounded-lg mb-6 bg-white text-gray-800 font-semibold"
        ></textarea>
        <button
          on:click={submitComment}
          class="bg-[#E74C3E] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#C0392B]"
          disabled={submittingComment}
        >
          {submittingComment ? "Submitting..." : "Submit Comment"}
        </button>
        <button
          on:click={viewAllComments}
          class="mt-4 text-[#E74C3E] font-semibold underline hover:no-underline"
        >
          View All Comments
        </button>
      </div>
    </div>
  </div>

  <!-- Rating Modal -->
  {#if showRatingModal}
    <div
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 class="text-xl font-bold text-[#2C3E50] mb-4">Rate Project</h2>
        <div class="flex justify-center mb-4">
          {#each [1, 2, 3, 4, 5] as star}
            <span
              class="cursor-pointer mx-1"
              on:click={() => (userScore = star)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={star <= userScore ? "#F59E0B" : "#D1D5DB"}
                class="w-8 h-8"
              >
                <path
                  d="M12 17.75l-5.45 3.6 1.95-6.22-5.5-4h6.78L12 4.5l1.72 6.64h6.78l-5.5 4 1.95 6.22z"
                />
              </svg>
            </span>
          {/each}
        </div>
        <button
          on:click={submitRating}
          class="bg-[#E74C3E] text-white font-semibold py-2 px-6 rounded-lg hover:bg-[#C0392B] w-full"
          disabled={submittingRating}
        >
          {submittingRating
            ? "Submitting..."
            : existingRating
            ? "Update Rating"
            : "Submit Rating"}
        </button>
        <button
          on:click={() => (showRatingModal = false)}
          class="text-[#2C3E50] mt-4 text-sm underline w-full text-center"
        >
          Cancel
        </button>
      </div>
    </div>
  {/if}
{/if}

<style>
  .zoom-container {
    transform: scale(0.85);
    transform-origin: center;
  }

  .container {
    max-width: 1200px;
    margin: auto;
    padding: 1rem;
  }

  .poster-image {
    max-width: 100%;
    max-height: 600px;
    object-fit: cover;
    box-shadow: none;
  }

  .comments-section {
    min-height: 200px;
  }

  .pagination-controls {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  @media (min-width: 1600px) {
    .container {
      max-width: 2000px;
    }
  }

  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }
    h1 {
      font-size: 1.75rem;
    }
    h2,
    h3 {
      font-size: 1.25rem;
    }
    p,
    span {
      font-size: 0.875rem;
    }
  }
</style>
