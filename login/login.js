// Thay đổi màu chữ khi nhập sang trắng
document.getElementById("username").addEventListener("input", function () {
  this.classList.add("text-white");
});

document.getElementById("password").addEventListener("input", function () {
  this.classList.add("text-white");
});

const togglePassword = document.getElementById("togglePassword");
const inputPass = document.getElementById("password");

togglePassword.addEventListener("click", function () {
  togglePassword.classList.toggle("fa-eye-slash");

  if (inputPass.type === "password") {
    inputPass.type = "text";
  } else {
    inputPass.type = "password";
  }
});

const checkUsername = (username) => {
  if (!username) return "Hãy nhập Username!";
  else return true;
};

const checkPassword = (password) => {
  if (!password) return "Hãy nhập Password!";
  else if (password.length < 6) return "Mật khẩu cần tối thiểu 6 kí tự!";
  else return true;
};

const showError = (element, message) => {
  element.style.display = "block";
  element.innerHTML = message;
  element.classList.add("message_error");
};
const hideError = (element) => {
  element.style.display = "none";
};
const validation = (username, password) => {
  const errorUsername = document.getElementById("errorUsername");
  const errorPassword = document.getElementById("errorPassword");

  //validation username
  let messageErrorUsername = checkUsername(username);
  if (typeof messageErrorUsername === "string") {
    showError(errorUsername, messageErrorUsername);
  } else {
    hideError(errorUsername);
  }

  //validation password
  let messageErrorPassword = checkPassword(password);
  if (typeof messageErrorPassword === "string") {
    showError(errorPassword, messageErrorPassword);
  } else {
    hideError(errorPassword);
  }

  if (messageErrorPassword === true && messageErrorPassword === true) {
    return true;
  }
  return false;
};

const login = (username, password) => {
  if (username === "admin" && password === "123456") {
    window.location.assign("../homepage/index.html");
    return true;
  }
  return false;
};

const onSubmitForm = (form) => {
  const username = form.username.value;
  const password = form.password.value;
  const checValidation = validation(username, password);
  if (checValidation === true) {
    const checkLogin = login(username, password);
    if (checkLogin == false) {
      swal("", "Tên đăng nhập hoặc mật khẩu không chính xác!", "error");
    }
  }
};
