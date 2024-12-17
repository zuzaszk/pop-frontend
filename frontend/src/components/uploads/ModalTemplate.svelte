<script>
  import "../../styles/components/ModalTemplate.css";
  import { createEventDispatcher } from "svelte";

  // Exported props for flexibility
  export let title = "Upload File";
  export let description = "";
  export let supportedFormats = "zip, rar, 7z, pdf, jpg, png";
  export let softDeadline = "";
  export let hardDeadline = "";

  const dispatch = createEventDispatcher();

  // Local state variables
  let selectedFile = null;
  let isDragging = false;
  let previewUrl = "";

  // Close the modal by dispatching a "close" event
  function closeModal() {
    dispatch("close");
  }

  // Handle file input change
  function handleFileChange(event) {
    selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      previewUrl = URL.createObjectURL(selectedFile);
    } else {
      previewUrl = "";
    }
  }

  // Handle drag-over event
  function handleDragOver(event) {
    event.preventDefault();
    isDragging = true;
  }

  // Handle drag-leave event
  function handleDragLeave() {
    isDragging = false;
  }

  // Handle file drop event
  function handleDrop(event) {
    event.preventDefault();
    isDragging = false;

    if (event.dataTransfer.files.length) {
      selectedFile = event.dataTransfer.files[0];
      if (selectedFile && selectedFile.type.startsWith("image/")) {
        previewUrl = URL.createObjectURL(selectedFile);
      } else {
        previewUrl = "";
      }
    }
  }

  // Update preview URL if the file is an image
  function updatePreview(file) {
    if (file && file.type.startsWith("image/")) {
      previewUrl = URL.createObjectURL(file);
    } else {
      previewUrl = "";
    }
  }

  // Handle file upload
  function uploadFile() {
    if (selectedFile) {
      dispatch("upload", { file: selectedFile });
      URL.revokeObjectURL(previewUrl);
    } else {
      console.warn("No file selected for upload.");
    }
  }
</script>

<!-- Modal overlay -->ß
<div class="overlay" on:click={closeModal}>
  <div class="modal-container" on:click|stopPropagation>
    <!-- Close button -->
    <button class="close-button" on:click={closeModal}>✕</button>

    <!-- Modal title -->
    <h2 class="title">{title}</h2>

    <!-- Upload area -->
    <div
      class="upload-area"
      class:is-dragging={isDragging}
      on:dragover={handleDragOver}
      on:dragleave={handleDragLeave}
      on:drop={handleDrop}
    >
      <p>{description}</p>
      <p class="formats">Supported formats: {supportedFormats}</p>
      <input
        type="file"
        accept=".zip, .rar, .7z, .pdf, .jpg, .png"
        on:change={handleFileChange}
        class="file-input"
      />
    </div>

    <!-- Preview image -->
    {#if previewUrl}
      <img src={previewUrl} alt="Image preview" class="image-preview" />
    {/if}

    <!-- Selected file details -->
    <div class="file-input-container">
      {#if selectedFile}
        <p class="selected-file-name">{selectedFile.name}</p>
      {:else}
        <p>No file selected</p>
      {/if}
      <button on:click={uploadFile} class="upload-button">UPLOAD FILE</button>
    </div>

    <!-- Deadlines -->
    <p class="deadlines">
      <strong>Soft Deadline:</strong>
      {softDeadline || "Not available"} <br />
      <strong>Hard Deadline:</strong>
      {hardDeadline || "Not available"}
    </p>
  </div>
</div>

