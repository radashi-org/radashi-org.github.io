const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/signals.module.B8hOACSr.js","assets/preact.module.BP4etL1N.js","assets/hooks.module.vf81mID6.js"])))=>i.map(i=>d[i]);
import{_ as t}from"./preload-helper.B5A3MRH_.js";import{_ as e,B as a,D as n}from"./preact.module.BP4etL1N.js";const s=({value:t,name:a,hydrate:n=!0})=>{if(!t)return null;return e(n?"astro-slot":"astro-static-slot",{name:a,dangerouslySetInnerHTML:{__html:t}})};s.shouldComponentUpdate=()=>!1;var r=s;const o=new Map;var l=s=>async(l,i,{default:u,...c},{client:d})=>{if(!s.hasAttribute("ssr"))return;for(const[t,a]of Object.entries(c))i[t]=e(r,{value:a,name:t});if(s.dataset.preactSignals){const{signal:e}=await t((async()=>{const{signal:t}=await import("./signals.module.B8hOACSr.js");return{signal:t}}),__vite__mapDeps([0,1,2]));let a=JSON.parse(s.dataset.preactSignals);for(const[t,n]of Object.entries(a)){if(!o.has(n)){const a=e(i[t]);o.set(n,a)}i[t]=o.get(n)}}("only"!==d?n:a)(e(l,i,null!=u?e(r,{value:u}):u),s),s.addEventListener("astro:unmount",(()=>a(null,s)),{once:!0})};export{l as default};
