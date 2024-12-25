class ApiService {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    async fetchData(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'API request failed');
            }
            
            return data;
        } catch (error) {
            console.error(`API Error (${endpoint}):`, error);
            throw error;
        }
    }
}

// Dịch vụ bệnh nhân
class PatientService extends ApiService {
    constructor() {
        super('http://localhost:3000/api');
    }

    async getPatients() {
        return this.fetchData('/benh-nhan');
    }
}

// Tiện ích
class Utils {
    static formatDate(dateString) {
        if (!dateString) return '';
        try {
            return new Date(dateString).toISOString().split('T')[0];
        } catch (error) {
            console.error('Date formatting error:', error);
            return '';
        }
    }
}

// Bệnh nhân
class Patient {
    constructor(data) {
        Object.assign(this, data);
    }

    toTableRow(index) {
        const safeText = (text) => text || '';
        
        return `
            <tr data-patient-id="${this.mabenhnhan}" class="patient-row">
                <td>${index + 1}</td>
                <td>${safeText(this.mabenhnhan)}</td>
                <td>${safeText(this.hoten)}</td>
                <td>${safeText(this.gioitinh)}</td>
                <td>${safeText(this.dantoc)}</td>
                <td>${Utils.formatDate(this.ngaysinh)}</td>
                <td>${safeText(this.diachi)}</td>
                <td>${safeText(this.sodienthoai)}</td>
                <td>${safeText(this.nghenghiep)}</td>
                <td>${safeText(this.ghichu)}</td>
            </tr>`;
    }
}

// Quản lý bệnh nhân
class PatientManager {
    constructor() {
        this.patientService = new PatientService();
        this.patients = [];
        this.selectedRow = null;
        this.initialize();
    }

    // Khởi tạo
    async initialize() {
        try {
            await this.loadPatients();
            this.initializeEventListeners();
            this.toggleSearchInput();
        } catch (error) {
            console.error('Initialization error:', error);
            alert('Không thể khởi tạo ứng dụng. Vui lòng thử lại sau.');
        }
    }

    // Load danh sách bệnh nhân từ API
    async loadPatients() {
        try {
            const result = await this.patientService.getPatients();
            if (result.success) {
                this.patients = result.data.map(data => new Patient(data));
                this.renderPatients(this.patients);
            } else {
                throw new Error('Failed to load patients');
            }
        } catch (error) {
            console.error('Error loading patients:', error);
            alert('Không thể tải danh sách bệnh nhân. Vui lòng thử lại sau.');
        }
    }

    // render bệnh nhân
    renderPatients(patients) {
        const patientList = document.getElementById('patient-list');
        if (!patientList) return;
        
        patientList.innerHTML = patients
            .map((patient, index) => patient.toTableRow(index))
            .join('');
    }

    // Tìm kiếm bệnh nhân và hiển thị lại bảng
    searchPatients() {
        const filterElement = document.getElementById('search-filter');
        const inputElement = document.getElementById('search-input');
        
        if (!filterElement || !inputElement) return;

        const filter = filterElement.value;
        const query = inputElement.value.toLowerCase().trim();

        if (!filter || !query) {
            this.renderPatients(this.patients);
            return;
        }

        const filteredPatients = this.patients.filter(patient => {
            const value = patient[filter];
            return value && value.toString().toLowerCase().includes(query);
        });

        this.renderPatients(filteredPatients);
    }

    // Chọn bệnh nhân và chuyển hướng tới trang thông tin bệnh nhân
    selectPatient(patientId) {
        window.location.href = `./patient-info.html?patient-id=${patientId}`;
    }

    // Hiển thị input tìm kiếm nếu đã chọn mục tìm kiếm
    toggleSearchInput() {
        const selectElement = document.getElementById('search-filter');
        const inputElement = document.getElementById('search-input');
        
        if (!selectElement || !inputElement) return;
        
        inputElement.disabled = !selectElement.value;
        if (!selectElement.value) {
            inputElement.value = '';
            this.renderPatients(this.patients);
        }
    }

    handleRowClick(event) {
        const row = event.target.closest('.patient-row');
        if (!row) return;

        // click
        if (this.selectedRow) {
            this.selectedRow.classList.remove('selected-row');
        }
        this.selectedRow = row;
        row.classList.add('selected-row');

        // dblclick
        if (event.detail === 2) {
            const patientId = row.cells[1].innerText;
            if (patientId) {
                this.selectPatient(patientId);
            }
        }
    }

    // Khởi tạo sự kiện
    initializeEventListeners() {
        const searchButton = document.getElementById('search-button');
        const searchFilter = document.getElementById('search-filter');
        const patientList = document.getElementById('patient-list');
        const searchInput = document.getElementById('search-input');

        if (searchButton) {
            searchButton.addEventListener('click', () => this.searchPatients());
        }

        if (searchFilter) {
            searchFilter.addEventListener('change', () => this.toggleSearchInput());
        }

        if (patientList) {
            patientList.addEventListener('click', (event) => this.handleRowClick(event));
        }

        if (searchInput) {
            searchInput.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    this.searchPatients();
                }
            });
        }
    }
}

// khởi tạo ứng dụng
document.addEventListener('DOMContentLoaded', () => {
    new PatientManager();
});


// // Function to fetch patient data from the backend
// async function fetchPatientData() {
//     try {
//         const response = await fetch('http://localhost:3000/api/benh-nhan');
//         const result = await response.json();
//         if (result.success) {
//             const patients = result.data;
//             console.log(patients);
//             renderPatients(patients);
//         } else {
//             console.error('Failed to fetch patient data');
//         }
//     } catch (error) {
//         console.error('Error fetching patient data:', error);
//     }
// }

// // Call the function to fetch patient data
// fetchPatientData();

// // Render danh sách bệnh nhân
// function renderPatients(patients) {
//   const patientList = document.getElementById("patient-list");
//   patientList.innerHTML = patients
//     .map(
//       (patient, index) => `
//       <tr ondblclick="selectPatient('${patient.id}')">
//         <td>${index + 1}</td>
//         <td>${patient.mabenhnhan}</td>
//         <td>${patient.hoten}</td>
//         <td>${patient.gioitinh}</td>
//         <td>${patient.dantoc}</td>
//         <td>${patient.ngaysinh.split('T')[0]}</td>
//         <td>${patient.diachi}</td>
//         <td>${patient.sodienthoai}</td>
//         <td>${patient.nghenghiep}</td>
//         <td>${patient.ghichu}</td>
//       </tr>
//     `
//     )
//     .join("");
// }

// // Tìm kiếm bệnh nhân và hiển thị lại bảng
// function searchPatients() {
//   const filter = document.getElementById("search-filter").value;
//   const query = document.getElementById("search-input").value;
  
//   // Lọc danh sách bệnh nhân theo từ khóa
//   const filteredPatients = patients.filter((patient) =>
//     patient[filter]?.toLowerCase().includes(query)
//   );
  
//   // Hiển thị lại bảng sau khi lọc
//   document.getElementById("patient-list").innerHTML = filteredPatients
//     .map(
//       (patient, index) => `
//       <tr ondblclick="selectPatient('${patient.mabenhnhan}')">
//         <td>${index + 1}</td>
//         <td>${patient.mabenhnhan}</td>
//         <td>${patient.name}</td>
//         <td>${patient.gender}</td>
//         <td>${patient.ethnicity}</td>
//         <td>${patient.birthDate}</td>
//         <td>${patient.address}</td>
//         <td>${patient.phone}</td>
//         <td>${patient.job}</td>
//         <td>${patient.notes}</td>
//       </tr>
//     `
//     )
//     .join("");
// }

// // Gán sự kiện cho nút tìm kiếm
// document.getElementById("search-button").addEventListener("click", searchPatients);

// // Khởi chạy trang
// renderPatients();

// // Xử lí thanh tìm kiếm
// function toggleSearchInput() {
//     const selectElement = document.getElementById('search-filter');
//     const inputElement = document.getElementById('search-input');
    
//     // Kiểm tra xem đã chọn một mục hay chưa
//     if (selectElement.value === "") {
//         inputElement.disabled = true;  // Nếu chưa chọn, input bị disabled
//     } else {
//         inputElement.disabled = false;  // Nếu đã chọn, input có thể sử dụng
//     }
// }

// // Đảm bảo input bị vô hiệu hóa ngay khi trang tải
// document.addEventListener('DOMContentLoaded', () => {
//     toggleSearchInput();  // Kiểm tra khi trang tải
// });

// // Lưu thông tin bệnh nhân đã chọn vào sessionStorage và chuyển đến Trang nhận bệnh 2
// function selectPatient(patientId) {
//   const selectedPatient = patients.find(patient => patient.id === patientId);
//   sessionStorage.setItem("selectedPatient", JSON.stringify(selectedPatient)); // Lưu thông tin vào sessionStorage
//   window.location.href = "patient-info.html"; // Chuyển hướng tới Trang nhận bệnh 2
// }
