<!-- <script>
  import { onMount } from "svelte";
  import { currentProjectId } from "../../projectStore";

  let projectId = null;
  let project = {};
  let members = [];
  let loading = true;
  let error = "";
  let posterUrl = "";
  let uploadedFiles = [];

  $: currentProjectId.subscribe((value) => {
    projectId = value;
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
      error = "Project ID is missing";
      loading = false;
      return;
    }

    try {
      const response = await fetch(
        `http://192.168.0.107:8080/zpi/project/basicInfo?projectId=${projectId}`
      );
      if (response.ok) {
        const data = await response.json();

        project = data;
        members =
          project.userRole?.filter(
            (member) => member.roles?.roleName === "student"
          ) || [];
        fetchPoster(12);
        await fetchUploadedFiles();
      } else {
        error = "Failed to load project details.";
      }
    } catch (err) {
      error = `Error fetching project details: ${err.message}`;
    } finally {
      loading = false;
    }
  }

  async function fetchPoster(projectElementId) {
    try {
      const response = await fetch(
        `http://192.168.0.107:8080/zpi/projectElements/retrieve?projectElementId=${projectElementId}`
      );
      if (response.ok) {
        posterUrl = response.url;
      } else {
        console.error("Failed to fetch poster image.");
      }
    } catch (err) {
      console.error(`Error fetching poster image: ${err.message}`);
    }
  }

  async function fetchUploadedFiles() {
    try {
      const response = await fetch(
        `http://192.168.0.107:8080/zpi/project/files?projectId=${projectId}`
      );
      if (response.ok) {
        uploadedFiles = await response.json();
      } else {
        console.error("Failed to fetch uploaded files.");
      }
    } catch (err) {
      console.error(`Error fetching uploaded files: ${err.message}`);
    }
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
    class="zoom-container container mx-auto p-6 bg-white rounded-lg shadow-lg mt-20 max-w-6xl h-[650px] overflow-hidden"
  >
    <div class="h-full overflow-y-auto p-4">
      <div class="flex flex-col lg:flex-row justify-between">
        <div class="lg:w-2/3">
          <h1 class="text-4xl font-bold text-[#2C3E50] mb-4">
            {project.title} ({project.acronym || "N/A"})
          </h1>

          <h2 class="text-xl font-bold text-[#2C3E50] mb-2">
            Project Description
          </h2>
          <p class="text-lg text-[#7F8C8D] mb-6">
            {project.description || "No description available."}
          </p>

          <h3 class="text-lg font-bold text-[#2C3E50] mb-2">
            Technologies Used:
          </h3>
          <p class="text-[#7F8C8D] font-medium mb-6">
            {project.keywords || "Not specified"}
          </p>

          <div class="flex space-x-10 mb-6">
            <div>
              <h3 class="text-lg font-bold text-[#2C3E50]">Language:</h3>
              <p class="text-[#7F8C8D]">{getLanguageName(project.language)}</p>
            </div>
            <div>
              <h3 class="text-lg font-bold text-[#2C3E50]">Year:</h3>
              <p class="text-[#7F8C8D]">{project.year || "Not specified"}</p>
            </div>
          </div>

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
            <img
              src={posterUrl}
              alt="Project Poster"
              class="rounded-lg shadow-lg w-full lg:w-auto h-auto max-h-[600px]"
            />
          {/if}
        </div>
      </div>

      <div class="mt-10">
        <h2 class="text-2xl font-bold text-[#2C3E50] mb-4">Uploaded Files</h2>
        {#if uploadedFiles.length > 0}
          <ul class="list-disc list-inside text-[#34495E]">
            {#each uploadedFiles as file}
              <li>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-[#E74C3C] underline"
                  >{file.name || "Unnamed File"}</a
                >
              </li>
            {/each}
          </ul>
        {:else}
          <p class="text-gray-600">No files uploaded for this project.</p>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .zoom-container {
    transform: scale(0.85);
    transform-origin: center;
  }

  .container {
    max-width: 1200px;
    height: 700px;
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

<!-- <script>
  import { onMount } from "svelte";
  import { currentProjectId } from "../../projectStore";

  let projectId = null;
  let project = {};
  let members = [];
  let loading = true;
  let error = "";
  let posterUrl = "";
  let uploadedFiles = [];

  $: currentProjectId.subscribe((value) => {
    projectId = value;
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
      error = "Project ID is missing";
      loading = false;
      return;
    }

    try {
      const response = await fetch(
        `http://192.168.0.107:8080/zpi/project/basicInfo?projectId=${projectId}`
      );
      if (response.ok) {
        const data = await response.json();

        project = data;
        members =
          project.userRole?.filter(
            (member) => member.roles?.roleName === "student"
          ) || [];
        fetchPoster(12);
        await fetchUploadedFiles();
      } else {
        error = "Failed to load project details.";
      }
    } catch (err) {
      error = `Error fetching project details: ${err.message}`;
    } finally {
      loading = false;
    }
  }

  async function fetchPoster(projectElementId) {
    try {
      const response = await fetch(
        `http://192.168.0.107:8080/zpi/projectElements/retrieve?projectElementId=${projectElementId}`
      );
      if (response.ok) {
        posterUrl = response.url;
      } else {
        console.error("Failed to fetch poster image.");
      }
    } catch (err) {
      console.error(`Error fetching poster image: ${err.message}`);
    }
  }

  async function fetchUploadedFiles() {
    try {
      const response = await fetch(
        `http://192.168.0.107:8080/zpi/project/files?projectId=${projectId}`
      );
      if (response.ok) {
        uploadedFiles = await response.json();
      } else {
        console.error("Failed to fetch uploaded files.");
      }
    } catch (err) {
      console.error(`Error fetching uploaded files: ${err.message}`);
    }
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
    class="container mx-auto p-6 bg-white rounded-lg shadow-lg mt-20 max-w-6xl"
  >
    <div class="p-4">
      <div class="flex flex-col lg:flex-row justify-between">
        <div class="lg:w-2/3">
          <h1 class="text-4xl font-bold text-[#2C3E50] mb-4">
            {project.title} ({project.acronym || "N/A"})
          </h1>

          <h2 class="text-xl font-bold text-[#2C3E50] mb-2">
            Project Description
          </h2>
          <p class="text-lg text-[#7F8C8D] mb-6">
            {project.description || "No description available."}
          </p>

          <h3 class="text-lg font-bold text-[#2C3E50] mb-2">
            Technologies Used:
          </h3>
          <p class="text-[#7F8C8D] font-medium mb-6">
            {project.keywords || "Not specified"}
          </p>

          <div class="flex space-x-10 mb-6">
            <div>
              <h3 class="text-lg font-bold text-[#2C3E50]">Language:</h3>
              <p class="text-[#7F8C8D]">{getLanguageName(project.language)}</p>
            </div>
            <div>
              <h3 class="text-lg font-bold text-[#2C3E50]">Year:</h3>
              <p class="text-[#7F8C8D]">{project.year || "Not specified"}</p>
            </div>
          </div>

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
            <img
              src={posterUrl}
              alt="Project Poster"
              class="rounded-lg shadow-lg w-full lg:w-auto h-auto max-h-[600px]"
            />
          {/if}
        </div>
      </div>

      <div class="mt-10">
        <h2 class="text-2xl font-bold text-[#2C3E50] mb-4">Uploaded Files</h2>
        {#if uploadedFiles.length > 0}
          <ul class="list-disc list-inside text-[#34495E]">
            {#each uploadedFiles as file}
              <li>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-[#E74C3C] underline"
                  >{file.name || "Unnamed File"}</a
                >
              </li>
            {/each}
          </ul>
        {:else}
          <p class="text-gray-600">No files uploaded for this project.</p>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .container {
    max-width: 1200px;
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

  @media (min-width: 1600px) {
    .container {
      max-width: 1600px;
      padding: 2rem;
    }

    h1 {
      font-size: 2.5rem;
    }

    h2,
    h3 {
      font-size: 1.75rem;
    }

    p,
    span {
      font-size: 1rem;
    }
  }
</style> -->
<!-- <script>
  import { onMount } from "svelte";
  import { currentProjectId } from "../../projectStore";

  let projectId = null;
  let project = {};
  let members = [];
  let elements = [];
  let loading = true;
  let error = "";
  let posterUrl = "";
  let uploadedFiles = [];
  let comments = {};

  $: currentProjectId.subscribe((value) => {
    projectId = value;
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
      error = "Project ID is missing";
      loading = false;
      return;
    }

    try {
      const response = await fetch(
        `http://192.168.0.107:8080/zpi/project/basicInfo?projectId=${projectId}`
      );
      if (response.ok) {
        const data = await response.json();

        project = data;
        members =
          project.userRole?.filter(
            (member) => member.roles?.roleName === "student"
          ) || [];
        await fetchUploadedFiles();
        await fetchCommentsForElements();
      } else {
        error = "Failed to load project details.";
      }
    } catch (err) {
      error = `Error fetching project details: ${err.message}`;
    } finally {
      loading = false;
    }
  }

  async function fetchUploadedFiles() {
    try {
      const response = await fetch(
        `http://192.168.0.107:8080/zpi/project/basicInfo?projectId=${projectId}`
      );
      if (response.ok) {
        uploadedFiles = await response.json();
        elements = uploadedFiles;
      } else {
        console.error("Failed to fetch uploaded files.");
      }
    } catch (err) {
      console.error(`Error fetching uploaded files: ${err.message}`);
    }
  }

  async function fetchCommentsForElements() {
    try {
      const response = await fetch(
        `http://192.168.0.107:8080/zpi/comments/list?projectId=${projectId}`
      );
      if (response.ok) {
        const data = await response.json();
        comments = data.reduce((acc, comment) => {
          if (!acc[comment.elementId]) acc[comment.elementId] = [];
          acc[comment.elementId].push(comment);
          return acc;
        }, {});
      } else {
        console.error("Failed to fetch comments.");
      }
    } catch (err) {
      console.error(`Error fetching comments: ${err.message}`);
    }
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
    class="container mx-auto p-6 bg-white rounded-lg shadow-lg mt-20 max-w-6xl"
  >
    <div class="p-4">
      <div class="flex flex-col lg:flex-row justify-between">
        <div class="lg:w-2/3">
          <h1 class="text-4xl font-bold text-[#2C3E50] mb-4">
            {project.title} ({project.acronym || "N/A"})
          </h1>

          <h2 class="text-xl font-bold text-[#2C3E50] mb-2">
            Project Description
          </h2>
          <p class="text-lg text-[#7F8C8D] mb-6">
            {project.description || "No description available."}
          </p>

          <h3 class="text-lg font-bold text-[#2C3E50] mb-2">
            Technologies Used:
          </h3>
          <p class="text-[#7F8C8D] font-medium mb-6">
            {project.keywords || "Not specified"}
          </p>

          <div class="flex space-x-10 mb-6">
            <div>
              <h3 class="text-lg font-bold text-[#2C3E50]">Language:</h3>
              <p class="text-[#7F8C8D]">{getLanguageName(project.language)}</p>
            </div>
            <div>
              <h3 class="text-lg font-bold text-[#2C3E50]">Year:</h3>
              <p class="text-[#7F8C8D]">{project.year || "Not specified"}</p>
            </div>
          </div>

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
            <img
              src={posterUrl}
              alt="Project Poster"
              class="rounded-lg shadow-lg w-full lg:w-auto h-auto max-h-[600px]"
            />
          {/if}
        </div>
      </div>

      <div class="mt-10">
        <h2 class="text-2xl font-bold text-[#2C3E50] mb-4">Uploaded Files</h2>
        {#if elements.length > 0}
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {#each elements as element}
              <div
                class="bg-gray-100 border border-gray-300 p-4 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <div class="mb-2">
                  <h3 class="text-sm font-medium text-gray-800">
                    {element.name || "Unnamed File"}
                  </h3>
                  <span class="text-xs text-gray-500">
                    {new Date(element.createdAt).toLocaleString()}
                  </span>
                </div>

                <a
                  href={`http://192.168.0.107:8080/zpi/projectElements/retrieve?projectElementId=${element.elementId}`}
                  target="_blank"
                  class="block mb-4 text-sm text-gray-600 hover:text-gray-800 font-medium"
                >
                  Download File
                </a>

                <div>
                  <h4 class="text-sm font-semibold text-gray-700 mb-2">
                    Comments:
                  </h4>
                  {#if comments[element.elementId]?.length > 0}
                    <ul class="list-disc list-inside text-gray-600 text-sm">
                      {#each comments[element.elementId] as comment}
                        <li>{comment.comment}</li>
                      {/each}
                    </ul>
                  {:else}
                    <p class="text-gray-500 text-xs">No comments yet.</p>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        {:else}
          <p class="text-center text-gray-500 text-sm">
            No files uploaded for this project.
          </p>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .container {
    max-width: 1200px;
    transform: scale(0.95);
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

  @media (min-width: 1600px) {
    .container {
      max-width: 1400px;
      padding: 2rem;
    }

    h1 {
      font-size: 2.5rem;
    }

    h2,
    h3 {
      font-size: 1.75rem;
    }

    p,
    span {
      font-size: 1rem;
    }
  }
</style> -->
<script>
  import { onMount } from "svelte";
  import { currentProjectId } from "../../projectStore";

  let projectId = null;
  let project = {};
  let members = [];
  let elements = [];
  let posterUrl = "";
  let loading = true;
  let error = "";

  const elementTypes = {
    1: "Logo",
    3: "Source Code",
    4: "Premise",
    5: "Poster",
    6: "Thesis",
    7: "Roadmap",
    8: "Abstract",
  };

  const elementIcons = {
    1: "../../icons/logo2.png",
    3: "../../icons/sourceCode.png",
    4: "../../icons/premise.png",
    5: "../../icons/poster.png",
    6: "../../icons/thesis.png",
    7: "../../icons/roadmap.png",
    8: "../../icons/abstract.png",
  };

  $: currentProjectId.subscribe((value) => {
    projectId = value;
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
        `http://192.168.0.107:8080/zpi/project/basicInfo?projectId=${projectId}`
      );
      if (response.ok) {
        const data = await response.json();
        project = data;

        members =
          project.userRole?.filter(
            (member) => member.roles?.roleName === "student"
          ) || [];

        elements = project.elements || [];

        posterUrl =
          elements.find((el) => el.elementTypeId === 5)?.vfilePath || "";
      } else {
        error = "Failed to load project details.";
      }
    } catch (err) {
      error = `Error fetching project details: ${err.message}`;
    } finally {
      loading = false;
    }
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
    class="container mx-auto p-6 bg-white rounded-lg shadow-lg mt-20 max-w-6xl"
  >
    <div class="p-4">
      <div class="flex flex-col lg:flex-row justify-between">
        <div class="lg:w-2/3">
          <h1 class="text-4xl font-bold text-[#2C3E50] mb-4">
            {project.title} ({project.acronym || "N/A"})
          </h1>

          <h2 class="text-xl font-bold text-[#2C3E50] mb-2">
            Project Description
          </h2>
          <p class="text-lg text-[#7F8C8D] mb-6">
            {project.description || "No description available."}
          </p>

          <h3 class="text-lg font-bold text-[#2C3E50] mb-2">
            Technologies Used:
          </h3>
          <p class="text-[#7F8C8D] font-medium mb-6">
            {project.keywords || "Not specified"}
          </p>

          <div class="flex space-x-10 mb-6">
            <div>
              <h3 class="text-lg font-bold text-[#2C3E50]">Language:</h3>
              <p class="text-[#7F8C8D]">{getLanguageName(project.language)}</p>
            </div>
            <div>
              <h3 class="text-lg font-bold text-[#2C3E50]">Year:</h3>
              <p class="text-[#7F8C8D]">{project.year || "Not specified"}</p>
            </div>
          </div>

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
            <img
              src={posterUrl}
              alt="Project Poster"
              class="rounded-lg shadow-lg w-full lg:w-auto h-auto max-h-[600px]"
            />
          {/if}
        </div>
      </div>

      <div class="mt-10">
        <h2 class="text-2xl font-bold text-[#2C3E50] mb-4">Uploaded Files</h2>
        {#if elements.length > 0}
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each elements as element}
              <div
                class="file-card bg-white border border-gray-300 rounded-lg shadow-lg hover:shadow-md transition flex flex-col items-center p-6"
              >
                <img
                  src={elementIcons[element.elementTypeId] ||
                    "../../icons/default.png"}
                  alt={elementTypes[element.elementTypeId] || "Unknown"}
                  class="w-16 h-16 mb-4"
                />
                <h4 class="text-sm font-medium text-gray-700 text-center">
                  {elementTypes[element.elementTypeId] || "Unknown"}
                </h4>
                <span class="text-xs text-gray-500 mb-4">
                  {new Date(element.createdAt).toLocaleString()}
                </span>
                <a
                  href={`http://192.168.0.107:8080/zpi/projectElements/retrieve?projectElementId=${element.elementId}`}
                  target="_blank"
                  class="download-btn text-[#E74C3C] hover:text-red-600 text-sm font-medium"
                >
                  Download File
                </a>
              </div>
            {/each}
          </div>
        {:else}
          <p class="text-center text-gray-500 text-sm">
            No files uploaded for this project.
          </p>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .container {
    max-width: 1200px;
    transform: scale(0.95);
  }

  .file-card {
    text-align: center;
    background-color: #ffffff;
    border-radius: 12px;
    padding: 1rem;
    transition: transform 0.3s ease;
  }

  .file-card:hover {
    transform: scale(1.05);
  }

  .download-btn {
    background-color: #e74c3c;
    color: #fff;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    text-align: center;
  }

  .download-btn:hover {
    background-color: #c0392b;
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

  @media (min-width: 1600px) {
    .container {
      max-width: 65%;
      padding: 2rem;
    }

    h1 {
      font-size: 2.5rem;
    }

    h2,
    h3 {
      font-size: 1.75rem;
    }

    p,
    span {
      font-size: 1rem;
    }
  }
</style>
