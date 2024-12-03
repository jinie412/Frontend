// Danh sách bệnh nhân
const patientList = [
    { id: 1, name: 'Nguyễn Văn A', age: 34 },
    { id: 2, name: 'Trần Thị B', age: 28 },
    { id: 3, name: 'Lê Văn C', age: 45 },
    {id:4,name:' ',age:' '},
    {id:5,name:' ',age:' '},
    {id:6,name:' ',age:' '},
    {id:7,name:' ',age:' '},
    {id:8,name:' ',age:' '},
    {id:9,name:' ',age:' '},
    {id:10,name:' ',age:' '},
    {id:11,name:' ',age:' '}
];

//Thông tin chi tiết
const patientRecords = {
    '2024-10-17': [
        {
            name: 'Nguyễn Văn A',
            birthDate: '1/1/1990',
            address: 'Dĩ An, Bình Dương',
            gender: 'Nam',
            phone: '0123456789',
            examDate: '17/10/2024',
            diagnosis: 'Cảm',
            symptoms: 'Ho',
            doctor: 'Nguyễn Huỳnh C',
            medicines: [
                {
                    code: 'PD001',
                    name: 'Paracetamol',
                    price: 50000,
                    quantity: 2,
                },
                {
                    code: 'PD002',
                    name: 'Aspirin',
                    price: 40000,
                    quantity: 4,
                }
            ],
            examFee: 30000,
            totalAmount: 290000,
            status: 'Chưa thanh toán'
        },
        {
            name: 'Lê Văn C',
            birthDate: '3/2/1999',
            address: 'Tân An, Long An',
            gender: 'Nam',
            phone: '0123456789',
            examDate: '17/10/2024',
            diagnosis: 'Cảm',
            symptoms: 'Ho',
            doctor: 'Hồ Huy D',
            medicines: [
                {
                    code: 'PD001',
                    name: 'Paracetamol',
                    price: 50000,
                    quantity: 2,
                },
                {
                    code: 'PD002',
                    name: 'Aspirin',
                    price: 40000,
                    quantity: 4,
                }
            ],
            examFee: 30000,
            totalAmount: 290000,
            status: 'Chưa thanh toán'

        }
    ],
    '2024-10-18': [
        {
            name: 'Trần Thị B',
            birthDate: '15/5/1995',
            address: 'Thủ Đức, TP.HCM',
            gender: 'Nữ',
            phone: '0987654321',
            examDate: '18/10/2024',
            diagnosis: 'Viêm họng',
            symptoms: 'Đau họng, sốt nhẹ',
            doctor: 'Lê Văn D',
            medicines: [
                {
                    code: 'PD003',
                    name: 'Strepsils',
                    price: 45000,
                    quantity: 2,
                }
            ],
            examFee: 30000,
            totalAmount: 120000,
            status: 'Chưa thanh toán'
        }
    ]
};

// Hàm tạo danh sách bệnh nhân
function populatePatientList() {
    const tbody = document.querySelector('.patient-table tbody');
    tbody.innerHTML = '';
    patientList.forEach((patient) => {
        const row = document.createElement('tr');
        row.className = 'empty-row';
        row.innerHTML = `
            <td>${patient.id}</td>
            <td>${patient.name}</td>
            <td>${patient.age}</td>
        `;
        tbody.appendChild(row);
    });
}

// Hàm xoá chi tiết bệnh nhân để trả về trang trống
function clearDetails() {
    document.getElementById('patientName').textContent = '';
    document.getElementById('patientBirth').textContent = '';
    document.getElementById('patientAddress').textContent = '';
    document.getElementById('patientGender').textContent = '';
    document.getElementById('patientPhone').textContent = '';
    document.getElementById('examDate').textContent = '';
    document.getElementById('diagnosis').textContent = '';
    document.getElementById('symptoms').textContent = '';
    document.getElementById('doctor').textContent = '';

    // Xoá bảng thuốc
    const medicineTableBody = document.querySelector('.medicine-table tbody');
    medicineTableBody.innerHTML = '';

    // Xoá phần tổng tiền
    const totalSection = document.querySelector('.total-section table');
    totalSection.innerHTML = `
        <tr>
            <td><strong>Tiền khám:</strong> 0đ</td>
            <td style="padding-left: 2rem"><strong>Tổng tiền:</strong> 0đ</td>
        </tr>
    `;
}

// Hàm tìm kiếm theo ngày
function searchByDate(date) {
    clearDetails();
    
    if (!date) {
        console.error('Chưa chọn ngày');
        return;
    }

    const patients = patientRecords[date];
    if (patients && patients.length > 0) {
        // Cập nhật danh sách bệnh nhân theo ngày
        const tbody = document.querySelector('.patient-table tbody');
        tbody.innerHTML = '';
        
        patients.forEach((patient, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${patient.name}</td>
                <td>${calculateAge(patient.birthDate)}</td>
            `;
            // Thêm sự kiện click cho mỗi hàng
            row.addEventListener('click', () => showPatientDetails(patient));
            tbody.appendChild(row);
        });

        // Thêm các hàng trống còn lại
        const remainingRows = 11 - patients.length;
        for (let i = 0; i < remainingRows; i++) {
            const emptyRow = document.createElement('tr');
            emptyRow.className = 'empty-row';
            emptyRow.innerHTML = `
                <td>${patients.length + i + 1}</td>
                <td></td>
                <td></td>
            `;
            tbody.appendChild(emptyRow);
        }
    } else {
        alert('Không có bệnh nhân khám trong ngày này');
        populatePatientList(); // Hiển thị lại danh sách mặc định
    }
}

// Hàm tính tuổi
function calculateAge(birthDate) {
    const [day, month, year] = birthDate.split('/');
    const birth = new Date(year, month - 1, day);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    
    return age;
}

// Hàm tìm bệnh nhân
function searchPatient() {
    const searchInput = document.getElementById('searchInput').value.trim().toLowerCase();
    const searchDate = document.getElementById('searchDate').value;
    
    if(!searchInput) {
        console.error('Không tìm thấy tên bệnh nhân');
        return;
    }

    if (searchDate) {
        const patients = patientRecords[searchDate];
        if (patients) {
            const foundPatient = patients.find(p => 
                p.name.toLowerCase().includes(searchInput)
            );
            if (foundPatient) {
                showPatientDetails(foundPatient);
            } else {
                alert('Không tìm thấy bệnh nhân');
                clearDetails();
            }
        } else {
            alert('Không có dữ liệu cho ngày này');
            clearDetails();
        }
    } else {
        // Tìm kiếm trong tất cả các ngày
        let found = false;
        for (const date in patientRecords) {
            const foundPatient = patientRecords[date].find(p => 
                p.name.toLowerCase().includes(searchInput)
            );
            if (foundPatient) {
                showPatientDetails(foundPatient);
                found = true;
                break;
            }
        }
        if (!found) {
            alert('Không tìm thấy bệnh nhân');
            clearDetails();
        }
    }
}

// Hàm hiện chi tiết bệnh nhân
function showPatientDetails(patient) {
    document.getElementById('patientName').textContent = patient.name;
    document.getElementById('patientBirth').textContent = patient.birthDate;
    document.getElementById('patientAddress').textContent = patient.address;
    document.getElementById('patientGender').textContent = patient.gender;
    document.getElementById('patientPhone').textContent = patient.phone;
    document.getElementById('examDate').textContent = patient.examDate;
    document.getElementById('diagnosis').textContent = patient.diagnosis;
    document.getElementById('symptoms').textContent = patient.symptoms;
    document.getElementById('doctor').textContent = patient.doctor;

    // Hiện chi tiết bảng thuốc
    const medicineTableBody = document.querySelector('.medicine-table tbody');
    medicineTableBody.innerHTML = patient.medicines.map(medicine => `
        <tr>
            <td>${medicine.code}</td>
            <td>${medicine.name}</td>
            <td>${medicine.price.toLocaleString()}đ</td>
            <td>${medicine.quantity}</td>
            <td>${(medicine.price * medicine.quantity).toLocaleString()}đ</td>
        </tr>
    `).join('');

    // Hiện tổng tiền
    const totalSection = document.querySelector('.total-section table');
    totalSection.innerHTML = `
        <tr>
            <td><strong>Tiền khám:</strong> ${patient.examFee.toLocaleString()}đ</td>
            <td style="padding-left: 2rem"><strong>Tổng tiền:</strong> ${patient.totalAmount.toLocaleString()}đ (${patient.status})</td>
        </tr>
    `;
}

// Khởi tạo trang
document.addEventListener('DOMContentLoaded', () => {
    populatePatientList();
    clearDetails(); // Bắt đầu với trang rỗng
});