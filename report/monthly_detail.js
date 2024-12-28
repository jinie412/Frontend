document.addEventListener('DOMContentLoaded', () => {
    // const apiUrl = 'http://localhost:3000/api/thuoc/getphieukhambenhs';
    //after deploy
    const apiUrl = 'https://clinic-management-theta.vercel.app/api/thuoc/getphieukhambenhs';

    // Update title with month parameter
    const urlParams = new URLSearchParams(window.location.search);
    const month = urlParams.get('month');
    document.getElementById('monthTitle').textContent = `Lượng thuốc cụ thể của tháng ${month}`;

    async function fetchMedicineData() {
        try {
            const response = await fetch(apiUrl);
            const { data } = await response.json();

            if (!month) {
                console.error('Không tìm thấy tham số tháng!');
                return;
            }

            const filteredData = data.filter(entry => entry.thang_nam === month);

            renderTable(filteredData);
        } catch (error) {
            console.error('Error fetching medicine data:', error);
        }
    }

    function renderTable(data) {
        const tableBody = document.getElementById('medicineTableBody');
        tableBody.innerHTML = ''; // Clear existing content

        data.forEach((record, idx) => {
            const row = `
                <tr class="border-b hover:bg-gray-100">
                    <td class="py-2 px-4 text-center">${idx + 1}</td>
                    <td class="py-2 px-4">${record.tenthuoc}</td>
                    <td class="py-2 px-4 text-center">${record.donvithuoc}</td>
                    <td class="py-2 px-4 text-center">${record.soluongnhap}</td>
                    <td class="py-2 px-4 text-center">${record.soluongcon}</td>
                    <td class="py-2 px-4 text-center">${record.tong_so_luong}</td>
                </tr>
            `;
            tableBody.insertAdjacentHTML('beforeend', row);
        });
    }

    // Fetch data when the page loads
    fetchMedicineData();
});