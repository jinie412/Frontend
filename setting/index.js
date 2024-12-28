async function fetchDoctorDetails() {
    try {
        // const response = await fetch('http://localhost:3000/api/bac-si/info');
        //after deploy
        const response = await fetch('https://clinic-management-theta.vercel.app/api/bac-si/info');
        const data = await response.json();

        if (data.success) {
            const doctor = data.data[0];
            document.getElementById('name').value = doctor.hoten;
            document.getElementById('email').value = doctor.email;
            document.getElementById('city').value = doctor.tinhthanhpho;
            document.getElementById('gender').value = doctor.gioitinh;
            document.getElementById('dob').value = doctor.ngaysinh;
            document.getElementById('phone').value = doctor.sodienthoai;
            document.getElementById('username').value = doctor.tentaikhoan;
        } else {
            console.error('Failed to fetch doctor details');
        }
    } catch (error) {
        console.error('Error fetching doctor details:', error);
    }
}

async function updateConfig() {
    const hoten = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const tinhthanhpho = document.getElementById('city').value;
    const gioitinh = document.getElementById('gender').value;
    const ngaysinh = document.getElementById('dob').value;
    const sodienthoai = document.getElementById('phone').value;
    const tentaikhoan = document.getElementById('username').value;

    const configData = {
        mabacsi: 1,
        hoten,
        email,
        tinhthanhpho,
        gioitinh,
        ngaysinh,
        sodienthoai,
        tentaikhoan
    };

    try {
        // const response = await fetch('http://localhost:3000/api/bac-si/update', 
        //after deploy
        const response = await fetch('https://clinic-management-theta.vercel.app/api/bac-si/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(configData)
        });
        const data = await response.json();

        if (data.success) {
            console.log('Configuration updated successfully');
            alert('Cập nhật thông tin thành công');
        } else {
            console.error('Failed to update configuration');
        }
    } catch (error) {
        console.error('Error updating configuration:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchDoctorDetails();

    document.querySelector('button[type="submit"]').addEventListener('click', (event) => {
        event.preventDefault();
        updateConfig();
    });
});