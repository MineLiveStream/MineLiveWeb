window.onload = function() {
    document.getElementById('regDialog').open = true;
    const snackbar = document.querySelector(".example-snackbar");
    snackbar.textContent = "请检查邮箱验证码";
    snackbar.open = true;
}

document.addEventListener('DOMContentLoaded', function() {
    const regBtn = document.getElementById('regBtn');
    const regKeyInput = document.getElementById('regKey');
    const snackbar = document.querySelector(".example-snackbar");

    regBtn.addEventListener('click', function() {
        regBtn.loading = true;
        const data = {
            key: regKeyInput.value
        };

        fetch('https://stmcicp.ranmc.cc:24021/register', {
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
                    snackbar.textContent = data.msg;
                    snackbar.open = true;
                }
                regBtn.loading = false;
            })
            .catch(error => {
                console.error('检测到错误', error);
                snackbar.textContent = '注册出错，请检查你的网络连接';
                snackbar.open = true;
                regBtn.loading = false;
            });
    });
});