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

let selectedRow = null;

// Thêm bệnh nhân vào bảng khi người dùng submit form
document
  .getElementById("patient-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Ngăn trang không bị reload

    // Lấy giá trị từ form
    const patientId = document.getElementById("patient-id").value;
    const name = document.getElementById("name").value;
    const gender = document.getElementById("gender").value;
    const ethnicity = document.getElementById("ethnicity").value;
    const dob = document.getElementById("dob").value;
    const address = document.getElementById("address").value;
    const phone = document.getElementById("phone").value;
    const job = document.getElementById("job").value;
    const notes = document.getElementById("notes").value;

    // Tạo hàng mới cho bảng
    const table = document.getElementById("patient-table");
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

    // Xóa dữ liệu form sau khi thêm và sinh mã BN mới
    document.getElementById("patient-form").reset();
    document.getElementById("patient-id").value = generatePatientId();

    // Thêm sự kiện chọn dòng cho hàng mới
    newRow.addEventListener("click", function () {
      if (selectedRow) selectedRow.classList.remove("selected-row");
      selectedRow = newRow;
      selectedRow.classList.add("selected-row");
    });
  });

// Xử lý nút Sửa
document.getElementById("edit").addEventListener("click", function () {
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

// Xử lý nút Xoá
document.getElementById("delete").addEventListener("click", function () {
  if (selectedRow) {
    selectedRow.remove();
    selectedRow = null;
    updatePatientCount();
  } else {
    alert("Vui lòng chọn một bệnh nhân để xoá.");
  }
});

// // Cập nhật lại STT sau khi xóa hàng
// function updatePatientCount() {
//     const rows = document.querySelectorAll('#patient-table tbody tr');
//     patientCount = 0;
//     rows.forEach((row) => {
//         patientCount++;
//         row.querySelector('td:nth-child(1)').textContent = patientCount;
//     });
// }

// Cập nhật lại STT sau khi xóa hàng
function updatePatientCount() {
  const rows = document.querySelectorAll("#patient-table tr");
  patientCount = 0;
  rows.forEach((row) => {
    patientCount++;
    row.querySelector("td:first-child").textContent = patientCount;
  });
}

// Xử lý nút Khám bệnh
document.getElementById("exam").addEventListener("click", function () {
  if (selectedRow) {
    const patientId = selectedRow.cells[1].innerText;
    window.location.href = `kham_benh.html?patientId=${patientId}`;
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
