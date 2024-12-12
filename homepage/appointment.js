const appointments = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    phone: "0909123123",
    disease: "Viêm phổi",
    status: "Đã khám",
  },
  {
    id: 2,
    name: "Trần Thị B",
    phone: "0707456456",
    disease: "Viêm họng",

    status: "Chưa khám",
  },
  {
    id: 3,
    name: "Lê Văn C",
    phone: "0909333444",
    disease: "Đau mắt",

    status: "Chưa khám",
  },
  {
    id: 4,
    name: "Lê Văn C",
    phone: "0909333444",
    disease: "Viêm phế quản",

    status: "Chưa khám",
  },
];

function renderAppointments(appointments) {
  const tableBody = document.querySelector(".appointmentTable tbody");
  tableBody.innerHTML = "";

  appointments.forEach((appointment) => {
    const row = document.createElement("tr");
    const statusClass =
      appointment.status === "Đã khám" ? "đã-khám" : "chưa-khám";

    row.innerHTML = `
        <td class="py-3 px-4">${appointment.id}</td>
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

renderAppointments(appointments);
