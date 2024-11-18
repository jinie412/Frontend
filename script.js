// Danh sách mẫu bệnh nhân
const patients = [
  {
    id: "BN0001",
    name: "Nguyễn Văn A",
    gender: "Nam",
    ethnicity: "Kinh",
    birthDate: "01/01/1989",
    address: "Phường 10, Quận 5, TP. HCM",
    phone: "0927382912",
    job: "Kỹ sư",
    notes: ""
  },
  {
    id: "BN0002",
    name: "Trần Thị B",
    gender: "Nữ",
    ethnicity: "Kinh",
    birthDate: "12/12/1990",
    address: "Phường 3, Quận 10, TP. HCM",
    phone: "0378272919",
    job: "Nội trợ",
    notes: ""
  },
  {
    id: "BN0003",
    name: "Nguyễn Văn A",
    gender: "Nam",
    ethnicity: "Kinh",
    birthDate: "01/01/1989",
    address: "Phường 10, Quận 5, TP. HCM",
    phone: "0927382912",
    job: "Kỹ sư",
    notes: ""
  },
  {
    id: "BN0004",
    name: "Nguyễn Văn A",
    gender: "Nam",
    ethnicity: "Kinh",
    birthDate: "01/01/1989",
    address: "162 Lý Thường Kiệt, Phường 10, Quận 5, TP. HCM",
    phone: "0927382912",
    job: "Kỹ sư",
    notes: ""
  },
  {
    id: "BN0005",
    name: "Nguyễn Văn A",
    gender: "Nam",
    ethnicity: "Kinh",
    birthDate: "01/01/1989",
    address: "Phường 10, Quận 5, TP. HCM",
    phone: "0927382912",
    job: "Kỹ sư",
    notes: ""
  },
  {
    id: "BN0006",
    name: "Nguyễn Văn A",
    gender: "Nam",
    ethnicity: "Kinh",
    birthDate: "01/01/1989",
    address: "Phường 10, Quận 5, TP. HCM",
    phone: "0927382912",
    job: "Kỹ sư",
    notes: ""
  },
  {
    id: "BN0007",
    name: "Nguyễn Văn A",
    gender: "Nam",
    ethnicity: "Kinh",
    birthDate: "01/01/1989",
    address: "Phường 10, Quận 5, TP. HCM",
    phone: "0927382912",
    job: "Kỹ sư",
    notes: ""
  },
  {
    id: "BN0008",
    name: "Trần Thị B",
    gender: "Nữ",
    ethnicity: "Kinh",
    birthDate: "12/12/1990",
    address: "Phường 3, Quận 10, TP. HCM",
    phone: "0378272919",
    job: "Nội trợ",
    notes: ""
  },
  {
    id: "BN0009",
    name: "Trần Thị B",
    gender: "Nữ",
    ethnicity: "Kinh",
    birthDate: "12/12/1990",
    address: "Phường 3, Quận 10, TP. HCM",
    phone: "0378272919",
    job: "Nội trợ",
    notes: ""
  },
  {
    id: "BN0010",
    name: "Trần Thị B",
    gender: "Nữ",
    ethnicity: "Kinh",
    birthDate: "12/12/1990",
    address: "Phường 3, Quận 10, TP. HCM",
    phone: "0378272919",
    job: "Nội trợ",
    notes: ""
  },
  {
    id: "BN0011",
    name: "Trần Thị B",
    gender: "Nữ",
    ethnicity: "Kinh",
    birthDate: "12/12/1990",
    address: "Phường 3, Quận 10, TP. HCM",
    phone: "0378272919",
    job: "Nội trợ",
    notes: ""
  },
  {
    id: "BN0012",
    name: "Trần Thị B",
    gender: "Nữ",
    ethnicity: "Kinh",
    birthDate: "12/12/1990",
    address: "Phường 3, Quận 10, TP. HCM",
    phone: "0378272919",
    job: "Nội trợ",
    notes: ""
  }
];

// Render danh sách bệnh nhân
function renderPatients() {
  const patientList = document.getElementById("patient-list");
  patientList.innerHTML = patients
    .map(
      (patient, index) => `
      <tr>
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

// Tìm kiếm bệnh nhân
function searchPatients() {
  const filter = document.getElementById("search-filter").value;
  const query = document.getElementById("search-input").value.toLowerCase();
  const filteredPatients = patients.filter((patient) =>
    patient[filter]?.toLowerCase().includes(query)
  );
  document.getElementById("patient-list").innerHTML = filteredPatients
    .map(
      (patient, index) => `
      <tr>
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
