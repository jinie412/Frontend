// // Lấy dữ liệu bệnh nhân từ sessionStorage
// const patientData = JSON.parse(sessionStorage.getItem('patientData'));

// // Kiểm tra nếu dữ liệu tồn tại
// if (patientData) {
//   document.getElementById("patient-id").value = patientData.id;
//   document.getElementById("patient-name").value = patientData.name;
//   document.getElementById("patient-gender").value = patientData.gender;
//   document.getElementById("birth-date").value = patientData.birthDate;
//   document.getElementById("age").value = patientData.age;
//   document.getElementById("address").value = patientData.address;
//   document.getElementById("phone").value = patientData.phone;
//   document.getElementById("job").value = patientData.job;

//   // Tính và hiển thị tuổi của bệnh nhân
//   const age = calculateAge(patientData.birthDate);
//   document.getElementById("age").value = age; // Hiển thị tuổi bệnh nhân
// } else {
//   alert("Không tìm thấy thông tin bệnh nhân.");
// }

// Xóa thông tin bệnh nhân sau khi sử dụng
// sessionStorage.removeItem('patientData');

// Hàm xử lý sự kiện Quay lại ở Trang khám bệnh
document.getElementById("back-btn").addEventListener("click", function () {
  // const patientId = document.getElementById("patient-id").value; // Lấy mã bệnh nhân từ form

  // // Lấy thông tin bệnh nhân từ sessionStorage
  // let patients = JSON.parse(sessionStorage.getItem('patients')) || [];

  // // Cập nhật trạng thái bệnh nhân
  // patients = patients.map(patient => {
  //   if (patient.id === patientId) {
  //     patient.status = "Đã khám"; // Cập nhật trạng thái là "Đã khám"
  //   }
  //   return patient;
  // });

  // // Lưu lại danh sách bệnh nhân vào sessionStorage
  // sessionStorage.setItem('patients', JSON.stringify(patients));

  // Quay lại Trang nhận bệnh
  window.location.href = "../admitted_patient/index.html";
});


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

document.getElementById('add-row-btn').addEventListener('click', function () {
  const select = document.getElementById('medicine-select');
  const selectedMedicine = JSON.parse(select.value);
  addPrescriptionRow(selectedMedicine);
});

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

  // Add event listener to the delete button
  row.querySelector('.delete-row-btn').addEventListener('click', function () {
    row.remove();
    updateRowNumbers();
  });
}

function updateRowNumbers() {
  const rows = document.querySelectorAll('#prescription-table tbody tr');
  rows.forEach((row, index) => {
    row.querySelector('td:first-child').textContent = index + 1;
  });
}

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
async function fetchPatientData(patientId) {
  try {
      const response = await fetch(`http://localhost:3000/api/benh-nhan/getkhambenh/${patientId}`);
      const result = await response.json();
      console.log('API response:', result);
      if (result.success) {
          populatePatientData(result.data);
      } else {
          console.error('Failed to fetch patient data');
      }
  } catch (error) {
      console.error('Error fetching patient data:', error);
  }
}

function populatePatientData(patient) {
  if (!patient) {
      console.error("No patient data provided.");
      return;
  }

  // Điền thông tin bệnh nhân cơ bản
  document.getElementById("patient-id").value = patient.mabenhnhan || "";
  document.getElementById("patient-name").value = patient.hoten || "";
  document.getElementById("patient-gender").value = patient.gioitinh || "";
  document.getElementById("birth-date").value = patient.ngaysinh || "";
  document.getElementById("address").value = patient.diachi || "";
  document.getElementById("phone").value = patient.sodienthoai || "";
  document.getElementById("job").value = patient.nghenghiep || "";
  document.getElementById("medical-history").value = patient.tiensu || "";
  document.getElementById("allergy").value = patient.diung || "";

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
  }

  // Xử lý hiển thị thuốc và cách dùng trong bảng
  const tbody = document.querySelector('#prescription-table tbody');
  tbody.innerHTML = ""; // Xóa dữ liệu cũ trước khi thêm mới
  if (patient.mathuoc) {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>1</td>
          <td>${patient.mathuoc}</td>
          <td>${patient.tenthuoc || "N/A"}</td>
          <td>${patient.tendonvi || "N/A"}</td>
          <td><input type="number" min="1" value="${patient.soluong || 1}"></td>
          <td>
              <select>
                  <option>${patient.motacachdung || "Không có thông tin"}</option>
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
  } else {
      console.warn("No prescription data found.");
  }
}

function calculateAge(birthDate) {
  const birthYear = new Date(birthDate).getFullYear();
  const currentYear = new Date().getFullYear();
  return currentYear - birthYear;
}


document.addEventListener('DOMContentLoaded', async function () {
  const patientId = new URLSearchParams(window.location.search).get('patientId');
  if (patientId) {
    await fetchPatientData(patientId);
    
  } else {
    alert("Không tìm thấy thông tin bệnh nhân.");
  }
  await fetchDiagnosisData();
  await fetchMedicineData();
});

document.getElementById("save-btn").addEventListener("click", () => {
  const trieuchung = document.getElementById("symptoms").value;
  const tiensu = document.getElementById("medical-history").value;
  const diung = document.getElementById("allergy").value;
  const mach = document.getElementById("pulse").value;
  const nhietdo = document.getElementById("temperature").value;
  const huyetap = document.getElementById("blood-pressure").value;
  const nhiptho = document.getElementById("respiration").value;
  const chieucao = document.getElementById("height").value;
  const cannang = document.getElementById("weight").value;
  const lydokham = document.getElementById("reason").value;
  const ghichukham = document.getElementById("notes").value;
  const loidan = document.getElementById("advice").value;
  const ngaytaikham = document.getElementById("reexam-date").value;
  const ngaykham = new Date().toISOString().split("T")[0];
  const mabenhnhan = document.getElementById("patient-id").value;
  const maloaibenh = document.getElementById("diagnosis").value;
  const prescriptionRows = document.querySelectorAll('#prescription-table tbody tr');
  const trangthai = "Đã khám";
  const thuoc = Array.from(prescriptionRows).map(row => {
    const mathuoc = row.querySelector('td:nth-child(2)').textContent;
    const soluong = row.querySelector('td:nth-child(5) input').value;
    return { mathuoc, soluong };
  });

  const data = {
    tiensu,
    diung,
    trieuchung,
    mach,
    nhietdo,
    huyetap,
    nhiptho,
    chieucao,
    cannang,
    lydokham,
    ghichukham,
    loidan,
    ngaykham,
    ngaytaikham,
    trangthai,
    mabenhnhan,
    maloaibenh,
    thuoc
  };

  fetch('http://localhost:3000/api/phieu-kham-benh/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        alert('Lưu hồ sơ khám bệnh thành công');
        window.location.href = '../admitted_patient/index.html';
      } else {
        alert('Lưu hồ sơ khám bệnh thất bại');
      }
    })
    .catch(error => {
      console.error('Error saving examination record:', error);
      alert('Lưu hồ sơ khám bệnh thất bại');
    });
});
