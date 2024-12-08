<script>
  import ModalTemplate from "./ModalTemplate.svelte";
  import { currentProjectId } from "../../projectStore";
  import { get } from "svelte/store";
  import { authStore } from "../../stores/authStore";
  import { createEventDispatcher, onMount } from "svelte";

  const dispatch = createEventDispatcher();

  let softDeadline = "";
  let hardDeadline = "";

  let projectId;
  let token;
  const elementTypeId = 4; 
  $: {
    projectId = get(currentProjectId);
    const auth = get(authStore);
    token = auth?.token || null;
  }

  function onClose() {
    dispatch("close");
  }

  async function onUpload(event) {
    const file = event.detail.file;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `http://192.168.0.102:8080/projectElements/uploadElement?projectId=${projectId}&elementTypeId=${elementTypeId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // Add token for authentication
          },
          body: formData,
        }
      );

      if (response.ok) {
        console.log("File uploaded successfully for Premise");
        dispatch("upload", { success: true });
        onClose();
      } else {
        console.error("Failed to upload file for Premise");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  }

  onMount(async () => {
    try {
      const response = await fetch(
        `http://192.168.0.102:8080/deadlines/getDeadlineByProjectIdAndElementTypeId?projectId=${projectId}&elementTypeId=${elementTypeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token for authentication
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
  title="Upload Premise"
  description="Upload your premise document (pdf, doc)"
  supportedFormats="pdf, doc"
  {softDeadline}
  {hardDeadline}
  on:close={onClose}
  on:upload={onUpload}
/>
