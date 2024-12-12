// // script.js

// let patientCount = 0;

// // Sinh mã bệnh nhân tự động
// function generatePatientId() {
//   return "BN" + Math.floor(Math.random() * 100000);
// }

// // Tính tuổi dựa vào ngày sinh
// function calculateAge(dob) {
//   const birthDate = new Date(dob);
//   const today = new Date();
//   let age = today.getFullYear() - birthDate.getFullYear();
//   const monthDiff = today.getMonth() - birthDate.getMonth();

//   // Điều chỉnh nếu chưa qua sinh nhật trong năm hiện tại
//   if (
//     monthDiff < 0 ||
//     (monthDiff === 0 && today.getDate() < birthDate.getDate())
//   ) {
//     age--;
//   }
//   return age;
// }

// // đếm số bệnh nhân
// function countPatients() {
//   return fetch("http://localhost:3000/api/benhnhan")
//     .then(response => response.json())
//     .then(patients => {
//       return patients.length;
//     })
//     .catch(error => console.log(error));
// }

// // Khi trang load, sinh mã BN
// document.addEventListener("DOMContentLoaded", function () {
//   countPatients()
//   .then(count => {
//     document.getElementById("patient-id").value = count + 1;
//   })
//   .catch(error => console.log(error));
// });

// // Cập nhật tuổi khi người dùng chọn ngày sinh
// document.getElementById("dob").addEventListener("change", function () {
//   const dob = this.value;
//   if (dob) {
//     const age = calculateAge(dob);
//     document.getElementById("age").value = age;
//   }
// });

// // Tự động cập nhật Ngày khám là ngày hiện tại
// document.getElementById("exam-date").value = new Date().toISOString().split('T')[0];

// let selectedRow = null;

// // Thêm bệnh nhân vào bảng khi người dùng submit form
// document
//   .getElementById("btn-save")
//   .addEventListener("click", function (event) {
//     event.preventDefault(); // Ngăn trang không bị reload

//     // Lấy giá trị từ form
//     const patientId = document.getElementById("patient-id").value;
//     const name = document.getElementById("name").value.trim();
//     const gender = document.getElementById("gender").value.trim();
//     const ethnicity = document.getElementById("ethnicity").value.trim();
//     const dob = document.getElementById("dob").value.trim();
//     const address = document.getElementById("address").value.trim();
//     const phone = document.getElementById("phone").value.trim();
//     const job = document.getElementById("job").value.trim();
//     const notes = document.getElementById("notes").value.trim();

//     data = {
//       id: patientId,
//       name: name,
//       gender: gender,
//       ethnicity: ethnicity,
//       birthDate: dob,
//       address: address,
//       phone: phone,
//       job: job,
//       notes: notes,
//     };

//     fetch("http://localhost:3000/api/benhnhan/new", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     })
//     .then(response => response.json())
//     .then(patient => {
//       alert("Thêm bệnh nhân thành công!");
//     })
//     .catch(error => console.log(error));

//     // Kiểm tra nếu dòng thông báo mặc định đang hiển thị và xóa nó
//     const defaultMessage = document.getElementById("default-message");
//     if (defaultMessage) {
//       defaultMessage.remove();
//     }

//     // Tạo hàng mới cho bảng
//     const table = document.getElementById("patient-table");

//     if (selectedRow) {
//       // Cập nhật dòng đã chọn
//       selectedRow.cells[2].innerText = patientId;
//       selectedRow.cells[3].innerText = name;
//       selectedRow.cells[4].innerText = gender;
//       selectedRow.cells[5].innerText = ethnicity;
//       selectedRow.cells[6].innerText = dob;
//       selectedRow.cells[7].innerText = address;
//       selectedRow.cells[8].innerText = phone;
//       selectedRow.cells[9].innerText = job;
//       selectedRow.cells[10].innerText = notes;

//       // Sau khi cập nhật, bỏ chọn dòng
//       selectedRow.classList.remove("selected-row");
//       selectedRow = null;
//     } else {
//       // Nếu không có dòng nào được chọn, tạo một dòng mới
//       const newRow = document.createElement("tr");

//       // Tăng số thứ tự bệnh nhân
//       patientCount++;

//       // Thêm các cột thông tin vào hàng
//       newRow.innerHTML = `
//           <td>${patientCount}</td>
//           <td class="status">Chưa khám</td>
//           <td>${patientId}</td>
//           <td>${name}</td>
//           <td>${gender}</td>
//           <td>${ethnicity}</td>
//           <td>${dob}</td>
//           <td>${address}</td>
//           <td>${phone}</td>
//           <td>${job}</td>
//           <td>${notes}</td>
//       `;

//       // Thêm hàng vào bảng
//       table.appendChild(newRow);
//     }

//     // Xóa dữ liệu form sau khi thêm và sinh mã BN mới
//     document.getElementById("patient-form").reset();
//     document.getElementById("patient-id").value = generatePatientId();
//   });

// // Xử lý nút Sửa
// document.getElementById("btn-edit").addEventListener("click", function () {
//   if (selectedRow) {
//     document.getElementById("patient-id").value = selectedRow.cells[2].innerText;
//     document.getElementById("name").value = selectedRow.cells[3].innerText;
//     document.getElementById("gender").value = selectedRow.cells[4].innerText;
//     document.getElementById("ethnicity").value = selectedRow.cells[5].innerText;
//     document.getElementById("dob").value = selectedRow.cells[6].innerText;
//     document.getElementById("address").value = selectedRow.cells[7].innerText;
//     document.getElementById("phone").value = selectedRow.cells[8].innerText;
//     document.getElementById("job").value = selectedRow.cells[9].innerText;
//     document.getElementById("notes").value = selectedRow.cells[10].innerText;
//   } else {
//     alert("Vui lòng chọn một bệnh nhân để sửa.");
//   }
// });

// // Hàm kiểm tra và hiển thị thông báo mặc định nếu bảng trống
// function checkDefaultMessage() {
//   const patientTable = document.getElementById("patient-table");
//   const rows = patientTable.getElementsByTagName("tr");

//   // Nếu không còn dòng dữ liệu nào, thêm lại dòng thông báo
//   if (rows.length === 0) {
//     const defaultMessageRow = document.createElement("tr");
//     defaultMessageRow.id = "default-message";
//     defaultMessageRow.innerHTML = `
//           <td colspan="11" style="text-align: left;">Chưa có bệnh nhân đến khám bệnh trong hôm nay.</td>
//       `;
//     patientTable.appendChild(defaultMessageRow);
//   }
// }

// // Xử lý nút Xoá
// document.getElementById("btn-delete").addEventListener("click", function () {
//   if (selectedRow) {
//     selectedRow.remove();
//     selectedRow = null;
//     updatePatientCount();
//   } else {
//     alert("Vui lòng chọn một bệnh nhân để xoá.");
//   }

//   // Kiểm tra và hiển thị lại thông báo nếu cần
//   checkDefaultMessage();
// });

// // Cập nhật lại STT sau khi xóa hàng
// function updatePatientCount() {
//   const rows = document.querySelectorAll("#patient-table tr");
//   patientCount = 0;
//   rows.forEach((row) => {
//     patientCount++;
//     row.querySelector("td:first-child").textContent = patientCount;
//   });
// }

// // Thêm sự kiện chọn dòng cho bảng
// document.getElementById("patient-table").addEventListener("click", function (event) {
//   if (event.target.tagName === "TD") {
//     if (selectedRow) selectedRow.classList.remove("selected-row");  // Bỏ chọn dòng cũ
//     selectedRow = event.target.parentElement;  // Lấy dòng cha của ô được click
//     selectedRow.classList.add("selected-row");  // Thêm lớp cho dòng được chọn
//   }
// });

// // Xử lý nút Khám bệnh
// document.getElementById("btn-exam").addEventListener("click", function () {
//   if (selectedRow) {
//     const patientId = selectedRow.cells[2].innerText; // Lấy mã bệnh nhân từ bảng
//     const patientData = {
//       id: patientId,
//       name: selectedRow.cells[3].innerText, // Lấy tên bệnh nhân
//       gender: selectedRow.cells[4].innerText, // Lấy giới tính
//       ethnicity: selectedRow.cells[5].innerText, //Lấy dân tộc
//       birthDate: selectedRow.cells[6].innerText, // Lấy ngày sinh
//       address: selectedRow.cells[7].innerText, // Lấy địa chỉ
//       phone: selectedRow.cells[8].innerText, // Lấy điện thoại
//       job: selectedRow.cells[9].innerText, // Lấy nghề nghiệp
//     };

//     // Lưu thông tin bệnh nhân vào sessionStorage
//     sessionStorage.setItem('patientData', JSON.stringify(patientData));
//     // Chuyển hướng sang Trang khám bệnh
//     window.location.href = "../examination_health/index.html?patientId=" + patientId;
//   } else {
//     alert("Vui lòng chọn một bệnh nhân để khám bệnh.");
//   }
// });

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

// // Chức năng lọc bảng theo trạng thái khám
// function filterPatients() {
//   const showUnexamined = document.getElementById("filter-unexamined").checked;
//   const showExamined = document.getElementById("filter-examined").checked;

//   // Lấy tất cả các hàng bệnh nhân
//   const rows = document.querySelectorAll("#patient-table tr");

//   rows.forEach((row) => {
//     const statusCell = row.querySelector(".status");
//     const status = statusCell ? statusCell.textContent.trim() : "";

//     // Kiểm tra xem hàng có phù hợp với bộ lọc không
//     if (
//       (!showUnexamined && !showExamined) || // Không có bộ lọc nào được tích
//       (showUnexamined && status === "Chưa khám") || // Chọn Chưa khám
//       (showExamined && status === "Đã khám") // Chọn Đã khám
//     ) {
//       row.style.display = ""; // Hiển thị hàng
//     } else {
//       row.style.display = "none"; // Ẩn hàng
//     }
//   });
// }

// // Thêm sự kiện cho các ô tích chọn
// document
//   .getElementById("filter-unexamined")
//   .addEventListener("change", filterPatients);
// document
//   .getElementById("filter-examined")
//   .addEventListener("change", filterPatients);

// // Lấy thông tin bệnh nhân từ localStorage
// window.onload = function() {
//   const patientData = JSON.parse(localStorage.getItem("patientData"));
//   if (patientData) {
//     // Điền thông tin bệnh nhân vào các trường trong form
//     document.getElementById("patient-id").value = patientData.id;
//     document.getElementById("name").value = patientData.name;
//     document.getElementById("gender").value = patientData.gender;
//     document.getElementById("ethnicity").value = patientData.ethnicity;
//       document.getElementById("dob").value = patientData.dob;
//     document.getElementById("address").value = patientData.address;
//     document.getElementById("phone").value = patientData.phone;
//     document.getElementById("job").value = patientData.job;
//     document.getElementById("notes").value = patientData.note;

//     // Tính và hiển thị tuổi của bệnh nhân
//       const age = calculateAge(patientData.dob);
//     document.getElementById("age").value = age; // Hiển thị tuổi bệnh nhân

//     // Xóa thông tin khỏi localStorage để không hiển thị lại lần sau
//     localStorage.removeItem("patientData");
//   }
// };


// Constants
const API_URL = 'http://localhost:3000/api';

// Utility functions
const Utils = {
  generatePatientId: () => `BN${Math.floor(Math.random() * 100000)}`,

  calculateAge: (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  },

  getCurrentDate: () => new Date().toISOString().split('T')[0]
};

// API Service
const PatientAPI = {
  countPatients: async () => {
    try {
      const response = await fetch(`${API_URL}/benhnhan`);
      const patients = await response.json();
      return patients.length;
    } catch (error) {
      console.error('Error counting patients:', error);
      return 0;
    }
  },

  createPatient: async (patientData) => {
    try {
      const response = await fetch(`${API_URL}/benhnhan/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientData)
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating patient:', error);
      throw error;
    }
  }
};

// DOM Handler
const DOMHandler = {
  elements: {
    form: document.getElementById('patient-form'),
    table: document.getElementById('patient-table'),
    patientId: document.getElementById('patient-id'),
    examDate: document.getElementById('exam-date'),
    dob: document.getElementById('dob'),
    age: document.getElementById('age'),
    filterUnexamined: document.getElementById('filter-unexamined'),
    filterExamined: document.getElementById('filter-examined')
  },

  getFormData: () => ({
    id: DOMHandler.elements.patientId.value,
    name: document.getElementById('name').value.trim(),
    gender: document.getElementById('gender').value.trim(),
    ethnicity: document.getElementById('ethnicity').value.trim(),
    birthDate: document.getElementById('dob').value.trim(),
    address: document.getElementById('address').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    job: document.getElementById('job').value.trim(),
    notes: document.getElementById('notes').value.trim()
  }),

  clearForm: () => {
    DOMHandler.elements.form.reset();
    DOMHandler.elements.patientId.value = Utils.generatePatientId();
  },

  updateTableRow: (row, data) => {
    const cells = [
      data.id, data.name, data.gender, data.ethnicity,
      data.birthDate, data.address, data.phone, data.job,
      data.notes
    ];
    cells.forEach((value, index) => {
      row.cells[index + 2].innerText = value;
    });
  },

  addTableRow: (data, count) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${count}</td>
      <td class="status">Chưa khám</td>
      <td>${data.id}</td>
      <td>${data.name}</td>
      <td>${data.gender}</td>
      <td>${data.ethnicity}</td>
      <td>${data.birthDate}</td>
      <td>${data.address}</td>
      <td>${data.phone}</td>
      <td>${data.job}</td>
      <td>${data.notes}</td>
    `;
    DOMHandler.elements.table.appendChild(row);
  }
};

// Patient Manager
class PatientManager {
  constructor() {
    this.selectedRow = null;
    this.patientCount = 0;
    this.initializeEventListeners();
  }

  async initialize() {
    this.patientCount = await PatientAPI.countPatients();
    DOMHandler.elements.patientId.value = this.patientCount + 1;
    DOMHandler.elements.examDate.value = Utils.getCurrentDate();
  }

  initializeEventListeners() {
    // Form events
    DOMHandler.elements.dob.addEventListener('change', this.handleDOBChange.bind(this));
    document.getElementById('btn-save').addEventListener('click', this.handleSave.bind(this));
    document.getElementById('btn-edit').addEventListener('click', this.handleEdit.bind(this));
    document.getElementById('btn-delete').addEventListener('click', this.handleDelete.bind(this));
    document.getElementById('btn-exam').addEventListener('click', this.handleExam.bind(this));

    // Table events
    DOMHandler.elements.table.addEventListener('click', this.handleRowSelection.bind(this));

    // Filter events
    DOMHandler.elements.filterUnexamined.addEventListener('change', this.filterPatients.bind(this));
    DOMHandler.elements.filterExamined.addEventListener('change', this.filterPatients.bind(this));
  }

  handleDOBChange(event) {
    const age = Utils.calculateAge(event.target.value);
    DOMHandler.elements.age.value = age;
  }

  async handleSave(event) {
    event.preventDefault();
    const data = DOMHandler.getFormData();

    try {
      await PatientAPI.createPatient(data);
      alert('Thêm bệnh nhân thành công!');

      if (this.selectedRow) {
        DOMHandler.updateTableRow(this.selectedRow, data);
        this.selectedRow.classList.remove('selected-row');
        this.selectedRow = null;
      } else {
        this.patientCount++;
        DOMHandler.addTableRow(data, this.patientCount);
      }

      DOMHandler.clearForm();
    } catch (error) {
      alert('Lỗi khi lưu bệnh nhân!');
    }
  }

  handleEdit() {
    if (!this.selectedRow) {
      alert('Vui lòng chọn một bệnh nhân để sửa.');
      return;
    }

    const cells = this.selectedRow.cells;
    const formFields = ['patient-id', 'name', 'gender', 'ethnicity', 'dob', 
                       'address', 'phone', 'job', 'notes'];
    
    formFields.forEach((field, index) => {
      document.getElementById(field).value = cells[index + 2].innerText;
    });
  }

  handleDelete() {
    if (!this.selectedRow) {
      alert('Vui lòng chọn một bệnh nhân để xoá.');
      return;
    }

    this.selectedRow.remove();
    this.selectedRow = null;
    this.updatePatientCount();
    this.checkDefaultMessage();
  }

  handleExam() {
    if (!this.selectedRow) {
      alert('Vui lòng chọn một bệnh nhân để khám bệnh.');
      return;
    }

    const cells = this.selectedRow.cells;
    const patientData = {
      id: cells[2].innerText,
      name: cells[3].innerText,
      gender: cells[4].innerText,
      ethnicity: cells[5].innerText,
      birthDate: cells[6].innerText,
      address: cells[7].innerText,
      phone: cells[8].innerText,
      job: cells[9].innerText
    };

    sessionStorage.setItem('patientData', JSON.stringify(patientData));
    window.location.href = '../examination_health/index.html?patientId=' + patientData.id;
  }

  handleRowSelection(event) {
    if (event.target.tagName === 'TD') {
      if (this.selectedRow) this.selectedRow.classList.remove('selected-row');
      this.selectedRow = event.target.parentElement;
      this.selectedRow.classList.add('selected-row');
    }
  }

  filterPatients() {
    const showUnexamined = DOMHandler.elements.filterUnexamined.checked;
    const showExamined = DOMHandler.elements.filterExamined.checked;

    const rows = DOMHandler.elements.table.querySelectorAll('tr');
    rows.forEach(row => {
      const statusCell = row.querySelector('.status');
      if (!statusCell) return;

      const status = statusCell.textContent.trim();
      const shouldShow = (!showUnexamined && !showExamined) ||
                        (showUnexamined && status === 'Chưa khám') ||
                        (showExamined && status === 'Đã khám');
      
      row.style.display = shouldShow ? '' : 'none';
    });
  }

  updatePatientCount() {
    const rows = DOMHandler.elements.table.querySelectorAll('tr');
    this.patientCount = 0;
    rows.forEach(row => {
      this.patientCount++;
      row.querySelector('td:first-child').textContent = this.patientCount;
    });
  }

  checkDefaultMessage() {
    const rows = DOMHandler.elements.table.getElementsByTagName('tr');
    if (rows.length === 0) {
      const defaultMessageRow = document.createElement('tr');
      defaultMessageRow.id = 'default-message';
      defaultMessageRow.innerHTML = `
        <td colspan="11" style="text-align: left;">
          Chưa có bệnh nhân đến khám bệnh trong hôm nay.
        </td>
      `;
      DOMHandler.elements.table.appendChild(defaultMessageRow);
    }
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  const patientManager = new PatientManager();
  patientManager.initialize();
});
