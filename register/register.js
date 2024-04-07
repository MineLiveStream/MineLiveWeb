window.onload = function(){
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
			it[i].index=i;
			con[i].style.display = "block";
		}
	}
}
document.addEventListener('DOMContentLoaded', function() {  
    const regBtn = document.getElementById('regBtn');  
    const regKeyInput = document.getElementById('regKey');  


    regBtn.addEventListener('click', function() {  
        const regKey = regKeyInput.value;  
  
        const data = {  
            key: regKey
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
                throw new Error('Network response was not ok');  
            }  
            return response.json();  
        })  
        .then(data => {  
            if (data.code === 200) {  
                localStorage.setItem('userToken', data.token);  
            	alert('注册成功');  
                window.location.href = '../stream';  
            } else {  
                alert(data.msg);  
            }  
        })  
        .catch(error => {  
            console.error('There has been a problem with your fetch operation:', error);  
            alert('注册出错，请检查你的网络连接');  
        });  
    }); 
});