let revenueChart; // Declare the variable only once at the top

async function fetchData() {
    // const response = await fetch('http://localhost:3000/api/hoa-don/doanhthu-by-day');
    //after deploy
    const response = await fetch('https://clinic-management-theta.vercel.app/api/hoa-don/doanhthu-by-day');
    const result = await response.json();
    const data = result.data;
    
    const month = getQueryParam('month');
    if (month && Array.isArray(data)) {
        return data.filter(item => item.ngay_thang_nam.includes(month));
    } else {
        return data;
    }
}

function populateTable(data) {
    const tableBody = document.getElementById('reportTableBody');
    tableBody.innerHTML = ''; // Clear existing data

    console.log(data);

    data.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.ngay_thang_nam}</td>
            <td>${item.so_benh_nhan || 'N/A'}</td>
            <td>${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.tong_doanh_thu)}</td>
            <td>${((parseFloat(item.tong_doanh_thu) / data.reduce((acc, cur) => acc + parseFloat(cur.tong_doanh_thu), 0)) * 100).toFixed(2)}%</td>
        `;
        tableBody.appendChild(row);
    });
}

function createChart(data) {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    const labels = data.map(item => item.ngay_thang_nam);
    const revenueData = data.map(item => parseFloat(item.tong_doanh_thu));

    // Destroy the existing chart instance if it exists
    if (revenueChart) {
        revenueChart.destroy();
    }

    revenueChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Doanh thu',
                data: revenueData,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

async function init() {
    updateReportTitle();
    const data = await fetchData();
    populateTable(data);
    createChart(data);
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function updateReportTitle() {
    const month = getQueryParam('month');
    if (month) {
        const reportTitle = document.getElementById('reportTitle');
        reportTitle.textContent = `Báo cáo doanh thu tháng ${month}`;
    }
}

document.addEventListener('DOMContentLoaded', init);