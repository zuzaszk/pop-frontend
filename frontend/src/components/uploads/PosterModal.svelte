<script>
  import ModalTemplate from "./ModalTemplate.svelte";
  import { currentProjectId } from "../../projectStore";
  import { get } from "svelte/store";
  import { createEventDispatcher, onMount } from "svelte";
  import { authStore } from "../../stores/authStore";


  // Event dispatcher to communicate with parent components
  const dispatch = createEventDispatcher();

  // State variables for deadlines and authentication
  let softDeadline = "";
  let hardDeadline = "";
  let projectId;
  let token;

  // Unique identifier for "Poster" upload
  const elementTypeId = 5; 

  // Reactive declaration: Fetch projectId and authentication token
  $: {
    projectId = get(currentProjectId);
    const auth = get(authStore);
    token = auth?.token || null;
  }


  /**
   * Close the modal.
   */
  function onClose() {
    dispatch("close");
  }

/**
   * Upload the selected file to the backend.
   * @param {CustomEvent} event - Event containing the file to upload
   */
  async function onUpload(event) {
    const file = event.detail.file;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `http://localhost:8080/projectElements/uploadElement?projectId=${projectId}&elementTypeId=${elementTypeId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, 
          },
          body: formData,
        }
      );

      if (response.ok) {
        console.log("File uploaded successfully for Poster");
        dispatch("upload", { success: true });
        onClose();
      } else {
        console.error("Failed to upload file for Poster");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  }

  onMount(async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/deadlines/getDeadlineByProjectIdAndElementTypeId?projectId=${projectId}&elementTypeId=${elementTypeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        softDeadline = data.softDeadline || "No soft deadline available";
        hardDeadline = data.hardDeadline || "No hard deadline available";
      } else {
        console.error("Failed to fetch deadlines");
      }
    } catch (error) {
      console.error("Error fetching deadlines:", error);
    }
  });
</script>

<ModalTemplate
  title="Upload Poster"
  description="Upload your poster (jpg, png)"
  supportedFormats="jpg, png"
  {softDeadline}
  {hardDeadline}
  on:close={onClose}
  on:upload={onUpload}
/>
