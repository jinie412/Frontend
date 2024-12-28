// Fetch dữ liệu từ API và xử lý hiển thị
const apiUrl = "http://localhost:3000/api/thuoc/getphieukhambenhs"; // Thay đổi endpoint phù hợp


async function fetchMedicineData() {
    try {
        const response = await fetch(apiUrl);
        const result = await response.json();

        if (result.success) {
            const data = result.data;
            renderPieChart(data);
            renderTable(data);
        } else {
            console.error("Error fetching data", result);
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

// Vẽ biểu đồ tỉ lệ các loại thuốc được sử dụng
function renderPieChart(data) {
    const medicationCounts = {};

    // Tính tổng lượng thuốc sử dụng theo từng loại
    data.forEach((item) => {
        if (!medicationCounts[item.tenthuoc]) {
            medicationCounts[item.tenthuoc] = 0;
        }
        medicationCounts[item.tenthuoc] += parseInt(item.tong_so_luong, 10);
    });

    const labels = Object.keys(medicationCounts);
    const values = Object.values(medicationCounts);

    const ctx = document.getElementById("medicationPieChart").getContext("2d");
    new Chart(ctx, {
        type: "pie",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Tỉ lệ các loại thuốc",
                    data: values,
                    backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        "#4BC0C0",
                        "#9966FF",
                        "#FF9F40",
                    ],
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "top",
                },
            },
        },
    });
}

// Hiển thị bảng tổng lượng thuốc hàng tháng
function renderTable(data) {
    const tableBody = document.getElementById("medicineTableBody");
    const aggregatedData = {};

    // Tổng hợp dữ liệu theo tháng
    data.forEach((item) => {
        if (!aggregatedData[item.thang_nam]) {
            aggregatedData[item.thang_nam] = {
                month: item.thang_nam,
                totalTypes: 0,
                totalQuantity: 0,
            };
        }

        aggregatedData[item.thang_nam].totalTypes += 1;
        aggregatedData[item.thang_nam].totalQuantity += parseInt(item.tong_so_luong, 10);
    });

    const rows = Object.values(aggregatedData).map((item, index) => {
        const monthLink = `../report/monthly_detail.html?month=${item.month}`;
        return `<tr class="border-b">
              <td class="py-2 px-4 text-center">${index + 1}</td>
              <td class="py-2 px-4 text-center">
                <a href="${monthLink}" class="text-blue-500 hover:underline">
                ${item.month}</a>
              </td>
              <td class="py-2 px-4 text-center">${item.totalTypes}</td>
              <td class="py-2 px-4 text-center">${item.totalQuantity}</td>
            </tr>`;
    });

    tableBody.innerHTML = rows.join("");
}

// Gọi hàm fetch dữ liệu khi tải trang
fetchMedicineData();
