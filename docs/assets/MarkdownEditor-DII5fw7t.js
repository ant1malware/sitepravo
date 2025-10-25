import{j as e}from"./index-BT0Wx6_3.js";import{R as c}from"./react-vendor-DTkXckhQ.js";import{p as P,d as $}from"./purify.es-DnfDK_hS.js";import{ae as O,af as V,J as M,ag as g,ah as Q,Q as B,ai as F,aj as U,ak as W,al as q,ad as H}from"./icons-vKdVo13Z.js";function X({value:i,onChange:d,onSubmit:x,placeholder:w,disabled:h,submitLabel:C="Send",draftKey:a,projectTemplate:N}){const[f,j]=c.useState("write"),k=c.useRef(null),[b,p]=c.useState(null);c.useEffect(()=>{if(a)try{const t=localStorage.getItem(a)||"";t&&!i&&d(t)}catch{}},[a]),c.useEffect(()=>{if(a)try{localStorage.setItem(a,i||"")}catch{}},[i,a]),c.useEffect(()=>{if(!a)return;const t=o=>{(i||"").trim().length>0&&(o.preventDefault(),o.returnValue="")};return window.addEventListener("beforeunload",t),()=>window.removeEventListener("beforeunload",t)},[a,i]);function s(t,o=""){const n=k.current,r=i||"",l=n?n.selectionStart||0:r.length,u=n?n.selectionEnd||0:r.length,m=r.slice(l,u),y=t+m+o,_=r.slice(0,l)+y+r.slice(u);return d(_),requestAnimationFrame(()=>{try{n==null||n.focus(),n.selectionStart=n.selectionEnd=l+t.length+m.length}catch{}}),y}function I(t){var r;const o=(r=t.target.files)==null?void 0:r[0];if(!o)return;const n=new FileReader;n.onload=()=>{const u=`

![image](${String(n.result||"")})

`;s(u,""),p(u)},n.readAsDataURL(o)}function v(){const t=prompt("Video URL (YouTube/Vimeo/direct)");if(t){if(/youtu\.be\/.+|youtube\.com\/watch\?v=/.test(t)){const o=t.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{6,})/),n=o==null?void 0:o[1];if(n){s(`

<iframe width="560" height="315" src="https://www.youtube.com/embed/${n}" frameborder="0" allowfullscreen></iframe>

`);return}}s(`

${t}

`)}}function L(){s(`

> [poll]
> Question?
> - Option A
> - Option B
> - Option C

`)}function z(){s(`

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

`)}function E(t){(t.metaKey||t.ctrlKey)&&(t.key.toLowerCase()==="b"?(t.preventDefault(),s("**","**")):t.key.toLowerCase()==="i"?(t.preventDefault(),s("_","_")):t.key.toLowerCase()==="k"?(t.preventDefault(),s("[text](",")")):t.key==="`"&&(t.preventDefault(),s("`","`")))}function R(t){t.preventDefault()}function S(t){var l;t.preventDefault();const o=(l=t.dataTransfer)==null?void 0:l.files;if(!o||o.length===0)return;const n=o[0];if(!n||!/^image\//.test(n.type))return;const r=new FileReader;r.onload=()=>{const m=`

![image](${String(r.result||"")})

`;s(m,""),p(m)},r.readAsDataURL(n)}function A(){if(!b)return;const t=i.indexOf(b);t>=0&&d(i.slice(0,t)+i.slice(t+b.length)),p(null)}const T=c.useMemo(()=>{try{return P.sanitize($.parse(i||""))}catch{return""}},[i]);return e.jsxs("div",{className:"w-full",onDragOver:R,onDrop:S,children:[e.jsxs("div",{className:"mb-2 flex flex-wrap items-center gap-2",children:[e.jsx("button",{type:"button",className:"btn",onClick:()=>s("**","**"),title:"Bold",children:e.jsx(O,{size:14})}),e.jsx("button",{type:"button",className:"btn",onClick:()=>s("_","_"),title:"Italic",children:e.jsx(V,{size:14})}),e.jsx("button",{type:"button",className:"btn",onClick:()=>s("[text](",")"),title:"Link",children:e.jsx(M,{size:14})}),e.jsx("button",{type:"button",className:"btn",onClick:()=>s("`","`"),title:"Inline code",children:e.jsx(g,{size:14})}),e.jsxs("button",{type:"button",className:"btn",onClick:()=>s("\n\n````\n","\n````\n"),title:"Code block",children:[e.jsx(g,{size:14})," ",e.jsx("span",{className:"ml-1",children:"{}"})]}),e.jsx("button",{type:"button",className:"btn",onClick:()=>s(`

- `),title:"List",children:e.jsx(Q,{size:14})}),e.jsx("button",{type:"button",className:"btn",onClick:()=>s(`

> `),title:"Quote",children:e.jsx(B,{size:14})}),e.jsxs("label",{className:"btn",title:"Insert image",children:[e.jsx(F,{size:14}),e.jsx("input",{type:"file",accept:"image/*",hidden:!0,onChange:I})]}),e.jsx("button",{type:"button",className:"btn",onClick:v,title:"Insert video",children:e.jsx(U,{size:14})}),e.jsx("button",{type:"button",className:"btn",onClick:L,title:"Insert poll",children:"Poll"}),e.jsx("button",{type:"button",className:"btn",onClick:z,title:"Task list",children:e.jsx(W,{size:14})}),N&&e.jsx("button",{type:"button",className:"btn",onClick:D,title:"Insert project template",children:"Insert Project Template"}),b&&e.jsxs("button",{type:"button",className:"btn",onClick:A,title:"Удалить вложение",children:[e.jsx(q,{size:14})," Clear"]}),e.jsxs("div",{className:"ml-auto flex items-center gap-1",children:[e.jsx("button",{type:"button",className:`tab ${f==="write"?"tab-active":""}`,onClick:()=>j("write"),children:"Write"}),e.jsxs("button",{type:"button",className:`tab ${f==="preview"?"tab-active":""}`,onClick:()=>j("preview"),children:[e.jsx(H,{size:14})," Preview"]})]})]}),f==="write"?e.jsx("textarea",{ref:k,className:"input min-h-[120px]",placeholder:w||"Write in Markdown...",value:i,onChange:t=>d(t.target.value),disabled:h,onKeyDown:E}):e.jsx("div",{className:"prose prose-invert max-w-none rounded-lg border p-3",style:{borderColor:"var(--border)",background:"var(--surface-2)"},dangerouslySetInnerHTML:{__html:T}}),x&&e.jsx("div",{className:"mt-2 flex justify-end",children:e.jsx("button",{type:"button",className:"btn btn-primary",onClick:()=>{const t=i.trim();if(t&&(x(t),a))try{localStorage.removeItem(a)}catch{}},disabled:h,children:C})})]})}export{X as M};
