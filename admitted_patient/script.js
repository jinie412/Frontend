// script.js

let patientCount = 0;

// Sinh mã bệnh nhân tự động
function generatePatientId() {
  return "BN" + Math.floor(Math.random() * 100000);
}

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

// Khi trang load, sinh mã BN
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("patient-id").value = generatePatientId();
});

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

// Thêm bệnh nhân vào bảng khi người dùng submit form
document
  .getElementById("btn-save")
  .addEventListener("click", function (event) {
    event.preventDefault(); // Ngăn trang không bị reload

    // Lấy giá trị từ form
    const patientId = document.getElementById("patient-id").value;
    const name = document.getElementById("name").value.trim();
    const gender = document.getElementById("gender").value.trim();
    const ethnicity = document.getElementById("ethnicity").value.trim();
    const dob = document.getElementById("dob").value.trim();
    const address = document.getElementById("address").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const job = document.getElementById("job").value.trim();
    const notes = document.getElementById("notes").value.trim();

    // Kiểm tra các trường bắt buộc
    // if (!name || !gender || !dob || !phone) {
    //   alert("Vui lòng nhập đầy đủ các thông tin bắt buộc sau: Họ và tên, Giới tính, Ngày sinh, Số điện thoại.");
    //   return; // Không thêm bệnh nhân nếu thông tin không hợp lệ
    // }

    // Kiểm tra nếu dòng thông báo mặc định đang hiển thị và xóa nó
    const defaultMessage = document.getElementById("default-message");
    if (defaultMessage) {
        defaultMessage.remove();
    }

    // Tạo hàng mới cho bảng
    const table = document.getElementById("patient-table");

    if (selectedRow) {
      // Cập nhật dòng đã chọn
      selectedRow.cells[2].innerText = patientId;
      selectedRow.cells[3].innerText = name;
      selectedRow.cells[4].innerText = gender;
      selectedRow.cells[5].innerText = ethnicity;
      selectedRow.cells[6].innerText = dob;
      selectedRow.cells[7].innerText = address;
      selectedRow.cells[8].innerText = phone;
      selectedRow.cells[9].innerText = job;
      selectedRow.cells[10].innerText = notes;

      // Sau khi cập nhật, bỏ chọn dòng
      selectedRow.classList.remove("selected-row");
      selectedRow = null;
    } else {
      // Nếu không có dòng nào được chọn, tạo một dòng mới
      const newRow = document.createElement("tr");

      // Tăng số thứ tự bệnh nhân
      patientCount++;

      // Thêm các cột thông tin vào hàng
      newRow.innerHTML = `
          <td>${patientCount}</td>
          <td class="status">Chưa khám</td>
          <td>${patientId}</td>
          <td>${name}</td>
          <td>${gender}</td>
          <td>${ethnicity}</td>
          <td>${dob}</td>
          <td>${address}</td>
          <td>${phone}</td>
          <td>${job}</td>
          <td>${notes}</td>
      `;

      // Thêm hàng vào bảng
      table.appendChild(newRow);
    }
    
    // Xóa dữ liệu form sau khi thêm và sinh mã BN mới
    document.getElementById("patient-form").reset();
    document.getElementById("patient-id").value = generatePatientId();
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

// Xử lý nút Xoá
document.getElementById("btn-delete").addEventListener("click", function () {
  if (selectedRow) {
    selectedRow.remove();
    selectedRow = null;
    updatePatientCount();
  } else {
    alert("Vui lòng chọn một bệnh nhân để xoá.");
  }

  // Kiểm tra và hiển thị lại thông báo nếu cần
  checkDefaultMessage();
});

// Cập nhật lại STT sau khi xóa hàng
function updatePatientCount() {
  const rows = document.querySelectorAll("#patient-table tr");
  patientCount = 0;
  rows.forEach((row) => {
    patientCount++;
    row.querySelector("td:first-child").textContent = patientCount;
  });
}

// Thêm sự kiện chọn dòng cho bảng
document.getElementById("patient-table").addEventListener("click", function (event) {
  if (event.target.tagName === "TD") {
    if (selectedRow) selectedRow.classList.remove("selected-row");  // Bỏ chọn dòng cũ
    selectedRow = event.target.parentElement;  // Lấy dòng cha của ô được click
    selectedRow.classList.add("selected-row");  // Thêm lớp cho dòng được chọn
  }
});

// Xử lý nút Khám bệnh
document.getElementById("btn-exam").addEventListener("click", function () {
  if (selectedRow) {
    const patientId = selectedRow.cells[2].innerText; // Lấy mã bệnh nhân từ bảng
    const patientData = {
      id: patientId,
      name: selectedRow.cells[3].innerText, // Lấy tên bệnh nhân
      gender: selectedRow.cells[4].innerText, // Lấy giới tính
      ethnicity: selectedRow.cells[5].innerText, //Lấy dân tộc
      birthDate: selectedRow.cells[6].innerText, // Lấy ngày sinh
      address: selectedRow.cells[7].innerText, // Lấy địa chỉ
      phone: selectedRow.cells[8].innerText, // Lấy điện thoại
      job: selectedRow.cells[9].innerText, // Lấy nghề nghiệp
    };

    // Lưu thông tin bệnh nhân vào sessionStorage
    sessionStorage.setItem('patientData', JSON.stringify(patientData));
    // Chuyển hướng sang Trang khám bệnh
    window.location.href = "../examination_health/index.html?patientId=" + patientId;
  } else {
    alert("Vui lòng chọn một bệnh nhân để khám bệnh.");
  }
});

// Hàm để cập nhật trạng thái bệnh nhân (trang khám sẽ gọi sau)
function updatePatientStatus(patientId, status) {
  const rows = document.querySelectorAll("#patient-table tr");
  rows.forEach((row) => {
    const currentPatientId = row.querySelector("td:nth-child(2)").textContent;
    if (currentPatientId === patientId) {
      row.querySelector(".status").textContent = status;
    }
  });
}

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
      (showUnexamined && status === "Chưa khám") || // Chọn Chưa khám
      (showExamined && status === "Đã khám") // Chọn Đã khám
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

// Lấy thông tin bệnh nhân từ localStorage
window.onload = function() {
  const patientData = JSON.parse(localStorage.getItem("patientData"));
  if (patientData) {
      // Điền thông tin bệnh nhân vào các trường trong form
      document.getElementById("patient-id").value = patientData.id;
      document.getElementById("name").value = patientData.name;
      document.getElementById("gender").value = patientData.gender;
      document.getElementById("ethnicity").value = patientData.ethnicity;
      document.getElementById("dob").value = patientData.dob;
      document.getElementById("address").value = patientData.address;
      document.getElementById("phone").value = patientData.phone;
      document.getElementById("job").value = patientData.job;
      document.getElementById("notes").value = patientData.note;

      // Tính và hiển thị tuổi của bệnh nhân
      const age = calculateAge(patientData.dob);
      document.getElementById("age").value = age; // Hiển thị tuổi bệnh nhân

      // Xóa thông tin khỏi localStorage để không hiển thị lại lần sau
      localStorage.removeItem("patientData");
  }
};

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
