window.onload = function() {
	var item = document.getElementsByClassName("item");
	var it = item[0].getElementsByTagName("div");
	
	var content = document.getElementsByClassName("content");
	var con = content[0].getElementsByTagName("div");
	
	for(let i=0;i<it.length;i++){
		it[i].onclick = function(){
			for(let j=0;j<it.length;j++){
				it[j].className = '';
				con[j].style.display = "none";
			}
			this.className = "active";
			it[i].index = i;
			con[i].style.display = "block";
		}
	}
}
document.addEventListener('DOMContentLoaded', function() {  
    const forgetText = document.getElementById('forgetText');  
    const loginBtn = document.getElementById('loginBtn');  
    const regBtn = document.getElementById('regBtn');  
    const loginEmailInput = document.getElementById('loginEmail');  
    const loginPwdInput = document.getElementById('loginPwd');  
    const regEmailInput = document.getElementById('regEmail');  
    const regPwdInput = document.getElementById('regPwd');  
    const regNameInput = document.getElementById('regName');  

    loginBtn.addEventListener('click', function() {  
	const email = loginEmailInput.value;  
	const pwd = sha1(loginPwdInput.value);  
	const data = {  
            email: email,  
            pwd: pwd  
        };  
  
        fetch('https://stmcicp.ranmc.cc:24021/login', {  
            method: 'POST',  
            headers: {  
                'Content-Type': 'application/json'  
            },  
            body: JSON.stringify(data)  
        })  
        .then(response => {  
            if (!response.ok) {  
                throw new Error('Network response was not ok');  
            }  
            return response.json();  
        })  
        .then(data => {  
            if (data.code === 200) {  
                localStorage.setItem('userToken', data.token);
                window.location.href = '../stream';  
            } else {  
                alert(data.msg);  
            }  
        })  
        .catch(error => {  
            console.error('There has been a problem with your fetch operation:', error);  
            alert('重置出错，请检查你的网络连接');  
        });  
    });
    forgetText.addEventListener('click', function() {  
        const email = loginEmailInput.value;  
        const pwd = sha1(loginPwdInput.value);  

        const data = {  
            email: email,
	    pwd: pwd  
        };  
  
        fetch('https://stmcicp.ranmc.cc:24021/pre-forget', {  
            method: 'POST',  
            headers: {  
                'Content-Type': 'application/json'  
            },  
            body: JSON.stringify(data)  
        })  
        .then(response => {  
            if (!response.ok) {  
                throw new Error('Network response was not ok');  
            }  
            return response.json();  
        })  
        .then(data => {  
            if (data.code === 200) {  
                alert('请检查邮箱验证码');
		      window.location.href = '../forget';  
            } else {  
                alert(data.msg);  
            }  
        })  
        .catch(error => {  
            console.error('There has been a problem with your fetch operation:', error);  
            alert('登录出错，请检查你的网络连接');  
        });  
    }); 
    regBtn.addEventListener('click', function() {  
        const email = regEmailInput.value;  
        const pwd = sha1(regPwdInput.value);  
        const name = regNameInput.value;  

        const data = {  
            email: email,  
            name: name,  
            pwd: pwd  
        };  
  
        fetch('https://stmcicp.ranmc.cc:24021/pre-register', {  
            method: 'POST',  
            headers: {  
                'Content-Type': 'application/json'  
            },  
            body: JSON.stringify(data)  
        })  
        .then(response => {  
            if (!response.ok) {  
                throw new Error('Network response was not ok');  
            }  
            return response.json();  
        })  
        .then(data => {  
            if (data.code === 200) {  
                    alert('请检查邮箱验证码'); 
                    window.location.href = '../register';  
            } else {  
                alert(data.msg);  
            }
        })  
        .catch(error => {  
            console.error('There has been a problem with your fetch operation:', error);  
            alert('注册出错，请检查你的网络连接');  
        });  
    }); 
    function sha1(input) {  
        return CryptoJS.SHA1(input).toString();
    }  
});