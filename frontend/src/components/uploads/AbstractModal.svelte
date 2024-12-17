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

  // Reactive declaration: Fetch projectId and authentication token
  $: {
    projectId = get(currentProjectId);
    const auth = get(authStore);
    token = auth?.token || null;
  }

  // Fixed elementTypeId for abstract uploads
  const elementTypeId = 8; 

  /**
   * Handle modal close event.
   */
  function onClose() {
    dispatch("close");
  }

  /**
   * Handle file upload.
   * @param {CustomEvent} event - Event containing the selected file.
   */
  async function onUpload(event) {
    const file = event.detail.file;

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Send file upload request to backend
      const response = await fetch(
        `http://localhost:8080/projectElements/uploadElement?projectId=${projectId}&elementTypeId=${elementTypeId}`,
        {
          method: "POST",
           headers: {
            Authorization: `Bearer ${token}`, // Include token for authentication
          },
          body: formData,
        }
      );

      if (response.ok) {
        console.log("File uploaded successfully for Abstract");
        dispatch("upload", { success: true }); // Notify parent of success
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
            Authorization: `Bearer ${token}`, // Include token for authentication
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

<ModalTemplate
  title="Upload Abstract"
  description="Upload your abstract (pdf)"
  supportedFormats="pdf"
  {softDeadline}
  {hardDeadline}
  on:close={onClose}
  on:upload={onUpload}
/>
