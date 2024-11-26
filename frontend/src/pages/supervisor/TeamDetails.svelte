   <!-- <script>
    import { onMount } from "svelte";
    import { loc, push } from "svelte-spa-router";
  
    let teamId = null;
    let team = {};
    let members = [];
    let selectedRating = 0;
    let evaluationComment = "";
    let submitting = false;
    let removingStudent = false;
    let loading = true;
    let error = "";
    let notification = "";
    let posterUrl = "";
  
    const userId = 5;
    const evaluationRoleId = 2;
  
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
          `http://localhost:8080/zpi/project/basicInfo?projectId=${teamId}`
        );
        if (response.ok) {
          const data = await response.json();
          team = data;
          members = team.userRole?.filter((member) => member.roles?.roleName === "student") || [];
          fetchPoster(team.posterElementId);
        } else {
          error = "Failed to load team details.";
        }
      } catch (err) {
        error = `Error fetching team details: ${err.message}`;
      } finally {
        loading = false;
      }
    }
  
    async function fetchPoster(posterElementId) {
      if (!posterElementId) return;
      try {
        const response = await fetch(
          `http://localhost:8080/zpi/projectElements/retrieve?projectElementId=${posterElementId}`
        );
        if (response.ok) {
          posterUrl = response.url;
        } else {
          notification = "Failed to fetch poster image.";
        }
      } catch (err) {
        notification = `Error fetching poster image: ${err.message}`;
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
          `http://localhost:8080/zpi/evaluations/add`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              projectId: teamId,
              userId: userId,
              evaluationRoleId,
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
      `http://localhost:8080/zpi/userRole/removeStudentsFromProject?projectId=${teamId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

    onMount(fetchTeamDetails);
  </script>
  
  <div class="min-h-screen bg-[#F7F9F9] pt-28 px-4">
    {#if loading}
      <div class="text-center text-xl text-[#2C3E50]">Loading team details...</div>
    {:else if error}
      <div class="text-center text-xl text-red-600">{error}</div>
    {:else}
      <div class="container mx-auto p-6 bg-white rounded-lg shadow-lg mt-10 max-w-6xl">
        {#if notification}
          <div class="p-4 mb-4 rounded-md" class:success={notification.includes("successfully")} class:error={!notification.includes("successfully")}>
            {notification}
          </div>
        {/if}
  
        <div>
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
                    <div class="bg-white p-3 border-l-4 border-[#E74C3C] rounded-lg flex justify-between items-center text-[#2C3E50] font-semibold">
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
                <img src={posterUrl} alt="Team Poster" class="rounded-lg shadow-lg w-full lg:w-auto h-auto max-h-[600px]" />
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
            <button
              on:click={() => push(`/files/${teamId}`)}
              class="bg-[#E74C3C] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#C0392B] mt-4"
            >
              View Files Uploaded
            </button>
          </div>
        </div>
      </div>
    {/if}
  </div>
  
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
    let showEvaluationDetails = false; // Toggle to view evaluation details
  
    const userId = 5;
    const evaluationRoleId = 2;
  
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
          `http://localhost:8080/zpi/project/basicInfo?projectId=${teamId}`
        );
        if (response.ok) {
          const data = await response.json();
          team = data;
          members =
            team.userRole?.filter((member) => member.roles?.roleName === "student") || [];
          await fetchPoster(team.posterElementId);
          await fetchUserEvaluation(); // Fetch existing evaluation details
        } else {
          error = "Failed to load team details.";
        }
      } catch (err) {
        error = `Error fetching team details: ${err.message}`;
      } finally {
        loading = false;
      }
    }
  
    async function fetchPoster(posterElementId) {
      if (!posterElementId) return;
      try {
        const response = await fetch(
          `http://localhost:8080/zpi/projectElements/retrieve?projectElementId=${posterElementId}`
        );
        if (response.ok) {
          posterUrl = response.url;
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
          `http://localhost:8080/zpi/evaluations/getEvaluation?projectId=${teamId}&userId=${userId}&evaluationRoleId=${evaluationRoleId}`
        );
  
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            existingEvaluation = data.data;
            selectedRating = existingEvaluation.score || 0; // Set the existing score
            evaluationComment = existingEvaluation.comment || ""; // Set the existing comment
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
          `http://localhost:8080/zpi/evaluations/add`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              projectId: teamId,
              userId: userId,
              evaluationRoleId,
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
          await fetchUserEvaluation(); // Refresh evaluation details
          await fetchTeamDetails(); // Refresh team details
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
  
    function toggleEvaluationDetails() {
      showEvaluationDetails = !showEvaluationDetails;
    }
  
    async function removeStudent(studentId) {
      if (!confirm("Are you sure you want to remove this student from the project?")) {
        return;
      }
  
      removingStudent = true;
      try {
        const response = await fetch(
          `http://localhost:8080/zpi/userRole/removeStudentsFromProject?projectId=${teamId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
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
  
    onMount(fetchTeamDetails);
  </script>
  
  <div class="min-h-screen bg-[#F7F9F9] pt-28 px-4">
    {#if loading}
      <div class="text-center text-xl text-[#2C3E50]">Loading team details...</div>
    {:else if error}
      <div class="text-center text-xl text-red-600">{error}</div>
    {:else}
      <div class="container mx-auto p-6 bg-white rounded-lg shadow-lg mt-10 max-w-6xl">
        {#if notification}
          <div class="p-4 mb-4 rounded-md" class:success={notification.includes("successfully")} class:error={!notification.includes("successfully")}>
            {notification}
          </div>
        {/if}
  
        <div>
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
                    <div class="bg-white p-3 border-l-4 border-[#E74C3C] rounded-lg flex justify-between items-center text-[#2C3E50] font-semibold">
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
                <img src={posterUrl} alt="Team Poster" class="rounded-lg shadow-lg w-full lg:w-auto h-auto max-h-[600px]" />
              {/if}
            </div>
          </div>
  
          <div class="bg-[#F5F5F5] p-6 rounded-lg shadow-inner mt-10">
            <h2 class="text-2xl font-bold text-[#2C3E50] mb-4">Provide Your Evaluation</h2>
  
            {#if existingEvaluation}
              <p class="mb-4 text-gray-600">
                <strong>Existing Rating:</strong> {existingEvaluation.score || "Not Rated"}
              </p>
              <p class="mb-4 text-gray-600">
                <strong>Existing Comment:</strong> {existingEvaluation.comment || "No comment provided"}
              </p>
              <a
                href={`#/evaluations/${teamId}`}
                class="text-sm text-red-500 underline hover:text-gray-700"
              >
                View Evaluation
              </a>
            {/if}
  
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
  
            <button
              on:click={() => push(`/files/${teamId}`)}
              class="bg-[#E74C3C] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#C0392B] mt-4"
            >
              View Files Uploaded
            </button>
          </div>
        </div>
      </div>
    {/if}
  </div>
  
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
  