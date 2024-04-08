window.onload = function() {
    document.getElementById('forgetDialog').open = true;
    const snackbar = document.querySelector(".example-snackbar");
    snackbar.textContent = "请检查邮箱验证码";
    snackbar.open = true;
}
document.addEventListener('DOMContentLoaded', function() {
    const forgetBtn = document.getElementById('forgetBtn');
    const forgetKeyInput = document.getElementById('forgetKey');
    const snackbar = document.querySelector(".example-snackbar");

    forgetBtn.addEventListener('click', function() {
        forgetBtn.loading = true;
        const data = {
            key: forgetKeyInput.value
        };

        fetch('https://api.minelive.top:28080/forget', {
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
                snackbar.textContent = data.msg;
                snackbar.open = true;
            }
            forgetBtn.loading = false;
        })
        .catch(error => {
            console.error('检测到错误', error);
            snackbar.textContent = '重置出错，请检查你的网络连接';
            snackbar.open = true;
            forgetBtn.loading = false;
        });
    }); 
});