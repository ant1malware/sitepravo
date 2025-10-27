import{g as l,d as m,j as s}from"./index-BW22xFmf.js";import{u as x,L as u}from"./react-vendor-DTkXckhQ.js";import"./icons-uJbpPyzE.js";function b(){var n,a,t,o;const{id:r}=x(),e=r?l(r):null,c=((a=(n=e==null?void 0:e.changelog)==null?void 0:n[1])==null?void 0:a.summary)||"",d=((o=(t=e==null?void 0:e.changelog)==null?void 0:t[0])==null?void 0:o.summary)||"",i=m(c,d);return s.jsxs("div",{className:"mx-auto max-w-3xl px-4 py-6",children:[s.jsxs("div",{className:"mb-4 flex items-center justify-between",children:[s.jsx("h1",{className:"text-xl font-bold",children:"Сравнение версий"}),s.jsx(u,{to:"/whats-new",className:"btn",children:"Что нового"})]}),!e&&s.jsxs("div",{children:["Не найдено для ",r]}),e&&s.jsxs("div",{className:"card",children:[s.jsxs("div",{className:"mb-2 text-sm",children:[r," • ",e.version]}),s.jsx("pre",{className:"overflow-x-auto rounded-xl bg-zinc-100 p-3 text-sm text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100",dangerouslySetInnerHTML:{__html:i}})]}),s.jsx("style",{children:`
        ins{background:#DCFCE7; text-decoration:none;}
        del{background:#FEE2E2; text-decoration:line-through;}
        @media (prefers-color-scheme: dark){
          ins{background:rgba(34,197,94,0.25);} /* emerald-500 @ 25% */
          del{background:rgba(239,68,68,0.25);} /* red-500 @ 25% */
        }
      `})]})}export{b as default};
