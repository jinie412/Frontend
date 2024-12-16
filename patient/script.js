// Function to fetch patient data from the backend
async function fetchPatientData() {
    try {
        const response = await fetch('http://localhost:3000/api/benh-nhan');
        const result = await response.json();
        if (result.success) {
            const patients = result.data;
            console.log(patients);
            renderPatients(patients);
        } else {
            console.error('Failed to fetch patient data');
        }
    } catch (error) {
        console.error('Error fetching patient data:', error);
    }
}

// Call the function to fetch patient data
fetchPatientData();

// Render danh sách bệnh nhân
function renderPatients(patients) {
  const patientList = document.getElementById("patient-list");
  patientList.innerHTML = patients
    .map(
      (patient, index) => `
      <tr ondblclick="selectPatient('${patient.id}')">
        <td>${index + 1}</td>
        <td>${patient.id}</td>
        <td>${patient.name}</td>
        <td>${patient.gender}</td>
        <td>${patient.ethnicity}</td>
        <td>${patient.birthDate}</td>
        <td>${patient.address}</td>
        <td>${patient.phone}</td>
        <td>${patient.job}</td>
        <td>${patient.notes}</td>
      </tr>
    `
    )
    .join("");
}

// Tìm kiếm bệnh nhân và hiển thị lại bảng
function searchPatients() {
  const filter = document.getElementById("search-filter").value;
  const query = document.getElementById("search-input").value.toLowerCase();
  
  // Lọc danh sách bệnh nhân theo từ khóa
  const filteredPatients = patients.filter((patient) =>
    patient[filter]?.toLowerCase().includes(query)
  );
  
  // Hiển thị lại bảng sau khi lọc
  document.getElementById("patient-list").innerHTML = filteredPatients
    .map(
      (patient, index) => `
      <tr ondblclick="selectPatient('${patient.id}')">
        <td>${index + 1}</td>
        <td>${patient.id}</td>
        <td>${patient.name}</td>
        <td>${patient.gender}</td>
        <td>${patient.ethnicity}</td>
        <td>${patient.birthDate}</td>
        <td>${patient.address}</td>
        <td>${patient.phone}</td>
        <td>${patient.job}</td>
        <td>${patient.notes}</td>
      </tr>
    `
    )
    .join("");
}

// Gán sự kiện cho nút tìm kiếm
document.getElementById("search-button").addEventListener("click", searchPatients);

// Khởi chạy trang
renderPatients();

// Xử lí thanh tìm kiếm
function toggleSearchInput() {
    const selectElement = document.getElementById('search-filter');
    const inputElement = document.getElementById('search-input');
    
    // Kiểm tra xem đã chọn một mục hay chưa
    if (selectElement.value === "") {
        inputElement.disabled = true;  // Nếu chưa chọn, input bị disabled
    } else {
        inputElement.disabled = false;  // Nếu đã chọn, input có thể sử dụng
    }
}

// Đảm bảo input bị vô hiệu hóa ngay khi trang tải
document.addEventListener('DOMContentLoaded', () => {
    toggleSearchInput();  // Kiểm tra khi trang tải
});

// Lưu thông tin bệnh nhân đã chọn vào sessionStorage và chuyển đến Trang nhận bệnh 2
function selectPatient(patientId) {
  const selectedPatient = patients.find(patient => patient.id === patientId);
  sessionStorage.setItem("selectedPatient", JSON.stringify(selectedPatient)); // Lưu thông tin vào sessionStorage
  window.location.href = "patient-info.html"; // Chuyển hướng tới Trang nhận bệnh 2
}
