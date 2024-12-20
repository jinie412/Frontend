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

  const prescriptionData = await getPrescriptionData(patient.maphieukham);

  // Xử lý hiển thị thuốc và cách dùng trong bảng
  const tbody = document.querySelector('#prescription-table tbody');
  tbody.innerHTML = ""; // Xóa dữ liệu cũ trước khi thêm mới
  rowCounter = 1;
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

// Hàm xử lý sự kiện khi trang tải xong
document.addEventListener('DOMContentLoaded', async function () {
  const patientId = new URLSearchParams(window.location.search).get('patient-id');
  const medicalExaminationId = new URLSearchParams(window.location.search).get('medical-examination-id');
  if (patientId) {
    await fetchPatientData(parseInt(patientId), parseInt(medicalExaminationId));
    await fetchExaminationHistory(parseInt(patientId));
  } else {
    alert("Không tìm thấy thông tin bệnh nhân.");
  }
  await fetchDiagnosisData();
  await fetchMedicineData();
});

// Lưu thông tin khám bệnh
document.getElementById("save-btn").addEventListener("click", async () => {
  try {
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
    const prescriptionRows = document.querySelectorAll("#prescription-table tbody tr");
    const trangthai = "Đã khám";
    const patientId = new URLSearchParams(window.location.search).get("patient-id");
    const medicalExaminationId = new URLSearchParams(window.location.search).get("medical-examination-id");

    // Chuẩn bị dữ liệu
    const toaThuoc = Array.from(prescriptionRows).map(row => ({
      maphieukham: medicalExaminationId,
      mathuoc: row.querySelector("td:nth-child(2)").textContent,
      soluong: row.querySelector("td:nth-child(5) input").value,
    }));

    const phieuKhamBenh = {
      ngaykham,
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
      ngaytaikham,
      trangthai,
      mabenhnhan,
    };

    const loaiBenh = {
      maphieukham: medicalExaminationId,
      maloaibenh,
    };

    const benhNhan = {
      mabenhnhan: patientId,
      tiensu,
      diung,
    };

    // Tạo các request API
    const apiRequests = [
      fetch(`http://localhost:3000/api/toa-thuoc/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toaThuoc),
      }),
      fetch(`http://localhost:3000/api/loai-benh-trong-phieu-kham/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loaiBenh),
      }),
      fetch(`http://localhost:3000/api/benh-nhan/update/${patientId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(benhNhan),
      }),
      fetch(`http://localhost:3000/api/phieu-kham-benh/update/${medicalExaminationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(phieuKhamBenh),
      }),
    ];

    // Gửi đồng thời các request
    const responses = await Promise.all(apiRequests);

    // Kiểm tra kết quả từng request
    const failedResponses = await Promise.all(
      responses.map(async res => (res.ok ? null : await res.json()))
    );

    if (failedResponses.some(response => response)) {
      console.error("Một số yêu cầu thất bại", failedResponses);
      alert("Lưu thông tin thất bại. Vui lòng kiểm tra lại!");
      return;
    }

    alert("Lưu hồ sơ khám bệnh thành công!");
    window.location.href = "../admitted_patient/index.html";
  } catch (error) {
    console.error("Lỗi khi lưu hồ sơ khám bệnh:", error);
    alert("Đã xảy ra lỗi trong quá trình lưu. Vui lòng thử lại!");
  }
});


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
function addExaminationHistory(examinations) {
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

  // Hiển thị lịch sử khám bệnh
  examinations.forEach(exam => {
    const row = document.createElement('tr');

    const examDate = new Date(exam.ngaykham).toLocaleDateString('vi-VN');
    const followUpDate = exam.ngaytaikham ? 
      new Date(exam.ngaytaikham).toLocaleDateString('vi-VN') : 
      '---';

    row.innerHTML = `
      <td>${exam.maphieukham}</td>
      <td>${examDate}</td>
      <td>${exam.chandoan || '---'}</td>
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