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
  const elementTypeId = 1; 
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
        console.log("File uploaded successfully for Logo");
        dispatch("upload", { success: true });
        onClose();
      } else {
        console.error("Failed to upload file");
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
            Authorization: `Bearer ${token}`, // Add token for authentication
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
  title="Upload Logo"
  description="Upload your logo (jpg, png)"
  supportedFormats="jpg, png"
  {softDeadline}
  {hardDeadline}
  on:close={onClose}
  on:upload={onUpload}
/>
