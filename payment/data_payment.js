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
    constructor() {
        // super('http://localhost:3000/api/benh-nhan');
        //after deploy
        super('https://clinic-management-theta.vercel.app/api/benh-nhan');
    }

    async getPatients() {
        return this.fetchData('/');
    }

    async getPatientById(patientId) {
        return this.fetchData(`/${patientId}`);
    }
}

class MedicalExaminationService extends ApiService {
    constructor() {
        // super('http://localhost:3000/api/phieu-kham-benh');
        //after deploy
        super('https://clinic-management-theta.vercel.app/api/phieu-kham-benh');
    }

    async getMedicalExaminations() {
        return this.fetchData('/');
    }

    async getMedExamDetails() {
        return this.fetchData('/chi-tiet');
    }

    async getMedicineDetails(medicalExamId) {
        return this.fetchData(`/chi-tiet-toa-thuoc/${medicalExamId}`);
    }
}

class RegulatedService extends ApiService {
    constructor() {
        // super('http://localhost:3000/api/quy-dinh');
        //after deploy
        super('https://clinic-management-theta.vercel.app/api/quy-dinh');
    }

    async getRegulatedInfo() {
        return this.fetchData('/');
    }
}

class InvoiceService extends ApiService {
    constructor() {
        // super('http://localhost:3000/api/hoa-don');
        //after deploy
        super('https://clinic-management-theta.vercel.app/api/hoa-don');
    }

    async saveInvoice(data) {
        return this.fetchData(`/add`, { 
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async getInvoiceById(invoiceId) {
        return this.fetchData(`/${invoiceId}`);
    }

    async getInvoices() {
        return this.fetchData('/');
    }
}

class Utils {
    static formatDate(date) {
        return new Date(date).toLocaleDateString('vi-VN');
    }

    static calculateAge(birthDate) {
        const birthYear = new Date(birthDate).getFullYear();
        const currentYear = new Date().getFullYear();
        return currentYear - birthYear;
    }

    static getURLParameter(name) {
        const searchParams = new URLSearchParams(window.location.search);
        return searchParams.get(name);
    }
}

class MedicalExamination {
    constructor(data) {
        Object.assign(this, data);
    }

    toTableRow(index) {
        const safeText = (text) => text || '';
        
        return `
            <tr class="medicalExam-row">
                <td data-medical-exam-id="${this.maphieukham}">${index + 1}</td>
                <td>${safeText(this.hoten)}</td>
                <td>${Utils.formatDate(this.ngaykham)}</td>
            </tr>`;
    }

    setGrandTotal(total) {
        this.grandTotal = total;
    }
}

class MedicalExaminationManager {
    constructor() {
        this.medicalExamService = new MedicalExaminationService();
        this.regulatedService = new RegulatedService();
        this.invoiceService = new InvoiceService();
        this.medicalList = [];
        this.selectedRow = null;
        this.initialize();
    }

    async initialize() {
        try {
            await this.loadMedicalExams();
            await this.renderPatientDetails();
            await this.setStatusPaid();
            this.initializeEventListeners();
        } catch (error) {
            console.error('Initialization error:', error);
            alert('Không thể tải thông tin bệnh nhân. Vui lòng thử lại sau.');
        }
    }

    async loadMedicalExams() {
        try {
            const result = await this.medicalExamService.getMedExamDetails();
            if (result.success) {
                this.medicalList = result.data.map(medicalExam => new MedicalExamination(medicalExam));
                this.renderMedicalList(this.medicalList);
            } else {
                throw new Error(result.message || 'Không thể tải danh sách bệnh nhân');
            }
        } catch (error) {
            alert('Không thể tải danh sách bệnh nhân. Vui lòng thử lại sau.');
        }
    }

    renderMedicalList(medicalExams) {
        const medicalList = document.getElementById('medicalList');
        if (!medicalList || !medicalExams) return;
        medicalList.innerHTML = medicalExams.map((medicalExam, index) => 
            medicalExam.toTableRow(index)).join('');
    }

    searchMedicalExams() {
        const searchInput = document.getElementById('searchInput');
        const searchDate = document.getElementById('searchDate');
        if (!searchInput || !searchDate) {
            alert('Vui lòng nhập thông tin tìm kiếm');
            return;
        }

        const searchText = searchInput.value.trim().toLowerCase();
        const searchDateValue = searchDate.value;

        if (!searchText && !searchDateValue) {
            this.renderMedicalList(this.medicalList);
            return;
        }

        const filteredMedicalExams = this.medicalList.filter(medicalExam => {
            const nameMatch = medicalExam.hoten.toLowerCase().includes(searchText);
            const dateMatch = searchDateValue ? medicalExam.ngaykham === searchDateValue : true;
            return nameMatch && dateMatch;
        });

        this.renderMedicalList(filteredMedicalExams);
    }

    handleRowClick(event) {
        const row = event.target.closest('.medicalExam-row');
        if (!row) return;

        if (event.detail === 2) {
            const medicalExamId = row.querySelector('td').getAttribute('data-medical-exam-id');
            if (medicalExamId) {
                window.location.href = `index.html?medical-exam-id=${medicalExamId}`;
            }
        }
    }

    async renderPatientDetails() {
        const examId = Utils.getURLParameter('medical-exam-id');
        if (!examId) return;

        const patient = this.medicalList.find(medicalExam => 
            medicalExam.maphieukham === parseInt(examId));
        if (!patient) return;

        this.updatePatientInfo(patient);
        await this.renderMedicineDetails(parseInt(examId));
    }

    updatePatientInfo(patient) {
        const elements = {
            patientName: patient.hoten,
            patientBirth: Utils.formatDate(patient.ngaysinh),
            patientAddress: patient.diachi,
            patientGender: patient.gioitinh,
            patientPhone: patient.sodienthoai,
            examDate: Utils.formatDate(patient.ngaykham),
            diagnosis: patient.tenloaibenh,
            symptoms: patient.trieuchung,
            doctor: patient.tenbacsi
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value || '';
            }
        });
    }

    async renderMedicineDetails(examId) {
        try {
            const result = await this.medicalExamService.getMedicineDetails(examId);
            if (!result.success) {
                throw new Error(result.message || 'Không thể tải thông tin toa thuốc');
            }

            const medicines = result.data;
            
            const medicineTableBody = document.querySelector('#medicine-table tbody');
            if (!medicineTableBody){
                alert('Không tìm thấy bảng thuốc');
                return;
            }
            
            medicineTableBody.innerHTML = '';

            medicines.forEach(medicine => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${medicine.mathuoc}</td>
                    <td>${medicine.tenthuoc}</td>
                    <td>${Number(medicine.dongia)} đ</td>
                    <td>${medicine.soluong}</td>
                    <td>${medicine.tendonvi}</td>
                    <td>${(medicine.dongia * medicine.soluong)} đ</td>
                `;
                medicineTableBody.appendChild(row);
            });

            await this.renderCostInfo(medicines);

        } catch (error) {
            alert('Không thể tải thông tin toa thuốc. Vui lòng thử lại sau.');
        }
    }

    async renderCostInfo(medicines) {
        const result = await this.regulatedService.getRegulatedInfo();
        if (!result.success) {
            throw new Error(result.message || 'Không thể tải thông tin quy định');
        }

        const examFee = result.data[0].tienkham;
        let medicineFee = 0;
        for (const medicine of medicines) {
            medicineFee += medicine.dongia * medicine.soluong;
        }

        const grandTotal = Number(examFee) + medicineFee;

        document.getElementById('examFee').textContent = `${Number(examFee)} đ`;
        document.getElementById('grandTotal').textContent = `${Number(grandTotal)} đ`;
    }

    async saveInvoice() {
        try{
            const examId = Utils.getURLParameter('medical-exam-id');
            if (!examId) {
                alert('Không tìm thấy mã phiếu khám');
                return;
            }

            const apiBody = {
                maphieukham: parseInt(examId),
                tongtien: Number(document.getElementById('grandTotal').textContent.replace('đ', '').trim())
            }

            const result = await this.invoiceService.saveInvoice(apiBody);
            if (result.success) {
                alert('Lưu hóa đơn thành công');
                window.location.reload();
            } else {
                alert(result.message || 'Lưu hóa đơn không thành công');
            }
        }catch(error){
            alert('Lưu hóa đơn không thành công');
        }
    }

    async setStatusPaid() {
        try{
            const examId = Utils.getURLParameter('medical-exam-id');
            if (!examId) {
                return;
            }
            const saveButton = document.getElementById('pay');
            const invoices = await this.invoiceService.getInvoices();
            const invoiceStatus = invoices.data.find(invoice => parseInt(invoice.maphieukham) === parseInt(examId));
            
            if (invoiceStatus) {
                saveButton.textContent = 'Đã Thanh toán';
                saveButton.disabled = true;
                saveButton.style.backgroundColor = '#4CAF50';
                saveButton.style.color = 'white';
            }
        }
        catch(error){
            alert('Lỗi khi kiểm tra trạng thái hóa đơn');
        }
    }

    initializeEventListeners() {
        const searchButton = document.getElementById('search-button');
        const searchInput = document.getElementById('searchInput');
        const medicalList = document.getElementById('medicalList');
        const saveButton = document.getElementById('pay');

        if (searchButton) {
            searchButton.addEventListener('click', () => this.searchMedicalExams());
        }

        if (medicalList) {
            medicalList.addEventListener('click', (event) => this.handleRowClick(event));
        }

        if (searchInput) {
            searchInput.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    this.searchMedicalExams();
                }
            });
        }

        if (saveButton) {
            saveButton.addEventListener('click', () => this.saveInvoice());
        }

    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MedicalExaminationManager();
});
