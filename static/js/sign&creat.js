const container = document.querySelector(`#container`);
const signInButton = document.querySelector(`#signIn`);
const signUpButton = document.querySelector(`#signUp`);
const signupForm = document.querySelector('#signupForm');
const signinForm = document.querySelector('#signinForm');

// 切换登录/注册面板动画效果
signUpButton.addEventListener(`click`, () => container.classList.add(`right-panel-active`));
signInButton.addEventListener(`click`, () => container.classList.remove(`right-panel-active`));

// 注册表单验证和提交处理
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();  // 阻止表单默认提交行为

    // 获取表单输入值
    const username = signupForm.username.value.trim();
    const password = signupForm.password.value;
    const confirmPassword = signupForm.AgainPassword.value;

    // 基础验证
    if (!username || !password || !confirmPassword) {
        alert('请填写所有必填信息！');
        return;
    }

    // 检查两次密码是否一致
    if (password !== confirmPassword) {
        alert('两次输入的密码不一致，请重新输入');
        return;
    }

    // 检查密码长度
    if (password.length < 6) {
        alert('密码安全性不足，长度至少需要6位');
        return;
    }

    try {
        // 发送注册请求到后端API
        const response = await fetch('http://127.0.0.7:8080/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password                 //与你后端的对应！！！！！例如改为用户名：username:username
            })
        });

        // 解析响应数据
        const data = await response.json();

        if (response.ok) {
            alert('注册成功！请登录您的账号');
            // 注册成功后切换到登录面板
            container.classList.remove('right-panel-active');
            // 清空注册表单
            signupForm.reset();
        } else {
            // 显示后端返回的错误信息
            alert(data.message || '注册失败，请稍后重试');
        }
    } catch (error) {
        console.error('注册请求出错:', error);
        alert('网络错误，注册请求失败');
    }
});

// 登录表单提交处理
signinForm.addEventListener('submit', async (e) => {
    e.preventDefault();  // 阻止表单默认提交行为

    // 获取登录表单输入值
    const username = signinForm.username.value.trim();
    const password = signinForm.password.value;

    // 基础验证
    if (!username || !password) {
        alert('请输入用户名和密码');
        return;
    }

    try {
        // 发送登录请求到后端API
        const response = await fetch('http://127.0.0.7:8080/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password  //与你后端的对应！！！！！例如改为用户名：username:username
            })
        });

        // 解析响应数据
        const data = await response.json();

        if (response.ok) {
            alert('登录成功！正在跳转...');
            // 如果后端返回token，存储到本地
            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            // 跳转到首页
            window.location.href = 'index1.0.html';
        } else {
            // 显示登录错误信息
            alert(data.message || '用户名或密码错误');
        }
    } catch (error) {
        console.error('登录请求出错:', error);
        alert('网络错误，登录请求失败');
    }
});