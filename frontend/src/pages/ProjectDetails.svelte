<script>
  import { onMount } from "svelte";
  import { loc, push } from "svelte-spa-router";
  import { authStore } from "../stores/authStore"; 
  import { get } from "svelte/store";
  

  let projectId = null;
  let project = {};
  let members = [];
  let paginatedComments = [];
  let posterUrl = "";
  let userScore = 0;
  let existingRating = null;
  let newComment = "";
  let submitCommentErrorMessage = "";
  let submitCommentSuccessMessage = "";
  let submitRatingErrorMessage = "";
  let submitRatingSuccessMessage = "";
  let submittingComment = false;
  let submittingRating = false;
  let loading = true;
  let error = "";
  let currentPage = 1;
  const commentsPerPage = 5;
  let totalPages = 1;


  let showRatingModal = false;

  let userId, roleId, token;

  $: loc.subscribe(($loc) => {
  console.log("Current location:", $loc.location);
  const pathParts = $loc.location.split("/");
  projectId = pathParts[pathParts.length - 1];
  console.log("Resolved projectId:", projectId);
});


  $: {
  console.log("Reactive block executing");
  const auth = get(authStore);

  console.log("Auth object from store:", auth);

  userId = auth?.user?.userId || null;
  token = auth?.token || null;

  const roleMapping = {
    student: 1,
    supervisor: 2,
    reviewer: 3,
    chair: 4,
    spectator: 5,
  };

  if (userId && projectId) {
      fetchUserRating();
    }
  
  if (auth?.user?.userRole && auth?.role) {
    const currentRole = roleMapping[auth.role];
    roleId = auth.user.userRole.find((r) => r.roleId === currentRole)?.roleId || null;
  } else {
    roleId = null;
  }

  console.log("Resolved values - userId:", userId, "roleId:", roleId, "token:", token);
}


  function getLanguageName(languageCode) {
    return languageCode === 1
      ? "English"
      : languageCode === 2
      ? "Polish"
      : "Unknown";
  }

  async function fetchProjectDetails() {
    console.log("Fetching project details for projectId:", projectId);

    if (!projectId) {
      error = "Project ID is missing.";
      console.error(error);
      loading = false;
      return;
    }

    if (!token) {
      console.error("Token is missing. Redirecting to login.");
      push("/login");
      return;
    }

    try {
      const response = await fetch(
        `http://192.168.0.102:8080/project/basicInfo?projectId=${projectId}`,
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

        await fetchPoster();
      } else {
        error = `Failed to load project details: ${response.status}`;
        console.error(error);
      }
    } catch (err) {
      error = `Error fetching project details: ${err.message}`;
    } finally {
      loading = false;
      console.log("Loading complete");
    }
  }

  async function fetchPoster() {
  const posterElement = project.elements?.find(
    (element) => element.elementTypeId === 5
  );
  console.log("Poster Element:", posterElement);

  if (!posterElement) {
    console.log("No poster element found.");
    return;
  }

  try {
    const response = await fetch(
      `http://192.168.0.102:8080/projectElements/retrieve?projectElementId=${posterElement.elementId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const blob = await response.blob(); // Convert response to Blob
      posterUrl = URL.createObjectURL(blob); // Create object URL for image
      console.log("Poster Blob URL:", posterUrl);
    } else {
      console.error("Failed to fetch poster. Response:", response);
    }
  } catch (err) {
    console.error(`Error fetching poster: ${err.message}`);
  }
}



async function fetchUserRating() {
  if (!userId || !projectId) {
    console.error("Missing userId or projectId.");
    return;
  }

  try {
    const response = await fetch(
      `http://192.168.0.102:8080/evaluations/getEvaluation?projectId=${projectId}&userId=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        existingRating = data.data;
        userScore = existingRating?.score || 0; // Update the score
      }
    } else {
      console.error("Failed to fetch user rating. Response:", response);
    }
  } catch (err) {
    console.error(`Error fetching user rating: ${err.message}`);
  }
}


  async function submitComment() {
  console.log("Debugging submitComment:");
  console.log("projectId:", projectId);
  console.log("userId (from authStore):", userId);
  console.log("roleId (resolved from authStore):", roleId); // Log the roleId
  console.log("newComment:", newComment.trim());
  console.log("Token:", token);

  if (!newComment.trim() || !userId || !projectId) {
    submitCommentErrorMessage =
      "Please provide all required fields: project ID, user ID, and comment.";
    console.error(submitCommentErrorMessage);
    return;
  }

  submittingComment = true;

  const payload = {
    projectId: Number(projectId),
    userId: Number(userId),
    roleId: Number(roleId), // Explicitly include roleId
    review: newComment.trim(),
    isPublic: true,
  };

  console.log("Payload being sent:", JSON.stringify(payload));

  try {
    const response = await fetch(`http://192.168.0.102:8080/reviews/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      console.error("Error response from server:", errorDetails);

      submitCommentErrorMessage =
        errorDetails.message || "Failed to submit the comment.";
    } else {
      const successData = await response.json();
      console.log("Server success response:", successData);

      submitCommentSuccessMessage = "Comment submitted successfully!";
      newComment = ""; // Clear the input
      await fetchProjectDetails(); // Refresh project details to update the comments list
    }
  } catch (err) {
    console.error("Error while submitting comment:", err);
    submitCommentErrorMessage = `Error: ${err.message}`;
  } finally {
    submittingComment = false; // Reset the submitting state
  }
}




async function submitRating() {
  if (userScore === 0) {
    submitRatingErrorMessage = "Please select a rating.";
    return;
  }

  submittingRating = true;

  const payload = existingRating
    ? {
        evaluationId: existingRating.evaluationId,
        score: userScore,
        userId: Number(userId), 
        roleId: Number(roleId),
      }
    : {
        projectId: Number(projectId),
        score: userScore,
        userId: Number(userId), 
        roleId: Number(roleId), 
      };

  const apiUrl = existingRating
    ? "http://192.168.0.102:8080/evaluations/update"
    : "http://192.168.0.102:8080/evaluations/add";

  const method = existingRating ? "PUT" : "POST";

  try {
    const response = await fetch(apiUrl, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      submitRatingSuccessMessage = "Rating submitted successfully!";
      await fetchUserRating(); // Refresh user rating
    } else {
      const result = await response.json();
      submitRatingErrorMessage =
        result.message || "Failed to submit the rating.";
    }
  } catch (err) {
    submitRatingErrorMessage = `Error: ${err.message}`;
  } finally {
    submittingRating = false;
    showRatingModal = false;
  }
}


  function paginateComments(reviews) {
    const start = (currentPage - 1) * commentsPerPage;
    const end = start + commentsPerPage;
    paginatedComments = reviews.slice(start, end);
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


  onMount(() => {
  fetchProjectDetails().then(() => {
    fetchUserRating(); // Fetch user rating after project details are loaded
  });
});

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
    <p class="text-[#2C3E50] font-semibold">
      {comment.fullname || "Unknown User"}:
    </p>
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
</style>