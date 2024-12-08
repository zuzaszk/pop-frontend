   <script>
    import { onMount } from "svelte";
    import { push } from "svelte-spa-router";
    import { setUser } from "../../stores/authStore";
  
    function mapRole(userRoles) {
      if (userRoles.some((role) => role.roleId === 1)) return "student";
      if (userRoles.some((role) => role.roleId === 2)) return "supervisor";
      if (userRoles.some((role) => role.roleId === 3)) return "reviewer";
      if (userRoles.some((role) => role.roleId === 4)) return "chair";
      return "spectator";
    }
  
    onMount(async () => {
      console.log("Full URL:", window.location.href);
  
      const hash = window.location.hash;
      const query = hash.startsWith("#/login-success?") 
        ? hash.substring("#/login-success?".length) 
        : "";
  
      const params = new URLSearchParams(query);
      const token = params.get("token");
  
      if (token) {
        // Store token in cookies
        document.cookie = `authToken=${token}; path=/; max-age=86400;`;
  
        try {
          const response = await fetch("http://192.168.0.102:8080/user/currentUser", {
            headers: { Authorization: `Bearer ${token}` },
          });
  
          if (response.ok) {
            const userData = await response.json();
            const role = mapRole(userData.userRole);
  
            // Update the store
            setUser(userData, role);
  
            // Redirect based on role
            const dashboardRoutes = {
              student: "/student-dashboard",
              supervisor: "/supervisor-dashboard",
              reviewer: "/reviewer-dashboard",
              chair: "/chair-dashboard",
              spectator: "/projects",
            };
  
            push(dashboardRoutes[role] || "/projects");
          } else {
            console.error("Failed to fetch user details:", response.statusText);
            push("/login");
          }
        } catch (error) {
          console.error("Error during token processing:", error);
          push("/login");
        }
      } else {
        console.error("No token found in the URL.");
        push("/login");
      }
    });
  </script>
  