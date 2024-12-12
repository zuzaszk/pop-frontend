<script>
  import { push } from "svelte-spa-router";
  import LoginForm from "../../components/LoginForm.svelte";
  import SocialLogin from "../../components/SocialLogin.svelte";
  import UsosLogin from "../../components/UsosLogin.svelte";
  import { authStore } from "../../stores/authStore";

  let email = "";
  let password = "";
  let errorMessage = "";
  let loading = false;
  

  function mapRole(roleId) {
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
  async function fetchCurrentUser(token) {
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
        errorMessage = "Failed to fetch user data.";
        console.error("Failed to fetch user details:", userResponse.statusText);
      }
    } catch (error) {
      errorMessage = "Error fetching user data.";
      console.error("Error during user data fetch:", error);
    }
  }

  // Login using email and password
  async function loginWithEmail() {
    if (!email || !password) {
      errorMessage = "Email and password are required.";
      return;
    }

    try {
      loading = true;

      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        await fetchCurrentUser(data.token); // Fetch user details and handle token
      } else {
        errorMessage = data.message || "Login failed. Please try again.";
        console.error("Login failed:", response.statusText);
      }
    } catch (error) {
      errorMessage = "An error occurred during login. Please try again.";
      console.error("Login error:", error);
    } finally {
      loading = false;
    }
  }

  
  function loginWithGoogle() {
    const googleAuthUrl = "http://localhost:8080/oauth2/authorization/google";
    window.location.href = googleAuthUrl;
  }

  function loginWithFacebook() {
    const facebookAuthUrl = "http://localhost:8080/oauth2/authorization/facebook";
    window.location.href = facebookAuthUrl;
  }

  
 async function handleUsosLogin() {
  try {
    const response = await fetch("http://localhost:8080/usos/login", {
      method: "GET",
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();

      if (data.token) {
        // Redirect to the URL provided by the backend
        window.location.href = data.token;
      } else {
        errorMessage = "USOS login token missing in backend response.";
        console.error(errorMessage);
      }
    } else {
      const errorText = await response.text();
      errorMessage = `Failed to initiate USOS login. Backend error: ${errorText}`;
      console.error(errorMessage);
    }
  } catch (error) {
    errorMessage = "An error occurred while initiating USOS login.";
    console.error(error);
  }
}



  function redirectToSignup() {
    push("/signup");
  }

  function redirectToForgotPassword() {
    push("/forgot-password");
  }
</script>

<div
  class="scaleContainer flex items-center justify-center w-screen min-h-screen bg-cover bg-center bg-no-repeat relative bg-[url('../pwr4.JPG')]"
>
  <div
    class="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-50"
  ></div>

  <div
    class="relative z-10 flex flex-col sm:flex-row w-full max-w-4xl h-auto bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200 transform scale-75 origin-center"
  >
   
    <UsosLogin {handleUsosLogin} />

    
    <div
      class="w-full sm:w-1/2 bg-gradient-to-br from-gray-800 to-gray-900 text-white p-12 flex flex-col justify-center items-center"
    >
      <h2 class="text-3xl font-bold mb-6">Login as Guest</h2>
      <p class="text-lg mb-6">View team projects as a spectator</p>

      
      <SocialLogin {loginWithGoogle} {loginWithFacebook} />

      <div class="my-6 w-full border-t border-gray-500"></div>

      
      <LoginForm bind:email bind:password {loginWithEmail} {loading} />

     
      {#if errorMessage}
        <p class="text-red-500 mt-4 text-center">{errorMessage}</p>
      {/if}

      
      <div class="flex justify-between mt-6 w-full text-sm text-gray-400">
        <a
          on:click={redirectToForgotPassword}
          class="hover:underline cursor-pointer"
        >
          Forgot Password?
        </a>
        <a on:click={redirectToSignup} class="hover:underline cursor-pointer">
          Sign Up
        </a>
      </div>
    </div>
  </div>
</div>

<style>
  .scaleContainer {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .scaleContainer .transform {
    transform: scale(0.7);
    transform-origin: center;
  }

  a {
    cursor: pointer;
  }

  @media (min-width: 1600px) {
    .scaleContainer .transform {
      transform: scale(1.1);
    }
  }
</style>
