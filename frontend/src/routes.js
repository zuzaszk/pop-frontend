import Login from "./pages/auth/login.svelte";
import Signup from "./pages/auth/signup.svelte";
import ForgotPassword from "./pages/auth/ForgotPassword.svelte";
import ResetPassword from "./pages/auth/ResetPassword.svelte";
import Logout from "./pages/auth/Logout.svelte";
import Projects from "./pages/Projects.svelte";
import ProjectDetails from "./pages/ProjectDetails.svelte";
import CreateProject from "./pages/chair/CreateProject.svelte";
import CreateEdition from "./pages/chair/CreateEdition.svelte";
import ConstantProject from "./pages/student/ConstantProject.svelte";
import DynamicProject from "./pages/student/DynamicProject.svelte";
import ViewProject from "./pages/student/ViewProject.svelte";
import Evaluations from "./pages/reviewer/Evaluations.svelte";
import EvaluationPage from "./pages/reviewer/EvaluationPage.svelte";
// import SupervisorReview from "./pages/supervisor/SupervisorReview.svelte";
import ViewAllComments from "./pages//ViewAllComments.svelte";
import Settings from "./pages/Setitngs.svelte";
import StudentDashboard from "./pages/student/StudentDashboard.svelte";
import SupervisorDashboard from "./pages/supervisor/SupervisorDashboard.svelte";
import ReviewerDashboard from "./pages/reviewer/ReviewerDashboard.svelte";
import ChairDashboard from "./pages/chair/ChairDashboard.svelte";
import ViewFiles from "./pages/reviewer/ViewFiles.svelte";
import MyTeams from "./pages/supervisor/MyTeams.svelte";
import ViewScoreDetails from "./pages/supervisor/ViewScoreDetails.svelte";
import TeamDetails from "./pages/supervisor/TeamDetails.svelte";

export const routes = {
  "/": Login,
  "/signup": Signup,
  "/forgot-password": ForgotPassword,
  "/reset-password": ResetPassword,
  "/dashboard": StudentDashboard,
  "/projects": Projects,
  "/logout": Logout,
  "/projects/:id": ProjectDetails,
  "/create-project": CreateProject,
  "/create-edition": CreateEdition,
  "/my-projects/constant": ConstantProject,
  "/my-projects/dynamic": DynamicProject,
  "/my-projects/view": ViewProject,
  "/evaluations": Evaluations,
  "/evaluations/:id": EvaluationPage,
  // "/supervisor-review": SupervisorReview,
  // "*": NotFound,
  "/comments/:projectId": ViewAllComments,
  "/settings": Settings,
  "/student-dashboard": StudentDashboard,
  "/supervisor-dashboard": SupervisorDashboard,
  "/reviewer-dashboard": ReviewerDashboard,
  "/chair-dashboard": ChairDashboard,
  "/files/:projectId": ViewFiles,
  "/my-teams": MyTeams,
  "/score-details": ViewScoreDetails,
  "/teams/:teamId": TeamDetails, 
};
