export default function checkAdmin(){
    if (localStorage.getItem('userAdmin')) {
        const adminBtn = document.createElement("mdui-navigation-rail-item");
        adminBtn.icon = "manage_accounts";
        adminBtn.href = "../admin";
        adminBtn.innerHTML = "管理";
        document.getElementById("rail").appendChild(adminBtn);
    }
}