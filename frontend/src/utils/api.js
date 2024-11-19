export async function uploadProject(data) {
  return fetch("http://192.168.0.107:8080/api/projects/upload", {
    method: "POST",
    body: data,
  });
}
