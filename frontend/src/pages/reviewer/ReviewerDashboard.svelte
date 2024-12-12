<script>
  import { onMount } from "svelte";
  import { Chart as ChartJS } from "chart.js/auto";
  import { push } from "svelte-spa-router";
  import { get } from "svelte/store"; 
  import { authStore } from "../../stores/authStore"; 


  let totalUsers = 0;
  let totalProjects = 0;
  let totalReviews = 0;
  let scoreDistribution = [];
  let averageEvaluationScore = 0;
  let evaluatedProjects = 0;
  let pendingProjects = 0;

  

  let chartData = [];
  let errorMessage = "";
  let canvas;
  let linearCanvas;

  let doughnutChartInstance = null;
  let linearChartInstance = null;

  let yearsInput = 5;
  let linearChartData = [];
  let linearChartError = "";

  let barChartCanvas;
  let barChartInstance = null;

  const { token, user } = get(authStore);
  const userName = user?.firstName || "User"; 

  function redirectToMyTeams() {
    push("/my-teams");
  }

  function redirectToScoreDetails() {
    push("/score-details");
  }


  async function fetchReviewerStatistics() {
  try {
    const url = `http://localhost:8080/statistic/reviewerStatistics`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to fetch reviewer statistics");
    }

    // Update evaluation summary
    evaluatedProjects = result.data.evaluatedProjectsCount || 0;
    pendingProjects = result.data.notEvaluatedProjectsCount || 0;

    // Update score distribution for the bar chart
    scoreDistribution = result.data.scoreDistribution || [];
    console.log("Score Distribution:", scoreDistribution);

    if (!scoreDistribution.length) {
      console.warn("Score distribution is empty");
    } else {
      renderBarChart(); // Render the bar chart with the updated data
    }
  } catch (error) {
    console.error("Error fetching reviewer statistics:", error.message);
  }
}

  async function fetchStatistics() {
    try {
      const url = `http://localhost:8080/statistic/getCounts`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }, 
      });

      const result = await response.json();

      if (!response.ok || !result.success)
        throw new Error(result.message || "Failed to fetch statistics");

      totalUsers = result.data.totalUsers;
      totalProjects = result.data.totalProjects;
      totalReviews = result.data.totalReviews;
    } catch (error) {
      console.error("Error fetching statistics:", error.message);
    }
  }

  async function fetchAverageEvaluationScore() {
    try {
      const url = `http://localhost:8080/statistic/averageGrades?n=1`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }, 
      });
      const result = await response.json();

      if (!response.ok || !result.success)
        throw new Error(result.message || "Failed to fetch evaluation score");

      if (result.data.length > 0) {
        averageEvaluationScore = result.data[0].average_grade;
      }
    } catch (error) {
      console.error("Error fetching average evaluation score:", error.message);
    }
  }

  async function fetchChartData() {
    try {
      errorMessage = "";
      const url = `http://localhost:8080/statistic/topTechnologies`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }, 
      });
      const result = await response.json();

      if (!response.ok || !result.success)
        throw new Error(result.message || "Failed to fetch data");

      chartData = result.data.map((item) => ({
        label: item.technology,
        value: item.count,
      }));
      renderChart();
    } catch (error) {
      errorMessage = error.message;
    }
  }

  function renderChart() {
    if (!canvas) return;

    if (doughnutChartInstance) {
      doughnutChartInstance.destroy();
    }

    const data = {
      labels: chartData.map((item) => item.label),
      datasets: [
        {
          data: chartData.map((item) => item.value),
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
            "#6B7280",
            "#F87171",
            "#A78BFA",
            "#34D399",
          ],
          borderColor: "#ffffff",
          borderWidth: 2,
          hoverOffset: 10,
        },
      ],
    };

    doughnutChartInstance = new ChartJS(canvas, {
      type: "doughnut",
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "right" },
          title: {
            display: true,
            text: "Top Technologies in Projects",
            font: { size: 18, weight: "bold" },
            color: "#333333",
          },
        },
      },
    });
  }

  async function fetchLinearChartData() {
    try {
      linearChartError = "";
      const url = `http://localhost:8080/statistic/averageGrades?n=${yearsInput}`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      if (!response.ok || !result.success)
        throw new Error(result.message || "Failed to fetch data");

      linearChartData = result.data.map((item) => ({
        year: item.year,
        averageGrade: item.average_grade,
      }));
      renderLinearChart();
    } catch (error) {
      linearChartError = error.message;
    }
  }

  function renderLinearChart() {
    if (!linearCanvas) return;

    if (linearChartInstance) {
      linearChartInstance.destroy();
    }

    const data = {
      labels: linearChartData.map((item) => item.year),
      datasets: [
        {
          label: "Average Grades",
          data: linearChartData.map((item) => item.averageGrade),
          borderColor: "#FF6384",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          fill: true,
          tension: 0.3,
        },
      ],
    };

    linearChartInstance = new ChartJS(linearCanvas, {
      type: "line",
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "top" },
          title: {
            display: true,
            text: "Average Grades Over Years",
            font: { size: 18, weight: "bold" },
            color: "#333333",
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Year",
              font: { size: 14 },
              color: "#555555",
            },
          },
          y: {
            title: {
              display: true,
              text: "Average Grade",
              font: { size: 14 },
              color: "#555555",
            },
            suggestedMin: 0,
            suggestedMax: 5,
          },
        },
      },
    });
  }

  function renderBarChart() {
  if (!barChartCanvas) return;

  if (barChartInstance) {
    barChartInstance.destroy();
  }

  const labels = scoreDistribution.map((item) =>
    item.score === "N/A" ? "No Score" : `Score ${item.score}`
  );
  const data = scoreDistribution.map((item) => item.count);

  barChartInstance = new ChartJS(barChartCanvas, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Number of Projects",
          data,
          backgroundColor: "#2980b9", 
          hoverBackgroundColor: "#3498db", 
          borderColor: "#ffffff", 




          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: "Scores Distribution for Projects",
          font: { size: 16, weight: "bold" },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Scores",
            font: { size: 14 },
          },
        },
        y: {
          title: {
            display: true,
            text: "Number of Projects",
            font: { size: 14 },
          },
          suggestedMin: 0,
        },
      },
    },
  });
}

  function handleKeyPress(event) {
    if (event.key === "Enter") {
      fetchLinearChartData();
    }
  }

  onMount(() => {
    fetchStatistics();
    fetchAverageEvaluationScore();
    fetchChartData();
    fetchLinearChartData();
    fetchReviewerStatistics();
    renderBarChart();
  });
</script>

<div class="min-h-screen bg-gray-100 p-6 pt-24">
  <header class="mb-8">
    <h1 class="text-2xl font-bold text-gray-900">Welcome, {userName}!</h1>
    <p class="text-gray-600">Here are informations about final projects</p>
  </header>

  <section class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div class="bg-white p-6 rounded shadow">
      <p class="text-3xl font-bold text-gray-900">{totalUsers}</p>
      <p class="text-gray-600">Total Users</p>
    </div>
    <div class="bg-white p-6 rounded shadow">
      <p class="text-3xl font-bold text-gray-900">{totalProjects}</p>
      <p class="text-gray-600">Total Projects</p>
    </div>
    <div class="bg-white p-6 rounded shadow">
      <p class="text-3xl font-bold text-gray-900">{totalReviews}</p>
      <p class="text-gray-600">Total Reviews</p>
    </div>
  </section>

  <section class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div class="lg:col-span-2 bg-white p-6 rounded shadow">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">
        Top Technologies in Projects
      </h2>
      <div class="relative h-80">
        <canvas bind:this={canvas}></canvas>
      </div>
    </div>

    <aside class="flex flex-col gap-4">
      <div class="bg-white p-6 rounded shadow">
        <h3 class="text-lg font-medium text-gray-900">Project Evaluation</h3>
        <p class="text-sm text-gray-600">Projects Evaluated: {evaluatedProjects}</p>
        <p class="text-sm text-gray-600">Pending Evaluation: {pendingProjects}</p>
      </div>
      

      <div class="bg-white p-6 rounded shadow">
        <h3 class="text-lg font-medium text-gray-900">
        </h3>
        <div class="relative h-40">
          <canvas bind:this={barChartCanvas}></canvas>
        </div>
      </div>
      

      <div class="bg-white p-6 rounded shadow">
        <h3 class="text-lg font-medium text-gray-900">
          Average Evaluation Score
        </h3>
        <p class="text-3xl font-bold text-gray-900">{averageEvaluationScore}</p>
        <button
          on:click={redirectToScoreDetails}
          class="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Check Details
        </button>
      </div>
    </aside>
  </section>

  <section class="bg-white p-6 rounded shadow mt-8">
    <h2 class="text-xl font-semibold text-gray-900 mb-4">Average Grades</h2>
    <div class="mb-6 flex items-center gap-4 flex-wrap">
      <div class="flex items-center">
        <label
          for="years-input"
          class="block text-sm font-medium text-gray-700 mr-2"
        >
          Enter number of years:
        </label>
        <input
          id="years-input"
          type="number"
          bind:value={yearsInput}
          on:keydown={handleKeyPress}
          class="p-2 border border-gray-300 rounded w-24 text-black"
          min="1"
        />
      </div>
    </div>
    {#if linearChartError}
      <p class="text-red-500">{linearChartError}</p>
    {:else}
      <div class="relative h-80">
        <canvas bind:this={linearCanvas}></canvas>
      </div>
    {/if}
  </section>
</div>

<style>
  .chart-container {
    position: relative;
    width: 100%;
    height: 400px;
  }

  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    opacity: 1;
  }

  input[type="number"] {
    background-color: white;
  }
</style> 