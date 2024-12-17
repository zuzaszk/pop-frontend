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

  // Unique identifier for "Logo" upload
  const elementTypeId = 1; 

  // Reactive declaration: Fetch projectId and authentication token
  $: {
    projectId = get(currentProjectId); // Get current project ID
    const auth = get(authStore);
    token = auth?.token || null; // Retrieve authentication token
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
            Authorization: `Bearer ${token}`, // Authentication header
          },
          body: formData,
        }
      );
      if (response.ok) {
        console.log("File uploaded successfully for Logo");
        dispatch("upload", { success: true }); // Notify parent
        onClose();
      } else {
        console.error("Failed to upload file");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  }

  /**
   * Fetch soft and hard deadlines on component mount.
   */
  onMount(async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/deadlines/getDeadlineByProjectIdAndElementTypeId?projectId=${projectId}&elementTypeId=${elementTypeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Authentication header
          },
        }
      );


      if (response.ok) {
        const data = await response.json();
        softDeadline = data.softDeadline || "No deadline available";
        hardDeadline = data.hardDeadline || "No deadline available";
      } else {
        console.error("Failed to fetch deadlines");
      }
    } catch (error) {
      console.error("Error fetching deadlines:", error);
    }
  });
</script>

<!-- Use ModalTemplate with appropriate props -->
<ModalTemplate
  title="Upload Logo"
  description="Upload your logo (jpg, png)"
  supportedFormats="jpg, png"
  {softDeadline}
  {hardDeadline}
  on:close={onClose}
  on:upload={onUpload}
/>
