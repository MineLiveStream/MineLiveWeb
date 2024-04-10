const api = "https://api.minelive.top:28080";
//"http://127.0.0.1:8080";
//"https://api.minelive.top:28080";

function token() {
	const token = localStorage.getItem('userToken');
    if (!token) {
        window.location.href = '../';
        return;
    }
    return token;
}