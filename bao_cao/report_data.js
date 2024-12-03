// Dữ liệu mẫu cho báo cáo doanh thu
const reportData = {
    totalRevenue: 50000000,
    totalPatients: 2000,
    monthlyData: {
        "10/2024": {
            dailyReports: [
                { date: "1/10/2024", patients: 20, revenue: 10000000, percentage: 2 },
                { date: "2/10/2024", patients: 25, revenue: 12500000, percentage: 2.5 },
                { date: "3/10/2024", patients: 30, revenue: 15000000, percentage: 3 },
                { date: "4/10/2024", patients: 22, revenue: 11000000, percentage: 2.2 },
                { date: "5/10/2024", patients: 28, revenue: 14000000, percentage: 2.8 },
                { date: "6/10/2024", patients: 26, revenue: 13000000, percentage: 2.6 },
                { date: "7/10/2024", patients: 20, revenue: 10000000, percentage: 2 },
                { date: "8/10/2024", patients: 27, revenue: 13500000, percentage: 2.7 },
                { date: "9/10/2024", patients: 21, revenue: 10500000, percentage: 2.1 },
                { date: "10/10/2024", patients: 23, revenue: 11500000, percentage: 2.3 }
            ]
        }
    },

    // Phương thức lấy dữ liệu theo tháng
    getMonthData: function(month) {
        return this.monthlyData[month] || null;
    },

    // Phương thức lấy dữ liệu theo ngày
    getDailyData: function(month, date) {
        const monthData = this.getMonthData(month);
        if (!monthData) return null;
        return monthData.dailyReports.find(report => report.date === date) || null;
    },

    // Phương thức tính tổng doanh thu trong tháng
    calculateMonthlyTotal: function(month) {
        const monthData = this.getMonthData(month);
        if (!monthData) return 0;
        return monthData.dailyReports.reduce((sum, report) => sum + report.revenue, 0);
    }
};

document.addEventListener('DOMContentLoaded', function() {
    // Khởi tạo biểu đồ
    let barChart = null;
    let pieChart = null;

    // Cập nhật thông tin tổng quan
    function updateSummary(monthYear) {
        const monthData = reportData.getMonthData(monthYear);
        if (!monthData) return;

        const totalRevenueElement = document.querySelector('.stats-column .font-medium');
        const totalPatientsElement = document.querySelectorAll('.stats-column .font-medium')[1];
        
        if(totalRevenueElement && totalPatientsElement) {
            totalRevenueElement.textContent = monthData.totalRevenue.toLocaleString() + 'đ';
            totalPatientsElement.textContent = monthData.totalPatients.toLocaleString();
        }
    }

    // Cập nhật biểu đồ cột
    function updateBarChart(monthYear) {
        const monthData = reportData.getMonthData(monthYear);
        if (!monthData) return;

        const dailyData = monthData.dailyReports;
        const labels = dailyData.map(item => item.date);
        const revenues = dailyData.map(item => item.revenue / 1000000);

        if (barChart) {
            barChart.destroy();
        }

        const barCtx = document.getElementById('barChart').getContext('2d');
        barChart = new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    data: revenues,
                    backgroundColor: '#3B82F6'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.raw.toLocaleString() + ' triệu đồng';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value + 'M';
                            },
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

    // Cập nhật biểu đồ tròn
    function updatePieChart(monthYear) {
        const monthData = reportData.getMonthData(monthYear);
        if (!monthData) return;

        if (pieChart) {
            pieChart.destroy();
        }

        const pieCtx = document.getElementById('pieChart').getContext('2d');
        pieChart = new Chart(pieCtx, {
            type: 'pie',
            data: {
                labels: ['Tiền thuốc', 'Tiền khám', 'Khác'],
                datasets: [{
                    data: [40, 35, 25],
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
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.raw + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    // Xử lý sự kiện khi chọn tháng
    function handleMonthSelect() {
        const monthSelector = document.getElementById('monthSelector');
        monthSelector.addEventListener('change', function(e) {
            const selectedMonth = e.target.value;
            
            if (selectedMonth === '10/2024') {
                window.location.href = 'daily_rp.html';
                return;
            }

            if (selectedMonth) {
                updateSummary(selectedMonth);
                updateBarChart(selectedMonth);
                updatePieChart(selectedMonth);
            }
        });
    }

    // Khởi tạo trang với dữ liệu mặc định (tháng hiện tại)
    function initializePage() {
        const currentDate = new Date();
        const defaultMonth = `${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
        
        // Set giá trị mặc định cho selector
        const monthSelector = document.getElementById('monthSelector');
        monthSelector.value = defaultMonth;

        updateSummary(defaultMonth);
        updateBarChart(defaultMonth);
        updatePieChart(defaultMonth);
        handleMonthSelect();
    }

    // Gọi hàm khởi tạo khi trang được load
    initializePage();
});