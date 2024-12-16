let isEditMode = false;
let isDeleteMode = false;
let selectedRows = new Set();

let medicineData = [];
// Function to fetch medicine data from the backend
async function fetchMedicineData() {
    try {
        const response = await fetch('http://localhost:3000/api/thuoc');
        const result = await response.json();
        if (result.success) {
            medicineData = result.data.map(medicine => ({
                id: medicine.mathuoc,
                name: medicine.tenthuoc,
                unit: medicine.donvitinh.tendonvi,
                inputQuantity: medicine.soluongnhap,
                remainingQuantity: medicine.soluongcon,
                usage: medicine.cachdungthuocs.length > 0 ? medicine.cachdungthuocs[0].cachdung.motacachdung : '',
                price: parseFloat(medicine.dongia)
            }));
            populateTable(medicineData);
        } else {
            console.error('Failed to fetch medicine data');
        }
    } catch (error) {
        console.error('Error fetching medicine data:', error);
    }
}

fetchMedicineData();


function populateTable() {
    const tbody = document.querySelector('#medicineTable tbody');
    tbody.innerHTML = '';
    
    medicineData.forEach((item, index) => {
        const row = document.createElement('tr');
        row.setAttribute('data-id', item.id);
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.name}</td>
            <td>${item.unit}</td>
            <td>${item.inputQuantity}</td>
            <td>${item.remainingQuantity}</td>
            <td>${item.usage}</td>
            <td>${item.price}</td>
        `;
        row.addEventListener('click', () => handleRowClick(row));
        tbody.appendChild(row);
    });
}


function handleRowClick(row) {
    if (isEditMode) {
        if (!row.classList.contains('editing')) {
            makeRowEditable(row);
        }
    } else if (isDeleteMode) {
        toggleRowSelection(row);
    }
}

function makeRowEditable(row) {
    const cells = row.cells;
    row.classList.add('editing', 'selected-for-edit');
    
    // Bắt đầu từ index 1 để bỏ qua cột STT
    for (let i = 1; i < cells.length; i++) {
        const currentValue = cells[i].textContent;
        cells[i].innerHTML = `<input type="text" value="${currentValue}">`;
    }
}

function toggleRowSelection(row) {
    if (row.classList.contains('selected-for-delete')) {
        row.classList.remove('selected-for-delete');
        selectedRows.delete(row.getAttribute('data-id'));
    } else {
        row.classList.add('selected-for-delete');
        selectedRows.add(row.getAttribute('data-id'));
    }
}

function toggleEditMode() {
    isEditMode = !isEditMode;
    isDeleteMode = false;
    resetSelections();
    const table = document.getElementById('medicineTable');
    table.classList.toggle('editable-mode');
    table.classList.remove('delete-mode');
}

function toggleDeleteMode() {
    isDeleteMode = !isDeleteMode;
    isEditMode = false;
    resetSelections();
    const table = document.getElementById('medicineTable');
    table.classList.toggle('delete-mode');
    table.classList.remove('editable-mode');
}

function resetSelections() {
    selectedRows.clear();
    const rows = document.querySelectorAll('#medicineTable tbody tr');
    rows.forEach(row => {
        row.classList.remove('selected-for-edit', 'selected-for-delete', 'editing');
        const cells = row.cells;
        for (let i = 1; i < cells.length; i++) {
            if (cells[i].querySelector('input')) {
                cells[i].textContent = cells[i].querySelector('input').value;
            }
        }
    });
}

function saveChanges() {
    if (isEditMode) {
        const editingRows = document.querySelectorAll('.editing');
        editingRows.forEach(row => {
            const inputs = row.querySelectorAll('input');
            inputs.forEach((input, index) => {
                input.parentElement.textContent = input.value;
            });
            row.classList.remove('editing', 'selected-for-edit');
        });
    } else if (isDeleteMode) {
        if (selectedRows.size === 0) {
            alert('Vui lòng chọn ít nhất một dòng để xóa');
            return;
        }
        if (confirm('Bạn có chắc muốn xóa các dòng đã chọn?')) {
            selectedRows.forEach(id => {
                const row = document.querySelector(`tr[data-id="${id}"]`);
                if (row) row.remove();
            });
            selectedRows.clear();
        }
    }
    
    isEditMode = false;
    isDeleteMode = false;
    const table = document.getElementById('medicineTable');
    table.classList.remove('editable-mode', 'delete-mode');
}
document.addEventListener('DOMContentLoaded', populateTable);

//Pop-up
let nextId = medicineData.length + 1;

function showAddModal() {
    const modal = document.getElementById('addModal');
    modal.classList.add('show');
}

function closeModal() {
    const modal = document.getElementById('addModal');
    modal.classList.remove('show');
    document.getElementById('addMedicineForm').reset();
}

document.getElementById('addMedicineForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const inputQuantity = parseInt(document.getElementById('medicineInputQuantity').value);
    // Giả sử ban đầu chưa kê thuốc nào nên số lượng còn = số lượng nhập
    const remainingQuantity = inputQuantity;

    const newMedicine = {
        id: nextId++,
        name: document.getElementById('medicineName').value,
        unit: document.getElementById('medicineUnit').value,
        inputQuantity: inputQuantity,
        remainingQuantity: remainingQuantity, // Tự động tính
        usage: document.getElementById('medicineUsage').value,
        price: parseInt(document.getElementById('medicinePrice').value)
    };

    medicineData.push(newMedicine);
    populateTable();
    closeModal();
});

// Thêm event listener để đóng modal khi click bên ngoài
window.onclick = function(event) {
    const modal = document.getElementById('addModal');
    if (event.target === modal) {
        closeModal();
    }
}
