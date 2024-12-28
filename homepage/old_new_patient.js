const lineCTX = document.getElementById("LineChart").getContext("2d");

async function fetchDataAndUpdateChart() {
  try {
    // const response = await fetch('http://localhost:3000/api/benh-nhan/getkhambenh');
    //after deploy
    const response = await fetch('https://clinic-management-theta.vercel.app/api/benh-nhan/getkhambenh');
    const data = await response.json();

    const newPatientsData = new Array(12).fill(0);
    const oldPatientsData = new Array(12).fill(0);

    const currentYear = new Date().getFullYear();
    let totalPatients = 0;
    let totalVisits = 0;

    data.data.forEach(patient => {
      totalPatients++;
      patient.phieukhambenhs.forEach(visit => {
        totalVisits++;
        // Assuming the date format is YYYY-MM-DD
        const visitDate = new Date(visit.ngaykham);
        if (isNaN(visitDate)) {
          console.error('Invalid Date:', visit.ngaykham);
          return;
        }

        const month = visitDate.getMonth();
        const isNew = visitDate.getFullYear() === currentYear;

        if (isNew) {
          newPatientsData[month]++;
        } else {
          oldPatientsData[month]++;
        }
      });
    });

    const dataLine = {
      labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
      datasets: [
        {
          label: "Bệnh nhân mới",
          data: newPatientsData,
          borderColor: "rgba(57, 108, 240, 1)",
          backgroundColor: "rgba(57, 108, 240, 1)",
          borderWidth: 2,
          tension: 0,
        },
        {
          label: "Bệnh nhân cũ",
          data: oldPatientsData,
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
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

fetchDataAndUpdateChart();