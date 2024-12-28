async function fetchData() {
    // const response = await fetch('http://localhost:3000/api/hoa-don/doanhthu');
    //after deploy
    const response = await fetch('https://clinic-management-theta.vercel.app/api/hoa-don/doanhthu');
    const data = await response.json();

    //get total revenue by summing all the revenue in the data
    document.getElementById('totalRevenue').textContent = data.data.reduce((acc, item) => acc + parseFloat(item.tong_doanh_thu), 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    return data;
}

async function createCharts() {
    const responseData = await fetchData();

    // Sum all data for the pie chart
    let totalDoanhThuThuoc = 0;
    let totalDoanhThuKham = 0;
    let totalTongDoanhThu = 0;

    responseData.data.forEach(item => {
        totalDoanhThuThuoc += parseFloat(item.doanh_thu_thuoc);
        totalDoanhThuKham += parseFloat(item.doanh_thu_kham);
        totalTongDoanhThu += parseFloat(item.tong_doanh_thu);
    });

    const otherRevenue = totalTongDoanhThu - totalDoanhThuThuoc - totalDoanhThuKham;

    console.log('Summed Values:', totalDoanhThuThuoc, totalDoanhThuKham, otherRevenue);


    // Pie Chart
    const pieCtx = document.getElementById('pieChart').getContext('2d');
    new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: ['Tiền thuốc', 'Tiền khám', 'Khác'],
            datasets: [{
                data: [totalDoanhThuThuoc, totalDoanhThuKham, otherRevenue],
                backgroundColor: ['#EF4444', '#10B981', '#6B7280']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 12,
                        padding: 15
                    }
                }
            }
        }
    });

    // Extract data for the bar chart
    const barLabels = responseData.data.map(item => item.thang_nam);
    const barData = responseData.data.map(item => parseFloat(item.tong_doanh_thu));

    // Bar Chart
    const barCtx = document.getElementById('barChart').getContext('2d');
    new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: barLabels,
            datasets: [{
                data: barData,
                backgroundColor: '#3B82F6'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

//get amount of patients
async function fetchPatientCount() {
    // const response = await fetch('http://localhost:3000/api/benh-nhan');
    //after deploy
    const response = await fetch('https://clinic-management-theta.vercel.app/api/benh-nhan');
    const data = await response.json();

    document.getElementById('totalPatient').textContent = data.data.length;
    return data;
}

async function populateMonthSelector() {
    const responseData = await fetchData();
    const monthSelector = document.getElementById('monthSelector');

    // Extract unique months from the data
    const uniqueMonths = [...new Set(responseData.data.map(item => item.thang_nam))];

    // Populate the select element with the unique months
    uniqueMonths.forEach(month => {
        const option = document.createElement('option');
        option.value = month;
        option.textContent = `Tháng ${month}`;
        monthSelector.appendChild(option);
    });
}

document.getElementById('monthSelector').addEventListener('change', function() {
    const selectedMonth = this.value;
    if (selectedMonth) {
        window.location.href = `../report/daily_rp.html?month=${selectedMonth}`;
    }
});

//createCharts();
document.addEventListener('DOMContentLoaded', () => {
    createCharts();
    fetchPatientCount();
    populateMonthSelector();
});