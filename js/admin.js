function checkAdmin(){
    const admin = localStorage.getItem('userAdmin');
    const groupBtn = document.getElementById("groupBtn");
    if (admin && groupBtn) {
        const adminBtn = document.createElement("mdui-navigation-bar-item");
        adminBtn.icon = "manage_accounts";
        adminBtn.href = "../admin";
        adminBtn.innerHTML = "管理";
        groupBtn.parentNode.appendChild(adminBtn);
        groupBtn.parentNode.removeChild(groupBtn);
    }
}