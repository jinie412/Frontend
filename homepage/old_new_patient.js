//----------------------------------------------LINE GRAPH ---------------------------------------------------

const lineCTX = document.getElementById("LineChart").getContext("2d");

const dataLine = {
  labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
  datasets: [
    {
      label: "Bệnh nhân mới",
      data: [12, 50, 70, 40, 85, 24, 30, 50, 70, 40, 90, 54],
      borderColor: "rgba(57, 108, 240, 1)",
      backgroundColor: "rgba(57, 108, 240, 1)",

      borderWidth: 2,
      tension: 0,
    },
    {
      label: "Bệnh nhân cũ",
      data: [64, 70, 90, 65, 80, 42, 80, 70, 93, 82, 80, 43],
      borderColor: "rgba(239, 110, 110, 1)",
      backgroundColor: "rgba(239, 110, 110, 1)",
      borderWidth: 2,
      tension: 0,
    },
  ],
};

const configLine = {
  type: "line",
  data: dataLine,
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          font: {
            size: 12,
          },
          usePointStyle: true,
          pointStyle: "line",
          padding: 20,
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: "Tháng",
          font: {
            size: 12,
            weight: "bold",
          },
        },
      },
      y: {
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        title: {
          display: true,
          text: "Bệnh nhân",
          font: {
            size: 12,
            weight: "bold",
          },
        },
        beginAtZero: true,
        ticks: {
          stepSize: 20,
        },
      },
    },
  },
};

const myLineChart = new Chart(lineCTX, configLine);
