import{A as e,h as n,_ as t,y as o}from"./hooks.module.vf81mID6.js";import{l as r}from"./preact.module.BP4etL1N.js";function i(e){var n,t,o="";if("string"==typeof e||"number"==typeof e)o+=e;else if("object"==typeof e)if(Array.isArray(e)){var r=e.length;for(n=0;n<r;n++)e[n]&&(t=i(e[n]))&&(o&&(o+=" "),o+=t)}else for(t in e)e[t]&&(o&&(o+=" "),o+=t);return o}function l(){for(var e,n,t=0,o="",r=arguments.length;t<r;t++)(e=arguments[t])&&(n=i(e))&&(o&&(o+=" "),o+=n);return o}var s=0;function c(e,n,t,o,i,l){n||(n={});var c,f,a=n;if("ref"in a)for(f in a={},n)"ref"==f?c=n[f]:a[f]=n[f];var u={type:e,props:a,key:t,ref:c,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,constructor:void 0,__v:--s,__i:-1,__u:0,__source:i,__self:l};if("function"==typeof e&&(c=e.defaultProps))for(f in c)void 0===a[f]&&(a[f]=c[f]);return r.vnode&&r.vnode(u),u}function f(r){const i=e(null),s=e(null),[f]=n((()=>[])),[a,u]=n(-1),[d,p]=n(!1),[m,v]=n(!1);let[h,y]=n(!0);function _(e){const n=a;u(e),e!==n&&-1!==n&&(f[n].style.display="none"),f[e].style.removeProperty("display")}return(d||m)&&(h=!0),t((()=>{const e=s.current;e.style.removeProperty("display");const n=[];let t=e.firstElementChild.firstElementChild;for(;t;){if(t instanceof HTMLElement&&t.matches(".expressive-code")){const e=[];let o=t.previousElementSibling;for(;o&&!o.matches(".expressive-code");)o instanceof HTMLElement&&e.unshift(o),o=o.previousElementSibling;let r=t;n.push((()=>{if(e.length>0){const n=document.createElement("div");e.forEach((e=>{n.appendChild(e)})),r.replaceWith(n),n.append(r),r=n}f.push(r),r.style.visibility="hidden",f.length>1&&(r.style.position="absolute"),r.addEventListener("mouseenter",(()=>{v(!0)})),r.addEventListener("mouseleave",(()=>{v(!1)})),r.addEventListener("click",(()=>{y((e=>!e))}))}))}t=t.nextElementSibling}for(const o of n)o();console.log({names:r.names,codeBlocks:f}),r.names.length!==f.length&&console.error(new Error("Number of names and code blocks must match")),requestAnimationFrame((function e(){let n=1/0,t=f[0];for(const o of f){const r=o.offsetHeight;if(0===r)return requestAnimationFrame(e);r<n&&(n=r,t=o)}f.forEach((e=>{e.style.maxHeight=`${n}px`,e.style.overflowY=e!==t?"scroll":"hidden",e.style.display="none",e.style.removeProperty("position"),e.style.removeProperty("visibility")})),_(0),y(!1)}))}),[]),o((()=>{if(!h){const e=setTimeout((()=>{_((a+1)%r.names.length)}),5e3);return()=>clearTimeout(e)}}),[a,h]),o((()=>{const e=new IntersectionObserver((([e])=>{p(!e.isIntersecting)}),{rootMargin:"-50% 0px -37% 0px"});return e.observe(i.current),()=>e.disconnect()}),[]),c("div",{ref:i,children:[c("div",{class:"not-content flex flex-row items-center mt-3",onMouseEnter:()=>v(!0),onMouseLeave:()=>v(!1),children:r.names.map(((e,n)=>c("div",{role:"button",class:"relative cursor-pointer px-4 py-0.5 rounded-full",onMouseEnter:()=>_(n),onClick:()=>_(n),children:[c("span",{class:"block text-pink100 font-600 text-0.9rem",children:e}),c("div",{class:"absolute left-0 bottom--1 w-full px-3",children:c("div",{class:l(["h-2.6px w-full rounded-full transition-650",a===n?m?"bg-#fffa85":"bg-$sl-color-accent":"bg-#8a6e6f opacity-50"])})})]})))}),c("div",{ref:s,style:{display:"none"},children:r.children})]})}export{f as TabbedCodeBlock};
