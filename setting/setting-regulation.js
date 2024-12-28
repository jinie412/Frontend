async function fetchRegulations() {
    try {
        const response = await fetch('http://localhost:3000/api/quy-dinh');
        const data = await response.json();

        if (data.success) {
            const regulation = data.data[0];
            document.getElementById('soLuongBenhNhan').value = regulation.soluongbenhnhantoida;
            document.getElementById('soLuongLoaiBenh').value = regulation.soluongloaibenh;
            document.getElementById('soLuongThuoc').value = regulation.soluongloaithuoc;
            document.getElementById('soLuongDonViTinh').value = regulation.soluongloaidonvi;
            document.getElementById('soLuongCachDung').value = regulation.soluongcachdung;

            const formattedTienKham = parseFloat(regulation.tienkham).toLocaleString('vi-VN', { style: 'decimal' }) + 'đ';
            document.getElementById('tienKham').value = formattedTienKham;
        } else {
            console.error('Failed to fetch regulations');
        }
    } catch (error) {
        console.error('Error fetching regulations:', error);
    }
}

async function fetchDiseases() {
    try {
        const response = await fetch('http://localhost:3000/api/loai-benh');
        const data = await response.json();

        if (data.success) {
            const diseaseTableBody = document.getElementById('diseaseTableBody');
            diseaseTableBody.innerHTML = '';

            data.data.forEach((disease, index) => {
                const row = `
                    <tr class="border-b">
                        <td class="py-2 px-4 text-center">${index + 1}</td>
                        <td class="py-2 px-4">${disease.tenloaibenh}</td>
                        <td class="py-2 px-4">${disease.mota}</td>
                        <td class="py-2 px-4">
                            <button class="delete-btn" data-id="${disease.maloaibenh}">Xóa </button>
                            <span class="mx-2">|</span>
                            <button class="edit-btn" data-id="${disease.maloaibenh}" 
                            data-name="${disease.tenloaibenh}" 
                            data-description="${disease.mota}">Sửa</button>
                        </td>
                    </tr>
                `;
                diseaseTableBody.insertAdjacentHTML('beforeend', row);
            });

            // Add event listeners to all edit buttons
            document.querySelectorAll('.edit-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    const diseaseId = event.target.getAttribute('data-id');
                    const diseaseName = event.target.getAttribute('data-name');
                    const diseaseDescription = event.target.getAttribute('data-description');
                    openEditModal(diseaseId, diseaseName, diseaseDescription);
                });
            });

            // Add event listeners to all delete buttons
            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    const diseaseId = event.target.getAttribute('data-id');

                    //confirm delete
                    if (!confirm('Bạn có chắc chắn muốn xóa loại bệnh này?')) {
                        return;
                    }
                    deleteDisease(diseaseId);
                });
            });
        } else {
            console.error('Failed to fetch diseases');
        }
    } catch (error) {
        console.error('Error fetching diseases:', error);
    }
}

async function updateDisease(diseaseId, disease) {
    try {
        const response = await fetch(`http://localhost:3000/api/loai-benh/update/${diseaseId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(disease)
        });
        const data = await response.json();

        if (data.success) {
            fetchDiseases(); // Refresh the list of diseases
        } else {
            console.error('Failed to update disease');
        }
    } catch (error) {
        console.error('Error updating disease:', error);
    }
}

function openEditModal(diseaseId, diseaseName, diseaseDescription) {
    document.getElementById('editDiseaseId').value = diseaseId;
    document.getElementById('editDiseaseName').value = diseaseName;
    document.getElementById('editDiseaseDescription').value = diseaseDescription;
    document.getElementById('editDiseaseModal').classList.remove('hidden');
}

async function addDisease(disease) {
    try {
        const response = await fetch('http://localhost:3000/api/loai-benh/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(disease)
        });
        const data = await response.json();

        if (data.success) {
            fetchDiseases(); // Refresh the list of diseases
            fetchRegulations(); // Refresh the regulations
        } else {
            console.error('Failed to add disease');
        }
    } catch (error) {
        console.error('Error adding disease:', error);
    }
}

async function deleteDisease(diseaseId) {
    try {
        const response = await fetch(`http://localhost:3000/api/loai-benh/delete/${diseaseId}`, {
            method: 'DELETE'
        });
        const data = await response.json();

        if (data.success) {
            fetchDiseases(); // Refresh the list of diseases
            fetchRegulations(); // Refresh the regulations
        } else {
            console.error('Failed to delete disease');
        }
    } catch (error) {
        console.error('Error deleting disease:', error);
    }
}

async function submitConfig() {
    const tienkham = parseFloat(document.getElementById('tienKham').value.replace(/[^0-9-]+/g, ""));
    const soluongbenhnhantoida = parseInt(document.getElementById('soLuongBenhNhan').value);

    console.log('tienkham:', tienkham);
    console.log('soluongbenhnhantoida:', soluongbenhnhantoida);

    
    const configData = {
        maquydinh: 1,
        soluongbenhnhantoida,
        tienkham
    };

    try {
        const response = await fetch('http://localhost:3000/api/quy-dinh/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(configData)
        });
        const data = await response.json();

        if (data.success) {
            console.log('Configuration updated successfully');
            alert('Đã cập nhật bệnh nhân tối đa: ' + soluongbenhnhantoida + ' và tiền khám: ' + tienkham + 'đ');
        } else {
            console.error('Failed to update configuration');
        }
    } catch (error) {
        console.error('Error updating configuration:', error);
    }
}

function addEventListeners() {
    // Add event listener to the "Thêm loại bệnh mới" button
    document.getElementById('addDiseaseBtn').addEventListener('click', () => {
        document.getElementById('addDiseaseModal').classList.remove('hidden');
    });

    // Add event listener to the "Hủy" button in the modal
    document.getElementById('cancelAddDiseaseBtn').addEventListener('click', () => {
        document.getElementById('addDiseaseModal').classList.add('hidden');
    });

    // Handle button click for adding a new disease
    document.getElementById('addDiseaseSubmitBtn').addEventListener('click', () => {
        const newDisease = {
            tenloaibenh: document.getElementById('newDiseaseName').value,
            mota: document.getElementById('newDiseaseDescription').value
        };
        addDisease(newDisease);

        // Hide the modal and reset the form
        document.getElementById('addDiseaseModal').classList.add('hidden');
        form.reset();
    });

    document.getElementById('submitConfigBtn').addEventListener('click', () => {
        submitConfig();
    });

     // Handle button click for editing a disease
     document.getElementById('editDiseaseSubmitBtn').addEventListener('click', () => {
        const form = document.getElementById('editDiseaseForm');
        if (form.checkValidity()) {
            const diseaseId = document.getElementById('editDiseaseId').value;
            const updatedDisease = {
                tenloaibenh: document.getElementById('editDiseaseName').value,
                mota: document.getElementById('editDiseaseDescription').value
            };

            updateDisease(diseaseId, updatedDisease);

            // Hide the modal and reset the form
            document.getElementById('editDiseaseModal').classList.add('hidden');
            form.reset();
        } else {
            form.reportValidity();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchRegulations();
    fetchDiseases();
    addEventListeners();
});