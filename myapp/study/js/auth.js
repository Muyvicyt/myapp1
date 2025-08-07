//认证模块
// 检查是否登录

// auth.js 完善版本
document.addEventListener('DOMContentLoaded', async function () {
    const token = localStorage.getItem('token');

    if (!token) //如果 不存在（!token），立即重定向到首页（index1.0.html）
    {
        window.location.href = 'index1.0.html';
        return;
    }

    // 验证token是否有效
    try {
        const response = await fetch('http://localhost:3000/api/protected', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            // 如果token无效，清除并重定向
            localStorage.removeItem('token');
            window.location.href = 'index1.0.html';
        }
    } catch (error) {
        console.error('验证token失败:', error);
        localStorage.removeItem('token');
        window.location.href = 'index1.0.html';
    }
});