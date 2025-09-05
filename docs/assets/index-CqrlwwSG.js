function sf(e,t){for(var n=0;n<t.length;n++){const r=t[n];if(typeof r!="string"&&!Array.isArray(r)){for(const l in r)if(l!=="default"&&!(l in e)){const i=Object.getOwnPropertyDescriptor(r,l);i&&Object.defineProperty(e,l,i.get?i:{enumerable:!0,get:()=>r[l]})}}}return Object.freeze(Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}))}(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))r(l);new MutationObserver(l=>{for(const i of l)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function n(l){const i={};return l.integrity&&(i.integrity=l.integrity),l.referrerPolicy&&(i.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?i.credentials="include":l.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(l){if(l.ep)return;l.ep=!0;const i=n(l);fetch(l.href,i)}})();function af(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var vu={exports:{}},Pl={},yu={exports:{}},T={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var gr=Symbol.for("react.element"),uf=Symbol.for("react.portal"),cf=Symbol.for("react.fragment"),df=Symbol.for("react.strict_mode"),ff=Symbol.for("react.profiler"),pf=Symbol.for("react.provider"),mf=Symbol.for("react.context"),hf=Symbol.for("react.forward_ref"),gf=Symbol.for("react.suspense"),vf=Symbol.for("react.memo"),yf=Symbol.for("react.lazy"),Fs=Symbol.iterator;function xf(e){return e===null||typeof e!="object"?null:(e=Fs&&e[Fs]||e["@@iterator"],typeof e=="function"?e:null)}var xu={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},wu=Object.assign,ku={};function kn(e,t,n){this.props=e,this.context=t,this.refs=ku,this.updater=n||xu}kn.prototype.isReactComponent={};kn.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};kn.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function Su(){}Su.prototype=kn.prototype;function Io(e,t,n){this.props=e,this.context=t,this.refs=ku,this.updater=n||xu}var $o=Io.prototype=new Su;$o.constructor=Io;wu($o,kn.prototype);$o.isPureReactComponent=!0;var As=Array.isArray,ju=Object.prototype.hasOwnProperty,Ro={current:null},Nu={key:!0,ref:!0,__self:!0,__source:!0};function Eu(e,t,n){var r,l={},i=null,o=null;if(t!=null)for(r in t.ref!==void 0&&(o=t.ref),t.key!==void 0&&(i=""+t.key),t)ju.call(t,r)&&!Nu.hasOwnProperty(r)&&(l[r]=t[r]);var a=arguments.length-2;if(a===1)l.children=n;else if(1<a){for(var u=Array(a),d=0;d<a;d++)u[d]=arguments[d+2];l.children=u}if(e&&e.defaultProps)for(r in a=e.defaultProps,a)l[r]===void 0&&(l[r]=a[r]);return{$$typeof:gr,type:e,key:i,ref:o,props:l,_owner:Ro.current}}function wf(e,t){return{$$typeof:gr,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}function Oo(e){return typeof e=="object"&&e!==null&&e.$$typeof===gr}function kf(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(n){return t[n]})}var Us=/\/+/g;function Jl(e,t){return typeof e=="object"&&e!==null&&e.key!=null?kf(""+e.key):t.toString(36)}function br(e,t,n,r,l){var i=typeof e;(i==="undefined"||i==="boolean")&&(e=null);var o=!1;if(e===null)o=!0;else switch(i){case"string":case"number":o=!0;break;case"object":switch(e.$$typeof){case gr:case uf:o=!0}}if(o)return o=e,l=l(o),e=r===""?"."+Jl(o,0):r,As(l)?(n="",e!=null&&(n=e.replace(Us,"$&/")+"/"),br(l,t,n,"",function(d){return d})):l!=null&&(Oo(l)&&(l=wf(l,n+(!l.key||o&&o.key===l.key?"":(""+l.key).replace(Us,"$&/")+"/")+e)),t.push(l)),1;if(o=0,r=r===""?".":r+":",As(e))for(var a=0;a<e.length;a++){i=e[a];var u=r+Jl(i,a);o+=br(i,t,n,u,l)}else if(u=xf(e),typeof u=="function")for(e=u.call(e),a=0;!(i=e.next()).done;)i=i.value,u=r+Jl(i,a++),o+=br(i,t,n,u,l);else if(i==="object")throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return o}function Er(e,t,n){if(e==null)return e;var r=[],l=0;return br(e,r,"","",function(i){return t.call(n,i,l++)}),r}function Sf(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(n){(e._status===0||e._status===-1)&&(e._status=1,e._result=n)},function(n){(e._status===0||e._status===-1)&&(e._status=2,e._result=n)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var fe={current:null},Wr={transition:null},jf={ReactCurrentDispatcher:fe,ReactCurrentBatchConfig:Wr,ReactCurrentOwner:Ro};function zu(){throw Error("act(...) is not supported in production builds of React.")}T.Children={map:Er,forEach:function(e,t,n){Er(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return Er(e,function(){t++}),t},toArray:function(e){return Er(e,function(t){return t})||[]},only:function(e){if(!Oo(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};T.Component=kn;T.Fragment=cf;T.Profiler=ff;T.PureComponent=Io;T.StrictMode=df;T.Suspense=gf;T.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=jf;T.act=zu;T.cloneElement=function(e,t,n){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var r=wu({},e.props),l=e.key,i=e.ref,o=e._owner;if(t!=null){if(t.ref!==void 0&&(i=t.ref,o=Ro.current),t.key!==void 0&&(l=""+t.key),e.type&&e.type.defaultProps)var a=e.type.defaultProps;for(u in t)ju.call(t,u)&&!Nu.hasOwnProperty(u)&&(r[u]=t[u]===void 0&&a!==void 0?a[u]:t[u])}var u=arguments.length-2;if(u===1)r.children=n;else if(1<u){a=Array(u);for(var d=0;d<u;d++)a[d]=arguments[d+2];r.children=a}return{$$typeof:gr,type:e.type,key:l,ref:i,props:r,_owner:o}};T.createContext=function(e){return e={$$typeof:mf,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:pf,_context:e},e.Consumer=e};T.createElement=Eu;T.createFactory=function(e){var t=Eu.bind(null,e);return t.type=e,t};T.createRef=function(){return{current:null}};T.forwardRef=function(e){return{$$typeof:hf,render:e}};T.isValidElement=Oo;T.lazy=function(e){return{$$typeof:yf,_payload:{_status:-1,_result:e},_init:Sf}};T.memo=function(e,t){return{$$typeof:vf,type:e,compare:t===void 0?null:t}};T.startTransition=function(e){var t=Wr.transition;Wr.transition={};try{e()}finally{Wr.transition=t}};T.unstable_act=zu;T.useCallback=function(e,t){return fe.current.useCallback(e,t)};T.useContext=function(e){return fe.current.useContext(e)};T.useDebugValue=function(){};T.useDeferredValue=function(e){return fe.current.useDeferredValue(e)};T.useEffect=function(e,t){return fe.current.useEffect(e,t)};T.useId=function(){return fe.current.useId()};T.useImperativeHandle=function(e,t,n){return fe.current.useImperativeHandle(e,t,n)};T.useInsertionEffect=function(e,t){return fe.current.useInsertionEffect(e,t)};T.useLayoutEffect=function(e,t){return fe.current.useLayoutEffect(e,t)};T.useMemo=function(e,t){return fe.current.useMemo(e,t)};T.useReducer=function(e,t,n){return fe.current.useReducer(e,t,n)};T.useRef=function(e){return fe.current.useRef(e)};T.useState=function(e){return fe.current.useState(e)};T.useSyncExternalStore=function(e,t,n){return fe.current.useSyncExternalStore(e,t,n)};T.useTransition=function(){return fe.current.useTransition()};T.version="18.3.1";yu.exports=T;var k=yu.exports;const D=af(k),Nf=sf({__proto__:null,default:D},[k]);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ef=k,zf=Symbol.for("react.element"),Cf=Symbol.for("react.fragment"),_f=Object.prototype.hasOwnProperty,Pf=Ef.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Lf={key:!0,ref:!0,__self:!0,__source:!0};function Cu(e,t,n){var r,l={},i=null,o=null;n!==void 0&&(i=""+n),t.key!==void 0&&(i=""+t.key),t.ref!==void 0&&(o=t.ref);for(r in t)_f.call(t,r)&&!Lf.hasOwnProperty(r)&&(l[r]=t[r]);if(e&&e.defaultProps)for(r in t=e.defaultProps,t)l[r]===void 0&&(l[r]=t[r]);return{$$typeof:zf,type:e,key:i,ref:o,props:l,_owner:Pf.current}}Pl.Fragment=Cf;Pl.jsx=Cu;Pl.jsxs=Cu;vu.exports=Pl;var s=vu.exports,Li={},_u={exports:{}},je={},Pu={exports:{}},Lu={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(e){function t(z,L){var M=z.length;z.push(L);e:for(;0<M;){var K=M-1>>>1,ee=z[K];if(0<l(ee,L))z[K]=L,z[M]=ee,M=K;else break e}}function n(z){return z.length===0?null:z[0]}function r(z){if(z.length===0)return null;var L=z[0],M=z.pop();if(M!==L){z[0]=M;e:for(var K=0,ee=z.length,jr=ee>>>1;K<jr;){var zt=2*(K+1)-1,Zl=z[zt],Ct=zt+1,Nr=z[Ct];if(0>l(Zl,M))Ct<ee&&0>l(Nr,Zl)?(z[K]=Nr,z[Ct]=M,K=Ct):(z[K]=Zl,z[zt]=M,K=zt);else if(Ct<ee&&0>l(Nr,M))z[K]=Nr,z[Ct]=M,K=Ct;else break e}}return L}function l(z,L){var M=z.sortIndex-L.sortIndex;return M!==0?M:z.id-L.id}if(typeof performance=="object"&&typeof performance.now=="function"){var i=performance;e.unstable_now=function(){return i.now()}}else{var o=Date,a=o.now();e.unstable_now=function(){return o.now()-a}}var u=[],d=[],m=1,f=null,c=3,v=!1,x=!1,y=!1,S=typeof setTimeout=="function"?setTimeout:null,h=typeof clearTimeout=="function"?clearTimeout:null,p=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function g(z){for(var L=n(d);L!==null;){if(L.callback===null)r(d);else if(L.startTime<=z)r(d),L.sortIndex=L.expirationTime,t(u,L);else break;L=n(d)}}function w(z){if(y=!1,g(z),!x)if(n(u)!==null)x=!0,Yl(N);else{var L=n(d);L!==null&&Gl(w,L.startTime-z)}}function N(z,L){x=!1,y&&(y=!1,h(P),P=-1),v=!0;var M=c;try{for(g(L),f=n(u);f!==null&&(!(f.expirationTime>L)||z&&!Me());){var K=f.callback;if(typeof K=="function"){f.callback=null,c=f.priorityLevel;var ee=K(f.expirationTime<=L);L=e.unstable_now(),typeof ee=="function"?f.callback=ee:f===n(u)&&r(u),g(L)}else r(u);f=n(u)}if(f!==null)var jr=!0;else{var zt=n(d);zt!==null&&Gl(w,zt.startTime-L),jr=!1}return jr}finally{f=null,c=M,v=!1}}var C=!1,_=null,P=-1,Q=5,I=-1;function Me(){return!(e.unstable_now()-I<Q)}function zn(){if(_!==null){var z=e.unstable_now();I=z;var L=!0;try{L=_(!0,z)}finally{L?Cn():(C=!1,_=null)}}else C=!1}var Cn;if(typeof p=="function")Cn=function(){p(zn)};else if(typeof MessageChannel<"u"){var Ds=new MessageChannel,of=Ds.port2;Ds.port1.onmessage=zn,Cn=function(){of.postMessage(null)}}else Cn=function(){S(zn,0)};function Yl(z){_=z,C||(C=!0,Cn())}function Gl(z,L){P=S(function(){z(e.unstable_now())},L)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(z){z.callback=null},e.unstable_continueExecution=function(){x||v||(x=!0,Yl(N))},e.unstable_forceFrameRate=function(z){0>z||125<z?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):Q=0<z?Math.floor(1e3/z):5},e.unstable_getCurrentPriorityLevel=function(){return c},e.unstable_getFirstCallbackNode=function(){return n(u)},e.unstable_next=function(z){switch(c){case 1:case 2:case 3:var L=3;break;default:L=c}var M=c;c=L;try{return z()}finally{c=M}},e.unstable_pauseExecution=function(){},e.unstable_requestPaint=function(){},e.unstable_runWithPriority=function(z,L){switch(z){case 1:case 2:case 3:case 4:case 5:break;default:z=3}var M=c;c=z;try{return L()}finally{c=M}},e.unstable_scheduleCallback=function(z,L,M){var K=e.unstable_now();switch(typeof M=="object"&&M!==null?(M=M.delay,M=typeof M=="number"&&0<M?K+M:K):M=K,z){case 1:var ee=-1;break;case 2:ee=250;break;case 5:ee=1073741823;break;case 4:ee=1e4;break;default:ee=5e3}return ee=M+ee,z={id:m++,callback:L,priorityLevel:z,startTime:M,expirationTime:ee,sortIndex:-1},M>K?(z.sortIndex=M,t(d,z),n(u)===null&&z===n(d)&&(y?(h(P),P=-1):y=!0,Gl(w,M-K))):(z.sortIndex=ee,t(u,z),x||v||(x=!0,Yl(N))),z},e.unstable_shouldYield=Me,e.unstable_wrapCallback=function(z){var L=c;return function(){var M=c;c=L;try{return z.apply(this,arguments)}finally{c=M}}}})(Lu);Pu.exports=Lu;var Mf=Pu.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Tf=k,Se=Mf;function j(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var Mu=new Set,Zn={};function Bt(e,t){pn(e,t),pn(e+"Capture",t)}function pn(e,t){for(Zn[e]=t,e=0;e<t.length;e++)Mu.add(t[e])}var Ze=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Mi=Object.prototype.hasOwnProperty,If=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Bs={},Vs={};function $f(e){return Mi.call(Vs,e)?!0:Mi.call(Bs,e)?!1:If.test(e)?Vs[e]=!0:(Bs[e]=!0,!1)}function Rf(e,t,n,r){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return r?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function Of(e,t,n,r){if(t===null||typeof t>"u"||Rf(e,t,n,r))return!0;if(r)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function pe(e,t,n,r,l,i,o){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=r,this.attributeNamespace=l,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=i,this.removeEmptyString=o}var ie={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){ie[e]=new pe(e,0,!1,e,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];ie[t]=new pe(t,1,!1,e[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(e){ie[e]=new pe(e,2,!1,e.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){ie[e]=new pe(e,2,!1,e,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){ie[e]=new pe(e,3,!1,e.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(e){ie[e]=new pe(e,3,!0,e,null,!1,!1)});["capture","download"].forEach(function(e){ie[e]=new pe(e,4,!1,e,null,!1,!1)});["cols","rows","size","span"].forEach(function(e){ie[e]=new pe(e,6,!1,e,null,!1,!1)});["rowSpan","start"].forEach(function(e){ie[e]=new pe(e,5,!1,e.toLowerCase(),null,!1,!1)});var Do=/[\-:]([a-z])/g;function Fo(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(Do,Fo);ie[t]=new pe(t,1,!1,e,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(Do,Fo);ie[t]=new pe(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(Do,Fo);ie[t]=new pe(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(e){ie[e]=new pe(e,1,!1,e.toLowerCase(),null,!1,!1)});ie.xlinkHref=new pe("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(e){ie[e]=new pe(e,1,!1,e.toLowerCase(),null,!0,!0)});function Ao(e,t,n,r){var l=ie.hasOwnProperty(t)?ie[t]:null;(l!==null?l.type!==0:r||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(Of(t,n,l,r)&&(n=null),r||l===null?$f(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):l.mustUseProperty?e[l.propertyName]=n===null?l.type===3?!1:"":n:(t=l.attributeName,r=l.attributeNamespace,n===null?e.removeAttribute(t):(l=l.type,n=l===3||l===4&&n===!0?"":""+n,r?e.setAttributeNS(r,t,n):e.setAttribute(t,n))))}var tt=Tf.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,zr=Symbol.for("react.element"),Xt=Symbol.for("react.portal"),Yt=Symbol.for("react.fragment"),Uo=Symbol.for("react.strict_mode"),Ti=Symbol.for("react.profiler"),Tu=Symbol.for("react.provider"),Iu=Symbol.for("react.context"),Bo=Symbol.for("react.forward_ref"),Ii=Symbol.for("react.suspense"),$i=Symbol.for("react.suspense_list"),Vo=Symbol.for("react.memo"),rt=Symbol.for("react.lazy"),$u=Symbol.for("react.offscreen"),bs=Symbol.iterator;function _n(e){return e===null||typeof e!="object"?null:(e=bs&&e[bs]||e["@@iterator"],typeof e=="function"?e:null)}var W=Object.assign,ql;function Fn(e){if(ql===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);ql=t&&t[1]||""}return`
`+ql+e}var ei=!1;function ti(e,t){if(!e||ei)return"";ei=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(d){var r=d}Reflect.construct(e,[],t)}else{try{t.call()}catch(d){r=d}e.call(t.prototype)}else{try{throw Error()}catch(d){r=d}e()}}catch(d){if(d&&r&&typeof d.stack=="string"){for(var l=d.stack.split(`
`),i=r.stack.split(`
`),o=l.length-1,a=i.length-1;1<=o&&0<=a&&l[o]!==i[a];)a--;for(;1<=o&&0<=a;o--,a--)if(l[o]!==i[a]){if(o!==1||a!==1)do if(o--,a--,0>a||l[o]!==i[a]){var u=`
`+l[o].replace(" at new "," at ");return e.displayName&&u.includes("<anonymous>")&&(u=u.replace("<anonymous>",e.displayName)),u}while(1<=o&&0<=a);break}}}finally{ei=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?Fn(e):""}function Df(e){switch(e.tag){case 5:return Fn(e.type);case 16:return Fn("Lazy");case 13:return Fn("Suspense");case 19:return Fn("SuspenseList");case 0:case 2:case 15:return e=ti(e.type,!1),e;case 11:return e=ti(e.type.render,!1),e;case 1:return e=ti(e.type,!0),e;default:return""}}function Ri(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case Yt:return"Fragment";case Xt:return"Portal";case Ti:return"Profiler";case Uo:return"StrictMode";case Ii:return"Suspense";case $i:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case Iu:return(e.displayName||"Context")+".Consumer";case Tu:return(e._context.displayName||"Context")+".Provider";case Bo:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case Vo:return t=e.displayName||null,t!==null?t:Ri(e.type)||"Memo";case rt:t=e._payload,e=e._init;try{return Ri(e(t))}catch{}}return null}function Ff(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Ri(t);case 8:return t===Uo?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function wt(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function Ru(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function Af(e){var t=Ru(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),r=""+e[t];if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var l=n.get,i=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return l.call(this)},set:function(o){r=""+o,i.call(this,o)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(o){r=""+o},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Cr(e){e._valueTracker||(e._valueTracker=Af(e))}function Ou(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r="";return e&&(r=Ru(e)?e.checked?"true":"false":e.value),e=r,e!==n?(t.setValue(e),!0):!1}function tl(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function Oi(e,t){var n=t.checked;return W({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function Ws(e,t){var n=t.defaultValue==null?"":t.defaultValue,r=t.checked!=null?t.checked:t.defaultChecked;n=wt(t.value!=null?t.value:n),e._wrapperState={initialChecked:r,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function Du(e,t){t=t.checked,t!=null&&Ao(e,"checked",t,!1)}function Di(e,t){Du(e,t);var n=wt(t.value),r=t.type;if(n!=null)r==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(r==="submit"||r==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?Fi(e,t.type,n):t.hasOwnProperty("defaultValue")&&Fi(e,t.type,wt(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function Hs(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var r=t.type;if(!(r!=="submit"&&r!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function Fi(e,t,n){(t!=="number"||tl(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var An=Array.isArray;function sn(e,t,n,r){if(e=e.options,t){t={};for(var l=0;l<n.length;l++)t["$"+n[l]]=!0;for(n=0;n<e.length;n++)l=t.hasOwnProperty("$"+e[n].value),e[n].selected!==l&&(e[n].selected=l),l&&r&&(e[n].defaultSelected=!0)}else{for(n=""+wt(n),t=null,l=0;l<e.length;l++){if(e[l].value===n){e[l].selected=!0,r&&(e[l].defaultSelected=!0);return}t!==null||e[l].disabled||(t=e[l])}t!==null&&(t.selected=!0)}}function Ai(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(j(91));return W({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function Qs(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(j(92));if(An(n)){if(1<n.length)throw Error(j(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:wt(n)}}function Fu(e,t){var n=wt(t.value),r=wt(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),r!=null&&(e.defaultValue=""+r)}function Ks(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function Au(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Ui(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?Au(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var _r,Uu=function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,n,r,l){MSApp.execUnsafeLocalFunction(function(){return e(t,n,r,l)})}:e}(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(_r=_r||document.createElement("div"),_r.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=_r.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function Jn(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var Vn={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Uf=["Webkit","ms","Moz","O"];Object.keys(Vn).forEach(function(e){Uf.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),Vn[t]=Vn[e]})});function Bu(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||Vn.hasOwnProperty(e)&&Vn[e]?(""+t).trim():t+"px"}function Vu(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var r=n.indexOf("--")===0,l=Bu(n,t[n],r);n==="float"&&(n="cssFloat"),r?e.setProperty(n,l):e[n]=l}}var Bf=W({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Bi(e,t){if(t){if(Bf[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(j(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(j(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(j(61))}if(t.style!=null&&typeof t.style!="object")throw Error(j(62))}}function Vi(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var bi=null;function bo(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Wi=null,an=null,un=null;function Xs(e){if(e=xr(e)){if(typeof Wi!="function")throw Error(j(280));var t=e.stateNode;t&&(t=$l(t),Wi(e.stateNode,e.type,t))}}function bu(e){an?un?un.push(e):un=[e]:an=e}function Wu(){if(an){var e=an,t=un;if(un=an=null,Xs(e),t)for(e=0;e<t.length;e++)Xs(t[e])}}function Hu(e,t){return e(t)}function Qu(){}var ni=!1;function Ku(e,t,n){if(ni)return e(t,n);ni=!0;try{return Hu(e,t,n)}finally{ni=!1,(an!==null||un!==null)&&(Qu(),Wu())}}function qn(e,t){var n=e.stateNode;if(n===null)return null;var r=$l(n);if(r===null)return null;n=r[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(e=e.type,r=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!r;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(j(231,t,typeof n));return n}var Hi=!1;if(Ze)try{var Pn={};Object.defineProperty(Pn,"passive",{get:function(){Hi=!0}}),window.addEventListener("test",Pn,Pn),window.removeEventListener("test",Pn,Pn)}catch{Hi=!1}function Vf(e,t,n,r,l,i,o,a,u){var d=Array.prototype.slice.call(arguments,3);try{t.apply(n,d)}catch(m){this.onError(m)}}var bn=!1,nl=null,rl=!1,Qi=null,bf={onError:function(e){bn=!0,nl=e}};function Wf(e,t,n,r,l,i,o,a,u){bn=!1,nl=null,Vf.apply(bf,arguments)}function Hf(e,t,n,r,l,i,o,a,u){if(Wf.apply(this,arguments),bn){if(bn){var d=nl;bn=!1,nl=null}else throw Error(j(198));rl||(rl=!0,Qi=d)}}function Vt(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,t.flags&4098&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function Xu(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Ys(e){if(Vt(e)!==e)throw Error(j(188))}function Qf(e){var t=e.alternate;if(!t){if(t=Vt(e),t===null)throw Error(j(188));return t!==e?null:e}for(var n=e,r=t;;){var l=n.return;if(l===null)break;var i=l.alternate;if(i===null){if(r=l.return,r!==null){n=r;continue}break}if(l.child===i.child){for(i=l.child;i;){if(i===n)return Ys(l),e;if(i===r)return Ys(l),t;i=i.sibling}throw Error(j(188))}if(n.return!==r.return)n=l,r=i;else{for(var o=!1,a=l.child;a;){if(a===n){o=!0,n=l,r=i;break}if(a===r){o=!0,r=l,n=i;break}a=a.sibling}if(!o){for(a=i.child;a;){if(a===n){o=!0,n=i,r=l;break}if(a===r){o=!0,r=i,n=l;break}a=a.sibling}if(!o)throw Error(j(189))}}if(n.alternate!==r)throw Error(j(190))}if(n.tag!==3)throw Error(j(188));return n.stateNode.current===n?e:t}function Yu(e){return e=Qf(e),e!==null?Gu(e):null}function Gu(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=Gu(e);if(t!==null)return t;e=e.sibling}return null}var Zu=Se.unstable_scheduleCallback,Gs=Se.unstable_cancelCallback,Kf=Se.unstable_shouldYield,Xf=Se.unstable_requestPaint,X=Se.unstable_now,Yf=Se.unstable_getCurrentPriorityLevel,Wo=Se.unstable_ImmediatePriority,Ju=Se.unstable_UserBlockingPriority,ll=Se.unstable_NormalPriority,Gf=Se.unstable_LowPriority,qu=Se.unstable_IdlePriority,Ll=null,be=null;function Zf(e){if(be&&typeof be.onCommitFiberRoot=="function")try{be.onCommitFiberRoot(Ll,e,void 0,(e.current.flags&128)===128)}catch{}}var Oe=Math.clz32?Math.clz32:e1,Jf=Math.log,qf=Math.LN2;function e1(e){return e>>>=0,e===0?32:31-(Jf(e)/qf|0)|0}var Pr=64,Lr=4194304;function Un(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function il(e,t){var n=e.pendingLanes;if(n===0)return 0;var r=0,l=e.suspendedLanes,i=e.pingedLanes,o=n&268435455;if(o!==0){var a=o&~l;a!==0?r=Un(a):(i&=o,i!==0&&(r=Un(i)))}else o=n&~l,o!==0?r=Un(o):i!==0&&(r=Un(i));if(r===0)return 0;if(t!==0&&t!==r&&!(t&l)&&(l=r&-r,i=t&-t,l>=i||l===16&&(i&4194240)!==0))return t;if(r&4&&(r|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=r;0<t;)n=31-Oe(t),l=1<<n,r|=e[n],t&=~l;return r}function t1(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function n1(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,l=e.expirationTimes,i=e.pendingLanes;0<i;){var o=31-Oe(i),a=1<<o,u=l[o];u===-1?(!(a&n)||a&r)&&(l[o]=t1(a,t)):u<=t&&(e.expiredLanes|=a),i&=~a}}function Ki(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function ec(){var e=Pr;return Pr<<=1,!(Pr&4194240)&&(Pr=64),e}function ri(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function vr(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-Oe(t),e[t]=n}function r1(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var r=e.eventTimes;for(e=e.expirationTimes;0<n;){var l=31-Oe(n),i=1<<l;t[l]=0,r[l]=-1,e[l]=-1,n&=~i}}function Ho(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-Oe(n),l=1<<r;l&t|e[r]&t&&(e[r]|=t),n&=~l}}var O=0;function tc(e){return e&=-e,1<e?4<e?e&268435455?16:536870912:4:1}var nc,Qo,rc,lc,ic,Xi=!1,Mr=[],ct=null,dt=null,ft=null,er=new Map,tr=new Map,it=[],l1="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Zs(e,t){switch(e){case"focusin":case"focusout":ct=null;break;case"dragenter":case"dragleave":dt=null;break;case"mouseover":case"mouseout":ft=null;break;case"pointerover":case"pointerout":er.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":tr.delete(t.pointerId)}}function Ln(e,t,n,r,l,i){return e===null||e.nativeEvent!==i?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:i,targetContainers:[l]},t!==null&&(t=xr(t),t!==null&&Qo(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,l!==null&&t.indexOf(l)===-1&&t.push(l),e)}function i1(e,t,n,r,l){switch(t){case"focusin":return ct=Ln(ct,e,t,n,r,l),!0;case"dragenter":return dt=Ln(dt,e,t,n,r,l),!0;case"mouseover":return ft=Ln(ft,e,t,n,r,l),!0;case"pointerover":var i=l.pointerId;return er.set(i,Ln(er.get(i)||null,e,t,n,r,l)),!0;case"gotpointercapture":return i=l.pointerId,tr.set(i,Ln(tr.get(i)||null,e,t,n,r,l)),!0}return!1}function oc(e){var t=Lt(e.target);if(t!==null){var n=Vt(t);if(n!==null){if(t=n.tag,t===13){if(t=Xu(n),t!==null){e.blockedOn=t,ic(e.priority,function(){rc(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Hr(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=Yi(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);bi=r,n.target.dispatchEvent(r),bi=null}else return t=xr(n),t!==null&&Qo(t),e.blockedOn=n,!1;t.shift()}return!0}function Js(e,t,n){Hr(e)&&n.delete(t)}function o1(){Xi=!1,ct!==null&&Hr(ct)&&(ct=null),dt!==null&&Hr(dt)&&(dt=null),ft!==null&&Hr(ft)&&(ft=null),er.forEach(Js),tr.forEach(Js)}function Mn(e,t){e.blockedOn===t&&(e.blockedOn=null,Xi||(Xi=!0,Se.unstable_scheduleCallback(Se.unstable_NormalPriority,o1)))}function nr(e){function t(l){return Mn(l,e)}if(0<Mr.length){Mn(Mr[0],e);for(var n=1;n<Mr.length;n++){var r=Mr[n];r.blockedOn===e&&(r.blockedOn=null)}}for(ct!==null&&Mn(ct,e),dt!==null&&Mn(dt,e),ft!==null&&Mn(ft,e),er.forEach(t),tr.forEach(t),n=0;n<it.length;n++)r=it[n],r.blockedOn===e&&(r.blockedOn=null);for(;0<it.length&&(n=it[0],n.blockedOn===null);)oc(n),n.blockedOn===null&&it.shift()}var cn=tt.ReactCurrentBatchConfig,ol=!0;function s1(e,t,n,r){var l=O,i=cn.transition;cn.transition=null;try{O=1,Ko(e,t,n,r)}finally{O=l,cn.transition=i}}function a1(e,t,n,r){var l=O,i=cn.transition;cn.transition=null;try{O=4,Ko(e,t,n,r)}finally{O=l,cn.transition=i}}function Ko(e,t,n,r){if(ol){var l=Yi(e,t,n,r);if(l===null)pi(e,t,r,sl,n),Zs(e,r);else if(i1(l,e,t,n,r))r.stopPropagation();else if(Zs(e,r),t&4&&-1<l1.indexOf(e)){for(;l!==null;){var i=xr(l);if(i!==null&&nc(i),i=Yi(e,t,n,r),i===null&&pi(e,t,r,sl,n),i===l)break;l=i}l!==null&&r.stopPropagation()}else pi(e,t,r,null,n)}}var sl=null;function Yi(e,t,n,r){if(sl=null,e=bo(r),e=Lt(e),e!==null)if(t=Vt(e),t===null)e=null;else if(n=t.tag,n===13){if(e=Xu(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return sl=e,null}function sc(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(Yf()){case Wo:return 1;case Ju:return 4;case ll:case Gf:return 16;case qu:return 536870912;default:return 16}default:return 16}}var st=null,Xo=null,Qr=null;function ac(){if(Qr)return Qr;var e,t=Xo,n=t.length,r,l="value"in st?st.value:st.textContent,i=l.length;for(e=0;e<n&&t[e]===l[e];e++);var o=n-e;for(r=1;r<=o&&t[n-r]===l[i-r];r++);return Qr=l.slice(e,1<r?1-r:void 0)}function Kr(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Tr(){return!0}function qs(){return!1}function Ne(e){function t(n,r,l,i,o){this._reactName=n,this._targetInst=l,this.type=r,this.nativeEvent=i,this.target=o,this.currentTarget=null;for(var a in e)e.hasOwnProperty(a)&&(n=e[a],this[a]=n?n(i):i[a]);return this.isDefaultPrevented=(i.defaultPrevented!=null?i.defaultPrevented:i.returnValue===!1)?Tr:qs,this.isPropagationStopped=qs,this}return W(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Tr)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Tr)},persist:function(){},isPersistent:Tr}),t}var Sn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Yo=Ne(Sn),yr=W({},Sn,{view:0,detail:0}),u1=Ne(yr),li,ii,Tn,Ml=W({},yr,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Go,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Tn&&(Tn&&e.type==="mousemove"?(li=e.screenX-Tn.screenX,ii=e.screenY-Tn.screenY):ii=li=0,Tn=e),li)},movementY:function(e){return"movementY"in e?e.movementY:ii}}),ea=Ne(Ml),c1=W({},Ml,{dataTransfer:0}),d1=Ne(c1),f1=W({},yr,{relatedTarget:0}),oi=Ne(f1),p1=W({},Sn,{animationName:0,elapsedTime:0,pseudoElement:0}),m1=Ne(p1),h1=W({},Sn,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),g1=Ne(h1),v1=W({},Sn,{data:0}),ta=Ne(v1),y1={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},x1={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},w1={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function k1(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=w1[e])?!!t[e]:!1}function Go(){return k1}var S1=W({},yr,{key:function(e){if(e.key){var t=y1[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Kr(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?x1[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Go,charCode:function(e){return e.type==="keypress"?Kr(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Kr(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),j1=Ne(S1),N1=W({},Ml,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),na=Ne(N1),E1=W({},yr,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Go}),z1=Ne(E1),C1=W({},Sn,{propertyName:0,elapsedTime:0,pseudoElement:0}),_1=Ne(C1),P1=W({},Ml,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),L1=Ne(P1),M1=[9,13,27,32],Zo=Ze&&"CompositionEvent"in window,Wn=null;Ze&&"documentMode"in document&&(Wn=document.documentMode);var T1=Ze&&"TextEvent"in window&&!Wn,uc=Ze&&(!Zo||Wn&&8<Wn&&11>=Wn),ra=" ",la=!1;function cc(e,t){switch(e){case"keyup":return M1.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function dc(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var Gt=!1;function I1(e,t){switch(e){case"compositionend":return dc(t);case"keypress":return t.which!==32?null:(la=!0,ra);case"textInput":return e=t.data,e===ra&&la?null:e;default:return null}}function $1(e,t){if(Gt)return e==="compositionend"||!Zo&&cc(e,t)?(e=ac(),Qr=Xo=st=null,Gt=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return uc&&t.locale!=="ko"?null:t.data;default:return null}}var R1={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function ia(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!R1[e.type]:t==="textarea"}function fc(e,t,n,r){bu(r),t=al(t,"onChange"),0<t.length&&(n=new Yo("onChange","change",null,n,r),e.push({event:n,listeners:t}))}var Hn=null,rr=null;function O1(e){jc(e,0)}function Tl(e){var t=qt(e);if(Ou(t))return e}function D1(e,t){if(e==="change")return t}var pc=!1;if(Ze){var si;if(Ze){var ai="oninput"in document;if(!ai){var oa=document.createElement("div");oa.setAttribute("oninput","return;"),ai=typeof oa.oninput=="function"}si=ai}else si=!1;pc=si&&(!document.documentMode||9<document.documentMode)}function sa(){Hn&&(Hn.detachEvent("onpropertychange",mc),rr=Hn=null)}function mc(e){if(e.propertyName==="value"&&Tl(rr)){var t=[];fc(t,rr,e,bo(e)),Ku(O1,t)}}function F1(e,t,n){e==="focusin"?(sa(),Hn=t,rr=n,Hn.attachEvent("onpropertychange",mc)):e==="focusout"&&sa()}function A1(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Tl(rr)}function U1(e,t){if(e==="click")return Tl(t)}function B1(e,t){if(e==="input"||e==="change")return Tl(t)}function V1(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Fe=typeof Object.is=="function"?Object.is:V1;function lr(e,t){if(Fe(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var l=n[r];if(!Mi.call(t,l)||!Fe(e[l],t[l]))return!1}return!0}function aa(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function ua(e,t){var n=aa(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=aa(n)}}function hc(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?hc(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function gc(){for(var e=window,t=tl();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=tl(e.document)}return t}function Jo(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function b1(e){var t=gc(),n=e.focusedElem,r=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&hc(n.ownerDocument.documentElement,n)){if(r!==null&&Jo(n)){if(t=r.start,e=r.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var l=n.textContent.length,i=Math.min(r.start,l);r=r.end===void 0?i:Math.min(r.end,l),!e.extend&&i>r&&(l=r,r=i,i=l),l=ua(n,i);var o=ua(n,r);l&&o&&(e.rangeCount!==1||e.anchorNode!==l.node||e.anchorOffset!==l.offset||e.focusNode!==o.node||e.focusOffset!==o.offset)&&(t=t.createRange(),t.setStart(l.node,l.offset),e.removeAllRanges(),i>r?(e.addRange(t),e.extend(o.node,o.offset)):(t.setEnd(o.node,o.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var W1=Ze&&"documentMode"in document&&11>=document.documentMode,Zt=null,Gi=null,Qn=null,Zi=!1;function ca(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Zi||Zt==null||Zt!==tl(r)||(r=Zt,"selectionStart"in r&&Jo(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),Qn&&lr(Qn,r)||(Qn=r,r=al(Gi,"onSelect"),0<r.length&&(t=new Yo("onSelect","select",null,t,n),e.push({event:t,listeners:r}),t.target=Zt)))}function Ir(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var Jt={animationend:Ir("Animation","AnimationEnd"),animationiteration:Ir("Animation","AnimationIteration"),animationstart:Ir("Animation","AnimationStart"),transitionend:Ir("Transition","TransitionEnd")},ui={},vc={};Ze&&(vc=document.createElement("div").style,"AnimationEvent"in window||(delete Jt.animationend.animation,delete Jt.animationiteration.animation,delete Jt.animationstart.animation),"TransitionEvent"in window||delete Jt.transitionend.transition);function Il(e){if(ui[e])return ui[e];if(!Jt[e])return e;var t=Jt[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in vc)return ui[e]=t[n];return e}var yc=Il("animationend"),xc=Il("animationiteration"),wc=Il("animationstart"),kc=Il("transitionend"),Sc=new Map,da="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function St(e,t){Sc.set(e,t),Bt(t,[e])}for(var ci=0;ci<da.length;ci++){var di=da[ci],H1=di.toLowerCase(),Q1=di[0].toUpperCase()+di.slice(1);St(H1,"on"+Q1)}St(yc,"onAnimationEnd");St(xc,"onAnimationIteration");St(wc,"onAnimationStart");St("dblclick","onDoubleClick");St("focusin","onFocus");St("focusout","onBlur");St(kc,"onTransitionEnd");pn("onMouseEnter",["mouseout","mouseover"]);pn("onMouseLeave",["mouseout","mouseover"]);pn("onPointerEnter",["pointerout","pointerover"]);pn("onPointerLeave",["pointerout","pointerover"]);Bt("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Bt("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Bt("onBeforeInput",["compositionend","keypress","textInput","paste"]);Bt("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Bt("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Bt("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Bn="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),K1=new Set("cancel close invalid load scroll toggle".split(" ").concat(Bn));function fa(e,t,n){var r=e.type||"unknown-event";e.currentTarget=n,Hf(r,t,void 0,e),e.currentTarget=null}function jc(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var r=e[n],l=r.event;r=r.listeners;e:{var i=void 0;if(t)for(var o=r.length-1;0<=o;o--){var a=r[o],u=a.instance,d=a.currentTarget;if(a=a.listener,u!==i&&l.isPropagationStopped())break e;fa(l,a,d),i=u}else for(o=0;o<r.length;o++){if(a=r[o],u=a.instance,d=a.currentTarget,a=a.listener,u!==i&&l.isPropagationStopped())break e;fa(l,a,d),i=u}}}if(rl)throw e=Qi,rl=!1,Qi=null,e}function A(e,t){var n=t[no];n===void 0&&(n=t[no]=new Set);var r=e+"__bubble";n.has(r)||(Nc(t,e,2,!1),n.add(r))}function fi(e,t,n){var r=0;t&&(r|=4),Nc(n,e,r,t)}var $r="_reactListening"+Math.random().toString(36).slice(2);function ir(e){if(!e[$r]){e[$r]=!0,Mu.forEach(function(n){n!=="selectionchange"&&(K1.has(n)||fi(n,!1,e),fi(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[$r]||(t[$r]=!0,fi("selectionchange",!1,t))}}function Nc(e,t,n,r){switch(sc(t)){case 1:var l=s1;break;case 4:l=a1;break;default:l=Ko}n=l.bind(null,t,n,e),l=void 0,!Hi||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(l=!0),r?l!==void 0?e.addEventListener(t,n,{capture:!0,passive:l}):e.addEventListener(t,n,!0):l!==void 0?e.addEventListener(t,n,{passive:l}):e.addEventListener(t,n,!1)}function pi(e,t,n,r,l){var i=r;if(!(t&1)&&!(t&2)&&r!==null)e:for(;;){if(r===null)return;var o=r.tag;if(o===3||o===4){var a=r.stateNode.containerInfo;if(a===l||a.nodeType===8&&a.parentNode===l)break;if(o===4)for(o=r.return;o!==null;){var u=o.tag;if((u===3||u===4)&&(u=o.stateNode.containerInfo,u===l||u.nodeType===8&&u.parentNode===l))return;o=o.return}for(;a!==null;){if(o=Lt(a),o===null)return;if(u=o.tag,u===5||u===6){r=i=o;continue e}a=a.parentNode}}r=r.return}Ku(function(){var d=i,m=bo(n),f=[];e:{var c=Sc.get(e);if(c!==void 0){var v=Yo,x=e;switch(e){case"keypress":if(Kr(n)===0)break e;case"keydown":case"keyup":v=j1;break;case"focusin":x="focus",v=oi;break;case"focusout":x="blur",v=oi;break;case"beforeblur":case"afterblur":v=oi;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":v=ea;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":v=d1;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":v=z1;break;case yc:case xc:case wc:v=m1;break;case kc:v=_1;break;case"scroll":v=u1;break;case"wheel":v=L1;break;case"copy":case"cut":case"paste":v=g1;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":v=na}var y=(t&4)!==0,S=!y&&e==="scroll",h=y?c!==null?c+"Capture":null:c;y=[];for(var p=d,g;p!==null;){g=p;var w=g.stateNode;if(g.tag===5&&w!==null&&(g=w,h!==null&&(w=qn(p,h),w!=null&&y.push(or(p,w,g)))),S)break;p=p.return}0<y.length&&(c=new v(c,x,null,n,m),f.push({event:c,listeners:y}))}}if(!(t&7)){e:{if(c=e==="mouseover"||e==="pointerover",v=e==="mouseout"||e==="pointerout",c&&n!==bi&&(x=n.relatedTarget||n.fromElement)&&(Lt(x)||x[Je]))break e;if((v||c)&&(c=m.window===m?m:(c=m.ownerDocument)?c.defaultView||c.parentWindow:window,v?(x=n.relatedTarget||n.toElement,v=d,x=x?Lt(x):null,x!==null&&(S=Vt(x),x!==S||x.tag!==5&&x.tag!==6)&&(x=null)):(v=null,x=d),v!==x)){if(y=ea,w="onMouseLeave",h="onMouseEnter",p="mouse",(e==="pointerout"||e==="pointerover")&&(y=na,w="onPointerLeave",h="onPointerEnter",p="pointer"),S=v==null?c:qt(v),g=x==null?c:qt(x),c=new y(w,p+"leave",v,n,m),c.target=S,c.relatedTarget=g,w=null,Lt(m)===d&&(y=new y(h,p+"enter",x,n,m),y.target=g,y.relatedTarget=S,w=y),S=w,v&&x)t:{for(y=v,h=x,p=0,g=y;g;g=Wt(g))p++;for(g=0,w=h;w;w=Wt(w))g++;for(;0<p-g;)y=Wt(y),p--;for(;0<g-p;)h=Wt(h),g--;for(;p--;){if(y===h||h!==null&&y===h.alternate)break t;y=Wt(y),h=Wt(h)}y=null}else y=null;v!==null&&pa(f,c,v,y,!1),x!==null&&S!==null&&pa(f,S,x,y,!0)}}e:{if(c=d?qt(d):window,v=c.nodeName&&c.nodeName.toLowerCase(),v==="select"||v==="input"&&c.type==="file")var N=D1;else if(ia(c))if(pc)N=B1;else{N=A1;var C=F1}else(v=c.nodeName)&&v.toLowerCase()==="input"&&(c.type==="checkbox"||c.type==="radio")&&(N=U1);if(N&&(N=N(e,d))){fc(f,N,n,m);break e}C&&C(e,c,d),e==="focusout"&&(C=c._wrapperState)&&C.controlled&&c.type==="number"&&Fi(c,"number",c.value)}switch(C=d?qt(d):window,e){case"focusin":(ia(C)||C.contentEditable==="true")&&(Zt=C,Gi=d,Qn=null);break;case"focusout":Qn=Gi=Zt=null;break;case"mousedown":Zi=!0;break;case"contextmenu":case"mouseup":case"dragend":Zi=!1,ca(f,n,m);break;case"selectionchange":if(W1)break;case"keydown":case"keyup":ca(f,n,m)}var _;if(Zo)e:{switch(e){case"compositionstart":var P="onCompositionStart";break e;case"compositionend":P="onCompositionEnd";break e;case"compositionupdate":P="onCompositionUpdate";break e}P=void 0}else Gt?cc(e,n)&&(P="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(P="onCompositionStart");P&&(uc&&n.locale!=="ko"&&(Gt||P!=="onCompositionStart"?P==="onCompositionEnd"&&Gt&&(_=ac()):(st=m,Xo="value"in st?st.value:st.textContent,Gt=!0)),C=al(d,P),0<C.length&&(P=new ta(P,e,null,n,m),f.push({event:P,listeners:C}),_?P.data=_:(_=dc(n),_!==null&&(P.data=_)))),(_=T1?I1(e,n):$1(e,n))&&(d=al(d,"onBeforeInput"),0<d.length&&(m=new ta("onBeforeInput","beforeinput",null,n,m),f.push({event:m,listeners:d}),m.data=_))}jc(f,t)})}function or(e,t,n){return{instance:e,listener:t,currentTarget:n}}function al(e,t){for(var n=t+"Capture",r=[];e!==null;){var l=e,i=l.stateNode;l.tag===5&&i!==null&&(l=i,i=qn(e,n),i!=null&&r.unshift(or(e,i,l)),i=qn(e,t),i!=null&&r.push(or(e,i,l))),e=e.return}return r}function Wt(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function pa(e,t,n,r,l){for(var i=t._reactName,o=[];n!==null&&n!==r;){var a=n,u=a.alternate,d=a.stateNode;if(u!==null&&u===r)break;a.tag===5&&d!==null&&(a=d,l?(u=qn(n,i),u!=null&&o.unshift(or(n,u,a))):l||(u=qn(n,i),u!=null&&o.push(or(n,u,a)))),n=n.return}o.length!==0&&e.push({event:t,listeners:o})}var X1=/\r\n?/g,Y1=/\u0000|\uFFFD/g;function ma(e){return(typeof e=="string"?e:""+e).replace(X1,`
`).replace(Y1,"")}function Rr(e,t,n){if(t=ma(t),ma(e)!==t&&n)throw Error(j(425))}function ul(){}var Ji=null,qi=null;function eo(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var to=typeof setTimeout=="function"?setTimeout:void 0,G1=typeof clearTimeout=="function"?clearTimeout:void 0,ha=typeof Promise=="function"?Promise:void 0,Z1=typeof queueMicrotask=="function"?queueMicrotask:typeof ha<"u"?function(e){return ha.resolve(null).then(e).catch(J1)}:to;function J1(e){setTimeout(function(){throw e})}function mi(e,t){var n=t,r=0;do{var l=n.nextSibling;if(e.removeChild(n),l&&l.nodeType===8)if(n=l.data,n==="/$"){if(r===0){e.removeChild(l),nr(t);return}r--}else n!=="$"&&n!=="$?"&&n!=="$!"||r++;n=l}while(n);nr(t)}function pt(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function ga(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var jn=Math.random().toString(36).slice(2),Ve="__reactFiber$"+jn,sr="__reactProps$"+jn,Je="__reactContainer$"+jn,no="__reactEvents$"+jn,q1="__reactListeners$"+jn,ep="__reactHandles$"+jn;function Lt(e){var t=e[Ve];if(t)return t;for(var n=e.parentNode;n;){if(t=n[Je]||n[Ve]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=ga(e);e!==null;){if(n=e[Ve])return n;e=ga(e)}return t}e=n,n=e.parentNode}return null}function xr(e){return e=e[Ve]||e[Je],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function qt(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(j(33))}function $l(e){return e[sr]||null}var ro=[],en=-1;function jt(e){return{current:e}}function U(e){0>en||(e.current=ro[en],ro[en]=null,en--)}function F(e,t){en++,ro[en]=e.current,e.current=t}var kt={},ue=jt(kt),ge=jt(!1),Rt=kt;function mn(e,t){var n=e.type.contextTypes;if(!n)return kt;var r=e.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===t)return r.__reactInternalMemoizedMaskedChildContext;var l={},i;for(i in n)l[i]=t[i];return r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=l),l}function ve(e){return e=e.childContextTypes,e!=null}function cl(){U(ge),U(ue)}function va(e,t,n){if(ue.current!==kt)throw Error(j(168));F(ue,t),F(ge,n)}function Ec(e,t,n){var r=e.stateNode;if(t=t.childContextTypes,typeof r.getChildContext!="function")return n;r=r.getChildContext();for(var l in r)if(!(l in t))throw Error(j(108,Ff(e)||"Unknown",l));return W({},n,r)}function dl(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||kt,Rt=ue.current,F(ue,e),F(ge,ge.current),!0}function ya(e,t,n){var r=e.stateNode;if(!r)throw Error(j(169));n?(e=Ec(e,t,Rt),r.__reactInternalMemoizedMergedChildContext=e,U(ge),U(ue),F(ue,e)):U(ge),F(ge,n)}var Ke=null,Rl=!1,hi=!1;function zc(e){Ke===null?Ke=[e]:Ke.push(e)}function tp(e){Rl=!0,zc(e)}function Nt(){if(!hi&&Ke!==null){hi=!0;var e=0,t=O;try{var n=Ke;for(O=1;e<n.length;e++){var r=n[e];do r=r(!0);while(r!==null)}Ke=null,Rl=!1}catch(l){throw Ke!==null&&(Ke=Ke.slice(e+1)),Zu(Wo,Nt),l}finally{O=t,hi=!1}}return null}var tn=[],nn=0,fl=null,pl=0,Ee=[],ze=0,Ot=null,Xe=1,Ye="";function _t(e,t){tn[nn++]=pl,tn[nn++]=fl,fl=e,pl=t}function Cc(e,t,n){Ee[ze++]=Xe,Ee[ze++]=Ye,Ee[ze++]=Ot,Ot=e;var r=Xe;e=Ye;var l=32-Oe(r)-1;r&=~(1<<l),n+=1;var i=32-Oe(t)+l;if(30<i){var o=l-l%5;i=(r&(1<<o)-1).toString(32),r>>=o,l-=o,Xe=1<<32-Oe(t)+l|n<<l|r,Ye=i+e}else Xe=1<<i|n<<l|r,Ye=e}function qo(e){e.return!==null&&(_t(e,1),Cc(e,1,0))}function es(e){for(;e===fl;)fl=tn[--nn],tn[nn]=null,pl=tn[--nn],tn[nn]=null;for(;e===Ot;)Ot=Ee[--ze],Ee[ze]=null,Ye=Ee[--ze],Ee[ze]=null,Xe=Ee[--ze],Ee[ze]=null}var ke=null,we=null,B=!1,Re=null;function _c(e,t){var n=Ce(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function xa(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,ke=e,we=pt(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,ke=e,we=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=Ot!==null?{id:Xe,overflow:Ye}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=Ce(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,ke=e,we=null,!0):!1;default:return!1}}function lo(e){return(e.mode&1)!==0&&(e.flags&128)===0}function io(e){if(B){var t=we;if(t){var n=t;if(!xa(e,t)){if(lo(e))throw Error(j(418));t=pt(n.nextSibling);var r=ke;t&&xa(e,t)?_c(r,n):(e.flags=e.flags&-4097|2,B=!1,ke=e)}}else{if(lo(e))throw Error(j(418));e.flags=e.flags&-4097|2,B=!1,ke=e}}}function wa(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;ke=e}function Or(e){if(e!==ke)return!1;if(!B)return wa(e),B=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!eo(e.type,e.memoizedProps)),t&&(t=we)){if(lo(e))throw Pc(),Error(j(418));for(;t;)_c(e,t),t=pt(t.nextSibling)}if(wa(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(j(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){we=pt(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}we=null}}else we=ke?pt(e.stateNode.nextSibling):null;return!0}function Pc(){for(var e=we;e;)e=pt(e.nextSibling)}function hn(){we=ke=null,B=!1}function ts(e){Re===null?Re=[e]:Re.push(e)}var np=tt.ReactCurrentBatchConfig;function In(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(j(309));var r=n.stateNode}if(!r)throw Error(j(147,e));var l=r,i=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===i?t.ref:(t=function(o){var a=l.refs;o===null?delete a[i]:a[i]=o},t._stringRef=i,t)}if(typeof e!="string")throw Error(j(284));if(!n._owner)throw Error(j(290,e))}return e}function Dr(e,t){throw e=Object.prototype.toString.call(t),Error(j(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function ka(e){var t=e._init;return t(e._payload)}function Lc(e){function t(h,p){if(e){var g=h.deletions;g===null?(h.deletions=[p],h.flags|=16):g.push(p)}}function n(h,p){if(!e)return null;for(;p!==null;)t(h,p),p=p.sibling;return null}function r(h,p){for(h=new Map;p!==null;)p.key!==null?h.set(p.key,p):h.set(p.index,p),p=p.sibling;return h}function l(h,p){return h=vt(h,p),h.index=0,h.sibling=null,h}function i(h,p,g){return h.index=g,e?(g=h.alternate,g!==null?(g=g.index,g<p?(h.flags|=2,p):g):(h.flags|=2,p)):(h.flags|=1048576,p)}function o(h){return e&&h.alternate===null&&(h.flags|=2),h}function a(h,p,g,w){return p===null||p.tag!==6?(p=Si(g,h.mode,w),p.return=h,p):(p=l(p,g),p.return=h,p)}function u(h,p,g,w){var N=g.type;return N===Yt?m(h,p,g.props.children,w,g.key):p!==null&&(p.elementType===N||typeof N=="object"&&N!==null&&N.$$typeof===rt&&ka(N)===p.type)?(w=l(p,g.props),w.ref=In(h,p,g),w.return=h,w):(w=el(g.type,g.key,g.props,null,h.mode,w),w.ref=In(h,p,g),w.return=h,w)}function d(h,p,g,w){return p===null||p.tag!==4||p.stateNode.containerInfo!==g.containerInfo||p.stateNode.implementation!==g.implementation?(p=ji(g,h.mode,w),p.return=h,p):(p=l(p,g.children||[]),p.return=h,p)}function m(h,p,g,w,N){return p===null||p.tag!==7?(p=$t(g,h.mode,w,N),p.return=h,p):(p=l(p,g),p.return=h,p)}function f(h,p,g){if(typeof p=="string"&&p!==""||typeof p=="number")return p=Si(""+p,h.mode,g),p.return=h,p;if(typeof p=="object"&&p!==null){switch(p.$$typeof){case zr:return g=el(p.type,p.key,p.props,null,h.mode,g),g.ref=In(h,null,p),g.return=h,g;case Xt:return p=ji(p,h.mode,g),p.return=h,p;case rt:var w=p._init;return f(h,w(p._payload),g)}if(An(p)||_n(p))return p=$t(p,h.mode,g,null),p.return=h,p;Dr(h,p)}return null}function c(h,p,g,w){var N=p!==null?p.key:null;if(typeof g=="string"&&g!==""||typeof g=="number")return N!==null?null:a(h,p,""+g,w);if(typeof g=="object"&&g!==null){switch(g.$$typeof){case zr:return g.key===N?u(h,p,g,w):null;case Xt:return g.key===N?d(h,p,g,w):null;case rt:return N=g._init,c(h,p,N(g._payload),w)}if(An(g)||_n(g))return N!==null?null:m(h,p,g,w,null);Dr(h,g)}return null}function v(h,p,g,w,N){if(typeof w=="string"&&w!==""||typeof w=="number")return h=h.get(g)||null,a(p,h,""+w,N);if(typeof w=="object"&&w!==null){switch(w.$$typeof){case zr:return h=h.get(w.key===null?g:w.key)||null,u(p,h,w,N);case Xt:return h=h.get(w.key===null?g:w.key)||null,d(p,h,w,N);case rt:var C=w._init;return v(h,p,g,C(w._payload),N)}if(An(w)||_n(w))return h=h.get(g)||null,m(p,h,w,N,null);Dr(p,w)}return null}function x(h,p,g,w){for(var N=null,C=null,_=p,P=p=0,Q=null;_!==null&&P<g.length;P++){_.index>P?(Q=_,_=null):Q=_.sibling;var I=c(h,_,g[P],w);if(I===null){_===null&&(_=Q);break}e&&_&&I.alternate===null&&t(h,_),p=i(I,p,P),C===null?N=I:C.sibling=I,C=I,_=Q}if(P===g.length)return n(h,_),B&&_t(h,P),N;if(_===null){for(;P<g.length;P++)_=f(h,g[P],w),_!==null&&(p=i(_,p,P),C===null?N=_:C.sibling=_,C=_);return B&&_t(h,P),N}for(_=r(h,_);P<g.length;P++)Q=v(_,h,P,g[P],w),Q!==null&&(e&&Q.alternate!==null&&_.delete(Q.key===null?P:Q.key),p=i(Q,p,P),C===null?N=Q:C.sibling=Q,C=Q);return e&&_.forEach(function(Me){return t(h,Me)}),B&&_t(h,P),N}function y(h,p,g,w){var N=_n(g);if(typeof N!="function")throw Error(j(150));if(g=N.call(g),g==null)throw Error(j(151));for(var C=N=null,_=p,P=p=0,Q=null,I=g.next();_!==null&&!I.done;P++,I=g.next()){_.index>P?(Q=_,_=null):Q=_.sibling;var Me=c(h,_,I.value,w);if(Me===null){_===null&&(_=Q);break}e&&_&&Me.alternate===null&&t(h,_),p=i(Me,p,P),C===null?N=Me:C.sibling=Me,C=Me,_=Q}if(I.done)return n(h,_),B&&_t(h,P),N;if(_===null){for(;!I.done;P++,I=g.next())I=f(h,I.value,w),I!==null&&(p=i(I,p,P),C===null?N=I:C.sibling=I,C=I);return B&&_t(h,P),N}for(_=r(h,_);!I.done;P++,I=g.next())I=v(_,h,P,I.value,w),I!==null&&(e&&I.alternate!==null&&_.delete(I.key===null?P:I.key),p=i(I,p,P),C===null?N=I:C.sibling=I,C=I);return e&&_.forEach(function(zn){return t(h,zn)}),B&&_t(h,P),N}function S(h,p,g,w){if(typeof g=="object"&&g!==null&&g.type===Yt&&g.key===null&&(g=g.props.children),typeof g=="object"&&g!==null){switch(g.$$typeof){case zr:e:{for(var N=g.key,C=p;C!==null;){if(C.key===N){if(N=g.type,N===Yt){if(C.tag===7){n(h,C.sibling),p=l(C,g.props.children),p.return=h,h=p;break e}}else if(C.elementType===N||typeof N=="object"&&N!==null&&N.$$typeof===rt&&ka(N)===C.type){n(h,C.sibling),p=l(C,g.props),p.ref=In(h,C,g),p.return=h,h=p;break e}n(h,C);break}else t(h,C);C=C.sibling}g.type===Yt?(p=$t(g.props.children,h.mode,w,g.key),p.return=h,h=p):(w=el(g.type,g.key,g.props,null,h.mode,w),w.ref=In(h,p,g),w.return=h,h=w)}return o(h);case Xt:e:{for(C=g.key;p!==null;){if(p.key===C)if(p.tag===4&&p.stateNode.containerInfo===g.containerInfo&&p.stateNode.implementation===g.implementation){n(h,p.sibling),p=l(p,g.children||[]),p.return=h,h=p;break e}else{n(h,p);break}else t(h,p);p=p.sibling}p=ji(g,h.mode,w),p.return=h,h=p}return o(h);case rt:return C=g._init,S(h,p,C(g._payload),w)}if(An(g))return x(h,p,g,w);if(_n(g))return y(h,p,g,w);Dr(h,g)}return typeof g=="string"&&g!==""||typeof g=="number"?(g=""+g,p!==null&&p.tag===6?(n(h,p.sibling),p=l(p,g),p.return=h,h=p):(n(h,p),p=Si(g,h.mode,w),p.return=h,h=p),o(h)):n(h,p)}return S}var gn=Lc(!0),Mc=Lc(!1),ml=jt(null),hl=null,rn=null,ns=null;function rs(){ns=rn=hl=null}function ls(e){var t=ml.current;U(ml),e._currentValue=t}function oo(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,r!==null&&(r.childLanes|=t)):r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t),e===n)break;e=e.return}}function dn(e,t){hl=e,ns=rn=null,e=e.dependencies,e!==null&&e.firstContext!==null&&(e.lanes&t&&(he=!0),e.firstContext=null)}function Pe(e){var t=e._currentValue;if(ns!==e)if(e={context:e,memoizedValue:t,next:null},rn===null){if(hl===null)throw Error(j(308));rn=e,hl.dependencies={lanes:0,firstContext:e}}else rn=rn.next=e;return t}var Mt=null;function is(e){Mt===null?Mt=[e]:Mt.push(e)}function Tc(e,t,n,r){var l=t.interleaved;return l===null?(n.next=n,is(t)):(n.next=l.next,l.next=n),t.interleaved=n,qe(e,r)}function qe(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var lt=!1;function os(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Ic(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function Ge(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function mt(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,$&2){var l=r.pending;return l===null?t.next=t:(t.next=l.next,l.next=t),r.pending=t,qe(e,n)}return l=r.interleaved,l===null?(t.next=t,is(r)):(t.next=l.next,l.next=t),r.interleaved=t,qe(e,n)}function Xr(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,Ho(e,n)}}function Sa(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var l=null,i=null;if(n=n.firstBaseUpdate,n!==null){do{var o={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};i===null?l=i=o:i=i.next=o,n=n.next}while(n!==null);i===null?l=i=t:i=i.next=t}else l=i=t;n={baseState:r.baseState,firstBaseUpdate:l,lastBaseUpdate:i,shared:r.shared,effects:r.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function gl(e,t,n,r){var l=e.updateQueue;lt=!1;var i=l.firstBaseUpdate,o=l.lastBaseUpdate,a=l.shared.pending;if(a!==null){l.shared.pending=null;var u=a,d=u.next;u.next=null,o===null?i=d:o.next=d,o=u;var m=e.alternate;m!==null&&(m=m.updateQueue,a=m.lastBaseUpdate,a!==o&&(a===null?m.firstBaseUpdate=d:a.next=d,m.lastBaseUpdate=u))}if(i!==null){var f=l.baseState;o=0,m=d=u=null,a=i;do{var c=a.lane,v=a.eventTime;if((r&c)===c){m!==null&&(m=m.next={eventTime:v,lane:0,tag:a.tag,payload:a.payload,callback:a.callback,next:null});e:{var x=e,y=a;switch(c=t,v=n,y.tag){case 1:if(x=y.payload,typeof x=="function"){f=x.call(v,f,c);break e}f=x;break e;case 3:x.flags=x.flags&-65537|128;case 0:if(x=y.payload,c=typeof x=="function"?x.call(v,f,c):x,c==null)break e;f=W({},f,c);break e;case 2:lt=!0}}a.callback!==null&&a.lane!==0&&(e.flags|=64,c=l.effects,c===null?l.effects=[a]:c.push(a))}else v={eventTime:v,lane:c,tag:a.tag,payload:a.payload,callback:a.callback,next:null},m===null?(d=m=v,u=f):m=m.next=v,o|=c;if(a=a.next,a===null){if(a=l.shared.pending,a===null)break;c=a,a=c.next,c.next=null,l.lastBaseUpdate=c,l.shared.pending=null}}while(!0);if(m===null&&(u=f),l.baseState=u,l.firstBaseUpdate=d,l.lastBaseUpdate=m,t=l.shared.interleaved,t!==null){l=t;do o|=l.lane,l=l.next;while(l!==t)}else i===null&&(l.shared.lanes=0);Ft|=o,e.lanes=o,e.memoizedState=f}}function ja(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var r=e[t],l=r.callback;if(l!==null){if(r.callback=null,r=n,typeof l!="function")throw Error(j(191,l));l.call(r)}}}var wr={},We=jt(wr),ar=jt(wr),ur=jt(wr);function Tt(e){if(e===wr)throw Error(j(174));return e}function ss(e,t){switch(F(ur,t),F(ar,e),F(We,wr),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:Ui(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=Ui(t,e)}U(We),F(We,t)}function vn(){U(We),U(ar),U(ur)}function $c(e){Tt(ur.current);var t=Tt(We.current),n=Ui(t,e.type);t!==n&&(F(ar,e),F(We,n))}function as(e){ar.current===e&&(U(We),U(ar))}var V=jt(0);function vl(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var gi=[];function us(){for(var e=0;e<gi.length;e++)gi[e]._workInProgressVersionPrimary=null;gi.length=0}var Yr=tt.ReactCurrentDispatcher,vi=tt.ReactCurrentBatchConfig,Dt=0,b=null,Z=null,te=null,yl=!1,Kn=!1,cr=0,rp=0;function oe(){throw Error(j(321))}function cs(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Fe(e[n],t[n]))return!1;return!0}function ds(e,t,n,r,l,i){if(Dt=i,b=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,Yr.current=e===null||e.memoizedState===null?sp:ap,e=n(r,l),Kn){i=0;do{if(Kn=!1,cr=0,25<=i)throw Error(j(301));i+=1,te=Z=null,t.updateQueue=null,Yr.current=up,e=n(r,l)}while(Kn)}if(Yr.current=xl,t=Z!==null&&Z.next!==null,Dt=0,te=Z=b=null,yl=!1,t)throw Error(j(300));return e}function fs(){var e=cr!==0;return cr=0,e}function Be(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return te===null?b.memoizedState=te=e:te=te.next=e,te}function Le(){if(Z===null){var e=b.alternate;e=e!==null?e.memoizedState:null}else e=Z.next;var t=te===null?b.memoizedState:te.next;if(t!==null)te=t,Z=e;else{if(e===null)throw Error(j(310));Z=e,e={memoizedState:Z.memoizedState,baseState:Z.baseState,baseQueue:Z.baseQueue,queue:Z.queue,next:null},te===null?b.memoizedState=te=e:te=te.next=e}return te}function dr(e,t){return typeof t=="function"?t(e):t}function yi(e){var t=Le(),n=t.queue;if(n===null)throw Error(j(311));n.lastRenderedReducer=e;var r=Z,l=r.baseQueue,i=n.pending;if(i!==null){if(l!==null){var o=l.next;l.next=i.next,i.next=o}r.baseQueue=l=i,n.pending=null}if(l!==null){i=l.next,r=r.baseState;var a=o=null,u=null,d=i;do{var m=d.lane;if((Dt&m)===m)u!==null&&(u=u.next={lane:0,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null}),r=d.hasEagerState?d.eagerState:e(r,d.action);else{var f={lane:m,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null};u===null?(a=u=f,o=r):u=u.next=f,b.lanes|=m,Ft|=m}d=d.next}while(d!==null&&d!==i);u===null?o=r:u.next=a,Fe(r,t.memoizedState)||(he=!0),t.memoizedState=r,t.baseState=o,t.baseQueue=u,n.lastRenderedState=r}if(e=n.interleaved,e!==null){l=e;do i=l.lane,b.lanes|=i,Ft|=i,l=l.next;while(l!==e)}else l===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function xi(e){var t=Le(),n=t.queue;if(n===null)throw Error(j(311));n.lastRenderedReducer=e;var r=n.dispatch,l=n.pending,i=t.memoizedState;if(l!==null){n.pending=null;var o=l=l.next;do i=e(i,o.action),o=o.next;while(o!==l);Fe(i,t.memoizedState)||(he=!0),t.memoizedState=i,t.baseQueue===null&&(t.baseState=i),n.lastRenderedState=i}return[i,r]}function Rc(){}function Oc(e,t){var n=b,r=Le(),l=t(),i=!Fe(r.memoizedState,l);if(i&&(r.memoizedState=l,he=!0),r=r.queue,ps(Ac.bind(null,n,r,e),[e]),r.getSnapshot!==t||i||te!==null&&te.memoizedState.tag&1){if(n.flags|=2048,fr(9,Fc.bind(null,n,r,l,t),void 0,null),ne===null)throw Error(j(349));Dt&30||Dc(n,t,l)}return l}function Dc(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=b.updateQueue,t===null?(t={lastEffect:null,stores:null},b.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function Fc(e,t,n,r){t.value=n,t.getSnapshot=r,Uc(t)&&Bc(e)}function Ac(e,t,n){return n(function(){Uc(t)&&Bc(e)})}function Uc(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!Fe(e,n)}catch{return!0}}function Bc(e){var t=qe(e,1);t!==null&&De(t,e,1,-1)}function Na(e){var t=Be();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:dr,lastRenderedState:e},t.queue=e,e=e.dispatch=op.bind(null,b,e),[t.memoizedState,e]}function fr(e,t,n,r){return e={tag:e,create:t,destroy:n,deps:r,next:null},t=b.updateQueue,t===null?(t={lastEffect:null,stores:null},b.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e)),e}function Vc(){return Le().memoizedState}function Gr(e,t,n,r){var l=Be();b.flags|=e,l.memoizedState=fr(1|t,n,void 0,r===void 0?null:r)}function Ol(e,t,n,r){var l=Le();r=r===void 0?null:r;var i=void 0;if(Z!==null){var o=Z.memoizedState;if(i=o.destroy,r!==null&&cs(r,o.deps)){l.memoizedState=fr(t,n,i,r);return}}b.flags|=e,l.memoizedState=fr(1|t,n,i,r)}function Ea(e,t){return Gr(8390656,8,e,t)}function ps(e,t){return Ol(2048,8,e,t)}function bc(e,t){return Ol(4,2,e,t)}function Wc(e,t){return Ol(4,4,e,t)}function Hc(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Qc(e,t,n){return n=n!=null?n.concat([e]):null,Ol(4,4,Hc.bind(null,t,e),n)}function ms(){}function Kc(e,t){var n=Le();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&cs(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function Xc(e,t){var n=Le();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&cs(t,r[1])?r[0]:(e=e(),n.memoizedState=[e,t],e)}function Yc(e,t,n){return Dt&21?(Fe(n,t)||(n=ec(),b.lanes|=n,Ft|=n,e.baseState=!0),t):(e.baseState&&(e.baseState=!1,he=!0),e.memoizedState=n)}function lp(e,t){var n=O;O=n!==0&&4>n?n:4,e(!0);var r=vi.transition;vi.transition={};try{e(!1),t()}finally{O=n,vi.transition=r}}function Gc(){return Le().memoizedState}function ip(e,t,n){var r=gt(e);if(n={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null},Zc(e))Jc(t,n);else if(n=Tc(e,t,n,r),n!==null){var l=de();De(n,e,r,l),qc(n,t,r)}}function op(e,t,n){var r=gt(e),l={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null};if(Zc(e))Jc(t,l);else{var i=e.alternate;if(e.lanes===0&&(i===null||i.lanes===0)&&(i=t.lastRenderedReducer,i!==null))try{var o=t.lastRenderedState,a=i(o,n);if(l.hasEagerState=!0,l.eagerState=a,Fe(a,o)){var u=t.interleaved;u===null?(l.next=l,is(t)):(l.next=u.next,u.next=l),t.interleaved=l;return}}catch{}finally{}n=Tc(e,t,l,r),n!==null&&(l=de(),De(n,e,r,l),qc(n,t,r))}}function Zc(e){var t=e.alternate;return e===b||t!==null&&t===b}function Jc(e,t){Kn=yl=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function qc(e,t,n){if(n&4194240){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,Ho(e,n)}}var xl={readContext:Pe,useCallback:oe,useContext:oe,useEffect:oe,useImperativeHandle:oe,useInsertionEffect:oe,useLayoutEffect:oe,useMemo:oe,useReducer:oe,useRef:oe,useState:oe,useDebugValue:oe,useDeferredValue:oe,useTransition:oe,useMutableSource:oe,useSyncExternalStore:oe,useId:oe,unstable_isNewReconciler:!1},sp={readContext:Pe,useCallback:function(e,t){return Be().memoizedState=[e,t===void 0?null:t],e},useContext:Pe,useEffect:Ea,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,Gr(4194308,4,Hc.bind(null,t,e),n)},useLayoutEffect:function(e,t){return Gr(4194308,4,e,t)},useInsertionEffect:function(e,t){return Gr(4,2,e,t)},useMemo:function(e,t){var n=Be();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var r=Be();return t=n!==void 0?n(t):t,r.memoizedState=r.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},r.queue=e,e=e.dispatch=ip.bind(null,b,e),[r.memoizedState,e]},useRef:function(e){var t=Be();return e={current:e},t.memoizedState=e},useState:Na,useDebugValue:ms,useDeferredValue:function(e){return Be().memoizedState=e},useTransition:function(){var e=Na(!1),t=e[0];return e=lp.bind(null,e[1]),Be().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var r=b,l=Be();if(B){if(n===void 0)throw Error(j(407));n=n()}else{if(n=t(),ne===null)throw Error(j(349));Dt&30||Dc(r,t,n)}l.memoizedState=n;var i={value:n,getSnapshot:t};return l.queue=i,Ea(Ac.bind(null,r,i,e),[e]),r.flags|=2048,fr(9,Fc.bind(null,r,i,n,t),void 0,null),n},useId:function(){var e=Be(),t=ne.identifierPrefix;if(B){var n=Ye,r=Xe;n=(r&~(1<<32-Oe(r)-1)).toString(32)+n,t=":"+t+"R"+n,n=cr++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=rp++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},ap={readContext:Pe,useCallback:Kc,useContext:Pe,useEffect:ps,useImperativeHandle:Qc,useInsertionEffect:bc,useLayoutEffect:Wc,useMemo:Xc,useReducer:yi,useRef:Vc,useState:function(){return yi(dr)},useDebugValue:ms,useDeferredValue:function(e){var t=Le();return Yc(t,Z.memoizedState,e)},useTransition:function(){var e=yi(dr)[0],t=Le().memoizedState;return[e,t]},useMutableSource:Rc,useSyncExternalStore:Oc,useId:Gc,unstable_isNewReconciler:!1},up={readContext:Pe,useCallback:Kc,useContext:Pe,useEffect:ps,useImperativeHandle:Qc,useInsertionEffect:bc,useLayoutEffect:Wc,useMemo:Xc,useReducer:xi,useRef:Vc,useState:function(){return xi(dr)},useDebugValue:ms,useDeferredValue:function(e){var t=Le();return Z===null?t.memoizedState=e:Yc(t,Z.memoizedState,e)},useTransition:function(){var e=xi(dr)[0],t=Le().memoizedState;return[e,t]},useMutableSource:Rc,useSyncExternalStore:Oc,useId:Gc,unstable_isNewReconciler:!1};function Ie(e,t){if(e&&e.defaultProps){t=W({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function so(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:W({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var Dl={isMounted:function(e){return(e=e._reactInternals)?Vt(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var r=de(),l=gt(e),i=Ge(r,l);i.payload=t,n!=null&&(i.callback=n),t=mt(e,i,l),t!==null&&(De(t,e,l,r),Xr(t,e,l))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=de(),l=gt(e),i=Ge(r,l);i.tag=1,i.payload=t,n!=null&&(i.callback=n),t=mt(e,i,l),t!==null&&(De(t,e,l,r),Xr(t,e,l))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=de(),r=gt(e),l=Ge(n,r);l.tag=2,t!=null&&(l.callback=t),t=mt(e,l,r),t!==null&&(De(t,e,r,n),Xr(t,e,r))}};function za(e,t,n,r,l,i,o){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(r,i,o):t.prototype&&t.prototype.isPureReactComponent?!lr(n,r)||!lr(l,i):!0}function ed(e,t,n){var r=!1,l=kt,i=t.contextType;return typeof i=="object"&&i!==null?i=Pe(i):(l=ve(t)?Rt:ue.current,r=t.contextTypes,i=(r=r!=null)?mn(e,l):kt),t=new t(n,i),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=Dl,e.stateNode=t,t._reactInternals=e,r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=l,e.__reactInternalMemoizedMaskedChildContext=i),t}function Ca(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&Dl.enqueueReplaceState(t,t.state,null)}function ao(e,t,n,r){var l=e.stateNode;l.props=n,l.state=e.memoizedState,l.refs={},os(e);var i=t.contextType;typeof i=="object"&&i!==null?l.context=Pe(i):(i=ve(t)?Rt:ue.current,l.context=mn(e,i)),l.state=e.memoizedState,i=t.getDerivedStateFromProps,typeof i=="function"&&(so(e,t,i,n),l.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof l.getSnapshotBeforeUpdate=="function"||typeof l.UNSAFE_componentWillMount!="function"&&typeof l.componentWillMount!="function"||(t=l.state,typeof l.componentWillMount=="function"&&l.componentWillMount(),typeof l.UNSAFE_componentWillMount=="function"&&l.UNSAFE_componentWillMount(),t!==l.state&&Dl.enqueueReplaceState(l,l.state,null),gl(e,n,l,r),l.state=e.memoizedState),typeof l.componentDidMount=="function"&&(e.flags|=4194308)}function yn(e,t){try{var n="",r=t;do n+=Df(r),r=r.return;while(r);var l=n}catch(i){l=`
Error generating stack: `+i.message+`
`+i.stack}return{value:e,source:t,stack:l,digest:null}}function wi(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function uo(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var cp=typeof WeakMap=="function"?WeakMap:Map;function td(e,t,n){n=Ge(-1,n),n.tag=3,n.payload={element:null};var r=t.value;return n.callback=function(){kl||(kl=!0,wo=r),uo(e,t)},n}function nd(e,t,n){n=Ge(-1,n),n.tag=3;var r=e.type.getDerivedStateFromError;if(typeof r=="function"){var l=t.value;n.payload=function(){return r(l)},n.callback=function(){uo(e,t)}}var i=e.stateNode;return i!==null&&typeof i.componentDidCatch=="function"&&(n.callback=function(){uo(e,t),typeof r!="function"&&(ht===null?ht=new Set([this]):ht.add(this));var o=t.stack;this.componentDidCatch(t.value,{componentStack:o!==null?o:""})}),n}function _a(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new cp;var l=new Set;r.set(t,l)}else l=r.get(t),l===void 0&&(l=new Set,r.set(t,l));l.has(n)||(l.add(n),e=Np.bind(null,e,t,n),t.then(e,e))}function Pa(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function La(e,t,n,r,l){return e.mode&1?(e.flags|=65536,e.lanes=l,e):(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=Ge(-1,1),t.tag=2,mt(n,t,1))),n.lanes|=1),e)}var dp=tt.ReactCurrentOwner,he=!1;function ce(e,t,n,r){t.child=e===null?Mc(t,null,n,r):gn(t,e.child,n,r)}function Ma(e,t,n,r,l){n=n.render;var i=t.ref;return dn(t,l),r=ds(e,t,n,r,i,l),n=fs(),e!==null&&!he?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~l,et(e,t,l)):(B&&n&&qo(t),t.flags|=1,ce(e,t,r,l),t.child)}function Ta(e,t,n,r,l){if(e===null){var i=n.type;return typeof i=="function"&&!Ss(i)&&i.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=i,rd(e,t,i,r,l)):(e=el(n.type,null,r,t,t.mode,l),e.ref=t.ref,e.return=t,t.child=e)}if(i=e.child,!(e.lanes&l)){var o=i.memoizedProps;if(n=n.compare,n=n!==null?n:lr,n(o,r)&&e.ref===t.ref)return et(e,t,l)}return t.flags|=1,e=vt(i,r),e.ref=t.ref,e.return=t,t.child=e}function rd(e,t,n,r,l){if(e!==null){var i=e.memoizedProps;if(lr(i,r)&&e.ref===t.ref)if(he=!1,t.pendingProps=r=i,(e.lanes&l)!==0)e.flags&131072&&(he=!0);else return t.lanes=e.lanes,et(e,t,l)}return co(e,t,n,r,l)}function ld(e,t,n){var r=t.pendingProps,l=r.children,i=e!==null?e.memoizedState:null;if(r.mode==="hidden")if(!(t.mode&1))t.memoizedState={baseLanes:0,cachePool:null,transitions:null},F(on,xe),xe|=n;else{if(!(n&1073741824))return e=i!==null?i.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,F(on,xe),xe|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=i!==null?i.baseLanes:n,F(on,xe),xe|=r}else i!==null?(r=i.baseLanes|n,t.memoizedState=null):r=n,F(on,xe),xe|=r;return ce(e,t,l,n),t.child}function id(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function co(e,t,n,r,l){var i=ve(n)?Rt:ue.current;return i=mn(t,i),dn(t,l),n=ds(e,t,n,r,i,l),r=fs(),e!==null&&!he?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~l,et(e,t,l)):(B&&r&&qo(t),t.flags|=1,ce(e,t,n,l),t.child)}function Ia(e,t,n,r,l){if(ve(n)){var i=!0;dl(t)}else i=!1;if(dn(t,l),t.stateNode===null)Zr(e,t),ed(t,n,r),ao(t,n,r,l),r=!0;else if(e===null){var o=t.stateNode,a=t.memoizedProps;o.props=a;var u=o.context,d=n.contextType;typeof d=="object"&&d!==null?d=Pe(d):(d=ve(n)?Rt:ue.current,d=mn(t,d));var m=n.getDerivedStateFromProps,f=typeof m=="function"||typeof o.getSnapshotBeforeUpdate=="function";f||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(a!==r||u!==d)&&Ca(t,o,r,d),lt=!1;var c=t.memoizedState;o.state=c,gl(t,r,o,l),u=t.memoizedState,a!==r||c!==u||ge.current||lt?(typeof m=="function"&&(so(t,n,m,r),u=t.memoizedState),(a=lt||za(t,n,a,r,c,u,d))?(f||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(t.flags|=4194308)):(typeof o.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=u),o.props=r,o.state=u,o.context=d,r=a):(typeof o.componentDidMount=="function"&&(t.flags|=4194308),r=!1)}else{o=t.stateNode,Ic(e,t),a=t.memoizedProps,d=t.type===t.elementType?a:Ie(t.type,a),o.props=d,f=t.pendingProps,c=o.context,u=n.contextType,typeof u=="object"&&u!==null?u=Pe(u):(u=ve(n)?Rt:ue.current,u=mn(t,u));var v=n.getDerivedStateFromProps;(m=typeof v=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(a!==f||c!==u)&&Ca(t,o,r,u),lt=!1,c=t.memoizedState,o.state=c,gl(t,r,o,l);var x=t.memoizedState;a!==f||c!==x||ge.current||lt?(typeof v=="function"&&(so(t,n,v,r),x=t.memoizedState),(d=lt||za(t,n,d,r,c,x,u)||!1)?(m||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(r,x,u),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(r,x,u)),typeof o.componentDidUpdate=="function"&&(t.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof o.componentDidUpdate!="function"||a===e.memoizedProps&&c===e.memoizedState||(t.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||a===e.memoizedProps&&c===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=x),o.props=r,o.state=x,o.context=u,r=d):(typeof o.componentDidUpdate!="function"||a===e.memoizedProps&&c===e.memoizedState||(t.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||a===e.memoizedProps&&c===e.memoizedState||(t.flags|=1024),r=!1)}return fo(e,t,n,r,i,l)}function fo(e,t,n,r,l,i){id(e,t);var o=(t.flags&128)!==0;if(!r&&!o)return l&&ya(t,n,!1),et(e,t,i);r=t.stateNode,dp.current=t;var a=o&&typeof n.getDerivedStateFromError!="function"?null:r.render();return t.flags|=1,e!==null&&o?(t.child=gn(t,e.child,null,i),t.child=gn(t,null,a,i)):ce(e,t,a,i),t.memoizedState=r.state,l&&ya(t,n,!0),t.child}function od(e){var t=e.stateNode;t.pendingContext?va(e,t.pendingContext,t.pendingContext!==t.context):t.context&&va(e,t.context,!1),ss(e,t.containerInfo)}function $a(e,t,n,r,l){return hn(),ts(l),t.flags|=256,ce(e,t,n,r),t.child}var po={dehydrated:null,treeContext:null,retryLane:0};function mo(e){return{baseLanes:e,cachePool:null,transitions:null}}function sd(e,t,n){var r=t.pendingProps,l=V.current,i=!1,o=(t.flags&128)!==0,a;if((a=o)||(a=e!==null&&e.memoizedState===null?!1:(l&2)!==0),a?(i=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(l|=1),F(V,l&1),e===null)return io(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?(t.mode&1?e.data==="$!"?t.lanes=8:t.lanes=1073741824:t.lanes=1,null):(o=r.children,e=r.fallback,i?(r=t.mode,i=t.child,o={mode:"hidden",children:o},!(r&1)&&i!==null?(i.childLanes=0,i.pendingProps=o):i=Ul(o,r,0,null),e=$t(e,r,n,null),i.return=t,e.return=t,i.sibling=e,t.child=i,t.child.memoizedState=mo(n),t.memoizedState=po,e):hs(t,o));if(l=e.memoizedState,l!==null&&(a=l.dehydrated,a!==null))return fp(e,t,o,r,a,l,n);if(i){i=r.fallback,o=t.mode,l=e.child,a=l.sibling;var u={mode:"hidden",children:r.children};return!(o&1)&&t.child!==l?(r=t.child,r.childLanes=0,r.pendingProps=u,t.deletions=null):(r=vt(l,u),r.subtreeFlags=l.subtreeFlags&14680064),a!==null?i=vt(a,i):(i=$t(i,o,n,null),i.flags|=2),i.return=t,r.return=t,r.sibling=i,t.child=r,r=i,i=t.child,o=e.child.memoizedState,o=o===null?mo(n):{baseLanes:o.baseLanes|n,cachePool:null,transitions:o.transitions},i.memoizedState=o,i.childLanes=e.childLanes&~n,t.memoizedState=po,r}return i=e.child,e=i.sibling,r=vt(i,{mode:"visible",children:r.children}),!(t.mode&1)&&(r.lanes=n),r.return=t,r.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=r,t.memoizedState=null,r}function hs(e,t){return t=Ul({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function Fr(e,t,n,r){return r!==null&&ts(r),gn(t,e.child,null,n),e=hs(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function fp(e,t,n,r,l,i,o){if(n)return t.flags&256?(t.flags&=-257,r=wi(Error(j(422))),Fr(e,t,o,r)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(i=r.fallback,l=t.mode,r=Ul({mode:"visible",children:r.children},l,0,null),i=$t(i,l,o,null),i.flags|=2,r.return=t,i.return=t,r.sibling=i,t.child=r,t.mode&1&&gn(t,e.child,null,o),t.child.memoizedState=mo(o),t.memoizedState=po,i);if(!(t.mode&1))return Fr(e,t,o,null);if(l.data==="$!"){if(r=l.nextSibling&&l.nextSibling.dataset,r)var a=r.dgst;return r=a,i=Error(j(419)),r=wi(i,r,void 0),Fr(e,t,o,r)}if(a=(o&e.childLanes)!==0,he||a){if(r=ne,r!==null){switch(o&-o){case 4:l=2;break;case 16:l=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:l=32;break;case 536870912:l=268435456;break;default:l=0}l=l&(r.suspendedLanes|o)?0:l,l!==0&&l!==i.retryLane&&(i.retryLane=l,qe(e,l),De(r,e,l,-1))}return ks(),r=wi(Error(j(421))),Fr(e,t,o,r)}return l.data==="$?"?(t.flags|=128,t.child=e.child,t=Ep.bind(null,e),l._reactRetry=t,null):(e=i.treeContext,we=pt(l.nextSibling),ke=t,B=!0,Re=null,e!==null&&(Ee[ze++]=Xe,Ee[ze++]=Ye,Ee[ze++]=Ot,Xe=e.id,Ye=e.overflow,Ot=t),t=hs(t,r.children),t.flags|=4096,t)}function Ra(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),oo(e.return,t,n)}function ki(e,t,n,r,l){var i=e.memoizedState;i===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:l}:(i.isBackwards=t,i.rendering=null,i.renderingStartTime=0,i.last=r,i.tail=n,i.tailMode=l)}function ad(e,t,n){var r=t.pendingProps,l=r.revealOrder,i=r.tail;if(ce(e,t,r.children,n),r=V.current,r&2)r=r&1|2,t.flags|=128;else{if(e!==null&&e.flags&128)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Ra(e,n,t);else if(e.tag===19)Ra(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}r&=1}if(F(V,r),!(t.mode&1))t.memoizedState=null;else switch(l){case"forwards":for(n=t.child,l=null;n!==null;)e=n.alternate,e!==null&&vl(e)===null&&(l=n),n=n.sibling;n=l,n===null?(l=t.child,t.child=null):(l=n.sibling,n.sibling=null),ki(t,!1,l,n,i);break;case"backwards":for(n=null,l=t.child,t.child=null;l!==null;){if(e=l.alternate,e!==null&&vl(e)===null){t.child=l;break}e=l.sibling,l.sibling=n,n=l,l=e}ki(t,!0,n,null,i);break;case"together":ki(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function Zr(e,t){!(t.mode&1)&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function et(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Ft|=t.lanes,!(n&t.childLanes))return null;if(e!==null&&t.child!==e.child)throw Error(j(153));if(t.child!==null){for(e=t.child,n=vt(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=vt(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function pp(e,t,n){switch(t.tag){case 3:od(t),hn();break;case 5:$c(t);break;case 1:ve(t.type)&&dl(t);break;case 4:ss(t,t.stateNode.containerInfo);break;case 10:var r=t.type._context,l=t.memoizedProps.value;F(ml,r._currentValue),r._currentValue=l;break;case 13:if(r=t.memoizedState,r!==null)return r.dehydrated!==null?(F(V,V.current&1),t.flags|=128,null):n&t.child.childLanes?sd(e,t,n):(F(V,V.current&1),e=et(e,t,n),e!==null?e.sibling:null);F(V,V.current&1);break;case 19:if(r=(n&t.childLanes)!==0,e.flags&128){if(r)return ad(e,t,n);t.flags|=128}if(l=t.memoizedState,l!==null&&(l.rendering=null,l.tail=null,l.lastEffect=null),F(V,V.current),r)break;return null;case 22:case 23:return t.lanes=0,ld(e,t,n)}return et(e,t,n)}var ud,ho,cd,dd;ud=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};ho=function(){};cd=function(e,t,n,r){var l=e.memoizedProps;if(l!==r){e=t.stateNode,Tt(We.current);var i=null;switch(n){case"input":l=Oi(e,l),r=Oi(e,r),i=[];break;case"select":l=W({},l,{value:void 0}),r=W({},r,{value:void 0}),i=[];break;case"textarea":l=Ai(e,l),r=Ai(e,r),i=[];break;default:typeof l.onClick!="function"&&typeof r.onClick=="function"&&(e.onclick=ul)}Bi(n,r);var o;n=null;for(d in l)if(!r.hasOwnProperty(d)&&l.hasOwnProperty(d)&&l[d]!=null)if(d==="style"){var a=l[d];for(o in a)a.hasOwnProperty(o)&&(n||(n={}),n[o]="")}else d!=="dangerouslySetInnerHTML"&&d!=="children"&&d!=="suppressContentEditableWarning"&&d!=="suppressHydrationWarning"&&d!=="autoFocus"&&(Zn.hasOwnProperty(d)?i||(i=[]):(i=i||[]).push(d,null));for(d in r){var u=r[d];if(a=l!=null?l[d]:void 0,r.hasOwnProperty(d)&&u!==a&&(u!=null||a!=null))if(d==="style")if(a){for(o in a)!a.hasOwnProperty(o)||u&&u.hasOwnProperty(o)||(n||(n={}),n[o]="");for(o in u)u.hasOwnProperty(o)&&a[o]!==u[o]&&(n||(n={}),n[o]=u[o])}else n||(i||(i=[]),i.push(d,n)),n=u;else d==="dangerouslySetInnerHTML"?(u=u?u.__html:void 0,a=a?a.__html:void 0,u!=null&&a!==u&&(i=i||[]).push(d,u)):d==="children"?typeof u!="string"&&typeof u!="number"||(i=i||[]).push(d,""+u):d!=="suppressContentEditableWarning"&&d!=="suppressHydrationWarning"&&(Zn.hasOwnProperty(d)?(u!=null&&d==="onScroll"&&A("scroll",e),i||a===u||(i=[])):(i=i||[]).push(d,u))}n&&(i=i||[]).push("style",n);var d=i;(t.updateQueue=d)&&(t.flags|=4)}};dd=function(e,t,n,r){n!==r&&(t.flags|=4)};function $n(e,t){if(!B)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function se(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var l=e.child;l!==null;)n|=l.lanes|l.childLanes,r|=l.subtreeFlags&14680064,r|=l.flags&14680064,l.return=e,l=l.sibling;else for(l=e.child;l!==null;)n|=l.lanes|l.childLanes,r|=l.subtreeFlags,r|=l.flags,l.return=e,l=l.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function mp(e,t,n){var r=t.pendingProps;switch(es(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return se(t),null;case 1:return ve(t.type)&&cl(),se(t),null;case 3:return r=t.stateNode,vn(),U(ge),U(ue),us(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(e===null||e.child===null)&&(Or(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,Re!==null&&(jo(Re),Re=null))),ho(e,t),se(t),null;case 5:as(t);var l=Tt(ur.current);if(n=t.type,e!==null&&t.stateNode!=null)cd(e,t,n,r,l),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!r){if(t.stateNode===null)throw Error(j(166));return se(t),null}if(e=Tt(We.current),Or(t)){r=t.stateNode,n=t.type;var i=t.memoizedProps;switch(r[Ve]=t,r[sr]=i,e=(t.mode&1)!==0,n){case"dialog":A("cancel",r),A("close",r);break;case"iframe":case"object":case"embed":A("load",r);break;case"video":case"audio":for(l=0;l<Bn.length;l++)A(Bn[l],r);break;case"source":A("error",r);break;case"img":case"image":case"link":A("error",r),A("load",r);break;case"details":A("toggle",r);break;case"input":Ws(r,i),A("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!i.multiple},A("invalid",r);break;case"textarea":Qs(r,i),A("invalid",r)}Bi(n,i),l=null;for(var o in i)if(i.hasOwnProperty(o)){var a=i[o];o==="children"?typeof a=="string"?r.textContent!==a&&(i.suppressHydrationWarning!==!0&&Rr(r.textContent,a,e),l=["children",a]):typeof a=="number"&&r.textContent!==""+a&&(i.suppressHydrationWarning!==!0&&Rr(r.textContent,a,e),l=["children",""+a]):Zn.hasOwnProperty(o)&&a!=null&&o==="onScroll"&&A("scroll",r)}switch(n){case"input":Cr(r),Hs(r,i,!0);break;case"textarea":Cr(r),Ks(r);break;case"select":case"option":break;default:typeof i.onClick=="function"&&(r.onclick=ul)}r=l,t.updateQueue=r,r!==null&&(t.flags|=4)}else{o=l.nodeType===9?l:l.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=Au(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=o.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof r.is=="string"?e=o.createElement(n,{is:r.is}):(e=o.createElement(n),n==="select"&&(o=e,r.multiple?o.multiple=!0:r.size&&(o.size=r.size))):e=o.createElementNS(e,n),e[Ve]=t,e[sr]=r,ud(e,t,!1,!1),t.stateNode=e;e:{switch(o=Vi(n,r),n){case"dialog":A("cancel",e),A("close",e),l=r;break;case"iframe":case"object":case"embed":A("load",e),l=r;break;case"video":case"audio":for(l=0;l<Bn.length;l++)A(Bn[l],e);l=r;break;case"source":A("error",e),l=r;break;case"img":case"image":case"link":A("error",e),A("load",e),l=r;break;case"details":A("toggle",e),l=r;break;case"input":Ws(e,r),l=Oi(e,r),A("invalid",e);break;case"option":l=r;break;case"select":e._wrapperState={wasMultiple:!!r.multiple},l=W({},r,{value:void 0}),A("invalid",e);break;case"textarea":Qs(e,r),l=Ai(e,r),A("invalid",e);break;default:l=r}Bi(n,l),a=l;for(i in a)if(a.hasOwnProperty(i)){var u=a[i];i==="style"?Vu(e,u):i==="dangerouslySetInnerHTML"?(u=u?u.__html:void 0,u!=null&&Uu(e,u)):i==="children"?typeof u=="string"?(n!=="textarea"||u!=="")&&Jn(e,u):typeof u=="number"&&Jn(e,""+u):i!=="suppressContentEditableWarning"&&i!=="suppressHydrationWarning"&&i!=="autoFocus"&&(Zn.hasOwnProperty(i)?u!=null&&i==="onScroll"&&A("scroll",e):u!=null&&Ao(e,i,u,o))}switch(n){case"input":Cr(e),Hs(e,r,!1);break;case"textarea":Cr(e),Ks(e);break;case"option":r.value!=null&&e.setAttribute("value",""+wt(r.value));break;case"select":e.multiple=!!r.multiple,i=r.value,i!=null?sn(e,!!r.multiple,i,!1):r.defaultValue!=null&&sn(e,!!r.multiple,r.defaultValue,!0);break;default:typeof l.onClick=="function"&&(e.onclick=ul)}switch(n){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return se(t),null;case 6:if(e&&t.stateNode!=null)dd(e,t,e.memoizedProps,r);else{if(typeof r!="string"&&t.stateNode===null)throw Error(j(166));if(n=Tt(ur.current),Tt(We.current),Or(t)){if(r=t.stateNode,n=t.memoizedProps,r[Ve]=t,(i=r.nodeValue!==n)&&(e=ke,e!==null))switch(e.tag){case 3:Rr(r.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&Rr(r.nodeValue,n,(e.mode&1)!==0)}i&&(t.flags|=4)}else r=(n.nodeType===9?n:n.ownerDocument).createTextNode(r),r[Ve]=t,t.stateNode=r}return se(t),null;case 13:if(U(V),r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(B&&we!==null&&t.mode&1&&!(t.flags&128))Pc(),hn(),t.flags|=98560,i=!1;else if(i=Or(t),r!==null&&r.dehydrated!==null){if(e===null){if(!i)throw Error(j(318));if(i=t.memoizedState,i=i!==null?i.dehydrated:null,!i)throw Error(j(317));i[Ve]=t}else hn(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;se(t),i=!1}else Re!==null&&(jo(Re),Re=null),i=!0;if(!i)return t.flags&65536?t:null}return t.flags&128?(t.lanes=n,t):(r=r!==null,r!==(e!==null&&e.memoizedState!==null)&&r&&(t.child.flags|=8192,t.mode&1&&(e===null||V.current&1?q===0&&(q=3):ks())),t.updateQueue!==null&&(t.flags|=4),se(t),null);case 4:return vn(),ho(e,t),e===null&&ir(t.stateNode.containerInfo),se(t),null;case 10:return ls(t.type._context),se(t),null;case 17:return ve(t.type)&&cl(),se(t),null;case 19:if(U(V),i=t.memoizedState,i===null)return se(t),null;if(r=(t.flags&128)!==0,o=i.rendering,o===null)if(r)$n(i,!1);else{if(q!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(o=vl(e),o!==null){for(t.flags|=128,$n(i,!1),r=o.updateQueue,r!==null&&(t.updateQueue=r,t.flags|=4),t.subtreeFlags=0,r=n,n=t.child;n!==null;)i=n,e=r,i.flags&=14680066,o=i.alternate,o===null?(i.childLanes=0,i.lanes=e,i.child=null,i.subtreeFlags=0,i.memoizedProps=null,i.memoizedState=null,i.updateQueue=null,i.dependencies=null,i.stateNode=null):(i.childLanes=o.childLanes,i.lanes=o.lanes,i.child=o.child,i.subtreeFlags=0,i.deletions=null,i.memoizedProps=o.memoizedProps,i.memoizedState=o.memoizedState,i.updateQueue=o.updateQueue,i.type=o.type,e=o.dependencies,i.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return F(V,V.current&1|2),t.child}e=e.sibling}i.tail!==null&&X()>xn&&(t.flags|=128,r=!0,$n(i,!1),t.lanes=4194304)}else{if(!r)if(e=vl(o),e!==null){if(t.flags|=128,r=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),$n(i,!0),i.tail===null&&i.tailMode==="hidden"&&!o.alternate&&!B)return se(t),null}else 2*X()-i.renderingStartTime>xn&&n!==1073741824&&(t.flags|=128,r=!0,$n(i,!1),t.lanes=4194304);i.isBackwards?(o.sibling=t.child,t.child=o):(n=i.last,n!==null?n.sibling=o:t.child=o,i.last=o)}return i.tail!==null?(t=i.tail,i.rendering=t,i.tail=t.sibling,i.renderingStartTime=X(),t.sibling=null,n=V.current,F(V,r?n&1|2:n&1),t):(se(t),null);case 22:case 23:return ws(),r=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==r&&(t.flags|=8192),r&&t.mode&1?xe&1073741824&&(se(t),t.subtreeFlags&6&&(t.flags|=8192)):se(t),null;case 24:return null;case 25:return null}throw Error(j(156,t.tag))}function hp(e,t){switch(es(t),t.tag){case 1:return ve(t.type)&&cl(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return vn(),U(ge),U(ue),us(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 5:return as(t),null;case 13:if(U(V),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(j(340));hn()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return U(V),null;case 4:return vn(),null;case 10:return ls(t.type._context),null;case 22:case 23:return ws(),null;case 24:return null;default:return null}}var Ar=!1,ae=!1,gp=typeof WeakSet=="function"?WeakSet:Set,E=null;function ln(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(r){H(e,t,r)}else n.current=null}function go(e,t,n){try{n()}catch(r){H(e,t,r)}}var Oa=!1;function vp(e,t){if(Ji=ol,e=gc(),Jo(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var l=r.anchorOffset,i=r.focusNode;r=r.focusOffset;try{n.nodeType,i.nodeType}catch{n=null;break e}var o=0,a=-1,u=-1,d=0,m=0,f=e,c=null;t:for(;;){for(var v;f!==n||l!==0&&f.nodeType!==3||(a=o+l),f!==i||r!==0&&f.nodeType!==3||(u=o+r),f.nodeType===3&&(o+=f.nodeValue.length),(v=f.firstChild)!==null;)c=f,f=v;for(;;){if(f===e)break t;if(c===n&&++d===l&&(a=o),c===i&&++m===r&&(u=o),(v=f.nextSibling)!==null)break;f=c,c=f.parentNode}f=v}n=a===-1||u===-1?null:{start:a,end:u}}else n=null}n=n||{start:0,end:0}}else n=null;for(qi={focusedElem:e,selectionRange:n},ol=!1,E=t;E!==null;)if(t=E,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,E=e;else for(;E!==null;){t=E;try{var x=t.alternate;if(t.flags&1024)switch(t.tag){case 0:case 11:case 15:break;case 1:if(x!==null){var y=x.memoizedProps,S=x.memoizedState,h=t.stateNode,p=h.getSnapshotBeforeUpdate(t.elementType===t.type?y:Ie(t.type,y),S);h.__reactInternalSnapshotBeforeUpdate=p}break;case 3:var g=t.stateNode.containerInfo;g.nodeType===1?g.textContent="":g.nodeType===9&&g.documentElement&&g.removeChild(g.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(j(163))}}catch(w){H(t,t.return,w)}if(e=t.sibling,e!==null){e.return=t.return,E=e;break}E=t.return}return x=Oa,Oa=!1,x}function Xn(e,t,n){var r=t.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var l=r=r.next;do{if((l.tag&e)===e){var i=l.destroy;l.destroy=void 0,i!==void 0&&go(t,n,i)}l=l.next}while(l!==r)}}function Fl(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var r=n.create;n.destroy=r()}n=n.next}while(n!==t)}}function vo(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t=="function"?t(e):t.current=e}}function fd(e){var t=e.alternate;t!==null&&(e.alternate=null,fd(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[Ve],delete t[sr],delete t[no],delete t[q1],delete t[ep])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function pd(e){return e.tag===5||e.tag===3||e.tag===4}function Da(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||pd(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function yo(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=ul));else if(r!==4&&(e=e.child,e!==null))for(yo(e,t,n),e=e.sibling;e!==null;)yo(e,t,n),e=e.sibling}function xo(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(r!==4&&(e=e.child,e!==null))for(xo(e,t,n),e=e.sibling;e!==null;)xo(e,t,n),e=e.sibling}var re=null,$e=!1;function nt(e,t,n){for(n=n.child;n!==null;)md(e,t,n),n=n.sibling}function md(e,t,n){if(be&&typeof be.onCommitFiberUnmount=="function")try{be.onCommitFiberUnmount(Ll,n)}catch{}switch(n.tag){case 5:ae||ln(n,t);case 6:var r=re,l=$e;re=null,nt(e,t,n),re=r,$e=l,re!==null&&($e?(e=re,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):re.removeChild(n.stateNode));break;case 18:re!==null&&($e?(e=re,n=n.stateNode,e.nodeType===8?mi(e.parentNode,n):e.nodeType===1&&mi(e,n),nr(e)):mi(re,n.stateNode));break;case 4:r=re,l=$e,re=n.stateNode.containerInfo,$e=!0,nt(e,t,n),re=r,$e=l;break;case 0:case 11:case 14:case 15:if(!ae&&(r=n.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){l=r=r.next;do{var i=l,o=i.destroy;i=i.tag,o!==void 0&&(i&2||i&4)&&go(n,t,o),l=l.next}while(l!==r)}nt(e,t,n);break;case 1:if(!ae&&(ln(n,t),r=n.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=n.memoizedProps,r.state=n.memoizedState,r.componentWillUnmount()}catch(a){H(n,t,a)}nt(e,t,n);break;case 21:nt(e,t,n);break;case 22:n.mode&1?(ae=(r=ae)||n.memoizedState!==null,nt(e,t,n),ae=r):nt(e,t,n);break;default:nt(e,t,n)}}function Fa(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new gp),t.forEach(function(r){var l=zp.bind(null,e,r);n.has(r)||(n.add(r),r.then(l,l))})}}function Te(e,t){var n=t.deletions;if(n!==null)for(var r=0;r<n.length;r++){var l=n[r];try{var i=e,o=t,a=o;e:for(;a!==null;){switch(a.tag){case 5:re=a.stateNode,$e=!1;break e;case 3:re=a.stateNode.containerInfo,$e=!0;break e;case 4:re=a.stateNode.containerInfo,$e=!0;break e}a=a.return}if(re===null)throw Error(j(160));md(i,o,l),re=null,$e=!1;var u=l.alternate;u!==null&&(u.return=null),l.return=null}catch(d){H(l,t,d)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)hd(t,e),t=t.sibling}function hd(e,t){var n=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(Te(t,e),Ae(e),r&4){try{Xn(3,e,e.return),Fl(3,e)}catch(y){H(e,e.return,y)}try{Xn(5,e,e.return)}catch(y){H(e,e.return,y)}}break;case 1:Te(t,e),Ae(e),r&512&&n!==null&&ln(n,n.return);break;case 5:if(Te(t,e),Ae(e),r&512&&n!==null&&ln(n,n.return),e.flags&32){var l=e.stateNode;try{Jn(l,"")}catch(y){H(e,e.return,y)}}if(r&4&&(l=e.stateNode,l!=null)){var i=e.memoizedProps,o=n!==null?n.memoizedProps:i,a=e.type,u=e.updateQueue;if(e.updateQueue=null,u!==null)try{a==="input"&&i.type==="radio"&&i.name!=null&&Du(l,i),Vi(a,o);var d=Vi(a,i);for(o=0;o<u.length;o+=2){var m=u[o],f=u[o+1];m==="style"?Vu(l,f):m==="dangerouslySetInnerHTML"?Uu(l,f):m==="children"?Jn(l,f):Ao(l,m,f,d)}switch(a){case"input":Di(l,i);break;case"textarea":Fu(l,i);break;case"select":var c=l._wrapperState.wasMultiple;l._wrapperState.wasMultiple=!!i.multiple;var v=i.value;v!=null?sn(l,!!i.multiple,v,!1):c!==!!i.multiple&&(i.defaultValue!=null?sn(l,!!i.multiple,i.defaultValue,!0):sn(l,!!i.multiple,i.multiple?[]:"",!1))}l[sr]=i}catch(y){H(e,e.return,y)}}break;case 6:if(Te(t,e),Ae(e),r&4){if(e.stateNode===null)throw Error(j(162));l=e.stateNode,i=e.memoizedProps;try{l.nodeValue=i}catch(y){H(e,e.return,y)}}break;case 3:if(Te(t,e),Ae(e),r&4&&n!==null&&n.memoizedState.isDehydrated)try{nr(t.containerInfo)}catch(y){H(e,e.return,y)}break;case 4:Te(t,e),Ae(e);break;case 13:Te(t,e),Ae(e),l=e.child,l.flags&8192&&(i=l.memoizedState!==null,l.stateNode.isHidden=i,!i||l.alternate!==null&&l.alternate.memoizedState!==null||(ys=X())),r&4&&Fa(e);break;case 22:if(m=n!==null&&n.memoizedState!==null,e.mode&1?(ae=(d=ae)||m,Te(t,e),ae=d):Te(t,e),Ae(e),r&8192){if(d=e.memoizedState!==null,(e.stateNode.isHidden=d)&&!m&&e.mode&1)for(E=e,m=e.child;m!==null;){for(f=E=m;E!==null;){switch(c=E,v=c.child,c.tag){case 0:case 11:case 14:case 15:Xn(4,c,c.return);break;case 1:ln(c,c.return);var x=c.stateNode;if(typeof x.componentWillUnmount=="function"){r=c,n=c.return;try{t=r,x.props=t.memoizedProps,x.state=t.memoizedState,x.componentWillUnmount()}catch(y){H(r,n,y)}}break;case 5:ln(c,c.return);break;case 22:if(c.memoizedState!==null){Ua(f);continue}}v!==null?(v.return=c,E=v):Ua(f)}m=m.sibling}e:for(m=null,f=e;;){if(f.tag===5){if(m===null){m=f;try{l=f.stateNode,d?(i=l.style,typeof i.setProperty=="function"?i.setProperty("display","none","important"):i.display="none"):(a=f.stateNode,u=f.memoizedProps.style,o=u!=null&&u.hasOwnProperty("display")?u.display:null,a.style.display=Bu("display",o))}catch(y){H(e,e.return,y)}}}else if(f.tag===6){if(m===null)try{f.stateNode.nodeValue=d?"":f.memoizedProps}catch(y){H(e,e.return,y)}}else if((f.tag!==22&&f.tag!==23||f.memoizedState===null||f===e)&&f.child!==null){f.child.return=f,f=f.child;continue}if(f===e)break e;for(;f.sibling===null;){if(f.return===null||f.return===e)break e;m===f&&(m=null),f=f.return}m===f&&(m=null),f.sibling.return=f.return,f=f.sibling}}break;case 19:Te(t,e),Ae(e),r&4&&Fa(e);break;case 21:break;default:Te(t,e),Ae(e)}}function Ae(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(pd(n)){var r=n;break e}n=n.return}throw Error(j(160))}switch(r.tag){case 5:var l=r.stateNode;r.flags&32&&(Jn(l,""),r.flags&=-33);var i=Da(e);xo(e,i,l);break;case 3:case 4:var o=r.stateNode.containerInfo,a=Da(e);yo(e,a,o);break;default:throw Error(j(161))}}catch(u){H(e,e.return,u)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function yp(e,t,n){E=e,gd(e)}function gd(e,t,n){for(var r=(e.mode&1)!==0;E!==null;){var l=E,i=l.child;if(l.tag===22&&r){var o=l.memoizedState!==null||Ar;if(!o){var a=l.alternate,u=a!==null&&a.memoizedState!==null||ae;a=Ar;var d=ae;if(Ar=o,(ae=u)&&!d)for(E=l;E!==null;)o=E,u=o.child,o.tag===22&&o.memoizedState!==null?Ba(l):u!==null?(u.return=o,E=u):Ba(l);for(;i!==null;)E=i,gd(i),i=i.sibling;E=l,Ar=a,ae=d}Aa(e)}else l.subtreeFlags&8772&&i!==null?(i.return=l,E=i):Aa(e)}}function Aa(e){for(;E!==null;){var t=E;if(t.flags&8772){var n=t.alternate;try{if(t.flags&8772)switch(t.tag){case 0:case 11:case 15:ae||Fl(5,t);break;case 1:var r=t.stateNode;if(t.flags&4&&!ae)if(n===null)r.componentDidMount();else{var l=t.elementType===t.type?n.memoizedProps:Ie(t.type,n.memoizedProps);r.componentDidUpdate(l,n.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var i=t.updateQueue;i!==null&&ja(t,i,r);break;case 3:var o=t.updateQueue;if(o!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}ja(t,o,n)}break;case 5:var a=t.stateNode;if(n===null&&t.flags&4){n=a;var u=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":u.autoFocus&&n.focus();break;case"img":u.src&&(n.src=u.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var d=t.alternate;if(d!==null){var m=d.memoizedState;if(m!==null){var f=m.dehydrated;f!==null&&nr(f)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(j(163))}ae||t.flags&512&&vo(t)}catch(c){H(t,t.return,c)}}if(t===e){E=null;break}if(n=t.sibling,n!==null){n.return=t.return,E=n;break}E=t.return}}function Ua(e){for(;E!==null;){var t=E;if(t===e){E=null;break}var n=t.sibling;if(n!==null){n.return=t.return,E=n;break}E=t.return}}function Ba(e){for(;E!==null;){var t=E;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{Fl(4,t)}catch(u){H(t,n,u)}break;case 1:var r=t.stateNode;if(typeof r.componentDidMount=="function"){var l=t.return;try{r.componentDidMount()}catch(u){H(t,l,u)}}var i=t.return;try{vo(t)}catch(u){H(t,i,u)}break;case 5:var o=t.return;try{vo(t)}catch(u){H(t,o,u)}}}catch(u){H(t,t.return,u)}if(t===e){E=null;break}var a=t.sibling;if(a!==null){a.return=t.return,E=a;break}E=t.return}}var xp=Math.ceil,wl=tt.ReactCurrentDispatcher,gs=tt.ReactCurrentOwner,_e=tt.ReactCurrentBatchConfig,$=0,ne=null,Y=null,le=0,xe=0,on=jt(0),q=0,pr=null,Ft=0,Al=0,vs=0,Yn=null,me=null,ys=0,xn=1/0,Qe=null,kl=!1,wo=null,ht=null,Ur=!1,at=null,Sl=0,Gn=0,ko=null,Jr=-1,qr=0;function de(){return $&6?X():Jr!==-1?Jr:Jr=X()}function gt(e){return e.mode&1?$&2&&le!==0?le&-le:np.transition!==null?(qr===0&&(qr=ec()),qr):(e=O,e!==0||(e=window.event,e=e===void 0?16:sc(e.type)),e):1}function De(e,t,n,r){if(50<Gn)throw Gn=0,ko=null,Error(j(185));vr(e,n,r),(!($&2)||e!==ne)&&(e===ne&&(!($&2)&&(Al|=n),q===4&&ot(e,le)),ye(e,r),n===1&&$===0&&!(t.mode&1)&&(xn=X()+500,Rl&&Nt()))}function ye(e,t){var n=e.callbackNode;n1(e,t);var r=il(e,e===ne?le:0);if(r===0)n!==null&&Gs(n),e.callbackNode=null,e.callbackPriority=0;else if(t=r&-r,e.callbackPriority!==t){if(n!=null&&Gs(n),t===1)e.tag===0?tp(Va.bind(null,e)):zc(Va.bind(null,e)),Z1(function(){!($&6)&&Nt()}),n=null;else{switch(tc(r)){case 1:n=Wo;break;case 4:n=Ju;break;case 16:n=ll;break;case 536870912:n=qu;break;default:n=ll}n=Nd(n,vd.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function vd(e,t){if(Jr=-1,qr=0,$&6)throw Error(j(327));var n=e.callbackNode;if(fn()&&e.callbackNode!==n)return null;var r=il(e,e===ne?le:0);if(r===0)return null;if(r&30||r&e.expiredLanes||t)t=jl(e,r);else{t=r;var l=$;$|=2;var i=xd();(ne!==e||le!==t)&&(Qe=null,xn=X()+500,It(e,t));do try{Sp();break}catch(a){yd(e,a)}while(!0);rs(),wl.current=i,$=l,Y!==null?t=0:(ne=null,le=0,t=q)}if(t!==0){if(t===2&&(l=Ki(e),l!==0&&(r=l,t=So(e,l))),t===1)throw n=pr,It(e,0),ot(e,r),ye(e,X()),n;if(t===6)ot(e,r);else{if(l=e.current.alternate,!(r&30)&&!wp(l)&&(t=jl(e,r),t===2&&(i=Ki(e),i!==0&&(r=i,t=So(e,i))),t===1))throw n=pr,It(e,0),ot(e,r),ye(e,X()),n;switch(e.finishedWork=l,e.finishedLanes=r,t){case 0:case 1:throw Error(j(345));case 2:Pt(e,me,Qe);break;case 3:if(ot(e,r),(r&130023424)===r&&(t=ys+500-X(),10<t)){if(il(e,0)!==0)break;if(l=e.suspendedLanes,(l&r)!==r){de(),e.pingedLanes|=e.suspendedLanes&l;break}e.timeoutHandle=to(Pt.bind(null,e,me,Qe),t);break}Pt(e,me,Qe);break;case 4:if(ot(e,r),(r&4194240)===r)break;for(t=e.eventTimes,l=-1;0<r;){var o=31-Oe(r);i=1<<o,o=t[o],o>l&&(l=o),r&=~i}if(r=l,r=X()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*xp(r/1960))-r,10<r){e.timeoutHandle=to(Pt.bind(null,e,me,Qe),r);break}Pt(e,me,Qe);break;case 5:Pt(e,me,Qe);break;default:throw Error(j(329))}}}return ye(e,X()),e.callbackNode===n?vd.bind(null,e):null}function So(e,t){var n=Yn;return e.current.memoizedState.isDehydrated&&(It(e,t).flags|=256),e=jl(e,t),e!==2&&(t=me,me=n,t!==null&&jo(t)),e}function jo(e){me===null?me=e:me.push.apply(me,e)}function wp(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var r=0;r<n.length;r++){var l=n[r],i=l.getSnapshot;l=l.value;try{if(!Fe(i(),l))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function ot(e,t){for(t&=~vs,t&=~Al,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-Oe(t),r=1<<n;e[n]=-1,t&=~r}}function Va(e){if($&6)throw Error(j(327));fn();var t=il(e,0);if(!(t&1))return ye(e,X()),null;var n=jl(e,t);if(e.tag!==0&&n===2){var r=Ki(e);r!==0&&(t=r,n=So(e,r))}if(n===1)throw n=pr,It(e,0),ot(e,t),ye(e,X()),n;if(n===6)throw Error(j(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,Pt(e,me,Qe),ye(e,X()),null}function xs(e,t){var n=$;$|=1;try{return e(t)}finally{$=n,$===0&&(xn=X()+500,Rl&&Nt())}}function At(e){at!==null&&at.tag===0&&!($&6)&&fn();var t=$;$|=1;var n=_e.transition,r=O;try{if(_e.transition=null,O=1,e)return e()}finally{O=r,_e.transition=n,$=t,!($&6)&&Nt()}}function ws(){xe=on.current,U(on)}function It(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,G1(n)),Y!==null)for(n=Y.return;n!==null;){var r=n;switch(es(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&cl();break;case 3:vn(),U(ge),U(ue),us();break;case 5:as(r);break;case 4:vn();break;case 13:U(V);break;case 19:U(V);break;case 10:ls(r.type._context);break;case 22:case 23:ws()}n=n.return}if(ne=e,Y=e=vt(e.current,null),le=xe=t,q=0,pr=null,vs=Al=Ft=0,me=Yn=null,Mt!==null){for(t=0;t<Mt.length;t++)if(n=Mt[t],r=n.interleaved,r!==null){n.interleaved=null;var l=r.next,i=n.pending;if(i!==null){var o=i.next;i.next=l,r.next=o}n.pending=r}Mt=null}return e}function yd(e,t){do{var n=Y;try{if(rs(),Yr.current=xl,yl){for(var r=b.memoizedState;r!==null;){var l=r.queue;l!==null&&(l.pending=null),r=r.next}yl=!1}if(Dt=0,te=Z=b=null,Kn=!1,cr=0,gs.current=null,n===null||n.return===null){q=1,pr=t,Y=null;break}e:{var i=e,o=n.return,a=n,u=t;if(t=le,a.flags|=32768,u!==null&&typeof u=="object"&&typeof u.then=="function"){var d=u,m=a,f=m.tag;if(!(m.mode&1)&&(f===0||f===11||f===15)){var c=m.alternate;c?(m.updateQueue=c.updateQueue,m.memoizedState=c.memoizedState,m.lanes=c.lanes):(m.updateQueue=null,m.memoizedState=null)}var v=Pa(o);if(v!==null){v.flags&=-257,La(v,o,a,i,t),v.mode&1&&_a(i,d,t),t=v,u=d;var x=t.updateQueue;if(x===null){var y=new Set;y.add(u),t.updateQueue=y}else x.add(u);break e}else{if(!(t&1)){_a(i,d,t),ks();break e}u=Error(j(426))}}else if(B&&a.mode&1){var S=Pa(o);if(S!==null){!(S.flags&65536)&&(S.flags|=256),La(S,o,a,i,t),ts(yn(u,a));break e}}i=u=yn(u,a),q!==4&&(q=2),Yn===null?Yn=[i]:Yn.push(i),i=o;do{switch(i.tag){case 3:i.flags|=65536,t&=-t,i.lanes|=t;var h=td(i,u,t);Sa(i,h);break e;case 1:a=u;var p=i.type,g=i.stateNode;if(!(i.flags&128)&&(typeof p.getDerivedStateFromError=="function"||g!==null&&typeof g.componentDidCatch=="function"&&(ht===null||!ht.has(g)))){i.flags|=65536,t&=-t,i.lanes|=t;var w=nd(i,a,t);Sa(i,w);break e}}i=i.return}while(i!==null)}kd(n)}catch(N){t=N,Y===n&&n!==null&&(Y=n=n.return);continue}break}while(!0)}function xd(){var e=wl.current;return wl.current=xl,e===null?xl:e}function ks(){(q===0||q===3||q===2)&&(q=4),ne===null||!(Ft&268435455)&&!(Al&268435455)||ot(ne,le)}function jl(e,t){var n=$;$|=2;var r=xd();(ne!==e||le!==t)&&(Qe=null,It(e,t));do try{kp();break}catch(l){yd(e,l)}while(!0);if(rs(),$=n,wl.current=r,Y!==null)throw Error(j(261));return ne=null,le=0,q}function kp(){for(;Y!==null;)wd(Y)}function Sp(){for(;Y!==null&&!Kf();)wd(Y)}function wd(e){var t=jd(e.alternate,e,xe);e.memoizedProps=e.pendingProps,t===null?kd(e):Y=t,gs.current=null}function kd(e){var t=e;do{var n=t.alternate;if(e=t.return,t.flags&32768){if(n=hp(n,t),n!==null){n.flags&=32767,Y=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{q=6,Y=null;return}}else if(n=mp(n,t,xe),n!==null){Y=n;return}if(t=t.sibling,t!==null){Y=t;return}Y=t=e}while(t!==null);q===0&&(q=5)}function Pt(e,t,n){var r=O,l=_e.transition;try{_e.transition=null,O=1,jp(e,t,n,r)}finally{_e.transition=l,O=r}return null}function jp(e,t,n,r){do fn();while(at!==null);if($&6)throw Error(j(327));n=e.finishedWork;var l=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(j(177));e.callbackNode=null,e.callbackPriority=0;var i=n.lanes|n.childLanes;if(r1(e,i),e===ne&&(Y=ne=null,le=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||Ur||(Ur=!0,Nd(ll,function(){return fn(),null})),i=(n.flags&15990)!==0,n.subtreeFlags&15990||i){i=_e.transition,_e.transition=null;var o=O;O=1;var a=$;$|=4,gs.current=null,vp(e,n),hd(n,e),b1(qi),ol=!!Ji,qi=Ji=null,e.current=n,yp(n),Xf(),$=a,O=o,_e.transition=i}else e.current=n;if(Ur&&(Ur=!1,at=e,Sl=l),i=e.pendingLanes,i===0&&(ht=null),Zf(n.stateNode),ye(e,X()),t!==null)for(r=e.onRecoverableError,n=0;n<t.length;n++)l=t[n],r(l.value,{componentStack:l.stack,digest:l.digest});if(kl)throw kl=!1,e=wo,wo=null,e;return Sl&1&&e.tag!==0&&fn(),i=e.pendingLanes,i&1?e===ko?Gn++:(Gn=0,ko=e):Gn=0,Nt(),null}function fn(){if(at!==null){var e=tc(Sl),t=_e.transition,n=O;try{if(_e.transition=null,O=16>e?16:e,at===null)var r=!1;else{if(e=at,at=null,Sl=0,$&6)throw Error(j(331));var l=$;for($|=4,E=e.current;E!==null;){var i=E,o=i.child;if(E.flags&16){var a=i.deletions;if(a!==null){for(var u=0;u<a.length;u++){var d=a[u];for(E=d;E!==null;){var m=E;switch(m.tag){case 0:case 11:case 15:Xn(8,m,i)}var f=m.child;if(f!==null)f.return=m,E=f;else for(;E!==null;){m=E;var c=m.sibling,v=m.return;if(fd(m),m===d){E=null;break}if(c!==null){c.return=v,E=c;break}E=v}}}var x=i.alternate;if(x!==null){var y=x.child;if(y!==null){x.child=null;do{var S=y.sibling;y.sibling=null,y=S}while(y!==null)}}E=i}}if(i.subtreeFlags&2064&&o!==null)o.return=i,E=o;else e:for(;E!==null;){if(i=E,i.flags&2048)switch(i.tag){case 0:case 11:case 15:Xn(9,i,i.return)}var h=i.sibling;if(h!==null){h.return=i.return,E=h;break e}E=i.return}}var p=e.current;for(E=p;E!==null;){o=E;var g=o.child;if(o.subtreeFlags&2064&&g!==null)g.return=o,E=g;else e:for(o=p;E!==null;){if(a=E,a.flags&2048)try{switch(a.tag){case 0:case 11:case 15:Fl(9,a)}}catch(N){H(a,a.return,N)}if(a===o){E=null;break e}var w=a.sibling;if(w!==null){w.return=a.return,E=w;break e}E=a.return}}if($=l,Nt(),be&&typeof be.onPostCommitFiberRoot=="function")try{be.onPostCommitFiberRoot(Ll,e)}catch{}r=!0}return r}finally{O=n,_e.transition=t}}return!1}function ba(e,t,n){t=yn(n,t),t=td(e,t,1),e=mt(e,t,1),t=de(),e!==null&&(vr(e,1,t),ye(e,t))}function H(e,t,n){if(e.tag===3)ba(e,e,n);else for(;t!==null;){if(t.tag===3){ba(t,e,n);break}else if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(ht===null||!ht.has(r))){e=yn(n,e),e=nd(t,e,1),t=mt(t,e,1),e=de(),t!==null&&(vr(t,1,e),ye(t,e));break}}t=t.return}}function Np(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),t=de(),e.pingedLanes|=e.suspendedLanes&n,ne===e&&(le&n)===n&&(q===4||q===3&&(le&130023424)===le&&500>X()-ys?It(e,0):vs|=n),ye(e,t)}function Sd(e,t){t===0&&(e.mode&1?(t=Lr,Lr<<=1,!(Lr&130023424)&&(Lr=4194304)):t=1);var n=de();e=qe(e,t),e!==null&&(vr(e,t,n),ye(e,n))}function Ep(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),Sd(e,n)}function zp(e,t){var n=0;switch(e.tag){case 13:var r=e.stateNode,l=e.memoizedState;l!==null&&(n=l.retryLane);break;case 19:r=e.stateNode;break;default:throw Error(j(314))}r!==null&&r.delete(t),Sd(e,n)}var jd;jd=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||ge.current)he=!0;else{if(!(e.lanes&n)&&!(t.flags&128))return he=!1,pp(e,t,n);he=!!(e.flags&131072)}else he=!1,B&&t.flags&1048576&&Cc(t,pl,t.index);switch(t.lanes=0,t.tag){case 2:var r=t.type;Zr(e,t),e=t.pendingProps;var l=mn(t,ue.current);dn(t,n),l=ds(null,t,r,e,l,n);var i=fs();return t.flags|=1,typeof l=="object"&&l!==null&&typeof l.render=="function"&&l.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,ve(r)?(i=!0,dl(t)):i=!1,t.memoizedState=l.state!==null&&l.state!==void 0?l.state:null,os(t),l.updater=Dl,t.stateNode=l,l._reactInternals=t,ao(t,r,e,n),t=fo(null,t,r,!0,i,n)):(t.tag=0,B&&i&&qo(t),ce(null,t,l,n),t=t.child),t;case 16:r=t.elementType;e:{switch(Zr(e,t),e=t.pendingProps,l=r._init,r=l(r._payload),t.type=r,l=t.tag=_p(r),e=Ie(r,e),l){case 0:t=co(null,t,r,e,n);break e;case 1:t=Ia(null,t,r,e,n);break e;case 11:t=Ma(null,t,r,e,n);break e;case 14:t=Ta(null,t,r,Ie(r.type,e),n);break e}throw Error(j(306,r,""))}return t;case 0:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Ie(r,l),co(e,t,r,l,n);case 1:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Ie(r,l),Ia(e,t,r,l,n);case 3:e:{if(od(t),e===null)throw Error(j(387));r=t.pendingProps,i=t.memoizedState,l=i.element,Ic(e,t),gl(t,r,null,n);var o=t.memoizedState;if(r=o.element,i.isDehydrated)if(i={element:r,isDehydrated:!1,cache:o.cache,pendingSuspenseBoundaries:o.pendingSuspenseBoundaries,transitions:o.transitions},t.updateQueue.baseState=i,t.memoizedState=i,t.flags&256){l=yn(Error(j(423)),t),t=$a(e,t,r,n,l);break e}else if(r!==l){l=yn(Error(j(424)),t),t=$a(e,t,r,n,l);break e}else for(we=pt(t.stateNode.containerInfo.firstChild),ke=t,B=!0,Re=null,n=Mc(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(hn(),r===l){t=et(e,t,n);break e}ce(e,t,r,n)}t=t.child}return t;case 5:return $c(t),e===null&&io(t),r=t.type,l=t.pendingProps,i=e!==null?e.memoizedProps:null,o=l.children,eo(r,l)?o=null:i!==null&&eo(r,i)&&(t.flags|=32),id(e,t),ce(e,t,o,n),t.child;case 6:return e===null&&io(t),null;case 13:return sd(e,t,n);case 4:return ss(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=gn(t,null,r,n):ce(e,t,r,n),t.child;case 11:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Ie(r,l),Ma(e,t,r,l,n);case 7:return ce(e,t,t.pendingProps,n),t.child;case 8:return ce(e,t,t.pendingProps.children,n),t.child;case 12:return ce(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(r=t.type._context,l=t.pendingProps,i=t.memoizedProps,o=l.value,F(ml,r._currentValue),r._currentValue=o,i!==null)if(Fe(i.value,o)){if(i.children===l.children&&!ge.current){t=et(e,t,n);break e}}else for(i=t.child,i!==null&&(i.return=t);i!==null;){var a=i.dependencies;if(a!==null){o=i.child;for(var u=a.firstContext;u!==null;){if(u.context===r){if(i.tag===1){u=Ge(-1,n&-n),u.tag=2;var d=i.updateQueue;if(d!==null){d=d.shared;var m=d.pending;m===null?u.next=u:(u.next=m.next,m.next=u),d.pending=u}}i.lanes|=n,u=i.alternate,u!==null&&(u.lanes|=n),oo(i.return,n,t),a.lanes|=n;break}u=u.next}}else if(i.tag===10)o=i.type===t.type?null:i.child;else if(i.tag===18){if(o=i.return,o===null)throw Error(j(341));o.lanes|=n,a=o.alternate,a!==null&&(a.lanes|=n),oo(o,n,t),o=i.sibling}else o=i.child;if(o!==null)o.return=i;else for(o=i;o!==null;){if(o===t){o=null;break}if(i=o.sibling,i!==null){i.return=o.return,o=i;break}o=o.return}i=o}ce(e,t,l.children,n),t=t.child}return t;case 9:return l=t.type,r=t.pendingProps.children,dn(t,n),l=Pe(l),r=r(l),t.flags|=1,ce(e,t,r,n),t.child;case 14:return r=t.type,l=Ie(r,t.pendingProps),l=Ie(r.type,l),Ta(e,t,r,l,n);case 15:return rd(e,t,t.type,t.pendingProps,n);case 17:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Ie(r,l),Zr(e,t),t.tag=1,ve(r)?(e=!0,dl(t)):e=!1,dn(t,n),ed(t,r,l),ao(t,r,l,n),fo(null,t,r,!0,e,n);case 19:return ad(e,t,n);case 22:return ld(e,t,n)}throw Error(j(156,t.tag))};function Nd(e,t){return Zu(e,t)}function Cp(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Ce(e,t,n,r){return new Cp(e,t,n,r)}function Ss(e){return e=e.prototype,!(!e||!e.isReactComponent)}function _p(e){if(typeof e=="function")return Ss(e)?1:0;if(e!=null){if(e=e.$$typeof,e===Bo)return 11;if(e===Vo)return 14}return 2}function vt(e,t){var n=e.alternate;return n===null?(n=Ce(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function el(e,t,n,r,l,i){var o=2;if(r=e,typeof e=="function")Ss(e)&&(o=1);else if(typeof e=="string")o=5;else e:switch(e){case Yt:return $t(n.children,l,i,t);case Uo:o=8,l|=8;break;case Ti:return e=Ce(12,n,t,l|2),e.elementType=Ti,e.lanes=i,e;case Ii:return e=Ce(13,n,t,l),e.elementType=Ii,e.lanes=i,e;case $i:return e=Ce(19,n,t,l),e.elementType=$i,e.lanes=i,e;case $u:return Ul(n,l,i,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case Tu:o=10;break e;case Iu:o=9;break e;case Bo:o=11;break e;case Vo:o=14;break e;case rt:o=16,r=null;break e}throw Error(j(130,e==null?e:typeof e,""))}return t=Ce(o,n,t,l),t.elementType=e,t.type=r,t.lanes=i,t}function $t(e,t,n,r){return e=Ce(7,e,r,t),e.lanes=n,e}function Ul(e,t,n,r){return e=Ce(22,e,r,t),e.elementType=$u,e.lanes=n,e.stateNode={isHidden:!1},e}function Si(e,t,n){return e=Ce(6,e,null,t),e.lanes=n,e}function ji(e,t,n){return t=Ce(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function Pp(e,t,n,r,l){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=ri(0),this.expirationTimes=ri(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=ri(0),this.identifierPrefix=r,this.onRecoverableError=l,this.mutableSourceEagerHydrationData=null}function js(e,t,n,r,l,i,o,a,u){return e=new Pp(e,t,n,a,u),t===1?(t=1,i===!0&&(t|=8)):t=0,i=Ce(3,null,null,t),e.current=i,i.stateNode=e,i.memoizedState={element:r,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},os(i),e}function Lp(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Xt,key:r==null?null:""+r,children:e,containerInfo:t,implementation:n}}function Ed(e){if(!e)return kt;e=e._reactInternals;e:{if(Vt(e)!==e||e.tag!==1)throw Error(j(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(ve(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(j(171))}if(e.tag===1){var n=e.type;if(ve(n))return Ec(e,n,t)}return t}function zd(e,t,n,r,l,i,o,a,u){return e=js(n,r,!0,e,l,i,o,a,u),e.context=Ed(null),n=e.current,r=de(),l=gt(n),i=Ge(r,l),i.callback=t??null,mt(n,i,l),e.current.lanes=l,vr(e,l,r),ye(e,r),e}function Bl(e,t,n,r){var l=t.current,i=de(),o=gt(l);return n=Ed(n),t.context===null?t.context=n:t.pendingContext=n,t=Ge(i,o),t.payload={element:e},r=r===void 0?null:r,r!==null&&(t.callback=r),e=mt(l,t,o),e!==null&&(De(e,l,o,i),Xr(e,l,o)),o}function Nl(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function Wa(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function Ns(e,t){Wa(e,t),(e=e.alternate)&&Wa(e,t)}function Mp(){return null}var Cd=typeof reportError=="function"?reportError:function(e){console.error(e)};function Es(e){this._internalRoot=e}Vl.prototype.render=Es.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(j(409));Bl(e,t,null,null)};Vl.prototype.unmount=Es.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;At(function(){Bl(null,e,null,null)}),t[Je]=null}};function Vl(e){this._internalRoot=e}Vl.prototype.unstable_scheduleHydration=function(e){if(e){var t=lc();e={blockedOn:null,target:e,priority:t};for(var n=0;n<it.length&&t!==0&&t<it[n].priority;n++);it.splice(n,0,e),n===0&&oc(e)}};function zs(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function bl(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function Ha(){}function Tp(e,t,n,r,l){if(l){if(typeof r=="function"){var i=r;r=function(){var d=Nl(o);i.call(d)}}var o=zd(t,r,e,0,null,!1,!1,"",Ha);return e._reactRootContainer=o,e[Je]=o.current,ir(e.nodeType===8?e.parentNode:e),At(),o}for(;l=e.lastChild;)e.removeChild(l);if(typeof r=="function"){var a=r;r=function(){var d=Nl(u);a.call(d)}}var u=js(e,0,!1,null,null,!1,!1,"",Ha);return e._reactRootContainer=u,e[Je]=u.current,ir(e.nodeType===8?e.parentNode:e),At(function(){Bl(t,u,n,r)}),u}function Wl(e,t,n,r,l){var i=n._reactRootContainer;if(i){var o=i;if(typeof l=="function"){var a=l;l=function(){var u=Nl(o);a.call(u)}}Bl(t,o,e,l)}else o=Tp(n,t,e,l,r);return Nl(o)}nc=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=Un(t.pendingLanes);n!==0&&(Ho(t,n|1),ye(t,X()),!($&6)&&(xn=X()+500,Nt()))}break;case 13:At(function(){var r=qe(e,1);if(r!==null){var l=de();De(r,e,1,l)}}),Ns(e,1)}};Qo=function(e){if(e.tag===13){var t=qe(e,134217728);if(t!==null){var n=de();De(t,e,134217728,n)}Ns(e,134217728)}};rc=function(e){if(e.tag===13){var t=gt(e),n=qe(e,t);if(n!==null){var r=de();De(n,e,t,r)}Ns(e,t)}};lc=function(){return O};ic=function(e,t){var n=O;try{return O=e,t()}finally{O=n}};Wi=function(e,t,n){switch(t){case"input":if(Di(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var l=$l(r);if(!l)throw Error(j(90));Ou(r),Di(r,l)}}}break;case"textarea":Fu(e,n);break;case"select":t=n.value,t!=null&&sn(e,!!n.multiple,t,!1)}};Hu=xs;Qu=At;var Ip={usingClientEntryPoint:!1,Events:[xr,qt,$l,bu,Wu,xs]},Rn={findFiberByHostInstance:Lt,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},$p={bundleType:Rn.bundleType,version:Rn.version,rendererPackageName:Rn.rendererPackageName,rendererConfig:Rn.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:tt.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=Yu(e),e===null?null:e.stateNode},findFiberByHostInstance:Rn.findFiberByHostInstance||Mp,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Br=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Br.isDisabled&&Br.supportsFiber)try{Ll=Br.inject($p),be=Br}catch{}}je.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Ip;je.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!zs(t))throw Error(j(200));return Lp(e,t,null,n)};je.createRoot=function(e,t){if(!zs(e))throw Error(j(299));var n=!1,r="",l=Cd;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onRecoverableError!==void 0&&(l=t.onRecoverableError)),t=js(e,1,!1,null,null,n,!1,r,l),e[Je]=t.current,ir(e.nodeType===8?e.parentNode:e),new Es(t)};je.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(j(188)):(e=Object.keys(e).join(","),Error(j(268,e)));return e=Yu(t),e=e===null?null:e.stateNode,e};je.flushSync=function(e){return At(e)};je.hydrate=function(e,t,n){if(!bl(t))throw Error(j(200));return Wl(null,e,t,!0,n)};je.hydrateRoot=function(e,t,n){if(!zs(e))throw Error(j(405));var r=n!=null&&n.hydratedSources||null,l=!1,i="",o=Cd;if(n!=null&&(n.unstable_strictMode===!0&&(l=!0),n.identifierPrefix!==void 0&&(i=n.identifierPrefix),n.onRecoverableError!==void 0&&(o=n.onRecoverableError)),t=zd(t,null,e,1,n??null,l,!1,i,o),e[Je]=t.current,ir(e),r)for(e=0;e<r.length;e++)n=r[e],l=n._getVersion,l=l(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,l]:t.mutableSourceEagerHydrationData.push(n,l);return new Vl(t)};je.render=function(e,t,n){if(!bl(t))throw Error(j(200));return Wl(null,e,t,!1,n)};je.unmountComponentAtNode=function(e){if(!bl(e))throw Error(j(40));return e._reactRootContainer?(At(function(){Wl(null,null,e,!1,function(){e._reactRootContainer=null,e[Je]=null})}),!0):!1};je.unstable_batchedUpdates=xs;je.unstable_renderSubtreeIntoContainer=function(e,t,n,r){if(!bl(n))throw Error(j(200));if(e==null||e._reactInternals===void 0)throw Error(j(38));return Wl(e,t,n,!1,r)};je.version="18.3.1-next-f1338f8080-20240426";function _d(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(_d)}catch(e){console.error(e)}}_d(),_u.exports=je;var Rp=_u.exports,Qa=Rp;Li.createRoot=Qa.createRoot,Li.hydrateRoot=Qa.hydrateRoot;/**
 * @remix-run/router v1.23.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function mr(){return mr=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},mr.apply(this,arguments)}var ut;(function(e){e.Pop="POP",e.Push="PUSH",e.Replace="REPLACE"})(ut||(ut={}));const Ka="popstate";function Op(e){e===void 0&&(e={});function t(r,l){let{pathname:i,search:o,hash:a}=r.location;return No("",{pathname:i,search:o,hash:a},l.state&&l.state.usr||null,l.state&&l.state.key||"default")}function n(r,l){return typeof l=="string"?l:El(l)}return Fp(t,n,null,e)}function G(e,t){if(e===!1||e===null||typeof e>"u")throw new Error(t)}function Pd(e,t){if(!e){typeof console<"u"&&console.warn(t);try{throw new Error(t)}catch{}}}function Dp(){return Math.random().toString(36).substr(2,8)}function Xa(e,t){return{usr:e.state,key:e.key,idx:t}}function No(e,t,n,r){return n===void 0&&(n=null),mr({pathname:typeof e=="string"?e:e.pathname,search:"",hash:""},typeof t=="string"?Nn(t):t,{state:n,key:t&&t.key||r||Dp()})}function El(e){let{pathname:t="/",search:n="",hash:r=""}=e;return n&&n!=="?"&&(t+=n.charAt(0)==="?"?n:"?"+n),r&&r!=="#"&&(t+=r.charAt(0)==="#"?r:"#"+r),t}function Nn(e){let t={};if(e){let n=e.indexOf("#");n>=0&&(t.hash=e.substr(n),e=e.substr(0,n));let r=e.indexOf("?");r>=0&&(t.search=e.substr(r),e=e.substr(0,r)),e&&(t.pathname=e)}return t}function Fp(e,t,n,r){r===void 0&&(r={});let{window:l=document.defaultView,v5Compat:i=!1}=r,o=l.history,a=ut.Pop,u=null,d=m();d==null&&(d=0,o.replaceState(mr({},o.state,{idx:d}),""));function m(){return(o.state||{idx:null}).idx}function f(){a=ut.Pop;let S=m(),h=S==null?null:S-d;d=S,u&&u({action:a,location:y.location,delta:h})}function c(S,h){a=ut.Push;let p=No(y.location,S,h);d=m()+1;let g=Xa(p,d),w=y.createHref(p);try{o.pushState(g,"",w)}catch(N){if(N instanceof DOMException&&N.name==="DataCloneError")throw N;l.location.assign(w)}i&&u&&u({action:a,location:y.location,delta:1})}function v(S,h){a=ut.Replace;let p=No(y.location,S,h);d=m();let g=Xa(p,d),w=y.createHref(p);o.replaceState(g,"",w),i&&u&&u({action:a,location:y.location,delta:0})}function x(S){let h=l.location.origin!=="null"?l.location.origin:l.location.href,p=typeof S=="string"?S:El(S);return p=p.replace(/ $/,"%20"),G(h,"No window.location.(origin|href) available to create URL for href: "+p),new URL(p,h)}let y={get action(){return a},get location(){return e(l,o)},listen(S){if(u)throw new Error("A history only accepts one active listener");return l.addEventListener(Ka,f),u=S,()=>{l.removeEventListener(Ka,f),u=null}},createHref(S){return t(l,S)},createURL:x,encodeLocation(S){let h=x(S);return{pathname:h.pathname,search:h.search,hash:h.hash}},push:c,replace:v,go(S){return o.go(S)}};return y}var Ya;(function(e){e.data="data",e.deferred="deferred",e.redirect="redirect",e.error="error"})(Ya||(Ya={}));function Ap(e,t,n){return n===void 0&&(n="/"),Up(e,t,n)}function Up(e,t,n,r){let l=typeof t=="string"?Nn(t):t,i=Cs(l.pathname||"/",n);if(i==null)return null;let o=Ld(e);Bp(o);let a=null;for(let u=0;a==null&&u<o.length;++u){let d=qp(i);a=Gp(o[u],d)}return a}function Ld(e,t,n,r){t===void 0&&(t=[]),n===void 0&&(n=[]),r===void 0&&(r="");let l=(i,o,a)=>{let u={relativePath:a===void 0?i.path||"":a,caseSensitive:i.caseSensitive===!0,childrenIndex:o,route:i};u.relativePath.startsWith("/")&&(G(u.relativePath.startsWith(r),'Absolute route path "'+u.relativePath+'" nested under path '+('"'+r+'" is not valid. An absolute child route path ')+"must start with the combined path of all its parent routes."),u.relativePath=u.relativePath.slice(r.length));let d=yt([r,u.relativePath]),m=n.concat(u);i.children&&i.children.length>0&&(G(i.index!==!0,"Index routes must not have child routes. Please remove "+('all child routes from route path "'+d+'".')),Ld(i.children,t,m,d)),!(i.path==null&&!i.index)&&t.push({path:d,score:Xp(d,i.index),routesMeta:m})};return e.forEach((i,o)=>{var a;if(i.path===""||!((a=i.path)!=null&&a.includes("?")))l(i,o);else for(let u of Md(i.path))l(i,o,u)}),t}function Md(e){let t=e.split("/");if(t.length===0)return[];let[n,...r]=t,l=n.endsWith("?"),i=n.replace(/\?$/,"");if(r.length===0)return l?[i,""]:[i];let o=Md(r.join("/")),a=[];return a.push(...o.map(u=>u===""?i:[i,u].join("/"))),l&&a.push(...o),a.map(u=>e.startsWith("/")&&u===""?"/":u)}function Bp(e){e.sort((t,n)=>t.score!==n.score?n.score-t.score:Yp(t.routesMeta.map(r=>r.childrenIndex),n.routesMeta.map(r=>r.childrenIndex)))}const Vp=/^:[\w-]+$/,bp=3,Wp=2,Hp=1,Qp=10,Kp=-2,Ga=e=>e==="*";function Xp(e,t){let n=e.split("/"),r=n.length;return n.some(Ga)&&(r+=Kp),t&&(r+=Wp),n.filter(l=>!Ga(l)).reduce((l,i)=>l+(Vp.test(i)?bp:i===""?Hp:Qp),r)}function Yp(e,t){return e.length===t.length&&e.slice(0,-1).every((r,l)=>r===t[l])?e[e.length-1]-t[t.length-1]:0}function Gp(e,t,n){let{routesMeta:r}=e,l={},i="/",o=[];for(let a=0;a<r.length;++a){let u=r[a],d=a===r.length-1,m=i==="/"?t:t.slice(i.length)||"/",f=Zp({path:u.relativePath,caseSensitive:u.caseSensitive,end:d},m),c=u.route;if(!f)return null;Object.assign(l,f.params),o.push({params:l,pathname:yt([i,f.pathname]),pathnameBase:r0(yt([i,f.pathnameBase])),route:c}),f.pathnameBase!=="/"&&(i=yt([i,f.pathnameBase]))}return o}function Zp(e,t){typeof e=="string"&&(e={path:e,caseSensitive:!1,end:!0});let[n,r]=Jp(e.path,e.caseSensitive,e.end),l=t.match(n);if(!l)return null;let i=l[0],o=i.replace(/(.)\/+$/,"$1"),a=l.slice(1);return{params:r.reduce((d,m,f)=>{let{paramName:c,isOptional:v}=m;if(c==="*"){let y=a[f]||"";o=i.slice(0,i.length-y.length).replace(/(.)\/+$/,"$1")}const x=a[f];return v&&!x?d[c]=void 0:d[c]=(x||"").replace(/%2F/g,"/"),d},{}),pathname:i,pathnameBase:o,pattern:e}}function Jp(e,t,n){t===void 0&&(t=!1),n===void 0&&(n=!0),Pd(e==="*"||!e.endsWith("*")||e.endsWith("/*"),'Route path "'+e+'" will be treated as if it were '+('"'+e.replace(/\*$/,"/*")+'" because the `*` character must ')+"always follow a `/` in the pattern. To get rid of this warning, "+('please change the route path to "'+e.replace(/\*$/,"/*")+'".'));let r=[],l="^"+e.replace(/\/*\*?$/,"").replace(/^\/*/,"/").replace(/[\\.*+^${}|()[\]]/g,"\\$&").replace(/\/:([\w-]+)(\?)?/g,(o,a,u)=>(r.push({paramName:a,isOptional:u!=null}),u?"/?([^\\/]+)?":"/([^\\/]+)"));return e.endsWith("*")?(r.push({paramName:"*"}),l+=e==="*"||e==="/*"?"(.*)$":"(?:\\/(.+)|\\/*)$"):n?l+="\\/*$":e!==""&&e!=="/"&&(l+="(?:(?=\\/|$))"),[new RegExp(l,t?void 0:"i"),r]}function qp(e){try{return e.split("/").map(t=>decodeURIComponent(t).replace(/\//g,"%2F")).join("/")}catch(t){return Pd(!1,'The URL path "'+e+'" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent '+("encoding ("+t+").")),e}}function Cs(e,t){if(t==="/")return e;if(!e.toLowerCase().startsWith(t.toLowerCase()))return null;let n=t.endsWith("/")?t.length-1:t.length,r=e.charAt(n);return r&&r!=="/"?null:e.slice(n)||"/"}function e0(e,t){t===void 0&&(t="/");let{pathname:n,search:r="",hash:l=""}=typeof e=="string"?Nn(e):e;return{pathname:n?n.startsWith("/")?n:t0(n,t):t,search:l0(r),hash:i0(l)}}function t0(e,t){let n=t.replace(/\/+$/,"").split("/");return e.split("/").forEach(l=>{l===".."?n.length>1&&n.pop():l!=="."&&n.push(l)}),n.length>1?n.join("/"):"/"}function Ni(e,t,n,r){return"Cannot include a '"+e+"' character in a manually specified "+("`to."+t+"` field ["+JSON.stringify(r)+"].  Please separate it out to the ")+("`to."+n+"` field. Alternatively you may provide the full path as ")+'a string in <Link to="..."> and the router will parse it for you.'}function n0(e){return e.filter((t,n)=>n===0||t.route.path&&t.route.path.length>0)}function Td(e,t){let n=n0(e);return t?n.map((r,l)=>l===n.length-1?r.pathname:r.pathnameBase):n.map(r=>r.pathnameBase)}function Id(e,t,n,r){r===void 0&&(r=!1);let l;typeof e=="string"?l=Nn(e):(l=mr({},e),G(!l.pathname||!l.pathname.includes("?"),Ni("?","pathname","search",l)),G(!l.pathname||!l.pathname.includes("#"),Ni("#","pathname","hash",l)),G(!l.search||!l.search.includes("#"),Ni("#","search","hash",l)));let i=e===""||l.pathname==="",o=i?"/":l.pathname,a;if(o==null)a=n;else{let f=t.length-1;if(!r&&o.startsWith("..")){let c=o.split("/");for(;c[0]==="..";)c.shift(),f-=1;l.pathname=c.join("/")}a=f>=0?t[f]:"/"}let u=e0(l,a),d=o&&o!=="/"&&o.endsWith("/"),m=(i||o===".")&&n.endsWith("/");return!u.pathname.endsWith("/")&&(d||m)&&(u.pathname+="/"),u}const yt=e=>e.join("/").replace(/\/\/+/g,"/"),r0=e=>e.replace(/\/+$/,"").replace(/^\/*/,"/"),l0=e=>!e||e==="?"?"":e.startsWith("?")?e:"?"+e,i0=e=>!e||e==="#"?"":e.startsWith("#")?e:"#"+e;function o0(e){return e!=null&&typeof e.status=="number"&&typeof e.statusText=="string"&&typeof e.internal=="boolean"&&"data"in e}const $d=["post","put","patch","delete"];new Set($d);const s0=["get",...$d];new Set(s0);/**
 * React Router v6.30.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function hr(){return hr=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},hr.apply(this,arguments)}const _s=k.createContext(null),a0=k.createContext(null),bt=k.createContext(null),Hl=k.createContext(null),Et=k.createContext({outlet:null,matches:[],isDataRoute:!1}),Rd=k.createContext(null);function u0(e,t){let{relative:n}=t===void 0?{}:t;kr()||G(!1);let{basename:r,navigator:l}=k.useContext(bt),{hash:i,pathname:o,search:a}=Fd(e,{relative:n}),u=o;return r!=="/"&&(u=o==="/"?r:yt([r,o])),l.createHref({pathname:u,search:a,hash:i})}function kr(){return k.useContext(Hl)!=null}function En(){return kr()||G(!1),k.useContext(Hl).location}function Od(e){k.useContext(bt).static||k.useLayoutEffect(e)}function Dd(){let{isDataRoute:e}=k.useContext(Et);return e?S0():c0()}function c0(){kr()||G(!1);let e=k.useContext(_s),{basename:t,future:n,navigator:r}=k.useContext(bt),{matches:l}=k.useContext(Et),{pathname:i}=En(),o=JSON.stringify(Td(l,n.v7_relativeSplatPath)),a=k.useRef(!1);return Od(()=>{a.current=!0}),k.useCallback(function(d,m){if(m===void 0&&(m={}),!a.current)return;if(typeof d=="number"){r.go(d);return}let f=Id(d,JSON.parse(o),i,m.relative==="path");e==null&&t!=="/"&&(f.pathname=f.pathname==="/"?t:yt([t,f.pathname])),(m.replace?r.replace:r.push)(f,m.state,m)},[t,r,o,i,e])}function Ql(){let{matches:e}=k.useContext(Et),t=e[e.length-1];return t?t.params:{}}function Fd(e,t){let{relative:n}=t===void 0?{}:t,{future:r}=k.useContext(bt),{matches:l}=k.useContext(Et),{pathname:i}=En(),o=JSON.stringify(Td(l,r.v7_relativeSplatPath));return k.useMemo(()=>Id(e,JSON.parse(o),i,n==="path"),[e,o,i,n])}function d0(e,t){return f0(e,t)}function f0(e,t,n,r){kr()||G(!1);let{navigator:l}=k.useContext(bt),{matches:i}=k.useContext(Et),o=i[i.length-1],a=o?o.params:{};o&&o.pathname;let u=o?o.pathnameBase:"/";o&&o.route;let d=En(),m;if(t){var f;let S=typeof t=="string"?Nn(t):t;u==="/"||(f=S.pathname)!=null&&f.startsWith(u)||G(!1),m=S}else m=d;let c=m.pathname||"/",v=c;if(u!=="/"){let S=u.replace(/^\//,"").split("/");v="/"+c.replace(/^\//,"").split("/").slice(S.length).join("/")}let x=Ap(e,{pathname:v}),y=v0(x&&x.map(S=>Object.assign({},S,{params:Object.assign({},a,S.params),pathname:yt([u,l.encodeLocation?l.encodeLocation(S.pathname).pathname:S.pathname]),pathnameBase:S.pathnameBase==="/"?u:yt([u,l.encodeLocation?l.encodeLocation(S.pathnameBase).pathname:S.pathnameBase])})),i,n,r);return t&&y?k.createElement(Hl.Provider,{value:{location:hr({pathname:"/",search:"",hash:"",state:null,key:"default"},m),navigationType:ut.Pop}},y):y}function p0(){let e=k0(),t=o0(e)?e.status+" "+e.statusText:e instanceof Error?e.message:JSON.stringify(e),n=e instanceof Error?e.stack:null,l={padding:"0.5rem",backgroundColor:"rgba(200,200,200, 0.5)"};return k.createElement(k.Fragment,null,k.createElement("h2",null,"Unexpected Application Error!"),k.createElement("h3",{style:{fontStyle:"italic"}},t),n?k.createElement("pre",{style:l},n):null,null)}const m0=k.createElement(p0,null);class h0 extends k.Component{constructor(t){super(t),this.state={location:t.location,revalidation:t.revalidation,error:t.error}}static getDerivedStateFromError(t){return{error:t}}static getDerivedStateFromProps(t,n){return n.location!==t.location||n.revalidation!=="idle"&&t.revalidation==="idle"?{error:t.error,location:t.location,revalidation:t.revalidation}:{error:t.error!==void 0?t.error:n.error,location:n.location,revalidation:t.revalidation||n.revalidation}}componentDidCatch(t,n){console.error("React Router caught the following error during render",t,n)}render(){return this.state.error!==void 0?k.createElement(Et.Provider,{value:this.props.routeContext},k.createElement(Rd.Provider,{value:this.state.error,children:this.props.component})):this.props.children}}function g0(e){let{routeContext:t,match:n,children:r}=e,l=k.useContext(_s);return l&&l.static&&l.staticContext&&(n.route.errorElement||n.route.ErrorBoundary)&&(l.staticContext._deepestRenderedBoundaryId=n.route.id),k.createElement(Et.Provider,{value:t},r)}function v0(e,t,n,r){var l;if(t===void 0&&(t=[]),n===void 0&&(n=null),r===void 0&&(r=null),e==null){var i;if(!n)return null;if(n.errors)e=n.matches;else if((i=r)!=null&&i.v7_partialHydration&&t.length===0&&!n.initialized&&n.matches.length>0)e=n.matches;else return null}let o=e,a=(l=n)==null?void 0:l.errors;if(a!=null){let m=o.findIndex(f=>f.route.id&&(a==null?void 0:a[f.route.id])!==void 0);m>=0||G(!1),o=o.slice(0,Math.min(o.length,m+1))}let u=!1,d=-1;if(n&&r&&r.v7_partialHydration)for(let m=0;m<o.length;m++){let f=o[m];if((f.route.HydrateFallback||f.route.hydrateFallbackElement)&&(d=m),f.route.id){let{loaderData:c,errors:v}=n,x=f.route.loader&&c[f.route.id]===void 0&&(!v||v[f.route.id]===void 0);if(f.route.lazy||x){u=!0,d>=0?o=o.slice(0,d+1):o=[o[0]];break}}}return o.reduceRight((m,f,c)=>{let v,x=!1,y=null,S=null;n&&(v=a&&f.route.id?a[f.route.id]:void 0,y=f.route.errorElement||m0,u&&(d<0&&c===0?(j0("route-fallback"),x=!0,S=null):d===c&&(x=!0,S=f.route.hydrateFallbackElement||null)));let h=t.concat(o.slice(0,c+1)),p=()=>{let g;return v?g=y:x?g=S:f.route.Component?g=k.createElement(f.route.Component,null):f.route.element?g=f.route.element:g=m,k.createElement(g0,{match:f,routeContext:{outlet:m,matches:h,isDataRoute:n!=null},children:g})};return n&&(f.route.ErrorBoundary||f.route.errorElement||c===0)?k.createElement(h0,{location:n.location,revalidation:n.revalidation,component:y,error:v,children:p(),routeContext:{outlet:null,matches:h,isDataRoute:!0}}):p()},null)}var Ad=function(e){return e.UseBlocker="useBlocker",e.UseRevalidator="useRevalidator",e.UseNavigateStable="useNavigate",e}(Ad||{}),Ud=function(e){return e.UseBlocker="useBlocker",e.UseLoaderData="useLoaderData",e.UseActionData="useActionData",e.UseRouteError="useRouteError",e.UseNavigation="useNavigation",e.UseRouteLoaderData="useRouteLoaderData",e.UseMatches="useMatches",e.UseRevalidator="useRevalidator",e.UseNavigateStable="useNavigate",e.UseRouteId="useRouteId",e}(Ud||{});function y0(e){let t=k.useContext(_s);return t||G(!1),t}function x0(e){let t=k.useContext(a0);return t||G(!1),t}function w0(e){let t=k.useContext(Et);return t||G(!1),t}function Bd(e){let t=w0(),n=t.matches[t.matches.length-1];return n.route.id||G(!1),n.route.id}function k0(){var e;let t=k.useContext(Rd),n=x0(),r=Bd();return t!==void 0?t:(e=n.errors)==null?void 0:e[r]}function S0(){let{router:e}=y0(Ad.UseNavigateStable),t=Bd(Ud.UseNavigateStable),n=k.useRef(!1);return Od(()=>{n.current=!0}),k.useCallback(function(l,i){i===void 0&&(i={}),n.current&&(typeof l=="number"?e.navigate(l):e.navigate(l,hr({fromRouteId:t},i)))},[e,t])}const Za={};function j0(e,t,n){Za[e]||(Za[e]=!0)}function N0(e,t){e==null||e.v7_startTransition,e==null||e.v7_relativeSplatPath}function Ue(e){G(!1)}function E0(e){let{basename:t="/",children:n=null,location:r,navigationType:l=ut.Pop,navigator:i,static:o=!1,future:a}=e;kr()&&G(!1);let u=t.replace(/^\/*/,"/"),d=k.useMemo(()=>({basename:u,navigator:i,static:o,future:hr({v7_relativeSplatPath:!1},a)}),[u,a,i,o]);typeof r=="string"&&(r=Nn(r));let{pathname:m="/",search:f="",hash:c="",state:v=null,key:x="default"}=r,y=k.useMemo(()=>{let S=Cs(m,u);return S==null?null:{location:{pathname:S,search:f,hash:c,state:v,key:x},navigationType:l}},[u,m,f,c,v,x,l]);return y==null?null:k.createElement(bt.Provider,{value:d},k.createElement(Hl.Provider,{children:n,value:y}))}function z0(e){let{children:t,location:n}=e;return d0(Eo(t),n)}new Promise(()=>{});function Eo(e,t){t===void 0&&(t=[]);let n=[];return k.Children.forEach(e,(r,l)=>{if(!k.isValidElement(r))return;let i=[...t,l];if(r.type===k.Fragment){n.push.apply(n,Eo(r.props.children,i));return}r.type!==Ue&&G(!1),!r.props.index||!r.props.children||G(!1);let o={id:r.props.id||i.join("-"),caseSensitive:r.props.caseSensitive,element:r.props.element,Component:r.props.Component,index:r.props.index,path:r.props.path,loader:r.props.loader,action:r.props.action,errorElement:r.props.errorElement,ErrorBoundary:r.props.ErrorBoundary,hasErrorBoundary:r.props.ErrorBoundary!=null||r.props.errorElement!=null,shouldRevalidate:r.props.shouldRevalidate,handle:r.props.handle,lazy:r.props.lazy};r.props.children&&(o.children=Eo(r.props.children,i)),n.push(o)}),n}/**
 * React Router DOM v6.30.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function zo(){return zo=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},zo.apply(this,arguments)}function C0(e,t){if(e==null)return{};var n={},r=Object.keys(e),l,i;for(i=0;i<r.length;i++)l=r[i],!(t.indexOf(l)>=0)&&(n[l]=e[l]);return n}function _0(e){return!!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)}function P0(e,t){return e.button===0&&(!t||t==="_self")&&!_0(e)}function Co(e){return e===void 0&&(e=""),new URLSearchParams(typeof e=="string"||Array.isArray(e)||e instanceof URLSearchParams?e:Object.keys(e).reduce((t,n)=>{let r=e[n];return t.concat(Array.isArray(r)?r.map(l=>[n,l]):[[n,r]])},[]))}function L0(e,t){let n=Co(e);return t&&t.forEach((r,l)=>{n.has(l)||t.getAll(l).forEach(i=>{n.append(l,i)})}),n}const M0=["onClick","relative","reloadDocument","replace","state","target","to","preventScrollReset","viewTransition"],T0="6";try{window.__reactRouterVersion=T0}catch{}const I0="startTransition",Ja=Nf[I0];function $0(e){let{basename:t,children:n,future:r,window:l}=e,i=k.useRef();i.current==null&&(i.current=Op({window:l,v5Compat:!0}));let o=i.current,[a,u]=k.useState({action:o.action,location:o.location}),{v7_startTransition:d}=r||{},m=k.useCallback(f=>{d&&Ja?Ja(()=>u(f)):u(f)},[u,d]);return k.useLayoutEffect(()=>o.listen(m),[o,m]),k.useEffect(()=>N0(r),[r]),k.createElement(E0,{basename:t,children:n,location:a.location,navigationType:a.action,navigator:o,future:r})}const R0=typeof window<"u"&&typeof window.document<"u"&&typeof window.document.createElement<"u",O0=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,J=k.forwardRef(function(t,n){let{onClick:r,relative:l,reloadDocument:i,replace:o,state:a,target:u,to:d,preventScrollReset:m,viewTransition:f}=t,c=C0(t,M0),{basename:v}=k.useContext(bt),x,y=!1;if(typeof d=="string"&&O0.test(d)&&(x=d,R0))try{let g=new URL(window.location.href),w=d.startsWith("//")?new URL(g.protocol+d):new URL(d),N=Cs(w.pathname,v);w.origin===g.origin&&N!=null?d=N+w.search+w.hash:y=!0}catch{}let S=u0(d,{relative:l}),h=D0(d,{replace:o,state:a,target:u,preventScrollReset:m,relative:l,viewTransition:f});function p(g){r&&r(g),g.defaultPrevented||h(g)}return k.createElement("a",zo({},c,{href:x||S,onClick:y||i?r:p,ref:n,target:u}))});var qa;(function(e){e.UseScrollRestoration="useScrollRestoration",e.UseSubmit="useSubmit",e.UseSubmitFetcher="useSubmitFetcher",e.UseFetcher="useFetcher",e.useViewTransitionState="useViewTransitionState"})(qa||(qa={}));var eu;(function(e){e.UseFetcher="useFetcher",e.UseFetchers="useFetchers",e.UseScrollRestoration="useScrollRestoration"})(eu||(eu={}));function D0(e,t){let{target:n,replace:r,state:l,preventScrollReset:i,relative:o,viewTransition:a}=t===void 0?{}:t,u=Dd(),d=En(),m=Fd(e,{relative:o});return k.useCallback(f=>{if(P0(f,n)){f.preventDefault();let c=r!==void 0?r:El(d)===El(m);u(e,{replace:c,state:l,preventScrollReset:i,relative:o,viewTransition:a})}},[d,u,m,r,l,n,e,i,o,a])}function F0(e){let t=k.useRef(Co(e)),n=k.useRef(!1),r=En(),l=k.useMemo(()=>L0(r.search,n.current?null:t.current),[r.search]),i=Dd(),o=k.useCallback((a,u)=>{const d=Co(typeof a=="function"?a(l):a);n.current=!0,i("?"+d,u)},[i,l]);return[l,o]}/**
 * @license lucide-react v0.471.2 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A0=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),Vd=(...e)=>e.filter((t,n,r)=>!!t&&t.trim()!==""&&r.indexOf(t)===n).join(" ").trim();/**
 * @license lucide-react v0.471.2 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var U0={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.471.2 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B0=k.forwardRef(({color:e="currentColor",size:t=24,strokeWidth:n=2,absoluteStrokeWidth:r,className:l="",children:i,iconNode:o,...a},u)=>k.createElement("svg",{ref:u,...U0,width:t,height:t,stroke:e,strokeWidth:r?Number(n)*24/Number(t):n,className:Vd("lucide",l),...a},[...o.map(([d,m])=>k.createElement(d,m)),...Array.isArray(i)?i:[i]]));/**
 * @license lucide-react v0.471.2 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R=(e,t)=>{const n=k.forwardRef(({className:r,...l},i)=>k.createElement(B0,{ref:i,iconNode:t,className:Vd(`lucide-${A0(e)}`,r),...l}));return n.displayName=`${e}`,n};/**
 * @license lucide-react v0.471.2 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V0=[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]],Ps=R("ArrowLeft",V0);/**
 * @license lucide-react v0.471.2 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b0=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]],W0=R("ArrowRight",b0);/**
 * @license lucide-react v0.471.2 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H0=[["path",{d:"M12 7v14",key:"1akyts"}],["path",{d:"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",key:"ruj8y"}]],Kl=R("BookOpen",H0);/**
 * @license lucide-react v0.471.2 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Q0=[["path",{d:"m8 2 1.88 1.88",key:"fmnt4t"}],["path",{d:"M14.12 3.88 16 2",key:"qol33r"}],["path",{d:"M9 7.13v-1a3.003 3.003 0 1 1 6 0v1",key:"d7y7pr"}],["path",{d:"M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6",key:"xs1cw7"}],["path",{d:"M12 20v-9",key:"1qisl0"}],["path",{d:"M6.53 9C4.6 8.8 3 7.1 3 5",key:"32zzws"}],["path",{d:"M6 13H2",key:"82j7cp"}],["path",{d:"M3 21c0-2.1 1.7-3.9 3.8-4",key:"4p0ekp"}],["path",{d:"M20.97 5c0 2.1-1.6 3.8-3.5 4",key:"18gb23"}],["path",{d:"M22 13h-4",key:"1jl80f"}],["path",{d:"M17.2 17c2.1.1 3.8 1.9 3.8 4",key:"k3fwyw"}]],K0=R("Bug",Q0);/**
 * @license lucide-react v0.471.2 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const X0=[["path",{d:"M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z",key:"1b4qmf"}],["path",{d:"M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2",key:"i71pzd"}],["path",{d:"M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2",key:"10jefs"}],["path",{d:"M10 6h4",key:"1itunk"}],["path",{d:"M10 10h4",key:"tcdvrf"}],["path",{d:"M10 14h4",key:"kelpxr"}],["path",{d:"M10 18h4",key:"1ulq68"}]],Y0=R("Building2",X0);/**
 * @license lucide-react v0.471.2 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const G0=[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}],["path",{d:"M8 14h.01",key:"6423bh"}],["path",{d:"M12 14h.01",key:"1etili"}],["path",{d:"M16 14h.01",key:"1gbofw"}],["path",{d:"M8 18h.01",key:"lrp35t"}],["path",{d:"M12 18h.01",key:"mhygvu"}],["path",{d:"M16 18h.01",key:"kzsmim"}]],Z0=R("CalendarDays",G0);/**
 * @license lucide-react v0.471.2 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const J0=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]],q0=R("CircleAlert",J0);/**
 * @license lucide-react v0.471.2 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const em=[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]],tm=R("CircleCheckBig",em);/**
 * @license lucide-react v0.471.2 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nm=[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"M12 11h4",key:"1jrz19"}],["path",{d:"M12 16h4",key:"n85exb"}],["path",{d:"M8 11h.01",key:"1dfujw"}],["path",{d:"M8 16h.01",key:"18s6g9"}]],tu=R("ClipboardList",nm);/**
 * @license lucide-react v0.471.2 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rm=[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]],lm=R("Copy",rm);/**
 * @license lucide-react v0.471.2 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const im=[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"M10 14 21 3",key:"gplh6r"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",key:"a6xqqp"}]],om=R("ExternalLink",im);/**
 * @license lucide-react v0.471.2 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sm=[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]],Ls=R("FileText",sm);/**
 * @license lucide-react v0.471.2 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const am=[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}],["path",{d:"M12 7v5l4 2",key:"1fdv2h"}]],um=R("History",am);/**
 * @license lucide-react v0.471.2 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cm=[["path",{d:"M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",key:"1gvzjb"}],["path",{d:"M9 18h6",key:"x1upvd"}],["path",{d:"M10 22h4",key:"ceow96"}]],dm=R("Lightbulb",cm);/**
 * @license lucide-react v0.471.2 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fm=[["path",{d:"M21 12h-8",key:"1bmf0i"}],["path",{d:"M21 6H8",key:"1pqkrb"}],["path",{d:"M21 18h-8",key:"1tm79t"}],["path",{d:"M3 6v4c0 1.1.9 2 2 2h3",key:"1ywdgy"}],["path",{d:"M3 10v6c0 1.1.9 2 2 2h3",key:"2wc746"}]],pm=R("ListTree",fm);/**
 * @license lucide-react v0.471.2 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mm=[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",key:"1r0f0z"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]],hm=R("MapPin",mm);/**
 * @license lucide-react v0.471.2 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gm=[["path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",key:"1lielz"}]],vm=R("MessageSquare",gm);/**
 * @license lucide-react v0.471.2 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ym=[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]],xm=R("Moon",ym);/**
 * @license lucide-react v0.471.2 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wm=[["path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"143wyd"}],["path",{d:"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6",key:"1itne7"}],["rect",{x:"6",y:"14",width:"12",height:"8",rx:"1",key:"1ue0tg"}]],km=R("Printer",wm);/**
 * @license lucide-react v0.471.2 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sm=[["path",{d:"M4.9 19.1C1 15.2 1 8.8 4.9 4.9",key:"1vaf9d"}],["path",{d:"M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5",key:"u1ii0m"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}],["path",{d:"M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5",key:"1j5fej"}],["path",{d:"M19.1 4.9C23 8.8 23 15.1 19.1 19",key:"10b0cb"}]],bd=R("Radio",Sm);/**
 * @license lucide-react v0.471.2 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jm=[["path",{d:"m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z",key:"7g6ntu"}],["path",{d:"m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z",key:"ijws7r"}],["path",{d:"M7 21h10",key:"1b0cd5"}],["path",{d:"M12 3v18",key:"108xh3"}],["path",{d:"M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2",key:"3gwbw2"}]],Nm=R("Scale",jm);/**
 * @license lucide-react v0.471.2 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Em=[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]],zl=R("Search",Em);/**
 * @license lucide-react v0.471.2 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zm=[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]],Cm=R("Send",zm);/**
 * @license lucide-react v0.471.2 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _m=[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],Wd=R("Settings",_m);/**
 * @license lucide-react v0.471.2 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pm=[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}]],xt=R("Shield",Pm);/**
 * @license lucide-react v0.471.2 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lm=[["path",{d:"M5 22h14",key:"ehvnwv"}],["path",{d:"M19.27 13.73A2.5 2.5 0 0 0 17.5 13h-11A2.5 2.5 0 0 0 4 15.5V17a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1.5c0-.66-.26-1.3-.73-1.77Z",key:"1sy9ra"}],["path",{d:"M14 13V8.5C14 7 15 7 15 5a3 3 0 0 0-3-3c-1.66 0-3 1-3 3s1 2 1 3.5V13",key:"cnxgux"}]],Mm=R("Stamp",Lm);/**
 * @license lucide-react v0.471.2 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tm=[["path",{d:"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",key:"r04s7s"}]],Hd=R("Star",Tm);/**
 * @license lucide-react v0.471.2 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Im=[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]],$m=R("Sun",Im);/**
 * @license lucide-react v0.471.2 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rm=[["path",{d:"M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z",key:"vktsd0"}],["circle",{cx:"7.5",cy:"7.5",r:".5",fill:"currentColor",key:"kqv944"}]],nu=R("Tag",Rm);/**
 * @license lucide-react v0.471.2 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Om=[["path",{d:"M17 14V2",key:"8ymqnk"}],["path",{d:"M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z",key:"m61m77"}]],Dm=R("ThumbsDown",Om);/**
 * @license lucide-react v0.471.2 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fm=[["path",{d:"M7 10v12",key:"1qc93n"}],["path",{d:"M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z",key:"emmmcr"}]],Am=R("ThumbsUp",Fm);/**
 * @license lucide-react v0.471.2 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Um=[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75",key:"1da9ce"}]],Qd=R("Users",Um);/**
 * @license lucide-react v0.471.2 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bm=[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]],Vm=R("X",Bm),Ut=[{id:"guard",role:"Охранник (1)",salary:"18.000 руб.",duties:["Стоять на постах A1–E2, контролировать поток в здание и безопасность сотрудников","Сопровождать сотрудников (с должности Адвокат) и охранять кабинеты","Докладывать по регламенту (заступил/продолжаю/закончил пост; начал/веду/закончил охрану)"],promotion:["Отстоять на посту А-1/А-2 20 минут (доклад каждые 10 минут)","Отстоять на посту B-1/B-2 20 минут (доклад каждые 10 минут)","Отстоять на посту С-1/С-2 20 минут (доклад каждые 10 минут)","Прослушать лекцию «Субординация»","Прослушать лекцию «Правила пользования рацией»","Прослушать лекцию «Специальные средства»","Сдать базовый экзамен (внутренний устав, охрана правительственного аппарата, спец. средства)"],source:"https://forum.amazing-online.com/threads/kriterii-dlja-povyshenija-v-dolzhnosti.1029606/"},{id:"chief-guard",role:"Начальник охраны (2)",salary:"20.000 руб.",duties:["Распределяет посты и смены охраны","Контролирует соблюдение уставной формы и дисциплины связи"],promotion:["Отстоять на посту А-1/А-2 20 минут (доклад каждые 10 минут)","Отстоять на посту B-1/B-2 20 минут (доклад каждые 10 минут)","Отстоять на посту Е-1/Е-2 20 минут (доклад каждые 10 минут)","Отстоять на посту D-1/D-2 20 минут (доклад каждые 10 минут)","Охрана любого сотрудника правительства (от должности Ревизор)","Прослушать лекцию «Юридическая деятельность»","Сдать экзамен на адвоката (УК, КоАП, юридическая консультация)"],source:"https://forum.amazing-online.com/threads/kriterii-dlja-povyshenija-v-dolzhnosti.1029606/"},{id:"lawyer",role:"Адвокат (3)",salary:"23.000 руб.",duties:["Юридическая помощь заключённым; дежурство в комнате свиданий","Доклады: начало/продолжаю/закончил помощь; дежурство в КС","Задания для зачёта: консультации, УДО и др. (см. критерии/отчёт)"],promotion:["Оказать юридическую консультацию 5 заключённым ИК «Кресты»","Дежурство в комнате свиданий 30 минут (доклад каждые 10 минут)","Прослушать лекцию «Правила выдачи лицензий»","Прослушать лекцию «Правила проведения ревизий»","Сдать экзамен «ФЗ о территориях с ограниченным доступом»"],dept:["ЮД"],source:"https://forum.amazing-online.com/threads/kriterii-dlja-povyshenija-v-dolzhnosti.1029606/"},{id:"inspector",role:"Инспектор (4)",salary:"26.000 руб.",duties:["Контроль собеседований; выездные проверки постов ГАИ/УМВД","Дежурство за стойкой регистрации; ведение отчётности","Участие в государственных проверках"],promotion:["Дежурство в холле правительства 60 минут (доклад каждые 20 минут)","Оформить 10 лицензий","Провести две ревизии","Прослушать лекцию «Департаменты правительственного аппарата»","Прослушать лекцию «Правила проведения проверок»","Сдать экзамен «Федеральное постановление»"],source:"https://forum.amazing-online.com/threads/kriterii-dlja-povyshenija-v-dolzhnosti.1029606/"},{id:"advisor",role:"Советник (5)",salary:"29.000 руб.",duties:["Участие и координация проверок; методическая помощь отделам"],promotionByDept:{ДЗ:["Дежурство в холле ЕСС 60 минут (доклад каждые 20 минут)","Проконтролировать 2 собеседования в ЕСС","Проверка постов ЕСС (доклад на каждом посту)","Опрос 10 сотрудников ЕСС: «Отношение к наркотическим веществам?»","Помощь/участие в плановой или внеплановой проверке","Прослушать лекцию «Снятие судимостей»"],ДВД:["Дежурство в холле ГАИ/УМВД 60 минут (доклад каждые 20 минут)","Проконтролировать 2 собеседования в ГАИ/УМВД","Проверка постов ГАИ (доклад на каждом посту)","Проверка постов УМВД (доклад на каждом посту)","Опрос 10 сотрудников ГАИ/УМВД: «Отношение к гражданам, находящимся в розыске?»","Помощь/участие в плановой или внеплановой проверке","Прослушать лекцию «Снятие судимостей»"],ДВС:["Дежурство у КПП-1 ВЧ 60 минут (доклад каждые 20 минут)","Дежурство в военкомате 60 минут (доклад каждые 20 минут)","Проконтролировать 2 призыва в ВЧ","Опрос 10 сотрудников ВЧ: «Отношение к нелегальным структурам?»","Помощь/участие в плановой или внеплановой проверке","Прослушать лекцию «Снятие судимостей»"],ЮД:["Дежурство в холле правительства 60 минут (доклад каждые 10 минут)","Провести 7 аттестаций сотрудникам","Провести 7 лекций сотрудникам","Проконтролировать 2 собеседования в Правительстве","Помощь/участие в проверке любой гос. организации","Прослушать лекцию «Снятие судимостей»"]},dept:["ДЗ","ДВД","ДВС","ЮД"],source:"https://forum.amazing-online.com/threads/kriterii-dlja-povyshenija-v-dolzhnosti.1029606/"},{id:"deputy-minister",role:"Заместитель министра (6)",salary:"32.000 руб.",duties:["Снятие судимостей гражданам (право с этой должности)","Организация и приём отчётности подразделений"],promotionByDept:{ДЗ:["Прослушивать рацию ЕСС 60 минут (доклад каждые 20 минут)","Вести надзор за сотрудниками ЕСС 60 минут (доклад каждые 20 минут)","Проконтролировать 3 собеседования в ЕСС","Опрос 15 сотрудников ЕСС: «Отношение к наркотическим веществам?»","Помощь/участие в плановой или внеплановой проверке","Сдать экзамен на министра Губернатору/Вице-губернатору (УК, КоАП, ФП, ФЗоВВ, ФЗоТОД, Конституция)"],ДВД:["Прослушивать рацию ГАИ/УМВД/УФСИН 60 минут (доклад каждые 20 минут)","Вести надзор за сотрудниками ГАИ/УМВД 60 минут (доклад каждые 10 минут)","Проконтролировать 3 собеседования в ГАИ/УМВД/УФСИН","Опрос 15 сотрудников ГАИ/УМВД: «Отношение к гражданам, находящимся в розыске?»","Помощь/участие в плановой или внеплановой проверке","Сдать экзамен на министра Губернатору/Вице-губернатору (УК, КоАП, ФП, ФЗоВВ, ФЗоТОД, Конституция)"],ДВС:["Прослушивать рацию ВЧ 60 минут (доклад каждые 20 минут)","Вести надзор за сотрудниками ВЧ 60 минут (доклад каждые 20 минут)","Проконтролировать 3 призыва в ВЧ","Опрос 15 сотрудников ВЧ: «Отношение к нелегальным структурам?»","Помощь/участие в плановой или внеплановой проверке","Сдать экзамен на министра Губернатору/Вице-губернатору (УК, КоАП, ФП, ФЗоВВ, ФЗоТОД, Конституция)"],ЮД:["Провести 13 аттестаций","Провести 13 лекций","Контролировать рацию Правительства 60 минут (доклад каждые 10 минут)","Провести тренировку охране/начальникам охраны по теме «Задержание/сопровождение/спец. средства»","Помочь в проведении 3 собеседований","Помощь/участие в плановой или внеплановой проверке","Сдать экзамен на министра Губернатору/Вице-губернатору (УК, КоАП, ФП, ФЗоВВ, ФЗоТОД, Конституция)"]},dept:["ДЗ","ДВД","ДВС","ЮД"],source:"https://forum.amazing-online.com/threads/kriterii-dlja-povyshenija-v-dolzhnosti.1029606/"},{id:"minister",role:"Министр (7)",salary:"35.000 руб.",duties:["Организует государственные проверки (инициатор)","Распоряжения в пределах департамента"],promotionByDept:{ДЗ:["На усмотрение губернатора"],ДВД:["На усмотрение губернатора"],ДВС:["На усмотрение губернатора"],ЮД:["На усмотрение губернатора"]},dept:["ДЗ","ДВД","ДВС","ЮД"],source:"https://forum.amazing-online.com/threads/kriterii-dlja-povyshenija-v-dolzhnosti.1029606/"},{id:"admin-chief",role:"Глава администрации (8)",salary:"38.000 руб.",duties:["Операционное управление правительственным аппаратом"],promotionByDept:{ДЗ:["На усмотрение губернатора"],ДВД:["На усмотрение губернатора"],ДВС:["На усмотрение губернатора"],ЮД:["На усмотрение губернатора"]},dept:["ДЗ","ДВД","ДВС","ЮД"],source:"https://forum.amazing-online.com/threads/kriterii-dlja-povyshenija-v-dolzhnosti.1029606/"},{id:"vice-governor",role:"Вице-губернатор (9)",salary:"41.000 руб.",duties:["Высшее руководство, указы, взаимодействие с ФСБ/ВЧ/ЕСС/МВД"],promotionByDept:{ДЗ:["—"],ДВД:["—"],ДВС:["—"],ЮД:["—"]},source:"https://forum.amazing-online.com/threads/kriterii-dlja-povyshenija-v-dolzhnosti.1029606/"},{id:"governor",role:"Губернатор (10)",salary:"45.000 руб.",duties:["Общее руководство; указы/постановления; награждения по итогам проверок"],source:"https://forum.amazing-online.com/threads/ukazy-postanovlenija-rasporjazhenija-gubernatora-nizhegorodskoj-oblasti.1027740/"}],wn=[{slug:"constitution",abbr:"КОНСТ",title:"Конституция Нижегородской области",notes:"Базовые права, устройство власти.",updated:"2025-02-23",content:`# Конституция Нижегородской области

## Глава 1. Основы конституционного строя
###Статья 1.
Человек, его права и свободы являются высшей ценностью. Признание, соблюдение и защита прав и свобод человека и гражданина – обязанность государства.

###Статья 2.
Государственная власть в Нижегородской области осуществляется правительством области и судом.

###Статья 3.
1. Конституция Нижегородской области имеет высшую юридическую силу, прямое действие и применяется на всей территории области. Законы и иные правовые акты не должны противоречить настоящей Конституции.
⠀1.1. Иерархия правовых и нормативно-правовых актов в Нижегородской области устанавливаются образом: Конституция, Федеральные Конституционные Законы, Федеральные Законы и Законы, подзаконные акты.
2. Органы государственной власти, их должностные лица и граждане, а также их объединения обязаны соблюдать Конституцию и Федеральные законы области.
3. Законы подлежат официальному опубликованию. Законы и иные правовые акты, которые не были опубликованы - не применяются и не имеют юридической силы.
4. Все законы, нормативно-правовые акты и акты управления должностных лиц вступают в юридическую силу с момента их официального опубликования.

##Глава 2. Права и свободы человека.​

###Статья 4.
1. В Нижегородской области признаются и гарантируются права и свободы человека и гражданина.
2. Основные права и свободы человека неотчуждаемы и принадлежат ему от рождения.
3. Осуществление прав и свобод одного человека не должно противоречить правам и свободам другого.

###Статья 5.
1. Все равны перед законом и судом.
2. Нижегородская область гарантирует равенство прав и свобод человека и гражданина независимо от полы, расы, национальности, языка, происхождения, имущественного и должностного положения, места жительства, отношения к религии, убеждений, а также других обстоятельств. Запрещается любая форма ограничения прав по ранее указанным признакам.
3. Мужчина и женщина имеют равные права и свободы.

###Статья 6.
1. Каждый имеет право на жизнь
2. Никто не может быть подвержен пыткам, насилию, либо другому жестокому обращению.

###Статья 7.
Каждый имеет право на свободу и личную неприкосновенность.

###Статья 8.
1. Каждый имеет право на неприкосновенность частной жизни, личную тайну, защиту своей чести и достоинства.
2. Каждый имеет право на тайну переписки, телефонных разговоров и иных сообщений. Ограничение данного права осуществляется только на основании судебного решения.

###Статья 9.
1. Сбор, хранение и распространение информации о частной жизни лица не допускается без его согласия.
⠀1.1. Допускается сбор, хранение и использование информации о частной жизни лица в случае проведения в его отношение оперативно-розыскных мероприятий в порядке предусмотренном федеральным законом.
2. Органы государственной власти, их должностные лица обязаны обеспечить каждому возможность ознакомления с документами и материалами, непосредственно затрагивающих его права и свободы, если иное не предусмотрено законом.

###Статья 10.
Жилище неприкосновенно. Никто не вправе проникать в жилище против воли проживающих в нем лиц, за исключением случаев установленными законами или на основании судебного решения.

###Статья 11.
1. Каждому гарантируется свобода мысли и слова.
2. Не допускаются высказывания, пропаганда или агитация, возбуждающие социальную, национальную или религиозную ненависть и вражду.
3. Никто не может быть принужден к выражению своих мнений и убеждений или отказу от таковых.
4. Каждый имеет право на сбор, хранение и распространение информации любым законным способом. Перечень сведений составляющих государственную тайну определяется законом.

###Статья 12.
Граждане области могут собираться мирно, без оружия, проводить собрания, митинги, демонстрации в рамках действующего законодательства.

###Статья 13.
Каждый заключенный под стражу имеет право пользоваться помощью адвоката (защитника) с момента передачи в исправительную колонию.

###Статья 14.
1. Каждый обвиняемый в совершении преступления считается невиновным, пока его виновность не будет доказана.
2. Обвиняемый не обязан доказывать свою невиновность.
3. Неустранимые сомнения в виновности лица толкуются в пользу обвиняемого.

###Статья 15.
Каждый имеет право на охрану здоровья и медицинскую помощь.

###Статья 16.
Никто не обязан свидетельствовать против себя самого, своего супруга и близких родственников.

###Статья 17.
В условиях чрезвычайного положения, режима контртеррористической операции могут вводиться отдельные ограничения прав граждан с указаниями пределов и срока их действия.

###Статья 18.
Никто не может быть повторно осужден или привлечен к ответственности за одно и то же преступление/правонарушение.

###Статья 19.
Права и свободы человека и гражданина могут быть ограничены федеральным законом и административным регламентом только в той мере, в какой это необходимо в целях защиты основ конституционного строя, нравственности, здоровья, прав и законных интересов других лиц

##Глава 3. Судебная власть​

###Статья 20.
1. Правосудие в Нижегородской области осуществляется только судом.
2. Судебная власть осуществляется посредствам гражданского, административного и уголовного судопроизводства.

###Статья 21.
1. Судьями могут стать граждане Нижегородской области, достигшие 15 лет проживания в области, имеющие высшее юридическое образование и стаж работы по юридической профессии не менее 3-ех лет.
2. Судьи независимы и подчиняются только Конституции и Закону.

###Статья 22.
Судьи неприкосновенны. Судья не может быть привлечен к уголовной ответственности не иначе как в порядке предписанным федеральным законом.

###Статья 23.
Разбирательство во всех судах открытое. Слушание в закрытом заседании допускается в случаях, предусмотренных федеральным законом.
###Статья 24.
1. Особые правовые режимы - это установленные государством особые порядки регулирования общественных отношений, которые вводятся в определенных ситуациях и характеризуются специфическим набором правовых средств и ограничений. Эти режимы могут включать в себя ограничения прав и свобод граждан, изменение правил функционирования государственных органов, предприятий и организаций, а также введение специальных процедур и требований.
2. Виды особых правовых режимов
⠀2.1. Контртеррористическая операция(КТО) - это комплекс специальных мероприятий, проводимых государственными органами для пресечения террористического акта, обезвреживания террористов, обеспечения безопасности людей и объектов, а также для минимизации последствий теракта.
⠀2.2 Военное положение - особый правовой режим в государстве или его части, как правило, в военное время, который устанавливается в случае агрессии против государства или непосредственной угрозы агрессии.
`},{slug:"uk",abbr:"УК",title:"Уголовный кодекс",notes:"Составы преступлений и наказания.",updated:"2025-02-23",content:`# Уголовный кодекс

##Глава I. Преступления против жизни и здоровья​

###Статья 1. Убийство.
Убийство, то есть умышленное причинение смерти другому человеку, - наказывается лишением свободы сроком на 10 лет

###Статья 2. Убийство совершенное при превышении пределов необходимой обороны.
Убийство, то есть умышленное причинение смерти другому человеку, совершенное при превышении пределов необходимой обороны, - наказывается лишением свободы сроком на 8 лет

###Статья 3. Причинение смерти по неосторожности.
Причинение смерти по неосторожности, а равно причинение смерти другому человеку, совершенное человеком по легкомыслию или небрежности, без умысла на лишение жизни, - наказывается лишением свободы сроком на 8 лет

###Статья 4. Умышленное причинение тяжкого вреда здоровью.
Умышленное причинение тяжкого вреда здоровью, опасного для жизни человека, повлекшего за собой потерю зрения, речи, слуха либо какого-либо органа или утрату органом его функций, психическое расстройство, полную утрату профессиональной трудоспособности - наказывается лишением свободы сроком на 6 лет

###Статья 5. Умышленное причинение средней тяжести вреда здоровью.
Умышленное причинение средней тяжести вреда здоровью, опасного для жизни человека, повлекшего за собой частичную утрату органом его функций, перелом, вывих конечностей - наказывается лишением свободы сроком на 4 лет

###Статья 6. Умышленное причинение легкого вреда здоровью.
Умышленное причинение лёгкого вреда здоровью, вызвавшего кратковременное расстройство здоровья или незначительную стойкую утрату общей трудоспособности, - наказывается лишением свободы сроком на 2 года

###Статья 7. Побои.
Побои, а равно причинение телесных повреждений, не влекущих вреда здоровью пострадавшего, посредством неоднократного нанесения ударов или иные насильственные действия, причинившие физическую боль и поверхностные повреждения: ушибы, синяки, ссадины, кровоподтеки, но не повлекшие последствий, указанных в ст. 4, 5, 6, - наказывается судебным штрафом от 50 до 200 тысяч рублей или лишением свободы сроком на 2 года

###Статья 8. Угроза убийством или тяжким вредом здоровью.
Угроза убийством или причинением тяжкого вреда здоровью, выраженная в устной или письменной форме, если имелись основания опасаться осуществления этой угрозы, - наказывается судебным штрафом от 25 до 50 тысяч рублей или лишением свободы сроком на 2 года

###Статья 9. Неоказание помощи больному.
Неоказание медицинской помощи больному без уважительных причин лицом, обязанным ее оказывать, - наказывается лишением свободы сроком на 4 года
###Статья 10. Воспрепятствование оказанию медицинской помощи
Воспрепятствование в какой бы то ни было форме законной деятельности медицинского работника по оказанию медицинской помощи; воспрепятствование оказанию первой доврачебной помощи, - наказывается лишением свободы сроком на 3 года

###Статья 11. Оставление в опасности.
1. Оставление без помощи лица, находящегося в опасном для жизни или здоровья состоянии и лишенного возможности принять меры к самосохранению вследствие своей беспомощности, в случаях, если виновный имел возможность оказать помощь либо сам поставил его в опасное для жизни или здоровья состояние, - наказывается лишением свободы сроком на 2 года

2. Оставление без помощи лица, находящегося в опасном для жизни или здоровья состоянии и лишенного возможности принять меры к самосохранению вследствие своей беспомощности, сотрудником правоохранительного или иного органа, обязанного оказать помощь пострадавшему при совершении преступления, административного правонарушения или при чрезвычайной ситуации, - наказывается лишением свободы сроком на 2 года

##Глава II. Преступления против свободы, чести и достоинства личности​

###Статья 12. Похищение человека.
Похищение человека, то есть противоправные умышленные действия, направленные на тайный или открытый, либо с помощью обмана, захват человека, изъятие его из естественной микросоциальной среды, перемещение с его места жительства с последующим удержанием против его воли в другом месте, - наказывается лишением свободы сроком на 4 года.

###Статья 13. Незаконное лишение свободы.
Незаконное лишение свободы, не связанное с похищением человека, а равно ситуация, когда потерпевший остается на месте его нахождения, но ограничивается в передвижении без законных на то оснований, - наказывается судебным штрафом в размере от 50 до 100 тысяч рублей или лишением свободы сроком на 4 года

###Статья 14. Клевета.
Клевета, то есть распространение заведомо ложных сведений, порочащих честь и достоинство другого лица или подрывающих его репутацию, - наказывается судебным штрафом в размере от 20 до 200 тысяч рублей или лишением свободы сроком на 2 года

##Глава III. Преступления против половой неприкосновенности​

###Статья 15. Изнасилование.
Изнасилование, то есть половое сношение с применением насилия или с угрозой его применения к потерпевшей или к другим лицам либо с использованием беспомощного состояния потерпевшей, - наказывается судебным штрафом в размере от 50 до 150 тысяч рублей или лишением свободы сроком на 5 лет

###Статья 16. Насильственные действия сексуального характера.
Мужеложство, лесбиянство или иные действия сексуального характера с применением насилия - наказывается лишением свободы сроком на 4 года

##Глава IV. Преступления против конституционных прав и свобод человека и гражданина​

###Статья 17. Нарушение равенств и прав свобод человека и гражданина.
Дискриминация, то есть нарушение прав, свобод и законных интересов человека и гражданина в зависимости от его пола, расы, национальности, языка, происхождения, имущественного и должностного положения, места жительства, отношения к религии, убеждений, принадлежности к общественным объединениям или каким-либо социальным группам, совершенное лицом с использованием своего служебного положения, - наказывается судебным штрафом в размере от 20 до 100 тысяч рублей или лишением свободы сроком на 2 года

###Статья 18. Нарушение неприкосновенности частной жизни.
Незаконное собирание или распространение сведений о частной жизни лица, составляющих его личную или семейную тайну, без его согласия либо распространение этих сведений в публичном выступлении, публично демонстрирующийся произведении или средствах массовой информации, - наказывается судебным штрафом в размере от 20 до 150 тысяч рублей лишением свободы сроком на 2 года

###Статья 19. Нарушение тайны переписки или телефонных переговоров.
Нарушение тайны переписки, телефонных переговоров, или иных сообщений граждан, - наказывается судебным штрафом в размере от 50 до 100 тысяч рублей или лишением свободы сроком на 2 года

###Статья 20. Нарушение неприкосновенности жилища.
Незаконное проникновение в жилище, совершенное против воли проживающего в нем лица, - наказывается лишением свободы сроком на 2 года

###Статья 21. Отказ в предоставлении гражданину информации.
Неправомерный отказ должностного лица в предоставлении собранных в установленном порядке документов и материалов, непосредственно затрагивающих права и свободы гражданина, либо предоставление гражданину неполной или заведомо ложной информации, если эти деяния причинили вред правам и законным интересам граждан, - наказывается лишением свободы сроком на 1 год

##Глава V. Преступления против собственности​

###Статья 22. Кража.
Кража, то есть тайное хищение чужого имущества, - наказывается лишением свободы сроком на 6 лет

###Статья 23. Грабеж.
Грабеж, то есть открытое хищение чужого имущества, - наказывается лишением свободы сроком на 8 лет

###Статья 24. Разбой.
Разбой, то есть нападение в целях хищения чужого имущества, совершенное с применением насилия, опасного для жизни или здоровья, либо с угрозой применения такого насилия, - наказывается лишением свободы сроком на 4 года

###Статья 25. Мошенничество.
Мошенничество, то есть хищение чужого имущества или приобретение права на чужое имущество путем обмана или злоупотребления доверием, -
наказывается лишением свободы сроком на 4 года

###Статья 26. Вымогательство.
Вымогательство, то есть требование передачи чужого имущества или права на имущество или совершения других действий имущественного характера под угрозой применения насилия либо уничтожения или повреждения чужого имущества, а равно под угрозой распространения сведений, позорящих потерпевшего или его близких, либо иных сведений, которые могут причинить существенный вред правам или законным интересам потерпевшего или его близких, - наказывается лишением свободы сроком на 4 года

###Статья 27. Умышленное уничтожение или повреждение имущества.
Умышленные уничтожение или повреждение чужого имущества, в том числе и государственного, либо те же деяния, совершенные из хулиганских побуждений, путем поджога, взрыва или иным общеопасным способом, - наказывается лишением свободы сроком на 2 года

##ГЛАВА VI. ПРЕСТУПЛЕНИЯ ПРОТИВ ОБЩЕСТВЕННОЙ БЕЗОПАСНОСТИ
​
##Статья 28. Террористический акт
Совершение взрыва, поджога или иных действий, устрашающих население и создающих опасность гибели человека, причинения значительного имущественного ущерба либо наступления иных тяжких последствий, в целях дестабилизации деятельности органов власти или международных организаций либо воздействия на принятие ими решений, а также угроза совершения указанных действий в целях воздействия на принятие решений органами власти или международными организациями, - наказывается лишением свободы сроком на 10 лет

###Статья 29. Содействие террористической деятельности
Склонение, вербовка или иное вовлечение лица в совершение хотя бы одного из преступлений, предусмотренных статьями 28, 31, 32, 34 УК, добровольное участие в совершении или оказание какой бы то ни было помощи в совершении данных преступлений, - наказывается лишением свободы сроком на 8 лет

###Статья 30. Несообщение о преступлении
Несообщение в органы власти, уполномоченные рассматривать сообщения о преступлении, о лице (лицах), которое по достоверно известным сведениям готовит, совершает или совершило хотя бы одно из преступлений, предусмотренных статьями 1, 4, 12, 28, 29, 31, 33, 34, 47, 48, 63 УК, - наказывается лишением свободы сроком на 5 лет.

###Статья 31. Захват заложника
Захват или удержание лица в качестве заложника, совершенные в целях понуждения государства, организации или гражданина совершить какое-либо действие или воздержаться от совершения какого-либо действия как условия освобождения заложника, - наказываются лишением свободы сроком на 8 лет

###Статья 32. Заведомо ложное сообщение об акте терроризма
Заведомо ложное сообщение в органы полиции или Федеральной службы безопасности о готовящихся взрыве, поджоге или иных действиях, создающих опасность гибели людей, причинения значительного имущественного ущерба либо наступления иных общественно опасных последствий, совершенное из хулиганских побуждений, - наказываются лишением свободы сроком на 5 лет

###Статья 33. Бандитизм
Создание устойчивой вооруженной группы (банды) в целях нападения на граждан или организации с целью совершения тяжких или особо-тяжких преступлений, а равно руководство такой группой (бандой), - наказываются лишением свободы сроком на 4 года

###Статья 34. Организации преступного сообщества или участие в нём
1. Создание преступного сообщества (преступной организации) в целях совершения одного или нескольких тяжких или особо тяжких преступлений либо руководство преступным сообществом (преступной организацией) или входящими в него (нее) структурными подразделениями, а равно координация действий организованных групп, создание устойчивых связей между ними, разработка планов и создание условий для совершения преступлений организованными группами, раздел сфер преступного влияния и (или) преступных доходов между такими группами, - наказываются лишением свободы сроком на 6 лет

2. Участие в преступном сообществе (преступной организации), - наказываются лишением свободы сроком на 6 лет

###Статья 35. Занятие высшего положения в преступной иерархии
Занятие высшего положения в преступной иерархии, - наказывается лишением свободы сроком на 10 лет

###Статья 36. Массовые беспорядки
Организация массовых беспорядков, то есть грубого нарушения общественного порядка, сопровождавшегося насилием, погромами, поджогами, уничтожением имущества, применением оружия, взрывных устройств, взрывчатых веществ и предметов, представляющих опасность для окружающих, а также оказанием вооруженного сопротивления представителям власти, подготовка лица для организации таких массовых беспорядков или участия в них, а также участие в массовых беспорядках, - наказывается лишением свободы сроком на 4 года

###Статья 37. Хулиганство
Хулиганство, то есть грубое нарушение общественного порядка, выражающее явное неуважение к обществу, - наказывается судебным штрафом в размере от 50 до 200 тысяч рублей или лишением свободы сроком на 2 года

###Статья 38. Вандализм
Вандализм, то есть осквернение зданий или иных сооружений, памятников, порча имущества на общественном транспорте или в иных общественных местах, - наказывается судебным штрафом в размере от 50 до 200 тысяч рублей или лишением свободы сроком на 2 года

###Статья 39. Незаконное проникновение на охраняемый объект
Незаконное проникновение на охраняемый объект, а равно на территорию воинской части или иных военных стратегических объектов (поезд с патронами), исправительной колонии, офиса Федеральной службы безопасности, парковок правоохранительных органов и на любую территорию, оцепленную сотрудниками правоохранительных органов, - наказывается судебным штрафом в размере от 50 до 150 тысяч рублей или лишением свободы сроком на 8 лет

###Статья 40. Незаконное приобретение, передача, изготовления оружия и боеприпасов к нему
Незаконное, а равно совершенное без официальной лицензии приобретение, передача, изготовления оружия и боеприпасов к нему, - наказывается судебным штрафом в размере от 50 до 200 тысяч рублей или лишением свободы сроком на 4 года

###Статья 41. Незаконное использование или ношение оружия и боеприпасов к нему
1. Незаконное использование, то есть использование или применение оружия для противоправных действий, а равно не в целях необходимой самообороны или крайней необходимости, либо не для задержания лица, совершившего преступление, в случаях, предусмотренных законодательством, - наказывается судебным штрафом в размере от 200 до 400 тысяч рублей или лишением свободы сроком на 4 года

2. Незаконное ношение, а равно ношение оружия без надлежащей лицензии, - наказывается судебным штрафом в размере от 50 до 250 тысяч рублей или лишением свободы сроком на 4 года


3. Незаконное ношение, хранение, транспортировка боеприпасов к оружию, регламентированные в Федеральном законе «Об оружии», - наказывается судебным штрафом в размере от 50 до 250 тысяч рублей или лишением свободы сроком на 4 года
Примечание к ст. 40, 41 УК: лицо освобождается от уголовной ответственности в случае, если он добровольно сдал огнестрельное оружие правоохранительным органам

###Статья 42. Ношение оружия в открытом виде в общественных местах, городах
Ношение оружия в открытом виде в общественных местах, городах, - наказывается судебным штрафом в размере от 50 до 200 тысяч рублей или лишением свободы сроком на 4 года
Примечание к ст. 42 УК:
Общественное место — территория, пространство, помещение, постоянно или в какой-либо период времени свободное для доступа и использования неопределенным кругом лиц.
Места значительного скопления граждан (улицы, площади, парки, стадионы, транспорт), а также любые места, свободные для доступа неопределенного круга лиц, в которых могут находиться люди (подъезды, пешеходные переходы, остановки, торговые центры, залы ожидания и др.)."

ГЛАВА VII. ПРЕСТУПЛЕНИЯ ПРОТИВ
БЕЗОПАСНОСТИ ДОРОЖНОГО ДВИЖЕНИЯ​

Статья 43. Нарушение правил дорожного движения, повлекшее тяжкий вред здоровью
Нарушение правил дорожного движения, повлекшее обстоятельства, указанные в статье 4 УК, - наказывается лишением свободы сроком на 7 лет

Статья 44. Нарушение правил дорожного движения, повлекшее смерть
Нарушение правил дорожного движения, повлекшее смерть человека, - наказывается лишением свободы сроком на 7 лет

ГЛАВА VIII. ПРЕСТУПЛЕНИЯ ПРОТИВ ЗДОРОВЬЯ НАСЕЛЕНИЯ И ОБЩЕСТВЕННОЙ НРАВСТВЕННОСТИ​


Статья 45. Незаконное изготовление, приобретение, продажа, хранение наркотических средств
Незаконное изготовление, приобретение, продажа, хранение наркотических средств в значительном размере, - наказывается лишением свободы сроком на 7 лет
Примечание к ст. 45 УК: под значительным размером подразумевается зеленый чай от 5грамм включительно и более; мятная пудра от 2 грамм включительно и более

Статья 46. Вовлечение в занятие проституцией
Вовлечение в занятие проституцией или принуждение к продолжению занятия проституцией, - наказывается судебным штрафом в размере от 10 до 50 тысяч рублей или лишением свободы сроком на 2 года

Статья 47. Надругательство над телами умерших и местами их захоронения
Надругательство над телами умерших либо уничтожение, повреждение или осквернение мест захоронения, надмогильных сооружений или кладбищенских зданий, предназначенных для церемоний в связи с погребением умерших или их поминовением, - наказывается судебным штрафом в размере от 10 до 100 тысяч рублей, при рецидиве - лишением свободы сроком на 2 года

ГЛАВА IX. ПРЕСТУПЛЕНИЯ ПРОТИВ ГОСУДАРСТВЕННОЙ ВЛАСТИ
​
Статья 48. Посягательство на жизнь государственного деятеля
Посягательство на жизнь государственного или общественного деятеля, совершенное в целях прекращения его государственной или иной политической деятельности либо из мести за такую деятельность, - наказывается лишением свободы сроком на 7 лет

Примечание к ст. 48 УК: государственными деятелями являются сотрудники правительства и Нижегородского областного суда

Статья 49. Вооружённый мятеж
Организация вооруженного мятежа либо активное участие в нем в целях свержения или насильственного изменения конституционного строя Нижегородской области либо нарушения территориальной целостности Нижегородской области, либо с целью свержения государственной власти, в том числе представителя территориального органа самоуправления (губернатора), -
наказывается лишением свободы сроком на 10 лет

Статья 50. Публичные призывы к осуществлению экстремистской деятельности
Публичные призывы к осуществлению экстремистской деятельности, - наказывается лишением свободы сроком на 5 лет
*Примечание к ст. 50 УК: под призывами к осуществлению экстремистской деятельности подразумеваются:
  1) пропаганда или упоминание в каком бы то ни было запрещенного экстремистского движения;
  2) призывы к насильственному изменению основ конституционного строя;
  3) призывы к свержению к действующей государственной власти, в том числе органов местного самоуправления;
  4) публичное оправдание терроризма и иная террористическая деятельность;
  5) публичные призывы к возбуждению социальной, расовой, национальной или религиозной розни;
  6) публичные призывы к нарушению прав, свобод и законных интересов человека и гражданина в зависимости от его социальной, расовой, национальной, религиозной или языковой принадлежности или отношения к религии;
  7) публичные призывы к воспрепятствованию законной деятельности государственных органов, органов местного самоуправления, с применением насилия, -

Статья 51. Превышение должностных полномочий
Совершение должностным лицом действий, явно выходящих за пределы его полномочий и повлекших существенное нарушение прав и законных интересов граждан или организаций либо охраняемых законом интересов общества или государства, -
наказывается лишением свободы сроком на 4 года

Статья 52. Нецелевое расходование бюджетных средств
Расходование бюджетных средств должностным лицом на цели, не соответствующие условиям их получения, а равно использование бюджетных средств органами местного самоуправления в личных целях, - наказывается лишением свободы сроком на 6 лет
Статья 53. Присвоение полномочий должностного лица
Присвоение государственным служащим или муниципальным служащим, не являющимся должностным лицом, полномочий должностного лица, - наказывается судебным штрафом в размере от 100 до 300 тысяч рублей или лишением свободы сроком на 3 года
Примечание к ст.53 УК: присвоение полномочий должностного лица выражается в том, что государственный служащий или служащий органа местного самоуправления или гражданское лицо, не являющийся должностным лицом, путем обмана выдает себя за такового, а также совершает в связи с этим активные действия

Статья 54. Получение взятки
Получение должностным лицом материальные ценности (предметы, деньги, услуги, иная имущественная выгода) за действия либо бездействие в интересах взяткодателя или третьего лица, которые должностное лицо имеет право либо обязано совершить, с целью ускорить решение вопроса или решить его в положительном ключе, либо за совершение незаконных действий, то есть действий или бездействия, которые это лицо не может или не должно совершить в силу закона или своего служебного положения, - наказывается лишением свободы сроком на 5 лет.
Примечания к ст. 54 УК: 1. Взятка считается полученной с момента, когда лицо принимает её в физическом смысле (берет в руки; кладет в карман, сумку, портфель, автомобиль), либо соглашается с ее передачей (положили на стол, перечислили на счет)

2. Лицо, получившее взятку, освобождается от уголовной ответственности, если оно активно способствовало раскрытию и (или) расследованию преступления

3. Предложение взятки не является наказуемым

Статья 55. Дача взятки
Передача должностному лицу материальные ценности (предметы, деньги, услуги, иная имущественная выгода) за действия либо бездействие в интересах взяткодателя или третьего лица, которые должностное лицо имеет право либо обязано совершить, с целью ускорить решение вопроса или решить его в положительном ключе, либо за совершение незаконных действий, то есть действий или бездействия, которые это лицо не может или не должно совершить в силу закона или своего служебного положения, - наказывается лишением свободы сроком на 5 лет
Примечания к ст. 55 УК: 1. Взятка считается полученной с момента, когда лицо принимает её в физическом смысле (берет в руки; кладет в карман, сумку, портфель, автомобиль), либо соглашается с ее передачей (положили на стол, перечислили на счет)

2. Лицо, давшее взятку, освобождается от уголовной ответственности, если оно активно способствовало раскрытию и (или) расследованию преступления и либо в отношении его имело место вымогательство взятки со стороны должностного лица, либо лицо после совершения преступления добровольно сообщило в орган, имеющий право возбудить уголовное дело, о даче взятки

Статья 56. Халатность
1. Неисполнение или ненадлежащее исполнение должностным лицом своих обязанностей вследствие недобросовестного или небрежного отношения к службе либо обязанностей по должности, если это повлекло причинение ущерба или нарушение прав и законных интересов граждан или организаций либо охраняемых законом интересов общества или государства, - наказывается судебным штрафом в размере от 500 тысяч до 1 миллиона рублей или лишением свободы сроком на 4 года

2. Умышленное невыполнение требований следователя, вытекающих из его полномочий, установленных законодательством, а равно законных требований следователя или должностного лица, осуществляющего производство по уголовному делу, а также игнорирование требований следственных органов выдвинутых в виде официальных запросов, - наказывается судебным штрафом в размере от 250 до 300 тысяч рублей или лишением свободы сроком на 4 года

ГЛАВА Х. ПРЕСТУПЛЕНИЯ ПРОТИВ ПРАВОСУДИЯ​

Статья 57. Воспрепятствование осуществлению правосудия
Вмешательство в какой бы то ни было форме в деятельность суда в целях воспрепятствования осуществлению правосудия; в деятельность следователя в целях воспрепятствования всестороннему, полному и объективному расследованию дела, - наказывается лишением свободы сроком на 5 лет

Статья 58. Незаконное возбуждение уголовного дела
Привлечение заведомо невиновного к уголовной ответственности, - наказывается лишением свободы сроком на 5 лет

Статья 59. Незаконное освобождение от уголовной ответственности
Незаконное освобождение от уголовной ответственности лица, подозреваемого или обвиняемого в совершении преступления, следователем или иным лицом, осуществляющим правоохранительную деятельность, - наказывается судебным штрафом в размере от 100 до 250 тысяч рублей или лишением свободы сроком на 5 лет

Статья 60. Незаконные задержание, заключение под стражу, арест
Незаконные задержание, заключение под стражу или содержание под стражей, а равно те же деяния, совершенных вопреки федеральным законам, - наказывается лишением свободы сроком на 5 лет

Статья 61. Заведомо ложный донос
1. Заведомо ложный донос о совершении преступления;
2. Дача заведомо ложных показаний при допросе или ином следственном, процессуальном мероприятии со следователем, сотрудником правоохранительного органа;
3. Дача заведомо ложных показаний в суде, в ходе судебного заседания;
4. Составление заведомо ложного медицинского заключения или дача заведомо ложных показаний по нему в суде или в ходе расследования, не соответствующих действительности, - наказывается лишением свободы сроком на 2 года

Статья 62. Неисполнение приговора суда, решение суда
Неисполнение вступивших в законную силу приговора суда, решения суда или иного судебного акта, а равно воспрепятствование их исполнению лицом, подвергнутым такому наказанию, - наказывается лишением свободы сроком на 5 лет

Статья 63. Укрывательство преступлений
Укрывательство преступления, орудий преступления или иных улик; сокрытие лица, совершившего преступление или помощь такому лицу в сокрытии от сотрудников правоохранительных органов, -наказывается лишением свободы сроком на 4 года


Лицо не подлежит уголовной ответственности за укрывательство преступлений, если преступление было совершено им, его супругом(-ой) или близкими родственниками (люди, имеющие такую же фамилию, как и у преступника);

Исключение: содействие совершению преступления путём пособничества, а равно советами, указаниями, предоставлением информации, средств или орудий совершения преступления либо устранением препятствий, а также лицо, заранее обещавшее скрыть преступника, средства или орудия совершения преступления, следы преступления либо предметы, добытые преступным путем, а равно лицо, заранее обещавшее приобрести или сбыть такие предметы

Статья 64. Побег из места лишения свободы, из-под ареста
Побег из места лишения свободы, из-под ареста, во время задержания или из-под стражи, совершенный задержанным лицом, лицом отбывающим наказание, или находящимся в предварительном заключении, - наказывается лишением свободы сроком на 4 года

ГЛАВА XI. ПРЕСТУПЛЕНИЯ ПРОТИВ ПОРЯДКА УПРАВЛЕНИЯ​

Статья 65. Посягательство на жизнь сотрудника правоохранительного органа
Посягательство на жизнь сотрудника правоохранительного органа, находящегося при исполнении обязанностей в целях воспрепятствования законной деятельности указанных лиц по охране общественного порядка, обеспечению общественной безопасности или иной деятельности, либо из мести за такую деятельность, - наказывается лишением свободы сроком на 6 лет

Статья 66. Применение насилия в отношении представителя власти
Применение насилия в отношении представителя власти, опасного для его жизни и здоровья, - наказывается лишением свободы сроком на 5 лет

Статья 67. Оскорбление представителя власти
Публичное оскорбление, а равно умышленное унижение чести и достоинства личности, выраженное как в устной форме, так и в виде действия, в отношении представителя власти, - наказывается судебным штрафом в размере от 10 до 50 тысяч рублей или лишением свободы сроком на 2 года

ГЛАВА XII. ПРЕСТУПЛЕНИЯ ПРОТИВ ВОЕННОЙ СЛУЖБЫ
​
Статья 68. Неисполнение воинского приказа
Неисполнение подчиненным приказа начальника, отданного в установленном порядке, причинившее существенный вред интересам службы, -наказывается лишением свободы сроком на 4 года

Статья 69. Сопротивление начальнику или принуждение его к нарушению обязанностей
Сопротивление начальнику, а равно иному лицу, исполняющему возложенные на него обязанности военной службы, или принуждение его к нарушению этих обязанностей, - наказывается лишением свободы сроком на 4 года

Статья 70. Оскорбление военнослужащего
Оскорбление одним военнослужащим другого во время исполнения обязанностей военной службы, - наказывается лишением свободы сроком на 2 года

Статья 71. Самовольное оставление части или места службы
Самовольное оставление части или места службы, а равно неявка в установленный срок после отпуска или увольнительной, а также оставление части или места несения службы для совершения каких бы то ни было личных целей за пределами части, места несения службы без разрешения начальника,- наказывается лишением свободы сроком на 5 лет

Статья 72. Дезертирство
Дезертирство, то есть самовольное оставление части или места службы в целях уклонения от прохождения военной службы,-
наказывается лишением свободы сроком на 8 лет

Статья 73. Умышленные уничтожение или повреждение военного имущества
Умышленные уничтожение или повреждение оружия, боеприпасов или предметов военной техники военнослужащим,-
наказывается лишением свободы сроком на 3 года
`},{slug:"koap",abbr:"КоАП",title:"Кодекс об административных правонарушениях",notes:"Административные составы и штрафы.",updated:"2025-02-23",content:`# Кодекс об административных правонарушениях

##ЧАСТЬ 1. ПРАВИЛА ДОРОЖНОГО ДВИЖЕНИЯ

Глава 1. Отсутствие документов, регистрации автомобиля и штрафы​

Статья 1.1. Эксплуатация транспортного средства с наличием трех и более неоплаченных административных штрафов
Эксплуатация транспортного средства с наличием трех и более неоплаченных административных штрафов, превышающих срок 24 часа, - влечет наложение административного штрафа в размере 25.000 рублей

Статья 1.2. Управление транспортным средством, не зарегистрированным в установленном порядке
Управление транспортным средством, не зарегистрированным в установленном порядке, - влечёт наложение административного штрафа в размере 20.000 рублей
Управлять транспортным средством, не зарегистрированным в установленном порядке разрешено, если транспортное средство имеет не более 200 км пробега

Глава 2. Техническое состояние транспортного средства​

Статья 2.1. Использование специальных световых и звуковых сигналов
Использование специальных световых и звуковых сигналов закрепленных на гражданских транспортных средствах, - влечёт замечание, а при повторном нарушении наложение административного штрафа в размере 50.000 рублей

Статья 2.2. Управление транспортным средством, с неисправными световыми приборами
Управление транспортным средством, с двумя неисправными световыми приборами, - влечёт замечание, при повторном нарушении наложение административного штрафа в размере 5.000 рублей

Статья 2.3. Управление транспортным средством с неисправным двигателем
Управление транспортным средством с неисправным двигателем, - влечёт замечание или наложение административного штрафа в размере 10.000 рублей

Статья 2.4. Управление транспортным средством с неисправным колесом
Управление транспортным с неисправным колесом, - влечёт замечание или наложение административного штрафа в размере 25.000 рублей

Статья 2.5. Управление транспортным средством с неисправным поворотником
Управление транспортным средством с неисправным поворотником, - влечёт замечание или наложение административного штрафа в размере 5.000 рублей
Глава 3. Отсутствие права управления​

Статья 3.1. Управление транспортным средством водителем, не имеющим права управления транспортным средством
Управление транспортным средством водителем, не имеющим права управления транспортным средством, - влечёт наложение административного штрафа в размере 35.000 рублей, а также эвакуация транспортного средства

Статья 3.2. Управление транспортным средством водителем, лишенным права управлениям
Управление транспортным средством водителем, лишенным права управления, - влечёт наложение административного штрафа в размере 50.000 рублей, а также эвакуация транспортного средства

Статья 3.3. Управление транспортным средством водителем, находящимся в состоянии опьянения
Управление транспортным средством водителем, находящимся в состоянии опьянения, если такие действия не содержат уголовно наказуемого деяния, - влечёт наложение административного штрафа в размере 40.000 рублей, а также лишение права управления транспортными средствами и эвакуация транспортного средства

Статья 3.4. Перевозка грузов без наличия подлинного документа, используемого при передаче товарно-материальных ценностей
Перевозка грузов без наличия подлинного документа, используемого при передаче товарно-материальных ценностей (накладная), - влечёт наложение административного штрафа в размере 75.000 рублей, а также принудительное изъятие груза

Глава 4. Превышение скорости​

Статья 4.1. Превышение установленной скорости движения транспортного средства на величину более 20, но не более 60 км/ч
- влечёт наложение административного штрафа в размере 15.000 рублей


Статья 4.2. Превышение установленной скорости движения транспортного средства на величину более 60, но не более 100 км/ч
- влечёт наложение административного штрафа в размере 20.000 рублей

Статья 4.3. Превышение установленной скорости движения транспортного средства на величину более 100 км/ч
- влечёт наложение административного штрафа в размере 25.000 рублей

Статья 4.4. Повторное совершение административного правонарушения, предусмотренного статьей 4.1, 4.2, 4.3, -
влечёт наложение административного штрафа в размере 40.000 рублей и лишение права на управление транспортным средством

Глава 5. Железная дорога​

Статья 5.1. Пересечение железнодорожного пути вне железнодорожного переезда, выезд на железнодорожный переезд при закрытом или закрывающемся шлагбауме
пересечение железнодорожного пути вне железнодорожного переезда, выезд на железнодорожный переезд при закрытом или закрывающемся шлагбауме, - влечёт наложение административного штрафа в размере 50.000 рублей

Статья 5.2. Повреждение железнодорожного пути посредством заезда или проезда по железнодорожным путям на транспортном средстве
Повреждение железнодорожного пути посредством заезда или проезда по железнодорожным путям на транспортном средстве, - влечёт наложение административного штрафа в размере 25.000 рублей

Глава 6. Автомагистраль​

Статья 6.1. Разворот транспортного средства на автомагистрали либо движение задним ходом по автомагистрали
Разворот транспортного средства на автомагистрали либо движение задним ходом по автомагистрали, - влечёт наложение административного штрафа в размере 15.000 рублей.

Глава 7. Перекресток​

Статья 7.1. Проезд на запрещающий сигнал светофора
Проезд на запрещающий сигнал светофора (красный), - влечёт наложение административного штрафа в размере 30.000 рублей

Примечание к ст. 7.1: гражданские лица, получившие штраф от радара за проезд на красный сигнал светофора не могут быть повторно наказаны за данное нарушение сотрудником ДПС. Данная статья необходима для водителей транспортных средств, пользующихся преимуществом служебного транспорта

Статья 7.2. Невыполнение требования уступить дорогу транспортному средству, пользующемуся преимущественным правом проезда перекрестков
Невыполнение требования уступить дорогу транспортному средству, пользующемуся преимущественным правом проезда перекрестков, - влечёт наложение административного штрафа в размере 25.000 рублей

Глава 8. Маневрирование​

Статья 8.1. Невыполнение требования подать сигнал перед началом движения, перестроением, поворотом, разворотом или остановкой
Невыполнение требования подать сигнал перед началом движения, перестроением, поворотом, разворотом или остановкой, - влечёт замечание или наложение административного штрафа в размере 5.000 рублей

Статья 8.2. Разворот или движение задним ходом
Разворот или движение задним ходом в местах, где такие маневры запрещены, - влечёт наложение административного штрафа в размере 5.000 рублей

Статья 8.3. Невыполнение требования уступить дорогу транспортному средству, пользующемуся преимущественным правом движения
Невыполнение требования уступить дорогу транспортному средству, пользующемуся преимущественным правом движения, - влечёт наложение административного штрафа в размере 10.000 рублей

Статья 8.4. Нарушение правил пользования звуковыми сигналами, аварийной сигнализацией или знаком аварийной остановки
Нарушение правил пользования звуковыми сигналами, аварийной сигнализацией или знаком аварийной остановки, - влечёт замечание или наложение административного штрафа в размере 10.000 рублей

Статья 8.5. Опасное вождение
Движение транспортного средства, которое создает угрозу гибели или ранения людей, повреждения транспортных средств, сооружений, грузов или причинения иного материального ущерба, - влечёт наложение административного штрафа в размере 17.500 рублей и лишение права на управление транспортным средством

Глава 9. Расположение, обгон​

Статья 9.1. Нарушение правил расположения транспортного средства
Нарушение правил расположения транспортного средства на проезжей части дороги, встречного разъезда, а равно движение по обочинам, - влечёт наложение административного штрафа в размере 10.000 рублей

Статья 9.2. Движение по велосипедным или пешеходным дорожкам
Движение по велосипедным или пешеходным дорожкам либо тротуарам, газонам, - влечёт замечание или наложение административного штрафа в размере 15.000 рублей

Статья 9.3. Выезд на полосу встречного движения
Выезд в нарушение Правил дорожного движения на полосу, предназначенную для встречного движения, - влечёт наложение административного штрафа в размере 15.000 рублей

Статья 9.4. Умышленный выезд на полосу встречного движения
Умышленный выезд в нарушение Правил дорожного движения на полосу, предназначенную для встречного движения, - влечёт наложение административного штрафа в размере 30.000 рублей, а также лишение права управления транспортными средствами и эвакуация транспортного средства

Глава 10. Знаки и разметка​

Статья 10.1. Несоблюдение требований, предписанных дорожными знаками или разметкой проезжей части
Несоблюдение требований, предписанных дорожными знаками или разметкой проезжей части, - влечёт наложение административного штрафа в размере 10.000 рублей

Статья 10.2. Поворот налево или разворот в нарушение требований, предписанных дорожными знаками или разметкой
Поворот налево или разворот в нарушение требований, предписанных дорожными знаками или разметкой проезжей части дороги, - влечёт наложение административного штрафа в размере 15.000 рублей

Статья 10.3. Движение во встречном направлении по дороге с односторонним движением
Движение во встречном направлении по дороге с односторонним движением, - влечёт наложение административного штрафа в размере 35.000 рублей, а также лишение права управления транспортными средствами и эвакуация транспортного средства

Глава 11. Предоставить преимущество​

Статья 11.1. Непредоставление преимущества в движении маршрутному транспортному средству
Непредоставление преимущества в движении маршрутному транспортному средству, - влечёт наложение административного штрафа в размере 15.000 рублей

Статья 11.2. Непредоставление преимущества в движении транспортному средству с одновременно включенными проблесковым маячком синего цвета и специальным звуковым сигналом
Непредоставление преимущества в движении транспортному средству с одновременно включенными проблесковым маячком синего цвета и специальным звуковым сигналом, - влечёт наложение административного штрафа в размере 25.000 рублей, а также лишение права управления транспортными средствами и эвакуация транспортного средства

Статья 11.3. Непредоставление преимущества в движении колонны в сопровождении государственных служб с включёнными специальными звуковыми и световыми сигналами
Непредоставление преимущества в движении колонны в сопровождении государственных служб с включёнными специальными звуковыми и световыми сигналами, - влечёт наложение административного штрафа в размере 50.000 рублей, а также лишение права управления транспортными средствами и эвакуация транспортного средства

Статья 11.4. Невыполнение требования Правил дорожного движения уступить дорогу пешеходам, велосипедистам или иным участникам дорожного движения
Невыполнение требования Правил дорожного движения уступить дорогу пешеходам, велосипедистам или иным участникам дорожного движения, - влечёт наложение административного штрафа в размере 10.000 рублей

Глава 12. Остановка и стоянка
​
Статья 12.1. Нарушение правил остановки, стоянки, парковки транспортных средств
Нарушение правил остановки, стоянки, парковки транспортных средств, - влечёт замечание, при повторном нарушении наложение административного штрафа в размере 25.000 рублей, а также эвакуация транспортного средства

Статья 12.2. Нарушение правил остановки, стоянки, парковки транспортных средств на проезжей части, повлекшее создание препятствий для движения других транспортных средств
Нарушение правил остановки, стоянки, парковки транспортных средств на проезжей части, повлекшее создание препятствий для движения других транспортных средств, - влечёт наложение административного штрафа в размере 50.000 рублей, а также эвакуация транспортного средства

Глава 13. Безопасность движения
​
Статья 13.1. Движение транспортного средства с выключенными габаритными огнями
Движение транспортного средства с выключенными габаритными огнями в любое время суток, - влечёт замечание и требование об немедленном устранении административного правонарушения на месте, при повторном нарушении наложение административного штрафа в размере 10.000 рублей

Статья 13.2. Использование управляемого заноса
Умышленное или провокационное использование управляемого заноса транспортного средства (дрифт) и другие рискованные трюки на проезжей части и прилегающей территории, - влечёт наложение административного штрафа в размере 50.000 рублей, а также лишение права управления транспортными средствами и эвакуация транспортного средства

Статья 13.3. Использование телефона
Пользование водителем во время движения транспортного средства телефоном, - влечёт замечание или наложение административного штрафа в размере 10.000 рублей

Статья 13.4. Нарушение правил дорожного движения пешеходом
Нарушение правил дорожного движения пешеходом, - влечёт замечание или наложение административного штрафа в размере 10.000 рублей в зависимости от совершенного им административного правонарушения

Статья 13.5. Нарушение правил, установленных для движения транспортных средств в жилых зонах
Нарушение правил, установленных для движения транспортных средств в жилых зонах, - влечёт замечание или наложение административного штрафа в размере 5.000 рублей

Статья 13.6. Светопропускаемость стекол транспортного средства
Управление транспортным средством, на котором установлены лобовое и/или боковые стекла, светопропускаемость которых ниже 50%, - влечёт наложение административного штрафа в размере 50.000 рублей, а также принудительное устранение административного правонарушения на месте
Глава 14. Дорожно - транспортное происшествие​

Статья 14.1. Виновник дорожно-транспортного происшествия без вреда здоровью и жизни граждан
Создание участником дорожного движения дорожно-транспортного происшествия без вреда здоровью и жизни граждан, - влечёт наложение административного штрафа в размере 15.000 рублей

Статья 14.2. Виновник дорожно-транспортного происшествия, повлекшее тяжкий вред здоровью
Создание участником дорожного движения дорожно-транспортного происшествия, повлекшее тяжкий вред здоровью, - влечёт наложение административного штрафа в размере 25.000 рублей, а также лишение права управления транспортными средствами и эвакуация транспортного средства

Статья 14.3. Виновник дорожно-транспортного происшествия, повлекшее смерть
Создание участником дорожного движения дорожно-транспортного происшествия, повлекшее смерть человека, - влечёт наложение административного штрафа в размере 30.000 рублей, а также лишение права управления транспортными средствами и эвакуация транспортного средства

Статья 14.4. Оставление участником дорожного движения места дорожно-транспортного происшествия
Оставление водителем или иным участником дорожного движения, причастного к дорожно-транспортному происшествию, места дорожно-транспортного происшествия, - влечёт наложение административного штрафа в размере 50.000 рублей, а также лишение права управления транспортными средствами и эвакуация транспортного средства

Статья 14.5. Умышленное создание аварийной ситуации со стороны виновника дорожно-транспортного происшествия
Умышленное создание аварийной ситуации со стороны виновника дорожно-транспортного происшествия, - влечёт наложение административного штрафа в размере 50.000 рублей, а также лишение права управления транспортными средствами и эвакуация транспортного средства

Глава 15. Полиция​

Статья 15.1. Неповиновение законному требованию об остановке транспортного средства
Неповиновение законному требованию сотрудника полиции, органа федеральной службы безопасности об остановке транспортного средства, - влечёт наложение административного штрафа в размере 50.000 рублей, а также лишение права управления транспортными средствами и эвакуация транспортного средства

Статья 15.2. Неповиновение законному требованию о предоставлении документов на транспортное средство или перевозимый груз
Неповиновение законному требованию сотрудника полиции, органа федеральной службы безопасности о предоставлении документов на транспортное средство или перевозимый груз, - влечёт наложение административного штрафа в размере от 25.000 до 50.000 рублей;

Статья 15.3 Неповиновение законному требованию о предоставлении информации о пробеге автомобиля
Неповиновение законному требованию сотрудника полиции, органа федеральной службы безопасности о предоставлении информации о пробеге автомобиля, - влечёт наложение административного штрафа в размере от 15.000 до 50.000 рублей;

Глава 16. Административные правонарушения, посягающие на права граждан​

Статья 16.1. Оскорбление
Оскорбление, то есть унижение чести и достоинства лица, выраженное в неприличной или иной противоречащей общепринятым нормам морали и нравственности форме, - влечёт наложение административного штрафа в размере 25.000 рублей

Статья 16.2. Клевета
Клевета, то есть распространение заведомо ложных сведений, порочащих честь и достоинство другого лица или подрывающих его репутацию, - влечёт наложение административного штрафа в размере 20.000 рублей

Статья 16.3. Дискриминация
Дискриминация, а равно ограничение прав и свобод человека или различное обращение с людьми или социальными группами на основании какого-либо признака, - влечёт наложение административного штрафа в размере 25.000 рублей

Статья 16.4. Мелкое хулиганство
Негрубое нарушение общественного порядка, выражающее явное неуважение к обществу, сопровождающееся нецензурной бранью в общественных местах, - влечёт наложение административного штрафа в размере 10.000 рублей.

Глава 17. Административные правонарушения, посягающие на здоровье, санитарно-эпидемиологическое благополучие населения и общественную нравственность
​
Статья 17.1. Незаконный оборот, употребление наркотических средств
Хранение, перевозка или иные способы транспортировки наркотических средств в размере, равным до 2 грам включительно, а также употребление запрещенных веществ, - влечёт наложение административного штрафа в размере 35.000 рублей
Статья 17.2. Занятие проституцией
Занятие проституцией, - влечёт наложение административного штрафа в размере 25.000 рублей

Статья 17.3. Курение в общественных местах
Курение в общественных местах, - влечёт наложение административного штрафа в размере 5.000 рублей
Статья 17.4. Распитие спиртных напитков в общественных местах
Распитие спиртных напитков в общественных местах, - влечёт наложение административного штрафа в размере 10.000 рублей.

Глава 18. Административные правонарушения, посягающие на общественный порядок и общественную безопасность​

Статья 18.1. Организация несанкционированного публичного мероприятия
Организация несанкционированного публичного собрания, митинга, демонстрации, шествия или пикетирования, - влечёт наложение административного штрафа в размере 50.000 рублей

Статья 18.2. Участие в несанкционированном публичном мероприятии
Участие в несанкционированном публичном собрании, митинге, демонстрации, шествии или пикетировании, - влечёт наложение административного штрафа в размере 35.000 рублей

Статья 18.3. Громкое прослушивание музыки
1. Громкое прослушивание музыки в населенных пунктах после 22:00, - влечёт замечание, в случае повторного нарушения наложение административного штрафа в размере 25.000 рублей

2. Громкое прослушивание музыки во время проведения массовых общественных мероприятий или прослушивание музыки, направленное на намеренное создание помехи выполнению служебных обязанностей сотрудникам государственных организаций и учреждений вблизи от места построения или сбора, служебной парковки организации, - влечет замечание и требование сотрудника правоохранительного органа о выключении музыки, в случае повторного нарушения наложение административного штрафа в размере от 50.000 до 200.000 рублей

Статья 18.4. Блокирование транспортных коммуникаций
Организация блокирования, а равно активное участие в блокировании транспортных коммуникаций, - влечёт наложение административного штрафа в размере 30.000 рублей

Статья 18.5. Нарушение правил перевозки, транспортирования оружия и патронов к нему
Нарушение правил перевозки, транспортирования оружия и патронов к нему, - влечёт наложение административного штрафа в размере 20.000 рублей

Статья 18.6. Нарушение общественного порядка
Хулиганство, а равно нарушение общественного порядка, - влечёт наложение административного штрафа в размере 25.000 рублей

Глава 19. Административные правонарушения, посягающие на общественный порядок в день тишины
​
Статья 19.1. Подкуп избирателей
Подкуп избирателей, - влечёт наложение административного штрафа в размере 100.000 рублей

Статья 19.2. Агитация в день тишины
Агитация в день тишины, - влечёт наложение административного штрафа в размере 200.000 рублей

Глава 20. Административные правонарушения против порядка управления
​
Статья 20.1. Заведомо ложный вызов специализированных служб
Заведомо ложный вызов специализированных служб, - влечёт наложение административного штрафа в размере 25.000 рублей

Статья 20.2. Сообщение ложных сведений правоохранительным органам
1. Дача заведомо ложных показаний, - влечёт наложение административного штрафа в размере 25.000 рублей

2. Заведомо ложный донос о совершении преступления, - влечёт наложение административного штрафа в размере 25.000 рублей

Статья 20.3. Заведомо ложное сообщение об акте терроризма
Заведомо ложное сообщение об акте терроризма, - влечёт наложение административного штрафа в размере 25.000 рублей

Статья 20.4. Применение насилия в отношении представителя власти
Применение насилия в отношении представителя власти, - влечёт наложение административного штрафа в размере 35.000 рублей

Статья 20.5. Оскорбление представителя власти
Оскорбления, а равно унижение чести в отношении представителя власти, выраженное в неприличной или иной противоречащей общепринятым нормам морали и нравственности форме, - влечёт наложение административного штрафа в размере 50.000 рублей

Статья 20.6. Неповиновение законному требованию сотрудника
Неповиновение законному требованию или распоряжению сотрудника полиции, военнослужащего, сотрудника органов федеральной службы безопасности, федеральной службы исполнения наказаний, - влечёт наложение административного штрафа в размере 40.000 рублей

Статья 20.7. Воспрепятствование осуществлению законной деятельности органов исполнительной власти
Воспрепятствование осуществлению законной деятельности органов полиции, федеральной службы исполнения наказаний, федеральной службы безопасности, намеренное создание помех проведению следственных, оперативно-розыскных или иных процессуальных мероприятий при несоблюдении гражданином дистанции в 15 метров от места проведения таковых мероприятий, невыполнение законного требования сотрудника органов внутренних дел, федеральной службы безопасности, федеральной службы исполнения наказаний покинуть место проведения таковых мероприятий или сократить дистанцию до 15 метров, - влечёт наложение административного штрафа в размере 50.000 до 100.000 рублей

Глава 21. Административные правонарушения против судебной власти​

Статья 21.1. Неисполнение распоряжения судьи или судебного пристава по обеспечению установленного порядка деятельности судов
Неисполнение законного распоряжения судьи о прекращении действий, нарушающих установленные в суде, - влечёт наложение административного штрафа в размере 30.000 рублей

Статья 21.2. Неисполнения решения/приговора суда
Злостное неисполнение вступивших в законную силу приговора суда, решения суда или иного судебного акта, а равно воспрепятствование их исполнению лицом, - влечёт наложение административного штрафа в размере 100.000 рублей

##ЧАСТЬ 2. АДМИНИСТРАТИВНЫЙ ПРОЦЕСС
​
Статья 22. Административное задержание
1. Административное задержание, то есть кратковременное ограничение свободы физического лица, может быть применено в исключительных случаях:

1) если это необходимо для составления протокола об административном правонарушении;

2) если это необходимо для доставления лица, совершившего административное правонарушение, в органы полиции для дальнейшего разбирательства;

2. Применение специальных средств во время административного задержания допустимо в случае, если у сотрудника правоохранительного органа имеются основания полагать, что задержанное лицо может попытаться скрыться от правоохранительных органов или оказать сопротивление

3. Проводить административное задержание могут сотрудники органов внутренних дел и федеральной службы безопасности;

Статья 23. Личный досмотр
Личный досмотр, досмотр вещей, находящихся при физическом лице, то есть обследование вещей, проводимое без нарушения их конструктивной целостности, осуществляются в случае необходимости в целях обнаружения орудий совершения либо предметов административного правонарушения при административном задержании

Досмотр транспортного средства проводится сотрудниками органов внутренних дел, федеральной службы безопасности:

а) во время проведения оперативно-профилактических мероприятий, направленных на выявление и пресечений нарушений в области законодательства, регулирующего оборот оружия и наркотических веществ;

б) при наличии повода к возбуждению дела об административном правонарушении, предусмотренных ст. 8.5, 9.1, 9.3, 9.4, 13.2, 13.6, 14.1 - 14.5, 15.1, 15.2;

в) в случае, если транспортное средство находится в угоне или розыске, владелец транспортного средства скрылся от сотрудников правоохранительных органов во время задержания или иных процессуальных действий;

В остальных случаях сотрудник полиции, органа федеральной службы безопасности может только предложить осмотреть транспортное средство
`},{slug:"pdd",abbr:"ПДД",title:"Правила дорожного движения",notes:"Обязанности водителей и пешеходов.",updated:"2025-02-23",content:`# Правила дорожного движения

##1. Общие положения​
###1.1. Настоящие правила дорожного движения устанавливают единый порядок дорожного движения на всей территории страны. Другие нормативные акты, касающиеся дорожного движения, должны основываться на требованиях правил и не противоречить им.​
###1.2. В правилах используются следующие основные понятия и термины:​
Вынужденная остановка – прекращение движения транспортного средства из-за его технической неисправности или опасности, создаваемой перевозимым грузом, состоянием водителя (пассажира) или появлением препятствия на дороге.​
Главная дорога – дорога по отношению к пересекаемой (примыкающей), или дорога с твердым покрытием (асфальт и цементобетон, каменные материалы и тому подобное) по отношению к грунтовой, либо любая дорога по отношению к выездам с прилегающих территорий. Наличие на второстепенной дороге непосредственно перед перекрестком участка с покрытием не делает ее равной по значению с пересекаемой.​
Дорога – обустроенная или приспособленная и используемая для движения транспортных средств полоса земли либо поверхность искусственного сооружения. Дорога включает в себя одну или несколько проезжих частей, а также трамвайные пути, тротуары, обочины и разделительные полосы при их наличии.​
Дорожное движение – совокупность общественных отношений, возникающих в процессе перемещения людей и грузов с помощью транспортных средств или без таковых в пределах дорог.​
Дорожно-транспортное происшествие – событие, возникшее в процессе движения по дороге транспортного средства и с его участием, при котором погибли или ранены люди, повреждены транспортные средства, сооружения, грузы либо причинен иной материальный ущерб.​
Железнодорожный переезд – пересечение дороги с железнодорожными путями на одном уровне.​
Населенный пункт – застроенная территория.​
Обгон – опережение одного или нескольких транспортных средств, связанное с выездом на полосу (сторону проезжей части), предназначенную для встречного движения, и последующим возвращением на ранее занимаемую полосу (сторону проезжей части).​
Обочина – элемент дороги, примыкающий непосредственно к проезжей части на одном уровне с ней, отличающийся типом покрытия или выделенный, используемый для движения, остановки и стоянки в соответствии с Правилами.

Остановка – преднамеренное прекращение движения транспортного средства на время до 5 минут, а также на большее, если это необходимо для посадки или высадки пассажиров либо загрузки или разгрузки транспортного средства.

Участник дорожного движения – лицо, принимающее непосредственное участие в процессе движения в качестве водителя, пешехода, пассажира транспортного средства.

Прилегающая территория – территория, непосредственно прилегающая к дороге и не предназначенная для сквозного движения транспортных средств (дворы, жилые массивы, автостоянки, АЗС, предприятия и тому подобное). Движение по прилегающей территории осуществляется в соответствии с настоящими Правилами.

Перекресток – место пересечения, примыкания или разветвления дорог на одном уровне, ограниченное воображаемыми линиями, соединяющими соответственно противоположные, наиболее удаленные от центра перекрестка начала закруглений проезжих частей. Не считаются перекрестками выезды с прилегающих территорий.

Транспортное средство – устройство, предназначенное для перевозки по дорогам людей, грузов или оборудования, установленного на нем.

Участник дорожного движения – лицо, принимающее непосредственное участие в процессе движения в качестве водителя, пешехода, пассажира транспортного средства.

##2. Общие обязанности водителей.​

###2.1. Водитель механического транспортного средства обязан:

2.1.1. Иметь при себе и по требованию сотрудников полиции передавать им, для проверки:
Водительское удостоверение или временное разрешение на право управления транспортным средством соответствующей категории;

Регистрационные документы на данное транспортное средство, а при наличии прицепа - и на прицеп;

В установленных случаях разрешение на осуществление деятельности по перевозке пассажиров и багажа легковым такси, путевой лист, лицензионную карточку и документы на перевозимый груз, а при перевозке крупногабаритных, тяжеловесных и опасных грузов - документы, предусмотренные правилами перевозки этих грузов;

Страховой полис обязательного страхования гражданской ответственности владельца транспортного средства в случаях, когда обязанность по страхованию своей гражданской ответственности установлена федеральным законом.

2.1.2. При движении на транспортном средстве, оборудованном ремнями безопасности, быть пристегнутым и не перевозить пассажиров, не пристегнутых ремнями. При управлении мотоциклом быть в застегнутом мотошлеме и не перевозить пассажиров без застегнутого мотошлема.

2.1.3. Предоставлять транспортное средство:
Сотрудникам полиции и органам федеральной службы безопасности в случаях, предусмотренных законодательством;

Медицинским и фармацевтическим работникам для перевозки граждан в ближайшее лечебно-профилактическое учреждение в случаях, угрожающих их жизни

###2.2. При дорожно-транспортном происшествии водитель, причастный к нему, обязан:
Остановить (не трогать с места) транспортное средство, включить аварийную сигнализацию и выставить знак аварийной остановки, не перемещать предметы, имеющие отношение к происшествию;

Принять меры для оказания первой помощи пострадавшим, вызвать "Единую службу спасения", а в экстренных случаях отправить пострадавших на попутном, а если это невозможно, доставить на своем транспортном средстве в ближайшее лечебное учреждение, сообщить свою фамилию, регистрационный знак транспортного средства (с предъявлением документа, удостоверяющего личность, или водительского удостоверения и регистрационного документа на транспортное средство) и возвратиться к месту происшествия;

Освободить проезжую часть, если движение других транспортных средств невозможно. При необходимости освобождения проезжей части или доставки пострадавших на своем транспортном средстве в лечебное учреждение предварительно зафиксировать в присутствии свидетелей положение транспортного средства, следы и предметы, относящиеся к происшествию, и принять все возможные меры к их сохранению и организации объезда места происшествия;

Сообщить о случившемся в полицию, записать фамилии и адреса очевидцев и ожидать прибытия сотрудников полиции.

2.2.1. Если в результате дорожно-транспортного происшествия нет пострадавших, водители при взаимном согласии в оценке обстоятельств случившегося могут, предварительно составив схему происшествия и подписав ее, прибыть на ближайший пост дорожно-патрульной службы (ДПС) или в подразделение полиции для оформления происшествия.

2.2.2. Если в результате дорожно-транспортного происшествия вред причинен только имуществу, водитель, причастный к нему, обязан освободить проезжую часть, если движению других транспортных средств создается препятствие, предварительно зафиксировав любыми возможными способами, в том числе средствами фотосъемки или видеозаписи, положение транспортных средств по отношению друг к другу и объектам дорожной инфраструктуры, следы и предметы, относящиеся к происшествию, и повреждения транспортных средств.
Водители, причастные к такому дорожно-транспортному происшествию, не обязаны сообщать о случившемся в полицию и могут оставить место дорожно-транспортного происшествия. В таком случае необходимо составить в письменном виде расписку, в которую вносится информация об участниках ДТП.

###2.3. Водителю запрещается:
Управлять транспортным средством в состоянии опьянения (алкогольного, наркотического или иного), под воздействием лекарственных препаратов, ухудшающих реакцию и внимание, в болезненном или утомленном состоянии, ставящем под угрозу безопасность движения;

Передавать управление транспортным средством лицам, находящимся в состоянии опьянения, под воздействием лекарственных препаратов, в болезненном или утомленном состоянии, а также лицам, не имеющим при себе водительского удостоверения на право управления транспортным средством данной категории или в случае его изъятия в установленном порядке - временного разрешения;

Пересекать организованные (в том числе и пешие) колонны и занимать место в них;

Употреблять алкогольные напитки, наркотические, психотропные или иные одурманивающие вещества после дорожно-транспортного происшествия, к которому он причастен, либо после того, как транспортное средство было остановлено по требованию сотрудника полиции, до проведения освидетельствования с целью установления состояния опьянения или до принятия решения об освобождении от проведения такого освидетельствования;

Пользоваться во время движения телефоном, не оборудованным техническим устройством, позволяющим вести переговоры без использования рук (( Запрещено при общении по телефону использовать текстовый чат. Разрешен только голосовой чат ));

Опасное вождение, выражающееся в неоднократном совершении одного или совершении нескольких следующих друг за другом действий, заключающихся в невыполнении при перестроении требования уступить дорогу транспортному средству, пользующемуся преимущественным правом движения, перестроении при интенсивном движении, когда все полосы движения заняты, кроме случаев поворота налево или направо, разворота, остановки или объезда препятствия, несоблюдении безопасной дистанции до движущегося впереди транспортного средства, несоблюдении бокового интервала, резком торможении, если такое торможение не требуется для предотвращения дорожно-транспортного происшествия, препятствовании обгону, если указанные действия повлекли создание водителем в процессе дорожного движения ситуации, при которой его движение и (или) движение иных участников дорожного движения в том же направлении и с той же скоростью создает угрозу гибели или ранения людей, повреждения транспортных средств, сооружений, грузов или причинения иного материального ущерба.

##3. Применение специальных сигналов.​

###3.1. Водители транспортных средств с включенным проблесковым маячком синего цвета, выполняя неотложное служебное задание, могут отступать от требований разделов и 8 - 18 настоящих правил, при условии обеспечения безопасности движения.

Для получения преимущества перед другими участниками движения водители таких транспортных средств должны включить проблесковый маячок синего цвета и специальный звуковой сигнал. Воспользоваться приоритетом они могут только убедившись, что им уступают дорогу.

Этим же правом пользуются водители транспортных средств, сопровождаемых транспортными средствами, имеющими нанесенные на наружные поверхности специальные цветографические схемы, с включенными проблесковыми маячками синего и красного цветов и специальным звуковым сигналом, в случаях, установленных настоящим пунктом. На сопровождаемых транспортных средствах должен быть включен ближний свет фар.

На транспортных средствах Государственной инспекции безопасности дорожного движения Министерства внутренних дел, Федеральной службы безопасности и дополнительно к проблесковому маячку синего цвета может быть включен проблесковый маячок красного цвета.

Согласно ПДД сотрудники полиции должны включать проблесковые маячки, когда выполняется неотложное служебное задание.
Служебным неотложным заданием для сотрудников полиции является:
    1) Выезд на преступление;
    2) Выезд на ДТП с пострадавшими;
    3) Преследование, как правонарушителя, так и лицо, которое совершило преступление;
    4) Оказание помощи нарядам полиции;
    5) Сопровождение автоколонны.

Cлужебным неотложным заданием для сотрудников федеральной службы безопасности является:

    1) Выезд на преступление;
    2) Преследование, как правонарушителя, так и лицо, которое совершило преступление;
    3) Оказание помощи силовикам;
    4) Сопровождение автоколонны.

Служебным неотложным заданием для военнослужащих военной полиции, военной-авто инспекции является:

    1) Выезд на преступление, совершённое в отношение военнослужащих;
    2) Сопровождение автоколонны;
    3) Преследование, как правонарушителя, так и лицо, которое совершило преступление.

Служебным неотложным заданием для сотрудников ЕСС и МЧС является:

    1) Выезд на вызов для оказания медицинской помощи;
    2) Выезд на вызов противопожарной сигнализации;
    3) Выезд на чрезвычайную ситуацию;
    4) Доставление пострадавшего в медицинское учреждение.

###3.2. При приближении транспортного средства с включенными проблесковым маячком синего цвета и специальным звуковым сигналом водители обязаны уступить дорогу для обеспечения беспрепятственного проезда указанного транспортного средства.
При приближении транспортного средства, имеющего нанесенные на наружные поверхности специальные цветографические схемы, с включенными проблесковыми маячками синего и красного цветов и специальным звуковым сигналом водители обязаны уступить дорогу для обеспечения беспрепятственного проезда указанного транспортного средства, а также сопровождаемого им транспортного средства (сопровождаемых транспортных средств).
Запрещается выполнять обгон транспортного средства, имеющего нанесенные на наружные поверхности специальные цветографические схемы с включенными проблесковым маячком синего цвета и специальным звуковым сигналом.
Запрещается выполнять обгон транспортного средства, имеющего нанесенные на наружные поверхности специальные цветографические схемы, с включенными проблесковыми маячками синего и красного цветов и специальным звуковым сигналом, а также сопровождаемого им транспортного средства (сопровождаемых транспортных средств).

###3.3. Приближаясь к стоящему транспортному средству с включенным проблесковым маячком синего цвета, водитель должен снизить скорость, чтобы иметь возможность немедленно остановиться в случае необходимости.
Включенный проблесковый маячок желтого или оранжевого цвета не дает преимущества в движении и служит для предупреждения других участников движения об опасности.

##4. Обязанности пешеходов.
​
###4.1. Пешеходы должны двигаться по тротуарам, пешеходным дорожкам, а при их отсутствии - по обочинам.
При отсутствии тротуаров, пешеходных дорожек или обочин, а также в случае невозможности двигаться по ним пешеходы могут идти в один ряд по краю проезжей части (на дорогах с разделительной полосой - по внешнему краю проезжей части).
При движении по краю проезжей части пешеходы должны идти навстречу движению транспортных средств. Лица, ведущие мотоцикл, мопед, велосипед, в этих случаях должны следовать по ходу движения транспортных средств.

###4.2. Пешеходы должны переходить дорогу по пешеходным переходам, в том числе по подземным и надземным, а при их отсутствии - на перекрестках по линии тротуаров или обочин.
При отсутствии в зоне видимости перехода или перекрестка разрешается переходить дорогу под прямым углом к краю проезжей части на участках без разделительной полосы и ограждений там, где она хорошо просматривается в обе стороны.

###4.3. В местах, где движение регулируется, пешеходы должны руководствоваться сигналами пешеходного светофора, а при его отсутствии - транспортного светофора.

###4.4. На нерегулируемых пешеходных переходах пешеходы могут выходить на проезжую часть (железнодорожные пути) после того, как оценят расстояние до приближающихся транспортных средств, их скорость и убедятся, что переход будет для них безопасен. При переходе дороги вне пешеходного перехода пешеходы, кроме того, не должны создавать помех для движения транспортных средств и выходить из-за стоящего транспортного средства или иного препятствия, ограничивающего обзорность, не убедившись в отсутствии приближающихся транспортных средств.

###4.5. Выйдя на проезжую часть (железнодорожные пути), пешеходы не должны задерживаться или останавливаться, если это не связано с обеспечением безопасности движения. Пешеходы, не успевшие закончить переход, должны остановиться на линии, разделяющей транспортные потоки противоположных направлений. Продолжать переход можно лишь убедившись в безопасности дальнейшего движения и с учетом сигнала светофора.

###4.6. При приближении транспортных средств с включенным проблесковым маячком синего цвета (синего и красного цветов) и специальным звуковым сигналом пешеходы обязаны воздержаться от перехода дороги, а пешеходы, находящиеся на проезжей части, должны незамедлительно освободить проезжую часть.

###5. Обязанности пассажиров.​

5.1. Пассажиры обязаны:
При поездке на транспортном средстве, оборудованном ремнями безопасности, быть пристегнутыми ими, а при поездке на мотоцикле - быть в застегнутом мотошлеме;
Посадку и высадку производить со стороны тротуара или обочины и только после полной остановки транспортного средства.
Если посадка и высадка невозможна со стороны тротуара или обочины, она может осуществляться со стороны проезжей части при условии, что это будет безопасно и не создаст помех другим участникам движения.

5.2. Пассажирам запрещается:
Отвлекать водителя от управления транспортным средством во время его движения;
При поездке на грузовом автомобиле с бортовой платформой стоять, сидеть на бортах или на грузе выше бортов;
Открывать двери транспортного средства во время его движения.

###6. Применение аварийной сигнализации и знака аварийной остановки.​

6.1. Аварийная сигнализация должна быть включена:
При дорожно-транспортном происшествии;
При вынужденной остановке в местах, где остановка запрещена;
При ослеплении водителя светом фар;
При буксировке (на буксируемом механическом транспортном средстве);
При посадке детей в транспортное средство, имеющее опознавательные знаки «Перевозка детей»*, и высадке из него.

Вынужденная остановка - прекращение движения транспортного средства из-за его технической неисправности или опасности, создаваемой перевозимым грузом, состоянием водителя (пассажира) или появлением препятствия на дороге.
Водитель должен включать аварийную сигнализацию и в других случаях для предупреждения участников движения об опасности, которую может создать транспортное средство.

6.2. При остановке транспортного средства и включении аварийной световой сигнализации, а также при ее неисправности или отсутствии знак аварийной остановки должен быть незамедлительно выставлен:
При дорожно-транспортном происшествии;

При вынужденной остановке в местах, где она запрещена, и там, где с учетом условий видимости транспортное средство не может быть своевременно замечено другими водителями.
Этот знак устанавливается на расстоянии, обеспечивающем в конкретной обстановке своевременное предупреждение других водителей об опасности. Однако это расстояние должно быть не менее 15 м от транспортного средства в населенных пунктах и 30 м – вне населенных пунктов.

6.3. При отсутствии или неисправности аварийной световой сигнализации на буксируемом механическом транспортном средстве на его задней части должен быть закреплен знак аварийной остановки.

##7. Начало движения, маневрирование.​

###7.1. Перед началом движения, перестроением, поворотом (разворотом) и остановкой водитель обязан подавать сигналы световыми указателями поворота соответствующего направления. При выполнении маневра не должны создаваться опасность для движения, а также помехи другим участникам дорожного движения.

###7.2. Подача сигнала указателями поворота или рукой должна производиться заблаговременно до начала выполнения маневра и прекращаться немедленно после его завершения. При этом сигнал не должен вводить в заблуждение других участников движения.
Подача сигнала не дает водителю преимущества и не освобождает его от принятия мер предосторожности .

###7.3. При выезде на дорогу с прилегающей территории водитель должен уступить дорогу транспортным средствам и пешеходам, движущимся по ней, а при съезде с дороги - пешеходам и велосипедистам, путь движения которых он пересекает.

###7.4. При перестроении водитель должен уступить дорогу транспортным средствам, движущимся попутно без изменения направления движения. При одновременном перестроении транспортных средств, движущихся попутно, водитель должен уступить дорогу транспортному средству, находящемуся справа.

###7.5. Перед поворотом направо, налево или разворотом водитель обязан заблаговременно занять соответствующее крайнее положение на проезжей части, предназначенной для движения в данном направлении, кроме случаев, когда совершается поворот при въезде на перекресток, где организовано круговое движение.

###7.6. Поворот должен осуществляться таким образом, чтобы при выезде с пересечения проезжих частей транспортное средство не оказалось на стороне встречного движения. При повороте направо транспортное средство должно двигаться по возможности ближе к правому краю проезжей части.

###7.7. Если транспортное средство из-за своих габаритов или по другим причинам не может выполнить поворот с соблюдением требований пункта 7.5. Правил, допускается отступать от них при условии обеспечения безопасности движения и если это не создаст помех другим транспортным средствам.

###7.8. При повороте налево или развороте вне перекрестка водитель безрельсового транспортного средства обязан уступить дорогу встречным транспортным средствам.

###7.9. Разворот запрещается:
    На пешеходных переходах;
    В тоннелях;
    На мостах, путепроводах, эстакадах и под ними;
    На железнодорожных переездах;
    В местах с видимостью дороги хотя бы в одном направлении менее 100 м;
    В местах остановок маршрутных транспортных средств.

###7.10. Движение транспортного средства задним ходом разрешается при условии, что этот маневр будет безопасен и не создаст помех другим участникам движения. При необходимости водитель должен прибегнуть к помощи других лиц.

##8. Расположение транспортных средств на проезжей части.

###8.1. Количество полос движения для безрельсовых транспортных средств определяется разметкой и (или) знаками 5.2, 5.3, 5.8, 5.8, а если их нет, то самими водителями с учетом ширины проезжей части, габаритов транспортных средств и необходимых интервалов между ними. При этом стороной, предназначенной для встречного движения на дорогах с двусторонним движением без разделительной полосы, считается половина ширины проезжей части, расположенная слева, не считая местных уширений проезжей части (переходно-скоростные полосы, дополнительные полосы на подъем, заездные карманы мест остановок маршрутных транспортных средств).

###8.2. На дорогах с двусторонним движением, имеющих четыре или более полосы, запрещается выезжать для обгона или объезда на полосу, предназначенную для встречного движения. На таких дорогах повороты налево или развороты могут выполняться на перекрестках и в других местах, где это не запрещено правилами, знаками и (или) разметкой.

###8.3. Вне населенных пунктов, а также в населенных пунктах на дорогах или где разрешено движение со скоростью более 90 км/ч, водители транспортных средств должны вести их по возможности ближе к правому краю проезжей части. Запрещается занимать левые полосы движения при свободных правых.
В населенных пунктах с учетом требований настоящего пункта водители транспортных средств могут использовать наиболее удобную для них полосу движения. При интенсивном движении, когда все полосы движения заняты, менять полосу разрешается только для поворота налево или направо, разворота, остановки или объезда препятствия.

###8.4. Если проезжая часть разделена на полосы линиями разметки, движение транспортных средств должно осуществляться строго по обозначенным полосам. Наезжать на прерывистые линии разметки разрешается лишь при перестроении.

###8.5. Водитель должен соблюдать такую дистанцию до движущегося впереди транспортного средства, которая позволила бы избежать столкновения, а также необходимый боковой интервал, обеспечивающий безопасность движения.

##9. Обгон, опережение, встречный разъезд.​

###9.1. Прежде чем начать обгон, водитель обязан убедиться в том, что полоса движения, на которую он собирается выехать, свободна на достаточном для обгона расстоянии и в процессе обгона он не создаст опасности для движения и помех другим участникам дорожного движения.

###9.2. Водителю запрещается выполнять обгон в случаях, если:
Транспортное средство, движущееся впереди, производит обгон или объезд препятствия;
Транспортное средство, движущееся впереди по той же полосе, подало сигнал поворота налево;
Следующее за ним транспортное средство начало обгон;
По завершении обгона он не сможет, не создавая опасности для движения и помех обгоняемому транспортному средству, вернуться на ранее занимаемую полосу.

###9.3. Водителю обгоняемого транспортного средства запрещается препятствовать обгону посредством повышения скорости движения или иными действиями.

###9.4. Обгон запрещен:
    На регулируемых перекрестках, а также на нерегулируемых перекрестках при движении по дороге, не являющейся главной;
    На пешеходных переходах при наличии на них пешеходов;
    На железнодорожных переездах и ближе чем за 100 метров перед ними;
    На мостах, путепроводах, эстакадах и под ними, а также в тоннелях;
    В конце подъема, на опасных поворотах и на других участках с ограниченной видимостью.

##10. Остановка и стоянка.​

###10.1. Остановка и стоянка транспортных средств разрешаются на правой стороне дороги на обочине, а при ее отсутствии - на проезжей части у ее края и в случаях, установленных пунктом 11.2 правил, - на тротуаре.
На левой стороне дороги остановка и стоянка разрешаются в населенных пунктах на дорогах с одной полосой движения для каждого направления без трамвайных путей посередине и на дорогах с односторонним движением (грузовым автомобилям с разрешенной максимальной массой более 3,5 тонн на левой стороне дорог с односторонним движением разрешается лишь остановка для загрузки или разгрузки).

###10.2. Ставить транспортное средство разрешается в один ряд параллельно краю проезжей части, за исключением тех мест, конфигурация (местное уширение проезжей части) которых допускает иное расположение транспортных средств. Двухколесные транспортные средства без бокового прицепа допускается ставить в два ряда.
Стоянка на краю тротуара, граничащего с проезжей частью, разрешается только легковым автомобилям, мотоциклам, мопедам и велосипедам.

###10.3. Стоянка с целью длительного отдыха, ночлега и тому подобное вне населенного пункта разрешается только на предусмотренных для этого площадках или за пределами дороги.

###10.4. Остановка запрещается:
На железнодорожных переездах, в тоннелях, а также на эстакадах, мостах, путепроводах (если для движения в данном направлении имеется менее трех полос) и под ними;

В местах, где расстояние между сплошной линией разметки (кроме обозначающей край проезжей части), разделительной полосой или противоположным краем проезжей части и остановившимся транспортным средством менее 3 м;
На пешеходных переходах и ближе 5 м перед ними;

На проезжей части вблизи опасных поворотов и выпуклых переломов продольного профиля дороги при видимости дороги менее 100 м хотя бы в одном направлении;

На пересечении проезжих частей и ближе 5 м от края пересекаемой проезжей части, за исключением стороны напротив бокового проезда трехсторонних пересечений (перекрестков), имеющих сплошную линию разметки или разделительную полосу;

Ближе 15 метров от мест остановки маршрутных транспортных средств или стоянки легковых такси, обозначенных разметкой 1.17, а при ее отсутствии - от указателя места остановки маршрутных транспортных средств или стоянки легковых такси (кроме остановки для посадки и высадки пассажиров, если это не создаст помех движению маршрутных транспортных средств или транспортных средств, используемых в качестве легкового такси);

В местах, где транспортное средство закроет от других водителей сигналы светофора, дорожные знаки или сделает невозможным движение (въезд или выезд) других транспортных средств, или создаст помехи для движения пешеходов.

###10.5. Стоянка запрещается:
    В местах, где запрещена остановка;
    Не населенных пунктов на проезжей части дорог;
    Ближе 50 метров от железнодорожных переездов.

##11. Проезд перекрестков.​

###11.1. При повороте направо или налево водитель обязан уступить дорогу пешеходам, переходящим проезжую часть дороги, на которую он поворачивает.

###11.2. Запрещается выезжать на перекресток или пересечение проезжих частей, если образовался затор, который вынудит водителя остановиться, создав препятствие для движения транспортных средств в поперечном направлении.

###11.3. Перекресток, где очередность движения определяется сигналами светофора, считается регулируемым.
При желтом мигающем сигнале, неработающих светофорах или отсутствии регулировщика перекресток считается нерегулируемым, и водители обязаны руководствоваться правилами проезда нерегулируемых перекрестков и установленными на перекрестке знаками приоритета.

##Регулируемые перекрестки.​

###11.4. При повороте налево или развороте по зеленому сигналу светофора водитель безрельсового транспортного средства обязан уступить дорогу транспортным средствам, движущимся со встречного направления прямо или направо. Таким же правилом должны руководствоваться между собой водители трамваев.

###11.5. Водитель, въехавший на перекресток при разрешающем сигнале светофора, должен выехать в намеченном направлении независимо от сигналов светофора на выходе с перекрестка. Однако, если на перекрестке перед светофорами, расположенными на пути следования водителя, имеются стоп-линии, водитель обязан руководствоваться сигналами каждого светофора.

###11.6. При включении разрешающего сигнала светофора водитель обязан уступить дорогу транспортным средствам, завершающим движение через перекресток, и пешеходам, не закончившим переход проезжей части данного направления.

##Нерегулируемые перекрестки.​

###11.7. На перекрестке неравнозначных дорог водитель транспортного средства, движущегося по второстепенной дороге, должен уступить дорогу транспортным средствам, приближающимся по главной, независимо от направления их дальнейшего движения.


###11.8. В случае, когда главная дорога на перекрестке меняет направление, водители, движущиеся по главной дороге, должны руководствоваться между собой правилами проезда перекрестков равнозначных дорог. Этими же правилами должны руководствоваться водители, движущиеся по второстепенным дорогам.

###11.9. На перекрестке равнозначных дорог, за исключением случая, предусмотренного пунктом 11.10. правил, водитель безрельсового транспортного средства обязан уступить дорогу транспортным средствам, приближающимся справа. Этим же правилом должны руководствоваться между собой водители трамваев.
    На таких перекрестках трамвай имеет преимущество перед безрельсовыми транспортными средствами независимо от направления его движения.

###11.10. При въезде на перекресток, на котором организовано круговое движение и который обозначен знаком 4.1, водитель транспортного средства обязан уступить дорогу транспортным средствам, движущимся по такому перекрестку.

###11.11. При повороте налево или развороте водитель безрельсового транспортного средства обязан уступить дорогу транспортным средствам, движущимся по равнозначной дороге со встречного направления прямо или направо.


##12. Пешеходные переходы и места остановок маршрутных транспортных средств.​
###12.1. Водитель транспортного средства, приближающегося к нерегулируемому пешеходному переходу*, обязан уступить дорогу пешеходам, переходящим дорогу или вступившим на проезжую часть (трамвайные пути) для осуществления перехода.

###12.2. Если перед нерегулируемым пешеходным переходом остановилось или снизило скорость транспортное средство, то водители других транспортных средств, движущихся в том же направлении, также обязаны остановиться или снизить скорость. Продолжать движение разрешено с учетом требований пункта 12.1 Правил.

###12.3. На регулируемых пешеходных переходах при включении разрешающего сигнала светофора водитель должен дать возможность пешеходам закончить переход проезжей части (трамвайных путей) данного направления.

###12.4. Запрещается въезжать на пешеходный переход, если за ним образовался затор, который вынудит водителя остановиться на пешеходном переходе.

###12.5. Во всех случаях, в том числе и вне пешеходных переходов, водитель обязан пропустить слепых пешеходов, подающих сигнал белой тростью.

###12.6. Водитель должен уступить дорогу пешеходам, идущим к стоящему в месте остановки маршрутному транспортному средству или от него (со стороны дверей), если посадка и высадка производятся с проезжей части или с посадочной площадки, расположенной на ней.

###12.7. Приближаясь к остановившемуся транспортному средству с включенной аварийной сигнализацией, имеющему опознавательные знаки «Перевозка детей», водитель должен снизить скорость, при необходимости остановиться и пропустить детей.

##13. Движение через железнодорожные пути.
​
###13.1. Водители транспортных средств могут пересекать железнодорожные пути только по железнодорожным переездам, уступая дорогу поезду (локомотиву).

###13.2. При подъезде к железнодорожному переезду водитель обязан руководствоваться требованиями дорожных знаков, светофоров, разметки, положением шлагбаума и указаниями дежурного по переезду и убедиться в отсутствии приближающегося поезда (локомотива).

###13.3. Запрещается выезжать на переезд:
    При закрытом или начинающем закрываться шлагбауме (независимо от сигнала светофора);
    При запрещающем сигнале светофора (независимо от положения и наличия шлагбаума);
    Если к переезду в пределах видимости приближается поезд (локомотив).
    Кроме того, запрещается объезжать с выездом на полосу встречного движения стоящие перед переездом транспортные средства.

##14. Движение по автомагистралям.​
###14.1. На автомагистралях запрещается:
Автомагистраль - дорога, имеющая для каждого направления движения проезжие части, отделенные друг от друга разделительной полосой (а при ее отсутствии - дорожным ограждением), без пересечений в одном уровне с другими дорогами.
Движение пешеходов, велосипедов, мопедов, тракторов и самоходных машин, иных транспортных средств, скорость которых по технической характеристике или их состоянию менее 40 км/ч;
Остановка вне специальных площадок для стоянки;
Разворот и въезд в технологические разрывы разделительной полосы;
Движение задним ходом.

##15. Пользование внешними световыми приборами и звуковыми сигналами.​

###15.1. В темное время суток и в условиях недостаточной видимости независимо от освещения дороги, а также в тоннелях на движущемся транспортном средстве должны быть включены следующие световые приборы:
На всех механических транспортных средствах и мопедах - фары дальнего или ближнего света, на велосипедах - фары или фонари, на гужевых повозках - фонари (при их наличии);
На прицепах и буксируемых механических транспортных средствах - габаритные огни.

###15.2. Дальний свет должен быть переключен на ближний:
В населенных пунктах, если дорога освещена;
При встречном разъезде на расстоянии не менее чем за 150 м до транспортного средства, а также и при большем, если водитель встречного транспортного средства периодическим переключением света фар покажет необходимость этого;
В любых других случаях для исключения возможности ослепления водителей как встречных, так и попутных транспортных средств.
При ослеплении водитель должен включить аварийную сигнализацию и, не меняя полосу движения, снизить скорость и остановиться.

###15.3. В светлое время суток на всех движущихся транспортных средствах с целью их обозначения должны включаться фары ближнего света или дневные ходовые огни.

###15.4. Для предупреждения об обгоне вместо звукового сигнала или совместно с ним может подаваться световой сигнал, представляющий собой кратковременное переключение фар с ближнего на дальний свет.

###15.5. Звуковые сигналы могут применяться только:
Для предупреждения других водителей о намерении произвести обгон вне населенных пунктов;
В случаях, когда это необходимо для предотвращения дорожно-транспортного происшествия.

##16. Перевозка людей.​

###16.1. Перевозка людей в кузове грузового автомобиля должна осуществляться водителями, имеющими удостоверение на право управления транспортными средствами категории "С" (при перевозке более 8 человек, включая пассажиров в
кабине, - категорий "С" и "Д").

    Допуск военных водителей к перевозке людей на грузовых автомобилях осуществляется в установленном порядке.
###16.2. Перевозка людей в кузове грузового автомобиля с бортовой платформой разрешается, если он оборудован в соответствии с Основными положениями.

###16.3. Водитель обязан осуществлять посадку и высадку пассажиров только после полной остановки транспортного средства, а начинать движение только с закрытыми дверями и не открывать их до полной остановки.

###16.4. Запрещается перевозить людей:
Вне кабины автомобиля (кроме случаев перевозки людей в кузове грузового автомобиля с бортовой платформой или в кузове-фургоне), трактора, других самоходных машин, на грузовом прицепе, в прицепе-даче, в кузове грузового мотоцикла и вне предусмотренных конструкцией мотоцикла мест для сидения;
Сверх количества, предусмотренного технической характеристикой транспортного средства.

##17. Сигналы светофора.​
###17.1. В светофорах применяются световые сигналы зеленого, желтого, красного и бело-лунного цвета.

В зависимости от назначения сигналы светофора могут быть круглые, в виде стрелки (стрелок), силуэта пешехода и X-образные.

Светофоры с круглыми сигналами могут иметь одну или две дополнительные секции с сигналами в виде зеленой стрелки (стрелок), которые располагаются на уровне зеленого круглого сигнала.

###17.2. Круглые сигналы светофора имеют следующие значения:

ЗЕЛЕНЫЙ СИГНАЛ разрешает движение;

ЗЕЛЕНЫЙ МИГАЮЩИЙ СИГНАЛ разрешает движение и информирует, что время его действия истекает и вскоре будет включен запрещающий сигнал (для информирования водителей о времени в секундах, остающемся до конца горения зеленого сигнала, могут применяться цифровые табло);

ЖЕЛТЫЙ СИГНАЛ предупреждает о предстоящей смене сигналов, запрещает движение, кроме случаев, если водители не могут остановиться, не прибегая к экстренному торможению, в таком случае разрешается дальнейшее движение.

ЖЕЛТЫЙ МИГАЮЩИЙ СИГНАЛ разрешает движение и информирует о наличии нерегулируемого перекрестка или пешеходного перехода, предупреждает об опасности;

КРАСНЫЙ СИГНАЛ, в том числе мигающий, запрещает движение.

    Сочетание красного и желтого сигналов запрещает движение и информирует о предстоящем включении зеленого сигнала.

###17.3. Сигналы светофора, выполненные в виде стрелок красного, желтого и зеленого цветов, имеют то же значение, что и круглые сигналы соответствующего цвета, но их действие распространяется только на направление (направления), указываемое стрелками. При этом стрелка, разрешающая поворот налево, разрешает и разворот, если это не запрещено соответствующим дорожным знаком.

Такое же значение имеет зеленая стрелка в дополнительной секции. Выключенный сигнал дополнительной секции или включенный световой сигнал красного цвета ее контура означает запрещение движения в направлении, регулируемом этой секцией.

###17.4. Если на основной зеленый сигнал светофора нанесена черная контурная стрелка (стрелки), то она информирует водителей о наличии дополнительной секции светофора и указывает иные разрешенные направления движения, чем сигнал дополнительной секции.

Информационная световая секция в виде силуэта пешехода и стрелки с мигающим сигналом бело-лунного цвета, расположенная под светофором, информирует водителя о том, что на пешеходном переходе, в направлении которого он поворачивает, включен сигнал светофора, разрешающий движение пешеходам. Направление стрелки указывает на пешеходный переход, на котором включен сигнал светофора, разрешающий движение пешеходам.

###17.5. Если сигнал светофора выполнен в виде силуэта пешехода, то его действие распространяется только на пешеходов. При этом зеленый сигнал разрешает, а красный сигнал запрещает движение пешеходов.

###17.6. Круглый бело-лунный мигающий сигнал, расположенный на железнодорожном переезде, разрешает движение транспортных средств через переезд. При выключенных мигающих бело-лунном и красном сигналах движение разрешается при отсутствии в пределах видимости приближающегося к переезду поезда (локомотива, дрезины).
`},{slug:"fp",abbr:"ФП",title:"Федеральное постановление",notes:"Дисциплина госслужащих: связь, форма, транспорт.",updated:"2025-02-23",content:`# Федеральное постановление

##Глава 1. Общие положения
1 Настоящее Федеральное постановление является законодательные актом и принято в целях профилактики совершения должностными лицами государственных структур противоправных действий.
2 За осуществлением федерального постановления следит федеральная служба безопасности и правительство, в случае надобности оно же применяет санкции в соответствии с данным постановлением.
3 Федеральное постановления распространяется на всех сотрудников/военнослужащих государственных организаций.
4 Начальник федеральной службы безопасности вправе уполномочить отступать от некоторых пунктов федерального постановления для выполнения служебно-боевых задач по предварительному согласованию и его одобрению деятельности отделов/взвода.

Глава 2. Нарушение законодательных актов
​
Статья 1. Нарушение законодательства
Запрещается нарушать законодательные и нормативно-правовые акты, федеральные законы, федеральные-конституционные законы, законы Нижегородской области, постановления, кодексы, Конституцию, - наказывается выговором с занесением, увольнением, в зависимости от тяжести нарушения

Статья 2. Нарушение актов управления
Запрещается нарушать акты управления: уставы, приказы, указы, распоряжения, постановления руководителей и иных уполномоченных лиц, отданных как в письменной, так и в устной форме, - наказывается замечанием, выговором без занесения, выговором с занесением, увольнением, в зависимости от тяжести нарушения

Статья 3. Неисполнение приказа
Неисполнение сотрудником государственной организации законного приказа начальника, руководителя организации, сотрудника органов федеральной службы безопасности, руководителя департамента правительственного аппарата, вице-губернатора, губернатора, - наказывается выговором с занесением, увольнением, в зависимости от тяжести нарушения

Глава 3. Нарушения исполнения должностных и служебных обязанностей
​
Статья 4. Халатность
Запрещено проявление халатного отношения к своим должностным и служебным обязанностям; бездействие/неисполнение обязанностей по оказанию помощи лицам, находящимся в опасной ситуации, - наказывается выговором с занесением, увольнением, в зависимости от тяжести нарушения

Статья 5. Злоупотребление своими служебными (должностными) полномочиями или их превышение
Запрещено злоупотребление своими служебными или должностными полномочиями или их превышение, - наказывается выговором с занесением, увольнением в зависимости от тяжести нарушения

Статья 6. Помощь на тестированиях/проверках
Сотрудникам государственных организаций запрещается помогать сотруднику своей организации во время проведения служебной проверки/тестирования - наказывается выговором с занесением в личное дело
Глава 4. Нарушение служебной дисциплины
​
Статья 7. Появление на рабочем месте в неподобающем виде
Запрещено появление на рабочем месте (месте несения службы) в неподобающем виде, а равно в состоянии алкогольного или наркотического опьянения или с их явными признаками (ломка), - наказывается выговором с занесением, увольнением в зависимости от тяжести нарушения

Статья 8. Появление в общественном месте в неподобающем виде в свободное от работы время
Запрещено появление в общественном месте в неподобающем виде, а равно в состоянии алкогольного или наркотического опьянения или с их явными признаками (ломка), в свободное от работы время, - наказывается выговором с занесением, увольнением в зависимости от тяжести нарушения

Статья 9. Хранение, употребление и распространение запрещенных веществ, иной продукции
Запрещено хранение, употребление, распространение наркотических веществ; распитие алкогольной продукции в общественных местах и на рабочем месте; курение в общественных местах и на рабочем месте, - наказывается выговором с занесением, увольнением в зависимости от тяжести нарушения

Статья 10. Прогул рабочего дня
Запрещается «прогул» рабочего дня, а равно отсутствие на рабочем месте в течение пятнадцати минут или нахождение сотрудника в местах торговли или на территории развлекательных объектов или иных местах (торговый центр «Анашан», казино, центральный рынок и рынок города Южный, сцена города Арзамас, рыболовные причалы) с целью решения вопросов купли-продажи, иных имущественных вопросов, а также в иных местах по неслужебным целям (ферма, порт (контейнеры), подработки) - наказывается выговором с занесением, увольнением, в зависимости от тяжести нарушения

Статья 11. Участие в несанкционированном митинге
Запрещено принимать участие в несанкционированном митинге, шествии, собрании, пикетировании, массовых беспорядках, - наказывается выговором с занесением, увольнением, в зависимости от тяжести нарушения
Глава 5. Нарушение норм общения
​
Статья 12. Неадекватное поведение
Запрещено проявление любого неадекватного или неподобающего сотруднику государственной структуры поведения, - наказывается выговором с занесением, увольнением, в зависимости от тяжести нарушения

Статья 13. Конфликтные ситуации
Запрещено создавать, провоцировать конфликтные ситуации с другими организациями, гражданскими лицами, коллегами - наказывается выговором с занесением, увольнением, в зависимости от тяжести нарушения

Статья 14. Субординация и общение
Запрещено нарушение субординации при общении с коллегами, гражданскими лицам и сотрудниками других организаций; проявление неуважительного и хамского общения на «ты», повышение тона, проявление агрессии, употребление нецензурной лексики при разговоре, - наказывается выговором с занесением в личное дело
Статья 15. Склонение к совершению противоправных действий
Сотрудникам государственных организаций запрещается подстрекать, склонять, побуждать в прямой или косвенной форме кого-либо к совершению противоправных действий, - наказывается выговором с занесением в личное дело, увольнением, в зависимости от тяжести нарушения

Глава 6. Нарушение применения средств связи
​
Статья 16. Использование рации «департамента»
Запрещено проявление неадекватного поведения, нецензурной лексики при общении в общей рации государственных организаций; использовать рацию не по назначению или с целью передачи информации, не несущей смысловой нагрузки; использовать рацию неуполномоченным на это лицам (( до 3 ранга включительно, в ПР и ФСБ до 2 включительно )), выходить на связь не представившись, - наказывается замечанием, выговором с занесением в личное дело, в зависимости от тяжести нарушения

Комментарий к ст. 16
При выходе на связь с какой-либо организацией сотрудник (военнослужащий) обязан для начала представиться, назвать звание или должность, фамилию (ФСБ разрешено представляться позывными в рации департамента)
(( Пример: /d [ГАИ/УФСБ] Полковник Кирсанов, на связь..))

Статья 17. Использование служебной рации
Запрещено проявление неадекватного поведения, нецензурной лексики при общении в рации организации, использование рации не по назначению или с целью передачи информации, не несущей смысловой нагрузки, - наказывается замечанием, выговором без занесения, выговором с занесением, в зависимости от тяжести нарушения

Глава 7. Нарушение внешнего вида​

Статья 18. Ношение форменной одежды
Запрещено нарушать установленный порядок ношения служебной форменной одежды за исключением случаев предусмотренных локальными актами государственной организации - наказывается выговором без занесения, выговором с занесением в личное дело, в зависимости от тяжести нарушения

Статья 19. Ношение маски
Запрещено ношение медицинской маски во время рабочего дня и при исполнении своих обязанностей за исключением случаев предусмотренных локальными актами государственной организации, -наказывается замечанием, выговором с занесением в личное дело, в зависимости от тяжести нарушения

Во время участия в специальных операциях по особому распоряжения сотрудника органов Федеральной службы безопасности сотрудники государственных организаций не зависимо от специального звания, занимаемой должности и принадлежности к какому-либо подразделению могут использовать маски. По окончанию специальной операции маски должны быть сняты

Глава 8. Нарушение использования служебного и личного транспортного средства​

Статья 20. Использование личного транспорта
Запрещено использовать личный транспорт в служебных целях и в рабочее время, за исключением случаев, когда сотрудников государственного учреждения добирается до рабочего места, чтобы начать рабочий день. Для передвижения без каких-либо ограничений в рабочее время личный транспорт могут использовать лица у которых зарегистрирован автомобиль в государственном реестре, - наказывается выговором с занесением в личное дело

Статья 20.1. Запрет во время использования личного транспорта
Транспортные средства из государственного реестра должны использоваться без ярко выраженных элементов тюнинга: аудиосистем, стробоскопов, неоновых подсветок, - выговором с занесением в личное дело и вынесением транспорта с реестра

Статья 21. Использование специализированных световых и звуковых приборов
Использование специализированных световых и звуковых приборов, а равно проблесковых маячков, мигалок, громкоговорящих устройств, сирен, "кряколок" без весомой причины, - наказывается выговором с занесением в личное дело

Статья 22. Стандартизация цветографических схем
Запрещено нарушать стандартизацию цветографических схем на служебном транспорте, перекрашивать служебный транспорт, - наказывается замечанием, выговором с занесением, в зависимости от тяжести нарушения

Статья 23. Использование служебных транспортных средств
Запрещено использовать служебный транспорт в личных целях, небрежно относиться к служебному транспорту, парковать его в неположенном месте, - наказывается выговором без занесения, выговором с занесением, в зависимости от тяжести нарушения

Глава 9. Нарушение по установлению личности
​
Статья 24. Служебное удостоверение
Сотрудники государственных структур обязаны предъявлять свое служебное удостоверение в развернутом виде до полного ознакомления губернатору, вице-губернатору, начальнику департамента правительства, судье, следователю, сотруднику федеральной службы безопасности, руководителю своей организации или иному уполномоченному лицу, по его первому требованию в случае, если у вышеперечисленных лиц имеется необходимость привлечь сотрудника к дисциплинарному взысканию

При обращении к гражданским лицам или гражданских лиц к сотрудникам служебное удостоверение предъявляется в порядке, предусмотренном федеральными законами, - наказывается выговором без занесения, выговором с занесения в личное дело, в зависимости от тяжести нарушения
Глава 10. Нарушение по отношению к засекреченной информации
​
Статья 25. Разглашение засекреченной информации
Разглашение конфиденциальной информации строго запрещено. Эта информация включает в себя данные о численности сотрудников военных подразделений, состоянии складов, передвижении военной техники и личного состава, планах подготовки к специальным операциям, любую информацию, связанную с органами Федеральной службы безопасности, охраняемых объектах и мерах безопасности, а также информация, которая находится под грифами: особой важности, совершенно секретно и секретно, - наказывается увольнением

Глава 11. Нарушение по отношению к сотрудникам ФСБ/правительства
​
Статья 26. Вмешательство в специальные операции федеральной службы безопасности.
Запрещено самовольная деятельность в зоне операции под руководством органа УФСБ. Все приказы должны выполняться строго, за исключением приказов, противоречащих законодательству,- наказывается выговором с занесением в личное дело

Статья 27. Слежка за сотрудником Федеральной службы безопасности
Запрещается намеренная и скрытая слежка за сотрудниками Федеральной службы безопасности, включая любые действия, направленные на скрытое наблюдение, сбор личной информации или использование технических средств для нарушения личной неприкосновенности сотрудника - наказывается выговором с занесением в личное дело

Статья 28. Обман сотрудников федеральной службы безопасности, правительства
Запрещено обманывать и (или) вводить в заблуждение сотрудников и военнослужащих органов федеральной службы безопасности, высших должностных лиц правительственного аппарата, предоставлять им заведомо ложную информацию, - наказывается выговором с занесением, увольнением, в зависимости от тяжести нарушения


`},{slug:"fz-police",abbr:"ФЗоП",title:"Федеральный закон «О полиции»",notes:"Права, обязанности, запреты.",updated:"2025-02-23",content:`# Федеральный закон «О полиции»

Глава 1. Общие положения
​
Статья 1. Назначение полиции

1. Полиция предназначена для защиты жизни, здоровья, прав и свобод граждан Нижегородской области, для противодействия преступности, охраны общественного порядка, собственности и для обеспечения общественной безопасности.

2. Полиция незамедлительно приходит на помощь каждому, кто нуждается в ее защите от преступных и иных противоправных посягательств.

3. Полиция в пределах своих полномочий оказывает содействие федеральным органам государственной власти.

Статья 2. Основные направления деятельности полиции

1. Деятельность полиции осуществляется по следующим основным направлениям:

1) защита личности, общества, государства от противоправных посягательств;

2) предупреждение и пресечение преступлений и административных правонарушений;

3) выявление и раскрытие преступлений, производство дознания по уголовным делам;

4) розыск лиц;

5) производство по делам об административных правонарушениях, исполнение административных наказаний;

6) обеспечение правопорядка в общественных местах;

7) обеспечение безопасности дорожного движения;

8) осуществление оперативно-розыскной деятельности.

Глава 2. Принципы деятельности полиции

​
Статья 3. Соблюдение и уважение прав и свобод человека и гражданина

1. Полиция осуществляет свою деятельность на основе соблюдения и уважения прав и свобод человека и гражданина.

2. Сотруднику полиции запрещается прибегать к пыткам, насилию, другому жестокому или унижающему человеческое достоинство обращению. Сотрудник полиции пресекает действия, которыми гражданину умышленно причиняются боль, физическое или нравственное страдание.

3. При обращении к гражданину сотрудник полиции:

1) называет свои должность, специальное звание, фамилию, или же свой служебный позывной утвержденный руководством, по требованию предъявляет гражданину служебное удостоверение, после чего сообщает причину и цель обращения ;

2) в случае применения к гражданину мер, ограничивающих его права и свободы, разъясняет ему причину и основания применения таких мер.

3) в случае если сотруднику полиции или задержанному гражданскому лицу грозит опасность, сотрудник полиции вправе отойти/отвести гражданина в безопасное место дальше выполнить действия согласно 3.1.1 и 3.1.2 ФЗоП

4. Сотрудник полиции в случае обращения к нему гражданина называет свои должность, специальное звание, фамилию, или же свой служебный позывной утвержденный руководством, внимательно его выслушивает, принимает соответствующие меры в пределах своих полномочий либо разъясняет, в чью компетенцию входит решение поставленного вопроса.

5. Сотрудники специализированных подразделений полиции вправе использовать в качестве представления личный позывной и в этом случае не разглашать свое ФИО (Исключение: сотрудники УФСБ, правительство и руководство организации, подразделением).

Статья 4. Законность и беспристрастность

1. Полиция защищает права, свободы и законные интересы человека и гражданина независимо от пола, расы, национальности, языка, происхождения, имущественного и должностного положения, места жительства, отношения к религии, убеждений, принадлежности к общественным объединениям, а также других обстоятельств

2. Сотруднику полиции запрещается подстрекать, склонять, побуждать в прямой или косвенной форме кого-либо к совершению противоправных действий.

3. Сотрудник полиции как в служебное, так и во внеслужебное время должен воздерживаться от любых действий, которые могут вызвать сомнение в его беспристрастности или нанести ущерб авторитету полиции.

Глава 3. Обязанности и права полиции

​
Статья 5. Обязанности полиции

1. На полицию возлагаются следующие обязанности:

1) принимать и регистрировать (в том числе в электронной форме) заявления и сообщения о преступлениях, об административных правонарушениях, о происшествиях; осуществлять в соответствии с подведомственностью проверку заявлений и сообщений о преступлениях, об административных правонарушениях, о происшествиях и принимать по таким заявлениям и сообщениям меры, предусмотренные законодательством Нижегородской области;

2) прибывать незамедлительно на место совершения преступления, административного правонарушения, место происшествия, пресекать противоправные деяния, устранять угрозы безопасности граждан и общественной безопасности, документировать обстоятельства совершения преступления, административного правонарушения, обстоятельства происшествия, обеспечивать сохранность следов преступления, административного правонарушения.

3) оказывать первую помощь лицам, пострадавшим от преступлений, административных правонарушений и несчастных случаев, а также лицам, находящимся в беспомощном состоянии либо в состоянии, опасном для их жизни и здоровья, если специализированная помощь не может быть получена ими своевременно или отсутствует;

4) выявлять причины преступлений и административных правонарушений и условия, способствующие их совершению, принимать в пределах своих полномочий меры по их устранению; выявлять лиц, имеющих намерение совершить преступление, и проводить с ними индивидуальную профилактическую работу;

5) обеспечивать безопасность граждан и общественный порядок в общественных местах;

6) принимать при чрезвычайных ситуациях неотложные меры по спасению граждан, охране имущества, содействовать в этих условиях бесперебойной работе спасательных служб; обеспечивать общественный порядок при проведении мероприятий;

7) выявлять и пресекать административные правонарушения и осуществлять производство по делам об административных правонарушениях, отнесенных законодательством об административных правонарушениях к подведомственности полиции;

8) участвовать в мероприятиях по противодействию терроризму и в обеспечении правового режима контртеррористической операции, а также в обеспечении защиты потенциальных объектов террористических посягательств и мест массового пребывания граждан;

9) осуществлять надзор за соблюдением участниками дорожного движения требований законодательства Нижегородской области о безопасности дорожного движения в порядке, определяемом правилами дорожного движения.

10) предоставлять каждому гражданину возможность ознакомления с документами и материалами, непосредственно затрагивающими его права и свободы, если иное не установлено Федеральным законом.

Статья 6. Права полиции

1. Полиция для выполнения возложенных на нее обязанностей предоставляются следующие права:

1) требовать от граждан и должностных лиц прекращения противоправных действий, а равно действий, препятствующих законной деятельности государственных органов;

2) проверять документы, удостоверяющие личность граждан, если имеются данные, дающие основания подозревать их в совершении преступления или полагать, что они находятся в розыске, либо если имеется повод к возбуждению в отношении этих граждан дела об административном правонарушении, а равно если имеются основания для их задержания в случаях, предусмотренных федеральным законом;

3) патрулировать населенные пункты и общественные места, оборудовать при необходимости контрольные и контрольно-пропускные пункты, выставлять посты, в том числе стационарные, использовать другие формы охраны общественного порядка;

4) требовать от граждан (групп граждан) покинуть место совершения преступления, административного правонарушения, место происшествия, если это необходимо для проведения оперативно-розыскных мероприятий, для обеспечения безопасности граждан; в целях защиты жизни, здоровья и имущества граждан не допускать их на отдельные участки местности и объекты либо обязывать оставаться на соответствующих участках местности и объектах или покинуть их;

5) составлять протоколы об административных правонарушениях, собирать доказательства, применять меры обеспечения производства по делам об административных правонарушениях, применять иные меры, предусмотренные законодательством об административных правонарушениях;

6) осуществлять личный досмотр граждан, досмотр находящихся при них вещей, а также досмотр их транспортных средств, если имеются основания полагать, что эти граждане имеют при себе оружие, боеприпасы, взрывчатые вещества, наркотические средства, психотропные вещества, а также скрывают предметы хищения, изымать указанные предметы, средства и вещества при отсутствии законных оснований для их ношения или хранения.

7) требовать/приспускать маски и аксессуары с лица гражданских лиц при проверке документов или задержании для установления личности;

8) останавливать транспортные средства, проверять документы на право пользования и управления ими, документы на транспортные средства и перевозимые грузы, осуществлять досмотр транспортных средств и грузов при наличии признаков административных правонарушений в сфере дорожного движения;

9) осуществлять досмотр и (или) личный осмотр граждан, осмотр находящихся при них вещей, досмотр и (или) осмотр транспортных средств при въезде на охраняемые объекты и выезде с охраняемых объектов;

10) доставлять граждан, то есть осуществлять их принудительное препровождение, в служебное помещение подразделения полиции, в целях решения вопроса о задержании гражданина (при невозможности решения данного вопроса на месте); установления личности гражданина, если имеются основания полагать, что он находится в розыске, либо как уклоняющийся от исполнения уголовного наказания;

11) требовать от граждан покинуть транспортное средство, если это необходимо для проведения личного досмотра или иных процессуальных действий

12) проводить личный досмотр граждан, находящихся при них вещей, при их проходе на территорию проведения призыва в Вооруженные силы, собеседования в государственное учреждение, территории сооружений, на участки местности либо в общественные места, где проводится какое-либо мероприятие; при отказе гражданина от проведения личного досмотра, сотрудники полиции вправе не допустить гражданина на территорию, на которой проводятся указанные мероприятия;

13) обеспечивать безопасность и антитеррористическую защищенность, в том числе с применением технических средств, зданий, сооружений, помещений и иных объектов;

14) объявлять граждан подозревающихся в совершении преступления в розыск;

15) требовать от граждан (групп граждан) покинуть место проведение процессуальных действий, а то есть отойти на 15 метров

2. Использование мешковидного предмета (мешка, повязки, накидки на голову) по отношению к гражданам разрешается исключительно в случаях проявления явного неадекватного поведения, а именно коверкание слов, выкрикивание или передразнивание с их стороны.


Статья 6.1. Право на ведение оперативно-розыскной деятельности

Правом на ведение оперативно-розыскную деятельность, а равно на осуществление поиска лиц, находящихся в розыске, наделены все сотрудники УМВД начиная с специального звания "Младший сержант полиции" и специализированная рота ГАИ

Статья 7. Вынесение гражданского лица с базы розыска

1. Сотрудник полиции имеет право полностью или частично вынести гражданское лицо из базы розыска в случаях:

1) если лицо было занесено в базу по ошибке КПК - лицо полностью выносится с базы

2) если лицо сдалось с повинной - лицу понижается срок заключения на 2 месяца (( 2 звезды ))

3) если лицо было занесено при самообороне - лицо полностью выносится с базы

4) если у лица менее 5 лет проживания в области - лицо полностью выносится с базы (Исключение: гражданин себя неадекватно ведет или имеет больше 7 месяцев заключения ((7 звезд)))

5) если лицо признало свою вину и нарушение считается незначительным - лицу понижается срок заключения на 1 месяц (( 1 звезда ))

2. Перед полным или частичным вынесением гражданского лица с базы сотрудник полиции обязан иметь доказательства

Глава 4. Применение полицией отдельных мер государственного принуждения
​
Статья 8. Задержание

1. Полиция имеет право задерживать:

1) лиц, подозреваемых в совершении преступления/административного правонарушения;

2) лиц, совершивших побег из-под стражи, лиц, уклоняющихся от отбывания уголовного наказания;

3) лиц, находящихся в розыске;

4) лиц, незаконно проникших либо пытавшихся проникнуть на охраняемые объекты, - до выяснения личности;

5) лиц, предпринявших попытку самоубийства, - для доставления в медицинские органы;

6) лиц, уклоняющихся от исполнения назначенных им судом мер пресечения

2. В каждом случае задержания сотрудник полиции обязан выполнить действия, предусмотренные частью 3 статьи 3 настоящего федерального закона.

3. Сотрудники МВД не уполномочены на задержание и привлечение к административной ответственности сотрудников ФСБ в процессе выполнения ими своих служебных обязанностей.

4. Все объяснения, причины и основания для задержания должны быть сообщены задержанному наедине, без посторонних лиц. Если присутствуют посторонние лица, сотрудник имеет право не комментировать процесс задержания и его юридические основы.

5. Сотрудники МВД не имеют право на задержание других сотрудников полиции;
Исключения:
1) Сотрудники ОСБ, руководство организации (генерал-майор и полковник);
2) В случаях нарушения уголовного кодекса угрожающего жизни и здоровью граждан имеют право задерживать все сотрудники;
3) На задержание имеют право сотрудники СР и ОСН, но строго для доставления сотрудникам ОСБ или руководству организации;

6. Полиция защищает право каждого на свободу и личную неприкосновенность. Гражданин не может быть подвергнут задержанию на срок более 2-ух часов.

7. О задержании военнослужащего полиция уведомляет командование воинской части, в которой он проходит военную службу.

8. Сотрудник полиции не обязан разъяснять основания задержания до мелочей (имеет право кратко назвать основания и причину без каких либо разъяснений где это написано и т.д.)

Статья 9. Вскрытие транспортного средства

1. Полиция имеет право осуществлять вскрытие транспортного средства в таких случаях:

1) для обеспечения безопасности граждан или общественной безопасности при массовых беспорядках и чрезвычайных ситуациях;

2) для задержания лиц, подозреваемых или обвиняемых в совершении преступления, а также лиц, застигнутых на месте совершения ими деяния, содержащего признаки преступления, и (или) скрывающихся с места совершения ими такого деяния,

3) для пресечения преступления.

4) для проведения осмотра транспортного средства и (или) груза, если имеются основания полагать, что в транспортном средстве находятся без специального разрешения предметы или вещи, изъятые из гражданского оборота или ограниченно оборотоспособные;

5) для проверки сообщения об угрозе террористического акта;

2. Перед вскрытием т/с сотрудник полиции называет свои должность, звание, фамилию, предъявляет по требованию собственника либо иного законного владельца транспортного средства или находящихся в нем граждан служебное удостоверение, предупреждает о своем намерении, разъясняет причину и основания вскрытия транспортного средства, за исключением, когда промедление во вскрытии т/c создает опасность для жизни людей или может повлечь за собой иные тяжкие последствия.

Статья 10. Оцепление и блокирование территорий, помещений, зданий и иных объектов

1. Блокирование и оцепление территорий, помещений, зданий и иных объектов производится по письменному или устному распоряжению сотрудников ФСБ

2. Полиция имеет право проводить блокирование и оцепление территорий, помещений, зданий и иных объектов:
1) при ликвидации последствий катастроф, аварий и иных чрезвычайных ситуаций преступного, природного и техногенного характера;
2) при проведении мероприятий по пресечению массовых беспорядков и иных действий, нарушающих права граждан, посягающих на общественную безопасность или блокирующих работу организаций;
3) при розыске лиц, совершивших побег из-под ареста, стражи, задержания;
4) при преследовании лица, находящегося в розыске или подозреваемого в совершении преступления;
5) при проведении контртеррористической операции, освобождении заложников, проверке сведений об обнаружении взрывчатых веществ или взрывных устройств;
6) при проведении мероприятий, направленных на обнаружение предметов, изъятых из гражданского оборота или ограниченно обороноспособных;
7) при наличии оснований полагать, что в границах территорий или на объектах готовится, совершается (совершено) преступление;
8) при необходимости предотвращения угрозы жизни и здоровью граждан, которые не могут быть защищены иным способом;
9) при проведении оперативно-профилактических, оперативно-разыскных, оперативно-боевых, следственных мероприятий;
10) при проведении учебных мероприятий;

3. При оцеплении (блокировании) территорий может быть ограничено или запрещено движение транспорта и пешеходов, если это необходимо для обеспечения безопасности граждан и общественного порядка, проведения следственных действий, оперативно-розыскных, оперативно-профилактических мероприятий, охраны места совершения преступления, административного правонарушения, места происшествия, а также для защиты объектов собственности, которым угрожает опасность.

4. В границах оцепления (блокирования) полиция может осуществлять личный досмотр граждан, находящихся при них вещей, досмотр транспортных средств и перевозимых грузов с участием водителей или граждан, сопровождающих грузы, с применением при необходимости технических средств. В случае отказа гражданина подвергнуться личному досмотру или предоставить для досмотра транспортное средство и перевозимые грузы полиция имеет право не допускать проход такого гражданина на территории, в жилые помещения, строения и на другие объекты, где проводится оцепление (блокирование), или его выход за пределы границ оцепления (блокирования), а также въезд или выезд транспортного средства до снятия оцепления (блокирования).

5. Блокированная (оцепленная) сотрудниками полиции территория (помещение, здание, иной объект) на время её блокирования (оцепления) является охраняемой, проникновение на которую влечет за собой уголовную ответственность предусмотренную статьей 39 Уголовного кодекса.

Статья 11. Проникновение в жилые и иные помещения, на земельные участки и территории

1. Полиция защищает право каждого на неприкосновенность жилища.

2. Проникновение сотрудников полиции в жилые помещения, в иные помещения и на земельные участки, принадлежащие гражданам, в помещения, на земельные участки и территории, занимаемые организациями, допускается в случаях, предусмотренных законодательством (( Правилами сервера ))

3. Проникновение полиции в жилые или иные помещения, на земельные участки, принадлежащие гражданам, учреждениям или организациям разрешено:

1) для спасения жизни граждан или их имущества, обеспечения безопасности граждан или общественной безопасности при массовых беспорядках и чрезвычайных ситуациях;
2) для задержания лиц, подозреваемых или обвиняемых в совершении преступления;
3) для пресечения преступления;
4) для установления обстоятельств несчастного случая;

4. Сотрудник полиции, осуществляющий вхождение (проникновение) в жилое помещение, обязан:

1) перед тем как войти в жилое помещение, уведомить находящихся там граждан об основаниях вхождения, за исключением случаев, если промедление создает непосредственную угрозу жизни и здоровью граждан и сотрудников полиции или может повлечь иные тяжкие последствия;

2) не разглашать ставшие известными ему в связи с вхождением (проникновением) в жилое помещение факты частной жизни находящихся там граждан

3) использовать безопасные способы и средства не допускать без необходимости причинения ущерба их имуществу, за исключением случаев, совершенных при крайней необходимости;
Глава 5. Применение физической силы, специальных средств и огнестрельного оружия
​

Статья 12. Порядок применения физической силы, специальных средств и огнестрельного оружия

1. Сотрудник полиции перед применением физической силы, специальных средств или огнестрельного оружия обязан сообщить лицам, в отношении которых предполагается применение физической силы, специальных средств или огнестрельного оружия, о том, что он является сотрудником полиции, предупредить их о своем намерении и предоставить им возможность и время для выполнения законных требований сотрудника полиции. В случае применения физической силы, специальных средств или огнестрельного оружия в составе подразделения (группы) указанное предупреждение делает один из сотрудников полиции, входящих в подразделение (группу).

1.2. Перед применением огнестрельного оружия должно прозвучать 3 предупреждения (с промежутком в 15 секунд), они должны звучать четко и ясно.

1.3. Перед применением физической силы или специальных средств должно прозвучать также 3 предупреждения (с промежутком в 15 секунд), они должны звучать четко и ясно. В исключениях могут быть случае прямого нарушения гражданина (использование релаксантов, оскорбление сотрудника и т.д.)

2. Сотрудник полиции имеет право не предупреждать о своем намерении применить физическую силу, специальные средства или огнестрельное оружие, если промедление в их применении создает непосредственную угрозу жизни и здоровью гражданина или сотрудника полиции либо может повлечь иные тяжкие последствия или когда человек целенаправленно отказывается покидать территорию с ограниченным доступом.

3. Сотрудник полиции при применении физической силы, специальных средств или огнестрельного оружия действует с учетом создавшейся обстановки, характера и степени опасности действий лиц, в отношении которых применяются физическая сила, специальные средства или огнестрельное оружие, характера и силы оказываемого ими сопротивления. При этом сотрудник полиции обязан стремиться к минимизации любого ущерба.

4. В составе подразделения (группы) сотрудник полиции применяет физическую силу, специальные средства и огнестрельное оружие в соответствии с федеральным законом, руководствуясь приказами и распоряжениями руководителя этого подразделения (группы).

5. Сотруднику полиции запрещается применять специальные средства при пресечении незаконных собраний, митингов, демонстраций, шествий, которые не нарушают общественный порядок, работу транспорта, средств связи и организаций.

Статья 13. Право на применение физической силы, специальных средств и огнестрельного оружия

1. Сотрудник полиции имеет право на применение физической силы, специальных средств и огнестрельного оружия лично или в составе подразделения (группы) в случаях и порядке, предусмотренных настоящим федеральным законом и другими федеральными законами.

2. Сотрудник полиции обязан проходить специальную подготовку, а также периодическую проверку на профессиональную пригодность к действиям в условиях, связанных с применением физической силы, специальных средств и огнестрельного оружия.

3. Сотрудник полиции не несет ответственность за вред, причиненный гражданам и организациям при применении физической силы, специальных средств или огнестрельного оружия, если применение физической силы, специальных средств или огнестрельного оружия осуществлялось по основаниям и в порядке, которые установлены настоящим федеральным законом и другими федеральными законами.

Статья 14. Применение физической силы

1. Сотрудник полиции имеет право лично или в составе подразделения (группы) применять физическую силу, если несиловые способы не обеспечивают выполнения возложенных на полицию обязанностей, в следующих случаях:

1) для пресечения преступлений и административных правонарушений;

2) для доставления в служебное помещение лиц, совершивших преступления и административные правонарушения, и задержания этих лиц;

3) для преодоления противодействия законным требованиям сотрудника полиции.

2. Сотрудник полиции имеет право применять физическую силу во всех случаях, когда настоящим федеральным законом разрешено применение специальных средств или огнестрельного оружия.


Статья 15. Применение специальных средств

###1. Сотрудник полиции имеет право лично или в составе подразделения (группы) применять специальные средства в следующих случаях:

1) для отражения нападения на гражданина или сотрудника полиции;

2) для пресечения преступления или административного правонарушения;

3) для пресечения сопротивления, оказываемого сотруднику полиции;

4) для задержания лица, застигнутого при совершении преступления и пытающегося скрыться;

5) для задержания лица, если это лицо может оказать вооруженное сопротивление;

6) для доставления в полицию, конвоирования и охраны задержанных лиц, лиц, заключенных под стражу, лиц, осужденных к лишению свободы, лиц, подвергнутых административному наказанию в виде административного ареста, а также в целях пресечения попытки побега, в случае оказания лицом сопротивления сотруднику полиции, причинения вреда окружающим или себе;

7) для освобождения насильственно удерживаемых лиц, захваченных зданий, помещений, транспортных средств;

8) для пресечения массовых беспорядков и иных противоправных действий, нарушающих движение транспорта, работу средств связи и организаций;

9) для остановки транспортного средства, водитель которого не выполнил требование сотрудника полиции об остановке;

10) для выявления лиц, совершающих или совершивших преступления или административные правонарушения;

11) для защиты охраняемых объектов, блокирования движения групп граждан, совершающих противоправные действия.

###2. Сотрудник полиции имеет право применять следующие специальные средства:

1) палки специальные;

2) средства ограничения подвижности;

3) электрошоковые устройства;

4) средства принудительной остановки транспорта;

5) средства сковывания движения;

6) средства защиты охраняемых объектов (территорий), блокирования движения групп граждан, совершающих противоправные действия;

7) средства разрушения преград.

###3. Сотрудник полиции имеет право применять специальные средства во всех случаях, когда настоящим федеральным законом разрешено применение огнестрельного оружия.

Статья 16. Применение огнестрельного оружия

###1. Сотрудник полиции на территории населенных пунктов имеет право лично или в составе подразделения (группы) применять огнестрельное оружие в следующих случаях:

1) для защиты другого лица либо себя от посягательства, если это посягательство сопряжено открытием огня из оружия, а также в случаях, если преследуемый намеренно врезается в другие транспортные средства создавая угрозу жизни и здоровью гражданам.

2) во время погони только в том случае, если преследуемый открыл огонь или собирается это сделать.

###2. Сотрудник полиции за пределами населенных пунктов имеет право лично или в составе подразделения (группы) применять огнестрельное оружие в следующих случаях:

1) для защиты другого лица либо себя от посягательства, если это посягательство сопряжено с насилием, опасным для жизни или здоровья;

2) для освобождения заложников;

3) для задержания лица, застигнутого при совершении деяния, содержащего признаки тяжкого или особо тяжкого преступления против жизни, здоровья или собственности, и пытающегося скрыться, если иными средствами задержать это лицо не представляется возможным;

4) для задержания лица, оказывающего вооруженное сопротивление, а также лица, отказывающегося выполнить законное требование о сдаче находящихся при нем оружия, боеприпасов, взрывных устройств;

5) для пресечения побега из мест содержания под стражей подозреваемых и обвиняемых в совершении преступлений или побега из-под конвоя лиц, задержанных по подозрению в совершении преступления, лиц, в отношении которых применена мера пресечения в виде заключения под стражу, лиц, осужденных к лишению свободы, а также для пресечения попытки насильственного освобождения указанных лиц.

###3. Сотрудник полиции также имеет право применять огнестрельное оружие:

1) для остановки транспортного средства за пределами населенных пунктов путем его повреждения, если управляющее им лицо отказывается выполнить неоднократные требования (три предупреждения) сотрудника полиции об остановке и пытается скрыться, создавая угрозу жизни и здоровью граждан;

2) для производства предупредительного выстрела, подачи сигнала тревоги или вызова помощи путем производства выстрела вверх или в ином безопасном направлении за пределами населенных пунктов;

###4. Сотрудник полиции не имеет права применять огнестрельное оружие при значительном скоплении граждан, если в результате его применения могут пострадать случайные лица.

###5. Сотрудник полиции имеет право обнажить огнестрельное оружие и привести его в готовность, если в создавшейся обстановке могут возникнуть основания для его применения, предусмотренные 14 настоящего федерального закона.

Глава 6. ПРАВОВОЕ ПОЛОЖЕНИЕ СОТРУДНИКА ПОЛИЦИИ
​
Статья 17. Сотрудник полиции

1. Сотрудник полиции - гражданин, который осуществляет служебную деятельность на должности федеральной государственной службы в органах внутренних дел и которому в установленном порядке присвоено специальное звание

Статья 18. Гарантии правовой защиты сотрудника полиции

1. Сотрудник полиции, выполняя обязанности, возложенные на полицию, и реализуя права, предоставленные полиции, выступает в качестве представителя государственной власти и находится под защитой государства.

2. Никто не имеет права вмешиваться в законную деятельность сотрудника полиции, кроме лиц, прямо уполномоченных на то. Никто не имеет права принуждать сотрудника полиции к выполнению обязанностей, которые законодательством на полицию не возложены.

3. Законные требования сотрудника полиции обязательны для выполнения гражданами и должностными лицами

4. Воспрепятствование выполнению сотрудником полиции служебных обязанностей, оскорбление сотрудника полиции, оказание ему сопротивления, насилие или угроза применения насилия по отношению к сотруднику полиции в связи с выполнением им служебных обязанностей либо невыполнение законных требований сотрудника полиции влечет ответственность

Статья 19. Ответственность сотрудника полиции

1. Сотрудник полиции независимо от замещаемой должности несет ответственность за свои действия (бездействие) и за отдаваемые приказы и распоряжения.

2. За противоправные действия (бездействие) сотрудник полиции несет ответственность, установленную Федеральным законом.


`},{slug:"fzo-tod",abbr:"ФЗоТОД",title:"Федеральный закон «О территориях с ограниченным доступом»",notes:"Режим охраняемых/служебных зон, пропуска.",updated:"2025-02-23",content:`# Федеральный закон «О территориях с ограниченным доступом»

ГЛАВА 1. ОБЩИЕ ПОЛОЖЕНИЯ​

Статья 1. Общие положения
Государственные территории, земельные участки, здания, помещения и иные объекты подразделяются на:
- охраняемые территории;
- служебные территории;


Статья 2. Охраняемые территории
К охраняемым территориям относятся воинская часть, территория исправительной колонии, военизированные и стратегические объекты и территории, оцепленные сотрудниками правоохранительных органов

Статья 3. Служебные территории
К служебным территориям относятся:
1) парковочные участки государственных органов и организаций;
2) здания государственных органов и организаций, доступ на которые имеют только сотрудники данных организаций;
3) помещения и иные объекты государственных органов и организаций, доступ на которые имеют только сотрудники данных организаций;
4) транспортные средства всех государственных организаций;
ГЛАВА 2. ОХРАНЯЕМЫЕ ТЕРРИТОРИИ
​
Статья 4. Территория воинской части
###1. Воинская часть - режимный объект, который имеет определённые зоны для допустимого нахождения гражданских лиц и сотрудников государственных структур.

###2. Территориальные зоны воинской части разделяются на следующие виды:
1) жёлтая зона - зона, нахождение в границах которой разрешено при наличии весомой причины;
2) красная зона - зона, в которой категорически запрещено нахождение гражданских без сопровождения и допуска командира части.
3) зеленая зона - участок охраняемой территории где могут находится граждане, но в случае нарушения общественного порядка или воспрепятствования сотрудникам/военнослужащим выполнению служебных обязанностей путем помехи, к данному гражданину могут быть выдвинуты требования покинуть данную территорию или прекратить нарушение. В случае невыполнения законного требования гражданин может быть привлечен к административной или уголовной ответственности предусмотренной законодательством.;

Территория красной зоны воинской части
![Территория красной зоны воинской части](/img/red-zone.png)
Территория КПП-1
![Территория КПП-1](/img/cpp.png)
Территория КПП-2
![Территория КПП-2](/img/cpp2.png)

Статья 4.1. Права военнослужащих и сотрудников правоохранительных органов на территории воинской части
1. В случаях обнаружения постороннего лица на территории жёлтой зоны воинской части без уважительной причины, военнослужащие и сотрудники правоохранительных органов вправе потребовать лицо, находящееся на территории, покинуть её в установленный срок
2. В случае отказа от выполнения требований, указанных в п. 1 ст. 5 настоящего Федерального закона, применить в отношении лица, находящегося на территории, меры государственного принуждения в виде задержания, - для передачи лица в правоохранительные органы, установления личности и цели нахождения
3. Военнослужащие и сотрудники правоохранительных органов не имеют право применять огнестрельное оружие в отношении лиц, находящихся на территории «желтой зоны» в любых случаях, кроме вооруженного нападения. Если иное не регламентируется в других НПА
4. При обнаружении постороннего лица на территории красной зоны воинской части военнослужащие и сотрудники правоохранительных органов вправе:
1) остановить постороннее лицо и произвести задержание;
2) использовать оружие если постороннее лицо оказывает какое-либо сопротивление при задержании. Следует сделать 3 предупредительных выстрела в воздух, если и после такого манёвра человек не реагирует - военнослужащие и сотрудники правоохранительных органов имеют право открыть огонь на поражение;
3) открыть огонь без предупреждения на поражение в случае вооруженного нападения группы лиц на территорию красной зоны воинской части.
5. В случаях, когда воздушное средство неоднократно летает над территорией воинской части или наворачивает круги, потребовать с помощью воздушного средства улететь с территории воинской части в случае отказа - открыть огонь на поражение исключительно по летальному аппарату.

Статья 4.2. Посещение и нахождение на территориальных зонах воинской части
1. Причины, по которым постороннее лицо может находиться на территории желтой зоны воинской части:
1) Доставка заказа на КПП через такси (находиться в зоне разрешается не дольше одной минуты);
2) Назначенная встреча с военнослужащим с разрешения старшего по званию.

2. К посещению территории жёлтой и красной зоны воинской части допускаются:
1) военнослужащие воинской части (исключительно в служебной форме или по пути к казарме);
2) губернатор, вице-губернаторы, - для осуществления любых служебных полномочий, по предъявлению служебного удостоверения;
3) руководитель и сотрудники департамента вооруженных сил, службы охраны в составе правительства, - для исполнения надзорной деятельности, для проведения проверки по предъявлению служебного удостоверения, строго в рабочее время;
4) сотрудники полиции, - для сопровождения военного конвоя, отбития вооруженного нападения, задержания лица, находящегося в розыске, по предъявлению служебного удостоверения;
5) сотрудники скорой медицинской помощи, - для оказания неотложной медицинской помощи, по предъявлению служебного удостоверения;
6) сотрудники спасательных или противопожарных органов, - для оказания неотложной помощи или выполнения иных спасательных работ, по предъявлению служебного удостоверения;
7) ревизоры, - для проведения ревизий по предъявлению служебного удостоверения, в сопровождении полковника/генерала-майора воинской части
8) военнослужащие органов федеральной службы безопасности - исключительно в служебной форме при предъявлению служебного удостоверения (исключение: нападение на ВЧ, ЧП или отсутствие дежурного на КПП)
9) работники Нижегородского областного суда по предъявлению служебного удостоверения

3. Гражданские лица и иные, могут допускаться к посещению красной зоны воинской части при сопровождении старшего по званию.
4. Должностные лица могут быть подвергнуты процедуре досмотра перед посещением воинской части.
5. В случае необходимости, по распоряжению федеральной службы безопасности или командования части, воинская часть может являться местом сбора государственных организаций. В таком случае, на территории воинской части могут находиться сотрудники государственных организаций, принимающих участие в таком сборе, но в сопровождении и под присмотром военнослужащих органов ФСБ или командования воинской части
6. В случае вооруженного нападения на территорию воинской части посторонние лица, не состоящие на службе в органах ФСБ или вооруженных силах, обязаны покинуть территорию воинской части по первому требованию сотрудника правоохранительных органов
7. В случае неадекватного поведения со стороны гражданского лица на территории зеленой зоны около КПП-1, военнослужащие или сотрудники правоохранительных органов имеют право задержать гражданское лицо и вывести его с этой территории

Статья 5. Территория военного грузового поезда
1. Военный грузовой поезд является подведомственным объектом вооруженных сил, который имеет желтую зону для допустимого нахождения сотрудников государственных структур.

Территория военного грузового поезда
![Территория военного грузового поезда](/img/poezd.jpg)

Статья 5.1. Права военнослужащих и сотрудников правоохранительных органов на территориальных зонах военного грузового поезда
1. В случаях обнаружения постороннего лица на территории жёлтой зоны, военнослужащие и сотрудники правоохранительных органов вправе потребовать лицо, находящееся на территории, покинуть её в установленный срок

2. В случае отказа от выполнения требований, указанных в п. 1 ст. 8 настоящего Федерального закона, применить в отношении лица, находящегося на территории, меры государственного принуждения в виде задержания, - для передачи лица в правоохранительные органы, установления личности и цели нахождения

Статья 5.2. Посещение и нахождение на территориальных зонах военного грузового поезда
1. К посещению территории жёлтой зоны военного грузового поезда допускаются:
1) военнослужащие воинской части (исключительно в служебной форме);
2) сотрудники полиции, - для сопровождения военного конвоя, отбития вооруженного нападения, задержания лица, находящегося в розыске, по предъявлению служебного удостоверения;
3) сотрудники скорой медицинской помощи, - для оказания неотложной медицинской помощи, по предъявлению служебного удостоверения;
4) сотрудники спасательных или противопожарных органов, - для оказания неотложной помощи или выполнения иных спасательных работ, по предъявлению служебного удостоверения;
5) военнослужащие органов федеральной службы безопасности - исключительно в служебной форме;

Статья 6. Территория исправительной колонии «Кресты»
1. Исправительная колония «Кресты» - режимный объект, который имеет определённые зоны для допустимого нахождения гражданских лиц и сотрудников государственных структур.

2. Территориальные зоны исправительной колонии «Кресты» разделяются на следующие виды:
1) жёлтая зона - зона, где гражданские лица и представители других государственных структур находятся под строгим контролем охраны исправительной колонии;
2) красная зона - зона, где находиться гражданским лицам и сотрудникам других государственных структур без весомой причины, предварительного досмотра и сопровождения охраны исправительной колонии строго запрещено.


Статья 6.1. Права сотрудников ФСИН и правоохранительных органов на территориальных зонах исправительной колонии «Кресты»
1. В случаях обнаружения постороннего лица на территории жёлтой зоны, сотрудники ФСИН и сотрудники правоохранительных органов вправе потребовать лицо, находящееся на территории, покинуть её в установленный срок

2. В случае отказа от выполнения требований, указанных в п. 1 ст. 11 настоящего Федерального закона, применить в отношении лица, находящегося на территории, меры государственного принуждения в виде задержания, - для передачи лица в правоохранительные органы, установления личности и цели нахождения

3. При обнаружении постороннего лица на территории красной зоны сотрудники ФСИН и сотрудники правоохранительных органов вправе:
1) остановить постороннее лицо и произвести задержание;
2) использовать оружие если постороннее лицо оказывает какое-либо сопротивление при задержании. Следует сделать 3 предупредительных выстрела в воздух, если и после такого манёвра человек не реагирует - сотрудники ФСИН и сотрудники правоохранительных органов имеют право открыть огонь на поражение;
3) открыть огонь без предупреждения на поражение в случае вооруженного нападения группы лиц на территорию красной зоны воинской части.

Статья 6.2. Посещение и нахождение на территориальных зонах исправительной колонии «Кресты»
1. К посещению территории красной зоны исправительной колонии «Кресты» допускаются:
1) сотрудники ФСИН (исключительно в служебной форме или по пути к раздевалке);
2) губернатор, вице-губернаторы, - для осуществления любых служебных полномочий, по предъявлению служебного удостоверения;
3) руководитель и сотрудники департамента внутренних дел, службы охраны в составе правительства, - для исполнения надзорной деятельности, для проведения проверка по предъявлению служебного удостоверения, строго в рабочее время и в рабочей форме;
4) сотрудники полиции, - для отбития вооруженного нападения, - по предъявлению служебного удостоверения;
5) сотрудники скорой медицинской помощи, - для оказания неотложной медицинской помощи, по предъявлению служебного удостоверения;
6) сотрудники спасательных или противопожарных органов, - для оказания неотложной помощи или выполнения иных спасательных работ, по предъявлению служебного удостоверения;
7) адвокаты, - для оказания юридических услуг, - по предъявлению служебного удостоверения, после прохождения личного досмотра и в сопровождении сотрудника исправительной колонии;
8) военнослужащие воинской части, - для осуществления поставок боеприпасов на склад;
9) военнослужащие органов федеральной службы безопасности - исключительно в служебной форме при сообщении в департамент о въезде на территорию (исключение: нападение на ФСИН, ЧП)
10) работники Нижегородского областного суда в сопровождении сотрудников ФСИН

2. Должностные лица могут быть подвергнуты процедуре досмотра перед посещением.
3. В случае вооруженного нападения на территорию ФСИН посторонние лица, не состоящие на службе в органах ФСБ, ФСИН и органах внутренних дел обязаны покинуть территорию воинской части по первому требованию сотрудника правоохранительных органов


ГЛАВА 3. СЛУЖЕБНЫЕ ТЕРРИТОРИИ​

Статья 7. Права сотрудников на служебных территориях
1. Требовать от граждан покинуть служебную территорию, если их нахождение на такой территории является незаконным или не согласованным, с нарушением требований, предусмотренных настоящим Федеральным законом;
2. Привлекать лиц к административной (в случае рецидива - к уголовной) ответственности, если их нахождение на служебной территории является незаконным;
3. В случае отказа граждан покинуть служебную территорию, применить к ним физическую силу с целью принудительного выпровождения за её пределы или применить в их отношении меры государственного принуждения в виде задержания, для последующего доставления в органы исполнительной власти в сфере внутренних дел или безопасности, для установления личности и цели нахождения на территории

Статья 7.1. Посещение и нахождение на служебных территориях
1. К посещению служебных территорий допускаются:
1) сотрудники организации, к которой относится территория (в служебной форме или по пути к раздевалке)
2) военнослужащие органов федеральной службы безопасности и работники Нижегородского областного суда
3) сотрудники полиции, - для задержания лица, находящегося в розыске, по предъявлению служебного удостоверения;
4) сотрудники скорой медицинской помощи, - для оказания неотложной медицинской помощи, по предъявлению служебного удостоверения;
5) сотрудники спасательных или противопожарных органов, - для оказания неотложной помощи или выполнения иных спасательных работ, по предъявлению служебного удостоверения;
6) сотрудники телерадиокомпании - для выполнения своих служебных задач на служебной территории, должны получить согласование с руководством организации на территории которой хотят находится
7) ревизоры, - для проведения ревизий по предъявлению служебного удостоверения, в сопровождении руководителя организации
8) сотрудники ФСИН, - для осуществления конвоирования заключенных
9) губернатор, вице-губернаторы, - для осуществления любых служебных полномочий, по предъявлению служебного удостоверения;
10) руководитель и сотрудники департамента определенной организации, службы охраны в составе правительства, - для исполнения надзорной деятельности, для проведения проверки по предъявлению служебного удостоверения, строго в рабочее время;

Служебные территории:
Правительство
![Правительство2](/img/pravo2.png)
![Правительство](/img/pravo.png)

ЕСС
![ЕСС](/img/ess.png)
![ЕСС2](/img/ess2.png)

Статья 8. Служебная территория Управления ФСБ
1. Указанные в настоящей статье объекты являются территориями, зданиями, помещениями, принадлежащими органам федеральной службы безопасности, которые являются служебным, а равно здания и парковки Управления федеральной службы безопасности (УФСБ) по Нижегородской области.

2. Территориальные зоны объектов органов федеральной службы безопасности подразделяются на следующие виды:

⠀⠀⠀⠀1) "Красная" зона - участок служебной территории где действует особый режим нахождения на данной территории;
⠀⠀⠀⠀2) "Желтая" зона - участок служебной территории где запрещено находится посторонним лицам;
⠀⠀⠀⠀3) "Зеленая" зона - участок служебной территории где могут находится граждане, но в случае нарушения общественного порядка или воспрепятствования сотрудникам/военнослужащим выполнению служебных обязанностей путем помехи, к данному гражданину могут быть выдвинуты требования покинуть данную территорию или прекратить нарушение. В случае невыполнения законного требования гражданин может быть привлечен к административной или уголовной ответственности предусмотренной законодательством.
Статья 8.1. Лица, имеющие право на посещение и нахождение на территориальных зонах объектов органов федеральной службы безопасности и прилегающих территориях
1. сотрудники федеральной службы безопасности;
2. сотрудники спасательных и медицинских учреждений, - для оказания помощи в экстренных, чрезвычайных ситуациях и иных происшествиях, требующих безотлагательных мер по их устранению;
3. государственные и муниципальные служащие, - в случаях, когда объект органа федеральной службы безопасности был обозначен как место проведения общего сбора или построения;
4. гражданские лица, государственные и муниципальные служащие, допущенные на территорию органа федеральной службы безопасности с разрешения и в сопровождении сотрудника федеральной службы безопасности в служебных целях.
Статья 8.2. Права военнослужащих на территориальных зонах объектов органов федеральной службы безопасности и прилегающих территориях
1. В случаях обнаружения постороннего лица на территории "жёлтой" зоны, военнослужащие федеральной службы безопасности вправе:

  1) остановить неустановленное лицо для установления причины нахождения на территории "желтой" зоны;
⠀⠀⠀⠀2) в случае незаконного нахождения обнаруженного лица потребовать покинуть "желтую" зону;
⠀⠀⠀⠀3) в случае невыполнения законного требования задержать лицо и осуществить принудительное выпровождение за территорию "желтой" зоны.

2. В случае неоднократного проникновения на территорию "желтой" зоны и невыполнения законных требований её покинуть сотрудники правоохранительных органов вправе привлечь лицо к установленной законом уголовной или административной ответственности.

3. В случаях обнаружения постороннего лица на территории "красной" зоны, военнослужащие федеральной службы безопасности вправе:
⠀⠀⠀⠀
⠀⠀⠀⠀1) предпринять меры к незамедлительному задержанию лица;
⠀⠀⠀⠀2) принудительно выпроводить лицо за территорию "красной" и "желтой" зоны и уведомить его о возможном привлечении к уголовной ответственности в случае повторного преднамеренного проникновения, - если при нахождении на "красной" зоне лицо не осуществляло или не планировало осуществить противоправные или иные вредительские действия;
⠀⠀⠀⠀3) привлечь лицо к установленной законом уголовной или административной ответственности, - если при нахождении на "красной" зоне лицо осуществляло или планировало осуществить противоправные или иные вредительские действия.

Служебная территория УФСБ
![УФСБ](/img/yfsb.png)

Статья 9. Служебная территория органов внутренних дел (УМВД/ГАИ)

1. Указанные в настоящей статье объекты являются территориями, зданиями, помещениями, принадлежащими к органами внутренних дел, которые являются служебным, а равно здания и парковки Управления министерства внутренних дел (УМВД) и Управления Госавтоинспекции (ГАИ) по Нижегородской области

2. Территориальные зоны объектов органов внутренних дел подразделяются на следующие виды:

⠀⠀⠀⠀1) "Красная" зона - участок служебной территории где действует особый режим нахождения на данной территории;
⠀⠀⠀⠀2) "Желтая" зона - участок служебной территории где запрещено находится посторонним лицам;
⠀⠀⠀⠀3) "Зеленая" зона - участок служебной территории где могут находится граждане, но в случае нарушения общественного порядка или воспрепятствования сотрудникам/военнослужащим выполнению служебных обязанностей путем помехи, к данному гражданину могут быть выдвинуты требования покинуть данную территорию или прекратить нарушение. В случае невыполнения законного требования гражданин может быть привлечен к административной или уголовной ответственности предусмотренной законодательством.

Статья 9.1. Посещение и нахождение на служебных территориях МВД

1. сотрудники федеральной службы безопасности, сотрудники органов внутренних дел (полиции) и работники Нижегородского областного суда;
2. сотрудники спасательных и медицинских учреждений, - для оказания помощи в экстренных, чрезвычайных ситуациях и иных происшествиях, требующих безотлагательных мер по их устранению;
3. сотрудники органов федеральной службы исполнения наказаний, - в случае необходимости этапирования задержанного лица в исправительную колонию (конвоирование);
4. губернатор, вице-губернатор, сотрудники департамента внутренних дел Правительства Нижегородской области, - для проведения надзорной и прочей служебной деятельности;
5. государственные и муниципальные служащие, - в случаях, когда объект органа внутренних дел был обозначен как место проведения общего сбора или построения;
6. сотрудники телерадиокомпании "Амазинг" - для выполнения своих служебных задач на служебной территории , должны получить согласование с руководством органа внутренних дел, губернатора, вице-губернатора, руководством ФСБ;
7. ревизоры - для проведения ревизий по предъявлению служебного удостоверения, в сопровождении сотрудника полиции из старшего состава. Ревизия должна быть согласована (получено разрешение) с одним из должностных лиц: губернатор, вице-губернатор, начальник департамента внутренних дел, заместитель начальника департамента внутренних дел;
8. адвокаты - для оказания юридической помощи подозреваемому (задержанному) по предъявлению удостоверения адвоката. В случае иных целей нахождения адвоката на территории "желтой" зоны - сотрудник полиции/ФСБ вправе потребовать покинуть территорию.

Статья 9.2. Права сотрудников на служебных территориях
1. остановить неустановленное лицо для установления причины нахождения на территории "желтой" зоны;
2. в случае незаконного нахождения обнаруженного лица потребовать покинуть "желтую" зону;
3. в случае невыполнения законного требования задержать лицо и осуществить принудительное выпровождение за территорию "желтой" зоны.

4. В случае неоднократного проникновения на территорию желтой зоны и невыполнения законных требований её покинуть сотрудники правоохранительных органов вправе привлечь лицо к установленной законом уголовной или административной ответственности.

5. В случае создания преднамеренной помехи движению служебному транспортному средству на территории "зеленой" / "желтой" зоны сотрудник правоохранительного органа вправе:

⠀⠀⠀⠀1) потребовать лицо незамедлительно прекратить создание помехи или освободить служебный проезд;
⠀⠀⠀⠀2) в случае невыполнения законного требования прекратить создание помехи или освободить служебный проезд задержать лицо (в том числе применить физическую силу к лицу, находящемуся в транспортном средстве), осуществить принудительное выпровождение за территорию "зеленой" / "желтой" зоны;
⠀⠀⠀⠀3) в случае неоднократного создания помехи на территории "зеленой" / "желтой" зоны и невыполнения требований сотрудников правоохранительных органов привлечь лицо к установленной законом административной или уголовной ответственности, эвакуировать транспортное средство, создающее преднамеренную помеху движению.

6. В случаях обнаружения постороннего лица на территории "красной" зоны, сотрудники органов внутренних дел вправе:

⠀⠀⠀⠀1) предпринять меры к незамедлительному задержанию лица;
⠀⠀⠀⠀2) принудительно выпроводить лицо за территорию "красной" и "желтой" зоны и уведомить его о возможном привлечении к уголовной ответственности в случае повторного преднамеренного проникновения, - если при нахождении на "красной" зоне лицо не осуществляло или не планировало осуществить противоправные или иные вредительские действия;
⠀⠀⠀⠀3) привлечь лицо к установленной законом уголовной или административной ответственности, - если при нахождении на "красной" зоне лицо осуществляло или планировало осуществить противоправные или иные вредительские действия.

`},{slug:"fzo-vs",abbr:"ФЗоВС",title:"Федеральный закон «О военной службе»",notes:"Порядок прохождения службы.",updated:"2025-02-23",content:`# Федеральный закон «О военной службе»

##Раздел I. Общее положение
​
Статья 1. Военная служба. Военнослужащие
​
1. Военная служба - особый вид федеральной государственной службы.

2. Прохождение военной службы осуществляется: гражданами - по призыву либо по контракту.

3. Граждане проходящие военную службу, являются военнослужащими.​
Стать 2. Статус военнослужащего

1. Статус военнослужащих это совокупность прав, свобод, гарантированных государством, а также обязанностей и ответственности военнослужащих, установленных настоящим Федеральным законом, федеральными конституционными законами, федеральными законами и иными нормативными правовыми актами Нижегородской области.

2. Военнослужащим выдаются документы, удостоверяющие их личность, а также документы, удостоверяющие личность и правовое положение военнослужащих.

3. Военнослужащие имеют право на хранение, ношение, применение и использование оружия в порядке, определяемом федеральными конституционными законами, федеральными законами и иными нормативными правовыми актами Нижегородской области.

Статья 3. Правовая основа военной службы

1. Правовой основой военной службы являются Конституция Нижегородской области, настоящий Федеральный закон, другие федеральные законы и иные нормативные правовые акты Нижегородской области, регулирующие вопросы обороны, военной службы и статуса военнослужащих.
##Раздел II. Призыв граждан на военную службу​

Статья 4. Граждане подлежащие призыву на военную службу
1. Призыву на военную службу подлежат граждане мужского и женского пола в возрасте от 18 лет

2. Решение о призыве на военную службу может быть принято самостоятельно гражданами только после достижения ими возраста 18 лет.

Статья 5. Граждане не подлежащие призыву на военную службу
1. На военную службу не призываются граждане, которые имеют непогашенные штрафы или судимости

2. Находятся на учете в наркологическом диспансере, либо на учете у психотерапевта

3. В отношении которых ведется дознание либо предварительное следствие или уголовное дело в отношении которых передано в суд
Раздел III. Поступление на военную службу по контракту.
​
Статья 6. Контракт о прохождении военной службы по контракту
1. Контракт о прохождении военной службы заключается между гражданином и от имени Нижегородской области - Министерством обороны Нижегородской области

2. В контракте о прохождении военной службы закрепляются добровольность поступления гражданина на военную службу

3. Контракт о прохождении военной службы вступает в силу со дня его подписания соответствующим должностным лицом

Статья 7. Требования предъявляемые к гражданам, поступающим на военную службу по контракту.
1. Гражданин, поступающий на военную службу по контракту, должен соответствовать медицинским и профессионально-психологическим требованиям военной службы к конкретным военно-учетным специальностям. Для определения соответствия гражданина установленным требованиям проводятся медицинское освидетельствование и мероприятия по профессиональному психологическому отбору.

2. Гражданин, поступающий на военную службу по контракту должен соответствовать требованиям по уровню: квалификации и физической подготовке.
##Раздел IV. Военная служба
​
Статья 8. Военная форма одежды военнослужащих

1. Для военнослужащих устанавливаются военная форма одежды

2. Военнослужащий вправе не носить военную форму одежды вне расположения воинской части, на отдыхе, в увольнении или отпуске.​
Статья 9. Военная присяга и обязательство

1. Военнослужащий, являющийся гражданином, проходящий военную службу по призыву или впервые поступивший на военную службу по контракту, приводится к Военной присяге.

2. Утверждается следующий текст Военной присяги:
"Я, (фамилия, имя, отчество), торжественно присягаю на верность своему Отечеству
клянусь свято соблюдать Конституцию, строго выполнять требования воинских уставов, приказы командиров и начальников. Клянусь достойно исполнять воинский долг, мужественно защищать свободу, независимость и конституционный строй, народ и Отечество".
Статья 10. Приведение к Военной присяге и принесение обязательства

1. Приведение к Военной присяге (принесение обязательства) проводится:
по прибытии военнослужащего к первому месту прохождения военной службы.

2. До приведения к Военной присяге (принесения обязательства):
военнослужащий, не может привлекаться к выполнению боевых задач (участию в боевых действиях, несению боевого дежурства, боевой службы, караульной службы) и задач при введении режима чрезвычайного положения и в условиях вооруженных конфликтов.
Статья 11. Воинские должности

1. Военнослужащий может занимать только одну воинскую должность.

2. Каждой воинской должности должно соответствовать одно воинское звание.

3. Перечень воинских должностей определяет Министерством обороны Нижегородской области.
Статья 12. Назначение на воинские должности, освобождение от воинских должностей

1. Назначение на воинские должности и освобождение от воинских должностей осуществляются:

- военнослужащих, для которых предусмотрены воинские звания высших офицеров, - указам Министерством обороны Нижегородской области;

- военнослужащих, для которых предусмотрены воинские звания старших офицеров, -
письменным приказом Командиром воинской части;

- остальных военнослужащих - устным приказом Командира воинской части
Статья 13. Перевод военнослужащих

1. Военнослужащие могут быть переведены для дальнейшего прохождения военной службы:

- из Вооруженных Сил в федеральный орган исполнительной власти или федеральный государственный орган, в которых настоящим Федеральным законом предусмотрена военная служба.

Статья 14. Присвоение воинских званий

1. Воинские звания военнослужащим присваиваются:

высших офицеров - Министерством обороны Нижегородской области;
до полковника включительно - Командиром или его заместителем воинской части

Сроки военной службы в воинских званиях и порядок их присвоения определяются Критериями присвоения очередного звания.

2. Очередное воинское звание присваивается военнослужащему в день истечения срока его военной службы в предыдущем воинском звании.

2.1. Очередное воинское звание не присваивается военнослужащему:

а) в случае привлечения его в качестве обвиняемого по уголовному делу либо возбуждения в отношении его уголовного дела - до прекращения уголовного преследования

б) в период проведения разбирательства по факту совершения им грубого дисциплинарного проступка - до применения к военнослужащему дисциплинарного взыскания;

е) до истечения срока, в течение которого он считается имеющим дисциплинарное взыскание.

3. Очередное воинское звание военнослужащему может быть присвоено досрочно за особые личные заслуги, но не выше воинского звания, предусмотренного штатом для занимаемой им воинской должности.

##Раздел V. Права и свободы Военнослужащих​

Статья 15. Защита свободы, чести и достоинства
1. Военнослужащие находятся под защитой государства. Никто не вправе вмешиваться в служебную деятельность военнослужащих, за исключением лиц, уполномоченных на то федеральными конституционными законами, федеральными законами и иными нормативными правовыми актами

2. Оскорбление военнослужащих, насилие и угроза применения насилия, посягательство на их жизнь, здоровье, честь, достоинство, жилище, имущество, а равно другие действия (бездействие), нарушающие и ущемляющие их права в связи с исполнением ими обязанностей военной службы, влекут ответственность в соответствии с федеральными законами и иными нормативными правовыми актами

Статья 16. Право на охрану и защиту здоровья
Охрана здоровья военнослужащих обеспечивается созданием благоприятных условий военной службы, быта и системой мер по ограничению опасных факторов военной службы, проводимой командирами во взаимодействии с органами государственной власти.

Статья 17. Право на свободу слова
1. Военнослужащие, реализуя право на свободу слова, выражение своих мнений и убеждений, доступ к получению и распространению информации, не вправе разглашать государственную или иную охраняемую законом тайну, обсуждать и критиковать приказы командира.

1.1. Военнослужащим запрещается иметь при себе электронные изделия бытового назначения, в которых могут храниться или которые позволяют с использованием информационно-телекоммуникационной сети "Интернет" распространять или предоставлять аудио-, фото-, видеоматериалы и данные геолокации за исключением командующего состава части.

1.2. Военнослужащие могут в свободное от службы время участвовать без оружия в мирных собраниях, митингах, демонстрациях, шествиях и пикетированиях за пределами территории воинской части.

1.3. Забастовки и другие формы прекращения исполнения обязанностей военной службы для урегулирования вопросов, связанных с прохождением службы, строго запрещены.

Статья 18. Право военнослужащего на обжалование неправомерных действий
1. Военнослужащие имеют право на защиту своих прав и законных интересов путем обращения в суд.

2. Неправомерные решения и действия (бездействие) органов военного управления и командиров могут быть обжалованы военнослужащими в порядке, предусмотренном федеральными законами, общевоинскими уставами и иными нормативными правовыми актами.

Статья 19. Право военнослужащего по отношению к гражданским лицам
1. Военнослужащий имеет право временно ограничить свободу гражданского лица за нарушение законодательства до приезда сотрудников МВД/ФСБ.

2. Военнослужащий имеет право на проверку документов удостоверяющих личность гражданина.

3. Военнослужащий имеет право применить оружие по лицам, которые незаконно проникли на воинскую часть.

4. Военнослужащий имеет право использовать специальные средства и физическую силу

5. Военнослужащий в случае помехи передвижению или создания какой-либо угрозы военной колоне имеет право требовать от граждан прекратить совершать противоправные действия. В случае неповиновения - обнажить табельное оружие и (или) произвести предупредительный выстрел в воздух, при этом ещё раз громко повторив свои законные требования.

6. Инспектора военной полиции имеют право проводить личный досмотр военнослужащим/гражданским лицам, если имеются основания полагать, что эти лица имеют при себе оружие, боеприпасы, взрывчатые вещества, наркотические средства, психотропные вещества, а также скрывают предметы хищения, изымать указанные предметы, средства и вещества при отсутствии законных оснований для их ношения или хранения.


Статья 20. Право военнослужащего на обжалование дисциплинарного взыскания
1. Военнослужащий, который привлекается к дисциплинарной ответственности, имеет право давать объяснения, представлять доказательства и в случаи несогласия обращаться в нижегородской областной суд
##Раздел VI. Обязанности и ответственность военнослужащих​

Статья 21. Общие обязанности военнослужащих.
1. Защита государственного суверенитета и территориальной целостности, обеспечение безопасности государства, отражение вооруженного нападения.

2. Быть верными Военной присяге (обязательству), беззаветно служить народу Нижегородской области, мужественно и умело защищать Нижегородскую область.

3. Строго соблюдать Конституцию Нижегородской области и законы Нижегородской области, требования общевоинских уставов,

4. Беспрекословно выполнять приказы командиров;

5. Дорожить воинской честью, боевой славой и войсковым товариществом

6. Совершенствовать воинское мастерство, содержать в постоянной готовности к применению вооружение и военную технику, беречь военное имущество

7. Быть дисциплинированными, бдительными, хранить государственную и военную тайну

Статья 22. Должностные и специальные обязанности.
1. Должностные обязанности военнослужащих и порядок их исполнения определяются федеральными законами, общевоинскими уставами и иными нормативными правовыми актами Нижегородской области.

2. Командиры являются единоначальниками и отвечают в мирное и военное время за постоянную боевую и мобилизационную готовность, успешное выполнение боевых задач, боевую подготовку, воспитание, воинскую дисциплину

3. Для исполнения должностных и специальных обязанностей, в том числе в военной полиции Вооруженных Сил (далее - военная полиция), военнослужащие могут наделяться дополнительными правами на применение оружия, физической силы, специальных средств, предъявление требований, обязательных для исполнения, подчинение строго определенным лицам и другими правами, которые определяются федеральными законами, общевоинскими уставами


Статья 23. Ответственность Военнослужащих
Военнослужащий, в зависимости от характера и тяжести совершенного им правонарушения привлекается к дисциплинарной, административной, материальной, гражданско-правовой и уголовной ответственности в соответствии с настоящим Федеральным законом и другими федеральными законами
`},{slug:"fzo-fsb",abbr:"ФЗоФСБ",title:"Федеральный закон «О ФСБ»",notes:"Статус, задачи и полномочия.",updated:"2025-02-23",content:`# Федеральный закон «О федеральной службе безопасности»

##Раздел 1. Общие положения​

Статья 1. Федеральная служба безопасности и ее назначение
1. Федеральная служба безопасности - единая централизованная система органов федеральной службы безопасности, осуществляющая решение в пределах своих полномочий задач по обеспечению безопасности Нижегородской области.

2. Управление федеральной службой безопасности осуществляется руководителем федерального органа исполнительной власти.

Статья 2. Принципы деятельности федеральной службы безопасности
1. Деятельность федеральной службы безопасности осуществляется на основе следующих принципов:
1) законность;
2) уважение и соблюдение прав и свобод человека и гражданина;
3) гуманизм;
4) конспирация, сочетания гласных и негласных методов и средств.

Статья 3. Защита сведений о федеральной службе безопасности
1. Лица, получившие в связи с исполнением служебных или профессиональных обязанностей доступ к информации о деятельности органов федеральной службы безопасности, составляющей государственную тайну, обязаны соблюдать конфиденциальность данной информации и требования к ее защите.

2. Лица, допустившие разглашение (распространение) такой информации, несут ответственность, предусмотренную законодательством Нижегородской области

3. Вещественные и иные доказательства, в том числе те материалы дела, которые могут содержать служебную тайну или конфиденциальную информацию, например, записи телефонных переговоров, военнослужащие органов федеральной службы безопасности не обязаны предоставлять напрямую лицу, в отношении которого ведутся процессуальные действия. Такие материалы предоставляются руководителю территориального органа

##Раздел 2. Основные направления деятельности органов федеральной службы безопасности​

Статья 4. Направления деятельности органов федеральной службы безопасности
1. Деятельность органов федеральной службы безопасности осуществляется по следующим основным направлениям:

1) разведывательная деятельность;

2) борьба с терроризмом;

3) борьба с преступностью;

4) курирование силовых структур;

5) надзорная деятельность;

Статья 5. Борьба с терроризмом
1. Борьба с терроризмом - деятельность, осуществляемая органами федеральной службы безопасности или их подразделениями, а также должностными лицами указанных органов и подразделений, по выявлению, предупреждению, пресечению, раскрытию и расследованию террористических актов посредством проведения оперативно-боевых и иных мероприятий

2. Основаниями для проведения органами по борьбе с терроризмом мероприятий по борьбе с терроризмом являются:
1) необходимость пресечения террористического акта;
2) необходимость выявления лиц, причастных к подготовке и совершению террористического акта;
3) необходимость добывания информации о событиях или действиях, создающих угрозу терроризма

3. В борьбе с терроризмом проводятся гласные и негласные, оперативно-боевые и иные мероприятия, особый характер которых определяется условиями борьбы с терроризмом. Порядок проведения указанных мероприятий устанавливается внутренними инструкциями

4. Органы по борьбе с терроризмом осуществляют свою деятельность в соответствии с законодательством об оперативно-розыскной деятельности, уголовным и уголовно-процессуальным законодательством, настоящим Федеральным законом и другими нормативными правовыми актами Нижегородской области.

5. Результаты мероприятий по борьбе с терроризмом могут быть использованы в уголовном судопроизводстве в порядке, установленном уголовно-процессуальным законодательством для использования результатов оперативно-розыскной деятельности

Статья 6. Борьба с преступностью
Федеральная служба безопасности в соответствии со внутренними должностными инструкциями проводят оперативно-розыскные мероприятия по выявлению, предупреждению, пресечению и раскрытию, организованной преступности, коррупции, незаконного оборота оружия и наркотических средств, контрабанды, и иных преступлений, в том числе должностных, представляющих угрозу безопасности страны, а также по выявлению, предупреждению, пресечению и раскрытию деятельности незаконных вооруженных формирований, преступных групп, отдельных лиц и общественных объединений

Статья 7. Разведывательная деятельность
Разведывательная деятельность осуществляется органом федеральной службы безопасности в порядке, предусмотренном внутренними инструкциями. Порядок проведения разведывательных мероприятий и порядок использования специальных методов и средств при осуществлении разведывательной деятельности устанавливаются внутренними инструкциями

##Раздел 3. Полномочия органов федеральной службы безопасности​

Статья 8. Обязанности органов федеральной службы безопасности
1. Органы федеральной службы безопасности обязаны:

1) добывать разведывательную информацию в интересах обеспечения безопасности;
2) выявлять, предупреждать, пресекать и раскрывать преступления, предварительное следствие по которым отнесены к ведению органами федеральной службы безопасности, а также осуществлять розыск лиц, совершивших указанные преступления или подозреваемых в их совершении;
3) выявлять, предупреждать, пресекать, раскрывать и расследовать готовящиеся, совершающиеся и совершенные террористические акты, а также добывать информацию о событиях или действиях, создающих угрозу терроризма;
4) разрабатывать и осуществлять во взаимодействии с другими государственными органами меры по борьбе с коррупцией, незаконным оборотом оружия и наркотических средств, контрабандой, деятельностью незаконных вооруженных формирований, преступных групп, отдельных лиц и общественных объединений;
5) обеспечивать в пределах своих полномочий безопасность в Вооруженных силах;
6) обеспечивать в пределах своих полномочий безопасность федеральных органов государственной власти и органов государственной власти;
7) участвовать в пределах своих полномочий совместно с другими государственными органами в обеспечении безопасности проводимых общественно-политических или иных массовых мероприятий;
8) поддерживать мобилизационную готовность органов федеральной службы безопасности;
9) обеспечивать и (или) осуществлять профессиональное обучение, профессиональное образование и дополнительное профессиональное образование;

Статья 9. Права органов федеральной службы безопасности
1. Органы федеральной службы безопасности имеют право:

1) проводить оперативно-розыскные мероприятия по выявлению, предупреждению, пресечению и раскрытию преступной деятельности, а также деятельности, представляющей угрозу безопасности.

2) осуществлять специальные операции по пресечению террористической деятельности, а также создавать и использовать специальные методы и средства для их осуществления;

3) использовать в случаях, не терпящих промедлений, транспортные средства, боеприпасы, принадлежащие организациям или гражданам для предотвращения преступлений, преследования и задержания лиц, совершивших преступления или подозреваемых в их совершении, доставления граждан, нуждающихся в срочной медицинской помощи, а также для проезда к месту происшествия. По требованию владельцев транспортных средств органы федеральной службы безопасности в установленном законом порядке возмещают им расходы либо причиненный ущерб;

4) временно ограничивать или запрещать передвижение граждан и транспортных средств по отдельным участкам местности, обязывать граждан оставаться там или покинуть эти участки (объекты) в целях защиты жизни, здоровья и имущества граждан, проведения неотложных следственных действий, оперативно-розыскных и антитеррористических мероприятий;

5) проверять у лиц документы, удостоверяющие их личность, осуществлять их личный досмотр, если имеются достаточные основания подозревать их в совершении административных правонарушений или преступлений, а также досмотр транспортных средств и находящихся в них грузов при подозрении, что они используются в целях совершения указанных административных правонарушений или преступлений

6) проводить криминалистические и другие экспертизы и исследования;

7) осуществлять временное изъятие фото-видео-аудио фиксирующей аппаратуры находящейся у лиц, в отношении которых проводятся оперативно-розыскные или следственные мероприятия;

8) проводить в пределах своей компетенции проверки направленные на выявление нарушения нормативно-правовых актов со стороны государственных служащих;

9) получать на безвозмездной основе от государственных органов и организаций информацию, необходимую для выполнения возложенных на органы федеральной службы безопасности обязанностей;

10) создавать подразделения специального назначения для выполнения обязанностей, возложенных на органы федеральной службы безопасности;

11) применять любые меры к лицам, которые подозреваются в посягательстве на частную собственность;

12) останавливать транспортные средства, проверять документы на право пользования и управления ими, документы на транспортные средства и перевозимые грузы, осуществлять досмотр транспортных средств и грузов;

13) требовать/приспускать маски и акссесуары с лица гражданских лиц для установления личности;

14) требовать от граждан покинуть транспортное средство, если это необходимо для проведения личного досмотра или иных процессуальных действий;

15) составлять протоколы об административных правонарушениях, собирать доказательства, применять меры обеспечения производства по делам об административных правонарушениях, применять иные меры, предусмотренные законодательством об административных правонарушениях;

16) в рамках проведения оперативно-розыскных, оперативно-боевых, следственных, оперативно-профилактических и оперативно-предупредительных мероприятий, направленных на пресечение и раскрытие незаконного оборота наркотических веществ и оружия, проверять документы, удостоверяющие личность, документы на перевоз грузов водителями дальнобойных фур, совершать личный досмотр лиц, подвергнутым указанным мероприятиям, а также обыск транспортного средства;

17) требовать от граждан и должностных лиц прекращения противоправных действий, а равно действий, препятствующих законной деятельности государственных органов;

18) забирать под свой контроль задержанных у органов полиции, если в этом есть необходимость;

19) привлекать к дисциплинарной ответственности в порядке, предусмотренном законодательством, сотрудников государственных структур, если на то есть соответствующие основания, а также производить их немедленное задержание и доставление в органы федеральной службы безопасности, если имеются основания полагать, что сотрудник государственного учреждения представляет угрозу обществу и интересам государственной службы;

20) требовать от граждан в случае их обращения назвать свои фамилию, имя и отчество;

21) доставлять граждан, то есть осуществлять их принудительное препровождение, в служебное помещение подразделения полиции/ФСБ, в целях решения вопроса о задержании гражданина (при невозможности решения данного вопроса на месте); установления личности гражданина, если имеются основания полагать, что он находится в розыске, либо как уклоняющийся от исполнения уголовного наказания;

2. Использование мешковидный предмет (мешок, повязку, накидку на голову) по отношению к гражданам разрешается исключительно в случаях проявления явного неадекватного поведения с их стороны или в случае доставления на объекты, принадлежащие органам ФСБ;

Статья 10. Задержание
1. Федеральная служба безопасности имеет право задерживать:

1) Лиц, подозреваемых в совершении преступления либо административного или дисциплинарного правонарушения

2) Лиц, которые находятся в розыске.

3) Лиц, по отношению к которым ведется расследование по делам о преступлениях или нарушениях закона.

4) Лиц, которые совершили побег из-под стражи, ареста, задержания, из мест лишения свободы, или которые уклоняются от исполнения уголовного наказания.

5) Лиц, которые пытались совершить самоубийство или проявляют признаки серьезного психического расстройства и представляют опасность для себя или окружающих.

6) Лиц, незаконно проникших либо предпринявших попытку незаконного проникновения на охраняемые/служебные объекты, территории;

2. Люди, которых временно задержали и чьи права были ограничены, имеют право отказаться от дачи показаний против себя и своих близких, узнать причины и основания для их задержания, а также получить юридическую помощь от адвоката после передачи в изолятор временного содержания.

3. Сотрудники Федеральной службы безопасности обязаны гарантировать и защищать права задержанных в соответствии с законом.

4. Все объяснения, причины и основания для задержания должны быть сообщены задержанному наедине, без посторонних лиц. Если присутствуют посторонние лица, сотрудник имеет право не комментировать процесс задержания и его юридические основы.

5. Для задержания лиц, находящихся в розыске или подозреваемых в совершении преступления, сотрудники Федеральной службы безопасности могут действовать в гражданской одежде.

6. Во время проведения специальных операций, таких как облавы, рейды или другие оперативные и следственные действия, Федеральная служба безопасности имеет право временно задерживать людей, находящихся на территории объекта, который подвергается операции.

7. Сотрудник ФСБ не обязан разъяснять основания задержания до мелочей (имеет право кратко назвать основания и причину без каких либо разъяснений где это написано и т.д.)

Статья 11. Оцепление и блокирование территорий, помещений, зданий и иных объектов
1. Федеральная служба безопасности имеет право проводить блокирование и оцепление территорий, помещений, зданий и иных объектов:
1) при ликвидации последствий катастроф, аварий и иных чрезвычайных ситуаций преступного, природного и техногенного характера;
2) при проведении мероприятий по пресечению массовых беспорядков и иных действий, нарушающих права граждан, посягающих на общественную безопасность или блокирующих работу организаций;
3) при розыске лиц, совершивших побег из-под ареста, стражи, задержания;
4) при преследовании лица, находящегося в розыске или подозреваемого в совершении преступления;
5) при проведении контртеррористической операции, освобождении заложников, проверке сведений об обнаружении взрывчатых веществ или взрывных устройств;
6) при проведении мероприятий, направленных на обнаружение предметов, изъятых из гражданского оборота или ограниченно обороноспособных;
7) при наличии оснований полагать, что в границах территорий или на объектах готовится, совершается (совершено) преступление;
8) при необходимости предотвращения угрозы жизни и здоровью граждан, которые не могут быть защищены иным способом;
9) при проведении оперативно-профилактических, оперативно-розыскных, оперативно-боевых, следственных мероприятий;
10) при проведении учебных мероприятий;

2. При оцеплении (блокировании) территорий может быть ограничено или запрещено движение транспорта и пешеходов, если это необходимо для обеспечения безопасности граждан и общественного порядка, проведения следственных действий, оперативно-розыскных, оперативно-профилактических мероприятий, охраны места совершения преступления, административного правонарушения, места происшествия, а также для защиты объектов собственности, которым угрожает опасность.

3. В границах оцепления (блокирования) федеральная служба безопасности может осуществлять личный осмотр граждан, находящихся при них вещей (предметов, механизмов, веществ), осмотр транспортных средств и перевозимых грузов с участием водителей или граждан, сопровождающих грузы, с применением при необходимости технических средств. В случае отказа гражданина подвергнуться личному осмотру или предоставить для осмотра транспортное средство и перевозимые грузы полиция имеет право не допускать проход такого гражданина на территории, в жилые помещения, строения и на другие объекты, где проводится оцепление (блокирование), или его выход за пределы границ оцепления (блокирования), а также въезд или выезд транспортного средства до снятия оцепления (блокирования).

4. Блокированная (оцепленная) сотрудниками федеральной службы безопасности территория (помещение, здание, иной объект) на время её блокирования (оцепления) является охраняемой, проникновение на которую влечет за собой уголовную ответственность предусмотренную статьей 39 Уголовного кодекса.

Статья 12. Проникновение в жилые и иные помещения, на земельные участки и территории
1. Федеральная служба безопасности защищает право каждого на неприкосновенность жилища.

2. Проникновение сотрудников полиции в жилые помещения, в иные помещения и на земельные участки, принадлежащие гражданам, в помещения, на земельные участки и территории, занимаемые организациями, допускается в случаях, предусмотренных законодательством (( Правилами проекта ))

3. Проникновение ФСБ в жилые или иные помещения, на земельные участки, принадлежащие гражданам, учреждениям или организациям разрешено:

1) для спасения жизни граждан или их имущества, обеспечения безопасности граждан или общественной безопасности при массовых беспорядках и чрезвычайных ситуациях;
2) для задержания лиц, подозреваемых или обвиняемых в совершении преступления;
3) для пресечения преступления;
4) для установления обстоятельств несчастного случая;

4. Сотрудник ФСБ, осуществляющий вхождение (проникновение) в жилое помещение, обязан:

1) перед тем как войти в жилое помещение, уведомить находящихся там граждан об основаниях вхождения, за исключением случаев, если промедление создает непосредственную угрозу жизни и здоровью граждан и сотрудников полиции или может повлечь иные тяжкие последствия;

2) не разглашать ставшие известными ему в связи с вхождением (проникновением) в жилое помещение факты частной жизни находящихся там граждан

3) использовать безопасные способы и средства не допускать без необходимости причинения ущерба их имуществу, за исключением случаев, совершенных при крайней необходимости;

Статья 13. Применение огнестрельного оружия
Военнослужащие органов федеральной службы безопасности имеют право лично или в составе подразделения (группы) применять оружие в следующих случаях:

1. На территории населенных пунктов:

1) для защиты другого лица либо себя от посягательства, если это посягательство сопряжено открытием огня из оружия;

2) для пресечения нарушений дорожного движения, связанных с намеренным наездом и тараном других участников дорожного движения, представляющих угрозу жизни и здоровью окружающих;

3) для защиты личного имущества граждан и пресечения попытки ограбления жилого имущества или угона транспортного средства;

4) для задержания лица, пытающегося скрыться в воде, если иными средствами задержать это лицо не представляется возможным;
2. За пределами населенных пунктов:

1) для защиты другого лица либо себя от посягательства, если это посягательство сопряжено с насилием, опасным для жизни или здоровья;

2) для пресечения попытки завладения специальным грузом, сопровождаемым в составе военизированной колонны;
3) для освобождения заложников, пресечения террористических и иных преступных посягательств;
4) для задержания лица, пытающегося скрыться в воде, если иными средствами задержать это лицо не представляется возможным;

5) для задержания лица, оказывающего вооруженное сопротивление;

6) для отражения группового или вооруженного нападения на здания, помещения, сооружения и иные объекты государственных органов;

7) для остановки транспортного средства путем его повреждения, посредством выстрела в колесо, если управляющее им лицо отказывается выполнить неоднократные требования об остановке и пытается скрыться;

8) для защиты личного имущества граждан и пресечения попытки ограбления жилого имущества или угона транспортного средства;

3. Запрещается применять огнестрельное оружие при значительном скоплении граждан, если в результате его применения могут пострадать случайные лица

4. Во всех случаях, описанных в частях 1 и 2 настоящей статьи, за исключением случая, предусмотренного п. 7 ч. 2, военнослужащий органов федеральной службы вправе применить огнестрельное оружие без предупреждения

Статья 14. Применение специальных средств
1. Военнослужащие органов федеральной службы безопасности имеют право лично или в составе подразделения (группы) применять специальные средства в следующих случаях:

1) для отражения нападения на граждан, сотрудников органов федеральной службы безопасности, объекты, специальные грузы и транспортные средства органов федеральной службы безопасности;

2) для пресечения преступления или административного правонарушения;

3) для пресечения сопротивления, оказываемого военнослужащему органов федеральной службы безопасности;

4) для задержания лица, застигнутого при совершении преступления и пытающегося скрыться;

5) для задержания лица, если это лицо может оказать вооруженное сопротивление или воспрепятствовать исполнению военнослужащим органов федеральной службы безопасности возложенных на него служебных обязанностей;

6) для доставления в служебные помещения органов федеральной службы безопасности, других государственных органов лиц, совершивших преступления или административные правонарушения, для конвоирования и охраны задержанных лиц, а также для пресечения попытки побега, в случае оказания лицом сопротивления военнослужащему органов федеральной службы безопасности, причинения вреда окружающим или себе;

7) для освобождения насильственно удерживаемых лиц, захваченных зданий, помещений, сооружений, транспортных средств, земельных участков;

8) для пресечения массовых беспорядков и блокирования движения групп лиц, совершающих противоправные действия;

2. Военнослужащие федеральной службы безопасности вправе не предупреждать о намерении применить специальные средства

Глава 4. Правовое положение военнослужащего ФСБ​

Статья 15. Правовая защита сотрудников органов федеральной службы безопасности
1. Военнослужащие органов федеральной службы безопасности при исполнении служебных обязанностей являются представителями государственной власти и находятся под защитой государства. Никто, кроме государственных органов и должностных лиц, уполномоченных на то федеральными законами, не вправе вмешиваться в их служебную деятельность.

2. Воспрепятствование исполнению сотрудником органов федеральной службы безопасности служебных обязанностей, оскорбление, сопротивление, насилие или угроза применения насилия по отношению к нему в связи с исполнением указанным сотрудником служебных обязанностей влекут за собой ответственность, предусмотренную законодательством.

3. При исполнении военнослужащим органов федеральной службы безопасности служебных обязанностей не допускаются его привод, задержание, личный досмотр и досмотр его вещей, а также досмотр личного и используемого им транспорта без официального представителя органов федеральной службы безопасности

4. Сведения о сотрудниках органов федеральной службы безопасности, выполнявших (выполняющих) специальные задания составляют государственную тайну и могут быть преданы гласности только с письменного согласия указанных сотрудников

Статья 16. Служебное удостоверение сотрудников органов федеральной службы безопасности
1. Служебное удостоверение сотрудника органов федеральной службы безопасности является документом, подтверждающим личность, должность, права и полномочия, предоставленные сотруднику органов федеральной службы безопасности настоящим Федеральным законом, а также право на хранение и ношение табельного оружия и специальных средств

2. При исполнении сотрудниками органов федеральной службы безопасности служебных обязанностей им могут выдаваться нагрудные знаки (жетоны), позволяющие идентифицировать их личность. При требовании гражданина предъявить удостоверение военнослужащие органов федеральной службы безопасности вправе ссылаться на выданный ему опознавательный жетон

Примечание к п2. ст. 16
    
    (Жетоном сотрудника является его номер маски)

3. Исполнение сотрудником ФСБ своих служебных и должностных обязанностей, подтверждается наличием при нем служебного удостоверения.

Статья 17. Гарантии правовой защиты сотрудника органов федеральной службы безопасности
1. Сотрудник ФСБ, выполняя обязанности, возложенные на ФСБ, и реализуя права, предоставленные ФСБ, выступает в качестве представителя государственной власти и находится под защитой государства.

2. Никто не имеет права вмешиваться в законную деятельность сотрудника ФСБ, кроме лиц, прямо уполномоченных на то. Никто не имеет права принуждать сотрудника ФСБ к выполнению обязанностей, которые законодательством на ФСБ не возложены.

3. Законные требования сотрудника ФСБ обязательны для выполнения гражданами и должностными лицами

4. Воспрепятствование выполнению сотрудником ФСБ служебных обязанностей, оскорбление сотрудника ФСБ, оказание ему сопротивления, насилие или угроза применения насилия по отношению к сотруднику ФСБ в связи с выполнением им служебных обязанностей либо невыполнение законных требований сотрудника ФСБ влечет ответственность
`},{slug:"upk",abbr:"УПК",title:"Уголовно-процессуальный кодекс",notes:"Задержание, обыск, ордера, допросы.",updated:"2025-02-23",content:`# Уголовно-процессуальный кодекс

Глава 1. УГОЛОВНО-ПРОЦЕССУАЛЬНОЕ ЗАКОНОДАТЕЛЬСТВО​

Статья 1. Законы, определяющие порядок уголовного судопроизводства
1. Порядок уголовного судопроизводства на территории Нижегородской области устанавливается настоящим Кодексом.

2. Порядок уголовного судопроизводства, установленный настоящим Кодексом, является обязательным для судов, органов предварительного следствия, а также иных участников уголовного судопроизводства.

3. Общепризнанные принципы являются составной частью законодательства, регулирующего уголовное судопроизводство.


Статья 2. Действие уголовно-процессуального закона в пространстве
1. Производство по уголовному делу на территории Нижегородской области независимо от места совершения преступления ведется в соответствии с настоящим Кодексом, если международным договором не установлено иное.

2. Нормы настоящего Кодекса применяются также при производстве по уголовному делу о преступлении, совершённом на воздушном, морском или речном судне, находящемся за пределами территории Нижегородской области, если указанное судно зарегистрировано или приписано к порту Нижегородской области.


Статья 3. Действие уголовно-процессуального закона во времени
1. При производстве по уголовному делу применяется уголовно-процессуальный закон, действующий во время производства соответствующего процессуального действия или принятия процессуального решения, если иное не установлено настоящим Кодексом.


Статья 4. Основные понятия, используемые в настоящем Кодексе
Если не оговорено иное, основные понятия, используемые в настоящем Кодексе, имеют следующие значения:

⠀⠀⠀⠀1) алиби - нахождение подозреваемого или обвиняемого в момент совершения преступления в другом месте;
⠀⠀⠀⠀2) апелляционная инстанция - суд, рассматривающий в апелляционном порядке уголовные дела по жалобам и представлениям на не вступившие в законную силу приговоры, определения и постановления суда;
⠀⠀⠀⠀3) близкие лица - иные, за исключением близких родственников и родственников, лица, состоящие в свойстве с потерпевшим, свидетелем, а также лица, жизнь, здоровье и благополучие которых дороги потерпевшему, свидетелю в силу сложившихся личных отношений;
⠀⠀⠀⠀4) близкие родственники - супруг, супруга, родители, дети, усыновители, усыновленные, родные братья и родные сестры, дедушка, бабушка, внуки;
⠀⠀⠀⠀5) вердикт - решение о виновности или невиновности подсудимого, вынесенное коллегией присяжных заседателей;
⠀⠀⠀⠀6) государственный обвинитель - поддерживающее от имени государства обвинение в суде по уголовному делу руководитель следственного органа или иное должностное лицо, назначенное руководителем следственного органа;
⠀⠀⠀⠀7) досудебное производство - уголовное судопроизводство с момента получения сообщения о преступлении до направления руководителем следственного органа уголовного дела в суд для рассмотрения его по существу;
⠀⠀⠀⠀8) жилище - индивидуальный жилой дом с входящими в него жилыми и нежилыми помещениями, жилое помещение независимо от формы собственности, входящее в жилищный фонд и используемое для постоянного или временного проживания, а равно иное помещение или строение, не входящее в жилищный фонд, но используемое для временного проживания;
⠀⠀⠀⠀9) задержание подозреваемого - мера процессуального принуждения, применяемая следственным органом, следователем на срок не более 4 часов с момента фактического задержания лица по подозрению в совершении преступления;
⠀⠀⠀⠀10) кассационная инстанция - суд, рассматривающий в кассационном порядке уголовные дела по жалобам и представлениям на вступившие в законную силу приговоры, определения и постановления судов;
⠀⠀⠀⠀11) момент фактического задержания - момент производимого в порядке, установленном настоящим Кодексом, фактического лишения свободы передвижения лица, подозреваемого в совершении преступления;
⠀⠀⠀⠀12) избрание меры пресечения - принятие следователем, а также судом решения о мере пресечения в отношении подозреваемого, обвиняемого;
⠀⠀⠀⠀13) неотложные следственные действия - действия, осуществляемые следственным органом после возбуждения уголовного дела, по которому производство предварительного следствия обязательно, в целях обнаружения и фиксации следов преступления, а также доказательств, требующих незамедлительного закрепления, изъятия и исследования;
⠀⠀⠀⠀14) непричастность - неустановленная причастность либо установленная непричастность лица к совершению преступления;
⠀⠀⠀⠀15) ночное время - промежуток времени с 22 до 6 часов по местному времени;
⠀⠀⠀⠀16) обвинение - утверждение о совершении определенным лицом деяния, запрещенного уголовным законом, выдвинутое в порядке, установленном настоящим Кодексом;
⠀⠀⠀⠀17) определение - любое решение, вынесенное коллегиально судами первой и апелляционной инстанций, за исключением приговора;
⠀⠀⠀⠀18) постановление - любое решение, за исключением приговора, вынесенное судьей единолично; решение руководителя следственного органа, следователя, вынесенное в ходе досудебного производства, за исключением обвинительного заключения, обвинительного акта или обвинительного постановления;
⠀⠀⠀⠀19) председательствующий - судья, который руководит судебным заседанием при коллегиальном рассмотрении уголовного дела, а также судья, рассматривающий уголовное дело единолично;
⠀⠀⠀⠀20) приговор - решение о невиновности или виновности подсудимого и назначении ему наказания либо об освобождении его от наказания, вынесенное судом первой или апелляционной инстанции;
⠀⠀⠀⠀21) применение меры пресечения - процессуальные действия, осуществляемые с момента принятия решения об избрании меры пресечения до ее отмены или изменения;
⠀⠀⠀⠀22) процессуальное действие - следственное, судебное или иное действие, предусмотренное настоящим Кодексом;
⠀⠀⠀⠀23) процессуальное решение - решение, принимаемое судом, следователем в порядке установленном настоящим Кодексом;
⠀⠀⠀⠀24) реабилитация - порядок восстановления прав и свобод лица, незаконно или необоснованно подвергнутого уголовному преследованию, и возмещения причиненного ему вреда;
⠀⠀⠀⠀25) реабилитированный - лицо, имеющее в соответствии с настоящим Кодексом право на возмещение вреда, причиненного ему в связи с незаконным или необоснованным уголовным преследованием;
⠀⠀⠀⠀26) реплика - замечание участника прений сторон относительно сказанного в речах других участников;
⠀⠀⠀⠀27) результаты оперативно-розыскной деятельности - сведения, полученные в соответствии с федеральным законом об оперативно-розыскной деятельности, о признаках подготавливаемого, совершаемого или совершенного преступления, лицах, подготавливающих, совершающих или совершивших преступление и скрывшихся следствия или суда;
⠀⠀⠀⠀28) родственники - все иные лица, за исключением близких родственников, состоящие в родстве;
⠀⠀⠀⠀29) розыскные меры - меры принимаемые следователем в отношении подозреваемого в совершении преступления;
⠀⠀⠀⠀30) руководитель следственного органа - должностное лицо, возглавляющее соответствующее следственное подразделение, а также его заместитель;
⠀⠀⠀⠀31) следователь - должностное лицо, уполномоченное осуществлять предварительное следствие по уголовному делу, а также иные полномочия, предусмотренные настоящим Кодексом;
⠀⠀⠀⠀32) согласие - разрешение руководителя следственного органа на производство следователем соответствующих следственных и иных процессуальных действий и на принятие ими процессуальных решений;
⠀⠀⠀⠀33) содержание под стражей - пребывание лица, задержанного по подозрению в совершении преступления, либо обвиняемого, к которому применена мера пресечения в виде заключения под стражу,
⠀⠀⠀⠀34) сообщение о преступлении - заявление о преступлении, явка с повинной, рапорт об обнаружении преступления;
⠀⠀⠀⠀35) стороны - участники уголовного судопроизводства, выполняющие на основе состязательности функцию обвинения (уголовного преследования) или защиты от обвинения;
⠀⠀⠀⠀36) сторона защиты - обвиняемый, а также его законный представитель, защитник, гражданский ответчик, его законный представитель и представитель;
⠀⠀⠀⠀37) сторона обвинения - руководитель следственного органа, а также следователь, частный обвинитель, потерпевший, его законный представитель и представитель, гражданский истец и его представитель;
⠀⠀⠀⠀38) суд - любой суд общей юрисдикции, рассматривающий уголовное дело по существу и выносящий решения, предусмотренные настоящим Кодексом;
⠀⠀⠀⠀39) судебная экспертиза - экспертиза, производимая в порядке, установленном настоящим Кодексом;
⠀⠀⠀⠀40) судебное заседание - процессуальная форма осуществления правосудия в ходе досудебного и судебного производства по уголовному делу;
⠀⠀⠀⠀41) судебное разбирательство - судебное заседание судов первой, второй, кассационной
⠀⠀⠀⠀42) суд первой инстанции - суд, рассматривающий уголовное дело по существу и правомочный выносить приговор, а также принимать решения в ходе досудебного производства по уголовному делу;
⠀⠀⠀⠀43) суд второй инстанции - суд апелляционной инстанции;
⠀⠀⠀⠀44) судья - должностное лицо, уполномоченное осуществлять правосудие.
⠀⠀⠀⠀45) частный обвинитель - потерпевший или его законный представитель и представитель по уголовным делам частного обвинения;
⠀⠀⠀⠀46) экспертное учреждение - государственное судебно-экспертное или иное учреждение, которому поручено производство судебной экспертизы в порядке, установленном настоящим Кодексом;
⠀⠀⠀⠀47) досудебное соглашение о сотрудничестве - соглашение между сторонами обвинения и защиты, в котором указанные стороны согласовывают условия ответственности подозреваемого или обвиняемого в зависимости от его действий после возбуждения уголовного дела или предъявления обвинения;

Глава 2. ПРИНЦИПЫ УГОЛОВНОГО СУДОПРОИЗВОДСТВА​

Статья 5. Назначение уголовного судопроизводства
1. Уголовное судопроизводство имеет своим назначением:

⠀⠀⠀⠀1) защиту прав и законных интересов лиц и организаций, потерпевших от преступлений;
⠀⠀⠀⠀2) защиту личности от незаконного и необоснованного обвинения, осуждения, ограничения ее прав и свобод.

2. Уголовное преследование и назначение виновным справедливого наказания в той же мере отвечают назначению уголовного судопроизводства, что и отказ от уголовного преследования невиновных, освобождение их от наказания, реабилитация каждого, кто необоснованно подвергся уголовному преследованию.


Статья 6. Законность при производстве по уголовному делу
1. Суд, руководитель следственного органа, следователь, не вправе применять федеральный закон, противоречащий настоящему Кодексу.

2. Суд, установив в ходе производства по уголовному делу несоответствие федерального закона или иного нормативного правового акта настоящему Кодексу, принимает решение в соответствии с настоящим Кодексом.

3. Нарушение норм настоящего Кодекса судом, руководителем следственного органа, следователем в ходе уголовного судопроизводства влечет за собой признание недопустимыми полученных таким путем доказательств.

4. Определения суда, постановления судьи, руководителя следственного органа, следователя должны быть законными, обоснованными и мотивированными.
Статья 7. Осуществление правосудия только судом
1. Правосудие по уголовному делу в Нижегородской области осуществляется только судом.

2. Никто не может быть признан виновным в совершении преступления и подвергнут уголовному наказанию иначе как по приговору суда и в порядке, установленном настоящим Кодексом.


Статья 8. Независимость судей
1. При осуществлении правосудия по уголовным делам судьи независимы и подчиняются только федеральному закону.

2. Судьи рассматривают и разрешают уголовные дела в условиях, исключающих постороннее воздействие на них. Вмешательство государственных органов, органов местного самоуправления, иных органов, организаций, должностных лиц или граждан в деятельность судей по осуществлению правосудия запрещается и влечет за собой установленную законом ответственность.

3. Информация о вне процессуальных обращениях государственных органов, органов местного самоуправления, иных органов, организаций, должностных лиц или граждан, поступивших судьям по уголовным делам, находящимся в их производстве, либо председателю суда, его заместителю, председателю судебного состава или председателю судебной коллегии по уголовным делам, находящимся в производстве суда, подлежит преданию гласности и доведению до сведения участников судебного разбирательства


Статья 9. Уважение чести и достоинства личности
1. В ходе уголовного судопроизводства запрещаются осуществление действий и принятие решений, унижающих честь участника уголовного судопроизводства, а также обращение, унижающее его человеческое достоинство либо создающее опасность для его жизни и здоровья.

2. Никто из участников уголовного судопроизводства не может подвергаться насилию, пыткам, другому жестокому или унижающему человеческое достоинство обращению.


Статья 10. Охрана прав и свобод человека и гражданина в уголовном судопроизводстве
1. Суд, руководитель следственного органа, следователь обязаны разъяснять подозреваемому, обвиняемому, потерпевшему, а также другим участникам уголовного судопроизводства их права, обязанности и ответственность и обеспечивать возможность осуществления этих прав.

2. При наличии достаточных данных о том, что потерпевшему, свидетелю или иным участникам уголовного судопроизводства, а также их близким родственникам, родственникам или близким лицам угрожают убийством, применением насилия, уничтожением или повреждением их имущества либо иными опасными противоправными деяниями, суд, руководитель следственного органа, следователь принимают в пределах своей компетенции в отношении указанных лиц меры безопасности.

3. Вред, причиненный лицу в результате нарушения его прав и свобод судом, а также должностными лицами, осуществляющими уголовное преследование, подлежит возмещению по основаниям и в порядке, которые установлены настоящим Кодексом.


Статья 11. Презумпция невиновности
1. Обвиняемый считается невиновным, пока его виновность в совершении преступления не будет доказана в предусмотренном настоящим Кодексом порядке и установлена вступившим в законную силу приговором суда.

2. Подозреваемый или обвиняемый не обязан доказывать свою невиновность. Бремя доказывания обвинения и опровержения доводов, приводимых в защиту подозреваемого или обвиняемого, лежит на стороне обвинения.

3. Все сомнения в виновности обвиняемого, которые не могут быть устранены в порядке, установленном настоящим Кодексом, толкуются в пользу обвиняемого.

4. Обвинительный приговор не может быть основан на предположениях.

Статья 12. Состязательность сторон
1. Уголовное судопроизводство осуществляется на основе состязательности сторон.

2. Функции обвинения, защиты и разрешения уголовного дела отделены друг от друга и не могут быть возложены на один и тот же орган или одно и то же должностное лицо.

3. Суд не является органом уголовного преследования, не выступает на стороне обвинения или стороне защиты. Суд создает необходимые условия для исполнения сторонами их процессуальных обязанностей и осуществления предоставленных им прав.

4. Стороны обвинения и защиты равноправны перед судом.


Статья 13. Свобода оценки доказательств
1. Судья, а также следователь оценивают доказательства по своему внутреннему убеждению, основанному на совокупности имеющихся в уголовном деле доказательств, руководствуясь при этом законом и совестью.

2. Никакие доказательства не имеют заранее установленной силы.


Статья 14. Право на обжалование процессуальных действий и решений
1. Действия (бездействие) и решения суда, руководителя следственного органа, следователя могут быть обжалованы в порядке, установленном настоящим Кодексом.

2. Каждый осужденный имеет право на пересмотр приговора вышестоящим судом.

Глава 3. УГОЛОВНОЕ ПРЕСЛЕДОВАНИЕ​

Статья 15. Виды уголовного преследования
1. В зависимости от характера и тяжести совершенного преступления уголовное преследование, включая обвинение в суде, осуществляется в публичном, частно-публичном и частном порядке.

2. Уголовные дела о преступлениях, предусмотренных статьями 6 и 14 Уголовного кодекса, считаются уголовными делами частного обвинения, возбуждаются не иначе как по заявлению потерпевшего, за исключением случаев, предусмотренных частью четвертой настоящей статьи, и подлежат прекращению в связи с примирением потерпевшего с обвиняемым. Примирение допускается до удаления суда в совещательную комнату для постановления приговора, а в суде апелляционной инстанции - до удаления суда апелляционной инстанции в совещательную комнату для вынесения решения по делу.

3. Уголовные дела частно-публичного обвинения возбуждаются не иначе как по заявлению потерпевшего, но прекращению в связи с примирением потерпевшего с обвиняемым не подлежат. К уголовным делам частно-публичного обвинения относятся уголовные дела о преступлениях, предусмотренных статьями 7, 15, 16, 18, 19, 20 и статьей 25 Уголовного кодекса.

4. Руководитель следственного органа, следователь, возбуждают уголовное дело о любом преступлении, указанном в частях второй и третьей настоящей статьи, и при отсутствии заявления потерпевшего или его законного представителя, если данное преступление совершено в отношении лица, которое в силу зависимого или беспомощного состояния либо по иным причинам не может защищать свои права и законные интересы. К иным причинам относится также случай совершения преступления лицом, данные о котором не известны.

5. Уголовные дела, за исключением уголовных дел, указанных в частях второй и третьей настоящей статьи, считаются уголовными делами публичного обвинения.


Статья 16. Обязанность осуществления уголовного преследования
1. Уголовное преследование от имени государства по уголовным делам публичного и частно-публичного обвинения осуществляют руководитель следственного органа, а также следователь.


2. В каждом случае обнаружения признаков преступления руководитель следственного органа, следователь, принимают предусмотренные настоящим Кодексом меры по установлению события преступления, изобличению лица или лиц, виновных в совершении преступления.

3. Руководитель следственного органа, следователь в случаях, предусмотренных частью четвертой статьи 15 настоящего Кодекса, уполномочены осуществлять уголовное преследование по уголовным делам независимо от волеизъявления потерпевшего.

4. Требования, поручения и запросы руководителя следственного органа, следователя, предъявленные в пределах их полномочий, установленных настоящим Кодексом, обязательны для исполнения всеми учреждениями, предприятиями, организациями, должностными лицами и гражданами.

5. Следователь вправе после возбуждения уголовного дела заключить с подозреваемым или обвиняемым досудебное соглашение о сотрудничестве.

Глава 4. ОСНОВАНИЯ ОТКАЗА В ВОЗБУЖДЕНИИ УГОЛОВНОГО ДЕЛА, ПРЕКРАЩЕНИЯ УГОЛОВНОГО ДЕЛА И УГОЛОВНОГО ПРЕСЛЕДОВАНИЯ​

Статья 17. Основания отказа в возбуждении уголовного дела или прекращения уголовного дела
1. Уголовное дело не может быть возбуждено, а возбужденное уголовное дело подлежит прекращению по следующим основаниям:

⠀⠀⠀⠀1) отсутствие события преступления;
⠀⠀⠀⠀2) отсутствие в деянии состава преступления;
⠀⠀⠀⠀3) истечение сроков давности уголовного преследования;
⠀⠀⠀⠀4) смерть подозреваемого или обвиняемого;
⠀⠀⠀⠀5) отсутствие заявления потерпевшего, если уголовное дело может быть возбуждено не иначе как по его заявлению;

2. Уголовное дело подлежит прекращению по основанию, предусмотренному пунктом 2 части первой настоящей статьи, в случае, когда до вступления приговора в законную силу преступность и наказуемость этого деяния были устранены новым уголовным законом.

3. Прекращение уголовного дела влечет за собой одновременно прекращение уголовного преследования.


Статья 18. Прекращение уголовного дела в связи с примирением сторон
1. Суд, а также следователь с согласия руководителя следственного органа вправе на основании заявления потерпевшего прекратить уголовное дело в отношении лица, подозреваемого или обвиняемого в совершении преступления небольшой или средней тяжести, в случаях, если это лицо примирилось с потерпевшим и загладило причиненный ему вред.


Статья 19. Основания прекращения уголовного преследования
1. Уголовное преследование в отношении подозреваемого или обвиняемого прекращается по следующим основаниям:

⠀⠀⠀⠀1) непричастность подозреваемого или обвиняемого к совершению преступления;
⠀⠀⠀⠀2) прекращение уголовного дела по основаниям, предусмотренным пунктами 1 - 5 части первой статьи 17 настоящего Кодекса;
⠀⠀⠀⠀3) вследствие акта об амнистии;
⠀⠀⠀⠀4) наличие в отношении подозреваемого или обвиняемого вступившего в законную силу приговора по тому же обвинению либо определения суда или постановления судьи о прекращении уголовного дела по тому же обвинению;
⠀⠀⠀⠀5) наличие в отношении подозреваемого или обвиняемого не отмененного постановления, следователя о прекращении уголовного дела по тому же обвинению либо об отказе в возбуждении уголовного дела;

Глава 5. СУД​

Статья 20. Полномочия суда
1. Только суд правомочен:

⠀⠀⠀⠀1) признать лицо виновным в совершении преступления и назначить ему наказание;
⠀⠀⠀⠀2) отменить или изменить решение, принятое судом.

2. Только суд, в том числе в ходе досудебного производства, правомочен принимать решения:

⠀⠀⠀⠀1) об избрании меры пресечения в виде заключения под стражу, запрета определенных действий;
⠀⠀⠀⠀2) о продлении срока содержания под стражей, срока домашнего ареста, срока запрета определенных действий;
⠀⠀⠀⠀3) о возмещении имущественного вреда;
⠀⠀⠀⠀4) о производстве осмотра жилища при отсутствии согласия проживающих в нем лиц;
⠀⠀⠀⠀5) о производстве обыска и (или) выемки в жилище;
⠀⠀⠀⠀5.1) о производстве обыска, осмотра и выемки в отношении адвоката;
⠀⠀⠀⠀6) о производстве личного обыска, за исключением случаев, предусмотренных настоящим Кодексом;
⠀⠀⠀⠀7) о производстве выемки предметов и документов, содержащих государственную или иную охраняемую федеральным законом тайну, а также предметов и документов, содержащих информацию о вкладах и счетах граждан в банках и иных кредитных организациях;
⠀⠀⠀⠀8) о временном отстранении подозреваемого или обвиняемого от должности в соответствии с настоящим Кодексом;
⠀⠀⠀⠀9) о контроле и записи телефонных и иных переговоров;
⠀⠀⠀⠀10) о разрешении отмены постановления о прекращении уголовного дела или уголовного преследования в случае, предусмотренном настоящим Кодексом.

3. Суд правомочен в ходе досудебного производства рассматривать жалобы на действия (бездействие) и решения руководителя следственного органа, следователя в случаях и порядке, которые предусмотрены настоящим Кодексом.

Статья 21. Подсудность уголовных дел
1. Мировому судье подсудны уголовные дела о преступлениях, за совершение которых максимальное наказание не превышает трех лет лишения свободы, за исключением уголовных дел о преступлениях, предусмотренных статьями 2, 3, 17, 30, 32, 36, 40, 45, 43, 53, 57, 62.1, 60, 61, и статьей 62 и 63 Уголовного кодекса.

2. Верховному суду республики, краевому или областному суду, суду города федерального значения, суду автономной области, суду автономного округа, окружному (флотскому) военному суду подсудны уголовные дела о всех преступлениях, за исключением уголовных дел, указанных в частях первой (в части подсудности уголовных дел мировому судье).

3. Гарнизонный военный суд рассматривает уголовные дела о всех преступлениях, совершенных военнослужащими и гражданами, проходящими военные сборы, за исключением уголовных дел, подсудных вышестоящим военным судам.

3.1 Если дела о преступлениях, совершенных группой лиц, группой лиц по предварительному сговору, организованной группой или преступным сообществом, подсудны военному суду в отношении хотя бы одного из соучастников, а выделение уголовного дела в отношении остальных лиц невозможно, указанные дела в отношении всех лиц рассматриваются соответствующим военным судом.

4. В случае отсутствия на территории субъекта нижестоящего суда, подсудность которого определена настоящей статьей, допускается его рассмотрение любым вышестоящим судом общей юрисдикции.

Статья 22. Передача уголовного дела по подсудности
1. Судья, установив при разрешении вопроса о назначении судебного заседания, что поступившее уголовное дело неподсудно данному суду, выносит постановление о направлении данного уголовного дела по подсудности.
2. Суд, установив, что находящееся в его производстве уголовное дело подсудно другому суду того же уровня, вправе с согласия подсудимого оставить данное уголовное дело в своем производстве, но только в случае, если он уже приступил к его рассмотрению в судебном заседании.
3. Если уголовное дело подсудно вышестоящему суду или военному суду, то оно во всех случаях подлежит передаче по подсудности.

Глава 6. УЧАСТНИКИ УГОЛОВНОГО СУДОПРОИЗВОДСТВА СО СТОРОНЫ ОБВИНЕНИЯ​

Статья 23. Следователь
1. Следователь является должностным лицом, назначенное на должность руководителем следственного органа, уполномоченным в пределах компетенции, предусмотренной настоящим Кодексом, осуществлять предварительное следствие по уголовному делу.

2. Следователь уполномочен:

⠀⠀⠀⠀1) возбуждать уголовное дело в порядке, установленном настоящим Кодексом;
⠀⠀⠀⠀2) принимать уголовное дело к своему производству или передавать его руководителю следственного органа для направления по подследственности;
⠀⠀⠀⠀3) самостоятельно направлять ход расследования, принимать решение о производстве следственных и иных процессуальных действий, за исключением случаев, когда в соответствии с настоящим Кодексом требуется получение судебного решения или согласия руководителя следственного органа;

4) осуществлять иные полномочия, предусмотренные настоящим Кодексом.

Статья 24. Руководитель следственного органа
1. Руководитель следственного органа уполномочен:

⠀⠀⠀⠀1) поручать производство предварительного следствия следователю либо нескольким следователям, а также изымать уголовное дело у следователя и передавать его другому следователю с обязательным указанием оснований такой передачи, создавать следственную группу, изменять ее состав либо принимать уголовное дело к своему производству;
⠀⠀⠀⠀2) проверять материалы проверки сообщения о преступлении или материалы уголовного дела, отменять незаконные или необоснованные постановления следователя;
⠀⠀⠀⠀3) давать следователю указания о направлении расследования, производстве отдельных следственных действий, привлечении лица в качестве обвиняемого, об избрании в отношении подозреваемого, обвиняемого меры пресечения, о квалификации преступления и об объеме обвинения, лично рассматривать сообщения о преступлении, участвовать в проверке сообщения о преступлении;
⠀⠀⠀⠀4) давать согласие следователю на возбуждение перед судом ходатайства об избрании, о продлении, об отмене или изменении меры пресечения либо о производстве иного процессуального действия, которое допускается на основании судебного решения, лично допрашивать подозреваемого, обвиняемого без принятия уголовного дела к своему производству при рассмотрении вопроса о даче согласия следователю на возбуждение перед судом указанного ходатайства;
⠀⠀⠀⠀5) разрешать отводы, заявленные следователю, а также его самоотводы;
⠀⠀⠀⠀6) отстранять следователя от дальнейшего производства расследования, если им допущено нарушение требований настоящего Кодекса;
⠀⠀⠀⠀7) отменять незаконные или необоснованные постановления нижестоящего руководителя следственного органа в порядке, установленном настоящим Кодексом;
⠀⠀⠀⠀8) продлевать срок предварительного расследования;
⠀⠀⠀⠀9) утверждать постановление следователя о прекращении производства по уголовному делу, а также об осуществлении государственной защиты;
⠀⠀⠀⠀10) возвращать уголовное дело следователю со своими указаниями о производстве дополнительного расследования;
⠀⠀⠀⠀11) осуществлять иные полномочия, предусмотренные настоящим Кодексом.

2. Руководитель следственного органа вправе возбудить уголовное дело в порядке, установленном настоящим Кодексом, принять уголовное дело к своему производству и произвести предварительное следствие в полном объеме, обладая при этом полномочиями следователя или руководителя следственной группы, предусмотренными настоящим Кодексом.

3. Указания руководителя следственного органа по уголовному делу даются в письменном виде и обязательны для исполнения следователем. Указания руководителя следственного органа могут быть обжалованы им руководителю вышестоящего следственного органа.

4. Полномочия руководителя следственного органа, предусмотренные настоящей статьей, осуществляют руководители следственных органов соответствующих федеральных органов исполнительной власти (при соответствующих федеральных органах исполнительной власти), их территориальных органов по субъектам Нижегородской области, по районам, городам, их заместители.

Статья 26. Потерпевший
1. Потерпевшим является физическое лицо, которому преступлением причинен физический, имущественный, моральный вред, а также юридическое лицо в случае причинения преступлением вреда его имуществу и деловой репутации. Решение о признании потерпевшим принимается незамедлительно с момента возбуждения уголовного дела и оформляется постановлением следователя, судьи или определением суда. Если на момент возбуждения уголовного дела отсутствуют сведения о лице, которому преступлением причинен вред, решение о признании потерпевшим принимается незамедлительно после получения данных об этом лице.

2. Потерпевший вправе:

⠀⠀⠀⠀1) знать о предъявленном обвиняемому обвинении;
⠀⠀⠀⠀2) давать показания;
⠀⠀⠀⠀3) отказаться свидетельствовать против самого себя, своего супруга (своей супруги) и других близких родственников, круг которых определен пунктом 4 статьи 5 настоящего Кодекса. При согласии потерпевшего дать показания он должен быть предупрежден о том, что его показания могут быть использованы в качестве доказательств по уголовному делу, в том числе и в случае его последующего отказа от этих показаний;
⠀⠀⠀⠀4) представлять доказательства;
⠀⠀⠀⠀5) заявлять ходатайства и отводы;
⠀⠀⠀⠀6) давать показания на родном языке или языке, которым он владеет;
⠀⠀⠀⠀7) пользоваться помощью переводчика бесплатно;
⠀⠀⠀⠀8) иметь представителя;
⠀⠀⠀⠀9) участвовать с разрешения следователя в следственных действиях, производимых по его ходатайству либо ходатайству его представителя;
⠀⠀⠀⠀10) знакомиться с протоколами следственных действий, произведенных с его участием, и подавать на них замечания;
⠀⠀⠀⠀11) знакомиться по окончании предварительного расследования, в том числе в случае прекращения уголовного дела, со всеми материалами уголовного дела, выписывать из уголовного дела любые сведения и в любом объеме, снимать копии с материалов уголовного дела, в том числе с помощью технических средств. В случае, если в уголовном деле участвует несколько потерпевших, каждый из них вправе знакомиться с теми материалами уголовного дела, которые касаются вреда, причиненного данному потерпевшему;
⠀⠀⠀⠀12) выступать в судебных прениях;
⠀⠀⠀⠀13) поддерживать обвинение;
⠀⠀⠀⠀14) знакомиться с протоколом и аудиозаписью судебного заседания и подавать замечания на них;
⠀⠀⠀⠀15) приносить жалобы на действия (бездействие) и решения следователя, руководителя следственного органа и суда;
⠀⠀⠀⠀16) обжаловать приговор, определение, постановление суда;
⠀⠀⠀⠀17) знать о принесенных по уголовному делу жалобах и представлениях и подавать на них возражения;
⠀⠀⠀⠀18) ходатайствовать о применении мер безопасности;
⠀⠀⠀⠀19) осуществлять иные полномочия, предусмотренные настоящим Кодексом.

3. Потерпевшему обеспечивается возмещение имущественного вреда, причиненного преступлением, а также расходов, понесенных в связи с его участием в ходе предварительного расследования и в суде, включая расходы на представителя.

4. Потерпевший не вправе:
⠀⠀⠀⠀1) уклоняться от явки по вызову следователя и в суд;
⠀⠀⠀⠀2) давать заведомо ложные показания или отказываться от дачи показаний;
⠀⠀⠀⠀3) разглашать данные предварительного расследования, если он был об этом заранее предупрежден;
⠀⠀⠀⠀4) уклоняться от прохождения освидетельствования, от производства в отношении его судебной экспертизы в случаях, когда не требуется его согласие, или от предоставления образцов почерка и иных образцов для сравнительного исследования.

5. При неявке потерпевшего по вызову без уважительных причин он может быть подвергнут приводу.

6. В случае признания потерпевшим юридического лица его права осуществляет представитель.

7. Участие в уголовном деле законного представителя и представителя потерпевшего не лишает его прав, предусмотренных настоящей статьей.
Статья 27. Частный обвинитель
1. Частным обвинителем является лицо, подавшее заявление в суд по уголовному делу частного обвинения и поддерживающее обвинение в суде.

Глава 7. УЧАСТНИКИ УГОЛОВНОГО СУДОПРОИЗВОДСТВА СО СТОРОНЫ ЗАЩИТЫ​

Статья 28. Подозреваемый
1. Подозреваемым является лицо:

⠀⠀⠀⠀1) либо в отношении которого возбуждено уголовное дело по основаниям и в порядке, которые установлены настоящим Кодексом;
⠀⠀⠀⠀2) либо которое задержано;
⠀⠀⠀⠀3) либо которое уведомлено о подозрении в совершении преступления в порядке, установленном настоящим Кодексом.

2. Подозреваемому предоставляется право на один телефонный разговор на русском языке в присутствии следователя в целях уведомления близких родственников, родственников или близких лиц о своем задержании и месте нахождения, следователь должен исполнить обязанности по уведомлению о задержании в соответствии с настоящим Кодексом.

3. Подозреваемый вправе:

⠀⠀⠀⠀1) знать, в чем он подозревается, и получить копию постановления о возбуждении уголовного дела, либо копию протокола задержания;
⠀⠀⠀⠀2) давать объяснения и показания по поводу имеющегося в отношении его подозрения либо отказаться от дачи объяснений и показаний. При согласии подозреваемого дать показания он должен быть предупрежден о том, что его показания могут быть использованы в качестве доказательств по уголовному делу, в том числе и при его последующем отказе от этих показаний, за исключением случая, предусмотренного пунктом 1 части второй статьи 75 настоящего Кодекса;
⠀⠀⠀⠀3) пользоваться помощью защитника с момента, предусмотренного настоящим Кодексом, и иметь свидание с ним наедине и конфиденциально до первого допроса подозреваемого;
⠀⠀⠀⠀4) представлять доказательства;
⠀⠀⠀⠀5) заявлять ходатайства и отводы;
⠀⠀⠀⠀6) давать показания и объяснения на родном языке или языке, которым он владеет;
⠀⠀⠀⠀7) пользоваться помощью переводчика бесплатно;
⠀⠀⠀⠀8) знакомиться с протоколами следственных действий, произведенных с его участием, и подавать на них замечания;
⠀⠀⠀⠀9) участвовать с разрешения следователя в следственных действиях, производимых по его ходатайству, ходатайству его защитника либо законного представителя;
⠀⠀⠀⠀10) приносить жалобы на действия (бездействие) и решения следователя и суда;
⠀⠀⠀⠀11) защищаться иными средствами и способами, не запрещенными настоящим Кодексом.


Статья 29. Обвиняемый
1. Обвиняемым признается лицо, в отношении которого:

⠀⠀⠀⠀1) вынесено постановление о привлечении его в качестве обвиняемого;
⠀⠀⠀⠀2) вынесен обвинительный акт;
⠀⠀⠀⠀3) составлено обвинительное постановление.

2. Обвиняемый, по уголовному делу которого назначено судебное разбирательство, именуется подсудимым. Обвиняемый, в отношении которого вынесен обвинительный приговор, именуется осужденным. Обвиняемый, в отношении которого вынесен оправдательный приговор, является оправданным.

3. Обвиняемый вправе защищать свои права и законные интересы и иметь достаточное время и возможность для подготовки к защите.

4. Обвиняемый вправе:

⠀⠀⠀⠀1) знать, в чем он обвиняется, и получить копию постановления о возбуждении уголовного дела, по которому он привлечен в качестве обвиняемого, если копию такого постановления он не получил в соответствии с пунктом 1 части третьей статьи 28 настоящего Кодекса;
⠀⠀⠀⠀2) получить копию постановления о привлечении его в качестве обвиняемого, копию постановления о применении к нему меры пресечения, копию обвинительного заключения, обвинительного акта или обвинительного постановления;
⠀⠀⠀⠀3) возражать против обвинения, давать показания по предъявленному ему обвинению либо отказаться от дачи показаний. При согласии обвиняемого дать показания он должен быть предупрежден о том, что его показания могут быть использованы в качестве доказательств по уголовному делу, в том числе и при его последующем отказе от этих показаний, за исключением случая, предусмотренного настоящим Кодексом;
⠀⠀⠀⠀4) представлять доказательства;
⠀⠀⠀⠀5) заявлять ходатайства и отводы;
⠀⠀⠀⠀6) давать показания и объясняться на родном языке или языке, которым он владеет;
⠀⠀⠀⠀7) пользоваться помощью переводчика бесплатно;
⠀⠀⠀⠀8) пользоваться помощью защитника, в том числе бесплатно в случаях, предусмотренных настоящим Кодексом;
⠀⠀⠀⠀9) иметь свидания с защитником наедине и конфиденциально, в том числе до первого допроса обвиняемого, без ограничения их числа и продолжительности;
⠀⠀⠀⠀10) участвовать с разрешения следователя в следственных действиях, производимых по его ходатайству или ходатайству его защитника либо законного представителя, знакомиться с протоколами этих действий и подавать на них замечания;
⠀⠀⠀⠀11) знакомиться с постановлением о назначении судебной экспертизы, ставить вопросы эксперту и знакомиться с заключением эксперта;
⠀⠀⠀⠀12) знакомиться по окончании предварительного расследования со всеми материалами уголовного дела и выписывать из уголовного дела любые сведения и в любом объеме;
⠀⠀⠀⠀13) снимать за свой счет копии с материалов уголовного дела, в том числе с помощью технических средств;
⠀⠀⠀⠀14) приносить жалобы на действия (бездействие) и решения следователя, руководителя следственного органа и суда и принимать участие в их рассмотрении судом;
⠀⠀⠀⠀15) знакомиться с протоколом и аудиозаписью судебного заседания и подавать замечания на них;
⠀⠀⠀⠀16) обжаловать приговор, определение, постановление суда и получать копии обжалуемых решений;
⠀⠀⠀⠀17) получать копии принесенных по уголовному делу жалоб и представлений и подавать возражения на эти жалобы и представления;
⠀⠀⠀⠀19) участвовать в рассмотрении вопросов, связанных с исполнением приговора;
⠀⠀⠀⠀20) защищаться иными средствами и способами, не запрещенными настоящим Кодексом.

5. При первом допросе обвиняемого следователь, разъясняет ему права, предусмотренные настоящей статьей. При последующих допросах обвиняемому повторно разъясняются его права, предусмотренные пунктами 3, 4, 7 настоящей статьи, если допрос проводится без участия защитника.

Статья 30. Защитник
1. Защитник - лицо, осуществляющее в установленном настоящим Кодексом порядке защиту прав и интересов подозреваемых и обвиняемых и оказывающее им юридическую помощь при производстве по уголовному делу.

2. В качестве защитников участвуют адвокаты. По определению или постановлению суда в качестве защитника могут быть допущены наряду с адвокатом один из близких родственников обвиняемого или иное лицо, о допуске которого ходатайствует обвиняемый.

3. Защитник участвует в уголовном деле:

⠀⠀⠀⠀1) с момента вынесения постановления о привлечении лица в качестве обвиняемого, за исключением случаев, предусмотренных пунктами 2 - 4 настоящей части;
⠀⠀⠀⠀2) с момента возбуждения уголовного дела в отношении конкретного лица;
⠀⠀⠀⠀3) с момента фактического задержания лица, подозреваемого в совершении преступления;
⠀⠀⠀⠀4) с момента начала осуществления иных мер процессуального принуждения или иных процессуальных действий, затрагивающих права и свободы лица, подозреваемого в совершении преступления;

4. Адвокат вступает в уголовное дело в качестве защитника по предъявлению согласия подозреваемого, обвиняемого, подсудимого.

4.1. В случае необходимости получения согласия подозреваемого, обвиняемого на участие адвоката в уголовном деле перед вступлением в уголовное дело адвокату предоставляется свидание с подозреваемым.

5. Одно и то же лицо не может быть защитником двух подозреваемых или обвиняемых, если интересы одного из них противоречат интересам другого.

6. Адвокат не вправе отказаться от принятой на себя защиты подозреваемого, обвиняемого.

Статья 31. Обязательное участие защитника
1. Участие защитника в уголовном судопроизводстве обязательно, если:

⠀⠀⠀⠀1) подозреваемый, обвиняемый не отказался от защитника в порядке, установленном статьей 32 настоящего Кодекса;
⠀⠀⠀⠀2) подозреваемый, обвиняемый является несовершеннолетним;
⠀⠀⠀⠀3) подозреваемый, обвиняемый в силу физических или психических недостатков не может самостоятельно осуществлять свое право на защиту;
⠀⠀⠀⠀4) подозреваемый, обвиняемый не владеет языком, на котором ведется производство по уголовному делу;
⠀⠀⠀⠀5) лицо обвиняется в совершении преступления, за которое может быть назначено наказание в виде лишения свободы на срок свыше двенадцати лет или пожизненное лишение свободы;

2. Если в случаях, предусмотренных частью первой настоящей статьи, защитник не приглашен самим подозреваемым, обвиняемым, его законным представителем, а также другими лицами по поручению или с согласия подозреваемого, обвиняемого, следователь или суд обеспечивает участие защитника в уголовном судопроизводстве.

Статья 32. Отказ от защитника
1. Подозреваемый, обвиняемый вправе в любой момент производства по уголовному делу отказаться от помощи защитника. Такой отказ допускается только по инициативе подозреваемого или обвиняемого. Отказ от защитника заявляется в письменном или устном виде, в случаи заявления отказа в устном виде у следователя по уголовному делу должно иметься подтверждение устного отказа. Если отказ от защитника заявляется во время производства следственного действия, то об этом делается отметка в протоколе данного следственного действия.

2. Отказ от защитника не лишает подозреваемого, обвиняемого права в дальнейшем ходатайствовать о допуске защитника к участию в производстве по уголовному делу. Допуск защитника не влечет за собой повторения процессуальных действий, которые к этому моменту уже были произведены.

Статья 33. Полномочия защитника
1. С момента вступления в уголовное дело защитник вправе:

⠀⠀⠀⠀1) иметь с подозреваемым, обвиняемым свидания в соответствии с настоящим Кодексом;
⠀⠀⠀⠀2) собирать и представлять доказательства, необходимые для оказания юридической помощи;
⠀⠀⠀⠀3) присутствовать при предъявлении обвинения;
⠀⠀⠀⠀4) участвовать в допросе подозреваемого, обвиняемого, а также в иных следственных действиях, производимых с участием подозреваемого, обвиняемого либо по его ходатайству или ходатайству самого защитника в порядке, установленном настоящим Кодексом;
⠀⠀⠀⠀5) знакомиться с протоколом задержания, постановлением о применении меры пресечения, протоколами следственных действий, произведенных с участием подозреваемого, обвиняемого, иными документами, которые предъявлялись либо должны были предъявляться подозреваемому, обвиняемому;
⠀⠀⠀⠀6) знакомиться по окончании предварительного расследования со всеми материалами уголовного дела, выписывать из уголовного дела любые сведения в любом объеме, снимать за свой счет копии с материалов уголовного дела, в том числе с помощью технических средств;
⠀⠀⠀⠀7) заявлять ходатайства и отводы;
⠀⠀⠀⠀8) участвовать в судебном разбирательстве уголовного дела в судах;
⠀⠀⠀⠀9) приносить жалобы на действия (бездействие) и решения следователя, суда и участвовать в их рассмотрении судом;
⠀⠀⠀⠀10) использовать иные не запрещенные настоящим Кодексом средства и способы защиты.

2. Защитник не вправе разглашать данные предварительного расследования, ставшие ему известными в связи с осуществлением защиты, если он был об этом заранее предупрежден в порядке, установленном настоящим Кодексом..


Глава 7. ИНЫЕ УЧАСТНИКИ УГОЛОВНОГО СУДОПРОИЗВОДСТВА​

Статья 34. Свидетель
1. Свидетелем является лицо, которому могут быть известны какие-либо обстоятельства, имеющие значение для расследования и разрешения уголовного дела, и которое вызвано для дачи показаний, за исключением случаев, предусмотренного частью второй настоящей статьи.

2. Не подлежат допросу в качестве свидетелей:

⠀⠀⠀⠀1) судья - об обстоятельствах уголовного дела, которые стали им известны в связи с участием в производстве по данному уголовному делу;
⠀⠀⠀⠀2) адвокат, защитник подозреваемого, обвиняемого - об обстоятельствах, ставших ему известными в связи с обращением к нему за юридической помощью или в связи с ее оказанием, за исключением случаев, если о допросе в качестве свидетеля ходатайствует адвокат, защитник подозреваемого, обвиняемого с согласия и в интересах подозреваемого, обвиняемого;
⠀⠀⠀⠀3) адвокат - об обстоятельствах, которые стали ему известны в связи с оказанием юридической помощи, за исключением случаев, если о допросе в качестве свидетеля ходатайствует адвокат с согласия лица, которому он оказывал юридическую помощь;
⠀⠀⠀⠀4) священнослужитель - об обстоятельствах, ставших ему известными из исповеди.

3. Свидетель вправе:

⠀⠀⠀⠀1) отказаться свидетельствовать против самого себя, своего супруга (своей супруги) и других близких родственников, круг которых определен настоящим Кодексом. При согласии свидетеля дать показания он должен быть предупрежден о том, что его показания могут быть использованы в качестве доказательств по уголовному делу, в том числе и в случае его последующего отказа от этих показаний;
⠀⠀⠀⠀2) давать показания на родном языке или языке, которым он владеет;
⠀⠀⠀⠀3) пользоваться помощью переводчика бесплатно;
⠀⠀⠀⠀4) заявлять отвод переводчику, участвующему в его допросе;
⠀⠀⠀⠀5) заявлять ходатайства и приносить жалобы на действия (бездействие) и решения следователя, руководителя следственного органа и суда;
⠀⠀⠀⠀6) являться на допрос с адвокатом в соответствии с настоящим Кодексом;

4. Свидетель не вправе:

⠀⠀⠀⠀1) уклоняться от явки по вызовам следователя или в суд;
⠀⠀⠀⠀2) давать заведомо ложные показания либо отказываться от дачи показаний;
⠀⠀⠀⠀3) разглашать данные предварительного расследования, ставшие ему известными в связи с участием в производстве по уголовному делу, если он был об этом заранее предупрежден в порядке, установленном настоящим Кодексом.

5. В случае уклонения от явки без уважительных причин свидетель может быть подвергнут приводу.

6. За дачу заведомо ложных показаний свидетель несет ответственность в соответствии со со статьей 61 Уголовного кодекса


Статья 35. Эксперт
1. Эксперт - лицо, обладающее специальными знаниями и назначенное в порядке, установленном настоящим Кодексом, для производства судебной экспертизы и дачи заключения.

2. Эксперт вправе:

⠀⠀⠀⠀1) знакомиться с материалами уголовного дела, относящимися к предмету судебной экспертизы;
⠀⠀⠀⠀2) ходатайствовать о предоставлении ему дополнительных материалов, необходимых для дачи заключения, либо привлечении к производству судебной экспертизы других экспертов;
⠀⠀⠀⠀3) участвовать с разрешения следователя и суда в процессуальных действиях и задавать вопросы, относящиеся к предмету судебной экспертизы;
⠀⠀⠀⠀4) давать заключение в пределах своей компетенции, в том числе по вопросам, хотя и не поставленным в постановлении о назначении судебной экспертизы, но имеющим отношение к предмету экспертного исследования;
⠀⠀⠀⠀5) приносить жалобы на действия (бездействие) и решения следователя и суда, ограничивающие его права;
⠀⠀⠀⠀6) отказаться от дачи заключения по вопросам, выходящим за пределы специальных знаний, а также в случаях, если представленные ему материалы недостаточны для дачи заключения. Отказ от дачи заключения должен быть заявлен экспертом в письменном виде с изложением мотивов отказа.

3. Эксперт не вправе:

⠀⠀⠀⠀1) без ведома следователя и суда вести переговоры с участниками уголовного судопроизводства по вопросам, связанным с производством судебной экспертизы;
⠀⠀⠀⠀2) самостоятельно собирать материалы для экспертного исследования;
⠀⠀⠀⠀3) проводить без разрешения следователя, суда исследования, могущие повлечь полное или частичное уничтожение объектов либо изменение их внешнего вида или основных свойств;
⠀⠀⠀⠀4) давать заведомо ложное заключение;
⠀⠀⠀⠀5) разглашать данные предварительного расследования, ставшие известными ему в связи с участием в уголовном деле в качестве эксперта, если он был об этом заранее предупрежден
⠀⠀⠀⠀6) уклоняться от явки по вызовам следователя или в суд.

Глава 8. ОБСТОЯТЕЛЬСТВА, ИСКЛЮЧАЮЩИЕ УЧАСТИЕ В УГОЛОВНОМ СУДОПРОИЗВОДСТВЕ​

Статья 36. Обстоятельства, исключающие участие в производстве по уголовному делу
1. Судья, следователь, не может участвовать в производстве по уголовному делу, если он:

⠀⠀⠀⠀1) является потерпевшим или свидетелем по данному уголовному делу;
⠀⠀⠀⠀2) участвовал в качестве эксперта, помощника судьи, секретаря судебного заседания, защитника, обвиняемого, а судья также - в качестве следователя в производстве по данному уголовному делу;
⠀⠀⠀⠀3) является близким родственником или родственником любого из участников производства по данному уголовному делу.

2. Лица, указанные в части первой настоящей статьи, не могут участвовать в производстве по уголовному делу также в случаях, если имеются иные обстоятельства, дающие основание полагать, что они лично, прямо или косвенно, заинтересованы в исходе данного уголовного дела.

3. Наличие информации о вне процессуальном обращении, поступившем судье по уголовному делу, находящемуся в его производстве, само по себе не может рассматриваться в качестве основания для отвода судьи.

Статья 37. Недопустимость участия в производстве по уголовному делу лиц, подлежащих отводу
1. При наличии оснований для отвода, предусмотренных настоящей главой, судья, следователь, помощник судьи, секретарь судебного заседания, переводчик, эксперт, защитник, а также представители потерпевшего обязаны устраниться от участия в производстве по уголовному делу.

2. В случае, если лица, указанные в части первой настоящей статьи, не устранились от участия в производстве по уголовному делу, отвод им может быть заявлен подозреваемым, обвиняемым, его законным представителем, защитником, а также государственным обвинителем, потерпевшим.

3. В случае отказа в удовлетворении заявления об отводе подача повторного заявления об отводе тем же лицом и по тем же основаниям не допускается.

4. Решение об отказе в удовлетворении заявления об отводе, принятое в ходе досудебного производства по уголовному делу, не является препятствием для последующей подачи заявления об отводе тем же лицом в отношении того же лица и по тем же основаниям в ходе судебного производства по уголовному делу.

Статья 38. Недопустимость повторного участия судьи в рассмотрении уголовного дела
1. Судья, принимавший участие в рассмотрении уголовного дела в суде первой инстанции, не может участвовать в рассмотрении данного уголовного дела в суде второй инстанции, а равно участвовать в новом рассмотрении уголовного дела в суде первой или второй инстанции в случае отмены вынесенных с его участием приговора, а также определения, постановления о прекращении уголовного дела.

2. Судья, принимавший участие в рассмотрении уголовного дела в суде второй инстанции, не может участвовать в рассмотрении этого уголовного дела в суде первой инстанции, а равно в новом рассмотрении того же дела в суде второй инстанции после отмены приговора, определения, постановления, вынесенного с его участием.

Статья 39. Заявление об отводе судьи
1. При наличии обстоятельств, предусмотренных статьями 36 и 38 настоящего Кодекса, судье может быть заявлен отвод участниками уголовного судопроизводства.

2. Отвод судье заявляется до начала судебного следствия.

Статья 40. Порядок рассмотрения заявления об отводе судьи
1. Отвод, заявленный судье, разрешается судом в совещательной комнате с вынесением определения или постановления.

2. Отвод, заявленный судье, разрешается остальными судьями, если уголовное дело рассматривается судом коллегиально, в отсутствие судьи, которому заявлен отвод. Судья, которому заявлен отвод, вправе до удаления остальных судей в совещательную комнату публично изложить свое объяснение по поводу заявленного ему отвода.

3. Отвод, заявленный нескольким судьям или всему составу суда, разрешается тем же судом в полном составе большинством голосов.

4. Отвод, заявленный судье, единолично рассматривающему уголовное дело, либо ходатайство о применении меры пресечения или производстве следственных действий, либо жалобу на постановление об отказе в возбуждении уголовного дела или о его прекращении, разрешается этим же судьей.

5. В случае удовлетворения заявления об отводе судьи, нескольких судей или всего состава суда уголовное дело, ходатайство либо жалоба передаются в производство соответственно другого судьи или другого состава суда в порядке, установленном настоящим Кодексом.

6. Если одновременно с отводом судье заявлен отвод кому-либо из других участников производства по уголовному делу, то в первую очередь разрешается вопрос об отводе судьи.


Статья 41. Отвод следователя
1. Решение об отводе следователя принимает руководитель следственного органа.

2. Предыдущее участие руководителя следственного органа, следователя в производстве предварительного расследования по данному уголовному делу не является основанием для его отвода.


Статья 42. Отвод помощника судьи, секретаря судебного заседания
1. Решение об отводе помощника судьи, секретаря судебного заседания принимает суд, рассматривающий уголовное дело, или судья, председательствующий в суде с участием присяжных заседателей.

2. Предыдущее участие лица в производстве по уголовному делу в качестве помощника судьи или секретаря судебного заседания не является основанием для его отвода.


Статья 43. Отвод эксперта
1. Решение об отводе эксперта в ходе досудебного производства по уголовному делу принимает следователь, а также суд.

2. Эксперт не может принимать участие в производстве по уголовному делу:

⠀⠀⠀⠀1) при наличии обстоятельств, предусмотренных статьей 36 настоящего Кодекса. Предыдущее его участие в производстве по уголовному делу в качестве эксперта или специалиста не является основанием для отвода;
⠀⠀⠀⠀2) если он находился или находится в служебной или иной зависимости от сторон или их представителей;
⠀⠀⠀⠀3) если обнаружится его некомпетентность.


Глава 9. ДОКАЗАТЕЛЬСТВА В УГОЛОВНОМ СУДОПРОИЗВОДСТВЕ

Статья 44. Обстоятельства, подлежащие доказыванию
1. При производстве по уголовному делу подлежат доказыванию:

⠀⠀⠀⠀1) событие преступления (время, место, способ и другие обстоятельства совершения преступления);
⠀⠀⠀⠀2) виновность лица в совершении преступления, форма его вины и мотивы;
⠀⠀⠀⠀3) обстоятельства, характеризующие личность обвиняемого;
⠀⠀⠀⠀4) характер и размер вреда, причиненного преступлением;
⠀⠀⠀⠀5) обстоятельства, исключающие преступность и наказуемость деяния;
⠀⠀⠀⠀6) обстоятельства, смягчающие и отягчающие наказание;
⠀⠀⠀⠀7) обстоятельства, которые могут повлечь за собой освобождение от уголовной ответственности и наказания.

2. Подлежат выявлению также обстоятельства, способствовавшие совершению преступления.


Статья 45. Доказательства
1. Доказательствами по уголовному делу являются любые сведения, на основе которых суд, следователь в порядке, определенном настоящим Кодексом, устанавливает наличие или отсутствие обстоятельств, подлежащих доказыванию при производстве по уголовному делу, а также иных обстоятельств, имеющих значение для уголовного дела.

2. В качестве доказательств допускаются:

⠀⠀⠀⠀1) показания подозреваемого, обвиняемого;
⠀⠀⠀⠀2) показания потерпевшего, свидетеля;
⠀⠀⠀⠀3) заключение и показания эксперта;
⠀⠀⠀⠀4) вещественные доказательства;
⠀⠀⠀⠀5) протоколы следственных и судебных действий;
⠀⠀⠀⠀6) иные документы.


Статья 46. Недопустимые доказательства
1. Доказательства, полученные с нарушением требований настоящего Кодекса, являются недопустимыми. Недопустимые доказательства не имеют юридической силы и не могут быть положены в основу обвинения, а также использоваться для доказывания любого из обстоятельств, предусмотренных статьей 38 настоящего Кодекса.

2. К недопустимым доказательствам относятся:

⠀⠀⠀⠀1) показания потерпевшего, свидетеля, основанные на догадке, предположении, слухе, а также показания свидетеля, который не может указать источник своей осведомленности;
⠀⠀⠀⠀2) иные доказательства, полученные с нарушением требований настоящего Кодекса.

Статья 47. Заключение и показания эксперта
1. Заключение эксперта - представленные в письменном виде содержание исследования и выводы по вопросам, поставленным перед экспертом лицом, ведущим производство по уголовному делу, или сторонами.

Статья 48. Вещественные доказательства
1. Вещественными доказательствами признаются любые предметы:

⠀⠀⠀⠀1) которые служили орудиями, оборудованием или иными средствами совершения преступления или сохранили на себе следы преступления;
⠀⠀⠀⠀2) на которые были направлены преступные действия;
⠀⠀⠀⠀2.1) деньги, ценности и иное имущество, полученные в результате совершения преступления;
⠀⠀⠀⠀3) иные предметы и документы, которые могут служить средствами для обнаружения преступления и установления обстоятельств уголовного дела.

2. Предметы, указанные в части первой настоящей статьи, осматриваются, признаются вещественными доказательствами и приобщаются к уголовному делу, о чем выносится соответствующее постановление. Порядок хранения вещественных доказательств устанавливается настоящей статьей и статьей 49 настоящего Кодекса.

3. При вынесении приговора, а также определения или постановления о прекращении уголовного дела должен быть решен вопрос о вещественных доказательствах. При этом:

⠀⠀⠀⠀1) орудия, оборудование или иные средства совершения преступления, принадлежащие обвиняемому, подлежат конфискации, или передаются в соответствующие учреждения, или уничтожаются;
⠀⠀⠀⠀2) предметы, запрещенные к обращению, подлежат передаче в соответствующие учреждения или уничтожаются;
⠀⠀⠀⠀3) предметы, не представляющие ценности и не истребованные стороной, подлежат уничтожению, а в случае ходатайства заинтересованных лиц или учреждений могут быть переданы им;
⠀⠀⠀⠀4) деньги, ценности и иное имущество, полученные в результате совершения преступления, и доходы от этого имущества подлежат возвращению законному владельцу;
⠀⠀⠀⠀5) документы, являющиеся вещественными доказательствами, остаются при уголовном деле в течение всего срока хранения последнего либо передаются заинтересованным лицам по их ходатайству;
⠀⠀⠀⠀6) остальные предметы передаются законным владельцам, а при не установлении последних переходят в собственность государства. Споры о принадлежности вещественных доказательств разрешаются в порядке гражданского судопроизводства

4. Изъятые в ходе досудебного производства, но не признанные вещественными доказательствами предметы, включая электронные носители информации, и документы подлежат возврату лицам, у которых они были изъяты.

Статья 49. Хранение вещественных доказательств
1. Вещественные доказательства должны храниться при уголовном деле до вступления приговора в законную силу либо до истечения срока обжалования постановления или определения о прекращении уголовного дела и передаваться вместе с уголовным делом, за исключением случаев, предусмотренных настоящей статьей. В случае, когда спор о праве на имущество, являющееся вещественным доказательством, подлежит разрешению в порядке гражданского судопроизводства, вещественное доказательство хранится до вступления в силу решения суда.


Статья 50. Протоколы следственных действий и судебного заседания
1. Протоколы следственных действий и протоколы судебных заседаний допускаются в качестве доказательств, если они соответствуют требованиям, установленным настоящим Кодексом.

Статья 51. Иные документы​
1. Иные документы допускаются в качестве доказательств, если изложенные в них сведения имеют значение для установления обстоятельств, указанных в статье 44 настоящего Кодекса.

2. Документы могут содержать сведения, зафиксированные как в письменном, так и в ином виде. К ним могут относиться материалы фото- и киносъемки, аудио- и видеозаписи и иные носители информации.

3. Документы приобщаются к материалам уголовного дела и хранятся в течение всего срока его хранения. По ходатайству законного владельца изъятые и приобщенные к уголовному делу документы или их копии могут быть переданы ему.

4. Документы, обладающие признаками, указанными в части первой статьи 48 настоящего Кодекса, признаются вещественными доказательствами.

Глава 10. ДОКАЗЫВАНИЕ​

Статья 52. Доказывание
1. Доказывание состоит в собирании, проверке и оценке доказательств в целях установления обстоятельств, предусмотренных статьей 44 настоящего Кодекса.


Статья 53. Собирание доказательств
1. Собирание доказательств осуществляется в ходе уголовного судопроизводства, следователем и судом путем производства следственных и иных процессуальных действий, предусмотренных настоящим Кодексом.

2. Подозреваемый, обвиняемый, а также потерпевший и его представитель вправе собирать и представлять письменные документы и предметы для приобщения их к уголовному делу в качестве доказательств.

3. Защитник вправе собирать доказательства путем:

⠀⠀⠀⠀1) получения предметов, документов и иных сведений;
⠀⠀⠀⠀2) опроса лиц с их согласия;
⠀⠀⠀⠀3) истребования справок, характеристик, иных документов от органов государственной власти, органов местного самоуправления, общественных объединений и организаций, которые обязаны предоставлять запрашиваемые документы или их копии.


Статья 54. Проверка доказательств
1. Проверка доказательств производится следователем, судом путем сопоставления их с другими доказательствами, имеющимися в уголовном деле, а также установления их источников, получения иных доказательств, подтверждающих или опровергающих проверяемое доказательство.


Статья 55. Правила оценки доказательств
1. Каждое доказательство подлежит оценке с точки зрения относимости, допустимости, достоверности, а все собранные доказательства в совокупности - достаточности для разрешения уголовного дела.

2. В случаях, указанных в части второй статьи 46 настоящего Кодекса, суд, следователь признает доказательство недопустимым.

3. Следователь вправе признать доказательство недопустимым по ходатайству подозреваемого, обвиняемого или по собственной инициативе. Доказательство, признанное недопустимым, не подлежит включению в обвинительное заключение, обвинительный акт или обвинительное постановление.

4. Суд вправе признать доказательство недопустимым по ходатайству сторон или по собственной инициативе.


Статья 56. Преюдиция
1. Обстоятельства, установленные вступившим в законную силу приговором, признаются судом, следователем без дополнительной проверки. При этом такие приговор или решение не могут предрешать виновность лиц, не участвовавших ранее в рассматриваемом уголовном деле.


Глава 11. ЗАДЕРЖАНИЕ ПОДОЗРЕВАЕМОГО​

Статья 57. Основания задержания подозреваемого
1. Орган следователь вправе задержать лицо по подозрению в совершении преступления, за которое может быть назначено наказание в виде лишения свободы, при наличии одного из следующих оснований:

⠀⠀⠀⠀1) когда это лицо застигнуто при совершении преступления или непосредственно после его совершения;
⠀⠀⠀⠀2) когда потерпевшие или очевидцы укажут на данное лицо как на совершившее преступление;
⠀⠀⠀⠀3) когда на этом лице или его одежде, при нем или в его жилище будут обнаружены явные следы преступления.

2. При наличии иных данных, дающих основание подозревать лицо в совершении преступления, оно может быть задержано, если это лицо пыталось скрыться, либо не имеет постоянного места жительства, либо не установлена его личность, либо если следователем с согласия руководителя следственного органа в суд направлено ходатайство об избрании в отношении указанного лица меры пресечения в виде заключения под стражу.

3. Лицо не может быть задержано по подозрению в совершении преступления, по которому истекли сроки давности уголовного преследования, за исключением случаев, если лицо подозревается или обвиняется в совершении преступления, пятнадцати годам или пожизненным лишением свободы.

Статья 58. Порядок задержания подозреваемого
1. После доставления подозреваемого к следователю в срок не более 3 часов должен быть составлен протокол задержания, в котором делается отметка о том, что подозреваемому разъяснены права, предусмотренные статьей 28 настоящего Кодекса.

2. В протоколе указываются дата и время составления протокола, дата, время, место, основания и мотивы задержания подозреваемого, результаты его личного обыска и другие обстоятельства его задержания. Протокол задержания подписывается лицом, его составившим, и подозреваемым.

3. Подозреваемый должен быть допрошен в соответствии с требованиями настоящего Кодекса. До начала допроса подозреваемому по его просьбе обеспечивается свидание с защитником наедине и конфиденциально. Следователь вправе ограничить время свидания до 30 минут. В любом случае продолжительность свидания не может быть менее 30 минут.

Статья 59. Личный обыск подозреваемого
1. Подозреваемый может быть подвергнут личному обыску

Глава 12. МЕРЫ ПРЕСЕЧЕНИЯ​

Статья 60. Основания для избрания меры пресечения.
1. Следователь, а также суд в пределах предоставленных им полномочий вправе избрать обвиняемому, подозреваемому одну из мер пресечения, предусмотренных настоящим Кодексом, при наличии достаточных оснований полагать, что обвиняемый, подозреваемый:

⠀⠀⠀⠀1) скроется от предварительного следствия или суда;
⠀⠀⠀⠀2) может продолжать заниматься преступной деятельностью;
⠀⠀⠀⠀3) может угрожать свидетелю, иным участникам уголовного судопроизводства, уничтожить доказательства либо иным путем воспрепятствовать производству по уголовному делу.

Статья 61. Меры пресечения
1. Мерами пресечения являются:

⠀⠀⠀⠀1) подписка о невыезде;
⠀⠀⠀⠀2) заключение под стражу.
⠀⠀⠀⠀3) запрет определенных действий

Статья 62. Обстоятельства, учитываемые при избрании меры пресечения.
1. При решении вопроса о необходимости избрания меры пресечения в отношении подозреваемого или обвиняемого в совершении преступления и определения ее вида при наличии оснований, предусмотренных статьей 60 настоящего Кодекса, должны учитываться также тяжесть преступления, сведения о личности подозреваемого или обвиняемого, его возраст, состояние здоровья, семейное положение, род занятий и другие обстоятельства.


Статья 63. Подписка о невыезде и надлежащем поведении
1. Подписка о невыезде и надлежащем поведении состоит в письменном обязательстве подозреваемого или обвиняемого:

⠀⠀⠀⠀1) не покидать постоянное или временное место жительства без разрешения следователя или суда;
⠀⠀⠀⠀2) в назначенный срок являться по вызовам следователя и в суд;
⠀⠀⠀⠀3) иным путем не препятствовать производству по уголовному делу.

Статья 64. Заключение под стражу.
1. Заключение под стражу в качестве меры пресечения применяется по судебному решению в отношении подозреваемого или обвиняемого в совершении преступлений, за которые уголовным законом предусмотрено наказание в виде лишения свободы на срок свыше трех лет при невозможности применения иной, более мягкой, меры пресечения. При избрании меры пресечения в виде заключения под стражу в постановлении судьи должны быть указаны конкретные, фактические обстоятельства, на основании которых судья принял такое решение. Такими обстоятельствами не могут являться данные, не проверенные в ходе судебного заседания, в частности результаты оперативно-розыскной деятельности, представленные в нарушение требований настоящего законодательства. В исключительных случаях эта мера пресечения может быть избрана в отношении подозреваемого или обвиняемого в совершении преступления, за которое предусмотрено наказание в виде лишения свободы на срок до трех лет, при наличии одного из следующих обстоятельств:

⠀⠀⠀⠀1) подозреваемый или обвиняемый не имеет постоянного места жительства;
⠀⠀⠀⠀2) его личность не установлена;
⠀⠀⠀⠀3) им нарушена ранее избранная мера пресечения;
⠀⠀⠀⠀4) он скрылся от органов предварительного расследования или от суда.

2. При необходимости избрания в качестве меры пресечения заключения под стражу следователь с согласия руководителя следственного органа возбуждают перед судом соответствующее ходатайство. В постановлении о возбуждении ходатайства излагаются мотивы и основания, в силу которых возникла необходимость в заключении подозреваемого или обвиняемого под стражу и невозможно избрание иной меры пресечения. К постановлению прилагаются материалы, подтверждающие обоснованность ходатайства. Если ходатайство возбуждается в отношении подозреваемого, задержанного в порядке, установленном статьями 57 и 58 настоящего Кодекса, то постановление и указанные материалы должны быть представлены судье не позднее чем за 4 часов до истечения срока задержания.

3. Постановление о возбуждении ходатайства об избрании в качестве меры пресечения заключения под стражу подлежит рассмотрению единолично судьей областного суда или военного суда соответствующего уровня с обязательным участием подозреваемого или обвиняемого, следователя или руководителя следственного органа, защитника, если последний участвует в уголовном деле, по месту производства предварительного расследования либо месту задержания подозреваемого в течение 5 часов с момента поступления материалов в суд. Подозреваемый, задержанный в порядке, установленном статьями 57 и 58 настоящего Кодекса, доставляется в судебное заседание, кроме случая, если имеются обстоятельства, исключающие возможность его участия в судебном заседании непосредственно, и судом принято решение об участии подозреваемого в судебном заседании путем использования систем видео-конференц-связи. В судебном заседании вправе также участвовать законный представитель несовершеннолетнего подозреваемого или обвиняемого, руководитель следственного органа, следователь. Неявка без уважительных причин сторон, своевременно извещенных о времени судебного заседания, не является препятствием для рассмотрения ходатайства, за исключением случаев неявки обвиняемого.

4. В начале заседания судья объявляет, какое ходатайство подлежит рассмотрению, разъясняет явившимся в судебное заседание лицам их права и обязанности. Затем руководитель следственного органа либо по его поручению лицо, возбудившее ходатайство, обосновывает его, после чего заслушиваются другие явившиеся в судебное заседание лица.

5. Рассмотрев ходатайство, судья выносит одно из следующих постановлений:

⠀⠀⠀⠀1) об избрании в отношении подозреваемого или обвиняемого меры пресечения в виде заключения под стражу;
⠀⠀⠀⠀2) об отказе в удовлетворении ходатайства;

6. При отказе в удовлетворении ходатайства об избрании в отношении подозреваемого или обвиняемого меры пресечения в виде заключения под стражу судья по собственной инициативе вправе при наличии оснований, предусмотренных настоящим законодательством, и с учетом обстоятельств, указанных в статье 62 настоящего Кодекса, избрать в отношении подозреваемого или обвиняемого меру пресечения в виде запрета определенных действий

7. Постановление судьи направляется лицу, возбудившему ходатайство, руководителю следственного органа, подозреваемому, обвиняемому или потерпевшему и подлежит немедленному исполнению.

8. Срок содержания под стражей определяется судом и может быть продлен.

Статья 65. Запрет определенных действий
1. Запрет определенных действий в качестве меры пресечения избирается по судебному решению в отношении подозреваемого или обвиняемого при невозможности применения иной, более мягкой, меры пресечения и заключается в возложении на подозреваемого или обвиняемого обязанностей своевременно являться по вызовам следователя или в суд, соблюдать один или несколько запретов, предусмотренных частью пятой настоящей статьи, а также в осуществлении контроля за соблюдением возложенных на него запретов. Запрет определенных действий может быть избран в любой момент производства по уголовному делу.

2. Запрет определенных действий в качестве меры пресечения применяется в порядке, установленном статьей 64 настоящего Кодекса (за исключением требований, связанных с видом и размером наказания, квалификацией преступления, возрастом подозреваемого или обвиняемого), и с учетом особенностей, определенных настоящей статьей.

3. При необходимости избрания в качестве меры пресечения запрета определенных действий, а равно при необходимости возложения дополнительных запретов на подозреваемого или обвиняемого, в отношении которого применена мера пресечения в виде запрета определенных действий, следователь с согласия руководителя следственного органа возбуждает перед судом соответствующее ходатайство. В постановлении о возбуждении перед судом данного ходатайства указываются один или несколько запретов, предусмотренных частью пятой настоящей статьи, мотивы и основания их установления в отношении подозреваемого или обвиняемого и невозможности избрания иной меры пресечения.

4. Рассмотрев ходатайство, судья выносит одно из следующих постановлений:

⠀⠀⠀⠀1) об избрании в отношении подозреваемого или обвиняемого меры пресечения в виде запрета определенных действий;
⠀⠀⠀⠀2) о возложении дополнительных запретов на подозреваемого или обвиняемого, в отношении которого применена мера пресечения в виде запрета определенных действий;
⠀⠀⠀⠀3) об отказе в удовлетворении ходатайства.

5. Суд с учетом данных о личности подозреваемого или обвиняемого, фактических обстоятельств уголовного дела и представленных сторонами сведений при избрании меры пресечения в виде запрета определенных действий может возложить следующие запреты:

⠀⠀⠀⠀1) находиться в определенных местах, а также ближе установленного расстояния до определенных объектов, посещать определенные мероприятия и участвовать в них;
⠀⠀⠀⠀2) общаться с определенными лицами;
⠀⠀⠀⠀3) управлять автомобилем или иным транспортным средством, если совершенное преступление связано с нарушением правил дорожного движения и эксплуатации транспортных средств.
⠀⠀⠀⠀4) Иные действия, запрет которых позволит ограничить должностные полномочия лица, совершившее преступление, без отстранения такого от должности.
⠀⠀⠀⠀5) Иные действия, запрет на которые установил суд.

6. Срок применения запрета, предусмотренного пунктом 1 части пятой настоящей статьи, устанавливается и продлевается судом в соответствии статьи 72 настоящего Кодекса с учетом особенностей, определенных настоящей статьей, и с момента вынесения судом решения о его установлении не может превышать по уголовным делам:

⠀⠀⠀⠀1) о преступлениях легкой и средней тяжести - 1 неделя;
⠀⠀⠀⠀2) о тяжких преступлениях - 2 недели;
⠀⠀⠀⠀3) об особо тяжких преступлениях - 1 месяц.


Статья 66. Отмена меры пресечения
1. Мера пресечения отменяется, когда в ней отпадает необходимость или изменяется на более строгую или более мягкую, когда изменяются основания для избрания меры пресечения, предусмотренные статьями 60 и 62 настоящего Кодекса.

Глава 13. ИНЫЕ МЕРЫ ПРОЦЕССУАЛЬНОГО ПРИНУЖДЕНИЯ​

Статья 67. Основания применения иных мер процессуального принуждения.
1. В целях обеспечения установленного настоящим Кодексом порядка уголовного судопроизводства, надлежащего исполнения приговора следователь или суд вправе применить к подозреваемому или обвиняемому следующие меры процессуального принуждения:

⠀⠀⠀⠀1) обязательство о явке;
⠀⠀⠀⠀2) привод;
⠀⠀⠀⠀3) временное отстранение от должности;

2. В случаях, предусмотренных настоящим Кодексом, следователь или суд вправе применить к потерпевшему, свидетелю и(или) эксперту, следующие меры процессуального принуждения:

⠀⠀⠀⠀1) обязательство о явке;
⠀⠀⠀⠀2) привод;
⠀⠀⠀⠀3) денежное взыскание.

Статья 68. Обязательство о явке
1. При необходимости у подозреваемого, обвиняемого, а также потерпевшего или свидетеля может быть взято обязательство о явке.

2. Обязательство о явке состоит в письменном обязательстве лица, указанного в части первой настоящей статьи, своевременно являться по вызовам следователя или в суд, а в случае перемены места жительства незамедлительно сообщать об этом. Лицу разъясняются последствия нарушения обязательства, о чем делается соответствующая отметка в обязательстве.

Статья 69. Привод
1. В случае неявки по вызову без уважительных причин подозреваемый, обвиняемый, а также потерпевший, свидетель и лицо, в отношении которого уголовное дело выделено в отдельное производство в связи с заключением с ним досудебного соглашения о сотрудничестве, могут быть подвергнуты приводу.
2. Привод состоит в принудительном доставлении лица к следователю или в суд.
3. При наличии причин, препятствующих явке по вызову в назначенный срок, лица, указанные в части первой настоящей статьи, незамедлительно уведомляют орган, которым они вызывались.
4. Привод не может производиться в ночное время, за исключением случаев, не терпящих отлагательства.
5. Привод производится следователя, а также сотрудниками органов принудительного исполнения Нижегородской области - на основании постановления суда.

Статья 70. Временное отстранение от должности
1. При необходимости временного отстранения от должности подозреваемого или обвиняемого следователь с согласия руководителя следственного органа, возбуждает перед судом по месту производства предварительного расследования соответствующее ходатайство.
2. В течение 48 часов с момента поступления ходатайства судья выносит постановление о временном отстранении подозреваемого или обвиняемого от должности или об отказе в этом.
3. Постановление о временном отстранении подозреваемого или обвиняемого от должности направляется по месту его работы.
4. Временное отстранение подозреваемого или обвиняемого от должности отменяется на основании постановления следователя, когда в применении этой меры отпадает необходимость.


Статья 71. Денежное взыскание
В случаях неисполнения участниками уголовного судопроизводства процессуальных обязанностей, предусмотренных настоящим Кодексом, а также нарушения ими порядка в судебном заседании на них может быть наложено денежное взыскание в размере до пятидесяти тысяч рублей.

Глава 14. ХОДАТАЙСТВА​

Статья 72. Лица, имеющие право заявить ходатайство
1. Подозреваемый, обвиняемый, его защитник, потерпевший, его законный представитель и представитель, эксперт, представитель администрации организации и иное лицо, права и законные интересы которых затронуты в ходе досудебного или судебного производства, вправе заявить ходатайство о производстве процессуальных действий или принятии процессуальных решений для установления обстоятельств, имеющих значение для уголовного дела, обеспечения прав и законных интересов лица, заявившего ходатайство, либо представляемых им лица или организации.

2. Ходатайство заявляется следователю либо в суд.

3. Правом заявлять ходатайство в ходе судебного разбирательства обладает также государственный обвинитель.


Статья 73. Заявление ходатайства
1. Ходатайство может быть заявлено в любой момент производства по уголовному делу. Письменное ходатайство приобщается к уголовному делу, устное - заносится в протокол следственного действия или судебного заседания.

2. Отклонение ходатайства не лишает заявителя права вновь заявить ходатайство.


Статья 74. Сроки рассмотрения ходатайства
Ходатайство подлежит рассмотрению и разрешению непосредственно после его заявления. В случаях, когда немедленное принятие решения по ходатайству, заявленному в ходе предварительного расследования, невозможно, оно должно быть разрешено не позднее 3 суток со дня его заявления.


Статья 75. Разрешение ходатайства
Об удовлетворении ходатайства либо о полном или частичном отказе в его удовлетворении следователь, судья выносят постановление, а суд - определение, которое доводится до сведения лица, заявившего ходатайство.


Глава 15. ОБЖАЛОВАНИЕ ДЕЙСТВИЙ ДОЛЖНОСТНЫХ ЛИЦ, ОСУЩЕСТВЛЯЮЩИХ УГОЛОВНОЕ СУДОПРОИЗВОДСТВО
​

Статья 76. Право обжалования
1. Действия (бездействие) и решения следователя, руководителя следственного органа и суда могут быть обжалованы в установленном настоящим Кодексом порядке участниками уголовного судопроизводства, а также иными лицами в той части, в которой производимые процессуальные действия и принимаемые процессуальные решения затрагивают их интересы.

Статья 77. Порядок рассмотрения жалобы руководителем следственного органа
1. Руководитель следственного органа рассматривает жалобу в течение 3 суток со дня ее получения. В исключительных случаях, когда для проверки жалобы необходимо истребовать дополнительные материалы либо принять иные меры, допускается рассмотрение жалобы в срок до 10 суток, о чем извещается заявитель.
2. По результатам рассмотрения жалобы руководитель следственного органа выносит постановление о полном или частичном удовлетворении жалобы либо об отказе в ее удовлетворении.
2.1. В случае удовлетворения жалобы, в постановлении должны быть указаны процессуальные действия, осуществляемые для ускорения рассмотрения дела, и сроки их осуществления.
3. Заявитель должен быть незамедлительно уведомлен о решении, принятом по жалобе, и дальнейшем порядке его обжалования.
4. В случаях, предусмотренных настоящим Кодексом, следователь вправе обжаловать действия (бездействие) и решения руководителя следственного органа соответственно суду.

Глава 16. РЕАБИЛИТАЦИЯ​

Статья 78. Основания возникновения права на реабилитацию
1. Право на реабилитацию включает в себя право на возмещение имущественного вреда, устранение последствий морального вреда и восстановление в трудовых, пенсионных, жилищных и иных правах. Вред, причиненный гражданину в результате уголовного преследования, возмещается государством в полном объеме независимо от вины следователя и суда.
2. Право на реабилитацию, в том числе право на возмещение вреда, связанного с уголовным преследованием, имеют:
1) подсудимый, в отношении которого вынесен оправдательный приговор;
2) подсудимый, уголовное преследование в отношении которого прекращено в связи с отказом государственного обвинителя от обвинения;
3) осужденный - в случаях полной или частичной отмены вступившего в законную силу обвинительного приговора суда и прекращения уголовного дела по основаниям, предусмотренным пунктами 1 и 2 части первой статьи 19 настоящего Кодекса;
3. Право на возмещение вреда в порядке, установленном настоящей главой, имеет также любое лицо, незаконно подвергнутое мерам процессуального принуждения в ходе производства по уголовному делу.
4. Правила настоящей статьи не распространяются на случаи, когда примененные в отношении лица меры процессуального принуждения или постановленный обвинительный приговор отменены или изменены ввиду издания акта об амнистии, истечения сроков давности или принятия закона, устраняющего преступность или наказуемость деяния, за исключением случаев вынесения судом постановления.
5. В иных случаях вопросы, связанные с возмещением вреда, разрешаются в порядке гражданского судопроизводства.

Статья 79. Признание права на реабилитацию
1. Суд в приговоре, определении, постановлении, а следователь в постановлении признают за оправданным либо лицом, в отношении которого прекращено уголовное преследование, право на реабилитацию. Одновременно реабилитированному направляется извещение с разъяснением порядка возмещения вреда, связанного с уголовным преследованием.

Статья 80. Возмещение имущественного вреда
1. Возмещение реабилитированному имущественного вреда включает в себя возмещение:
1) конфискованного или обращенного в доход государства на основании приговора или решения суда его имущества;
3) штрафов и процессуальных издержек, взысканных с него во исполнение приговора суда;
4) сумм, выплаченных им за оказание юридической помощи;
5) иных расходов.

Статья 81. Возмещение морального вреда
1. Руководитель следственного органа от имени государства приносит официальное извинение реабилитированному за причиненный ему вред.
2. Иски о компенсации за причиненный моральный вред в денежном выражении предъявляются в порядке гражданского судопроизводства.
3. Если сведения о задержании реабилитированного, заключении его под стражу, временном отстранении его от должности, об осуждении реабилитированного и иных примененных к нему незаконных действиях были опубликованы в печати, распространены по радио, телевидению или в иных средствах массовой информации, то по требованию реабилитированного, либо по письменному указанию суда, руководителя следственного органа, следователя соответствующие средства массовой информации обязаны в течение 10 суток сделать сообщение о реабилитации.
4. По требованию реабилитированного, а в случае его смерти - его близких родственников или родственников суд, следователь обязаны в срок не позднее 3 суток направить письменные сообщения о принятых решениях, оправдывающих гражданина, по месту его работы, учебы или месту жительства.

Статья 82. Возмещение вреда юридическим лицам
Вред, причиненный юридическим лицам незаконными действиями (бездействием) и решениями суда, следователя возмещается государством в полном объеме в порядке и сроки, которые установлены настоящей главой.

Глава 17. Поводы и основания для возбуждения уголовного дела​

Статья 83. Поводы и основание для возбуждения уголовного дела
1. Поводами для возбуждения уголовного дела служат:
1) заявление о преступлении;
2) явка с повинной;
3) сообщение о совершенном или готовящемся преступлении, полученное из иных источников;
4) постановление суда о направлении соответствующих материалов в орган предварительного расследования для дачи процессуальной оценки.
2. Основанием для возбуждения уголовного дела является наличие достаточных данных, указывающих на признаки преступления.

Статья 84. Заявление о преступлении
1. Заявление о преступлении может быть сделано в устном или письменном виде.
2. Письменное заявление о преступлении должно быть подписано заявителем.
3. Устное заявление о преступлении заносится в протокол, который подписывается заявителем и лицом, принявшим данное заявление. Протокол должен содержать данные о заявителе, а также о документах, удостоверяющих личность заявителя.
4. Если устное сообщение о преступлении сделано при производстве следственного действия или в ходе судебного разбирательства, то оно заносится соответственно в протокол следственного действия или протокол судебного заседания.
5. В случае, когда заявитель не может лично присутствовать при составлении протокола, его заявление оформляется в порядке настоящего Кодекса.
6. Заявитель предупреждается об уголовной ответственности за заведомо ложный донос в соответствии со статьей 61 Уголовного кодекса, о чем в протоколе делается отметка, которая удостоверяется подписью заявителя.
7. Анонимное заявление о преступлении не может служить поводом для возбуждения уголовного дела.

Статья 85. Явка с повинной
1. Заявление о явке с повинной - добровольное сообщение лица о совершенном им преступлении.
2. Заявление о явке с повинной может быть сделано как в письменном, так и в устном виде. Устное заявление принимается и заносится в протокол в порядке настоящего Кодекса.

Статья 86. Рапорт об обнаружении признаков преступления
Сообщение о совершенном или готовящемся преступлении, полученное из иных источников, чем указанные в пунктах 1, 2 и 4 части первой статьи 83 настоящего Кодекса, принимается лицом, получившим данное сообщение, о чем составляется рапорт об обнаружении признаков преступления.


Статья 87. Порядок рассмотрения сообщения о преступлении
1. Следователь, руководитель следственного органа обязаны принять, проверить сообщение о любом совершенном или готовящемся преступлении и в пределах компетенции, установленной настоящим Кодексом, принять по нему решение в срок не позднее 3 суток со дня поступления указанного сообщения. При проверке сообщения о преступлении следователь, руководитель следственного органа вправе получать объяснения, образцы для сравнительного исследования, истребовать документы и предметы, изымать их в порядке, установленном настоящим Кодексом, назначать судебную экспертизу, принимать участие в ее производстве и получать заключение эксперта в разумный срок, производить осмотр места происшествия, документов, предметов, трупов, освидетельствование, требовать производства документальных проверок, ревизий, исследований документов, предметов, трупов, привлекать к участию в этих действиях специалистов обязательное для исполнения письменное поручение о проведении оперативно-розыскных мероприятий.
2. Руководитель следственного органа по мотивированному ходатайству соответственно следователя продлить до 10 суток срок, установленный частью первой настоящей статьи.
3. Отказ в приеме сообщения о преступлении может быть обжалован руководителю следственного органа в порядке, установленным настоящим Кодексом.

Статья 88. Решения, принимаемые по результатам рассмотрения сообщения о преступлении
1. По результатам рассмотрения сообщения о преступлении следователь, руководитель следственного органа принимает одно из следующих решений:
1) о возбуждении уголовного дела в порядке, установленном статьей 89 настоящего Кодекса;
2) об отказе в возбуждении уголовного дела;
3) о передаче сообщения по подследственности в соответствии со статьей 92 настоящего Кодекса, а по уголовным делам частного обвинения - в суд в соответствии с частью второй статьи 15 настоящего Кодекса.
2. О принятом решении сообщается заявителю. При этом заявителю разъясняются его право обжаловать данное решение и порядок обжалования. Копия постановления, вынесенного в соответствии с пунктом 3 части первой настоящей статьи, в течение 24 часов с момента его вынесения направляется руководителю следственного органа.
3. В случае принятия решения, предусмотренного пунктом 3 части первой настоящей статьи следователь, руководитель следственного органа принимает меры по сохранению следов преступления.
4. Споры о передаче сообщения о преступлении по подследственности в соответствии с пунктом 3 части первой настоящей статьи разрешаются судом в течение 3 суток с момента поступления соответствующего обращения.

Глава 18. ПОРЯДОК ВОЗБУЖДЕНИЯ УГОЛОВНОГО ДЕЛА​

Статья 89. Возбуждение уголовного дела публичного обвинения
1. При наличии повода и основания, предусмотренных статьей 83 настоящего Кодекса руководитель следственного органа, следователь в пределах компетенции, установленной настоящим Кодексом, возбуждают уголовное дело, о чем выносится соответствующее постановление.
2. В постановлении о возбуждении уголовного дела указываются:
1) дата, время и место его вынесения;
2) кем оно вынесено;
3) повод и основание для возбуждения уголовного дела;
4) пункт, часть, статья Уголовного кодекса, на основании которых возбуждается уголовное дело.
3. Если уголовное дело направляется суду для определения подследственности, то об этом в постановлении о возбуждении уголовного дела делается соответствующая отметка.

Статья 90. Возбуждение уголовного дела частного и частно-публичного обвинения
1. Уголовные дела о преступлениях, указанных в части второй статьи 15 настоящего Кодекса, возбуждаются не иначе как по заявлению потерпевшего или его законного представителя.
2. Если заявление подано в отношении лица, данные о котором потерпевшему не известны, то суд отказывает в принятии заявления к своему производству и направляет указанное заявление руководителю следственного органа для решения вопроса о возбуждении уголовного дела, о чем уведомляет лицо, подавшее заявление.
3. Уголовные дела о преступлениях, указанных в части третьей статьи 15 настоящего Кодекса, возбуждаются не иначе как по заявлению потерпевшего или его законного представителя. Производство по таким уголовным делам ведется в общем порядке.
4. Руководитель следственного органа, следователь с согласия суда возбуждают уголовное дело о любом преступлении, указанном в частях второй и третьей статьи 15 настоящего Кодекса, и при отсутствии заявления потерпевшего или его законного представителя в случаях, предусмотренных частью четвертой статьи 15 настоящего Кодекса.

Статья 91. Отказ в возбуждении уголовного дела
1. При отсутствии основания для возбуждения уголовного дела руководитель следственного органа, следователь выносит постановление об отказе в возбуждении уголовного дела. Отказ в возбуждении уголовного дела по основанию, предусмотренному пунктом 2 части первой статьи 17 настоящего Кодекса, допускается лишь в отношении конкретного лица.
2. При вынесении постановления об отказе в возбуждении уголовного дела по результатам проверки сообщения о преступлении, связанного с подозрением в его совершении конкретного лица или лиц, руководитель следственного органа, следователь обязаны рассмотреть вопрос о возбуждении уголовного дела за заведомо ложный донос в отношении лица, заявившего или распространившего ложное сообщение о преступлении.
3. Копия постановления об отказе в возбуждении уголовного дела в течение 24 часов с момента его вынесения направляется заявителю и руководителю следственного органа. При этом заявителю разъясняются его право обжаловать данное постановление и порядок обжалования.

Глава 19. ОБЩИЕ УСЛОВИЯ ПРЕДВАРИТЕЛЬНОГО РАССЛЕДОВАНИЯ​

Статья 92. Подследственность
1. Предварительное расследование производится следователями.
2. Предварительное следствие производится:
1) Следователями Федеральной службы безопасности - по уголовным делам:

а) о преступлениях, предусмотренных статьями 1, 28, 29, 31, 33, 35, 36, 40, 48, 49, 51, 54, 55, 56, 56.1., 57, 58, 59, 60, 62, 63 Уголовного кодекса;

б) об особо тяжких преступлениях;

в) о преступлениях, совершенных лицами, указанными в статьей (редак) настоящего Кодекса, а также о преступлениях, совершенных в отношении указанных лиц в связи с их профессиональной деятельностью;

г) о преступлениях, совершенных должностными лицами органов федеральной службы безопасности, органов внутренних дел Нижегородской области, учреждений и органов уголовно-исполнительной системы, военнослужащими, осуществляющими военную службу, и гражданами, проходящими военные сборы, лицами гражданского персонала Вооруженных Сил;

2) Следователями органов внутренних дел - по уголовным делам о преступлениях предусмотренных статьями 1, 2-21, 22-27, 30, 31, 32, 36, 37, 38, 39, 40, 43-44, 45, 50, 51, 53, 55, 56, 57.1, 61, 61.1, 63, 64, 65, 67 Уголовного кодекса;

б) о преступлениях легкой, средней тяжести, а так же тяжких преступлений;
в.1) о преступлениях, совершенные должностными лицами органов внутренних дел, если тяжесть совершенного преступления не выходит за пределы п.Б настоящей статьи.
в.2) о преступлениях совершенные лицами осуществляющие военную службу, гражданами проходящими военные сборы или лицами гражданского персонала Вооруженных Сил, если данные преступления являются тяжкими.
г) О преступлениях совершенные лицами осуществляющие военную службу, гражданами проходящими военные сборы или лицами гражданского персонала Вооруженных Сил предусмотренные ст. 67-68, ст. 69, ст. 70, ст. 71, ст. 72 Уголовного кодекса.

г.1) Осуществление предварительного следствия по по п.Г ч.
2.2. настоящей статьи, осуществляется следователями органов внутренних дел, только при отсутствии возможности расследования указанных преступлений Вооруженных сил.

Статья 93. Соединение уголовных дел
1. В одном производстве могут быть соединены уголовные дела в отношении:
1) нескольких лиц, совершивших одно или несколько преступлений в соучастии;
2) одного лица, совершившего несколько преступлений;
3) лица, обвиняемого в заранее не обещанном укрывательстве преступлений, расследуемых по этим уголовным делам.

Статья 94. Недопустимость разглашения данных предварительного расследования
1. Данные предварительного расследования не подлежат разглашению, за исключением случаев, предусмотренных частями второй, четвертой и пятой настоящей статьи.
2. Данные предварительного расследования могут быть преданы гласности лишь с разрешения следователя и только в том объеме, в каком ими будет признано это допустимым, если разглашение не противоречит интересам предварительного расследования и не связано с нарушением прав, свобод и законных интересов участников уголовного судопроизводства.
3. Следователь предупреждает участников уголовного судопроизводства о недопустимости разглашения без соответствующего разрешения данных предварительного расследования, о чем у них берется подписка.
4. Запрет на предание гласности данных предварительного расследования не распространяется на сведения:
1) о нарушении закона органами государственной власти и их должностными лицами;
2) оглашенные в открытом судебном заседании.
5. Не является разглашением данных предварительного расследования:
1) изложение сведений по уголовному делу в ходатайствах, заявлениях, жалобах и иных процессуальных документах по этому делу, а также в заявлениях и иных документах, подаваемых в государственные и межгосударственные органы по защите прав и свобод человека;
2) предоставление сведений по уголовному делу лицу, привлекаемому к участию в этом деле в качестве специалиста, при условии дачи им письменного обязательства о неразглашении указанных сведений без согласия следователя.

Глава 20. ПРЕДВАРИТЕЛЬНОЕ СЛЕДСТВИЕ​
Статья 95. Срок предварительного следствия​
1. Предварительное следствие по уголовному делу должно быть закончено в срок, не превышающий 30 суток со дня возбуждения уголовного дела.
2. В срок предварительного следствия включается время со дня возбуждения уголовного дела и до дня его направления руководителю следственного органа с обвинительным заключением, либо до дня вынесения постановления о возбуждении перед судом ходатайства о прекращении уголовного дела или уголовного преследования в отношении подозреваемого или обвиняемого в совершении преступления небольшой или средней тяжести и назначении этому лицу меры уголовно-правового характера в виде судебного штрафа или о прекращении производства по уголовному делу.
3. По уголовному делу, расследование которого представляет особую сложность, срок предварительного следствия может быть продлен руководителем следственного органа,а также их заместителями до трех месяцев. Дальнейшее продление срока предварительного следствия может быть произведено только в исключительных случаях Председателем Нижегородского областного суда или его заместителями.
4. В случае необходимости продления срока предварительного следствия следователь выносит соответствующее постановление и представляет его руководителю следственного органа не позднее 5 суток до дня истечения срока предварительного следствия.
5. Следователь в письменном виде уведомляет обвиняемого и его защитника, а также потерпевшего и его представителя о продлении срока предварительного следствия.

Статья 96. Общие правила производства следственных действий
1. Следственные действия, предусмотренные настоящим Кодексом, производятся на основании постановления следователя.
2. Производство следственного действия в ночное время не допускается, за исключением случаев, не терпящих отлагательства.
3. При производстве следственных действий недопустимо применение насилия, угроз и иных незаконных мер, а равно создание опасности для жизни и здоровья участвующих в них лиц.
4. При производстве следственных действий могут применяться технические средства и способы обнаружения, фиксации и изъятия следов преступления и вещественных доказательств. Перед началом следственного действия следователь предупреждает лиц, участвующих в следственном действии, о применении технических средств.
5. Следователь вправе привлечь к участию в следственном действии должностное лицо органа, осуществляющего оперативно-розыскную деятельность, о чем делается соответствующая отметка в протоколе.
6. В ходе производства следственного действия ведется протокол в соответствии со статьей 96 настоящего Кодекса.

Статья 96.1. Протокол следственного действия
1. Протокол следственного действия составляется в ходе следственного действия или непосредственно после его окончания.
2. Протокол может быть написан от руки или изготовлен с помощью технических средств. При производстве следственного действия могут также применяться стенографирование, фотографирование, киносъемка, аудио- и видеозапись. Стенограмма и стенографическая запись, фотографические негативы и снимки, материалы аудио- и видеозаписи хранятся при уголовном деле.
3. В протоколе указываются:
1) место и дата производства следственного действия, время его начала и окончания с точностью до минуты
2) должность, фамилия и инициалы лица, составившего протокол;
3) фамилия, имя и отчество каждого лица, участвовавшего в следственном действии, а в необходимых случаях его адрес и другие данные о его личности.
4. В протоколе описываются процессуальные действия в том порядке, в каком они производились, выявленные при их производстве существенные для данного уголовного дела обстоятельства, а также излагаются заявления лиц, участвовавших в следственном действии.
5. В протоколе должны быть указаны также технические средства, примененные при производстве следственного действия, условия и порядок их использования, объекты, к которым эти средства были применены, и полученные результаты. В протоколе должно быть отмечено, что лица, участвующие в следственном действии, были заранее предупреждены о применении при производстве следственного действия технических средств.
6. Протокол предъявляется для ознакомления всем лицам, участвовавшим в следственном действии. При этом указанным лицам разъясняется их право делать подлежащие внесению в протокол замечания о его дополнении и уточнении. Все внесенные замечания о дополнении и уточнении протокола должны быть оговорены и удостоверены подписями этих лиц.
7. Протокол подписывается следователем и лицами, участвовавшими в следственном действии.
8. К протоколу прилагаются фотографические негативы и снимки, киноленты, диапозитивы, фонограммы допроса, кассеты видеозаписи, чертежи, планы, схемы, слепки и оттиски следов, выполненные при производстве следственного действия, а также электронные носители информации, полученной или скопированной с других электронных носителей информации в ходе производства следственного действия.

Статья 97. Удостоверение факта отказа от подписания или невозможности подписания протокола следственного действия
1. В случае отказа подозреваемого, обвиняемого, потерпевшего или иного лица, участвующего в следственном действии, подписать протокол следственного действия следователь вносит в него соответствующую запись, которая удостоверяется подписью следователя, а также подписями защитника, если он участвует в следственном действии.
2. Лицу, отказавшемуся подписать протокол, должна быть предоставлена возможность дать объяснение причин отказа, которое заносится в данный протокол.
3. Если подозреваемый, обвиняемый, потерпевший или свидетель в силу физических недостатков или состояния здоровья не может подписать протокол, то ознакомление этого лица с текстом протокола производится в присутствии защитника или иных присутствующих лиц, которые подтверждают своими подписями содержание протокола и факт невозможности его подписания.

Глава 21. ПРИВЛЕЧЕНИЯ В КАЧЕСТВЕ ОБВИНЯЕМОГО. ПРЕДЪЯВЛЕНИЕ ОБВИНЕНИЯ

​
Статья 98. Порядок привлечения в качестве обвиняемого
1. При наличии достаточных доказательств, дающих основания для обвинения лица в совершении преступления, следователь выносит постановление о привлечении данного лица в качестве обвиняемого.
2. В постановлении должны быть указаны:
1) дата и место его составления;
2) кем составлено постановление;
3) фамилия, имя и отчество лица, привлекаемого в качестве обвиняемого, число, месяц, год и место его рождения;
4) описание преступления с указанием времени, места его совершения, а также иных обстоятельств, подлежащих доказыванию.
5) пункт, часть, статья Уголовного кодекса, предусматривающие ответственность за данное преступление;
6) решение о привлечении лица в качестве обвиняемого по расследуемому уголовному делу.
3. При обвинении лица в совершении нескольких преступлений, предусмотренных разными пунктами, частями, статьями Уголовного кодекса, в постановлении о привлечении его в качестве обвиняемого должно быть указано, какие деяния вменяются ему по каждой из этих норм уголовного закона.
4. При привлечении по одному уголовному делу в качестве обвиняемых нескольких лиц постановление о привлечении в качестве обвиняемого выносится в отношении каждого из них.

Статья 99. Допрос обвиняемого
1. Следователь допрашивает обвиняемого немедленно после предъявления ему обвинения, либо в течение трех дней, с соблюдением требований, указанных в статьях настоящего Кодекса.
2. В начале допроса следователь выясняет у обвиняемого, признает ли он себя виновным, желает ли дать показания по существу предъявленного обвинения и на каком языке. В случае отказа обвиняемого от дачи показаний следователь делает соответствующую запись в протоколе его допроса.
3. Повторный допрос обвиняемого по тому же обвинению в случае его отказа от дачи показаний на первом допросе может проводиться только по просьбе самого обвиняемого.

Статья 100. Протокол допроса обвиняемого
1. При каждом допросе обвиняемого следователь составляет протокол с соблюдением требований статей настоящего Кодекса.
2. В протоколе первого допроса указываются данные о личности обвиняемого:
1) фамилия, имя и отчество;
2) дата и место рождения;
3) гражданство;
4) образование;
5) семейное положение, состав его семьи;
6) место работы или учебы, род занятий или должность;
7) место жительства;
8) наличие судимости;
9) иные сведения, имеющие значение для уголовного дела.
3. В протоколах следующих допросов данные о личности обвиняемого, если они не изменились, можно ограничить указанием его фамилии, имени и отчества.

Глава 22. ОСМОТР. ОСВИДЕТЕЛЬСТВОВАНИЕ. СЛЕДСТВЕННЫХ ЭКСПЕРИМЕНТ

​
Статья 101. Основания производства осмотра
1. Осмотр места происшествия, местности, жилища, иного помещения, предметов и документов производится в целях обнаружения следов преступления, выяснения других обстоятельств, имеющих значение для уголовного дела.
2. Осмотр места происшествия, документов и предметов может быть произведен до возбуждения уголовного дела.

Статья 102. Порядок производства осмотра
1. Осмотр следов преступления и иных обнаруженных предметов производится на месте производства следственного действия, за исключением случаев, предусмотренных частью второй настоящей статьи.
2. Если для производства такого осмотра требуется продолжительное время или осмотр на месте затруднен, то предметы должны быть изъяты, упакованы, опечатаны, заверены подписью следователя на месте осмотра. Изъятию подлежат только те предметы, которые могут иметь отношение к уголовному делу. При этом в протоколе осмотра по возможности указываются индивидуальные признаки и особенности изымаемых предметов.
3. Все обнаруженное и изъятое при осмотре должно быть предъявлено участникам осмотра.
4. Осмотр жилища производится только с согласия проживающих в нем лиц или на основании судебного решения. Если проживающие в жилище лица возражают против осмотра, то следователь возбуждает перед судом ходатайство о производстве осмотра.

Статья 103. Освидетельствование
1. Для обнаружения на теле человека особых примет, следов преступления, телесных повреждений, выявления состояния опьянения или иных свойств и признаков, имеющих значение для уголовного дела, если для этого не требуется производство судебной экспертизы, может быть произведено освидетельствование подозреваемого, обвиняемого, потерпевшего, а также свидетеля с его согласия, за исключением случаев, когда освидетельствование необходимо для оценки достоверности его показаний. В случаях, не терпящих отлагательства, освидетельствование может быть произведено до возбуждения уголовного дела.
2. О производстве освидетельствования следователь выносит постановление, которое является обязательным для освидетельствуемого лица.
3. Освидетельствование производится следователем. При необходимости следователь привлекает к участию в производстве освидетельствования врача или другого специалиста.
4. При освидетельствовании лица другого пола следователь не присутствует, если освидетельствование сопровождается обнажением данного лица. В этом случае освидетельствование производится врачом.
5. Фотографирование, видеозапись и киносъемка в случаях, предусмотренных частью четвертой настоящей статьи, проводятся с согласия освидетельствуемого лица.

Статья 104. Протоколы осмотра и освидетельствования
1. В протоколах описываются все действия следователя, а также все обнаруженное при осмотре и (или) освидетельствовании в той последовательности, в какой производились осмотр и освидетельствование, и в том виде, в каком обнаруженное наблюдалось в момент осмотра и освидетельствования. В протоколах перечисляются и описываются все предметы, изъятые при осмотре и (или) освидетельствовании.
2. В протоколах также должно быть указано, в какое время, при какой погоде и каком освещении производились осмотр или освидетельствование, какие технические средства были применены и какие получены результаты, какие предметы изъяты и опечатаны и какой печатью, куда направлены после осмотра труп или предметы, имеющие значение для уголовного дела.

Статья 105. Следственный эксперимент
В целях проверки и уточнения данных, имеющих значение для уголовного дела, следователь вправе произвести следственный эксперимент путем воспроизведения действий, а также обстановки или иных обстоятельств определенного события. При этом проверяется возможность восприятия каких-либо фактов, совершения определенных действий, наступления какого-либо события, а также выявляются последовательность происшедшего события и механизм образования следов. Производство следственного эксперимента допускается, если не создается опасность для здоровья участвующих в нем лиц.

Глава 23. ОБЫСК. ВЫЕМКА
​
Статья 106. Основания и порядок производства обыска
1. Основанием производства обыска является наличие достаточных данных полагать, что в каком-либо месте или у какого-либо лица могут находиться орудия, оборудование или иные средства совершения преступления, предметы, документы и ценности, которые могут иметь значение для уголовного дела.
2. Обыск производится на основании постановления следователя.
3. Обыск в жилище производится на основании судебного решения
4. До начала обыска следователь предъявляет постановление о его производстве, а в случаях, предусмотренных частью третьей настоящей статьи, - судебное решение, разрешающее его производство.
5. До начала обыска следователь предлагает добровольно выдать подлежащие изъятию предметы, документы и ценности, которые могут иметь значение для уголовного дела. Если они выданы добровольно и нет оснований опасаться их сокрытия, то следователь вправе не производить обыск. При производстве обыска могут вскрываться любые помещения, если владелец отказывается добровольно их открыть. При этом не должно допускаться не вызываемое необходимостью повреждение имущества.
7. Следователь принимает меры к тому, чтобы не были оглашены выявленные в ходе обыска обстоятельства частной жизни лица, в помещении которого был произведен обыск, его личная и (или) семейная тайна, а также обстоятельства частной жизни других лиц.
8. Следователь вправе запретить лицам, присутствующим в месте, где производится обыск, покидать его, а также общаться друг с другом или иными лицами до окончания обыска.
9. При производстве обыска во всяком случае изымаются предметы и документы, изъятые из оборота.
10. При производстве обыска составляется протокол.
11. В протоколе должно быть указано, в каком месте и при каких обстоятельствах были обнаружены предметы, документы или ценности, выданы они добровольно или изъяты принудительно. Все изымаемые предметы, документы и ценности должны быть перечислены с точным указанием их количества, меры, веса, индивидуальных признаков и по возможности стоимости.
12. Обыск может производиться и в целях обнаружения разыскиваемых лиц и трупов.

Статья 107. Основания и порядок производства выемки
1. При необходимости изъятия определенных предметов и документов, имеющих значение для уголовного дела, и если точно известно, где и у кого они находятся, производится их выемка.
2. Выемка производится в порядке, установленном статьей 106 настоящего Кодекса, с изъятиями, предусмотренными настоящей статьей.
3. Выемка предметов и документов, содержащих государственную или иную охраняемую федеральным законом тайну производится на основании судебного решения.

Статья 108. Личный обыск
1. При наличии оснований и в порядке, которые предусмотрены частями первой и третьей статьи 106 настоящего Кодекса, производится личный обыск подозреваемого, обвиняемого в целях обнаружения и изъятия предметов и документов, могущих иметь значение для уголовного дела.
2. Личный обыск может быть произведен без соответствующего постановления при задержании лица или заключении его под стражу, а также при наличии достаточных оснований полагать, что лицо, находящееся в помещении или ином месте, в котором производится обыск, скрывает при себе предметы или документы, которые могут иметь значение для уголовного дела.

Глава 24. ДОПРОС. ОЧНАЯ СТАВКА. ОПОЗНАНИЕ
​
Статья 109. Место и время допроса
1. Допрос проводится по месту производства предварительного следствия. Следователь вправе, если признает это необходимым, провести допрос в месте нахождения допрашиваемого.
2. Допрос не может длиться непрерывно более 2 часов.
3. Продолжение допроса допускается после перерыва не менее чем на 30 минут для отдыха и принятия пищи, причем общая продолжительность допроса в течение дня не должна превышать 4 часов.
4. При наличии медицинских показаний продолжительность допроса устанавливается на основании заключения врача.

Статья 110. Порядок вызова на допрос
1. Свидетель, потерпевший вызывается на допрос повесткой, в которой указываются, кто и в каком качестве вызывается, к кому и по какому адресу, дата и время явки на допрос, а также последствия неявки без уважительных причин.
2. Повестка вручается лицу, вызываемому на допрос, под расписку либо передается с помощью средств связи.
3. Лицо, вызываемое на допрос, обязано явиться в назначенный срок либо заранее уведомить следователя о причинах неявки. В случае неявки без уважительных причин лицо, вызываемое на допрос, может быть подвергнуто приводу либо к нему могут быть применены иные меры процессуального принуждения.
4. Военнослужащий вызывается на допрос через командование воинской части.

Статья 111. Протокол допроса
1. Ход и результаты допроса отражаются в протоколе допроса.
2. Показания допрашиваемого лица записываются от первого лица и по возможности дословно. Вопросы и ответы на них записываются в той последовательности, которая имела место в ходе допроса. В протокол записываются все вопросы, в том числе и те, которые были отведены следователем или на которые отказалось отвечать допрашиваемое лицо, с указанием мотивов отвода или отказа.
3. Допрашиваемым лицом в ходе допроса могут быть изготовлены схемы, чертежи, рисунки, диаграммы, которые приобщаются к протоколу, о чем в нем делается соответствующая запись.
4. По окончании допроса протокол предъявляется допрашиваемому лицу для прочтения либо по его просьбе оглашается следователем, о чем в протоколе делается соответствующая запись. Ходатайство допрашиваемого о дополнении и об уточнении протокола подлежит обязательному удовлетворению.
5. В протоколе указываются все лица, участвовавшие в допросе. Каждый из них должен подписать протокол, а также все сделанные к нему дополнения и уточнения.
6. Факт ознакомления с показаниями и правильность их записи допрашиваемое лицо удостоверяет своей подписью в конце протокола. Допрашиваемое лицо подписывает также каждую страницу протокола.
7. Отказ от подписания протокола допроса или невозможность его подписания лицами, участвовавшими в допросе, удостоверяется в порядке, установленном настоящим Кодексом.

Статья 112. Очная ставка
1. Если в показаниях ранее допрошенных лиц имеются существенные противоречия, то следователь вправе провести очную ставку.
2. Следователь выясняет у лиц, между которыми проводится очная ставка, знают ли они друг друга и в каких отношениях находятся между собой. Допрашиваемым лицам поочередно предлагается дать показания по тем обстоятельствам, для выяснения которых проводится очная ставка. После дачи показаний следователь может задавать вопросы каждому из допрашиваемых лиц. Лица, между которыми проводится очная ставка, могут с разрешения следователя задавать вопросы друг другу.
3. В ходе очной ставки следователь вправе предъявить вещественные доказательства и документы.
4. В протоколе очной ставки показания допрашиваемых лиц записываются в той очередности, в какой они давались. Каждое из допрашиваемых лиц подписывает свои показания, каждую страницу протокола и протокол в целом.

Статья 113. Предъявление для опознания
1. Следователь может предъявить для опознания лицо или предмет свидетелю, потерпевшему, подозреваемому или обвиняемому.
2. Опознающие предварительно допрашиваются об обстоятельствах, при которых они видели предъявленные для опознания лицо или предмет, а также о приметах и особенностях, по которым они могут его опознать.
3. Не может проводиться повторное опознание лица или предмета тем же опознающим и по тем же признакам.
4. Лицо предъявляется для опознания вместе с другими лицами, по возможности внешне сходными с ним. Общее число лиц, предъявляемых для опознания, должно быть не менее трех. Перед началом опознания опознаваемому предлагается занять любое место среди предъявляемых лиц, о чем в протоколе опознания делается соответствующая запись.

Глава 25. ПРОИЗВОДСТВО СУДЕБНОЙ ЭКСПЕРТИЗЫ
​
Статья 114. Порядок назначения судебной экспертизы
1. Признав необходимым назначение судебной экспертизы, следователь выносит об этом постановление, а в случаях, возбуждает перед судом ходатайство, в котором указываются:
1) основания назначения судебной экспертизы;
2) фамилия, имя и отчество эксперта или наименование экспертного учреждения, в котором должна быть произведена судебная экспертиза;
3) вопросы, поставленные перед экспертом;
4) материалы, предоставляемые в распоряжение эксперта.
2. Судебная экспертиза производится государственными судебными экспертами и иными экспертами из числа лиц, обладающих специальными знаниями.
3. Следователь знакомит с постановлением о назначении судебной экспертизы подозреваемого, обвиняемого, его защитника, потерпевшего, его представителя и разъясняет им права, предусмотренные настоящим Кодексом. Об этом составляется протокол, подписываемый следователем и лицами, которые ознакомлены с постановлением.

Статья 115. Обязательное назначение судебной экспертизы
Назначение и производство судебной экспертизы обязательно, если необходимо установить:
1) причины смерти;
2) характер и степень вреда, причиненного здоровью;
3) психическое или физическое состояние подозреваемого, обвиняемого, когда возникает сомнение в его вменяемости или способности самостоятельно защищать свои права и законные интересы в уголовном судопроизводстве, в том числе его нуждаемость в лечении в стационарных условиях;
3.1) психическое или физическое состояние подозреваемого, обвиняемого, когда имеются основания полагать, что он является больным наркоманией;
4) психическое или физическое состояние потерпевшего, когда возникает сомнение в его способности правильно воспринимать обстоятельства, имеющие значение для уголовного дела, и давать показания;

Статья 116. Права подозреваемого, обвиняемого, потерпевшего, свидетеля при назначении и производстве судебной экспертизы
1. При назначении и производстве судебной экспертизы подозреваемый, обвиняемый, его защитник, потерпевший, представитель вправе:
1) знакомиться с постановлением о назначении судебной экспертизы;
2) заявлять отвод эксперту или ходатайствовать о производстве судебной экспертизы в другом экспертном учреждении;
3) ходатайствовать о привлечении в качестве экспертов указанных ими лиц либо о производстве судебной экспертизы в конкретном экспертном учреждении;
4) ходатайствовать о внесении в постановление о назначении судебной экспертизы дополнительных вопросов эксперту;
5) присутствовать с разрешения следователя при производстве судебной экспертизы, давать объяснения эксперту;
6) знакомиться с заключением эксперта или сообщением о невозможности дать заключение, а также с протоколом допроса эксперта.
2. Свидетель, в отношении которого производилась судебная экспертиза, вправе знакомиться с заключением эксперта.

Статья 117. Присутствие следователя при производстве судебной экспертизы
1. Следователь вправе присутствовать при производстве судебной экспертизы, получать разъяснения эксперта по поводу проводимых им действий.
2. Факт присутствия следователя при производстве судебной экспертизы отражается в заключении эксперта.

Статья 118. Получение образцов для сравнительного исследования
1. Следователь вправе получить образцы почерка или иные образцы для сравнительного исследования у подозреваемого, обвиняемого, свидетеля, потерпевшего, а также у иных физических лиц в случаях, если возникла необходимость проверить, оставлены ли ими следы в определенном месте или на вещественных доказательствах, и составить протокол в соответствии с настоящим Кодексом. Получение образцов для сравнительного исследования может быть произведено до возбуждения уголовного дела.
2. При получении образцов для сравнительного исследования не должны применяться методы, опасные для жизни и здоровья человека или унижающие его честь и достоинство.
3. О получении образцов для сравнительного исследования следователь выносит постановление. В необходимых случаях получение образцов производится с участием специалистов.

Статья 119. Заключение эксперта
1. В заключении эксперта указываются:
1) дата, время и место производства судебной экспертизы;
2) основания производства судебной экспертизы;
3) должностное лицо, назначившее судебную экспертизу;
4) сведения об экспертном учреждении, а также фамилия, имя и отчество эксперта, его образование, специальность, стаж работы, ученая степень и (или) ученое звание, занимаемая должность;
5) сведения о предупреждении эксперта об ответственности за дачу заведомо ложного заключения;
6) вопросы, поставленные перед экспертом;
7) объекты исследований и материалы, представленные для производства судебной экспертизы;
8) данные о лицах, присутствовавших при производстве судебной экспертизы;
9) содержание и результаты исследований с указанием примененных методик;
10) выводы по поставленным перед экспертом вопросам и их обоснование.
2. Если при производстве судебной экспертизы эксперт установит обстоятельства, которые имеют значение для уголовного дела, но по поводу которых ему не были поставлены вопросы, то он вправе указать на них в своем заключении.
3. Материалы, иллюстрирующие заключение эксперта (фотографии, схемы, графики и т.п.), прилагаются к заключению и являются его составной частью.

Статья 120. Допрос эксперта
1. Следователь вправе по собственной инициативе либо по ходатайству лиц, указанных в части первой статьи 121 настоящего Кодекса, допросить эксперта для разъяснения данного им заключения. Допрос эксперта до представления им заключения не допускается.
2. Эксперт не может быть допрошен по поводу сведений, ставших ему известными в связи с производством судебной экспертизы, если они не относятся к предмету данной судебной экспертизы.
3. Протокол допроса эксперта составляется в соответствии со статьями настоящего Кодекса.

Статья 121. Предъявление заключения эксперта
1. Заключение эксперта или его сообщение о невозможности дать заключение, а также протокол допроса эксперта предъявляются следователем потерпевшему, его представителю, подозреваемому, обвиняемому, его защитнику, которым разъясняется при этом право ходатайствовать о назначении дополнительной либо повторной судебной экспертизы.


Глава 26. ПРИОСТАНОВЛЕНИЕ И ВОЗОБНОВЛЕНИЕ ПРЕДВАРИТЕЛЬНОГО СЛЕДСТВИЯ
​
Статья 122. Основания, порядок и сроки приостановления предварительного следствия
1. Предварительное следствие приостанавливается при наличии одного из следующих оснований:
1) лицо, подлежащее привлечению в качестве обвиняемого, не установлено;
2) подозреваемый или обвиняемый скрылся от следствия либо место его нахождения не установлено по иным причинам;
3) место нахождения подозреваемого или обвиняемого известно, однако реальная возможность его участия в уголовном деле отсутствует;
2. О приостановлении предварительного следствия следователь выносит постановление, копию которого направляет руководителю следственного органа.
3. Если по уголовному делу привлечено два или более обвиняемых, а основания для приостановления относятся не ко всем обвиняемым, то следователь вправе выделить в отдельное производство и приостановить уголовное дело в отношении отдельных обвиняемых.

Статья 123. Действия следователя после приостановления предварительного следствия
1. Приостановив предварительное следствие, следователь уведомляет об этом потерпевшего, его представителя, гражданского истца, гражданского ответчика или их представителей и одновременно разъясняет им порядок обжалования данного решения. О приостановлении предварительного следствия.
2. После приостановления предварительного следствия следователь:
1) в случае, предусмотренном пунктом 1 части первой статьи 122 настоящего Кодекса, принимает меры по установлению лица, подлежащего привлечению в качестве подозреваемого или обвиняемого;
2) в случае, предусмотренном пунктом 2 части первой статьи 122 настоящего Кодекса, устанавливает место нахождения подозреваемого или обвиняемого, а если он скрылся, принимает меры по его розыску.
3. После приостановления предварительного следствия производство следственных действий не допускается.

Статья 124. Розыск подозреваемого, обвиняемого
1. Если место нахождения подозреваемого, обвиняемого неизвестно, то следователь поручает его розыск о чем указывает в постановлении о приостановлении предварительного следствия или выносит отдельное постановление.
2. Розыск подозреваемого, обвиняемого может быть объявлен как во время производства предварительного следствия, так и одновременно с его приостановлением.
3. В случае обнаружения обвиняемого он может быть задержан в порядке, установленном главой 11 настоящего Кодекса.
4. При наличии оснований, предусмотренных статьей 67 настоящего Кодекса, в отношении разыскиваемого обвиняемого может быть избрана мера пресечения. В случаях, предусмотренных статьей 71 настоящего Кодекса, в качестве меры пресечения может быть избрано заключение под стражу.

Статья 125. Возобновление приостановленного предварительного следствия
1. Предварительное следствие возобновляется на основании постановления следователя после того, как:
1) отпали основания его приостановления;
2) возникла необходимость производства следственных действий, которые могут быть осуществлены без участия подозреваемого, обвиняемого;

Глава 27. ПРЕКРАЩЕНИЕ УГОЛОВНОГО ДЕЛА​

Статья 126. Основания прекращения уголовного дела и уголовного преследования
1. Уголовное дело и уголовное преследование прекращаются при наличии оснований, предусмотренных статьями 17 - 19 настоящего Кодекса.
2. В случаях прекращения уголовного дела по основаниям, предусмотренным пунктами 1 и 2 части первой статьи 17 и пунктом 1 части первой статьи 19 настоящего Кодекса, следователь или руководитель следственного органа принимает предусмотренные главой 16 настоящего Кодекса меры по реабилитации лица.
Статья 127. Постановление о прекращении уголовного дела и уголовного преследования
1. Уголовное дело прекращается по постановлению следователя, копия которого направляется руководителю следственного органа.
2. В постановлении указываются:
1) дата и место его вынесения;
2) должность, фамилия, инициалы лица, его вынесшего;
3) обстоятельства, послужившие поводом и основанием для возбуждения уголовного дела;
4) пункт, часть, статья Уголовного кодекса, предусматривающие преступление, по признакам которого было возбуждено уголовное дело;
5) результаты предварительного следствия с указанием данных о лицах, в отношении которых осуществлялось уголовное преследование;
6) применявшиеся меры пресечения;
7) пункт, часть, статья настоящего Кодекса, на основании которых прекращаются уголовное дело и (или) уголовное преследование;
8) решение об отмене меры пресечения, а также наложения ареста на имущество, корреспонденцию, временного отстранения от должности, контроля и записи переговоров;
9) решение о вещественных доказательствах, в том числе с указанием на то, что они признаны таковыми по другому уголовному делу (другим уголовным делам);
10) порядок обжалования данного постановления.
3. В случаях, когда в соответствии с настоящим Кодексом прекращение уголовного дела допускается только при согласии обвиняемого или потерпевшего, наличие такого согласия отражается в постановлении.
4. Следователь вручает либо направляет копию постановления о прекращении уголовного дела лицу, в отношении которого прекращено уголовное преследование, потерпевшему, гражданскому истцу и гражданскому ответчику, а также командованию воинской части (учреждения) в случае прекращения уголовного преследования. При этом потерпевшему, гражданскому истцу разъясняется право предъявить иск в порядке гражданского судопроизводства, если уголовное дело прекращается по основаниям, предусмотренным пунктами 2 - 6 части первой статьи 17 и иными статьями настоящего Кодекса.

Статья 128. Отмена постановления о прекращении уголовного дела или уголовного преследования
1. Признав постановление руководителя следственного органа или следователя о прекращении уголовного дела или уголовного преследования (за исключением дел частного обвинения) незаконным или необоснованным, суд в срок не позднее 14 суток с момента получения материалов уголовного дела отменяет его, о чем выносит постановление с изложением конкретных обстоятельств, подлежащих дополнительному расследованию, которое вместе с материалами уголовного дела незамедлительно направляет руководителю следственного органа. По делам частного обвинения постановление о прекращении уголовного дела суд может отменить только при наличии жалобы заинтересованного лица. Признав постановление о прекращении уголовного дела или уголовного преследования незаконным или необоснованным, суд отменяет его и возобновляет производство по уголовному делу. Признав постановление следователя о прекращении уголовного дела или уголовного преследования незаконным или необоснованным, руководитель следственного органа отменяет его и возобновляет производство по уголовному делу.
2. Если суд признает постановление руководителя следственного органа, следователя о прекращении уголовного дела или уголовного преследования незаконным или необоснованным, то он выносит в порядке, установленным настоящим Кодексом, соответствующее решение и направляет его руководителю следственного органа для исполнения. Если суд признает постановление руководителя следственного органа о прекращении уголовного дела или уголовного преследования незаконным или необоснованным, то он выносит в порядке, установленном настоящим Кодексом, соответствующее решение и направляет его руководителю следственного органа для исполнения.

Статья 128.1. Судебный порядок получения разрешения отмены постановления о прекращении уголовного дела или уголовного преследования
1. В случае, предусмотренном частью первой статьи 128 настоящего Кодекса, руководитель следственного органа возбуждают перед судом ходатайство о разрешении отмены постановления о прекращении уголовного дела или уголовного преследования (далее также в настоящей статье - ходатайство), о чем выносится соответствующее постановление. В постановлении о возбуждении ходатайства излагаются конкретные, фактические обстоятельства, в том числе новые сведения, подлежащие дополнительному расследованию. К постановлению прилагаются материалы, подтверждающие обоснованность ходатайства.
2. Ходатайство рассматривается единолично судьей областного или военного суда соответствующего уровня по месту производства предварительного расследования с обязательным участием лица, возбудившего ходатайство, не позднее 14 суток со дня поступления материалов в суд. В судебном заседании вправе также участвовать лицо, в отношении которого прекращено уголовное дело или уголовное преследование, его защитник и (или) законный представитель, потерпевший, его законный представитель и (или) представитель. Неявка в судебное заседание лиц, своевременно извещенных о времени рассмотрения ходатайства, не является препятствием для рассмотрения ходатайства судом.

Глава 28. НАПРАВЛЕНИЕ УГОЛОВНОГО ДЕЛА С ОБВИНИТЕЛЬНЫМ ЗАКЛЮЧЕНИЕМ РУКОВОДИТЕЛЮ СЛЕДСТВЕННОГО ОРГАНА.
​
Статья 129. Окончание предварительного следствия с обвинительным заключением
1. Признав, что все следственные действия по уголовному делу произведены, а собранные доказательства достаточны для составления обвинительного заключения, следователь уведомляет об этом обвиняемого и разъясняет ему право на ознакомление со всеми материалами уголовного дела как лично, так и с помощью защитника, о чем составляется протокол.
2. Следователь уведомляет об окончании следственных действий защитника обвиняемого, если они участвуют в уголовном деле, а также потерпевшего.
3. Если защитник обвиняемого или представитель потерпевшего по уважительным причинам не могут явиться для ознакомления с материалами уголовного дела в назначенное время, то следователь откладывает ознакомление на срок не более 5 суток.
4. В случае невозможности избранного обвиняемым защитника явиться для ознакомления с материалами уголовного дела следователь по истечении 5 суток вправе предложить обвиняемому избрать другого защитника или при наличии ходатайства обвиняемого принимает меры для явки другого защитника. Если обвиняемый отказывается от назначенного защитника, то следователь предъявляет ему материалы уголовного дела для ознакомления без участия защитника, за исключением случаев, когда участие защитника в уголовном деле в соответствии со статьей 37 настоящего Кодекса является обязательным.
5. Если обвиняемый, не содержащийся под стражей, не является для ознакомления с материалами уголовного дела без уважительных причин, то следователь по истечении 5 суток со дня объявления об окончании следственных действий либо со дня окончания ознакомления с материалами уголовного дела иных участников уголовного судопроизводства, указанных в части второй настоящей статьи, составляет обвинительное заключение и направляет материалы уголовного дела руководителю следственного органа.

Статья 130. Ознакомление потерпевшего или его представителя с материалами уголовного дела
1. По ходатайству потерпевшего или его представителя следователь знакомит этих лиц с материалами уголовного дела полностью или частично, за исключением следующих документов:
Ходатайство о заключении досудебного соглашения о сотрудничестве, постановление следователя о возбуждении перед руководителем следственного органа ходатайства о заключении с подозреваемым или обвиняемым досудебного соглашения о сотрудничестве, постановление руководителя следственного органа об удовлетворении ходатайства о заключении досудебного соглашения о сотрудничестве, досудебное соглашение о сотрудничестве приобщаются к уголовному делу.

Статья 131. Ознакомление обвиняемого и его защитника с материалами уголовного дела
1. После выполнения требования статьи 130 настоящего Кодекса следователь предъявляет обвиняемому и его защитнику подшитые и пронумерованные материалы уголовного дела. Для ознакомления предъявляются также вещественные доказательства и по просьбе обвиняемого или его защитника фотографии, материалы аудио- и (или) видеозаписи, киносъемки и иные приложения к протоколам следственных действий. В случае невозможности предъявления вещественных доказательств следователь выносит об этом постановление. Если в производстве по уголовному делу участвуют несколько обвиняемых, то последовательность предоставления им и их защитникам материалов уголовного дела устанавливается следователем.

Статья 132. Протокол ознакомления с материалами уголовного дела
1. По окончании ознакомления обвиняемого и его защитника с материалами уголовного дела следователь составляет протокол. В протоколе указываются даты начала и окончания ознакомления с материалами уголовного дела, заявленные ходатайства и иные заявления.

Статья 133. Обвинительное заключение
1. В обвинительном заключении следователь указывает:
1) фамилии, имена и отчества обвиняемого или обвиняемых;
2) данные о личности каждого из них;
3) существо обвинения, место и время совершения преступления, его способы, мотивы, цели, последствия и другие обстоятельства, имеющие значение для данного уголовного дела;
4) формулировку предъявленного обвинения с указанием пункта, части, статьи Уголовного кодекса, предусматривающих ответственность за данное преступление;
5) перечень доказательств, подтверждающих обвинение, и краткое изложение их содержания;
6) перечень доказательств, на которые ссылается сторона защиты, и краткое изложение их содержания;
7) обстоятельства, смягчающие и отягчающие наказание;
8) данные о потерпевшем, характере и размере вреда, причиненного ему преступлением;
9) данные о гражданском истце и гражданском ответчике.
2. Обвинительное заключение должно содержать ссылки на тома и листы уголовного дела.
3. Обвинительное заключение подписывается следователем с указанием места и даты его составления.
4. К обвинительному заключению прилагается список подлежащих вызову в судебное заседание лиц со стороны обвинения и защиты с указанием их места жительства и (или) места нахождения.



Глава 29. Действия и решения руководителя следственного органа по уголовному делу, поступившему с обвинительным заключением​

Статья 134. Решение руководителя следственного органа по уголовному делу
1. Руководитель следственного органа рассматривает поступившее от следователя уголовное дело с обвинительным заключением и в течение 10 суток принимает по нему одно из следующих решений:
1) об утверждении обвинительного заключения и о направлении уголовного дела в суд;
2) о возвращении уголовного дела следователю для производства дополнительного следствия, изменения объема обвинения либо квалификации действий обвиняемых или пересоставления обвинительного заключения и устранения выявленных недостатков со своими письменными указаниями;
2. Постановление руководителя следственного органа о возвращении уголовного дела следователю может быть обжаловано им в течение 72 часов с момента поступления к нему уголовного дела суду.

Статья 135. Направление уголовного дела в суд
1. После утверждения обвинительного заключения руководитель следственного органа направляет уголовное дело в суд, о чем уведомляет обвиняемого, его защитника, потерпевшего, гражданского истца, гражданского ответчика и (или) представителей и разъясняет им право заявлять ходатайство о проведении предварительного слушания в порядке, установленном главой 14 настоящего Кодекса.
2. Копия обвинительного заключения с приложениями вручается руководителем следственного органа обвиняемому. Копии обвинительного заключения вручаются также защитнику и потерпевшему, если они ходатайствуют об этом.

Глава 23. Общий порядок подготовки к судебному заседанию
​
Статья 136. Полномочия судьи по поступившему в суд уголовному делу
1. По поступившему уголовному делу судья принимает одно из следующих решений:

1) о назначении предварительного слушания;

2) о назначении судебного заседания.

2. Решение судьи оформляется постановлением, в котором указываются:

1) дата и место вынесения постановления;

2) наименование суда, фамилия и инициалы судьи, вынесшего постановление;

3) основания принятого решения.

3. Решение принимается в срок не позднее 10 суток со дня поступления уголовного дела в суд. По просьбе стороны суд вправе предоставить ей возможность для дополнительного ознакомления с материалами уголовного дела.

3.1. В случае, если с уголовным делом поступило постановление о сохранении в тайне данных о личности участника уголовного судопроизводства, судья принимает меры, исключающие возможность ознакомления с указанным постановлением иных участников уголовного судопроизводства.

4. Копия постановления судьи направляется обвиняемому, потерпевшему и руководителю следственного органа.


Статья 137. Назначение судебного заседания
1. При отсутствии оснований для принятия решений, судья выносит постановление о назначении судебного заседания без проведения предварительного слушания.

2. В постановлении помимо вопросов разрешаются следующие вопросы:

1) о месте, дате и времени судебного заседания;

2) о рассмотрении уголовного дела судьей единолично или судом коллегиально;

3) о вызове в судебное заседание лиц по спискам, представленным сторонами;

4) о рассмотрении уголовного дела в закрытом судебном заседании.

3. В постановлении также должны содержаться решения о назначении судебного заседания с указанием фамилии, имени и отчества каждого обвиняемого и квалификации вменяемого ему в вину преступления, а также о мере пресечения.

4. Стороны должны быть извещены о месте, дате и времени судебного заседания не менее чем за 24 часа до его начала.


Статья 138. Вызовы в судебное заседание
Судья дает распоряжение о вызове в судебное заседание лиц, указанных в его постановлении, а также принимает иные меры по подготовке судебного заседания.

Глава 24. Общие условия судебного разбирательства
​
Статья 139. Непосредственность и устность
1. В судебном разбирательстве все доказательства по уголовному делу подлежат непосредственному исследованию. Суд заслушивает показания подсудимого, потерпевшего, свидетелей, заключение эксперта, осматривает вещественные доказательства, оглашает протоколы и иные документы, производит другие судебные действия по исследованию доказательств.
2. Приговор суда может быть основан лишь на тех доказательствах, которые были исследованы в судебном заседании.

Статья 140. Гласность
1. Разбирательство уголовных дел во всех судах открытое, за исключением случаев, предусмотренных настоящей статьей.
2. Закрытое судебное разбирательство допускается на основании определения или постановления суда в случаях, когда:
1) разбирательство уголовного дела в суде может привести к разглашению государственной или иной охраняемой федеральным законом тайны;
2) рассмотрение уголовных дел о преступлениях против половой неприкосновенности и половой свободы личности и других преступлениях может привести к разглашению сведений об интимных сторонах жизни участников уголовного судопроизводства либо сведений, унижающих их честь и достоинство;
3) этого требуют интересы обеспечения безопасности участников судебного разбирательства, их близких родственников, родственников или близких лиц.
3. Уголовное дело рассматривается в закрытом судебном заседании с соблюдением всех норм уголовного судопроизводства и с учетом особенностей, предусмотренных настоящим Кодексом. Определение или постановление суда о рассмотрении уголовного дела в закрытом судебном заседании может быть вынесено в отношении всего судебного разбирательства либо соответствующей его части.
4. Лица, присутствующие в открытом судебном заседании, вправе вести аудиозапись и письменную запись. Фотографирование, видеозапись и (или) киносъемка, а также трансляция открытого судебного заседания по радио, телевидению или в информационно-телекоммуникационной сети "Интернет" допускается с разрешения председательствующего в судебном заседании. Трансляция открытого судебного заседания на стадии досудебного производства по радио, телевидению или в информационно-телекоммуникационной сети "Интернет" не допускается.
5. Приговор суда провозглашается в открытом судебном заседании. В случае рассмотрения уголовного дела в закрытом судебном заседании могут оглашаться только вводная и резолютивная части приговора.

Статья 141. Равенство прав сторон
В судебном заседании стороны обвинения и защиты пользуются равными правами на заявление отводов и ходатайств, представление доказательств, участие в их исследовании, выступление в судебных прениях, представление суду письменных формулировок, на рассмотрение иных вопросов, возникающих в ходе судебного разбирательства.

Статья 142. Пределы судебного разбирательства
1. Судебное разбирательство проводится только в отношении обвиняемого и лишь по предъявленному ему обвинению.
2. Изменение обвинения в судебном разбирательстве допускается, если этим не ухудшается положение подсудимого и не нарушается его право на защиту.

Статья 143. Регламент судебного заседания
1. При входе судей все присутствующие в зале судебного заседания встают.
2. Все участники судебного разбирательства обращаются к суду, дают показания и делают заявления стоя. Отступление от этого правила может быть допущено с разрешения председательствующего.
3. Участники судебного разбирательства, а также иные лица, присутствующие в зале судебного заседания, обращаются к суду со словами "Уважаемый суд", а к судье - "Ваша честь".
4. Сотрудник органов принудительного исполнения обеспечивает порядок судебного заседания, выполняет распоряжения председательствующего. Требования сотрудника органов принудительного исполнения обязательны для лиц, присутствующих в зале судебного заседания.
5. Судебное разбирательство проводится в условиях, обеспечивающих установленный порядок судебного заседания и безопасность участников уголовного судопроизводства. Действия лиц, присутствующих в зале судебного заседания и осуществляющих разрешенные судом фотографирование, видеозапись и (или) киносъемку, трансляцию по радио, телевидению или в информационно-телекоммуникационной сети "Интернет", не должны нарушать установленный порядок судебного заседания. Эти действия могут быть ограничены судом во времени и должны
осуществляться на указанных судом местах в зале судебного заседания и с учетом мнения лиц, участвующих в деле.

Глава 25. ПРЕНИЯ СТОРОН И ПОСЛЕДНЕЕ СЛОВО ПОДСУДИМОГО
​
Статья 144. Содержание и порядок прений сторон
1. Прения сторон состоят из речей обвинителя и защитника. При отсутствии защитника в прениях сторон участвует подсудимый. В прениях сторон могут также участвовать потерпевший и его представитель.
2. Последовательность выступлений участников прений сторон устанавливается судом. При этом первым во всех случаях выступает обвинитель, а последними - подсудимый и его защитник.
3. Участник прений сторон не вправе ссылаться на доказательства, которые не рассматривались в судебном заседании или признаны судом недопустимыми.
4. Суд не вправе ограничивать продолжительность прений сторон. При этом председательствующий вправе останавливать участвующих в прениях лиц, если они касаются обстоятельств, не имеющих отношения к рассматриваемому уголовному делу, а также доказательств, признанных недопустимыми.
5. После произнесения речей всеми участниками прений сторон каждый из них может выступить еще один раз с репликой. Право последней реплики принадлежит подсудимому или его защитнику.

Статья 145. Последнее слово подсудимого
1. После окончания прений сторон председательствующий предоставляет подсудимому последнее слово. Никакие вопросы к подсудимому во время его последнего слова не допускаются.
2. Суд не может ограничивать продолжительность последнего слова подсудимого определенным временем. При этом председательствующий вправе останавливать подсудимого в случаях, когда обстоятельства, излагаемые подсудимым, не имеют отношения к рассматриваемому уголовному делу.

Статья 146. Возобновление судебного следствия
Если участники прений сторон или подсудимый в последнем слове сообщат о новых обстоятельствах, имеющих значение для уголовного дела, или заявят о необходимости предъявить суду для исследования новые доказательства, то суд вправе возобновить судебное следствие. По окончании возобновленного судебного следствия суд вновь открывает прения сторон и предоставляет подсудимому последнее слово.

Статья 147. Удаление суда в совещательную комнату для постановления приговора
1. Заслушав последнее слово подсудимого, суд удаляется в совещательную комнату для постановления приговора, о чем председательствующий объявляет присутствующим в зале судебного заседания.
2. Перед удалением суда в совещательную комнату участникам судебного разбирательства должно быть объявлено время оглашения приговора.

Глава 26. ПОСТАНОВЛЕНИЕ ПРИГОВОРА​

Статья 148. Постановление приговора
Суд постановляет приговор от имени суда, выносящего данный приговор

Статья 149. Законность, обоснованность и справедливость приговора
1. Приговор суда должен быть законным, обоснованным и справедливым.
2. Приговор признается законным, обоснованным и справедливым, если он постановлен в соответствии с требованиями настоящего Кодекса и основан на правильном применении уголовного закона.

Статья 150. Тайна совещания судей
1. Приговор постановляется судом в совещательной комнате. Во время постановления приговора в этой комнате могут находиться лишь судьи, входящие в состав суда по данному уголовному делу.
2. По окончании рабочего времени, а также в течение рабочего дня суд вправе сделать перерыв для отдыха с выходом из совещательной комнаты. Судьи не вправе разглашать суждения, имевшие место при обсуждении и постановлении приговора, или иным способом раскрывать тайну совещания судей.

Статья 151. Вопросы, разрешаемые судом при постановлении приговора
При постановлении приговора суд в совещательной комнате разрешает следующие вопросы:
1) доказано ли, что имело место деяние, в совершении которого обвиняется подсудимый;
2) доказано ли, что деяние совершил подсудимый;
3) является ли это деяние преступлением и какими пунктом, частью, статьей Уголовного кодекса оно предусмотрено;
4) виновен ли подсудимый в совершении этого преступления;
5) подлежит ли подсудимый наказанию за совершенное им преступление;
6) имеются ли обстоятельства, смягчающие или отягчающие наказание;
7) какое наказание должно быть назначено подсудимому;
8) имеются ли основания для постановления приговора без назначения наказания;
9) какой вид исправительного учреждения и режим должны быть определены подсудимому при назначении ему наказания в виде лишения свободы;
10) на кого и в каком размере должны быть возложены процессуальные издержки;
11) должен ли суд лишить подсудимого специального, воинского или почетного звания, классного чина, а также государственных наград.

Статья 152. Порядок совещания судей при коллегиальном рассмотрении уголовного дела
1. При постановлении приговора в совещательной комнате, если уголовное дело рассматривалось судом коллегиально, председательствующий ставит на разрешение вопросы в порядке, установленном статьей 106 настоящего Кодекса.
2. При разрешении каждого вопроса судья не вправе воздержаться от голосования, за исключением случаев, предусмотренных частью третьей настоящей статьи. Все вопросы разрешаются большинством голосов. Председательствующий голосует последним.
3. Судье, голосовавшему за оправдание подсудимого и оставшемуся в меньшинстве, предоставляется право воздержаться от голосования по вопросам применения уголовного закона. Если мнения судей по вопросам о квалификации преступления или мере наказания разошлись, то голос, поданный за оправдание, присоединяется к голосу, поданному за квалификацию преступления по уголовному закону, предусматривающему менее тяжкое преступление, и за назначение менее сурового наказания.

Статья 153. Составление приговора
1. После разрешения вопросов, указанных в статье 151 настоящего Кодекса, суд переходит к составлению приговора. Он излагается на том языке, на котором проводилось судебное разбирательство, и состоит из вводной, описательно-мотивировочной и резолютивной частей.
2. Приговор должен быть написан от руки или изготовлен с помощью технических средств одним из судей, участвующих в его постановлении. Приговор подписывается всеми судьями.
3. Исправления в приговоре должны быть оговорены и удостоверены подписями всех судей в совещательной комнате до провозглашения приговора.
4. Если в ходе судебного разбирательства данные о личности потерпевшего, свидетеля или иных участников уголовного судопроизводства не раскрывались, суд в приговоре ссылается на псевдонимы этих лиц (с указанием этого факта).

Статья 154. Провозглашение приговора
После подписания приговора суд возвращается в зал судебного заседания и председательствующий провозглашает приговор. Все присутствующие в зале судебного заседания, включая состав суда, выслушивают приговор стоя.

Глава 27. ОБРАЩЕНИЕ К ИСПОЛНЕНИЮ ПРИГОВОРОВ, ОПРЕДЕЛЕНИЙ И ПОСТАНОВЛЕНИЙ
​
Статья 155. Вступление приговора в законную силу
Приговор суда вступает в законную силу с момента его провозглашения и может быть пересмотрен, путём подачи апелляционной жалобы.

Статья 156. Обязательность приговора, определения, постановления суда
1. Вступившие в законную силу приговор, определение, постановление суда обязательны для всех органов государственной власти, органов местного самоуправления, общественных объединений, должностных лиц, других физических и юридических лиц и подлежат неукоснительному исполнению на всей территории Нижегородской области.
2. Неисполнение приговора, определения, постановления суда влечет за собой ответственность, предусмотренную статьей 62 Уголовного кодекса.

Глава 28. ОСОБЕННОСТИ ПРОИЗВОДСТВА ПО УГОЛОВНЫМ ДЕЛАМ В ОТНОШЕНИИ ОТДЕЛЬНЫХ КАТЕГОРИЙ ЛИЦ
​
Статья 157. Категории лиц, в отношении которых применяется особый порядок производства по уголовным делам
1. Требования настоящей главы применяются при производстве по уголовным делам в отношении:
1) судьи федерального суда общей юрисдикции или мирового судьи.
2) губернатора
3) руководителя следственного органа
4) следователя
5) адвоката
2. Порядок производства по уголовным делам в отношении лиц, указанных в части первой настоящей статьи, устанавливается настоящим Кодексом с изъятиями, предусмотренными настоящей главой.

Статья 158. Возбуждение уголовного дела
1. Решение о возбуждении уголовного дела в отношении лица, указанного в части первой статьи 157 настоящего Кодекса, либо о привлечении его в качестве обвиняемого, если уголовное дело было возбуждено в отношении других лиц или по факту совершения деяния, содержащего признаки преступления, принимается:
1) в отношении судьи федерального суда общей юрисдикции - руководителем следственного органа,в чью подследственность входят признаки преступления с согласия дисциплинарной коллегии Нижегородского областного суда.
2) в отношении губернатора области - руководителем следственного органа федеральной службы безопасности области.
3) в отношении руководителя и следователя следственного органа, а также адвоката - руководителем следственного органа, орган которого определяется по решению суда в коллегиальном составе, в порядке, определяемом настоящим кодексом.
4) в отношении руководителя следственного органа Федеральной Службы Безопасности - исполняющий обязанности руководителя следственного органа Федеральной Службы Безопасности ,на основании заключения коллегии, состоящей из трех судей Нижегородского областного суда.

Статья 159. Задержание
Судья федерального суда, мировой судья, руководитель следственного органа, следователь, Губернатор Нижегородской области, прекративший исполнение своих полномочий, задержанные по подозрению в совершении преступления в порядке, установленном статьей 57 настоящего Кодекса, за исключением случаев задержания на месте преступления, должны быть освобождены немедленно после установления их личности.

Статья 160. Направление уголовного дела в суд
В случае, когда уголовное дело было возбуждено либо привлечение лица в качестве обвиняемого состоялось в порядке, установленном статьей 158 настоящего Кодекса, после окончания предварительного расследования уголовное дело в отношении такого лица направляется в суд, которому оно подсудно в соответствии с подсудностью, установленной статьями настоящего Кодекса.

`},{slug:"kas",abbr:"КАС",title:"Кодекс административного судопроизводства",notes:"Порядок обжалования и судопроизводства.",updated:"2025-02-23",content:`# Кодекс административного судопроизводства

##Раздел I. Общие положения.

Глава 1. Основные положения.​


Статья 1. Предмет регулирования настоящего Кодекса
1. Настоящий Кодекс регулирует порядок осуществления административного судопроизводства при рассмотрении и разрешении судами административных дел о защите нарушенных или оспариваемых прав, свобод и законных интересов граждан, прав и законных интересов организаций, а также других административных дел, возникающих из административных и иных публичных правоотношений и связанных с осуществлением судебного контроля за законностью и обоснованностью осуществления государственных или иных публичных полномочий.
2. Суды в порядке, предусмотренном настоящим Кодексом, рассматривают и разрешают подведомственные им административные дела о защите нарушенных или оспариваемых прав, свобод и законных интересов граждан, прав и законных интересов организаций, возникающие из административных и иных публичных правоотношений, в том числе административные дела:
1) об оспаривании нормативных правовых актов полностью или в части;
2) об оспаривании решений, действий (бездействия) органов государственной власти, иных государственных органов, органов военного управления, органов местного самоуправления, должностных лиц, государственных и муниципальных служащих;
2.1) о присуждении компенсации за нарушение условий содержания под стражей, содержания в исправительном учреждении;
3) о присуждении компенсации за нарушение права на судопроизводство в разумный срок по делам, рассматриваемым судами общей юрисдикции, или права на исполнение судебного акта суда общей юрисдикции в разумный срок.
3. Положения настоящего Кодекса не распространяются на производство по делам об административных правонарушениях.

Статья 2. Принципы административного судопроизводства
Принципами административного судопроизводства являются:
1) независимость судей;
2) равенство всех перед законом и судом;
3) законность и справедливость при рассмотрении и разрешении административных дел;
4) осуществление административного судопроизводства в разумный срок и исполнение судебных актов по административным делам в разумный срок;
5) гласность и открытость судебного разбирательства;
6) непосредственность судебного разбирательства;
7) состязательность и равноправие сторон административного судопроизводства при активной роли суда.

Статья 3. Независимость судей
1. При осуществлении административного судопроизводства судьи независимы, подчиняются только федеральному закону.
2. Любое вмешательство со стороны органов государственной власти, иных государственных органов, органов местного самоуправления, иных органов, организаций, должностных лиц и граждан в деятельность суда по осуществлению правосудия запрещается и влечет за собой ответственность, установленную федеральным законом.


Статья 4. Равенство всех перед законом и судом
1. Правосудие по административным делам осуществляется на основе принципа равенства всех перед законом и судом: граждан - независимо от пола, расы, национальности, языка, происхождения, имущественного и должностного положения, места жительства, отношения к религии, убеждений, принадлежности к общественным объединениям и других обстоятельств; организаций - независимо от их организационно-правовой формы, формы собственности, подчиненности, места нахождения и других обстоятельств.
2. Суд обеспечивает равную судебную защиту прав, свобод и законных интересов всех лиц, участвующих в деле.

Статья 5. Законность и справедливость при рассмотрении и разрешении административных дел
Законность и справедливость при рассмотрении и разрешении судами административных дел обеспечиваются соблюдением положений, предусмотренных законодательством об административном судопроизводстве, точным и соответствующим обстоятельствам административного дела правильным толкованием и применением законов и иных нормативных правовых актов, в том числе регулирующих отношения, связанные с осуществлением государственных и иных публичных полномочий, а также получением гражданами и организациями судебной защиты путем восстановления их нарушенных прав и свобод.

Статья 6. Разумный срок административного судопроизводства и разумный срок исполнения судебных актов по административным делам
1. Административное судопроизводство и исполнение судебных актов по административным делам осуществляются в разумный срок.
2. При определении разумного срока административного судопроизводства, который включает в себя период со дня поступления административного искового заявления в суд первой инстанции до дня принятия последнего судебного акта по административному делу, учитываются такие обстоятельства, как правовая и фактическая сложность административного дела, поведение участников судебного процесса, достаточность и эффективность действий суда, осуществляемых в целях своевременного рассмотрения административного дела, а также общая продолжительность судопроизводства по административному делу.
3. Разбирательство административных дел в судах осуществляется в сроки, установленные настоящим Кодексом. Продление этих сроков допустимо в случаях и порядке, установленных настоящим Кодексом.

Статья 7. Гласность и открытость судебного разбирательства
1. Разбирательство административных дел во всех судах открытое.
2. Разбирательство административных дел в закрытом судебном заседании осуществляется в случае, если материалы рассматриваемого административного дела содержат сведения, составляющие государственную или иную охраняемую законом тайну. Разбирательство в закрытом судебном заседании допускается также в случае удовлетворения ходатайства лица, участвующего в деле, ссылающегося на необходимость сохранения коммерческой или иной охраняемой законом тайны, на содержащиеся в административном деле сведения конфиденциального характера, на неприкосновенность частной жизни граждан или иные обстоятельства, гласное обсуждение которых может помешать правильному разбирательству административного дела либо повлечь за собой разглашение указанных тайн и нарушение прав и законных интересов гражданина.
3. Каждый имеет право знакомиться в установленном порядке со вступившим в законную силу судебным решением по рассмотренному в открытом судебном заседании административному делу, за исключением случаев ограничения этого права в соответствии с законом.
4. О разбирательстве административного дела в закрытом судебном заседании выносится мотивированное определение суда. Определение выносится в отношении всего судебного разбирательства или его части.
5. При разбирательстве административного дела в закрытом судебном заседании присутствуют лица, участвующие в деле, их представители, а в необходимых случаях также свидетели, эксперты, специалисты, переводчики.

Статья 8. Язык, на котором ведется административное судопроизводство
1. Административное судопроизводство ведется на русском языке - государственном языке.
2. Решение суда излагается на русском языке, а при ходатайстве стороны переводится на язык, использовавшийся в ходе судебного разбирательства.

Статья 9. Непосредственность судебного разбирательства
Суд при рассмотрении административного дела обязан непосредственно исследовать все доказательства по административному делу.

Статья 10. Состязательность и равноправие сторон
1. Административное судопроизводство осуществляется на основе состязательности и равноправия сторон.
2. Суд, сохраняя независимость, объективность и беспристрастность, осуществляет руководство судебным процессом, разъясняет каждой из сторон их права и обязанности, предупреждает о последствиях совершения или несовершения сторонами процессуальных действий, оказывает им содействие в реализации их прав, создает условия и принимает предусмотренные настоящим Кодексом меры для всестороннего и полного установления всех фактических обстоятельств по административному делу, в том числе для выявления и истребования по собственной инициативе доказательств, а также для правильного применения законов и иных нормативных правовых актов при рассмотрении и разрешении административного дела.
3. Стороны пользуются равными правами на заявление отводов и ходатайств, представление доказательств, участие в их исследовании, выступление в судебных прениях, представление суду своих доводов и объяснений, осуществление иных процессуальных прав, предусмотренных настоящим Кодексом. Сторонам обеспечивается право представлять доказательства суду и другой стороне по административному делу, заявлять ходатайства, высказывать свои доводы и соображения, давать объяснения по всем возникающим в ходе рассмотрения административного дела вопросам, связанным с представлением доказательств.

Статья 11. Обязательность судебных актов
1. Вступившие в законную силу судебные акты (решения, судебные приказы, определения, постановления) по административным делам, а также законные распоряжения, требования, поручения, вызовы и обращения судов являются обязательными для органов государственной власти, иных государственных органов, органов местного самоуправления, избирательных комиссий, комиссий референдума, организаций, объединений, должностных лиц, государственных и муниципальных служащих, граждан и подлежат исполнению на всей территории Нижегородской области
2. Неисполнение судебных актов по административным делам, а также задержка их исполнения влечет за собой применение мер, предусмотренных настоящим Кодексом, или ответственность, установленную федеральными законами.

ГЛАВА 2. СОСТАВ СУДА. ОТВОДЫ​

Статья 12. Единоличное и коллегиальное рассмотрение административных дел
1. Административные дела в суде первой инстанции рассматриваются судьей единолично, если коллегиальное рассмотрение административных дел не предусмотрено настоящей статьей. Коллегиальное рассмотрение административных дел в суде первой инстанции осуществляется в составе трех судей.
2. В суде первой инстанции рассматриваются коллегиально:
1) административные дела, направленные в суд первой инстанции на новое рассмотрение с указанием на их коллегиальное рассмотрение;
2) административные дела, решения о коллегиальном рассмотрении которых приняты председателем суда в связи с их особой сложностью на основании мотивированного заявления судьи;
3. Если иное не установлено настоящим Кодексом, административные дела в суде апелляционной инстанции рассматриваются коллегиально в составе трех судей.
4. При коллегиальном рассмотрении административного дела один из судей председательствует в судебном заседании.
5. В случае, если настоящим Кодексом судье предоставлено право единолично рассматривать административные дела и совершать отдельные процессуальные действия, судья действует от имени суда.

Статья 13. Порядок разрешения вопросов судом при коллегиальном рассмотрении административных дел
Вопросы, возникающие при коллегиальном рассмотрении административного дела, разрешаются судьями большинством голосов. Никто из судей не вправе воздержаться от голосования. Судья, председательствующий в судебном заседании, голосует последним.

Статья 14. Отвод судьи
1. Судья не может участвовать в рассмотрении административного дела и подлежит отводу, если он:
1) является членом семьи, родственником или родственником супруга кого-либо из лиц, участвующих в деле, либо их представителей;
2) лично, прямо или косвенно заинтересован в исходе административного дела.
2. Судья не может участвовать в рассмотрении административного дела и подлежит отводу, если имеются иные, не предусмотренные частью 1 настоящей статьи обстоятельства, которые могут вызвать сомнение в его объективности и беспристрастности.
3. В состав суда, рассматривающего административное дело, не могут входить лица, которые состоят в родстве между собой, являются членами одной семьи, родственниками или супруги которых являются родственниками.

Статья 15. Отвод помощника судьи, секретаря судебного заседания, эксперта, специалиста
1. Помощник судьи, секретарь судебного заседания, эксперт, специалист не могут участвовать в рассмотрении административного дела и подлежат отводу по основаниям, предусмотренным статьей 14 настоящего Кодекса.
2. Эксперт и специалист также не могут участвовать в рассмотрении административного дела, если они находились либо находятся в служебной или иной зависимости от кого-либо из лиц, участвующих в деле, и их представителей.


Статья 16. Заявления о самоотводе и об отводе
1. При наличии оснований, предусмотренных статьями 14 - 15 настоящего Кодекса, судья, прокурор, помощник судьи, секретарь судебного заседания, эксперт, специалист обязаны заявить самоотвод. По тем же основаниям отвод может быть заявлен лицами, участвующими в деле, или рассмотрен по инициативе суда.
2. Самоотвод или отвод должен быть мотивирован и заявлен до начала рассмотрения административного дела по существу. В ходе рассмотрения административного дела заявление о самоотводе или об отводе допускается только в случае, если основание самоотвода или отвода стало известно лицу, заявляющему самоотвод или отвод, либо суду после начала рассмотрения административного дела по существу.
3. В случае отказа в удовлетворении заявления об отводе подача повторного заявления об отводе тем же лицом и по тем же основаниям не допускается.

Статья 17. Порядок разрешения заявления о самоотводе и об отводе
1. В случае заявления отвода суд заслушивает мнения лиц, участвующих в деле, а также лица, которому заявлен отвод, если отводимый желает дать объяснения.
2. Отвод, заявленный судье, рассматривающему административное дело единолично, разрешается тем же судьей.
3. Если административное дело рассматривается судом в коллегиальном составе, отвод, заявленный судье, разрешается этим же составом суда большинством голосов в отсутствие судьи, которому заявлен отвод. При равном числе голосов, поданных за отвод и против отвода, судья считается отведенным.
4. Отвод, заявленный нескольким судьям или всему составу суда, рассматривающему административное дело коллегиально, разрешается этим же судом в полном составе простым большинством голосов.
5. Отвод, заявленный прокурору, помощнику судьи, секретарю судебного заседания, эксперту или специалисту, разрешается составом суда, рассматривающим административное дело.
6. Самоотвод, заявленный судьей, прокурором, помощником судьи, секретарем судебного заседания, экспертом или специалистом, или заявленный им отвод разрешается в совещательной комнате. По результатам рассмотрения вопроса о самоотводе или об отводе выносится мотивированное определение.

Статья 18. Последствия удовлетворения заявления о самоотводе или об отводе
В случае удовлетворения заявления о самоотводе или об отводе судьи, либо нескольких судей, либо всего состава суда административное дело рассматривается в том же суде иным судьей или иным составом судей.


ГЛАВА 3. ЛИЦА, УЧАСТВУЮЩИЕ В ДЕЛЕ, И ДРУГИЕ УЧАСТНИКИ СУДЕБНОГО ПРОЦЕССА​


Статья 19. Лица, участвующие в деле
Лицами, участвующими в деле, являются:
1) стороны;
2) заинтересованные лица;
3) органы, организации и лица, обращающиеся в суд в защиту интересов других лиц или неопределенного круга лиц либо привлекаемые к участию в судебном процессе для дачи заключения по административному делу.

Статья 20. Стороны
1. Сторонами в административном деле являются административный истец и административный ответчик.
2. Под административным истцом понимается лицо, которое обратилось в суд в защиту своих прав, свобод, законных интересов, либо лицо, в интересах которого подано заявление прокурором, органом, осуществляющим публичные полномочия, должностным лицом или гражданином, либо прокурор, орган, осуществляющий публичные полномочия, или должностное лицо, обратившиеся в суд для реализации возложенных на них контрольных или иных публичных функций.
3. Административными истцами могут быть граждане Нижегородской области, иностранные граждане, лица без гражданства, российские, иностранные и международные организации, общественные объединения и религиозные организации, а также общественные объединения и религиозные организации, не являющиеся юридическими лицами. В случаях, предусмотренных настоящим Кодексом, административными истцами могут быть органы государственной власти, иные государственные органы, органы местного самоуправления, избирательные комиссии, комиссии референдума, иные органы и организации, наделенные отдельными государственными или иными публичными полномочиями, должностные лица.
4. Под административным ответчиком понимается лицо, к которому предъявлено требование по спору, возникающему из административных или иных публичных правоотношений, либо в отношении которого административный истец, осуществляющий контрольные или иные публичные функции, обратился в суд.
5. Административными ответчиками могут быть органы государственной власти, иные государственные органы, органы местного самоуправления, избирательные комиссии, комиссии референдума, иные органы и организации, наделенные отдельными государственными или иными публичными полномочиями, должностные лица, государственные и муниципальные служащие. В случаях, установленных настоящим Кодексом, административными ответчиками могут быть граждане, их объединения и организации, не обладающие государственными или иными публичными полномочиями в спорных правоотношениях.

Статья 21. Замена ненадлежащего административного ответчика
1. В случае, если при подготовке административного дела к судебному разбирательству или во время судебного разбирательства в суде первой инстанции будет установлено, что административное исковое заявление подано не к тому лицу, которое должно отвечать по заявленным требованиям, суд с согласия административного истца заменяет ненадлежащего административного ответчика надлежащим. Если административный истец не согласен на замену административного ответчика другим лицом, суд может без согласия административного истца привлечь это лицо в качестве второго административного ответчика.
2. О замене ненадлежащего административного ответчика надлежащим или о привлечении к участию в деле другого надлежащего административного ответчика суд выносит определение.

Статья 22. Права и обязанности лиц, участвующих в деле
1. Лица, участвующие в деле, имеют право:
1) знакомиться с материалами административного дела, делать выписки из них и снимать с них копии;
2) заявлять отводы;
3) представлять доказательства, до начала судебного разбирательства знакомиться с доказательствами, представленными другими лицами, участвующими в этом деле, и с доказательствами, истребованными в том числе по инициативе суда, участвовать в исследовании доказательств;
4) задавать вопросы другим участникам судебного процесса;
5) заявлять ходатайства, в том числе об истребовании доказательств, знакомиться с протоколом судебного заседания, результатами аудио- и (или) видеопротоколирования хода судебного заседания, если такое протоколирование осуществлялось, и представлять письменные замечания к протоколу и в отношении результатов аудио- и (или) видеопротоколирования;
6) давать объяснения суду в устной и письменной форме;
7) приводить свои доводы по всем возникающим в ходе судебного разбирательства вопросам;
8) возражать против ходатайств и доводов других лиц, участвующих в деле;
9) знать о жалобах, поданных другими лицами, участвующими в деле, о принятых по данному административному делу судебных актах и получать копии судебных актов, принимаемых в виде отдельного документа;
10) обжаловать судебные акты в части, касающейся их прав, свобод и законных интересов;
11) пользоваться другими процессуальными правами, предоставленными настоящим Кодексом.
2. Лица, участвующие в деле, должны добросовестно пользоваться всеми принадлежащими им процессуальными правами.
3. Недобросовестное заявление неосновательного административного иска, противодействие, в том числе систематическое, лиц, участвующих в деле, правильному и своевременному рассмотрению и разрешению административного дела, а также злоупотребление процессуальными правами в иных формах влечет за собой наступление для этих лиц последствий, предусмотренных настоящим Кодексом.
4. Лица, участвующие в деле, несут процессуальные обязанности, предусмотренные настоящим Кодексом, а также обязанности, возложенные на них судом в соответствии с настоящим Кодексом.
5. Неисполнение процессуальных обязанностей лицами, участвующими в деле, влечет за собой наступление для этих лиц последствий, предусмотренных настоящим Кодексом.


Статья 23. Заинтересованные лица
1. Под заинтересованным лицом понимается лицо, права и обязанности которого могут быть затронуты при разрешении административного дела.
2. Заинтересованные лица пользуются процессуальными правами и несут процессуальные обязанности одной из сторон, за исключением права на изменение основания или предмета административного иска, отказ от административного иска, признание административного иска или заключение соглашения о примирении, подачу встречного административного иска.
3. О вступлении в административное дело заинтересованного лица либо о привлечении заинтересованного лица к участию в административном деле или об отказе в этом судом выносится определение.

Статья 24. Иные участники судебного процесса
В судебном процессе наряду с лицами, участвующими в деле, могут участвовать их представители, лица, содействующие осуществлению правосудия, в том числе эксперт, свидетель, помощник судьи, секретарь судебного заседания.

Статья 25. Эксперт
1. Экспертом является лицо, которое обладает специальными знаниями и которому в случаях и порядке, предусмотренных настоящим Кодексом, поручено провести экспертизу и дать заключение по вопросам, поставленным перед ним и требующим специальных знаний, в целях выяснения обстоятельств по конкретному административному делу.
2. Эксперт обязан по вызову суда явиться в суд, провести полное исследование объектов, документов и материалов, дать обоснованное и объективное заключение в письменной форме, отражающее ход и результаты проведенных им исследований.
3. Если эксперт не может явиться в суд по вызову, он обязан заблаговременно известить об этом суд с указанием причин неявки.
4. Эксперт обязан обеспечить сохранность предоставленных ему объектов исследования, документов и материалов административного дела и возвратить их в суд вместе с заключением или сообщением о невозможности дать заключение.
5. Эксперт имеет право с разрешения суда:
1) знакомиться с материалами административного дела, относящимися к объекту исследования;
2) участвовать в судебных заседаниях, задавать вопросы лицам, участвующим в деле, и свидетелям по вопросам, относящимся к объекту исследования;
3) присутствовать при совершении процессуальных действий, касающихся объекта исследования;
4) заявлять ходатайства о предоставлении ему дополнительных материалов и объектов исследования, заявлять ходатайства о привлечении к проведению экспертизы других экспертов, если это необходимо для проведения исследования и дачи заключения;
5) излагать в заключении выявленные в ходе проведения экспертизы обстоятельства, которые имеют отношение к объекту исследования и по поводу которых ему не были поставлены вопросы;
6) делать подлежащие занесению в протокол судебного заседания заявления по поводу неправильного истолкования участниками судебного процесса его заключения или показаний.
6. За дачу заведомо ложного заключения эксперт может быть привлечен к уголовной ответственности, о чем он предупреждается судом или по поручению суда руководителем государственного судебно-экспертного учреждения и дает подписку.

Статья 26. Свидетель
1. Свидетелем является лицо, которому могут быть известны какие-либо сведения о фактических обстоятельствах, имеющих значение для рассмотрения и разрешения административного дела, и которое вызвано в суд для дачи показаний.
2. Лицо, вызванное в качестве свидетеля, обязано явиться в суд в назначенное время, сообщить сведения по существу рассматриваемого административного дела, которые известны ему лично, ответить на дополнительные вопросы суда и лиц, участвующих в деле. Не являются доказательствами сведения, сообщенные свидетелем, если он не может указать источник своей осведомленности.
3. Свидетель не вправе уклоняться от явки в суд, давать заведомо ложные показания, отказываться от дачи показаний по мотивам, не предусмотренным федеральными законами.
4. Неявка в суд без уважительных причин вызванного свидетеля либо неисполнение им обязанности по заблаговременному извещению суда о невозможности явиться в суд может повлечь за собой наложение судебного штрафа в порядке и размере, установленных настоящим Кодексом, или принудительный привод.
5. Свидетель вправе:
1) давать показания на родном языке или на языке, которым он владеет;
2) бесплатно пользоваться помощью переводчика.
6. Отказаться от дачи свидетельских показаний вправе:
1) гражданин против самого себя;
2) супруг против супруга, дети, в том числе усыновленные, против родителей, усыновителей и родители, усыновители против детей, в том числе усыновленных.

Статья 27. Помощник судьи
1. Помощник судьи оказывает помощь судье в подготовке и организации судебного процесса, а также в подготовке проектов судебных актов. Помощник судьи не вправе выполнять функции по осуществлению правосудия.
2. Помощник судьи по поручению председательствующего в судебном заседании ведет протокол судебного заседания, обеспечивает контроль за фиксированием хода судебного заседания техническими средствами, проверяет явку в суд лиц, которые должны участвовать в судебном заседании, совершает иные процессуальные действия в случаях и порядке, которые предусмотрены настоящим Кодексом.

Статья 28. Секретарь судебного заседания
Секретарь судебного заседания:
1) осуществляет направление судебных вызовов и извещений;
2) проверяет явку в суд лиц, которые должны участвовать в судебных заседаниях, выясняет причины их неявки и докладывает об этом председательствующему в судебном заседании;
3) обеспечивает контроль за фиксированием хода судебного заседания техническими средствами;
4) ведет протокол судебного заседания;
5) выполняет иные поручения председательствующего в судебном заседании.

ГЛАВА 4. ДОКАЗАТЕЛЬСТВА И ДОКАЗЫВАНИЕ​

Статья 29. Доказательства
1. Доказательствами по административному делу являются полученные в предусмотренном настоящим Кодексом и другими федеральными законами порядке сведения о фактах, на основании которых суд устанавливает наличие или отсутствие обстоятельств, обосновывающих требования и возражения лиц, участвующих в деле, а также иных обстоятельств, имеющих значение для правильного рассмотрения и разрешения административного дела.
2. В качестве доказательств допускаются объяснения лиц, участвующих в деле, и показания свидетелей, полученные в том числе путем использования систем видеоконференц-связи, системы веб-конференции, а также письменные и вещественные доказательства, аудио- и видеозаписи, заключения экспертов.
3. Доказательства, полученные с нарушением федерального закона, не имеют юридической силы и не могут быть положены в основу решения суда.

Статья 30. Допустимость доказательств
1. Доказательства являются допустимыми, если они отвечают требованиям, указанным в статье 30 настоящего Кодекса. Обстоятельства административного дела, которые согласно закону должны быть подтверждены определенными средствами доказывания, не могут подтверждаться никакими иными доказательствами.
2. Суд признает доказательства недопустимыми по письменному ходатайству лица, участвующего в деле, или по собственной инициативе.

Статья 31. Обязанность доказывания
1. Лица, участвующие в деле, обязаны доказывать обстоятельства, на которые они ссылаются как на основания своих требований или возражений, если иной порядок распределения обязанностей доказывания по административным делам не предусмотрен настоящим Кодексом.
2. Обязанность доказывания законности оспариваемых нормативных правовых актов, актов, содержащих разъяснения законодательства и обладающих нормативными свойствами, решений, действий (бездействия) органов, организаций и должностных лиц, наделенных государственными или иными публичными полномочиями, возлагается на соответствующие орган, организацию и должностное лицо. Указанные органы, организации и должностные лица обязаны также подтверждать факты, на которые они ссылаются как на основания своих возражений. По таким административным делам административный истец, прокурор, органы, организации и граждане, обратившиеся в суд в защиту прав, свобод и законных интересов других лиц или неопределенного круга лиц, не обязаны доказывать незаконность оспариваемых ими нормативных правовых актов, актов, содержащих разъяснения законодательства и обладающих нормативными свойствами, решений, действий (бездействия), но обязаны:
1) указывать, каким нормативным правовым актам, по их мнению, противоречат данные акты, решения, действия (бездействие);
2) подтверждать сведения о том, что оспариваемым нормативным правовым актом, актом, содержащим разъяснения законодательства и обладающим нормативными свойствами, решением, действием (бездействием) нарушены или могут быть нарушены права, свободы и законные интересы административного истца или неопределенного круга лиц либо возникла реальная угроза их нарушения;
3) подтверждать иные факты, на которые административный истец, прокурор, органы, организации и граждане ссылаются как на основания своих требований.

Статья 32. Истребование доказательств
1. В целях правильного разрешения административных дел суд вправе истребовать доказательства по ходатайству лиц, участвующих в деле, или по своей инициативе. Копии документов, полученных судом, направляются им лицам, участвующим в деле, если у них эти документы отсутствуют.
2. Об истребовании доказательства судом выносится определение, в котором указываются срок и порядок представления этого доказательства. Копия определения направляется лицам, участвующим в деле, и лицу, у которого находится истребуемое судом доказательство, не позднее следующего рабочего дня после дня вынесения определения. При необходимости по запросу суда истребуемое доказательство может быть выдано на руки лицу, имеющему соответствующий запрос.
3. Лицо, у которого находится истребуемое судом доказательство, может направить его непосредственно в суд либо выдать его на руки лицу, имеющему соответствующий запрос, для представления в суд.
4. Если лицо, от которого судом истребуется доказательство, не имеет возможности представить его вообще или в установленный судом срок, оно обязано известить об этом суд в течение трёх дней со дня получения копии определения об истребовании доказательства и (или) запроса и указать причины, по которым истребуемое доказательство не может быть представлено.
5. В случае неизвещения суда о невозможности представления доказательства вообще или в установленный судом срок либо в случае неисполнения обязанности представить истребуемое судом доказательство по причинам, признанным судом неуважительными, на лицо, от которого истребуется доказательство, судом налагается судебный штраф в порядке и размере, установленных настоящим Кодексом.

Статья 33. Объяснения лиц, участвующих в деле
1. Лица, участвующие в деле, дают суду в письменной или устной форме свои объяснения об известных им обстоятельствах, имеющих значение для правильного рассмотрения и разрешения административного дела. По предложению суда лицо, участвующее в деле, может изложить свои объяснения в письменной форме. Объяснения, изложенные в письменной форме, приобщаются к материалам административного дела.
2. Объяснения лиц, участвующих в деле, подлежат наряду с другими доказательствами проверке и оценке.

Статья 34. Свидетельские показания
1. Свидетельскими показаниями являются сообщения свидетелем суду в устной форме об известных ему обстоятельствах, имеющих значение для правильного рассмотрения и разрешения административного дела. По предложению суда свидетель, который дал показания в устной форме, может изложить их в письменной форме. Свидетельские показания, изложенные в письменной форме, приобщаются к материалам административного дела.
2. Сообщенные свидетелем сведения не являются доказательствами, если свидетель не может указать источник своей осведомленности.
3. Если свидетельские показания основываются на сообщениях иных лиц, эти лица также должны быть опрошены.
4. Лицо может быть вызвано в суд в качестве свидетеля по ходатайству лица, участвующего в деле, и по инициативе суда.
5. В ходатайстве о вызове свидетеля лицо, участвующее в деле, обязано указать, какие обстоятельства, имеющие значение для правильного рассмотрения и разрешения административного дела, может подтвердить свидетель, и сообщить суду его фамилию, имя и отчество, место жительства и иные известные ему сведения, необходимые для вызова свидетеля в суд.
6. Суд по своей инициативе может вызвать в качестве свидетеля лицо, которое участвовало в составлении документа, исследуемого судом как письменное доказательство, либо в создании или изменении предмета, исследуемого судом как вещественное доказательство.

Статья 35. Письменные доказательства
1. Письменными доказательствами являются содержащие сведения об обстоятельствах, имеющих значение для административного дела, акты, договоры, справки, деловая корреспонденция, иные документы и материалы, выполненные в форме цифровой и графической записи, полученные посредством факсимильной, электронной или другой связи, в том числе с использованием информационно-телекоммуникационной сети "Интернет", а также с использованием систем видеоконференц-связи, системы веб-конференции (при наличии технической возможности для такой передачи документов и материалов) либо иным способом, позволяющим установить достоверность документа. К письменным доказательствам относятся также судебные акты, протоколы судебных заседаний, протоколы совершения отдельных процессуальных действий и приложения к ним (схемы, карты, планы, чертежи).
2. Письменные доказательства представляются в суд в подлиннике или в форме надлежащим образом заверенной копии. Если к рассматриваемому административному делу имеет отношение только часть документа, может быть представлена заверенная выписка из него.
3. Письменные доказательства приобщаются к материалам административного дела. Не могут приобщаться к материалам административного дела подлинники документов, которые согласно федеральному закону должны находиться в местах их постоянного либо временного хранения.

Статья 36. Вещественные доказательства
1. Вещественными доказательствами являются предметы, которые по своим внешнему виду, свойствам, месту нахождения или иным признакам могут служить средством установления обстоятельств, имеющих значение для административного дела.
2. О приобщении вещественных доказательств к административному делу суд выносит определение.

Статья 37. Аудио- и видеозаписи
1. Лицо или организация, предоставляющие аудио- и (или) видеозаписи на электронном или ином носителе либо заявляющие ходатайство об их истребовании, обязаны указать, когда, кем и в каких условиях осуществлялись записи.
2. Носители аудио- и видеозаписей хранятся в суде. Суд принимает меры по их сохранению в неизменном состоянии.

Статья 38. Назначение экспертизы
1. В случае возникновения в ходе рассмотрения административного дела вопросов, требующих специальных знаний, суд назначает экспертизу, которая может быть поручена экспертному учреждению, конкретному эксперту или нескольким экспертам.
2. Суд может назначить экспертизу по ходатайству лица, участвующего в деле, или по своей инициативе. Экспертиза может быть назначена по инициативе суда, если экспертиза предусмотрена законом или ее проведение необходимо для проверки заявления о фальсификации представленного доказательства, либо если требуется проведение дополнительной или повторной экспертизы, либо если проведение экспертизы необходимо в связи с выявленными обстоятельствами административного дела и представленными доказательствами.
3. Лица, участвующие в деле, вправе предложить суду вопросы, подлежащие разрешению при проведении экспертизы. Окончательный круг вопросов, по которым требуется заключение эксперта, и их содержание определяются судом. Отклонение судом вопросов, предложенных лицами, участвующими в деле, должно быть мотивировано в определении суда о назначении экспертизы.
4. На время проведения экспертизы производство по административному делу может быть приостановлено.

Статья 39. Порядок проведения экспертизы
1. Экспертиза проводится экспертами, являющимися работниками государственного судебно-экспертного учреждения, по поручению руководителя этого учреждения или иными экспертами, которым она поручена судом.
2. Экспертиза может проводиться в судебном заседании или вне судебного заседания, если того требует характер исследований либо невозможно или затруднительно доставить документы или материалы для исследования в судебном заседании.
3. Лица, участвующие в деле, могут присутствовать при проведении экспертизы, за исключением случаев, если их присутствие может помешать исследованию либо эксперты совещаются или составляют заключение.

Статья 40. Заключение эксперта
1. На основании проведенных исследований и с учетом их результатов эксперт (комиссия экспертов) дает заключение в письменной форме и подписывает его, если иное не установлено настоящим Кодексом. Если экспертиза проводится в судебном заседании, эксперт может дать устное заключение.
2. В заключении эксперта должны содержаться:
1) дата, время и место проведения экспертизы;
2) основания проведения экспертизы;
3) сведения об экспертном учреждении и об эксперте (фамилия, имя и отчество, образование, специальность, стаж работы, ученая степень и ученое звание, занимаемая должность), которым поручено проведение экспертизы;
4) сведения о предупреждении эксперта об ответственности, предусмотренной Уголовным кодексом, за дачу заведомо ложного заключения;
5) вопросы, поставленные перед экспертом;
6) объекты исследований и материалы административного дела, предоставленные эксперту для проведения экспертизы;
7) сведения о лицах, присутствующих при проведении экспертизы;
8) описание и результаты исследований с указанием примененных методов;
9) выводы по поставленным перед экспертом (комиссией экспертов) вопросам и обоснование этих выводов;
10) иные необходимые сведения.
3. После оглашения заключения эксперт может дать по нему необходимые пояснения и обязан ответить на дополнительные вопросы лиц, участвующих в деле, и суда. Ответы эксперта на дополнительные вопросы заносятся в протокол судебного заседания.
4. Заключение эксперта (комиссии экспертов) не является для суда обязательным и оценивается судом по правилам, установленным статьей 42 настоящего Кодекса. Несогласие суда с заключением эксперта (комиссии экспертов) должно быть мотивировано в решении или определении суда.

Статья 41. Оценка доказательств
1. Суд оценивает доказательства по своему внутреннему убеждению, основанному на всестороннем, полном, объективном и непосредственном исследовании имеющихся в административном деле доказательств.
2. Никакие доказательства не имеют для суда заранее установленной силы.
3. Суд оценивает относимость, допустимость, достоверность каждого доказательства в отдельности, а также достаточность и взаимосвязь доказательств в их совокупности.
4. Доказательство признается судом достоверным, если в результате его проверки и исследования суд придет к выводу, что содержащиеся в нем сведения соответствуют действительности.
5. При оценке документов или иных письменных доказательств суд обязан с учетом других доказательств убедиться в том, что такие документ или иное письменное доказательство исходят от органа, уполномоченного представлять данный вид доказательств, подписаны лицом, имеющим право на подписание документа, содержат все другие неотъемлемые реквизиты данного вида доказательств.


ГЛАВА 5. СУДЕБНЫЕ ИЗВЕЩЕНИЯ И ВЫЗОВЫ​



Статья 42. Судебные извещения и вызовы
1. Если иное не предусмотрено настоящим Кодексом, лица, участвующие в деле, а также свидетели и эксперты извещаются судом или вызываются в суд заказным письмом с уведомлением о вручении, судебной повесткой с уведомлением о вручении, телефонограммой или телеграммой, посредством факсимильной связи или с использованием иных средств связи и доставки, позволяющих суду убедиться в получении адресатом судебного извещения или вызова. Лицо, участвующее в деле, с его согласия может извещаться путем отправки ему СМС-сообщения или направления извещения или вызова по электронной почте. Согласие лица, участвующего в деле, на извещение посредством СМС-сообщения либо по электронной почте должно быть подтверждено распиской, в которой наряду с данными об этом лице и его согласием на уведомление такими способами указывается номер его мобильного телефона или адрес электронной почты, на которые направляется извещение.
2. Судебная повестка является одной из форм судебных извещений и вызовов. Лица, участвующие в деле, извещаются судебными повестками о времени и месте судебного заседания или совершения отдельных процессуальных действий. Вместе с извещением в форме судебной повестки или заказного письма лицу, участвующему в деле, направляются копии процессуальных документов. Судебными повестками осуществляется также вызов в суд свидетелей, экспертов, специалистов и переводчиков.


Статья 43. Содержание судебных повесток и иных судебных извещений
1. Судебные повестки и иные судебные извещения должны содержать:
1) наименование и адрес суда;
2) указание времени и места проведения судебного заседания;
3) наименование адресата - лица, извещаемого или вызываемого в суд;
4) указание, в качестве кого извещается или вызывается адресат;
5) наименование административного дела, по которому осуществляется извещение или вызов адресата;
6) указание на обязанность лиц, участие которых в судебном разбирательстве не является обязательным, сообщить до начала судебного разбирательства о неявке в суд, а также указание о наступлении для них в случае невыполнения такой обязанности последствий, предусмотренных настоящим Кодексом.
2. В судебных повестках или иных судебных извещениях, адресованных лицам, участвующим в деле, предлагается представить в суд все имеющиеся у них доказательства по административному делу, а также указывается на последствия непредставления доказательств и неявки в суд извещаемых или вызываемых лиц, разъясняется обязанность сообщать суду причины неявки.
3. Одновременно с судебной повесткой или иным судебным извещением, адресованными административному ответчику, судья направляет копию административного искового заявления, а с судебной повесткой или иным судебным извещением, адресованными административному истцу, - копию объяснений в письменной форме административного ответчика, если объяснения поступили в суд.


Статья 44. Последствия отказа от принятия судебной повестки или иного судебного извещения
1. В случае отказа адресата принять судебную повестку или иное судебное извещение лицо, доставляющее или вручающее их, делает соответствующую отметку на судебной повестке или ином судебном извещении, которые возвращаются в суд.
2. Адресат, отказавшийся принять судебную повестку или иное судебное извещение, считается извещенным о времени и месте судебного разбирательства или совершения отдельного процессуального действия.



##РАЗДЕЛ II. МЕРЫ ПРОЦЕССУАЛЬНОГО ПРИНУЖДЕНИЯ

ГЛАВА 6. МЕРЫ ПРОЦЕССУАЛЬНОГО ПРИНУЖДЕНИЯ​


Статья 45. Понятие и виды мер процессуального принуждения
1. Мерами процессуального принуждения являются установленные настоящим Кодексом действия, которые применяются к лицам, нарушающим установленные в суде правила и препятствующим осуществлению административного судопроизводства.
2. К мерам процессуального принуждения относятся:
1) ограничение выступления участника судебного разбирательства или лишение участника судебного разбирательства слова;
2) предупреждение;
3) удаление из зала судебного заседания;
4) привод;
5) обязательство о явке;
6) судебный штраф.
3. Применение к лицу мер процессуального принуждения не освобождает это лицо от исполнения соответствующих обязанностей, установленных настоящим Кодексом или судом на основании положений настоящего Кодекса.


Статья 46. Основания и порядок применения мер процессуального принуждения
1. Меры процессуального принуждения применяются немедленно после совершения лицом соответствующего нарушения.
2. За одно нарушение может быть применена одна мера процессуального принуждения.


Статья 47. Ограничение выступления участника судебного разбирательства, лишение участника судебного разбирательства слова
В случае нарушения участником судебного разбирательства правил выступления в судебном заседании председательствующий в судебном заседании вправе:
1) ограничить от имени суда его выступление, если участник судебного разбирательства касается вопроса, не имеющего отношения к судебному разбирательству;
2) лишить его от имени суда слова, если участник судебного разбирательства самовольно нарушает последовательность выступлений, дважды не исполняет требования председательствующего, допускает грубые выражения или оскорбительные высказывания либо призывает к осуществлению действий, преследуемых в соответствии с законом.


Статья 48. Предупреждение и удаление из зала судебного заседания
1. В случае нарушения участником судебного разбирательства порядка в судебном заседании председательствующий в судебном заседании вправе:
1) объявить ему от имени суда предупреждение;
2) удалить его от имени суда из зала судебного заседания;
2. Граждане, присутствующие в судебном заседании, за повторное нарушение порядка в судебном заседании удаляются по распоряжению председательствующего в судебном заседании из зала заседания суда.


Статья 49. Привод
1. Если надлежащим образом извещенное лицо, участие которого в судебном разбирательстве в соответствии с законом является обязательным или признано судом обязательным, или надлежащим образом извещенный свидетель повторно не явились в суд без уважительных причин либо не сообщили о причинах неявки, в отношении их судом может быть вынесено определение о применении привода, который осуществляется территориальным органом федерального органа исполнительной власти в области внутренних дел.
2. Определение суда о приводе незамедлительно передается на исполнение в территориальный орган внутренних дел по месту производства по административному делу либо по месту жительства, месту пребывания (нахождения), месту работы, службы или учебы лица, которое подлежит приводу.

Статья 50. Обязательство о явке
1. К лицу, участие которого в судебном разбирательстве в соответствии с законом является обязательным или признано судом обязательным, при необходимости может быть применена мера процессуального принуждения в виде обязательства о явке.
2. Обязательство о явке представляет собой оформленное в письменной форме обязательство лица, указанного в части 1 настоящей статьи, своевременно являться по вызову суда в судебное заседание, а в случае перемены места жительства или места пребывания (нахождения) незамедлительно сообщать об этом суду.
3. К лицу, не исполнившему обязательство о явке, могут быть применены меры процессуального принуждения, предусмотренные статьями 50 и 52 настоящего Кодекса.

Статья 51. Наложение судебных штрафов
1. Судебные штрафы налагаются судом в случаях, предусмотренных настоящим Кодексом. Размер судебного штрафа, налагаемого на орган государственной власти, иной государственный орган, не может превышать пятисот тысяч рублей, на орган местного самоуправления, иные органы и организации, которые наделены отдельными государственными или иными публичными полномочиями, - двухсот пятидесяти тысяч рублей, на организацию - сто пятьдесят тысяч рублей, на должностное лицо - ста тысяч рублей, на государственного или муниципального служащего - пятидесяти тысяч рублей, на гражданина - тридцати пяти тысяч рублей.
2. Суд вправе наложить судебный штраф на лиц, участвующих в деле, и иных присутствующих в зале судебного заседания лиц за проявленное ими неуважение к суду. Судебный штраф за неуважение к суду налагается, если совершенные действия не влекут за собой уголовную ответственность.
3. Судебные штрафы, наложенные судом на должностных лиц государственных органов, органов местного самоуправления и других органов, организаций, на государственных и муниципальных служащих, взыскиваются из личных средств этих лиц.
4. Судебные штрафы взыскиваются в доход федерального бюджета.


Статья 52. Порядок рассмотрения вопроса о наложении судебного штрафа
1. Вопрос о наложении на лицо судебного штрафа разрешается в судебном заседании.
2. Результатам рассмотрения вопроса о наложении судебного штрафа суд выносит мотивированное определение.
3. На определение о наложении судебного штрафа может быть подана частная жалоба лицом, на которое наложен судебный штраф, в течение недели со дня получения копии данного определения.


##РАЗДЕЛ III. ОБЩИЕ ПРАВИЛА ПРОИЗВОДСТВА В СУДЕ ПЕРВОЙ ИНСТАНЦИИ

ГЛАВА 7. ПРЕДЪЯВЛЕНИЕ АДМИНИСТРАТИВНОГО ИСКОВОГО ЗАЯВЛЕНИЯ​



Статья 53. Административное исковое заявление
1. Административное исковое заявление может содержать требования:
1) о признании не действующим полностью или в части нормативного правового акта, принятого административным ответчиком;
2) о признании незаконным полностью или в части решения, принятого административным ответчиком, либо совершенного им действия (бездействия);
3) об обязанности административного ответчика принять решение по конкретному вопросу или совершить определенные действия в целях устранения допущенных нарушений прав, свобод и законных интересов административного истца;
4) об обязанности административного ответчика воздержаться от совершения определенных действий;
5) о присуждении компенсации за нарушение административным ответчиком прав в сфере административных и иных публичных правоотношений в случаях, предусмотренных настоящим Кодексом.
2. Административное исковое заявление может содержать иные требования, направленные на защиту прав, свобод и законных интересов в сфере публичных правоотношений.


Статья 54. Принятие административного искового заявления
1. Вопрос о принятии административного искового заявления к производству суда рассматривается судьей единолично в течение пяти дней со дня поступления административного искового заявления в суд, если иной срок не предусмотрен настоящим Кодексом.
2. О принятии административного искового заявления к производству суда судья выносит определение, на основании которого в суде первой инстанции возбуждается производство по административному делу.

Статья 55. Отказ в принятии административного искового заявления
1. Если иное не предусмотрено настоящим Кодексом, судья отказывает в принятии административного искового заявления в случае, если:
1) заявление подлежит рассмотрению в порядке уголовного судопроизводства, производства по делам об административных правонарушениях либо не подлежит рассмотрению в судах;
2) из административного искового заявления об оспаривании нормативного правового акта, акта, содержащего разъяснения законодательства и обладающего нормативными свойствами, решения или действия (бездействия) не следует, что этими актом, решением или действием (бездействием) нарушаются либо иным образом затрагиваются права, свободы и законные интересы административного истца;
3) имеется вступившее в законную силу решение суда по административному спору между теми же сторонами, о том же предмете и по тем же основаниям, определение суда о прекращении производства по данному административному делу в связи с принятием отказа административного истца от административного иска, утверждением соглашения о примирении сторон или имеется определение суда об отказе в принятии административного искового заявления. Суд отказывает в принятии административного искового заявления об оспаривании нормативных правовых актов, решений, действий (бездействия), нарушающих права, свободы и законные интересы неопределенного круга лиц, если имеется вступившее в законную силу решение суда, принятое по административному иску о том же предмете;
4) имеются иные основания для отказа в принятии административного искового заявления, предусмотренные положениями настоящего Кодекса, определяющими особенности производства по отдельным категориям административных дел.
2. Об отказе в принятии к рассмотрению административного искового заявления к производству суда судья выносит мотивированное определение, в котором указывает обстоятельства, послужившие основанием для отказа в принятии административного искового заявления.
3. Отказ административному истцу в принятии административного искового заявления препятствует повторному обращению в суд с таким административным исковым заявлением.
4. На определение суда об отказе в принятии административного искового заявления может быть подана частная жалоба.
5. В случае отмены определения об отказе в принятии административного искового заявления такое заявление считается поданным в день первоначального обращения в суд.


Статья 56. Возвращение административного искового заявления
1. Если иное не предусмотрено настоящим Кодексом, судья возвращает административное исковое заявление административному истцу в случае, если:
1) административное исковое заявление подано лицом, не обладающим административной процессуальной дееспособностью;
2) административное исковое заявление не подписано или подписано и подано в суд лицом, не имеющим полномочий на его подписание и (или) подачу в суд;
3) в производстве этого или другого суда имеется возбужденное ранее дело по спору между теми же сторонами, о том же предмете и по тем же основаниям;
4) до вынесения определения о принятии административного искового заявления к производству суда от лица, обратившегося в суд, поступило заявление о возвращении административного искового заявления;
5) не исправлены недостатки данного административного искового заявления и документов, приложенных к нему, в срок, установленный в определении об оставлении административного искового заявления без движения;
6) имеются иные основания для возвращения административного искового заявления, предусмотренные положениями настоящего Кодекса, определяющими особенности производства по отдельным категориям административных дел.
2. О возвращении судом административного искового заявления судья выносит мотивированное определение, в котором указывает обстоятельства, послужившие основанием для возвращения административного искового заявления, и способ устранения обстоятельств, препятствующих возбуждению административного дела. Определение суда должно быть вынесено в течение десяти дней со дня поступления административного искового заявления в суд или со дня истечения срока, установленного для устранения лицом, подавшим административное исковое заявление, обстоятельств, послуживших основанием для оставления административного искового заявления без движения, если иной срок не установлен настоящим Кодексом. Копия определения о возвращении административного искового заявления вручается или направляется административному истцу вместе с этим административным исковым заявлением и приложенными к нему документами не позднее следующего рабочего дня после дня вынесения указанного определения.
3. Возвращение административному истцу административного искового заявления не препятствует повторному обращению в суд с административным исковым заявлением о том же предмете в установленном законом порядке.
4. На определение суда о возвращении административного искового заявления может быть подана частная жалоба.
5. В случае отмены определения о возвращении административного искового заявления это административное исковое заявление считается поданным в день первоначального обращения административного истца в суд.

Статья 57. Оставление административного искового заявления без движения
1. Если иное не предусмотрено настоящим Кодексом, судья, установив, что административное исковое заявление подано с нарушением требований статей 55 настоящего Кодекса, предъявляемых к форме и содержанию административного искового заявления и (или) приложенных к нему документов, выносит определение об оставлении административного искового заявления без движения, в котором указывает основания для этого и устанавливает разумный срок для устранения лицом, подавшим административное исковое заявление, обстоятельств, послуживших основанием для оставления административного искового заявления без движения. Копия определения об оставлении административного искового заявления без движения направляется лицу, подавшему административное исковое заявление, не позднее следующего рабочего дня после дня вынесения такого определения.
2. Если лицо, подавшее административное исковое заявление, в установленный в определении об оставлении административного искового заявления без движения срок исправит недостатки, указанные судьей, административное исковое заявление считается поданным в день первоначального обращения этого лица в суд. В противном случае административное исковое заявление считается неподанным и возвращается подавшему его лицу со всеми приложенными к нему документами в порядке, установленном статьей 58 настоящего Кодекса.
3. На определение суда об оставлении административного искового заявления без движения может быть подана частная жалоба.

ГЛАВА 8. ПОДГОТОВКА АДМИНИСТРАТИВНОГО ДЕЛА К СУДЕБНОМУ РАЗБИРАТЕЛЬСТВУ​

Статья 58. Определение суда о подготовке административного дела к судебному разбирательству
1. О подготовке административного дела к судебному разбирательству судья выносит определение и указывает в нем действия, которые следует совершить сторонам и другим лицам, участвующим в деле, а также сроки совершения этих действий.
2. На подготовку административного дела к судебному разбирательству может быть указано в определении о принятии административного искового заявления к производству суда.

Статья 59. Срок проведения подготовки административного дела к судебному разбирательству
Подготовка административного дела к судебному разбирательству проводится в срок, который определяется с учетом обстоятельств, относящихся к конкретному административному делу, и процессуальных действий, которые надлежит совершить.

Статья 60. Действия сторон и суда при подготовке административного дела к судебному разбирательству
1. При подготовке административного дела к судебному разбирательству административный истец или его представитель:
1) передает административному ответчику копии документов, в которых содержатся доказательства, обосновывающие фактические основания административного искового заявления и не приобщенные к административному исковому заявлению, если административный истец не освобожден от обязанности их доказывать;
2) заявляет перед судом ходатайства об истребовании доказательств, которые он не может получить самостоятельно без помощи суда.
2. Административный ответчик или его представитель:
1) уточняет требования административного истца и фактические основания этих требований;
2) представляет административному истцу или его представителю и суду возражения в письменной форме относительно заявленных требований;
3) передает суду доказательства, обосновывающие возражения относительно административного искового заявления, а административному истцу или его представителю копии документов, в которых содержатся эти доказательства;
4) заявляет перед судом ходатайства об истребовании доказательств, которые он не может получить самостоятельно без помощи суда.
3. При подготовке административного дела к судебному разбирательству суд:
1) направляет административному ответчику и заинтересованному лицу копии административного искового заявления и приложенных к нему документов, если они не были направлены административным истцом;
2) вызывает стороны, их представителей и разъясняет им процессуальные права и обязанности, последствия совершения или несовершения сторонами процессуальных действий в установленный процессуальный срок; опрашивает административного истца, административного ответчика, их представителей по существу заявленных требований и возражений; выясняет, поддерживает ли административный истец административное исковое заявление полностью или в части, признает ли административный ответчик административное исковое заявление полностью или в части;
3) разрешает вопрос о вступлении в административное дело других административных истцов, административных ответчиков и заинтересованных лиц, а также вопрос о замене ненадлежащего административного ответчика;
4) рассматривает вопрос о соединении или разъединении нескольких требований;
5) рассматривает вопрос о получении необходимых доказательств и предлагает представить их в определенный судом срок;
6) разрешает вопрос о необходимости проведения предварительного судебного заседания, о дате, времени и месте его проведения;
7) совершает иные процессуальные действия в целях обеспечения правильного и своевременного рассмотрения административного дела с учетом его обстоятельств, характера спорного публичного правоотношения, нормативных правовых актов, подлежащих применению, и представленных по административному делу доказательств.

Статья 61. Примирение сторон. Соглашение о примирении сторон
1. Примирение сторон может касаться только их прав и обязанностей как субъектов спорных публичных правоотношений и возможно в случае допустимости взаимных уступок сторон.
2. Суд приостанавливает производство по административному делу на срок, необходимый для примирения сторон.
3. Стороны могут урегулировать спор, заключив соглашение о примирении сторон. Соглашение о примирении сторон заключается в письменной форме и подписывается сторонами или их представителями при наличии у них соответствующих полномочий. Соглашение о примирении сторон должно содержать условия, на которых стороны пришли к примирению, а также порядок распределения судебных расходов, в том числе расходов на оплату услуг представителей.
4. Соглашение о примирении сторон заключается в отношении предъявленных в суд административных исковых требований. Допускается включение в соглашение о примирении сторон положений, которые связаны с заявленными требованиями, но не были предметом судебного разбирательства. Соглашение о примирении сторон может быть заключено в отношении вопроса о распределении судебных расходов.

Статья 62. Назначение административного дела к судебному разбирательству
1. Суд, признав административное дело подготовленным, выносит определение о назначении административного дела к судебному разбирательству, в котором указывает на окончание подготовки административного дела к судебному разбирательству, разрешение вопросов о привлечении к участию в данном административном деле заинтересованных лиц, о соединении или разъединении нескольких требований и на разрешение иных вопросов, по которым не были вынесены соответствующие определения, а также определяет время и место проведения судебного заседания в суде первой инстанции.
2. Суд, признав административное дело подготовленным, вправе завершить предварительное судебное заседание и открыть с согласия лиц, участвующих в деле, судебное заседание, если в предварительном судебном заседании присутствуют лица, участвующие в деле, либо лица, участвующие в деле, отсутствуют в предварительном судебном заседании, но они извещены о времени и месте предварительного судебного заседания и просят рассмотреть административное дело по существу в их отсутствие, за исключением случая, если в соответствии с настоящим Кодексом требуется коллегиальное рассмотрение административного дела.

ГЛАВА 9. СУДЕБНОЕ РАЗБИРАТЕЛЬСТВО​

Статья 63. Сроки рассмотрения и разрешения административных дел
1. Административные дела рассматриваются и разрешаются судами до истечения двух недель со дня поступления административного искового заявления в суд, включая срок на подготовку административного дела к судебному разбирательству, если иные сроки рассмотрения и разрешения административных дел не установлены настоящим Кодексом.
2. Срок, на который административное исковое заявление было оставлено без движения в случаях, предусмотренных настоящим Кодексом, не включается в срок рассмотрения и разрешения административного дела, но учитывается при определении разумного срока судопроизводства.

Статья 64. Порядок в судебном заседании
1. Участники судебного разбирательства и иные присутствующие в зале судебного заседания граждане обязаны соблюдать установленный в судебном заседании порядок.
2. При входе судей в зал судебного заседания и при их удалении для принятия судебного акта все присутствующие в зале встают. Объявление решения суда, а также объявление определения суда, которым заканчивается производство по административному делу в случае, если решение не принято, присутствующие в зале судебного заседания выслушивают стоя.
3. Участники судебного разбирательства обращаются к суду со словами: "Уважаемый суд", а к судье - "Ваша честь". Участники судебного разбирательства дают свои показания и объяснения суду, задают вопросы лицам, участвующим в деле, и отвечают на вопросы стоя и только после предоставления им слова председательствующим в судебном заседании. Отступление от этого правила может быть допущено с разрешения председательствующего в судебном заседании.
4. Судебное разбирательство происходит в условиях, обеспечивающих надлежащий порядок в судебном заседании и безопасность участников судебного разбирательства.
5. К лицам, нарушающим порядок в судебном заседании или не подчиняющимся законным распоряжениям председательствующего в судебном заседании, после устного замечания могут быть применены меры процессуального принуждения, предусмотренные настоящим Кодексом.

Статья 65. Открытие судебного заседания
В назначенное для судебного разбирательства административного дела время председательствующий в судебном заседании открывает судебное заседание и объявляет, какое административное дело подлежит рассмотрению.

Статья 66. Проверка явки участников судебного разбирательства
Секретарь судебного заседания или помощник судьи докладывает суду, кто из вызванных по административному делу лиц явился, извещены ли надлежащим образом лица, не явившиеся в судебное заседание, и какие имеются сведения о причинах их неявки.

Статья 67. Удаление свидетелей из зала судебного заседания
Председательствующий в судебном заседании принимает меры для того, чтобы допрошенные свидетели не общались с недопрошенными. До начала допроса явившихся свидетелей председательствующий удаляет их из зала судебного заседания, а в отношении свидетелей, допрашиваемых путем использования систем видеоконференц-связи либо системы веб-конференции, принимает меры, исключающие участие таких свидетелей в судебном заседании указанным способом до начала их допроса.

Статья 68. Объявление состава суда и разъяснение права самоотвода и отвода
Председательствующий в судебном заседании объявляет состав суда, сообщает, кто участвует в судебном заседании в качестве прокурора, помощника судьи, секретаря судебного заседания, представителей сторон и заинтересованных лиц, эксперта, специалиста, переводчика, и разъясняет лицам, участвующим в деле, их право заявлять самоотвод и отвод.

Статья 69. Отложение судебного разбирательства административного дела
1. Отложение судебного разбирательства административного дела допускается в случаях, предусмотренных настоящим Кодексом.
2. Суд может отложить судебное разбирательство административного дела в случае, если:
1) признает невозможным рассмотрение административного дела в этом судебном заседании, в том числе вследствие неявки кого-либо из участников судебного разбирательства, возникновения у суда обоснованных сомнений относительно того, что в судебном заседании участвует лицо, прошедшее идентификацию или аутентификацию, либо относительно волеизъявления такого лица, а также если подано встречное административное исковое заявление;
2) удовлетворено ходатайство стороны об отложении судебного разбирательства административного дела в связи с необходимостью представления дополнительных доказательств;
3) возникла необходимость совершения иных процессуальных действий.
3. Суд может отложить судебное разбирательство административного дела по ходатайству лица, участвующего в деле, в связи с необходимостью получения судом дополнительных доказательств и иных сведений в целях всестороннего, полного и объективного выяснения обстоятельств данного административного дела.
4. Об отложении судебного разбирательства административного дела суд выносит определение.
5. В случае отложения судебного разбирательства административного дела суд вправе допросить явившихся свидетелей, если в судебном заседании присутствуют стороны. Вызов допрошенных свидетелей в новое судебное заседание производится только в случае необходимости их повторного допроса.

Статья 70. Разъяснение лицам, участвующим в деле, их процессуальных прав и обязанностей, пояснения относительно полномочий представителя
Председательствующий в судебном заседании разъясняет лицам, участвующим в деле, их процессуальные права и обязанности, а также дает пояснения относительно полномочий представителя в случае ведения дела с его обязательным участием.

Статья 71. Разрешение судом ходатайств лиц, участвующих в деле
Ходатайства лиц, участвующих в деле, их представителей по вопросам, связанным с судебным разбирательством административного дела, разрешаются судом после заслушивания мнений других лиц, участвующих в деле, их представителей. О разрешении ходатайства суд выносит определение

Статья 72. Начало рассмотрения административного дела по существу
1. Председательствующий в судебном заседании или кто-либо из судей докладывает административное дело. Затем председательствующий выясняет, поддерживается ли административный иск административным истцом, признается ли административный иск административным ответчиком, а при возможности заключения по данной категории административных дел соглашения о примирении сторон выясняет, не желают ли стороны завершить дело заключением указанного соглашения, о чем делаются соответствующие записи в протоколе судебного заседания.
2. В случае рассмотрения административного дела в отсутствие лица, участвующего в деле и изложившего в письменных объяснениях свои доводы в отношении административных исковых требований, председательствующий в судебном заседании оглашает эти объяснения.

Статья 73. Отказ административного истца, его представителя от административного иска, признание административного иска административным ответчиком, его представителем и соглашение о примирении сторон
1. Заявление административного истца, его представителя об отказе от административного иска, о признании административного иска административным ответчиком, его представителем и условия соглашения о примирении сторон заносятся в протокол судебного заседания и подписываются административным истцом, административным ответчиком или обеими сторонами, их представителями. Изложенные в письменной форме заявление об отказе от административного иска или о признании административного иска и условия соглашения о примирении сторон приобщаются к административному делу, о чем указывается в протоколе судебного заседания.
2. Если по данной категории административных дел не допускаются принятие отказа от административного иска, признание административного иска и утверждение соглашения о примирении сторон, суд поясняет это административному истцу и (или) административному ответчику, их представителям. При допустимости совершения указанных распорядительных действий по данной категории административных дел суд разъясняет последствия отказа от административного иска, признания административного иска или утверждения соглашения о примирении сторон.
е принятия судом отказа от административного иска или утверждения судом соглашения о примирении сторон суд выносит определение, которым одновременно прекращается производство по административному делу полностью или в соответствующей части. В определении суда должны быть указаны условия утверждаемого соглашения о примирении сторон. В случае признания административным ответчиком административного иска и принятия его судом принимается решение об удовлетворении заявленных административным истцом требований.
4. В случае непринятия или невозможности принятия судом отказа от административного иска, признания административного иска или не утверждения соглашения о примирении сторон суд выносит об этом определение и продолжает рассмотрение административного дела по существу.

Статья 74. Установление очередности исследования доказательств
Суд устанавливает очередность исследования доказательств по административному делу с учетом мнения лиц, участвующих в деле, их представителей. При необходимости очередность исследования доказательств может быть изменена.

Статья 75. Объяснения лиц, участвующих в деле
1. После доклада административного дела суд заслушивает объяснения административного истца, административного ответчика и заинтересованного лица, их представителей. До административного истца, его представителя свои объяснения дают прокурор, представители органов государственной власти, иных государственных органов, органов местного самоуправления, организаций и граждане, обратившиеся в суд за защитой прав, свобод и законных интересов других лиц. Лица, участвующие в деле, их представители могут задавать друг другу вопросы. Суд может задавать вопросы лицам, участвующим в деле, их представителям в любой момент дачи ими объяснений.
2. Поданные в письменной форме объяснения лиц, участвующих в деле, их представителей в случае их неявки в судебное заседание оглашаются председательствующим в судебном заседании.

Статья 76. Предупреждение свидетеля об ответственности за отказ от дачи показаний и за дачу заведомо ложных показаний
1. Перед допросом свидетеля его личность устанавливает председательствующий в судебном заседании. Председательствующий в судебном заседании разъясняет ему права и обязанности, предусмотренные статьей 27 настоящего Кодекса, предупреждает об ответственности, предусмотренной Уголовным кодексом Нижегородской области, за отказ от дачи показаний и за дачу заведомо ложных показаний. У свидетеля берется подписка о том, что ему разъяснены его обязанности и ответственность. Подписка приобщается к протоколу судебного заседания.

Статья 77. Порядок допроса свидетеля
1. Каждый свидетель допрашивается отдельно, за исключением случаев, если суд назначает допрос одновременно двух и более свидетелей в целях выяснения причин расхождения в их показаниях.
2. Председательствующий в судебном заседании выясняет, в каких отношениях свидетель находится с лицами, участвующими в деле, и предлагает свидетелю сообщить суду все сведения, которые ему лично известны об обстоятельствах данного административного дела.
3. При даче показаний свидетель может пользоваться письменными материалами, если его показания связаны с какими-либо данными, которые трудно удержать в памяти. По окончании допроса эти материалы предъявляются суду, лицам, участвующим в деле, их представителям и могут быть приобщены к данному административному делу на основании определения суда.
4. После этого свидетелю могут быть заданы вопросы. Первым задает вопросы лицо, по заявлению которого вызван свидетель, или представитель этого лица, а затем вопросы задают другие лица, участвующие в деле, их представители. Суд вправе задавать вопросы свидетелю в любой момент его допроса.
5. При необходимости суд повторно может допросить свидетеля в том же или следующем судебном заседании, а также повторно допросить других свидетелей для выяснения противоречий в их показаниях.

Статья 78. Исследование письменных доказательств
1. Письменные доказательства оглашаются в судебном заседании и предъявляются лицам, участвующим в деле, их представителям, а в необходимых случаях свидетелям, экспертам, специалистам.
2. В отношении письменных доказательств лица, участвующие в деле, их представители могут давать объяснения и пояснения, а также задавать вопросы свидетелям, экспертам, специалистам.

Статья 79. Исследование вещественных доказательств
Вещественные доказательства осматриваются судом и предъявляются лицам, участвующим в деле, их представителям, а в необходимых случаях свидетелям, экспертам, специалистам. Лица, которым предъявлены вещественные доказательства, могут обращать внимание суда на те или иные обстоятельства, связанные с вещественными доказательствами или их осмотром. Их заявления по этому поводу заносятся в протокол судебного заседания.

Статья 80. Воспроизведение аудио- и видеозаписей и их исследование
Воспроизведение аудио- и видеозаписей осуществляется в зале судебного заседания или ином специально оборудованном для этой цели помещении с указанием в протоколе судебного заседания основных характеристик оборудования и носителей информации, а также времени воспроизведения. После этого суд заслушивает объяснения лиц, участвующих в деле. При необходимости воспроизведение аудио- и видеозаписей может быть повторено полностью или в какой-либо части.

Статья 81. Исследование заключения эксперта. Назначение дополнительной или повторной экспертизы
1. Заключение эксперта оглашается в судебном заседании. В целях разъяснения и дополнения заключения эксперту могут быть заданы вопросы. Первыми задают вопросы лицо, по ходатайству которого назначена экспертиза, его представитель, а затем задают вопросы другие лица, участвующие в деле, их представители. В случае, если экспертиза назначена по инициативе суда или по ходатайству обеих сторон, первым задает вопросы эксперту административный истец или его представитель. Суд вправе задавать вопросы эксперту в любой момент его допроса.
2. Заключение эксперта исследуется в судебном заседании, оценивается судом наряду с другими доказательствами и не имеет для суда заранее установленной силы.

Статья 82. Окончание рассмотрения административного дела по существу
После исследования всех доказательств председательствующий в судебном заседании предоставляет слово для заключения по делу прокурору или лицу, дающему заключение по административному делу, а также выясняет у других лиц, участвующих в деле, их представителей, не желают ли они выступить с дополнительными объяснениями. При отсутствии таких объяснений председательствующий в судебном заседании объявляет рассмотрение административного дела по существу законченным и суд переходит к судебным прениям.

Статья 83. Судебные прения
1. Судебные прения состоят из речей лиц, участвующих в деле, их представителей. В судебных прениях первыми выступают административный истец, его представитель, затем - административный ответчик, его представитель.
2. Заинтересованное лицо, его представитель в судебных прениях выступают после сторон, их представителей.
3. Прокурор, представители органов государственной власти, иных государственных органов, органов местного самоуправления, организаций и граждане, обратившиеся в суд за защитой прав, свобод и законных интересов других лиц, выступают в судебных прениях первыми.
4. Лица, участвующие в судебных прениях, не вправе ссылаться на обстоятельства, которые судом не выяснялись, а также на доказательства, которые не исследовались в судебном заседании.
5. Председательствующий в судебном заседании вправе применить меры процессуального принуждения и остановить выступающего в случае, если он выходит за пределы рассматриваемого административного дела.
6. Все лица, участвующие в деле, их представители после произнесения ими речей с разрешения суда могут выступить с репликами в связи со сказанным. Право последней реплики всегда принадлежит административному ответчику, его представителю.

Статья 84. Удаление суда для принятия решения
После судебных прений суд удаляется в совещательную комнату для принятия решения по административному делу, о чем председательствующий в судебном заседании объявляет присутствующим в зале судебного заседания.

Статья 85. Объявление решения суда
1. После принятия и подписания решения суд возвращается в зал судебного заседания, где председательствующий в судебном заседании или один из судей объявляет решение суда. Затем председательствующий в судебном заседании устно разъясняет содержание решения суда, порядок и срок его обжалования.
2. В случае объявления только резолютивной части решения суда председательствующий в судебном заседании разъясняет, когда будет изготовлено мотивированное решение и каким образом это решение будет доведено до сведения лиц, участвующих в деле, их представителей.

ГЛАВА 10. РЕШЕНИЕ СУДА​

Статья 86. Принятие решения суда
1. Решение принимается именем Нижегородской области при разрешении судом первой инстанции административного дела по существу.
2. Решение принимается судом в совещательной комнате.
3. В совещательной комнате при принятии решения суда могут находиться только судья, единолично рассматривающий административное дело, или судьи, входящие в состав суда, рассматривающего административное дело.
4. В случае рассмотрения административного дела судом в коллегиальном составе совещание судей происходит в порядке, предусмотренном статьей 13 настоящего Кодекса. Судьи не могут разглашать сведения, которые имели место при обсуждении и принятии решения, и иным способом раскрывать тайну совещания судей. При этом изложение судьей особого мнения в порядке, предусмотренном статьей 13 настоящего Кодекса, не может рассматриваться как нарушение тайны совещания судей.

Статья 87. Содержание решения суда
1. Решение суда состоит из вводной, описательной, мотивировочной и резолютивной частей.
2. В вводной части решения суда должны быть указаны:
1) номер административного дела;
2) дата и место принятия решения суда;
3) наименование суда, принявшего решение;
4) состав суда;
5) сведения о сторонах, других лицах, участвующих в деле, об их представителях, о помощнике судьи, секретаре судебного заседания, об иных участниках судебного процесса, о предмете административного иска.
3. Описательная часть решения суда должна содержать изложение требований административного истца, возражений административного ответчика, мнения других лиц, участвующих в деле.
4. В мотивировочной части решения суда должны быть указаны:
1) обстоятельства административного дела, установленные судом;
2) доказательства, на которых основаны выводы суда об этих обстоятельствах;
3) доводы, в соответствии с которыми суд отвергает те или иные доказательства;
4) нормативные правовые акты, которыми руководствовался суд при принятии решения.
5. Если настоящим Кодексом не предусмотрено иное, резолютивная часть решения суда должна содержать:
1) выводы суда об удовлетворении административного иска полностью или в части либо об отказе в удовлетворении административного иска;
2) выводы суда по вопросам, разрешенным судом исходя из обстоятельств административного дела, в том числе указание на порядок и срок исполнения решения суда, на немедленное исполнение решения суда, если оно обращено судом к немедленному исполнению, на дальнейшую судьбу вещественных доказательств, если этот вопрос не был разрешен до принятия решения суда, на сохранение или отмену действия примененных мер предварительной защиты по административному иску, на удовлетворение гражданского иска полностью или в части либо на отказ в его удовлетворении;
3) иные сведения, подлежащие указанию в соответствии с настоящим Кодексом при разрешении административных дел определенной категории;
4) порядок и срок обжалования решения суда.

Статья 88. Вступление в законную силу решения суда
Вступление в законную силу решения суда
Решение суда вступает в законную силу немедленно с момента его вынесения, подписания и официального опубликования.
ГЛАВА 11. ПРЕКРАЩЕНИЕ ПРОИЗВОДСТВА ПО АДМИНИСТРАТИВНОМУ ДЕЛУ​

Статья 89. Основания для прекращения производства по административному делу
1. Если иное не установлено настоящим Кодексом, суд прекращает производство по административному делу в случае:
1) если имеются основания, предусмотренные частью 1 статьи 57 настоящего Кодекса;
2) если административный истец отказался от административного иска и отказ принят судом;
3) если стороны заключили соглашение о примирении и оно утверждено судом.
2. Суд также вправе прекратить производство по административному делу в случае, если оспариваемые нормативный правовой акт, решение отменены или пересмотрены и перестали затрагивать права, свободы и законные интересы административного истца.
3. Суд прекращает производство по административному делу и в иных предусмотренных настоящим Кодексом случаях.

Статья 90. Порядок и последствия прекращения производства по административному делу
1. Производство по административному делу прекращается определением суда, в котором указываются основания для прекращения производства по административному делу, разрешаются вопросы о возможности возврата государственной пошлины и о распределении между сторонами судебных расходов. Повторное обращение в суд по административному спору между теми же сторонами, о том же предмете и по тем же основаниям не допускается.
2. Копии определения суда о прекращении производства по административному делу направляются лицам, участвующим в деле, не позднее следующего рабочего дня после дня вынесения определения, а в случае присутствия указанных лиц в судебном заседании вручаются им под расписку.
3. На определение суда о прекращении производства по административному делу может быть подана частная жалоба.

##РАЗДЕЛ IV. ОСОБЕННОСТИ ПРОИЗВОДСТВА ПО ОТДЕЛЬНЫМ КАТЕГОРИЯМ АДМИНИСТРАТИВНЫХ ДЕЛ

ГЛАВА 12. ПРОИЗВОДСТВО ПО ДЕЛАМ ОБ ОСПАРИВАНИИ НОРМАТИВНЫХ ПРАВОВЫХ АКТОВ​

Статья 91. Предъявление административного искового заявления о признании нормативного правового акта недействующим
1. С административным исковым заявлением о признании нормативного правового акта не действующим полностью или в части вправе обратиться лица, в отношении которых применен этот акт, а также лица, которые являются субъектами отношений, регулируемых оспариваемым нормативным правовым актом, если они полагают, что этим актом нарушены или нарушаются их права, свободы и законные интересы.
2. С административным исковым заявлением о признании нормативного правового акта не действующим полностью или в части в суд могут обратиться прокурор в пределах своей компетенции, законодательный (представительный) орган государственной власти субъекта Нижегородской области, высшее должностное лицо субъекта Нижегородской области, а также в случаях, предусмотренных федеральным законом, иные лица, полагающие, что принятый нормативный правовой акт не соответствует иному нормативному правовому акту, имеющему большую юридическую силу, нарушает их компетенцию или права, свободы и законные интересы граждан.
3. Административное исковое заявление о признании нормативного правового акта недействующим может быть подано в суд в течение всего срока действия этого нормативного правового акта.
4. По делам об оспаривании нормативных правовых актов судом не могут быть приняты встречные административные исковые требования.

Статья 92. Требования к административному исковому заявлению об оспаривании нормативного правового акта и о признании нормативного правового акта недействующим
1. Форма административного искового заявления должна соответствовать требованиям, предусмотренным статьей 55 настоящего Кодекса.
2. В административном исковом заявлении об оспаривании нормативного правового акта должны быть указаны:
1) наименование органа государственной власти, органа местного самоуправления, иного органа, уполномоченной организации, должностного лица, принявших оспариваемый нормативный правовой акт;
2) наименование, номер, дата принятия оспариваемого нормативного правового акта, источник и дата его опубликования;
3) сведения о применении оспариваемого нормативного правового акта к административному истцу или о том, что административный истец является субъектом отношений, регулируемых этим актом;
4) сведения о том, какие права, свободы и законные интересы лица, обратившегося в суд, нарушены;
5) требование о признании оспариваемого нормативного правового акта недействующим с указанием на несоответствие законодательству Нижегородской области всего нормативного правового акта или отдельных его положений.

Статья 93. Решение суда по административному делу об оспаривании нормативного правового акта
1. Решение суда по административному делу об оспаривании нормативного правового акта принимается по правилам, установленным главой 10 настоящего Кодекса.
2. По результатам рассмотрения административного дела об оспаривании нормативного правового акта судом принимается одно из следующих решений:
1) об удовлетворении заявленных требований полностью или в части, если оспариваемый нормативный правовой акт полностью или в части признается не соответствующим иному нормативному правовому акту, имеющему большую юридическую силу, и не действующим полностью или в части со дня его принятия или с иной определенной судом даты;
2) об отказе в удовлетворении заявленных требований, если оспариваемый полностью или в части нормативный правовой акт признается соответствующим иному нормативному правовому акту, имеющему большую юридическую силу.
3. Если при рассмотрении административного дела об оспаривании нормативного правового акта суд установит, что применение на практике оспариваемого нормативного правового акта или его отдельных положений не соответствует истолкованию данного нормативного правового акта или его отдельных положений, выявленному судом с учетом места данного акта в системе нормативных правовых актов, суд указывает на это в мотивировочной и резолютивной частях решения по административному делу об оспаривании нормативного правового акта.
4. В резолютивной части решения суда по административному делу об оспаривании нормативного правового акта должны содержаться:
1) указание на удовлетворение административного иска полностью или в части и на признание оспариваемого нормативного правового акта не действующим полностью или в части со дня вступления решения суда в законную силу или с иной определенной судом даты либо указание на отказ в удовлетворении административного иска с приведением полного наименования оспариваемого нормативного правового акта, его номера, даты принятия и наименования органа или должностного лица, его издавших или принявших;
2) указание на опубликование решения суда или сообщения о его принятии в течение одного месяца со дня вступления решения суда в законную силу в официальном печатном издании органа государственной власти, органа местного самоуправления, иного органа, уполномоченной организации или должностного лица, в котором были опубликованы или должны были быть опубликованы оспоренный нормативный правовой акт или его отдельные положения. Если опубликование решения суда или сообщения о его принятии невозможно в установленный срок в связи с определенной периодичностью выпуска официального печатного издания, решение суда должно быть опубликовано по истечении установленного срока в ближайшем номере такого издания. Если официальное печатное издание прекратило свою деятельность, решение суда или сообщение о его принятии публикуется в другом печатном издании, в котором публикуются нормативные правовые акты соответствующего органа государственной власти, органа местного самоуправления, иного органа, уполномоченной организации или должностного лица;
3) другие сведения о вопросах, разрешенных судом исходя из конкретных обстоятельств административного дела, в том числе о выявленном судом содержании нормативного правового акта или его отдельных положений.
5. Решение суда по административному делу о признании нормативного правового акта не действующим полностью или в части вступает в законную силу по правилам, предусмотренным статьей 92 настоящего Кодекса.

Статья 94. Последствия признания нормативного правового акта не действующим полностью или в части
1. В случае признания судом нормативного правового акта не действующим полностью или в части этот акт или его отдельные положения не могут применяться с указанной судом даты.
2. В случае признания судом нормативного правового акта не действующим полностью или в части не могут применяться также нормативные правовые акты, которые имеют меньшую юридическую силу и воспроизводят содержание нормативного правового акта, признанного не действующим полностью или в части, либо на нем основаны и из него вытекают.
3. Решение суда о признании нормативного правового акта не действующим полностью или в части не может быть преодолено повторным принятием такого же акта.

Статья 95. Обжалование вступившего в законную силу решения суда по административному делу об оспаривании нормативного правового акта
Вступившее в законную силу решение суда по административному делу об оспаривании нормативного правового акта может быть обжаловано лицами, участвующими в деле, их представителями и иными лицами, права, свободы и законные интересы которых затрагиваются решением суда.

ГЛАВА 13. ПРОИЗВОДСТВО ПО АДМИНИСТРАТИВНЫМ ДЕЛАМ ОБ ОСПАРИВАНИИ РЕШЕНИЙ, ДЕЙСТВИЙ (БЕЗДЕЙСТВИЯ) ОРГАНОВ ГОСУДАРСТВЕННОЙ ВЛАСТИ, ОРГАНОВ МЕСТНОГО САМОУПРАВЛЕНИЯ, ДОЛЖНОСТНЫХ ЛИЦ, ГОСУДАРСТВЕННЫХ СЛУЖАЩИХ
​
Статья 96. Предъявление административного искового заявления об оспаривании решений, действий (бездействия) органа государственной власти, органа местного самоуправления, должностного лица, государственного служащего и рассмотрение административного дела по предъявленному административному исковому заявлению
Гражданин, организация, иные лица могут обратиться в суд с требованиями об оспаривании решений, действий (бездействия) органа государственной власти, органа местного самоуправления, должностного лица, государственного служащего если полагают, что нарушены или оспорены их права, свободы и законные интересы, созданы препятствия к осуществлению их прав, свобод и реализации законных интересов или на них незаконно возложены какие-либо обязанности.

Статья 97. Требования к административному исковому заявлению о признании незаконными решений, действий (бездействия) органа, организации, лица, наделенных государственными или иными публичными полномочиями
1. Форма административного искового заявления должна соответствовать требованиям, предусмотренным статьей 55 настоящего Кодекса.
2. В административном исковом заявлении о признании незаконными решений, действий (бездействия) органа, организации, лица, наделенных государственными или иными публичными полномочиями, должны быть указаны:
1) орган, организация, лицо, наделенные государственными или иными публичными полномочиями и принявшие оспариваемое решение либо совершившие оспариваемое действие (бездействие);
2) наименование, номер, дата принятия оспариваемого решения, дата и место совершения оспариваемого действия (бездействия);
3) сведения о том, в чем заключается оспариваемое бездействие (от принятия каких решений либо от совершения каких действий в соответствии с обязанностями, возложенными в установленном законом порядке, уклоняются орган, организация, лицо, наделенные государственными или иными публичными полномочиями);
4) иные известные данные в отношении оспариваемых решения, действия (бездействия);
5) сведения о правах, свободах и законных интересах административного истца, которые, по его мнению, нарушаются оспариваемыми решением, действием (бездействием);
6) нормативные правовые акты и их положения, на соответствие которым надлежит проверить оспариваемые решение, действие (бездействие);
7) требование о признании незаконными решения, действия (бездействия) органа, организации, лица, наделенных государственными или иными публичными полномочиями.

Статья 98. Лица, участвующие в деле об оспаривании решения, действия (бездействия) органа, организации, лица, наделенных государственными или иными публичными полномочиями
1. Состав лиц, участвующих в деле об оспаривании решения, действия (бездействия) органа, организации, лица, наделенных государственными или иными публичными полномочиями, определяется в соответствии с правилами главы 3 настоящего Кодекса с учетом особенностей, предусмотренных частью 2 настоящей статьи.
2. К участию в административном деле об оспаривании решения, действия (бездействия) должностного лица, государственного или муниципального служащего в качестве второго административного ответчика привлекается соответствующий орган, в котором исполняют свои обязанности должностное лицо, государственный или муниципальный служащий.

Статья 99. Решение суда по административному делу об оспаривании решения, действия (бездействия) органа, организации, лица, наделенных государственными или иными публичными полномочиями
1. Решение суда по административному делу об оспаривании решения, действия (бездействия) органа, организации, лица, наделенных государственными или иными публичными полномочиями (далее в настоящей статье - решение по административному делу об оспаривании решения, действия (бездействия), принимается по правилам, установленным главой 10 настоящего Кодекса.
2. По результатам рассмотрения административного дела об оспаривании решения, действия (бездействия) органа, организации, лица, наделенных государственными или иными публичными полномочиями, судом принимается одно из следующих решений:
1) об удовлетворении полностью или в части заявленных требований о признании оспариваемых решения, действия (бездействия) незаконными, если суд признает их не соответствующими нормативным правовым актам и нарушающими права, свободы и законные интересы административного истца, и об обязанности административного ответчика устранить нарушения прав, свобод и законных интересов административного истца или препятствия к их осуществлению либо препятствия к осуществлению прав, свобод и реализации законных интересов лиц, в интересах которых было подано соответствующее административное исковое заявление;
2) об отказе в удовлетворении заявленных требований о признании оспариваемых решения, действия (бездействия) незаконными.
3. В резолютивной части решения по административному делу об оспаривании решения, действия (бездействия) должны содержаться:
1) указание на признание оспоренных решения, действия (бездействия) не соответствующими нормативным правовым актам и нарушающими права, свободы и законные интересы административного истца, на удовлетворение заявленного требования полностью или в части со ссылками на орган, организацию, лицо, наделенные государственными или иными публичными полномочиями, принявшие оспоренное решение или совершившие оспоренное действие (бездействие), и на существо оспоренных решения, действия (бездействия). В случае удовлетворения административного иска об оспаривании решения, действия (бездействия) и необходимости принятия административным ответчиком каких-либо решений, совершения каких-либо действий в целях устранения нарушений прав, свобод и законных интересов административного истца либо препятствий к их осуществлению суд указывает на необходимость принятия решения по конкретному вопросу, совершения определенного действия либо на необходимость устранения иным способом допущенных нарушений прав, свобод и законных интересов административного истца и на срок устранения таких нарушений, а также на необходимость сообщения об исполнении решения по административному делу об оспаривании решения, действия (бездействия) в суд и лицу, которое являлось административным истцом по этому административному делу, в течение одного месяца со дня вступления решения суда в законную силу, если иной срок не установлен судом;
2) сведения по вопросам, разрешенным судом на основании конкретных обстоятельств административного дела, включая отмену или сохранение мер предварительной защиты по административному иску.
4. Решение по административному делу об оспаривании решения, действия (бездействия) вступает в законную силу по правилам, предусмотренным статьей 92 настоящего Кодекса.
5. В случае признания решения, действия (бездействия) незаконными орган, организация, лицо, наделенные государственными или иными публичными полномочиями и принявшие оспоренное решение или совершившие оспоренное действие (бездействие), обязаны устранить допущенные нарушения или препятствия к осуществлению прав, свобод и реализации законных интересов административного истца либо прав, свобод и законных интересов лиц, в интересах которых было подано соответствующее административное исковое заявление, и восстановить данные права, свободы и законные интересы указанным судом способом в установленный им срок, а также сообщить об этом в течение одного месяца со дня вступления в законную силу решения по административному делу об оспаривании решения, действия (бездействия) в суд, гражданину, в организацию, иному лицу, в отношении которых соответственно допущены нарушения, созданы препятствия.

Статья 100. Обжалование судебного акта по административному делу об оспаривании решения, действия (бездействия) органа, организации, лица, наделенных государственными или иными публичными полномочиями
Решение суда по административному делу об оспаривании решения, действия (бездействия) органа, организации, лица, наделенных государственными или иными публичными полномочиями, может быть обжаловано по общим правилам, установленным настоящим Кодексом.



##РАЗДЕЛ V. УПРОЩЕННОЕ (ПИСЬМЕННОЕ) ПРОИЗВОДСТВО ПО АДМИНИСТРАТИВНЫМ ДЕЛАМ

ГЛАВА 14. РАССМОТРЕНИЕ АДМИНИСТРАТИВНОГО ДЕЛА В ПОРЯДКЕ УПРОЩЕННОГО (ПИСЬМЕННОГО)
ПРОИЗВОДСТВА​


Статья 101. Возможность рассмотрения административных дел в порядке упрощенного (письменного) производства
Административное дело может быть рассмотрено в порядке упрощенного (письменного) производства в случае, если:
1) всеми лицами, участвующими в деле, заявлены ходатайства о рассмотрении административного дела в их отсутствие и их участие при рассмотрении данной категории административных дел не является обязательным;
2) ходатайство о рассмотрении административного дела в порядке упрощенного (письменного) производства заявлено административным истцом и административный ответчик не возражает против применения такого порядка рассмотрения административного дела;
3) указанная в административном исковом заявлении общая сумма задолженности по обязательным платежам и санкциям не превышает двадцать тысяч рублей;
4) в иных случаях, предусмотренных настоящим Кодексом.
2) необходимо выяснить дополнительные обстоятельства или исследовать дополнительные доказательства, а также провести осмотр и исследование доказательств по месту их нахождения, назначить экспертизу или заслушать свидетельские показания;
3) заявленное требование связано с иными требованиями, в том числе к другим лицам, или судебным актом, принятым по данному делу, могут быть нарушены права и законные интересы других лиц.

Статья 102. Особенности упрощенного (письменного) производства по административным делам
1. В порядке упрощенного (письменного) производства административные дела рассматриваются без проведения устного разбирательства. При рассмотрении административного дела в таком порядке судом исследуются только доказательства в письменной форме (включая отзыв, объяснения и возражения по существу заявленных требований, а также заключение в письменной форме прокурора, если настоящим Кодексом предусмотрено вступление прокурора в судебный процесс).
2. В случае, если для рассмотрения административного дела в порядке упрощенного (письменного) производства необходимо выяснить мнение административного ответчика относительно применения такого порядка, в определении о подготовке к рассмотрению административного дела суд указывает на возможность применения правил упрощенного (письменного) производства и устанавливает десятидневный срок для представления в суд возражений относительно применения этого порядка.
3. Для случая, предусмотренного частью 2 настоящей статьи, упрощенный (письменный) порядок производства по административному делу может быть применен, если административный ответчик не возражает против рассмотрения административного дела в таком порядке.
4. В случае, если по истечении указанного в части 2 настоящей статьи срока возражения административного ответчика не поступили в суд, суд выносит определение о рассмотрении административного дела в порядке упрощенного (письменного) производства и рассматривает административное дело по этим правилам.
5. В случае, если возражения относительно применения упрощенного (письменного) порядка производства по административному делу поступили в суд с нарушением указанного в части 2 настоящей статьи срока, но до принятия судом решения в порядке упрощенного (письменного) производства, суд выносит определение о рассмотрении дела по общим правилам административного судопроизводства.
6. В порядке упрощенного (письменного) производства административные дела рассматриваются судьей единолично, если в соответствии с настоящим Кодексом не предусмотрено коллегиальное рассмотрение административного дела.
7. Суд выносит определение о рассмотрении дела по общим правилам административного судопроизводства, если установлено, что административное дело не подлежит рассмотрению в порядке упрощенного (письменного) производства, в ходе рассмотрения дела в порядке упрощенного (письменного) производства принят встречный административный иск, который не может быть рассмотрен по правилам, установленным настоящей главой, либо если суд, в том числе по ходатайству одной из сторон, пришел к выводу о том, что:
1) порядок упрощенного (письменного) производства может привести к разглашению государственной тайны;
2) необходимо выяснить дополнительные обстоятельства или исследовать дополнительные доказательства, а также провести осмотр и исследование доказательств по месту их нахождения, назначить экспертизу или заслушать свидетельские показания;
3) заявленное требование связано с иными требованиями, в том числе к другим лицам, или судебным актом, принятым по данному делу, могут быть нарушены права и законные интересы других лиц.

##РАЗДЕЛ VI. ПРОИЗВОДСТВО В СУДЕ АПЕЛЛЯЦИОННОЙ ИНСТАНЦИИ

ГЛАВА 15. ПРОИЗВОДСТВО В СУДЕ АПЕЛЛЯЦИОННОЙ ИНСТАНЦИИ​

Статья 103. Право апелляционного обжалования
1. Решения суда первой инстанции, не вступившие в законную силу, могут быть обжалованы в апелляционном порядке в соответствии с правилами, установленными настоящей главой.
2. Право апелляционного обжалования решения суда принадлежит лицам, участвующим в деле, а также лицам, которые не были привлечены к участию в административном деле и вопрос о правах и об обязанностях которых был разрешен судом. Право принесения апелляционного представления принадлежит прокурору, участвующему в административном деле.

Статья 104. Суды, рассматривающие апелляционные жалобы, представления
В случае, если иное не установлено настоящим Кодексом, апелляционные жалобы, представления рассматриваются коллегиями по административным делам областных судов.

Статья 105. Срок подачи апелляционных жалобы, представления
Апелляционные жалоба, представление могут быть поданы в течение пяти дней со дня принятия решения суда в окончательной форме, если иные сроки не установлены настоящим Кодексом.

Статья 106. Содержание апелляционных жалобы, представления
1. Апелляционные жалоба, представление должны содержать:
1) наименование суда, в который подаются апелляционные жалоба, представление;
2) наименование или фамилию, имя и отчество (при наличии) лица, подающего апелляционные жалобу, представление, его адрес или место жительства;
3) номер административного дела, присвоенный судом первой инстанции, указание на решение суда, которое обжалуется;
4) требования лица, подающего апелляционную жалобу, или требования прокурора, приносящего апелляционное представление, а также основания, по которым они считают решение суда неправильным;
5) перечень прилагаемых к апелляционным жалобе, представлению документов.
2. Апелляционная жалоба подписывается лицом, ее подающим, или его представителем.
3. Апелляционное представление подписывается прокурором.

Статья 107. Оставление апелляционных жалобы, представления без движения
1. При подаче апелляционных жалобы, представления, не соответствующих требованиям, предусмотренным статьей 110 настоящего Кодекса, судья не позднее чем через десять дней со дня поступления жалобы выносит определение, которым оставляет жалобу, представление без движения и назначает лицу, подавшему жалобу, представление, разумный срок для устранения недостатков жалобы, представления с учетом характера таких недостатков, а также места жительства или адреса лица, подавшего жалобу, представление.
2. В случае, если лицо, подавшее апелляционные жалобу, представление, выполнит в установленный срок указания, содержащиеся в определении судьи, жалоба, представление считаются поданными в день первоначального поступления их в суд.
3. На определение судьи об оставлении апелляционных жалобы, представления без движения могут быть поданы частная жалоба, представление прокурора.

Статья 108. Возвращение апелляционных жалобы, представления
1. Апелляционная жалоба возвращается лицу, подавшему жалобу, апелляционное представление - прокурору, если:
1) апелляционные жалоба, представление поданы лицом, не имеющим права на обращение в суд апелляционной инстанции;
2) в установленный срок не выполнены указания судьи, содержащиеся в определении об оставлении апелляционных жалобы, представления без движения;
3) истек срок на апелляционное обжалование и в апелляционных жалобе, представлении отсутствует просьба о восстановлении этого срока или в его восстановлении отказано.
2. Апелляционные жалоба, представление возвращаются по просьбе лица, подавшего жалобу, представление, об их отзыве.
3. Возвращение апелляционной жалобы лицу, подавшему жалобу, апелляционного представления прокурору осуществляется на основании определения судьи. На определение судьи о возвращении апелляционных жалобы, представления могут быть поданы частная жалоба, представление прокурора.

Статья 109. Полномочия суда апелляционной инстанции
По результатам рассмотрения апелляционных жалобы, представления суд апелляционной инстанции вправе:
1) оставить решение суда первой инстанции без изменения, апелляционные жалобу, представление без удовлетворения;
2) отменить или изменить решение суда первой инстанции полностью или в части и принять по административному делу новое решение;
3) отменить решение суда первой инстанции полностью или в части и прекратить производство по административному делу либо оставить заявление без рассмотрения полностью или в части;
4) оставить апелляционные жалобу, представление без рассмотрения по существу при наличии оснований, предусмотренных частью 1 статьи 112 настоящего Кодекса.

Статья 110. Основания для отмены или изменения решения суда в апелляционном порядке
1. Решения суда первой инстанции подлежат безусловной отмене в случае:
1) рассмотрения административного дела судом в незаконном составе;
2) принятия судом решения о правах и об обязанностях лиц, не привлеченных к участию в административном деле;
3) если решение суда не подписано судьей или кем-либо из судей либо если решение суда подписано не тем судьей или не теми судьями, которые входили в состав суда, рассматривавшего административное дело;
4) нарушения правила о тайне совещания судей при принятии решения.
2. Основаниями для отмены или изменения решения суда в апелляционном порядке являются:
1) неправильное определение обстоятельств, имеющих значение для административного дела;
2) недоказанность установленных судом первой инстанции обстоятельств, имеющих значение для административного дела;
3) несоответствие выводов суда первой инстанции, изложенных в решении суда, обстоятельствам административного дела;
4) нарушение или неправильное применение норм материального права или норм процессуального права.
3. Неправильным применением норм материального права являются:
1) неприменение закона, подлежащего применению;
2) применение закона, не подлежащего применению.
4. Нарушение или неправильное применение норм процессуального права является основанием для изменения или отмены решения суда первой инстанции, если это нарушение или неправильное применение привело к принятию неправильного решения.
5. Правильное по существу решение суда первой инстанции не может быть отменено по формальным соображениям.
`},{slug:"state-secret",abbr:"Гостайна",title:"Федеральный закон «О государственной тайне»",notes:"Режим, допуски, ответственность.",updated:"2025-02-23",content:`# Федеральный закон «О государственной тайне»

##Раздел I. Общее положение.
​
Статья 1. Сфера действия федерального закона «О государственной тайне»
Положения настоящего Закона обязательны для исполнения на территории Нижегородской области и за ее пределами органами законодательной, исполнительной и судебной власти, а также организациями, наделенными в соответствии с федеральным законом полномочиями осуществлять от имени Нижегородской области государственное управление в установленной сфере деятельности (далее - органы государственной власти), органами местного самоуправления, предприятиями, учреждениями и организациями независимо от их организационно-правовой формы и формы собственности, должностными лицами и гражданами Нижегородской области, взявшими на себя обязательства либо обязанными по своему статусу исполнять требования законодательства о государственной тайне.

Статья 2. Понятие государственной тайны
Государственная тайна - защищаемые государством сведения в области его военной, внешнеполитической, экономической, разведывательной, контрразведывательной и оперативно-розыскной деятельности, распространение которых может нанести ущерб безопасности Нижегородской области.

Статья 3. Носители государственной тайны
Носителями сведений, составляющих государственную тайну, являются документы, материальные объекты, в том числе физические поля, в которых сведения, составляющие государственную тайну, находят свое отображение в виде символов, образов, сигналов, технических решений и процессов.

Статья 4. Полномочия органов государственной власти должностных лиц в области отнесения сведений к государственной тайне и их защиты
1. Органы государственной власти Нижегородской области, органы государственной власти субъектов Нижегородской области и органы местного самоуправления во взаимодействии с органами защиты государственной тайны, расположенными в пределах соответствующих территорий:
обеспечивают защиту переданных им другими органами государственной власти, предприятиями, учреждениями и организациями сведений, составляющих государственную тайну, а также сведений, засекречиваемых ими;
обеспечивают в пределах своей компетенции проведение проверочных мероприятий в отношении граждан, допускаемых к государственной тайне;
реализуют предусмотренные законодательством меры по ограничению прав граждан и предоставлению социальных гарантий лицам, имеющим либо имевшим доступ к сведениям, составляющим государственную тайну;
вносят в полномочные органы государственной власти предложения по совершенствованию системы защиты государственной тайны.
2. Органы судебной власти:

рассматривают уголовные, гражданские и административные дела о нарушениях законодательства Нижегородской области о государственной тайне;
обеспечивают судебную защиту граждан, органов государственной власти, предприятий, учреждений и организаций в связи с их деятельностью по защите государственной тайны;
обеспечивают в ходе рассмотрения указанных дел защиту государственной тайны;
определяют полномочия должностных лиц по обеспечению защиты государственной тайны в органах судебной власти.
##Раздел II. Перечень сведений составляющий государственную тайну
​
Статья 5. Перечень сведений составляющие государственную тайну
Государственную тайну составляют:
1) сведения в военной области:
о содержании стратегических и оперативных планов, документов боевого управления по подготовке и проведению операций, стратегическому, оперативному и мобилизационному развертыванию Вооруженных Сил Нижегородской области, других войск, воинских формирований и органов, об их боевой и мобилизационной готовности, о создании и об использовании мобилизационных ресурсов;
о тактико-технических характеристиках и возможностях боевого применения образцов вооружения и военной техники, о свойствах, рецептурах или технологиях производства новых видов ракетного топлива или взрывчатых веществ военного назначения;
о дислокации, назначении, степени готовности, защищенности режимных и особо важных объектов, об их проектировании, строительстве и эксплуатации, а также об отводе земель, недр и акваторий для этих объектов;
о дислокации, действительных наименованиях, об организационной структуре, о вооружении, численности войск и состоянии их боевого обеспечения, а также о военно-политической и (или) оперативной обстановке;
2) сведения в области контрразведки, оперативно-розыскной деятельности и контртеррористической деятельности:

о силах, средствах, об источниках, о методах, планах и результатах разведывательной, контрразведывательной, оперативно-розыскной деятельности и деятельности по противодействию терроризму, а также данные о финансировании этой деятельности, если эти данные раскрывают перечисленные сведения;
о лицах, сотрудничающих или сотрудничавших на конфиденциальной основе с органами, осуществляющими разведывательную, контрразведывательную и оперативно-розыскную деятельность;
об организации, о силах, средствах и методах обеспечения безопасности объектов государственной охраны, а также данные о финансировании этой деятельности, если эти данные раскрывают перечисленные сведения;
о подготовке кадров, раскрывающие мероприятия, проводимые в целях обеспечения безопасности государства;
о мерах по обеспечению защищенности критически важных объектов и потенциально опасных объектов инфраструктуры от террористических актов;
о численности, а так же личной информации лиц обеспечивающие контрразведывательную деятельность, оперативно-розыскную и контртеррористические деятельности.

##Раздел III. Отнесение сведений к государственной тайне и их засекречивание.
​
Статья 6. Принципы отнесения сведений к государственной тайне и засекречивание этих сведений
1. Отнесение сведений к государственной тайне и их засекречивание - введение в предусмотренном настоящим Законом порядке для сведений, составляющих государственную тайну, ограничений на их распространение и на доступ к их носителям.
2. Отнесение сведений к государственной тайне и их засекречивание осуществляется в соответствии с принципами законности, обоснованности и своевременности.
3. Законность отнесения сведений к государственной тайне и их засекречивание заключается в соответствии засекречиваемых сведений положениям статей 5 и 7 настоящего Закона и законодательству о государственной тайне.

Статья 7. Сведения, не подлежащие отнесению к государственной тайне и засекречиванию
1. Не подлежат к отнесению к государственной тайне и засекречиванию сведения:
о чрезвычайных ситуациях и катастрофах, угрожающих безопасности и здоровью мирного населения, а так же их последствия;
о состоянии здравоохранения, санитарии, образования, культуры, сельского хозяйства и уровня преступности;
о фактах нарушение прав и свобод человека и гражданина;
о фактах нарушения законности органами государственной власти и их должностными лицами.
2. Должностные лица, принявшие решения о засекречивании перечисленных сведений либо о включении их в этих целях в носители сведений, составляющих государственную тайну, несут уголовную, административную или дисциплинарную ответственность в зависимости от причиненного обществу, государству и гражданам материального и морального ущерба. Данные решения разрешается обжаловать в суде.

Статья 8. Степени секретности сведений и грифы секретности носителей данных сведений
1. Степень секретности сведений, составляющих государственную тайну, должна соответствовать степени тяжести ущерба, который может быть нанесен безопасности вследствие распространения указанных сведений.
2. Устанавливаются три степени секретности сведений, составляющих государственную тайну, и соответствующие этим степеням грифы секретности для носителей указанных сведений: "особой важности", "совершенно секретно" и "секретно".
3. Использование перечисленных грифов секретности для засекречивания сведений, не отнесенных к государственной тайне, не допускается.

Статья 9. Порядок отнесения сведений к государственной тайне
1. Отнесение сведений к государственной тайне осуществляется в соответствии с их отраслевой, ведомственной или программно-целевой принадлежностью, а также в соответствии с настоящим Законом.
2. Обоснование необходимости отнесения сведений к государственной тайне в соответствии с принципами засекречивания сведений возлагается на органы государственной власти, учреждения и организации, которыми эти сведения получены (разработаны).
3. Органами государственной власти, руководители которых наделены полномочиями по отнесению сведений к государственной тайне, в соответствии с Перечнем сведений, отнесенных к государственной тайне, разрабатываются развернутые перечни сведений, подлежащих засекречиванию. В эти перечни включаются сведения, полномочиями по распоряжению которыми наделены указанные органы, и устанавливается степень их секретности.

Статья 10. Порядок засекречивания сведений и их носителей
1. Основанием для засекречивания сведений, полученных (разработанных) деятельности органов государственной власти, предприятий, учреждений и организаций, является их соответствие действующим в данных органах, на данных предприятиях, в данных учреждениях и организациях перечням сведений, подлежащих засекречиванию. При засекречивании этих сведений их носителям присваивается соответствующий гриф секретности.
2. Должностные лица, утвердившие действующий перечень, обязаны в течение трех месяцев организовать экспертную оценку поступивших предложений и принять решение по дополнению (изменению) действующего перечня или снятию предварительно присвоенного сведениям грифа секретности.

##Раздел IV. Рассекречивание сведений и их носителей.
​
Статья 11. Рассекречивание сведений и их носителей
1. Рассекречивание сведений и их носителей - снятие ранее введенных в предусмотренном настоящим Законом порядке ограничений на распространение сведений, составляющих государственную тайну, и на доступ к их носителям.
2. Основанием для рассекречивания сведений является изменение объективных обстоятельств, вследствие которого дальнейшая защита сведений, составляющих государственную тайну, является нецелесообразной.

##Раздел V. Распоряжение сведениями, составляющие государственную тайну.​

Статья 12. Передача сведений, составляющие государственную тайну между органами государственной власти, учреждениями, организациями
1. Органы государственной власти, учреждения и организации, запрашивающие сведения, составляющие государственную тайну, обязаны создать условия, обеспечивающие защиту этих сведений. Их руководители несут персональную ответственность за несоблюдение установленных ограничений по ознакомлению со сведениями, составляющими государственную тайну.
2. Обязательным условием для передачи сведений, составляющих государственную тайну, органам государственной власти, предприятиям, учреждениям и организациям является выполнение ими требований, предусмотренных в статье 9 настоящего Закона.

Статья 13. Защита сведений, составляющие государственную тайну, при изменении функций субъектов правоотношений.
1. Органы государственной власти, предприятия, учреждения и организации, располагающие сведениями, составляющими государственную тайну, в случаях изменения их функций, форм собственности, ликвидации или прекращения работ с использованием сведений, составляющих государственную тайну, обязаны принять меры по обеспечению защиты этих сведений и их носителей. При этом носители сведений, составляющих государственную тайну, в установленном порядке уничтожаются, сдаются на архивное хранение либо передаются:
правопреемнику органа государственной власти, предприятия, учреждения или организации, располагающих сведениями, составляющими государственную тайну, если этот правопреемник имеет полномочия по проведению работ с использованием указанных сведений;
органу государственной власти, в распоряжении которого в соответствии со статьей 9 настоящего Закона находятся соответствующие сведения.

##Раздел VI. Защита государственной тайны.​

Статья 14. Органы защиты государственной тайны
1. К органам защиты государственной тайны относятся:
федеральный орган исполнительной власти, уполномоченный в области обеспечения безопасности, федеральный орган исполнительной власти, уполномоченный в области обороны, федеральный орган исполнительной власти, уполномоченный в области внешней разведки, федеральный орган исполнительной власти, уполномоченный в области технической защиты информации, и их территориальные органы;
органы государственной власти, предприятия, учреждения и организации и их структурные подразделения по защите государственной тайны.

2. Федеральный орган исполнительной власти, уполномоченный в области обеспечения безопасности, федеральный орган исполнительной власти, уполномоченный в области обороны, федеральный орган исполнительной власти, уполномоченный в области внешней разведки, федеральный орган исполнительной власти, уполномоченный в области технической защиты информации, и их территориальные органы организуют и обеспечивают защиту государственной тайны в соответствии с функциями, возложенными на них законодательством.
3. Органы государственной власти, предприятия, учреждения и организации обеспечивают защиту сведений, составляющих государственную тайну, в соответствии с возложенными на них задачами и в пределах своей компетенции. Ответственность за организацию защиты сведений, составляющих государственную тайну, в органах государственной власти, на предприятиях, в учреждениях и организациях возлагается на их руководителей.

Статья 15. Допуск должностных лиц и граждан к государственной тайне
1. Допуск должностных лиц и граждан Нижегородской области к государственной тайне осуществляется в добровольном порядке.
2. Допуск должностных лиц и граждан к государственной тайне предусматривает:
принятие на себя обязательств перед государством по нераспространению доверенных им сведений, составляющих государственную тайну;
согласие на частичные, временные ограничения их прав в соответствии со статьей 56.1 настоящего Закона;
письменное согласие на проведение в отношении их полномочными органами проверочных мероприятий;
ознакомление с нормами законодательства о государственной тайне, предусматривающими ответственность за его нарушение;
принятие решения руководителем органа государственной власти, учреждения или организации о допуске оформляемого лица к сведениям, составляющим государственную тайну.
В отношении лиц, замещающих должности, при замещении которых лица считаются допущенными к государственной тайне, проводятся мероприятия, предусмотренные в части третьей настоящей статьи.
Устанавливаются три формы допуска к государственной тайне должностных лиц и граждан, соответствующие трем степеням секретности сведений, составляющих государственную тайну: к сведениям особой важности, совершенно секретным или секретным. Наличие у должностных лиц и граждан допуска к сведениям более высокой степени секретности является основанием для доступа их к сведениям более низкой степени секретности.
Статья 15.1. Особый порядок допуска к государственной тайне
1. Судьи на период исполнения ими своих полномочий, а также адвокаты, участвующие в качестве защитников в уголовном судопроизводстве по делам, связанным со сведениями, составляющими государственную тайну, допускаются к сведениям, составляющим государственную тайну, без проведения проверочных мероприятий, предусмотренных статьей 21 настоящего Закона.
2. Указанные лица предупреждаются о неразглашении государственной тайны, ставшей им известной в связи с исполнением ими своих полномочий, и о привлечении их к ответственности в случае ее разглашения, о чем у них отбирается соответствующая расписка.

Статья 16. Основания для отказа должностного лица или гражданина в допуске к государственной тайне
1. Основаниями для отказа должностному лицу или гражданину в допуске к государственной тайне могут являться:
наличие у человека статуса обвиняемого (подсудимого) по уголовному делу о совершенном по неосторожности преступлении против государственной власти или об умышленном преступлении, наличие у него непогашенной или неснятой судимости за данные преступления, прекращение в отношении его уголовного дела (уголовного преследования) по нереабилитирующим основаниям
наличие у него медицинских противопоказаний для работы с использованием сведений, составляющих государственную тайну
выявление действий в результате проверочных мероприятий действий оформляемого лица, создающих угрозу безопасности;
уклонение его от проверочных мероприятий и (или) сообщение им заведомо ложных анкетных данных.
Решение об отказе должностному лицу или гражданину в допуске к государственной тайне принимается руководителем органа государственной власти, учреждения или организации в индивидуальном порядке с учетом результатов проверочных мероприятий.
2. Решение об отказе должностному лицу или гражданину в допуске к государственной тайне принимается руководителем органа государственной власти, учреждения или организации в индивидуальном порядке с учетом результатов проверочных мероприятий. Гражданин имеет право обжаловать это решение в вышестоящую организацию или в суд.

Статья 17. Условия прекращения допуска должностного лица или гражданина к государственной тайне
Допуск должностного лица или гражданина к государственной тайне может быть прекращен по решению руководителя органа государственной власти, предприятия, учреждения или организации в случаях:
расторжения с ним трудового договора (контракта) в связи с проведением организационных и (или) штатных мероприятий;
однократного нарушения им взятых на себя предусмотренных трудовым договором (контрактом) обязательств, связанных с защитой государственной тайны;
возникновения обстоятельств, являющихся согласно статье 16 настоящего Закона основанием для отказа должностному лицу или гражданину в допуске к государственной тайне.
Прекращение допуска к государственной тайне не освобождает должностное лицо или гражданина от взятых ими обязательств по неразглашению сведений, составляющих государственную тайну.
Решение администрации о прекращении допуска должностного лица или гражданина к государственной тайне и расторжении на основании этого с ним трудового договора (контракта) может быть обжаловано в вышестоящую организацию или в суд.

Статья 18. Ограничения прав должностного лица или гражданина, допущенных или ранее допускавшихся к государственной тайне
Должностное лицо или гражданин, допущенные или ранее допускавшиеся к государственной тайне, могут быть временно ограничены в своих правах. Ограничения могут касаться права на неприкосновенность частной жизни при проведении проверочных мероприятий в период оформления допуска к государственной тайне.

Статья 19. Ответственность за нарушение законодательства о государственной тайне.
Должностные лица и граждане, виновные в нарушении законодательства о государственной тайне, несут дисциплинарную и/или уголовную ответственность в соответствии с законодательством.

##Раздел VII. Контроль за обеспечением защиты государственной тайны.​

Статья 20. Федеральный государственный контроль за обеспечением защиты государственной тайны
1. Федеральный государственный контроль за обеспечением защиты государственной тайны осуществляется уполномоченными федеральными органами исполнительной власти (далее - органы государственного контроля) согласно их компетенции.
2. О проведении плановой проверки юридическое лицо уведомляется не позднее трех рабочих дней до ее начала путем направления органом государственного контроля письменного уведомления.
3. Выездная проверка юридических лиц проводится на основании предписания (приказа, распоряжения или иного распорядительного документа), подписанного руководителем (уполномоченным им должностным лицом) органа государственного контроля.
4. Срок проведения проверки составляет не более чем тридцать рабочих дней со дня начала ее проведения.
5. Информация об организации проверок, проводимых органами государственного контроля, в том числе о планировании, проведении и результатах таких проверок, в органы прокуратуры не направляется.

`}],bm=String.raw`
Глава 1. Основное положение

1.1 Устав является общепринятым и обязательным к соблюдению всеми сотрудниками, независимо от занимаемой должности;
1.2 Незнание данного устава не освобождает от ответственности;
1.3 За нарушение данного устава, сотрудник может получить наказание, начиная от устного предупреждения и заканчивая увольнением, с последующим внесением в чёрный список;
1.4 Руководство в правительстве осуществляет губернатор, а также его заместители, а в расположении отдела - начальник отдела.

Глава 2. Обязанности сотрудников правительства

2.1 Сотрудник обязан знать и соблюдать нормативно-правовые акты, внутренние уставы, организационные правила;
2.2 Сотрудник обязан соблюдать субординацию к коллегам, сотрудникам других государственных организаций и уважительно относиться ко всем жителям области;
2.3 Сотрудник обязан быть примером для гражданских, быть предельно честным с гражданскими, коллегами и руководством;
2.4 Сотрудник обязан отвечать за совершённые поступки;
2.5 Сотрудник обязан выполнять законные поручения, распоряжения старшего по должности;
2.6 Сотрудники правительства обязаны подчиняться внутренней иерархии власти и общей иерархии власти области.

Глава 3. Ответственность сотрудников

3.1 Запрещено нарушать законодательство, уставы, внутриорганизационные правила, должностные инструкции, -
наказывается выговором, увольнением, в зависимости от тяжести нарушения
3.2 Запрещено сотрудничать с преступными группировками, лицами, находящимися в розыске. Исключение: в интересах следствия, -
наказывается увольнением
3.3 Запрещено проявление любого неадекватного или неподобающего сотруднику правительства поведения, -
наказывается выговором, увольнением, в зависимости от тяжести нарушения
3.4 Запрещено обманывать, выдавать заведомо ложную информацию гражданам, коллегами и руководству, -
наказывается выговором, увольнением, в зависимости от тяжести нарушения
3.5 Запрещено халатно или невнимательно относиться к своим обязанностям, -
наказывается выговором, увольнением, в зависимости от тяжести нарушения
3.6 Запрещено быть некомпетентным по отношению к своей деятельности, -
наказывается выговором, увольнением, в зависимости от тяжести нарушения
3.7 Запрещено выпрашивать повышение в должности, -
наказывается выговором
3.8 Запрещено спать на территории правительства (( AFK 10+ минут или AFK без ESC )), исключение: комната отдыха, -
наказывается выговором, увольнением, в зависимости от тяжести нарушения
3.9 Запрещено не появляться на рабочем месте более 7 дней. Исключение: Отпуск, -
наказывается увольнением
3.10 Запрещено находиться в рабочей форме при занятии своими личными делами, -
наказывается выговором, увольнением, в зависимости от тяжести нарушения
3.11 Запрещено нарушать правила ношения форменной одежды, -
наказывается выговором, увольнением, в зависимости от тяжести нарушения
3.12 Запрещено ношение масок сотрудникам организации, -
наказывается выговором
3.13 Запрещено подвергать снижению репутации правительства.
наказывается выговором, увольнением, в зависимости от тяжести нарушения
3.14 Запрещено вмешиваться в работу сотрудника с гражданами (во время выдачи лицензий или снятия судимостей)
наказывается выговором

Глава 4. Использование транспорта

4.1 Запрещено использовать транспорт в личных целях, -
наказывается выговором
4.2 Запрещено безответственно относиться к транспорту, сотрудник обязан вернуть транспорт на место после использования, -
наказывается выговором
4.3 Запрещено нарушать стандартизации цветографических схем на служебном транспорте, -
наказывается выговором
4.4 Запрещено выполнять работу на своем личном или арендованном транспорте, -
наказывается выговором, увольнением, в зависимости от тяжести нарушения

Глава 5. Рабочее/обеденное/свободное время

5.1 Рабочий день в будни с 10:00 до 18:00, в выходные с 10:00 до 15:00;
5.2 Обеденный перерыв с 13:00 до 14:00 ежедневно;
5.3 В рабочее время сотрудник обязан находиться на работе и при исполнении своих обязанностей;
5.4 Запрещается отсутствовать на рабочем месте без разрешения в течение 15 минут, -
наказывается выговором, увольнением, в зависимости от тяжести нарушения
5.5 Запрещено заниматься личными делами в рабочее время, -
наказывается выговором, увольнением, в зависимости от тяжести нарушения
5.6 Как в служебное, так и в неслужебное время, сотрудник обязан воздержаться от действий, которые могут нанести ущерб авторитету и репутации правительства, -
наказывается выговором, увольнением, в зависимости от тяжести нарушения

Глава 6. Специальная связь

6.1 Запрещено использовать рацию не по назначению
наказывается выговором
6.2 Запрещено намеренно создавать помехи, -
наказывается выговором
6.3 Запрещено игнорирование рации, -
наказывается выговором, увольнением, в зависимости от тяжести нарушения
6.4 Запрещено нарушать всевозможные правила общения и субординации при разговоре в рации, -
наказывается выговором, увольнением, в зависимости от тяжести нарушения
6.5 При выходе на связь с какой-либо организацией сотрудник обязан для начала представиться, назвать звание или должность, фамилию
(( Пример: /d [ПР/УМВД] Губернатор Кирсанов, на связь..))
наказывается выговором
6.6 Запрещено нарушать правила пользования общей радиоволны связь, -
наказывается выговором, увольнением, в зависимости от тяжести нарушения

Глава 7. Отпуск и увольнения

7.1 Во время отпуска сотруднику запрещается нарушать любые правила, уставы, законодательство, проявлять любое неподобающее сотруднику правительства поведение, совершать действия, порочащие честь и репутацию правительства
наказывается выговором, увольнением, в зависимости от тяжести нарушения
7.2 Запрещено увольняться с организации не отработав на своей должности минимум 3-ёх дней
наказывается занесением в черный список организации
7.3 Во время нахождения в отпуске запрещено вступать в другие организации;
7.4 С отпуска можно возвращаться раньше срока, но не позднее его окончания;
7.5 При наличии выговоров запрещено брать отпуск. Максимальный срок отпуска - 14 дней.
7.6 Отпуск разрешено брать с должности адвоката

Глава 8. Организация сборов, построений, собраний

8.1 Сотрудник обязан явиться на сбор по первому требованию, -
наказывается выговором, увольнением, в зависимости от тяжести нарушения
8.2 Находясь на собрании/построении сотрудник обязан стоять молча, не разговаривая и не совершая никаких действий. Запрещается разговаривать; переговариваться шёпотом, издавать иные звуки (( производить манипуляции с микрофоном, чатом )) покидать строй без разрешения, двигаться, совершать иные действия (( в том числе отыгровки, не имеющие смысла в строю, кроме отыгровок строевых команд )), доставать телефон без разрешения руководства
наказывается выговором
8.3 Организовывать сбор может только: средний, старший и высший начальствующие составы
`,Cl=[{id:"gov",title:"Внутренний устав Правительства",text:bm,source:"https://forum.amazing-online.com/threads/vnutrennij-ustav.1027735/"},{id:"army",title:"Внутренний устав Воинской части",text:`
    Глава 1. Общие положения

1.1 Устав является общепринятым и обязательным к соблюдению всеми военнослужащими, независимо от звания и занимаемой должности;
1.2 За нарушение данного устава, военнослужащий может получить наказание, начиная от устного предупреждения и заканчивая увольнением, с последующий внесением в чёрный список;
1.3 Незнание данного устава не освобождает от ответственности;
1.4 Руководство воинской части осуществляет начальник, а также его заместители (Генерал ВЧ/полковники ВЧ), а в расположении отдела - начальник отдела.

Глава 2. Обязанности военнослужащих

2.1 Военнослужащий обязан знать и соблюдать законы, обеспечивать их исполнение и соблюдение, как лично, так и со стороны гражданских лиц;
2.2 Военнослужащий обязан знать и соблюдать нормативно-правовые акты, внутренние уставы и организационные правила;
2.3 Военнослужащий обязан пресекать любые незаконные попытки проникновения на воинскую часть;
2.4 Военнослужащий обязан соблюдать субординацию к сослуживцам, сотрудникам других государственных организаций и уважительно относиться ко всем жителям области;
2.5 Военнослужащий обязан быть примером для гражданских, гарантом закона, защищать права, свободу, жизнь и здоровье граждан, быть предельно честным с гражданскими, коллегами и руководством;
2.6 Военнослужащий обязан отвечать за совершённые поступки;
2.7 Военнослужащий обязан выполнять законные поручения, распоряжения старшего по званию/должности;
2.8 Военнослужащий обязан при первой просьбе гражданина объяснить причину его задержания;
2.9 Военнослужащий обязан защищать законные права и интересы граждан, лиц без гражданства, иностранных граждан.
2.10 Военнослужащий ВЧ обязаны подчиняться внутренней иерархии власти и общей иерархии власти области;
2.11 Для пропуска гражданских, военнослужащих, государственных лиц, военнослужащие обязаны удостоверить личность человека.

Глава 3. Запреты для военнослужащих

3.1 Запрещено нарушать законодательство, уставы, внутриорганизационные правила, должностные инструкции;
наказывается выговором, увольнением, в зависимости от тяжести нарушения
3.2 Запрещено употреблять алкогольные напитки, наркотические вещества или появляться на рабочем месте с признаками алкогольного и наркотического опьянения;
наказывается выговором, увольнением, в зависимости от тяжести нарушения
3.3 Запрещено обманывать, выдавать заведомо ложную информацию гражданам, коллегами и руководству;
наказывается выговором, увольнением, в зависимости от тяжести нарушения
3.4 Запрещено халатно или невнимательно относиться к своим обязанностям;
наказывается выговором, увольнением, в зависимости от тяжести нарушения
3.5 Запрещено сотрудничать с преступными группировками, лицами, находящимися в розыске. Исключение: в интересах следствия;
наказывается увольнением
3.6 Запрещено находиться в служебной форме при занятии своими личными делами;
наказывается выговором, увольнением, в зависимости от тяжести нарушения
3.7 Запрещено проявление любого неадекватного или неподобающего военнослужащим поведения;
наказывается выговором, увольнением, в зависимости от тяжести нарушения
3.8 Запрещается спать при исполненнии служебных обязанностей (( AFK 10+ минут )), в строю (( AFK 3+ минут )). Исключение: казарма;
наказывается выговором
3.9 Запрещено быть некомпетентным по отношению к своей деятельности;
наказывается выговором, увольнением, в зависимости от тяжести нарушения
3.10 Запрещено не появляться на служебном месте более 7 дней без предупреждения. Исключение: отпуск;
наказывается увольнением
3.11 Военнослужащему запрещается иметь судимости. Все судимости, если таковые имелись ранее, должны быть погашены в установленном законом порядке, легальным путем;
наказывается выговором, увольнением, в зависимости от тяжести нарушения
3.12 Запрещено бездействовать/не исполнять свои прямые обязанности;
наказывается выговором, увольнением, в зависимости от тяжести нарушения
3.13 Запрещено носить маску. Исключение: приказ начальника (генерал, полковник);
наказывается выговором
3.14 Запрещено военнослужащим в звании «Рядовой» заступать в караул;
наказывается выговором
3.15 Запрещено начальникам/заместителям подразделений носить/выдавать не уставную форму своего подразделения. Исключение: приказ;
наказывается выговором
3.16 Запрещено использовать музыкальный центр на территории воинской части;
наказывается выговором
3.17 Запрещено спать на рабочем месте и/или в рабочее время (( AFK без ESC ));
наказывается выговором
3.18 Запрещено входить/пропускать граждан на территорию воинской части через ворота КПП;
наказывается выговором
3.19 Запрещено использовать электросамокаты на территории воинской части;
наказывается выговором
3.20 Запрещено военнослужащим заходить во внутрь склада/бункера без особой на то причины. Исключение: военная полиция, старший состав;
наказывается выговором
3.21 Запрещено производить загрузку патронов или материалов без разрешение руководства;
наказывается выговором, увольнением
3.22 Запрещено выпрашивать проверку рапорта, повышение;
наказывается выговором, увольнением
3.23 Запрещено передавать военное имущества третьим лицам;
наказывается выговором, увольнением
3.24 Запрещено нарушать маршрут патрулирования; Исключение: по нуждам здоровья.
наказывается выговором, увольнением

Глава 4. Специальная связь

4.1 Запрещено использовать рацию не по назначению;
наказывается выговором
4.2 Запрещено передавать в рацию информацию, не несущую смысловой нагрузки;
наказывается выговором
4.3 Запрещено намеренно создавать помехи, игнорирование рации;
наказывается выговором
4.4 Запрещено нарушать всевозможные правила общения и субординации при разговоре в рации.
наказывается выговором, увольнением, в зависимости от тяжести нарушения
4.5 При выходе на связь с какой-либо организацией военнослужащий обязан для начала представиться, назвать звание или должность, фамилию
(( Пример: /d [ВЧ/УМВД] Генерал-майор Кирсанов, на связь..))
наказывается выговором
4.6 Запрещено нарушать правила пользования общей радиоволны связи
наказывается выговором

Глава 5. Использование транспорта

5.1 Запрещено использовать служебный транспорт в личных целях;
наказывается выговором, увольнением, в зависимости от тяжести нарушения
5.2 Запрещено безответственно относиться к транспорту, военнослужащийотрудник обязан вернуть транспорт на место после использования;
наказывается выговором
5.3 Запрещено нарушать стандартизации цветографических схем на служебном транспорте;
наказывается выговором
5.4 Запрещено парковать личный транспорт на служебной парковке без звания "Старшина".
наказывается выговором
5.5 Запрещено использовать личный/арендованный транспорт в служебное время. Исключение: государственный реестр;
наказывается выговором

Глава 6. Рабочее/свободное/обеденное время

6.1 Рабочий день в будни с 10:00 до 21:00, в выходные с 10:00 до 19:00. В случае ЧП работа осуществляется круглосуточно;
6.2 Обеденный перерыв с 13:00 до 14:00 ежедневно;
6.3 Запрещено находится на территории воинской части без служебной формы в течение 5 минут;
наказывается выговором
6.4 В рабочее время военнослужащий обязан находиться на службе и при исполнении своих обязанностей;
наказывается выговором, увольнением, в зависимости от тяжести нарушения
6.5 Запрещается отсутствовать на служебном месте без разрешения в течение 15 минут;
наказывается выговором, увольнением, в зависимости от тяжести нарушения
6.6 Запрещено заниматься личными делами в рабочее время;
наказывается выговором, увольнением, в зависимости от тяжести нарушения
6.7 Как в служебное, так и в неслужебное время, военнослужащий обязан воздержаться от действий, которые могут нанести ущерб авторитету и репутации воинской части;
наказывается выговором, увольнением, в зависимости от тяжести нарушения
6.8 Любому военнослужащему запрещается выходить в патрулирование без напарника с 10:00 до 20:00. (( По МСК ));
наказывается выговором
6.9 Военнослужащие до звания старшего сержанта включительно не имеют права покидать территорию воинской части после рабочего времени;
наказывается выговором, увольнением, в зависимости от тяжести нарушения
6.10 Военнослужащий может быть вызван в любое время на работу руководством;
наказывается выговором
6.11 За ночные смены командир части и его заместители могут выдавать премии военнослужащим, которые отличились;

Глава 7. Отпуск и увольнения

7.1 Во время отпуска военнослужащему запрещается нарушать любые правила, уставы, законодательство, проявлять любое неподобающее военнослужащему поведение, совершать действия, порочащие честь и репутацию воинской части;
наказывается выговором, увольнением, в зависимости от тяжести нарушения
7.2 Запрещено увольняться с организации не отработав на своей должности минимум 3-ёх дней;
наказывается занесением в черный список организации
7.3 Во время нахождения в отпуске запрещено вступать в другие организации;
7.4 С отпуска можно возвращаться раньше срока, но не позднее его окончания;
7.5 При наличии выговоров запрещено брать отпуск. Максимальный срок отпуска - 14 дней.
7.6 Отпуск разрешено брать с звания "Старшина"

Глава 8. Организация построений. Правила поведения в строю

8.1 Военнослужащий обязан явиться в строй по первому приказу;
наказывается выговором
8.2 Перед тем, как встать в строй, спросить разрешение: "Разрешите встать в строй?";
наказывается выговором
8.3 В строю военнослужащий обязан стоять молча, не разговаривая и не совершая никаких действий. Запрещается разговаривать, переговариваться шёпотом, издавать иные звуки, покидать строй без разрешения, двигаться, совершать иные действия (( в том числе отыгровки, не имеющие смысла в строю, кроме отыгровок строевых команд )), доставать телефон, без приказа извлекать из специальных чехлов, кобуры оружие, средства задержания;
наказывается выговором
8.4 При необходимости выйти из строя спросить разрешение: товарищ звание, разрешите обратиться;
8.5 В строю обязательно соблюдение правил выполнения строевых команд;
8.6 Организовывать построения может только: средний, старший и высший начальствующие составы;`},{id:"ess",title:"Внутренний устав ЕСС",text:`Глава 1. Общие положения

1.1 Устав является общепринятым и обязательным к соблюдению всеми сотрудниками, независимо от занимаемой должности;
1.2 За нарушение данного устава, сотрудник может получить наказание, начиная от устного предупреждения и заканчивая увольнением, с последующий внесением в чёрный список;
1.3 Незнание данного устава не освобождает от ответственности;
1.4 Руководство в ЕСС осуществляет начальник департамента, а также его заместители, а в расположении отдела - начальник отдела.

Глава 2. Обязанности сотрудников ЕСС по Нижегородской области

2.1 Сотрудник обязан знать и соблюдать законы;
2.2 Сотрудник обязан знать и соблюдать нормативно-правовые акты, внутренние уставы, организационные правила и хранить врачебную тайну
2.3 Сотрудник обязан соблюдать субординацию к коллегам, сотрудникам других государственных организаций и уважительно относиться ко всем жителям области;
2.4 Сотрудник обязан быть примером для гражданских, быть предельно честным с гражданскими, коллегами и руководством;
2.5 Сотрудник обязан отвечать за совершённые поступки;
2.6 Сотрудник обязан выполнять законные поручения, распоряжения старшего по должности
2.7 Сотрудник больницы обязан оказать обратившемуся медицинскую помощь (исключение: сотрудник в праве отказать пациенту в курсе быстрого лечения, если тот проявляет неадекватное поведение)
2.8 Лечение в больнице проходит только в палатах (исключение: лечение в кабинете индивидуальных болезней), а вне больницы разрешено лечить только в карете (исключение: наличие аптечки первой помощи) совместно с напарником
2.9 Сотрудники ЕСС обязаны подчиняться внутренней иерархии власти и общей иерархии власти области;

Глава 3. Запреты для сотрудников ЕСС по Нижегородской области

3.1 Запрещено нарушать законодательство, уставы, внутриорганизационные правила, должностные инструкции;
наказывается выговором, увольнением, в зависимости от тяжести нарушения
3.2 Запрещено употреблять алкогольные напитки, наркотические вещества или появляться на рабочем месте с признаками алкогольного и наркотического опьянения;
наказывается выговором, увольнением, в зависимости от тяжести нарушения
3.3 Запрещено обманывать, выдавать заведомо ложную информацию гражданам, коллегами и руководству;
наказывается выговором, увольнением, в зависимости от тяжести нарушения
3.4 Запрещено халатно или невнимательно относиться к своим обязанностям;
наказывается выговором, увольнением, в зависимости от тяжести нарушения
3.5 Запрещено сотрудничать с преступными группировками, лицами, находящимися в розыске. Исключение: в интересах следствия;
наказывается увольнением
3.6 Запрещено находиться в рабочей форме при занятии своими личными делами;
наказывается выговором, увольнением, в зависимости от тяжести нарушения
3.7 Запрещено проявление любого неадекватного или неподобающего сотруднику ЕСС поведения;
наказывается выговором, увольнением, в зависимости от тяжести нарушения
3.8 Запрещено не появляться на рабочем месте более 7 дней без предупреждения. Исключение: Отпуск;
наказывается увольнением
3.9 Сотруднику запрещается иметь судимости. Все судимости, если таковые имелись ранее, должны быть погашены в установленном законом порядке, легальным путем;
наказывается выговором, увольнением, в зависимости от тяжести нарушения
3.11 Запрещено бездействовать/не исполнять обязанности по оказанию помощи гражданам;
наказывается выговором, увольнением, в зависимости от тяжести нарушения
3.13 Запрещено назначать лечение и диагноз без уточнения жалобы или болезни;
наказывается выговором, увольнением, в зависимости от тяжести нарушения
3.14 Запрещено обслуживать пациента, если его диагностирует другой врач;
наказывается выговором
3.15 Запрещается спать при исполнении служебных обязанностей (( AFK 10+ минут )), исключение: комната отдыха;
наказывается выговором
3.16 Запрещено спать на рабочем месте (AFK без ESC)
наказывается выговором
3.17 Запрещено ношение любого вида оружия в рабочее время, на служебной территории и в рабочей форме.
наказывается выговором
3.18 Запрещено сотрудникам отдела ОРД выезжать на вызовы первой-медицинской помощи
наказывается выговором
3.19 Запрещено выезжать на вызовы когда в палатах находятся менее 2-ух сотрудников
наказывается выговором
3.20 Сотрудникам МЧС запрещено находиться на территории больницы бесцельно. За исключением случаев получения лечения или вызова руководства ЕСС.
наказывается выговором

Глава 4. Специальная связь

4.1 Запрещено использовать рацию не по назначению;
наказывается выговором
4.2 Запрещено передавать в рацию информацию, не несущую смысловой нагрузки;
наказывается выговором
4.3 Запрещено намеренно создавать помехи;
наказывается выговором
4.4 Запрещено игнорирование рации;
наказывается выговором
4.5 Запрещено нарушать всевозможные правила общения и субординации при разговоре в рации.
наказывается выговором, увольнением, в зависимости от тяжести нарушения
4.6 При выходе на связь с какой-либо организацией сотрудник обязан для начала представиться, назвать звание или должность, фамилию
(( Пример: /d [ЕСС/УФСБ] Начальник департамента Кирсанов, на связь..))
наказывается выговором
4.7 Запрещено нарушать правила пользования общей радиоволны связи;
наказывается выговором

Глава 5. Рабочее/свободное/обеденное время

5.1 Рабочий день в будни с 10:00 до 20:00, в выходные с 10:00 до 19:00;
5.2 Обеденный перерыв с 13:00 до 14:00 ежедневно;
5.3 В рабочее время сотрудник обязан находиться на работе и при исполнении своих обязанностей;
наказывается выговором, увольнением, в зависимости от тяжести нарушения
5.4 Запрещается отсутствовать на рабочем месте без разрешения в течении 15 минут;
наказывается выговором, увольнением, в зависимости от тяжести нарушения
5.5 Запрещено заниматься личными делами в рабочее время;
наказывается выговором, увольнением, в зависимости от тяжести нарушения
5.6 Как в служебное, так и в неслужебное время, сотрудник обязан воздержаться от действий, которые могут нанести ущерб авторитету и репутации ЕСС;
наказывается выговором, увольнением, в зависимости от тяжести нарушения
5.7 Оказание медицинской помощи в больничном отделении должно происходить круглосуточно.

5.8 Сотрудник может быть вызван в любое время на работу руководством;
наказывается выговором

Глава 6. Использование транспорта

6.1 Запрещено использовать служебный транспорт в личных целях;
наказывается выговором
6.2 Запрещено использовать личный транспорт или арендованный в рабочее время
наказывается выговором
6.3 Запрещено безответственно относиться к транспорту, сотрудник обязан вернуть транспорт на место после использования;
наказывается выговором
6.4 Запрещено нарушать стандартизации цветографических схем на служебном транспорте;
наказывается выговором
6.5 Запрещено парковать личный транспорт на служебной парковке.
наказывается выговором
6.6 Любому сотруднику запрещается выходить в патрулирование без напарника с 10:00 до 20:00. (( По МСК ));
наказывается выговором
6.7 Патрулирование области должно осуществляться только на предназначенном для этого транспорте:
⠀⠀⠀⠀1) Сотрудники МЧС осуществляют патрулирование на пожарных автомобилях УРАЛ
⠀⠀⠀⠀2) Сотрудники ОБ осуществляют патрулирование на каретах скорой помощи
наказывается выговором
Глава 7. Отпуск и увольнения

7.1 Во время отпуска сотруднику запрещается нарушать любые правила, уставы, законодательство, проявлять любое неподобающее сотруднику ЕСС поведение, совершать действия, порочащие честь и репутацию ЕСС;
наказывается выговором, увольнением, в зависимости от тяжести нарушения
7.2 Запрещено увольняться с организации не отработав на своей должности минимум 3-ёх дней;
наказывается занесением в черный список организации
7.3 Во время нахождения в отпуске запрещено вступать в другие организации;
7.4 С отпуска можно возвращаться раньше срока, но не позднее его окончания;
7.5 При наличии выговоров запрещено брать отпуск. Максимальный срок отпуска - 14 дней.
7.6 Отпуск разрешено брать с должности терапевта

Глава 8. Организация сборов. Правила поведения в сборах (собраниях)

8.1 Сотрудник обязан явиться на сбор по первому объявлению;
наказывается выговором
8.2 Перед тем, как войти в кабинет, спросить разрешение: "Можно войти?";
8.3 Находясь на собрании сотрудник обязан стоять молча, не разговаривая и не совершая никаких действий. Запрещается разговаривать; переговариваться шёпотом, издавать иные звуки (( производить манипуляции с микрофоном, чатом )) покидать строй без разрешения, двигаться, совершать иные действия (( в том числе отыгровки, не имеющие смысла в строю, кроме отыгровок строевых команд )), доставать телефон без разрешения руководства
наказывается выговором
8.4 Организовывать сбор может только: средний, старший и высший начальствующие составы;`},{id:"fsin",title:"Внутренний устав ФСИН",text:`Глава 1. Общие положения

1.1 Устав является общепринятым и обязательным к соблюдению всеми сотрудниками, независимо от звания и занимаемой должности;
1.2 За нарушение данного устава, сотрудник может получить наказание, начиная от устного предупреждения и заканчивая увольнением, с последующий внесением в чёрный список;
1.3 Незнание данного устава не освобождает от ответственности;
1.4 Руководство в УФСИН осуществляет начальник, а также его заместители (генерал-майор внутренней службы/полковники внутренней службы), а в расположении отдела - начальник отдела.

Глава 2. Обязанности сотрудников УФСИН по Нижегородской области

2.1 Сотрудник обязан знать и соблюдать законы, обеспечивать их исполнение и соблюдение, как лично, так и со стороны гражданских лиц;
2.2 Сотрудник обязан знать и соблюдать нормативно-правовые акты, внутренние уставы и организационные правила;
2.3 Сотрудник обязан придерживаться основного принципа презумпции невиновности;
2.4 Сотрудник обязан пресекать любые административные и уголовные правонарушения со стороны заключенных;
2.5 Сотрудник обязан соблюдать субординацию к сослуживцам, сотрудникам других государственных организаций и уважительно относиться ко всем жителям области;
2.6 Сотрудник обязан быть примером для гражданских, гарантом закона, защищать права, свободу, жизнь и здоровье граждан, быть предельно честным с гражданскими, коллегами и руководством;
2.7 Сотрудник обязан отвечать за совершённые поступки;
2.8 Сотрудник обязан выполнять законные поручения, распоряжения старшего по званию/должности;
2.9 Любой сотрудник ФСИН обязан фиксировать нарушения гражданина на нагрудную видеокамеру или же на видеорегистратор;
2.10 Сотрудник обязан защищать законные права и интересы заключенных;
2.11 Сотрудник обязан представиться и по требованию задержанного предъявить удостоверение;
2.12 Сотрудники ФСИН обязаны подчиняться внутренней иерархии власти и общей иерархии власти области;

Глава 3. Запреты для сотрудников УФСИН по Нижегородской области

3.1 Запрещено нарушать законодательство, уставы, внутриорганизационные правила, должностные инструкции;
наказывается выговором, увольнением, в зависимости от тяжести нарушения
3.2 Запрещено употреблять алкогольные напитки, наркотические вещества или появляться на рабочем месте с признаками алкогольного и наркотического опьянения;
наказывается выговором, увольнением, в зависимости от тяжести нарушения
3.3 Запрещено обманывать, выдавать заведомо ложную информацию гражданам, коллегами и руководству;
наказывается выговором, увольнением, в зависимости от тяжести нарушения
3.4 Запрещено халатно или невнимательно относиться к своим обязанностям;
наказывается выговором, увольнением, в зависимости от тяжести нарушения
3.5 Запрещено сотрудничать с преступными группировками, лицами, находящимися в розыске. Исключение: в интересах следствия;
наказывается увольнением
3.6 Запрещено находиться в рабочей форме при занятии своими личными делами;
наказывается выговором, увольнением, в зависимости от тяжести нарушения
3.7 Запрещено проявление любого неадекватного или неподобающего сотруднику ФСИН поведения;
наказывается выговором, увольнением, в зависимости от тяжести нарушения
3.8 Запрещается спать при исполнении служебных обязанностей (( AFK 10+ минут )), исключение: комната отдыха;
наказывается выговором
3.9 Запрещено быть некомпетентным по отношению к своей деятельности;
наказывается выговором, увольнением, в зависимости от тяжести нарушения
3.10 Запрещено не появляться на рабочем месте более 7 дней без предупреждения. Исключение: Отпуск;
наказывается увольнением
3.11 Сотруднику запрещается иметь судимости. Все судимости, если таковые имелись ранее, должны быть погашены в установленном законом порядке, легальным путем;
наказывается увольнением
3.12 Запрещено бездействовать/не исполнять обязанности по оказанию помощи гражданам;
наказывается выговором, увольнением, в зависимости от тяжести нарушения
3.13 Запрещено выдавать розыск заключённым;
наказывается увольнением
3.14 Запрещено ношение маски сотрудникам ФСИН на территории колонии (исключение: приказ начальника ФСИН)
наказывается выговором
3.15 Запрещено начальникам/заместителям подразделений носить/выдавать не уставную форму своего подразделения. Исключение: приказ, руководство подразделения может носить уставную форму руководства подразделения
наказывается выговором
3.16 Запрещено наказывать/поощрять заключенных, не имея доказательств на противоправные действия/примерное поведение с их стороны
наказывается выговором, увольнением, в зависимости от тяжести нарушения
3.17 Запрещено снижать репутацию ФСИН
наказывается выговором, увольнением, в зависимости от тяжести нарушения

Глава 4. Специальная связь

4.1 Запрещено использовать рацию не по назначению;
наказывается выговором
4.2 Запрещено передавать в рацию информацию, не несущую смысловой нагрузки;
наказывается выговором
4.3 Запрещено намеренно создавать помехи;
наказывается выговором
4.4 Запрещено игнорирование рации;
наказывается выговором, увольнением, в зависимости от тяжести нарушения
4.5 Запрещено нарушать всевозможные правила общения и субординации при разговоре в рации.
наказывается выговором, увольнением, в зависимости от тяжести нарушения
4.6 При выходе на связь с какой-либо организацией сотрудник обязан для начала представиться, назвать звание или должность, фамилию
(( Пример: /d [УФСИН/УМВД] Генерал-майор Кирсанов, на связь..))
наказывается выговором
4.7 Запрещено нарушать правила пользования общей радиоволны связи
наказывается выговором, увольнением, в зависимости от тяжести нарушения


Глава 5. Использование транспорта

5.1 Запрещено использовать служебный транспорт в личных целях;
наказывается выговором
5.2 Запрещено безответственно относиться к транспорту, сотрудник обязан вернуть транспорт на место после использования;
наказывается выговором
5.3 Запрещено нарушать стандартизации цветографических схем на служебном транспорте.
наказывается выговором
5.4. Запрещается использовать личный или арендованный транспорт в рабочее время
наказывается выговором, увольнением, в зависимости от тяжести нарушения

Глава 6. Рабочее/свободное/обеденное время

6.1 Рабочий день с 8:00 до 22:00. В случае ЧП работа осуществляется круглосуточно;
6.2 Обеденный перерыв с 13:00 до 14:00 ежедневно
6.3 В рабочее время сотрудник обязан находиться на службе и при исполнении своих обязанностей;
наказывается выговором, увольнением, в зависимости от тяжести нарушения
6.4 Запрещается отсутствовать на рабочем месте без разрешения в течении 15 минут;
наказывается выговором, увольнением, в зависимости от тяжести нарушения
6.5 Запрещено заниматься личными делами в рабочее время;
наказывается выговором, увольнением, в зависимости от тяжести нарушения
6.6 Как в служебное, так и в неслужебное время, сотрудник обязан воздержаться от действий, которые могут нанести ущерб авторитету и репутации федеральной службы исполнения наказания;
наказывается выговором, увольнением, в зависимости от тяжести нарушения
6.7 Сотрудник может быть вызван в любое время на работу руководством.
наказывается выговором

Глава 7. Отпуск и увольнения

7.1 Во время отпуска сотруднику запрещается нарушать любые правила, уставы, законодательство, проявлять любое неподобающее сотруднику уголовно-исполнительной системы поведение, совершать действия, порочащие честь и репутацию федеральной службе исполнения наказаний;
наказывается выговором, увольнением, в зависимости от тяжести нарушения
7.2 Запрещено увольняться с организации не отработав на своей должности минимум 3-ёх дней;
наказывается занесением в черный список организации
7.3 Во время нахождения в отпуске запрещено вступать в другие организации;
7.4 С отпуска можно возвращаться раньше срока, но не позднее его окончания;
7.5 При наличии выговоров запрещено брать отпуск. Максимальный срок отпуска - 14 дней.

Глава 8. Организация построений. Правила поведения в строю

8.1 Сотрудник обязан явиться в строй по первому приказу;
наказывается выговором, увольнением, в зависимости от тяжести нарушения
8.2 Перед тем, как встать в строй, спросить разрешение: "Разрешите встать в строй?";
8.3 В строю сотрудник обязан стоять молча, не разговаривая и не совершая никаких действий. Запрещается разговаривать; переговариваться шёпотом, издавать иные звуки (( производить манипуляции с микрофоном, чатом )) покидать строй без разрешения, двигаться, совершать иные действия (( в том числе отыгровки, не имеющие смысла в строю, кроме отыгровок строевых команд )), доставать телефон, без приказа извлекать из специальных чехлов, кобуры оружие, средства задержания;
наказывается выговором
8.4 При необходимости выйти из строя спросить разрешение: товарищ звание, разрешите обратиться;
8.5 В строю обязательно соблюдение правил выполнения строевых команд;
8.6 Организовывать построения может только: средний, старший и высший начальствующие составы;
8.7 Построение проводится по подразделениям; порядок расположения сотрудников в строю от старшего по званию к младшему; начальствующий состав выстраивается перед своим подразделением.
8.8 Запрещен сон в строю. Исключение: если вам нужно отойти, то вам требуется предупредить руководителя строя (( /b ))
наказывается выговором`}],Wm=String.raw`
Учебные материалы для сотрудников Правительственного аппарата

Лекция на тему: "Субординация и общение"​

Субординация - это система служебных отношений, четко связанных с иерархией, подчинением младших по должности к старшим.
Субординация предусматривает уважительные отношения между руководителем и подчиненным, старший по званию/должности отдает приказы или распоряжение младшему по званию/должности, а также отчет по результатам их работы перед вышестоящим руководством.
То есть младшие сотрудники должны выполнять приказы и поручения начальства, согласно
пункту устава 2.2. За данное нарушение сотрудник получит выговор или увольнение.
Вы должны с уважением относится ко всем сотрудникам Правительства, исключительно по форме
"Товарищ и должность сотрудника, к которому обращаетесь".
Также Вы должны к каждому гражданину области обращаться на "Вы", независимо от его внешности.
В общении Вы обязаны быть вежливы и спокойны,
Не нарушайте правила и не нарушайте субординацию, дабы не получить наказание.


Лекция на тему: "Департаменты Правительственного Аппарата"
​
Департамент — это структурное подразделение Правительственного аппарата, осуществляющееся решением поставленных вопросов в пределах выделенных полномочий.

Департамент осуществляет управление и контроль за деятельностью подведомственных организаций или сфер, выполняя функции, такие как регулирование, надзор, проверка, планирование, и реализация государственной политики в своей области. В зависимости от сферы своей деятельности, департамент может заниматься здравоохранением, чрезвычайными ситуациями, правопорядком, вооружёнными силами и другими областями.

В структуре Правительственного аппарата существуют следующие департаменты:
юридический департамент (ЮД): департамент, осуществляющий контроль сотрудников Правительственного Аппарата;
департамент внутренних дел (ДВД): департамент, осуществляющий контроль органов внутренних дел, таких как ГАИ, УМВД, УФСИН;
департамент вооружённых сил (ДВС): департамент, осуществляющий контроль вооружённых сил;
департамент здравоохранения (ДЗ): департамент, осуществляющий контроль органов здравоохранения, таких как ЕСС.
Во внутренней структуре департамента существуют следующие должности, занимаемые сотрудниками департамента:
начальник департамента;
заместитель начальника департамента;
инспектор;
стажёр.

Лекция на тему: "Правила пользования рацией"​

Рация — это портативное и удобное средство связи, используемое для коммуникации и организации взаимодействия сотрудников организации. Дабы передаваемая информация оставалась четкой, оперативной и понятно, сотрудникам требуется придерживаться правил её использования, а также установленных стандартов передачи данных, называемых докладом(-ами).

Формы докладов:

доклады при нахождении на посту:
«Докладывает *Фамилия*. Заступил на пост *Название поста*.»
«Докладывает *Фамилия*. Продолжаю дежурство на посту *Название поста*.»
«Докладывает *Фамилия*. Покинул пост *Название поста*.»

доклады при сопровождении сотрудников Правительственного Аппарата:
«Докладывает *Фамилия*. Начал сопровождение *должность* *фамилия*.»
«Докладывает *Фамилия*. Продолжаю сопровождение *должность* *фамилия*.»
«Докладывает *Фамилия*. Закончил сопровождение *должность* *фамилия*.»

доклады при дежурстве за стойкой регистрации/холле:
«Докладывает *Фамилия*. Начал дежурство за стойкой регистрации/в холле правительства.»
«Докладывает *Фамилия*. Продолжаю дежурство за стойкой регистрации/в холле правительства.»
«Докладывает *Фамилия*. Закончил дежурство за стойкой регистрации/в холле правительства.»

доклады при осуществлении надзора:
«Докладывает *Фамилия*. Начал проводить надзорную деятельность за *Наименование организации*»
«Докладывает *Фамилия*. Продолжаю проводить надзорную деятельность за *Наименование организации*»
«Докладывает *Фамилия*. Закончил проводить надзорную деятельность за *Наименование организации*»

доклады о проведении аттестации, практики, экзамена, тренировки:
«Докладывает *Фамилия*. Начал проводить *экзамен/практику/аттестацию/тренировку* у сотрудника(-ов) *Фамилия Имя сотрудника(-ов)*.»;
«Докладывает *Фамилия*. Закончил проводить *экзамен/практику/аттестацию/тренировку* у сотрудника(-ов) *Фамилия Имя сотрудника(-ов)*.»;

При использовании рации запрещено:
использовать рацию для обсуждения и утверждения покупки/продажи имущества и иных материальных вещей;
произносить не разборчивый текст (доклад(-ы)), засорять волну либо создавать помехи;
игнорировать доклады в рацию, особенно если доклады ранее относились к вам;
использовать при разговоре ненормативную брань, ругань и оскорбления.


Лекция на тему: "Строй и правила нахождения в нём"
​
Строй — это организованная форма расположения сотрудников или участников в определенном порядке, используемая для обеспечения порядка и дисциплины в процессе работы, тренировок или других официальных мероприятий.
Соблюдение этих простых, установленных правил помогает поддерживать порядок и эффективность работы сотрудников.

При нахождении в строю запрещается:
1. Запрещены разговоры по телефону, рации, выкрики и другие отвлекающие действия.
На построении важно поддерживать тишину и сосредоточенность. Разговоры по телефону и другие отвлекающие действия нарушают порядок и мешают эффективному выполнению задач.
2. Запрещено не приходить на построение, находясь в области.
Пропуск построения без уважительной причины подрывает дисциплину и влияет на организацию работы всего состава.
3. Запрещено спать в строю (( AFK без использования клавиши «ESC»)).
Отсутствие активности в строю нарушает дисциплину и снижает эффективность выполнения задач.

Лекция на тему: "Специальные средства: их виды и порядок их применения"
​
Специальные средства — это технические портативные устройства, используемые сотрудниками охраны Правительственного Аппарата для обеспечения безопасности иных сотрудников и лиц, находящихся в их окружении.

К специальным средствам, доступным сотрудникам Правительственного Аппарата для применения, относятся:
электрошоковое устройство (электрошокер) — небольшое устройство, создающее малый по своей мощности импульс электрического тока при касании им безопасных частей тела правонарушителя, временно переводя его в ограниченное состояние действий;
палка специальная (дубинка) — предмет противодействия грубых и массовых нарушений, применяемый охранниками Правительственного Аппарата в отношении правонарушителей путём нанесения ударов по безопасным частям тела;
сковывающее средство (стяжки) — предмет ограничения действий правонарушителей путём ограничения движений частей тела, в основном рук.

Использовать специальные средства не по назначению строго запрещено.
Также запрещено использование специальных средств из окон транспортных средств.

Цели, для которых разрешено использовать специальные средства:
для отражения нападения на гражданское лицо или сотрудника государственной организации.
для пресечения преступления или административного правонарушения.
для задержания лица, застигнутого при совершении преступления и пытающегося скрыться.
для задержания лица, нарушающего порядок в помещении здания правительства или около него.
при самообороне.
Порядок действий при использовании специальных средств:
Сообщить гражданскому лицу о его нарушении.
Предупредить гражданское лицо о том, что если оно не прекратит совершать те или иные действия, в отношении него будут применены специальные средства.
Лекция на тему: "Юридическая деятельность"
​
Юридическая консультация — это профессиональная помощь, предоставляемая юристом или адвокатом для решения правовых вопросов и защиты интересов нуждающихся в ней лиц.

Порядок осуществления юридической помощи, связанная с деятельностью адвокатов по преждевременному освобождению по законным основаниям, устанавливается внутренним порядком исправительной колонии (ИК), которая включает в себя временные промежутки посещения адвокатом, а также права и обязанности адвокатов на территории ИК.

Более подробно разберём порядок оказания юридической помощи адвокатом на территории ИК:

1. Запрос адвоката к сотрудникам исправительной колонии (ИК) на прибытие согласно установленного графика:
Перед тем как отправиться к выполнению своих должностных обязанностей, адвокат изучает внутренние распорядки деятельности исправительной колонии, касающихся взаимодействия с сотрудниками исправительной колонии и заключенных.

График посещения Исправительной Колонии для сотрудников Правительственного Аппарата:

Дневное время: 14:45 – 15:45
Вечернее время: 18:40 – 19:20
Ночное время: 19:45 – 21:45

В установленный промежуток времени адвокат запрашивает разрешение на приезд в ИК, используя рацию департамента, по примеру: «[ПР/УФСИН] Адвокат *Фамилия*. Разрешите прибыть для оказания юридической помощи заключенным ИК?», — при получении положительного ответа, он (адвокат) может выезжать к КПП ИК.

2. Вход на территорию исправительной колонии под надзором сотрудника исправительной колонии:
После прибытия адвоката к КПП-1 ИК, используя рацию департамента он уведомляет дежурных сотрудников на КПП о своем нахождении и просьбе пропустить на территорию ИК.
При входе на территорию под наблюдением сотрудника ИК, адвокат подтверждает свою должность «Адвоката» путём предоставления служебного удостоверения сотрудника Правительственного Аппарата, и при необходимости, подчиняется законным требованиям сотрудников ИК, установленных внутренним распорядком ИК.

3. Встреча адвоката с заключенным:
Под сопровождением сотрудника ИК, адвокат проходит в специально созданную комнату встреч, используемую для оказания юридической помощи заключенным, а также в иных целях, установленных внутренним распорядком ИК.
Далее адвокат приступает к детальному изучению личного дела заключенного, предпринимая решения и действия, направленные на освобождение заключенного.

4. Освобождение заключенного и завершение юридической помощи адвокатом:
После того как будет составлен и подтвержден договор, заключенное лицо выводиться с территории ИК. В то же время, под сопровождением сотрудника ИК за территорию ИК после проведения юридической помощи.

Лекция на тему: "Обучение сотрудников"​

Получение за временной промежуток всё высшую и высшую должность, с момента назначения Вас на должность «Заместитель министра» - на Вас возлагается задача по обучению новых сотрудников, согласно собранным в методических материалах лекциям и пособиям. Помимо этого, Вам становится доступно принятие промежуточных экзаменов по проведенным соответствующим темам.

Помните: от качества объяснения материала для нового сотрудника зависит его уровень подготовки к выполнению поставленных заданий.

Перед тем как Вы начнете проводить учебные занятия, такие как: лекции, тренировки и практические занятия на определенные темы, требующие получения и подтверждения навыков, Вы сами будете обучены сотрудниками старшего/руководящего состава.

Сразу после трудоустройства нового сотрудника следует провести подробную экскурсию по всем ключевым объектам Правительственного Аппарата: зал заседаний, кабинет губернатора, раздевалка, уборная, служебная парковка, стойка регистрации. Необходимо обеспечить всестороннее ознакомление с инфраструктурой.

Важно наладить контакт с новыми сотрудниками, создавая комфортную среду для их адаптации и оказывая всестороннюю поддержку.


Лекция на тему: "Охрана правительственного аппарата"
​
Сотрудники охраны должны быть опрятно одеты, вежливы и доброжелательны по отношению к сотрудникам и гражданам. При несении службы на посту вы должны быть бдительны и внимательны.
В обязанности сотрудников охраны входит:
1. Во время дежурства контролировать поток входящих и выходящих людей в здание Правительства.
2. Обеспечивать безопасность сотрудников Правительства.
3. Выполнять распоряжения и приказы руководства и старшего состава.
4. Принимать меры по задержанию лиц совершивших противоправное действие
в сторону Правительства или же граждан, находящихся в здании Правительства.
Лекция на тему: "Правила проведения ревизий"
​
Ревизия - это система обязательных контрольных действий по проверке законности организационной деятельности и обоснованности тех или иных финансовых операций.

Ревизия государственных организаций осуществляется от должности "Инспектор".

Алгоритм проведения ревизий:
1. Запросить у губернатора/вице-губернатора разрешение на проведение ревизии той или иной организации.
2. По приезде на объект ревизии представиться сотруднику с наивысшей (на момент проверки) должностью и запросить разрешение на допуск к охраняемой территории (если таковая имеется), архивам, складу.
3. При приезде на ревизию в организации, Вы должны сообщить в рацию.
4. Произвести необходимые ревизионные действия (по выбору, но не менее трёх).
5. По окончании ревизии вынести соответствующую оценку по пятибалльной шкале (от 1 до 5 включительно) и доложить об этом в рацию правительства.
6. После окончания ревизии, Вы должны сообщить в рацию Правительства оценку.

Примечание: ревизия не предусматривает вынесения какого-либо наказания, но необходима для дальнейших действий, ориентированных на устранение выявленных проблем. Также ревизию можно проводить только с сотрудником старшего состава (от Заместителя министра).

Лекция на тему: "Правила проведения ревизий"
​
Ревизия - это система обязательных контрольных действий по проверке законности организационной деятельности и обоснованности тех или иных финансовых операций.

Ревизия государственных организаций осуществляется от должности "Инспектор".

Алгоритм проведения ревизий:
1. Запросить у губернатора/вице-губернатора разрешение на проведение ревизии той или иной организации.
2. По приезде на объект ревизии представиться сотруднику с наивысшей (на момент проверки) должностью и запросить разрешение на допуск к охраняемой территории (если таковая имеется), архивам, складу.
3. При приезде на ревизию в организации, Вы должны сообщить в рацию.
4. Произвести необходимые ревизионные действия (по выбору, но не менее трёх).
5. По окончании ревизии вынести соответствующую оценку по пятибалльной шкале (от 1 до 5 включительно) и доложить об этом в рацию правительства.
6. После окончания ревизии, Вы должны сообщить в рацию Правительства оценку.

Примечание: ревизия не предусматривает вынесения какого-либо наказания, но необходима для дальнейших действий, ориентированных на устранение выявленных проблем. Также ревизию можно проводить только с сотрудником старшего состава (от Заместителя министра).


Лекция на тему: "Правила проведения проверок"​

Плановые проверки проводятся для контроля работы всех государственных организаций
(ЕСС, ГАИ, УМВД, ВЧ, УФСИН) Нижегородской области и исполнения обязанностей всех сотрудников данных организаций.
Проверки бывают плановые и внеплановые.

Плановые проверки проводятся сотрудниками Правительства Нижегородской области в соответствии с графиком проведения проверок государственных организаций. Возглавляет состав проверяющих – губернатор/вице-губернатор/глава администрации/руководящий состав департаментов. Участвовать в проведении плановой проверки могут сотрудники от должности – советник и выше. Состав проверяющих: минимум 2 человека.

Во время проведения проверки сотрудниками Правительства, опрашиваются сотрудники проверяемой организации на знание теоретической и практической части своей деятельности, а также на знание нормативно-правовой базы (Устав, КоАП, ФП, УК и т.д.), проверка на наличие штрафов, проверка трудовой книжки. В случае удачного прохождения проверки, губернатор вправе материально наградить ответственного от организации, которая проверялась.

Внеплановые проверки проводятся сотрудниками департаментов Правительства Нижегородской области в соответствии с зафиксированными частыми нарушениями со стороны государственных служащих. Возглавляет состав проверяющих – губернатор/вице-губернатор/руководящий состав департамента. Участвовать в проведении внеплановой проверки могут сотрудники департамента. Во время проведения внеплановой проверки, способы проведения, а также методы подбираются исключительно руководителем департамента, а также его заместителем.


Лекция на тему: "Снятие судимостей"
​
Сотрудник Правительства с должности "заместитель министра" имеет право снимать судимости гражданам области.
Цена на снятие судимости зависит от того, сколько лет в области проживает гражданин.
гражданам, проживающим до 5 лет в области – 50.000 руб.;
гражданам, проживающим от 5 до 10 лет в области – 75.000 руб.;
гражданам, проживающим от 10 до 15 лет в области – 100.000 руб.;
гражданам, проживающим от 15 до 20 лет в области – 150.000 руб.;
гражданам, проживающим от 20 до 25 лет в области – 200.000 руб.;
гражданам, проживающим более 25 лет в области – 250.000 руб.
Алгоритм снятия судимости:
1. Сотрудник Правительства обязан проверить документ удостоверяющий личность ((/pass)).
2. После проверки документа, сотрудник Правительства находит дело гражданина в базе данных и вводит корректировки.
3. В конце сотрудник правительства возвращает документ удостоверяющий личность гражданина.
Примечание: снятие судимостей происходит только в здании Правительства.

Лекция на тему: "Оформление лицензий"
​
Лицензия — специальное разрешение на право осуществления юридическим лицом либо индивидуальным предпринимателем определенного вида деятельности. Она предоставляется лицензирующим органом, который правомочен выдавать разрешения на ведение деятельности в той или иной сфере.

Всего существует 3 вида лицензий:
1. Лицензия на полеты;
2. Лицензия на оружие;
3. Лицензия на бизнес.

Лицензию на полеты и на бизнес может получить любой гражданин области вне зависимости от количества проживаемых лет в области. Лицензию на оружие может получить любой гражданин, проживающий минимум 5 лет в области.

Алгоритм выдачи лицензий:
1. Сотрудник Правительства обязан проверить документ удостоверяющий личность ((/pass)).
2. После проверки документов сотрудник берёт из папки нужную лицензию, вносит данные гражданина, ставит свою подпись и передаёт вместе с паспортом гражданину.
`;function Hm(e){return e.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu,"").trim().replace(/\s+/g,"-").slice(0,80)}function Qm(e){const t=(e||"").trim();if(!t)return[];const n=t.split(/\n{2,}/),r=[];let l=null,i=[];const o=()=>{if(l||i.length){const u=(l||"Учебные материалы").trim(),d=i.join(`

`).trim();r.push({id:Hm(u)||`sec-${r.length+1}`,title:u,text:d||u,source:"https://forum.amazing-online.com/threads/uchebnye-materialy-dlja-sotrudnikov-pravitelstvennogo-apparata.1065800/"})}l=null,i=[]},a=/^(##\s+.+|Лекция\s*(на\s+тему)?\s*[:«"].+|Тема[\.:]\s*.+|Раздел[\.:]\s*.+|Глава[\.:]\s*.+|Инструкция[\.:]\s*.+|Порядок[\.:]\s*.+)$/i;for(const u of n){const d=u.trim();if(!d)continue;const m=(d.match(/^[^\n]+/)||[""])[0].trim();if(a.test(m)){o(),l=m.replace(/^##\s+/,"").trim();const c=d.slice(m.length).trim();c&&i.push(c)}else if(!l&&r.length===0){l=m;const f=d.slice(m.length).trim();f&&i.push(f)}else i.push(d)}return o(),r.length===0?[{id:"lectures",title:"Учебные материалы",text:t,source:"https://forum.amazing-online.com/threads/uchebnye-materialy-dlja-sotrudnikov-pravitelstvennogo-apparata.1065800/"}]:r}const Km=Qm(Wm);function ru(e){return String(e).toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu,"").trim().replace(/\s+/g,"-").slice(0,80)}function lu(e){return String(e).replace(/[&<>]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;"})[t])}function Xm(e){return String(e).replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function Ym(e){let t=String(e).trim().toLowerCase();return t=t.replace(/\bст\.?\s*/g,"статья ").replace(/\bук\b/g,"уголовный кодекс").replace(/\bкоап\b/g,"коап").replace(/\s+/g," "),t}function iu(e){return String(e).trim().toLowerCase().replace(/\s+/g," ").split(" ").filter(Boolean)}function Gm(){return new Promise((e,t)=>{if(window.FlexSearch)return e();const n=document.createElement("script");n.src="https://cdn.jsdelivr.net/npm/flexsearch@0.7.31/dist/flexsearch.bundle.js",n.onload=()=>e(),n.onerror=()=>t(),document.head.appendChild(n)})}function Zm(){const[e,t]=D.useState(!1),[n,r]=D.useState(""),[l,i]=D.useState([]);D.useEffect(()=>{(async()=>{await Gm();const{Document:m}=window.FlexSearch,f=new m({cache:!0,tokenize:"forward",document:{id:"id",index:[{field:"abbr"},{field:"title"},{field:"text"}],store:["slug","title","excerpt","abbr"]}}),c=[];wn.forEach(v=>{const x=v.content.split(/\n(?=##\s+)/g);x.length===1?c.push({id:v.slug,slug:v.slug,title:v.title,abbr:v.abbr,text:v.content,excerpt:v.notes||""}):x.forEach(y=>{var p;const S=((p=y.match(/^##\s+(.+)$/m))==null?void 0:p[1])||v.title,h=ru(S);c.push({id:`${v.slug}#${h}`,slug:`${v.slug}#${h}`,title:`${v.title} — ${S}`,abbr:v.abbr,text:y,excerpt:S})})}),c.forEach(v=>f.add(v)),window.__LAW_INDEX2__=f,window.__LAW_DOCS2__=c,t(!0)})()},[]);function o(m,f){let c=lu(m);const v=iu(f);for(const x of v)c=c.replace(new RegExp(`(${Xm(x)})`,"gi"),"<mark>$1</mark>");return c}function a(m,f,c=140){const v=m.replace(/\s+/g," ").trim();if(!f.trim())return lu(v.slice(0,c))+(v.length>c?"…":"");const x=iu(f);let y=-1;for(const g of x){const w=v.toLowerCase().indexOf(g.toLowerCase());w!==-1&&(y===-1||w<y)&&(y=w)}const S=Math.max(0,y>30?y-30:0),h=Math.min(v.length,S+c),p=(S>0?"…":"")+v.slice(S,h)+(h<v.length?"…":"");return o(p,f)}function u(m){var w;const f=m.toLowerCase().replace(/\s+/g," ").trim(),c=f.match(/(?:ст\.?\s*)?(\d{1,3}(?:\.\d+)?)(?:\s*ст\.?\s*)?\s*(ук|коап)/i)||f.match(/(ук|коап)\s*(\d{1,3}(?:\.\d+)?)/i);if(!c)return null;const v=c[1]==="ук"||c[2]==="ук"?"uk":"koap",x=c[1]==="ук"||c[1]==="коап"?c[2]:c[1],y=wn.find(N=>N.slug===v);if(!y)return null;const S=new RegExp(`^###\\s*Статья\\s*${x}\\b`,"mi"),h=y.content.split(/\n(?=###\s+)/g).find(N=>S.test(N));if(!h)return`/laws/${y.slug}`;const p=((w=h.match(/^###\s*(.+)$/m))==null?void 0:w[1])||`Статья ${x}`,g=ru(p);return`/laws/${y.slug}#${g}`}async function d(m){const f=window.__LAW_INDEX2__,c=window.__LAW_DOCS2__;if(!f||!c)return;const v=u(m);if(v){i([{url:v,title:"Прямой переход",excerpt:m.toUpperCase()}]);return}const x=f.search(Ym(m),{enrich:!0,limit:30}),y=new Set,S=[];for(const h of x)for(const p of h.result){if(y.has(p.id))continue;y.add(p.id);const g=c.find(C=>C.id===p.id);if(!g)continue;const w=g.excerpt||g.title,N=a(g.text||w,n);S.push({url:`/laws/${g.slug}`,title:g.title,excerpt:N,abbr:g.abbr})}i(S)}return D.useEffect(()=>{if(!e)return;if(!n.trim()){i([]);return}const m=setTimeout(()=>d(n),120);return()=>clearTimeout(m)},[n,e]),s.jsxs("div",{className:"rounded-2xl border border-zinc-200 bg-white/80 p-3 dark:border-zinc-800 dark:bg-zinc-900/50",children:[s.jsxs("div",{className:"mb-2 text-xs text-zinc-600",children:["Примеры: ",s.jsx("code",{children:"ук 105"}),", ",s.jsx("code",{children:"коап 12.8"}),", ",s.jsx("code",{children:"дорожные знаки"})]}),s.jsxs("div",{className:"flex items-center gap-2",children:[s.jsx(zl,{className:"h-4 w-4 text-zinc-500 dark:text-zinc-400"}),s.jsx("input",{value:n,onChange:m=>r(m.target.value),placeholder:"Поиск по всем законам (статьи, названия, аббревиатуры)…",className:"w-full rounded-xl border border-zinc-200 px-3 py-1.5 text-sm focus:outline-none focus:ring dark:border-zinc-700 dark:bg-zinc-900/50"})]}),!!l.length&&s.jsx("div",{className:"mt-3 grid gap-2",children:l.map((m,f)=>s.jsxs(J,{to:m.url,className:"block rounded-xl border border-zinc-200 p-3 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800",children:[s.jsxs("div",{className:"flex items-center justify-between gap-2",children:[s.jsx("div",{className:"text-sm font-semibold",dangerouslySetInnerHTML:{__html:o(m.title,n)}}),m.abbr&&s.jsx("span",{className:"rounded-full border px-2 py-0.5 text-[10px]",children:m.abbr})]}),s.jsx("div",{className:"mt-1 line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400",dangerouslySetInnerHTML:{__html:o(m.excerpt||"",n)}})]},f))})]})}const Kd=[{id:"lawyer",role:"Адвокат",tips:["Всегда выходи через рацию департамента: представление по форме «Адвокат Фамилия».","Перед визитом в ИК — запросить допуск и сопровождение КПП: «/d [ПР/УФСИН] Адвокат *Фамилия*. Разрешите прибыть для оказания юридической помощи заключенным ИК?»","Вход и передвижение на территории ИК — только с удостоверением и под сопровождением сотрудника ИК.","Работай в установленные окна посещений ИК","Запрещена передача денежных средств заключенным без согласования с сотрудником ФСИН"],source:"Учебные материалы: порядок работы адвоката в ИК, формы общения и запреты в рации."},{id:"inspector",role:"Инспектор",tips:["Проверки/ревизии — только с разрешения руководства и составом ≥ 2 чел.","На объекте представиться старшему, запросить режимный допуск (архив, склад, КПП).","Старт/продолжение/завершение — докладывай в /d: «/d [ПР/Орг] Инспектор Петров. Прибыл на проверку, приступаю».","Нарушения фиксируй фактами; решения — через руководителя департамента.","Плановые/внеплановые проверки — по основаниям и регламенту; итог — оценка (1–5) и доклад в /d."],source:"Порядок плановых/внеплановых проверок; инфо-раздел Правительства."},{id:"advisor",role:"Советник",tips:["Координируй собеседования и методическую помощь отделам; план согласовывай с руководством.","На совместных выездах — будь точкой коммуникации: «/d [ПР/Орг] Советник Сидоров. Координирую проверку, состав N».","В рации — только по делу, кратко, без оффтопа; спорные вопросы поднимай руководителю.","Собирай сводку и передавай руководителю департамента."]},{id:"deputy-minister",role:"Заместитель министра",tips:["Организует и принимает отчётность подразделений; назначает ответственных за связь.","Снятие судимостей — строго в здании Правительства и по регламенту, доклад в /d о факте оказания услуги.","Для гос-волны /gov: предварительно уточни в /d свободный слот и забронируй (пример ниже).","Шаблон брони гос-волны: «/d [ПР/Орг] Волна гос. новостей свободна на 18:10?», затем «Занимаю волну на 18:10»."],source:"Правила бронирования гос-волны; учебные материалы Правительства."},{id:"minister",role:"Министр",tips:["Утверждает плановые проверки/маршруты; формирует состав комиссии.","Связь: единый стандарт докладов, короткие формулы, дисциплина рации.","Совместные мероприятия с МВД/ВЧ/ЕСС согласовывает с руководителями организаций.","Итоги проверок — сводный доклад Губернатору/Вице-губернатору."]},{id:"admin-chief",role:"Глава администрации",tips:["Операционное управление аппаратом: расписания, приоритеты, контроль исполнения.","Объединяет коммуникацию департаментов при сложных кейсах.","Принимает сводные отчёты по проверкам/ревизиям и направляет резолюции.","Требует строгого соблюдения субординации и форм радиодокладов."]},{id:"vice-governor",role:"Вице-губернатор",tips:["Межведомственное взаимодействие на уровне руководителей: ФСБ/ВЧ/ЕСС/МВД.","Утверждает внеплановые проверки по установленным основаниям.","Назначает кураторов и сроки устранения нарушений; в экстренных случаях формирует единый штаб связи.","Итоги докладывает Губернатору и доводит решения до департаментов."],source:"Основания внеплановых проверок; общие регламенты взаимодействия."},{id:"governor",role:"Губернатор",tips:["Общее руководство, постановления, указы; стратегические решения.","Утверждает графики проверок и составы комиссий (не менее 3 членов для аттестаций).","Решает межведомственные споры и принимает финальные отчёты.","Награждения и меры воздействия — по итогам проверок/ревизий."],source:"Областной закон о Правительстве: порядок проверок и аттестаций."},{id:"templates-regimes",role:"Шаблоны: режимные объекты (ИК, ВЧ)",tips:["ИК (въезд/допуск): «/d [УФСИН] Должность Фамилия. Прибыл к КПП-1 ИК для [цель]. Просьба о допуске/сопровождении».","ВЧ (проезд через КПП при отсутствии дежурного): короткий доклад авто и цель въезда; дождись подтверждения и следуй указаниям КПП.","Всегда имей при себе служебное удостоверение; на территории действуй только по законным требованиям дежурного персонала."],source:"Правила КПП ВЧ, федеральный закон о режимных территориях; лекционные материалы."}];function Vr(e,t){return t.some(n=>e.includes(n))}function _o(e){const t=e.toLowerCase();return Vr(t,["охран","пост","security"])?s.jsx(xt,{className:"h-4 w-4"}):Vr(t,["адвокат","юрист","прав"])?s.jsx(Nm,{className:"h-4 w-4"}):Vr(t,["инспектор","советник","секрет","контрол"])?s.jsx(tm,{className:"h-4 w-4"}):Vr(t,["министр","губернатор","админ","руковод"])?s.jsx(Mm,{className:"h-4 w-4"}):s.jsx(xt,{className:"h-4 w-4"})}const Xl=[];var fu,pu,mu;for(const e of Ut){const t=Array.isArray(e.dept)?e.dept.includes("ЮД")?"юридический":e.dept.includes("ДВД")||e.dept.includes("охрана")?"охрана":e.dept.includes("АДМ")?"админ":void 0:void 0;Xl.push({id:`role:${e.id}`,type:"role",title:e.role,tags:[e.role.split(" ")[0].toLowerCase(),...(((fu=e.duties)==null?void 0:fu.slice(0,3))||[]).map(n=>n.split(" ")[0].toLowerCase())],dept:t||"неизвестно",level:parseInt(((pu=String(e.role).match(/\((\d+)\)/))==null?void 0:pu[1])||"0",10),description:((mu=e.duties)==null?void 0:mu[0])||void 0})}var hu,gu;for(const e of Kd)Xl.push({id:`procedure:${e.id}`,type:"procedure",title:e.role,tags:[e.role.split(" ")[0].toLowerCase(),...(((hu=e.tips)==null?void 0:hu.slice(0,3))||[]).map(t=>t.split(" ")[0].toLowerCase())],dept:"админ",description:((gu=e.tips)==null?void 0:gu[0])||void 0});function Jm(e){return Xl.find(t=>t.id===e)}function qm(e,t){if(e=e.toLowerCase(),t=t.toLowerCase(),e.includes(t))return 2;const n=new Set(e.split(/[^\p{L}\p{N}]+/u).filter(Boolean)),r=new Set(t.split(/[^\p{L}\p{N}]+/u).filter(Boolean));let l=0;for(const i of r)n.has(i)&&l++;return l>0?1:0}function eh(e,t=6){const n=a=>e.dept&&a?e.dept===a:!0,r=new Set((e.tags||[]).map(a=>a.toLowerCase()));function l(a){if(a.id===e.id)return-1;let u=0;n(a.dept)&&(u+=2);const d=(a.tags||[]).reduce((m,f)=>m+(r.has(String(f).toLowerCase())?1:0),0);return u+=Math.min(d,3),u+=qm(a.title,e.title),u}const i=Xl.filter(a=>a.type!==e.type).map(a=>({m:a,s:l(a)})).filter(a=>a.s>0).sort((a,u)=>u.s-a.s).slice(0,t*2).map(a=>a.m),o={procedures:[],templates:[],roles:[]};for(const a of i)a.type==="procedure"&&o.procedures.length<t?o.procedures.push(a):a.type==="template"&&o.templates.length<t?o.templates.push(a):a.type==="role"&&o.roles.length<t&&o.roles.push(a);return o}function Ei({title:e,items:t}){return t.length?s.jsxs("div",{className:"mt-2 text-xs",children:[s.jsx("div",{className:"mb-1 font-semibold opacity-70",children:e}),s.jsx("div",{className:"flex flex-wrap gap-1.5",children:t.slice(0,6).map(n=>s.jsx("span",{title:n.description||n.title,className:"inline-flex max-w-[14rem] items-center gap-1 truncate rounded-full border px-2 py-0.5 hover:bg-zinc-100 dark:hover:bg-zinc-800",children:s.jsx("span",{className:"truncate",children:n.title})},n.id))})]}):null}function Po({itemId:e,itemType:t}){const n=Jm(e);if(!n)return s.jsx("div",{className:"mt-2 text-xs italic opacity-60",children:"Пока без связей"});const r=eh(n),l=r.procedures.length+r.templates.length+r.roles.length;return s.jsxs("div",{className:"mt-3 rounded-xl border border-zinc-200 p-2 dark:border-zinc-800",children:[s.jsxs("div",{className:"mb-1 text-xs font-semibold",children:["Связано с этим: ",l]}),s.jsx(Ei,{title:"Процедуры",items:r.procedures}),s.jsx(Ei,{title:"Шаблоны",items:r.templates}),s.jsx(Ei,{title:"Роли",items:r.roles}),!l&&s.jsx("div",{className:"text-xs opacity-60",children:"Пока без связей"})]})}const Ht={},Xd=(Ht==null?void 0:Ht.VITE_VOTE_API_BASE)||(Ht==null?void 0:Ht.VITE_API_BASE)||"https://sky-api.wizardiowhy.workers.dev",zi=new Set;let Ci=null;const Ms=new Map;function th(e,t){Ms.set(e,t)}function nh(e){Ms.delete(e)}function rh(e){zi.add(e),!Ci&&(Ci=setTimeout(async()=>{var t;try{const n=[...zi];zi.clear(),Ci=null;const l=await(await fetch(`${Xd}/api/stats?ids=${encodeURIComponent(n.join(","))}`)).json(),i=(l==null?void 0:l.stats)||{};for(const[o,a]of Object.entries(i))(t=Ms.get(o))==null||t(a)}catch{}},120))}function lh(){const e="anon_uid";let t=localStorage.getItem(e);return t||(t=crypto.randomUUID(),localStorage.setItem(e,t)),t}async function ih(e,t){if(localStorage.getItem("telemetry_disabled")==="1")return null;const n=`voted:${e}`;if(localStorage.getItem(n))return null;localStorage.setItem(n,"1");try{const l=await(await fetch(`${Xd}/api/vote`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({card_id:e,vote:t,anon_uid:lh()})})).json();if(l!=null&&l.ok&&l.totals)return l.totals}catch{}return null}function Lo({cardId:e}){const[t,n]=D.useState({up:0,down:0}),[r,l]=D.useState(!1),i=typeof window<"u"&&!!localStorage.getItem(`voted:${e}`),o=r||i||localStorage.getItem("telemetry_disabled")==="1";D.useEffect(()=>(rh(e),th(e,n),()=>nh(e)),[e]);async function a(u){if(o)return;l(!0),n(m=>({up:m.up+(u===1?1:0),down:m.down+(u===-1?1:0)}));const d=await ih(e,u);d&&n(d),l(!1)}return localStorage.getItem("telemetry_disabled")==="1"?null:s.jsxs("div",{className:"mt-2 flex items-center gap-2 text-xs",children:[s.jsxs("button",{className:"btn",onClick:()=>a(1),disabled:o,children:[s.jsx(Am,{className:"h-4 w-4"})," ",t.up]}),s.jsxs("button",{className:"btn",onClick:()=>a(-1),disabled:o,children:[s.jsx(Dm,{className:"h-4 w-4"})," ",t.down]})]})}const oh={"role:guard":{version:"1.2.0",updated_at:"2025-08-26",updated_by:"editor",changelog:[{version:"1.2.0",date:"2025-08-26",author:"editor",summary:"Уточнены обязанности на постах и добавлена ссылка на лекцию."},{version:"1.1.0",date:"2025-06-10",author:"editor",summary:"Дополнены формулировки и исправлены неточности."}]},"procedure:int-basic":{version:"0.9.1",updated_at:"2025-08-25",updated_by:"admin",changelog:[{version:"0.9.1",date:"2025-08-25",author:"admin",summary:"Небольшие правки формулировок."}]},"app:site":{version:"1.3.0",updated_at:"2025-08-29",updated_by:"maintainer",changelog:[{version:"1.3.0",date:"2025-08-29",author:"maintainer",summary:"Обновление интерфейса и телеметрии сайта.",details:["Добавлена телеметрия через Cloudflare Workers: события просмотров страниц отправляются в Telegram.","Кнопка ‘отключить телеметрию’ хранит настройку в LocalStorage и уважается при отправке.","Переработана страница ‘Что нового’: иконки, контраст, бейджи сущностей, кнопка ‘Сравнить версии’.","Улучшена страница ‘Сравнение версий’: читабельные цвета diff в светлой/тёмной теме, горизонтальный скролл, понятный заголовок.","Исправлен контраст кнопок и карточек в тёмной теме (текст видим).","Фронтенд по умолчанию использует API воркера (GH Pages + Workers), добавлен пример .env."]}]}},Yd={entities:oh};function Gd(e){var n;return((n=Yd.entities)==null?void 0:n[e])||null}function Zd(e,t=30){const n=Gd(e);if(!(n!=null&&n.updated_at))return{recent:!1};const r=new Date(n.updated_at+"T00:00:00Z");return{recent:(Date.now()-r.getTime())/(1e3*60*60*24)<=t,date:n.updated_at}}function sh(e,t){const n=e.split(/\r?\n/),r=t.split(/\r?\n/),l=n.length,i=r.length,o=Array.from({length:l+1},()=>Array(i+1).fill(0));for(let m=l-1;m>=0;m--)for(let f=i-1;f>=0;f--)o[m][f]=n[m]===r[f]?o[m+1][f+1]+1:Math.max(o[m+1][f],o[m][f+1]);const a=[];let u=0,d=0;for(;u<l&&d<i;)n[u]===r[d]?(a.push(On(n[u])),u++,d++):o[u+1][d]>=o[u][d+1]?(a.push(`<del>${On(n[u])}</del>`),u++):(a.push(`<ins>${On(r[d])}</ins>`),d++);for(;u<l;)a.push(`<del>${On(n[u++])}</del>`);for(;d<i;)a.push(`<ins>${On(r[d++])}</ins>`);return a.join(`
`)}function On(e){return e.replace(/[&<>]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;"})[t])}function ah(){var n;const e=[],t=Yd.entities||{};for(const[r,l]of Object.entries(t)){const i=(n=l.changelog)==null?void 0:n[0];i&&e.push({id:r,version:i.version,date:i.date,summary:i.summary,details:i.details})}return e.sort((r,l)=>r.date<l.date?1:-1),e}function Sr(){const[e,t]=D.useState("");return D.useEffect(()=>{try{t(localStorage.getItem("context_text")||"")}catch{}},[]),e?s.jsx("div",{className:"text-xs text-zinc-500 dark:text-zinc-400 whitespace-pre-line",children:e}):null}const ou=e=>`/pravo/${e.replace(/^\/+/,"")}`,uh=({text:e})=>s.jsxs("button",{onClick:()=>navigator.clipboard.writeText(e),className:"flex items-center gap-2 rounded-xl border border-zinc-200 px-3 py-1 text-sm hover:bg-zinc-100 active:scale-[0.98] dark:border-zinc-700 dark:hover:bg-zinc-800",title:"Скопировать",children:[s.jsx(lm,{className:"h-4 w-4"})," Копировать"]}),He=({title:e,children:t,footer:n})=>s.jsxs("div",{className:"card shadow-softLg glass",children:[s.jsx("div",{className:"mb-2 flex items-center justify-between",children:s.jsx("h3",{className:"text-base font-semibold leading-tight",children:e})}),s.jsx("div",{className:"prose prose-zinc max-w-none text-sm leading-relaxed dark:prose-invert",children:t}),n&&s.jsx("div",{className:"mt-3 border-t border-zinc-200 pt-3 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400",children:n})]}),Qt=({href:e,label:t})=>s.jsx("a",{href:e,target:"_blank",rel:"noreferrer",className:"inline-flex items-center gap-1 underline decoration-dotted hover:no-underline",children:t||e}),su=({children:e})=>s.jsx("span",{className:"inline-flex items-center whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none align-middle",children:e}),_i=({children:e})=>s.jsxs("div",{className:"flex items-center gap-3",children:[s.jsx("div",{className:"h-px flex-1 bg-gradient-to-r from-transparent via-zinc-300/60 to-transparent dark:via-zinc-600/60"}),s.jsx("h2",{className:"shrink-0 rounded-full border border-zinc-200/60 bg-zinc-100/70 px-3 py-1 text-sm font-semibold tracking-wide shadow-sm backdrop-blur dark:border-zinc-700/60 dark:bg-zinc-800/60",children:e}),s.jsx("div",{className:"h-px flex-1 bg-gradient-to-r from-transparent via-zinc-300/60 to-transparent dark:via-zinc-600/60"})]}),ch=()=>{const[e,t]=k.useState(!1);return D.useEffect(()=>{function n(r){var i,o;const l=r.target;!((i=l.closest)!=null&&i.call(l,"#fb-pop"))&&!((o=l.closest)!=null&&o.call(l,"#fb-btn"))&&t(!1)}return document.addEventListener("mousedown",n),()=>document.removeEventListener("mousedown",n)},[]),s.jsxs("div",{className:"relative",children:[s.jsxs("button",{id:"fb-btn",className:"btn",onClick:()=>t(n=>!n),children:[s.jsx(vm,{className:"h-4 w-4"}),s.jsx("span",{className:"hidden sm:inline",children:"Фидбек"})]}),e&&s.jsxs("div",{id:"fb-pop",className:"absolute right-0 z-30 mt-2 w-72 card p-3 text-sm bg-white dark:bg-zinc-900 shadow-softLg",children:[s.jsxs("div",{className:"mb-2 flex items-center gap-2 font-semibold",children:[s.jsx(q0,{className:"h-4 w-4"}),"Поделитесь обратной связью"]}),s.jsxs("ul",{className:"mb-2 ml-4 list-disc space-y-1",children:[s.jsxs("li",{className:"flex items-center gap-2",children:[s.jsx(K0,{className:"h-3.5 w-3.5"})," Баг интерфейса"]}),s.jsxs("li",{className:"flex items-center gap-2",children:[s.jsx(dm,{className:"h-3.5 w-3.5"})," Идея по улучшению"]}),s.jsxs("li",{className:"flex items-center gap-2",children:[s.jsx(Ls,{className:"h-3.5 w-3.5"})," Ошибка/опечатка в тексте"]})]}),s.jsxs("a",{className:"btn w-full justify-center no-underline",href:"https://t.me/pasha_bolshoi",target:"_blank",rel:"noreferrer",children:[s.jsx(Cm,{className:"h-4 w-4"})," Написать в Telegram"]}),s.jsx("div",{className:"mt-2 flex items-center justify-between text-xs",children:s.jsxs("label",{className:"flex items-center gap-2",children:[s.jsx("input",{type:"checkbox",defaultChecked:localStorage.getItem("telemetry_disabled")==="1",onChange:n=>localStorage.setItem("telemetry_disabled",n.currentTarget.checked?"1":"0")}),"Отключить анонимную телеметрию"]})})]})]})},dh=({roleId:e,dept:t,items:n})=>{const r=k.useMemo(()=>`promo:${e}:${encodeURIComponent(t)}`,[e,t]),l=k.useMemo(()=>`promo:shots:${e}:${encodeURIComponent(t)}`,[e,t]),[i,o]=k.useState(()=>{try{const x=localStorage.getItem(r),y=x?JSON.parse(x):[];return new Set(y)}catch{return new Set}}),[a,u]=k.useState(()=>{try{const x=localStorage.getItem(l);return x?JSON.parse(x):{}}catch{return{}}}),[d,m]=k.useState({}),[f,c]=k.useState({});k.useEffect(()=>{try{localStorage.setItem(r,JSON.stringify([...i]))}catch{}},[i,r]),k.useEffect(()=>{try{localStorage.setItem(l,JSON.stringify(a))}catch{}},[a,l]);function v(x){o(y=>{const S=new Set(y);return S.has(x)?S.delete(x):S.add(x),S})}return s.jsx("ol",{className:"ml-4 list-decimal space-y-2",children:n.map((x,y)=>s.jsxs("li",{className:"flex flex-col gap-1",children:[s.jsxs("div",{className:"flex items-start gap-2",children:[s.jsx("input",{type:"checkbox",className:"mt-0.5 h-4 w-4",checked:i.has(y),onChange:()=>v(y)}),s.jsx("span",{className:i.has(y)?"opacity-60 line-through":void 0,children:x})]}),!1]},y))})},au=[{id:"roles",label:"Роли",icon:s.jsx(Qd,{className:"h-4 w-4"})},{id:"templates",label:"Доклады",icon:s.jsx(bd,{className:"h-4 w-4"})},{id:"posts",label:"Посты",icon:s.jsx(hm,{className:"h-4 w-4"})},{id:"procedures",label:"Процедуры",icon:s.jsx(tu,{className:"h-4 w-4"})},{id:"interactions",label:"Взаимодействие",icon:s.jsx(xt,{className:"h-4 w-4"})},{id:"lectures",label:"Лекции",icon:s.jsx(Ls,{className:"h-4 w-4"})},{id:"vu",label:"ВУ",icon:s.jsx(tu,{className:"h-4 w-4"})},{id:"laws",label:"Законы",icon:s.jsx(Kl,{className:"h-4 w-4"})}],fh={Охрана:["/r Докладывает: (Фамилия). Заступил на пост (номер поста).","/r Докладывает: (Фамилия). Продолжаю дежурство на посту (номер поста).","/r Докладывает: (Фамилия). Покинул пост (номер поста)."],"Начальник охраны":["/r Докладывает: (Фамилия). Заступил на пост (номер поста).","/r Докладывает: (Фамилия). Продолжаю дежурство на посту (номер поста).","/r Докладывает: (Фамилия). Покинул пост (номер поста).","/r Докладывает: (Фамилия). Начал охранять (Должность) (Фамилия).","/r Докладывает: (Фамилия). Продолжаю охранять (Должность) (Фамилия).","/r Докладывает: (Фамилия). Закончил охранять (Должность) (Фамилия)."],Адвокат:["/d [ПР/УФСИН] Адвокат *Фамилия*. На связь.","/d [ПР/УФСИН] Адвокат *Фамилия*. Разрешите прибыть для оказания юридической помощи заключенным ИК?","/d [ПР/УФСИН] Адвокат *Фамилия*. Прибыл на КПП-1, пропустите на территорию ИК.","/r Докладывает: (Фамилия), начал дежурство в комнате свиданий.","/r Докладывает: (Фамилия), продолжаю дежурство в комнате свиданий.","/r Докладывает: (Фамилия), закончил дежурство в комнате свиданий."],Инспектор:["/r Докладывает (Фамилия). Выехал на проведение ревизии (орган)","/r Докладывает (Фамилия). Прибыл для проведения ревизии (орган)","/r Докладывает (Фамилия). Закончил проведение ревизии (орган). Итог: x/x.","/r Докладывает (Фамилия). Начал дежурство за стойкой регистрации.","/r Докладывает (Фамилия). Продолжаю дежурство за стойкой регистрации.","/r Докладывает (Фамилия). Закончил дежурство за стойкой регистрации.","/r Докладывает (фамилия). Выехал на проверку постов (орган)","/r Докладывает (фамилия). Прибыл на пост (название посат). Сотрудники присутствуют/отсутствуют."],Советник:["/r Докладывает (фамилия). Начал дежурство (место). ","/r Докладывает (фамилия). Продолжил дежурство (место).","/r Докладывает (фамилия). Закончил дежурство (место).","/r Докладывает (Фамилия). Начал контролировать собеседование в ЕСС/ВЧ/УМВД/ГАИ.","/r Докладывает (Фамилия). Продолжил контролировать собеседование в ЕСС/ВЧ/УМВД/ГАИ.","/r Докладывает (Фамилия). Закончил контролировать собеседование в ЕСС/ВЧ/УМВД/ГАИ.","/r Докладывает (фамилия). Выехал на помощь проведения плановой/внеплановой проверки (орган).","/r Докладывает (фамилия). Начал оказывать помощь на проведении плановой/внеплановой проверки (орган).","/r Докладывает (фамилия). Начал проверку жетона x-x-x.","/r Докладывает (фамилия). Закончил проверку жетона x-x-x. Итог: x/x.","/r Докладывает (фамилия). Закончил оказывать помощь на плановой/внеплановой проверке (орган)."],"Зам. Министра":["/r Докладывает (фамилия). Начал прослушивать рацию (орган).","/r Докладывает (фамилия). Продолжаю прослушивать рацию (орган).","/r Докладывает (фамилия). Закончил прослушивать рацию (орган).","/r Докладывает (Фамилия). Начал контролировать собеседование в ЕСС/ВЧ/УМВД/ГАИ.","/r Докладывает (Фамилия). Продолжил контролировать собеседование в ЕСС/ВЧ/УМВД/ГАИ.","/r Докладывает (Фамилия). Закончил контролировать собеседование в ЕСС/ВЧ/УМВД/ГАИ.","/r Докладывает (Фамилия). Начал контроль работы сотрудников ГАИ/УМВД/ВЧ/ЕСС.","/r Докладывает (Фамилия). Продолжил контроль работы сотрудников ГАИ/УМВД/ВЧ/ЕСС.","/r Докладывает (Фамилия). Закончил контроль работы сотрудников ГАИ/УМВД/ВЧ/ЕСС."]},ph=[{code:"A1-A2",where:"Вход в здание Правительства",img:"/img/a1.png"},{code:"B1-B2",where:"Холл здания Правительства",img:"/img/b1.png"},{code:"C1-C2",where:"Задний вход, парковка",img:"/img/c1.png"},{code:"D1-D2",where:"Ворота на парковку",img:"/img/d1.png"},{code:"E1-E2",where:"Возле кабинета Губернатора",img:"/img/e1.png"}],mh=[{code:'ТЦ "Анашан"',where:"ТЦ «Анашан», КАД, 1 км, 1",img:"/img/1.png"},{code:"Дорога «Южный — порт»",where:"Дорога «Южный — порт», д. Гарель, 44",img:"/img/2.png"},{code:"Рыжевск",where:"КАД, 7-й км (район Рыжевска)",img:"/img/3.png"},{code:"стадион г. Арзамаса",where:"Стадион Арзамаса / УФСБ, ул. Карла Маркса, 61",img:"/img/4.png"}],hh=[{code:"ВА",where:"ВА — вокзал Арзамаса (ул. Мира, 3)",img:"/img/5.png"},{code:"ВЧ",where:"ВЧ — КПП-1 воинской части (пгт. Батырево)",img:"/img/6.png"},{code:"ЦР",where:"ЦР — центральный рынок (Батырево, ул. Ворошилова, 18)",img:"/img/7.png"},{code:"ВЮ",where:"ВЮ — вокзал г. Южный (ул. Заводская, 7)",img:"/img/8.png"},{code:"ЕСС",where:"ЕСС — напротив здания ЕСС (ул. Алексеевская, 12)",img:"/img/9.png"},{code:"ПР",where:"ПР — здание Правительства (пгт. Батырево, ул. Ленина, 1)",img:"/img/10.png"},{code:"ХЕСС",where:"ХЕСС — внутри ЕСС (ул. Дорогобужская, 1)",img:"/img/11.png"},{code:"КПЗ",where:"КПЗ — внутри УМВД (Ленинский б-р, 17)",img:"/img/12.png"},{code:"ВК",where:"ВК — внутри военкомата (пгт. Батырево, ул. Ленина, 4)",img:"/img/13.png"}],Pi=({items:e})=>s.jsx("div",{className:"grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",children:e.map(t=>s.jsxs("article",{className:"group relative overflow-hidden rounded-2xl border border-zinc-200/70 bg-white/80 p-0 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-zinc-800/70 dark:bg-zinc-900/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-zinc-900/60",children:[s.jsxs("div",{className:"relative",children:[s.jsx("img",{src:ou(t.img),alt:`${t.code} — ${t.where}`,className:"aspect-[16/9] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]",loading:"lazy",decoding:"async",onError:n=>{n.currentTarget.src=ou("/img/noimg.png")}}),s.jsx("div",{className:"pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/35 to-transparent"}),s.jsx("span",{className:"absolute left-2 top-2 rounded-full border border-zinc-200/60 bg-white/90 px-2 py-0.5 text-[11px] font-semibold tracking-wide shadow-sm dark:border-zinc-700/60 dark:bg-zinc-900/90",children:t.code})]}),s.jsx("div",{className:"p-3",children:s.jsx("div",{className:"min-h-[2.25rem] text-xs leading-snug text-zinc-600 dark:text-zinc-400",children:t.where})})]},t.code))});function gh(){var f;const[e,t]=k.useState(au[0].id),[n,r]=k.useState("roles"),[l,i]=k.useState("Все"),o=["Все","ДЗ","ДВД","ДВС","ЮД"],a=["Все","УК","КоАП","ПДД","ФП","ФЗоП","ФЗоТОД","ФЗоВС","ФЗоФСБ","УПК","КАС","Гостайна"],[u,d]=k.useState("Все"),m=k.useMemo(()=>wn.filter(c=>u==="Все"||c.abbr.toLowerCase()===u.toLowerCase()),[u]);return s.jsxs("div",{className:"min-h-screen text-zinc-900 dark:text-zinc-100",children:[s.jsx("header",{className:"sticky top-0 z-20 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70",children:s.jsxs("div",{className:"mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3",children:[s.jsxs("div",{className:"flex items-center gap-3",children:[s.jsx(Y0,{className:"h-6 w-6"}),s.jsxs("div",{children:[s.jsx("div",{className:"text-lg font-bold leading-tight",children:"Правительство — Памятка (SKY)"}),s.jsx(Sr,{})]})]}),s.jsx("nav",{className:"flex w-full gap-2 overflow-x-auto md:w-auto",children:au.map(c=>s.jsxs("button",{onClick:()=>t(c.id),className:`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm ${e===c.id?"border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100":"border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"}`,children:[c.icon," ",c.label]},c.id))}),s.jsxs("div",{className:"flex items-center gap-2 md:ml-auto",children:[s.jsx(J,{to:"/whats-new",className:"btn",children:"Что нового"}),s.jsxs(J,{to:"/favorites",className:"btn",children:[s.jsx("span",{className:"inline-block h-4 w-4",children:"★"})," Избранное"]}),s.jsxs(J,{to:"/settings",className:"btn",children:[s.jsx(Wd,{className:"h-4 w-4"})," Настройки"]}),s.jsx(ch,{})]})]})}),s.jsxs("main",{className:"mx-auto max-w-6xl px-4 py-6",children:[e==="roles"&&s.jsxs(s.Fragment,{children:[s.jsxs("div",{className:"mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between",children:[s.jsx("h2",{className:"text-lg font-bold",children:"Роли"}),s.jsxs("div",{className:"flex flex-wrap gap-2",children:[s.jsxs("div",{className:"inline-flex rounded-full border border-zinc-200 bg-white/70 p-0.5 text-sm backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/50",children:[s.jsx("button",{onClick:()=>r("roles"),className:"px-3 py-1 rounded-full transition "+(n==="roles"?"bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900":"hover:bg-zinc-100 dark:hover:bg-zinc-800"),children:"Роли"}),s.jsx("button",{onClick:()=>r("promotion"),className:"px-3 py-1 rounded-full transition "+(n==="promotion"?"bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900":"hover:bg-zinc-100 dark:hover:bg-zinc-800"),children:"Повышение"})]}),s.jsx("div",{className:"inline-flex rounded-full border border-zinc-200 bg-white/70 p-0.5 text-sm backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/50",children:o.map(c=>s.jsx("button",{onClick:()=>i(c),className:"px-3 py-1 rounded-full transition "+(l===c?"bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900":"bg-white hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800"),children:c},c))})]})]}),n==="roles"&&s.jsxs("section",{className:"grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",children:[Ut.filter(c=>{if(l==="Все")return!0;const v=c.dept;return Array.isArray(v)?v.includes(l):v===l}).map(c=>s.jsxs(He,{title:s.jsxs("div",{className:"flex items-center gap-2",children:[_o(c.role),s.jsx("span",{children:c.role}),s.jsxs(su,{children:[s.jsx("span",{className:"opacity-70",children:"Зарплата:"})," ",c.salary]}),(()=>{const v=Zd(`role:${c.id}`);return v.recent?s.jsx("span",{className:"rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] text-yellow-800",title:`Обновлено ${v.date}`,children:"обновлено"}):null})()]}),footer:s.jsxs("div",{children:["Источник: ",s.jsx(Qt,{href:c.source||"#"})]}),children:[s.jsx("ul",{className:"ml-4 list-disc",children:c.duties.map((v,x)=>s.jsx("li",{children:v},x))}),s.jsx(Po,{itemId:`role:${c.id}`,itemType:"role"}),s.jsx(Lo,{cardId:`role:${c.id}`})]},c.id)),!1]}),n==="promotion"&&s.jsx("section",{className:"grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",children:Ut.filter(c=>{if(l==="Все")return!0;const v=c.dept;return Array.isArray(v)?v.includes(l):v===l}).map(c=>{var S;const v=c.promotionByDept&&l!=="Все"?((S=c.promotionByDept)==null?void 0:S[l])??[]:c.promotion??[];return l==="Все"&&["advisor","deputy-minister","minister","admin-chief","vice-governor","governor"].includes(c.id)?null:s.jsx(He,{title:s.jsxs("div",{className:"flex items-center gap-2",children:[_o(c.role),s.jsx("span",{children:c.role}),s.jsxs(su,{children:[s.jsx("span",{className:"opacity-70",children:"Зарплата:"})," ",c.salary]})]}),footer:s.jsxs("div",{children:["Источник: ",s.jsx(Qt,{href:c.sourcePromotion||c.source||"#"})]}),children:v.length?s.jsx(dh,{roleId:c.id,dept:l,items:v}):s.jsx("p",{children:"Критерии повышения для этой роли пока не добавлены."})},c.id)})})]}),e==="templates"&&s.jsx("section",{className:"grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",children:Object.entries(fh).map(([c,v])=>s.jsx(He,{title:s.jsxs("div",{className:"flex items-center gap-2",children:[s.jsx(bd,{className:"h-4 w-4"}),"Доклады — ",c]}),children:s.jsx("div",{className:"flex flex-col gap-2",children:v.map((x,y)=>s.jsxs("div",{className:"flex items-center justify-between gap-2 rounded-xl border px-3 py-2",children:[s.jsx("div",{className:"text-sm",children:x}),s.jsx(uh,{text:x})]},y))})},c))}),e==="posts"&&s.jsxs("section",{className:"mt-6 grid gap-6",children:[s.jsxs("div",{children:[s.jsx(_i,{children:"Стационарные посты"}),s.jsx("div",{className:"mt-3",children:s.jsx(Pi,{items:ph})})]}),s.jsxs("div",{children:[s.jsx(_i,{children:"Посты ДПС"}),s.jsx("div",{className:"mt-3",children:s.jsx(Pi,{items:mh})})]}),s.jsxs("div",{children:[s.jsx(_i,{children:"Посты ППС"}),s.jsx("div",{className:"mt-3",children:s.jsx(Pi,{items:hh})})]})]}),!1,e==="procedures"&&s.jsx("section",{className:"grid gap-4",children:s.jsx(He,{title:s.jsx("div",{className:"w-full text-center",children:"В разработке"}),children:s.jsxs("p",{className:"text-sm",children:["Данный раздел находится в ",s.jsx("b",{children:"Разработке"})]})})}),e==="interactions"&&s.jsx("section",{className:"grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",children:Kd.map(c=>s.jsxs(He,{title:s.jsxs("div",{className:"flex items-center gap-2",children:[s.jsx(xt,{className:"h-4 w-4"}),c.role]}),footer:c.source?s.jsxs("div",{className:"text-xs",children:["Источник: ",s.jsx(Qt,{href:c.source})]}):void 0,children:[s.jsx("ul",{className:"ml-4 list-disc",children:c.tips.map((v,x)=>s.jsx("li",{children:v},x))}),s.jsx(Po,{itemId:`procedure:${c.id}`,itemType:"procedure"}),s.jsx(Lo,{cardId:`procedure:${c.id}`})]},c.id))}),e==="lectures"&&s.jsx("section",{className:"grid gap-4",children:s.jsx("div",{className:"grid grid-cols-1 gap-4",children:Km.map(c=>s.jsx(He,{title:s.jsx("div",{id:`lec-${c.id}`,className:"w-full scroll-mt-24",children:s.jsxs("div",{className:"flex items-center justify-center gap-2 text-center font-bold",children:[s.jsx(Ls,{className:"h-4 w-4"}),s.jsx("span",{children:c.title})]})}),footer:s.jsxs("div",{className:"flex justify-between text-xs text-zinc-500",children:[s.jsx("div",{children:c.updated?`Актуально: ${c.updated}`:""}),c.source&&s.jsxs(s.Fragment,{children:["Источник: ",s.jsx(Qt,{href:c.source})]})]}),children:s.jsx("div",{className:"not-prose whitespace-pre-wrap text-sm leading-relaxed",children:c.text})},c.id))})}),e==="vu"&&s.jsxs("section",{className:"grid gap-4",children:[s.jsx("div",{className:"grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",children:Cl.map(c=>s.jsx(J,{to:`/vu/${c.id}`,className:"block",children:s.jsx(He,{title:s.jsxs("div",{className:"flex items-center gap-2",children:[s.jsx(xt,{className:"h-4 w-4"})," ",c.title]}),footer:s.jsxs("div",{className:"text-xs text-zinc-500",children:[c.updated?`Обновлено: ${c.updated}`:""," ",c.source&&s.jsxs(s.Fragment,{children:[" • Источник: ",s.jsx(Qt,{href:c.source})]})]}),children:s.jsx("p",{className:"text-sm line-clamp-2",children:(c.text||"").split(`
`).find(Boolean)||"Текст ещё не добавлен."})})},c.id))}),s.jsx("div",{className:"hidden",children:s.jsx(He,{title:s.jsxs("div",{className:"flex items-center gap-2",children:[s.jsx(xt,{className:"h-4 w-4"}),"Внутренний устав Правительства"]}),footer:s.jsxs("div",{children:["Источник:"," ",s.jsx(Qt,{href:"https://forum.amazing-online.com/threads/vnutrennij-ustav.1027735/"})]}),children:s.jsx("pre",{className:"whitespace-pre-wrap text-sm leading-relaxed rounded-xl border border-zinc-200 bg-white p-3 text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-100",children:(f=Cl[0])==null?void 0:f.text})})})]}),e==="laws"&&s.jsxs("section",{className:"grid gap-4",children:[s.jsx(Zm,{}),s.jsx("div",{className:"flex flex-wrap gap-2",children:a.map(c=>s.jsx("button",{onClick:()=>d(c),className:`rounded-full border px-3 py-1 text-sm ${u===c?"border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100":"border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"}`,children:c},c))}),s.jsx("div",{className:"grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",children:m.map(c=>s.jsx(J,{to:`/laws/${c.slug}`,className:"block",children:s.jsx(He,{title:s.jsxs("div",{className:"flex items-center gap-2",children:[s.jsx(Kl,{className:"h-4 w-4"}),c.title]}),footer:s.jsx("div",{children:c.updated?`Актуально: ${c.updated}`:""}),children:s.jsx("p",{className:"text-sm",children:c.notes||"Открыть →"})})},c.slug))})]}),s.jsx("div",{className:"mt-8 grid gap-3 rounded-2xl border border-zinc-200 bg-white/70 p-4 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400",children:s.jsx("div",{children:"Создатель: Pavel_Bolshoy. • Скачать подсказку: https://imgur.com/a/oJr8UKV • Донаты не нужно делать!"})})]})]})}function vh(){const e=ah();return s.jsxs("div",{className:"mx-auto max-w-3xl px-4 py-6",children:[s.jsxs("div",{className:"mb-4 flex items-center justify-between",children:[s.jsxs("h1",{className:"flex items-center gap-2 text-xl font-bold",children:[s.jsx(um,{className:"h-5 w-5"})," Что нового"]}),s.jsx(J,{to:"/",className:"btn",children:"На главную"})]}),s.jsxs("div",{className:"grid gap-4",children:[e.map(t=>s.jsxs("article",{className:"card transition hover:shadow-softLg",children:[s.jsxs("header",{className:"mb-1 flex items-center justify-between",children:[s.jsx("div",{className:"flex items-center gap-2",children:s.jsxs("span",{className:"inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium",children:[s.jsx(nu,{className:"h-3.5 w-3.5"})," ",t.id]})}),s.jsxs(J,{to:`/diff/${encodeURIComponent(t.id)}`,className:"btn",children:["Сравнить версии ",s.jsx(W0,{className:"h-4 w-4"})]})]}),s.jsx("p",{className:"text-sm leading-relaxed text-zinc-800 dark:text-zinc-200",children:t.summary}),Array.isArray(t.details)&&t.details.length>0&&s.jsx("ul",{className:"mt-2 ml-4 list-disc text-sm text-zinc-700 dark:text-zinc-300",children:t.details.map((n,r)=>s.jsx("li",{children:n},r))}),s.jsxs("footer",{className:"mt-3 flex items-center gap-3 text-xs text-zinc-500",children:[s.jsxs("span",{className:"inline-flex items-center gap-1",children:[s.jsx(nu,{className:"h-3.5 w-3.5"})," Версия ",t.version]}),s.jsxs("span",{className:"inline-flex items-center gap-1",children:[s.jsx(Z0,{className:"h-3.5 w-3.5"})," ",t.date]})]})]},`${t.id}-${t.version}`)),!e.length&&s.jsx("div",{className:"card text-sm text-zinc-600 dark:text-zinc-300",children:"Пока нет обновлений."})]})]})}function yh(){var i,o,a,u;const{id:e}=Ql(),t=e?Gd(e):null,n=((o=(i=t==null?void 0:t.changelog)==null?void 0:i[1])==null?void 0:o.summary)||"",r=((u=(a=t==null?void 0:t.changelog)==null?void 0:a[0])==null?void 0:u.summary)||"",l=sh(n,r);return s.jsxs("div",{className:"mx-auto max-w-3xl px-4 py-6",children:[s.jsxs("div",{className:"mb-4 flex items-center justify-between",children:[s.jsx("h1",{className:"text-xl font-bold",children:"Сравнение версий"}),s.jsx(J,{to:"/whats-new",className:"btn",children:"Что нового"})]}),!t&&s.jsxs("div",{children:["Не найдено для ",e]}),t&&s.jsxs("div",{className:"card",children:[s.jsxs("div",{className:"mb-2 text-sm",children:[e," • ",t.version]}),s.jsx("pre",{className:"overflow-x-auto rounded-xl bg-zinc-100 p-3 text-sm text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100",dangerouslySetInnerHTML:{__html:l}})]}),s.jsx("style",{children:`
        ins{background:#DCFCE7; text-decoration:none;}
        del{background:#FEE2E2; text-decoration:line-through;}
        @media (prefers-color-scheme: dark){
          ins{background:rgba(34,197,94,0.25);} /* emerald-500 @ 25% */
          del{background:rgba(239,68,68,0.25);} /* red-500 @ 25% */
        }
      `})]})}function xh(){const[e]=F0(),t=e.get("role")||"",n=k.useMemo(()=>Ut.find(r=>r.id===t),[t]);return k.useEffect(()=>{document.title="Памятка на смену"},[]),s.jsxs("div",{className:"mx-auto max-w-3xl p-6 print:p-0",children:[s.jsxs("div",{className:"mb-4 flex items-center justify-between print:hidden",children:[s.jsx("h1",{className:"text-xl font-bold",children:"Памятка на смену"}),s.jsxs("div",{className:"flex items-center gap-2",children:[s.jsx("button",{className:"btn",onClick:()=>window.print(),children:"Печать / PDF"}),s.jsx(J,{to:"/",className:"btn",children:"Назад"})]})]}),s.jsx("div",{className:"prose prose-zinc max-w-none dark:prose-invert",children:n?s.jsxs(s.Fragment,{children:[s.jsxs("h2",{children:[n.role," ",s.jsxs("small",{children:["• ",n.salary]})]}),s.jsx("h3",{children:"Обязанности"}),s.jsx("ul",{children:n.duties.map((r,l)=>s.jsx("li",{children:r},l))}),Array.isArray(n.promotion)&&s.jsxs(s.Fragment,{children:[s.jsx("h3",{children:"Чек-лист (повышение)"}),s.jsx("ol",{children:n.promotion.map((r,l)=>s.jsx("li",{children:r},l))})]})]}):s.jsx("p",{children:"Роль не выбрана. Передайте ?role=ID в адресной строке."})}),s.jsx("style",{children:`
        @media print {
          @page { size: A4; margin: 14mm; }
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
        }
      `})]})}const wh="fav:",kh="fav:item:";function Ts(){try{return typeof window<"u"&&!!window.localStorage}catch{return!1}}function Jd(e,t){return`${wh}${e}:${t}`}function qd(e,t){return`${kh}${e}:${t}`}function uu(){try{window.dispatchEvent(new CustomEvent("favorites:change"))}catch{}}function _l(e,t){if(!Ts())return!1;try{return!!localStorage.getItem(Jd(e,t))}catch{return!1}}function Is(e,t,n){if(!Ts())return!1;const r=Jd(e,t),l=qd(e,t);try{return localStorage.getItem(r)?(localStorage.removeItem(r),localStorage.removeItem(l),uu(),!1):(localStorage.setItem(r,"1"),n&&(n.title||n.url)&&localStorage.setItem(l,JSON.stringify(n)),uu(),!0)}catch{return!1}}function Sh(e){const t=[];if(!Ts())return t;try{for(let n=0;n<localStorage.length;n++){const r=localStorage.key(n)||"",l=/^fav:(role|law|vu|lawsec):(.+)$/.exec(r);if(!l)continue;const i=l[1],o=l[2];let a=null;try{const u=localStorage.getItem(qd(i,o));a=u?JSON.parse(u):null}catch{a=null}t.push({kind:i,id:o,title:a==null?void 0:a.title,url:a==null?void 0:a.url})}}catch{}return t.sort((n,r)=>n.kind!==r.kind?n.kind.localeCompare(r.kind):(n.title||n.id).localeCompare(r.title||r.id))}function cu(e){return Sh(e)}function jh(e,t){_l(e,t)&&Is(e,t)}function $s({kind:e,id:t,title:n,url:r,size:l="md"}){const[i,o]=D.useState(()=>_l(e,t));D.useEffect(()=>{o(_l(e,t))},[e,t]);function a(m){m.preventDefault(),m.stopPropagation();const f=Is(e,t,{title:n,url:r});o(f)}const u=l==="sm"?"h-7 w-7":"h-8 w-8",d=l==="sm"?"h-4 w-4":"h-5 w-5";return s.jsx("button",{onClick:a,title:i?"Убрать из избранного":"Добавить в избранное","aria-label":i?"Убрать из избранного":"Добавить в избранное",className:`fav-star-btn ${u} ${i?"is-active":""}`,children:s.jsx(Hd,{className:`fav-star-icon ${d}`})})}const Nh=({title:e,children:t,footer:n})=>s.jsxs("div",{className:"card shadow-softLg glass",children:[s.jsx("div",{className:"mb-2 flex items-center justify-between",children:s.jsx("h3",{className:"text-base font-semibold leading-tight",children:e})}),s.jsx("div",{className:"prose prose-zinc max-w-none text-sm leading-relaxed dark:prose-invert",children:t}),n&&s.jsx("div",{className:"mt-3 border-t border-zinc-200 pt-3 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400",children:n})]}),Eh=({href:e,label:t})=>s.jsxs("a",{href:e,target:"_blank",rel:"noreferrer",className:"inline-flex items-center gap-1 underline decoration-dotted hover:no-underline",children:[t||e," ",s.jsx(om,{className:"h-3.5 w-3.5"})]}),zh=({children:e})=>s.jsx("span",{className:"inline-flex items-center whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none align-middle",children:e});function Ch(){const{id:e}=Ql(),t=Ut.find(n=>n.id===e);return t?s.jsxs("div",{className:"min-h-screen text-zinc-900 dark:text-zinc-100",children:[s.jsx("header",{className:"sticky top-0 z-20 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70",children:s.jsxs("div",{className:"mx-auto flex max-w-3xl items-center gap-3 px-4 py-3",children:[s.jsxs(J,{to:"/",className:"flex items-center gap-1 text-sm hover:underline",children:[s.jsx(Ps,{className:"h-4 w-4"})," Назад"]}),s.jsxs("div",{className:"flex flex-col items-center",children:[s.jsxs("div",{className:"flex items-center gap-2",children:[_o(t.role),s.jsx("h1",{className:"text-lg font-bold leading-tight",children:t.role}),s.jsxs(zh,{children:[s.jsx("span",{className:"opacity-70",children:"Оклад:"})," ",t.salary]}),(()=>{const n=Zd(`role:${t.id}`);return n.recent?s.jsx("span",{className:"rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] text-yellow-800",title:`Обновлено: ${n.date}`,children:"Обновлено"}):null})()]}),s.jsx(Sr,{})]}),s.jsx($s,{kind:"role",id:t.id,title:t.role,url:`/roles/${t.id}`})]})}),s.jsxs("main",{className:"mx-auto max-w-3xl px-4 py-6",children:[s.jsx("div",{className:"mb-3 flex items-center gap-2",children:s.jsxs("a",{className:"btn",href:`/print?role=${t.id}`,children:[s.jsx(km,{className:"h-4 w-4"})," Export: PDF"]})}),s.jsxs(Nh,{title:"Обязанности",footer:s.jsxs("div",{children:["Источник: ",s.jsx(Eh,{href:t.source})]}),children:[s.jsx("ul",{className:"ml-4 list-disc",children:t.duties.map((n,r)=>s.jsx("li",{children:n},r))}),s.jsx(Po,{itemId:`role:${t.id}`,itemType:"role"}),s.jsx(Lo,{cardId:`role:${t.id}`})]})]})]}):s.jsxs("div",{className:"p-4",children:["Роль не найдена."," ",s.jsx(J,{to:"/",className:"text-blue-600 underline",children:"Назад"})]})}function du(e){return new Promise((t,n)=>{const r=document.createElement("script");r.src=e,r.async=!0,r.onload=()=>t(),r.onerror=()=>n(),document.head.appendChild(r)})}async function _h(){window.marked||await du("https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js"),window.DOMPurify||await du("https://cdn.jsdelivr.net/npm/dompurify@3.1.6/dist/purify.min.js")}function Ph(e){const t=new DOMParser().parseFromString(e,"text/html"),n=Array.from(t.querySelectorAll("h2, h3, h4")),r=[],l=i=>i.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu,"").trim().replace(/\s+/g,"-").slice(0,80);return n.forEach((i,o)=>{const a=i.textContent||"",u=l(a)||`h-${o+1}`;i.id=u;const d=i.tagName==="H2"?2:i.tagName==="H3"?3:4;r.push({id:u,text:a,level:d});const m=t.createElement("button");m.className="anchor-fav",m.setAttribute("data-id",u),m.setAttribute("data-title",a),m.setAttribute("title","Добавить в избранное"),i.appendChild(m)}),{html:t.body.innerHTML,toc:r}}function Lh(e){let t=e.replace(/\r\n?/g,`
`);return t=t.replace(/^(#{2,6})([^\s#])/gm,"$1 $2"),t=t.replace(/^\s*(\d+)\)\s+/gm,"$1. "),t}function Mh(){const{slug:e}=Ql(),t=wn.find(f=>f.slug===e),[n,r]=k.useState(""),[l,i]=k.useState([]),[o,a]=k.useState(""),u=k.useRef(null);if(k.useEffect(()=>{(async()=>{if(!t)return;await _h();const f=Lh(t.content),c=window.marked.parse(f,{gfm:!0,breaks:!0}),v=window.DOMPurify.sanitize(c,{USE_PROFILES:{html:!0}}),{html:x,toc:y}=Ph(v);r(x),i(y)})()},[e]),k.useEffect(()=>{const f=u.current;if(!f)return;f.querySelectorAll(".anchor-fav").forEach(v=>{const x=v.getAttribute("data-id")||"",y=`${(t==null?void 0:t.slug)||""}#${x}`;_l("lawsec",y)&&v.classList.add("active")});function c(v){const x=v.target;if(x&&x.classList.contains("anchor-fav")){v.preventDefault();const y=x.getAttribute("data-id")||"",S=x.getAttribute("data-title")||"";if(!t)return;const h=`${t.slug}#${y}`,p=`${location.pathname}#${y}`;Is("lawsec",h,{title:`${t.title} — ${S}`,url:p})?x.classList.add("active"):x.classList.remove("active")}}return f.addEventListener("click",c),()=>f.removeEventListener("click",c)},[u,n,t==null?void 0:t.slug]),!t)return s.jsxs("div",{className:"p-4",children:["Закон не найден. ",s.jsx(J,{to:"/",className:"text-blue-600 underline",children:"Назад"})]});const d=k.useMemo(()=>{if(!o.trim()||!n)return n;const f=new RegExp(`(${o.replace(/[.*+?^${}()|[\\]\\\\]/g,"\\$&")})`,"gi");return n.replace(f,"<mark>$1</mark>")},[o,n]),m=f=>f===2?"pl-0":f===3?"pl-3":"pl-6";return s.jsxs("div",{className:"min-h-screen text-zinc-900 dark:text-zinc-100",children:[s.jsx("header",{className:"sticky top-0 z-20 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70",children:s.jsxs("div",{className:"mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3",children:[s.jsxs(J,{to:"/",className:"flex items-center gap-1 text-sm hover:underline",children:[s.jsx(Ps,{className:"h-4 w-4"})," Назад"]}),s.jsxs("div",{className:"flex flex-col items-center",children:[s.jsxs("div",{className:"flex items-center gap-2",children:[s.jsx(Kl,{className:"h-5 w-5"}),s.jsx("h1",{className:"text-lg font-bold leading-tight",children:t.title})]}),s.jsx(Sr,{})]}),s.jsxs("div",{className:"flex items-center gap-2",children:[s.jsx($s,{kind:"law",id:t.slug,title:t.title,url:`/laws/${t.slug}`}),s.jsx("div",{className:"text-xs text-zinc-500",children:t.updated?`Обновлено: ${t.updated}`:""})]})]})}),s.jsxs("main",{className:"mx-auto grid max-w-6xl grid-cols-1 gap-5 px-4 py-5 md:grid-cols-[260px,1fr]",children:[s.jsx("aside",{className:"hidden md:block",children:s.jsxs("div",{className:"sticky top-16 rounded-2xl border border-zinc-200 bg-white/70 p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900/50",children:[s.jsxs("div",{className:"mb-2 flex items-center gap-2 font-semibold",children:[s.jsx(pm,{className:"h-4 w-4"})," Содержание"]}),l.length?s.jsx("ul",{className:"space-y-1",children:l.map(f=>s.jsx("li",{className:m(f.level),children:s.jsx("a",{className:"underline decoration-dotted hover:no-underline",href:`#${f.id}`,children:f.text})},f.id))}):s.jsx("div",{className:"text-xs text-zinc-500",children:"Добавьте подзаголовки (##/###) в Markdown, чтобы появилось оглавление."})]})}),s.jsxs("section",{children:[s.jsxs("div",{className:"mb-4 flex items-center gap-2",children:[s.jsx(zl,{className:"h-4 w-4 text-zinc-500"}),s.jsx("input",{className:"w-full rounded-xl border px-3 py-1.5 text-sm focus:outline-none focus:ring",placeholder:"Подсветить совпадения в тексте",value:o,onChange:f=>a(f.target.value)})]}),s.jsx("div",{className:"law prose prose-zinc max-w-none rounded-2xl border border-zinc-200 bg-white p-4 list-inside dark:prose-invert dark:border-zinc-800 dark:bg-zinc-900",ref:u,dangerouslySetInnerHTML:{__html:d}})]})]})]})}function Th(){const{id:e}=Ql(),t=Cl.find(r=>r.id===e);if(!t)return s.jsxs("div",{className:"p-4",children:["Не найдено. ",s.jsx(J,{to:"/",className:"text-blue-600 underline",children:"На главную"})]});const n=k.useMemo(()=>$h(t.text||""),[t==null?void 0:t.text]);return s.jsxs("div",{className:"min-h-screen text-zinc-900 dark:text-zinc-100",children:[s.jsx("header",{className:"sticky top-0 z-20 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70",children:s.jsxs("div",{className:"mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3",children:[s.jsxs(J,{to:"/",className:"flex items-center gap-1 text-sm hover:underline",children:[s.jsx(Ps,{className:"h-4 w-4"})," Назад"]}),s.jsxs("div",{className:"flex flex-col items-center",children:[s.jsxs("div",{className:"flex items-center gap-2",children:[s.jsx(xt,{className:"h-5 w-5"}),s.jsx("h1",{className:"text-lg font-bold leading-tight",children:t.title})]}),s.jsx(Sr,{})]}),s.jsx("div",{className:"text-xs text-zinc-500",children:t.updated?`Обновлено: ${t.updated}`:""})]})}),s.jsxs("main",{className:"mx-auto grid max-w-6xl grid-cols-1 gap-5 px-4 py-5 md:grid-cols-[260px,1fr]",children:[s.jsx("aside",{className:"hidden md:block",children:s.jsxs("div",{className:"sticky top-16 rounded-2xl border border-zinc-200 bg-white/70 p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900/50",children:[s.jsx("div",{className:"mb-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400",children:"Оглавление"}),n.toc.length?s.jsx("ul",{className:"space-y-1",children:n.toc.map(r=>s.jsx("li",{children:s.jsx("a",{className:"underline decoration-dotted hover:no-underline",href:`#${r.id}`,children:r.text})},r.id))}):s.jsx("div",{className:"text-xs text-zinc-500",children:"Заголовки не найдены."})]})}),s.jsx("section",{children:s.jsx("div",{className:"rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900",children:s.jsx("div",{className:"vu prose prose-zinc max-w-none text-sm leading-relaxed dark:prose-invert",children:n.nodes})})})]})]})}function Ih(e){return e.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu,"").trim().replace(/\s+/g,"-").slice(0,80)}function $h(e){const t=e.replace(/\r\n?/g,`
`).split(`
`),n=[],r=[];let l=0;const i=/^\s*(Глава|Раздел)\s+(\d+[\.:)]?)\s*(.*)$/i,o=/^\s*(\d+(?:\.\d+)+)\.?\s+(.*)$/,a=/^\s*(\d+)\.\s+(.*)$/;for(const u of t){const d=u.trim();if(!d){n.push(s.jsx("div",{className:"h-3"},l++));continue}let m=d.match(i);if(m){const f=`${m[1]} ${m[2]}${m[3]?" — "+m[3]:""}`,c=Ih(f);r.push({id:c,text:f}),n.push(s.jsx("h2",{id:c,children:f},l++));continue}if(m=d.match(o)||d.match(a),m){n.push(s.jsxs("p",{className:"flex",children:[s.jsx("span",{className:"num",children:m[1]}),s.jsx("span",{children:m[2]})]},l++));continue}n.push(s.jsx("p",{children:d},l++))}return{nodes:n,toc:r}}function Dn(e){return`${"/pravo/".replace(/\/$/,"")}${e}`}function Rh(){const[e,t]=D.useState(!1),[n,r]=D.useState(""),[l,i]=D.useState(0),[o,a]=D.useState(()=>localStorage.getItem("cp_filter")||"all");D.useEffect(()=>{try{localStorage.setItem("cp_filter",o)}catch{}},[o]),D.useEffect(()=>{function c(v){(v.ctrlKey||v.metaKey)&&v.key.toLowerCase()==="k"&&(v.preventDefault(),t(!0),r(""),i(0)),e&&v.key==="Escape"&&t(!1)}return window.addEventListener("keydown",c),()=>window.removeEventListener("keydown",c)},[e]);const u=D.useMemo(()=>{const c=[];c.push({kind:"page",id:"favorites",title:"Избранное",subtitle:"Страница",url:Dn("/favorites")}),c.push({kind:"page",id:"settings",title:"Настройки",subtitle:"Страница",url:Dn("/settings")});for(const y of Ut)c.push({kind:"role",id:y.id,title:y.role,subtitle:"Роль",url:Dn(`/roles/${y.id}`)});for(const y of wn)c.push({kind:"law",id:y.slug,title:y.title,subtitle:"Закон",url:Dn(`/laws/${y.slug}`)});for(const y of Cl)c.push({kind:"vu",id:y.id,title:y.title,subtitle:"ВУ",url:Dn(`/vu/${y.id}`)});const v=n.trim().toLowerCase();return v?(o==="all"?c:c.filter(y=>y.kind===o)).map(y=>({r:y,score:d(`${y.title} ${y.subtitle||""}`.toLowerCase(),v)})).filter(y=>y.score>0).sort((y,S)=>S.score-y.score).slice(0,30).map(y=>y.r):c.slice(0,20)},[n,o]);function d(c,v){return v.split(/\s+/).filter(Boolean).reduce((y,S)=>y+(c.includes(S)?1:0),0)}function m(c){t(!1),window.location.href=c}function f(c){u.length&&(c.key==="ArrowDown"&&(c.preventDefault(),i(v=>Math.min(v+1,u.length-1))),c.key==="ArrowUp"&&(c.preventDefault(),i(v=>Math.max(v-1,0))),c.key==="Enter"&&(c.preventDefault(),m(u[l].url)))}return s.jsxs(s.Fragment,{children:[s.jsxs("button",{className:"fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white/80 px-3 py-2 text-sm shadow-sm backdrop-blur hover:bg-white text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-100",onClick:()=>t(!0),title:"Поиск (Ctrl/Cmd + K)","aria-label":"Открыть поиск",children:[s.jsx(zl,{className:"h-4 w-4 text-zinc-600 dark:text-zinc-300"}),s.jsx("span",{className:"hidden sm:inline",children:"Поиск"}),s.jsx("kbd",{className:"ml-1 hidden sm:inline-flex items-center whitespace-nowrap font-mono rounded-md border border-zinc-400 bg-white px-1.5 py-0.5 text-[11px] font-medium text-zinc-900 shadow",children:navigator.platform.includes("Mac")?"⌘K":"Ctrl K"})]}),e?s.jsx("div",{className:"fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4",role:"dialog","aria-modal":"true","aria-label":"Командная палитра",children:s.jsxs("div",{className:"w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-3 text-zinc-900 shadow-softLg dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100",children:[s.jsxs("div",{className:"mb-2 flex items-center gap-2",children:[s.jsx(zl,{className:"h-4 w-4 text-zinc-500 dark:text-zinc-400"}),s.jsx("input",{autoFocus:!0,value:n,onChange:c=>{r(c.target.value),i(0)},onKeyDown:f,placeholder:"Роли, законы, уставы...",className:"w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring text-zinc-900 placeholder-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"}),s.jsx("button",{className:"btn text-zinc-600 dark:text-zinc-300",onClick:()=>t(!1),"aria-label":"Закрыть поиск",children:s.jsx(Vm,{className:"h-4 w-4"})})]}),s.jsx("div",{className:"mb-2 flex items-center gap-2",children:[{k:"all",label:"Все"},{k:"role",label:"Роли"},{k:"law",label:"Законы"},{k:"vu",label:"ВУ"}].map(c=>s.jsx("button",{onClick:()=>{a(c.k),i(0)},className:`chip ${o===c.k?"bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900":"bg-white dark:bg-zinc-900"}`,children:c.label},c.k))}),s.jsxs("div",{className:"max-h-80 overflow-y-auto rounded-xl border border-zinc-200 dark:border-zinc-700",children:[!u.length&&s.jsx("div",{className:"p-3 text-sm text-zinc-500 dark:text-zinc-400",children:"Ничего не найдено"}),u.map((c,v)=>s.jsxs("button",{className:`flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm text-zinc-900 hover:bg-zinc-50 dark:text-zinc-100 dark:hover:bg-zinc-800 ${v===l?"bg-indigo-50 ring-1 ring-indigo-500/30 dark:bg-indigo-900/30":""}`,onMouseEnter:()=>i(v),onClick:()=>m(c.url),children:[s.jsxs("span",{className:"inline-flex items-center gap-2",children:[c.kind==="law"&&s.jsx(Kl,{className:"h-4 w-4"}),c.kind==="role"&&s.jsx(Qd,{className:"h-4 w-4"}),c.kind==="vu"&&s.jsx(xt,{className:"h-4 w-4"}),c.kind==="page"&&(c.id==="settings"?s.jsx(Wd,{className:"h-4 w-4"}):s.jsx(Hd,{className:"h-4 w-4"})),s.jsx("span",{className:"font-medium",children:c.title})]}),s.jsx("span",{className:"rounded-full border border-zinc-300 px-2 py-0.5 text-[10px] text-zinc-600 dark:border-zinc-600 dark:text-zinc-300",children:c.subtitle})]},`${c.kind}:${c.id}`))]})]})}):null]})}const Kt={},Oh=(Kt==null?void 0:Kt.VITE_API_BASE)||(Kt==null?void 0:Kt.VITE_VOTE_API_BASE)||"https://sky-api.wizardiowhy.workers.dev";function Dh(){try{const e="anon_uid";let t=localStorage.getItem(e);return t||(t=crypto.randomUUID(),localStorage.setItem(e,t)),t}catch{return"na"}}function Fh(){return{site:typeof location<"u"?location.host:"",path:typeof location<"u"?location.pathname+location.search+location.hash:"",ua:typeof navigator<"u"?navigator.userAgent:"",uid:Dh()}}function Ah(e,t){try{if(typeof localStorage<"u"&&localStorage.getItem("telemetry_disabled")==="1")return}catch{}try{const l=(navigator==null?void 0:navigator.doNotTrack)||(window==null?void 0:window.doNotTrack)||(navigator==null?void 0:navigator.msDoNotTrack);if(String(l)==="1"||String(l)==="yes")return}catch{}const n=JSON.stringify({event:e,...Fh(),data:t}),r=`${Oh}/api/track`;if(typeof navigator<"u"&&"sendBeacon"in navigator)try{const l=new Blob([n],{type:"application/json"});if(navigator.sendBeacon(r,l))return}catch{}try{fetch(r,{method:"POST",headers:{"content-type":"application/json"},body:n})}catch{}}const ef="theme",tf="accent",Uh="accent_custom",Mo="bg",Bh="bg_custom",Rs={indigo:{500:"#6366F1",600:"#4F46E5"},violet:{500:"#8B5CF6",600:"#7C3AED"},blue:{500:"#3B82F6",600:"#2563EB"}},nf={bg1:"img/bg1.png",bg2:"img/bg2.png",bg3:"img/bg3.png"};function Vh(){const e=localStorage.getItem(ef);return e==="light"||e==="dark"?e:null}function rf(){const e=localStorage.getItem(tf);return e?e==="custom"?"custom":e in Rs?e:null:null}function bh(){return localStorage.getItem(Uh)}function Wh(){const e=localStorage.getItem(Mo);return e&&(e==="none"||e==="custom"||e in nf)?e:null}function Hh(){return localStorage.getItem(Bh)}function lf(){return window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches}function Os(e){const t=document.documentElement;e==="dark"?t.classList.add("dark"):t.classList.remove("dark"),localStorage.setItem(ef,e);const n=e==="dark"?"#0a0a0a":"#fafafa";let r=document.querySelector('meta[name="theme-color"]');r||(r=document.createElement("meta"),r.name="theme-color",document.head.appendChild(r)),r.setAttribute("content",n);try{t.style.backgroundColor="var(--bg-1)",document.body.style.backgroundColor="var(--bg-1)"}catch{}}function To(e){if(e==="custom"){const t=bh()||"#6366F1";document.documentElement.style.setProperty("--accent",t);const n=Gh(t,-.15);document.documentElement.style.setProperty("--accent-600",n)}else{const t=Rs[e];document.documentElement.style.setProperty("--accent",t[500]),document.documentElement.style.setProperty("--accent-600",t[600])}localStorage.setItem(tf,e)}function Qh(e){const t=document.body;if(document.documentElement.classList.contains("dark")){t.style.backgroundImage="",t.style.backgroundSize="",t.style.backgroundRepeat="",t.style.backgroundAttachment="",t.style.backgroundPosition="",localStorage.setItem(Mo,e);return}if(e==="none")t.style.backgroundImage="",t.style.backgroundSize="",t.style.backgroundRepeat="",t.style.backgroundAttachment="",t.style.backgroundPosition="";else if(e==="custom"){const r=Hh();r?(t.style.backgroundImage=`url(${r})`,t.style.backgroundSize="cover",t.style.backgroundRepeat="no-repeat",t.style.backgroundAttachment="fixed",t.style.backgroundPosition="center"):t.style.backgroundImage=""}else{const r=`/pravo/${nf[e]}`;t.style.backgroundImage=`url(${r})`,t.style.backgroundSize="cover",t.style.backgroundRepeat="no-repeat",t.style.backgroundAttachment="fixed",t.style.backgroundPosition="center"}localStorage.setItem(Mo,e)}function Kh(){const t=Vh()??(lf()?"dark":"light");Os(t);const n=rf()??"indigo";To(n);const r=Wh()??"none";Qh(r)}function Xh(){const e=document.documentElement.classList.contains("dark")?"light":"dark";return Os(e),e}function Yh(e){let t=e.trim();if(t.startsWith("#")||(t=`#${t}`),t.length===4){const n=t[1],r=t[2],l=t[3];t=`#${n}${n}${r}${r}${l}${l}`}return t}function Gh(e,t){const n=Yh(e).slice(1),r=parseInt(n,16);let l=r>>16&255,i=r>>8&255,o=r&255;l=Math.max(0,Math.min(255,Math.round(l+255*t))),i=Math.max(0,Math.min(255,Math.round(i+255*t))),o=Math.max(0,Math.min(255,Math.round(o+255*t)));const a=u=>u.toString(16).padStart(2,"0");return`#${a(l)}${a(i)}${a(o)}`}function Zh(){const[e,t]=D.useState(()=>document.documentElement.classList.contains("dark"));function n(){const r=Xh();t(r==="dark")}return s.jsx("button",{onClick:n,"aria-label":"Toggle theme",className:"btn",children:e?s.jsx($m,{className:"h-4 w-4"}):s.jsx(xm,{className:"h-4 w-4"})})}function Jh(){const[e,t]=D.useState(()=>rf()??"indigo");function n(l){t(l);try{To(l)}catch{}}function r(){try{const l={};for(let i=0;i<localStorage.length;i++){const o=localStorage.key(i)||"";if(o.startsWith("fav:")||o.startsWith("fav:item:")||o.startsWith("promo:")){const a=localStorage.getItem(o);a!=null&&(l[o]=a)}}localStorage.clear();for(const i in l)localStorage.setItem(i,l[i])}catch{}try{const l=lf()?"dark":"light";Os(l),To("indigo")}catch{}t("indigo")}return s.jsxs("div",{className:"min-h-screen text-zinc-900 dark:text-zinc-100",children:[s.jsx("header",{className:"sticky top-0 z-20 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70",children:s.jsxs("div",{className:"mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3",children:[s.jsx(J,{to:"/",className:"text-sm underline decoration-dotted hover:no-underline",children:"На главную"}),s.jsx("h1",{className:"text-lg font-bold",children:"Настройки"})]})}),s.jsx("main",{className:"mx-auto max-w-3xl px-4 py-6",children:s.jsxs("div",{className:"grid gap-4",children:[s.jsxs("section",{className:"card",children:[s.jsx("h2",{className:"mb-2 text-base font-semibold",children:"Тема"}),s.jsx("div",{className:"text-sm",children:"Светлая/тёмная/системная:"}),s.jsx("div",{className:"w-9",children:s.jsx(Zh,{})})]}),s.jsxs("section",{className:"card",children:[s.jsx("h2",{className:"mb-2 text-base font-semibold",children:"Акцентный цвет"}),s.jsx("div",{className:"flex flex-wrap gap-2",children:Object.entries(Rs).map(([l,i])=>s.jsxs("label",{className:"cursor-pointer",title:l,children:[s.jsx("input",{type:"radio",name:"accent",className:"sr-only",checked:e===l,onChange:()=>n(l),"aria-label":`Accent ${l}`}),s.jsx("span",{className:`block h-6 w-6 rounded-full border ${e===l?"ring-2 ring-offset-2":""}`,style:{background:i[500]}})]},l))})]}),s.jsxs("section",{className:"card",children:[s.jsx("h2",{className:"mb-2 text-base font-semibold",children:"Сброс"}),s.jsx("button",{type:"button",onClick:r,className:"btn btn-primary",children:"Сбросить настройки"})]})]})})]})}function qh(){const[e,t]=D.useState(()=>cu());D.useEffect(()=>{const l=()=>t(cu());return window.addEventListener("favorites:change",l),window.addEventListener("storage",l),()=>{window.removeEventListener("favorites:change",l),window.removeEventListener("storage",l)}},[]);const n=D.useMemo(()=>e.map(l=>{if(l.kind==="role"){const i=Ut.find(o=>o.id===l.id);return i?{title:l.title??i.role,url:l.url??`/roles/${i.id}`,kindLabel:"Должность"}:null}if(l.kind==="law"){const i=wn.find(o=>o.slug===l.id);return i?{title:l.title??i.title,url:l.url??`/laws/${i.slug}`,kindLabel:"Закон"}:null}return l.kind==="lawsec"?{title:l.title??l.id,url:l.url??"#",kindLabel:"Раздел закона"}:l.kind==="vu"?{title:l.title??l.id,url:l.url??`/vu/${l.id}`,kindLabel:"ВУ материал"}:null}).filter(Boolean),[e]);function r(l,i){jh(l,i),t(o=>o.filter(a=>!(a.kind===l&&a.id===i)))}return s.jsxs("div",{className:"min-h-screen text-zinc-900 dark:text-zinc-100",children:[s.jsx("header",{className:"sticky top-0 z-20 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70",children:s.jsxs("div",{className:"mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3",children:[s.jsx(J,{to:"/",className:"text-sm underline decoration-dotted hover:no-underline",children:"Назад"}),s.jsxs("div",{className:"flex flex-col items-center",children:[s.jsx("h1",{className:"text-lg font-bold",children:"Избранное"}),s.jsx(Sr,{})]}),s.jsx("span",{})]})}),s.jsx("main",{className:"mx-auto max-w-3xl px-4 py-6",children:n.length?s.jsx("div",{className:"grid gap-2",children:n.map((l,i)=>{const o=e[i];return o?s.jsxs("div",{className:"flex items-center justify-between rounded-xl border border-zinc-200 bg-white/80 p-3 shadow-sm backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/60",children:[s.jsxs(J,{to:l.url,className:"min-w-0",children:[s.jsx("div",{className:"truncate text-sm font-semibold",children:l.title}),s.jsx("div",{className:"text-xs text-zinc-500",children:l.kindLabel})]}),s.jsxs("div",{className:"ml-3 flex items-center gap-2",children:[s.jsx($s,{kind:o.kind,id:o.id,title:l.title,url:l.url,size:"sm"}),s.jsx("button",{className:"btn",onClick:()=>r(o.kind,o.id),title:"Удалить",children:"Удалить"})]})]},`${o.kind}:${o.id}`):null})}):s.jsx("div",{className:"card text-sm text-zinc-600 dark:text-zinc-300",children:"Пока пусто. Добавляйте статьи, разделы законов, роли и материалы ВУ — они появятся здесь."})})]})}function e2(){const e=En();return k.useEffect(()=>{Ah("page_view")},[e.pathname,e.search,e.hash]),null}function t2(){return s.jsxs($0,{basename:"/pravo/",children:[s.jsx(Rh,{}),s.jsx(e2,{}),s.jsxs(z0,{children:[s.jsx(Ue,{path:"/",element:s.jsx(gh,{})}),s.jsx(Ue,{path:"/whats-new",element:s.jsx(vh,{})}),s.jsx(Ue,{path:"/diff/:id",element:s.jsx(yh,{})}),s.jsx(Ue,{path:"/print",element:s.jsx(xh,{})}),s.jsx(Ue,{path:"/roles/:id",element:s.jsx(Ch,{})}),s.jsx(Ue,{path:"/laws/:slug",element:s.jsx(Mh,{})}),s.jsx(Ue,{path:"/vu/:id",element:s.jsx(Th,{})}),s.jsx(Ue,{path:"/settings",element:s.jsx(Jh,{})}),s.jsx(Ue,{path:"/favorites",element:s.jsx(qh,{})})]})]})}Kh();Li.createRoot(document.getElementById("root")).render(s.jsx(D.StrictMode,{children:s.jsx(t2,{})}));
