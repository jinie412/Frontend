// Biến trạng thái toàn cục
let isEditMode = false; // Mặc định ở chế độ xem
let hasUnsavedChanges = false;

// Hàm kiểm tra trạng thái bệnh nhân
async function setIsEditMode() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const medicalExaminationId = urlParams.get('medical-examination-id');
    const response = await fetch(`http://localhost:3000/api/phieu-kham-benh/${medicalExaminationId}`);
    const result = await response.json();
    
    if (result.success) {
      // Lấy trạng thái từ phiếu khám bệnh
      const status = result.data.trangthai;
      // Nếu chưa khám thì cho phép sửa, đã khám thì chỉ cho xem
      isEditMode = status !== 'Đã khám';
      toggleInputFields(isEditMode);
    }
  } catch (error) {
    console.error('Lỗi khi kiểm tra trạng thái:', error);
    isEditMode = false;
    toggleInputFields(false);
  }
}

// Hàm đánh dấu có thay đổi
const markUnsavedChanges = () => {
  hasUnsavedChanges = true;
};

// Thêm nút sửa vào giao diện
function addEditButton() {
  const saveBtn = document.getElementById("save-btn");
  if (saveBtn) {
    const editBtn = document.createElement('button');
    editBtn.id = 'edit-btn';
    editBtn.className = 'btn btn-primary';
    editBtn.style.marginRight = '10px';
    editBtn.innerHTML = '<i class="fas fa-edit"></i>Sửa';
    saveBtn.parentNode.insertBefore(editBtn, saveBtn);
  }
}

// Điều khiển trạng thái của các trường input
function toggleInputFields(enabled) {
  // Danh sách các trường nhập liệu
  const inputFields = [
    "symptoms", "medical-history", "allergy", "pulse", 
    "temperature", "blood-pressure", "respiration", 
    "height", "weight", "reason", "notes", "advice",
    "reexam-date", "diagnosis"
  ];

  // Xử lý các trường nhập liệu
  inputFields.forEach(field => {
    const input = document.getElementById(field);
    if (input) {
      input.disabled = !enabled;
      if (enabled) {
        input.addEventListener("input", markUnsavedChanges);
      } else {
        input.removeEventListener("input", markUnsavedChanges);
      }
    }
  });

  // Hiển thị/ẩn các nút điều khiển
  const saveBtn = document.getElementById("save-btn");
  const editBtn = document.getElementById("edit-btn");
  const addRowBtn = document.getElementById("add-row-btn");
  const medicineSelect = document.getElementById("medicine-select");
  const addSubclinicalBtn = document.getElementById("addButton");

  if (saveBtn) saveBtn.style.display = enabled ? "inline-block" : "none";
  if (editBtn) editBtn.textContent = enabled ? "Hủy" : "Sửa";
  if (addRowBtn) addRowBtn.style.display = enabled ? "inline-block" : "none";
  if (addSubclinicalBtn) addSubclinicalBtn.style.display = enabled ? "inline-block" : "none";

  // Xử lý select thuốc
  if (medicineSelect) {
    medicineSelect.disabled = !enabled;
    if (enabled) {
      medicineSelect.addEventListener("change", markUnsavedChanges);
    } else {
      medicineSelect.removeEventListener("change", markUnsavedChanges);
    }
  }

  // Xử lý bảng thuốc
  const prescriptionTable = document.getElementById('prescription-table');
  if (prescriptionTable) {
    const elements = prescriptionTable.querySelectorAll('input, select, button.delete-row-btn');
    elements.forEach(element => {
      if (element.tagName === 'BUTTON') {
        element.style.display = enabled ? "inline-block" : "none";
      } else {
        element.disabled = !enabled;
        if (enabled) {
          element.addEventListener('input', markUnsavedChanges);
          element.addEventListener('change', markUnsavedChanges);
        } else {
          element.removeEventListener('input', markUnsavedChanges);
          element.removeEventListener('change', markUnsavedChanges);
        }
      }
    });
  }

  // Xử lý bảng cận lâm sàng
  const subclinicalTable = document.querySelector("#subclinicalTable tbody");
  if (subclinicalTable) {
    const elements = subclinicalTable.querySelectorAll('input, button.delete-row-btn');
    elements.forEach(element => {
      if (element.tagName === 'BUTTON') {
        element.style.display = enabled ? "inline-block" : "none";
      } else {
        element.disabled = !enabled;
        if (enabled) {
          element.addEventListener('input', markUnsavedChanges);
        } else {
          element.removeEventListener('input', markUnsavedChanges);
        }
      }
    });
  }

  // Cập nhật trạng thái
  isEditMode = enabled;
  if (!enabled) {
    hasUnsavedChanges = false;
  }
}

// Xử lý sự kiện click nút Sửa
function handleEditClick() {
  if (isEditMode && hasUnsavedChanges) {
    if (confirm('Bạn có thay đổi chưa được lưu. Bạn có chắc muốn hủy các thay đổi này?')) {
      toggleInputFields(false);
      location.reload();
    }
  } else {
    toggleInputFields(!isEditMode);
  }
}

// Khởi tạo các event listener
function initializeEventListeners() {
  // Nút sửa
  const editBtn = document.getElementById('edit-btn');
  if (editBtn) {
    editBtn.addEventListener('click', handleEditClick);
  }

  // Sự kiện rời trang
  window.addEventListener('beforeunload', function(e) {
    if (isEditMode && hasUnsavedChanges) {
      e.preventDefault();
      e.returnValue = 'Bạn có thay đổi chưa được lưu. Bạn có chắc muốn rời khỏi trang?';
      return e.returnValue;
    }
  });

  // Nút quay lại
  const backBtn = document.getElementById('back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', function(e) {
      if (isEditMode && hasUnsavedChanges) {
        if (!confirm('Bạn có thay đổi chưa được lưu. Bạn có chắc muốn rời khỏi trang?')) {
          e.preventDefault();
          return false;
        }
      }
    });
  }

  // Các nút thêm/xóa
  const addRowBtn = document.getElementById('add-row-btn');
  const addButton = document.getElementById('addButton');
  
  if (addRowBtn) addRowBtn.addEventListener('click', markUnsavedChanges);
  if (addButton) addButton.addEventListener('click', markUnsavedChanges);
  
  document.querySelectorAll('.delete-row-btn').forEach(btn => {
    btn.addEventListener('click', markUnsavedChanges);
  });
}

// Hàm xử lý sự kiện Quay lại ở Trang khám bệnh
document.getElementById("back-btn").addEventListener("click", function () {

  // Quay lại Trang nhận bệnh
  window.location.href = "../admitted_patient/index.html";
});

// Hàm lấy thông tin thuốc từ API
async function fetchMedicineData() {
  try {
    const response = await fetch('http://localhost:3000/api/thuoc');
    const result = await response.json();
    if (result.success) {
      populateMedicineDropdown(result.data);
    } else {
      console.error('Failed to fetch medicine data');
    }
  } catch (error) {
    console.error('Error fetching medicine data:', error);
  }
}

// Hàm điền dữ liệu vào dropdown thuốc
function populateMedicineDropdown(medicines) {
  const select = document.getElementById('medicine-select');
  select.innerHTML = '';
  medicines.forEach(medicine => {
    const option = document.createElement('option');
    option.value = JSON.stringify(medicine);
    option.textContent = medicine.tenthuoc;
    select.appendChild(option);
  });
}

// Thêm sự kiện click cho nút Thêm dòng
document.getElementById('add-row-btn').addEventListener('click', function () {
  const select = document.getElementById('medicine-select');
  const selectedMedicine = JSON.parse(select.value);
  addPrescriptionRow(selectedMedicine);
});

// Hàm thêm dòng vào bảng toa thuốc
function addPrescriptionRow(medicine) {
  const tbody = document.querySelector('#prescription-table tbody');
  const rowCount = tbody.rows.length + 1;
  const row = document.createElement('tr');
  row.innerHTML = `
      <td>${rowCount}</td>
      <td>${medicine.mathuoc}</td>
      <td>${medicine.tenthuoc}</td>
      <td>${medicine.donvitinh.tendonvi}</td>
      <td><input type="number" min="1" value="1"></td>
      <td>
          <select>
              ${medicine.cachdungthuocs.map(cd => `<option>${cd.cachdung.motacachdung}</option>`).join('')}
          </select>
      </td>
      <td><button class="delete-row-btn">Xóa</button></td>
  `;
  tbody.appendChild(row);

  // Thêm sự kiện xóa hàng
  row.querySelector('.delete-row-btn').addEventListener('click', function () {
    row.remove();
    updateRowNumbers();
  });
}

// Hàm cập nhật số thứ tự dòng trong bảng
function updateRowNumbers() {
  const rows = document.querySelectorAll('#prescription-table tbody tr');
  rows.forEach((row, index) => {
    row.querySelector('td:first-child').textContent = index + 1;
  });
}

// Hàm lấy dữ liệu loại bệnh từ API
async function fetchDiagnosisData() {
  try {
    const response = await fetch('http://localhost:3000/api/loai-benh');
    const result = await response.json();
    if (result.success) {
      populateDiagnosisDropdown(result.data);
    } else {
      console.error('Failed to fetch diagnosis data');
    }
  } catch (error) {
    console.error('Error fetching diagnosis data:', error);
  }
}

// Hàm điền dữ liệu vào dropdown loại bệnh
function populateDiagnosisDropdown(diagnoses) {
  const select = document.getElementById('diagnosis');
  select.innerHTML = '';
  diagnoses.forEach(diagnosis => {
    const option = document.createElement('option');
    option.value = diagnosis.maloaibenh;
    option.textContent = diagnosis.tenloaibenh;
    select.appendChild(option);
  });
}

// Hàm lấy thông tin bệnh nhân từ API
async function fetchPatientData(patientId, medicalExaminationId) {
  try {
      const response = await fetch(`http://localhost:3000/api/benh-nhan/getkhambenh/${patientId}`);
      const result = await response.json();
      console.log('API response:', result);
      if (result.success) {
          result.data.forEach(patient => {
              if (patient.maphieukham === medicalExaminationId) {
                  populatePatientData(patient);
              }
          })
      } else {
          console.error('Failed to fetch patient data');
      }
  } catch (error) {
      console.error('Error fetching patient data:', error);
  }
}

// Hàm lấy thông tin toa thuốc từ API
async function getPrescriptionData(medicalExaminationId){
  try {
    const response = await fetch(`http://localhost:3000/api/phieu-kham-benh/chi-tiet-toa-thuoc/${medicalExaminationId}`);
    const result = await response.json();
    if (result.success) {
      return result.data;
    } else {
      console.error('Failed to fetch prescription data');
    }
  } catch (error) {
    console.error('Error fetching prescription data:', error);
  }
}

// Hàm lấy thông tin cận lâm sàng từ API
async function getSubclinicalData(medicalExaminationId) {
  try {
    const response = await fetch(`http://localhost:3000/api/can-lam-sang/${medicalExaminationId}`);
    const result = await response.json();
    if (result.success) {
      return result.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching subclinical data:', error);
    return [];
  }
}

// Hàm điền dữ liệu bệnh nhân vào form
async function populatePatientData(patient) {
  if (!patient) {
      alert("No patient data provided.");
      return;
  }

  // Điền thông tin bệnh nhân cơ bản
  document.getElementById("patient-id").value = patient.mabenhnhan || "";
  document.getElementById("patient-name").value = patient.hoten || "";
  document.getElementById("patient-gender").value = patient.gioitinh || "";
  document.getElementById("birth-date").value = patient.ngaysinh.split('T')[0] || "";
  document.getElementById("address").value = patient.diachi || "";
  document.getElementById("phone").value = patient.sodienthoai || "";
  document.getElementById("job").value = patient.nghenghiep || "";
  document.getElementById("medical-history").value = patient.tiensu || "";
  document.getElementById("allergy").value = patient.diung || "";
  document.getElementById("reexam-date").value = patient.ngaytaikham?.split('T')[0]

  // Tính và hiển thị tuổi bệnh nhân
  if (patient.ngaysinh) {
      const age = calculateAge(patient.ngaysinh);
      document.getElementById("age").value = age;
  }

  // Điền thông tin phiếu khám bệnh (giả sử lấy phiếu đầu tiên)
  if (patient.maphieukham) {
      document.getElementById("reason").value = patient.lydokham || "";
      document.getElementById("notes").value = patient.ghichukham || "";
      document.getElementById("advice").value = patient.loidan || "";
      document.getElementById("reexam-date").value = patient.ngaytaikham || "";
      document.getElementById("pulse").value = patient.mach || "";
      document.getElementById("temperature").value = patient.nhietdo || "";
      document.getElementById("blood-pressure").value = patient.huyetap || "";
      document.getElementById("respiration").value = patient.nhiptho || "";
      document.getElementById("height").value = patient.chieucao || "";
      document.getElementById("weight").value = patient.cannang || "";
      document.getElementById("symptoms").value = patient.trieuchung || "";
      document.getElementById("reexam-date").value = patient.ngaytaikham.split('T')[0]
  }

  const subclinicalData = await getSubclinicalData(patient.maphieukham);
  const tbodySubclinical = document.querySelector('#subclinicalTable tbody');
  tbodySubclinical.innerHTML = ""; // Xóa dữ liệu cũ trước khi thêm mới
  let rowCounterSubcln = 1;
  subclinicalData.forEach(subclinical => {
    const rowSubclinical = document.createElement("tr");
    rowSubclinical.innerHTML = `
        <td><input type="text" value="${subclinical.tencanlamsang || ""}"></td>
        <td><input type="text" value="${subclinical.ketqua || ""}"></td>
        <td><button class="delete-row-btn">Xóa</button></td>
    `;
    tbodySubclinical.appendChild(rowSubclinical);

    // Thêm sự kiện xóa hàng
    rowSubclinical.querySelector('.delete-row-btn').addEventListener('click', function () {
        rowSubclinical.remove();
    });

    rowCounterSubcln++;
  })

  const prescriptionData = await getPrescriptionData(patient.maphieukham);

  // Xử lý hiển thị thuốc và cách dùng trong bảng
  const tbody = document.querySelector('#prescription-table tbody');
  tbody.innerHTML = ""; // Xóa dữ liệu cũ trước khi thêm mới
  let rowCounter = 1;
  prescriptionData.forEach(prescription => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${rowCounter}</td>
        <td>${prescription.mathuoc}</td>
        <td>${prescription.tenthuoc || "N/A"}</td>
        <td>${prescription.tendonvi || "N/A"}</td>
        <td><input type="number" min="1" value="${prescription.soluong || 1}"></td>
        <td>
            <select>
                <option>${prescription.motacachdung || "Không có thông tin"}</option>
            </select>
        </td>
        <td><button class="delete-row-btn">Xóa</button></td>
    `;
    tbody.appendChild(row);

    // Thêm sự kiện xóa hàng
    row.querySelector('.delete-row-btn').addEventListener('click', function () {
        row.remove();
        updateRowNumbers();
    });

    rowCounter++;
  });
}


// Hàm tính tuổi từ ngày sinh
function calculateAge(birthDate) {
  const birthYear = new Date(birthDate).getFullYear();
  const currentYear = new Date().getFullYear();
  return currentYear - birthYear;
}

document.addEventListener('DOMContentLoaded', async function() {
  initializeEventListeners();
  addEditButton();

  const urlParams = new URLSearchParams(window.location.search);
  const patientId = urlParams.get('patient-id');
  const medicalExaminationId = urlParams.get('medical-examination-id');
  
  if (patientId && medicalExaminationId) {
    await setIsEditMode(); // Xác định mode trước
    await fetchPatientData(parseInt(patientId), parseInt(medicalExaminationId));
    fetchExaminationHistory(parseInt(patientId));
    await fetchDiagnosisData();
    await fetchMedicineData();
  } else {
    alert("Không tìm thấy thông tin bệnh nhân.");
  }
});

// Hằng số về khoảng giá trị của các chỉ số sinh lý
const VITAL_SIGNS_RANGES = {
  pulse: { min: 40, max: 200, unit: 'bpm' },
  temperature: { min: 35, max: 42, unit: '°C' },
  bloodPressure: { 
    systolic: { min: 60, max: 250, unit: 'mmHg' }, 
    diastolic: { min: 40, max: 150, unit: 'mmHg' } 
  },
  respiration: { min: 12, max: 30, unit: 'bpm' },
  height: { min: 30, max: 250, unit: 'cm' },
  weight: { min: 2, max: 300, unit: 'kg' }
};

// Hàm kiểm tra dữ liệu nhập vào
const ValidationService = {
  validateVitalSigns(data) {
    const errors = [];

    // Validate pulse
    if (data.mach) {
      const pulse = parseFloat(data.mach);
      if (isNaN(pulse) || pulse < VITAL_SIGNS_RANGES.pulse.min || pulse > VITAL_SIGNS_RANGES.pulse.max) {
        errors.push(`Mạch phải nằm trong khoảng ${VITAL_SIGNS_RANGES.pulse.min}-${VITAL_SIGNS_RANGES.pulse.max} ${VITAL_SIGNS_RANGES.pulse.unit}`);
      }
    }

    // Validate temperature
    if (data.nhietdo) {
      const temp = parseFloat(data.nhietdo);
      if (isNaN(temp) || temp < VITAL_SIGNS_RANGES.temperature.min || temp > VITAL_SIGNS_RANGES.temperature.max) {
        errors.push(`Nhiệt độ phải nằm trong khoảng ${VITAL_SIGNS_RANGES.temperature.min}-${VITAL_SIGNS_RANGES.temperature.max} ${VITAL_SIGNS_RANGES.temperature.unit}`);
      }
    }

    // Validate blood pressure
    if (data.huyetap) {
      const [systolic, diastolic] = data.huyetap.split('/').map(Number);
      if (isNaN(systolic) || isNaN(diastolic) ||
          systolic < VITAL_SIGNS_RANGES.bloodPressure.systolic.min || 
          systolic > VITAL_SIGNS_RANGES.bloodPressure.systolic.max ||
          diastolic < VITAL_SIGNS_RANGES.bloodPressure.diastolic.min || 
          diastolic > VITAL_SIGNS_RANGES.bloodPressure.diastolic.max) {
        errors.push(`Huyết áp không hợp lệ (Format: tâm thu/tâm trương, VD: 120/80)`);
      }
    }

    // Validate respiration
    if (data.nhiptho) {
      const resp = parseFloat(data.nhiptho);
      if (isNaN(resp) || resp < VITAL_SIGNS_RANGES.respiration.min || resp > VITAL_SIGNS_RANGES.respiration.max) {
        errors.push(`Nhịp thở phải nằm trong khoảng ${VITAL_SIGNS_RANGES.respiration.min}-${VITAL_SIGNS_RANGES.respiration.max} ${VITAL_SIGNS_RANGES.respiration.unit}`);
      }
    }

    // Validate height
    if (data.chieucao) {
      const height = parseFloat(data.chieucao);
      if (isNaN(height) || height < VITAL_SIGNS_RANGES.height.min || height > VITAL_SIGNS_RANGES.height.max) {
        errors.push(`Chiều cao phải nằm trong khoảng ${VITAL_SIGNS_RANGES.height.min}-${VITAL_SIGNS_RANGES.height.max} ${VITAL_SIGNS_RANGES.height.unit}`);
      }
    }

    // Validate weight
    if (data.cannang) {
      const weight = parseFloat(data.cannang);
      if (isNaN(weight) || weight < VITAL_SIGNS_RANGES.weight.min || weight > VITAL_SIGNS_RANGES.weight.max) {
        errors.push(`Cân nặng phải nằm trong khoảng ${VITAL_SIGNS_RANGES.weight.min}-${VITAL_SIGNS_RANGES.weight.max} ${VITAL_SIGNS_RANGES.weight.unit}`);
      }
    }

    return errors;
  },

  validateSubclinical(data) {
    return data.every(item => 
      item.tencanlamsang.trim() && 
      item.ketqua.trim()
    );
  },

  validatePrescription(data) {
    return data.every(item => {
      const quantity = parseInt(item.soluong);
      return item.mathuoc && 
             !isNaN(quantity) && 
             quantity > 0;
    });
  },

  validateRequiredFields(data) {
    const requiredFields = {
      trieuchung: 'Triệu chứng',
      lydokham: 'Lý do khám',
      maloaibenh: 'Loại bệnh'
    };

    return Object.entries(requiredFields)
      .filter(([key]) => !data[key]?.trim())
      .map(([_, label]) => `${label} không được để trống`);
  }
};

async function updateMedicineInStock(medicineId, quantity, isAdd) {
  try {
    // Validate inputs
    if (!medicineId || !quantity || quantity < 0) {
      throw new Error('Invalid input parameters');
    }

    const response = await fetch(`http://localhost:3000/api/thuoc/${medicineId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch medicine data');
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error('Failed to get medicine data');
    }

    quantity = parseInt(quantity);
    let soluongnhap = result.data.soluongnhap;
    let soluongcon = result.data.soluongcon;

    if (isAdd) {
      soluongnhap += quantity;
      soluongcon -= quantity;
    } else {
      soluongcon += quantity;
      soluongnhap -= quantity;
    }

    if (soluongcon < 0) {
      throw new Error('Số lượng thuốc trong kho không đủ');
    }

    const updateResponse = await fetch(`http://localhost:3000/api/thuoc/update/${medicineId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ soluongnhap, soluongcon })
    });

    if (!updateResponse.ok) {
      throw new Error('Failed to update medicine stock');
    }
  } catch (error) {
    alert(`Lỗi cập nhật số lượng thuốc: ${error.message}`);
    throw error;
  }
}

// Save examination data
async function saveExamination() {
  try {
    // Get IDs from URL
    const urlParams = new URLSearchParams(window.location.search);
    const patientId = urlParams.get("patient-id");
    const medicalExaminationId = urlParams.get("medical-examination-id");
    let status = false;

    // Get form data
    const formData = {
      trieuchung: document.getElementById("symptoms").value,
      tiensu: document.getElementById("medical-history").value,
      diung: document.getElementById("allergy").value,
      mach: document.getElementById("pulse").value,
      nhietdo: document.getElementById("temperature").value,
      huyetap: document.getElementById("blood-pressure").value,
      nhiptho: document.getElementById("respiration").value,
      chieucao: document.getElementById("height").value,
      cannang: document.getElementById("weight").value,
      lydokham: document.getElementById("reason").value,
      ghichukham: document.getElementById("notes").value,
      loidan: document.getElementById("advice").value,
      ngaytaikham: document.getElementById("reexam-date").value,
      ngaykham: new Date().toISOString().split("T")[0],
      mabenhnhan: document.getElementById("patient-id").value,
      maloaibenh: document.getElementById("diagnosis").value,
      trangthai: "Đã khám"
    };

    const response = await fetch(`http://localhost:3000/api/phieu-kham-benh/${medicalExaminationId}`);
    const result = await response.json();
    if(result.data.trangthai === 'Đã khám') {
      status = true;
    }


    // Get subclinical and prescription data
    const subclinicalData = Array.from(document.querySelectorAll("#subclinicalTable tbody tr"))
      .map(row => ({
        tencanlamsang: row.querySelector("td:nth-child(1) input").value,
        ketqua: row.querySelector("td:nth-child(2) input").value,
      }));

    const prescriptionData = Array.from(document.querySelectorAll("#prescription-table tbody tr"))
      .map(row => ({
        mathuoc: row.querySelector("td:nth-child(2)").textContent,
        soluong: row.querySelector("td:nth-child(5) input").value,
      }));

    // Validate all data
    const validationErrors = [
      ...ValidationService.validateVitalSigns(formData),
      ...ValidationService.validateRequiredFields(formData)
    ];

    if (!ValidationService.validatePrescription(prescriptionData)) {
      validationErrors.push('Vui lòng kiểm tra lại thông tin toa thuốc');
    }

    if (validationErrors.length > 0) {
      alert('Lỗi:\n' + validationErrors.join('\n'));
      return;
    }
    
    if(formData.ngaytaikham) {
      if(formData.ngaytaikham < new Date().toISOString().split('T')[0]) {
        alert('Ngày tái khám không được nhỏ hơn ngày hiện tại');
        return;
      }
    }else{
      alert('Vui lòng chọn ngày tái khám');
      return;
    }

    // Chuẩn bị dữ liệu gửi lên API
    const apiData = {
      canlamsang: subclinicalData.map(item => ({
        ...item,
        maphieukham: medicalExaminationId
      })),
      toaThuoc: prescriptionData.map(item => ({
        ...item,
        maphieukham: medicalExaminationId
      })),
      phieuKhamBenh: {
        ngaykham: formData.ngaykham,
        lydokham: formData.lydokham,
        mach: formData.mach,
        nhietdo: formData.nhietdo,
        huyetap: formData.huyetap,
        nhiptho: formData.nhiptho,
        chieucao: formData.chieucao,
        cannang: formData.cannang,
        trieuchung: formData.trieuchung,
        loidan: formData.loidan,
        ghichukham: formData.ghichukham,
        trangthai: formData.trangthai,
        ngaytaikham: formData.ngaytaikham,
      },
      loaiBenh: {
        maphieukham: medicalExaminationId,
        maloaibenh: formData.maloaibenh
      },
      benhNhan: {
        tiensu: formData.tiensu,
        diung: formData.diung
      }
    };

    // Cập nhật số lượng thuốc trong kho
    try {
      for (const element of apiData.toaThuoc) {
        await updateMedicineInStock(element.mathuoc, element.soluong, true);
      }
    } catch (error) {
      alert('Lỗi khi cập nhật thuốc trong kho:', error);
      return;
    }

    if(status) {
      let response = await fetch(`http://localhost:3000/api/phieu-kham-benh/chi-tiet-toa-thuoc/${medicalExaminationId}`);
      let result = await response.json();
      if(result.success) {
        for (const item of result.data) {
          await updateMedicineInStock(item.mathuoc, item.soluong, false);
          await fetch(`http://localhost:3000/api/toa-thuoc/delete/${medicalExaminationId}/${item.mathuoc}`, {
              method: "DELETE"
          });
        }
      }
      response = await fetch(`http://localhost:3000/api/can-lam-sang/${medicalExaminationId}`);
      result = await response.json();
      if(result.success) {
        result.data.forEach(async item => {
          await fetch(`http://localhost:3000/api/can-lam-sang/delete/${medicalExaminationId}`, {
            method: "DELETE"
          });
        });
      }
    }

    const apiCalls = status
    ? [
      fetch(`http://localhost:3000/api/loai-benh-trong-phieu-kham/update/${medicalExaminationId}`,{
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData.loaiBenh)
      })
    ]
    : [
      fetch(`http://localhost:3000/api/loai-benh-trong-phieu-kham/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData.loaiBenh)
      })
    ]

    apiCalls.push(
      fetch(`http://localhost:3000/api/can-lam-sang/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData.canlamsang)
      }),
      fetch(`http://localhost:3000/api/toa-thuoc/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData.toaThuoc)
      }),
      fetch(`http://localhost:3000/api/benh-nhan/update/${patientId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData.benhNhan)
      }),
      fetch(`http://localhost:3000/api/phieu-kham-benh/update/${medicalExaminationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData.phieuKhamBenh)
      })
    )

    // Save all data
    const responses = await Promise.all(apiCalls);

    // Check for failed responses
    const failedResponses = await Promise.all(
      responses.map(async res => res.ok ? null : await res.json())
    );

    if (failedResponses.some(response => response)) {
      console.error("Lỗi khi lưu dữ liệu:", failedResponses);
      alert("Lưu thông tin thất bại. Vui lòng kiểm tra lại!");
      return;
    }

    alert("Lưu hồ sơ khám bệnh thành công!");
    toggleInputFields(false);
    // window.location.href = "../admitted_patient/index.html";
  } catch (error) {
    console.error("Lỗi:", error);
    alert("Đã xảy ra lỗi trong quá trình lưu. Vui lòng thử lại!");
  }
}

// Add event listener
document.getElementById("save-btn").addEventListener("click", saveExamination);

// Hàm lấy lịch sử khám bệnh từ API
function fetchExaminationHistory(patientId) {
  fetch(`http://localhost:3000/api/benh-nhan/getkhambenh/${patientId}`)
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        addExaminationHistory(result.data);
      } else {
        console.error('Lấy lịch sử khám bệnh thất bại');
      }
    })
    .catch(error => {
      console.error('Lỗi khi lấy lịch sử khám:', error);
    });
}

// Hàm hiển thị lịch sử khám bệnh
async function addExaminationHistory(examinations) {
  const tbody = document.querySelector('#history-table tbody');

  tbody.innerHTML = '';

  // Nếu không có lịch sử khám bệnh
  if (!examinations || examinations.length === 0) {
    tbody.innerHTML = `
      <tr id="default-message">
        <td colspan="11" style="text-align: left;">Chưa có lịch sử khám bệnh</td>
      </tr>`;
    return;
  }

  // Hiển thị lịch sử khám bệh
  examinations.forEach(exam => {
    const row = document.createElement('tr');

    const examDate = new Date(exam.ngaykham).toLocaleDateString('vi-VN');
    const followUpDate = exam.ngaytaikham ? 
      new Date(exam.ngaytaikham).toLocaleDateString('vi-VN') : 
      '---';

    row.innerHTML = `
      <td>${exam.maphieukham}</td>
      <td>${examDate}</td>
      <td>${exam.tenloaibenh || '---'}</td>
      <td>${followUpDate}</td>
    `;

    tbody.appendChild(row);
  });
}

// Thêm sự kiện cho mỗi dòng của bảng để lắng nghe sự kiện nhấn đúp
document.getElementById("history-table-body").addEventListener("dblclick",async function (event) {
  // Kiểm tra nếu người dùng nhấn đúp vào một dòng (trừ ô tiêu đề)
  const row = event.target.closest("tr");
  if (row) {
      const cells = row.querySelectorAll("td");
      const patientId = new URLSearchParams(window.location.search).get('patient-id');
      const medicalExaminationId = cells[0].textContent;
      window.location.href = `../examination_health/index.html?patient-id=${patientId}&medical-examination-id=${medicalExaminationId}`;
  }
});

// Hàm thêm dòng mới
document.getElementById('addButton').addEventListener('click', function() {
  const tableBody = document.querySelector('#subclinicalTable tbody');

  // Tạo dòng mới
  const newRow = document.createElement('tr');

  // Cột "Cận lâm sàng"
  const clinicalCell = document.createElement('td');
  const clinicalInput = document.createElement('input');
  clinicalInput.type = 'text';
  clinicalInput.placeholder = 'Nhập tên cận lâm sàng';
  clinicalCell.appendChild(clinicalInput);
  newRow.appendChild(clinicalCell);

  // Cột "Kết quả"
  const resultCell = document.createElement('td');
  const resultInput = document.createElement('input');
  resultInput.type = 'text';
  resultInput.placeholder = 'Nhập kết quả';
  resultCell.appendChild(resultInput);
  newRow.appendChild(resultCell);

  // Cột "Hành động"
  const actionCell = document.createElement('td');
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Xóa';
  deleteButton.style.padding = '5px 10px';
  deleteButton.style.backgroundColor = '#dc3545';
  deleteButton.style.color = 'white';
  deleteButton.style.border = 'none';
  deleteButton.style.cursor = 'pointer';
  deleteButton.addEventListener('click', function() {
      tableBody.removeChild(newRow);
  });
  actionCell.appendChild(deleteButton);
  newRow.appendChild(actionCell);

  // Thêm dòng mới vào bảng
  tableBody.appendChild(newRow);
});