import{i as u,S as d,$ as p,t as g,g as k,r as b}from"./index-DFaeQSUc.js";function h(e){return!!e&&(typeof e=="object"||typeof e=="function")&&typeof e.then=="function"}const o={};function C(e,n){if(u(o[e])&&(o[e]=[]),u(n))return o[e];o[e].push(n)}function m(e){if(u(o[e])||!o[e].length)return;o[e].shift()()}const a="mdui.functions.snackbar.";let i;const T=e=>{const n=new d,r=p(n);return Object.entries(e).forEach(([t,s])=>{if(t==="message")n.innerHTML=s;else if(["onClick","onActionClick","onOpen","onOpened","onClose","onClosed"].includes(t)){const f=g(t.slice(2));r.on(f,l=>{if(l.target===n)if(t==="onActionClick"){const c=(e.onActionClick??k).call(n,n);h(c)?(n.actionLoading=!0,c.then(()=>{n.open=!1}).finally(()=>{n.actionLoading=!1})):c!==!1&&(n.open=!1)}else s.call(n,n)})}else n[t]=s}),r.appendTo("body").on("closed",t=>{t.target===n&&(r.remove(),e.queue&&(i=void 0,m(a+e.queue)))}),e.queue?i?C(a+e.queue,()=>{n.open=!0,i=n}):(setTimeout(()=>{n.open=!0}),i=n):setTimeout(()=>{n.open=!0}),n},S="https://api.minelive.top";function A(){const e=localStorage.getItem("userToken");if(!e){b.push("/?login=1");return}return e}export{S as a,T as s,A as t};
