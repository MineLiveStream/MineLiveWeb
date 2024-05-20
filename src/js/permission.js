import router from "@/router";

export default function checkAdmin(){
    const userAdmin = localStorage.getItem('userAdmin');
    if (userAdmin && userAdmin === true) {
        const adminBtn = document.createElement("mdui-navigation-rail-item");
        adminBtn.icon = "manage_accounts";
        adminBtn.addEventListener('click', function() {
            router.push("/admin");
        });
        adminBtn.innerHTML = "管理";
        document.getElementById("rail").appendChild(adminBtn);
    }
}