import{a as w,t as L,s as d}from"./api-BD18ZUdi.js";import{r as D,_ as U,c as V,a as t,w as n,b as m,F as $,e as B,o as F,f as u}from"./index-DFaeQSUc.js";let I=1;const A=8;let S=1,P=0;function q(){const i=localStorage.getItem("userAdmin");i&&i==="true"||D.push("/stream"),k(),document.getElementById("materialBtn").addEventListener("click",function(){D.push("/material")}),document.getElementById("streamBtn").addEventListener("click",function(){D.push("/stream")});const e=document.getElementById("changeDialog");document.getElementById("search").addEventListener("change",function(){I=1,k()}),document.getElementById("logoutBtn").addEventListener("click",function(){localStorage.removeItem("userToken"),localStorage.removeItem("userAdmin"),D.push("/")}),document.getElementById("changeConfirmBtn").addEventListener("click",function(){const p=document.getElementById("streamName").value,y=document.getElementById("streamUrl").value,l=document.getElementById("streamKey").value,f=document.getElementById("expiredTime").value,E=document.getElementById("selectMenu").value;let b;f&&(b=new Date(f).getTime()-new Date().getTime(),b<0&&(b=0));const r={id:P,name:p||void 0,url:y||void 0,key:l||void 0,expired:b,materialType:E||void 0};fetch(w+"/stream",{method:"PUT",headers:{Authorization:"Bearer "+L(),"Content-Type":"application/json"},body:JSON.stringify(r)}).then(s=>{if(!s.ok)throw new Error("错误响应码");return s.json()}).then(s=>{e.open=!1,s.code===200?(d({message:"更新成功"}),H().then(h=>{N(h)}).catch(h=>{console.error("处理响应时出错:",h)})):d({message:s.msg})}).catch(s=>{console.error("检测到错误",s),d({message:"操作出错，请重试！"})})}),document.getElementById("changeCancelBtn").addEventListener("click",function(){e.open=!1}),document.getElementById("refreshBtn").addEventListener("click",function(){k(),d({message:"刷新成功"})}),document.getElementById("lastPageBtn").addEventListener("click",function(){I>1?(I--,k()):d({message:"已经到尽头啦>.<"})}),document.getElementById("nextPageBtn").addEventListener("click",function(){S>I?(I++,k()):d({message:"已经到尽头啦>.<"})});const _=document.getElementById("clientDialog");document.getElementById("clientDialogCloseBtn").addEventListener("click",function(){_.open=!1});const T=document.getElementById("clientBtn");T.addEventListener("click",function(){T.loading=!0,fetch(w+"/admin/client",{method:"GET",headers:{Authorization:"Bearer "+L(),"Content-Type":"application/json"}}).then(p=>{if(!p.ok)throw new Error("错误响应码");return p.json()}).then(p=>{if(p.code===200){const y=document.getElementById("clientDiv");for(;y.firstChild;)y.removeChild(y.firstChild);let l=0,f=0;Object.keys(p.data).forEach(E=>{const b=p.data[E];l+=p.data[E].length,f++;const r=document.createElement("mdui-tooltip");r.content="点击给予更多接管";const s=document.createElement("mdui-chip");s.innerHTML="机器"+f+" 接管数量"+b.length,s.style="margin-bottom: 1px",s.addEventListener("click",()=>{_.open=!1;const h={id:E};fetch(w+"/admin/client",{method:"POST",headers:{Authorization:"Bearer "+L(),"Content-Type":"application/json"},body:JSON.stringify(h)}).then(v=>{if(!v.ok)throw new Error("错误响应码");return v.json()}).then(v=>{v.code===200?d({message:"已向该子端发出推流，请稍后"}):d({message:v.msg}),setTimeout(()=>{H().then(C=>{N(C)}).catch(C=>{console.error("处理响应时出错:",C)})},5e3)}).catch(v=>{console.error("检测到错误",v),d({message:"操作出错，请重试！"})})}),r.appendChild(s),y.appendChild(r),y.appendChild(document.createElement("br"))}),_.headline="接管列表("+l+")",_.open=!0,T.loading=!1}else d({message:p.msg})}).catch(p=>{console.error("检测到错误",p),d({message:"操作出错，请重试！"})})})}function O(i){return i.length>20?i.substring(0,20)+"...":i}function N(i){const e=document.getElementById("material-list-tbody"),_=document.getElementById("deleteDialog"),T=document.getElementById("dialogCancelBtn"),p=document.getElementById("dialogConfirmBtn"),y=document.getElementById("changeDialog");if(e.innerHTML="",i&&i.list){if(S=Math.ceil(i.total/A),document.getElementById("titleText").textContent="管理推流 ("+i.streaming+"/"+i.total+"直播中)",S===0&&(S=1),document.getElementById("pageText").textContent="第"+I+"页，共"+S+"页",i.list.length===0){e.innerHTML='<tr><td colspan="6" class="mdui-text-center">没有推流可展示</td></tr>';return}i.list.forEach(l=>{const f=document.createElement("tr");["name","streamUrl","streamKey","materialName","email"].forEach(g=>{const o=document.createElement("td");if(g==="streamUrl"||g==="streamKey"){const a=document.createElement("a"),c=document.createElement("mdui-tooltip");c.content="点击复制",o.addEventListener("click",()=>{navigator.clipboard.writeText(l[g]).then(()=>{d({message:"复制成功"})})}),a.innerHTML=O(l[g]),c.appendChild(a),o.appendChild(c)}else o.textContent=O(l[g]);if(g==="materialName"){const a=document.createElement("mdui-tooltip"),c=document.createElement("mdui-icon");l.materialType==="HD_VIDEO"?(a.content="该推流允许使用高清视频或图片素材",c.style="color: orange",c.name="hd"):l.materialType==="VIDEO"?(a.content="该推流允许使用视频或图片素材",c.style="color: orange",c.name="ondemand_video"):(a.content="该推流仅能使用图片素材",c.style="color: gray",c.name="photo"),a.appendChild(c),o.appendChild(a)}f.appendChild(o)});const E=document.createElement("td");l.expired<=0?E.textContent="已到期":l.expired<1e3*60?E.textContent="即将到期":l.expired<1e3*60*60?E.textContent=(l.expired/(1e3*60)).toFixed(0)+"分钟":E.textContent=(l.expired/(1e3*60*60)).toFixed(1)+"小时",f.appendChild(E);const b=document.createElement("td"),r=document.createElement("mdui-switch");r.className="div",r.checked=l.status!=="OFF",r.addEventListener("change",()=>{const g={id:l.id};fetch(w+"/switch-stream",{method:"POST",headers:{Authorization:"Bearer "+L(),"Content-Type":"application/json"},body:JSON.stringify(g)}).then(o=>{if(!o.ok)throw new Error("错误响应码");return o.json()}).then(o=>{if(o.code===200){const a=o.status==="ON";r.disabled=!0,d({message:"推流"+(a?"开启":"关闭")+"中，请稍等..."})}else r.disabled=!0,d({message:o.msg});setTimeout(()=>{H().then(a=>{N(a)}).catch(a=>{console.error("处理响应时出错:",a)})},5e3)}).catch(o=>{console.error("检测到错误",o),d({message:"操作出错，请重试！"})})}),b.appendChild(r),f.appendChild(b);const s=document.createElement("td"),h=document.createElement("mdui-chip");h.style="margin-right: 1px",h.innerHTML="更改",h.addEventListener("click",()=>{y.headline="更新推流",y.description="无变更内容可留空",y.open=!0,P=l.id}),s.appendChild(h);const v=document.createElement("mdui-chip");v.innerHTML="日志",v.style="margin-right: 1px",v.addEventListener("click",()=>{const g=document.getElementById("logDialog"),o=document.getElementById("logDiv");o.innerHTML="";const a=new URLSearchParams({id:l.id}),c=w+`/stream-log?${a.toString()}`;fetch(c,{headers:{Authorization:`Bearer ${L()}`}}).then(x=>{if(!x.ok)throw d({message:"获取日志出错"}),new Error("错误响应码");return x.json()}).then(x=>{x.code===200?x.log.length===0?d({message:"该推流暂无日志，请先启动"}):(x.log.forEach(z=>{const M=document.createElement("p");M.innerHTML=z,o.appendChild(M)}),g.open=!0):d({message:"获取日志失败"+resJson.msg})}).catch(x=>{console.error("检测到错误",x)}),document.getElementById("logDialogCloseBtn").addEventListener("click",()=>g.open=!1)}),s.appendChild(v);const C=document.createElement("mdui-chip");C.innerHTML="删除",C.addEventListener("click",()=>{_.open=!0,_.description=l.name,T.addEventListener("click",()=>{_.open=!1}),p.addEventListener("click",()=>{_.open=!1;const g={id:l.id};fetch(w+"/stream",{method:"DELETE",headers:{Authorization:"Bearer "+L(),"Content-Type":"application/json"},body:JSON.stringify(g)}).then(o=>{if(!o.ok)throw new Error("错误响应码");return o.json()}).then(o=>{o.code===200?(d({message:"删除成功"}),f.parentNode.removeChild(f)):d({message:o.msg})}).catch(o=>{console.error("检测到错误",o)})})}),s.appendChild(C),f.appendChild(s),e.appendChild(f)})}else e.innerHTML='<tr><td colspan="6" class="mdui-text-center">获取推流失败，请刷新列表</td></tr>'}async function H(){try{const i=document.getElementById("search"),e=new URLSearchParams({page:I.toString(),size:A.toString()});i.value&&e.append("email",i.value);const _=w+`/admin/stream?${e.toString()}`;return await(await fetch(_,{headers:{Authorization:`Bearer ${L()}`}})).json()}catch(i){return console.error("请求推流时出错:",i),null}}function k(){H().then(i=>{if(i&&i.code===401){D.push("/?login=1");return}N(i)}).catch(i=>{console.error("处理响应时出错:",i)})}const J={mounted(){q()}};function K(i,e,_,T,p,y){const l=B("mdui-top-app-bar-title"),f=B("mdui-button-icon"),E=B("mdui-tooltip"),b=B("mdui-top-app-bar"),r=B("mdui-navigation-rail-item"),s=B("mdui-navigation-rail"),h=B("mdui-text-field"),v=B("mdui-table-fluid"),C=B("mdui-container"),g=B("mdui-segmented-button"),o=B("mdui-segmented-button-group"),a=B("mdui-button"),c=B("mdui-dialog"),j=B("mdui-menu-item"),x=B("mdui-select");return F(),V($,null,[t(b,{"scroll-behavior":"elevate",style:{"background-color":"rgba(var(--mdui-color-primary-container, 0.8))"}},{default:n(()=>[e[1]||(e[1]=m("div",{style:{"margin-left":"80px"}},null,-1)),e[2]||(e[2]=m("img",{src:"https://s21.ax1x.com/2024/04/07/pFq2AoR.png",alt:"alternative",style:{width:"2.5rem",height:"2.5rem"}},null,-1)),t(l,{id:"titleText"},{default:n(()=>e[0]||(e[0]=[u("管理推流")])),_:1}),t(E,{content:"接管列表"},{default:n(()=>[t(f,{variant:"filled",icon:"computer",id:"clientBtn"})]),_:1}),e[3]||(e[3]=m("div",{style:{"margin-left":"1px"}},null,-1)),t(E,{content:"刷新列表"},{default:n(()=>[t(f,{variant:"filled",icon:"refresh",id:"refreshBtn"})]),_:1})]),_:1}),t(s,{divider:"","padding-left":"",id:"rail",value:"admin"},{default:n(()=>[t(r,{icon:"videocam",id:"streamBtn",value:"stream"},{default:n(()=>e[4]||(e[4]=[u("推流")])),_:1}),t(r,{icon:"topic",id:"materialBtn",value:"material"},{default:n(()=>e[5]||(e[5]=[u("素材")])),_:1}),t(r,{icon:"help_center",href:"https://www.yuque.com/seeds-ejjgd/py7vim",target:"_blank",id:"groupBtn",value:"help"},{default:n(()=>e[6]||(e[6]=[u("教程")])),_:1}),t(r,{icon:"group",href:"https://qm.qq.com/q/hpYH0xIsuY",target:"_blank",id:"groupBtn",value:"group"},{default:n(()=>e[7]||(e[7]=[u("加群")])),_:1}),t(r,{slot:"bottom",icon:"logout",id:"logoutBtn",value:"logout"},{default:n(()=>e[8]||(e[8]=[u("登出")])),_:1}),t(r,{icon:"manage_accounts",value:"admin",id:"adminBtn"},{default:n(()=>e[9]||(e[9]=[u("管理")])),_:1})]),_:1}),m("form",null,[t(h,{clearable:"",label:"搜索",type:"search",icon:"search",id:"search","full-width":""})]),t(C,{class:"mdui-m-t-2"},{default:n(()=>[t(v,null,{default:n(()=>e[10]||(e[10]=[m("table",{class:"mdui-table mdui-table-striped"},[m("thead",null,[m("tr",null,[m("th",null,"名称"),m("th",null,"推流地址"),m("th",null,"推流密钥"),m("th",null,"素材名称"),m("th",null,"用户邮箱"),m("th",null,"剩余时长"),m("th",null,"当前状态"),m("th",null,"操作")])]),m("tbody",{id:"material-list-tbody"})],-1)])),_:1})]),_:1}),t(o,{"full-width":""},{default:n(()=>[t(g,{icon:"arrow_backward",id:"lastPageBtn"}),t(g,{id:"pageText"},{default:n(()=>e[11]||(e[11]=[u("第1页，共1页")])),_:1}),t(g,{"end-icon":"arrow_forward",id:"nextPageBtn"})]),_:1}),t(c,{id:"deleteDialog","close-on-overlay-click":"",headline:"确认删除推流?",class:"example-action"},{default:n(()=>[t(a,{slot:"action",variant:"text",id:"dialogCancelBtn"},{default:n(()=>e[12]||(e[12]=[u("取消")])),_:1}),t(a,{slot:"action",variant:"tonal",id:"dialogConfirmBtn"},{default:n(()=>e[13]||(e[13]=[u("删除")])),_:1})]),_:1}),t(c,{id:"clientDialog","close-on-overlay-click":"",headline:"接管列表",class:"example-action"},{default:n(()=>[e[15]||(e[15]=m("div",{id:"clientDiv"},null,-1)),t(a,{slot:"action",variant:"tonal",id:"clientDialogCloseBtn"},{default:n(()=>e[14]||(e[14]=[u("关闭")])),_:1})]),_:1}),t(c,{id:"changeDialog","close-on-overlay-click":"",headline:"更新推流",class:"example-action"},{default:n(()=>[t(h,{style:{"margin-bottom":"16px"},label:"名称",id:"streamName"}),t(h,{style:{"margin-bottom":"16px"},label:"推流地址",id:"streamUrl"}),t(h,{style:{"margin-bottom":"16px"},label:"推流密钥",id:"streamKey"}),t(h,{style:{"margin-bottom":"16px"},type:"date",label:"到期时间",id:"expiredTime"}),t(x,{label:"素材类型",id:"selectMenu"},{default:n(()=>[t(j,{value:"HD_VIDEO"},{default:n(()=>e[16]||(e[16]=[u("高清视频")])),_:1}),t(j,{value:"VIDEO"},{default:n(()=>e[17]||(e[17]=[u("视频")])),_:1}),t(j,{value:"PIC"},{default:n(()=>e[18]||(e[18]=[u("图片")])),_:1})]),_:1}),t(a,{slot:"action",variant:"text",id:"changeCancelBtn"},{default:n(()=>e[19]||(e[19]=[u("取消")])),_:1}),t(a,{slot:"action",variant:"tonal",id:"changeConfirmBtn"},{default:n(()=>e[20]||(e[20]=[u("确定")])),_:1})]),_:1}),t(c,{fullscreen:"",class:"example-fullscreen",id:"logDialog"},{default:n(()=>[e[22]||(e[22]=u(" 运行日志")),e[23]||(e[23]=m("div",{id:"logDiv"},null,-1)),e[24]||(e[24]=m("br",null,null,-1)),t(a,{id:"logDialogCloseBtn"},{default:n(()=>e[21]||(e[21]=[u("关闭")])),_:1})]),_:1})],64)}const G=U(J,[["render",K]]);export{G as default};
