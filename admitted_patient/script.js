let patientCount = 0;

// Tính tuổi dựa vào ngày sinh
function calculateAge(dob) {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  // Điều chỉnh nếu chưa qua sinh nhật trong năm hiện tại
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
}

// Cập nhật tuổi khi người dùng chọn ngày sinh
document.getElementById("dob").addEventListener("change", function () {
  const dob = this.value;
  if (dob) {
    const age = calculateAge(dob);
    document.getElementById("age").value = age;
  }
});

// Tự động cập nhật Ngày khám là ngày hiện tại
document.getElementById("exam-date").value = new Date().toISOString().split('T')[0];

let selectedRow = null;

// Function to fetch patient data from the backend
async function fetchPatientData() {
  try {
      const response = await fetch('http://localhost:3000/api/benh-nhan/getkhambenh');
      const result = await response.json();
      if (result.success) {
          const patients = result.data;
          populateTable(patients);
          setPatientId(patients);
      } else {
          console.error('Failed to fetch patient data');
      }
  } catch (error) {
      console.error('Error fetching patient data:', error);
  }
}

// Function to set the patient ID to the highest ID + 1
function setPatientId(patients) {
  if (patients.length > 0) {
      const highestId = Math.max(...patients.map(patient => patient.mabenhnhan));
      document.getElementById("patient-id").value = highestId + 1;
  } else {
      document.getElementById("patient-id").value = "Error";
  }
}

// Function to populate the table with patient data
function populateTable(patients) {
  const tbody = document.getElementById("patient-table");
  tbody.innerHTML = '';
  const date = document.getElementById("exam-date").value;

  // normalize date
  const normalizeDate = (date) => {
    return date.split("T")[0];
  }

  let countSTT = 1;
  patients.forEach((patient, index) => {
    const matchedDates = patient.phieukhambenhs.filter(phieu => {
      const ngayKham = normalizeDate(phieu.ngaykham);
      return ngayKham === date;
    });
    if(matchedDates.length > 0) {
      const row = document.createElement('tr');
      row.setAttribute('data-id', patient.mabenhnhan);
      
      row.innerHTML = `
          <td>${countSTT}</td>
          <td class="status">${patient.phieukhambenhs.length > 0 ? patient.phieukhambenhs[0].trangthai : ''}</td>
          <td>${patient.mabenhnhan}</td>
          <td>${patient.hoten}</td>
          <td>${patient.gioitinh}</td>
          <td>${patient.dantoc}</td>
          <td>${normalizeDate(patient.ngaysinh)}</td>
          <td>${patient.diachi}</td>
          <td>${patient.sodienthoai}</td>
          <td>${patient.nghenghiep}</td>
          <td>${patient.ghichu}</td>
      `;
      tbody.appendChild(row);
      countSTT++;
    }
  });
  checkDefaultMessage();
}

// Add event listener to the date input field
document.getElementById("exam-date").addEventListener("change", function () {
  fetchPatientData();
});

// Call the function to fetch patient data when the page loads
document.addEventListener("DOMContentLoaded", function () {
  fetchPatientData();
});

// Kiểm tra số lượng bệnh nhân và hiển thị thông báo
async function checkPatientLimit() {
  try {
    // Lấy dữ liệu bệnh nhân
    const patientResponse = await fetch('http://localhost:3000/api/benh-nhan/getkhambenh');
    const patientResult = await patientResponse.json();

    // Lấy quy định số lượng bệnh nhân tối đa
    const quyDinhResponse = await fetch('http://localhost:3000/api/quy-dinh');
    const quyDinhResult = await quyDinhResponse.json();

    if (patientResult.success && quyDinhResult.success) {
      const patients = patientResult.data;
      const maxNumOfPatient = quyDinhResult.data[0].soluongbenhnhantoida;
      // const maxNumOfPatient = 3;

      // Lấy ngày khám từ input
      const date = document.getElementById("exam-date").value.split('T')[0];
      let count = 0;

      // Đếm số lượng bệnh nhân trong ngày
      patients.forEach(patient => {
        patient.phieukhambenhs.forEach(phieu => {
          if (phieu.ngaykham.split('T')[0] === date) {
            count++;
          }
        });
      });

      return count >= maxNumOfPatient;

    } else {
      console.error('Failed to fetch data');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Function to add a new patient to the table
document.getElementById("btn-save").addEventListener("click", async function (event) {
  event.preventDefault(); // Prevent the form from submitting normally

  // Kiểm tra số lượng bệnh nhân trong ngày có vượt quá quy định không
  const isFull = await checkPatientLimit();
  if (isFull) {
    alert("Số lượng bệnh nhân trong ngày đã đạt tối đa.");
    window.location.reload();
    return;
  }

  // Get values from the form
  const mabenhnhan = document.getElementById("patient-id").value;
  const hoten = document.getElementById("name").value.trim();
  const gioitinh = document.getElementById("gender").value.trim();
  const dantoc = document.getElementById("ethnicity").value.trim();
  const ngaysinh = document.getElementById("dob").value.trim();
  const diachi = document.getElementById("address").value.trim();
  const sodienthoai = document.getElementById("phone").value.trim();
  const nghenghiep = document.getElementById("job").value.trim();
  const ghichu = document.getElementById("notes").value.trim();

  // Kiểm tra các thông tin không được để trống
  if (!hoten || !gioitinh || !dantoc || !ngaysinh || !diachi || !sodienthoai || !nghenghiep) {
    alert("Vui lòng nhập đầy đủ thông tin bệnh nhân.");
    return;
  }

  // Kiểm tra số điện thoại có hợp lệ không
  if (sodienthoai.length !== 10 || /^\d+$/.test(sodienthoai) === false) {
    alert("Số điện thoại không hợp lệ.");
    return;
  }

  // Kiểm tra ngày sinh có hợp lệ không
  if (ngaysinh > new Date().toISOString().split('T')[0]) {
    alert("Ngày sinh không hợp lệ.");
    return;
  }

  const patient = {
      mabenhnhan,
      hoten,
      gioitinh,
      dantoc,
      ngaysinh,
      diachi,
      sodienthoai,
      nghenghiep,
      ghichu
  };

  // Thêm bệnh nhân vào DB
  try {
      const response = await fetch('http://localhost:3000/api/benh-nhan/add', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(patient)
      });
      const result = await response.json();
      if (result.success) {
          fetchPatientData();
      } else {
          console.error('Failed to add patient');
      }
  } catch (error) {
      console.error('Error adding patient:', error);
  }

  // khởi tạo lại form
  document.getElementById("patient-form").reset();
  selectedRow = null;
});

// Xử lý nút Sửa
document.getElementById("btn-edit").addEventListener("click", function () {
  if (selectedRow) {
    document.getElementById("patient-id").value =
      selectedRow.cells[2].innerText;
    document.getElementById("name").value = selectedRow.cells[3].innerText;
    document.getElementById("gender").value = selectedRow.cells[4].innerText;
    document.getElementById("ethnicity").value = selectedRow.cells[5].innerText;
    document.getElementById("dob").value = selectedRow.cells[6].innerText;
    document.getElementById("address").value = selectedRow.cells[7].innerText;
    document.getElementById("phone").value = selectedRow.cells[8].innerText;
    document.getElementById("job").value = selectedRow.cells[9].innerText;
    document.getElementById("notes").value = selectedRow.cells[10].innerText;
  } else {
    alert("Vui lòng chọn một bệnh nhân để sửa.");
  }
});

// Hàm kiểm tra và hiển thị thông báo mặc định nếu bảng trống
function checkDefaultMessage() {
  const patientTable = document.getElementById("patient-table");
  const rows = patientTable.getElementsByTagName("tr");

  // Nếu không còn dòng dữ liệu nào, thêm lại dòng thông báo
  if (rows.length === 0) {
      const defaultMessageRow = document.createElement("tr");
      defaultMessageRow.id = "default-message";
      defaultMessageRow.innerHTML = `
          <td colspan="11" style="text-align: left;">Chưa có bệnh nhân đến khám bệnh trong hôm nay.</td>
      `;
      patientTable.appendChild(defaultMessageRow);
  }
}


// Function to delete a patient from the backend
async function deletePatient(patientId) {
  try {
      const response = await fetch(`http://localhost:3000/api/benh-nhan/delete/${patientId}`, {
          method: 'DELETE'
      });
      const result = await response.json();
      if (result.success) {
          fetchPatientData(); // Refresh the table with the updated data
      } else {
          console.error('Failed to delete patient');
      }
  } catch (error) {
      console.error('Error deleting patient:', error);
  }
}

// Xử lý nút Xoá
document.getElementById("btn-delete").addEventListener("click", function () {
  if (selectedRow) {
      const patientId = selectedRow.getAttribute('data-id');
      deletePatient(patientId);
      selectedRow = null;
  } else {
      alert("Vui lòng chọn một bệnh nhân để xoá.");
  }

  // Kiểm tra và hiển thị lại thông báo nếu cần
  checkDefaultMessage();
});


// Thêm sự kiện chọn dòng cho bảng
document.getElementById("patient-table").addEventListener("click", function (event) {
  if (event.target.tagName === "TD") {
    if (selectedRow) selectedRow.classList.remove("selected-row");  // Bỏ chọn dòng cũ
    selectedRow = event.target.parentElement;  // Lấy dòng cha của ô được click
    selectedRow.classList.add("selected-row");  // Thêm lớp cho dòng được chọn
  }
});

// Lấy mã phiếu khám từ mã bệnh nhân
const getMedicalExaminationID = async (patientId) => {
  try {
    const response = await fetch(`http://localhost:3000/api/benh-nhan/getkhambenh/${patientId}`);
    const result = await response.json();

    if (result.success) {
      // let medicalExamination = undefined;

      // for (let i = 0; i < result.data.length; i++) {
      //   if (String(result.data[i].mabenhnhan) === patientId) {
      //     medicalExamination = result.data[i];
      //     break; 
      //   }
      // }
      // return medicalExamination ? medicalExamination.maphieukham : undefined;

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

// Xử lý nút Khám bệnh
document.getElementById("btn-exam").addEventListener("click", async function () {
  if (selectedRow) {
    const patientId = selectedRow.cells[2].innerText; // Lấy mã bệnh nhân từ bảng
    try {
      const medicalExaminationId = await getMedicalExaminationID(patientId);
      
      if (medicalExaminationId) {
        window.location.href = `../examination_health/index.html?patient-id=${patientId}&medical-examination-id=${medicalExaminationId}`;
      } else {
        alert("Không tìm thấy phiếu khám cho bệnh nhân này.");
      }
    } catch (error) {
      console.error('Error:', error);
      alert("Có lỗi xảy ra khi tìm phiếu khám.");
    }
  } else {
    alert("Vui lòng chọn một bệnh nhân để khám bệnh.");
  }
});

// // Hàm để cập nhật trạng thái bệnh nhân (trang khám sẽ gọi sau)
// function updatePatientStatus(patientId, status) {
//   const rows = document.querySelectorAll("#patient-table tr");
//   rows.forEach((row) => {
//     const currentPatientId = row.querySelector("td:nth-child(2)").textContent;
//     if (currentPatientId === patientId) {
//       row.querySelector(".status").textContent = status;
//     }
//   });
// }

// Chức năng lọc bảng theo trạng thái khám
function filterPatients() {
  const showUnexamined = document.getElementById("filter-unexamined").checked;
  const showExamined = document.getElementById("filter-examined").checked;

  // Lấy tất cả các hàng bệnh nhân
  const rows = document.querySelectorAll("#patient-table tr");

  rows.forEach((row) => {
    const statusCell = row.querySelector(".status");
    const status = statusCell ? statusCell.textContent.trim() : "";

    // Kiểm tra xem hàng có phù hợp với bộ lọc không
    if (
      (!showUnexamined && !showExamined) || // Không có bộ lọc nào được tích
      (showUnexamined && status == "Chưa khám") || // Chọn Chưa khám
      (showExamined && status == "Đã khám") // Chọn Đã khám
    ) {
      row.style.display = ""; // Hiển thị hàng
    } else {
      row.style.display = "none"; // Ẩn hàng
    }
  });
}

// Thêm sự kiện cho các ô tích chọn
document
  .getElementById("filter-unexamined")
  .addEventListener("change", filterPatients);
document
  .getElementById("filter-examined")
  .addEventListener("change", filterPatients);


// // Lấy thông tin bệnh nhân từ localStorage
// window.onload = function() {
//   const patientData = JSON.parse(localStorage.getItem("patientData"));
//   if (patientData) {
//       // Điền thông tin bệnh nhân vào các trường trong form
//       document.getElementById("patient-id").value = patientData.id;
//       document.getElementById("name").value = patientData.name;
//       document.getElementById("gender").value = patientData.gender;
//       document.getElementById("ethnicity").value = patientData.ethnicity;
//       document.getElementById("dob").value = patientData.dob;
//       document.getElementById("address").value = patientData.address;
//       document.getElementById("phone").value = patientData.phone;
//       document.getElementById("job").value = patientData.job;
//       document.getElementById("notes").value = patientData.note;

//       // Tính và hiển thị tuổi của bệnh nhân
//       const age = calculateAge(patientData.dob);
//       document.getElementById("age").value = age; // Hiển thị tuổi bệnh nhân

//       // Xóa thông tin khỏi localStorage để không hiển thị lại lần sau
//       localStorage.removeItem("patientData");
//   }
// };

// Hàm để hiển thị danh sách bệnh nhân từ sessionStorage
// function renderPatientList() {
//   let patients = JSON.parse(sessionStorage.getItem('patients')) || [];

//   const tableBody = document.getElementById("patient-table-body");
//   tableBody.innerHTML = ''; // Xóa nội dung cũ trước khi hiển thị lại

//   patients.forEach(patient => {
//     const row = document.createElement("tr");

//     const idCell = document.createElement("td");
//     idCell.innerText = patient.id;
//     row.appendChild(idCell);

//     const nameCell = document.createElement("td");
//     nameCell.innerText = patient.name;
//     row.appendChild(nameCell);

//     const statusCell = document.createElement("td");
//     statusCell.innerText = patient.status || "Chưa khám"; // Hiển thị trạng thái
//     row.appendChild(statusCell);

//     // Thêm dòng vào bảng
//     tableBody.appendChild(row);
//   });
// }

// // Gọi hàm để render danh sách bệnh nhân khi trang được tải
// window.onload = function() {
//   renderPatientList();
// };
