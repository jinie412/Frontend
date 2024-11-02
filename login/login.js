// Thay đổi màu chữ khi nhập sang trắng
document.getElementById("username").addEventListener("input", function () {
  this.classList.add("text-white");
});

document.getElementById("password").addEventListener("input", function () {
  this.classList.add("text-white");
});

document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMessage = document.getElementById("errorMessage");

    if (!username || !password) {
      errorMessage.textContent = "Vui lòng nhập đầy đủ tài khoản và mật khẩu.";
      errorMessage.style.display = "block";
    } else if (password.length < 6) {
      errorMessage.textContent = "Mật khẩu phải có ít nhất 6 ký tự.";
      errorMessage.style.display = "block";
    } else {
      errorMessage.style.display = "none";
      loginUser(username, password); // Gọi hàm gửi yêu cầu đăng nhập
    }
  });
