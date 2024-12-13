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
  // Đếm số bệnh nhân từ server
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

  // Tạo bệnh nhân mới trên server
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
  // phần tử DOM
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

  // lấy dữ liệu từ form
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

  // xóa dữ liệu trong form
  clearForm: () => {
    DOMHandler.elements.form.reset();
    // DOMHandler.elements.patientId.value = Utils.generatePatientId();
  },

  // cập nhật dữ liệu trong bảng
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

  // thêm dòng vào bảng
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
  // khởi tạo
  constructor() {
    this.selectedRow = null;
    this.patientCount = 0;
    this.initializeEventListeners();
  }

  // khởi tạo dữ liệu
  async initialize() {
    this.patientCount = await PatientAPI.countPatients();
    DOMHandler.elements.patientId.value = this.patientCount + 1;
    DOMHandler.elements.examDate.value = Utils.getCurrentDate();
  }

  // khởi tạo sự kiện
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

  // Thay đổi ngày sinh
  handleDOBChange(event) {
    const age = Utils.calculateAge(event.target.value);
    DOMHandler.elements.age.value = age;
  }

  // Lưu bệnh nhân
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

  // Sửa thông tin bệnh nhân
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
  
  // Xoá bệnh nhân
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

  // Khám bệnh
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

  // Chọn dòng trong bảng
  handleRowSelection(event) {
    if (event.target.tagName === 'TD') {
      if (this.selectedRow) this.selectedRow.classList.remove('selected-row');
      this.selectedRow = event.target.parentElement;
      this.selectedRow.classList.add('selected-row');
    }
  }

  // Lọc bệnh nhân
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

  // Cập nhật số bệnh nhân
  updatePatientCount() {
    const rows = DOMHandler.elements.table.querySelectorAll('tr');
    this.patientCount = 0;
    rows.forEach(row => {
      this.patientCount++;
      row.querySelector('td:first-child').textContent = this.patientCount;
    });
  }

  // Kiểm tra thông báo mặc định
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
