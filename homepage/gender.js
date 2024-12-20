document.addEventListener("DOMContentLoaded", function () {
    const barCTX = document.getElementById("patientChart");

    function calculateAge(birthday) {
        const birthDate = new Date(birthday);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    function fetchDataAndUpdateChart() {
        fetch('http://localhost:3000/api/benh-nhan')
            .then(response => response.json())
            .then(data => {
                const ageGroups = ["0-16", "16-20", "20-40", "40-60", ">60"];
                const maleData = [0, 0, 0, 0, 0];
                const femaleData = [0, 0, 0, 0, 0];

                data.data.forEach(patient => {
                    const age = calculateAge(patient.ngaysinh);
                    const gender = patient.gioitinh;

                    if (age <= 16) {
                        gender === 'Nam' ? maleData[0]++ : femaleData[0]++;
                    } else if (age <= 20) {
                        gender === 'Nam' ? maleData[1]++ : femaleData[1]++;
                    } else if (age <= 40) {
                        gender === 'Nam' ? maleData[2]++ : femaleData[2]++;
                    } else if (age <= 60) {
                        gender === 'Nam' ? maleData[3]++ : femaleData[3]++;
                    } else {
                        gender === 'Nam' ? maleData[4]++ : femaleData[4]++;
                    }
                });

                const dataBar = {
                    labels: ageGroups,
                    datasets: [
                        {
                            label: "Nam",
                            data: maleData,
                            backgroundColor: "rgba(239, 110, 110, 1)", // màu: RedNote
                            borderWidth: 0,
                            borderRadius: 2,
                        },
                        {
                            label: "Nữ",
                            data: femaleData,
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
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    fetchDataAndUpdateChart();
});