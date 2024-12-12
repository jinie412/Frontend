const router = () => {
  const accessToken = localStorage.getItem("accessToken");
  const currentPath = window.location.pathname;

  if (!accessToken && currentPath !== "/login/index.html") {
    localStorage.removeItem("accessToken");
    window.location.assign("../login/index.html");
  } else if (accessToken && currentPath === "/login/index.html") {
    localStorage.removeItem("accessToken");
    window.location.assign("../login/index.html");
  }
};

document.addEventListener("DOMContentLoaded", router);