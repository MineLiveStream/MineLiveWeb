import router from "@/router";

export default function checkAdmin(){
    if (localStorage.getItem('userAdmin')) {
        const adminBtn = document.createElement("mdui-navigation-rail-item");
        adminBtn.icon = "manage_accounts";
        adminBtn.addEventListener('click', function() {
            router.push("/admin");
        });
        adminBtn.innerHTML = "管理";
        document.getElementById("rail").appendChild(adminBtn);
    }
}