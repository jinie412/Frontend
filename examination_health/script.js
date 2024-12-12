// Hàm tính tuổi từ ngày sinh
function calculateAge(birthDate) {
  const birthYear = new Date(birthDate).getFullYear();
  const currentYear = new Date().getFullYear();
  return currentYear - birthYear;
  }

// Lấy dữ liệu bệnh nhân từ sessionStorage
const patientData = JSON.parse(sessionStorage.getItem('patientData'));

// Kiểm tra nếu dữ liệu tồn tại
if (patientData) {
  document.getElementById("patient-id").value = patientData.id;
  document.getElementById("patient-name").value = patientData.name;
  document.getElementById("patient-gender").value = patientData.gender;
  document.getElementById("birth-date").value = patientData.birthDate;
  document.getElementById("age").value = patientData.age;
  document.getElementById("address").value = patientData.address;
  document.getElementById("phone").value = patientData.phone;
  document.getElementById("job").value = patientData.job;

  // Tính và hiển thị tuổi của bệnh nhân
  const age = calculateAge(patientData.birthDate);
  document.getElementById("age").value = age; // Hiển thị tuổi bệnh nhân
} else {
  alert("Không tìm thấy thông tin bệnh nhân.");
}

// Xóa thông tin bệnh nhân sau khi sử dụng
// sessionStorage.removeItem('patientData');

// Hàm xử lý sự kiện Quay lại ở Trang khám bệnh
document.getElementById("back-btn").addEventListener("click", function () {
  const patientId = document.getElementById("patient-id").value; // Lấy mã bệnh nhân từ form

  // Lấy thông tin bệnh nhân từ sessionStorage
  let patients = JSON.parse(sessionStorage.getItem('patients')) || [];

  // Cập nhật trạng thái bệnh nhân
  patients = patients.map(patient => {
    if (patient.id === patientId) {
      patient.status = "Đã khám"; // Cập nhật trạng thái là "Đã khám"
    }
    return patient;
  });

  // Lưu lại danh sách bệnh nhân vào sessionStorage
  sessionStorage.setItem('patients', JSON.stringify(patients));

  // Quay lại Trang nhận bệnh
  window.location.href = "../admitted_patient/index.html";
});
