<!-- <script>
  import LogoModal from "../../components/uploads/LogoModal.svelte";
  import SourceCodeModal from "../../components/uploads/SourceCodeModal.svelte";
  import PremiseModal from "../../components/uploads/PremiseModal.svelte";
  import PosterModal from "../../components/uploads/PosterModal.svelte";
  import ThesisModal from "../../components/uploads/ThesisModal.svelte";
  import RoadmapModal from "../../components/uploads/RoadmapModal.svelte";
  import AbstractModal from "../../components/uploads/AbstractModal.svelte";


  export let onSubmit;

  let isLogoUploaded = false;
  let isSourceCodeUploaded = false;
  let isPremiseUploaded = false;
  let isPosterUploaded = false;
  let isThesisUploaded = false;
  let isRoadmapUploaded = false;
  let isAbstractUploaded = false;

  let showLogoModal = false;
  let showSourceCodeModal = false;
  let showPremiseModal = false;
  let showPosterModal = false;
  let showThesisModal = false;
  let showRoadmapModal = false;
  let showAbstractModal = false;


  function toggleUploadStatus(type) {
    switch (type) {
      case "logo":
        isLogoUploaded = !isLogoUploaded;
        break;
      case "sourceCode":
        isSourceCodeUploaded = !isSourceCodeUploaded;
        break;
      case "premise":
        isPremiseUploaded = !isPremiseUploaded;
        break;
      case "poster":
        isPosterUploaded = !isPosterUploaded;
        break;
      case "thesis":
        isThesisUploaded = !isThesisUploaded;
        break;
      case "roadmap":
        isRoadmapUploaded = !isRoadmapUploaded;
        break;
      case "abstract":
        isAbstractUploaded = !isAbstractUploaded;
        break;
    }
  }
</script>

<div class="page-container">
  <div class="container mx-auto bg-white p-6 rounded-lg shadow-lg">
    <h2 class="title text-2xl font-bold text-[#2C3E50] mb-6 text-center">
      Upload Your Final Project
    </h2>

 
    <div class="upload-grid">
    
      <button
        on:click={() => (showLogoModal = true)}
        class="upload-item {isLogoUploaded ? 'status-added' : ''}"
      >
        <img src="../../icons/logo2.png" alt="Logo Icon" class="icon" />
        <span
          class="{isLogoUploaded
            ? 'text-[#2ECC71]'
            : 'text-[#E74C3C]'} font-semibold">Logo</span
        >
      </button>

      
      <button
        on:click={() => (showSourceCodeModal = true)}
        class="upload-item {isSourceCodeUploaded ? 'status-added' : ''}"
      >
        <img
          src="../../icons/sourceCode.png"
          alt="Source Code Icon"
          class="icon"
        />
        <span
          class="{isSourceCodeUploaded
            ? 'text-[#2ECC71]'
            : 'text-[#E74C3C]'} font-semibold">Source Code</span
        >
      </button>

    
      <button
        on:click={() => (showPremiseModal = true)}
        class="upload-item {isPremiseUploaded ? 'status-added' : ''}"
      >
        <img src="../../icons/premise.png" alt="Premise Icon" class="icon" />
        <span
          class="{isPremiseUploaded
            ? 'text-[#2ECC71]'
            : 'text-[#E74C3C]'} font-semibold">Premise</span
        >
      </button>

 
      <button
        on:click={() => (showPosterModal = true)}
        class="upload-item {isPosterUploaded ? 'status-added' : ''}"
      >
        <img src="../../icons/poster.png" alt="Poster Icon" class="icon" />
        <span
          class="{isPosterUploaded
            ? 'text-[#2ECC71]'
            : 'text-[#E74C3C]'} font-semibold">Poster</span
        >
      </button>

      
      <button
        on:click={() => (showThesisModal = true)}
        class="upload-item {isThesisUploaded ? 'status-added' : ''}"
      >
        <img src="../../icons/thesis.png" alt="Thesis Icon" class="icon" />
        <span
          class="{isThesisUploaded
            ? 'text-[#2ECC71]'
            : 'text-[#E74C3C]'} font-semibold">Thesis</span
        >
      </button>


      <button
        on:click={() => (showRoadmapModal = true)}
        class="upload-item {isRoadmapUploaded ? 'status-added' : ''}"
      >
        <img src="../../icons/roadmap.png" alt="Roadmap Icon" class="icon" />
        <span
          class="{isRoadmapUploaded
            ? 'text-[#2ECC71]'
            : 'text-[#E74C3C]'} font-semibold">Roadmap</span
        >
      </button>

     
      <button
        on:click={() => (showAbstractModal = true)}
        class="upload-item {isAbstractUploaded ? 'status-added' : ''}"
      >
        <img src="../../icons/abstract.png" alt="Abstract Icon" class="icon" />
        <span
          class="{isAbstractUploaded
            ? 'text-[#2ECC71]'
            : 'text-[#E74C3C]'} font-semibold">Abstract</span
        >
      </button>
    </div>


    <button
      on:click={onSubmit}
      class="submit-button bg-[#E74C3C] text-white py-3 px-6 rounded-lg hover:bg-[#C0392B] mt-6"
    >
      Submit Project
    </button>
  </div>
</div>


{#if showLogoModal}
  <LogoModal
    on:close={() => (showLogoModal = false)}
    on:upload={() => toggleUploadStatus("logo")}
  />
{/if}
{#if showSourceCodeModal}
  <SourceCodeModal
    on:close={() => (showSourceCodeModal = false)}
    on:upload={() => toggleUploadStatus("sourceCode")}
  />
{/if}
{#if showPremiseModal}
  <PremiseModal
    on:close={() => (showPremiseModal = false)}
    on:upload={() => toggleUploadStatus("premise")}
  />
{/if}
{#if showPosterModal}
  <PosterModal
    on:close={() => (showPosterModal = false)}
    on:upload={() => toggleUploadStatus("poster")}
  />
{/if}
{#if showThesisModal}
  <ThesisModal
    on:close={() => (showThesisModal = false)}
    on:upload={() => toggleUploadStatus("thesis")}
  />
{/if}
{#if showRoadmapModal}
  <RoadmapModal
    on:close={() => (showRoadmapModal = false)}
    on:upload={() => toggleUploadStatus("roadmap")}
  />
{/if}
{#if showAbstractModal}
  <AbstractModal
    on:close={() => (showAbstractModal = false)}
    on:upload={() => toggleUploadStatus("abstract")}
  />
{/if}

<style>
  .page-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 1rem;
  }
  .container {
    max-width: 800px;
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  .upload-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-top: 2rem;
  }
  .upload-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    border: 2px dashed #e74c3c;
    border-radius: 8px;
    cursor: pointer;
    transition: 0.2s all ease-in-out;
  }
  .upload-item:hover {
    transform: scale(1.05);
    border-color: #c0392b;
  }
  .status-added {
    border-color: #2ecc71;
  }
  .icon {
    width: 36px;
    height: 36px;
    margin-bottom: 0.5rem;
  }
  .submit-button {
    width: 100%;
    padding: 1rem;
    margin-top: 2rem;
    font-weight: bold;
  }
  @media (max-width: 768px) {
    .upload-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style> -->

<script>
  import LogoModal from "../../components/uploads/LogoModal.svelte";
  import SourceCodeModal from "../../components/uploads/SourceCodeModal.svelte";
  import PremiseModal from "../../components/uploads/PremiseModal.svelte";
  import PosterModal from "../../components/uploads/PosterModal.svelte";
  import ThesisModal from "../../components/uploads/ThesisModal.svelte";
  import RoadmapModal from "../../components/uploads/RoadmapModal.svelte";
  import AbstractModal from "../../components/uploads/AbstractModal.svelte";

  export let onSubmit;

  let isLogoUploaded = false;
  let isSourceCodeUploaded = false;
  let isPremiseUploaded = false;
  let isPosterUploaded = false;
  let isThesisUploaded = false;
  let isRoadmapUploaded = false;
  let isAbstractUploaded = false;

  let showLogoModal = false;
  let showSourceCodeModal = false;
  let showPremiseModal = false;
  let showPosterModal = false;
  let showThesisModal = false;
  let showRoadmapModal = false;
  let showAbstractModal = false;

  function toggleUploadStatus(type) {
    switch (type) {
      case "logo":
        isLogoUploaded = !isLogoUploaded;
        break;
      case "sourceCode":
        isSourceCodeUploaded = !isSourceCodeUploaded;
        break;
      case "premise":
        isPremiseUploaded = !isPremiseUploaded;
        break;
      case "poster":
        isPosterUploaded = !isPosterUploaded;
        break;
      case "thesis":
        isThesisUploaded = !isThesisUploaded;
        break;
      case "roadmap":
        isRoadmapUploaded = !isRoadmapUploaded;
        break;
      case "abstract":
        isAbstractUploaded = !isAbstractUploaded;
        break;
    }
  }
</script>

<div class="page-container">
  <div class="container mx-auto bg-white p-6 rounded-lg shadow-lg">
    <h2 class="title text-2xl font-bold text-[#2C3E50] mb-6 text-center">
      Upload Your Final Project
    </h2>

    <div class="upload-grid">
      <button
        on:click={() => (showLogoModal = true)}
        class="upload-item {isLogoUploaded ? 'status-added' : ''}"
      >
        <img src="../../icons/logo2.png" alt="Logo Icon" class="icon" />
        <span
          class="{isLogoUploaded
            ? 'text-[#2ECC71]'
            : 'text-[#E74C3C]'} font-semibold">Logo</span
        >
      </button>

      <button
        on:click={() => (showSourceCodeModal = true)}
        class="upload-item {isSourceCodeUploaded ? 'status-added' : ''}"
      >
        <img
          src="../../icons/sourceCode.png"
          alt="Source Code Icon"
          class="icon"
        />
        <span
          class="{isSourceCodeUploaded
            ? 'text-[#2ECC71]'
            : 'text-[#E74C3C]'} font-semibold">Source Code</span
        >
      </button>

      <button
        on:click={() => (showPremiseModal = true)}
        class="upload-item {isPremiseUploaded ? 'status-added' : ''}"
      >
        <img src="../../icons/premise.png" alt="Premise Icon" class="icon" />
        <span
          class="{isPremiseUploaded
            ? 'text-[#2ECC71]'
            : 'text-[#E74C3C]'} font-semibold">Premise</span
        >
      </button>

      <button
        on:click={() => (showPosterModal = true)}
        class="upload-item {isPosterUploaded ? 'status-added' : ''}"
      >
        <img src="../../icons/poster.png" alt="Poster Icon" class="icon" />
        <span
          class="{isPosterUploaded
            ? 'text-[#2ECC71]'
            : 'text-[#E74C3C]'} font-semibold">Poster</span
        >
      </button>

      <button
        on:click={() => (showThesisModal = true)}
        class="upload-item {isThesisUploaded ? 'status-added' : ''}"
      >
        <img src="../../icons/thesis.png" alt="Thesis Icon" class="icon" />
        <span
          class="{isThesisUploaded
            ? 'text-[#2ECC71]'
            : 'text-[#E74C3C]'} font-semibold">Thesis</span
        >
      </button>

      <button
        on:click={() => (showRoadmapModal = true)}
        class="upload-item {isRoadmapUploaded ? 'status-added' : ''}"
      >
        <img src="../../icons/roadmap.png" alt="Roadmap Icon" class="icon" />
        <span
          class="{isRoadmapUploaded
            ? 'text-[#2ECC71]'
            : 'text-[#E74C3C]'} font-semibold">Roadmap</span
        >
      </button>

      <button
        on:click={() => (showAbstractModal = true)}
        class="upload-item {isAbstractUploaded ? 'status-added' : ''}"
      >
        <img src="../../icons/abstract.png" alt="Abstract Icon" class="icon" />
        <span
          class="{isAbstractUploaded
            ? 'text-[#2ECC71]'
            : 'text-[#E74C3C]'} font-semibold">Abstract</span
        >
      </button>
    </div>

    <button
      on:click={onSubmit}
      class="submit-button bg-[#E74C3C] text-white py-3 px-6 rounded-lg hover:bg-[#C0392B] mt-6"
    >
      Submit Project
    </button>
  </div>
</div>

{#if showLogoModal}
  <LogoModal
    on:close={() => (showLogoModal = false)}
    on:upload={() => toggleUploadStatus("logo")}
  />
{/if}
{#if showSourceCodeModal}
  <SourceCodeModal
    on:close={() => (showSourceCodeModal = false)}
    on:upload={() => toggleUploadStatus("sourceCode")}
  />
{/if}
{#if showPremiseModal}
  <PremiseModal
    on:close={() => (showPremiseModal = false)}
    on:upload={() => toggleUploadStatus("premise")}
  />
{/if}
{#if showPosterModal}
  <PosterModal
    on:close={() => (showPosterModal = false)}
    on:upload={() => toggleUploadStatus("poster")}
  />
{/if}
{#if showThesisModal}
  <ThesisModal
    on:close={() => (showThesisModal = false)}
    on:upload={() => toggleUploadStatus("thesis")}
  />
{/if}
{#if showRoadmapModal}
  <RoadmapModal
    on:close={() => (showRoadmapModal = false)}
    on:upload={() => toggleUploadStatus("roadmap")}
  />
{/if}
{#if showAbstractModal}
  <AbstractModal
    on:close={() => (showAbstractModal = false)}
    on:upload={() => toggleUploadStatus("abstract")}
  />
{/if}

<style>
  .page-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 8rem;
  }

  .container {
    max-width: 1000px;
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .upload-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-top: 2rem;
  }

  .upload-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    border: 2px dashed #e74c3c;
    border-radius: 8px;
    cursor: pointer;
    transition: 0.2s all ease-in-out;
  }

  .upload-item:hover {
    transform: scale(1.05);
    border-color: #c0392b;
  }

  .status-added {
    border-color: #2ecc71;
  }

  .icon {
    width: 36px;
    height: 36px;
    margin-bottom: 0.5rem;
  }

  .submit-button {
    width: 100%;
    padding: 1rem;
    margin-top: 2rem;
    font-weight: bold;
  }

  @media (min-width: 1600px) {
    .container {
      max-width: 1400px;
      padding: 2rem;
      /* margin-top: 100px; */
      /* min-height: 80vh; */
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .upload-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 3rem;
    }

    .upload-item {
      padding: 2rem;
      height: 160px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .submit-button {
      font-size: 1.25rem;
      padding: 1.5rem;
      margin-top: 8rem;
    }
  }

  @media (max-width: 768px) {
    .page-container {
      padding: 6rem 1rem 2rem;
      align-items: flex-start;
    }

    .container {
      max-width: 100%;
      padding: 1rem;
      box-shadow: none;
    }

    .upload-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-top: 1rem;
    }

    .upload-item {
      padding: 1rem;
      height: auto;
    }

    .icon {
      width: 28px;
      height: 28px;
    }

    .submit-button {
      margin-top: 2rem;
      padding: 1rem;
      font-size: 1rem;
    }
  }
</style>
