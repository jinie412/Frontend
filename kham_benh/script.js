document.addEventListener("DOMContentLoaded", () => {
  const birthDateInput = document.getElementById("birth-date");
  const ageInput = document.getElementById("age");

  // Tự động tính tuổi từ ngày sinh
  birthDateInput.addEventListener("change", () => {
    const birthDate = new Date(birthDateInput.value);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    ageInput.value = age;
  });
});
