async function changePassword() {
    const username = document.getElementById('username').value;
    const currentPassword = document.getElementById('currentPass').value;
    const newPassword = document.getElementById('newPass').value;
    const confirmPassword = document.getElementById('veriedPass').value;

    if (newPassword !== confirmPassword) {
        alert('Mật khẩu mới và xác nhận mật khẩu không khớp.');
        return;
    }

    const passwordData = {
        username,
        currentPassword,
        newPassword
    };

    try {
        const response = await fetch('http://localhost:3000/api/bac-si/change-password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(passwordData)
        });
        const data = await response.json();

        if (data.success) {
            alert('Mật khẩu đã được cập nhật thành công.');
        } else {
            alert('Cập nhật mật khẩu thất bại. Vui lòng kiểm tra lại thông tin.');
        }
    } catch (error) {
        console.error('Error updating password:', error);
        alert('Đã xảy ra lỗi khi cập nhật mật khẩu.');
    }
}

//fetch api to get username
async function fetchUsername() {
    try {
        const response = await fetch('http://localhost:3000/api/bac-si/info');
        const data = await response.json();

        if (data.success) {
            document.getElementById('username').value = data.data[0].tentaikhoan;
        } else {
            console.error('Failed to fetch username');
        }
    } catch (error) {
        console.error('Error fetching username:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Fetch the username
    fetchUsername();
    document.getElementById('changeForm').addEventListener('submit', (event) => {
        event.preventDefault();
        changePassword();
    });
});