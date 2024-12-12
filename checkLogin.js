const router = () => {
    const accessToken = localStorage.getItem("accessToken");
    const currentPath = window.location.pathname;
    
    const basePath = currentPath.startsWith('/Frontend') ? 'Frontend' : '';

    const loginPath = basePath ? `/${basePath}/login/index.html` : '/login/index.html';
    
    if (!accessToken && currentPath !== loginPath) {
        window.location.assign(loginPath);
    }
    else if (accessToken && currentPath === loginPath) {
        localStorage.removeItem("accessToken");
    }
};

document.addEventListener("DOMContentLoaded", router);
