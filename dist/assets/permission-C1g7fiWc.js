import{r as t}from"./index-DFaeQSUc.js";function a(){const e=localStorage.getItem("userAdmin");if(e&&e==="true"){const n=document.createElement("mdui-navigation-rail-item");n.icon="manage_accounts",n.addEventListener("click",function(){t.push("/admin")}),n.innerHTML="管理",document.getElementById("rail").appendChild(n)}}export{a as c};
