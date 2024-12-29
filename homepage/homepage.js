async function fetchDoctorDetails() {
    try {
        // const response = await fetch('http://localhost:3000/api/bac-si');
        //after deploy
        const response = await fetch('https://clinic-management-theta.vercel.app/api/bac-si');
        const data = await response.json();

        if (data.success) {
            const doctor = data.data[0];
            document.getElementById('admin-avatar').src = doctor.anhdaidien;
            document.getElementById('doctor-name').innerText = doctor.hoten;
        } else {
            console.error('Failed to fetch doctor details');   
        }
    } catch (error) {
        console.error('Error fetching doctor details:', error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    fetchDoctorDetails();
    function updateData() {
        Promise.all([
            // fetch('http://localhost:3000/api/benh-nhan').then(response => response.json()),
            //after deploy
            fetch('https://clinic-management-theta.vercel.app/api/benh-nhan').then(response => response.json()),

            // fetch('http://localhost:3000/api/hoa-don').then(response => response.json()),
            //after deploy
            fetch('https://clinic-management-theta.vercel.app/api/hoa-don/doanhthu').then(response => response.json()),

            // fetch('http://localhost:3000/api/thuoc').then(response => response.json())
            //after deploy
            fetch('https://clinic-management-theta.vercel.app/api/thuoc').then(response => response.json())
        ])
        .then(([benhnhansData, hoadonsData, thuocsData]) => {
            console.log('Benhnhans Data:', benhnhansData);
            console.log('Hoadons Data:', hoadonsData);
            console.log('Thuocs Data:', thuocsData);

            const patientCount = benhnhansData.data.length;
            const totalMedicine = thuocsData.data.length;
            const totalRevenue = hoadonsData.data.reduce((total, hoadon) => total + parseFloat(hoadon.tong_doanh_thu), 0);

            document.getElementById("patient-count").innerText = patientCount;
            document.getElementById("total-medicine").innerText = totalMedicine;
            document.getElementById("total-revenue").innerText = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalRevenue);
        })
        .catch(error => console.error('Error fetching data:', error));
    }

    // Call updateData function to fetch and update the data
    updateData();
});