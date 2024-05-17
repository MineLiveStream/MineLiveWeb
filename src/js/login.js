if (window.location.hash === "#login") {
    const loginDialog = document.getElementById('loginDialog');
    loginDialog.open = true;
}

function notice(context) {
    if (isMobile()) {
        alert(context);
    } else mdui.snackbar({message: context});
}

document.addEventListener('DOMContentLoaded', function() {
    const startBtn = document.getElementById('startBtn');
    const loginText = document.getElementById('loginText');
    const regText = document.getElementById('regText');
    const forgetText = document.getElementById('forgetText');
    const loginBtn = document.getElementById('loginBtn');
    const sendRegBtn = document.getElementById('sendRegBtn');
    const regBtn = document.getElementById('regBtn');
    const loginEmailInput = document.getElementById('loginEmail');
    const loginPwdInput = document.getElementById('loginPwd');
    const regEmailInput = document.getElementById('regEmail');
    const regPwdInput = document.getElementById('regPwd');
    const regCodeInput = document.getElementById('regCode');
    const regNameInput = document.getElementById('regName');
    const regDialog = document.getElementById('regDialog');
    const loginDialog = document.getElementById('loginDialog');
    const backLoginText = document.getElementById('backLoginText');
    const forgetDialog = document.getElementById('forgetDialog');
    const forgetBtn = document.getElementById('forgetBtn');
    const sendForgetBtn = document.getElementById('sendForgetBtn');
    const forgetEmailInput = document.getElementById('forgetEmail');
    const forgetPwdInput = document.getElementById('forgetPwd');
    const forgetKeyInput = document.getElementById('forgetCode');

    forgetPwdInput.addEventListener('keydown', function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            sendForgetBtn.click();
        }
    });

    forgetKeyInput.addEventListener('keydown', function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            forgetBtn.click();
        }
    });

    loginPwdInput.addEventListener('keydown', function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            loginBtn.click();
        }
    });

    regPwdInput.addEventListener('keydown', function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                sendRegBtn.click();
            }
        });

    regCodeInput.addEventListener('keydown', function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            regBtn.click();
        }
    });

    regBtn.addEventListener('click', function() {
        if (!regCodeInput.value) {
            notice("验证码不可为空");
            return;
        }
        regBtn.loading = true;
        const data = {
            key: regCodeInput.value
        };

        fetch(api + '/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (!response.ok) {
                    regBtn.loading = false;
                    throw new Error('错误响应码');
                }
                return response.json();
            })
            .then(data => {
                if (data.code === 200) {
                    localStorage.setItem('userToken', data.token);
                    window.location.href = '../stream';
                } else {
                    notice(data.msg);
                }
                regBtn.loading = false;
            })
            .catch(error => {
                console.error('检测到错误', error);
                notice("注册出错，请检查你的网络连接");
                regBtn.loading = false;
            });
    });

    startBtn.addEventListener('click', function() {
        loginDialog.open = true;
    });
    backLoginText.addEventListener('click', function() {
        loginDialog.open = true;
        forgetDialog.open = false;
    });
    forgetText.addEventListener('click', function() {
        forgetDialog.open = true;
        loginDialog.open = false;
    });
    loginText.addEventListener('click', function() {
        loginDialog.open = true;
        regDialog.open = false;
    });
    regText.addEventListener('click', function() {
        loginDialog.open = false;
        regDialog.open = true;
    });
    loginBtn.addEventListener('click', function() {
        loginBtn.loading = true;
        const email = loginEmailInput.value;
        if (!loginPwdInput.value) {
            notice("密码不可为空");
            loginBtn.loading = false;
            return;
        }
        if (loginPwdInput.value.length < 6) {
            notice("密码长度必须大于6位");
            loginBtn.loading = false;
            return;
        }
        const pwd = sha1(loginPwdInput.value);
        const data = {
            email: email,
            pwd: pwd
        };
        fetch(api + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (!response.ok) {
                    loginBtn.loading = false;
                    throw new Error('错误响应码');
                }
                return response.json();
            })
            .then(data => {
                if (data.code === 200) {
                    localStorage.setItem('userToken', data.token);
                    localStorage.setItem('userAdmin', data.admin);
                    window.location.href = '../stream';
                } else {
                    notice(data.msg);
                    loginBtn.loading = false;
                }
            })
            .catch(error => {
                console.error('检测到错误', error);
                notice("登录出错，请检查你的网络连接");
                loginBtn.loading = false;
            });
    });
    let forgetLoading = false;
    sendForgetBtn.addEventListener('click', function() {
        if (forgetLoading) return;
        forgetLoading = true;
        const email = forgetEmailInput.value;
        if (!forgetPwdInput.value) {
            notice("密码不可为空");
            sendForgetBtn.loading = false;
            forgetLoading = false;
            return;
        }
        if (forgetPwdInput.value.length < 6) {
            notice("密码长度必须大于6位");
            sendForgetBtn.loading = false;
            forgetLoading = false;
            return;
        }
        const pwd = sha1(forgetPwdInput.value);

        const data = {
            email: email,
	        pwd: pwd
        };

        fetch(api + '/pre-forget', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                forgetLoading = false;
                throw new Error('错误响应码');
            }
            return response.json();
        })
        .then(data => {
            if (data.code === 200) {
                sendForgetBtn.disabled = true;
                sendForgetBtn.textContent = "已发送";
                notice("请检查邮箱验证码");
            } else {
                notice(data.msg);
            }
            sendForgetBtn.loading = false;
            forgetLoading = false;
        })
        .catch(error => {
            console.error('检测到错误', error);
            notice("登录出错，请检查你的网络连接");
            forgetLoading = false;
        });
    });
    forgetBtn.addEventListener('click', function() {
        if (!forgetKeyInput.value) {
            notice("验证码不可为空");
            return;
        }
        forgetBtn.loading = true;
        const data = {
            key: forgetKeyInput.value
        };

        fetch(api + '/forget', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (!response.ok) {
                    forgetBtn.loading = false;
                    throw new Error('错误响应码');
                }
                return response.json();
            })
            .then(data => {
                if (data.code === 200) {
                    localStorage.setItem('userToken', data.token);
                    window.location.href = '../stream';
                } else {
                    notice(data.msg);
                }
                forgetBtn.loading = false;
            })
            .catch(error => {
                console.error('检测到错误', error);
                notice("重置出错，请检查你的网络连接");
                forgetBtn.loading = false;
            });
    });
    sendRegBtn.addEventListener('click', function() {
        sendRegBtn.loading = true;
        const email = regEmailInput.value;
        if (!regPwdInput.value) {
            notice("密码不可为空");
            sendRegBtn.loading = false;
            return;
        }
        if (regPwdInput.value.length < 6) {
            notice("密码长度必须大于6位");
            sendRegBtn.loading = false;
            return;
        }
        const pwd = sha1(regPwdInput.value);
        const name = regNameInput.value;

        const data = {
            email: email,
            name: name,
            pwd: pwd
        };

        fetch(api + '/pre-register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                sendRegBtn.loading = false;
                throw new Error('错误响应码');
            }
            return response.json();
        })
        .then(data => {
            if (data.code === 200) {
                sendRegBtn.loading = false;
                sendRegBtn.disabled = true;
                sendRegBtn.textContent = "已发送";
                notice("请检查邮箱验证码");
            } else {
                notice(data.msg);
                sendRegBtn.loading = false;
            }
        })
        .catch(error => {
            console.error('检测到错误', error);
            notice("注册出错，请检查你的网络连接");
            sendRegBtn.loading = false;
        });
    }); 
    function sha1(input) {
        return CryptoJS.SHA1(input).toString();
    }
});