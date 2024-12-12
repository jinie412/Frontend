//----------------------------------------------BAR GRAPH---------------------------------------------------
const barCTX = document.getElementById("patientChart");

const dataBar = {
  labels: ["0-16", "16-20", "20-40", "40-60", ">60"],
  datasets: [
    {
      label: "Nam",
      data: [12, 19, 30, 25, 20],
      backgroundColor: "rgba(239, 110, 110, 1)", // màu: RedNote
      borderWidth: 0,
      borderRadius: 2,
    },
    {
      label: "Nữ",
      data: [5, 32, 12, 10, 22],
      backgroundColor: "rgba(83, 199, 151, 1)", // màu: GreenNote
      borderWidth: 0,
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
          text: "Độ tuổi",
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
