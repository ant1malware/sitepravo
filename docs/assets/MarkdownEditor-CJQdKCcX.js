import{j as e}from"./index-CzogGB_8.js";import{R as u}from"./react-vendor-DTkXckhQ.js";import{p as P,d as $}from"./purify.es-DnfDK_hS.js";import{an as O,ao as M,a3 as Q,ap as g,aq as V,Q as B,ar as F,as as U,at as q,au as W,am as H}from"./icons-GyIOUIPt.js";function X({value:r,onChange:b,onSubmit:x,placeholder:w,disabled:h,submitLabel:N="Send",draftKey:a,projectTemplate:C}){const[p,j]=u.useState("write"),k=u.useRef(null),[d,f]=u.useState(null);u.useEffect(()=>{if(a)try{const t=localStorage.getItem(a)||"";t&&!r&&b(t)}catch{}},[a]),u.useEffect(()=>{if(a)try{localStorage.setItem(a,r||"")}catch{}},[r,a]);function s(t,o=""){const n=k.current,i=r||"",c=n?n.selectionStart||0:i.length,l=n?n.selectionEnd||0:i.length,m=i.slice(c,l),y=t+m+o,_=i.slice(0,c)+y+i.slice(l);return b(_),requestAnimationFrame(()=>{try{n==null||n.focus(),n.selectionStart=n.selectionEnd=c+t.length+m.length}catch{}}),y}function I(t){var i;const o=(i=t.target.files)==null?void 0:i[0];if(!o)return;const n=new FileReader;n.onload=()=>{const l=`

![image](${String(n.result||"")})

`;s(l,""),f(l)},n.readAsDataURL(o)}function v(){const t=prompt("Video URL (YouTube/Vimeo/direct)");if(t){if(/youtu\.be\/.+|youtube\.com\/watch\?v=/.test(t)){const o=t.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{6,})/),n=o==null?void 0:o[1];if(n){s(`

<iframe width="560" height="315" src="https://www.youtube.com/embed/${n}" frameborder="0" allowfullscreen></iframe>

`);return}}s(`

${t}

`)}}function z(){s(`

> [poll]
> Question?
> - Option A
> - Option B
> - Option C

`)}function L(){s(`

- [ ] Задача 1
- [ ] Задача 2
- [x] Готово

`)}function D(){s(`

# Проект: Название

## Цели
- ...

## Технологии
- ...

## Прогресс
- [ ] Шаг 1
- [ ] Шаг 2

`)}function R(t){(t.metaKey||t.ctrlKey)&&(t.key.toLowerCase()==="b"?(t.preventDefault(),s("**","**")):t.key.toLowerCase()==="i"?(t.preventDefault(),s("_","_")):t.key.toLowerCase()==="k"?(t.preventDefault(),s("[text](",")")):t.key==="`"&&(t.preventDefault(),s("`","`")))}function S(t){t.preventDefault()}function A(t){var c;t.preventDefault();const o=(c=t.dataTransfer)==null?void 0:c.files;if(!o||o.length===0)return;const n=o[0];if(!n||!/^image\//.test(n.type))return;const i=new FileReader;i.onload=()=>{const m=`

![image](${String(i.result||"")})

`;s(m,""),f(m)},i.readAsDataURL(n)}function E(){if(!d)return;const t=r.indexOf(d);t>=0&&b(r.slice(0,t)+r.slice(t+d.length)),f(null)}const T=u.useMemo(()=>{try{return P.sanitize($.parse(r||""))}catch{return""}},[r]);return e.jsxs("div",{className:"w-full",onDragOver:S,onDrop:A,children:[e.jsxs("div",{className:"mb-2 flex flex-wrap items-center gap-2",children:[e.jsx("button",{type:"button",className:"btn",onClick:()=>s("**","**"),title:"Bold",children:e.jsx(O,{size:14})}),e.jsx("button",{type:"button",className:"btn",onClick:()=>s("_","_"),title:"Italic",children:e.jsx(M,{size:14})}),e.jsx("button",{type:"button",className:"btn",onClick:()=>s("[text](",")"),title:"Link",children:e.jsx(Q,{size:14})}),e.jsx("button",{type:"button",className:"btn",onClick:()=>s("`","`"),title:"Inline code",children:e.jsx(g,{size:14})}),e.jsxs("button",{type:"button",className:"btn",onClick:()=>s("\n\n````\n","\n````\n"),title:"Code block",children:[e.jsx(g,{size:14})," ",e.jsx("span",{className:"ml-1",children:"{}"})]}),e.jsx("button",{type:"button",className:"btn",onClick:()=>s(`

- `),title:"List",children:e.jsx(V,{size:14})}),e.jsx("button",{type:"button",className:"btn",onClick:()=>s(`

> `),title:"Quote",children:e.jsx(B,{size:14})}),e.jsxs("label",{className:"btn",title:"Insert image",children:[e.jsx(F,{size:14}),e.jsx("input",{type:"file",accept:"image/*",hidden:!0,onChange:I})]}),e.jsx("button",{type:"button",className:"btn",onClick:v,title:"Insert video",children:e.jsx(U,{size:14})}),e.jsx("button",{type:"button",className:"btn",onClick:z,title:"Insert poll",children:"Poll"}),e.jsx("button",{type:"button",className:"btn",onClick:L,title:"Task list",children:e.jsx(q,{size:14})}),C&&e.jsx("button",{type:"button",className:"btn",onClick:D,title:"Insert project template",children:"Insert Project Template"}),d&&e.jsxs("button",{type:"button",className:"btn",onClick:E,title:"Удалить вложение",children:[e.jsx(W,{size:14})," Clear"]}),e.jsxs("div",{className:"ml-auto flex items-center gap-1",children:[e.jsx("button",{type:"button",className:`tab ${p==="write"?"tab-active":""}`,onClick:()=>j("write"),children:"Write"}),e.jsxs("button",{type:"button",className:`tab ${p==="preview"?"tab-active":""}`,onClick:()=>j("preview"),children:[e.jsx(H,{size:14})," Preview"]})]})]}),p==="write"?e.jsx("textarea",{ref:k,className:"input min-h-[120px]",placeholder:w||"Write in Markdown...",value:r,onChange:t=>b(t.target.value),disabled:h,onKeyDown:R}):e.jsx("div",{className:"prose prose-invert max-w-none rounded-lg border p-3",style:{borderColor:"var(--border)",background:"var(--surface-2)"},dangerouslySetInnerHTML:{__html:T}}),x&&e.jsx("div",{className:"mt-2 flex justify-end",children:e.jsx("button",{type:"button",className:"btn btn-primary",onClick:()=>{const t=r.trim();if(t&&(x(t),a))try{localStorage.removeItem(a)}catch{}},disabled:h,children:N})})]})}export{X as M};
