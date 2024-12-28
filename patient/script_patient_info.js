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

class PatientService extends ApiService {
    constructor(){
        // super('http://localhost:3000/api/benh-nhan');
        //after deploy
        super('https://clinic-management-theta.vercel.app/api/benh-nhan');
    }

    async getPatitentById(patientId){
        return this.fetchData(`/${patientId}`);
    }

    async getMedicalExaminationInfo(patientId){
        return this.fetchData(`/getkhambenh/${patientId}`);
    }
    
    async getMedicalHistory(patientId){
        return this.fetchData(`/medical-history/${patientId}`);
    }
}

class Utils{
    static formatDate(date){
        return new Date(date).toLocaleDateString('vi-VN');
    }

    static calculateAge(birthDate){
        const birthYear = new Date(birthDate).getFullYear();
        const currentYear = new Date().getFullYear();
        return currentYear - birthYear;
    }
}


class PatientDetailsManager {
    constructor() {
        this.patientService = new PatientService();
        this.selectedRow = null;
        this.initialize();
    }

    async initialize() {
        try {
            await this.displayPatientDetails();
            await this.displayHistory();
            this.initializeEventListeners();
        } catch (error) {
            console.error('Initialization error:', error);
            alert('Không thể tải thông tin bệnh nhân. Vui lòng thử lại sau.');
        }
    }

    getPatientIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('patient-id');
    }

    updateElement(id, value, defaultValue = 'Không có thông tin') {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value || defaultValue;
        }
    }

    async displayHistory() {
        const patientId = this.getPatientIdFromUrl();
        if (!patientId) {
            throw new Error('Không tìm thấy mã bệnh nhân');
        }
        const result = await this.patientService.getMedicalHistory(patientId);
        const medicalHistories = result.data || [];
        this.renderHistory(medicalHistories);
    }

    renderHistory(medicalHistories) {
        const tbody = document.querySelector('#history-table tbody');
        tbody.innerHTML = '';

        let index = 1;
        medicalHistories.forEach(history => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td data-maphieukham="${history.maphieukham}">${index}</td>
                <td>${Utils.formatDate(history.ngaykham) || "Không xác định"}</td>
                <td>${history.lydokham || "Không xác định"}</td>
                <td>${history.trieuchung || "Không xác định"}</td>
                <td>${history.tenloaibenh || "Không xác định"}</td>
                <td>${Utils.formatDate(history.ngaytaikham) || "Không xác định" }</td>
            `;
            index++;
            tbody.appendChild(row);
        });
    }

    handleRowClick(event) {
        const row = event.target.closest('tr');
        if (!row) return;

        // click
        if (this.selectedRow) {
            this.selectedRow.classList.remove('selected-row');
        }
        this.selectedRow = row;
        row.classList.add('selected-row');

        // dblclick
        if (event.detail === 2) {
            const historyId = row.querySelector('td').getAttribute('data-maphieukham');
            if (historyId) {
                this.selectMedicalHistory(historyId);
            }
        }
    }

    selectMedicalHistory(medicalHistoryId) {
        const patientId = this.getPatientIdFromUrl();
        window.location.href = `../examination_health/index.html?patient-id=${patientId}&medical-examination-id=${medicalHistoryId}`;
    }

    async displayPatientDetails() {
        try {
            const patientId = this.getPatientIdFromUrl();
            if (!patientId) {
                throw new Error('Không tìm thấy mã bệnh nhân');
            }

            const result = await this.patientService.getMedicalExaminationInfo(patientId);
            if (!result.success || !result.data || !result.data[0]) {
                throw new Error('Không tìm thấy thông tin bệnh nhân');
            }

            const patient = result.data[0];

            // Update patient information
            this.updateElement("patient-id", patient.mabenhnhan);
            this.updateElement("patient-name", patient.hoten);
            this.updateElement("gender", patient.gioitinh);
            this.updateElement("ethnicity", patient.dantoc);
            this.updateElement("dob", Utils.formatDate(patient.ngaysinh));
            this.updateElement("address", patient.diachi);
            this.updateElement("phone", patient.sodienthoai);
            this.updateElement("job", patient.nghenghiep);
            this.updateElement("age", Utils.calculateAge(patient.ngaysinh));

        } catch (error) {
            console.error('Error displaying patient details:', error);
            alert(error.message || 'Có lỗi xảy ra khi tải thông tin bệnh nhân');
        }
    }

    initializeEventListeners() {
        document.getElementById('history-table').addEventListener('click', (event) => this.handleRowClick(event));
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PatientDetailsManager();
});