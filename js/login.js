document.addEventListener('DOMContentLoaded', function() {
    const startBtn = document.getElementById('startBtn');
    const loginText = document.getElementById('loginText');
    const regText = document.getElementById('regText');
    const forgetText = document.getElementById('forgetText');
    const loginBtn = document.getElementById('loginBtn');
    const regBtn = document.getElementById('regBtn');
    const loginEmailInput = document.getElementById('loginEmail');
    const loginPwdInput = document.getElementById('loginPwd');
    const regEmailInput = document.getElementById('regEmail');
    const regPwdInput = document.getElementById('regPwd');
    const regNameInput = document.getElementById('regName');
    const regDialog = document.getElementById('regDialog');
    const loginDialog = document.getElementById('loginDialog');
    const snackbar = document.querySelector(".example-snackbar");
    startBtn.addEventListener('click', function() {
        loginDialog.open = true;
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
        const pwd = sha1(loginPwdInput.value);
        const data = {
            email: email,
            pwd: pwd
        };
        fetch('https://api.minelive.top:28080/login', {
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
                    window.location.href = '../stream';
                } else {
                    snackbar.textContent = data.msg;
                    snackbar.open = true;
                    loginBtn.loading = false;
                }
            })
            .catch(error => {
                console.error('检测到错误', error);
                snackbar.textContent = '登录出错，请检查你的网络连接';
                snackbar.open = true;
                loginBtn.loading = false;
            });
    });
    let forgetLoding = false;
    forgetText.addEventListener('click', function() {
        if (forgetLoding) return;
        forgetLoding = true;
        const email = loginEmailInput.value;
        const pwd = sha1(loginPwdInput.value);

        const data = {
            email: email,
	        pwd: pwd
        };

        fetch('https://api.minelive.top:28080/pre-forget', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                forgetLoding = false;
                throw new Error('错误响应码');
            }
            return response.json();
        })
        .then(data => {
            if (data.code === 200) {
                snackbar.open = true;
		        window.location.href = '../forget';
            } else {
                snackbar.textContent = data.msg;
                snackbar.open = true;
            }
            forgetLoding = false;
        })
        .catch(error => {
            console.error('检测到错误', error);
            snackbar.textContent = '登录出错，请检查你的网络连接';
            snackbar.open = true;
            forgetLoding = false;
        });
    }); 
    regBtn.addEventListener('click', function() {
        regBtn.loading = true;
        const email = regEmailInput.value;
        const pwd = sha1(regPwdInput.value);
        const name = regNameInput.value;

        const data = {
            email: email,
            name: name,
            pwd: pwd
        };

        fetch('https://api.minelive.top:28080/pre-register', {
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
                snackbar.open = true;
                window.location.href = '../register';
            } else {
                snackbar.textContent = data.msg;
                snackbar.open = true;
                regBtn.loading = false;
            }
        })
        .catch(error => {
            console.error('检测到错误', error);
            snackbar.textContent = '注册出错，请检查你的网络连接';
            snackbar.open = true;
            regBtn.loading = false;
        });
    }); 
    function sha1(input) {
        return CryptoJS.SHA1(input).toString();
    }
});