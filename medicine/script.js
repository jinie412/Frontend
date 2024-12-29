let isEditMode = false;
let isDeleteMode = false;
let selectedRows = new Set();

let medicineData = [];
// Function to fetch medicine data from the backend
async function fetchMedicineData() {
    try {
        // const response = await fetch('http://localhost:3000/api/thuoc');
        //after deploy
        const response = await fetch('https://clinic-management-theta.vercel.app/api/thuoc');
        const result = await response.json();
        if (result.success) {
            medicineData = result.data.map(medicine => ({
                id: medicine.mathuoc,
                name: medicine.tenthuoc,
                unit: medicine.donvitinh.tendonvi,
                inputQuantity: medicine.soluongnhap,
                remainingQuantity: medicine.soluongcon,
                usage: medicine.cachdungthuocs.map(cachdungthuoc => cachdungthuoc.cachdung.motacachdung),
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


function populateTable(medicineData) {
    medicineData = Object.values(medicineData);

    if (!Array.isArray(medicineData)) {
        console.error('Expected medicineData to be an array');
        return;
    }

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
            <td class="py-2 px-4">${Array.isArray(item.usage) ? item.usage.join('<br>') : ""}</td>
            <td>${item.price ? item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : ""}</td>
            <td class="text-center">
                <button class="btn btn-primary edit-btn mb-2">Sửa</button>
                <button class="btn btn-danger delete-btn">Xóa</button>
            </td>
        `;
        row.querySelector('.edit-btn').addEventListener('click', () => handleEditClick(item));
        row.querySelector('.delete-btn').addEventListener('click', () => handleDeleteClick(item.id));
        tbody.appendChild(row);
    });
}

let unitData = [];

// Function to fetch unit data from the backend
async function fetchUnitData() {
    try {
        // const response = await fetch('http://localhost:3000/api/don-vi-tinh');
        //after deploy
        const response = await fetch('https://clinic-management-theta.vercel.app/api/don-vi-tinh');
        const result = await response.json();
        if (result.success) {
            unitData = result.data.map(unit => unit.tendonvi);
            console.log('Unit data:', unitData);
        } else {
            console.error('Failed to fetch unit data');
        }
    } catch (error) {
        console.error('Error fetching unit data:', error);
    }
}

function populateUnitDropdown() {
    const unitDropdown = document.getElementById('editMedicineUnit');
    unitDropdown.innerHTML = '';

    unitData.forEach(unit => {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = unit;
        unitDropdown.appendChild(option);
    });
}



//--------------------Xóa thuoc---------------------//

async function handleDeleteClick(id) {
    if (confirm('Bạn có chắc chắn muốn xóa thuốc này?')) {
        try {
            // const response = await fetch(`http://localhost:3000/api/thuoc/delete/${id}`, 
            //after deploy
            const response = await fetch(`https://clinic-management-theta.vercel.app/api/thuoc/delete/${id}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.success) {
                alert('Xóa thuốc thành công');
                fetchMedicineData(); // Refresh the table with the updated data
            } else {
                alert('Xóa thuốc thất bại');
            }
        } catch (error) {
            console.error('Error deleting medicine:', error);
            alert('Đã xảy ra lỗi khi xóa thuốc');
        }
    }
}

//--------------------END Xóa thuoc---------------------//





//--------------------Chỉnh sửa sử dụng thuoc---------------------//

const usageOptions = [];
let currentUsages = [];

// Fetch danh sách cách dùng từ API
async function fetchUsageOptions() {
    try {
        // const response = await fetch('http://localhost:3000/api/cach-dung');
        //after deploy
        const response = await fetch('https://clinic-management-theta.vercel.app/api/cach-dung');
        const data = await response.json();
        console.log('Usage data:', data);

        if (data.success) {
            usageOptions.length = 0;
            data.data.forEach((item) => usageOptions.push(item));

        } else {
            alert('Không thể tải danh sách cách dùng thuốc.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Lỗi khi gọi API.');
    }
}

function addNewSelect() {
    console.log('Adding new select');
    const selectContainer = document.getElementById('selectContainer');

    if (currentUsages.length > 0) {
        selectContainer.innerHTML = '';

        currentUsages.forEach((usage) => {
            createSelectGroup(selectContainer, usage);
        });
    } else {
        createSelectGroup(selectContainer);
    }
}

// Hàm tạo một dropdown (select) mới
function createSelectGroup(container, selectedValue = null) {
    const newSelectGroup = document.createElement('div');
    newSelectGroup.classList.add('select-group', 'mt-2', 'flex', 'gap-4', 'items-center');

    const newSelect = document.createElement('select');
    newSelect.name = 'editMedicineUsage[]';
    newSelect.classList.add('editMedicineUsage', 'form-select', 'border', 'rounded-md', 'p-2');

    // Thêm các <option> vào dropdown từ usageOptions
    usageOptions.forEach((option) => {
        const optionElement = document.createElement('option');
        optionElement.value = option.macachdung;
        optionElement.textContent = option.motacachdung;

        // Kiểm tra nếu giá trị của option là selectedValue thì đánh dấu nó là selected
        if (option.motacachdung === selectedValue) {
            optionElement.selected = true;
        }

        newSelect.appendChild(optionElement);
    });


    // Tạo nút Remove
    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.textContent = 'Loại bỏ';
    removeButton.classList.add('removeSelect', 'btn', 'btn-danger', '!p-1');

    // Xử lý sự kiện xóa
    removeButton.addEventListener('click', () => {
        if (confirm('Bạn có chắc chắn muốn loại bỏ cách dùng này?')) {
            container.removeChild(newSelectGroup);
        }
    });

    // Thêm dropdown và nút vào group
    newSelectGroup.appendChild(newSelect);
    newSelectGroup.appendChild(removeButton);

    // Thêm group vào container
    container.appendChild(newSelectGroup);
}

document.getElementById('addSelect').addEventListener('click', () => {
    if (currentUsages.length >= usageOptions.length) {
        alert('Số lượng cách dùng đã đầy');
        return;
    }
    currentUsages.push('newUsage');
    addNewSelect();
});


function handleEditClick(item) {
    // Open the edit modal and populate it with the item data
    document.getElementById('editMedicineId').value = item.id;
    document.getElementById('editMedicineName').value = item.name;
    document.getElementById('editMedicineUnit').value = item.unit;
    document.getElementById('editMedicineInputQuantity').value = item.inputQuantity;
    document.getElementById('editMedicineRemainingQuantity').value = item.remainingQuantity;
    //document.getElementById('editMedicineUsage').value = item.usage.join(', ');
    document.getElementById('editMedicinePrice').value = item.price;
    document.getElementById('editModal').classList.add('show');

    populateUnitDropdown(); // Populate dropdown with distinct units
    const unitDropdown = document.getElementById('editMedicineUnit');
    if (unitData.includes(item.unit)) {
        console.log('Unit exists:', item.unit);
        unitDropdown.value = item.unit;
    }

    // Add usage dropdowns with current usages
    console.log('Current usages:', item.usage);
    currentUsages = item.usage;
    addNewSelect();
}

document.getElementById('editMedicineForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const updatedMedicine = {
        //mathuoc need to parse to int
        mathuoc: parseInt(document.getElementById('editMedicineId').value),
        name: document.getElementById('editMedicineName').value,
        unit: document.getElementById('editMedicineUnit').value,
        inputQuantity: parseInt(document.getElementById('editMedicineInputQuantity').value),
        remainingQuantity: parseInt(document.getElementById('editMedicineRemainingQuantity').value),
        usage: Array.from(document.querySelectorAll('select[name="editMedicineUsage[]"]')).map(select => select.value),

        price: parseFloat(document.getElementById('editMedicinePrice').value)
    };

    try {
        // const response = await fetch(`http://localhost:3000/api/thuoc/update`, 
        //after deploy
        const response = await fetch(`https://clinic-management-theta.vercel.app/api/thuoc/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedMedicine)
        });
        const data = await response.json();
        if (data.success) {
            alert('Cập nhật thuốc thành công');
            document.getElementById('editModal').classList.remove('show');
            fetchMedicineData(); // Refresh the table with the updated data
        } else {
            alert('Cập nhật thuốc thất bại');
        }
    } catch (error) {
        console.error('Error updating medicine:', error);
        alert('Đã xảy ra lỗi khi cập nhật thuốc');
    }
});




let sortDirection = {
    price: 'asc', // Default sort direction for price
    name: 'asc'   // Default sort direction for name
};

function sortTableByPrice() {
    medicineData.sort((a, b) => {
        if (sortDirection.price === 'asc') {
            return a.price - b.price;
        } else {
            return b.price - a.price;
        }
    });
    sortDirection.price = sortDirection.price === 'asc' ? 'desc' : 'asc';
    updateSortArrow('price');
    populateTable(medicineData);
}

function updateSortArrow(column) {
    const priceHeader = document.querySelector('#priceHeader span');
    const nameHeader = document.querySelector('#nameHeader span');
    if (column === 'price') {
        if (sortDirection.price === 'asc') {
            priceHeader.innerHTML = '&#9660;'; // Down arrow
        } else {
            priceHeader.innerHTML = '&#9650;'; // Up arrow
        }
    } else if (column === 'name') {
        if (sortDirection.name === 'asc') {
            nameHeader.innerHTML = '&#9660;'; // Down arrow
        } else {
            nameHeader.innerHTML = '&#9650;'; // Up arrow
        }
    }
}

function sortTableByName() {
    medicineData.sort((a, b) => {
        if (sortDirection.name === 'asc') {
            return a.name.localeCompare(b.name);
        } else {
            return b.name.localeCompare(a.name);
        }
    });
    sortDirection.name = sortDirection.name === 'asc' ? 'desc' : 'asc';
    updateSortArrow('name');
    populateTable(medicineData);
}

//--------------------Don vi thuoc---------------------//
async function fetchUnits() {
    try {
        // const response = await fetch('http://localhost:3000/api/don-vi-tinh');
        //after deploy
        const response = await fetch('https://clinic-management-theta.vercel.app/api/don-vi-tinh');
        const data = await response.json();

        if (data.success) {
            const unitTableBody = document.querySelector('#unitTable tbody');
            unitTableBody.innerHTML = '';

            data.data.forEach((unit, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
            <td>${index + 1}</td>
            <td>${unit.tendonvi}</td>
            <td class="text-center">
              <button class="btn btn-primary" onclick="showEditUnitModal(${unit.madonvi}, '${unit.tendonvi}')">Sửa</button>
              <button class="btn btn-danger" onclick="deleteUnit(${unit.madonvi})">Xóa</button>
            </td>
          `;
                unitTableBody.appendChild(row);
            });
        } else {
            alert('Failed to retrieve units');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error fetching units');
    }
}

//modal Unit
function showUnit() {
    document.getElementById('unitModal').classList.add('show');
}

function cancelUnit() {
    document.getElementById('unitModal').classList.remove('show');
}

//add unit
function showAddUnitModal() {
    document.getElementById('addUnitModal').classList.add('show');
}

function closeAddUnitModal() {
    document.getElementById('addUnitModal').classList.remove('show');
}

document.getElementById('addUnitForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const unitName = document.getElementById('unitName').value;

    try {
        // const response = await fetch('http://localhost:3000/api/don-vi-tinh/add', 
        //after deploy
        const response = await fetch('https://clinic-management-theta.vercel.app/api/don-vi-tinh/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tendonvi: unitName }),
        });

        if (response.ok) {
            alert('Unit added successfully');
            document.getElementById('addUnitForm').reset();
            closeAddUnitModal();
            fetchUnits();
        } else {
            alert('Failed to add unit');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error adding unit');
    }
});

//edit unit
function showEditUnitModal(id, name) {
    document.getElementById('editUnitId').value = id;
    document.getElementById('editUnitName').value = name;
    document.getElementById('editUnitModal').classList.add('show');
}

function closeEditUnitModal() {
    document.getElementById('editUnitModal').classList.remove('show');
}

document.getElementById('editUnitForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const unitId = document.getElementById('editUnitId').value;
    const newUnitName = document.getElementById('editUnitName').value;

    try {
        // const response = await fetch(`http://localhost:3000/api/don-vi-tinh/${unitId}`,
        //after deploy
        const response = await fetch(`https://clinic-management-theta.vercel.app/api/don-vi-tinh/${unitId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tendonvi: newUnitName, madonvi: unitId }),
        });

        if (response.ok) {
            alert('Unit updated successfully');
            document.getElementById('editUnitForm').reset();
            closeEditUnitModal();
            fetchUnits();
        } else {
            alert('Failed to update unit');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error updating unit');
    }
});


async function deleteUnit(unitId) {
    if (confirm('Are you sure you want to delete this unit?')) {
        try {
            // const response = await fetch(`http://localhost:3000/api/don-vi-tinh/${unitId}`,
            //after deploy
            const response = await fetch(`https://clinic-management-theta.vercel.app/api/don-vi-tinh/${unitId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Unit deleted successfully');
                fetchUnits(); // Refresh the units list
            } else {
                alert('Failed to delete unit');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error deleting unit');
        }
    }
}
//--------------------Don vi thuoc---------------------//






//--------------------Cach dung thuoc---------------------//
async function fetchUsages() {
    try {
        // const response = await fetch('http://localhost:3000/api/cach-dung');
        //after deploy
        const response = await fetch('https://clinic-management-theta.vercel.app/api/cach-dung');
        const data = await response.json();

        if (data.success) {
            const usageTableBody = document.querySelector('#usageTable tbody');
            usageTableBody.innerHTML = '';

            data.data.forEach((usage, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
            <td>${index + 1}</td>
            <td>${usage.motacachdung}</td>
            <td class="text-center">
              <button class="btn btn-primary" onclick="showEditUsageModal(${usage.macachdung}, '${usage.motacachdung}')">Sửa</button>
              <button class="btn btn-danger" onclick="deleteUsage(${usage.macachdung})">Xóa</button>
            </td>
          `;
                usageTableBody.appendChild(row);
            });
        } else {
            alert('Failed to retrieve usages');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error fetching usages');
    }
}

//modal Usage
function showUsage() {
    document.getElementById('usageModal').classList.add('show');
}
function cancelUsage() {
    document.getElementById('usageModal').classList.remove('show');
}

function showAddUsageModal() {
    document.getElementById('addUsageModal').classList.add('show');
}

function closeAddUsageModal() {
    document.getElementById('addUsageModal').classList.remove('show');
}

function showEditUsageModal(id, description) {
    document.getElementById('editUsageId').value = id;
    document.getElementById('editUsageDescription').value = description;
    document.getElementById('editUsageModal').classList.add('show');
}

function closeEditUsageModal() {
    document.getElementById('editUsageModal').classList.remove('show');
}

async function deleteUsage(usageId) {
    if (confirm('Are you sure you want to delete this usage?')) {
        try {
            // const response = await fetch(`
            //after deploy
            const response = await fetch(`https://clinic-management-theta.vercel.app/api/cach-dung/delete/${usageId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Usage deleted successfully');
                fetchUsages(); // Refresh the usages list
            } else {
                alert('Failed to delete usage');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error deleting usage');
        }
    }
}

document.getElementById('addUsageForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const usageDescription = document.getElementById('usageDescription').value;

    try {
        // const response = await fetch('http://localhost:3000/api/cach-dung/add',
        //after deploy
        const response = await fetch('https://clinic-management-theta.vercel.app/api/cach-dung/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ motacachdung: usageDescription }),
        });

        if (response.ok) {
            alert('Usage added successfully');
            document.getElementById('addUsageForm').reset();
            closeAddUsageModal();
            fetchUsages();
        } else {
            alert('Failed to add usage');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error adding usage');
    }
});

document.getElementById('editUsageForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const usageId = document.getElementById('editUsageId').value;
    const newUsageDescription = document.getElementById('editUsageDescription').value;

    try {
        // const response = await fetch(`http://localhost:3000/api/cach-dung/update/${usageId}`, 
        //after deploy
        const response = await fetch(`https://clinic-management-theta.vercel.app/api/cach-dung/update/${usageId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ motacachdung: newUsageDescription, macachdung: usageId }),
        });

        if (response.ok) {
            alert('Usage updated successfully');
            document.getElementById('editUsageForm').reset();
            closeEditUsageModal();
            fetchUsages();
        } else {
            alert('Failed to update usage');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error updating usage');
    }
});
//--------------------END Cach dung thuoc---------------------//



//--------------------Thêm thuoc mới---------------------//

let countNewUsage = 0;

// Hàm tạo một dropdown (select) mới cho thêm thuốc
function createNewSelectGroup(container, selectedValue = null) {


    const newSelectGroup = document.createElement('div');
    newSelectGroup.classList.add('select-group', 'mt-2', 'flex', 'gap-4', 'items-center');

    const newSelect = document.createElement('select');
    newSelect.name = 'newMedicineUsage[]';
    newSelect.classList.add('newMedicineUsage', 'form-select', 'border', 'rounded-md', 'p-2');

    // Thêm các <option> vào dropdown từ usageOptions
    usageOptions.forEach((option) => {
        const optionElement = document.createElement('option');
        optionElement.value = option.macachdung;
        optionElement.textContent = option.motacachdung;

        // Kiểm tra nếu giá trị của option là selectedValue thì đánh dấu nó là selected
        if (option.macachdung === selectedValue) {
            optionElement.selected = true;
        }

        newSelect.appendChild(optionElement);
    });

    // Tạo nút Remove
    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.textContent = 'Loại bỏ';
    removeButton.classList.add('removeSelect', 'btn', 'btn-danger', '!p-1');

    // Xử lý sự kiện xóa
    removeButton.addEventListener('click', () => {
        countNewUsage++;
        if (confirm('Bạn có chắc chắn muốn loại bỏ cách dùng này?')) {
            container.removeChild(newSelectGroup);
        }
    });

    // Thêm dropdown và nút vào group
    newSelectGroup.appendChild(newSelect);
    newSelectGroup.appendChild(removeButton);

    // Thêm group vào container
    container.appendChild(newSelectGroup);
}

// Xử lý sự kiện khi nhấn nút "Add" trong modal thêm thuốc
document.getElementById('addNewSelect').addEventListener('click', () => {
    if (countNewUsage <= 0) {
        alert('Số lượng cách dùng đã đầy');
        return;
    }
    countNewUsage--;
    const container = document.getElementById('newSelectContainer');
    createNewSelectGroup(container);
});

function showAddModal() {
    const modal = document.getElementById('addModal');
    modal.classList.add('show');
    selectUnitDropdownNewMedicine();
    countNewUsage = usageOptions.length;
}

function closeModal() {
    const modal = document.getElementById('addModal');
    modal.classList.remove('show');
    document.getElementById('addMedicineForm').reset();
}

// Thêm event listener để đóng modal khi click bên ngoài
window.onclick = function (event) {
    const modal = document.getElementById('addModal');
    if (event.target === modal) {
        closeModal();
    }
};

// Function to fetch unit data from the backend
function selectUnitDropdownNewMedicine() {
    const newMedicineUnit = document.getElementById('newMedicineUnit');
    newMedicineUnit.innerHTML = '';

    unitData.forEach(unit => {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = unit;
        newMedicineUnit.appendChild(option);
    });
}
document.getElementById('addMedicineForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const newMedicine = {
        name: document.getElementById('newMedicineName').value,
        unit: document.getElementById('newMedicineUnit').value,
        inputQuantity: parseInt(document.getElementById('newMedicineInputQuantity').value),
        remainingQuantity: parseInt(document.getElementById('newMedicineRemainingQuantity').value),
        usage: Array.from(document.querySelectorAll('select[name="newMedicineUsage[]"]')).map(select => select.value),
        price: parseFloat(document.getElementById('newMedicinePrice').value)
        
    };
    //việt hóa
    vn_newMedicine = {
        tenthuoc: newMedicine.name,
        tendonvi: newMedicine.unit,
        soluongnhap: newMedicine.inputQuantity,
        soluongcon: newMedicine.remainingQuantity,
        cachdungthuocs: newMedicine.usage,
        dongia: newMedicine.price
    };

    try {
        // const response = await fetch('http://localhost:3000/api/thuoc/increaseMedicine', 
        //after deploy
        const response = await fetch('https://clinic-management-theta.vercel.app/api/thuoc/increaseMedicine', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(vn_newMedicine)
        });

        if (response.ok) {
            alert('Medicine added successfully');
            document.getElementById('addMedicineForm').reset();
            document.getElementById('addModal').classList.remove('show');
            // Optionally, refresh the medicine list
        } else {
            alert('Failed to add medicine');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error adding medicine');
    }
});

document.getElementById('cancel-add').addEventListener('click', () => {
    document.getElementById('addModal').classList.remove('show');
});

//--------------------END Thêm thuoc mới---------------------//

document.addEventListener('DOMContentLoaded', () => {
    fetchUsages();
    fetchUnitData();
    fetchUnits();
    fetchUsageOptions();
    const priceHeader = document.querySelector('#priceHeader button');
    const nameHeader = document.querySelector('#nameHeader button');
    priceHeader.addEventListener('click', sortTableByPrice);
    nameHeader.addEventListener('click', sortTableByName);

    //reset currentUsages
    document.getElementById('cancel-edit').addEventListener('click', () => {
        document.getElementById('editModal').classList.remove('show');
        currentUsages = [];
    });

    //show modal Unit
    document.getElementById('unitMedicine').addEventListener('click', showUnit);

    //show modal addUnit
    document.getElementById('addUnit').addEventListener('click', showAddUnitModal);

    //show modal Usage
    document.getElementById('unitUsage').addEventListener('click', showUsage);

    //show modal addUsage
    document.getElementById('addUsage').addEventListener('click', showAddUsageModal);
});

