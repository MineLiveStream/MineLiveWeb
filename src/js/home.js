import { api } from './api';
import { snackbar } from 'mdui/functions/snackbar';
import CryptoJS from 'crypto-js';
import Typewriter from 'typewriter-effect/dist/core';
import router from "@/router";
import floating from "floating.js";

function isMobile() {
    const mobileUserAgentFragments = [
        'Android', 'webOS', 'iPhone', 'iPad', 'iPod', 'BlackBerry', 'IEMobile', 'Opera Mini'
    ];
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    for (let i = 0; i < mobileUserAgentFragments.length; i++) {
        if (userAgent.indexOf(mobileUserAgentFragments[i]) > -1) {
            return true;
        }
    }
    return false;
}

function notice(context) {
    if (isMobile()) {
        alert(context);
    } else snackbar({message: context});
}

export default function init() {
    if (window.location.hash.includes("login=1")) {
        const loginDialog = document.getElementById('loginDialog');
        loginDialog.open = true;
    }

    new Typewriter("#typewriter", {loop: true})
        .typeString('我的世界，')
        .typeString('宣传新服')
        .pauseFor(1000)
        .deleteChars(4)
        .pauseFor(500)
        .typeString('一键开播')
        .pauseFor(1000)
        .deleteChars(4)
        .pauseFor(500)
        .typeString('配置简单')
        .pauseFor(1000)
        .deleteChars(4)
        .pauseFor(500)
        .typeString('天天满人')
        .pauseFor(1000)
        .deleteChars(4)
        .start();

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
    const textSnackbar = document.getElementById("textSnackbar");
    let click = 0;
    document.getElementById('cardBtn')
        .addEventListener('click', function() {
            click++;
            if (click === 1) {
                textSnackbar.textContent = '点了一下，再点一下 <(￣︶￣)>';
            } else if (click === 2) {
                textSnackbar.textContent = '有种再点一下 o(｀ω´ )o';
            } else if (click === 100) {
                textSnackbar.textContent = '成就达成！太闲了(≧▽≦)';
                floating({
                    content: "😇",
                    number: 2,
                    duration: 12
                });
                floating({
                    content: "🎈",
                    number: 7,
                    duration: 20
                });
                floating({
                    content: "🥰",
                    number: 6,
                    duration: 14
                });
                floating({
                    content: "😋",
                    number: 4,
                    duration: 16
                });
                floating({
                    content: "🍓",
                    number: 6,
                    duration: 8
                });
                floating({
                    content: "🍉",
                    number: 3,
                    duration: 10
                });
                floating({
                    content: "🎉",
                    number: 5,
                    duration: 6
                });
                floating({
                    content: "🐤",
                    number: 2,
                    duration: 6
                });
                floating({
                    content: "🦐",
                    number: 1,
                    duration: 7
                });
                floating({});

            } else if (click < 60) {
                textSnackbar.textContent = '୧(๑•̀⌄•́๑)૭✧加油！(' + click + "/100)";
            } else if (click < 80) {
                textSnackbar.textContent = '୧(๑•̀⌄•́๑)૭✧快了！(' + click + "/100)";
            } else if (click < 100) {
                textSnackbar.textContent = '୧(๑•̀⌄•́๑)૭✧就差一点！(' + click + "/100)";
            } else if (click < 1000) {
                textSnackbar.textContent = '别点我惹，点上方开始使用按钮吧 (* ~︿~) ';
            } else {
                textSnackbar.textContent = '够了！一滴也没有啦(⁄ ⁄•⁄ω⁄•⁄ ⁄) ';
            }
            textSnackbar.open = true;
        })

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
            mode: 'no-cors',
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
                    router.push('/stream');
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
            mode: 'no-cors',
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
                    router.push('/stream');
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
            mode: 'no-cors',
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
            mode: 'no-cors',
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
                    router.push('/stream');
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
            mode: 'no-cors',
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
}