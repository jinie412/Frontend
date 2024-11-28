//----------------------------------------------BAR GRAPH---------------------------------------------------
const barCTX = document.getElementById("patientChart");

const dataBar = {
  labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
  datasets: [
    {
      label: "Nam",
      data: [12, 19, 30, 25, 20, 34, 57, 28, 19, 10, 21, 12],
      backgroundColor: "rgba(57, 108, 240, 1)", // màu: RedNote
      borderWidth: 0,
      borderRadius: 2,
    },
    {
      label: "Nữ",
      data: [5, 32, 12, 10, 22, 13, 27, 28, 49, 40, 10, 16],
      backgroundColor: "rgba(83, 199, 151, 1)", // màu: GreenNote
      borderWidth: 0,
      borderRadius: 2,
    },
    {
      label: "Trẻ em",
      data: [12, 19, 13, 5, 12, 3, 17, 8, 9, 10, 11, 12],
      backgroundColor: "rgba(241, 181, 97, 1)", // màu: yellowNote
      borderRadius: 2,
    },
  ],
};

const configBar = {
  type: "bar",
  data: dataBar,
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
          boxWidth: 15,
          boxHeight: 15,
          padding: 20,
          useBorderRadius: true,
          borderRadius: 5,
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
          display: true,
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
const barChart = new Chart(barCTX, configBar);
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
