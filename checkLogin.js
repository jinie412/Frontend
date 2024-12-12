const router = () => {
    const accessToken = localStorage.getItem("accessToken");
    const currentPath = window.location.pathname;
    
    // Lấy basePath từ cấu trúc đường dẫn hiện tại
    const basePath = window.location.pathname.split('/')[1] === 'Frontent' ? 'Frontent' : ''; // Xử lý theo cấu trúc thư mục
  
    // Đảm bảo đường dẫn login chính xác
    const loginPath = basePath ? `/${basePath}/login/index.html` : '/login/index.html';
    
    // Nếu không có accessToken và không phải trang login, điều hướng đến trang login
    if (!accessToken && currentPath !== loginPath) {
      window.location.assign(loginPath);
    }
    // Nếu có accessToken và đang ở trang login, xóa token và điều hướng về trang chính
    else if (accessToken && currentPath === loginPath) {
      localStorage.removeItem("accessToken");  // Xóa token
      window.location.assign(`/${basePath}/`);  // Điều hướng về trang chính
    }
  };
  
  document.addEventListener("DOMContentLoaded", router);
  