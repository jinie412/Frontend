const appointments = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    phone: "0909123123",
    date: "2024-11-22",
    time: "10:18",
    status: "Đã khám",
  },
  {
    id: 2,
    name: "Trần Thị B",
    phone: "0707456456",
    date: "2024-11-22",
    time: "11:00",
    status: "Chưa khám",
  },
  {
    id: 3,
    name: "Lê Văn C",
    phone: "0909333444",
    date: "2024-11-22",
    time: "14:00",
    status: "Chưa khám",
  },
  {
    id: 4,
    name: "Lê Văn C",
    phone: "0909333444",
    date: "2024-11-22",
    time: "16:00",
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
        <td class="py-3 px-4">
          ${appointment.name}<br>
          <small class="text-gray-500">${appointment.phone}</small>
        </td>
        <td class="py-3 px-4">${appointment.date}</td>
        <td class="py-3 px-4">${appointment.time}</td>
        <td class="py-3 px-4">
          <span class="status-pill ${statusClass}">${appointment.status}</span>
        </td>
      `;
    tableBody.appendChild(row);
  });
}

renderAppointments(appointments);
