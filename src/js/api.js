import router from "@/router";

export const api = "https://api.minelive.top:28080";
//"http://127.0.0.1:8080";
//"https://api.minelive.top:28080";

export default function token() {
	const token = localStorage.getItem('userToken');
    if (!token) {
        router.push('/?login=1');
        return;
    }
    return token;
}