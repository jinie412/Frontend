//------------------------------------TRANG ĐĂNG NHẬP-----------------------------------

const togglePassword = document.getElementById("togglePassword");
const inputPass = document.getElementById("password");

// Ẩn/hiện mật khẩu
if (togglePassword && inputPass) {
  togglePassword.addEventListener("click", function () {
    togglePassword.classList.toggle("fa-eye-slash");

    if (inputPass.type === "password") {
      inputPass.type = "text";
    } else {
      inputPass.type = "password";
    }
  });
}

// Kiểm tra khi nhập username và password
const checkUsername = (username) => {
  if (!username) return "Hãy nhập Username!";
  else return true;
};

const checkPassword = (password) => {
  if (!password) return "Hãy nhập Password!";
  else if (password.length < 6) return "Mật khẩu cần tối thiểu 6 kí tự!";
  else return true;
};

// Hàm xác định show và hide lỗi
const showError = (element, message) => {
  element.style.display = "block";
  element.innerHTML = message;
  element.classList.add("message_error");
};
const hideError = (element) => {
  element.style.display = "none";
};

const validation_login = (username, password) => {
  const errorUsername = document.getElementById("errorUsername");
  const errorPassword = document.getElementById("errorPassword");

  // Kiểm tra username thỏa yêu cầu
  let messageErrorUsername = checkUsername(username);
  if (typeof messageErrorUsername === "string") {
    showError(errorUsername, messageErrorUsername);
  } else {
    hideError(errorUsername);
  }

  // Kiểm tra password thỏa yêu cầu
  let messageErrorPassword = checkPassword(password);
  if (typeof messageErrorPassword === "string") {
    showError(errorPassword, messageErrorPassword);
  } else {
    hideError(errorPassword);
  }

  if (messageErrorUsername === true && messageErrorPassword === true) {
    return true;
  }
  return false;
};


// Function to generate a simple access token (for demonstration purposes)
const generateAccessToken = () => {
  return 'token-' + Math.random().toString(36);
};


// // Tài khoản và mật khẩu để đăng nhập
// const login = (username, password) => {
//   if (username === "admin" && password === "123456") {
//     const accessToken = generateAccessToken();
//     localStorage.setItem("accessToken", accessToken);
//     window.location.assign("../homepage/index.html");
//     return true;
//   }
//   return false;
// };

// Function to handle login
const login = async (username, password) => {
  try {
    // const response = await fetch('http://localhost:3000/api/bac-si/login', 
    //after deploy
    const response = await fetch('https://clinic-management-theta.vercel.app/api/bac-si/login',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    if (data.success) { // Assuming the backend returns a success flag
      const accessToken = generateAccessToken();
      localStorage.setItem('accessToken', accessToken);
      console.log('Login successful');
      window.location.assign("../homepage/index.html");
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    return false;
  }
};

// Kiểm tra đúng/sai mật khẩu và tài khoản khi ấn nút đăng nhập
const onSubmitFormLogin = (login_form) => {
  const username = login_form.username.value;
  const password = login_form.password.value;
  const checValidation = validation_login(username, password);
  console.log(username, password);
  console.log(checValidation);
  if (checValidation === true) {
    const checkLogin = login(username, password);
    if (checkLogin == false) {
      swal("", "Tên đăng nhập hoặc mật khẩu không chính xác!", "error");
    }
  }
};

//---------------------------------------- TRANG QUÊN MẬT KHẨU--------------------------------------

// Kiểm tra khi nhập email - trang quên mật khẩu

const checkEmail = (email) => {
  if (!email) return "Hãy nhập Email!";
  else return true;
};

const validationForgetPass = (username, email) => {
  const errorUsername = document.getElementById("errorUsernamePass");
  const errorEmail = document.getElementById("errorEmail");

  // Kiểm tra username thỏa yêu cầu
  let messageErrorUsername = checkUsername(username);
  if (typeof messageErrorUsername === "string") {
    showError(errorUsername, messageErrorUsername);
  } else {
    hideError(errorUsername);
  }

  // Kiểm tra email thỏa yêu cầu
  let messageErrorEmail = checkEmail(email);
  if (typeof messageErrorEmail === "string") {
    showError(errorEmail, messageErrorEmail);
  } else {
    hideError(errorEmail);
  }

  if (messageErrorUsername === true && messageErrorEmail === true) {
    return true;
  }
  return false;
};

// Kiểm tra đúng/sai mật khẩu và tài khoản khi ấn nút đăng nhập
const onSubmitFormForgetPass = (forgetPassForm) => {
  const user = forgetPassForm.usernameForgetPass.value;
  const email = forgetPassForm.emailForgetPass.value;
  const checValidation = validationForgetPass(user, email);
  if (checValidation === true) {
    swal("", "Gửi thành công", "success");
  }
};
