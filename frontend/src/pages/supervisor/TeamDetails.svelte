   <!-- <script>
    import { onMount } from "svelte";
    import { loc, push } from "svelte-spa-router";
    import { authStore } from "../../stores/authStore"; 
    import { get } from "svelte/store";
  
    let teamId = null;
    let team = {};
    let members = [];
    let selectedRating = 0;
    let evaluationComment = "";
    let existingEvaluation = null;
    let submitting = false;
    let removingStudent = false;
    let loading = true;
    let error = "";
    let notification = "";
    let posterUrl = "";
    let showEvaluationDetails = false;
  
    let userId, token;

    $: {
    const auth = get(authStore);
    userId = auth?.user?.userId || null; // Retrieve userId
    token = auth?.token || null;        // Retrieve token
  }
  
    $: loc.subscribe(($loc) => {
      const pathParts = $loc.location.split("/");
      teamId = pathParts[pathParts.length - 1];
    });
  
    async function fetchTeamDetails() {
      if (!teamId) {
        error = "Team ID is missing.";
        loading = false;
        return;
      }
  
      try {
        const response = await fetch(
        `http://localhost:8080/project/basicInfo?projectId=${teamId}`,
        {
          headers: { Authorization: `Bearer ${token}` }, // Pass token
        }
      );

        if (response.ok) {
          const data = await response.json();
          team = data;
          members =
            team.userRole?.filter((member) => member.roles?.roleName === "student") || [];
          await fetchPoster(); // Fetch the poster dynamically
          await fetchUserEvaluation(); // Fetch user evaluation
        } else {
          error = "Failed to load team details.";
        }
      } catch (err) {
        error = `Error fetching team details: ${err.message}`;
      } finally {
        loading = false;
      }
    }
  
    async function fetchPoster() {
      const posterElement = team.elements?.find(
        (element) => element.elementTypeId === 5
      ); // Poster is elementTypeId 5
      if (!posterElement) return;
  
      try {
        const response = await fetch(
        `http://localhost:8080/projectElements/retrieve?projectElementId=${posterElement.elementId}`,
        {
          headers: { Authorization: `Bearer ${token}` }, // Pass token
        }
      );
        if (response.ok) {
          posterUrl = response.url; // Dynamically set poster URL
        } else {
          notification = "Failed to fetch poster image.";
        }
      } catch (err) {
        notification = `Error fetching poster image: ${err.message}`;
      }
    }
  
    async function fetchUserEvaluation() {
      try {
        const response = await fetch(
        `http://localhost:8080/evaluations/getEvaluation?projectId=${teamId}&userId=${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` }, // Pass token
        }
      );
  
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            existingEvaluation = data.data;
            selectedRating = existingEvaluation.score || 0;
            evaluationComment = existingEvaluation.comment || "";
          }
        }
      } catch (err) {
        notification = `Error fetching user evaluation: ${err.message}`;
      }
    }
  
    async function submitEvaluation() {
      if (!evaluationComment.trim()) {
        notification = "Please provide a comment for your evaluation.";
        return;
      }
  
      submitting = true;
      try {
        const response = await fetch(
          `http://localhost:8080/evaluations/add`,
          {
            method: "POST",
            headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Pass token
          },
            body: JSON.stringify({
              projectId: teamId,
              userId: userId,
              score: selectedRating,
              comment: evaluationComment,
              isPublic: 1,
            }),
          }
        );
  
        const responseData = await response.json();
        if (response.ok && responseData.success) {
          notification = "Evaluation submitted successfully.";
          evaluationComment = "";
          selectedRating = 0;
          await fetchUserEvaluation();
          await fetchTeamDetails();
        } else if (responseData.message) {
          notification = responseData.message;
        } else {
          notification = "Failed to submit evaluation.";
        }
      } catch (err) {
        notification = `Error submitting evaluation: ${err.message}`;
      } finally {
        submitting = false;
      }
    }
  
    async function removeStudent(studentId) {
      if (!confirm("Are you sure you want to remove this student from the project?")) {
        return;
      }
  
      removingStudent = true;
      try {
        const response = await fetch(
        `http://localhost:8080/userRole/removeStudentsFromProject?projectId=${teamId}`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Pass token
          },
          body: JSON.stringify([studentId]),
        }
      );
  
        const responseData = await response.json();
        if (response.ok && responseData.success) {
          notification = "Student removed successfully.";
          await fetchTeamDetails();
        } else {
          notification = responseData.message || "Failed to remove student.";
        }
      } catch (err) {
        notification = `Error removing student: ${err.message}`;
      } finally {
        removingStudent = false;
      }
    }
  
    function toggleEvaluationDetails() {
      showEvaluationDetails = !showEvaluationDetails;
    }
  
    onMount(fetchTeamDetails);
  </script>
  
  {#if loading}
    <div class="text-center text-xl text-[#2C3E50]">Loading team details...</div>
  {:else if error}
    <div class="text-center text-xl text-red-600">{error}</div>
  {:else}
    <div class="min-h-screen bg-[#F7F9F9] pt-28 px-4">
      {#if notification}
        <div
          class="p-4 mb-4 rounded-md"
          class:success={notification.includes("successfully")}
          class:error={!notification.includes("successfully")}
        >
          {notification}
        </div>
      {/if}
  
      <div class="container mx-auto p-6 bg-white rounded-lg shadow-lg mt-10 max-w-6xl">
        <div class="flex flex-col lg:flex-row justify-between gap-6">
          <div class="lg:w-2/3">
            <h1 class="text-4xl font-bold text-[#2C3E50] mb-4">
              {team.title} ({team.acronym || "N/A"})
            </h1>
            <h2 class="text-xl font-bold text-[#2C3E50] mb-2">Team Description</h2>
            <p class="text-lg text-[#7F8C8D] mb-6">
              {team.description || "No description available."}
            </p>
  
            <div class="bg-[#ECF0F1] p-4 rounded-lg mb-6">
              <h3 class="text-lg font-bold text-[#2C3E50] mb-4">Team Members</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {#each members as member}
                  <div
                    class="bg-white p-3 border-l-4 border-[#E74C3C] rounded-lg flex justify-between items-center text-[#2C3E50] font-semibold"
                  >
                    <span>{member.users.firstName} {member.users.lastName}</span>
                    <button
                      class="bg-[#E74C3C] text-white py-1 px-3 rounded-md text-sm hover:bg-[#C0392B] transition"
                      on:click={() => removeStudent(member.users.userId)}
                      disabled={removingStudent}
                    >
                      {removingStudent ? "Removing..." : "Remove"}
                    </button>
                  </div>
                {/each}
              </div>
            </div>
          </div>
  
          <div class="lg:w-1/3 flex justify-center lg:justify-end">
            {#if posterUrl}
              <img
                src={posterUrl}
                alt="Team Poster"
                class="rounded-lg shadow-lg w-full lg:w-auto h-auto max-h-[600px]"
              />
            {/if}
          </div>
        </div>
  
        <div class="bg-[#F5F5F5] p-6 rounded-lg shadow-inner mt-10">
          <h2 class="text-2xl font-bold text-[#2C3E50] mb-4">Provide Your Evaluation</h2>
  
          <div class="flex items-center mb-6">
            <p class="mr-4 font-semibold text-[#2C3E50]">Score:</p>
            {#each [1, 2, 3, 4, 5] as star}
              <span
                on:click={() => (selectedRating = star)}
                class="cursor-pointer mx-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={star <= selectedRating ? "#F59E0B" : "#D1D5DB"}
                  class="w-8 h-8"
                >
                  <path d="M12 17.75l-5.45 3.6 1.95-6.22-5.5-4h6.78L12 4.5l1.72 6.64h6.78l-5.5 4 1.95 6.22z" />
                </svg>
              </span>
            {/each}
          </div>
  
          <textarea
            bind:value={evaluationComment}
            rows="4"
            placeholder="Write your feedback here..."
            class="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E74C3C] text-[#2C3E50] placeholder-gray-400 bg-white resize-none mb-4"
          ></textarea>
  
          <button
            on:click={submitEvaluation}
            class="bg-[#E74C3C] text-white py-2 px-6 rounded-md font-semibold hover:bg-[#C0392B] transition duration-200"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Evaluation"}
          </button>
        </div>
      </div>
    </div>
  {/if}
  
  <style>
    .success {
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }
    .error {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
    .container {
      max-width: 1200px;
      margin: auto;
      padding: 1rem;
    }
  
    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }
      .text-4xl {
        font-size: 1.75rem;
      }
      .text-2xl {
        font-size: 1.5rem;
      }
    }
  
    @media (min-width: 1600px) {
      .container {
        max-width: 1400px;
      }
      .text-4xl {
        font-size: 3rem;
      }
      .text-2xl {
        font-size: 2rem;
      }
    }
  </style>
   -->


   <script>
    import { onMount } from "svelte";
    import { loc, push } from "svelte-spa-router";
    import { authStore } from "../../stores/authStore";
    import { get } from "svelte/store";
  
    let teamId = null;
    let team = {};
    let members = [];
    let selectedRating = 0;
    let evaluationComment = "";
    let existingEvaluation = null;
    let isEvaluationComplete = false;
    let submitting = false;
    let loading = true;
    let error = "";
    let notification = "";
    let posterUrl = "";
    let showEvaluationDetails = false;
    let removingStudent = false;
    
  
    let token;
    let userId;
    // const userId = 8;
    // const evaluationRoleId = 1;
  
    $: {
      const auth = get(authStore);
      token = auth?.token;
      userId = auth?.user?.userId;
    }
    $: loc.subscribe(($loc) => {
  const pathParts = $loc.location.split("/");
  teamId = pathParts[pathParts.length - 1];
  console.log("Extracted teamId:", teamId); // Debug log
});

  
    async function fetchProjectDetails() {
      if (!teamId) {
        error = "Team ID is missing.";
        loading = false;
        return;
      }
  
      try {
        console.log("Fetching team details with teamId:", teamId);
        const response = await fetch(
          `http://localhost:8080/project/basicInfo?projectId=${teamId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
  
        if (response.ok) {
          const data = await response.json();
          team = data;
          members =
            team.userRole?.filter(
              (member) => member.roles?.roleName === "student"
            ) || [];
          await fetchPoster();
          await fetchUserRating();
        } else {
          error = "Failed to load project details.";
        }
      } catch (err) {
        error = `Error fetching project details: ${err.message}`;
      } finally {
        loading = false;
      }
    }
  

    async function removeStudent(studentId) {
    if (
      !confirm("Are you sure you want to remove this student from the project?")
    ) {
      return;
    }

    removingStudent = true;
    try {
      const response = await fetch(
        `http://localhost:8080/userRole/removeStudentsFromProject?projectId=${teamId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify([studentId]),
        }
      );

      const responseData = await response.json();
      if (response.ok && responseData.success) {
        notification = "Student removed successfully.";
        await fetchProjectDetails(); // Refresh the members list
      } else {
        notification = responseData.message || "Failed to remove student.";
      }
    } catch (err) {
      notification = `Error removing student: ${err.message}`;
    } finally {
      removingStudent = false;
    }
  }

    async function fetchPoster() {
    const posterElement = team.elements?.find(
      (element) => element.elementTypeId === 5
    );
  
    if (!posterElement) return;
  
    try {
      const response = await fetch(
        `http://localhost:8080/projectElements/retrieve?projectElementId=${posterElement.elementId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (response.ok) {
        const blob = await response.blob(); // Convert response to Blob
        posterUrl = URL.createObjectURL(blob); // Create a Blob URL for the image
      } else {
        notification = "Failed to fetch poster image.";
        console.error("Poster fetch failed with status:", response.status);
      }
    } catch (err) {
      notification = `Error fetching poster image: ${err.message}`;
      console.error("Error:", err.message);
    }
  }
  
  async function fetchUserRating() {
    try {
      const response = await fetch(
        `http://localhost:8080/evaluations/getEvaluation?projectId=${teamId}&userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.ok) {
        const data = await response.json();
        existingEvaluation = data.success ? data.data : null;
  
        // Set score and comment from existing evaluation
        if (existingEvaluation) {
          selectedRating = existingEvaluation.score || 0;
          evaluationComment = existingEvaluation.comment || "";
        }
      } else {
        console.error("Failed to fetch user rating.");
        existingEvaluation = null; // Reset to ensure it's falsy
      }
    } catch (err) {
      console.error(`Error fetching user rating: ${err.message}`);
      existingEvaluation = null; // Reset on error
    } finally {
        isEvaluationComplete =
          existingEvaluation &&
          existingEvaluation.score !== null &&
          existingEvaluation.comment.trim() !== "";
      }
  }
  
  
  
  async function submitEvaluation() {
    if (!evaluationComment.trim()) {
      notification = "Please provide a comment for your evaluation.";
      return;
    }
  
    submitting = true;
  
    const payload = {
      teamId,
      userId: Number(userId),
      score: selectedRating,
      comment: evaluationComment,
      isPublic: 1,
    };
  
    // const hasReviewed = existingEvaluation && existingEvaluation.score !== null && existingEvaluation.comment.trim() !== "";
  
    const apiUrl = isEvaluationComplete
        ? `http://localhost:8080/evaluations/update`
        : `http://localhost:8080/evaluations/add`;
  
  
    // const method = hasReviewed ? "PUT" : "POST";
  
    try {
        const response = await fetch(apiUrl, {
          method: isEvaluationComplete ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(
            isEvaluationComplete
              ? { ...payload, evaluationId: existingEvaluation.evaluationId }
              : payload
          ),
        });
  
      const result = await response.json();
      if (response.ok && result.success) {
          notification = isEvaluationComplete
          ? "Evaluation updated successfully."
          : "Evaluation submitted successfully.";
  
        await fetchUserRating();
      } else {
        notification = result.message || "Failed to submit evaluation.";
      }
    } catch (err) {
      notification = `Error submitting evaluation: ${err.message}`;
    } finally {
      submitting = false;
    }
  }
  
  
    function toggleEvaluationDetails() {
      showEvaluationDetails = !showEvaluationDetails;
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
    <div class="container mx-auto p-6 bg-white rounded-lg shadow-lg mt-20 max-w-6xl">
      <!-- Notification for any alerts -->
      {#if notification}
        <div class="bg-yellow-100 text-yellow-800 p-4 rounded-md mb-4">
          {notification}
        </div>
      {/if}
  
      <!-- Project Information -->
      <div>
        <div class="flex flex-col lg:flex-row justify-between">
          <!-- Left Side: Project Title, Description, and Members -->
          <div class="lg:w-2/3">
            <h1 class="text-4xl font-bold text-[#2C3E50] mb-4">
              {team.title} ({team.acronym || "N/A"})
            </h1>
            <h2 class="text-xl font-bold text-[#2C3E50] mb-2">Project Description</h2>
            <p class="text-lg text-[#7F8C8D] mb-6">
              {team.description || "No description available."}
            </p>
  
            <!-- Team Members Section -->
            <div class="bg-[#ECF0F1] p-4 rounded-lg mb-6">
              <h3 class="text-lg font-bold text-[#2C3E50] mb-4">Team Members</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {#each members as member}
                  <div
                    class="bg-white p-3 border-l-4 border-[#E74C3C] rounded-lg flex justify-between items-center text-[#2C3E50] font-semibold"
                  >
                    <span>{member.users.firstName} {member.users.lastName}</span>
                    <button
                      class="bg-[#E74C3C] text-white py-1 px-3 rounded-md text-sm hover:bg-[#C0392B] transition"
                      on:click={() => removeStudent(member.users.userId)}
                      disabled={removingStudent}
                    >
                      {removingStudent ? "Removing..." : "Remove"}
                    </button>
                  </div>
                {/each}
              </div>
            </div>
          </div>
  
          <!-- Right Side: Poster Display -->
          <div class="lg:w-1/3 lg:pl-6 flex justify-center lg:justify-end">
            {#if posterUrl}
              <img
                src={posterUrl}
                alt="Project Poster"
                class="rounded-lg shadow-lg w-full lg:w-auto h-auto max-h-[600px]"
              />
            {/if}
          </div>
        </div>
  
        <!-- Evaluation Section -->
        <div class="bg-[#F5F5F5] p-6 rounded-lg shadow-inner mt-10">
          <!-- Dynamic Heading -->
          <h2 class="text-2xl font-bold text-[#2C3E50] mb-4">
            {existingEvaluation ? "Edit Your Evaluation" : "Provide Your Evaluation"}
          </h2>
  
          <!-- Rating (Stars) -->
          <div class="flex items-center mb-6">
            <p class="mr-4 font-semibold text-[#2C3E50]">Score:</p>
            {#each [1, 2, 3, 4, 5] as star}
              <span
                on:click={() => (selectedRating = star)}
                class="cursor-pointer mx-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={star <= selectedRating ? "#F59E0B" : "#D1D5DB"}
                  class="w-8 h-8"
                >
                  <path
                    d="M12 17.75l-5.45 3.6 1.95-6.22-5.5-4h6.78L12 4.5l1.72 6.64h6.78l-5.5 4 1.95 6.22z"
                  />
                </svg>
              </span>
            {/each}
          </div>
  
          <!-- Comment Input -->
          <textarea
            bind:value={evaluationComment}
            rows="4"
            placeholder="Write your feedback here..."
            class="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E74C3C] text-[#2C3E50] placeholder-gray-400 bg-white resize-none mb-4"
          ></textarea>
  
          <!-- Submit or Update Button -->
          <button
            on:click={submitEvaluation}
            class="bg-[#E74C3C] text-white py-2 px-6 rounded-md font-semibold hover:bg-[#C0392B] transition duration-200"
            disabled={submitting}
          >
            {submitting
              ? "Submitting..."
              : isEvaluationComplete
              ? "Update Evaluation"
              : "Submit Evaluation"}
          </button>
  
          <!-- Navigate to Files Button -->
          <button
            on:click={() => push(`/files/${teamId}`)}
            class="bg-[#E74C3C] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#C0392B] mt-4"
          >
            View Files Uploaded
          </button>
  
          <!-- Toggle Evaluation Details -->
          {#if existingEvaluation}
            <button
              on:click={toggleEvaluationDetails}
              class="text-[#2C3E50] underline text-sm mt-4 hover:text-[#2C3E50]"
            >
              {showEvaluationDetails ? "Hide Evaluation" : "View Evaluation"}
            </button>
  
            <!-- Display Evaluation Details -->
            {#if showEvaluationDetails}
              <div class="mt-4">
                <p class="text-gray-700">
                  <strong>Score:</strong> {existingEvaluation.score || "Not Rated"}
                </p>
                <p class="text-gray-700">
                  <strong>Comment:</strong> {existingEvaluation.comment || "No comment provided"}
                </p>
              </div>
            {/if}
          {/if}
        </div>
      </div>
    </div>
  {/if}
  
  <style>
    .container {
      max-width: 1200px;
      padding: 1rem;
      width: 90%;
    }
  
    .rounded-lg {
      border-radius: 0.5rem;
    }
  
    @media (max-width: 768px) {
      h1 {
        font-size: 1.75rem;
      }
    }
  
    @media (min-width: 1600px) {
      .container {
        max-width: 1400px;
      }
      h1 {
        font-size: 3rem;
      }
    }
  </style>
  