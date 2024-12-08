<script>
  import ModalTemplate from "./ModalTemplate.svelte";
  import { currentProjectId } from "../../projectStore";
  import { get } from "svelte/store";
  import { createEventDispatcher, onMount } from "svelte";
  import { authStore } from "../../stores/authStore";


  const dispatch = createEventDispatcher();

  let softDeadline = "";
  let hardDeadline = "";

  let projectId;
  let token;
  const elementTypeId = 6; 
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
            Authorization: `Bearer ${token}`, // Include token for authentication
          },
          body: formData,
        }
      );

      if (response.ok) {
        console.log("File uploaded successfully for Thesis");
        dispatch("upload", { success: true });
        onClose();
      } else {
        console.error("Failed to upload file for Thesis");
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
            Authorization: `Bearer ${token}`, // Include token for authentication
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        softDeadline = data.softDeadline || "No soft deadline available";
        hardDeadline = data.hardDeadline || "No hard deadline available";
      } else {
        console.error("Failed to fetch deadlines for Thesis");
      }
    } catch (error) {
      console.error("Error fetching deadlines:", error);
    }
  });
</script>

<ModalTemplate
  title="Upload Thesis"
  description="Upload your thesis (pdf)"
  supportedFormats="pdf"
  {softDeadline}
  {hardDeadline}
  on:close={onClose}
  on:upload={onUpload}
/>
