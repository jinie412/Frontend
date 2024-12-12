//----------------------------------------------DOUGHNUT GRAPH---------------------------------------------------
const doughnutCTX = document.getElementById("statusChart");

const chartData = {
  monthly: [30, 25, 20],
  yearly: [500, 250, 420],
};

const dataStatus = {
  labels: ["Khỏi bệnh", "Đang điều trị", "Mới cập nhật"],
  datasets: [
    {
      data: chartData.monthly,
      backgroundColor: [
        "rgba(239, 110, 110, 1)", // màu: redNote
        "rgba(83, 199, 151, 1)", // màu: greenNote
        "rgba(241, 181, 97, 1)", // màu: yellowNote
      ],
      hoverOffset: 4,
    },
  ],
};

const configDoughnut = {
  type: "doughnut",
  data: dataStatus,
  options: {
    responsive: true,

    plugins: {
      legend: {
        display: true,
        position: "right",
        labels: {
          font: {
            size: 12,
          },

          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        enabled: true,
      },
    },
  },
};
const statusChart = new Chart(doughnutCTX, configDoughnut);

// Lắng nghe sự kiện thay đổi từ dropdown
document.getElementById("timeRange").addEventListener("change", function () {
  const selectedValue = this.value;

  statusChart.data.datasets[0].data = chartData[selectedValue];
  statusChart.update();
});
