
let patients = [];

// API Service
const PatientAPI = {
    getPatients: async () => {
        try {
            const response = await fetch('http://localhost:3000/api/benh-nhan');
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            const data = await response.json();
            patients = data['data']; // Lưu vào biến toàn cục
            // return data['data'];
        } catch (error) {
            console.error('Lỗi khi lấy danh sách bệnh nhân:', error);
            alert('Không thể lấy danh sách bệnh nhân: ' + error.message);
            return [];
        }
    }
};

// Khởi tạo dữ liệu khi trang load
window.addEventListener('load', async () => {
    patients = PatientAPI.getPatients();
});

// Hàm lấy giá trị từ các ô nhập liệu
function getSearchCriteria() {
    return {
        mabenhnhan: document.getElementById("searchPatientId").value.trim(),
        hoten: document.getElementById("searchFullName").value.trim(),
        gioitinh: document.getElementById("searchGender").value,
        dantoc: document.getElementById("searchEthnicity").value.trim(),
        ngaysinh: document.getElementById("searchDob").value,
        diachi: document.getElementById("searchAddress").value.trim(),
        sodienthoai: document.getElementById("searchPhone").value.trim(),
        nghenghiep: document.getElementById("searchJob").value.trim()
    };
}

// Hàm lọc bệnh nhân theo tiêu chí
function filterPatients(criteria) {
    return patients.filter(patient => {
        return (
            (!criteria.mabenhnhan || patient.mabenhnhan===parseInt(criteria.mabenhnhan)) &&
            (!criteria.hoten || patient.hoten.toLowerCase().includes(criteria.hoten.toLowerCase())) &&
            (!criteria.gioitinh || patient.gioitinh === criteria.gioitinh) &&
            (!criteria.dantoc || patient.dantoc.toLowerCase().includes(criteria.dantoc.toLowerCase())) &&
            (!criteria.ngaysinh || patient.ngaysinh.split('T')[0] === criteria.ngaysinh) &&
            (!criteria.diachi || patient.diachi.toLowerCase().includes(criteria.diachi.toLowerCase())) &&
            (!criteria.sodienthoai || patient.sodienthoai.includes(criteria.sodienthoai)) &&
            (!criteria.nghenghiep || patient.nghenghiep.toLowerCase().includes(criteria.nghenghiep.toLowerCase()))
        );
    });
}

// Hàm hiển thị kết quả trong bảng
function displayResults(filteredPatients) {
    const resultTableBody = document.getElementById("resultTableBody");
    resultTableBody.innerHTML = ""; // Xóa kết quả cũ

    if (filteredPatients.length > 0) {
        filteredPatients.forEach((patient, index) => {
            const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${patient.mabenhnhan}</td>
                    <td>${patient.hoten}</td>
                    <td>${patient.gioitinh}</td>
                    <td>${patient.dantoc}</td>
                    <td>${patient.ngaysinh.split('T')[0]}</td>
                    <td>${patient.diachi}</td>
                    <td>${patient.sodienthoai}</td>
                    <td>${patient.nghenghiep}</td>
                    <td>${patient.ghichu}</td>
                </tr>
            `;
            resultTableBody.innerHTML += row;
        });
    } else {
        resultTableBody.innerHTML = `<tr><td colspan="10" style="text-align: left;">Không tìm thấy bệnh nhân.</td></tr>`;
    }
}

// Xử lý khi nhấn nút tìm kiếm
document.getElementById("searchButton").addEventListener("click", function () {
    const criteria = getSearchCriteria(); // Lấy tiêu chí tìm kiếm
    const filteredPatients = filterPatients(criteria); // Lọc danh sách bệnh nhân
    displayResults(filteredPatients); // Hiển thị kết quả
});

// Lấy mã phiếu khám từ mã bệnh nhân
const getMedicalExaminationID = async (patientId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/benh-nhan/getkhambenh/${patientId}`);
      const result = await response.json();
  
      if (result.success) {
        return result.data.length > 0 ? result.data[0].maphieukham : undefined;
      } else {
            console.error('Failed to fetch medical examination ID');
            return undefined;
      }
    } catch (error) {
        console.error('Error fetching medical examination ID:', error);
        return undefined;
    }
};

let selectedRow = null;

// Thêm sự kiện chọn dòng
document.getElementById("resultTableBody").addEventListener("click", function (event) {
    const clickedCell = event.target.closest("td");
    if (clickedCell) {
        const clickedRow = clickedCell.parentElement;
        if (selectedRow) {
            selectedRow.classList.remove("selected-row");
        }
        selectedRow = clickedRow;
        selectedRow.classList.add("selected-row");
    }
});

// Hàm thêm sự kiện cho nút xem phiếu khám
document.getElementById("viewRecordButton").addEventListener("click", async function () {
    if(selectedRow){
        const patientId = selectedRow.cells[1].innerText;
        try{
            const medicalExaminationId = await getMedicalExaminationID(patientId);
            if(medicalExaminationId){
                // Chuyển hướng đến phiếu khám bệnh
                window.location.href = `../examination_health/index.html?patient-id=${patientId}&medical-examination-id=${medicalExaminationId}`;
            }else{
                alert("Không tìm thấy mã phiếu khám bệnh của bệnh nhân này.");
            }
        }catch(error){
            alert("Lỗi khi lấy mã phiếu khám bệnh: " + error.message);
        }
    }
})

// Hàm thêm sự kiện cho nút thêm phiếu khám bệnh
document.getElementById("addRecordButton").addEventListener("click", async function () {
    if(selectedRow){
        const patientId = selectedRow.cells[1].innerText;
        const date = new Date().toISOString().split('T')[0];
        try{
            const response = await fetch(`http://localhost:3000/api/phieu-kham-benh/new`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    mabenhnhan: patientId,
                    ngaykham: date,
                })
            })
            const result = await response.json();
            if(result.success){
                alert("Thêm phiếu khám bệnh thành công.");
                window.location.href = `../examination_health/index.html?patient-id=${patientId}&medical-examination-id=${result.data.maphieukham}`;
            }else{
                alert("Thêm phiếu khám bệnh thất bại.");
            }
        }catch(error){
            alert("Lỗi khi thêm phiếu khám bệnh: " + error.message);
        }
    }else{
        alert("Vui lòng chọn một bệnh nhân để thêm phiếu khám bệnh.");
    }
});