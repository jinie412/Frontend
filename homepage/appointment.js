async function fetchAndRenderAppointments() {
  try {
    // const response = await fetch('http://localhost:3000/api/benh-nhan/getkhambenh');
    //after deploy
    const response = await fetch('https://clinic-management-theta.vercel.app/api/benh-nhan/getkhambenh');
    const data = await response.json();

    const appointments = data.data.map((patient, index) => {
      if (!patient.phieukhambenhs || patient.phieukhambenhs.length === 0) {
        console.error('No visit records found for patient:', patient);
        return null;
      }
      const firstVisit = patient.phieukhambenhs[0]; // Access the first visit record
      return {
        stt: index + 1, // Sequential number
        id: patient.mabenhnhan,
        name: patient.hoten,
        phone: patient.sodienthoai,
        disease: firstVisit.lydokham, // Reason for the visit from the first visit record
        status: firstVisit.trangthai, // Status of the visit from the first visit record
      };
    }).filter(appointment => appointment !== null); // Filter out null values

    renderAppointments(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
  }
}

function renderAppointments(appointments) {
  const tableBody = document.querySelector(".appointmentTable tbody");
  tableBody.innerHTML = "";

  appointments.forEach((appointment) => {
    const row = document.createElement("tr");
    const statusClass =
      appointment.status === "Đã khám" ? "đã-khám" : "chưa-khám";

    row.innerHTML = `
        <td class="py-3 px-4">${appointment.stt}</td>
        <td class="py-3 px-4">
          ${appointment.name}<br>
          <small class="text-gray-500">${appointment.phone}</small>
        </td>
        <td class="py-3 px-4">${appointment.disease}</td>
        
        <td class="py-3 px-4">
          <span class="status-pill ${statusClass}">${appointment.status}</span>
        </td>
      `;
    tableBody.appendChild(row);
  });
}

// Fetch and render appointments on page load
fetchAndRenderAppointments();