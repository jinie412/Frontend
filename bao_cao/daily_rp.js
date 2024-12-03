document.addEventListener('DOMContentLoaded', function() {
    // Render dữ liệu báo cáo
    function renderReportTable(month) {
        const monthData = reportData.getMonthData(month);
        const tableBody = document.getElementById('reportTableBody');
        tableBody.innerHTML = '';

        if (monthData) {
            monthData.dailyReports.forEach((report, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="p-3">${index + 1}</td>
                    <td class="p-3">${report.date}</td>
                    <td class="p-3">${report.patients}</td>
                    <td class="p-3">${report.revenue.toLocaleString()}đ</td>
                    <td class="p-3">${report.percentage}%</td>
                `;
                tableBody.appendChild(row);
            });
        }
    }

    // Xử lý sự kiện thay đổi tháng
    const monthSelect = document.getElementById('monthSelect');
    monthSelect.addEventListener('change', function() {
        renderReportTable(this.value);
    });

    // Render dữ liệu ban đầu
    renderReportTable('10/2024');
});