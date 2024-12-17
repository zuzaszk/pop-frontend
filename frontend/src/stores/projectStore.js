// Map role IDs to readable roles
export function mapRole(roleId) {
    switch (roleId) {
      case 1:
        return "student";
      case 2:
        return "supervisor";
      case 3:
        return "reviewer";
      case 4:
        return "chair";
      case 5:
        return "spectator";
      default:
        return "unknown";
    }
  }
  
  // Fetch current user information using the token
  export async function fetchCurrentUser(token, authStore, push) {
    try {
      const userResponse = await fetch("http://localhost:8080/user/currentUser", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (userResponse.ok) {
        const userData = await userResponse.json();
        const role = mapRole(userData.userRole[0]?.roleId);
  
        // Store token in cookies
        document.cookie = `authToken=${token}; path=/; max-age=86400;`; // Token expires in 1 day
  
        // Update authStore
        authStore.set({
          token,
          user: userData,
          role,
          isAuthenticated: true,
        });
  
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
        console.error("Failed to fetch user details:", userResponse.statusText);
        throw new Error("Failed to fetch user data.");
      }
    } catch (error) {
      console.error("Error during user data fetch:", error);
      throw new Error("Error fetching user data.");
    }
  }
  