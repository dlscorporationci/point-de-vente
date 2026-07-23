var e=Object.create,t=Object.defineProperty,n=Object.getOwnPropertyDescriptor,r=Object.getOwnPropertyNames,i=Object.getPrototypeOf,a=Object.prototype.hasOwnProperty,o=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t),e=null),t.exports),s=(e,n)=>{let r={};for(var i in e)t(r,i,{get:e[i],enumerable:!0});return n||t(r,Symbol.toStringTag,{value:`Module`}),r},c=(e,i,o,s)=>{if(i&&typeof i==`object`||typeof i==`function`)for(var c=r(i),l=0,u=c.length,d;l<u;l++)d=c[l],!a.call(e,d)&&d!==o&&t(e,d,{get:(e=>i[e]).bind(null,d),enumerable:!(s=n(i,d))||s.enumerable});return e},l=(n,r,a)=>(a=n==null?{}:e(i(n)),c(r||!n||!n.__esModule?t(a,`default`,{value:n,enumerable:!0}):a,n));(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var u=o((e=>{var t=Symbol.for(`react.transitional.element`),n=Symbol.for(`react.portal`),r=Symbol.for(`react.fragment`),i=Symbol.for(`react.strict_mode`),a=Symbol.for(`react.profiler`),o=Symbol.for(`react.consumer`),s=Symbol.for(`react.context`),c=Symbol.for(`react.forward_ref`),l=Symbol.for(`react.suspense`),u=Symbol.for(`react.memo`),d=Symbol.for(`react.lazy`),f=Symbol.for(`react.activity`),p=Symbol.iterator;function m(e){return typeof e!=`object`||!e?null:(e=p&&e[p]||e[`@@iterator`],typeof e==`function`?e:null)}var h={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},g=Object.assign,_={};function v(e,t,n){this.props=e,this.context=t,this.refs=_,this.updater=n||h}v.prototype.isReactComponent={},v.prototype.setState=function(e,t){if(typeof e!=`object`&&typeof e!=`function`&&e!=null)throw Error(`takes an object of state variables to update or a function which returns an object of state variables.`);this.updater.enqueueSetState(this,e,t,`setState`)},v.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,`forceUpdate`)};function y(){}y.prototype=v.prototype;function b(e,t,n){this.props=e,this.context=t,this.refs=_,this.updater=n||h}var x=b.prototype=new y;x.constructor=b,g(x,v.prototype),x.isPureReactComponent=!0;var S=Array.isArray;function C(){}var w={H:null,A:null,T:null,S:null},T=Object.prototype.hasOwnProperty;function E(e,n,r){var i=r.ref;return{$$typeof:t,type:e,key:n,ref:i===void 0?null:i,props:r}}function D(e,t){return E(e.type,t,e.props)}function O(e){return typeof e==`object`&&!!e&&e.$$typeof===t}function k(e){var t={"=":`=0`,":":`=2`};return`$`+e.replace(/[=:]/g,function(e){return t[e]})}var A=/\/+/g;function j(e,t){return typeof e==`object`&&e&&e.key!=null?k(``+e.key):t.toString(36)}function M(e){switch(e.status){case`fulfilled`:return e.value;case`rejected`:throw e.reason;default:switch(typeof e.status==`string`?e.then(C,C):(e.status=`pending`,e.then(function(t){e.status===`pending`&&(e.status=`fulfilled`,e.value=t)},function(t){e.status===`pending`&&(e.status=`rejected`,e.reason=t)})),e.status){case`fulfilled`:return e.value;case`rejected`:throw e.reason}}throw e}function N(e,r,i,a,o){var s=typeof e;(s===`undefined`||s===`boolean`)&&(e=null);var c=!1;if(e===null)c=!0;else switch(s){case`bigint`:case`string`:case`number`:c=!0;break;case`object`:switch(e.$$typeof){case t:case n:c=!0;break;case d:return c=e._init,N(c(e._payload),r,i,a,o)}}if(c)return o=o(e),c=a===``?`.`+j(e,0):a,S(o)?(i=``,c!=null&&(i=c.replace(A,`$&/`)+`/`),N(o,r,i,``,function(e){return e})):o!=null&&(O(o)&&(o=D(o,i+(o.key==null||e&&e.key===o.key?``:(``+o.key).replace(A,`$&/`)+`/`)+c)),r.push(o)),1;c=0;var l=a===``?`.`:a+`:`;if(S(e))for(var u=0;u<e.length;u++)a=e[u],s=l+j(a,u),c+=N(a,r,i,s,o);else if(u=m(e),typeof u==`function`)for(e=u.call(e),u=0;!(a=e.next()).done;)a=a.value,s=l+j(a,u++),c+=N(a,r,i,s,o);else if(s===`object`){if(typeof e.then==`function`)return N(M(e),r,i,a,o);throw r=String(e),Error(`Objects are not valid as a React child (found: `+(r===`[object Object]`?`object with keys {`+Object.keys(e).join(`, `)+`}`:r)+`). If you meant to render a collection of children, use an array instead.`)}return c}function P(e,t,n){if(e==null)return e;var r=[],i=0;return N(e,r,``,``,function(e){return t.call(n,e,i++)}),r}function F(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(t){(e._status===0||e._status===-1)&&(e._status=1,e._result=t)},function(t){(e._status===0||e._status===-1)&&(e._status=2,e._result=t)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var I=typeof reportError==`function`?reportError:function(e){if(typeof window==`object`&&typeof window.ErrorEvent==`function`){var t=new window.ErrorEvent(`error`,{bubbles:!0,cancelable:!0,message:typeof e==`object`&&e&&typeof e.message==`string`?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process==`object`&&typeof process.emit==`function`){process.emit(`uncaughtException`,e);return}console.error(e)},L={map:P,forEach:function(e,t,n){P(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return P(e,function(){t++}),t},toArray:function(e){return P(e,function(e){return e})||[]},only:function(e){if(!O(e))throw Error(`React.Children.only expected to receive a single React element child.`);return e}};e.Activity=f,e.Children=L,e.Component=v,e.Fragment=r,e.Profiler=a,e.PureComponent=b,e.StrictMode=i,e.Suspense=l,e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=w,e.__COMPILER_RUNTIME={__proto__:null,c:function(e){return w.H.useMemoCache(e)}},e.cache=function(e){return function(){return e.apply(null,arguments)}},e.cacheSignal=function(){return null},e.cloneElement=function(e,t,n){if(e==null)throw Error(`The argument must be a React element, but you passed `+e+`.`);var r=g({},e.props),i=e.key;if(t!=null)for(a in t.key!==void 0&&(i=``+t.key),t)!T.call(t,a)||a===`key`||a===`__self`||a===`__source`||a===`ref`&&t.ref===void 0||(r[a]=t[a]);var a=arguments.length-2;if(a===1)r.children=n;else if(1<a){for(var o=Array(a),s=0;s<a;s++)o[s]=arguments[s+2];r.children=o}return E(e.type,i,r)},e.createContext=function(e){return e={$$typeof:s,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null},e.Provider=e,e.Consumer={$$typeof:o,_context:e},e},e.createElement=function(e,t,n){var r,i={},a=null;if(t!=null)for(r in t.key!==void 0&&(a=``+t.key),t)T.call(t,r)&&r!==`key`&&r!==`__self`&&r!==`__source`&&(i[r]=t[r]);var o=arguments.length-2;if(o===1)i.children=n;else if(1<o){for(var s=Array(o),c=0;c<o;c++)s[c]=arguments[c+2];i.children=s}if(e&&e.defaultProps)for(r in o=e.defaultProps,o)i[r]===void 0&&(i[r]=o[r]);return E(e,a,i)},e.createRef=function(){return{current:null}},e.forwardRef=function(e){return{$$typeof:c,render:e}},e.isValidElement=O,e.lazy=function(e){return{$$typeof:d,_payload:{_status:-1,_result:e},_init:F}},e.memo=function(e,t){return{$$typeof:u,type:e,compare:t===void 0?null:t}},e.startTransition=function(e){var t=w.T,n={};w.T=n;try{var r=e(),i=w.S;i!==null&&i(n,r),typeof r==`object`&&r&&typeof r.then==`function`&&r.then(C,I)}catch(e){I(e)}finally{t!==null&&n.types!==null&&(t.types=n.types),w.T=t}},e.unstable_useCacheRefresh=function(){return w.H.useCacheRefresh()},e.use=function(e){return w.H.use(e)},e.useActionState=function(e,t,n){return w.H.useActionState(e,t,n)},e.useCallback=function(e,t){return w.H.useCallback(e,t)},e.useContext=function(e){return w.H.useContext(e)},e.useDebugValue=function(){},e.useDeferredValue=function(e,t){return w.H.useDeferredValue(e,t)},e.useEffect=function(e,t){return w.H.useEffect(e,t)},e.useEffectEvent=function(e){return w.H.useEffectEvent(e)},e.useId=function(){return w.H.useId()},e.useImperativeHandle=function(e,t,n){return w.H.useImperativeHandle(e,t,n)},e.useInsertionEffect=function(e,t){return w.H.useInsertionEffect(e,t)},e.useLayoutEffect=function(e,t){return w.H.useLayoutEffect(e,t)},e.useMemo=function(e,t){return w.H.useMemo(e,t)},e.useOptimistic=function(e,t){return w.H.useOptimistic(e,t)},e.useReducer=function(e,t,n){return w.H.useReducer(e,t,n)},e.useRef=function(e){return w.H.useRef(e)},e.useState=function(e){return w.H.useState(e)},e.useSyncExternalStore=function(e,t,n){return w.H.useSyncExternalStore(e,t,n)},e.useTransition=function(){return w.H.useTransition()},e.version=`19.2.7`})),d=o(((e,t)=>{t.exports=u()})),f=o((e=>{function t(e,t){var n=e.length;e.push(t);a:for(;0<n;){var r=n-1>>>1,a=e[r];if(0<i(a,t))e[r]=t,e[n]=a,n=r;else break a}}function n(e){return e.length===0?null:e[0]}function r(e){if(e.length===0)return null;var t=e[0],n=e.pop();if(n!==t){e[0]=n;a:for(var r=0,a=e.length,o=a>>>1;r<o;){var s=2*(r+1)-1,c=e[s],l=s+1,u=e[l];if(0>i(c,n))l<a&&0>i(u,c)?(e[r]=u,e[l]=n,r=l):(e[r]=c,e[s]=n,r=s);else if(l<a&&0>i(u,n))e[r]=u,e[l]=n,r=l;else break a}}return t}function i(e,t){var n=e.sortIndex-t.sortIndex;return n===0?e.id-t.id:n}if(e.unstable_now=void 0,typeof performance==`object`&&typeof performance.now==`function`){var a=performance;e.unstable_now=function(){return a.now()}}else{var o=Date,s=o.now();e.unstable_now=function(){return o.now()-s}}var c=[],l=[],u=1,d=null,f=3,p=!1,m=!1,h=!1,g=!1,_=typeof setTimeout==`function`?setTimeout:null,v=typeof clearTimeout==`function`?clearTimeout:null,y=typeof setImmediate<`u`?setImmediate:null;function b(e){for(var i=n(l);i!==null;){if(i.callback===null)r(l);else if(i.startTime<=e)r(l),i.sortIndex=i.expirationTime,t(c,i);else break;i=n(l)}}function x(e){if(h=!1,b(e),!m)if(n(c)!==null)m=!0,S||(S=!0,O());else{var t=n(l);t!==null&&j(x,t.startTime-e)}}var S=!1,C=-1,w=5,T=-1;function E(){return g?!0:!(e.unstable_now()-T<w)}function D(){if(g=!1,S){var t=e.unstable_now();T=t;var i=!0;try{a:{m=!1,h&&(h=!1,v(C),C=-1),p=!0;var a=f;try{b:{for(b(t),d=n(c);d!==null&&!(d.expirationTime>t&&E());){var o=d.callback;if(typeof o==`function`){d.callback=null,f=d.priorityLevel;var s=o(d.expirationTime<=t);if(t=e.unstable_now(),typeof s==`function`){d.callback=s,b(t),i=!0;break b}d===n(c)&&r(c),b(t)}else r(c);d=n(c)}if(d!==null)i=!0;else{var u=n(l);u!==null&&j(x,u.startTime-t),i=!1}}break a}finally{d=null,f=a,p=!1}i=void 0}}finally{i?O():S=!1}}}var O;if(typeof y==`function`)O=function(){y(D)};else if(typeof MessageChannel<`u`){var k=new MessageChannel,A=k.port2;k.port1.onmessage=D,O=function(){A.postMessage(null)}}else O=function(){_(D,0)};function j(t,n){C=_(function(){t(e.unstable_now())},n)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(e){e.callback=null},e.unstable_forceFrameRate=function(e){0>e||125<e?console.error(`forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported`):w=0<e?Math.floor(1e3/e):5},e.unstable_getCurrentPriorityLevel=function(){return f},e.unstable_next=function(e){switch(f){case 1:case 2:case 3:var t=3;break;default:t=f}var n=f;f=t;try{return e()}finally{f=n}},e.unstable_requestPaint=function(){g=!0},e.unstable_runWithPriority=function(e,t){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var n=f;f=e;try{return t()}finally{f=n}},e.unstable_scheduleCallback=function(r,i,a){var o=e.unstable_now();switch(typeof a==`object`&&a?(a=a.delay,a=typeof a==`number`&&0<a?o+a:o):a=o,r){case 1:var s=-1;break;case 2:s=250;break;case 5:s=1073741823;break;case 4:s=1e4;break;default:s=5e3}return s=a+s,r={id:u++,callback:i,priorityLevel:r,startTime:a,expirationTime:s,sortIndex:-1},a>o?(r.sortIndex=a,t(l,r),n(c)===null&&r===n(l)&&(h?(v(C),C=-1):h=!0,j(x,a-o))):(r.sortIndex=s,t(c,r),m||p||(m=!0,S||(S=!0,O()))),r},e.unstable_shouldYield=E,e.unstable_wrapCallback=function(e){var t=f;return function(){var n=f;f=t;try{return e.apply(this,arguments)}finally{f=n}}}})),p=o(((e,t)=>{t.exports=f()})),m=o((e=>{var t=d();function n(e){var t=`https://react.dev/errors/`+e;if(1<arguments.length){t+=`?args[]=`+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+=`&args[]=`+encodeURIComponent(arguments[n])}return`Minified React error #`+e+`; visit `+t+` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`}function r(){}var i={d:{f:r,r:function(){throw Error(n(522))},D:r,C:r,L:r,m:r,X:r,S:r,M:r},p:0,findDOMNode:null},a=Symbol.for(`react.portal`);function o(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:a,key:r==null?null:``+r,children:e,containerInfo:t,implementation:n}}var s=t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function c(e,t){if(e===`font`)return``;if(typeof t==`string`)return t===`use-credentials`?t:``}e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=i,e.createPortal=function(e,t){var r=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)throw Error(n(299));return o(e,t,null,r)},e.flushSync=function(e){var t=s.T,n=i.p;try{if(s.T=null,i.p=2,e)return e()}finally{s.T=t,i.p=n,i.d.f()}},e.preconnect=function(e,t){typeof e==`string`&&(t?(t=t.crossOrigin,t=typeof t==`string`?t===`use-credentials`?t:``:void 0):t=null,i.d.C(e,t))},e.prefetchDNS=function(e){typeof e==`string`&&i.d.D(e)},e.preinit=function(e,t){if(typeof e==`string`&&t&&typeof t.as==`string`){var n=t.as,r=c(n,t.crossOrigin),a=typeof t.integrity==`string`?t.integrity:void 0,o=typeof t.fetchPriority==`string`?t.fetchPriority:void 0;n===`style`?i.d.S(e,typeof t.precedence==`string`?t.precedence:void 0,{crossOrigin:r,integrity:a,fetchPriority:o}):n===`script`&&i.d.X(e,{crossOrigin:r,integrity:a,fetchPriority:o,nonce:typeof t.nonce==`string`?t.nonce:void 0})}},e.preinitModule=function(e,t){if(typeof e==`string`)if(typeof t==`object`&&t){if(t.as==null||t.as===`script`){var n=c(t.as,t.crossOrigin);i.d.M(e,{crossOrigin:n,integrity:typeof t.integrity==`string`?t.integrity:void 0,nonce:typeof t.nonce==`string`?t.nonce:void 0})}}else t??i.d.M(e)},e.preload=function(e,t){if(typeof e==`string`&&typeof t==`object`&&t&&typeof t.as==`string`){var n=t.as,r=c(n,t.crossOrigin);i.d.L(e,n,{crossOrigin:r,integrity:typeof t.integrity==`string`?t.integrity:void 0,nonce:typeof t.nonce==`string`?t.nonce:void 0,type:typeof t.type==`string`?t.type:void 0,fetchPriority:typeof t.fetchPriority==`string`?t.fetchPriority:void 0,referrerPolicy:typeof t.referrerPolicy==`string`?t.referrerPolicy:void 0,imageSrcSet:typeof t.imageSrcSet==`string`?t.imageSrcSet:void 0,imageSizes:typeof t.imageSizes==`string`?t.imageSizes:void 0,media:typeof t.media==`string`?t.media:void 0})}},e.preloadModule=function(e,t){if(typeof e==`string`)if(t){var n=c(t.as,t.crossOrigin);i.d.m(e,{as:typeof t.as==`string`&&t.as!==`script`?t.as:void 0,crossOrigin:n,integrity:typeof t.integrity==`string`?t.integrity:void 0})}else i.d.m(e)},e.requestFormReset=function(e){i.d.r(e)},e.unstable_batchedUpdates=function(e,t){return e(t)},e.useFormState=function(e,t,n){return s.H.useFormState(e,t,n)},e.useFormStatus=function(){return s.H.useHostTransitionStatus()},e.version=`19.2.7`})),h=o(((e,t)=>{function n(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>`u`||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!=`function`))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n)}catch(e){console.error(e)}}n(),t.exports=m()})),g=o((e=>{var t=p(),n=d(),r=h();function i(e){var t=`https://react.dev/errors/`+e;if(1<arguments.length){t+=`?args[]=`+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+=`&args[]=`+encodeURIComponent(arguments[n])}return`Minified React error #`+e+`; visit `+t+` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`}function a(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function o(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,t.flags&4098&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function s(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function c(e){if(e.tag===31){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function l(e){if(o(e)!==e)throw Error(i(188))}function u(e){var t=e.alternate;if(!t){if(t=o(e),t===null)throw Error(i(188));return t===e?e:null}for(var n=e,r=t;;){var a=n.return;if(a===null)break;var s=a.alternate;if(s===null){if(r=a.return,r!==null){n=r;continue}break}if(a.child===s.child){for(s=a.child;s;){if(s===n)return l(a),e;if(s===r)return l(a),t;s=s.sibling}throw Error(i(188))}if(n.return!==r.return)n=a,r=s;else{for(var c=!1,u=a.child;u;){if(u===n){c=!0,n=a,r=s;break}if(u===r){c=!0,r=a,n=s;break}u=u.sibling}if(!c){for(u=s.child;u;){if(u===n){c=!0,n=s,r=a;break}if(u===r){c=!0,r=s,n=a;break}u=u.sibling}if(!c)throw Error(i(189))}}if(n.alternate!==r)throw Error(i(190))}if(n.tag!==3)throw Error(i(188));return n.stateNode.current===n?e:t}function f(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e;for(e=e.child;e!==null;){if(t=f(e),t!==null)return t;e=e.sibling}return null}var m=Object.assign,g=Symbol.for(`react.element`),_=Symbol.for(`react.transitional.element`),v=Symbol.for(`react.portal`),y=Symbol.for(`react.fragment`),b=Symbol.for(`react.strict_mode`),x=Symbol.for(`react.profiler`),S=Symbol.for(`react.consumer`),C=Symbol.for(`react.context`),w=Symbol.for(`react.forward_ref`),T=Symbol.for(`react.suspense`),E=Symbol.for(`react.suspense_list`),D=Symbol.for(`react.memo`),O=Symbol.for(`react.lazy`),k=Symbol.for(`react.activity`),A=Symbol.for(`react.memo_cache_sentinel`),j=Symbol.iterator;function M(e){return typeof e!=`object`||!e?null:(e=j&&e[j]||e[`@@iterator`],typeof e==`function`?e:null)}var N=Symbol.for(`react.client.reference`);function P(e){if(e==null)return null;if(typeof e==`function`)return e.$$typeof===N?null:e.displayName||e.name||null;if(typeof e==`string`)return e;switch(e){case y:return`Fragment`;case x:return`Profiler`;case b:return`StrictMode`;case T:return`Suspense`;case E:return`SuspenseList`;case k:return`Activity`}if(typeof e==`object`)switch(e.$$typeof){case v:return`Portal`;case C:return e.displayName||`Context`;case S:return(e._context.displayName||`Context`)+`.Consumer`;case w:var t=e.render;return e=e.displayName,e||=(e=t.displayName||t.name||``,e===``?`ForwardRef`:`ForwardRef(`+e+`)`),e;case D:return t=e.displayName||null,t===null?P(e.type)||`Memo`:t;case O:t=e._payload,e=e._init;try{return P(e(t))}catch{}}return null}var F=Array.isArray,I=n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,L=r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,R={pending:!1,data:null,method:null,action:null},ee=[],te=-1;function z(e){return{current:e}}function B(e){0>te||(e.current=ee[te],ee[te]=null,te--)}function V(e,t){te++,ee[te]=e.current,e.current=t}var H=z(null),ne=z(null),U=z(null),re=z(null);function ie(e,t){switch(V(U,t),V(ne,e),V(H,null),t.nodeType){case 9:case 11:e=(e=t.documentElement)&&(e=e.namespaceURI)?Vd(e):0;break;default:if(e=t.tagName,t=t.namespaceURI)t=Vd(t),e=Hd(t,e);else switch(e){case`svg`:e=1;break;case`math`:e=2;break;default:e=0}}B(H),V(H,e)}function ae(){B(H),B(ne),B(U)}function oe(e){e.memoizedState!==null&&V(re,e);var t=H.current,n=Hd(t,e.type);t!==n&&(V(ne,e),V(H,n))}function se(e){ne.current===e&&(B(H),B(ne)),re.current===e&&(B(re),Qf._currentValue=R)}var ce,le;function ue(e){if(ce===void 0)try{throw Error()}catch(e){var t=e.stack.trim().match(/\n( *(at )?)/);ce=t&&t[1]||``,le=-1<e.stack.indexOf(`
    at`)?` (<anonymous>)`:-1<e.stack.indexOf(`@`)?`@unknown:0:0`:``}return`
`+ce+e+le}var de=!1;function fe(e,t){if(!e||de)return``;de=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var r={DetermineComponentFrameRoot:function(){try{if(t){var n=function(){throw Error()};if(Object.defineProperty(n.prototype,"props",{set:function(){throw Error()}}),typeof Reflect==`object`&&Reflect.construct){try{Reflect.construct(n,[])}catch(e){var r=e}Reflect.construct(e,[],n)}else{try{n.call()}catch(e){r=e}e.call(n.prototype)}}else{try{throw Error()}catch(e){r=e}(n=e())&&typeof n.catch==`function`&&n.catch(function(){})}}catch(e){if(e&&r&&typeof e.stack==`string`)return[e.stack,r.stack]}return[null,null]}};r.DetermineComponentFrameRoot.displayName=`DetermineComponentFrameRoot`;var i=Object.getOwnPropertyDescriptor(r.DetermineComponentFrameRoot,`name`);i&&i.configurable&&Object.defineProperty(r.DetermineComponentFrameRoot,"name",{value:`DetermineComponentFrameRoot`});var a=r.DetermineComponentFrameRoot(),o=a[0],s=a[1];if(o&&s){var c=o.split(`
`),l=s.split(`
`);for(i=r=0;r<c.length&&!c[r].includes(`DetermineComponentFrameRoot`);)r++;for(;i<l.length&&!l[i].includes(`DetermineComponentFrameRoot`);)i++;if(r===c.length||i===l.length)for(r=c.length-1,i=l.length-1;1<=r&&0<=i&&c[r]!==l[i];)i--;for(;1<=r&&0<=i;r--,i--)if(c[r]!==l[i]){if(r!==1||i!==1)do if(r--,i--,0>i||c[r]!==l[i]){var u=`
`+c[r].replace(` at new `,` at `);return e.displayName&&u.includes(`<anonymous>`)&&(u=u.replace(`<anonymous>`,e.displayName)),u}while(1<=r&&0<=i);break}}}finally{de=!1,Error.prepareStackTrace=n}return(n=e?e.displayName||e.name:``)?ue(n):``}function pe(e,t){switch(e.tag){case 26:case 27:case 5:return ue(e.type);case 16:return ue(`Lazy`);case 13:return e.child!==t&&t!==null?ue(`Suspense Fallback`):ue(`Suspense`);case 19:return ue(`SuspenseList`);case 0:case 15:return fe(e.type,!1);case 11:return fe(e.type.render,!1);case 1:return fe(e.type,!0);case 31:return ue(`Activity`);default:return``}}function me(e){try{var t=``,n=null;do t+=pe(e,n),n=e,e=e.return;while(e);return t}catch(e){return`
Error generating stack: `+e.message+`
`+e.stack}}var he=Object.prototype.hasOwnProperty,ge=t.unstable_scheduleCallback,_e=t.unstable_cancelCallback,ve=t.unstable_shouldYield,ye=t.unstable_requestPaint,be=t.unstable_now,xe=t.unstable_getCurrentPriorityLevel,Se=t.unstable_ImmediatePriority,Ce=t.unstable_UserBlockingPriority,we=t.unstable_NormalPriority,Te=t.unstable_LowPriority,Ee=t.unstable_IdlePriority,De=t.log,Oe=t.unstable_setDisableYieldValue,ke=null,Ae=null;function je(e){if(typeof De==`function`&&Oe(e),Ae&&typeof Ae.setStrictMode==`function`)try{Ae.setStrictMode(ke,e)}catch{}}var Me=Math.clz32?Math.clz32:Fe,Ne=Math.log,Pe=Math.LN2;function Fe(e){return e>>>=0,e===0?32:31-(Ne(e)/Pe|0)|0}var Ie=256,Le=262144,Re=4194304;function ze(e){var t=e&42;if(t!==0)return t;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&261888;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function Be(e,t,n){var r=e.pendingLanes;if(r===0)return 0;var i=0,a=e.suspendedLanes,o=e.pingedLanes;e=e.warmLanes;var s=r&134217727;return s===0?(s=r&~a,s===0?o===0?n||(n=r&~e,n!==0&&(i=ze(n))):i=ze(o):i=ze(s)):(r=s&~a,r===0?(o&=s,o===0?n||(n=s&~e,n!==0&&(i=ze(n))):i=ze(o)):i=ze(r)),i===0?0:t!==0&&t!==i&&(t&a)===0&&(a=i&-i,n=t&-t,a>=n||a===32&&n&4194048)?t:i}function Ve(e,t){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&t)===0}function He(e,t){switch(e){case 1:case 2:case 4:case 8:case 64:return t+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Ue(){var e=Re;return Re<<=1,!(Re&62914560)&&(Re=4194304),e}function We(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function Ge(e,t){e.pendingLanes|=t,t!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function W(e,t,n,r,i,a){var o=e.pendingLanes;e.pendingLanes=n,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=n,e.entangledLanes&=n,e.errorRecoveryDisabledLanes&=n,e.shellSuspendCounter=0;var s=e.entanglements,c=e.expirationTimes,l=e.hiddenUpdates;for(n=o&~n;0<n;){var u=31-Me(n),d=1<<u;s[u]=0,c[u]=-1;var f=l[u];if(f!==null)for(l[u]=null,u=0;u<f.length;u++){var p=f[u];p!==null&&(p.lane&=-536870913)}n&=~d}r!==0&&Ke(e,r,0),a!==0&&i===0&&e.tag!==0&&(e.suspendedLanes|=a&~(o&~t))}function Ke(e,t,n){e.pendingLanes|=t,e.suspendedLanes&=~t;var r=31-Me(t);e.entangledLanes|=t,e.entanglements[r]=e.entanglements[r]|1073741824|n&261930}function qe(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-Me(n),i=1<<r;i&t|e[r]&t&&(e[r]|=t),n&=~i}}function Je(e,t){var n=t&-t;return n=n&42?1:Ye(n),(n&(e.suspendedLanes|t))===0?n:0}function Ye(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function Xe(e){return e&=-e,2<e?8<e?e&134217727?32:268435456:8:2}function Ze(){var e=L.p;return e===0?(e=window.event,e===void 0?32:mp(e.type)):e}function Qe(e,t){var n=L.p;try{return L.p=e,t()}finally{L.p=n}}var $e=Math.random().toString(36).slice(2),et=`__reactFiber$`+$e,tt=`__reactProps$`+$e,nt=`__reactContainer$`+$e,rt=`__reactEvents$`+$e,it=`__reactListeners$`+$e,at=`__reactHandles$`+$e,ot=`__reactResources$`+$e,st=`__reactMarker$`+$e;function ct(e){delete e[et],delete e[tt],delete e[rt],delete e[it],delete e[at]}function lt(e){var t=e[et];if(t)return t;for(var n=e.parentNode;n;){if(t=n[nt]||n[et]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=df(e);e!==null;){if(n=e[et])return n;e=df(e)}return t}e=n,n=e.parentNode}return null}function ut(e){if(e=e[et]||e[nt]){var t=e.tag;if(t===5||t===6||t===13||t===31||t===26||t===27||t===3)return e}return null}function dt(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e.stateNode;throw Error(i(33))}function ft(e){var t=e[ot];return t||=e[ot]={hoistableStyles:new Map,hoistableScripts:new Map},t}function G(e){e[st]=!0}var pt=new Set,mt={};function ht(e,t){gt(e,t),gt(e+`Capture`,t)}function gt(e,t){for(mt[e]=t,e=0;e<t.length;e++)pt.add(t[e])}var _t=RegExp(`^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$`),vt={},yt={};function bt(e){return he.call(yt,e)?!0:he.call(vt,e)?!1:_t.test(e)?yt[e]=!0:(vt[e]=!0,!1)}function xt(e,t,n){if(bt(t))if(n===null)e.removeAttribute(t);else{switch(typeof n){case`undefined`:case`function`:case`symbol`:e.removeAttribute(t);return;case`boolean`:var r=t.toLowerCase().slice(0,5);if(r!==`data-`&&r!==`aria-`){e.removeAttribute(t);return}}e.setAttribute(t,``+n)}}function St(e,t,n){if(n===null)e.removeAttribute(t);else{switch(typeof n){case`undefined`:case`function`:case`symbol`:case`boolean`:e.removeAttribute(t);return}e.setAttribute(t,``+n)}}function Ct(e,t,n,r){if(r===null)e.removeAttribute(n);else{switch(typeof r){case`undefined`:case`function`:case`symbol`:case`boolean`:e.removeAttribute(n);return}e.setAttributeNS(t,n,``+r)}}function wt(e){switch(typeof e){case`bigint`:case`boolean`:case`number`:case`string`:case`undefined`:return e;case`object`:return e;default:return``}}function Tt(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()===`input`&&(t===`checkbox`||t===`radio`)}function Et(e,t,n){var r=Object.getOwnPropertyDescriptor(e.constructor.prototype,t);if(!e.hasOwnProperty(t)&&r!==void 0&&typeof r.get==`function`&&typeof r.set==`function`){var i=r.get,a=r.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return i.call(this)},set:function(e){n=``+e,a.call(this,e)}}),Object.defineProperty(e,t,{enumerable:r.enumerable}),{getValue:function(){return n},setValue:function(e){n=``+e},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Dt(e){if(!e._valueTracker){var t=Tt(e)?`checked`:`value`;e._valueTracker=Et(e,t,``+e[t])}}function Ot(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r=``;return e&&(r=Tt(e)?e.checked?`true`:`false`:e.value),e=r,e===n?!1:(t.setValue(e),!0)}function kt(e){if(e||=typeof document<`u`?document:void 0,e===void 0)return null;try{return e.activeElement||e.body}catch{return e.body}}var At=/[\n"\\]/g;function jt(e){return e.replace(At,function(e){return`\\`+e.charCodeAt(0).toString(16)+` `})}function Mt(e,t,n,r,i,a,o,s){e.name=``,o!=null&&typeof o!=`function`&&typeof o!=`symbol`&&typeof o!=`boolean`?e.type=o:e.removeAttribute(`type`),t==null?o!==`submit`&&o!==`reset`||e.removeAttribute(`value`):o===`number`?(t===0&&e.value===``||e.value!=t)&&(e.value=``+wt(t)):e.value!==``+wt(t)&&(e.value=``+wt(t)),t==null?n==null?r!=null&&e.removeAttribute(`value`):Pt(e,o,wt(n)):Pt(e,o,wt(t)),i==null&&a!=null&&(e.defaultChecked=!!a),i!=null&&(e.checked=i&&typeof i!=`function`&&typeof i!=`symbol`),s!=null&&typeof s!=`function`&&typeof s!=`symbol`&&typeof s!=`boolean`?e.name=``+wt(s):e.removeAttribute(`name`)}function Nt(e,t,n,r,i,a,o,s){if(a!=null&&typeof a!=`function`&&typeof a!=`symbol`&&typeof a!=`boolean`&&(e.type=a),t!=null||n!=null){if(!(a!==`submit`&&a!==`reset`||t!=null)){Dt(e);return}n=n==null?``:``+wt(n),t=t==null?n:``+wt(t),s||t===e.value||(e.value=t),e.defaultValue=t}r??=i,r=typeof r!=`function`&&typeof r!=`symbol`&&!!r,e.checked=s?e.checked:!!r,e.defaultChecked=!!r,o!=null&&typeof o!=`function`&&typeof o!=`symbol`&&typeof o!=`boolean`&&(e.name=o),Dt(e)}function Pt(e,t,n){t===`number`&&kt(e.ownerDocument)===e||e.defaultValue===``+n||(e.defaultValue=``+n)}function Ft(e,t,n,r){if(e=e.options,t){t={};for(var i=0;i<n.length;i++)t[`$`+n[i]]=!0;for(n=0;n<e.length;n++)i=t.hasOwnProperty(`$`+e[n].value),e[n].selected!==i&&(e[n].selected=i),i&&r&&(e[n].defaultSelected=!0)}else{for(n=``+wt(n),t=null,i=0;i<e.length;i++){if(e[i].value===n){e[i].selected=!0,r&&(e[i].defaultSelected=!0);return}t!==null||e[i].disabled||(t=e[i])}t!==null&&(t.selected=!0)}}function It(e,t,n){if(t!=null&&(t=``+wt(t),t!==e.value&&(e.value=t),n==null)){e.defaultValue!==t&&(e.defaultValue=t);return}e.defaultValue=n==null?``:``+wt(n)}function Lt(e,t,n,r){if(t==null){if(r!=null){if(n!=null)throw Error(i(92));if(F(r)){if(1<r.length)throw Error(i(93));r=r[0]}n=r}n??=``,t=n}n=wt(t),e.defaultValue=n,r=e.textContent,r===n&&r!==``&&r!==null&&(e.value=r),Dt(e)}function Rt(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var zt=new Set(`animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp`.split(` `));function Bt(e,t,n){var r=t.indexOf(`--`)===0;n==null||typeof n==`boolean`||n===``?r?e.setProperty(t,``):t===`float`?e.cssFloat=``:e[t]=``:r?e.setProperty(t,n):typeof n!=`number`||n===0||zt.has(t)?t===`float`?e.cssFloat=n:e[t]=(``+n).trim():e[t]=n+`px`}function Vt(e,t,n){if(t!=null&&typeof t!=`object`)throw Error(i(62));if(e=e.style,n!=null){for(var r in n)!n.hasOwnProperty(r)||t!=null&&t.hasOwnProperty(r)||(r.indexOf(`--`)===0?e.setProperty(r,``):r===`float`?e.cssFloat=``:e[r]=``);for(var a in t)r=t[a],t.hasOwnProperty(a)&&n[a]!==r&&Bt(e,a,r)}else for(var o in t)t.hasOwnProperty(o)&&Bt(e,o,t[o])}function Ht(e){if(e.indexOf(`-`)===-1)return!1;switch(e){case`annotation-xml`:case`color-profile`:case`font-face`:case`font-face-src`:case`font-face-uri`:case`font-face-format`:case`font-face-name`:case`missing-glyph`:return!1;default:return!0}}var Ut=new Map([[`acceptCharset`,`accept-charset`],[`htmlFor`,`for`],[`httpEquiv`,`http-equiv`],[`crossOrigin`,`crossorigin`],[`accentHeight`,`accent-height`],[`alignmentBaseline`,`alignment-baseline`],[`arabicForm`,`arabic-form`],[`baselineShift`,`baseline-shift`],[`capHeight`,`cap-height`],[`clipPath`,`clip-path`],[`clipRule`,`clip-rule`],[`colorInterpolation`,`color-interpolation`],[`colorInterpolationFilters`,`color-interpolation-filters`],[`colorProfile`,`color-profile`],[`colorRendering`,`color-rendering`],[`dominantBaseline`,`dominant-baseline`],[`enableBackground`,`enable-background`],[`fillOpacity`,`fill-opacity`],[`fillRule`,`fill-rule`],[`floodColor`,`flood-color`],[`floodOpacity`,`flood-opacity`],[`fontFamily`,`font-family`],[`fontSize`,`font-size`],[`fontSizeAdjust`,`font-size-adjust`],[`fontStretch`,`font-stretch`],[`fontStyle`,`font-style`],[`fontVariant`,`font-variant`],[`fontWeight`,`font-weight`],[`glyphName`,`glyph-name`],[`glyphOrientationHorizontal`,`glyph-orientation-horizontal`],[`glyphOrientationVertical`,`glyph-orientation-vertical`],[`horizAdvX`,`horiz-adv-x`],[`horizOriginX`,`horiz-origin-x`],[`imageRendering`,`image-rendering`],[`letterSpacing`,`letter-spacing`],[`lightingColor`,`lighting-color`],[`markerEnd`,`marker-end`],[`markerMid`,`marker-mid`],[`markerStart`,`marker-start`],[`overlinePosition`,`overline-position`],[`overlineThickness`,`overline-thickness`],[`paintOrder`,`paint-order`],[`panose-1`,`panose-1`],[`pointerEvents`,`pointer-events`],[`renderingIntent`,`rendering-intent`],[`shapeRendering`,`shape-rendering`],[`stopColor`,`stop-color`],[`stopOpacity`,`stop-opacity`],[`strikethroughPosition`,`strikethrough-position`],[`strikethroughThickness`,`strikethrough-thickness`],[`strokeDasharray`,`stroke-dasharray`],[`strokeDashoffset`,`stroke-dashoffset`],[`strokeLinecap`,`stroke-linecap`],[`strokeLinejoin`,`stroke-linejoin`],[`strokeMiterlimit`,`stroke-miterlimit`],[`strokeOpacity`,`stroke-opacity`],[`strokeWidth`,`stroke-width`],[`textAnchor`,`text-anchor`],[`textDecoration`,`text-decoration`],[`textRendering`,`text-rendering`],[`transformOrigin`,`transform-origin`],[`underlinePosition`,`underline-position`],[`underlineThickness`,`underline-thickness`],[`unicodeBidi`,`unicode-bidi`],[`unicodeRange`,`unicode-range`],[`unitsPerEm`,`units-per-em`],[`vAlphabetic`,`v-alphabetic`],[`vHanging`,`v-hanging`],[`vIdeographic`,`v-ideographic`],[`vMathematical`,`v-mathematical`],[`vectorEffect`,`vector-effect`],[`vertAdvY`,`vert-adv-y`],[`vertOriginX`,`vert-origin-x`],[`vertOriginY`,`vert-origin-y`],[`wordSpacing`,`word-spacing`],[`writingMode`,`writing-mode`],[`xmlnsXlink`,`xmlns:xlink`],[`xHeight`,`x-height`]]),Wt=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function Gt(e){return Wt.test(``+e)?`javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')`:e}function Kt(){}var qt=null;function Jt(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Yt=null,Xt=null;function Zt(e){var t=ut(e);if(t&&(e=t.stateNode)){var n=e[tt]||null;a:switch(e=t.stateNode,t.type){case`input`:if(Mt(e,n.value,n.defaultValue,n.defaultValue,n.checked,n.defaultChecked,n.type,n.name),t=n.name,n.type===`radio`&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll(`input[name="`+jt(``+t)+`"][type="radio"]`),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var a=r[tt]||null;if(!a)throw Error(i(90));Mt(r,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name)}}for(t=0;t<n.length;t++)r=n[t],r.form===e.form&&Ot(r)}break a;case`textarea`:It(e,n.value,n.defaultValue);break a;case`select`:t=n.value,t!=null&&Ft(e,!!n.multiple,t,!1)}}}var Qt=!1;function $t(e,t,n){if(Qt)return e(t,n);Qt=!0;try{return e(t)}finally{if(Qt=!1,(Yt!==null||Xt!==null)&&(vu(),Yt&&(t=Yt,e=Xt,Xt=Yt=null,Zt(t),e)))for(t=0;t<e.length;t++)Zt(e[t])}}function en(e,t){var n=e.stateNode;if(n===null)return null;var r=n[tt]||null;if(r===null)return null;n=r[t];a:switch(t){case`onClick`:case`onClickCapture`:case`onDoubleClick`:case`onDoubleClickCapture`:case`onMouseDown`:case`onMouseDownCapture`:case`onMouseMove`:case`onMouseMoveCapture`:case`onMouseUp`:case`onMouseUpCapture`:case`onMouseEnter`:(r=!r.disabled)||(e=e.type,r=!(e===`button`||e===`input`||e===`select`||e===`textarea`)),e=!r;break a;default:e=!1}if(e)return null;if(n&&typeof n!=`function`)throw Error(i(231,t,typeof n));return n}var tn=!(typeof window>`u`||window.document===void 0||window.document.createElement===void 0),nn=!1;if(tn)try{var rn={};Object.defineProperty(rn,"passive",{get:function(){nn=!0}}),window.addEventListener(`test`,rn,rn),window.removeEventListener(`test`,rn,rn)}catch{nn=!1}var an=null,on=null,sn=null;function cn(){if(sn)return sn;var e,t=on,n=t.length,r,i=`value`in an?an.value:an.textContent,a=i.length;for(e=0;e<n&&t[e]===i[e];e++);var o=n-e;for(r=1;r<=o&&t[n-r]===i[a-r];r++);return sn=i.slice(e,1<r?1-r:void 0)}function ln(e){var t=e.keyCode;return`charCode`in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function un(){return!0}function dn(){return!1}function fn(e){function t(t,n,r,i,a){for(var o in this._reactName=t,this._targetInst=r,this.type=n,this.nativeEvent=i,this.target=a,this.currentTarget=null,e)e.hasOwnProperty(o)&&(t=e[o],this[o]=t?t(i):i[o]);return this.isDefaultPrevented=(i.defaultPrevented==null?!1===i.returnValue:i.defaultPrevented)?un:dn,this.isPropagationStopped=dn,this}return m(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var e=this.nativeEvent;e&&(e.preventDefault?e.preventDefault():typeof e.returnValue!=`unknown`&&(e.returnValue=!1),this.isDefaultPrevented=un)},stopPropagation:function(){var e=this.nativeEvent;e&&(e.stopPropagation?e.stopPropagation():typeof e.cancelBubble!=`unknown`&&(e.cancelBubble=!0),this.isPropagationStopped=un)},persist:function(){},isPersistent:un}),t}var pn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},mn=fn(pn),hn=m({},pn,{view:0,detail:0}),gn=fn(hn),_n,vn,yn,bn=m({},hn,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:jn,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return`movementX`in e?e.movementX:(e!==yn&&(yn&&e.type===`mousemove`?(_n=e.screenX-yn.screenX,vn=e.screenY-yn.screenY):vn=_n=0,yn=e),_n)},movementY:function(e){return`movementY`in e?e.movementY:vn}}),xn=fn(bn),Sn=fn(m({},bn,{dataTransfer:0})),Cn=fn(m({},hn,{relatedTarget:0})),wn=fn(m({},pn,{animationName:0,elapsedTime:0,pseudoElement:0})),Tn=fn(m({},pn,{clipboardData:function(e){return`clipboardData`in e?e.clipboardData:window.clipboardData}})),En=fn(m({},pn,{data:0})),Dn={Esc:`Escape`,Spacebar:` `,Left:`ArrowLeft`,Up:`ArrowUp`,Right:`ArrowRight`,Down:`ArrowDown`,Del:`Delete`,Win:`OS`,Menu:`ContextMenu`,Apps:`ContextMenu`,Scroll:`ScrollLock`,MozPrintableKey:`Unidentified`},On={8:`Backspace`,9:`Tab`,12:`Clear`,13:`Enter`,16:`Shift`,17:`Control`,18:`Alt`,19:`Pause`,20:`CapsLock`,27:`Escape`,32:` `,33:`PageUp`,34:`PageDown`,35:`End`,36:`Home`,37:`ArrowLeft`,38:`ArrowUp`,39:`ArrowRight`,40:`ArrowDown`,45:`Insert`,46:`Delete`,112:`F1`,113:`F2`,114:`F3`,115:`F4`,116:`F5`,117:`F6`,118:`F7`,119:`F8`,120:`F9`,121:`F10`,122:`F11`,123:`F12`,144:`NumLock`,145:`ScrollLock`,224:`Meta`},kn={Alt:`altKey`,Control:`ctrlKey`,Meta:`metaKey`,Shift:`shiftKey`};function An(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=kn[e])?!!t[e]:!1}function jn(){return An}var Mn=fn(m({},hn,{key:function(e){if(e.key){var t=Dn[e.key]||e.key;if(t!==`Unidentified`)return t}return e.type===`keypress`?(e=ln(e),e===13?`Enter`:String.fromCharCode(e)):e.type===`keydown`||e.type===`keyup`?On[e.keyCode]||`Unidentified`:``},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:jn,charCode:function(e){return e.type===`keypress`?ln(e):0},keyCode:function(e){return e.type===`keydown`||e.type===`keyup`?e.keyCode:0},which:function(e){return e.type===`keypress`?ln(e):e.type===`keydown`||e.type===`keyup`?e.keyCode:0}})),Nn=fn(m({},bn,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0})),Pn=fn(m({},hn,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:jn})),Fn=fn(m({},pn,{propertyName:0,elapsedTime:0,pseudoElement:0})),In=fn(m({},bn,{deltaX:function(e){return`deltaX`in e?e.deltaX:`wheelDeltaX`in e?-e.wheelDeltaX:0},deltaY:function(e){return`deltaY`in e?e.deltaY:`wheelDeltaY`in e?-e.wheelDeltaY:`wheelDelta`in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0})),Ln=fn(m({},pn,{newState:0,oldState:0})),Rn=[9,13,27,32],zn=tn&&`CompositionEvent`in window,Bn=null;tn&&`documentMode`in document&&(Bn=document.documentMode);var Vn=tn&&`TextEvent`in window&&!Bn,Hn=tn&&(!zn||Bn&&8<Bn&&11>=Bn),Un=` `,Wn=!1;function Gn(e,t){switch(e){case`keyup`:return Rn.indexOf(t.keyCode)!==-1;case`keydown`:return t.keyCode!==229;case`keypress`:case`mousedown`:case`focusout`:return!0;default:return!1}}function Kn(e){return e=e.detail,typeof e==`object`&&`data`in e?e.data:null}var qn=!1;function Jn(e,t){switch(e){case`compositionend`:return Kn(t);case`keypress`:return t.which===32?(Wn=!0,Un):null;case`textInput`:return e=t.data,e===Un&&Wn?null:e;default:return null}}function Yn(e,t){if(qn)return e===`compositionend`||!zn&&Gn(e,t)?(e=cn(),sn=on=an=null,qn=!1,e):null;switch(e){case`paste`:return null;case`keypress`:if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case`compositionend`:return Hn&&t.locale!==`ko`?null:t.data;default:return null}}var Xn={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Zn(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t===`input`?!!Xn[e.type]:t===`textarea`}function Qn(e,t,n,r){Yt?Xt?Xt.push(r):Xt=[r]:Yt=r,t=Td(t,`onChange`),0<t.length&&(n=new mn(`onChange`,`change`,null,n,r),e.push({event:n,listeners:t}))}var K=null,$n=null;function q(e){vd(e,0)}function er(e){if(Ot(dt(e)))return e}function tr(e,t){if(e===`change`)return t}var nr=!1;if(tn){var rr;if(tn){var ir=`oninput`in document;if(!ir){var ar=document.createElement(`div`);ar.setAttribute(`oninput`,`return;`),ir=typeof ar.oninput==`function`}rr=ir}else rr=!1;nr=rr&&(!document.documentMode||9<document.documentMode)}function or(){K&&(K.detachEvent(`onpropertychange`,sr),$n=K=null)}function sr(e){if(e.propertyName===`value`&&er($n)){var t=[];Qn(t,$n,e,Jt(e)),$t(q,t)}}function cr(e,t,n){e===`focusin`?(or(),K=t,$n=n,K.attachEvent(`onpropertychange`,sr)):e===`focusout`&&or()}function lr(e){if(e===`selectionchange`||e===`keyup`||e===`keydown`)return er($n)}function ur(e,t){if(e===`click`)return er(t)}function dr(e,t){if(e===`input`||e===`change`)return er(t)}function fr(e,t){return e===t&&(e!==0||1/e==1/t)||e!==e&&t!==t}var pr=typeof Object.is==`function`?Object.is:fr;function mr(e,t){if(pr(e,t))return!0;if(typeof e!=`object`||!e||typeof t!=`object`||!t)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var i=n[r];if(!he.call(t,i)||!pr(e[i],t[i]))return!1}return!0}function hr(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function gr(e,t){var n=hr(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}a:{for(;n;){if(n.nextSibling){n=n.nextSibling;break a}n=n.parentNode}n=void 0}n=hr(n)}}function _r(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?_r(e,t.parentNode):`contains`in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function vr(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var t=kt(e.document);t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href==`string`}catch{n=!1}if(n)e=t.contentWindow;else break;t=kt(e.document)}return t}function yr(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t===`input`&&(e.type===`text`||e.type===`search`||e.type===`tel`||e.type===`url`||e.type===`password`)||t===`textarea`||e.contentEditable===`true`)}var br=tn&&`documentMode`in document&&11>=document.documentMode,xr=null,Sr=null,Cr=null,wr=!1;function Tr(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;wr||xr==null||xr!==kt(r)||(r=xr,`selectionStart`in r&&yr(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),Cr&&mr(Cr,r)||(Cr=r,r=Td(Sr,`onSelect`),0<r.length&&(t=new mn(`onSelect`,`select`,null,t,n),e.push({event:t,listeners:r}),t.target=xr)))}function Er(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n[`Webkit`+e]=`webkit`+t,n[`Moz`+e]=`moz`+t,n}var Dr={animationend:Er(`Animation`,`AnimationEnd`),animationiteration:Er(`Animation`,`AnimationIteration`),animationstart:Er(`Animation`,`AnimationStart`),transitionrun:Er(`Transition`,`TransitionRun`),transitionstart:Er(`Transition`,`TransitionStart`),transitioncancel:Er(`Transition`,`TransitionCancel`),transitionend:Er(`Transition`,`TransitionEnd`)},Or={},kr={};tn&&(kr=document.createElement(`div`).style,`AnimationEvent`in window||(delete Dr.animationend.animation,delete Dr.animationiteration.animation,delete Dr.animationstart.animation),`TransitionEvent`in window||delete Dr.transitionend.transition);function Ar(e){if(Or[e])return Or[e];if(!Dr[e])return e;var t=Dr[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in kr)return Or[e]=t[n];return e}var jr=Ar(`animationend`),Mr=Ar(`animationiteration`),Nr=Ar(`animationstart`),Pr=Ar(`transitionrun`),Fr=Ar(`transitionstart`),Ir=Ar(`transitioncancel`),Lr=Ar(`transitionend`),Rr=new Map,zr=`abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel`.split(` `);zr.push(`scrollEnd`);function Br(e,t){Rr.set(e,t),ht(t,[e])}var Vr=typeof reportError==`function`?reportError:function(e){if(typeof window==`object`&&typeof window.ErrorEvent==`function`){var t=new window.ErrorEvent(`error`,{bubbles:!0,cancelable:!0,message:typeof e==`object`&&e&&typeof e.message==`string`?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process==`object`&&typeof process.emit==`function`){process.emit(`uncaughtException`,e);return}console.error(e)},Hr=[],Ur=0,Wr=0;function Gr(){for(var e=Ur,t=Wr=Ur=0;t<e;){var n=Hr[t];Hr[t++]=null;var r=Hr[t];Hr[t++]=null;var i=Hr[t];Hr[t++]=null;var a=Hr[t];if(Hr[t++]=null,r!==null&&i!==null){var o=r.pending;o===null?i.next=i:(i.next=o.next,o.next=i),r.pending=i}a!==0&&Yr(n,i,a)}}function Kr(e,t,n,r){Hr[Ur++]=e,Hr[Ur++]=t,Hr[Ur++]=n,Hr[Ur++]=r,Wr|=r,e.lanes|=r,e=e.alternate,e!==null&&(e.lanes|=r)}function qr(e,t,n,r){return Kr(e,t,n,r),Xr(e)}function Jr(e,t){return Kr(e,null,null,t),Xr(e)}function Yr(e,t,n){e.lanes|=n;var r=e.alternate;r!==null&&(r.lanes|=n);for(var i=!1,a=e.return;a!==null;)a.childLanes|=n,r=a.alternate,r!==null&&(r.childLanes|=n),a.tag===22&&(e=a.stateNode,e===null||e._visibility&1||(i=!0)),e=a,a=a.return;return e.tag===3?(a=e.stateNode,i&&t!==null&&(i=31-Me(n),e=a.hiddenUpdates,r=e[i],r===null?e[i]=[t]:r.push(t),t.lane=n|536870912),a):null}function Xr(e){if(50<lu)throw lu=0,uu=null,Error(i(185));for(var t=e.return;t!==null;)e=t,t=e.return;return e.tag===3?e.stateNode:null}var Zr={};function Qr(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function $r(e,t,n,r){return new Qr(e,t,n,r)}function ei(e){return e=e.prototype,!(!e||!e.isReactComponent)}function ti(e,t){var n=e.alternate;return n===null?(n=$r(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&65011712,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n.refCleanup=e.refCleanup,n}function ni(e,t){e.flags&=65011714;var n=e.alternate;return n===null?(e.childLanes=0,e.lanes=t,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=n.childLanes,e.lanes=n.lanes,e.child=n.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=n.memoizedProps,e.memoizedState=n.memoizedState,e.updateQueue=n.updateQueue,e.type=n.type,t=n.dependencies,e.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),e}function ri(e,t,n,r,a,o){var s=0;if(r=e,typeof e==`function`)ei(e)&&(s=1);else if(typeof e==`string`)s=Uf(e,n,H.current)?26:e===`html`||e===`head`||e===`body`?27:5;else a:switch(e){case k:return e=$r(31,n,t,a),e.elementType=k,e.lanes=o,e;case y:return ii(n.children,a,o,t);case b:s=8,a|=24;break;case x:return e=$r(12,n,t,a|2),e.elementType=x,e.lanes=o,e;case T:return e=$r(13,n,t,a),e.elementType=T,e.lanes=o,e;case E:return e=$r(19,n,t,a),e.elementType=E,e.lanes=o,e;default:if(typeof e==`object`&&e)switch(e.$$typeof){case C:s=10;break a;case S:s=9;break a;case w:s=11;break a;case D:s=14;break a;case O:s=16,r=null;break a}s=29,n=Error(i(130,e===null?`null`:typeof e,``)),r=null}return t=$r(s,n,t,a),t.elementType=e,t.type=r,t.lanes=o,t}function ii(e,t,n,r){return e=$r(7,e,r,t),e.lanes=n,e}function ai(e,t,n){return e=$r(6,e,null,t),e.lanes=n,e}function oi(e){var t=$r(18,null,null,0);return t.stateNode=e,t}function si(e,t,n){return t=$r(4,e.children===null?[]:e.children,e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}var ci=new WeakMap;function li(e,t){if(typeof e==`object`&&e){var n=ci.get(e);return n===void 0?(t={value:e,source:t,stack:me(t)},ci.set(e,t),t):n}return{value:e,source:t,stack:me(t)}}var ui=[],di=0,fi=null,pi=0,mi=[],hi=0,gi=null,_i=1,vi=``;function yi(e,t){ui[di++]=pi,ui[di++]=fi,fi=e,pi=t}function bi(e,t,n){mi[hi++]=_i,mi[hi++]=vi,mi[hi++]=gi,gi=e;var r=_i;e=vi;var i=32-Me(r)-1;r&=~(1<<i),n+=1;var a=32-Me(t)+i;if(30<a){var o=i-i%5;a=(r&(1<<o)-1).toString(32),r>>=o,i-=o,_i=1<<32-Me(t)+i|n<<i|r,vi=a+e}else _i=1<<a|n<<i|r,vi=e}function xi(e){e.return!==null&&(yi(e,1),bi(e,1,0))}function Si(e){for(;e===fi;)fi=ui[--di],ui[di]=null,pi=ui[--di],ui[di]=null;for(;e===gi;)gi=mi[--hi],mi[hi]=null,vi=mi[--hi],mi[hi]=null,_i=mi[--hi],mi[hi]=null}function Ci(e,t){mi[hi++]=_i,mi[hi++]=vi,mi[hi++]=gi,_i=t.id,vi=t.overflow,gi=e}var wi=null,Ti=null,J=!1,Ei=null,Di=!1,Oi=Error(i(519));function ki(e){throw Fi(li(Error(i(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?`text`:`HTML`,``)),e)),Oi}function Ai(e){var t=e.stateNode,n=e.type,r=e.memoizedProps;switch(t[et]=e,t[tt]=r,n){case`dialog`:$(`cancel`,t),$(`close`,t);break;case`iframe`:case`object`:case`embed`:$(`load`,t);break;case`video`:case`audio`:for(n=0;n<gd.length;n++)$(gd[n],t);break;case`source`:$(`error`,t);break;case`img`:case`image`:case`link`:$(`error`,t),$(`load`,t);break;case`details`:$(`toggle`,t);break;case`input`:$(`invalid`,t),Nt(t,r.value,r.defaultValue,r.checked,r.defaultChecked,r.type,r.name,!0);break;case`select`:$(`invalid`,t);break;case`textarea`:$(`invalid`,t),Lt(t,r.value,r.defaultValue,r.children)}n=r.children,typeof n!=`string`&&typeof n!=`number`&&typeof n!=`bigint`||t.textContent===``+n||!0===r.suppressHydrationWarning||jd(t.textContent,n)?(r.popover!=null&&($(`beforetoggle`,t),$(`toggle`,t)),r.onScroll!=null&&$(`scroll`,t),r.onScrollEnd!=null&&$(`scrollend`,t),r.onClick!=null&&(t.onclick=Kt),t=!0):t=!1,t||ki(e,!0)}function ji(e){for(wi=e.return;wi;)switch(wi.tag){case 5:case 31:case 13:Di=!1;return;case 27:case 3:Di=!0;return;default:wi=wi.return}}function Mi(e){if(e!==wi)return!1;if(!J)return ji(e),J=!0,!1;var t=e.tag,n;if((n=t!==3&&t!==27)&&((n=t===5)&&(n=e.type,n=!(n!==`form`&&n!==`button`)||Ud(e.type,e.memoizedProps)),n=!n),n&&Ti&&ki(e),ji(e),t===13){if(e=e.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(i(317));Ti=uf(e)}else if(t===31){if(e=e.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(i(317));Ti=uf(e)}else t===27?(t=Ti,Zd(e.type)?(e=lf,lf=null,Ti=e):Ti=t):Ti=wi?cf(e.stateNode.nextSibling):null;return!0}function Ni(){Ti=wi=null,J=!1}function Pi(){var e=Ei;return e!==null&&(Yl===null?Yl=e:Yl.push.apply(Yl,e),Ei=null),e}function Fi(e){Ei===null?Ei=[e]:Ei.push(e)}var Ii=z(null),Li=null,Ri=null;function zi(e,t,n){V(Ii,t._currentValue),t._currentValue=n}function Bi(e){e._currentValue=Ii.current,B(Ii)}function Vi(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)===t?r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t):(e.childLanes|=t,r!==null&&(r.childLanes|=t)),e===n)break;e=e.return}}function Hi(e,t,n,r){var a=e.child;for(a!==null&&(a.return=e);a!==null;){var o=a.dependencies;if(o!==null){var s=a.child;o=o.firstContext;a:for(;o!==null;){var c=o;o=a;for(var l=0;l<t.length;l++)if(c.context===t[l]){o.lanes|=n,c=o.alternate,c!==null&&(c.lanes|=n),Vi(o.return,n,e),r||(s=null);break a}o=c.next}}else if(a.tag===18){if(s=a.return,s===null)throw Error(i(341));s.lanes|=n,o=s.alternate,o!==null&&(o.lanes|=n),Vi(s,n,e),s=null}else s=a.child;if(s!==null)s.return=a;else for(s=a;s!==null;){if(s===e){s=null;break}if(a=s.sibling,a!==null){a.return=s.return,s=a;break}s=s.return}a=s}}function Ui(e,t,n,r){e=null;for(var a=t,o=!1;a!==null;){if(!o){if(a.flags&524288)o=!0;else if(a.flags&262144)break}if(a.tag===10){var s=a.alternate;if(s===null)throw Error(i(387));if(s=s.memoizedProps,s!==null){var c=a.type;pr(a.pendingProps.value,s.value)||(e===null?e=[c]:e.push(c))}}else if(a===re.current){if(s=a.alternate,s===null)throw Error(i(387));s.memoizedState.memoizedState!==a.memoizedState.memoizedState&&(e===null?e=[Qf]:e.push(Qf))}a=a.return}e!==null&&Hi(t,e,n,r),t.flags|=262144}function Wi(e){for(e=e.firstContext;e!==null;){if(!pr(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function Gi(e){Li=e,Ri=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function Ki(e){return Ji(Li,e)}function qi(e,t){return Li===null&&Gi(e),Ji(e,t)}function Ji(e,t){var n=t._currentValue;if(t={context:t,memoizedValue:n,next:null},Ri===null){if(e===null)throw Error(i(308));Ri=t,e.dependencies={lanes:0,firstContext:t},e.flags|=524288}else Ri=Ri.next=t;return n}var Yi=typeof AbortController<`u`?AbortController:function(){var e=[],t=this.signal={aborted:!1,addEventListener:function(t,n){e.push(n)}};this.abort=function(){t.aborted=!0,e.forEach(function(e){return e()})}},Xi=t.unstable_scheduleCallback,Zi=t.unstable_NormalPriority,Qi={$$typeof:C,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function $i(){return{controller:new Yi,data:new Map,refCount:0}}function ea(e){e.refCount--,e.refCount===0&&Xi(Zi,function(){e.controller.abort()})}var ta=null,na=0,ra=0,ia=null;function aa(e,t){if(ta===null){var n=ta=[];na=0,ra=ud(),ia={status:`pending`,value:void 0,then:function(e){n.push(e)}}}return na++,t.then(oa,oa),t}function oa(){if(--na===0&&ta!==null){ia!==null&&(ia.status=`fulfilled`);var e=ta;ta=null,ra=0,ia=null;for(var t=0;t<e.length;t++)(0,e[t])()}}function sa(e,t){var n=[],r={status:`pending`,value:null,reason:null,then:function(e){n.push(e)}};return e.then(function(){r.status=`fulfilled`,r.value=t;for(var e=0;e<n.length;e++)(0,n[e])(t)},function(e){for(r.status=`rejected`,r.reason=e,e=0;e<n.length;e++)(0,n[e])(void 0)}),r}var ca=I.S;I.S=function(e,t){Ql=be(),typeof t==`object`&&t&&typeof t.then==`function`&&aa(e,t),ca!==null&&ca(e,t)};var la=z(null);function ua(){var e=la.current;return e===null?Fl.pooledCache:e}function da(e,t){t===null?V(la,la.current):V(la,t.pool)}function fa(){var e=ua();return e===null?null:{parent:Qi._currentValue,pool:e}}var pa=Error(i(460)),ma=Error(i(474)),ha=Error(i(542)),ga={then:function(){}};function _a(e){return e=e.status,e===`fulfilled`||e===`rejected`}function va(e,t,n){switch(n=e[n],n===void 0?e.push(t):n!==t&&(t.then(Kt,Kt),t=n),t.status){case`fulfilled`:return t.value;case`rejected`:throw e=t.reason,Sa(e),e;default:if(typeof t.status==`string`)t.then(Kt,Kt);else{if(e=Fl,e!==null&&100<e.shellSuspendCounter)throw Error(i(482));e=t,e.status=`pending`,e.then(function(e){if(t.status===`pending`){var n=t;n.status=`fulfilled`,n.value=e}},function(e){if(t.status===`pending`){var n=t;n.status=`rejected`,n.reason=e}})}switch(t.status){case`fulfilled`:return t.value;case`rejected`:throw e=t.reason,Sa(e),e}throw ba=t,pa}}function ya(e){try{var t=e._init;return t(e._payload)}catch(e){throw typeof e==`object`&&e&&typeof e.then==`function`?(ba=e,pa):e}}var ba=null;function xa(){if(ba===null)throw Error(i(459));var e=ba;return ba=null,e}function Sa(e){if(e===pa||e===ha)throw Error(i(483))}var Ca=null,wa=0;function Ta(e){var t=wa;return wa+=1,Ca===null&&(Ca=[]),va(Ca,e,t)}function Ea(e,t){t=t.props.ref,e.ref=t===void 0?null:t}function Da(e,t){throw t.$$typeof===g?Error(i(525)):(e=Object.prototype.toString.call(t),Error(i(31,e===`[object Object]`?`object with keys {`+Object.keys(t).join(`, `)+`}`:e)))}function Oa(e){function t(t,n){if(e){var r=t.deletions;r===null?(t.deletions=[n],t.flags|=16):r.push(n)}}function n(n,r){if(!e)return null;for(;r!==null;)t(n,r),r=r.sibling;return null}function r(e){for(var t=new Map;e!==null;)e.key===null?t.set(e.index,e):t.set(e.key,e),e=e.sibling;return t}function a(e,t){return e=ti(e,t),e.index=0,e.sibling=null,e}function o(t,n,r){return t.index=r,e?(r=t.alternate,r===null?(t.flags|=67108866,n):(r=r.index,r<n?(t.flags|=67108866,n):r)):(t.flags|=1048576,n)}function s(t){return e&&t.alternate===null&&(t.flags|=67108866),t}function c(e,t,n,r){return t===null||t.tag!==6?(t=ai(n,e.mode,r),t.return=e,t):(t=a(t,n),t.return=e,t)}function l(e,t,n,r){var i=n.type;return i===y?d(e,t,n.props.children,r,n.key):t!==null&&(t.elementType===i||typeof i==`object`&&i&&i.$$typeof===O&&ya(i)===t.type)?(t=a(t,n.props),Ea(t,n),t.return=e,t):(t=ri(n.type,n.key,n.props,null,e.mode,r),Ea(t,n),t.return=e,t)}function u(e,t,n,r){return t===null||t.tag!==4||t.stateNode.containerInfo!==n.containerInfo||t.stateNode.implementation!==n.implementation?(t=si(n,e.mode,r),t.return=e,t):(t=a(t,n.children||[]),t.return=e,t)}function d(e,t,n,r,i){return t===null||t.tag!==7?(t=ii(n,e.mode,r,i),t.return=e,t):(t=a(t,n),t.return=e,t)}function f(e,t,n){if(typeof t==`string`&&t!==``||typeof t==`number`||typeof t==`bigint`)return t=ai(``+t,e.mode,n),t.return=e,t;if(typeof t==`object`&&t){switch(t.$$typeof){case _:return n=ri(t.type,t.key,t.props,null,e.mode,n),Ea(n,t),n.return=e,n;case v:return t=si(t,e.mode,n),t.return=e,t;case O:return t=ya(t),f(e,t,n)}if(F(t)||M(t))return t=ii(t,e.mode,n,null),t.return=e,t;if(typeof t.then==`function`)return f(e,Ta(t),n);if(t.$$typeof===C)return f(e,qi(e,t),n);Da(e,t)}return null}function p(e,t,n,r){var i=t===null?null:t.key;if(typeof n==`string`&&n!==``||typeof n==`number`||typeof n==`bigint`)return i===null?c(e,t,``+n,r):null;if(typeof n==`object`&&n){switch(n.$$typeof){case _:return n.key===i?l(e,t,n,r):null;case v:return n.key===i?u(e,t,n,r):null;case O:return n=ya(n),p(e,t,n,r)}if(F(n)||M(n))return i===null?d(e,t,n,r,null):null;if(typeof n.then==`function`)return p(e,t,Ta(n),r);if(n.$$typeof===C)return p(e,t,qi(e,n),r);Da(e,n)}return null}function m(e,t,n,r,i){if(typeof r==`string`&&r!==``||typeof r==`number`||typeof r==`bigint`)return e=e.get(n)||null,c(t,e,``+r,i);if(typeof r==`object`&&r){switch(r.$$typeof){case _:return e=e.get(r.key===null?n:r.key)||null,l(t,e,r,i);case v:return e=e.get(r.key===null?n:r.key)||null,u(t,e,r,i);case O:return r=ya(r),m(e,t,n,r,i)}if(F(r)||M(r))return e=e.get(n)||null,d(t,e,r,i,null);if(typeof r.then==`function`)return m(e,t,n,Ta(r),i);if(r.$$typeof===C)return m(e,t,n,qi(t,r),i);Da(t,r)}return null}function h(i,a,s,c){for(var l=null,u=null,d=a,h=a=0,g=null;d!==null&&h<s.length;h++){d.index>h?(g=d,d=null):g=d.sibling;var _=p(i,d,s[h],c);if(_===null){d===null&&(d=g);break}e&&d&&_.alternate===null&&t(i,d),a=o(_,a,h),u===null?l=_:u.sibling=_,u=_,d=g}if(h===s.length)return n(i,d),J&&yi(i,h),l;if(d===null){for(;h<s.length;h++)d=f(i,s[h],c),d!==null&&(a=o(d,a,h),u===null?l=d:u.sibling=d,u=d);return J&&yi(i,h),l}for(d=r(d);h<s.length;h++)g=m(d,i,h,s[h],c),g!==null&&(e&&g.alternate!==null&&d.delete(g.key===null?h:g.key),a=o(g,a,h),u===null?l=g:u.sibling=g,u=g);return e&&d.forEach(function(e){return t(i,e)}),J&&yi(i,h),l}function g(a,s,c,l){if(c==null)throw Error(i(151));for(var u=null,d=null,h=s,g=s=0,_=null,v=c.next();h!==null&&!v.done;g++,v=c.next()){h.index>g?(_=h,h=null):_=h.sibling;var y=p(a,h,v.value,l);if(y===null){h===null&&(h=_);break}e&&h&&y.alternate===null&&t(a,h),s=o(y,s,g),d===null?u=y:d.sibling=y,d=y,h=_}if(v.done)return n(a,h),J&&yi(a,g),u;if(h===null){for(;!v.done;g++,v=c.next())v=f(a,v.value,l),v!==null&&(s=o(v,s,g),d===null?u=v:d.sibling=v,d=v);return J&&yi(a,g),u}for(h=r(h);!v.done;g++,v=c.next())v=m(h,a,g,v.value,l),v!==null&&(e&&v.alternate!==null&&h.delete(v.key===null?g:v.key),s=o(v,s,g),d===null?u=v:d.sibling=v,d=v);return e&&h.forEach(function(e){return t(a,e)}),J&&yi(a,g),u}function b(e,r,o,c){if(typeof o==`object`&&o&&o.type===y&&o.key===null&&(o=o.props.children),typeof o==`object`&&o){switch(o.$$typeof){case _:a:{for(var l=o.key;r!==null;){if(r.key===l){if(l=o.type,l===y){if(r.tag===7){n(e,r.sibling),c=a(r,o.props.children),c.return=e,e=c;break a}}else if(r.elementType===l||typeof l==`object`&&l&&l.$$typeof===O&&ya(l)===r.type){n(e,r.sibling),c=a(r,o.props),Ea(c,o),c.return=e,e=c;break a}n(e,r);break}else t(e,r);r=r.sibling}o.type===y?(c=ii(o.props.children,e.mode,c,o.key),c.return=e,e=c):(c=ri(o.type,o.key,o.props,null,e.mode,c),Ea(c,o),c.return=e,e=c)}return s(e);case v:a:{for(l=o.key;r!==null;){if(r.key===l)if(r.tag===4&&r.stateNode.containerInfo===o.containerInfo&&r.stateNode.implementation===o.implementation){n(e,r.sibling),c=a(r,o.children||[]),c.return=e,e=c;break a}else{n(e,r);break}else t(e,r);r=r.sibling}c=si(o,e.mode,c),c.return=e,e=c}return s(e);case O:return o=ya(o),b(e,r,o,c)}if(F(o))return h(e,r,o,c);if(M(o)){if(l=M(o),typeof l!=`function`)throw Error(i(150));return o=l.call(o),g(e,r,o,c)}if(typeof o.then==`function`)return b(e,r,Ta(o),c);if(o.$$typeof===C)return b(e,r,qi(e,o),c);Da(e,o)}return typeof o==`string`&&o!==``||typeof o==`number`||typeof o==`bigint`?(o=``+o,r!==null&&r.tag===6?(n(e,r.sibling),c=a(r,o),c.return=e,e=c):(n(e,r),c=ai(o,e.mode,c),c.return=e,e=c),s(e)):n(e,r)}return function(e,t,n,r){try{wa=0;var i=b(e,t,n,r);return Ca=null,i}catch(t){if(t===pa||t===ha)throw t;var a=$r(29,t,null,e.mode);return a.lanes=r,a.return=e,a}}}var ka=Oa(!0),Aa=Oa(!1),ja=!1;function Ma(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function Na(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function Pa(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function Fa(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,X&2){var i=r.pending;return i===null?t.next=t:(t.next=i.next,i.next=t),r.pending=t,t=Xr(e),Yr(e,null,n),t}return Kr(e,r,t,n),Xr(e)}function Ia(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,n&4194048)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,qe(e,n)}}function La(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var i=null,a=null;if(n=n.firstBaseUpdate,n!==null){do{var o={lane:n.lane,tag:n.tag,payload:n.payload,callback:null,next:null};a===null?i=a=o:a=a.next=o,n=n.next}while(n!==null);a===null?i=a=t:a=a.next=t}else i=a=t;n={baseState:r.baseState,firstBaseUpdate:i,lastBaseUpdate:a,shared:r.shared,callbacks:r.callbacks},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}var Ra=!1;function za(){if(Ra){var e=ia;if(e!==null)throw e}}function Ba(e,t,n,r){Ra=!1;var i=e.updateQueue;ja=!1;var a=i.firstBaseUpdate,o=i.lastBaseUpdate,s=i.shared.pending;if(s!==null){i.shared.pending=null;var c=s,l=c.next;c.next=null,o===null?a=l:o.next=l,o=c;var u=e.alternate;u!==null&&(u=u.updateQueue,s=u.lastBaseUpdate,s!==o&&(s===null?u.firstBaseUpdate=l:s.next=l,u.lastBaseUpdate=c))}if(a!==null){var d=i.baseState;o=0,u=l=c=null,s=a;do{var f=s.lane&-536870913,p=f!==s.lane;if(p?(Q&f)===f:(r&f)===f){f!==0&&f===ra&&(Ra=!0),u!==null&&(u=u.next={lane:0,tag:s.tag,payload:s.payload,callback:null,next:null});a:{var h=e,g=s;f=t;var _=n;switch(g.tag){case 1:if(h=g.payload,typeof h==`function`){d=h.call(_,d,f);break a}d=h;break a;case 3:h.flags=h.flags&-65537|128;case 0:if(h=g.payload,f=typeof h==`function`?h.call(_,d,f):h,f==null)break a;d=m({},d,f);break a;case 2:ja=!0}}f=s.callback,f!==null&&(e.flags|=64,p&&(e.flags|=8192),p=i.callbacks,p===null?i.callbacks=[f]:p.push(f))}else p={lane:f,tag:s.tag,payload:s.payload,callback:s.callback,next:null},u===null?(l=u=p,c=d):u=u.next=p,o|=f;if(s=s.next,s===null){if(s=i.shared.pending,s===null)break;p=s,s=p.next,p.next=null,i.lastBaseUpdate=p,i.shared.pending=null}}while(1);u===null&&(c=d),i.baseState=c,i.firstBaseUpdate=l,i.lastBaseUpdate=u,a===null&&(i.shared.lanes=0),Ul|=o,e.lanes=o,e.memoizedState=d}}function Va(e,t){if(typeof e!=`function`)throw Error(i(191,e));e.call(t)}function Ha(e,t){var n=e.callbacks;if(n!==null)for(e.callbacks=null,e=0;e<n.length;e++)Va(n[e],t)}var Ua=z(null),Wa=z(0);function Ga(e,t){e=Vl,V(Wa,e),V(Ua,t),Vl=e|t.baseLanes}function Ka(){V(Wa,Vl),V(Ua,Ua.current)}function qa(){Vl=Wa.current,B(Ua),B(Wa)}var Ja=z(null),Ya=null;function Xa(e){var t=e.alternate;V(to,to.current&1),V(Ja,e),Ya===null&&(t===null||Ua.current!==null||t.memoizedState!==null)&&(Ya=e)}function Za(e){V(to,to.current),V(Ja,e),Ya===null&&(Ya=e)}function Qa(e){e.tag===22?(V(to,to.current),V(Ja,e),Ya===null&&(Ya=e)):$a(e)}function $a(){V(to,to.current),V(Ja,Ja.current)}function eo(e){B(Ja),Ya===e&&(Ya=null),B(to)}var to=z(0);function no(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||af(n)||of(n)))return t}else if(t.tag===19&&(t.memoizedProps.revealOrder===`forwards`||t.memoizedProps.revealOrder===`backwards`||t.memoizedProps.revealOrder===`unstable_legacy-backwards`||t.memoizedProps.revealOrder===`together`)){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var ro=0,Y=null,io=null,ao=null,oo=!1,so=!1,co=!1,lo=0,uo=0,fo=null,po=0;function mo(){throw Error(i(321))}function ho(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!pr(e[n],t[n]))return!1;return!0}function go(e,t,n,r,i,a){return ro=a,Y=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,I.H=e===null||e.memoizedState===null?Ns:Ps,co=!1,a=n(r,i),co=!1,so&&(a=vo(t,n,r,i)),_o(e),a}function _o(e){I.H=Ms;var t=io!==null&&io.next!==null;if(ro=0,ao=io=Y=null,oo=!1,uo=0,fo=null,t)throw Error(i(300));e===null||Zs||(e=e.dependencies,e!==null&&Wi(e)&&(Zs=!0))}function vo(e,t,n,r){Y=e;var a=0;do{if(so&&(fo=null),uo=0,so=!1,25<=a)throw Error(i(301));if(a+=1,ao=io=null,e.updateQueue!=null){var o=e.updateQueue;o.lastEffect=null,o.events=null,o.stores=null,o.memoCache!=null&&(o.memoCache.index=0)}I.H=Fs,o=t(n,r)}while(so);return o}function yo(){var e=I.H,t=e.useState()[0];return t=typeof t.then==`function`?Eo(t):t,e=e.useState()[0],(io===null?null:io.memoizedState)!==e&&(Y.flags|=1024),t}function bo(){var e=lo!==0;return lo=0,e}function xo(e,t,n){t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~n}function So(e){if(oo){for(e=e.memoizedState;e!==null;){var t=e.queue;t!==null&&(t.pending=null),e=e.next}oo=!1}ro=0,ao=io=Y=null,so=!1,uo=lo=0,fo=null}function Co(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return ao===null?Y.memoizedState=ao=e:ao=ao.next=e,ao}function wo(){if(io===null){var e=Y.alternate;e=e===null?null:e.memoizedState}else e=io.next;var t=ao===null?Y.memoizedState:ao.next;if(t!==null)ao=t,io=e;else{if(e===null)throw Y.alternate===null?Error(i(467)):Error(i(310));io=e,e={memoizedState:io.memoizedState,baseState:io.baseState,baseQueue:io.baseQueue,queue:io.queue,next:null},ao===null?Y.memoizedState=ao=e:ao=ao.next=e}return ao}function To(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function Eo(e){var t=uo;return uo+=1,fo===null&&(fo=[]),e=va(fo,e,t),t=Y,(ao===null?t.memoizedState:ao.next)===null&&(t=t.alternate,I.H=t===null||t.memoizedState===null?Ns:Ps),e}function Do(e){if(typeof e==`object`&&e){if(typeof e.then==`function`)return Eo(e);if(e.$$typeof===C)return Ki(e)}throw Error(i(438,String(e)))}function Oo(e){var t=null,n=Y.updateQueue;if(n!==null&&(t=n.memoCache),t==null){var r=Y.alternate;r!==null&&(r=r.updateQueue,r!==null&&(r=r.memoCache,r!=null&&(t={data:r.data.map(function(e){return e.slice()}),index:0})))}if(t??={data:[],index:0},n===null&&(n=To(),Y.updateQueue=n),n.memoCache=t,n=t.data[t.index],n===void 0)for(n=t.data[t.index]=Array(e),r=0;r<e;r++)n[r]=A;return t.index++,n}function ko(e,t){return typeof t==`function`?t(e):t}function Ao(e){return jo(wo(),io,e)}function jo(e,t,n){var r=e.queue;if(r===null)throw Error(i(311));r.lastRenderedReducer=n;var a=e.baseQueue,o=r.pending;if(o!==null){if(a!==null){var s=a.next;a.next=o.next,o.next=s}t.baseQueue=a=o,r.pending=null}if(o=e.baseState,a===null)e.memoizedState=o;else{t=a.next;var c=s=null,l=null,u=t,d=!1;do{var f=u.lane&-536870913;if(f===u.lane?(ro&f)===f:(Q&f)===f){var p=u.revertLane;if(p===0)l!==null&&(l=l.next={lane:0,revertLane:0,gesture:null,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null}),f===ra&&(d=!0);else if((ro&p)===p){u=u.next,p===ra&&(d=!0);continue}else f={lane:0,revertLane:u.revertLane,gesture:null,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null},l===null?(c=l=f,s=o):l=l.next=f,Y.lanes|=p,Ul|=p;f=u.action,co&&n(o,f),o=u.hasEagerState?u.eagerState:n(o,f)}else p={lane:f,revertLane:u.revertLane,gesture:u.gesture,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null},l===null?(c=l=p,s=o):l=l.next=p,Y.lanes|=f,Ul|=f;u=u.next}while(u!==null&&u!==t);if(l===null?s=o:l.next=c,!pr(o,e.memoizedState)&&(Zs=!0,d&&(n=ia,n!==null)))throw n;e.memoizedState=o,e.baseState=s,e.baseQueue=l,r.lastRenderedState=o}return a===null&&(r.lanes=0),[e.memoizedState,r.dispatch]}function Mo(e){var t=wo(),n=t.queue;if(n===null)throw Error(i(311));n.lastRenderedReducer=e;var r=n.dispatch,a=n.pending,o=t.memoizedState;if(a!==null){n.pending=null;var s=a=a.next;do o=e(o,s.action),s=s.next;while(s!==a);pr(o,t.memoizedState)||(Zs=!0),t.memoizedState=o,t.baseQueue===null&&(t.baseState=o),n.lastRenderedState=o}return[o,r]}function No(e,t,n){var r=Y,a=wo(),o=J;if(o){if(n===void 0)throw Error(i(407));n=n()}else n=t();var s=!pr((io||a).memoizedState,n);if(s&&(a.memoizedState=n,Zs=!0),a=a.queue,is(Io.bind(null,r,a,e),[e]),a.getSnapshot!==t||s||ao!==null&&ao.memoizedState.tag&1){if(r.flags|=2048,$o(9,{destroy:void 0},Fo.bind(null,r,a,n,t),null),Fl===null)throw Error(i(349));o||ro&127||Po(r,t,n)}return n}function Po(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=Y.updateQueue,t===null?(t=To(),Y.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function Fo(e,t,n,r){t.value=n,t.getSnapshot=r,Lo(t)&&Ro(e)}function Io(e,t,n){return n(function(){Lo(t)&&Ro(e)})}function Lo(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!pr(e,n)}catch{return!0}}function Ro(e){var t=Jr(e,2);t!==null&&pu(t,e,2)}function zo(e){var t=Co();if(typeof e==`function`){var n=e;if(e=n(),co){je(!0);try{n()}finally{je(!1)}}}return t.memoizedState=t.baseState=e,t.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:ko,lastRenderedState:e},t}function Bo(e,t,n,r){return e.baseState=n,jo(e,io,typeof r==`function`?r:ko)}function Vo(e,t,n,r,a){if(ks(e))throw Error(i(485));if(e=t.action,e!==null){var o={payload:a,action:e,next:null,isTransition:!0,status:`pending`,value:null,reason:null,listeners:[],then:function(e){o.listeners.push(e)}};I.T===null?o.isTransition=!1:n(!0),r(o),n=t.pending,n===null?(o.next=t.pending=o,Ho(t,o)):(o.next=n.next,t.pending=n.next=o)}}function Ho(e,t){var n=t.action,r=t.payload,i=e.state;if(t.isTransition){var a=I.T,o={};I.T=o;try{var s=n(i,r),c=I.S;c!==null&&c(o,s),Uo(e,t,s)}catch(n){Go(e,t,n)}finally{a!==null&&o.types!==null&&(a.types=o.types),I.T=a}}else try{a=n(i,r),Uo(e,t,a)}catch(n){Go(e,t,n)}}function Uo(e,t,n){typeof n==`object`&&n&&typeof n.then==`function`?n.then(function(n){Wo(e,t,n)},function(n){return Go(e,t,n)}):Wo(e,t,n)}function Wo(e,t,n){t.status=`fulfilled`,t.value=n,Ko(t),e.state=n,t=e.pending,t!==null&&(n=t.next,n===t?e.pending=null:(n=n.next,t.next=n,Ho(e,n)))}function Go(e,t,n){var r=e.pending;if(e.pending=null,r!==null){r=r.next;do t.status=`rejected`,t.reason=n,Ko(t),t=t.next;while(t!==r)}e.action=null}function Ko(e){e=e.listeners;for(var t=0;t<e.length;t++)(0,e[t])()}function qo(e,t){return t}function Jo(e,t){if(J){var n=Fl.formState;if(n!==null){a:{var r=Y;if(J){if(Ti){b:{for(var i=Ti,a=Di;i.nodeType!==8;){if(!a){i=null;break b}if(i=cf(i.nextSibling),i===null){i=null;break b}}a=i.data,i=a===`F!`||a===`F`?i:null}if(i){Ti=cf(i.nextSibling),r=i.data===`F!`;break a}}ki(r)}r=!1}r&&(t=n[0])}}return n=Co(),n.memoizedState=n.baseState=t,r={pending:null,lanes:0,dispatch:null,lastRenderedReducer:qo,lastRenderedState:t},n.queue=r,n=Es.bind(null,Y,r),r.dispatch=n,r=zo(!1),a=Os.bind(null,Y,!1,r.queue),r=Co(),i={state:t,dispatch:null,action:e,pending:null},r.queue=i,n=Vo.bind(null,Y,i,a,n),i.dispatch=n,r.memoizedState=e,[t,n,!1]}function Yo(e){return Xo(wo(),io,e)}function Xo(e,t,n){if(t=jo(e,t,qo)[0],e=Ao(ko)[0],typeof t==`object`&&t&&typeof t.then==`function`)try{var r=Eo(t)}catch(e){throw e===pa?ha:e}else r=t;t=wo();var i=t.queue,a=i.dispatch;return n!==t.memoizedState&&(Y.flags|=2048,$o(9,{destroy:void 0},Zo.bind(null,i,n),null)),[r,a,e]}function Zo(e,t){e.action=t}function Qo(e){var t=wo(),n=io;if(n!==null)return Xo(t,n,e);wo(),t=t.memoizedState,n=wo();var r=n.queue.dispatch;return n.memoizedState=e,[t,r,!1]}function $o(e,t,n,r){return e={tag:e,create:n,deps:r,inst:t,next:null},t=Y.updateQueue,t===null&&(t=To(),Y.updateQueue=t),n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e),e}function es(){return wo().memoizedState}function ts(e,t,n,r){var i=Co();Y.flags|=e,i.memoizedState=$o(1|t,{destroy:void 0},n,r===void 0?null:r)}function ns(e,t,n,r){var i=wo();r=r===void 0?null:r;var a=i.memoizedState.inst;io!==null&&r!==null&&ho(r,io.memoizedState.deps)?i.memoizedState=$o(t,a,n,r):(Y.flags|=e,i.memoizedState=$o(1|t,a,n,r))}function rs(e,t){ts(8390656,8,e,t)}function is(e,t){ns(2048,8,e,t)}function as(e){Y.flags|=4;var t=Y.updateQueue;if(t===null)t=To(),Y.updateQueue=t,t.events=[e];else{var n=t.events;n===null?t.events=[e]:n.push(e)}}function os(e){var t=wo().memoizedState;return as({ref:t,nextImpl:e}),function(){if(X&2)throw Error(i(440));return t.impl.apply(void 0,arguments)}}function ss(e,t){return ns(4,2,e,t)}function cs(e,t){return ns(4,4,e,t)}function ls(e,t){if(typeof t==`function`){e=e();var n=t(e);return function(){typeof n==`function`?n():t(null)}}if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function us(e,t,n){n=n==null?null:n.concat([e]),ns(4,4,ls.bind(null,t,e),n)}function ds(){}function fs(e,t){var n=wo();t=t===void 0?null:t;var r=n.memoizedState;return t!==null&&ho(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function ps(e,t){var n=wo();t=t===void 0?null:t;var r=n.memoizedState;if(t!==null&&ho(t,r[1]))return r[0];if(r=e(),co){je(!0);try{e()}finally{je(!1)}}return n.memoizedState=[r,t],r}function ms(e,t,n){return n===void 0||ro&1073741824&&!(Q&261930)?e.memoizedState=t:(e.memoizedState=n,e=fu(),Y.lanes|=e,Ul|=e,n)}function hs(e,t,n,r){return pr(n,t)?n:Ua.current===null?!(ro&42)||ro&1073741824&&!(Q&261930)?(Zs=!0,e.memoizedState=n):(e=fu(),Y.lanes|=e,Ul|=e,t):(e=ms(e,n,r),pr(e,t)||(Zs=!0),e)}function gs(e,t,n,r,i){var a=L.p;L.p=a!==0&&8>a?a:8;var o=I.T,s={};I.T=s,Os(e,!1,t,n);try{var c=i(),l=I.S;l!==null&&l(s,c),typeof c==`object`&&c&&typeof c.then==`function`?Ds(e,t,sa(c,r),du(e)):Ds(e,t,r,du(e))}catch(n){Ds(e,t,{then:function(){},status:`rejected`,reason:n},du())}finally{L.p=a,o!==null&&s.types!==null&&(o.types=s.types),I.T=o}}function _s(){}function vs(e,t,n,r){if(e.tag!==5)throw Error(i(476));var a=ys(e).queue;gs(e,a,t,R,n===null?_s:function(){return bs(e),n(r)})}function ys(e){var t=e.memoizedState;if(t!==null)return t;t={memoizedState:R,baseState:R,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:ko,lastRenderedState:R},next:null};var n={};return t.next={memoizedState:n,baseState:n,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:ko,lastRenderedState:n},next:null},e.memoizedState=t,e=e.alternate,e!==null&&(e.memoizedState=t),t}function bs(e){var t=ys(e);t.next===null&&(t=e.alternate.memoizedState),Ds(e,t.next.queue,{},du())}function xs(){return Ki(Qf)}function Ss(){return wo().memoizedState}function Cs(){return wo().memoizedState}function ws(e){for(var t=e.return;t!==null;){switch(t.tag){case 24:case 3:var n=du();e=Pa(n);var r=Fa(t,e,n);r!==null&&(pu(r,t,n),Ia(r,t,n)),t={cache:$i()},e.payload=t;return}t=t.return}}function Ts(e,t,n){var r=du();n={lane:r,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null},ks(e)?As(t,n):(n=qr(e,t,n,r),n!==null&&(pu(n,e,r),js(n,t,r)))}function Es(e,t,n){Ds(e,t,n,du())}function Ds(e,t,n,r){var i={lane:r,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null};if(ks(e))As(t,i);else{var a=e.alternate;if(e.lanes===0&&(a===null||a.lanes===0)&&(a=t.lastRenderedReducer,a!==null))try{var o=t.lastRenderedState,s=a(o,n);if(i.hasEagerState=!0,i.eagerState=s,pr(s,o))return Kr(e,t,i,0),Fl===null&&Gr(),!1}catch{}if(n=qr(e,t,i,r),n!==null)return pu(n,e,r),js(n,t,r),!0}return!1}function Os(e,t,n,r){if(r={lane:2,revertLane:ud(),gesture:null,action:r,hasEagerState:!1,eagerState:null,next:null},ks(e)){if(t)throw Error(i(479))}else t=qr(e,n,r,2),t!==null&&pu(t,e,2)}function ks(e){var t=e.alternate;return e===Y||t!==null&&t===Y}function As(e,t){so=oo=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function js(e,t,n){if(n&4194048){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,qe(e,n)}}var Ms={readContext:Ki,use:Do,useCallback:mo,useContext:mo,useEffect:mo,useImperativeHandle:mo,useLayoutEffect:mo,useInsertionEffect:mo,useMemo:mo,useReducer:mo,useRef:mo,useState:mo,useDebugValue:mo,useDeferredValue:mo,useTransition:mo,useSyncExternalStore:mo,useId:mo,useHostTransitionStatus:mo,useFormState:mo,useActionState:mo,useOptimistic:mo,useMemoCache:mo,useCacheRefresh:mo};Ms.useEffectEvent=mo;var Ns={readContext:Ki,use:Do,useCallback:function(e,t){return Co().memoizedState=[e,t===void 0?null:t],e},useContext:Ki,useEffect:rs,useImperativeHandle:function(e,t,n){n=n==null?null:n.concat([e]),ts(4194308,4,ls.bind(null,t,e),n)},useLayoutEffect:function(e,t){return ts(4194308,4,e,t)},useInsertionEffect:function(e,t){ts(4,2,e,t)},useMemo:function(e,t){var n=Co();t=t===void 0?null:t;var r=e();if(co){je(!0);try{e()}finally{je(!1)}}return n.memoizedState=[r,t],r},useReducer:function(e,t,n){var r=Co();if(n!==void 0){var i=n(t);if(co){je(!0);try{n(t)}finally{je(!1)}}}else i=t;return r.memoizedState=r.baseState=i,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:i},r.queue=e,e=e.dispatch=Ts.bind(null,Y,e),[r.memoizedState,e]},useRef:function(e){var t=Co();return e={current:e},t.memoizedState=e},useState:function(e){e=zo(e);var t=e.queue,n=Es.bind(null,Y,t);return t.dispatch=n,[e.memoizedState,n]},useDebugValue:ds,useDeferredValue:function(e,t){return ms(Co(),e,t)},useTransition:function(){var e=zo(!1);return e=gs.bind(null,Y,e.queue,!0,!1),Co().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,t,n){var r=Y,a=Co();if(J){if(n===void 0)throw Error(i(407));n=n()}else{if(n=t(),Fl===null)throw Error(i(349));Q&127||Po(r,t,n)}a.memoizedState=n;var o={value:n,getSnapshot:t};return a.queue=o,rs(Io.bind(null,r,o,e),[e]),r.flags|=2048,$o(9,{destroy:void 0},Fo.bind(null,r,o,n,t),null),n},useId:function(){var e=Co(),t=Fl.identifierPrefix;if(J){var n=vi,r=_i;n=(r&~(1<<32-Me(r)-1)).toString(32)+n,t=`_`+t+`R_`+n,n=lo++,0<n&&(t+=`H`+n.toString(32)),t+=`_`}else n=po++,t=`_`+t+`r_`+n.toString(32)+`_`;return e.memoizedState=t},useHostTransitionStatus:xs,useFormState:Jo,useActionState:Jo,useOptimistic:function(e){var t=Co();t.memoizedState=t.baseState=e;var n={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return t.queue=n,t=Os.bind(null,Y,!0,n),n.dispatch=t,[e,t]},useMemoCache:Oo,useCacheRefresh:function(){return Co().memoizedState=ws.bind(null,Y)},useEffectEvent:function(e){var t=Co(),n={impl:e};return t.memoizedState=n,function(){if(X&2)throw Error(i(440));return n.impl.apply(void 0,arguments)}}},Ps={readContext:Ki,use:Do,useCallback:fs,useContext:Ki,useEffect:is,useImperativeHandle:us,useInsertionEffect:ss,useLayoutEffect:cs,useMemo:ps,useReducer:Ao,useRef:es,useState:function(){return Ao(ko)},useDebugValue:ds,useDeferredValue:function(e,t){return hs(wo(),io.memoizedState,e,t)},useTransition:function(){var e=Ao(ko)[0],t=wo().memoizedState;return[typeof e==`boolean`?e:Eo(e),t]},useSyncExternalStore:No,useId:Ss,useHostTransitionStatus:xs,useFormState:Yo,useActionState:Yo,useOptimistic:function(e,t){return Bo(wo(),io,e,t)},useMemoCache:Oo,useCacheRefresh:Cs};Ps.useEffectEvent=os;var Fs={readContext:Ki,use:Do,useCallback:fs,useContext:Ki,useEffect:is,useImperativeHandle:us,useInsertionEffect:ss,useLayoutEffect:cs,useMemo:ps,useReducer:Mo,useRef:es,useState:function(){return Mo(ko)},useDebugValue:ds,useDeferredValue:function(e,t){var n=wo();return io===null?ms(n,e,t):hs(n,io.memoizedState,e,t)},useTransition:function(){var e=Mo(ko)[0],t=wo().memoizedState;return[typeof e==`boolean`?e:Eo(e),t]},useSyncExternalStore:No,useId:Ss,useHostTransitionStatus:xs,useFormState:Qo,useActionState:Qo,useOptimistic:function(e,t){var n=wo();return io===null?(n.baseState=e,[e,n.queue.dispatch]):Bo(n,io,e,t)},useMemoCache:Oo,useCacheRefresh:Cs};Fs.useEffectEvent=os;function Is(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:m({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var Ls={enqueueSetState:function(e,t,n){e=e._reactInternals;var r=du(),i=Pa(r);i.payload=t,n!=null&&(i.callback=n),t=Fa(e,i,r),t!==null&&(pu(t,e,r),Ia(t,e,r))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=du(),i=Pa(r);i.tag=1,i.payload=t,n!=null&&(i.callback=n),t=Fa(e,i,r),t!==null&&(pu(t,e,r),Ia(t,e,r))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=du(),r=Pa(n);r.tag=2,t!=null&&(r.callback=t),t=Fa(e,r,n),t!==null&&(pu(t,e,n),Ia(t,e,n))}};function Rs(e,t,n,r,i,a,o){return e=e.stateNode,typeof e.shouldComponentUpdate==`function`?e.shouldComponentUpdate(r,a,o):t.prototype&&t.prototype.isPureReactComponent?!mr(n,r)||!mr(i,a):!0}function zs(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps==`function`&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps==`function`&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&Ls.enqueueReplaceState(t,t.state,null)}function Bs(e,t){var n=t;if(`ref`in t)for(var r in n={},t)r!==`ref`&&(n[r]=t[r]);if(e=e.defaultProps)for(var i in n===t&&(n=m({},n)),e)n[i]===void 0&&(n[i]=e[i]);return n}function Vs(e){Vr(e)}function Hs(e){console.error(e)}function Us(e){Vr(e)}function Ws(e,t){try{var n=e.onUncaughtError;n(t.value,{componentStack:t.stack})}catch(e){setTimeout(function(){throw e})}}function Gs(e,t,n){try{var r=e.onCaughtError;r(n.value,{componentStack:n.stack,errorBoundary:t.tag===1?t.stateNode:null})}catch(e){setTimeout(function(){throw e})}}function Ks(e,t,n){return n=Pa(n),n.tag=3,n.payload={element:null},n.callback=function(){Ws(e,t)},n}function qs(e){return e=Pa(e),e.tag=3,e}function Js(e,t,n,r){var i=n.type.getDerivedStateFromError;if(typeof i==`function`){var a=r.value;e.payload=function(){return i(a)},e.callback=function(){Gs(t,n,r)}}var o=n.stateNode;o!==null&&typeof o.componentDidCatch==`function`&&(e.callback=function(){Gs(t,n,r),typeof i!=`function`&&(tu===null?tu=new Set([this]):tu.add(this));var e=r.stack;this.componentDidCatch(r.value,{componentStack:e===null?``:e})})}function Ys(e,t,n,r,a){if(n.flags|=32768,typeof r==`object`&&r&&typeof r.then==`function`){if(t=n.alternate,t!==null&&Ui(t,n,a,!0),n=Ja.current,n!==null){switch(n.tag){case 31:case 13:return Ya===null?Tu():n.alternate===null&&Hl===0&&(Hl=3),n.flags&=-257,n.flags|=65536,n.lanes=a,r===ga?n.flags|=16384:(t=n.updateQueue,t===null?n.updateQueue=new Set([r]):t.add(r),Wu(e,r,a)),!1;case 22:return n.flags|=65536,r===ga?n.flags|=16384:(t=n.updateQueue,t===null?(t={transitions:null,markerInstances:null,retryQueue:new Set([r])},n.updateQueue=t):(n=t.retryQueue,n===null?t.retryQueue=new Set([r]):n.add(r)),Wu(e,r,a)),!1}throw Error(i(435,n.tag))}return Wu(e,r,a),Tu(),!1}if(J)return t=Ja.current,t===null?(r!==Oi&&(t=Error(i(423),{cause:r}),Fi(li(t,n))),e=e.current.alternate,e.flags|=65536,a&=-a,e.lanes|=a,r=li(r,n),a=Ks(e.stateNode,r,a),La(e,a),Hl!==4&&(Hl=2)):(!(t.flags&65536)&&(t.flags|=256),t.flags|=65536,t.lanes=a,r!==Oi&&(e=Error(i(422),{cause:r}),Fi(li(e,n)))),!1;var o=Error(i(520),{cause:r});if(o=li(o,n),Jl===null?Jl=[o]:Jl.push(o),Hl!==4&&(Hl=2),t===null)return!0;r=li(r,n),n=t;do{switch(n.tag){case 3:return n.flags|=65536,e=a&-a,n.lanes|=e,e=Ks(n.stateNode,r,e),La(n,e),!1;case 1:if(t=n.type,o=n.stateNode,!(n.flags&128)&&(typeof t.getDerivedStateFromError==`function`||o!==null&&typeof o.componentDidCatch==`function`&&(tu===null||!tu.has(o))))return n.flags|=65536,a&=-a,n.lanes|=a,a=qs(a),Js(a,e,n,r),La(n,a),!1}n=n.return}while(n!==null);return!1}var Xs=Error(i(461)),Zs=!1;function Qs(e,t,n,r){t.child=e===null?Aa(t,null,n,r):ka(t,e.child,n,r)}function $s(e,t,n,r,i){n=n.render;var a=t.ref;if(`ref`in r){var o={};for(var s in r)s!==`ref`&&(o[s]=r[s])}else o=r;return Gi(t),r=go(e,t,n,o,a,i),s=bo(),e!==null&&!Zs?(xo(e,t,i),Cc(e,t,i)):(J&&s&&xi(t),t.flags|=1,Qs(e,t,r,i),t.child)}function ec(e,t,n,r,i){if(e===null){var a=n.type;return typeof a==`function`&&!ei(a)&&a.defaultProps===void 0&&n.compare===null?(t.tag=15,t.type=a,tc(e,t,a,r,i)):(e=ri(n.type,null,r,t,t.mode,i),e.ref=t.ref,e.return=t,t.child=e)}if(a=e.child,!wc(e,i)){var o=a.memoizedProps;if(n=n.compare,n=n===null?mr:n,n(o,r)&&e.ref===t.ref)return Cc(e,t,i)}return t.flags|=1,e=ti(a,r),e.ref=t.ref,e.return=t,t.child=e}function tc(e,t,n,r,i){if(e!==null){var a=e.memoizedProps;if(mr(a,r)&&e.ref===t.ref)if(Zs=!1,t.pendingProps=r=a,wc(e,i))e.flags&131072&&(Zs=!0);else return t.lanes=e.lanes,Cc(e,t,i)}return lc(e,t,n,r,i)}function nc(e,t,n,r){var i=r.children,a=e===null?null:e.memoizedState;if(e===null&&t.stateNode===null&&(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),r.mode===`hidden`){if(t.flags&128){if(a=a===null?n:a.baseLanes|n,e!==null){for(r=t.child=e.child,i=0;r!==null;)i=i|r.lanes|r.childLanes,r=r.sibling;r=i&~a}else r=0,t.child=null;return ic(e,t,a,n,r)}if(n&536870912)t.memoizedState={baseLanes:0,cachePool:null},e!==null&&da(t,a===null?null:a.cachePool),a===null?Ka():Ga(t,a),Qa(t);else return r=t.lanes=536870912,ic(e,t,a===null?n:a.baseLanes|n,n,r)}else a===null?(e!==null&&da(t,null),Ka(),$a(t)):(da(t,a.cachePool),Ga(t,a),$a(t),t.memoizedState=null);return Qs(e,t,i,n),t.child}function rc(e,t){return e!==null&&e.tag===22||t.stateNode!==null||(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),t.sibling}function ic(e,t,n,r,i){var a=ua();return a=a===null?null:{parent:Qi._currentValue,pool:a},t.memoizedState={baseLanes:n,cachePool:a},e!==null&&da(t,null),Ka(),Qa(t),e!==null&&Ui(e,t,r,!0),t.childLanes=i,null}function ac(e,t){return t=vc({mode:t.mode,children:t.children},e.mode),t.ref=e.ref,e.child=t,t.return=e,t}function oc(e,t,n){return ka(t,e.child,null,n),e=ac(t,t.pendingProps),e.flags|=2,eo(t),t.memoizedState=null,e}function sc(e,t,n){var r=t.pendingProps,a=(t.flags&128)!=0;if(t.flags&=-129,e===null){if(J){if(r.mode===`hidden`)return e=ac(t,r),t.lanes=536870912,rc(null,e);if(Za(t),(e=Ti)?(e=rf(e,Di),e=e!==null&&e.data===`&`?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:gi===null?null:{id:_i,overflow:vi},retryLane:536870912,hydrationErrors:null},n=oi(e),n.return=t,t.child=n,wi=t,Ti=null)):e=null,e===null)throw ki(t);return t.lanes=536870912,null}return ac(t,r)}var o=e.memoizedState;if(o!==null){var s=o.dehydrated;if(Za(t),a)if(t.flags&256)t.flags&=-257,t=oc(e,t,n);else if(t.memoizedState!==null)t.child=e.child,t.flags|=128,t=null;else throw Error(i(558));else if(Zs||Ui(e,t,n,!1),a=(n&e.childLanes)!==0,Zs||a){if(r=Fl,r!==null&&(s=Je(r,n),s!==0&&s!==o.retryLane))throw o.retryLane=s,Jr(e,s),pu(r,e,s),Xs;Tu(),t=oc(e,t,n)}else e=o.treeContext,Ti=cf(s.nextSibling),wi=t,J=!0,Ei=null,Di=!1,e!==null&&Ci(t,e),t=ac(t,r),t.flags|=4096;return t}return e=ti(e.child,{mode:r.mode,children:r.children}),e.ref=t.ref,t.child=e,e.return=t,e}function cc(e,t){var n=t.ref;if(n===null)e!==null&&e.ref!==null&&(t.flags|=4194816);else{if(typeof n!=`function`&&typeof n!=`object`)throw Error(i(284));(e===null||e.ref!==n)&&(t.flags|=4194816)}}function lc(e,t,n,r,i){return Gi(t),n=go(e,t,n,r,void 0,i),r=bo(),e!==null&&!Zs?(xo(e,t,i),Cc(e,t,i)):(J&&r&&xi(t),t.flags|=1,Qs(e,t,n,i),t.child)}function uc(e,t,n,r,i,a){return Gi(t),t.updateQueue=null,n=vo(t,r,n,i),_o(e),r=bo(),e!==null&&!Zs?(xo(e,t,a),Cc(e,t,a)):(J&&r&&xi(t),t.flags|=1,Qs(e,t,n,a),t.child)}function dc(e,t,n,r,i){if(Gi(t),t.stateNode===null){var a=Zr,o=n.contextType;typeof o==`object`&&o&&(a=Ki(o)),a=new n(r,a),t.memoizedState=a.state!==null&&a.state!==void 0?a.state:null,a.updater=Ls,t.stateNode=a,a._reactInternals=t,a=t.stateNode,a.props=r,a.state=t.memoizedState,a.refs={},Ma(t),o=n.contextType,a.context=typeof o==`object`&&o?Ki(o):Zr,a.state=t.memoizedState,o=n.getDerivedStateFromProps,typeof o==`function`&&(Is(t,n,o,r),a.state=t.memoizedState),typeof n.getDerivedStateFromProps==`function`||typeof a.getSnapshotBeforeUpdate==`function`||typeof a.UNSAFE_componentWillMount!=`function`&&typeof a.componentWillMount!=`function`||(o=a.state,typeof a.componentWillMount==`function`&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount==`function`&&a.UNSAFE_componentWillMount(),o!==a.state&&Ls.enqueueReplaceState(a,a.state,null),Ba(t,r,a,i),za(),a.state=t.memoizedState),typeof a.componentDidMount==`function`&&(t.flags|=4194308),r=!0}else if(e===null){a=t.stateNode;var s=t.memoizedProps,c=Bs(n,s);a.props=c;var l=a.context,u=n.contextType;o=Zr,typeof u==`object`&&u&&(o=Ki(u));var d=n.getDerivedStateFromProps;u=typeof d==`function`||typeof a.getSnapshotBeforeUpdate==`function`,s=t.pendingProps!==s,u||typeof a.UNSAFE_componentWillReceiveProps!=`function`&&typeof a.componentWillReceiveProps!=`function`||(s||l!==o)&&zs(t,a,r,o),ja=!1;var f=t.memoizedState;a.state=f,Ba(t,r,a,i),za(),l=t.memoizedState,s||f!==l||ja?(typeof d==`function`&&(Is(t,n,d,r),l=t.memoizedState),(c=ja||Rs(t,n,c,r,f,l,o))?(u||typeof a.UNSAFE_componentWillMount!=`function`&&typeof a.componentWillMount!=`function`||(typeof a.componentWillMount==`function`&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount==`function`&&a.UNSAFE_componentWillMount()),typeof a.componentDidMount==`function`&&(t.flags|=4194308)):(typeof a.componentDidMount==`function`&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=l),a.props=r,a.state=l,a.context=o,r=c):(typeof a.componentDidMount==`function`&&(t.flags|=4194308),r=!1)}else{a=t.stateNode,Na(e,t),o=t.memoizedProps,u=Bs(n,o),a.props=u,d=t.pendingProps,f=a.context,l=n.contextType,c=Zr,typeof l==`object`&&l&&(c=Ki(l)),s=n.getDerivedStateFromProps,(l=typeof s==`function`||typeof a.getSnapshotBeforeUpdate==`function`)||typeof a.UNSAFE_componentWillReceiveProps!=`function`&&typeof a.componentWillReceiveProps!=`function`||(o!==d||f!==c)&&zs(t,a,r,c),ja=!1,f=t.memoizedState,a.state=f,Ba(t,r,a,i),za();var p=t.memoizedState;o!==d||f!==p||ja||e!==null&&e.dependencies!==null&&Wi(e.dependencies)?(typeof s==`function`&&(Is(t,n,s,r),p=t.memoizedState),(u=ja||Rs(t,n,u,r,f,p,c)||e!==null&&e.dependencies!==null&&Wi(e.dependencies))?(l||typeof a.UNSAFE_componentWillUpdate!=`function`&&typeof a.componentWillUpdate!=`function`||(typeof a.componentWillUpdate==`function`&&a.componentWillUpdate(r,p,c),typeof a.UNSAFE_componentWillUpdate==`function`&&a.UNSAFE_componentWillUpdate(r,p,c)),typeof a.componentDidUpdate==`function`&&(t.flags|=4),typeof a.getSnapshotBeforeUpdate==`function`&&(t.flags|=1024)):(typeof a.componentDidUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=p),a.props=r,a.state=p,a.context=c,r=u):(typeof a.componentDidUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),r=!1)}return a=r,cc(e,t),r=(t.flags&128)!=0,a||r?(a=t.stateNode,n=r&&typeof n.getDerivedStateFromError!=`function`?null:a.render(),t.flags|=1,e!==null&&r?(t.child=ka(t,e.child,null,i),t.child=ka(t,null,n,i)):Qs(e,t,n,i),t.memoizedState=a.state,e=t.child):e=Cc(e,t,i),e}function fc(e,t,n,r){return Ni(),t.flags|=256,Qs(e,t,n,r),t.child}var pc={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function mc(e){return{baseLanes:e,cachePool:fa()}}function hc(e,t,n){return e=e===null?0:e.childLanes&~n,t&&(e|=Kl),e}function gc(e,t,n){var r=t.pendingProps,a=!1,o=(t.flags&128)!=0,s;if((s=o)||(s=e!==null&&e.memoizedState===null?!1:(to.current&2)!=0),s&&(a=!0,t.flags&=-129),s=(t.flags&32)!=0,t.flags&=-33,e===null){if(J){if(a?Xa(t):$a(t),(e=Ti)?(e=rf(e,Di),e=e!==null&&e.data!==`&`?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:gi===null?null:{id:_i,overflow:vi},retryLane:536870912,hydrationErrors:null},n=oi(e),n.return=t,t.child=n,wi=t,Ti=null)):e=null,e===null)throw ki(t);return of(e)?t.lanes=32:t.lanes=536870912,null}var c=r.children;return r=r.fallback,a?($a(t),a=t.mode,c=vc({mode:`hidden`,children:c},a),r=ii(r,a,n,null),c.return=t,r.return=t,c.sibling=r,t.child=c,r=t.child,r.memoizedState=mc(n),r.childLanes=hc(e,s,n),t.memoizedState=pc,rc(null,r)):(Xa(t),_c(t,c))}var l=e.memoizedState;if(l!==null&&(c=l.dehydrated,c!==null)){if(o)t.flags&256?(Xa(t),t.flags&=-257,t=yc(e,t,n)):t.memoizedState===null?($a(t),c=r.fallback,a=t.mode,r=vc({mode:`visible`,children:r.children},a),c=ii(c,a,n,null),c.flags|=2,r.return=t,c.return=t,r.sibling=c,t.child=r,ka(t,e.child,null,n),r=t.child,r.memoizedState=mc(n),r.childLanes=hc(e,s,n),t.memoizedState=pc,t=rc(null,r)):($a(t),t.child=e.child,t.flags|=128,t=null);else if(Xa(t),of(c)){if(s=c.nextSibling&&c.nextSibling.dataset,s)var u=s.dgst;s=u,r=Error(i(419)),r.stack=``,r.digest=s,Fi({value:r,source:null,stack:null}),t=yc(e,t,n)}else if(Zs||Ui(e,t,n,!1),s=(n&e.childLanes)!==0,Zs||s){if(s=Fl,s!==null&&(r=Je(s,n),r!==0&&r!==l.retryLane))throw l.retryLane=r,Jr(e,r),pu(s,e,r),Xs;af(c)||Tu(),t=yc(e,t,n)}else af(c)?(t.flags|=192,t.child=e.child,t=null):(e=l.treeContext,Ti=cf(c.nextSibling),wi=t,J=!0,Ei=null,Di=!1,e!==null&&Ci(t,e),t=_c(t,r.children),t.flags|=4096);return t}return a?($a(t),c=r.fallback,a=t.mode,l=e.child,u=l.sibling,r=ti(l,{mode:`hidden`,children:r.children}),r.subtreeFlags=l.subtreeFlags&65011712,u===null?(c=ii(c,a,n,null),c.flags|=2):c=ti(u,c),c.return=t,r.return=t,r.sibling=c,t.child=r,rc(null,r),r=t.child,c=e.child.memoizedState,c===null?c=mc(n):(a=c.cachePool,a===null?a=fa():(l=Qi._currentValue,a=a.parent===l?a:{parent:l,pool:l}),c={baseLanes:c.baseLanes|n,cachePool:a}),r.memoizedState=c,r.childLanes=hc(e,s,n),t.memoizedState=pc,rc(e.child,r)):(Xa(t),n=e.child,e=n.sibling,n=ti(n,{mode:`visible`,children:r.children}),n.return=t,n.sibling=null,e!==null&&(s=t.deletions,s===null?(t.deletions=[e],t.flags|=16):s.push(e)),t.child=n,t.memoizedState=null,n)}function _c(e,t){return t=vc({mode:`visible`,children:t},e.mode),t.return=e,e.child=t}function vc(e,t){return e=$r(22,e,null,t),e.lanes=0,e}function yc(e,t,n){return ka(t,e.child,null,n),e=_c(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function bc(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),Vi(e.return,t,n)}function xc(e,t,n,r,i,a){var o=e.memoizedState;o===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:i,treeForkCount:a}:(o.isBackwards=t,o.rendering=null,o.renderingStartTime=0,o.last=r,o.tail=n,o.tailMode=i,o.treeForkCount=a)}function Sc(e,t,n){var r=t.pendingProps,i=r.revealOrder,a=r.tail;r=r.children;var o=to.current,s=(o&2)!=0;if(s?(o=o&1|2,t.flags|=128):o&=1,V(to,o),Qs(e,t,r,n),r=J?pi:0,!s&&e!==null&&e.flags&128)a:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&bc(e,n,t);else if(e.tag===19)bc(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break a;for(;e.sibling===null;){if(e.return===null||e.return===t)break a;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(i){case`forwards`:for(n=t.child,i=null;n!==null;)e=n.alternate,e!==null&&no(e)===null&&(i=n),n=n.sibling;n=i,n===null?(i=t.child,t.child=null):(i=n.sibling,n.sibling=null),xc(t,!1,i,n,a,r);break;case`backwards`:case`unstable_legacy-backwards`:for(n=null,i=t.child,t.child=null;i!==null;){if(e=i.alternate,e!==null&&no(e)===null){t.child=i;break}e=i.sibling,i.sibling=n,n=i,i=e}xc(t,!0,n,null,a,r);break;case`together`:xc(t,!1,null,null,void 0,r);break;default:t.memoizedState=null}return t.child}function Cc(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Ul|=t.lanes,(n&t.childLanes)===0)if(e!==null){if(Ui(e,t,n,!1),(n&t.childLanes)===0)return null}else return null;if(e!==null&&t.child!==e.child)throw Error(i(153));if(t.child!==null){for(e=t.child,n=ti(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=ti(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function wc(e,t){return(e.lanes&t)===0?(e=e.dependencies,!!(e!==null&&Wi(e))):!0}function Tc(e,t,n){switch(t.tag){case 3:ie(t,t.stateNode.containerInfo),zi(t,Qi,e.memoizedState.cache),Ni();break;case 27:case 5:oe(t);break;case 4:ie(t,t.stateNode.containerInfo);break;case 10:zi(t,t.type,t.memoizedProps.value);break;case 31:if(t.memoizedState!==null)return t.flags|=128,Za(t),null;break;case 13:var r=t.memoizedState;if(r!==null)return r.dehydrated===null?(n&t.child.childLanes)===0?(Xa(t),e=Cc(e,t,n),e===null?null:e.sibling):gc(e,t,n):(Xa(t),t.flags|=128,null);Xa(t);break;case 19:var i=(e.flags&128)!=0;if(r=(n&t.childLanes)!==0,r||=(Ui(e,t,n,!1),(n&t.childLanes)!==0),i){if(r)return Sc(e,t,n);t.flags|=128}if(i=t.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),V(to,to.current),r)break;return null;case 22:return t.lanes=0,nc(e,t,n,t.pendingProps);case 24:zi(t,Qi,e.memoizedState.cache)}return Cc(e,t,n)}function Ec(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps)Zs=!0;else{if(!wc(e,n)&&!(t.flags&128))return Zs=!1,Tc(e,t,n);Zs=!!(e.flags&131072)}else Zs=!1,J&&t.flags&1048576&&bi(t,pi,t.index);switch(t.lanes=0,t.tag){case 16:a:{var r=t.pendingProps;if(e=ya(t.elementType),t.type=e,typeof e==`function`)ei(e)?(r=Bs(e,r),t.tag=1,t=dc(null,t,e,r,n)):(t.tag=0,t=lc(null,t,e,r,n));else{if(e!=null){var a=e.$$typeof;if(a===w){t.tag=11,t=$s(null,t,e,r,n);break a}else if(a===D){t.tag=14,t=ec(null,t,e,r,n);break a}}throw t=P(e)||e,Error(i(306,t,``))}}return t;case 0:return lc(e,t,t.type,t.pendingProps,n);case 1:return r=t.type,a=Bs(r,t.pendingProps),dc(e,t,r,a,n);case 3:a:{if(ie(t,t.stateNode.containerInfo),e===null)throw Error(i(387));r=t.pendingProps;var o=t.memoizedState;a=o.element,Na(e,t),Ba(t,r,null,n);var s=t.memoizedState;if(r=s.cache,zi(t,Qi,r),r!==o.cache&&Hi(t,[Qi],n,!0),za(),r=s.element,o.isDehydrated)if(o={element:r,isDehydrated:!1,cache:s.cache},t.updateQueue.baseState=o,t.memoizedState=o,t.flags&256){t=fc(e,t,r,n);break a}else if(r!==a){a=li(Error(i(424)),t),Fi(a),t=fc(e,t,r,n);break a}else{switch(e=t.stateNode.containerInfo,e.nodeType){case 9:e=e.body;break;default:e=e.nodeName===`HTML`?e.ownerDocument.body:e}for(Ti=cf(e.firstChild),wi=t,J=!0,Ei=null,Di=!0,n=Aa(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling}else{if(Ni(),r===a){t=Cc(e,t,n);break a}Qs(e,t,r,n)}t=t.child}return t;case 26:return cc(e,t),e===null?(n=kf(t.type,null,t.pendingProps,null))?t.memoizedState=n:J||(n=t.type,e=t.pendingProps,r=Bd(U.current).createElement(n),r[et]=t,r[tt]=e,Pd(r,n,e),G(r),t.stateNode=r):t.memoizedState=kf(t.type,e.memoizedProps,t.pendingProps,e.memoizedState),null;case 27:return oe(t),e===null&&J&&(r=t.stateNode=ff(t.type,t.pendingProps,U.current),wi=t,Di=!0,a=Ti,Zd(t.type)?(lf=a,Ti=cf(r.firstChild)):Ti=a),Qs(e,t,t.pendingProps.children,n),cc(e,t),e===null&&(t.flags|=4194304),t.child;case 5:return e===null&&J&&((a=r=Ti)&&(r=tf(r,t.type,t.pendingProps,Di),r===null?a=!1:(t.stateNode=r,wi=t,Ti=cf(r.firstChild),Di=!1,a=!0)),a||ki(t)),oe(t),a=t.type,o=t.pendingProps,s=e===null?null:e.memoizedProps,r=o.children,Ud(a,o)?r=null:s!==null&&Ud(a,s)&&(t.flags|=32),t.memoizedState!==null&&(a=go(e,t,yo,null,null,n),Qf._currentValue=a),cc(e,t),Qs(e,t,r,n),t.child;case 6:return e===null&&J&&((e=n=Ti)&&(n=nf(n,t.pendingProps,Di),n===null?e=!1:(t.stateNode=n,wi=t,Ti=null,e=!0)),e||ki(t)),null;case 13:return gc(e,t,n);case 4:return ie(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=ka(t,null,r,n):Qs(e,t,r,n),t.child;case 11:return $s(e,t,t.type,t.pendingProps,n);case 7:return Qs(e,t,t.pendingProps,n),t.child;case 8:return Qs(e,t,t.pendingProps.children,n),t.child;case 12:return Qs(e,t,t.pendingProps.children,n),t.child;case 10:return r=t.pendingProps,zi(t,t.type,r.value),Qs(e,t,r.children,n),t.child;case 9:return a=t.type._context,r=t.pendingProps.children,Gi(t),a=Ki(a),r=r(a),t.flags|=1,Qs(e,t,r,n),t.child;case 14:return ec(e,t,t.type,t.pendingProps,n);case 15:return tc(e,t,t.type,t.pendingProps,n);case 19:return Sc(e,t,n);case 31:return sc(e,t,n);case 22:return nc(e,t,n,t.pendingProps);case 24:return Gi(t),r=Ki(Qi),e===null?(a=ua(),a===null&&(a=Fl,o=$i(),a.pooledCache=o,o.refCount++,o!==null&&(a.pooledCacheLanes|=n),a=o),t.memoizedState={parent:r,cache:a},Ma(t),zi(t,Qi,a)):((e.lanes&n)!==0&&(Na(e,t),Ba(t,null,null,n),za()),a=e.memoizedState,o=t.memoizedState,a.parent===r?(r=o.cache,zi(t,Qi,r),r!==a.cache&&Hi(t,[Qi],n,!0)):(a={parent:r,cache:r},t.memoizedState=a,t.lanes===0&&(t.memoizedState=t.updateQueue.baseState=a),zi(t,Qi,r))),Qs(e,t,t.pendingProps.children,n),t.child;case 29:throw t.pendingProps}throw Error(i(156,t.tag))}function Dc(e){e.flags|=4}function Oc(e,t,n,r,i){if((t=(e.mode&32)!=0)&&(t=!1),t){if(e.flags|=16777216,(i&335544128)===i)if(e.stateNode.complete)e.flags|=8192;else if(Su())e.flags|=8192;else throw ba=ga,ma}else e.flags&=-16777217}function kc(e,t){if(t.type!==`stylesheet`||t.state.loading&4)e.flags&=-16777217;else if(e.flags|=16777216,!Wf(t))if(Su())e.flags|=8192;else throw ba=ga,ma}function Ac(e,t){t!==null&&(e.flags|=4),e.flags&16384&&(t=e.tag===22?536870912:Ue(),e.lanes|=t,ql|=t)}function jc(e,t){if(!J)switch(e.tailMode){case`hidden`:t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case`collapsed`:n=e.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function Mc(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var i=e.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags&65011712,r|=i.flags&65011712,i.return=e,i=i.sibling;else for(i=e.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags,r|=i.flags,i.return=e,i=i.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function Nc(e,t,n){var r=t.pendingProps;switch(Si(t),t.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Mc(t),null;case 1:return Mc(t),null;case 3:return n=t.stateNode,r=null,e!==null&&(r=e.memoizedState.cache),t.memoizedState.cache!==r&&(t.flags|=2048),Bi(Qi),ae(),n.pendingContext&&(n.context=n.pendingContext,n.pendingContext=null),(e===null||e.child===null)&&(Mi(t)?Dc(t):e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,Pi())),Mc(t),null;case 26:var a=t.type,o=t.memoizedState;return e===null?(Dc(t),o===null?(Mc(t),Oc(t,a,null,r,n)):(Mc(t),kc(t,o))):o?o===e.memoizedState?(Mc(t),t.flags&=-16777217):(Dc(t),Mc(t),kc(t,o)):(e=e.memoizedProps,e!==r&&Dc(t),Mc(t),Oc(t,a,e,r,n)),null;case 27:if(se(t),n=U.current,a=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==r&&Dc(t);else{if(!r){if(t.stateNode===null)throw Error(i(166));return Mc(t),null}e=H.current,Mi(t)?Ai(t,e):(e=ff(a,r,n),t.stateNode=e,Dc(t))}return Mc(t),null;case 5:if(se(t),a=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==r&&Dc(t);else{if(!r){if(t.stateNode===null)throw Error(i(166));return Mc(t),null}if(o=H.current,Mi(t))Ai(t,o);else{var s=Bd(U.current);switch(o){case 1:o=s.createElementNS(`http://www.w3.org/2000/svg`,a);break;case 2:o=s.createElementNS(`http://www.w3.org/1998/Math/MathML`,a);break;default:switch(a){case`svg`:o=s.createElementNS(`http://www.w3.org/2000/svg`,a);break;case`math`:o=s.createElementNS(`http://www.w3.org/1998/Math/MathML`,a);break;case`script`:o=s.createElement(`div`),o.innerHTML=`<script><\/script>`,o=o.removeChild(o.firstChild);break;case`select`:o=typeof r.is==`string`?s.createElement(`select`,{is:r.is}):s.createElement(`select`),r.multiple?o.multiple=!0:r.size&&(o.size=r.size);break;default:o=typeof r.is==`string`?s.createElement(a,{is:r.is}):s.createElement(a)}}o[et]=t,o[tt]=r;a:for(s=t.child;s!==null;){if(s.tag===5||s.tag===6)o.appendChild(s.stateNode);else if(s.tag!==4&&s.tag!==27&&s.child!==null){s.child.return=s,s=s.child;continue}if(s===t)break a;for(;s.sibling===null;){if(s.return===null||s.return===t)break a;s=s.return}s.sibling.return=s.return,s=s.sibling}t.stateNode=o;a:switch(Pd(o,a,r),a){case`button`:case`input`:case`select`:case`textarea`:r=!!r.autoFocus;break a;case`img`:r=!0;break a;default:r=!1}r&&Dc(t)}}return Mc(t),Oc(t,t.type,e===null?null:e.memoizedProps,t.pendingProps,n),null;case 6:if(e&&t.stateNode!=null)e.memoizedProps!==r&&Dc(t);else{if(typeof r!=`string`&&t.stateNode===null)throw Error(i(166));if(e=U.current,Mi(t)){if(e=t.stateNode,n=t.memoizedProps,r=null,a=wi,a!==null)switch(a.tag){case 27:case 5:r=a.memoizedProps}e[et]=t,e=!!(e.nodeValue===n||r!==null&&!0===r.suppressHydrationWarning||jd(e.nodeValue,n)),e||ki(t,!0)}else e=Bd(e).createTextNode(r),e[et]=t,t.stateNode=e}return Mc(t),null;case 31:if(n=t.memoizedState,e===null||e.memoizedState!==null){if(r=Mi(t),n!==null){if(e===null){if(!r)throw Error(i(318));if(e=t.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(i(557));e[et]=t}else Ni(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;Mc(t),e=!1}else n=Pi(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=n),e=!0;if(!e)return t.flags&256?(eo(t),t):(eo(t),null);if(t.flags&128)throw Error(i(558))}return Mc(t),null;case 13:if(r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(a=Mi(t),r!==null&&r.dehydrated!==null){if(e===null){if(!a)throw Error(i(318));if(a=t.memoizedState,a=a===null?null:a.dehydrated,!a)throw Error(i(317));a[et]=t}else Ni(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;Mc(t),a=!1}else a=Pi(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=a),a=!0;if(!a)return t.flags&256?(eo(t),t):(eo(t),null)}return eo(t),t.flags&128?(t.lanes=n,t):(n=r!==null,e=e!==null&&e.memoizedState!==null,n&&(r=t.child,a=null,r.alternate!==null&&r.alternate.memoizedState!==null&&r.alternate.memoizedState.cachePool!==null&&(a=r.alternate.memoizedState.cachePool.pool),o=null,r.memoizedState!==null&&r.memoizedState.cachePool!==null&&(o=r.memoizedState.cachePool.pool),o!==a&&(r.flags|=2048)),n!==e&&n&&(t.child.flags|=8192),Ac(t,t.updateQueue),Mc(t),null);case 4:return ae(),e===null&&xd(t.stateNode.containerInfo),Mc(t),null;case 10:return Bi(t.type),Mc(t),null;case 19:if(B(to),r=t.memoizedState,r===null)return Mc(t),null;if(a=(t.flags&128)!=0,o=r.rendering,o===null)if(a)jc(r,!1);else{if(Hl!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(o=no(e),o!==null){for(t.flags|=128,jc(r,!1),e=o.updateQueue,t.updateQueue=e,Ac(t,e),t.subtreeFlags=0,e=n,n=t.child;n!==null;)ni(n,e),n=n.sibling;return V(to,to.current&1|2),J&&yi(t,r.treeForkCount),t.child}e=e.sibling}r.tail!==null&&be()>$l&&(t.flags|=128,a=!0,jc(r,!1),t.lanes=4194304)}else{if(!a)if(e=no(o),e!==null){if(t.flags|=128,a=!0,e=e.updateQueue,t.updateQueue=e,Ac(t,e),jc(r,!0),r.tail===null&&r.tailMode===`hidden`&&!o.alternate&&!J)return Mc(t),null}else 2*be()-r.renderingStartTime>$l&&n!==536870912&&(t.flags|=128,a=!0,jc(r,!1),t.lanes=4194304);r.isBackwards?(o.sibling=t.child,t.child=o):(e=r.last,e===null?t.child=o:e.sibling=o,r.last=o)}return r.tail===null?(Mc(t),null):(e=r.tail,r.rendering=e,r.tail=e.sibling,r.renderingStartTime=be(),e.sibling=null,n=to.current,V(to,a?n&1|2:n&1),J&&yi(t,r.treeForkCount),e);case 22:case 23:return eo(t),qa(),r=t.memoizedState!==null,e===null?r&&(t.flags|=8192):e.memoizedState!==null!==r&&(t.flags|=8192),r?n&536870912&&!(t.flags&128)&&(Mc(t),t.subtreeFlags&6&&(t.flags|=8192)):Mc(t),n=t.updateQueue,n!==null&&Ac(t,n.retryQueue),n=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),r=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(r=t.memoizedState.cachePool.pool),r!==n&&(t.flags|=2048),e!==null&&B(la),null;case 24:return n=null,e!==null&&(n=e.memoizedState.cache),t.memoizedState.cache!==n&&(t.flags|=2048),Bi(Qi),Mc(t),null;case 25:return null;case 30:return null}throw Error(i(156,t.tag))}function Pc(e,t){switch(Si(t),t.tag){case 1:return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return Bi(Qi),ae(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 26:case 27:case 5:return se(t),null;case 31:if(t.memoizedState!==null){if(eo(t),t.alternate===null)throw Error(i(340));Ni()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 13:if(eo(t),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(i(340));Ni()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return B(to),null;case 4:return ae(),null;case 10:return Bi(t.type),null;case 22:case 23:return eo(t),qa(),e!==null&&B(la),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 24:return Bi(Qi),null;case 25:return null;default:return null}}function Fc(e,t){switch(Si(t),t.tag){case 3:Bi(Qi),ae();break;case 26:case 27:case 5:se(t);break;case 4:ae();break;case 31:t.memoizedState!==null&&eo(t);break;case 13:eo(t);break;case 19:B(to);break;case 10:Bi(t.type);break;case 22:case 23:eo(t),qa(),e!==null&&B(la);break;case 24:Bi(Qi)}}function Ic(e,t){try{var n=t.updateQueue,r=n===null?null:n.lastEffect;if(r!==null){var i=r.next;n=i;do{if((n.tag&e)===e){r=void 0;var a=n.create,o=n.inst;r=a(),o.destroy=r}n=n.next}while(n!==i)}}catch(e){Uu(t,t.return,e)}}function Lc(e,t,n){try{var r=t.updateQueue,i=r===null?null:r.lastEffect;if(i!==null){var a=i.next;r=a;do{if((r.tag&e)===e){var o=r.inst,s=o.destroy;if(s!==void 0){o.destroy=void 0,i=t;var c=n,l=s;try{l()}catch(e){Uu(i,c,e)}}}r=r.next}while(r!==a)}}catch(e){Uu(t,t.return,e)}}function Rc(e){var t=e.updateQueue;if(t!==null){var n=e.stateNode;try{Ha(t,n)}catch(t){Uu(e,e.return,t)}}}function zc(e,t,n){n.props=Bs(e.type,e.memoizedProps),n.state=e.memoizedState;try{n.componentWillUnmount()}catch(n){Uu(e,t,n)}}function Bc(e,t){try{var n=e.ref;if(n!==null){switch(e.tag){case 26:case 27:case 5:var r=e.stateNode;break;case 30:r=e.stateNode;break;default:r=e.stateNode}typeof n==`function`?e.refCleanup=n(r):n.current=r}}catch(n){Uu(e,t,n)}}function Vc(e,t){var n=e.ref,r=e.refCleanup;if(n!==null)if(typeof r==`function`)try{r()}catch(n){Uu(e,t,n)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof n==`function`)try{n(null)}catch(n){Uu(e,t,n)}else n.current=null}function Hc(e){var t=e.type,n=e.memoizedProps,r=e.stateNode;try{a:switch(t){case`button`:case`input`:case`select`:case`textarea`:n.autoFocus&&r.focus();break a;case`img`:n.src?r.src=n.src:n.srcSet&&(r.srcset=n.srcSet)}}catch(t){Uu(e,e.return,t)}}function Uc(e,t,n){try{var r=e.stateNode;Fd(r,e.type,n,t),r[tt]=t}catch(t){Uu(e,e.return,t)}}function Wc(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&Zd(e.type)||e.tag===4}function Gc(e){a:for(;;){for(;e.sibling===null;){if(e.return===null||Wc(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&Zd(e.type)||e.flags&2||e.child===null||e.tag===4)continue a;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Kc(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?(n.nodeType===9?n.body:n.nodeName===`HTML`?n.ownerDocument.body:n).insertBefore(e,t):(t=n.nodeType===9?n.body:n.nodeName===`HTML`?n.ownerDocument.body:n,t.appendChild(e),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=Kt));else if(r!==4&&(r===27&&Zd(e.type)&&(n=e.stateNode,t=null),e=e.child,e!==null))for(Kc(e,t,n),e=e.sibling;e!==null;)Kc(e,t,n),e=e.sibling}function qc(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(r!==4&&(r===27&&Zd(e.type)&&(n=e.stateNode),e=e.child,e!==null))for(qc(e,t,n),e=e.sibling;e!==null;)qc(e,t,n),e=e.sibling}function Jc(e){var t=e.stateNode,n=e.memoizedProps;try{for(var r=e.type,i=t.attributes;i.length;)t.removeAttributeNode(i[0]);Pd(t,r,n),t[et]=e,t[tt]=n}catch(t){Uu(e,e.return,t)}}var Yc=!1,Xc=!1,Zc=!1,Qc=typeof WeakSet==`function`?WeakSet:Set,$c=null;function el(e,t){if(e=e.containerInfo,Rd=sp,e=vr(e),yr(e)){if(`selectionStart`in e)var n={start:e.selectionStart,end:e.selectionEnd};else a:{n=(n=e.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var a=r.anchorOffset,o=r.focusNode;r=r.focusOffset;try{n.nodeType,o.nodeType}catch{n=null;break a}var s=0,c=-1,l=-1,u=0,d=0,f=e,p=null;b:for(;;){for(var m;f!==n||a!==0&&f.nodeType!==3||(c=s+a),f!==o||r!==0&&f.nodeType!==3||(l=s+r),f.nodeType===3&&(s+=f.nodeValue.length),(m=f.firstChild)!==null;)p=f,f=m;for(;;){if(f===e)break b;if(p===n&&++u===a&&(c=s),p===o&&++d===r&&(l=s),(m=f.nextSibling)!==null)break;f=p,p=f.parentNode}f=m}n=c===-1||l===-1?null:{start:c,end:l}}else n=null}n||={start:0,end:0}}else n=null;for(zd={focusedElem:e,selectionRange:n},sp=!1,$c=t;$c!==null;)if(t=$c,e=t.child,t.subtreeFlags&1028&&e!==null)e.return=t,$c=e;else for(;$c!==null;){switch(t=$c,o=t.alternate,e=t.flags,t.tag){case 0:if(e&4&&(e=t.updateQueue,e=e===null?null:e.events,e!==null))for(n=0;n<e.length;n++)a=e[n],a.ref.impl=a.nextImpl;break;case 11:case 15:break;case 1:if(e&1024&&o!==null){e=void 0,n=t,a=o.memoizedProps,o=o.memoizedState,r=n.stateNode;try{var h=Bs(n.type,a);e=r.getSnapshotBeforeUpdate(h,o),r.__reactInternalSnapshotBeforeUpdate=e}catch(e){Uu(n,n.return,e)}}break;case 3:if(e&1024){if(e=t.stateNode.containerInfo,n=e.nodeType,n===9)ef(e);else if(n===1)switch(e.nodeName){case`HEAD`:case`HTML`:case`BODY`:ef(e);break;default:e.textContent=``}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if(e&1024)throw Error(i(163))}if(e=t.sibling,e!==null){e.return=t.return,$c=e;break}$c=t.return}}function tl(e,t,n){var r=n.flags;switch(n.tag){case 0:case 11:case 15:gl(e,n),r&4&&Ic(5,n);break;case 1:if(gl(e,n),r&4)if(e=n.stateNode,t===null)try{e.componentDidMount()}catch(e){Uu(n,n.return,e)}else{var i=Bs(n.type,t.memoizedProps);t=t.memoizedState;try{e.componentDidUpdate(i,t,e.__reactInternalSnapshotBeforeUpdate)}catch(e){Uu(n,n.return,e)}}r&64&&Rc(n),r&512&&Bc(n,n.return);break;case 3:if(gl(e,n),r&64&&(e=n.updateQueue,e!==null)){if(t=null,n.child!==null)switch(n.child.tag){case 27:case 5:t=n.child.stateNode;break;case 1:t=n.child.stateNode}try{Ha(e,t)}catch(e){Uu(n,n.return,e)}}break;case 27:t===null&&r&4&&Jc(n);case 26:case 5:gl(e,n),t===null&&r&4&&Hc(n),r&512&&Bc(n,n.return);break;case 12:gl(e,n);break;case 31:gl(e,n),r&4&&sl(e,n);break;case 13:gl(e,n),r&4&&cl(e,n),r&64&&(e=n.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(n=qu.bind(null,n),sf(e,n))));break;case 22:if(r=n.memoizedState!==null||Yc,!r){t=t!==null&&t.memoizedState!==null||Xc,i=Yc;var a=Xc;Yc=r,(Xc=t)&&!a?vl(e,n,(n.subtreeFlags&8772)!=0):gl(e,n),Yc=i,Xc=a}break;case 30:break;default:gl(e,n)}}function nl(e){var t=e.alternate;t!==null&&(e.alternate=null,nl(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&ct(t)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var rl=null,il=!1;function al(e,t,n){for(n=n.child;n!==null;)ol(e,t,n),n=n.sibling}function ol(e,t,n){if(Ae&&typeof Ae.onCommitFiberUnmount==`function`)try{Ae.onCommitFiberUnmount(ke,n)}catch{}switch(n.tag){case 26:Xc||Vc(n,t),al(e,t,n),n.memoizedState?n.memoizedState.count--:n.stateNode&&(n=n.stateNode,n.parentNode.removeChild(n));break;case 27:Xc||Vc(n,t);var r=rl,i=il;Zd(n.type)&&(rl=n.stateNode,il=!1),al(e,t,n),pf(n.stateNode),rl=r,il=i;break;case 5:Xc||Vc(n,t);case 6:if(r=rl,i=il,rl=null,al(e,t,n),rl=r,il=i,rl!==null)if(il)try{(rl.nodeType===9?rl.body:rl.nodeName===`HTML`?rl.ownerDocument.body:rl).removeChild(n.stateNode)}catch(e){Uu(n,t,e)}else try{rl.removeChild(n.stateNode)}catch(e){Uu(n,t,e)}break;case 18:rl!==null&&(il?(e=rl,Qd(e.nodeType===9?e.body:e.nodeName===`HTML`?e.ownerDocument.body:e,n.stateNode),Np(e)):Qd(rl,n.stateNode));break;case 4:r=rl,i=il,rl=n.stateNode.containerInfo,il=!0,al(e,t,n),rl=r,il=i;break;case 0:case 11:case 14:case 15:Lc(2,n,t),Xc||Lc(4,n,t),al(e,t,n);break;case 1:Xc||(Vc(n,t),r=n.stateNode,typeof r.componentWillUnmount==`function`&&zc(n,t,r)),al(e,t,n);break;case 21:al(e,t,n);break;case 22:Xc=(r=Xc)||n.memoizedState!==null,al(e,t,n),Xc=r;break;default:al(e,t,n)}}function sl(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{Np(e)}catch(e){Uu(t,t.return,e)}}}function cl(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{Np(e)}catch(e){Uu(t,t.return,e)}}function ll(e){switch(e.tag){case 31:case 13:case 19:var t=e.stateNode;return t===null&&(t=e.stateNode=new Qc),t;case 22:return e=e.stateNode,t=e._retryCache,t===null&&(t=e._retryCache=new Qc),t;default:throw Error(i(435,e.tag))}}function ul(e,t){var n=ll(e);t.forEach(function(t){if(!n.has(t)){n.add(t);var r=Ju.bind(null,e,t);t.then(r,r)}})}function dl(e,t){var n=t.deletions;if(n!==null)for(var r=0;r<n.length;r++){var a=n[r],o=e,s=t,c=s;a:for(;c!==null;){switch(c.tag){case 27:if(Zd(c.type)){rl=c.stateNode,il=!1;break a}break;case 5:rl=c.stateNode,il=!1;break a;case 3:case 4:rl=c.stateNode.containerInfo,il=!0;break a}c=c.return}if(rl===null)throw Error(i(160));ol(o,s,a),rl=null,il=!1,o=a.alternate,o!==null&&(o.return=null),a.return=null}if(t.subtreeFlags&13886)for(t=t.child;t!==null;)pl(t,e),t=t.sibling}var fl=null;function pl(e,t){var n=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:dl(t,e),ml(e),r&4&&(Lc(3,e,e.return),Ic(3,e),Lc(5,e,e.return));break;case 1:dl(t,e),ml(e),r&512&&(Xc||n===null||Vc(n,n.return)),r&64&&Yc&&(e=e.updateQueue,e!==null&&(r=e.callbacks,r!==null&&(n=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=n===null?r:n.concat(r))));break;case 26:var a=fl;if(dl(t,e),ml(e),r&512&&(Xc||n===null||Vc(n,n.return)),r&4){var o=n===null?null:n.memoizedState;if(r=e.memoizedState,n===null)if(r===null)if(e.stateNode===null){a:{r=e.type,n=e.memoizedProps,a=a.ownerDocument||a;b:switch(r){case`title`:o=a.getElementsByTagName(`title`)[0],(!o||o[st]||o[et]||o.namespaceURI===`http://www.w3.org/2000/svg`||o.hasAttribute(`itemprop`))&&(o=a.createElement(r),a.head.insertBefore(o,a.querySelector(`head > title`))),Pd(o,r,n),o[et]=e,G(o),r=o;break a;case`link`:var s=Vf(`link`,`href`,a).get(r+(n.href||``));if(s){for(var c=0;c<s.length;c++)if(o=s[c],o.getAttribute(`href`)===(n.href==null||n.href===``?null:n.href)&&o.getAttribute(`rel`)===(n.rel==null?null:n.rel)&&o.getAttribute(`title`)===(n.title==null?null:n.title)&&o.getAttribute(`crossorigin`)===(n.crossOrigin==null?null:n.crossOrigin)){s.splice(c,1);break b}}o=a.createElement(r),Pd(o,r,n),a.head.appendChild(o);break;case`meta`:if(s=Vf(`meta`,`content`,a).get(r+(n.content||``))){for(c=0;c<s.length;c++)if(o=s[c],o.getAttribute(`content`)===(n.content==null?null:``+n.content)&&o.getAttribute(`name`)===(n.name==null?null:n.name)&&o.getAttribute(`property`)===(n.property==null?null:n.property)&&o.getAttribute(`http-equiv`)===(n.httpEquiv==null?null:n.httpEquiv)&&o.getAttribute(`charset`)===(n.charSet==null?null:n.charSet)){s.splice(c,1);break b}}o=a.createElement(r),Pd(o,r,n),a.head.appendChild(o);break;default:throw Error(i(468,r))}o[et]=e,G(o),r=o}e.stateNode=r}else Hf(a,e.type,e.stateNode);else e.stateNode=If(a,r,e.memoizedProps);else o===r?r===null&&e.stateNode!==null&&Uc(e,e.memoizedProps,n.memoizedProps):(o===null?n.stateNode!==null&&(n=n.stateNode,n.parentNode.removeChild(n)):o.count--,r===null?Hf(a,e.type,e.stateNode):If(a,r,e.memoizedProps))}break;case 27:dl(t,e),ml(e),r&512&&(Xc||n===null||Vc(n,n.return)),n!==null&&r&4&&Uc(e,e.memoizedProps,n.memoizedProps);break;case 5:if(dl(t,e),ml(e),r&512&&(Xc||n===null||Vc(n,n.return)),e.flags&32){a=e.stateNode;try{Rt(a,``)}catch(t){Uu(e,e.return,t)}}r&4&&e.stateNode!=null&&(a=e.memoizedProps,Uc(e,a,n===null?a:n.memoizedProps)),r&1024&&(Zc=!0);break;case 6:if(dl(t,e),ml(e),r&4){if(e.stateNode===null)throw Error(i(162));r=e.memoizedProps,n=e.stateNode;try{n.nodeValue=r}catch(t){Uu(e,e.return,t)}}break;case 3:if(Bf=null,a=fl,fl=gf(t.containerInfo),dl(t,e),fl=a,ml(e),r&4&&n!==null&&n.memoizedState.isDehydrated)try{Np(t.containerInfo)}catch(t){Uu(e,e.return,t)}Zc&&(Zc=!1,hl(e));break;case 4:r=fl,fl=gf(e.stateNode.containerInfo),dl(t,e),ml(e),fl=r;break;case 12:dl(t,e),ml(e);break;case 31:dl(t,e),ml(e),r&4&&(r=e.updateQueue,r!==null&&(e.updateQueue=null,ul(e,r)));break;case 13:dl(t,e),ml(e),e.child.flags&8192&&e.memoizedState!==null!=(n!==null&&n.memoizedState!==null)&&(Zl=be()),r&4&&(r=e.updateQueue,r!==null&&(e.updateQueue=null,ul(e,r)));break;case 22:a=e.memoizedState!==null;var l=n!==null&&n.memoizedState!==null,u=Yc,d=Xc;if(Yc=u||a,Xc=d||l,dl(t,e),Xc=d,Yc=u,ml(e),r&8192)a:for(t=e.stateNode,t._visibility=a?t._visibility&-2:t._visibility|1,a&&(n===null||l||Yc||Xc||_l(e)),n=null,t=e;;){if(t.tag===5||t.tag===26){if(n===null){l=n=t;try{if(o=l.stateNode,a)s=o.style,typeof s.setProperty==`function`?s.setProperty(`display`,`none`,`important`):s.display=`none`;else{c=l.stateNode;var f=l.memoizedProps.style,p=f!=null&&f.hasOwnProperty(`display`)?f.display:null;c.style.display=p==null||typeof p==`boolean`?``:(``+p).trim()}}catch(e){Uu(l,l.return,e)}}}else if(t.tag===6){if(n===null){l=t;try{l.stateNode.nodeValue=a?``:l.memoizedProps}catch(e){Uu(l,l.return,e)}}}else if(t.tag===18){if(n===null){l=t;try{var m=l.stateNode;a?$d(m,!0):$d(l.stateNode,!1)}catch(e){Uu(l,l.return,e)}}}else if((t.tag!==22&&t.tag!==23||t.memoizedState===null||t===e)&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break a;for(;t.sibling===null;){if(t.return===null||t.return===e)break a;n===t&&(n=null),t=t.return}n===t&&(n=null),t.sibling.return=t.return,t=t.sibling}r&4&&(r=e.updateQueue,r!==null&&(n=r.retryQueue,n!==null&&(r.retryQueue=null,ul(e,n))));break;case 19:dl(t,e),ml(e),r&4&&(r=e.updateQueue,r!==null&&(e.updateQueue=null,ul(e,r)));break;case 30:break;case 21:break;default:dl(t,e),ml(e)}}function ml(e){var t=e.flags;if(t&2){try{for(var n,r=e.return;r!==null;){if(Wc(r)){n=r;break}r=r.return}if(n==null)throw Error(i(160));switch(n.tag){case 27:var a=n.stateNode;qc(e,Gc(e),a);break;case 5:var o=n.stateNode;n.flags&32&&(Rt(o,``),n.flags&=-33),qc(e,Gc(e),o);break;case 3:case 4:var s=n.stateNode.containerInfo;Kc(e,Gc(e),s);break;default:throw Error(i(161))}}catch(t){Uu(e,e.return,t)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function hl(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var t=e;hl(t),t.tag===5&&t.flags&1024&&t.stateNode.reset(),e=e.sibling}}function gl(e,t){if(t.subtreeFlags&8772)for(t=t.child;t!==null;)tl(e,t.alternate,t),t=t.sibling}function _l(e){for(e=e.child;e!==null;){var t=e;switch(t.tag){case 0:case 11:case 14:case 15:Lc(4,t,t.return),_l(t);break;case 1:Vc(t,t.return);var n=t.stateNode;typeof n.componentWillUnmount==`function`&&zc(t,t.return,n),_l(t);break;case 27:pf(t.stateNode);case 26:case 5:Vc(t,t.return),_l(t);break;case 22:t.memoizedState===null&&_l(t);break;case 30:_l(t);break;default:_l(t)}e=e.sibling}}function vl(e,t,n){for(n&&=(t.subtreeFlags&8772)!=0,t=t.child;t!==null;){var r=t.alternate,i=e,a=t,o=a.flags;switch(a.tag){case 0:case 11:case 15:vl(i,a,n),Ic(4,a);break;case 1:if(vl(i,a,n),r=a,i=r.stateNode,typeof i.componentDidMount==`function`)try{i.componentDidMount()}catch(e){Uu(r,r.return,e)}if(r=a,i=r.updateQueue,i!==null){var s=r.stateNode;try{var c=i.shared.hiddenCallbacks;if(c!==null)for(i.shared.hiddenCallbacks=null,i=0;i<c.length;i++)Va(c[i],s)}catch(e){Uu(r,r.return,e)}}n&&o&64&&Rc(a),Bc(a,a.return);break;case 27:Jc(a);case 26:case 5:vl(i,a,n),n&&r===null&&o&4&&Hc(a),Bc(a,a.return);break;case 12:vl(i,a,n);break;case 31:vl(i,a,n),n&&o&4&&sl(i,a);break;case 13:vl(i,a,n),n&&o&4&&cl(i,a);break;case 22:a.memoizedState===null&&vl(i,a,n),Bc(a,a.return);break;case 30:break;default:vl(i,a,n)}t=t.sibling}}function yl(e,t){var n=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),e=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(e=t.memoizedState.cachePool.pool),e!==n&&(e!=null&&e.refCount++,n!=null&&ea(n))}function bl(e,t){e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&ea(e))}function xl(e,t,n,r){if(t.subtreeFlags&10256)for(t=t.child;t!==null;)Sl(e,t,n,r),t=t.sibling}function Sl(e,t,n,r){var i=t.flags;switch(t.tag){case 0:case 11:case 15:xl(e,t,n,r),i&2048&&Ic(9,t);break;case 1:xl(e,t,n,r);break;case 3:xl(e,t,n,r),i&2048&&(e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&ea(e)));break;case 12:if(i&2048){xl(e,t,n,r),e=t.stateNode;try{var a=t.memoizedProps,o=a.id,s=a.onPostCommit;typeof s==`function`&&s(o,t.alternate===null?`mount`:`update`,e.passiveEffectDuration,-0)}catch(e){Uu(t,t.return,e)}}else xl(e,t,n,r);break;case 31:xl(e,t,n,r);break;case 13:xl(e,t,n,r);break;case 23:break;case 22:a=t.stateNode,o=t.alternate,t.memoizedState===null?a._visibility&2?xl(e,t,n,r):(a._visibility|=2,Cl(e,t,n,r,(t.subtreeFlags&10256)!=0||!1)):a._visibility&2?xl(e,t,n,r):wl(e,t),i&2048&&yl(o,t);break;case 24:xl(e,t,n,r),i&2048&&bl(t.alternate,t);break;default:xl(e,t,n,r)}}function Cl(e,t,n,r,i){for(i&&=(t.subtreeFlags&10256)!=0||!1,t=t.child;t!==null;){var a=e,o=t,s=n,c=r,l=o.flags;switch(o.tag){case 0:case 11:case 15:Cl(a,o,s,c,i),Ic(8,o);break;case 23:break;case 22:var u=o.stateNode;o.memoizedState===null?(u._visibility|=2,Cl(a,o,s,c,i)):u._visibility&2?Cl(a,o,s,c,i):wl(a,o),i&&l&2048&&yl(o.alternate,o);break;case 24:Cl(a,o,s,c,i),i&&l&2048&&bl(o.alternate,o);break;default:Cl(a,o,s,c,i)}t=t.sibling}}function wl(e,t){if(t.subtreeFlags&10256)for(t=t.child;t!==null;){var n=e,r=t,i=r.flags;switch(r.tag){case 22:wl(n,r),i&2048&&yl(r.alternate,r);break;case 24:wl(n,r),i&2048&&bl(r.alternate,r);break;default:wl(n,r)}t=t.sibling}}var Tl=8192;function El(e,t,n){if(e.subtreeFlags&Tl)for(e=e.child;e!==null;)Dl(e,t,n),e=e.sibling}function Dl(e,t,n){switch(e.tag){case 26:El(e,t,n),e.flags&Tl&&e.memoizedState!==null&&Gf(n,fl,e.memoizedState,e.memoizedProps);break;case 5:El(e,t,n);break;case 3:case 4:var r=fl;fl=gf(e.stateNode.containerInfo),El(e,t,n),fl=r;break;case 22:e.memoizedState===null&&(r=e.alternate,r!==null&&r.memoizedState!==null?(r=Tl,Tl=16777216,El(e,t,n),Tl=r):El(e,t,n));break;default:El(e,t,n)}}function Ol(e){var t=e.alternate;if(t!==null&&(e=t.child,e!==null)){t.child=null;do t=e.sibling,e.sibling=null,e=t;while(e!==null)}}function kl(e){var t=e.deletions;if(e.flags&16){if(t!==null)for(var n=0;n<t.length;n++){var r=t[n];$c=r,Ml(r,e)}Ol(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)Al(e),e=e.sibling}function Al(e){switch(e.tag){case 0:case 11:case 15:kl(e),e.flags&2048&&Lc(9,e,e.return);break;case 3:kl(e);break;case 12:kl(e);break;case 22:var t=e.stateNode;e.memoizedState!==null&&t._visibility&2&&(e.return===null||e.return.tag!==13)?(t._visibility&=-3,jl(e)):kl(e);break;default:kl(e)}}function jl(e){var t=e.deletions;if(e.flags&16){if(t!==null)for(var n=0;n<t.length;n++){var r=t[n];$c=r,Ml(r,e)}Ol(e)}for(e=e.child;e!==null;){switch(t=e,t.tag){case 0:case 11:case 15:Lc(8,t,t.return),jl(t);break;case 22:n=t.stateNode,n._visibility&2&&(n._visibility&=-3,jl(t));break;default:jl(t)}e=e.sibling}}function Ml(e,t){for(;$c!==null;){var n=$c;switch(n.tag){case 0:case 11:case 15:Lc(8,n,t);break;case 23:case 22:if(n.memoizedState!==null&&n.memoizedState.cachePool!==null){var r=n.memoizedState.cachePool.pool;r!=null&&r.refCount++}break;case 24:ea(n.memoizedState.cache)}if(r=n.child,r!==null)r.return=n,$c=r;else a:for(n=e;$c!==null;){r=$c;var i=r.sibling,a=r.return;if(nl(r),r===n){$c=null;break a}if(i!==null){i.return=a,$c=i;break a}$c=a}}}var Nl={getCacheForType:function(e){var t=Ki(Qi),n=t.data.get(e);return n===void 0&&(n=e(),t.data.set(e,n)),n},cacheSignal:function(){return Ki(Qi).controller.signal}},Pl=typeof WeakMap==`function`?WeakMap:Map,X=0,Fl=null,Z=null,Q=0,Il=0,Ll=null,Rl=!1,zl=!1,Bl=!1,Vl=0,Hl=0,Ul=0,Wl=0,Gl=0,Kl=0,ql=0,Jl=null,Yl=null,Xl=!1,Zl=0,Ql=0,$l=1/0,eu=null,tu=null,nu=0,ru=null,iu=null,au=0,ou=0,su=null,cu=null,lu=0,uu=null;function du(){return X&2&&Q!==0?Q&-Q:I.T===null?Ze():ud()}function fu(){if(Kl===0)if(!(Q&536870912)||J){var e=Le;Le<<=1,!(Le&3932160)&&(Le=262144),Kl=e}else Kl=536870912;return e=Ja.current,e!==null&&(e.flags|=32),Kl}function pu(e,t,n){(e===Fl&&(Il===2||Il===9)||e.cancelPendingCommit!==null)&&(bu(e,0),_u(e,Q,Kl,!1)),Ge(e,n),(!(X&2)||e!==Fl)&&(e===Fl&&(!(X&2)&&(Wl|=n),Hl===4&&_u(e,Q,Kl,!1)),nd(e))}function mu(e,t,n){if(X&6)throw Error(i(327));var r=!n&&(t&127)==0&&(t&e.expiredLanes)===0||Ve(e,t),a=r?Ou(e,t):Eu(e,t,!0),o=r;do{if(a===0){zl&&!r&&_u(e,t,0,!1);break}else{if(n=e.current.alternate,o&&!gu(n)){a=Eu(e,t,!1),o=!1;continue}if(a===2){if(o=t,e.errorRecoveryDisabledLanes&o)var s=0;else s=e.pendingLanes&-536870913,s=s===0?s&536870912?536870912:0:s;if(s!==0){t=s;a:{var c=e;a=Jl;var l=c.current.memoizedState.isDehydrated;if(l&&(bu(c,s).flags|=256),s=Eu(c,s,!1),s!==2){if(Bl&&!l){c.errorRecoveryDisabledLanes|=o,Wl|=o,a=4;break a}o=Yl,Yl=a,o!==null&&(Yl===null?Yl=o:Yl.push.apply(Yl,o))}a=s}if(o=!1,a!==2)continue}}if(a===1){bu(e,0),_u(e,t,0,!0);break}a:{switch(r=e,o=a,o){case 0:case 1:throw Error(i(345));case 4:if((t&4194048)!==t)break;case 6:_u(r,t,Kl,!Rl);break a;case 2:Yl=null;break;case 3:case 5:break;default:throw Error(i(329))}if((t&62914560)===t&&(a=Zl+300-be(),10<a)){if(_u(r,t,Kl,!Rl),Be(r,0,!0)!==0)break a;au=t,r.timeoutHandle=Kd(hu.bind(null,r,n,Yl,eu,Xl,t,Kl,Wl,ql,Rl,o,`Throttled`,-0,0),a);break a}hu(r,n,Yl,eu,Xl,t,Kl,Wl,ql,Rl,o,null,-0,0)}}break}while(1);nd(e)}function hu(e,t,n,r,i,a,o,s,c,l,u,d,f,p){if(e.timeoutHandle=-1,d=t.subtreeFlags,d&8192||(d&16785408)==16785408){d={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:Kt},Dl(t,a,d);var m=(a&62914560)===a?Zl-be():(a&4194048)===a?Ql-be():0;if(m=qf(d,m),m!==null){au=a,e.cancelPendingCommit=m(Fu.bind(null,e,t,a,n,r,i,o,s,c,u,d,null,f,p)),_u(e,a,o,!l);return}}Fu(e,t,a,n,r,i,o,s,c)}function gu(e){for(var t=e;;){var n=t.tag;if((n===0||n===11||n===15)&&t.flags&16384&&(n=t.updateQueue,n!==null&&(n=n.stores,n!==null)))for(var r=0;r<n.length;r++){var i=n[r],a=i.getSnapshot;i=i.value;try{if(!pr(a(),i))return!1}catch{return!1}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function _u(e,t,n,r){t&=~Gl,t&=~Wl,e.suspendedLanes|=t,e.pingedLanes&=~t,r&&(e.warmLanes|=t),r=e.expirationTimes;for(var i=t;0<i;){var a=31-Me(i),o=1<<a;r[a]=-1,i&=~o}n!==0&&Ke(e,n,t)}function vu(){return X&6?!0:(rd(0,!1),!1)}function yu(){if(Z!==null){if(Il===0)var e=Z.return;else e=Z,Ri=Li=null,So(e),Ca=null,wa=0,e=Z;for(;e!==null;)Fc(e.alternate,e),e=e.return;Z=null}}function bu(e,t){var n=e.timeoutHandle;n!==-1&&(e.timeoutHandle=-1,qd(n)),n=e.cancelPendingCommit,n!==null&&(e.cancelPendingCommit=null,n()),au=0,yu(),Fl=e,Z=n=ti(e.current,null),Q=t,Il=0,Ll=null,Rl=!1,zl=Ve(e,t),Bl=!1,ql=Kl=Gl=Wl=Ul=Hl=0,Yl=Jl=null,Xl=!1,t&8&&(t|=t&32);var r=e.entangledLanes;if(r!==0)for(e=e.entanglements,r&=t;0<r;){var i=31-Me(r),a=1<<i;t|=e[i],r&=~a}return Vl=t,Gr(),n}function xu(e,t){Y=null,I.H=Ms,t===pa||t===ha?(t=xa(),Il=3):t===ma?(t=xa(),Il=4):Il=t===Xs?8:typeof t==`object`&&t&&typeof t.then==`function`?6:1,Ll=t,Z===null&&(Hl=1,Ws(e,li(t,e.current)))}function Su(){var e=Ja.current;return e===null?!0:(Q&4194048)===Q?Ya===null:(Q&62914560)===Q||Q&536870912?e===Ya:!1}function Cu(){var e=I.H;return I.H=Ms,e===null?Ms:e}function wu(){var e=I.A;return I.A=Nl,e}function Tu(){Hl=4,Rl||(Q&4194048)!==Q&&Ja.current!==null||(zl=!0),!(Ul&134217727)&&!(Wl&134217727)||Fl===null||_u(Fl,Q,Kl,!1)}function Eu(e,t,n){var r=X;X|=2;var i=Cu(),a=wu();(Fl!==e||Q!==t)&&(eu=null,bu(e,t)),t=!1;var o=Hl;a:do try{if(Il!==0&&Z!==null){var s=Z,c=Ll;switch(Il){case 8:yu(),o=6;break a;case 3:case 2:case 9:case 6:Ja.current===null&&(t=!0);var l=Il;if(Il=0,Ll=null,Mu(e,s,c,l),n&&zl){o=0;break a}break;default:l=Il,Il=0,Ll=null,Mu(e,s,c,l)}}Du(),o=Hl;break}catch(t){xu(e,t)}while(1);return t&&e.shellSuspendCounter++,Ri=Li=null,X=r,I.H=i,I.A=a,Z===null&&(Fl=null,Q=0,Gr()),o}function Du(){for(;Z!==null;)Au(Z)}function Ou(e,t){var n=X;X|=2;var r=Cu(),a=wu();Fl!==e||Q!==t?(eu=null,$l=be()+500,bu(e,t)):zl=Ve(e,t);a:do try{if(Il!==0&&Z!==null){t=Z;var o=Ll;b:switch(Il){case 1:Il=0,Ll=null,Mu(e,t,o,1);break;case 2:case 9:if(_a(o)){Il=0,Ll=null,ju(t);break}t=function(){Il!==2&&Il!==9||Fl!==e||(Il=7),nd(e)},o.then(t,t);break a;case 3:Il=7;break a;case 4:Il=5;break a;case 7:_a(o)?(Il=0,Ll=null,ju(t)):(Il=0,Ll=null,Mu(e,t,o,7));break;case 5:var s=null;switch(Z.tag){case 26:s=Z.memoizedState;case 5:case 27:var c=Z;if(s?Wf(s):c.stateNode.complete){Il=0,Ll=null;var l=c.sibling;if(l!==null)Z=l;else{var u=c.return;u===null?Z=null:(Z=u,Nu(u))}break b}}Il=0,Ll=null,Mu(e,t,o,5);break;case 6:Il=0,Ll=null,Mu(e,t,o,6);break;case 8:yu(),Hl=6;break a;default:throw Error(i(462))}}ku();break}catch(t){xu(e,t)}while(1);return Ri=Li=null,I.H=r,I.A=a,X=n,Z===null?(Fl=null,Q=0,Gr(),Hl):0}function ku(){for(;Z!==null&&!ve();)Au(Z)}function Au(e){var t=Ec(e.alternate,e,Vl);e.memoizedProps=e.pendingProps,t===null?Nu(e):Z=t}function ju(e){var t=e,n=t.alternate;switch(t.tag){case 15:case 0:t=uc(n,t,t.pendingProps,t.type,void 0,Q);break;case 11:t=uc(n,t,t.pendingProps,t.type.render,t.ref,Q);break;case 5:So(t);default:Fc(n,t),t=Z=ni(t,Vl),t=Ec(n,t,Vl)}e.memoizedProps=e.pendingProps,t===null?Nu(e):Z=t}function Mu(e,t,n,r){Ri=Li=null,So(t),Ca=null,wa=0;var i=t.return;try{if(Ys(e,i,t,n,Q)){Hl=1,Ws(e,li(n,e.current)),Z=null;return}}catch(t){if(i!==null)throw Z=i,t;Hl=1,Ws(e,li(n,e.current)),Z=null;return}t.flags&32768?(J||r===1?e=!0:zl||Q&536870912?e=!1:(Rl=e=!0,(r===2||r===9||r===3||r===6)&&(r=Ja.current,r!==null&&r.tag===13&&(r.flags|=16384))),Pu(t,e)):Nu(t)}function Nu(e){var t=e;do{if(t.flags&32768){Pu(t,Rl);return}e=t.return;var n=Nc(t.alternate,t,Vl);if(n!==null){Z=n;return}if(t=t.sibling,t!==null){Z=t;return}Z=t=e}while(t!==null);Hl===0&&(Hl=5)}function Pu(e,t){do{var n=Pc(e.alternate,e);if(n!==null){n.flags&=32767,Z=n;return}if(n=e.return,n!==null&&(n.flags|=32768,n.subtreeFlags=0,n.deletions=null),!t&&(e=e.sibling,e!==null)){Z=e;return}Z=e=n}while(e!==null);Hl=6,Z=null}function Fu(e,t,n,r,a,o,s,c,l){e.cancelPendingCommit=null;do Bu();while(nu!==0);if(X&6)throw Error(i(327));if(t!==null){if(t===e.current)throw Error(i(177));if(o=t.lanes|t.childLanes,o|=Wr,W(e,n,o,s,c,l),e===Fl&&(Z=Fl=null,Q=0),iu=t,ru=e,au=n,ou=o,su=a,cu=r,t.subtreeFlags&10256||t.flags&10256?(e.callbackNode=null,e.callbackPriority=0,Yu(we,function(){return Vu(),null})):(e.callbackNode=null,e.callbackPriority=0),r=(t.flags&13878)!=0,t.subtreeFlags&13878||r){r=I.T,I.T=null,a=L.p,L.p=2,s=X,X|=4;try{el(e,t,n)}finally{X=s,L.p=a,I.T=r}}nu=1,Iu(),Lu(),Ru()}}function Iu(){if(nu===1){nu=0;var e=ru,t=iu,n=(t.flags&13878)!=0;if(t.subtreeFlags&13878||n){n=I.T,I.T=null;var r=L.p;L.p=2;var i=X;X|=4;try{pl(t,e);var a=zd,o=vr(e.containerInfo),s=a.focusedElem,c=a.selectionRange;if(o!==s&&s&&s.ownerDocument&&_r(s.ownerDocument.documentElement,s)){if(c!==null&&yr(s)){var l=c.start,u=c.end;if(u===void 0&&(u=l),`selectionStart`in s)s.selectionStart=l,s.selectionEnd=Math.min(u,s.value.length);else{var d=s.ownerDocument||document,f=d&&d.defaultView||window;if(f.getSelection){var p=f.getSelection(),m=s.textContent.length,h=Math.min(c.start,m),g=c.end===void 0?h:Math.min(c.end,m);!p.extend&&h>g&&(o=g,g=h,h=o);var _=gr(s,h),v=gr(s,g);if(_&&v&&(p.rangeCount!==1||p.anchorNode!==_.node||p.anchorOffset!==_.offset||p.focusNode!==v.node||p.focusOffset!==v.offset)){var y=d.createRange();y.setStart(_.node,_.offset),p.removeAllRanges(),h>g?(p.addRange(y),p.extend(v.node,v.offset)):(y.setEnd(v.node,v.offset),p.addRange(y))}}}}for(d=[],p=s;p=p.parentNode;)p.nodeType===1&&d.push({element:p,left:p.scrollLeft,top:p.scrollTop});for(typeof s.focus==`function`&&s.focus(),s=0;s<d.length;s++){var b=d[s];b.element.scrollLeft=b.left,b.element.scrollTop=b.top}}sp=!!Rd,zd=Rd=null}finally{X=i,L.p=r,I.T=n}}e.current=t,nu=2}}function Lu(){if(nu===2){nu=0;var e=ru,t=iu,n=(t.flags&8772)!=0;if(t.subtreeFlags&8772||n){n=I.T,I.T=null;var r=L.p;L.p=2;var i=X;X|=4;try{tl(e,t.alternate,t)}finally{X=i,L.p=r,I.T=n}}nu=3}}function Ru(){if(nu===4||nu===3){nu=0,ye();var e=ru,t=iu,n=au,r=cu;t.subtreeFlags&10256||t.flags&10256?nu=5:(nu=0,iu=ru=null,zu(e,e.pendingLanes));var i=e.pendingLanes;if(i===0&&(tu=null),Xe(n),t=t.stateNode,Ae&&typeof Ae.onCommitFiberRoot==`function`)try{Ae.onCommitFiberRoot(ke,t,void 0,(t.current.flags&128)==128)}catch{}if(r!==null){t=I.T,i=L.p,L.p=2,I.T=null;try{for(var a=e.onRecoverableError,o=0;o<r.length;o++){var s=r[o];a(s.value,{componentStack:s.stack})}}finally{I.T=t,L.p=i}}au&3&&Bu(),nd(e),i=e.pendingLanes,n&261930&&i&42?e===uu?lu++:(lu=0,uu=e):lu=0,rd(0,!1)}}function zu(e,t){(e.pooledCacheLanes&=t)===0&&(t=e.pooledCache,t!=null&&(e.pooledCache=null,ea(t)))}function Bu(){return Iu(),Lu(),Ru(),Vu()}function Vu(){if(nu!==5)return!1;var e=ru,t=ou;ou=0;var n=Xe(au),r=I.T,a=L.p;try{L.p=32>n?32:n,I.T=null,n=su,su=null;var o=ru,s=au;if(nu=0,iu=ru=null,au=0,X&6)throw Error(i(331));var c=X;if(X|=4,Al(o.current),Sl(o,o.current,s,n),X=c,rd(0,!1),Ae&&typeof Ae.onPostCommitFiberRoot==`function`)try{Ae.onPostCommitFiberRoot(ke,o)}catch{}return!0}finally{L.p=a,I.T=r,zu(e,t)}}function Hu(e,t,n){t=li(n,t),t=Ks(e.stateNode,t,2),e=Fa(e,t,2),e!==null&&(Ge(e,2),nd(e))}function Uu(e,t,n){if(e.tag===3)Hu(e,e,n);else for(;t!==null;){if(t.tag===3){Hu(t,e,n);break}else if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError==`function`||typeof r.componentDidCatch==`function`&&(tu===null||!tu.has(r))){e=li(n,e),n=qs(2),r=Fa(t,n,2),r!==null&&(Js(n,r,t,e),Ge(r,2),nd(r));break}}t=t.return}}function Wu(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new Pl;var i=new Set;r.set(t,i)}else i=r.get(t),i===void 0&&(i=new Set,r.set(t,i));i.has(n)||(Bl=!0,i.add(n),e=Gu.bind(null,e,t,n),t.then(e,e))}function Gu(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),e.pingedLanes|=e.suspendedLanes&n,e.warmLanes&=~n,Fl===e&&(Q&n)===n&&(Hl===4||Hl===3&&(Q&62914560)===Q&&300>be()-Zl?!(X&2)&&bu(e,0):Gl|=n,ql===Q&&(ql=0)),nd(e)}function Ku(e,t){t===0&&(t=Ue()),e=Jr(e,t),e!==null&&(Ge(e,t),nd(e))}function qu(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),Ku(e,n)}function Ju(e,t){var n=0;switch(e.tag){case 31:case 13:var r=e.stateNode,a=e.memoizedState;a!==null&&(n=a.retryLane);break;case 19:r=e.stateNode;break;case 22:r=e.stateNode._retryCache;break;default:throw Error(i(314))}r!==null&&r.delete(t),Ku(e,n)}function Yu(e,t){return ge(e,t)}var Xu=null,Zu=null,Qu=!1,$u=!1,ed=!1,td=0;function nd(e){e!==Zu&&e.next===null&&(Zu===null?Xu=Zu=e:Zu=Zu.next=e),$u=!0,Qu||(Qu=!0,ld())}function rd(e,t){if(!ed&&$u){ed=!0;do for(var n=!1,r=Xu;r!==null;){if(!t)if(e!==0){var i=r.pendingLanes;if(i===0)var a=0;else{var o=r.suspendedLanes,s=r.pingedLanes;a=(1<<31-Me(42|e)+1)-1,a&=i&~(o&~s),a=a&201326741?a&201326741|1:a?a|2:0}a!==0&&(n=!0,cd(r,a))}else a=Q,a=Be(r,r===Fl?a:0,r.cancelPendingCommit!==null||r.timeoutHandle!==-1),!(a&3)||Ve(r,a)||(n=!0,cd(r,a));r=r.next}while(n);ed=!1}}function id(){ad()}function ad(){$u=Qu=!1;var e=0;td!==0&&Gd()&&(e=td);for(var t=be(),n=null,r=Xu;r!==null;){var i=r.next,a=od(r,t);a===0?(r.next=null,n===null?Xu=i:n.next=i,i===null&&(Zu=n)):(n=r,(e!==0||a&3)&&($u=!0)),r=i}nu!==0&&nu!==5||rd(e,!1),td!==0&&(td=0)}function od(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,i=e.expirationTimes,a=e.pendingLanes&-62914561;0<a;){var o=31-Me(a),s=1<<o,c=i[o];c===-1?((s&n)===0||(s&r)!==0)&&(i[o]=He(s,t)):c<=t&&(e.expiredLanes|=s),a&=~s}if(t=Fl,n=Q,n=Be(e,e===t?n:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),r=e.callbackNode,n===0||e===t&&(Il===2||Il===9)||e.cancelPendingCommit!==null)return r!==null&&r!==null&&_e(r),e.callbackNode=null,e.callbackPriority=0;if(!(n&3)||Ve(e,n)){if(t=n&-n,t===e.callbackPriority)return t;switch(r!==null&&_e(r),Xe(n)){case 2:case 8:n=Ce;break;case 32:n=we;break;case 268435456:n=Ee;break;default:n=we}return r=sd.bind(null,e),n=ge(n,r),e.callbackPriority=t,e.callbackNode=n,t}return r!==null&&r!==null&&_e(r),e.callbackPriority=2,e.callbackNode=null,2}function sd(e,t){if(nu!==0&&nu!==5)return e.callbackNode=null,e.callbackPriority=0,null;var n=e.callbackNode;if(Bu()&&e.callbackNode!==n)return null;var r=Q;return r=Be(e,e===Fl?r:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),r===0?null:(mu(e,r,t),od(e,be()),e.callbackNode!=null&&e.callbackNode===n?sd.bind(null,e):null)}function cd(e,t){if(Bu())return null;mu(e,t,!0)}function ld(){Yd(function(){X&6?ge(Se,id):ad()})}function ud(){if(td===0){var e=ra;e===0&&(e=Ie,Ie<<=1,!(Ie&261888)&&(Ie=256)),td=e}return td}function dd(e){return e==null||typeof e==`symbol`||typeof e==`boolean`?null:typeof e==`function`?e:Gt(``+e)}function fd(e,t){var n=t.ownerDocument.createElement(`input`);return n.name=t.name,n.value=t.value,e.id&&n.setAttribute(`form`,e.id),t.parentNode.insertBefore(n,t),e=new FormData(e),n.parentNode.removeChild(n),e}function pd(e,t,n,r,i){if(t===`submit`&&n&&n.stateNode===i){var a=dd((i[tt]||null).action),o=r.submitter;o&&(t=(t=o[tt]||null)?dd(t.formAction):o.getAttribute(`formAction`),t!==null&&(a=t,o=null));var s=new mn(`action`,`action`,null,r,i);e.push({event:s,listeners:[{instance:null,listener:function(){if(r.defaultPrevented){if(td!==0){var e=o?fd(i,o):new FormData(i);vs(n,{pending:!0,data:e,method:i.method,action:a},null,e)}}else typeof a==`function`&&(s.preventDefault(),e=o?fd(i,o):new FormData(i),vs(n,{pending:!0,data:e,method:i.method,action:a},a,e))},currentTarget:i}]})}}for(var md=0;md<zr.length;md++){var hd=zr[md];Br(hd.toLowerCase(),`on`+(hd[0].toUpperCase()+hd.slice(1)))}Br(jr,`onAnimationEnd`),Br(Mr,`onAnimationIteration`),Br(Nr,`onAnimationStart`),Br(`dblclick`,`onDoubleClick`),Br(`focusin`,`onFocus`),Br(`focusout`,`onBlur`),Br(Pr,`onTransitionRun`),Br(Fr,`onTransitionStart`),Br(Ir,`onTransitionCancel`),Br(Lr,`onTransitionEnd`),gt(`onMouseEnter`,[`mouseout`,`mouseover`]),gt(`onMouseLeave`,[`mouseout`,`mouseover`]),gt(`onPointerEnter`,[`pointerout`,`pointerover`]),gt(`onPointerLeave`,[`pointerout`,`pointerover`]),ht(`onChange`,`change click focusin focusout input keydown keyup selectionchange`.split(` `)),ht(`onSelect`,`focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange`.split(` `)),ht(`onBeforeInput`,[`compositionend`,`keypress`,`textInput`,`paste`]),ht(`onCompositionEnd`,`compositionend focusout keydown keypress keyup mousedown`.split(` `)),ht(`onCompositionStart`,`compositionstart focusout keydown keypress keyup mousedown`.split(` `)),ht(`onCompositionUpdate`,`compositionupdate focusout keydown keypress keyup mousedown`.split(` `));var gd=`abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting`.split(` `),_d=new Set(`beforetoggle cancel close invalid load scroll scrollend toggle`.split(` `).concat(gd));function vd(e,t){t=(t&4)!=0;for(var n=0;n<e.length;n++){var r=e[n],i=r.event;r=r.listeners;a:{var a=void 0;if(t)for(var o=r.length-1;0<=o;o--){var s=r[o],c=s.instance,l=s.currentTarget;if(s=s.listener,c!==a&&i.isPropagationStopped())break a;a=s,i.currentTarget=l;try{a(i)}catch(e){Vr(e)}i.currentTarget=null,a=c}else for(o=0;o<r.length;o++){if(s=r[o],c=s.instance,l=s.currentTarget,s=s.listener,c!==a&&i.isPropagationStopped())break a;a=s,i.currentTarget=l;try{a(i)}catch(e){Vr(e)}i.currentTarget=null,a=c}}}}function $(e,t){var n=t[rt];n===void 0&&(n=t[rt]=new Set);var r=e+`__bubble`;n.has(r)||(Sd(t,e,2,!1),n.add(r))}function yd(e,t,n){var r=0;t&&(r|=4),Sd(n,e,r,t)}var bd=`_reactListening`+Math.random().toString(36).slice(2);function xd(e){if(!e[bd]){e[bd]=!0,pt.forEach(function(t){t!==`selectionchange`&&(_d.has(t)||yd(t,!1,e),yd(t,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[bd]||(t[bd]=!0,yd(`selectionchange`,!1,t))}}function Sd(e,t,n,r){switch(mp(t)){case 2:var i=cp;break;case 8:i=lp;break;default:i=up}n=i.bind(null,t,n,e),i=void 0,!nn||t!==`touchstart`&&t!==`touchmove`&&t!==`wheel`||(i=!0),r?i===void 0?e.addEventListener(t,n,!0):e.addEventListener(t,n,{capture:!0,passive:i}):i===void 0?e.addEventListener(t,n,!1):e.addEventListener(t,n,{passive:i})}function Cd(e,t,n,r,i){var a=r;if(!(t&1)&&!(t&2)&&r!==null)a:for(;;){if(r===null)return;var s=r.tag;if(s===3||s===4){var c=r.stateNode.containerInfo;if(c===i)break;if(s===4)for(s=r.return;s!==null;){var l=s.tag;if((l===3||l===4)&&s.stateNode.containerInfo===i)return;s=s.return}for(;c!==null;){if(s=lt(c),s===null)return;if(l=s.tag,l===5||l===6||l===26||l===27){r=a=s;continue a}c=c.parentNode}}r=r.return}$t(function(){var r=a,i=Jt(n),s=[];a:{var c=Rr.get(e);if(c!==void 0){var l=mn,u=e;switch(e){case`keypress`:if(ln(n)===0)break a;case`keydown`:case`keyup`:l=Mn;break;case`focusin`:u=`focus`,l=Cn;break;case`focusout`:u=`blur`,l=Cn;break;case`beforeblur`:case`afterblur`:l=Cn;break;case`click`:if(n.button===2)break a;case`auxclick`:case`dblclick`:case`mousedown`:case`mousemove`:case`mouseup`:case`mouseout`:case`mouseover`:case`contextmenu`:l=xn;break;case`drag`:case`dragend`:case`dragenter`:case`dragexit`:case`dragleave`:case`dragover`:case`dragstart`:case`drop`:l=Sn;break;case`touchcancel`:case`touchend`:case`touchmove`:case`touchstart`:l=Pn;break;case jr:case Mr:case Nr:l=wn;break;case Lr:l=Fn;break;case`scroll`:case`scrollend`:l=gn;break;case`wheel`:l=In;break;case`copy`:case`cut`:case`paste`:l=Tn;break;case`gotpointercapture`:case`lostpointercapture`:case`pointercancel`:case`pointerdown`:case`pointermove`:case`pointerout`:case`pointerover`:case`pointerup`:l=Nn;break;case`toggle`:case`beforetoggle`:l=Ln}var d=(t&4)!=0,f=!d&&(e===`scroll`||e===`scrollend`),p=d?c===null?null:c+`Capture`:c;d=[];for(var m=r,h;m!==null;){var g=m;if(h=g.stateNode,g=g.tag,g!==5&&g!==26&&g!==27||h===null||p===null||(g=en(m,p),g!=null&&d.push(wd(m,g,h))),f)break;m=m.return}0<d.length&&(c=new l(c,u,null,n,i),s.push({event:c,listeners:d}))}}if(!(t&7)){a:{if(c=e===`mouseover`||e===`pointerover`,l=e===`mouseout`||e===`pointerout`,c&&n!==qt&&(u=n.relatedTarget||n.fromElement)&&(lt(u)||u[nt]))break a;if((l||c)&&(c=i.window===i?i:(c=i.ownerDocument)?c.defaultView||c.parentWindow:window,l?(u=n.relatedTarget||n.toElement,l=r,u=u?lt(u):null,u!==null&&(f=o(u),d=u.tag,u!==f||d!==5&&d!==27&&d!==6)&&(u=null)):(l=null,u=r),l!==u)){if(d=xn,g=`onMouseLeave`,p=`onMouseEnter`,m=`mouse`,(e===`pointerout`||e===`pointerover`)&&(d=Nn,g=`onPointerLeave`,p=`onPointerEnter`,m=`pointer`),f=l==null?c:dt(l),h=u==null?c:dt(u),c=new d(g,m+`leave`,l,n,i),c.target=f,c.relatedTarget=h,g=null,lt(i)===r&&(d=new d(p,m+`enter`,u,n,i),d.target=h,d.relatedTarget=f,g=d),f=g,l&&u)b:{for(d=Ed,p=l,m=u,h=0,g=p;g;g=d(g))h++;g=0;for(var _=m;_;_=d(_))g++;for(;0<h-g;)p=d(p),h--;for(;0<g-h;)m=d(m),g--;for(;h--;){if(p===m||m!==null&&p===m.alternate){d=p;break b}p=d(p),m=d(m)}d=null}else d=null;l!==null&&Dd(s,c,l,d,!1),u!==null&&f!==null&&Dd(s,f,u,d,!0)}}a:{if(c=r?dt(r):window,l=c.nodeName&&c.nodeName.toLowerCase(),l===`select`||l===`input`&&c.type===`file`)var v=tr;else if(Zn(c))if(nr)v=dr;else{v=lr;var y=cr}else l=c.nodeName,!l||l.toLowerCase()!==`input`||c.type!==`checkbox`&&c.type!==`radio`?r&&Ht(r.elementType)&&(v=tr):v=ur;if(v&&=v(e,r)){Qn(s,v,n,i);break a}y&&y(e,c,r),e===`focusout`&&r&&c.type===`number`&&r.memoizedProps.value!=null&&Pt(c,`number`,c.value)}switch(y=r?dt(r):window,e){case`focusin`:(Zn(y)||y.contentEditable===`true`)&&(xr=y,Sr=r,Cr=null);break;case`focusout`:Cr=Sr=xr=null;break;case`mousedown`:wr=!0;break;case`contextmenu`:case`mouseup`:case`dragend`:wr=!1,Tr(s,n,i);break;case`selectionchange`:if(br)break;case`keydown`:case`keyup`:Tr(s,n,i)}var b;if(zn)b:{switch(e){case`compositionstart`:var x=`onCompositionStart`;break b;case`compositionend`:x=`onCompositionEnd`;break b;case`compositionupdate`:x=`onCompositionUpdate`;break b}x=void 0}else qn?Gn(e,n)&&(x=`onCompositionEnd`):e===`keydown`&&n.keyCode===229&&(x=`onCompositionStart`);x&&(Hn&&n.locale!==`ko`&&(qn||x!==`onCompositionStart`?x===`onCompositionEnd`&&qn&&(b=cn()):(an=i,on=`value`in an?an.value:an.textContent,qn=!0)),y=Td(r,x),0<y.length&&(x=new En(x,e,null,n,i),s.push({event:x,listeners:y}),b?x.data=b:(b=Kn(n),b!==null&&(x.data=b)))),(b=Vn?Jn(e,n):Yn(e,n))&&(x=Td(r,`onBeforeInput`),0<x.length&&(y=new En(`onBeforeInput`,`beforeinput`,null,n,i),s.push({event:y,listeners:x}),y.data=b)),pd(s,e,r,n,i)}vd(s,t)})}function wd(e,t,n){return{instance:e,listener:t,currentTarget:n}}function Td(e,t){for(var n=t+`Capture`,r=[];e!==null;){var i=e,a=i.stateNode;if(i=i.tag,i!==5&&i!==26&&i!==27||a===null||(i=en(e,n),i!=null&&r.unshift(wd(e,i,a)),i=en(e,t),i!=null&&r.push(wd(e,i,a))),e.tag===3)return r;e=e.return}return[]}function Ed(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function Dd(e,t,n,r,i){for(var a=t._reactName,o=[];n!==null&&n!==r;){var s=n,c=s.alternate,l=s.stateNode;if(s=s.tag,c!==null&&c===r)break;s!==5&&s!==26&&s!==27||l===null||(c=l,i?(l=en(n,a),l!=null&&o.unshift(wd(n,l,c))):i||(l=en(n,a),l!=null&&o.push(wd(n,l,c)))),n=n.return}o.length!==0&&e.push({event:t,listeners:o})}var Od=/\r\n?/g,kd=/\u0000|\uFFFD/g;function Ad(e){return(typeof e==`string`?e:``+e).replace(Od,`
`).replace(kd,``)}function jd(e,t){return t=Ad(t),Ad(e)===t}function Md(e,t,n,r,a,o){switch(n){case`children`:typeof r==`string`?t===`body`||t===`textarea`&&r===``||Rt(e,r):(typeof r==`number`||typeof r==`bigint`)&&t!==`body`&&Rt(e,``+r);break;case`className`:St(e,`class`,r);break;case`tabIndex`:St(e,`tabindex`,r);break;case`dir`:case`role`:case`viewBox`:case`width`:case`height`:St(e,n,r);break;case`style`:Vt(e,r,o);break;case`data`:if(t!==`object`){St(e,`data`,r);break}case`src`:case`href`:if(r===``&&(t!==`a`||n!==`href`)){e.removeAttribute(n);break}if(r==null||typeof r==`function`||typeof r==`symbol`||typeof r==`boolean`){e.removeAttribute(n);break}r=Gt(``+r),e.setAttribute(n,r);break;case`action`:case`formAction`:if(typeof r==`function`){e.setAttribute(n,`javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')`);break}else typeof o==`function`&&(n===`formAction`?(t!==`input`&&Md(e,t,`name`,a.name,a,null),Md(e,t,`formEncType`,a.formEncType,a,null),Md(e,t,`formMethod`,a.formMethod,a,null),Md(e,t,`formTarget`,a.formTarget,a,null)):(Md(e,t,`encType`,a.encType,a,null),Md(e,t,`method`,a.method,a,null),Md(e,t,`target`,a.target,a,null)));if(r==null||typeof r==`symbol`||typeof r==`boolean`){e.removeAttribute(n);break}r=Gt(``+r),e.setAttribute(n,r);break;case`onClick`:r!=null&&(e.onclick=Kt);break;case`onScroll`:r!=null&&$(`scroll`,e);break;case`onScrollEnd`:r!=null&&$(`scrollend`,e);break;case`dangerouslySetInnerHTML`:if(r!=null){if(typeof r!=`object`||!(`__html`in r))throw Error(i(61));if(n=r.__html,n!=null){if(a.children!=null)throw Error(i(60));e.innerHTML=n}}break;case`multiple`:e.multiple=r&&typeof r!=`function`&&typeof r!=`symbol`;break;case`muted`:e.muted=r&&typeof r!=`function`&&typeof r!=`symbol`;break;case`suppressContentEditableWarning`:case`suppressHydrationWarning`:case`defaultValue`:case`defaultChecked`:case`innerHTML`:case`ref`:break;case`autoFocus`:break;case`xlinkHref`:if(r==null||typeof r==`function`||typeof r==`boolean`||typeof r==`symbol`){e.removeAttribute(`xlink:href`);break}n=Gt(``+r),e.setAttributeNS(`http://www.w3.org/1999/xlink`,`xlink:href`,n);break;case`contentEditable`:case`spellCheck`:case`draggable`:case`value`:case`autoReverse`:case`externalResourcesRequired`:case`focusable`:case`preserveAlpha`:r!=null&&typeof r!=`function`&&typeof r!=`symbol`?e.setAttribute(n,``+r):e.removeAttribute(n);break;case`inert`:case`allowFullScreen`:case`async`:case`autoPlay`:case`controls`:case`default`:case`defer`:case`disabled`:case`disablePictureInPicture`:case`disableRemotePlayback`:case`formNoValidate`:case`hidden`:case`loop`:case`noModule`:case`noValidate`:case`open`:case`playsInline`:case`readOnly`:case`required`:case`reversed`:case`scoped`:case`seamless`:case`itemScope`:r&&typeof r!=`function`&&typeof r!=`symbol`?e.setAttribute(n,``):e.removeAttribute(n);break;case`capture`:case`download`:!0===r?e.setAttribute(n,``):!1!==r&&r!=null&&typeof r!=`function`&&typeof r!=`symbol`?e.setAttribute(n,r):e.removeAttribute(n);break;case`cols`:case`rows`:case`size`:case`span`:r!=null&&typeof r!=`function`&&typeof r!=`symbol`&&!isNaN(r)&&1<=r?e.setAttribute(n,r):e.removeAttribute(n);break;case`rowSpan`:case`start`:r==null||typeof r==`function`||typeof r==`symbol`||isNaN(r)?e.removeAttribute(n):e.setAttribute(n,r);break;case`popover`:$(`beforetoggle`,e),$(`toggle`,e),xt(e,`popover`,r);break;case`xlinkActuate`:Ct(e,`http://www.w3.org/1999/xlink`,`xlink:actuate`,r);break;case`xlinkArcrole`:Ct(e,`http://www.w3.org/1999/xlink`,`xlink:arcrole`,r);break;case`xlinkRole`:Ct(e,`http://www.w3.org/1999/xlink`,`xlink:role`,r);break;case`xlinkShow`:Ct(e,`http://www.w3.org/1999/xlink`,`xlink:show`,r);break;case`xlinkTitle`:Ct(e,`http://www.w3.org/1999/xlink`,`xlink:title`,r);break;case`xlinkType`:Ct(e,`http://www.w3.org/1999/xlink`,`xlink:type`,r);break;case`xmlBase`:Ct(e,`http://www.w3.org/XML/1998/namespace`,`xml:base`,r);break;case`xmlLang`:Ct(e,`http://www.w3.org/XML/1998/namespace`,`xml:lang`,r);break;case`xmlSpace`:Ct(e,`http://www.w3.org/XML/1998/namespace`,`xml:space`,r);break;case`is`:xt(e,`is`,r);break;case`innerText`:case`textContent`:break;default:(!(2<n.length)||n[0]!==`o`&&n[0]!==`O`||n[1]!==`n`&&n[1]!==`N`)&&(n=Ut.get(n)||n,xt(e,n,r))}}function Nd(e,t,n,r,a,o){switch(n){case`style`:Vt(e,r,o);break;case`dangerouslySetInnerHTML`:if(r!=null){if(typeof r!=`object`||!(`__html`in r))throw Error(i(61));if(n=r.__html,n!=null){if(a.children!=null)throw Error(i(60));e.innerHTML=n}}break;case`children`:typeof r==`string`?Rt(e,r):(typeof r==`number`||typeof r==`bigint`)&&Rt(e,``+r);break;case`onScroll`:r!=null&&$(`scroll`,e);break;case`onScrollEnd`:r!=null&&$(`scrollend`,e);break;case`onClick`:r!=null&&(e.onclick=Kt);break;case`suppressContentEditableWarning`:case`suppressHydrationWarning`:case`innerHTML`:case`ref`:break;case`innerText`:case`textContent`:break;default:if(!mt.hasOwnProperty(n))a:{if(n[0]===`o`&&n[1]===`n`&&(a=n.endsWith(`Capture`),t=n.slice(2,a?n.length-7:void 0),o=e[tt]||null,o=o==null?null:o[n],typeof o==`function`&&e.removeEventListener(t,o,a),typeof r==`function`)){typeof o!=`function`&&o!==null&&(n in e?e[n]=null:e.hasAttribute(n)&&e.removeAttribute(n)),e.addEventListener(t,r,a);break a}n in e?e[n]=r:!0===r?e.setAttribute(n,``):xt(e,n,r)}}}function Pd(e,t,n){switch(t){case`div`:case`span`:case`svg`:case`path`:case`a`:case`g`:case`p`:case`li`:break;case`img`:$(`error`,e),$(`load`,e);var r=!1,a=!1,o;for(o in n)if(n.hasOwnProperty(o)){var s=n[o];if(s!=null)switch(o){case`src`:r=!0;break;case`srcSet`:a=!0;break;case`children`:case`dangerouslySetInnerHTML`:throw Error(i(137,t));default:Md(e,t,o,s,n,null)}}a&&Md(e,t,`srcSet`,n.srcSet,n,null),r&&Md(e,t,`src`,n.src,n,null);return;case`input`:$(`invalid`,e);var c=o=s=a=null,l=null,u=null;for(r in n)if(n.hasOwnProperty(r)){var d=n[r];if(d!=null)switch(r){case`name`:a=d;break;case`type`:s=d;break;case`checked`:l=d;break;case`defaultChecked`:u=d;break;case`value`:o=d;break;case`defaultValue`:c=d;break;case`children`:case`dangerouslySetInnerHTML`:if(d!=null)throw Error(i(137,t));break;default:Md(e,t,r,d,n,null)}}Nt(e,o,c,l,u,s,a,!1);return;case`select`:for(a in $(`invalid`,e),r=s=o=null,n)if(n.hasOwnProperty(a)&&(c=n[a],c!=null))switch(a){case`value`:o=c;break;case`defaultValue`:s=c;break;case`multiple`:r=c;default:Md(e,t,a,c,n,null)}t=o,n=s,e.multiple=!!r,t==null?n!=null&&Ft(e,!!r,n,!0):Ft(e,!!r,t,!1);return;case`textarea`:for(s in $(`invalid`,e),o=a=r=null,n)if(n.hasOwnProperty(s)&&(c=n[s],c!=null))switch(s){case`value`:r=c;break;case`defaultValue`:a=c;break;case`children`:o=c;break;case`dangerouslySetInnerHTML`:if(c!=null)throw Error(i(91));break;default:Md(e,t,s,c,n,null)}Lt(e,r,a,o);return;case`option`:for(l in n)if(n.hasOwnProperty(l)&&(r=n[l],r!=null))switch(l){case`selected`:e.selected=r&&typeof r!=`function`&&typeof r!=`symbol`;break;default:Md(e,t,l,r,n,null)}return;case`dialog`:$(`beforetoggle`,e),$(`toggle`,e),$(`cancel`,e),$(`close`,e);break;case`iframe`:case`object`:$(`load`,e);break;case`video`:case`audio`:for(r=0;r<gd.length;r++)$(gd[r],e);break;case`image`:$(`error`,e),$(`load`,e);break;case`details`:$(`toggle`,e);break;case`embed`:case`source`:case`link`:$(`error`,e),$(`load`,e);case`area`:case`base`:case`br`:case`col`:case`hr`:case`keygen`:case`meta`:case`param`:case`track`:case`wbr`:case`menuitem`:for(u in n)if(n.hasOwnProperty(u)&&(r=n[u],r!=null))switch(u){case`children`:case`dangerouslySetInnerHTML`:throw Error(i(137,t));default:Md(e,t,u,r,n,null)}return;default:if(Ht(t)){for(d in n)n.hasOwnProperty(d)&&(r=n[d],r!==void 0&&Nd(e,t,d,r,n,void 0));return}}for(c in n)n.hasOwnProperty(c)&&(r=n[c],r!=null&&Md(e,t,c,r,n,null))}function Fd(e,t,n,r){switch(t){case`div`:case`span`:case`svg`:case`path`:case`a`:case`g`:case`p`:case`li`:break;case`input`:var a=null,o=null,s=null,c=null,l=null,u=null,d=null;for(m in n){var f=n[m];if(n.hasOwnProperty(m)&&f!=null)switch(m){case`checked`:break;case`value`:break;case`defaultValue`:l=f;default:r.hasOwnProperty(m)||Md(e,t,m,null,r,f)}}for(var p in r){var m=r[p];if(f=n[p],r.hasOwnProperty(p)&&(m!=null||f!=null))switch(p){case`type`:o=m;break;case`name`:a=m;break;case`checked`:u=m;break;case`defaultChecked`:d=m;break;case`value`:s=m;break;case`defaultValue`:c=m;break;case`children`:case`dangerouslySetInnerHTML`:if(m!=null)throw Error(i(137,t));break;default:m!==f&&Md(e,t,p,m,r,f)}}Mt(e,s,c,l,u,d,o,a);return;case`select`:for(o in m=s=c=p=null,n)if(l=n[o],n.hasOwnProperty(o)&&l!=null)switch(o){case`value`:break;case`multiple`:m=l;default:r.hasOwnProperty(o)||Md(e,t,o,null,r,l)}for(a in r)if(o=r[a],l=n[a],r.hasOwnProperty(a)&&(o!=null||l!=null))switch(a){case`value`:p=o;break;case`defaultValue`:c=o;break;case`multiple`:s=o;default:o!==l&&Md(e,t,a,o,r,l)}t=c,n=s,r=m,p==null?!!r!=!!n&&(t==null?Ft(e,!!n,n?[]:``,!1):Ft(e,!!n,t,!0)):Ft(e,!!n,p,!1);return;case`textarea`:for(c in m=p=null,n)if(a=n[c],n.hasOwnProperty(c)&&a!=null&&!r.hasOwnProperty(c))switch(c){case`value`:break;case`children`:break;default:Md(e,t,c,null,r,a)}for(s in r)if(a=r[s],o=n[s],r.hasOwnProperty(s)&&(a!=null||o!=null))switch(s){case`value`:p=a;break;case`defaultValue`:m=a;break;case`children`:break;case`dangerouslySetInnerHTML`:if(a!=null)throw Error(i(91));break;default:a!==o&&Md(e,t,s,a,r,o)}It(e,p,m);return;case`option`:for(var h in n)if(p=n[h],n.hasOwnProperty(h)&&p!=null&&!r.hasOwnProperty(h))switch(h){case`selected`:e.selected=!1;break;default:Md(e,t,h,null,r,p)}for(l in r)if(p=r[l],m=n[l],r.hasOwnProperty(l)&&p!==m&&(p!=null||m!=null))switch(l){case`selected`:e.selected=p&&typeof p!=`function`&&typeof p!=`symbol`;break;default:Md(e,t,l,p,r,m)}return;case`img`:case`link`:case`area`:case`base`:case`br`:case`col`:case`embed`:case`hr`:case`keygen`:case`meta`:case`param`:case`source`:case`track`:case`wbr`:case`menuitem`:for(var g in n)p=n[g],n.hasOwnProperty(g)&&p!=null&&!r.hasOwnProperty(g)&&Md(e,t,g,null,r,p);for(u in r)if(p=r[u],m=n[u],r.hasOwnProperty(u)&&p!==m&&(p!=null||m!=null))switch(u){case`children`:case`dangerouslySetInnerHTML`:if(p!=null)throw Error(i(137,t));break;default:Md(e,t,u,p,r,m)}return;default:if(Ht(t)){for(var _ in n)p=n[_],n.hasOwnProperty(_)&&p!==void 0&&!r.hasOwnProperty(_)&&Nd(e,t,_,void 0,r,p);for(d in r)p=r[d],m=n[d],!r.hasOwnProperty(d)||p===m||p===void 0&&m===void 0||Nd(e,t,d,p,r,m);return}}for(var v in n)p=n[v],n.hasOwnProperty(v)&&p!=null&&!r.hasOwnProperty(v)&&Md(e,t,v,null,r,p);for(f in r)p=r[f],m=n[f],!r.hasOwnProperty(f)||p===m||p==null&&m==null||Md(e,t,f,p,r,m)}function Id(e){switch(e){case`css`:case`script`:case`font`:case`img`:case`image`:case`input`:case`link`:return!0;default:return!1}}function Ld(){if(typeof performance.getEntriesByType==`function`){for(var e=0,t=0,n=performance.getEntriesByType(`resource`),r=0;r<n.length;r++){var i=n[r],a=i.transferSize,o=i.initiatorType,s=i.duration;if(a&&s&&Id(o)){for(o=0,s=i.responseEnd,r+=1;r<n.length;r++){var c=n[r],l=c.startTime;if(l>s)break;var u=c.transferSize,d=c.initiatorType;u&&Id(d)&&(c=c.responseEnd,o+=u*(c<s?1:(s-l)/(c-l)))}if(--r,t+=8*(a+o)/(i.duration/1e3),e++,10<e)break}}if(0<e)return t/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e==`number`)?e:5}var Rd=null,zd=null;function Bd(e){return e.nodeType===9?e:e.ownerDocument}function Vd(e){switch(e){case`http://www.w3.org/2000/svg`:return 1;case`http://www.w3.org/1998/Math/MathML`:return 2;default:return 0}}function Hd(e,t){if(e===0)switch(t){case`svg`:return 1;case`math`:return 2;default:return 0}return e===1&&t===`foreignObject`?0:e}function Ud(e,t){return e===`textarea`||e===`noscript`||typeof t.children==`string`||typeof t.children==`number`||typeof t.children==`bigint`||typeof t.dangerouslySetInnerHTML==`object`&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Wd=null;function Gd(){var e=window.event;return e&&e.type===`popstate`?e===Wd?!1:(Wd=e,!0):(Wd=null,!1)}var Kd=typeof setTimeout==`function`?setTimeout:void 0,qd=typeof clearTimeout==`function`?clearTimeout:void 0,Jd=typeof Promise==`function`?Promise:void 0,Yd=typeof queueMicrotask==`function`?queueMicrotask:Jd===void 0?Kd:function(e){return Jd.resolve(null).then(e).catch(Xd)};function Xd(e){setTimeout(function(){throw e})}function Zd(e){return e===`head`}function Qd(e,t){var n=t,r=0;do{var i=n.nextSibling;if(e.removeChild(n),i&&i.nodeType===8)if(n=i.data,n===`/$`||n===`/&`){if(r===0){e.removeChild(i),Np(t);return}r--}else if(n===`$`||n===`$?`||n===`$~`||n===`$!`||n===`&`)r++;else if(n===`html`)pf(e.ownerDocument.documentElement);else if(n===`head`){n=e.ownerDocument.head,pf(n);for(var a=n.firstChild;a;){var o=a.nextSibling,s=a.nodeName;a[st]||s===`SCRIPT`||s===`STYLE`||s===`LINK`&&a.rel.toLowerCase()===`stylesheet`||n.removeChild(a),a=o}}else n===`body`&&pf(e.ownerDocument.body);n=i}while(n);Np(t)}function $d(e,t){var n=e;e=0;do{var r=n.nextSibling;if(n.nodeType===1?t?(n._stashedDisplay=n.style.display,n.style.display=`none`):(n.style.display=n._stashedDisplay||``,n.getAttribute(`style`)===``&&n.removeAttribute(`style`)):n.nodeType===3&&(t?(n._stashedText=n.nodeValue,n.nodeValue=``):n.nodeValue=n._stashedText||``),r&&r.nodeType===8)if(n=r.data,n===`/$`){if(e===0)break;e--}else n!==`$`&&n!==`$?`&&n!==`$~`&&n!==`$!`||e++;n=r}while(n)}function ef(e){var t=e.firstChild;for(t&&t.nodeType===10&&(t=t.nextSibling);t;){var n=t;switch(t=t.nextSibling,n.nodeName){case`HTML`:case`HEAD`:case`BODY`:ef(n),ct(n);continue;case`SCRIPT`:case`STYLE`:continue;case`LINK`:if(n.rel.toLowerCase()===`stylesheet`)continue}e.removeChild(n)}}function tf(e,t,n,r){for(;e.nodeType===1;){var i=n;if(e.nodeName.toLowerCase()!==t.toLowerCase()){if(!r&&(e.nodeName!==`INPUT`||e.type!==`hidden`))break}else if(!r)if(t===`input`&&e.type===`hidden`){var a=i.name==null?null:``+i.name;if(i.type===`hidden`&&e.getAttribute(`name`)===a)return e}else return e;else if(!e[st])switch(t){case`meta`:if(!e.hasAttribute(`itemprop`))break;return e;case`link`:if(a=e.getAttribute(`rel`),a===`stylesheet`&&e.hasAttribute(`data-precedence`)||a!==i.rel||e.getAttribute(`href`)!==(i.href==null||i.href===``?null:i.href)||e.getAttribute(`crossorigin`)!==(i.crossOrigin==null?null:i.crossOrigin)||e.getAttribute(`title`)!==(i.title==null?null:i.title))break;return e;case`style`:if(e.hasAttribute(`data-precedence`))break;return e;case`script`:if(a=e.getAttribute(`src`),(a!==(i.src==null?null:i.src)||e.getAttribute(`type`)!==(i.type==null?null:i.type)||e.getAttribute(`crossorigin`)!==(i.crossOrigin==null?null:i.crossOrigin))&&a&&e.hasAttribute(`async`)&&!e.hasAttribute(`itemprop`))break;return e;default:return e}if(e=cf(e.nextSibling),e===null)break}return null}function nf(e,t,n){if(t===``)return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!==`INPUT`||e.type!==`hidden`)&&!n||(e=cf(e.nextSibling),e===null))return null;return e}function rf(e,t){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!==`INPUT`||e.type!==`hidden`)&&!t||(e=cf(e.nextSibling),e===null))return null;return e}function af(e){return e.data===`$?`||e.data===`$~`}function of(e){return e.data===`$!`||e.data===`$?`&&e.ownerDocument.readyState!==`loading`}function sf(e,t){var n=e.ownerDocument;if(e.data===`$~`)e._reactRetry=t;else if(e.data!==`$?`||n.readyState!==`loading`)t();else{var r=function(){t(),n.removeEventListener(`DOMContentLoaded`,r)};n.addEventListener(`DOMContentLoaded`,r),e._reactRetry=r}}function cf(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t===`$`||t===`$!`||t===`$?`||t===`$~`||t===`&`||t===`F!`||t===`F`)break;if(t===`/$`||t===`/&`)return null}}return e}var lf=null;function uf(e){e=e.nextSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n===`/$`||n===`/&`){if(t===0)return cf(e.nextSibling);t--}else n!==`$`&&n!==`$!`&&n!==`$?`&&n!==`$~`&&n!==`&`||t++}e=e.nextSibling}return null}function df(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n===`$`||n===`$!`||n===`$?`||n===`$~`||n===`&`){if(t===0)return e;t--}else n!==`/$`&&n!==`/&`||t++}e=e.previousSibling}return null}function ff(e,t,n){switch(t=Bd(n),e){case`html`:if(e=t.documentElement,!e)throw Error(i(452));return e;case`head`:if(e=t.head,!e)throw Error(i(453));return e;case`body`:if(e=t.body,!e)throw Error(i(454));return e;default:throw Error(i(451))}}function pf(e){for(var t=e.attributes;t.length;)e.removeAttributeNode(t[0]);ct(e)}var mf=new Map,hf=new Set;function gf(e){return typeof e.getRootNode==`function`?e.getRootNode():e.nodeType===9?e:e.ownerDocument}var _f=L.d;L.d={f:vf,r:yf,D:Sf,C:Cf,L:wf,m:Tf,X:Df,S:Ef,M:Of};function vf(){var e=_f.f(),t=vu();return e||t}function yf(e){var t=ut(e);t!==null&&t.tag===5&&t.type===`form`?bs(t):_f.r(e)}var bf=typeof document>`u`?null:document;function xf(e,t,n){var r=bf;if(r&&typeof t==`string`&&t){var i=jt(t);i=`link[rel="`+e+`"][href="`+i+`"]`,typeof n==`string`&&(i+=`[crossorigin="`+n+`"]`),hf.has(i)||(hf.add(i),e={rel:e,crossOrigin:n,href:t},r.querySelector(i)===null&&(t=r.createElement(`link`),Pd(t,`link`,e),G(t),r.head.appendChild(t)))}}function Sf(e){_f.D(e),xf(`dns-prefetch`,e,null)}function Cf(e,t){_f.C(e,t),xf(`preconnect`,e,t)}function wf(e,t,n){_f.L(e,t,n);var r=bf;if(r&&e&&t){var i=`link[rel="preload"][as="`+jt(t)+`"]`;t===`image`&&n&&n.imageSrcSet?(i+=`[imagesrcset="`+jt(n.imageSrcSet)+`"]`,typeof n.imageSizes==`string`&&(i+=`[imagesizes="`+jt(n.imageSizes)+`"]`)):i+=`[href="`+jt(e)+`"]`;var a=i;switch(t){case`style`:a=Af(e);break;case`script`:a=Pf(e)}mf.has(a)||(e=m({rel:`preload`,href:t===`image`&&n&&n.imageSrcSet?void 0:e,as:t},n),mf.set(a,e),r.querySelector(i)!==null||t===`style`&&r.querySelector(jf(a))||t===`script`&&r.querySelector(Ff(a))||(t=r.createElement(`link`),Pd(t,`link`,e),G(t),r.head.appendChild(t)))}}function Tf(e,t){_f.m(e,t);var n=bf;if(n&&e){var r=t&&typeof t.as==`string`?t.as:`script`,i=`link[rel="modulepreload"][as="`+jt(r)+`"][href="`+jt(e)+`"]`,a=i;switch(r){case`audioworklet`:case`paintworklet`:case`serviceworker`:case`sharedworker`:case`worker`:case`script`:a=Pf(e)}if(!mf.has(a)&&(e=m({rel:`modulepreload`,href:e},t),mf.set(a,e),n.querySelector(i)===null)){switch(r){case`audioworklet`:case`paintworklet`:case`serviceworker`:case`sharedworker`:case`worker`:case`script`:if(n.querySelector(Ff(a)))return}r=n.createElement(`link`),Pd(r,`link`,e),G(r),n.head.appendChild(r)}}}function Ef(e,t,n){_f.S(e,t,n);var r=bf;if(r&&e){var i=ft(r).hoistableStyles,a=Af(e);t||=`default`;var o=i.get(a);if(!o){var s={loading:0,preload:null};if(o=r.querySelector(jf(a)))s.loading=5;else{e=m({rel:`stylesheet`,href:e,"data-precedence":t},n),(n=mf.get(a))&&Rf(e,n);var c=o=r.createElement(`link`);G(c),Pd(c,`link`,e),c._p=new Promise(function(e,t){c.onload=e,c.onerror=t}),c.addEventListener(`load`,function(){s.loading|=1}),c.addEventListener(`error`,function(){s.loading|=2}),s.loading|=4,Lf(o,t,r)}o={type:`stylesheet`,instance:o,count:1,state:s},i.set(a,o)}}}function Df(e,t){_f.X(e,t);var n=bf;if(n&&e){var r=ft(n).hoistableScripts,i=Pf(e),a=r.get(i);a||(a=n.querySelector(Ff(i)),a||(e=m({src:e,async:!0},t),(t=mf.get(i))&&zf(e,t),a=n.createElement(`script`),G(a),Pd(a,`link`,e),n.head.appendChild(a)),a={type:`script`,instance:a,count:1,state:null},r.set(i,a))}}function Of(e,t){_f.M(e,t);var n=bf;if(n&&e){var r=ft(n).hoistableScripts,i=Pf(e),a=r.get(i);a||(a=n.querySelector(Ff(i)),a||(e=m({src:e,async:!0,type:`module`},t),(t=mf.get(i))&&zf(e,t),a=n.createElement(`script`),G(a),Pd(a,`link`,e),n.head.appendChild(a)),a={type:`script`,instance:a,count:1,state:null},r.set(i,a))}}function kf(e,t,n,r){var a=(a=U.current)?gf(a):null;if(!a)throw Error(i(446));switch(e){case`meta`:case`title`:return null;case`style`:return typeof n.precedence==`string`&&typeof n.href==`string`?(t=Af(n.href),n=ft(a).hoistableStyles,r=n.get(t),r||(r={type:`style`,instance:null,count:0,state:null},n.set(t,r)),r):{type:`void`,instance:null,count:0,state:null};case`link`:if(n.rel===`stylesheet`&&typeof n.href==`string`&&typeof n.precedence==`string`){e=Af(n.href);var o=ft(a).hoistableStyles,s=o.get(e);if(s||(a=a.ownerDocument||a,s={type:`stylesheet`,instance:null,count:0,state:{loading:0,preload:null}},o.set(e,s),(o=a.querySelector(jf(e)))&&!o._p&&(s.instance=o,s.state.loading=5),mf.has(e)||(n={rel:`preload`,as:`style`,href:n.href,crossOrigin:n.crossOrigin,integrity:n.integrity,media:n.media,hrefLang:n.hrefLang,referrerPolicy:n.referrerPolicy},mf.set(e,n),o||Nf(a,e,n,s.state))),t&&r===null)throw Error(i(528,``));return s}if(t&&r!==null)throw Error(i(529,``));return null;case`script`:return t=n.async,n=n.src,typeof n==`string`&&t&&typeof t!=`function`&&typeof t!=`symbol`?(t=Pf(n),n=ft(a).hoistableScripts,r=n.get(t),r||(r={type:`script`,instance:null,count:0,state:null},n.set(t,r)),r):{type:`void`,instance:null,count:0,state:null};default:throw Error(i(444,e))}}function Af(e){return`href="`+jt(e)+`"`}function jf(e){return`link[rel="stylesheet"][`+e+`]`}function Mf(e){return m({},e,{"data-precedence":e.precedence,precedence:null})}function Nf(e,t,n,r){e.querySelector(`link[rel="preload"][as="style"][`+t+`]`)?r.loading=1:(t=e.createElement(`link`),r.preload=t,t.addEventListener(`load`,function(){return r.loading|=1}),t.addEventListener(`error`,function(){return r.loading|=2}),Pd(t,`link`,n),G(t),e.head.appendChild(t))}function Pf(e){return`[src="`+jt(e)+`"]`}function Ff(e){return`script[async]`+e}function If(e,t,n){if(t.count++,t.instance===null)switch(t.type){case`style`:var r=e.querySelector(`style[data-href~="`+jt(n.href)+`"]`);if(r)return t.instance=r,G(r),r;var a=m({},n,{"data-href":n.href,"data-precedence":n.precedence,href:null,precedence:null});return r=(e.ownerDocument||e).createElement(`style`),G(r),Pd(r,`style`,a),Lf(r,n.precedence,e),t.instance=r;case`stylesheet`:a=Af(n.href);var o=e.querySelector(jf(a));if(o)return t.state.loading|=4,t.instance=o,G(o),o;r=Mf(n),(a=mf.get(a))&&Rf(r,a),o=(e.ownerDocument||e).createElement(`link`),G(o);var s=o;return s._p=new Promise(function(e,t){s.onload=e,s.onerror=t}),Pd(o,`link`,r),t.state.loading|=4,Lf(o,n.precedence,e),t.instance=o;case`script`:return o=Pf(n.src),(a=e.querySelector(Ff(o)))?(t.instance=a,G(a),a):(r=n,(a=mf.get(o))&&(r=m({},n),zf(r,a)),e=e.ownerDocument||e,a=e.createElement(`script`),G(a),Pd(a,`link`,r),e.head.appendChild(a),t.instance=a);case`void`:return null;default:throw Error(i(443,t.type))}else t.type===`stylesheet`&&!(t.state.loading&4)&&(r=t.instance,t.state.loading|=4,Lf(r,n.precedence,e));return t.instance}function Lf(e,t,n){for(var r=n.querySelectorAll(`link[rel="stylesheet"][data-precedence],style[data-precedence]`),i=r.length?r[r.length-1]:null,a=i,o=0;o<r.length;o++){var s=r[o];if(s.dataset.precedence===t)a=s;else if(a!==i)break}a?a.parentNode.insertBefore(e,a.nextSibling):(t=n.nodeType===9?n.head:n,t.insertBefore(e,t.firstChild))}function Rf(e,t){e.crossOrigin??=t.crossOrigin,e.referrerPolicy??=t.referrerPolicy,e.title??=t.title}function zf(e,t){e.crossOrigin??=t.crossOrigin,e.referrerPolicy??=t.referrerPolicy,e.integrity??=t.integrity}var Bf=null;function Vf(e,t,n){if(Bf===null){var r=new Map,i=Bf=new Map;i.set(n,r)}else i=Bf,r=i.get(n),r||(r=new Map,i.set(n,r));if(r.has(e))return r;for(r.set(e,null),n=n.getElementsByTagName(e),i=0;i<n.length;i++){var a=n[i];if(!(a[st]||a[et]||e===`link`&&a.getAttribute(`rel`)===`stylesheet`)&&a.namespaceURI!==`http://www.w3.org/2000/svg`){var o=a.getAttribute(t)||``;o=e+o;var s=r.get(o);s?s.push(a):r.set(o,[a])}}return r}function Hf(e,t,n){e=e.ownerDocument||e,e.head.insertBefore(n,t===`title`?e.querySelector(`head > title`):null)}function Uf(e,t,n){if(n===1||t.itemProp!=null)return!1;switch(e){case`meta`:case`title`:return!0;case`style`:if(typeof t.precedence!=`string`||typeof t.href!=`string`||t.href===``)break;return!0;case`link`:if(typeof t.rel!=`string`||typeof t.href!=`string`||t.href===``||t.onLoad||t.onError)break;switch(t.rel){case`stylesheet`:return e=t.disabled,typeof t.precedence==`string`&&e==null;default:return!0}case`script`:if(t.async&&typeof t.async!=`function`&&typeof t.async!=`symbol`&&!t.onLoad&&!t.onError&&t.src&&typeof t.src==`string`)return!0}return!1}function Wf(e){return!(e.type===`stylesheet`&&!(e.state.loading&3))}function Gf(e,t,n,r){if(n.type===`stylesheet`&&(typeof r.media!=`string`||!1!==matchMedia(r.media).matches)&&!(n.state.loading&4)){if(n.instance===null){var i=Af(r.href),a=t.querySelector(jf(i));if(a){t=a._p,typeof t==`object`&&t&&typeof t.then==`function`&&(e.count++,e=Jf.bind(e),t.then(e,e)),n.state.loading|=4,n.instance=a,G(a);return}a=t.ownerDocument||t,r=Mf(r),(i=mf.get(i))&&Rf(r,i),a=a.createElement(`link`),G(a);var o=a;o._p=new Promise(function(e,t){o.onload=e,o.onerror=t}),Pd(a,`link`,r),n.instance=a}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(n,t),(t=n.state.preload)&&!(n.state.loading&3)&&(e.count++,n=Jf.bind(e),t.addEventListener(`load`,n),t.addEventListener(`error`,n))}}var Kf=0;function qf(e,t){return e.stylesheets&&e.count===0&&Xf(e,e.stylesheets),0<e.count||0<e.imgCount?function(n){var r=setTimeout(function(){if(e.stylesheets&&Xf(e,e.stylesheets),e.unsuspend){var t=e.unsuspend;e.unsuspend=null,t()}},6e4+t);0<e.imgBytes&&Kf===0&&(Kf=62500*Ld());var i=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&Xf(e,e.stylesheets),e.unsuspend)){var t=e.unsuspend;e.unsuspend=null,t()}},(e.imgBytes>Kf?50:800)+t);return e.unsuspend=n,function(){e.unsuspend=null,clearTimeout(r),clearTimeout(i)}}:null}function Jf(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)Xf(this,this.stylesheets);else if(this.unsuspend){var e=this.unsuspend;this.unsuspend=null,e()}}}var Yf=null;function Xf(e,t){e.stylesheets=null,e.unsuspend!==null&&(e.count++,Yf=new Map,t.forEach(Zf,e),Yf=null,Jf.call(e))}function Zf(e,t){if(!(t.state.loading&4)){var n=Yf.get(e);if(n)var r=n.get(null);else{n=new Map,Yf.set(e,n);for(var i=e.querySelectorAll(`link[data-precedence],style[data-precedence]`),a=0;a<i.length;a++){var o=i[a];(o.nodeName===`LINK`||o.getAttribute(`media`)!==`not all`)&&(n.set(o.dataset.precedence,o),r=o)}r&&n.set(null,r)}i=t.instance,o=i.getAttribute(`data-precedence`),a=n.get(o)||r,a===r&&n.set(null,i),n.set(o,i),this.count++,r=Jf.bind(this),i.addEventListener(`load`,r),i.addEventListener(`error`,r),a?a.parentNode.insertBefore(i,a.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(i,e.firstChild)),t.state.loading|=4}}var Qf={$$typeof:C,Provider:null,Consumer:null,_currentValue:R,_currentValue2:R,_threadCount:0};function $f(e,t,n,r,i,a,o,s,c){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=We(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=We(0),this.hiddenUpdates=We(null),this.identifierPrefix=r,this.onUncaughtError=i,this.onCaughtError=a,this.onRecoverableError=o,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=c,this.incompleteTransitions=new Map}function ep(e,t,n,r,i,a,o,s,c,l,u,d){return e=new $f(e,t,n,o,c,l,u,d,s),t=1,!0===a&&(t|=24),a=$r(3,null,null,t),e.current=a,a.stateNode=e,t=$i(),t.refCount++,e.pooledCache=t,t.refCount++,a.memoizedState={element:r,isDehydrated:n,cache:t},Ma(a),e}function tp(e){return e?(e=Zr,e):Zr}function np(e,t,n,r,i,a){i=tp(i),r.context===null?r.context=i:r.pendingContext=i,r=Pa(t),r.payload={element:n},a=a===void 0?null:a,a!==null&&(r.callback=a),n=Fa(e,r,t),n!==null&&(pu(n,e,t),Ia(n,e,t))}function rp(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function ip(e,t){rp(e,t),(e=e.alternate)&&rp(e,t)}function ap(e){if(e.tag===13||e.tag===31){var t=Jr(e,67108864);t!==null&&pu(t,e,67108864),ip(e,67108864)}}function op(e){if(e.tag===13||e.tag===31){var t=du();t=Ye(t);var n=Jr(e,t);n!==null&&pu(n,e,t),ip(e,t)}}var sp=!0;function cp(e,t,n,r){var i=I.T;I.T=null;var a=L.p;try{L.p=2,up(e,t,n,r)}finally{L.p=a,I.T=i}}function lp(e,t,n,r){var i=I.T;I.T=null;var a=L.p;try{L.p=8,up(e,t,n,r)}finally{L.p=a,I.T=i}}function up(e,t,n,r){if(sp){var i=dp(r);if(i===null)Cd(e,t,r,fp,n),Cp(e,r);else if(Tp(i,e,t,n,r))r.stopPropagation();else if(Cp(e,r),t&4&&-1<Sp.indexOf(e)){for(;i!==null;){var a=ut(i);if(a!==null)switch(a.tag){case 3:if(a=a.stateNode,a.current.memoizedState.isDehydrated){var o=ze(a.pendingLanes);if(o!==0){var s=a;for(s.pendingLanes|=2,s.entangledLanes|=2;o;){var c=1<<31-Me(o);s.entanglements[1]|=c,o&=~c}nd(a),!(X&6)&&($l=be()+500,rd(0,!1))}}break;case 31:case 13:s=Jr(a,2),s!==null&&pu(s,a,2),vu(),ip(a,2)}if(a=dp(r),a===null&&Cd(e,t,r,fp,n),a===i)break;i=a}i!==null&&r.stopPropagation()}else Cd(e,t,r,null,n)}}function dp(e){return e=Jt(e),pp(e)}var fp=null;function pp(e){if(fp=null,e=lt(e),e!==null){var t=o(e);if(t===null)e=null;else{var n=t.tag;if(n===13){if(e=s(t),e!==null)return e;e=null}else if(n===31){if(e=c(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null)}}return fp=e,null}function mp(e){switch(e){case`beforetoggle`:case`cancel`:case`click`:case`close`:case`contextmenu`:case`copy`:case`cut`:case`auxclick`:case`dblclick`:case`dragend`:case`dragstart`:case`drop`:case`focusin`:case`focusout`:case`input`:case`invalid`:case`keydown`:case`keypress`:case`keyup`:case`mousedown`:case`mouseup`:case`paste`:case`pause`:case`play`:case`pointercancel`:case`pointerdown`:case`pointerup`:case`ratechange`:case`reset`:case`resize`:case`seeked`:case`submit`:case`toggle`:case`touchcancel`:case`touchend`:case`touchstart`:case`volumechange`:case`change`:case`selectionchange`:case`textInput`:case`compositionstart`:case`compositionend`:case`compositionupdate`:case`beforeblur`:case`afterblur`:case`beforeinput`:case`blur`:case`fullscreenchange`:case`focus`:case`hashchange`:case`popstate`:case`select`:case`selectstart`:return 2;case`drag`:case`dragenter`:case`dragexit`:case`dragleave`:case`dragover`:case`mousemove`:case`mouseout`:case`mouseover`:case`pointermove`:case`pointerout`:case`pointerover`:case`scroll`:case`touchmove`:case`wheel`:case`mouseenter`:case`mouseleave`:case`pointerenter`:case`pointerleave`:return 8;case`message`:switch(xe()){case Se:return 2;case Ce:return 8;case we:case Te:return 32;case Ee:return 268435456;default:return 32}default:return 32}}var hp=!1,gp=null,_p=null,vp=null,yp=new Map,bp=new Map,xp=[],Sp=`mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset`.split(` `);function Cp(e,t){switch(e){case`focusin`:case`focusout`:gp=null;break;case`dragenter`:case`dragleave`:_p=null;break;case`mouseover`:case`mouseout`:vp=null;break;case`pointerover`:case`pointerout`:yp.delete(t.pointerId);break;case`gotpointercapture`:case`lostpointercapture`:bp.delete(t.pointerId)}}function wp(e,t,n,r,i,a){return e===null||e.nativeEvent!==a?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:a,targetContainers:[i]},t!==null&&(t=ut(t),t!==null&&ap(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,i!==null&&t.indexOf(i)===-1&&t.push(i),e)}function Tp(e,t,n,r,i){switch(t){case`focusin`:return gp=wp(gp,e,t,n,r,i),!0;case`dragenter`:return _p=wp(_p,e,t,n,r,i),!0;case`mouseover`:return vp=wp(vp,e,t,n,r,i),!0;case`pointerover`:var a=i.pointerId;return yp.set(a,wp(yp.get(a)||null,e,t,n,r,i)),!0;case`gotpointercapture`:return a=i.pointerId,bp.set(a,wp(bp.get(a)||null,e,t,n,r,i)),!0}return!1}function Ep(e){var t=lt(e.target);if(t!==null){var n=o(t);if(n!==null){if(t=n.tag,t===13){if(t=s(n),t!==null){e.blockedOn=t,Qe(e.priority,function(){op(n)});return}}else if(t===31){if(t=c(n),t!==null){e.blockedOn=t,Qe(e.priority,function(){op(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Dp(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=dp(e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);qt=r,n.target.dispatchEvent(r),qt=null}else return t=ut(n),t!==null&&ap(t),e.blockedOn=n,!1;t.shift()}return!0}function Op(e,t,n){Dp(e)&&n.delete(t)}function kp(){hp=!1,gp!==null&&Dp(gp)&&(gp=null),_p!==null&&Dp(_p)&&(_p=null),vp!==null&&Dp(vp)&&(vp=null),yp.forEach(Op),bp.forEach(Op)}function Ap(e,n){e.blockedOn===n&&(e.blockedOn=null,hp||(hp=!0,t.unstable_scheduleCallback(t.unstable_NormalPriority,kp)))}var jp=null;function Mp(e){jp!==e&&(jp=e,t.unstable_scheduleCallback(t.unstable_NormalPriority,function(){jp===e&&(jp=null);for(var t=0;t<e.length;t+=3){var n=e[t],r=e[t+1],i=e[t+2];if(typeof r!=`function`){if(pp(r||n)===null)continue;break}var a=ut(n);a!==null&&(e.splice(t,3),t-=3,vs(a,{pending:!0,data:i,method:n.method,action:r},r,i))}}))}function Np(e){function t(t){return Ap(t,e)}gp!==null&&Ap(gp,e),_p!==null&&Ap(_p,e),vp!==null&&Ap(vp,e),yp.forEach(t),bp.forEach(t);for(var n=0;n<xp.length;n++){var r=xp[n];r.blockedOn===e&&(r.blockedOn=null)}for(;0<xp.length&&(n=xp[0],n.blockedOn===null);)Ep(n),n.blockedOn===null&&xp.shift();if(n=(e.ownerDocument||e).$$reactFormReplay,n!=null)for(r=0;r<n.length;r+=3){var i=n[r],a=n[r+1],o=i[tt]||null;if(typeof a==`function`)o||Mp(n);else if(o){var s=null;if(a&&a.hasAttribute(`formAction`)){if(i=a,o=a[tt]||null)s=o.formAction;else if(pp(i)!==null)continue}else s=o.action;typeof s==`function`?n[r+1]=s:(n.splice(r,3),r-=3),Mp(n)}}}function Pp(){function e(e){e.canIntercept&&e.info===`react-transition`&&e.intercept({handler:function(){return new Promise(function(e){return i=e})},focusReset:`manual`,scroll:`manual`})}function t(){i!==null&&(i(),i=null),r||setTimeout(n,20)}function n(){if(!r&&!navigation.transition){var e=navigation.currentEntry;e&&e.url!=null&&navigation.navigate(e.url,{state:e.getState(),info:`react-transition`,history:`replace`})}}if(typeof navigation==`object`){var r=!1,i=null;return navigation.addEventListener(`navigate`,e),navigation.addEventListener(`navigatesuccess`,t),navigation.addEventListener(`navigateerror`,t),setTimeout(n,100),function(){r=!0,navigation.removeEventListener(`navigate`,e),navigation.removeEventListener(`navigatesuccess`,t),navigation.removeEventListener(`navigateerror`,t),i!==null&&(i(),i=null)}}}function Fp(e){this._internalRoot=e}Ip.prototype.render=Fp.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(i(409));var n=t.current;np(n,du(),e,t,null,null)},Ip.prototype.unmount=Fp.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;np(e.current,2,null,e,null,null),vu(),t[nt]=null}};function Ip(e){this._internalRoot=e}Ip.prototype.unstable_scheduleHydration=function(e){if(e){var t=Ze();e={blockedOn:null,target:e,priority:t};for(var n=0;n<xp.length&&t!==0&&t<xp[n].priority;n++);xp.splice(n,0,e),n===0&&Ep(e)}};var Lp=n.version;if(Lp!==`19.2.7`)throw Error(i(527,Lp,`19.2.7`));L.findDOMNode=function(e){var t=e._reactInternals;if(t===void 0)throw typeof e.render==`function`?Error(i(188)):(e=Object.keys(e).join(`,`),Error(i(268,e)));return e=u(t),e=e===null?null:f(e),e=e===null?null:e.stateNode,e};var Rp={bundleType:0,version:`19.2.7`,rendererPackageName:`react-dom`,currentDispatcherRef:I,reconcilerVersion:`19.2.7`};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<`u`){var zp=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!zp.isDisabled&&zp.supportsFiber)try{ke=zp.inject(Rp),Ae=zp}catch{}}e.createRoot=function(e,t){if(!a(e))throw Error(i(299));var n=!1,r=``,o=Vs,s=Hs,c=Us;return t!=null&&(!0===t.unstable_strictMode&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onUncaughtError!==void 0&&(o=t.onUncaughtError),t.onCaughtError!==void 0&&(s=t.onCaughtError),t.onRecoverableError!==void 0&&(c=t.onRecoverableError)),t=ep(e,1,!1,null,null,n,r,null,o,s,c,Pp),e[nt]=t.current,xd(e),new Fp(t)}})),_=o(((e,t)=>{function n(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>`u`||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!=`function`))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n)}catch(e){console.error(e)}}n(),t.exports=g()})),v=l(d(),1),y=_();function b(e,t){return function(){return e.apply(t,arguments)}}var{toString:x}=Object.prototype,{getPrototypeOf:S}=Object,{iterator:C,toStringTag:w}=Symbol,T=(({hasOwnProperty:e})=>(t,n)=>e.call(t,n))(Object.prototype),E=(e,t)=>{let n=e,r=[];for(;n!=null&&n!==Object.prototype;){if(r.indexOf(n)!==-1)return!1;if(r.push(n),T(n,t))return!0;n=S(n)}return!1},D=(e,t)=>e!=null&&E(e,t)?e[t]:void 0,O=(e=>t=>{let n=x.call(t);return e[n]||(e[n]=n.slice(8,-1).toLowerCase())})(Object.create(null)),k=e=>(e=e.toLowerCase(),t=>O(t)===e),A=e=>t=>typeof t===e,{isArray:j}=Array,M=A(`undefined`);function N(e){return e!==null&&!M(e)&&e.constructor!==null&&!M(e.constructor)&&L(e.constructor.isBuffer)&&e.constructor.isBuffer(e)}var P=k(`ArrayBuffer`);function F(e){let t;return t=typeof ArrayBuffer<`u`&&ArrayBuffer.isView?ArrayBuffer.isView(e):e&&e.buffer&&P(e.buffer),t}var I=A(`string`),L=A(`function`),R=A(`number`),ee=e=>typeof e==`object`&&!!e,te=e=>e===!0||e===!1,z=e=>{if(!ee(e))return!1;let t=S(e);return(t===null||t===Object.prototype||S(t)===null)&&!E(e,w)&&!E(e,C)},B=e=>{if(!ee(e)||N(e))return!1;try{return Object.keys(e).length===0&&Object.getPrototypeOf(e)===Object.prototype}catch{return!1}},V=k(`Date`),H=k(`File`),ne=e=>!!(e&&e.uri!==void 0),U=e=>e&&e.getParts!==void 0,re=k(`Blob`),ie=k(`FileList`),ae=e=>ee(e)&&L(e.pipe);function oe(){return typeof globalThis<`u`?globalThis:typeof self<`u`?self:typeof window<`u`?window:typeof global<`u`?global:{}}var se=oe(),ce=se.FormData===void 0?void 0:se.FormData,le=e=>{if(!e)return!1;if(ce&&e instanceof ce)return!0;let t=S(e);if(!t||t===Object.prototype||!L(e.append))return!1;let n=O(e);return n===`formdata`||n===`object`&&L(e.toString)&&e.toString()===`[object FormData]`},ue=k(`URLSearchParams`),[de,fe,pe,me]=[`ReadableStream`,`Request`,`Response`,`Headers`].map(k),he=e=>e.trim?e.trim():e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,``);function ge(e,t,{allOwnKeys:n=!1}={}){if(e==null)return;let r,i;if(typeof e!=`object`&&(e=[e]),j(e))for(r=0,i=e.length;r<i;r++)t.call(null,e[r],r,e);else{if(N(e))return;let i=n?Object.getOwnPropertyNames(e):Object.keys(e),a=i.length,o;for(r=0;r<a;r++)o=i[r],t.call(null,e[o],o,e)}}function _e(e,t){if(N(e))return null;t=t.toLowerCase();let n=Object.keys(e),r=n.length,i;for(;r-->0;)if(i=n[r],t===i.toLowerCase())return i;return null}var ve=typeof globalThis<`u`?globalThis:typeof self<`u`?self:typeof window<`u`?window:global,ye=e=>!M(e)&&e!==ve;function be(...e){let{caseless:t,skipUndefined:n}=ye(this)&&this||{},r={},i=(e,i)=>{if(i===`__proto__`||i===`constructor`||i===`prototype`)return;let a=t&&typeof i==`string`&&_e(r,i)||i,o=T(r,a)?r[a]:void 0;z(o)&&z(e)?r[a]=be(o,e):z(e)?r[a]=be({},e):j(e)?r[a]=e.slice():(!n||!M(e))&&(r[a]=e)};for(let t=0,n=e.length;t<n;t++){let n=e[t];if(!n||N(n)||(ge(n,i),typeof n!=`object`||j(n)))continue;let r=Object.getOwnPropertySymbols(n);for(let e=0;e<r.length;e++){let t=r[e];Me.call(n,t)&&i(n[t],t)}}return r}var xe=(e,t,n,{allOwnKeys:r}={})=>(ge(t,(t,r)=>{n&&L(t)?Object.defineProperty(e,r,{__proto__:null,value:b(t,n),writable:!0,enumerable:!0,configurable:!0}):Object.defineProperty(e,r,{__proto__:null,value:t,writable:!0,enumerable:!0,configurable:!0})},{allOwnKeys:r}),e),Se=e=>(e.charCodeAt(0)===65279&&(e=e.slice(1)),e),Ce=(e,t,n,r)=>{e.prototype=Object.create(t.prototype,r),Object.defineProperty(e.prototype,"constructor",{__proto__:null,value:e,writable:!0,enumerable:!1,configurable:!0}),Object.defineProperty(e,"super",{__proto__:null,value:t.prototype}),n&&Object.assign(e.prototype,n)},we=(e,t,n,r)=>{let i,a,o,s={};if(t||={},e==null)return t;do{for(i=Object.getOwnPropertyNames(e),a=i.length;a-->0;)o=i[a],(!r||r(o,e,t))&&!s[o]&&(t[o]=e[o],s[o]=!0);e=n!==!1&&S(e)}while(e&&(!n||n(e,t))&&e!==Object.prototype);return t},Te=(e,t,n)=>{e=String(e),(n===void 0||n>e.length)&&(n=e.length),n-=t.length;let r=e.indexOf(t,n);return r!==-1&&r===n},Ee=e=>{if(!e)return null;if(j(e))return e;let t=e.length;if(!R(t))return null;let n=Array(t);for(;t-->0;)n[t]=e[t];return n},De=(e=>t=>e&&t instanceof e)(typeof Uint8Array<`u`&&S(Uint8Array)),Oe=(e,t)=>{let n=(e&&e[C]).call(e),r;for(;(r=n.next())&&!r.done;){let n=r.value;t.call(e,n[0],n[1])}},ke=(e,t)=>{let n,r=[];for(;(n=e.exec(t))!==null;)r.push(n);return r},Ae=k(`HTMLFormElement`),je=e=>e.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,function(e,t,n){return t.toUpperCase()+n}),{propertyIsEnumerable:Me}=Object.prototype,Ne=k(`RegExp`),Pe=(e,t)=>{let n=Object.getOwnPropertyDescriptors(e),r={};ge(n,(n,i)=>{let a;(a=t(n,i,e))!==!1&&(r[i]=a||n)}),Object.defineProperties(e,r)},Fe=e=>{Pe(e,(t,n)=>{if(L(e)&&[`arguments`,`caller`,`callee`].includes(n))return!1;let r=e[n];if(L(r)){if(t.enumerable=!1,`writable`in t){t.writable=!1;return}t.set||=()=>{throw Error(`Can not rewrite read-only method '`+n+`'`)}}})},Ie=(e,t)=>{let n={},r=e=>{e.forEach(e=>{n[e]=!0})};return j(e)?r(e):r(String(e).split(t)),n},Le=()=>{},Re=(e,t)=>e!=null&&Number.isFinite(e=+e)?e:t;function ze(e){return!!(e&&L(e.append)&&e[w]===`FormData`&&e[C])}var Be=e=>{let t=new WeakSet,n=e=>{if(ee(e)){if(t.has(e))return;if(N(e))return e;if(!(`toJSON`in e)){t.add(e);let r=j(e)?[]:{};return ge(e,(e,t)=>{let i=n(e);!M(i)&&(r[t]=i)}),t.delete(e),r}}return e};return n(e)},Ve=k(`AsyncFunction`),He=e=>e&&(ee(e)||L(e))&&L(e.then)&&L(e.catch),Ue=((e,t)=>e?setImmediate:t?((e,t)=>(ve.addEventListener(`message`,({source:n,data:r})=>{n===ve&&r===e&&t.length&&t.shift()()},!1),n=>{t.push(n),ve.postMessage(e,`*`)}))(`axios@${Math.random()}`,[]):e=>setTimeout(e))(typeof setImmediate==`function`,L(ve.postMessage)),We=typeof queueMicrotask<`u`?queueMicrotask.bind(ve):typeof process<`u`&&process.nextTick||Ue,Ge=e=>e!=null&&L(e[C]),W={isArray:j,isArrayBuffer:P,isBuffer:N,isFormData:le,isArrayBufferView:F,isString:I,isNumber:R,isBoolean:te,isObject:ee,isPlainObject:z,isEmptyObject:B,isReadableStream:de,isRequest:fe,isResponse:pe,isHeaders:me,isUndefined:M,isDate:V,isFile:H,isReactNativeBlob:ne,isReactNative:U,isBlob:re,isRegExp:Ne,isFunction:L,isStream:ae,isURLSearchParams:ue,isTypedArray:De,isFileList:ie,forEach:ge,merge:be,extend:xe,trim:he,stripBOM:Se,inherits:Ce,toFlatObject:we,kindOf:O,kindOfTest:k,endsWith:Te,toArray:Ee,forEachEntry:Oe,matchAll:ke,isHTMLForm:Ae,hasOwnProperty:T,hasOwnProp:T,hasOwnInPrototypeChain:E,getSafeProp:D,reduceDescriptors:Pe,freezeMethods:Fe,toObjectSet:Ie,toCamelCase:je,noop:Le,toFiniteNumber:Re,findKey:_e,global:ve,isContextDefined:ye,isSpecCompliantForm:ze,toJSONObject:Be,isAsyncFn:Ve,isThenable:He,setImmediate:Ue,asap:We,isIterable:Ge,isSafeIterable:e=>e!=null&&E(e,C)&&Ge(e)},Ke=W.toObjectSet([`age`,`authorization`,`content-length`,`content-type`,`etag`,`expires`,`from`,`host`,`if-modified-since`,`if-unmodified-since`,`last-modified`,`location`,`max-forwards`,`proxy-authorization`,`referer`,`retry-after`,`user-agent`]),qe=e=>{let t={},n,r,i;return e&&e.split(`
`).forEach(function(e){i=e.indexOf(`:`),n=e.substring(0,i).trim().toLowerCase(),r=e.substring(i+1).trim(),!(!n||t[n]&&Ke[n])&&(n===`set-cookie`?t[n]?t[n].push(r):t[n]=[r]:t[n]=t[n]?t[n]+`, `+r:r)}),t};function Je(e){let t=0,n=e.length;for(;t<n;){let n=e.charCodeAt(t);if(n!==9&&n!==32)break;t+=1}for(;n>t;){let t=e.charCodeAt(n-1);if(t!==9&&t!==32)break;--n}return t===0&&n===e.length?e:e.slice(t,n)}var Ye=RegExp(`[\\u0000-\\u0008\\u000a-\\u001f\\u007f]+`,`g`),Xe=RegExp(`[^\\u0009\\u0020-\\u007e\\u0080-\\u00ff]+`,`g`);function Ze(e,t){return W.isArray(e)?e.map(e=>Ze(e,t)):Je(String(e).replace(t,``))}var Qe=e=>Ze(e,Ye),$e=e=>Ze(e,Xe);function et(e){let t=Object.create(null);return W.forEach(e.toJSON(),(e,n)=>{t[n]=$e(e)}),t}var tt=Symbol(`internals`);function nt(e){return e&&String(e).trim().toLowerCase()}function rt(e){return e===!1||e==null?e:W.isArray(e)?e.map(rt):Qe(String(e))}function it(e){let t=Object.create(null),n=/([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g,r;for(;r=n.exec(e);)t[r[1]]=r[2];return t}var at=e=>/^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim());function ot(e,t,n,r,i){if(W.isFunction(r))return r.call(this,t,n);if(i&&(t=n),W.isString(t)){if(W.isString(r))return t.indexOf(r)!==-1;if(W.isRegExp(r))return r.test(t)}}function st(e){return e.trim().toLowerCase().replace(/([a-z\d])(\w*)/g,(e,t,n)=>t.toUpperCase()+n)}function ct(e,t){let n=W.toCamelCase(` `+t);[`get`,`set`,`has`].forEach(r=>{Object.defineProperty(e,r+n,{__proto__:null,value:function(e,n,i){return this[r].call(this,t,e,n,i)},configurable:!0})})}var lt=class{constructor(e){e&&this.set(e)}set(e,t,n){let r=this;function i(e,t,n){let i=nt(t);if(!i)return;let a=W.findKey(r,i);(!a||r[a]===void 0||n===!0||n===void 0&&r[a]!==!1)&&(r[a||t]=rt(e))}let a=(e,t)=>W.forEach(e,(e,n)=>i(e,n,t));if(W.isPlainObject(e)||e instanceof this.constructor)a(e,t);else if(W.isString(e)&&(e=e.trim())&&!at(e))a(qe(e),t);else if(W.isObject(e)&&W.isSafeIterable(e)){let n=Object.create(null),r,i;for(let t of e){if(!W.isArray(t))throw TypeError(`Object iterator must return a key-value pair`);i=t[0],W.hasOwnProp(n,i)?(r=n[i],n[i]=W.isArray(r)?[...r,t[1]]:[r,t[1]]):n[i]=t[1]}a(n,t)}else e!=null&&i(t,e,n);return this}get(e,t){if(e=nt(e),e){let n=W.findKey(this,e);if(n){let e=this[n];if(!t)return e;if(t===!0)return it(e);if(W.isFunction(t))return t.call(this,e,n);if(W.isRegExp(t))return t.exec(e);throw TypeError(`parser must be boolean|regexp|function`)}}}has(e,t){if(e=nt(e),e){let n=W.findKey(this,e);return!!(n&&this[n]!==void 0&&(!t||ot(this,this[n],n,t)))}return!1}delete(e,t){let n=this,r=!1;function i(e){if(e=nt(e),e){let i=W.findKey(n,e);i&&(!t||ot(n,n[i],i,t))&&(delete n[i],r=!0)}}return W.isArray(e)?e.forEach(i):i(e),r}clear(e){let t=Object.keys(this),n=t.length,r=!1;for(;n--;){let i=t[n];(!e||ot(this,this[i],i,e,!0))&&(delete this[i],r=!0)}return r}normalize(e){let t=this,n={};return W.forEach(this,(r,i)=>{let a=W.findKey(n,i);if(a){t[a]=rt(r),delete t[i];return}let o=e?st(i):String(i).trim();o!==i&&delete t[i],t[o]=rt(r),n[o]=!0}),this}concat(...e){return this.constructor.concat(this,...e)}toJSON(e){let t=Object.create(null);return W.forEach(this,(n,r)=>{n!=null&&n!==!1&&(t[r]=e&&W.isArray(n)?n.join(`, `):n)}),t}[Symbol.iterator](){return Object.entries(this.toJSON())[Symbol.iterator]()}toString(){return Object.entries(this.toJSON()).map(([e,t])=>e+`: `+t).join(`
`)}getSetCookie(){return this.get(`set-cookie`)||[]}get[Symbol.toStringTag](){return`AxiosHeaders`}static from(e){return e instanceof this?e:new this(e)}static concat(e,...t){let n=new this(e);return t.forEach(e=>n.set(e)),n}static accessor(e){let t=(this[tt]=this[tt]={accessors:{}}).accessors,n=this.prototype;function r(e){let r=nt(e);t[r]||(ct(n,e),t[r]=!0)}return W.isArray(e)?e.forEach(r):r(e),this}};lt.accessor([`Content-Type`,`Content-Length`,`Accept`,`Accept-Encoding`,`User-Agent`,`Authorization`]),W.reduceDescriptors(lt.prototype,({value:e},t)=>{let n=t[0].toUpperCase()+t.slice(1);return{get:()=>e,set(e){this[n]=e}}}),W.freezeMethods(lt);var ut=`[REDACTED ****]`;function dt(e){if(W.hasOwnProp(e,`toJSON`))return!0;let t=Object.getPrototypeOf(e);for(;t&&t!==Object.prototype;){if(W.hasOwnProp(t,`toJSON`))return!0;t=Object.getPrototypeOf(t)}return!1}function ft(e,t){let n=new Set(t.map(e=>String(e).toLowerCase())),r=[],i=e=>{if(typeof e!=`object`||!e||W.isBuffer(e))return e;if(r.indexOf(e)!==-1)return;e instanceof lt&&(e=e.toJSON()),r.push(e);let t;if(W.isArray(e))t=[],e.forEach((e,n)=>{let r=i(e);W.isUndefined(r)||(t[n]=r)});else{if(!W.isPlainObject(e)&&dt(e))return r.pop(),e;t=Object.create(null);for(let[r,a]of Object.entries(e)){let e=n.has(r.toLowerCase())?ut:i(a);W.isUndefined(e)||(t[r]=e)}}return r.pop(),t};return i(e)}var G=class e extends Error{static from(t,n,r,i,a,o){let s=new e(t.message,n||t.code,r,i,a);return Object.defineProperty(s,"cause",{__proto__:null,value:t,writable:!0,enumerable:!1,configurable:!0}),s.name=t.name,t.status!=null&&s.status==null&&(s.status=t.status),o&&Object.assign(s,o),s}constructor(e,t,n,r,i){super(e),Object.defineProperty(this,"message",{__proto__:null,value:e,enumerable:!0,writable:!0,configurable:!0}),this.name=`AxiosError`,this.isAxiosError=!0,t&&(this.code=t),n&&(this.config=n),r&&(this.request=r),i&&(this.response=i,this.status=i.status)}toJSON(){let e=this.config,t=e&&W.hasOwnProp(e,`redact`)?e.redact:void 0,n=W.isArray(t)&&t.length>0?ft(e,t):W.toJSONObject(e);return{message:this.message,name:this.name,description:this.description,number:this.number,fileName:this.fileName,lineNumber:this.lineNumber,columnNumber:this.columnNumber,stack:this.stack,config:n,code:this.code,status:this.status}}};G.ERR_BAD_OPTION_VALUE=`ERR_BAD_OPTION_VALUE`,G.ERR_BAD_OPTION=`ERR_BAD_OPTION`,G.ECONNABORTED=`ECONNABORTED`,G.ETIMEDOUT=`ETIMEDOUT`,G.ECONNREFUSED=`ECONNREFUSED`,G.ERR_NETWORK=`ERR_NETWORK`,G.ERR_FR_TOO_MANY_REDIRECTS=`ERR_FR_TOO_MANY_REDIRECTS`,G.ERR_DEPRECATED=`ERR_DEPRECATED`,G.ERR_BAD_RESPONSE=`ERR_BAD_RESPONSE`,G.ERR_BAD_REQUEST=`ERR_BAD_REQUEST`,G.ERR_CANCELED=`ERR_CANCELED`,G.ERR_NOT_SUPPORT=`ERR_NOT_SUPPORT`,G.ERR_INVALID_URL=`ERR_INVALID_URL`,G.ERR_FORM_DATA_DEPTH_EXCEEDED=`ERR_FORM_DATA_DEPTH_EXCEEDED`;function pt(e){return W.isPlainObject(e)||W.isArray(e)}function mt(e){return W.endsWith(e,`[]`)?e.slice(0,-2):e}function ht(e,t,n){return e?e.concat(t).map(function(e,t){return e=mt(e),!n&&t?`[`+e+`]`:e}).join(n?`.`:``):t}function gt(e){return W.isArray(e)&&!e.some(pt)}var _t=W.toFlatObject(W,{},null,function(e){return/^is[A-Z]/.test(e)});function vt(e,t,n){if(!W.isObject(e))throw TypeError(`target must be an object`);t||=new FormData,n=W.toFlatObject(n,{metaTokens:!0,dots:!1,indexes:!1},!1,function(e,t){return!W.isUndefined(t[e])});let r=n.metaTokens,i=n.visitor||m,a=n.dots,o=n.indexes,s=n.Blob||typeof Blob<`u`&&Blob,c=n.maxDepth===void 0?100:n.maxDepth,l=s&&W.isSpecCompliantForm(t),u=[];if(!W.isFunction(i))throw TypeError(`visitor must be a function`);function d(e){if(e===null)return``;if(W.isDate(e))return e.toISOString();if(W.isBoolean(e))return e.toString();if(!l&&W.isBlob(e))throw new G(`Blob is not supported. Use a Buffer instead.`);if(W.isArrayBuffer(e)||W.isTypedArray(e)){if(l&&typeof s==`function`)return new s([e]);if(typeof Buffer<`u`)return Buffer.from(e);throw new G(`Blob is not supported. Use a Buffer instead.`,G.ERR_NOT_SUPPORT)}return e}function f(e){if(e>c)throw new G(`Object is too deeply nested (`+e+` levels). Max depth: `+c,G.ERR_FORM_DATA_DEPTH_EXCEEDED)}function p(e,t){if(c===1/0)return JSON.stringify(e);let n=[];return JSON.stringify(e,function(e,r){if(!W.isObject(r))return r;for(;n.length&&n[n.length-1]!==this;)n.pop();return n.push(r),f(t+n.length-1),r})}function m(e,n,i){let s=e;if(W.isReactNative(t)&&W.isReactNativeBlob(e))return t.append(ht(i,n,a),d(e)),!1;if(e&&!i&&typeof e==`object`){if(W.endsWith(n,`{}`))n=r?n:n.slice(0,-2),e=p(e,1);else if(W.isArray(e)&&gt(e)||(W.isFileList(e)||W.endsWith(n,`[]`))&&(s=W.toArray(e)))return n=mt(n),s.forEach(function(e,r){!(W.isUndefined(e)||e===null)&&t.append(o===!0?ht([n],r,a):o===null?n:n+`[]`,d(e))}),!1}return pt(e)?!0:(t.append(ht(i,n,a),d(e)),!1)}let h=Object.assign(_t,{defaultVisitor:m,convertValue:d,isVisitable:pt});function g(e,n,r=0){if(!W.isUndefined(e)){if(f(r),u.indexOf(e)!==-1)throw Error(`Circular reference detected in `+n.join(`.`));u.push(e),W.forEach(e,function(e,a){(!(W.isUndefined(e)||e===null)&&i.call(t,e,W.isString(a)?a.trim():a,n,h))===!0&&g(e,n?n.concat(a):[a],r+1)}),u.pop()}}if(!W.isObject(e))throw TypeError(`data must be an object`);return g(e),t}function yt(e){let t={"!":`%21`,"'":`%27`,"(":`%28`,")":`%29`,"~":`%7E`,"%20":`+`};return encodeURIComponent(e).replace(/[!'()~]|%20/g,function(e){return t[e]})}function bt(e,t){this._pairs=[],e&&vt(e,this,t)}var xt=bt.prototype;xt.append=function(e,t){this._pairs.push([e,t])},xt.toString=function(e){let t=e?t=>e.call(this,t,yt):yt;return this._pairs.map(function(e){return t(e[0])+`=`+t(e[1])},``).join(`&`)};function St(e){return encodeURIComponent(e).replace(/%3A/gi,`:`).replace(/%24/g,`$`).replace(/%2C/gi,`,`).replace(/%20/g,`+`)}function Ct(e,t,n){if(!t)return e;e||=``;let r=W.isFunction(n)?{serialize:n}:n,i=W.getSafeProp(r,`encode`)||St,a=W.getSafeProp(r,`serialize`),o;if(o=a?a(t,r):W.isURLSearchParams(t)?t.toString():new bt(t,r).toString(i),o){let t=e.indexOf(`#`);t!==-1&&(e=e.slice(0,t)),e+=(e.indexOf(`?`)===-1?`?`:`&`)+o}return e}var wt=class{constructor(){this.handlers=[]}use(e,t,n){return this.handlers.push({fulfilled:e,rejected:t,synchronous:n?n.synchronous:!1,runWhen:n?n.runWhen:null}),this.handlers.length-1}eject(e){this.handlers[e]&&(this.handlers[e]=null)}clear(){this.handlers&&=[]}forEach(e){W.forEach(this.handlers,function(t){t!==null&&e(t)})}},Tt={silentJSONParsing:!0,forcedJSONParsing:!0,clarifyTimeoutError:!1,legacyInterceptorReqResOrdering:!0,advertiseZstdAcceptEncoding:!1,validateStatusUndefinedResolves:!0},Et={isBrowser:!0,classes:{URLSearchParams:typeof URLSearchParams<`u`?URLSearchParams:bt,FormData:typeof FormData<`u`?FormData:null,Blob:typeof Blob<`u`?Blob:null},protocols:[`http`,`https`,`file`,`blob`,`url`,`data`]},Dt=s({hasBrowserEnv:()=>Ot,hasStandardBrowserEnv:()=>At,hasStandardBrowserWebWorkerEnv:()=>jt,navigator:()=>kt,origin:()=>Mt}),Ot=typeof window<`u`&&typeof document<`u`,kt=typeof navigator==`object`&&navigator||void 0,At=Ot&&(!kt||[`ReactNative`,`NativeScript`,`NS`].indexOf(kt.product)<0),jt=typeof WorkerGlobalScope<`u`&&self instanceof WorkerGlobalScope&&typeof self.importScripts==`function`,Mt=Ot&&window.location.href||`http://localhost`,Nt={...Dt,...Et};function Pt(e,t){return vt(e,new Nt.classes.URLSearchParams,{visitor:function(e,t,n,r){return Nt.isNode&&W.isBuffer(e)?(this.append(t,e.toString(`base64`)),!1):r.defaultVisitor.apply(this,arguments)},...t})}var Ft=100;function It(e){if(e>Ft)throw new G(`FormData field is too deeply nested (`+e+` levels). Max depth: `+Ft,G.ERR_FORM_DATA_DEPTH_EXCEEDED)}function Lt(e){let t=[],n=/\w+|\[(\w*)]/g,r;for(;(r=n.exec(e))!==null;)It(t.length),t.push(r[0]===`[]`?``:r[1]||r[0]);return t}function Rt(e){let t={},n=Object.keys(e),r,i=n.length,a;for(r=0;r<i;r++)a=n[r],t[a]=e[a];return t}function zt(e){function t(e,n,r,i){It(i);let a=e[i++];if(a===`__proto__`)return!0;let o=Number.isFinite(+a),s=i>=e.length;return a=!a&&W.isArray(r)?r.length:a,s?(W.hasOwnProp(r,a)?r[a]=W.isArray(r[a])?r[a].concat(n):[r[a],n]:r[a]=n,!o):((!W.hasOwnProp(r,a)||!W.isObject(r[a]))&&(r[a]=[]),t(e,n,r[a],i)&&W.isArray(r[a])&&(r[a]=Rt(r[a])),!o)}if(W.isFormData(e)&&W.isFunction(e.entries)){let n={};return W.forEachEntry(e,(e,r)=>{t(Lt(e),r,n,0)}),n}return null}var Bt=(e,t)=>e!=null&&W.hasOwnProp(e,t)?e[t]:void 0;function Vt(e,t,n){if(W.isString(e))try{return(t||JSON.parse)(e),W.trim(e)}catch(e){if(e.name!==`SyntaxError`)throw e}return(n||JSON.stringify)(e)}var Ht={transitional:Tt,adapter:[`xhr`,`http`,`fetch`],transformRequest:[function(e,t){let n=t.getContentType()||``,r=n.indexOf(`application/json`)>-1,i=W.isObject(e);if(i&&W.isHTMLForm(e)&&(e=new FormData(e)),W.isFormData(e))return r?JSON.stringify(zt(e)):e;if(W.isArrayBuffer(e)||W.isBuffer(e)||W.isStream(e)||W.isFile(e)||W.isBlob(e)||W.isReadableStream(e))return e;if(W.isArrayBufferView(e))return e.buffer;if(W.isURLSearchParams(e))return t.setContentType(`application/x-www-form-urlencoded;charset=utf-8`,!1),e.toString();let a;if(i){let t=Bt(this,`formSerializer`);if(n.indexOf(`application/x-www-form-urlencoded`)>-1)return Pt(e,t).toString();if((a=W.isFileList(e))||n.indexOf(`multipart/form-data`)>-1){let n=Bt(this,`env`),r=n&&n.FormData;return vt(a?{"files[]":e}:e,r&&new r,t)}}return i||r?(t.setContentType(`application/json`,!1),Vt(e)):e}],transformResponse:[function(e){let t=Bt(this,`transitional`)||Ht.transitional,n=t&&t.forcedJSONParsing,r=Bt(this,`responseType`),i=r===`json`;if(W.isResponse(e)||W.isReadableStream(e))return e;if(e&&W.isString(e)&&(n&&!r||i)){let n=!(t&&t.silentJSONParsing)&&i;try{return JSON.parse(e,Bt(this,`parseReviver`))}catch(e){if(n)throw e.name===`SyntaxError`?G.from(e,G.ERR_BAD_RESPONSE,this,null,Bt(this,`response`)):e}}return e}],timeout:0,xsrfCookieName:`XSRF-TOKEN`,xsrfHeaderName:`X-XSRF-TOKEN`,maxContentLength:-1,maxBodyLength:-1,env:{FormData:Nt.classes.FormData,Blob:Nt.classes.Blob},validateStatus:function(e){return e>=200&&e<300},headers:{common:{Accept:`application/json, text/plain, */*`,"Content-Type":void 0}}};W.forEach([`delete`,`get`,`head`,`post`,`put`,`patch`,`query`],e=>{Ht.headers[e]={}});function Ut(e,t){let n=this||Ht,r=t||n,i=lt.from(r.headers),a=r.data;return W.forEach(e,function(e){a=e.call(n,a,i.normalize(),t?t.status:void 0)}),i.normalize(),a}function Wt(e){return!!(e&&e.__CANCEL__)}var Gt=class extends G{constructor(e,t,n){super(e??`canceled`,G.ERR_CANCELED,t,n),this.name=`CanceledError`,this.__CANCEL__=!0}};function Kt(e,t,n){let r=n.config.validateStatus;!n.status||!r||r(n.status)?e(n):t(new G(`Request failed with status code `+n.status,n.status>=400&&n.status<500?G.ERR_BAD_REQUEST:G.ERR_BAD_RESPONSE,n.config,n.request,n))}function qt(e){let t=/^([-+\w]{1,25}):(?:\/\/)?/.exec(e);return t&&t[1]||``}function Jt(e,t){e||=10;let n=Array(e),r=Array(e),i=0,a=0,o;return t=t===void 0?1e3:t,function(s){let c=Date.now(),l=r[a];o||=c,n[i]=s,r[i]=c;let u=a,d=0;for(;u!==i;)d+=n[u++],u%=e;if(i=(i+1)%e,i===a&&(a=(a+1)%e),c-o<t)return;let f=l&&c-l;return f?Math.round(d*1e3/f):void 0}}function Yt(e,t){let n=0,r=1e3/t,i,a,o=(t,r=Date.now())=>{n=r,i=null,a&&=(clearTimeout(a),null),e(...t)};return[(...e)=>{let t=Date.now(),s=t-n;s>=r?o(e,t):(i=e,a||=setTimeout(()=>{a=null,o(i)},r-s))},()=>i&&o(i)]}var Xt=(e,t,n=3)=>{let r=0,i=Jt(50,250);return Yt(n=>{if(!n||typeof n.loaded!=`number`)return;let a=n.loaded,o=n.lengthComputable?n.total:void 0,s=o==null?a:Math.min(a,o),c=Math.max(0,s-r),l=i(c);r=Math.max(r,s),e({loaded:s,total:o,progress:o?s/o:void 0,bytes:c,rate:l||void 0,estimated:l&&o?(o-s)/l:void 0,event:n,lengthComputable:o!=null,[t?`download`:`upload`]:!0})},n)},Zt=(e,t)=>{let n=e!=null;return[r=>t[0]({lengthComputable:n,total:e,loaded:r}),t[1]]},Qt=e=>(...t)=>W.asap(()=>e(...t)),$t=Nt.hasStandardBrowserEnv?((e,t)=>n=>(n=new URL(n,Nt.origin),e.protocol===n.protocol&&e.host===n.host&&(t||e.port===n.port)))(new URL(Nt.origin),Nt.navigator&&/(msie|trident)/i.test(Nt.navigator.userAgent)):()=>!0,en=Nt.hasStandardBrowserEnv?{write(e,t,n,r,i,a,o){if(typeof document>`u`)return;let s=[`${e}=${encodeURIComponent(t)}`];W.isNumber(n)&&s.push(`expires=${new Date(n).toUTCString()}`),W.isString(r)&&s.push(`path=${r}`),W.isString(i)&&s.push(`domain=${i}`),a===!0&&s.push(`secure`),W.isString(o)&&s.push(`SameSite=${o}`),document.cookie=s.join(`; `)},read(e){if(typeof document>`u`)return null;let t=document.cookie.split(`;`);for(let n=0;n<t.length;n++){let r=t[n].replace(/^\s+/,``),i=r.indexOf(`=`);if(i!==-1&&r.slice(0,i)===e)try{return decodeURIComponent(r.slice(i+1))}catch{return r.slice(i+1)}}return null},remove(e){this.write(e,``,Date.now()-864e5,`/`)}}:{write(){},read(){return null},remove(){}};function tn(e){return typeof e==`string`&&/^([a-z][a-z\d+\-.]*:)?\/\//i.test(e)}function nn(e,t){return t?e.replace(/\/?\/$/,``)+`/`+t.replace(/^\/+/,``):e}var rn=/^https?:(?!\/\/)/i,an=/[\t\n\r]/g;function on(e){let t=0;for(;t<e.length&&e.charCodeAt(t)<=32;)t++;return e.slice(t)}function sn(e){return on(e).replace(an,``)}function cn(e,t){if(typeof e==`string`&&rn.test(sn(e)))throw new G(`Invalid URL: missing "//" after protocol`,G.ERR_INVALID_URL,t)}function ln(e,t,n,r){cn(t,r);let i=!tn(t);return e&&(i||n===!1)?(cn(e,r),nn(e,t)):t}var un=e=>e instanceof lt?{...e}:e;function dn(e,t){e||={},t||={};let n=Object.create(null);Object.defineProperty(n,"hasOwnProperty",{__proto__:null,value:Object.prototype.hasOwnProperty,enumerable:!1,writable:!0,configurable:!0});function r(e,t,n,r){return W.isPlainObject(e)&&W.isPlainObject(t)?W.merge.call({caseless:r},e,t):W.isPlainObject(t)?W.merge({},t):W.isArray(t)?t.slice():t}function i(e,t,n,i){if(!W.isUndefined(t))return r(e,t,n,i);if(!W.isUndefined(e))return r(void 0,e,n,i)}function a(e,t){if(!W.isUndefined(t))return r(void 0,t)}function o(e,t){if(!W.isUndefined(t))return r(void 0,t);if(!W.isUndefined(e))return r(void 0,e)}function s(n){let r=W.hasOwnProp(t,`transitional`)?t.transitional:void 0;if(!W.isUndefined(r))if(W.isPlainObject(r)){if(W.hasOwnProp(r,n))return r[n]}else return;let i=W.hasOwnProp(e,`transitional`)?e.transitional:void 0;if(W.isPlainObject(i)&&W.hasOwnProp(i,n))return i[n]}function c(n,i,a){if(W.hasOwnProp(t,a))return r(n,i);if(W.hasOwnProp(e,a))return r(void 0,n)}let l={url:a,method:a,data:a,baseURL:o,transformRequest:o,transformResponse:o,paramsSerializer:o,timeout:o,timeoutMessage:o,withCredentials:o,withXSRFToken:o,adapter:o,responseType:o,xsrfCookieName:o,xsrfHeaderName:o,onUploadProgress:o,onDownloadProgress:o,decompress:o,maxContentLength:o,maxBodyLength:o,beforeRedirect:o,transport:o,httpAgent:o,httpsAgent:o,cancelToken:o,socketPath:o,allowedSocketPaths:o,responseEncoding:o,validateStatus:c,headers:(e,t,n)=>i(un(e),un(t),n,!0)};return W.forEach(Object.keys({...e,...t}),function(r){if(r===`__proto__`||r===`constructor`||r===`prototype`)return;let a=W.hasOwnProp(l,r)?l[r]:i,o=a(W.hasOwnProp(e,r)?e[r]:void 0,W.hasOwnProp(t,r)?t[r]:void 0,r);W.isUndefined(o)&&a!==c||(n[r]=o)}),W.hasOwnProp(t,`validateStatus`)&&W.isUndefined(t.validateStatus)&&s(`validateStatusUndefinedResolves`)===!1&&(W.hasOwnProp(e,`validateStatus`)?n.validateStatus=r(void 0,e.validateStatus):delete n.validateStatus),n}var fn=[`content-type`,`content-length`];function pn(e,t,n){if(n!==`content-only`){e.set(t);return}Object.entries(t||{}).forEach(([t,n])=>{fn.includes(t.toLowerCase())&&e.set(t,n)})}var mn=e=>encodeURIComponent(e).replace(/%([0-9A-F]{2})/gi,(e,t)=>String.fromCharCode(parseInt(t,16)));function hn(e){let t=dn({},e),n=e=>W.hasOwnProp(t,e)?t[e]:void 0,r=n(`data`),i=n(`withXSRFToken`),a=n(`xsrfHeaderName`),o=n(`xsrfCookieName`),s=n(`headers`),c=n(`auth`),l=n(`baseURL`),u=n(`allowAbsoluteUrls`),d=n(`url`);if(t.headers=s=lt.from(s),t.url=Ct(ln(l,d,u,t),n(`params`),n(`paramsSerializer`)),c){let t=W.getSafeProp(c,`username`)||``,n=W.getSafeProp(c,`password`)||``;try{s.set(`Authorization`,`Basic `+btoa(t+`:`+(n?mn(n):``)))}catch(t){throw G.from(t,G.ERR_BAD_OPTION_VALUE,e)}}if(W.isFormData(r)&&(Nt.hasStandardBrowserEnv||Nt.hasStandardBrowserWebWorkerEnv||W.isReactNative(r)?s.setContentType(void 0):W.isFunction(r.getHeaders)&&pn(s,r.getHeaders(),n(`formDataHeaderPolicy`))),Nt.hasStandardBrowserEnv&&(W.isFunction(i)&&(i=i(t)),i===!0||i==null&&$t(t.url))){let e=a&&o&&en.read(o);e&&s.set(a,e)}return t}var gn=typeof XMLHttpRequest<`u`&&function(e){return new Promise(function(t,n){let r=hn(e),i=r.data,a=lt.from(r.headers).normalize(),{responseType:o,onUploadProgress:s,onDownloadProgress:c}=r,l,u,d,f,p;function m(){f&&f(),p&&p(),r.cancelToken&&r.cancelToken.unsubscribe(l),r.signal&&r.signal.removeEventListener(`abort`,l)}let h=new XMLHttpRequest;h.open(r.method.toUpperCase(),r.url,!0),h.timeout=r.timeout;function g(){if(!h)return;let r=lt.from(`getAllResponseHeaders`in h&&h.getAllResponseHeaders());Kt(function(e){t(e),m()},function(e){n(e),m()},{data:!o||o===`text`||o===`json`?h.responseText:h.response,status:h.status,statusText:h.statusText,headers:r,config:e,request:h}),h=null}`onloadend`in h?h.onloadend=g:h.onreadystatechange=function(){!h||h.readyState!==4||h.status===0&&!(h.responseURL&&h.responseURL.startsWith(`file:`))||setTimeout(g)},h.onabort=function(){h&&=(n(new G(`Request aborted`,G.ECONNABORTED,e,h)),m(),null)},h.onerror=function(t){let r=new G(t&&t.message?t.message:`Network Error`,G.ERR_NETWORK,e,h);r.event=t||null,n(r),m(),h=null},h.ontimeout=function(){let t=r.timeout?`timeout of `+r.timeout+`ms exceeded`:`timeout exceeded`,i=r.transitional||Tt;r.timeoutErrorMessage&&(t=r.timeoutErrorMessage),n(new G(t,i.clarifyTimeoutError?G.ETIMEDOUT:G.ECONNABORTED,e,h)),m(),h=null},i===void 0&&a.setContentType(null),`setRequestHeader`in h&&W.forEach(et(a),function(e,t){h.setRequestHeader(t,e)}),W.isUndefined(r.withCredentials)||(h.withCredentials=!!r.withCredentials),o&&o!==`json`&&(h.responseType=r.responseType),c&&([d,p]=Xt(c,!0),h.addEventListener(`progress`,d)),s&&h.upload&&([u,f]=Xt(s),h.upload.addEventListener(`progress`,u),h.upload.addEventListener(`loadend`,f)),(r.cancelToken||r.signal)&&(l=t=>{h&&=(n(!t||t.type?new Gt(null,e,h):t),h.abort(),m(),null)},r.cancelToken&&r.cancelToken.subscribe(l),r.signal&&(r.signal.aborted?l():r.signal.addEventListener(`abort`,l)));let _=qt(r.url);if(_&&!Nt.protocols.includes(_)){n(new G(`Unsupported protocol `+_+`:`,G.ERR_BAD_REQUEST,e)),m();return}h.send(i||null)})},_n=(e,t)=>{if(e=e?e.filter(Boolean):[],!t&&!e.length)return;let n=new AbortController,r=!1,i=function(e){if(!r){r=!0,o();let t=e instanceof Error?e:this.reason;n.abort(t instanceof G?t:new Gt(t instanceof Error?t.message:t))}},a=t&&setTimeout(()=>{a=null,i(new G(`timeout of ${t}ms exceeded`,G.ETIMEDOUT))},t),o=()=>{e&&=(a&&clearTimeout(a),a=null,e.forEach(e=>{e.unsubscribe?e.unsubscribe(i):e.removeEventListener(`abort`,i)}),null)};e.forEach(e=>e.addEventListener(`abort`,i,{once:!0}));let{signal:s}=n;return s.unsubscribe=()=>W.asap(o),s},vn=function*(e,t){let n=e.byteLength;if(!t||n<t){yield e;return}let r=0,i;for(;r<n;)i=r+t,yield e.slice(r,i),r=i},yn=async function*(e,t){for await(let n of bn(e))yield*vn(n,t)},bn=async function*(e){if(e[Symbol.asyncIterator]){yield*e;return}let t=e.getReader();try{for(;;){let{done:e,value:n}=await t.read();if(e)break;yield n}}finally{await t.cancel()}},xn=(e,t,n,r)=>{let i=yn(e,t),a=0,o,s=e=>{o||(o=!0,r&&r(e))};return new ReadableStream({async pull(e){try{let{done:t,value:r}=await i.next();if(t){s(),e.close();return}let o=r.byteLength;n&&n(a+=o),e.enqueue(new Uint8Array(r))}catch(e){throw s(e),e}},cancel(e){return s(e),i.return()}},{highWaterMark:2})},Sn=e=>e>=48&&e<=57||e>=65&&e<=70||e>=97&&e<=102,Cn=(e,t,n)=>t+2<n&&Sn(e.charCodeAt(t+1))&&Sn(e.charCodeAt(t+2));function wn(e){if(!e||typeof e!=`string`||!e.startsWith(`data:`))return 0;let t=e.indexOf(`,`);if(t<0)return 0;let n=e.slice(5,t),r=e.slice(t+1);if(/;base64/i.test(n)){let e=r.length,t=r.length;for(let n=0;n<t;n++)if(r.charCodeAt(n)===37&&n+2<t){let t=r.charCodeAt(n+1),i=r.charCodeAt(n+2);Sn(t)&&Sn(i)&&(e-=2,n+=2)}let n=0,i=t-1,a=e=>e>=2&&r.charCodeAt(e-2)===37&&r.charCodeAt(e-1)===51&&(r.charCodeAt(e)===68||r.charCodeAt(e)===100);i>=0&&(r.charCodeAt(i)===61?(n++,i--):a(i)&&(n++,i-=3)),n===1&&i>=0&&(r.charCodeAt(i)===61||a(i))&&n++;let o=Math.floor(e/4)*3-(n||0);return o>0?o:0}let i=0;for(let e=0,t=r.length;e<t;e++){let n=r.charCodeAt(e);if(n===37&&Cn(r,e,t))i+=1,e+=2;else if(n<128)i+=1;else if(n<2048)i+=2;else if(n>=55296&&n<=56319&&e+1<t){let t=r.charCodeAt(e+1);t>=56320&&t<=57343?(i+=4,e++):i+=3}else i+=3}return i}var Tn=`1.18.1`,En=64*1024,{isFunction:Dn}=W,On=e=>encodeURIComponent(e).replace(/%([0-9A-F]{2})/gi,(e,t)=>String.fromCharCode(parseInt(t,16))),kn=e=>{if(!W.isString(e))return e;try{return decodeURIComponent(e)}catch{return e}},An=(e,...t)=>{try{return!!e(...t)}catch{return!1}},jn=e=>{let t=e.indexOf(`://`),n=e;return t!==-1&&(n=n.slice(t+3)),n.includes(`@`)||n.includes(`:`)},Mn=e=>{let t=W.global!==void 0&&W.global!==null?W.global:globalThis,{ReadableStream:n,TextEncoder:r}=t;e=W.merge.call({skipUndefined:!0},{Request:t.Request,Response:t.Response},e);let{fetch:i,Request:a,Response:o}=e,s=i?Dn(i):typeof fetch==`function`,c=Dn(a),l=Dn(o);if(!s)return!1;let u=s&&Dn(n),d=s&&(typeof r==`function`?(e=>t=>e.encode(t))(new r):async e=>new Uint8Array(await new a(e).arrayBuffer())),f=c&&u&&An(()=>{let e=!1,t=new a(Nt.origin,{body:new n,method:`POST`,get duplex(){return e=!0,`half`}}),r=t.headers.has(`Content-Type`);return t.body!=null&&t.body.cancel(),e&&!r}),p=l&&u&&An(()=>W.isReadableStream(new o(``).body)),m={stream:p&&(e=>e.body)};s&&[`text`,`arrayBuffer`,`blob`,`formData`,`stream`].forEach(e=>{!m[e]&&(m[e]=(t,n)=>{let r=t&&t[e];if(r)return r.call(t);throw new G(`Response type '${e}' is not supported`,G.ERR_NOT_SUPPORT,n)})});let h=async e=>{if(e==null)return 0;if(W.isBlob(e))return e.size;if(W.isSpecCompliantForm(e))return(await new a(Nt.origin,{method:`POST`,body:e}).arrayBuffer()).byteLength;if(W.isArrayBufferView(e)||W.isArrayBuffer(e))return e.byteLength;if(W.isURLSearchParams(e)&&(e+=``),W.isString(e))return(await d(e)).byteLength},g=async(e,t)=>W.toFiniteNumber(e.getContentLength())??h(t);return async e=>{let{url:t,method:n,data:s,signal:l,cancelToken:d,timeout:_,onDownloadProgress:v,onUploadProgress:y,responseType:b,headers:x,withCredentials:S=`same-origin`,fetchOptions:C,maxContentLength:w,maxBodyLength:T}=hn(e),E=W.isNumber(w)&&w>-1,D=W.isNumber(T)&&T>-1,O=t=>W.hasOwnProp(e,t)?e[t]:void 0,k=i||fetch;b=b?(b+``).toLowerCase():`text`;let A=_n([l,d&&d.toAbortSignal()],_),j=null,M=A&&A.unsubscribe&&(()=>{A.unsubscribe()}),N,P=null,F=()=>new G(`Request body larger than maxBodyLength limit`,G.ERR_BAD_REQUEST,e,j);try{let i,l=O(`auth`);if(l&&(i={username:W.getSafeProp(l,`username`)||``,password:W.getSafeProp(l,`password`)||``}),jn(t)){let e=new URL(t,Nt.origin);!i&&(e.username||e.password)&&(i={username:kn(e.username),password:kn(e.password)}),(e.username||e.password)&&(e.username=``,e.password=``,t=e.href)}if(i&&(x.delete(`authorization`),x.set(`Authorization`,`Basic `+btoa(On((i.username||``)+`:`+(i.password||``))))),E&&typeof t==`string`&&t.startsWith(`data:`)&&wn(t)>w)throw new G(`maxContentLength size of `+w+` exceeded`,G.ERR_BAD_RESPONSE,e,j);if(D&&n!==`get`&&n!==`head`){let e=await h(s);if(typeof e==`number`&&isFinite(e)&&(N=e,e>T))throw F()}let d=D&&(W.isReadableStream(s)||W.isStream(s)),_=(e,t,n)=>xn(e,En,e=>{if(D&&e>T)throw P=F();t&&t(e)},n);if(f&&n!==`get`&&n!==`head`&&(y||d)){if(N??=await g(x,s),N!==0||d){let e=new a(t,{method:`POST`,body:s,duplex:`half`}),n;if(W.isFormData(s)&&(n=e.headers.get(`content-type`))&&x.setContentType(n),e.body){let[t,n]=y&&Zt(N,Xt(Qt(y)))||[];s=_(e.body,t,n)}}}else if(d&&!c&&u&&n!==`get`&&n!==`head`)s=_(s);else if(d&&c&&!f&&n!==`get`&&n!==`head`)throw new G(`Stream request bodies are not supported by the current fetch implementation`,G.ERR_NOT_SUPPORT,e,j);W.isString(S)||(S=S?`include`:`omit`);let I=c&&`credentials`in a.prototype;if(W.isFormData(s)){let e=x.getContentType();e&&/^multipart\/form-data/i.test(e)&&!/boundary=/i.test(e)&&x.delete(`content-type`)}x.set(`User-Agent`,`axios/`+Tn,!1);let L={...C,signal:A,method:n.toUpperCase(),headers:et(x.normalize()),body:s,duplex:`half`,credentials:I?S:void 0};j=c&&new a(t,L);let R=await(c?k(j,C):k(t,L)),ee=lt.from(R.headers);if(E){let t=W.toFiniteNumber(ee.getContentLength());if(t!=null&&t>w)throw new G(`maxContentLength size of `+w+` exceeded`,G.ERR_BAD_RESPONSE,e,j)}let te=p&&(b===`stream`||b===`response`);if(p&&R.body&&(v||E||te&&M)){let t={};[`status`,`statusText`,`headers`].forEach(e=>{t[e]=R[e]});let n=W.toFiniteNumber(ee.getContentLength()),[r,i]=v&&Zt(n,Xt(Qt(v),!0))||[],a=0;R=new o(xn(R.body,En,t=>{if(E&&(a=t,a>w))throw new G(`maxContentLength size of `+w+` exceeded`,G.ERR_BAD_RESPONSE,e,j);r&&r(t)},()=>{i&&i(),M&&M()}),t)}b||=`text`;let z=await m[W.findKey(m,b)||`text`](R,e);if(E&&!p&&!te){let t;if(z!=null&&(typeof z.byteLength==`number`?t=z.byteLength:typeof z.size==`number`?t=z.size:typeof z==`string`&&(t=typeof r==`function`?new r().encode(z).byteLength:z.length)),typeof t==`number`&&t>w)throw new G(`maxContentLength size of `+w+` exceeded`,G.ERR_BAD_RESPONSE,e,j)}return!te&&M&&M(),await new Promise((t,n)=>{Kt(t,n,{data:z,headers:lt.from(R.headers),status:R.status,statusText:R.statusText,config:e,request:j})})}catch(t){if(M&&M(),A&&A.aborted&&A.reason instanceof G){let n=A.reason;throw n.config=e,j&&(n.request=j),t!==n&&Object.defineProperty(n,"cause",{__proto__:null,value:t,writable:!0,enumerable:!1,configurable:!0}),n}if(P)throw j&&!P.request&&(P.request=j),P;if(t instanceof G)throw j&&!t.request&&(t.request=j),t;if(t&&t.name===`TypeError`&&/Load failed|fetch/i.test(t.message)){let n=new G(`Network Error`,G.ERR_NETWORK,e,j,t&&t.response);throw Object.defineProperty(n,"cause",{__proto__:null,value:t.cause||t,writable:!0,enumerable:!1,configurable:!0}),n}throw G.from(t,t&&t.code,e,j,t&&t.response)}}},Nn=new Map,Pn=e=>{let t=e&&e.env||{},{fetch:n,Request:r,Response:i}=t,a=[r,i,n],o=a.length,s,c,l=Nn;for(;o--;)s=a[o],c=l.get(s),c===void 0&&l.set(s,c=o?new Map:Mn(t)),l=c;return c};Pn();var Fn={http:null,xhr:gn,fetch:{get:Pn}};W.forEach(Fn,(e,t)=>{if(e){try{Object.defineProperty(e,"name",{__proto__:null,value:t})}catch{}Object.defineProperty(e,"adapterName",{__proto__:null,value:t})}});var In=e=>`- ${e}`,Ln=e=>W.isFunction(e)||e===null||e===!1;function Rn(e,t){e=W.isArray(e)?e:[e];let{length:n}=e,r,i,a={};for(let o=0;o<n;o++){r=e[o];let n;if(i=r,!Ln(r)&&(i=Fn[(n=String(r)).toLowerCase()],i===void 0))throw new G(`Unknown adapter '${n}'`);if(i&&(W.isFunction(i)||(i=i.get(t))))break;a[n||`#`+o]=i}if(!i){let e=Object.entries(a).map(([e,t])=>`adapter ${e} `+(t===!1?`is not supported by the environment`:`is not available in the build`));throw new G(`There is no suitable adapter to dispatch the request `+(n?e.length>1?`since :
`+e.map(In).join(`
`):` `+In(e[0]):`as no adapter specified`),G.ERR_NOT_SUPPORT)}return i}var zn={getAdapter:Rn,adapters:Fn};function Bn(e){if(e.cancelToken&&e.cancelToken.throwIfRequested(),e.signal&&e.signal.aborted)throw new Gt(null,e)}function Vn(e){return Bn(e),e.headers=lt.from(e.headers),e.data=Ut.call(e,e.transformRequest),[`post`,`put`,`patch`].indexOf(e.method)!==-1&&e.headers.setContentType(`application/x-www-form-urlencoded`,!1),zn.getAdapter(e.adapter||Ht.adapter,e)(e).then(function(t){Bn(e),e.response=t;try{t.data=Ut.call(e,e.transformResponse,t)}finally{delete e.response}return t.headers=lt.from(t.headers),t},function(t){if(!Wt(t)&&(Bn(e),t&&t.response)){e.response=t.response;try{t.response.data=Ut.call(e,e.transformResponse,t.response)}finally{delete e.response}t.response.headers=lt.from(t.response.headers)}return Promise.reject(t)})}var Hn={};[`object`,`boolean`,`number`,`function`,`string`,`symbol`].forEach((e,t)=>{Hn[e]=function(n){return typeof n===e||`a`+(t<1?`n `:` `)+e}});var Un={};Hn.transitional=function(e,t,n){function r(e,t){return`[Axios v`+Tn+`] Transitional option '`+e+`'`+t+(n?`. `+n:``)}return(n,i,a)=>{if(e===!1)throw new G(r(i,` has been removed`+(t?` in `+t:``)),G.ERR_DEPRECATED);return t&&!Un[i]&&(Un[i]=!0,console.warn(r(i,` has been deprecated since v`+t+` and will be removed in the near future`))),!e||e(n,i,a)}},Hn.spelling=function(e){return(t,n)=>(console.warn(`${n} is likely a misspelling of ${e}`),!0)};function Wn(e,t,n){if(typeof e!=`object`||!e)throw new G(`options must be an object`,G.ERR_BAD_OPTION_VALUE);let r=Object.keys(e),i=r.length;for(;i-->0;){let a=r[i],o=Object.prototype.hasOwnProperty.call(t,a)?t[a]:void 0;if(o){let t=e[a],n=t===void 0||o(t,a,e);if(n!==!0)throw new G(`option `+a+` must be `+n,G.ERR_BAD_OPTION_VALUE);continue}if(n!==!0)throw new G(`Unknown option `+a,G.ERR_BAD_OPTION)}}var Gn={assertOptions:Wn,validators:Hn},Kn=Gn.validators,qn=class{constructor(e){this.defaults=e||{},this.interceptors={request:new wt,response:new wt}}async request(e,t){try{return await this._request(e,t)}catch(e){if(e instanceof Error){let t={};Error.captureStackTrace?Error.captureStackTrace(t):t=Error();let n=(()=>{if(!t.stack)return``;let e=t.stack.indexOf(`
`);return e===-1?``:t.stack.slice(e+1)})();try{if(!e.stack)e.stack=n;else if(n){let t=n.indexOf(`
`),r=t===-1?-1:n.indexOf(`
`,t+1),i=r===-1?``:n.slice(r+1);String(e.stack).endsWith(i)||(e.stack+=`
`+n)}}catch{}}throw e}}_request(e,t){typeof e==`string`?(t||={},t.url=e):t=e||{},t=dn(this.defaults,t);let{transitional:n,paramsSerializer:r,headers:i}=t;n!==void 0&&Gn.assertOptions(n,{silentJSONParsing:Kn.transitional(Kn.boolean),forcedJSONParsing:Kn.transitional(Kn.boolean),clarifyTimeoutError:Kn.transitional(Kn.boolean),legacyInterceptorReqResOrdering:Kn.transitional(Kn.boolean),advertiseZstdAcceptEncoding:Kn.transitional(Kn.boolean),validateStatusUndefinedResolves:Kn.transitional(Kn.boolean)},!1),r!=null&&(W.isFunction(r)?t.paramsSerializer={serialize:r}:Gn.assertOptions(r,{encode:Kn.function,serialize:Kn.function},!0)),t.allowAbsoluteUrls!==void 0||(this.defaults.allowAbsoluteUrls===void 0?t.allowAbsoluteUrls=!0:t.allowAbsoluteUrls=this.defaults.allowAbsoluteUrls),Gn.assertOptions(t,{baseUrl:Kn.spelling(`baseURL`),withXsrfToken:Kn.spelling(`withXSRFToken`)},!0),t.method=(t.method||this.defaults.method||`get`).toLowerCase();let a=i&&W.merge(i.common,i[t.method]);i&&W.forEach([`delete`,`get`,`head`,`post`,`put`,`patch`,`query`,`common`],e=>{delete i[e]}),t.headers=lt.concat(a,i);let o=[],s=!0;this.interceptors.request.forEach(function(e){if(typeof e.runWhen==`function`&&e.runWhen(t)===!1)return;s&&=e.synchronous;let n=t.transitional||Tt;n&&n.legacyInterceptorReqResOrdering?o.unshift(e.fulfilled,e.rejected):o.push(e.fulfilled,e.rejected)});let c=[];this.interceptors.response.forEach(function(e){c.push(e.fulfilled,e.rejected)});let l,u=0,d;if(!s){let e=[Vn.bind(this),void 0];for(e.unshift(...o),e.push(...c),d=e.length,l=Promise.resolve(t);u<d;)l=l.then(e[u++],e[u++]);return l}d=o.length;let f=t;for(;u<d;){let e=o[u++],t=o[u++];try{f=e(f)}catch(e){t.call(this,e);break}}try{l=Vn.call(this,f)}catch(e){return Promise.reject(e)}for(u=0,d=c.length;u<d;)l=l.then(c[u++],c[u++]);return l}getUri(e){return e=dn(this.defaults,e),Ct(ln(e.baseURL,e.url,e.allowAbsoluteUrls,e),e.params,e.paramsSerializer)}};W.forEach([`delete`,`get`,`head`,`options`],function(e){qn.prototype[e]=function(t,n){return this.request(dn(n||{},{method:e,url:t,data:n&&W.hasOwnProp(n,`data`)?n.data:void 0}))}}),W.forEach([`post`,`put`,`patch`,`query`],function(e){function t(t){return function(n,r,i){return this.request(dn(i||{},{method:e,headers:t?{"Content-Type":`multipart/form-data`}:{},url:n,data:r}))}}qn.prototype[e]=t(),e!==`query`&&(qn.prototype[e+`Form`]=t(!0))});var Jn=class e{constructor(e){if(typeof e!=`function`)throw TypeError(`executor must be a function.`);let t;this.promise=new Promise(function(e){t=e});let n=this;this.promise.then(e=>{if(!n._listeners)return;let t=n._listeners.length;for(;t-->0;)n._listeners[t](e);n._listeners=null}),this.promise.then=e=>{let t,r=new Promise(e=>{n.subscribe(e),t=e}).then(e);return r.cancel=function(){n.unsubscribe(t)},r},e(function(e,r,i){n.reason||(n.reason=new Gt(e,r,i),t(n.reason))})}throwIfRequested(){if(this.reason)throw this.reason}subscribe(e){if(this.reason){e(this.reason);return}this._listeners?this._listeners.push(e):this._listeners=[e]}unsubscribe(e){if(!this._listeners)return;let t=this._listeners.indexOf(e);t!==-1&&this._listeners.splice(t,1)}toAbortSignal(){let e=new AbortController,t=t=>{e.abort(t)};return this.subscribe(t),e.signal.unsubscribe=()=>this.unsubscribe(t),e.signal}static source(){let t;return{token:new e(function(e){t=e}),cancel:t}}};function Yn(e){return function(t){return e.apply(null,t)}}function Xn(e){return W.isObject(e)&&e.isAxiosError===!0}var Zn={Continue:100,SwitchingProtocols:101,Processing:102,EarlyHints:103,Ok:200,Created:201,Accepted:202,NonAuthoritativeInformation:203,NoContent:204,ResetContent:205,PartialContent:206,MultiStatus:207,AlreadyReported:208,ImUsed:226,MultipleChoices:300,MovedPermanently:301,Found:302,SeeOther:303,NotModified:304,UseProxy:305,Unused:306,TemporaryRedirect:307,PermanentRedirect:308,BadRequest:400,Unauthorized:401,PaymentRequired:402,Forbidden:403,NotFound:404,MethodNotAllowed:405,NotAcceptable:406,ProxyAuthenticationRequired:407,RequestTimeout:408,Conflict:409,Gone:410,LengthRequired:411,PreconditionFailed:412,PayloadTooLarge:413,UriTooLong:414,UnsupportedMediaType:415,RangeNotSatisfiable:416,ExpectationFailed:417,ImATeapot:418,MisdirectedRequest:421,UnprocessableEntity:422,Locked:423,FailedDependency:424,TooEarly:425,UpgradeRequired:426,PreconditionRequired:428,TooManyRequests:429,RequestHeaderFieldsTooLarge:431,UnavailableForLegalReasons:451,InternalServerError:500,NotImplemented:501,BadGateway:502,ServiceUnavailable:503,GatewayTimeout:504,HttpVersionNotSupported:505,VariantAlsoNegotiates:506,InsufficientStorage:507,LoopDetected:508,NotExtended:510,NetworkAuthenticationRequired:511,WebServerIsDown:521,ConnectionTimedOut:522,OriginIsUnreachable:523,TimeoutOccurred:524,SslHandshakeFailed:525,InvalidSslCertificate:526};Object.entries(Zn).forEach(([e,t])=>{Zn[t]=e});function Qn(e){let t=new qn(e),n=b(qn.prototype.request,t);return W.extend(n,qn.prototype,t,{allOwnKeys:!0}),W.extend(n,t,null,{allOwnKeys:!0}),n.create=function(t){return Qn(dn(e,t))},n}var K=Qn(Ht);K.Axios=qn,K.CanceledError=Gt,K.CancelToken=Jn,K.isCancel=Wt,K.VERSION=Tn,K.toFormData=vt,K.AxiosError=G,K.Cancel=K.CanceledError,K.all=function(e){return Promise.all(e)},K.spread=Yn,K.isAxiosError=Xn,K.mergeConfig=dn,K.AxiosHeaders=lt,K.formToJSON=e=>zt(W.isHTMLForm(e)?new FormData(e):e),K.getAdapter=zn.getAdapter,K.HttpStatusCode=Zn,K.default=K;var $n=o((e=>{var t=Symbol.for(`react.transitional.element`),n=Symbol.for(`react.fragment`);function r(e,n,r){var i=null;if(r!==void 0&&(i=``+r),n.key!==void 0&&(i=``+n.key),`key`in n)for(var a in r={},n)a!==`key`&&(r[a]=n[a]);else r=n;return n=r.ref,{$$typeof:t,type:e,key:i,ref:n===void 0?null:n,props:r}}e.Fragment=n,e.jsx=r,e.jsxs=r})),q=o(((e,t)=>{t.exports=$n()}))(),er=(0,v.createContext)(null),tr=()=>typeof window<`u`&&(window.location.hostname===`localhost`||window.location.hostname===`127.0.0.1`)&&(window.location.port===`5173`||window.location.port===`3000`)?`http://127.0.0.1:8000/api`:`/api`;K.defaults.baseURL=tr();var nr=({children:e})=>{let[t,n]=(0,v.useState)(()=>localStorage.getItem(`theme`)||`light`),[r,i]=(0,v.useState)(()=>localStorage.getItem(`ui-kit`)||`corporate`),[a,o]=(0,v.useState)(()=>localStorage.getItem(`company-id`)||null),[s,c]=(0,v.useState)(()=>localStorage.getItem(`branch-id`)||null),[l,u]=(0,v.useState)(()=>{let e=localStorage.getItem(`user`);return e?JSON.parse(e):null}),[d,f]=(0,v.useState)(()=>localStorage.getItem(`token`)||null);(0,v.useEffect)(()=>{document.documentElement.setAttribute(`data-theme`,t),localStorage.setItem(`theme`,t)},[t]),(0,v.useEffect)(()=>{document.documentElement.setAttribute(`data-ui-kit`,r),localStorage.setItem(`ui-kit`,r)},[r]),(0,v.useEffect)(()=>{a?(K.defaults.headers.common[`X-Company-ID`]=a,localStorage.setItem(`company-id`,a)):(delete K.defaults.headers.common[`X-Company-ID`],localStorage.removeItem(`company-id`))},[a]),(0,v.useEffect)(()=>{s?(K.defaults.headers.common[`X-Branch-ID`]=s,localStorage.setItem(`branch-id`,s)):(delete K.defaults.headers.common[`X-Branch-ID`],localStorage.removeItem(`branch-id`))},[s]),(0,v.useEffect)(()=>{d?(K.defaults.headers.common.Authorization=`Bearer ${d}`,localStorage.setItem(`token`,d)):(delete K.defaults.headers.common.Authorization,localStorage.removeItem(`token`))},[d]),(0,v.useEffect)(()=>{l?localStorage.setItem(`user`,JSON.stringify(l)):localStorage.removeItem(`user`)},[l]);let[p,m]=(0,v.useState)(()=>{let e=localStorage.getItem(`active-branch`);return e?JSON.parse(e):null}),[h,g]=(0,v.useState)([]),[_,y]=(0,v.useState)([]),[b,x]=(0,v.useState)(0);(0,v.useEffect)(()=>{if(p?.id||s){let e=p?.id||s;K.defaults.headers.common[`X-Branch-ID`]=e,localStorage.setItem(`branch-id`,e)}else delete K.defaults.headers.common[`X-Branch-ID`],localStorage.removeItem(`branch-id`)},[p,s]);let S=async()=>{if(d)try{let e=await K.get(`/v1/notifications`);y(e.data.notifications||[]),x(e.data.unread_count||0)}catch{}},C=async e=>{try{let t=await K.post(`/v1/auth/switch-branch`,{branch_id:parseInt(e)}),n=t.data.active_branch;return m(n),c(n.id.toString()),localStorage.setItem(`active-branch`,JSON.stringify(n)),localStorage.setItem(`branch-id`,n.id.toString()),K.defaults.headers.common[`X-Branch-ID`]=n.id,{success:!0,message:t.data.message}}catch(e){return{success:!1,error:e.response?.data?.error||`Impossible de changer de boutique.`}}},w=(e,t)=>{if(f(t),u(e),e.company_id?o(e.company_id.toString()):o(null),e.active_branch)m(e.active_branch),c(e.active_branch.id.toString()),localStorage.setItem(`active-branch`,JSON.stringify(e.active_branch));else if(e.branch?.id){let t={id:e.branch.id,name:e.branch.name};m(t),c(t.id.toString()),localStorage.setItem(`active-branch`,JSON.stringify(t))}e.assigned_branches&&g(e.assigned_branches)},T=()=>{f(null),u(null),m(null),g([]),y([]),x(0),o(null),c(null),localStorage.removeItem(`company-id`),localStorage.removeItem(`branch-id`),localStorage.removeItem(`active-branch`),delete K.defaults.headers.common[`X-Company-ID`],delete K.defaults.headers.common[`X-Branch-ID`]};return(0,v.useEffect)(()=>{let e=K.interceptors.response.use(e=>e,e=>(e.response&&e.response.status===401&&T(),Promise.reject(e)));return()=>{K.interceptors.response.eject(e)}},[]),(0,q.jsx)(er.Provider,{value:{theme:t,setTheme:e=>{n(e)},uiKit:r,setUiKit:e=>{i(e)},companyId:a,setCompanyId:e=>{o(e)},branchId:s,setBranchId:e=>{c(e)},activeBranch:p,assignedBranches:h,switchActiveBranch:C,notifications:_,unreadCount:b,fetchNotifications:S,user:l,token:d,login:w,logout:T},children:e})},rr=()=>{let e=(0,v.useContext)(er);if(!e)throw Error(`useApp doit être utilisé au sein d'un AppProvider`);return e},ir=()=>{let{theme:e,setTheme:t,uiKit:n,setUiKit:r,companyId:i,setCompanyId:a,branchId:o,setBranchId:s}=rr(),[c,l]=(0,v.useState)(!1),[u,d]=(0,v.useState)(()=>localStorage.getItem(`app-density`)||`normal`),[f,p]=(0,v.useState)(()=>parseInt(localStorage.getItem(`app-border-radius`)||`12`)),[m,h]=(0,v.useState)(()=>localStorage.getItem(`app-accent-color`)||`#0F4A86`);return(0,v.useEffect)(()=>{document.documentElement.setAttribute(`data-density`,u),localStorage.setItem(`app-density`,u)},[u]),(0,v.useEffect)(()=>{document.documentElement.style.setProperty(`--border-radius-base`,`${f}px`),localStorage.setItem(`app-border-radius`,f.toString())},[f]),(0,v.useEffect)(()=>{document.documentElement.style.setProperty(`--color-primary`,m),localStorage.setItem(`app-accent-color`,m)},[m]),(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(`button`,{className:`theme-floating-trigger`,onClick:()=>l(!c),title:`Configuration de l'interface`,children:(0,q.jsx)(`i`,{className:`fa-solid fa-palette`})}),(0,q.jsx)(`div`,{className:`theme-drawer-overlay ${c?`open`:``}`,onClick:()=>l(!1),children:(0,q.jsxs)(`div`,{className:`theme-drawer-card ${c?`open`:``}`,onClick:e=>e.stopPropagation(),children:[(0,q.jsxs)(`div`,{className:`drawer-header`,children:[(0,q.jsx)(`h3`,{children:`🎨 Personnalisation`}),(0,q.jsx)(`button`,{className:`btn-close-drawer`,onClick:()=>l(!1),children:(0,q.jsx)(`i`,{className:`fa-solid fa-xmark`})})]}),(0,q.jsxs)(`div`,{className:`drawer-body`,children:[(0,q.jsxs)(`div`,{className:`drawer-section`,children:[(0,q.jsx)(`span`,{className:`section-title`,children:`Design Global`}),(0,q.jsxs)(`div`,{className:`drawer-row`,children:[(0,q.jsx)(`label`,{children:`Style de l'interface`}),(0,q.jsxs)(`select`,{value:n,onChange:e=>r(e.target.value),className:`form-control`,children:[(0,q.jsx)(`option`,{value:`corporate`,children:`🏢 Corporate`}),(0,q.jsx)(`option`,{value:`glassmorphism`,children:`💎 Glassmorphism`})]})]}),(0,q.jsxs)(`div`,{className:`drawer-row`,children:[(0,q.jsx)(`label`,{children:`Mode`}),(0,q.jsxs)(`div`,{className:`theme-toggle-buttons`,children:[(0,q.jsx)(`button`,{className:`theme-mode-btn ${e===`light`?`active`:``}`,onClick:()=>t(`light`),children:`☀️ Clair`}),(0,q.jsx)(`button`,{className:`theme-mode-btn ${e===`dark`?`active`:``}`,onClick:()=>t(`dark`),children:`🌙 Sombre`})]})]})]}),(0,q.jsxs)(`div`,{className:`drawer-section`,children:[(0,q.jsx)(`span`,{className:`section-title`,children:`Ajustements Graphiques`}),(0,q.jsxs)(`div`,{className:`drawer-row`,children:[(0,q.jsxs)(`label`,{children:[`Bordures : `,f,`px`]}),(0,q.jsx)(`input`,{type:`range`,min:`0`,max:`24`,step:`2`,value:f,onChange:e=>p(parseInt(e.target.value)),className:`drawer-slider`})]}),(0,q.jsxs)(`div`,{className:`drawer-row`,children:[(0,q.jsx)(`label`,{children:`Densité d'affichage`}),(0,q.jsxs)(`select`,{value:u,onChange:e=>d(e.target.value),className:`form-control`,children:[(0,q.jsx)(`option`,{value:`compact`,children:`Compact (Petit)`}),(0,q.jsx)(`option`,{value:`normal`,children:`Normal (Moyen)`}),(0,q.jsx)(`option`,{value:`spacious`,children:`Spacieux (Grand)`})]})]}),(0,q.jsxs)(`div`,{className:`drawer-row`,children:[(0,q.jsx)(`label`,{children:`Couleur primaire`}),(0,q.jsxs)(`div`,{className:`color-presets`,children:[[`#0F4A86`,`#00A651`,`#7C3AED`,`#EC4899`,`#F59E0B`].map(e=>(0,q.jsx)(`button`,{className:`color-preset-btn ${m===e?`active`:``}`,style:{backgroundColor:e},onClick:()=>h(e)},e)),(0,q.jsx)(`input`,{type:`color`,value:m,onChange:e=>h(e.target.value),className:`custom-color-input`})]})]})]}),(0,q.jsxs)(`div`,{className:`drawer-section developer-section`,children:[(0,q.jsx)(`span`,{className:`section-title`,children:`Support & Dev`}),(0,q.jsxs)(`div`,{className:`drawer-row`,children:[(0,q.jsx)(`label`,{children:`Tenant ID`}),(0,q.jsx)(`input`,{type:`number`,className:`form-control text-center`,value:i,onChange:e=>a(e.target.value),min:`1`})]}),(0,q.jsxs)(`div`,{className:`drawer-row`,children:[(0,q.jsx)(`label`,{children:`Boutique ID`}),(0,q.jsx)(`input`,{type:`number`,className:`form-control text-center`,value:o,onChange:e=>s(e.target.value),min:`1`})]})]})]})]})}),(0,q.jsx)(`style`,{children:`
        /* TRIGGER FLOTTANT */
        .theme-floating-trigger {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 999;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--color-primary);
          color: #FFF;
          border: none;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          transition: all var(--transition-fast);
        }

        .theme-floating-trigger:hover {
          transform: rotate(45deg) scale(1.1);
        }

        /* OVERLAY ET DRAWER */
        .theme-drawer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          z-index: 1000;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }

        .theme-drawer-overlay.open {
          opacity: 1;
          pointer-events: auto;
        }

        .theme-drawer-card {
          position: fixed;
          top: 0;
          right: -320px;
          bottom: 0;
          width: 320px;
          background: var(--bg-card);
          border-left: 1px solid var(--border-color);
          box-shadow: -4px 0 24px rgba(0,0,0,0.15);
          display: flex;
          flex-direction: column;
          transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1001;
        }

        .theme-drawer-card.open {
          right: 0;
        }

        .drawer-header {
          padding: 20px;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-align: left;
        }

        .drawer-header h3 {
          font-family: var(--font-title);
          font-size: 16px;
          font-weight: 800;
          margin: 0;
          color: var(--text-main);
        }

        .btn-close-drawer {
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 20px;
          cursor: pointer;
        }

        .drawer-body {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          text-align: left;
        }

        .drawer-section {
          margin-bottom: 24px;
          border-bottom: 1px dashed var(--border-color);
          padding-bottom: 20px;
        }

        .drawer-section:last-child {
          border-bottom: none;
        }

        .section-title {
          font-family: var(--font-title);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: var(--text-muted);
          font-weight: 700;
          display: block;
          margin-bottom: 16px;
        }

        .drawer-row {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 14px;
        }

        .drawer-row label {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-main);
        }

        /* BOUTONS TOGGLE */
        .theme-toggle-buttons {
          display: flex;
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          padding: 3px;
        }

        .theme-mode-btn {
          flex: 1;
          border: none;
          background: transparent;
          color: var(--text-muted);
          padding: 8px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          border-radius: calc(var(--border-radius-sm) - 2px);
          transition: all var(--transition-fast);
        }

        .theme-mode-btn.active {
          background: var(--bg-card);
          color: var(--text-main);
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        /* SLIDER */
        .drawer-slider {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          outline: none;
          accent-color: var(--color-primary);
        }

        /* PRESETS DE COULEURS */
        .color-presets {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-wrap: wrap;
        }

        .color-preset-btn {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 2px solid transparent;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .color-preset-btn:hover {
          transform: scale(1.15);
        }

        .color-preset-btn.active {
          border-color: var(--text-main);
          transform: scale(1.1);
        }

        .custom-color-input {
          border: none;
          width: 28px;
          height: 28px;
          background: transparent;
          cursor: pointer;
          padding: 0;
        }

        .developer-section {
          background: rgba(0, 0, 0, 0.15);
          border-radius: var(--border-radius-sm);
          padding: 12px;
        }

        /* Force les styles de visibilité du texte dans le drawer en mode sombre */
        [data-theme="dark"] .theme-drawer-card {
          color: #FFFFFF !important;
        }
        [data-theme="dark"] .drawer-header h3,
        [data-theme="dark"] .drawer-row label {
          color: #FFFFFF !important;
        }
        [data-theme="dark"] .section-title,
        [data-theme="dark"] .btn-close-drawer {
          color: #CBD5E1 !important;
        }
        [data-theme="dark"] .theme-mode-btn {
          color: #94A3B8;
        }
        [data-theme="dark"] .theme-mode-btn.active {
          color: #FFFFFF !important;
          background: var(--bg-input) !important;
        }
      `})]})},ar=`/assets/logo-B2uRML4v.jpg`,or=({setActiveTab:e})=>{let{user:t,login:n,logout:r}=rr(),[i,a]=(0,v.useState)(`standard`),[o,s]=(0,v.useState)(``),[c,l]=(0,v.useState)(``),[u,d]=(0,v.useState)(``),[f,p]=(0,v.useState)(``),[m,h]=(0,v.useState)(``),[g,_]=(0,v.useState)(``),[y,b]=(0,v.useState)(``),[x,S]=(0,v.useState)(``),[C,w]=(0,v.useState)(!1),[T,E]=(0,v.useState)(null),[D,O]=(0,v.useState)(null);(0,v.useEffect)(()=>{E(null),O(null),l(``)},[i]);let k=e=>{let t=e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g,``);s(t)},A=async e=>{if(e&&e.preventDefault(),!o.trim()){E(`Veuillez saisir votre code entreprise.`);return}if(!c.trim()){E(`Veuillez saisir votre code PIN.`);return}w(!0),E(null);try{let e=await K.post(`/v1/auth/login-pin`,{company_code:o.trim(),pin_code:c.trim()});n(e.data.user,e.data.token),O(`Connexion réussie !`)}catch(e){E(e.response?.data?.error||`Identifiants d'accès incorrects.`),l(``)}finally{w(!1)}},j=async e=>{e.preventDefault(),w(!0),E(null),delete K.defaults.headers.common[`X-Company-ID`],delete K.defaults.headers.common[`X-Branch-ID`],localStorage.removeItem(`company-id`),localStorage.removeItem(`branch-id`);try{let e=await K.post(`/v1/auth/login`,{email:u.trim(),password:f});n(e.data.user,e.data.token),O(`Connexion réussie !`)}catch(e){E(e.response?.data?.error||e.response?.data?.message||`Identifiants d'accès incorrects.`)}finally{w(!1)}},M=async e=>{e.preventDefault(),w(!0),E(null),O(null);try{let e=await K.post(`/v1/auth/forgot-password`,{email:m});O(e.data.message),e.data.code&&_(e.data.code),setTimeout(()=>a(`reset`),2500)}catch(e){E(e.response?.data?.error||`Erreur lors de la demande.`)}finally{w(!1)}},N=async e=>{if(e.preventDefault(),w(!0),E(null),O(null),y!==x){E(`Les mots de passe ne correspondent pas.`),w(!1);return}try{let e=await K.post(`/v1/auth/reset-password`,{email:m,token:g,password:y,password_confirmation:x});O(e.data.message),setTimeout(()=>{a(`standard`),d(m),h(``),_(``),b(``),S(``)},3e3)}catch(e){E(e.response?.data?.error||`Code incorrect ou expiré.`)}finally{w(!1)}},P=e=>{c.length<8&&l(c+e)},F=()=>l(``),I=()=>l(c.slice(0,-1)),L=async()=>{try{await K.post(`/v1/auth/logout`)}catch{}finally{r(),l(``),O(null)}},[R,ee]=(0,v.useState)(``),[te,z]=(0,v.useState)(!1),[B,V]=(0,v.useState)(null),[H,ne]=(0,v.useState)(null);return(0,q.jsxs)(`div`,{className:`login-page-container`,children:[(0,q.jsx)(`div`,{className:`decorator-sphere sphere-1`}),(0,q.jsx)(`div`,{className:`decorator-sphere sphere-2`}),(0,q.jsxs)(`div`,{className:`login-box card`,children:[(0,q.jsxs)(`div`,{className:`brand-header`,children:[(0,q.jsx)(`img`,{src:ar,alt:`Logo`,className:`login-logo-img`}),(0,q.jsxs)(`div`,{className:`brand-logo`,style:{marginTop:`12px`},children:[(0,q.jsx)(`span`,{className:`logo-text-apex`,children:`Apex`}),(0,q.jsx)(`span`,{className:`logo-text-pos`,children:`POS`})]}),(0,q.jsx)(`p`,{className:`brand-subtitle`,children:`Système Professionnel de Gestion POS Multi-Entreprises`})]}),t?(0,q.jsxs)(`div`,{className:`profile-dashboard`,children:[(0,q.jsxs)(`div`,{className:`success-banner`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-circle-check me-1`}),` `,D||`Session Active`]}),(0,q.jsxs)(`div`,{className:`user-details-card`,children:[(0,q.jsx)(`div`,{className:`avatar-large`,children:t.name.charAt(0)}),(0,q.jsx)(`h3`,{className:`user-name`,children:t.name}),(0,q.jsx)(`p`,{className:`user-email`,children:t.email}),(0,q.jsxs)(`div`,{className:`info-grid`,children:[(0,q.jsxs)(`div`,{className:`info-item`,children:[(0,q.jsx)(`span`,{className:`info-label`,children:`Entreprise`}),(0,q.jsx)(`span`,{className:`info-val`,children:t.company?.name||`Globale`})]}),(0,q.jsxs)(`div`,{className:`info-item`,children:[(0,q.jsx)(`span`,{className:`info-label`,children:`Code Entreprise`}),(0,q.jsx)(`span`,{className:`badge badge-tenant`,children:t.company?.code||`—`})]}),(0,q.jsxs)(`div`,{className:`info-item`,children:[(0,q.jsx)(`span`,{className:`info-label`,children:`Rôle`}),(0,q.jsx)(`span`,{className:`badge badge-role`,children:t.role?.name||t.role})]}),(0,q.jsxs)(`div`,{className:`info-item`,children:[(0,q.jsx)(`span`,{className:`info-label`,children:`Boutique`}),(0,q.jsx)(`span`,{className:`info-val`,children:t.branch?.name||`Toutes`})]})]})]}),(0,q.jsxs)(`form`,{onSubmit:async e=>{if(e.preventDefault(),!R||R.length<4){ne(`Le code PIN doit comporter au moins 4 chiffres.`);return}z(!0),ne(null),V(null);try{await K.post(`/v1/auth/profile`,{name:t.name,email:t.email,pin_code:R}),V(`✅ Votre code PIN a été modifié avec succès !`),ee(``)}catch(e){ne(e.response?.data?.error||e.response?.data?.message||`Erreur de modification du PIN.`)}finally{z(!1)}},className:`mt-3 text-left p-3 rounded`,style:{background:`var(--bg-input)`,border:`1px solid var(--border-color)`,borderRadius:`var(--border-radius-sm)`},children:[(0,q.jsxs)(`strong`,{style:{fontSize:`13px`,display:`block`,marginBottom:`8px`,color:`var(--text-main)`},children:[(0,q.jsx)(`i`,{className:`fa-solid fa-key me-1 text-primary`}),` Modifier mon Code PIN Personnel`]}),B&&(0,q.jsx)(`div`,{className:`success-banner mb-2`,style:{fontSize:`12px`},children:B}),H&&(0,q.jsx)(`div`,{className:`error-banner mb-2`,style:{fontSize:`12px`},children:H}),(0,q.jsxs)(`div`,{className:`d-flex gap-2`,children:[(0,q.jsx)(`input`,{type:`password`,className:`form-control text-center`,placeholder:`Nouveau PIN (4 chiffres)`,value:R,onChange:e=>ee(e.target.value.replace(/\D/g,``)),maxLength:`6`,required:!0,style:{letterSpacing:`3px`,fontWeight:800,fontSize:`15px`}}),(0,q.jsx)(`button`,{type:`submit`,className:`btn btn-primary btn-sm`,disabled:te,style:{whiteSpace:`nowrap`},children:te?`...`:`Enregistrer`})]}),(0,q.jsx)(`small`,{className:`text-muted d-block mt-1`,style:{fontSize:`11px`},children:`Ce code sera requis lors de votre prochaine connexion PIN.`})]}),(0,q.jsxs)(`button`,{onClick:L,className:`btn btn-logout mt-4`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-right-from-bracket me-1`}),` Se Déconnecter de la Session`]})]}):(0,q.jsxs)(`div`,{children:[T&&(0,q.jsxs)(`div`,{className:`error-banner`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-circle-exclamation me-1`}),` `,T]}),D&&(0,q.jsxs)(`div`,{className:`success-banner`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-circle-check me-1`}),` `,D]}),i===`standard`&&(0,q.jsxs)(`form`,{onSubmit:j,className:`standard-form text-left`,children:[(0,q.jsxs)(`div`,{className:`form-group mb-3`,children:[(0,q.jsx)(`label`,{className:`form-label`,style:{fontWeight:700},children:`Adresse E-mail *`}),(0,q.jsx)(`input`,{type:`email`,className:`form-control`,value:u,onChange:e=>d(e.target.value),placeholder:`nom@entreprise.com`,required:!0})]}),(0,q.jsxs)(`div`,{className:`form-group mb-3`,children:[(0,q.jsx)(`label`,{className:`form-label`,style:{fontWeight:700},children:`Mot de passe *`}),(0,q.jsx)(`input`,{type:`password`,className:`form-control`,value:f,onChange:e=>p(e.target.value),placeholder:`••••••••`,required:!0})]}),(0,q.jsx)(`button`,{type:`submit`,className:`btn btn-primary btn-block btn-lg`,disabled:C,children:C?`Connexion en cours...`:`Se Connecter`}),(0,q.jsxs)(`div`,{style:{marginTop:`16px`,display:`flex`,justifyContent:`space-between`,alignItems:`center`},children:[(0,q.jsxs)(`button`,{type:`button`,onClick:()=>a(`pin`),className:`btn-link-login`,style:{fontSize:`12px`,color:`var(--text-muted)`},children:[(0,q.jsx)(`i`,{className:`fa-solid fa-calculator me-1`}),` Connexion Caisse (PIN)`]}),(0,q.jsx)(`button`,{type:`button`,onClick:()=>a(`forgot`),className:`btn-link-login`,style:{fontSize:`12px`,color:`var(--color-primary)`},children:`Mot de passe oublié ?`})]}),(0,q.jsxs)(`div`,{style:{marginTop:`20px`,borderTop:`1px solid var(--border-color)`,paddingTop:`16px`,fontSize:`13px`,color:`var(--text-muted)`},children:[`Pas encore de compte ?`,` `,(0,q.jsx)(`button`,{type:`button`,onClick:()=>e(`register`),className:`btn-link-login`,children:`Créer un compte entreprise`})]})]}),i===`pin`&&(0,q.jsxs)(`form`,{onSubmit:A,className:`pin-form-container text-left`,children:[(0,q.jsxs)(`div`,{className:`form-group mb-3`,children:[(0,q.jsxs)(`label`,{className:`form-label`,style:{fontWeight:700},children:[(0,q.jsx)(`i`,{className:`fa-solid fa-building me-1 text-primary`}),` Code de l'entreprise *`]}),(0,q.jsx)(`input`,{type:`text`,className:`form-control code-input`,placeholder:`Ex: X8M4-K92P`,value:o,onChange:k,maxLength:`12`,required:!0,style:{textTransform:`uppercase`,letterSpacing:`2px`,fontWeight:800,fontSize:`16px`}}),(0,q.jsx)(`small`,{className:`text-muted`,style:{fontSize:`11px`},children:`Code unique fourni dans votre profil d'administrateur d'entreprise.`})]}),(0,q.jsxs)(`div`,{className:`form-group mb-3`,children:[(0,q.jsxs)(`label`,{className:`form-label`,style:{fontWeight:700},children:[(0,q.jsx)(`i`,{className:`fa-solid fa-key me-1 text-primary`}),` PIN Personnel *`]}),(0,q.jsx)(`div`,{className:`pin-dots-display mb-2`,children:[0,1,2,3].map(e=>(0,q.jsx)(`span`,{className:`pin-dot ${c.length>e?`filled`:``}`},e))}),(0,q.jsx)(`input`,{type:`password`,className:`form-control text-center`,placeholder:`Entrez votre code PIN secret`,value:c,onChange:e=>l(e.target.value.replace(/\D/g,``)),maxLength:`8`,required:!0,style:{fontSize:`18px`,letterSpacing:`4px`}})]}),(0,q.jsxs)(`div`,{className:`pin-keypad-grid mb-3`,children:[[1,2,3,4,5,6,7,8,9].map(e=>(0,q.jsx)(`button`,{type:`button`,className:`keypad-btn`,onClick:()=>P(e),disabled:C,children:e},e)),(0,q.jsx)(`button`,{type:`button`,className:`keypad-btn btn-clear`,onClick:F,disabled:C,children:`C`}),(0,q.jsx)(`button`,{type:`button`,className:`keypad-btn`,onClick:()=>P(0),disabled:C,children:`0`}),(0,q.jsx)(`button`,{type:`button`,className:`keypad-btn btn-backspace`,onClick:I,disabled:C,children:(0,q.jsx)(`i`,{className:`fa-solid fa-delete-left`})})]}),(0,q.jsx)(`button`,{type:`submit`,className:`btn btn-primary btn-block btn-lg mt-2`,disabled:C,children:C?`Authentification...`:`Se Connecter`}),(0,q.jsx)(`div`,{className:`mt-3 text-center`,children:(0,q.jsxs)(`button`,{type:`button`,onClick:()=>a(`standard`),className:`btn-link-login`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-arrow-left me-1`}),` Revenir à la connexion E-mail & Mot de passe`]})})]}),i===`forgot`&&(0,q.jsxs)(`form`,{onSubmit:M,className:`standard-form text-left`,children:[(0,q.jsx)(`p`,{className:`section-instruction mb-3`,children:`Saisissez l'adresse e-mail associée à votre compte pour obtenir un code de réinitialisation.`}),(0,q.jsxs)(`div`,{className:`form-group mb-3`,children:[(0,q.jsx)(`label`,{className:`form-label`,style:{fontWeight:700},children:`Adresse E-mail`}),(0,q.jsx)(`input`,{type:`email`,className:`form-control`,value:m,onChange:e=>h(e.target.value),required:!0,placeholder:`admin@entreprise.com`})]}),(0,q.jsx)(`button`,{type:`submit`,className:`btn btn-primary btn-block`,disabled:C,children:C?`Envoi...`:`Envoyer le code de réinitialisation`}),(0,q.jsx)(`div`,{className:`mt-3 text-center`,children:(0,q.jsxs)(`button`,{type:`button`,onClick:()=>a(`pin`),className:`btn-link-login`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-arrow-left me-1`}),` Annuler et revenir`]})})]}),i===`reset`&&(0,q.jsxs)(`form`,{onSubmit:N,className:`standard-form text-left`,children:[(0,q.jsxs)(`div`,{className:`form-group mb-2`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Code secret récepteur (6 chiffres)`}),(0,q.jsx)(`input`,{type:`text`,className:`form-control text-center`,value:g,onChange:e=>_(e.target.value),required:!0,style:{letterSpacing:`4px`,fontSize:`18px`,fontWeight:800}})]}),(0,q.jsxs)(`div`,{className:`form-group mb-2`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Nouveau mot de passe`}),(0,q.jsx)(`input`,{type:`password`,className:`form-control`,value:y,onChange:e=>b(e.target.value),required:!0})]}),(0,q.jsxs)(`div`,{className:`form-group mb-3`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Confirmer le mot de passe`}),(0,q.jsx)(`input`,{type:`password`,className:`form-control`,value:x,onChange:e=>S(e.target.value),required:!0})]}),(0,q.jsx)(`button`,{type:`submit`,className:`btn btn-primary btn-block`,disabled:C,children:`Enregistrer le nouveau mot de passe`})]}),(0,q.jsx)(`div`,{style:{marginTop:`16px`,textAlign:`center`},children:(0,q.jsxs)(`button`,{type:`button`,onClick:()=>e(`home`),className:`btn-link-back-home`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-arrow-left me-1`}),` Retour à l'accueil`]})})]})]}),(0,q.jsx)(`style`,{children:`
        .login-page-container {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          z-index: 1;
        }

        .login-box {
          width: 100%;
          max-width: 440px;
          padding: 36px 32px;
          margin-top: 40px;
          box-shadow: var(--shadow-lg);
        }

        .login-logo-img {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          object-fit: cover;
          box-shadow: 0 4px 12px rgba(0,0,0,0.12);
        }

        .brand-subtitle {
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 4px;
          font-weight: 500;
        }

        .login-mode-toggle {
          display: flex;
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          padding: 4px;
          margin-bottom: 24px;
        }

        .mode-btn {
          flex: 1;
          padding: 8px 12px;
          font-size: 13px;
          font-weight: 700;
          border: none;
          background: transparent;
          color: var(--text-muted);
          border-radius: var(--border-radius-sm);
          cursor: pointer;
          transition: all 0.2s;
        }

        .mode-btn.active {
          background: var(--bg-card);
          color: var(--color-primary);
          box-shadow: 0 2px 4px rgba(0,0,0,0.06);
        }

        .code-input {
          font-family: var(--font-title);
          border: 2px solid var(--border-color);
          transition: border-color 0.2s;
        }

        .code-input:focus {
          border-color: var(--color-primary);
        }

        .pin-dots-display {
          display: flex;
          justify-content: center;
          gap: 12px;
          padding: 10px 0;
        }

        .pin-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 2px solid var(--border-color);
          transition: all 0.2s;
        }

        .pin-dot.filled {
          background: var(--color-primary);
          border-color: var(--color-primary);
          transform: scale(1.1);
        }

        .pin-keypad-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          max-width: 280px;
          margin: 0 auto;
        }

        .keypad-btn {
          height: 48px;
          border-radius: var(--border-radius-sm);
          border: 1px solid var(--border-color);
          background: var(--bg-card);
          color: var(--text-main);
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s;
        }

        .keypad-btn:hover {
          background: var(--bg-input);
          border-color: var(--color-primary);
          color: var(--color-primary);
        }

        .keypad-btn.btn-clear {
          color: var(--color-danger);
          font-size: 15px;
        }

        .keypad-btn.btn-backspace {
          color: var(--text-muted);
          font-size: 15px;
        }

        .btn-link-login {
          background: none;
          border: none;
          color: var(--color-primary);
          font-weight: 700;
          cursor: pointer;
          padding: 0;
          font-size: 13px;
        }

        .btn-link-back-home {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 12px;
          cursor: pointer;
        }

        .user-details-card {
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius);
          padding: 20px;
          text-align: center;
        }

        .avatar-large {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: var(--color-primary);
          color: #fff;
          font-size: 24px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 12px;
        }

        .user-name { font-size: 18px; font-weight: 800; margin-bottom: 2px; }
        .user-email { font-size: 12px; color: var(--text-muted); margin-bottom: 16px; }

        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; text-align: left; }
        .info-item { background: var(--bg-card); padding: 8px 12px; border-radius: 6px; border: 1px solid var(--border-color); }
        .info-label { display: block; font-size: 10px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; }
        .info-val { font-size: 12px; font-weight: 700; }

        .badge-role { background: rgba(79,70,229,0.12); color: var(--color-primary); font-size: 11px; padding: 2px 8px; border-radius: 10px; font-weight: 700; }
        .badge-tenant { background: rgba(16,185,129,0.12); color: var(--color-success); font-size: 11px; padding: 2px 8px; border-radius: 10px; font-weight: 700; }
        .btn-logout { width: 100%; padding: 10px; font-weight: 700; font-size: 13px; background: var(--bg-input); border: 1px solid var(--border-color); color: var(--color-danger); border-radius: var(--border-radius-sm); cursor: pointer; }
      `})]})},sr=e=>{if(!e)return null;if(e.startsWith(`http://`)||e.startsWith(`https://`))return e;let t=e.startsWith(`/`)?e:`/${e}`;return t.startsWith(`/storage/`)||(t=`/storage${t}`),typeof window<`u`?(window.location.hostname===`localhost`||window.location.hostname===`127.0.0.1`)&&window.location.port===`5173`?`http://127.0.0.1:8000${t}`:`${window.location.origin}${t}`:t},cr=()=>{let{user:e,token:t}=rr(),[n,r]=(0,v.useState)([]),[i,a]=(0,v.useState)([]),[o,s]=(0,v.useState)(``),[c,l]=(0,v.useState)(``),[u,d]=(0,v.useState)(!1),[f,p]=(0,v.useState)(!1),[m,h]=(0,v.useState)(null),[g,_]=(0,v.useState)(``),[y,b]=(0,v.useState)(``),[x,S]=(0,v.useState)(``),[C,w]=(0,v.useState)(``),[T,E]=(0,v.useState)(``),[D,O]=(0,v.useState)(``),[k,A]=(0,v.useState)(`10`),[j,M]=(0,v.useState)(!1),[N,P]=(0,v.useState)(null),F=(0,v.useRef)(null),I=(0,v.useRef)(null),L=()=>{let e=`200`+Math.floor(Math.random()*1000000001).toString().padStart(9,`0`),t=0;for(let n=0;n<12;n++)t+=parseInt(e[n])*(n%2==0?1:3);let n=e+(10-t%10)%10;S(n),y||b(`SKU-`+n.slice(-6))};(0,v.useEffect)(()=>{let e,t;if(j){if(`BarcodeDetector`in window)try{t=new window.BarcodeDetector({formats:[`code_128`,`ean_13`,`ean_8`,`qr_code`,`upc_a`,`upc_e`]})}catch{t=null}navigator.mediaDevices?.getUserMedia({video:{facingMode:`environment`}}).then(n=>{I.current=n,F.current&&(F.current.srcObject=n,F.current.play());let r=async()=>{if(F.current&&F.current.readyState===F.current.HAVE_ENOUGH_DATA&&t)try{let e=await t.detect(F.current);if(e&&e.length>0){let t=e[0].rawValue;S(t),P(`✔️ Code-barres scanné : ${t}`),setTimeout(()=>{M(!1),P(null)},1200);return}}catch{}e=requestAnimationFrame(r)};e=requestAnimationFrame(r)}).catch(()=>{re(`Impossible d'accéder à la caméra pour le scan. Vous pouvez utiliser une douchette USB.`)})}else I.current&&=(I.current.getTracks().forEach(e=>e.stop()),null);return()=>{e&&cancelAnimationFrame(e),I.current&&=(I.current.getTracks().forEach(e=>e.stop()),null)}},[j]);let[R,ee]=(0,v.useState)(``),[te,z]=(0,v.useState)(null),[B,V]=(0,v.useState)(null),[H,ne]=(0,v.useState)(!1),[U,re]=(0,v.useState)(null),[ie,ae]=(0,v.useState)(null),oe=async()=>{if(t){ne(!0),re(null);try{let e=await K.get(`/v1/categories`);a(e.data);let t=`/v1/products`,n=[];o&&n.push(`search=${encodeURIComponent(o)}`),c&&n.push(`category_id=${c}`),n.length>0&&(t+=`?${n.join(`&`)}`);let i=await K.get(t);r(i.data.data||[])}catch(e){re(e.response?.data?.error||e.response?.data?.message||`Impossible de charger le catalogue. Vérifiez les privilèges ou la configuration de l'entreprise.`)}finally{ne(!1)}}};(0,v.useEffect)(()=>{oe()},[t,c]);let se=e=>{e.preventDefault(),oe()},ce=async e=>{e.preventDefault(),re(null),ae(null);try{let e;if(B){let t=new FormData;t.append(`name`,R),t.append(`image`,B),e=await K.post(`/v1/categories`,t,{headers:{"Content-Type":`multipart/form-data`}})}else e=await K.post(`/v1/categories`,{name:R});ae(`Catégorie "${e.data.category.name}" créée avec succès !`),ee(``),V(null),p(!1),oe()}catch(e){let t=e.response?.data?.errors,n=`Erreur lors de la création de la catégorie.`;t?n=Object.values(t).flat().join(` `):e.response?.data?.error?n=e.response.data.error:e.response?.data?.message&&(n=e.response.data.message),re(n)}},le=async e=>{e.preventDefault(),re(null),ae(null);try{let e;if(te){let t=new FormData;t.append(`name`,g),t.append(`sku`,y),x&&t.append(`barcode`,x),t.append(`selling_price`,C),t.append(`category_id`,T),D&&t.append(`description`,D),k&&t.append(`alert_quantity`,k),t.append(`image`,te),e=await K.post(`/v1/products`,t,{headers:{"Content-Type":`multipart/form-data`}})}else e=await K.post(`/v1/products`,{name:g,sku:y,barcode:x||null,selling_price:parseFloat(C),category_id:parseInt(T),description:D||null,alert_quantity:k?parseFloat(k):10});ae(`Produit "${e.data.product.name}" ajouté avec succès !`),_(``),b(``),S(``),w(``),E(``),O(``),A(`10`),z(null),d(!1),oe()}catch(e){let t=e.response?.data?.errors,n=`Erreur lors de la création du produit.`;t?n=Object.values(t).flat().join(` `):e.response?.data?.error?n=e.response.data.error:e.response?.data?.message&&(n=e.response.data.message),re(n)}},ue=async e=>{if(window.confirm(`Voulez-vous vraiment supprimer ce produit ?`)){re(null),ae(null);try{await K.delete(`/v1/products/${e}`),ae(`Produit supprimé du catalogue.`),oe()}catch{re(`Impossible de supprimer le produit. Permissions requises.`)}}},de=e=>{h(e),_(e.name),b(e.sku),S(e.barcode||``),w(e.selling_price),E(e.category?.id||``),O(e.description||``),A(e.alert_quantity||`10`),z(null),d(!0),p(!1),re(null),ae(null)},fe=async e=>{e.preventDefault(),re(null),ae(null);try{let e;if(te){let t=new FormData;t.append(`name`,g),t.append(`sku`,y),x&&t.append(`barcode`,x),t.append(`selling_price`,C),t.append(`category_id`,T),D&&t.append(`description`,D),k&&t.append(`alert_quantity`,k),t.append(`image`,te),t.append(`_method`,`PUT`),e=await K.post(`/v1/products/${m.id}`,t,{headers:{"Content-Type":`multipart/form-data`}})}else e=await K.put(`/v1/products/${m.id}`,{name:g,sku:y,barcode:x||null,selling_price:parseFloat(C),category_id:parseInt(T),description:D||null,alert_quantity:k?parseFloat(k):10});ae(`Produit "${e.data.product?.name||g}" mis à jour avec succès !`),d(!1),h(null),_(``),b(``),S(``),w(``),E(``),O(``),A(`10`),z(null),oe()}catch(e){let t=e.response?.data?.errors,n=`Erreur lors de la mise à jour du produit.`;t?n=Object.values(t).flat().join(` `):e.response?.data?.error?n=e.response.data.error:e.response?.data?.message&&(n=e.response.data.message),re(n)}};if(!t)return(0,q.jsx)(`div`,{className:`catalog-container`,children:(0,q.jsxs)(`div`,{className:`alert-card card`,children:[(0,q.jsx)(`span`,{className:`alert-icon`,children:(0,q.jsx)(`i`,{className:`fa-solid fa-lock text-muted`})}),(0,q.jsx)(`h3`,{children:`Accès Réservé`}),(0,q.jsx)(`p`,{children:`Vous devez vous connecter à une session pour gérer le catalogue de produits.`})]})});let pe=e?.permissions?.includes(`products.create`)||e?.role===`admin`;return(0,q.jsxs)(`div`,{className:`catalog-container`,children:[(0,q.jsx)(`div`,{className:`decorator-sphere sphere-1`}),(0,q.jsx)(`div`,{className:`decorator-sphere sphere-2`}),(0,q.jsxs)(`div`,{className:`catalog-layout card`,children:[(0,q.jsxs)(`div`,{className:`catalog-header`,children:[(0,q.jsxs)(`div`,{children:[(0,q.jsxs)(`h2`,{children:[(0,q.jsx)(`i`,{className:`fa-solid fa-box me-2 text-primary`}),` Gestion du Catalogue Produits`]}),(0,q.jsx)(`p`,{className:`catalog-subtitle`,children:`Pilotez vos articles et catégories`})]}),pe&&(0,q.jsxs)(`div`,{className:`action-buttons-group`,children:[(0,q.jsxs)(`button`,{onClick:()=>{p(!0),d(!1)},className:`btn btn-secondary`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-folder-open me-1`}),` Nouvelle Catégorie`]}),(0,q.jsxs)(`button`,{onClick:()=>{h(null),_(``),b(``),S(``),w(``),E(``),O(``),A(`10`),z(null),d(!0),p(!1)},className:`btn btn-primary`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-plus me-1`}),` Ajouter un Produit`]})]})]}),U&&(0,q.jsxs)(`div`,{className:`error-banner`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-circle-exclamation me-1`}),` `,U]}),ie&&(0,q.jsxs)(`div`,{className:`success-banner`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-circle-check me-1`}),` `,ie]}),f&&(0,q.jsx)(`div`,{className:`modal-overlay`,children:(0,q.jsxs)(`div`,{className:`modal-card card`,children:[(0,q.jsxs)(`h3`,{children:[(0,q.jsx)(`i`,{className:`fa-solid fa-folder-open me-2 text-secondary`}),` Créer une nouvelle catégorie`]}),(0,q.jsxs)(`form`,{onSubmit:ce,children:[(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Nom de la catégorie`}),(0,q.jsx)(`input`,{type:`text`,className:`form-control`,value:R,onChange:e=>ee(e.target.value),required:!0,placeholder:`Ex: Électricité, Plomberie...`})]}),(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Photo d'illustration de la catégorie`}),B&&(0,q.jsxs)(`div`,{style:{marginBottom:`10px`,display:`flex`,alignItems:`center`,gap:`12px`},children:[(0,q.jsx)(`img`,{src:URL.createObjectURL(B),alt:`Aperçu catégorie`,style:{width:`56px`,height:`56px`,objectFit:`cover`,borderRadius:`8px`,border:`2px solid var(--color-primary)`}}),(0,q.jsx)(`small`,{className:`text-muted`,children:`Image de catégorie sélectionnée`})]}),(0,q.jsx)(`input`,{type:`file`,className:`form-control`,accept:`image/*`,onChange:e=>V(e.target.files[0])})]}),(0,q.jsxs)(`div`,{style:{marginTop:`20px`,borderTop:`1px solid var(--border-color)`,paddingTop:`16px`},children:[(0,q.jsxs)(`label`,{className:`form-label mb-2`,style:{fontWeight:700},children:[`Catégories existantes (`,i.length,`)`]}),(0,q.jsx)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:`10px`,maxHeight:`150px`,overflowY:`auto`},children:i.map(e=>(0,q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`8px`,padding:`6px 12px`,background:`var(--bg-input)`,borderRadius:`20px`,fontSize:`13px`,border:`1px solid var(--border-color)`},children:[e.image_path?(0,q.jsx)(`img`,{src:sr(e.image_path),alt:e.name,style:{width:`24px`,height:`24px`,borderRadius:`50%`,objectFit:`cover`}}):(0,q.jsx)(`i`,{className:`fa-solid fa-folder text-primary`,style:{fontSize:`14px`}}),(0,q.jsx)(`span`,{children:e.name})]},e.id))})]}),(0,q.jsxs)(`div`,{className:`modal-actions`,children:[(0,q.jsx)(`button`,{type:`button`,onClick:()=>p(!1),className:`btn btn-cancel`,children:`Annuler`}),(0,q.jsx)(`button`,{type:`submit`,className:`btn btn-primary`,children:`Enregistrer la catégorie`})]})]})]})}),u&&(0,q.jsx)(`div`,{className:`modal-overlay`,children:(0,q.jsxs)(`div`,{className:`modal-card card modal-large`,children:[(0,q.jsx)(`h3`,{children:m?(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(`i`,{className:`fa-solid fa-pen me-2 text-warning`}),` Modifier le produit`]}):(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(`i`,{className:`fa-solid fa-box me-2 text-primary`}),` Ajouter un produit au catalogue`]})}),(0,q.jsxs)(`form`,{onSubmit:m?fe:le,children:[(0,q.jsxs)(`div`,{className:`form-row-grid`,children:[(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Nom de l'article *`}),(0,q.jsx)(`input`,{type:`text`,className:`form-control`,value:g,onChange:e=>_(e.target.value),required:!0})]}),(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Catégorie *`}),(0,q.jsxs)(`select`,{className:`form-control`,value:T,onChange:e=>E(e.target.value),required:!0,children:[(0,q.jsx)(`option`,{value:``,children:`Sélectionner...`}),i.map(e=>(0,q.jsx)(`option`,{value:e.id,children:e.name},e.id))]})]})]}),(0,q.jsxs)(`div`,{className:`form-row-grid`,children:[(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Référence unique SKU *`}),(0,q.jsx)(`input`,{type:`text`,className:`form-control`,value:y,onChange:e=>b(e.target.value),required:!0,placeholder:`Ex: SKU-XYZ-12`})]}),(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`4px`},children:[(0,q.jsx)(`label`,{className:`form-label mb-0`,children:`Code-barres EAN13`}),(0,q.jsxs)(`div`,{style:{display:`flex`,gap:`6px`},children:[(0,q.jsxs)(`button`,{type:`button`,onClick:()=>M(!0),className:`btn-xs-scan`,style:{padding:`3px 8px`,fontSize:`11px`,fontWeight:700,background:`var(--color-primary)`,color:`#ffffff`,border:`none`,borderRadius:`4px`,cursor:`pointer`},children:[(0,q.jsx)(`i`,{className:`fa-solid fa-camera me-1`}),` Scanner`]}),(0,q.jsxs)(`button`,{type:`button`,onClick:L,className:`btn-xs-generate`,style:{padding:`3px 8px`,fontSize:`11px`,fontWeight:700,background:`var(--bg-input)`,color:`var(--text-main)`,border:`1px solid var(--border-color)`,borderRadius:`4px`,cursor:`pointer`},children:[(0,q.jsx)(`i`,{className:`fa-solid fa-wand-magic-sparkles me-1`}),` Auto EAN`]})]})]}),(0,q.jsx)(`div`,{style:{position:`relative`},children:(0,q.jsx)(`input`,{type:`text`,className:`form-control`,value:x,onChange:e=>S(e.target.value),placeholder:`Ex: 3700021300051 (ou scanner avec douchette USB / caméra)`})})]})]}),(0,q.jsxs)(`div`,{className:`form-row-grid`,children:[(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Prix de vente unitaire (XOF) *`}),(0,q.jsx)(`input`,{type:`number`,className:`form-control`,value:C,onChange:e=>w(e.target.value),required:!0,min:`0`})]}),(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Seuil critique d'alerte stock`}),(0,q.jsx)(`input`,{type:`number`,className:`form-control`,value:k,onChange:e=>A(e.target.value),min:`0`})]})]}),(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Description`}),(0,q.jsx)(`textarea`,{className:`form-control textarea-input`,value:D,onChange:e=>O(e.target.value)})]}),(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Photo du produit`}),(te||m?.image_path)&&(0,q.jsxs)(`div`,{style:{marginBottom:`10px`,display:`flex`,alignItems:`center`,gap:`12px`},children:[(0,q.jsx)(`img`,{src:te?URL.createObjectURL(te):sr(m.image_path),alt:`Aperçu du produit`,style:{width:`64px`,height:`64px`,objectFit:`cover`,borderRadius:`8px`,border:`2px solid var(--color-primary)`}}),(0,q.jsx)(`small`,{className:`text-muted`,children:te?`📸 Nouvelle photo sélectionnée`:`🖼️ Photo actuelle du produit`})]}),(0,q.jsx)(`input`,{type:`file`,className:`form-control`,accept:`image/*`,onChange:e=>z(e.target.files[0])})]}),(0,q.jsxs)(`div`,{className:`modal-actions`,children:[(0,q.jsx)(`button`,{type:`button`,onClick:()=>{d(!1),h(null)},className:`btn btn-cancel`,children:`Annuler`}),(0,q.jsx)(`button`,{type:`submit`,className:`btn btn-primary`,children:m?`Enregistrer les modifications`:`Enregistrer le produit`})]})]})]})}),j&&(0,q.jsx)(`div`,{className:`modal-overlay`,children:(0,q.jsxs)(`div`,{className:`modal-card card`,style:{maxWidth:`460px`,textAlign:`center`},children:[(0,q.jsxs)(`h3`,{children:[(0,q.jsx)(`i`,{className:`fa-solid fa-camera me-2 text-primary`}),` Scanner le Code-Barres de l'Article`]}),(0,q.jsx)(`p`,{style:{fontSize:`13px`,color:`var(--text-muted)`,marginBottom:`16px`},children:`Pointez la caméra vers le code-barres sur l'emballage du produit.`}),N&&(0,q.jsx)(`div`,{className:`success-banner mb-3`,children:N}),(0,q.jsxs)(`div`,{className:`scanner-video-wrapper`,style:{position:`relative`,width:`100%`,height:`240px`,background:`#000000`,borderRadius:`12px`,overflow:`hidden`,border:`2px solid var(--color-primary)`,display:`flex`,alignItems:`center`,justifyContent:`center`},children:[(0,q.jsx)(`video`,{ref:F,style:{width:`100%`,height:`100%`,objectFit:`cover`},playsInline:!0,muted:!0}),(0,q.jsx)(`div`,{className:`scanner-laser`,style:{position:`absolute`,top:`50%`,left:`10%`,right:`10%`,height:`2px`,background:`#00ff66`,boxShadow:`0 0 12px #00ff66`,animation:`laserScan 2s infinite ease-in-out`}})]}),(0,q.jsxs)(`div`,{style:{marginTop:`16px`,textAlign:`left`},children:[(0,q.jsxs)(`label`,{className:`form-label`,style:{fontSize:`12px`,fontWeight:700},children:[(0,q.jsx)(`i`,{className:`fa-solid fa-barcode me-1 text-primary`}),` Saisie directe ou Lecteur USB :`]}),(0,q.jsx)(`input`,{type:`text`,className:`form-control`,placeholder:`Scannez ici avec votre lecteur USB...`,autoFocus:!0,onKeyDown:e=>{e.key===`Enter`&&(e.preventDefault(),e.target.value.trim()&&(S(e.target.value.trim()),M(!1)))}})]}),(0,q.jsx)(`div`,{className:`modal-actions`,style:{marginTop:`16px`},children:(0,q.jsx)(`button`,{type:`button`,onClick:()=>M(!1),className:`btn btn-cancel`,children:`Fermer le scanner`})})]})}),(0,q.jsxs)(`form`,{onSubmit:se,className:`filters-bar`,children:[(0,q.jsx)(`input`,{type:`text`,placeholder:`Rechercher par nom, SKU, code-barres...`,className:`form-control search-input`,value:o,onChange:e=>s(e.target.value)}),(0,q.jsxs)(`select`,{className:`form-control category-filter`,value:c,onChange:e=>l(e.target.value),children:[(0,q.jsx)(`option`,{value:``,children:`Toutes les catégories`}),i.map(e=>(0,q.jsx)(`option`,{value:e.id,children:e.name},e.id))]}),(0,q.jsxs)(`button`,{type:`submit`,className:`btn btn-primary`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-magnifying-glass me-1`}),` Filtrer`]})]}),H?(0,q.jsx)(`div`,{className:`loading-spinner`,children:`Chargement du catalogue...`}):n.length===0?(0,q.jsxs)(`div`,{className:`empty-state`,children:[(0,q.jsx)(`span`,{className:`empty-icon`,children:(0,q.jsx)(`i`,{className:`fa-solid fa-inbox text-muted`})}),(0,q.jsx)(`h4`,{children:`Aucun produit trouvé`}),(0,q.jsx)(`p`,{children:`Essayez de modifier vos critères de recherche ou d'ajouter de nouveaux articles.`})]}):(0,q.jsx)(`div`,{className:`table-responsive`,children:(0,q.jsxs)(`table`,{className:`products-table`,children:[(0,q.jsx)(`thead`,{children:(0,q.jsxs)(`tr`,{children:[(0,q.jsx)(`th`,{style:{width:`60px`},children:`Photo`}),(0,q.jsx)(`th`,{children:`SKU / Code-barres`}),(0,q.jsx)(`th`,{children:`Nom de l'article`}),(0,q.jsx)(`th`,{children:`Catégorie`}),(0,q.jsx)(`th`,{children:`Prix de Vente`}),(0,q.jsx)(`th`,{children:`Seuil d'Alerte (Min)`}),(0,q.jsx)(`th`,{children:`Actions`})]})}),(0,q.jsx)(`tbody`,{children:n.map(t=>(0,q.jsxs)(`tr`,{children:[(0,q.jsx)(`td`,{style:{verticalAlign:`middle`,textAlign:`center`},children:t.image_path?(0,q.jsx)(`img`,{src:sr(t.image_path),alt:t.name,style:{width:`48px`,height:`48px`,objectFit:`cover`,borderRadius:`8px`,border:`1px solid var(--border-color)`,boxShadow:`0 2px 4px rgba(0,0,0,0.08)`}}):(0,q.jsx)(`div`,{style:{width:`48px`,height:`48px`,borderRadius:`8px`,background:`var(--bg-input)`,display:`inline-flex`,alignItems:`center`,justifyContent:`center`,color:`var(--text-muted)`,border:`1px dashed var(--border-color)`},children:(0,q.jsx)(`i`,{className:`fa-solid fa-box`,style:{fontSize:`18px`}})})}),(0,q.jsxs)(`td`,{children:[(0,q.jsx)(`div`,{className:`sku-cell`,children:t.sku}),t.barcode&&(0,q.jsx)(`div`,{className:`barcode-sub`,children:t.barcode})]}),(0,q.jsxs)(`td`,{children:[(0,q.jsx)(`div`,{className:`product-title-cell`,children:t.name}),t.description&&(0,q.jsx)(`div`,{className:`desc-sub`,children:t.description})]}),(0,q.jsx)(`td`,{children:(0,q.jsx)(`span`,{className:`category-tag`,children:t.category?.name||`Inconnue`})}),(0,q.jsxs)(`td`,{className:`price-cell`,children:[new Intl.NumberFormat(`fr-FR`).format(t.selling_price),` XOF`]}),(0,q.jsx)(`td`,{children:(0,q.jsxs)(`span`,{className:`alert-qty-cell`,title:`Seuil minimal de déclenchement d'alerte stock`,children:[(0,q.jsx)(`small`,{className:`text-muted d-block`,style:{fontSize:`10px`},children:`Seuil min :`}),t.alert_quantity||t.min_stock_alert||10,`.00 unités`]})}),(0,q.jsx)(`td`,{children:(0,q.jsxs)(`div`,{style:{display:`flex`,gap:`6px`,alignItems:`center`},children:[(e?.permissions?.includes(`products.update`)||e?.role===`admin`||e?.role?.slug===`admin`||e?.role?.slug===`gerant`)&&(0,q.jsx)(`button`,{onClick:()=>de(t),className:`btn btn-xs btn-secondary`,title:`Modifier`,children:(0,q.jsx)(`i`,{className:`fa-solid fa-pen`})}),e?.permissions?.includes(`products.delete`)||e?.role===`admin`||e?.role?.slug===`admin`?(0,q.jsx)(`button`,{onClick:()=>ue(t.id),className:`btn-delete`,title:`Supprimer`,children:(0,q.jsx)(`i`,{className:`fa-solid fa-trash-can text-danger`})}):(0,q.jsx)(`span`,{className:`text-lock`,children:(0,q.jsx)(`i`,{className:`fa-solid fa-lock text-muted`})})]})})]},t.id))})]})})]}),(0,q.jsx)(`style`,{children:`
        .catalog-container {
          position: relative;
          width: 100%;
          min-height: 100vh;
          padding: 24px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          z-index: 1;
        }

        .alert-card {
          width: 100%;
          max-width: 460px;
          padding: 40px;
          text-align: center;
          margin-top: 100px;
        }

        .alert-icon {
          font-size: 48px;
          display: block;
          margin-bottom: 16px;
        }

        .catalog-layout {
          width: 100%;
          max-width: 1080px;
          padding: 32px;
          margin-top: 100px; /* laisser place au theme selector */
        }

        .catalog-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 24px;
          margin-bottom: 24px;
          text-align: left;
        }

        .catalog-subtitle {
          font-size: 13px;
          color: var(--text-muted);
          font-weight: 500;
          margin-top: 4px;
        }

        .action-buttons-group {
          display: flex;
          gap: 12px;
        }

        .btn-secondary {
          background: var(--bg-input);
          color: var(--text-main);
          border: 1px solid var(--border-color);
        }

        .btn-secondary:hover {
          background: var(--border-color);
        }

        .filters-bar {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }

        .search-input {
          flex: 2;
        }

        .category-filter {
          flex: 1;
        }

        .loading-spinner {
          padding: 40px;
          text-align: center;
          color: var(--text-muted);
          font-weight: 500;
        }

        .empty-state {
          padding: 60px;
          text-align: center;
          background: var(--bg-input);
          border-radius: var(--border-radius-md);
          border: 1px dashed var(--border-color);
        }

        .empty-icon {
          font-size: 40px;
          display: block;
          margin-bottom: 12px;
        }

        /* Styles de la table */
        .table-responsive {
          width: 100%;
          overflow-x: auto;
          border-radius: var(--border-radius-sm);
          border: 1px solid var(--border-color);
        }

        .category-tag {
          padding: 4px 8px;
          background: var(--primary-glow);
          color: var(--color-primary);
          font-size: 11px;
          font-weight: 700;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .alert-qty-cell {
          font-size: 13px;
          font-weight: 500;
        }

        .btn-delete {
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 16px;
          padding: 4px;
          border-radius: 4px;
          transition: background var(--transition-fast);
        }

        .btn-delete:hover {
          background: rgba(239, 68, 68, 0.1);
        }

        .text-lock {
          font-size: 12px;
          color: var(--text-muted);
        }

      `})]})},lr=()=>{let{user:e,token:t}=rr(),[n,r]=(0,v.useState)([]),[i,a]=(0,v.useState)(``),[o,s]=(0,v.useState)(!1),[c,l]=(0,v.useState)(null),[u,d]=(0,v.useState)(``),[f,p]=(0,v.useState)(``),[m,h]=(0,v.useState)(``),[g,_]=(0,v.useState)(``),[y,b]=(0,v.useState)(`0`),[x,S]=(0,v.useState)(!1),[C,w]=(0,v.useState)(null),[T,E]=(0,v.useState)(null),D=async()=>{if(t){S(!0),w(null);try{let e=`/v1/suppliers`;i&&(e+=`?search=${encodeURIComponent(i)}`);let t=await K.get(e);r(t.data.data||[])}catch{w(`Impossible de charger le référentiel des fournisseurs.`)}finally{S(!1)}}};(0,v.useEffect)(()=>{D()},[t]);let O=e=>{e.preventDefault(),D()},k=(e=null)=>{l(e),e?(d(e.name||``),p(e.email||``),h(e.phone||``),_(e.address||``),b(e.debt_balance?.toString()||`0`)):(d(``),p(``),h(``),_(``),b(`0`)),s(!0),w(null),E(null)},A=async e=>{e.preventDefault(),w(null),E(null);try{let e={name:u,email:f||null,phone:m||null,address:g||null,debt_balance:parseFloat(y||`0`)};if(c){let t=await K.put(`/v1/suppliers/${c.id}`,e);E(`Fournisseur "${t.data.supplier?.name||u}" mis à jour avec succès !`)}else{let t=await K.post(`/v1/suppliers`,e);E(`Fournisseur "${t.data.supplier.name}" enregistré avec succès !`)}s(!1),l(null),D()}catch(e){w(e.response?.data?.error||e.response?.data?.message||`Erreur lors de la sauvegarde du fournisseur.`)}},j=async e=>{if(window.confirm(`Voulez-vous vraiment supprimer ce fournisseur ?`)){w(null),E(null);try{await K.delete(`/v1/suppliers/${e}`),E(`Fournisseur supprimé avec succès.`),D()}catch{w(`Impossible de supprimer le fournisseur. Permissions requises.`)}}};if(!t)return(0,q.jsx)(`div`,{className:`suppliers-container`,children:(0,q.jsxs)(`div`,{className:`alert-card card`,children:[(0,q.jsx)(`span`,{className:`alert-icon`,children:`🔒`}),(0,q.jsx)(`h3`,{children:`Accès Réservé`}),(0,q.jsx)(`p`,{children:`Vous devez vous connecter à une session pour gérer le référentiel des fournisseurs.`})]})});let M=e?.permissions?.includes(`suppliers.create`)||e?.role===`admin`||e?.role?.slug===`admin`,N=e?.permissions?.includes(`suppliers.update`)||e?.role===`admin`||e?.role?.slug===`admin`||e?.role?.slug===`gerant`;return(0,q.jsxs)(`div`,{className:`suppliers-container`,children:[(0,q.jsx)(`div`,{className:`decorator-sphere sphere-1`}),(0,q.jsx)(`div`,{className:`decorator-sphere sphere-2`}),(0,q.jsxs)(`div`,{className:`suppliers-layout card`,children:[(0,q.jsxs)(`div`,{className:`suppliers-header`,children:[(0,q.jsxs)(`div`,{children:[(0,q.jsxs)(`h2`,{children:[(0,q.jsx)(`i`,{className:`fa-solid fa-handshake me-2`}),` Référentiel des Fournisseurs`]}),(0,q.jsx)(`p`,{className:`suppliers-subtitle`,children:`Comptes courants & Coordonnées d'achats`})]}),M&&(0,q.jsxs)(`button`,{onClick:()=>k(null),className:`btn btn-primary`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-plus me-1`}),` Nouveau Fournisseur`]})]}),C&&(0,q.jsxs)(`div`,{className:`error-banner`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-circle-exclamation me-1`}),` `,C]}),T&&(0,q.jsxs)(`div`,{className:`success-banner`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-circle-check me-1`}),` `,T]}),o&&(0,q.jsx)(`div`,{className:`modal-overlay`,children:(0,q.jsxs)(`div`,{className:`modal-card card modal-large`,children:[(0,q.jsxs)(`h3`,{children:[(0,q.jsx)(`i`,{className:`fa-solid fa-handshake me-2`}),` `,c?`✏️ Modifier le partenaire`:`➕ Enregistrer un nouveau fournisseur`]}),(0,q.jsxs)(`form`,{onSubmit:A,children:[(0,q.jsxs)(`div`,{className:`form-row-grid`,children:[(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Nom du Fournisseur *`}),(0,q.jsx)(`input`,{type:`text`,className:`form-control`,value:u,onChange:e=>d(e.target.value),required:!0})]}),(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Téléphone`}),(0,q.jsx)(`input`,{type:`text`,className:`form-control`,value:m,onChange:e=>h(e.target.value),placeholder:`Ex: +221 33...`})]})]}),(0,q.jsxs)(`div`,{className:`form-row-grid`,children:[(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Adresse E-mail`}),(0,q.jsx)(`input`,{type:`email`,className:`form-control`,value:f,onChange:e=>p(e.target.value),placeholder:`contact@fournisseur.sn`})]}),(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Solde initial débiteur (Dette XOF)`}),(0,q.jsx)(`input`,{type:`number`,className:`form-control`,value:y,onChange:e=>b(e.target.value),min:`0`})]})]}),(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Adresse Physique`}),(0,q.jsx)(`input`,{type:`text`,className:`form-control`,value:g,onChange:e=>_(e.target.value),placeholder:`Ex: Rue 10, Dakar`})]}),(0,q.jsxs)(`div`,{className:`modal-actions`,children:[(0,q.jsx)(`button`,{type:`button`,onClick:()=>s(!1),className:`btn btn-cancel`,children:`Annuler`}),(0,q.jsx)(`button`,{type:`submit`,className:`btn btn-primary`,children:c?`Mettre à jour le fournisseur`:`Enregistrer le fournisseur`})]})]})]})}),(0,q.jsxs)(`form`,{onSubmit:O,className:`filters-bar`,children:[(0,q.jsx)(`input`,{type:`text`,placeholder:`Rechercher par nom, email, téléphone...`,className:`form-control search-input`,value:i,onChange:e=>a(e.target.value)}),(0,q.jsx)(`button`,{type:`submit`,className:`btn btn-primary`,children:`🔍 Rechercher`})]}),x?(0,q.jsx)(`div`,{className:`loading-spinner`,children:`Chargement des fournisseurs...`}):n.length===0?(0,q.jsxs)(`div`,{className:`empty-state`,children:[(0,q.jsx)(`span`,{className:`empty-icon`,children:`📭`}),(0,q.jsx)(`h4`,{children:`Aucun fournisseur enregistré`}),(0,q.jsx)(`p`,{children:`Commencez par ajouter votre premier partenaire d'approvisionnement.`})]}):(0,q.jsx)(`div`,{className:`table-responsive`,children:(0,q.jsxs)(`table`,{className:`products-table`,children:[(0,q.jsx)(`thead`,{children:(0,q.jsxs)(`tr`,{children:[(0,q.jsx)(`th`,{children:`Nom du Partenaire`}),(0,q.jsx)(`th`,{children:`Téléphone`}),(0,q.jsx)(`th`,{children:`Adresse E-mail`}),(0,q.jsx)(`th`,{children:`Compte Courant Crédit`}),(0,q.jsx)(`th`,{children:`Actions`})]})}),(0,q.jsx)(`tbody`,{children:n.map(t=>(0,q.jsxs)(`tr`,{children:[(0,q.jsxs)(`td`,{children:[(0,q.jsx)(`div`,{className:`product-title-cell`,children:t.name}),t.address&&(0,q.jsx)(`div`,{className:`desc-sub`,children:t.address})]}),(0,q.jsx)(`td`,{children:(0,q.jsx)(`div`,{className:`sku-cell`,children:t.phone||`Non renseigné`})}),(0,q.jsx)(`td`,{children:(0,q.jsx)(`div`,{className:`desc-sub`,children:t.email||`-`})}),(0,q.jsx)(`td`,{children:parseFloat(t.debt_balance)>0?(0,q.jsxs)(`span`,{className:`badge-debt-danger`,children:[`🔴 Dette : `,new Intl.NumberFormat(`fr-FR`).format(t.debt_balance),` XOF`]}):(0,q.jsx)(`span`,{className:`badge-debt-success`,children:`🟢 Solde à jour (0 XOF)`})}),(0,q.jsx)(`td`,{children:(0,q.jsxs)(`div`,{style:{display:`flex`,gap:`6px`,alignItems:`center`},children:[N&&(0,q.jsx)(`button`,{onClick:()=>k(t),className:`btn btn-xs btn-secondary`,title:`Modifier ce fournisseur`,children:(0,q.jsx)(`i`,{className:`fa-solid fa-pen`})}),(e?.permissions?.includes(`suppliers.delete`)||e?.role===`admin`||e?.role?.slug===`admin`)&&(0,q.jsx)(`button`,{onClick:()=>j(t.id),className:`btn-delete`,title:`Supprimer ce fournisseur`,children:`🗑️`})]})})]},t.id))})]})})]}),(0,q.jsx)(`style`,{children:`
        .suppliers-container {
          position: relative;
          width: 100%;
          min-height: 100vh;
          padding: 24px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          z-index: 1;
        }

        .suppliers-layout {
          width: 100%;
          max-width: 1080px;
          padding: 32px;
          margin-top: 100px;
        }

        .suppliers-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 24px;
          margin-bottom: 24px;
          text-align: left;
        }

        .suppliers-subtitle {
          font-size: 13px;
          color: var(--text-muted);
          font-weight: 500;
          margin-top: 4px;
        }

        .badge-debt-danger {
          display: inline-block;
          padding: 6px 12px;
          background: rgba(239, 68, 68, 0.1);
          color: var(--color-error);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 4px;
          font-size: 12px;
          font-weight: 700;
        }

        .badge-debt-success {
          display: inline-block;
          padding: 6px 12px;
          background: rgba(0, 166, 81, 0.1);
          color: var(--color-success);
          border: 1px solid rgba(0, 166, 81, 0.2);
          border-radius: 4px;
          font-size: 12px;
          font-weight: 700;
        }
      `})]})},ur=()=>{let{token:e,user:t}=rr(),[n,r]=(0,v.useState)([]),[i,a]=(0,v.useState)(!1),[o,s]=(0,v.useState)(null),[c,l]=(0,v.useState)(null),[u,d]=(0,v.useState)(1),[f,p]=(0,v.useState)(1),[m,h]=(0,v.useState)(``),[g,_]=(0,v.useState)(!1),[y,b]=(0,v.useState)(null),[x,S]=(0,v.useState)({name:``,email:``,phone:``,address:``,credit_limit:`0`,debt_balance:`0`,loyalty_points:`0`}),[C,w]=(0,v.useState)(null),T=async()=>{if(e){a(!0),s(null);try{let e=await K.get(`/v1/customers`,{params:{page:u,search:m||void 0}});r(e.data.data||[]),p(e.data.last_page||1)}catch(e){s(e.response?.data?.error||`Erreur lors du chargement des clients.`)}finally{a(!1)}}};(0,v.useEffect)(()=>{T()},[e,u,m]);let E=e=>{h(e.target.value),d(1)},D=()=>{b(null),S({name:``,email:``,phone:``,address:``,credit_limit:`500000`,debt_balance:`0`,loyalty_points:`0`,is_global:!0}),s(null),_(!0)},O=e=>{b(e),S({name:e.name,email:e.email||``,phone:e.phone||``,address:e.address||``,credit_limit:e.credit_limit,debt_balance:e.debt_balance,loyalty_points:e.loyalty_points,is_global:!e.branch_id&&(!e.branches||e.branches.length===0)}),s(null),_(!0)},k=async e=>{try{let t=await K.get(`/v1/customers/${e.id}`);w(t.data)}catch{s(`Impossible de charger les détails du client.`)}},A=async e=>{e.preventDefault(),s(null),l(null);try{let e={...x,credit_limit:parseFloat(x.credit_limit||0),debt_balance:parseFloat(x.debt_balance||0),loyalty_points:parseInt(x.loyalty_points||0)};y?(await K.put(`/v1/customers/${y.id}`,e),l(`Client mis à jour avec succès.`)):(await K.post(`/v1/customers`,e),l(`Client créé avec succès.`)),_(!1),T()}catch(e){s(e.response?.data?.error||`Erreur lors de l'enregistrement du client.`)}},j=async e=>{if(window.confirm(`Voulez-vous vraiment supprimer ce client ?`)){s(null),l(null);try{await K.delete(`/v1/customers/${e}`),l(`Client supprimé avec succès.`),T()}catch(e){s(e.response?.data?.error||`Erreur lors de la suppression.`)}}};return(0,q.jsxs)(`div`,{className:`customers-container`,children:[(0,q.jsx)(`div`,{className:`decorator-sphere sphere-1`}),(0,q.jsx)(`div`,{className:`decorator-sphere sphere-2`}),(0,q.jsxs)(`div`,{className:`customers-layout card`,children:[(0,q.jsxs)(`div`,{className:`customers-header`,children:[(0,q.jsxs)(`div`,{children:[(0,q.jsxs)(`h2`,{className:`section-title`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-users me-2 text-primary`}),` Gestion des Clients`]}),(0,q.jsx)(`p`,{className:`customers-subtitle`,children:`Pilotez votre portefeuille client, le crédit compte courant et les points de fidélité.`})]}),(0,q.jsxs)(`button`,{onClick:D,className:`btn btn-primary`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-user-plus me-1`}),` Nouveau Client`]})]}),o&&(0,q.jsxs)(`div`,{className:`error-banner`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-circle-exclamation me-1`}),` `,o]}),c&&(0,q.jsxs)(`div`,{className:`success-banner`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-circle-check me-1`}),` `,c]}),(0,q.jsxs)(`div`,{className:`search-bar`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-magnifying-glass search-icon`}),(0,q.jsx)(`input`,{type:`text`,placeholder:`Rechercher par nom, téléphone, email...`,className:`form-control search-input`,value:m,onChange:E})]}),i?(0,q.jsx)(`div`,{className:`loading-spinner`,children:`Chargement des clients...`}):n.length===0?(0,q.jsxs)(`div`,{className:`empty-state`,children:[(0,q.jsx)(`span`,{className:`empty-icon`,children:(0,q.jsx)(`i`,{className:`fa-solid fa-users-slash text-muted`})}),(0,q.jsx)(`h4`,{children:`Aucun client trouvé`}),(0,q.jsx)(`p`,{children:`Cliquez sur "Nouveau Client" pour enregistrer votre premier client.`})]}):(0,q.jsx)(`div`,{className:`table-responsive mt-3`,children:(0,q.jsxs)(`table`,{className:`table table-striped table-hover table-bordered align-middle mb-0`,children:[(0,q.jsx)(`thead`,{className:`table-dark`,children:(0,q.jsxs)(`tr`,{children:[(0,q.jsx)(`th`,{children:`Nom & Contact`}),(0,q.jsx)(`th`,{children:`Adresse`}),(0,q.jsx)(`th`,{children:`Points Fidélité`}),(0,q.jsx)(`th`,{children:`Crédit & Limite`}),(0,q.jsx)(`th`,{style:{width:`150px`,textAlign:`center`},children:`Actions`})]})}),(0,q.jsx)(`tbody`,{children:n.map(e=>(0,q.jsxs)(`tr`,{children:[(0,q.jsxs)(`td`,{children:[(0,q.jsx)(`div`,{className:`fw-bold text-main`,children:e.name}),(0,q.jsxs)(`div`,{className:`small`,children:[e.email&&(0,q.jsxs)(`span`,{className:`me-2 text-muted`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-envelope me-1`}),e.email]}),e.phone&&(0,q.jsxs)(`span`,{className:`text-muted`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-phone me-1`}),e.phone]})]}),(0,q.jsx)(`div`,{className:`mt-1`,children:!e.branch_id&&(!e.branches||e.branches.length===0)?(0,q.jsxs)(`span`,{className:`badge bg-primary me-1`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-globe me-1`}),`Global (Toutes boutiques)`]}):(0,q.jsxs)(`span`,{className:`badge bg-info text-dark me-1`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-shop me-1`}),e.branch?.name||`Multi-boutiques`]})})]}),(0,q.jsx)(`td`,{className:`text-main`,children:e.address||`-`}),(0,q.jsx)(`td`,{children:(0,q.jsxs)(`span`,{className:`badge bg-success`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-star me-1 text-warning`}),` `,e.loyalty_points,` Pts`]})}),(0,q.jsxs)(`td`,{children:[parseFloat(e.debt_balance)>0?(0,q.jsxs)(`div`,{className:`text-danger fw-bold`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-circle-exclamation me-1`}),`Dette : `,new Intl.NumberFormat(`fr-FR`).format(e.debt_balance),` XOF`]}):(0,q.jsxs)(`div`,{className:`text-success small`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-circle-check me-1`}),` Solde à jour`]}),(0,q.jsxs)(`div`,{className:`text-muted small`,children:[`Limite autorisée : `,new Intl.NumberFormat(`fr-FR`).format(e.credit_limit),` XOF`]})]}),(0,q.jsx)(`td`,{className:`text-center`,children:(0,q.jsxs)(`div`,{className:`d-flex justify-content-center gap-2`,children:[(0,q.jsx)(`button`,{onClick:()=>k(e),className:`btn btn-sm btn-info text-white`,title:`Historique`,children:(0,q.jsx)(`i`,{className:`fa-solid fa-clock-history`})}),(0,q.jsx)(`button`,{onClick:()=>O(e),className:`btn btn-sm btn-warning text-white`,title:`Modifier`,children:(0,q.jsx)(`i`,{className:`fa-solid fa-pencil`})}),(0,q.jsx)(`button`,{onClick:()=>j(e.id),className:`btn btn-sm btn-danger`,title:`Supprimer`,children:(0,q.jsx)(`i`,{className:`fa-solid fa-trash`})})]})})]},e.id))})]})}),f>1&&(0,q.jsxs)(`div`,{className:`pagination-bar mt-4 d-flex justify-content-between align-items-center`,children:[(0,q.jsxs)(`button`,{disabled:u<=1,onClick:()=>d(u-1),className:`btn btn-secondary`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-chevron-left me-1`}),` Précédent`]}),(0,q.jsxs)(`span`,{className:`text-main`,children:[`Page `,u,` sur `,f]}),(0,q.jsxs)(`button`,{disabled:u>=f,onClick:()=>d(u+1),className:`btn btn-secondary`,children:[`Suivant `,(0,q.jsx)(`i`,{className:`fa-solid fa-chevron-right ms-1`})]})]})]}),g&&(0,q.jsx)(`div`,{className:`modal-overlay`,children:(0,q.jsxs)(`div`,{className:`modal-card card`,children:[(0,q.jsx)(`h3`,{children:y?`Modifier le Client`:`Nouveau Client`}),(0,q.jsxs)(`form`,{onSubmit:A,children:[(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Nom Complet *`}),(0,q.jsx)(`input`,{type:`text`,className:`form-control`,value:x.name,onChange:e=>S({...x,name:e.target.value}),required:!0})]}),(0,q.jsxs)(`div`,{className:`form-row-grid`,children:[(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Téléphone`}),(0,q.jsx)(`input`,{type:`text`,className:`form-control`,value:x.phone,onChange:e=>S({...x,phone:e.target.value})})]}),(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Email`}),(0,q.jsx)(`input`,{type:`email`,className:`form-control`,value:x.email,onChange:e=>S({...x,email:e.target.value})})]})]}),(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Adresse`}),(0,q.jsx)(`input`,{type:`text`,className:`form-control`,value:x.address,onChange:e=>S({...x,address:e.target.value})})]}),(0,q.jsxs)(`div`,{className:`form-group my-3 p-3 border rounded bg-input`,children:[(0,q.jsxs)(`div`,{className:`form-check form-switch`,children:[(0,q.jsx)(`input`,{className:`form-check-input`,type:`checkbox`,id:`isGlobalCheck`,checked:x.is_global,onChange:e=>S({...x,is_global:e.target.checked})}),(0,q.jsxs)(`label`,{className:`form-check-label fw-bold text-main ms-2`,htmlFor:`isGlobalCheck`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-globe me-1 text-primary`}),` Client Global (Disponible dans toutes les boutiques)`]})]}),(0,q.jsx)(`div`,{className:`text-muted small mt-1`,children:x.is_global?`Ce client sera visible et utilisable sur le POS de toutes les boutiques de l'entreprise.`:`Ce client sera strictement réservé et visible dans la boutique actuelle uniquement.`})]}),(0,q.jsxs)(`div`,{className:`form-row-grid`,children:[(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Limite de Crédit (XOF) *`}),(0,q.jsx)(`input`,{type:`number`,className:`form-control`,value:x.credit_limit,onChange:e=>S({...x,credit_limit:e.target.value}),required:!0,min:`0`})]}),(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Solde de dette initial (XOF)`}),(0,q.jsx)(`input`,{type:`number`,className:`form-control`,value:x.debt_balance,onChange:e=>S({...x,debt_balance:e.target.value}),min:`0`})]})]}),(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Points de fidélité initiaux`}),(0,q.jsx)(`input`,{type:`number`,className:`form-control`,value:x.loyalty_points,onChange:e=>S({...x,loyalty_points:e.target.value}),min:`0`})]}),(0,q.jsxs)(`div`,{className:`modal-actions`,children:[(0,q.jsx)(`button`,{type:`button`,onClick:()=>_(!1),className:`btn btn-cancel`,children:`Annuler`}),(0,q.jsx)(`button`,{type:`submit`,className:`btn btn-primary`,children:`Enregistrer`})]})]})]})}),C&&(0,q.jsx)(`div`,{className:`modal-overlay`,children:(0,q.jsxs)(`div`,{className:`modal-card card modal-large`,children:[(0,q.jsxs)(`h3`,{children:[`Historique & Détails : `,C.name]}),(0,q.jsxs)(`div`,{className:`row g-3 mb-4`,children:[(0,q.jsx)(`div`,{className:`col-md-4`,children:(0,q.jsxs)(`div`,{className:`p-3 border rounded text-center bg-light`,children:[(0,q.jsx)(`div`,{className:`text-muted small`,children:`Points Fidélité`}),(0,q.jsxs)(`div`,{className:`fs-4 fw-bold text-success`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-star text-warning`}),` `,C.loyalty_points]})]})}),(0,q.jsx)(`div`,{className:`col-md-4`,children:(0,q.jsxs)(`div`,{className:`p-3 border rounded text-center bg-light`,children:[(0,q.jsx)(`div`,{className:`text-muted small`,children:`Encours de dette`}),(0,q.jsxs)(`div`,{className:`fs-4 fw-bold text-danger`,children:[new Intl.NumberFormat(`fr-FR`).format(C.debt_balance),` XOF`]})]})}),(0,q.jsx)(`div`,{className:`col-md-4`,children:(0,q.jsxs)(`div`,{className:`p-3 border rounded text-center bg-light`,children:[(0,q.jsx)(`div`,{className:`text-muted small`,children:`Limite autorisée`}),(0,q.jsxs)(`div`,{className:`fs-4 fw-bold text-primary`,children:[new Intl.NumberFormat(`fr-FR`).format(C.credit_limit),` XOF`]})]})})]}),(0,q.jsxs)(`h5`,{className:`mb-3 text-main`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-receipt me-1`}),` Achats récents`]}),(0,q.jsx)(`div`,{className:`table-responsive`,style:{maxHeight:`300px`},children:!C.sales||C.sales.length===0?(0,q.jsx)(`div`,{className:`p-3 text-center text-muted`,children:`Aucun achat enregistré.`}):(0,q.jsxs)(`table`,{className:`table table-sm table-striped`,children:[(0,q.jsx)(`thead`,{children:(0,q.jsxs)(`tr`,{children:[(0,q.jsx)(`th`,{children:`Date`}),(0,q.jsx)(`th`,{children:`N° Ticket`}),(0,q.jsx)(`th`,{children:`Mode Paiement`}),(0,q.jsx)(`th`,{style:{textAlign:`right`},children:`Total`})]})}),(0,q.jsx)(`tbody`,{children:C.sales.map(e=>(0,q.jsxs)(`tr`,{children:[(0,q.jsx)(`td`,{children:new Date(e.created_at).toLocaleDateString(`fr-FR`)}),(0,q.jsx)(`td`,{children:(0,q.jsxs)(`code`,{children:[`#`,e.sale_number]})}),(0,q.jsx)(`td`,{children:(0,q.jsx)(`span`,{className:`badge bg-secondary`,children:e.payment_method})}),(0,q.jsxs)(`td`,{style:{textAlign:`right`,fontWeight:`bold`},children:[new Intl.NumberFormat(`fr-FR`).format(e.total),` XOF`]})]},e.id))})]})}),(0,q.jsx)(`div`,{className:`modal-actions`,children:(0,q.jsx)(`button`,{type:`button`,onClick:()=>w(null),className:`btn btn-primary`,children:`Fermer`})})]})}),(0,q.jsx)(`style`,{children:`
        .customers-container {
          position: relative;
          width: 100%;
          min-height: 100vh;
          padding: 24px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          z-index: 1;
        }

        .customers-layout {
          width: 100%;
          max-width: 1080px;
          padding: 32px;
          margin-top: 100px;
        }

        .customers-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 24px;
          margin-bottom: 24px;
          text-align: left;
        }

        .customers-subtitle {
          font-size: 13px;
          color: var(--text-muted);
          font-weight: 500;
          margin-top: 4px;
        }

        .search-bar {
          position: relative;
          width: 100%;
          margin-bottom: 20px;
        }

        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }

        .search-input {
          padding-left: 44px;
          height: 48px;
        }
      `})]})},dr=()=>{let{user:e,token:t}=rr(),[n,r]=(0,v.useState)([]),[i,a]=(0,v.useState)([]),[o,s]=(0,v.useState)([]),[c,l]=(0,v.useState)([]),[u,d]=(0,v.useState)(!1),[f,p]=(0,v.useState)(null),[m,h]=(0,v.useState)(null),[g,_]=(0,v.useState)(!1),[y,b]=(0,v.useState)(!1),[x,S]=(0,v.useState)(null),[C,w]=(0,v.useState)(!1),[T,E]=(0,v.useState)(null),[D,O]=(0,v.useState)(``),[k,A]=(0,v.useState)(`unpaid`),[j,M]=(0,v.useState)(`0`),[N,P]=(0,v.useState)(!1),F=e=>{E(e),O(e.notes||``),A(e.payment_status||`unpaid`),M(e.amount_paid?.toString()||`0`),w(!0),p(null),h(null)},I=async e=>{e.preventDefault(),P(!0),p(null),h(null);try{await K.put(`/v1/purchases/${T.id}`,{notes:D,payment_status:k,amount_paid:parseFloat(j||`0`)}),h(`Bon d'achat #${T.purchase_number} mis à jour avec succès.`),w(!1),E(null),le()}catch(e){p(e.response?.data?.error||e.response?.data?.message||`Erreur lors de la mise à jour de l'achat.`)}finally{P(!1)}},[L,R]=(0,v.useState)(``),[ee,te]=(0,v.useState)(``),[z,B]=(0,v.useState)(`received`),[V,H]=(0,v.useState)(`unpaid`),[ne,U]=(0,v.useState)(`0`),[re,ie]=(0,v.useState)(`18`),[ae,oe]=(0,v.useState)(``),[se,ce]=(0,v.useState)([{product_id:``,quantity:`1`,cost_price:``}]),le=async()=>{if(t){d(!0),p(null);try{let t=await K.get(`/v1/purchases`);r(t.data.data||[]);let n=await K.get(`/v1/suppliers`);a(n.data.data||[]);let i=await K.get(`/v1/products`);s(i.data.data||[]);try{let t=await K.get(`/v1/branches`),n=t.data?.data||t.data||[];l(n),e?.branch_id?R(e.branch_id.toString()):n.length>0&&R(n[0].id.toString())}catch{}try{let e=(await K.get(`/v1/tenant-test`)).data?.company?.tax_settings;if(e){let t=e.enable_tax!==!1&&e.enable_tax!==`0`&&e.enable_tax!==0;ie(t?e.tax_rate?.toString()||`18`:`0`)}}catch{}}catch{p(`Impossible de charger le module des approvisionnements.`)}finally{d(!1)}}};(0,v.useEffect)(()=>{le()},[t]);let ue=()=>{ce([...se,{product_id:``,quantity:`1`,cost_price:``}])},de=e=>{let t=se.filter((t,n)=>n!==e);ce(t.length>0?t:[{product_id:``,quantity:`1`,cost_price:``}])},fe=(e,t,n)=>{let r=[...se];r[e][t]=n,ce(r)},pe=()=>{let e=0;se.forEach(t=>{let n=parseFloat(t.quantity||`0`),r=parseFloat(t.cost_price||`0`);e+=n*r});let t=parseFloat(re||`0`),n=t/100*e;return{subtotal:e,tax:n,total:e+n,taxRate:t}},me=async t=>{t.preventDefault(),p(null),h(null);let n=se.filter(e=>e.product_id&&e.quantity>0&&e.cost_price>=0);if(n.length===0){p(`Vous devez ajouter au moins un produit valide.`);return}try{let t=parseInt(L||e?.branch_id||c[0]&&c[0].id||`1`);await K.post(`/v1/purchases`,{branch_id:t,supplier_id:parseInt(ee),status:z,payment_status:V===`partially_paid`?`partial`:V,amount_paid:parseFloat(ne||`0`),tax_rate:parseFloat(re||`0`),notes:ae,items:n.map(e=>({product_id:parseInt(e.product_id),quantity:parseFloat(e.quantity),cost_price:parseFloat(e.cost_price)}))}),h(`Bon d'approvisionnement enregistré et stocks mis à jour.`),te(``),B(`received`),H(`unpaid`),U(`0`),oe(``),ce([{product_id:``,quantity:`1`,cost_price:``}]),_(!1),le()}catch(e){let t=e.response?.data,n=t?.error||t?.message;t?.errors&&(n=Object.values(t.errors).flat().join(` `)),p(n||`Erreur lors de l'enregistrement de l'achat.`)}},he=async e=>{p(null);try{let t=await K.get(`/v1/purchases/${e.id}`);S(t.data),b(!0)}catch{p(`Impossible de charger les détails de ce bon d'achat.`)}},ge=async()=>{p(null),h(null);try{let e=x.details||[];if(e.length===0){p(`Aucun article à réceptionner dans ce bon d'achat.`);return}let t=e.map(e=>({product_id:e.product_id,quantity_received:e.quantity}));await K.post(`/v1/purchases/${x.id}/receive`,{items:t}),h(`Commande #${x.purchase_number} réceptionnée en stock !`),b(!1),S(null),le()}catch(e){p(e.response?.data?.error||e.response?.data?.message||`Erreur lors de la validation de la livraison.`)}};if(!t)return(0,q.jsx)(`div`,{className:`purchases-container`,children:(0,q.jsxs)(`div`,{className:`alert-card card`,children:[(0,q.jsx)(`span`,{className:`alert-icon`,children:(0,q.jsx)(`i`,{className:`fa-solid fa-lock text-muted`})}),(0,q.jsx)(`h3`,{children:`Accès Réservé`}),(0,q.jsx)(`p`,{children:`Vous devez vous connecter à une session pour gérer les approvisionnements.`})]})});let _e=pe();return(0,q.jsxs)(`div`,{className:`purchases-container`,children:[(0,q.jsx)(`div`,{className:`decorator-sphere sphere-1`}),(0,q.jsx)(`div`,{className:`decorator-sphere sphere-2`}),(0,q.jsxs)(`div`,{className:`purchases-layout card`,children:[(0,q.jsxs)(`div`,{className:`purchases-header`,children:[(0,q.jsxs)(`div`,{children:[(0,q.jsxs)(`h2`,{children:[(0,q.jsx)(`i`,{className:`fa-solid fa-truck-ramp-box me-2 text-primary`}),` Gestion des Approvisionnements & Stocks`]}),(0,q.jsx)(`p`,{className:`purchases-subtitle`,children:`Suivez vos commandes d'achats et réceptions en stock`})]}),(0,q.jsxs)(`button`,{onClick:()=>_(!0),className:`btn btn-primary`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-plus me-1`}),` Nouvel Approvisionnement`]})]}),f&&(0,q.jsxs)(`div`,{className:`error-banner`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-circle-exclamation me-1`}),` `,f]}),m&&(0,q.jsxs)(`div`,{className:`success-banner`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-circle-check me-1`}),` `,m]}),g&&(0,q.jsx)(`div`,{className:`modal-overlay`,children:(0,q.jsxs)(`div`,{className:`modal-card card modal-large`,style:{maxWidth:`720px`},children:[(0,q.jsxs)(`h3`,{children:[(0,q.jsx)(`i`,{className:`fa-solid fa-truck-ramp-box me-2 text-primary`}),` Nouvel Approvisionnement`]}),(0,q.jsxs)(`form`,{onSubmit:me,children:[(0,q.jsxs)(`div`,{className:`form-row-grid`,children:[c.length>0&&(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Boutique de réception *`}),(0,q.jsx)(`select`,{className:`form-control`,value:L,onChange:e=>R(e.target.value),required:!0,children:c.map(e=>(0,q.jsx)(`option`,{value:e.id,children:e.name},e.id))})]}),(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Fournisseur *`}),(0,q.jsxs)(`select`,{className:`form-control`,value:ee,onChange:e=>te(e.target.value),required:!0,children:[(0,q.jsx)(`option`,{value:``,children:`Sélectionner...`}),i.map(e=>(0,q.jsxs)(`option`,{value:e.id,children:[e.name,` (Solde : `,e.debt_balance,` XOF)`]},e.id))]})]}),(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Statut livraison *`}),(0,q.jsxs)(`select`,{className:`form-control`,value:z,onChange:e=>B(e.target.value),required:!0,children:[(0,q.jsx)(`option`,{value:`received`,children:`Réception directe immédiate`}),(0,q.jsx)(`option`,{value:`ordered`,children:`Commandé (En attente de livraison)`}),(0,q.jsx)(`option`,{value:`draft`,children:`Brouillon`})]})]})]}),(0,q.jsxs)(`div`,{className:`form-row-grid`,children:[(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Statut Paiement *`}),(0,q.jsxs)(`select`,{className:`form-control`,value:V,onChange:e=>H(e.target.value),required:!0,children:[(0,q.jsx)(`option`,{value:`unpaid`,children:`Non payé (Crédit total)`}),(0,q.jsx)(`option`,{value:`partially_paid`,children:`Payé partiellement`}),(0,q.jsx)(`option`,{value:`paid`,children:`Payé en totalité`})]})]}),(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Acompte payé (XOF)`}),(0,q.jsx)(`input`,{type:`number`,className:`form-control`,value:ne,onChange:e=>U(e.target.value),min:`0`})]})]}),(0,q.jsxs)(`div`,{className:`items-section`,children:[(0,q.jsxs)(`div`,{className:`items-section-header`,children:[(0,q.jsx)(`h4`,{children:`Lignes d'articles`}),(0,q.jsxs)(`button`,{type:`button`,onClick:ue,className:`btn-add-item`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-plus me-1`}),` Ajouter`]})]}),se.map((e,t)=>(0,q.jsxs)(`div`,{className:`item-row`,children:[(0,q.jsxs)(`select`,{className:`form-control item-select`,value:e.product_id,onChange:e=>fe(t,`product_id`,e.target.value),required:!0,children:[(0,q.jsx)(`option`,{value:``,children:`Sélectionner produit...`}),o.map(e=>(0,q.jsxs)(`option`,{value:e.id,children:[e.name,` (`,e.sku,`)`]},e.id))]}),(0,q.jsx)(`input`,{type:`number`,placeholder:`Qté`,className:`form-control qty-input`,value:e.quantity,onChange:e=>fe(t,`quantity`,e.target.value),required:!0,min:`0.01`,step:`0.01`}),(0,q.jsx)(`input`,{type:`number`,placeholder:`Prix Achat Unitaire`,className:`form-control price-input`,value:e.cost_price,onChange:e=>fe(t,`cost_price`,e.target.value),required:!0,min:`0`}),(0,q.jsx)(`button`,{type:`button`,onClick:()=>de(t),className:`btn-remove-row`,children:(0,q.jsx)(`i`,{className:`fa-solid fa-trash-can text-danger`})})]},t))]}),(0,q.jsxs)(`div`,{className:`purchase-totals-summary`,children:[(0,q.jsxs)(`div`,{className:`summary-row`,children:[(0,q.jsx)(`span`,{children:`Sous-total HT :`}),(0,q.jsxs)(`strong`,{children:[new Intl.NumberFormat(`fr-FR`).format(_e.subtotal),` XOF`]})]}),(0,q.jsxs)(`div`,{className:`summary-row`,style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,padding:`4px 0`},children:[(0,q.jsx)(`label`,{className:`form-label mb-0`,style:{fontSize:`13px`,fontWeight:600},children:`Taux de TVA (%) :`}),(0,q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`6px`},children:[(0,q.jsx)(`input`,{type:`number`,className:`form-control`,style:{width:`85px`,textAlign:`right`,padding:`4px 8px`},value:re,onChange:e=>ie(e.target.value),min:`0`,max:`100`,step:`0.1`}),(0,q.jsx)(`span`,{style:{fontSize:`13px`,fontWeight:700},children:`%`})]})]}),(0,q.jsxs)(`div`,{className:`summary-row`,children:[(0,q.jsxs)(`span`,{children:[`Montant TVA (`,_e.taxRate,`%) :`]}),(0,q.jsxs)(`strong`,{children:[new Intl.NumberFormat(`fr-FR`).format(_e.tax),` XOF`]})]}),(0,q.jsxs)(`div`,{className:`summary-row grand-total`,children:[(0,q.jsx)(`span`,{children:`Montant total TTC :`}),(0,q.jsxs)(`strong`,{children:[new Intl.NumberFormat(`fr-FR`).format(_e.total),` XOF`]})]})]}),(0,q.jsxs)(`div`,{className:`form-group`,style:{marginTop:`16px`},children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Notes / Remarques`}),(0,q.jsx)(`textarea`,{className:`form-control textarea-input`,value:ae,onChange:e=>oe(e.target.value)})]}),(0,q.jsxs)(`div`,{className:`modal-actions`,children:[(0,q.jsx)(`button`,{type:`button`,onClick:()=>_(!1),className:`btn btn-cancel`,children:`Annuler`}),(0,q.jsx)(`button`,{type:`submit`,className:`btn btn-primary`,children:`Enregistrer l'Approvisionnement`})]})]})]})}),C&&T&&(0,q.jsx)(`div`,{className:`modal-overlay`,children:(0,q.jsxs)(`div`,{className:`modal-card card`,style:{maxWidth:`520px`},children:[(0,q.jsxs)(`h3`,{children:[`✏️ Modifier le Bon d'Achat `,T.purchase_number]}),(0,q.jsxs)(`p`,{className:`text-muted`,style:{fontSize:`13px`,marginBottom:`16px`},children:[`Fournisseur : `,(0,q.jsx)(`strong`,{children:T.supplier?.name}),` | Montant total : `,(0,q.jsxs)(`strong`,{children:[new Intl.NumberFormat(`fr-FR`).format(T.total_amount),` XOF`]})]}),(0,q.jsxs)(`form`,{onSubmit:I,children:[(0,q.jsxs)(`div`,{className:`form-group mb-3`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Statut du Paiement *`}),(0,q.jsxs)(`select`,{className:`form-control`,value:k,onChange:e=>A(e.target.value),required:!0,children:[(0,q.jsx)(`option`,{value:`unpaid`,children:`Non payé (Crédit total)`}),(0,q.jsx)(`option`,{value:`partially_paid`,children:`Payé partiellement (Acompte)`}),(0,q.jsx)(`option`,{value:`paid`,children:`Payé en totalité`})]})]}),(0,q.jsxs)(`div`,{className:`form-group mb-3`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Montant Réglé / Acompte (XOF)`}),(0,q.jsx)(`input`,{type:`number`,className:`form-control`,value:j,onChange:e=>M(e.target.value),min:`0`,max:T.total_amount}),(0,q.jsxs)(`small`,{className:`text-muted`,children:[`Reste à payer : `,new Intl.NumberFormat(`fr-FR`).format(Math.max(0,T.total_amount-parseFloat(j||`0`))),` XOF`]})]}),(0,q.jsxs)(`div`,{className:`form-group mb-3`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Notes & Remarques`}),(0,q.jsx)(`textarea`,{className:`form-control textarea-input`,value:D,onChange:e=>O(e.target.value),placeholder:`Saisissez vos remarques ou corrections...`})]}),(0,q.jsxs)(`div`,{className:`modal-actions`,children:[(0,q.jsx)(`button`,{type:`button`,onClick:()=>w(!1),className:`btn btn-cancel`,children:`Annuler`}),(0,q.jsx)(`button`,{type:`submit`,className:`btn btn-primary`,disabled:N,children:N?`Mise à jour...`:`Enregistrer les modifications`})]})]})]})}),y&&x&&(0,q.jsx)(`div`,{className:`modal-overlay`,children:(0,q.jsxs)(`div`,{className:`modal-card card`,children:[(0,q.jsx)(`h3`,{children:`📦 Valider la Réception en Stock`}),(0,q.jsxs)(`p`,{children:[`Confirmez-vous la livraison et l'intégration en stock des articles du bon `,(0,q.jsx)(`strong`,{children:x.purchase_number}),` ?`]}),(0,q.jsx)(`ul`,{style:{margin:`16px 0`,fontSize:`13px`,textAlign:`left`,paddingLeft:`20px`},children:(x.details||[]).map((e,t)=>(0,q.jsxs)(`li`,{children:[e.product?.name||`Produit #${e.product_id}`,` (Qté : `,e.quantity,` unités, Prix Achat : `,Number(e.cost_price).toLocaleString(),` XOF)`]},t))}),(0,q.jsxs)(`p`,{style:{fontSize:`12px`,color:`var(--text-muted)`},children:[`Le stock sera mis à jour et la dette fournisseur sera réévaluée de `,x.total_amount-x.amount_paid,` XOF.`]}),(0,q.jsxs)(`div`,{className:`modal-actions`,children:[(0,q.jsx)(`button`,{onClick:()=>b(!1),className:`btn btn-cancel`,children:`Annuler`}),(0,q.jsx)(`button`,{onClick:ge,className:`btn btn-primary`,children:`✔️ Confirmer la livraison`})]})]})}),u?(0,q.jsx)(`div`,{className:`loading-spinner`,children:`Chargement des approvisionnements...`}):n.length===0?(0,q.jsxs)(`div`,{className:`empty-state`,children:[(0,q.jsx)(`span`,{className:`empty-icon`,children:`📭`}),(0,q.jsx)(`h4`,{children:`Aucun approvisionnement enregistré`}),(0,q.jsx)(`p`,{children:`Cliquez sur "Nouvel Approvisionnement" pour commander ou réceptionner des marchandises.`})]}):(0,q.jsx)(`div`,{className:`table-responsive`,children:(0,q.jsxs)(`table`,{className:`products-table`,children:[(0,q.jsx)(`thead`,{children:(0,q.jsxs)(`tr`,{children:[(0,q.jsx)(`th`,{children:`N° Bon d'Achat`}),(0,q.jsx)(`th`,{children:`Fournisseur / Boutique`}),(0,q.jsx)(`th`,{children:`Montant TTC`}),(0,q.jsx)(`th`,{children:`Statut`}),(0,q.jsx)(`th`,{children:`Paiement`}),(0,q.jsx)(`th`,{children:`Action`})]})}),(0,q.jsx)(`tbody`,{children:n.map(e=>(0,q.jsxs)(`tr`,{children:[(0,q.jsxs)(`td`,{children:[(0,q.jsx)(`div`,{className:`sku-cell`,children:e.purchase_number}),(0,q.jsx)(`div`,{className:`barcode-sub`,children:new Date(e.created_at).toLocaleDateString()})]}),(0,q.jsxs)(`td`,{children:[(0,q.jsx)(`div`,{className:`product-title-cell`,children:e.supplier?.name}),(0,q.jsxs)(`div`,{className:`desc-sub`,children:[`Boutique : `,e.branch?.name]})]}),(0,q.jsxs)(`td`,{className:`price-cell`,children:[new Intl.NumberFormat(`fr-FR`).format(e.total_amount),` XOF`]}),(0,q.jsx)(`td`,{children:(0,q.jsx)(`span`,{className:`badge-status status-${e.status}`,children:e.status===`received`?(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(`i`,{className:`fa-solid fa-circle-check me-1`}),` Réceptionné`]}):e.status===`ordered`?(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(`i`,{className:`fa-solid fa-clock me-1`}),` Commandé`]}):(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(`i`,{className:`fa-solid fa-pen-clip me-1`}),` Brouillon`]})})}),(0,q.jsx)(`td`,{children:(0,q.jsx)(`span`,{className:`badge-status payment-${e.payment_status}`,children:e.payment_status===`paid`?(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(`i`,{className:`fa-solid fa-circle-dollar-to-slot me-1`}),` Payé`]}):e.payment_status===`partially_paid`?(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(`i`,{className:`fa-solid fa-wallet me-1`}),` Acompte`]}):(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(`i`,{className:`fa-solid fa-xmark me-1`}),` Non payé`]})})}),(0,q.jsx)(`td`,{children:(0,q.jsxs)(`div`,{style:{display:`flex`,gap:`6px`,alignItems:`center`},children:[e.status===`ordered`&&(0,q.jsxs)(`button`,{onClick:()=>he(e),className:`btn-receive-action`,title:`Réceptionner la marchandise`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-box-open me-1`}),` Réceptionner`]}),(0,q.jsx)(`button`,{onClick:()=>F(e),className:`btn btn-xs btn-secondary`,title:`Modifier les notes ou le paiement de l'achat`,children:(0,q.jsx)(`i`,{className:`fa-solid fa-pen`})}),e.status===`received`&&(0,q.jsxs)(`span`,{className:`text-lock`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-circle-check text-success me-1`}),` Livré`]})]})})]},e.id))})]})})]}),(0,q.jsx)(`style`,{children:`
        .purchases-container {
          position: relative;
          width: 100%;
          min-height: 100vh;
          padding: 24px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          z-index: 1;
        }

        .purchases-layout {
          width: 100%;
          max-width: 1080px;
          padding: 32px;
          margin-top: 100px;
        }

        .purchases-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 24px;
          margin-bottom: 24px;
          text-align: left;
        }

        .purchases-subtitle {
          font-size: 13px;
          color: var(--text-muted);
          font-weight: 500;
          margin-top: 4px;
        }

        /* Statuses */
        .badge-status {
          display: inline-block;
          padding: 4px 8px;
          font-size: 11px;
          font-weight: 700;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .status-received {
          background: rgba(0, 166, 81, 0.1);
          color: var(--color-success);
        }

        .status-ordered {
          background: rgba(245, 158, 11, 0.1);
          color: #F59E0B;
        }

        .status-draft {
          background: rgba(107, 114, 128, 0.1);
          color: var(--text-muted);
        }

        .payment-paid {
          background: rgba(0, 166, 81, 0.1);
          color: var(--color-success);
        }

        .payment-partially_paid {
          background: rgba(59, 130, 246, 0.1);
          color: var(--color-primary);
        }

        .payment-unpaid {
          background: rgba(239, 68, 68, 0.1);
          color: var(--color-error);
        }

        .btn-receive-action {
          padding: 6px 12px;
          font-family: var(--font-title);
          font-size: 12px;
          font-weight: 700;
          background: var(--color-primary);
          color: #FFFFFF;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .btn-receive-action:hover {
          background: #008f43;
          transform: translateY(-1px);
        }

        /* Formulaire dynamique */
        .items-section {
          margin: 24px 0 16px;
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          padding: 16px;
          background: var(--bg-input);
        }

        .items-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .items-section-header h4 {
          margin: 0;
          font-size: 14px;
          color: var(--text-main);
        }

        .btn-add-item {
          background: transparent;
          border: 1px solid var(--color-primary);
          color: var(--color-primary);
          padding: 4px 10px;
          font-size: 12px;
          font-weight: 700;
          border-radius: 4px;
          cursor: pointer;
        }

        .btn-add-item:hover {
          background: var(--primary-glow);
        }

        .item-row {
          display: flex;
          gap: 12px;
          margin-bottom: 10px;
        }

        .item-select {
          flex: 2;
        }

        .qty-input {
          width: 80px;
        }

        .price-input {
          width: 140px;
        }

        .btn-remove-row {
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 14px;
        }

        .purchase-totals-summary {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
          padding: 16px;
          border-top: 1px dashed var(--border-color);
          margin-top: 12px;
        }

        .summary-row {
          font-size: 13px;
          display: flex;
          width: 240px;
          justify-content: space-between;
        }

        .summary-row span {
          color: var(--text-muted);
        }

        .grand-total {
          font-size: 15px;
          border-top: 1px solid var(--border-color);
          padding-top: 8px;
          color: var(--color-success);
        }
      `})]})},fr=()=>{let{token:e}=rr(),[t,n]=(0,v.useState)([]),[r,i]=(0,v.useState)(!1),[a,o]=(0,v.useState)(null),[s,c]=(0,v.useState)(1),[l,u]=(0,v.useState)(1),[d,f]=(0,v.useState)(``),[p,m]=(0,v.useState)(``),[h,g]=(0,v.useState)(``),[_,y]=(0,v.useState)(``),[b,x]=(0,v.useState)(``),[S,C]=(0,v.useState)(null),w=async()=>{if(e){i(!0),o(null);try{let e={page:s};d&&(e.search=d),p&&(e.payment_method=p),h&&(e.payment_status=h),_&&(e.date_from=_),b&&(e.date_to=b);let t=await K.get(`/v1/sales`,{params:e});n(t.data.data||[]),u(t.data.last_page||1)}catch{o(`Erreur lors du chargement des ventes.`)}finally{i(!1)}}};(0,v.useEffect)(()=>{w()},[e,s,p,h,_,b]);let T=e=>{e.preventDefault(),c(1),w()},E=async e=>{try{let t=await K.get(`/v1/sales/${e.id}`);C(t.data)}catch{o(`Impossible de charger le détail de cette vente.`)}},D=()=>{window.print()},O=e=>({cash:`Espèces`,card:`Carte`,credit:`Crédit`})[e]||e,k=e=>({cash:`fa-money-bill-wave`,card:`fa-credit-card`,credit:`fa-handshake`})[e]||`fa-circle-question`,A=e=>e===`paid`?(0,q.jsxs)(`span`,{className:`badge bg-success`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-circle-check me-1`}),`Payé`]}):e===`unpaid`?(0,q.jsxs)(`span`,{className:`badge bg-danger`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-clock me-1`}),`Impayé`]}):(0,q.jsxs)(`span`,{className:`badge bg-warning text-dark`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-hourglass-half me-1`}),`Partiel`]});return e?(0,q.jsxs)(`div`,{className:`sales-container`,children:[(0,q.jsx)(`div`,{className:`decorator-sphere sphere-1`}),(0,q.jsx)(`div`,{className:`decorator-sphere sphere-2`}),(0,q.jsxs)(`div`,{className:`sales-layout card`,children:[(0,q.jsx)(`div`,{className:`sales-header`,children:(0,q.jsxs)(`div`,{children:[(0,q.jsxs)(`h2`,{children:[(0,q.jsx)(`i`,{className:`fa-solid fa-receipt me-2 text-primary`}),` Historique des Ventes`]}),(0,q.jsx)(`p`,{className:`sales-subtitle`,children:`Consultez l'ensemble des transactions réalisées, filtrez par date, client ou moyen de paiement.`})]})}),a&&(0,q.jsxs)(`div`,{className:`error-banner`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-circle-exclamation me-1`}),` `,a]}),(0,q.jsxs)(`form`,{className:`filters-bar`,onSubmit:T,children:[(0,q.jsxs)(`div`,{className:`filter-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Recherche`}),(0,q.jsxs)(`div`,{className:`search-bar`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-magnifying-glass search-icon`}),(0,q.jsx)(`input`,{type:`text`,className:`form-control search-input`,placeholder:`N° ticket, nom client, téléphone...`,value:d,onChange:e=>f(e.target.value)})]})]}),(0,q.jsxs)(`div`,{className:`filter-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Paiement`}),(0,q.jsxs)(`select`,{className:`form-control`,value:p,onChange:e=>{m(e.target.value),c(1)},children:[(0,q.jsx)(`option`,{value:``,children:`Tous`}),(0,q.jsx)(`option`,{value:`cash`,children:`Espèces`}),(0,q.jsx)(`option`,{value:`card`,children:`Carte`}),(0,q.jsx)(`option`,{value:`credit`,children:`Crédit`})]})]}),(0,q.jsxs)(`div`,{className:`filter-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Statut`}),(0,q.jsxs)(`select`,{className:`form-control`,value:h,onChange:e=>{g(e.target.value),c(1)},children:[(0,q.jsx)(`option`,{value:``,children:`Tous`}),(0,q.jsx)(`option`,{value:`paid`,children:`Payé`}),(0,q.jsx)(`option`,{value:`unpaid`,children:`Impayé`})]})]}),(0,q.jsxs)(`div`,{className:`filter-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Du`}),(0,q.jsx)(`input`,{type:`date`,className:`form-control`,value:_,onChange:e=>{y(e.target.value),c(1)}})]}),(0,q.jsxs)(`div`,{className:`filter-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Au`}),(0,q.jsx)(`input`,{type:`date`,className:`form-control`,value:b,onChange:e=>{x(e.target.value),c(1)}})]}),(0,q.jsx)(`div`,{className:`filter-group filter-action`,children:(0,q.jsxs)(`button`,{type:`submit`,className:`btn btn-primary btn-sm`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-filter me-1`}),` Filtrer`]})})]}),r?(0,q.jsx)(`div`,{className:`loading-spinner`,children:`Chargement des ventes...`}):t.length===0?(0,q.jsxs)(`div`,{className:`empty-state`,children:[(0,q.jsx)(`span`,{className:`empty-icon`,children:(0,q.jsx)(`i`,{className:`fa-solid fa-file-invoice text-muted`,style:{fontSize:`40px`}})}),(0,q.jsx)(`h4`,{children:`Aucune vente trouvée`}),(0,q.jsx)(`p`,{children:`Ajustez vos filtres ou réalisez votre première vente depuis le POS.`})]}):(0,q.jsx)(`div`,{className:`table-responsive mt-3`,children:(0,q.jsxs)(`table`,{className:`table table-striped table-hover table-bordered align-middle mb-0`,children:[(0,q.jsx)(`thead`,{className:`table-dark`,children:(0,q.jsxs)(`tr`,{children:[(0,q.jsx)(`th`,{children:`N° Ticket`}),(0,q.jsx)(`th`,{children:`Date & Heure`}),(0,q.jsx)(`th`,{children:`Client`}),(0,q.jsx)(`th`,{children:`Caissier`}),(0,q.jsx)(`th`,{children:`Paiement`}),(0,q.jsx)(`th`,{children:`Statut`}),(0,q.jsx)(`th`,{style:{textAlign:`right`},children:`Total TTC`}),(0,q.jsx)(`th`,{style:{textAlign:`center`,width:`80px`},children:`Détail`})]})}),(0,q.jsx)(`tbody`,{children:t.map(e=>(0,q.jsxs)(`tr`,{children:[(0,q.jsx)(`td`,{children:(0,q.jsxs)(`code`,{className:`fw-bold text-primary`,children:[`#`,e.sale_number]})}),(0,q.jsxs)(`td`,{children:[(0,q.jsx)(`div`,{children:new Date(e.created_at).toLocaleDateString(`fr-FR`)}),(0,q.jsx)(`div`,{className:`text-muted small`,children:new Date(e.created_at).toLocaleTimeString(`fr-FR`,{hour:`2-digit`,minute:`2-digit`})})]}),(0,q.jsxs)(`td`,{children:[(0,q.jsx)(`div`,{className:`fw-semibold`,children:e.client_name||`Client Comptant`}),e.client_phone&&(0,q.jsxs)(`div`,{className:`text-muted small`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-phone me-1`}),e.client_phone]})]}),(0,q.jsxs)(`td`,{children:[(0,q.jsx)(`div`,{children:e.user?.name||`-`}),(0,q.jsx)(`div`,{className:`text-muted small`,children:e.branch?.name||`-`})]}),(0,q.jsx)(`td`,{children:(0,q.jsxs)(`span`,{className:`badge bg-secondary`,children:[(0,q.jsx)(`i`,{className:`fa-solid ${k(e.payment_method)} me-1`}),O(e.payment_method)]})}),(0,q.jsx)(`td`,{children:A(e.payment_status)}),(0,q.jsxs)(`td`,{style:{textAlign:`right`,fontWeight:`bold`},children:[new Intl.NumberFormat(`fr-FR`).format(e.total),` XOF`]}),(0,q.jsx)(`td`,{style:{textAlign:`center`},children:(0,q.jsx)(`button`,{onClick:()=>E(e),className:`btn btn-sm btn-info text-white`,title:`Voir le reçu`,children:(0,q.jsx)(`i`,{className:`fa-solid fa-eye`})})})]},e.id))})]})}),l>1&&(0,q.jsxs)(`div`,{className:`pagination-bar mt-4 d-flex justify-content-between align-items-center`,children:[(0,q.jsxs)(`button`,{disabled:s<=1,onClick:()=>c(s-1),className:`btn btn-secondary`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-chevron-left me-1`}),` Précédent`]}),(0,q.jsxs)(`span`,{className:`text-main`,children:[`Page `,s,` sur `,l]}),(0,q.jsxs)(`button`,{disabled:s>=l,onClick:()=>c(s+1),className:`btn btn-secondary`,children:[`Suivant `,(0,q.jsx)(`i`,{className:`fa-solid fa-chevron-right ms-1`})]})]})]}),S&&(0,q.jsx)(`div`,{className:`modal-overlay`,onClick:()=>C(null),children:(0,q.jsxs)(`div`,{className:`modal-card card modal-large`,onClick:e=>e.stopPropagation(),children:[(0,q.jsxs)(`div`,{className:`receipt-print-zone`,id:`printable-receipt`,children:[(0,q.jsxs)(`div`,{className:`receipt-header-block`,children:[(0,q.jsxs)(`h3`,{className:`receipt-title`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-store me-2`}),` ApexPOS — Reçu de Vente`]}),(0,q.jsxs)(`p`,{className:`receipt-meta`,children:[(0,q.jsx)(`strong`,{children:`N° Ticket :`}),` `,S.sale_number,(0,q.jsx)(`br`,{}),(0,q.jsx)(`strong`,{children:`Date :`}),` `,new Date(S.created_at).toLocaleDateString(`fr-FR`),` à `,new Date(S.created_at).toLocaleTimeString(`fr-FR`,{hour:`2-digit`,minute:`2-digit`}),(0,q.jsx)(`br`,{}),(0,q.jsx)(`strong`,{children:`Caissier :`}),` `,S.user?.name||`-`,` — `,S.branch?.name||`-`,(0,q.jsx)(`br`,{}),(0,q.jsx)(`strong`,{children:`Client :`}),` `,S.client_name||`Client Comptant`,` `,S.client_phone?`(${S.client_phone})`:``]})]}),(0,q.jsx)(`div`,{className:`receipt-divider`}),(0,q.jsxs)(`table`,{className:`receipt-items-table`,children:[(0,q.jsx)(`thead`,{children:(0,q.jsxs)(`tr`,{children:[(0,q.jsx)(`th`,{style:{textAlign:`left`},children:`Article`}),(0,q.jsx)(`th`,{children:`Qté`}),(0,q.jsx)(`th`,{children:`PU`}),(0,q.jsx)(`th`,{style:{textAlign:`right`},children:`Total`})]})}),(0,q.jsx)(`tbody`,{children:S.details?.map((e,t)=>(0,q.jsxs)(`tr`,{children:[(0,q.jsx)(`td`,{style:{textAlign:`left`},children:e.product?.name||`Produit #${e.product_id}`}),(0,q.jsx)(`td`,{children:e.quantity}),(0,q.jsx)(`td`,{children:new Intl.NumberFormat(`fr-FR`).format(e.selling_price)}),(0,q.jsx)(`td`,{style:{textAlign:`right`},children:new Intl.NumberFormat(`fr-FR`).format(e.total)})]},t))})]}),(0,q.jsx)(`div`,{className:`receipt-divider`}),(0,q.jsxs)(`div`,{className:`receipt-totals`,children:[(0,q.jsxs)(`div`,{className:`receipt-total-row`,children:[(0,q.jsx)(`span`,{children:`Sous-total HT`}),(0,q.jsxs)(`span`,{children:[new Intl.NumberFormat(`fr-FR`).format(S.subtotal),` XOF`]})]}),parseFloat(S.discount)>0&&(0,q.jsxs)(`div`,{className:`receipt-total-row`,children:[(0,q.jsx)(`span`,{children:`Remise`}),(0,q.jsxs)(`span`,{children:[`-`,new Intl.NumberFormat(`fr-FR`).format(S.discount),` XOF`]})]}),(0,q.jsxs)(`div`,{className:`receipt-total-row`,children:[(0,q.jsx)(`span`,{children:`TVA (18%)`}),(0,q.jsxs)(`span`,{children:[new Intl.NumberFormat(`fr-FR`).format(S.tax),` XOF`]})]}),(0,q.jsxs)(`div`,{className:`receipt-total-row grand-total`,children:[(0,q.jsx)(`span`,{children:`TOTAL TTC`}),(0,q.jsxs)(`span`,{children:[new Intl.NumberFormat(`fr-FR`).format(S.total),` XOF`]})]})]}),(0,q.jsx)(`div`,{className:`receipt-divider`}),(0,q.jsxs)(`div`,{className:`receipt-payment-info`,children:[(0,q.jsxs)(`p`,{children:[(0,q.jsx)(`strong`,{children:`Mode :`}),` `,O(S.payment_method)]}),S.payment_method===`cash`&&(0,q.jsxs)(q.Fragment,{children:[(0,q.jsxs)(`p`,{children:[(0,q.jsx)(`strong`,{children:`Reçu :`}),` `,new Intl.NumberFormat(`fr-FR`).format(S.amount_received),` XOF`]}),(0,q.jsxs)(`p`,{children:[(0,q.jsx)(`strong`,{children:`Monnaie rendue :`}),` `,new Intl.NumberFormat(`fr-FR`).format(S.amount_change),` XOF`]})]}),(0,q.jsxs)(`p`,{children:[(0,q.jsx)(`strong`,{children:`Statut :`}),` `,S.payment_status===`paid`?`Payé`:`Impayé (Crédit)`]})]}),(0,q.jsx)(`div`,{className:`receipt-divider`}),(0,q.jsxs)(`div`,{className:`receipt-footer`,children:[(0,q.jsx)(`p`,{children:`Merci pour votre achat !`}),(0,q.jsx)(`p`,{className:`small`,children:`Retour ou échange sous 7 jours avec le ticket.`})]})]}),(0,q.jsxs)(`div`,{className:`modal-actions no-print`,children:[(0,q.jsx)(`button`,{type:`button`,onClick:()=>C(null),className:`btn btn-cancel`,children:`Fermer`}),(0,q.jsxs)(`button`,{type:`button`,onClick:D,className:`btn btn-primary`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-print me-1`}),` Imprimer le Reçu`]})]})]})}),(0,q.jsx)(`style`,{children:`
        .sales-container {
          position: relative;
          width: 100%;
          min-height: 100vh;
          padding: 24px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          z-index: 1;
        }

        .sales-layout {
          width: 100%;
          max-width: 1200px;
          padding: 32px;
          margin-top: 100px;
        }

        .sales-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 24px;
          margin-bottom: 24px;
          text-align: left;
        }

        .sales-subtitle {
          font-size: 13px;
          color: var(--text-muted);
          font-weight: 500;
          margin-top: 4px;
        }

        /* Barre de filtres */
        .filters-bar {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          align-items: flex-end;
          margin-bottom: 20px;
          padding: 16px;
          background: var(--bg-input);
          border-radius: var(--border-radius-sm);
          border: 1px solid var(--border-color);
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
          min-width: 140px;
        }

        .filter-group .form-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0;
        }

        .filter-action {
          flex: 0;
          min-width: auto;
          justify-content: flex-end;
        }

        .search-bar {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }

        .search-input {
          padding-left: 36px;
        }

        /* Reçu imprimable */
        .receipt-print-zone {
          text-align: center;
          padding: 24px;
        }

        .receipt-header-block {
          margin-bottom: 16px;
        }

        .receipt-title {
          font-size: 18px;
          font-weight: 800;
          margin-bottom: 12px;
          color: var(--text-main);
        }

        .receipt-meta {
          font-size: 13px;
          line-height: 1.8;
          color: var(--text-muted);
          text-align: left;
        }

        .receipt-divider {
          border-top: 1px dashed var(--border-color);
          margin: 16px 0;
        }

        .receipt-items-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
          color: var(--text-main);
        }

        .receipt-items-table th {
          font-size: 11px;
          text-transform: uppercase;
          color: var(--text-muted);
          padding: 8px 4px;
          border-bottom: 1px solid var(--border-color);
          text-align: center;
        }

        .receipt-items-table td {
          padding: 8px 4px;
          text-align: center;
          color: var(--text-main);
        }

        .receipt-totals {
          text-align: right;
        }

        .receipt-total-row {
          display: flex;
          justify-content: space-between;
          padding: 4px 0;
          font-size: 13px;
          color: var(--text-main);
        }

        .receipt-total-row.grand-total {
          font-size: 16px;
          font-weight: 800;
          border-top: 2px solid var(--border-color);
          padding-top: 8px;
          margin-top: 8px;
          color: var(--color-success);
        }

        .receipt-payment-info p {
          font-size: 13px;
          margin-bottom: 4px;
          text-align: left;
          color: var(--text-main);
        }

        .receipt-footer {
          margin-top: 16px;
          color: var(--text-muted);
          font-size: 12px;
        }

        /* L'impression utilise désormais les styles d'impression globaux de index.css */
      `})]}):(0,q.jsx)(`div`,{className:`sales-container`,children:(0,q.jsxs)(`div`,{className:`alert-card card`,children:[(0,q.jsx)(`span`,{children:(0,q.jsx)(`i`,{className:`fa-solid fa-lock text-muted`})}),(0,q.jsx)(`h3`,{children:`Accès Réservé`}),(0,q.jsx)(`p`,{children:`Connectez-vous pour accéder à l'historique des ventes.`})]})})},pr=()=>{let{user:e,token:t}=rr(),[n,r]=(0,v.useState)([]),[i,a]=(0,v.useState)([]),[o,s]=(0,v.useState)(!1),[c,l]=(0,v.useState)(null),[u,d]=(0,v.useState)(``),[f,p]=(0,v.useState)(``),[m,h]=(0,v.useState)(!1),[g,_]=(0,v.useState)(null),[y,b]=(0,v.useState)(null),x=async()=>{if(t){h(!0),_(null);try{let e=await K.get(`/v1/stock/current`);r(e.data);let t=await K.get(`/v1/stock/movements`);a(t.data.data||[])}catch{_(`Impossible de charger les données d'inventaire.`)}finally{h(!1)}}};(0,v.useEffect)(()=>{x()},[t]);let S=e=>{l(e),d(``),p(``),s(!0)},C=async e=>{e.preventDefault(),_(null),b(null);try{await K.post(`/v1/stock/adjust`,{branch_id:c.branch_id,product_id:c.product_id,quantity:parseFloat(u),description:f}),b(`Ajustement de stock enregistré.`),s(!1),l(null),x()}catch(e){_(e.response?.data?.error||`Erreur lors de l'ajustement du stock.`)}};if(!t)return(0,q.jsx)(`div`,{className:`stocks-container`,children:(0,q.jsxs)(`div`,{className:`alert-card card`,children:[(0,q.jsx)(`span`,{className:`alert-icon`,children:(0,q.jsx)(`i`,{className:`fa-solid fa-lock text-muted`})}),(0,q.jsx)(`h3`,{children:`Accès Réservé`}),(0,q.jsx)(`p`,{children:`Vous devez vous connecter à une session pour gérer les stocks et inventaires.`})]})});let w=e?.permissions?.includes(`products.update`)||e?.role===`admin`;return(0,q.jsxs)(`div`,{className:`stocks-container`,children:[(0,q.jsx)(`div`,{className:`decorator-sphere sphere-1`}),(0,q.jsx)(`div`,{className:`decorator-sphere sphere-2`}),(0,q.jsxs)(`div`,{className:`stocks-layout card`,children:[(0,q.jsx)(`div`,{className:`stocks-header`,children:(0,q.jsxs)(`div`,{children:[(0,q.jsxs)(`h2`,{children:[(0,q.jsx)(`i`,{className:`fa-solid fa-layer-group me-2 text-success`}),` Niveaux de Stocks & Outil d'Inventaire`]}),(0,q.jsx)(`p`,{className:`stocks-subtitle`,children:`Ajustez manuellement les stocks de votre boutique centrale et consultez l'historique`})]})}),g&&(0,q.jsxs)(`div`,{className:`error-banner`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-circle-exclamation me-1`}),` `,g]}),y&&(0,q.jsxs)(`div`,{className:`success-banner`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-circle-check me-1`}),` `,y]}),o&&c&&(0,q.jsx)(`div`,{className:`modal-overlay`,children:(0,q.jsxs)(`div`,{className:`modal-card card`,children:[(0,q.jsxs)(`h3`,{children:[(0,q.jsx)(`i`,{className:`fa-solid fa-screwdriver-wrench me-2 text-warning`}),` Ajuster le stock physique`]}),(0,q.jsxs)(`p`,{style:{fontSize:`13px`,color:`var(--text-muted)`,marginBottom:`16px`},children:[`Article : `,(0,q.jsx)(`strong`,{children:c.product?.name}),` `,(0,q.jsx)(`br`,{}),`Stock actuel : `,(0,q.jsxs)(`strong`,{children:[c.quantity,` unités`]}),` dans `,(0,q.jsx)(`strong`,{children:c.branch?.name})]}),(0,q.jsxs)(`form`,{onSubmit:C,children:[(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Quantité à ajuster (Saisir négatif pour perte/casse) *`}),(0,q.jsx)(`input`,{type:`number`,className:`form-control`,placeholder:`Ex: -5 pour retirer 5 unités, ou 10 pour ajouter`,value:u,onChange:e=>d(e.target.value),required:!0,step:`0.01`})]}),(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Motif / Description *`}),(0,q.jsx)(`input`,{type:`text`,className:`form-control`,placeholder:`Ex: Perte humidité, Casse de chantier, Inventaire correctif`,value:f,onChange:e=>p(e.target.value),required:!0})]}),(0,q.jsxs)(`div`,{className:`modal-actions`,children:[(0,q.jsx)(`button`,{type:`button`,onClick:()=>s(!1),className:`btn btn-cancel`,children:`Annuler`}),(0,q.jsx)(`button`,{type:`submit`,className:`btn btn-primary`,children:`Valider l'ajustement`})]})]})]})}),(0,q.jsxs)(`div`,{className:`stocks-sections-grid`,children:[(0,q.jsxs)(`div`,{className:`stocks-section-block`,children:[(0,q.jsxs)(`h3`,{children:[(0,q.jsx)(`i`,{className:`fa-solid fa-chart-simple me-2 text-success`}),` Niveaux de Stock Actuels`]}),m?(0,q.jsx)(`div`,{className:`loading-spinner`,children:`Chargement des niveaux de stock...`}):n.length===0?(0,q.jsxs)(`div`,{className:`empty-state`,children:[(0,q.jsx)(`span`,{className:`empty-icon`,children:(0,q.jsx)(`i`,{className:`fa-solid fa-inbox text-muted`})}),(0,q.jsx)(`h4`,{children:`Aucun stock actif`}),(0,q.jsx)(`p`,{children:`Réceptionnez un approvisionnement pour garnir votre stock.`})]}):(0,q.jsx)(`div`,{className:`table-responsive`,children:(0,q.jsxs)(`table`,{className:`products-table`,children:[(0,q.jsx)(`thead`,{children:(0,q.jsxs)(`tr`,{children:[(0,q.jsx)(`th`,{children:`Article`}),(0,q.jsx)(`th`,{children:`Boutique`}),(0,q.jsx)(`th`,{children:`Qté en Stock`}),(0,q.jsx)(`th`,{children:`Action`})]})}),(0,q.jsx)(`tbody`,{children:n.map(e=>(0,q.jsxs)(`tr`,{children:[(0,q.jsxs)(`td`,{children:[(0,q.jsx)(`div`,{className:`product-title-cell`,children:e.product?.name}),(0,q.jsxs)(`div`,{className:`barcode-sub`,children:[`SKU : `,e.product?.sku]})]}),(0,q.jsx)(`td`,{children:(0,q.jsx)(`div`,{className:`desc-sub`,children:e.branch?.name})}),(0,q.jsxs)(`td`,{className:`price-cell`,style:{color:parseFloat(e.quantity)<=parseFloat(e.product?.alert_quantity||10)?`var(--color-error)`:`var(--color-success)`},children:[e.quantity,` unités`,parseFloat(e.quantity)<=parseFloat(e.product?.alert_quantity||10)&&(0,q.jsxs)(`div`,{className:`alert-qty-cell`,style:{color:`var(--color-error)`,fontSize:`10px`,fontWeight:`700`},children:[(0,q.jsx)(`i`,{className:`fa-solid fa-triangle-exclamation text-danger me-1`}),` SEUIL ALERTE`]})]}),(0,q.jsx)(`td`,{children:w?(0,q.jsxs)(`button`,{onClick:()=>S(e),className:`btn-receive-action`,style:{padding:`4px 8px`,fontSize:`11px`},children:[(0,q.jsx)(`i`,{className:`fa-solid fa-screwdriver-wrench me-1`}),` Ajuster`]}):(0,q.jsx)(`span`,{className:`text-lock`,children:(0,q.jsx)(`i`,{className:`fa-solid fa-lock text-muted`})})})]},e.id))})]})})]}),(0,q.jsxs)(`div`,{className:`stocks-section-block`,children:[(0,q.jsxs)(`h3`,{children:[(0,q.jsx)(`i`,{className:`fa-solid fa-clock-rotate-left me-2 text-info`}),` Journal des Mouvements de Stock`]}),m?(0,q.jsx)(`div`,{className:`loading-spinner`,children:`Chargement de l'historique...`}):i.length===0?(0,q.jsxs)(`div`,{className:`empty-state`,children:[(0,q.jsx)(`span`,{className:`empty-icon`,children:(0,q.jsx)(`i`,{className:`fa-solid fa-receipt text-muted`})}),(0,q.jsx)(`h4`,{children:`Historique vide`}),(0,q.jsx)(`p`,{children:`Les mouvements d'entrées et sorties s'afficheront ici.`})]}):(0,q.jsx)(`div`,{className:`movements-log-list`,children:i.map(e=>(0,q.jsxs)(`div`,{className:`movement-log-item`,children:[(0,q.jsx)(`div`,{className:`mov-left`,children:(0,q.jsx)(`span`,{className:`mov-badge-qty ${parseFloat(e.quantity)>0?`qty-pos`:`qty-neg`}`,children:parseFloat(e.quantity)>0?`+${e.quantity}`:e.quantity})}),(0,q.jsxs)(`div`,{className:`mov-middle`,children:[(0,q.jsx)(`div`,{className:`mov-product-name`,children:e.product?.name}),(0,q.jsxs)(`div`,{className:`mov-details`,children:[(0,q.jsxs)(`span`,{children:[`Boutique : `,e.branch?.name]}),` • `,(0,q.jsxs)(`span`,{children:[`Type : `,e.type===`purchase`?(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(`i`,{className:`fa-solid fa-download me-1`}),` Achat`]}):e.type===`sale`?(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(`i`,{className:`fa-solid fa-upload me-1`}),` Vente`]}):(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(`i`,{className:`fa-solid fa-screwdriver-wrench me-1`}),` Ajustement`]})]})]}),e.description&&(0,q.jsxs)(`div`,{className:`mov-desc`,children:[`Motif : `,e.description]})]}),(0,q.jsx)(`div`,{className:`mov-right`,children:(0,q.jsx)(`div`,{className:`mov-time`,children:new Date(e.created_at).toLocaleDateString()})})]},e.id))})]})]})]}),(0,q.jsx)(`style`,{children:`
        .stocks-container {
          position: relative;
          width: 100%;
          min-height: 100vh;
          padding: 24px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          z-index: 1;
        }

        .stocks-layout {
          width: 100%;
          max-width: 1080px;
          padding: 32px;
          margin-top: 100px;
        }

        .stocks-header {
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 24px;
          margin-bottom: 24px;
          text-align: left;
        }

        .stocks-subtitle {
          font-size: 13px;
          color: var(--text-muted);
          font-weight: 500;
          margin-top: 4px;
        }

        .stocks-sections-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 28px;
          text-align: left;
        }

        .stocks-section-block h3 {
          font-size: 16px;
          margin-bottom: 16px;
          border-left: 3px solid var(--color-primary);
          padding-left: 10px;
        }

        /* Styles des logs de mouvements */
        .movements-log-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 500px;
          overflow-y: auto;
          padding-right: 8px;
        }

        .movement-log-item {
          display: flex;
          align-items: center;
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          padding: 12px;
          gap: 12px;
          transition: all var(--transition-fast);
        }

        .movement-log-item:hover {
          border-color: var(--text-muted);
        }

        .mov-badge-qty {
          display: inline-block;
          width: 64px;
          text-align: center;
          padding: 6px 0;
          border-radius: 4px;
          font-weight: 800;
          font-size: 13px;
        }

        .qty-pos {
          background: rgba(0, 166, 81, 0.1);
          color: var(--color-success);
          border: 1px solid rgba(0, 166, 81, 0.2);
        }

        .qty-neg {
          background: rgba(239, 68, 68, 0.1);
          color: var(--color-error);
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .mov-middle {
          flex: 1;
        }

        .mov-product-name {
          font-weight: 700;
          font-size: 13px;
          color: var(--text-main);
        }

        .mov-details {
          font-size: 11px;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .mov-desc {
          font-size: 11px;
          color: var(--text-main);
          font-style: italic;
          margin-top: 4px;
        }

        .mov-right {
          text-align: right;
        }

        .mov-time {
          font-size: 11px;
          color: var(--text-muted);
        }
      `})]})},mr=()=>{let{user:e,token:t}=rr(),[n,r]=(0,v.useState)([]),[i,a]=(0,v.useState)([]),[o,s]=(0,v.useState)([]),[c,l]=(0,v.useState)(!1),[u,d]=(0,v.useState)(!1),[f,p]=(0,v.useState)(null),[m,h]=(0,v.useState)(``),[g,_]=(0,v.useState)(``),[y,b]=(0,v.useState)(``),[x,S]=(0,v.useState)(``),[C,w]=(0,v.useState)([{product_id:``,quantity:`1`}]),[T,E]=(0,v.useState)(!1),[D,O]=(0,v.useState)(null),[k,A]=(0,v.useState)(null),j=async()=>{if(t){E(!0),O(null);try{let e=await K.get(`/v1/transfers`);r(e.data.data||[]);let t=await K.get(`/v1/branches`);a(t.data||[]);let n=await K.get(`/v1/products`);s(n.data.data||[])}catch{O(`Impossible de charger le module de transfert inter-boutique.`)}finally{E(!1)}}};(0,v.useEffect)(()=>{j()},[t]);let M=()=>{w([...C,{product_id:``,quantity:`1`}])},N=e=>{let t=C.filter((t,n)=>n!==e);w(t.length>0?t:[{product_id:``,quantity:`1`}])},P=(e,t,n)=>{let r=[...C];r[e][t]=n,w(r)},F=async e=>{e.preventDefault(),O(null),A(null);let t=C.filter(e=>e.product_id&&e.quantity>0);if(t.length===0){O(`Vous devez ajouter au moins un produit valide.`);return}try{await K.post(`/v1/transfers`,{from_branch_id:parseInt(g),to_branch_id:parseInt(y),notes:x,items:t.map(e=>({product_id:parseInt(e.product_id),quantity:parseFloat(e.quantity)}))}),A(`Demande de transfert créée avec succès.`),_(``),b(``),S(``),w([{product_id:``,quantity:`1`}]),l(!1),j()}catch(e){O(e.response?.data?.error||`Erreur lors de la création de la demande.`)}},I=(e,t)=>{p(e),h(t),d(!0)},L=async()=>{O(null),A(null);try{let e=`/v1/transfers/${f.id}/${m}`;await K.post(e),A(m===`ship`?`Marchandises expédiées et en transit !`:`Transfert validé et reçu en stock.`),d(!1),p(null),j()}catch(e){O(e.response?.data?.error||`Erreur lors du traitement de l'expédition/réception.`),d(!1)}};if(!t)return(0,q.jsx)(`div`,{className:`transfers-container`,children:(0,q.jsxs)(`div`,{className:`alert-card card`,children:[(0,q.jsx)(`span`,{className:`alert-icon`,children:(0,q.jsx)(`i`,{className:`fa-solid fa-lock text-muted`})}),(0,q.jsx)(`h3`,{children:`Accès Réservé`}),(0,q.jsx)(`p`,{children:`Vous devez vous connecter à une session pour gérer les transferts inter-boutiques.`})]})});let R=e?.permissions?.includes(`products.update`)||e?.role===`admin`;return(0,q.jsxs)(`div`,{className:`transfers-container`,children:[(0,q.jsx)(`div`,{className:`decorator-sphere sphere-1`}),(0,q.jsx)(`div`,{className:`decorator-sphere sphere-2`}),(0,q.jsxs)(`div`,{className:`transfers-layout card`,children:[(0,q.jsxs)(`div`,{className:`transfers-header`,children:[(0,q.jsxs)(`div`,{children:[(0,q.jsxs)(`h2`,{children:[(0,q.jsx)(`i`,{className:`fa-solid fa-right-left me-2 text-warning`}),` Transferts Inter-Boutiques`]}),(0,q.jsx)(`p`,{className:`transfers-subtitle`,children:`Transférez vos stocks en toute sécurité entre vos points de vente`})]}),(0,q.jsxs)(`button`,{onClick:()=>l(!0),className:`btn btn-primary`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-plus me-1`}),` Demander un Transfert`]})]}),D&&(0,q.jsxs)(`div`,{className:`error-banner`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-circle-exclamation me-1`}),` `,D]}),k&&(0,q.jsxs)(`div`,{className:`success-banner`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-circle-check me-1`}),` `,k]}),c&&(0,q.jsx)(`div`,{className:`modal-overlay`,children:(0,q.jsxs)(`div`,{className:`modal-card card modal-large`,style:{maxWidth:`640px`},children:[(0,q.jsxs)(`h3`,{children:[(0,q.jsx)(`i`,{className:`fa-solid fa-right-left me-2 text-warning`}),` Demande de transfert inter-boutique`]}),(0,q.jsxs)(`form`,{onSubmit:F,children:[(0,q.jsxs)(`div`,{className:`form-row-grid`,children:[(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Boutique d'origine (Source) *`}),(0,q.jsxs)(`select`,{className:`form-control`,value:g,onChange:e=>_(e.target.value),required:!0,children:[(0,q.jsx)(`option`,{value:``,children:`Sélectionner...`}),i.map(e=>(0,q.jsx)(`option`,{value:e.id,children:e.name},e.id))]})]}),(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Boutique de destination (Cible) *`}),(0,q.jsxs)(`select`,{className:`form-control`,value:y,onChange:e=>b(e.target.value),required:!0,children:[(0,q.jsx)(`option`,{value:``,children:`Sélectionner...`}),i.map(e=>(0,q.jsx)(`option`,{value:e.id,children:e.name},e.id))]})]})]}),(0,q.jsxs)(`div`,{className:`items-section`,children:[(0,q.jsxs)(`div`,{className:`items-section-header`,children:[(0,q.jsx)(`h4`,{children:`Produits à transférer`}),(0,q.jsx)(`button`,{type:`button`,onClick:M,className:`btn-add-item`,children:`➕ Ajouter`})]}),C.map((e,t)=>(0,q.jsxs)(`div`,{className:`item-row`,children:[(0,q.jsxs)(`select`,{className:`form-control item-select`,value:e.product_id,onChange:e=>P(t,`product_id`,e.target.value),required:!0,children:[(0,q.jsx)(`option`,{value:``,children:`Sélectionner produit...`}),o.map(e=>(0,q.jsxs)(`option`,{value:e.id,children:[e.name,` (`,e.sku,`)`]},e.id))]}),(0,q.jsx)(`input`,{type:`number`,placeholder:`Qté`,className:`form-control qty-input`,value:e.quantity,onChange:e=>P(t,`quantity`,e.target.value),required:!0,min:`0.01`,step:`0.01`}),(0,q.jsx)(`button`,{type:`button`,onClick:()=>N(t),className:`btn-remove-row`,children:(0,q.jsx)(`i`,{className:`fa-solid fa-trash-can text-danger`})})]},t))]}),(0,q.jsxs)(`div`,{className:`form-group`,style:{marginTop:`16px`},children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Notes / Instructions logistiques`}),(0,q.jsx)(`textarea`,{className:`form-control textarea-input`,value:x,onChange:e=>S(e.target.value)})]}),(0,q.jsxs)(`div`,{className:`modal-actions`,children:[(0,q.jsx)(`button`,{type:`button`,onClick:()=>l(!1),className:`btn btn-cancel`,children:`Annuler`}),(0,q.jsx)(`button`,{type:`submit`,className:`btn btn-primary`,children:`Créer la demande`})]})]})]})}),u&&f&&(0,q.jsx)(`div`,{className:`modal-overlay`,children:(0,q.jsxs)(`div`,{className:`modal-card card`,children:[(0,q.jsx)(`h3`,{children:m===`ship`?(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(`i`,{className:`fa-solid fa-truck me-2 text-warning`}),` Confirmer l'expédition`]}):(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(`i`,{className:`fa-solid fa-box-open me-2 text-primary`}),` Valider la réception`]})}),(0,q.jsxs)(`p`,{style:{fontSize:`13px`,textAlign:`left`,marginBottom:`12px`},children:[`Bon : `,(0,q.jsx)(`strong`,{children:f.transfer_number}),` `,(0,q.jsx)(`br`,{}),`Origine : `,f.from_branch?.name,` `,(0,q.jsx)(`br`,{}),`Destination : `,f.to_branch?.name]}),(0,q.jsx)(`ul`,{style:{margin:`12px 0`,fontSize:`12px`,textAlign:`left`,paddingLeft:`20px`},children:f.details?.map((e,t)=>(0,q.jsxs)(`li`,{children:[e.product?.name,` (Qté : `,e.quantity,` unités)`]},t))}),(0,q.jsx)(`p`,{style:{fontSize:`12px`,color:`var(--text-muted)`},children:m===`ship`?`Cette action débitera immédiatement le stock de la boutique d'origine.`:`Cette action créditera immédiatement le stock de la boutique de destination.`}),(0,q.jsxs)(`div`,{className:`modal-actions`,children:[(0,q.jsx)(`button`,{onClick:()=>d(!1),className:`btn btn-cancel`,children:`Annuler`}),(0,q.jsxs)(`button`,{onClick:L,className:`btn btn-primary`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-circle-check me-1`}),` Confirmer`]})]})]})}),T?(0,q.jsx)(`div`,{className:`loading-spinner`,children:`Chargement des transferts...`}):n.length===0?(0,q.jsxs)(`div`,{className:`empty-state`,children:[(0,q.jsx)(`span`,{className:`empty-icon`,children:(0,q.jsx)(`i`,{className:`fa-solid fa-right-left text-muted`})}),(0,q.jsx)(`h4`,{children:`Aucun transfert enregistré`}),(0,q.jsx)(`p`,{children:`Cliquez sur "Demander un Transfert" pour transférer des marchandises d'une boutique à une autre.`})]}):(0,q.jsx)(`div`,{className:`table-responsive`,children:(0,q.jsxs)(`table`,{className:`products-table`,children:[(0,q.jsx)(`thead`,{children:(0,q.jsxs)(`tr`,{children:[(0,q.jsx)(`th`,{children:`N° Transfert`}),(0,q.jsx)(`th`,{children:`Origine / Destination`}),(0,q.jsx)(`th`,{children:`Détails Articles`}),(0,q.jsx)(`th`,{children:`Statut`}),(0,q.jsx)(`th`,{children:`Action`})]})}),(0,q.jsx)(`tbody`,{children:n.map(t=>(0,q.jsxs)(`tr`,{children:[(0,q.jsxs)(`td`,{children:[(0,q.jsx)(`div`,{className:`sku-cell`,children:t.transfer_number}),(0,q.jsx)(`div`,{className:`barcode-sub`,children:new Date(t.created_at).toLocaleDateString()})]}),(0,q.jsxs)(`td`,{children:[(0,q.jsxs)(`div`,{className:`product-title-cell`,children:[`De : `,t.from_branch?.name]}),(0,q.jsxs)(`div`,{className:`desc-sub`,children:[`Vers : `,t.to_branch?.name]})]}),(0,q.jsx)(`td`,{children:(0,q.jsx)(`div`,{style:{fontSize:`11px`,textAlign:`left`},children:t.details?.map((e,t)=>(0,q.jsxs)(`div`,{children:[`• `,e.product?.name,` (`,e.quantity,` u.)`]},t))})}),(0,q.jsx)(`td`,{children:(0,q.jsx)(`span`,{className:`badge-status status-${t.status}`,children:t.status===`pending`?(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(`i`,{className:`fa-solid fa-clock me-1`}),` En attente`]}):t.status===`transit`?(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(`i`,{className:`fa-solid fa-truck me-1`}),` En transit`]}):(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(`i`,{className:`fa-solid fa-circle-check me-1`}),` Terminé`]})})}),(0,q.jsxs)(`td`,{children:[(()=>{let n=e?.role?.slug||e?.role?.name||e?.role,r=n===`super-admin`||n===`admin`,i=e?.branch_id===t.from_branch_id,a=e?.branch_id===t.to_branch_id;return(0,q.jsxs)(q.Fragment,{children:[R&&t.status===`pending`&&(r||i)&&(0,q.jsxs)(`button`,{onClick:()=>I(t,`ship`),className:`btn-receive-action`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-truck me-1`}),` Expédier`]}),R&&t.status===`pending`&&!r&&!i&&(0,q.jsxs)(`span`,{className:`text-muted text-xs`,style:{fontSize:`11px`},children:[(0,q.jsx)(`i`,{className:`fa-solid fa-hourglass me-1`}),` En attente d'expédition par la source`]}),R&&t.status===`transit`&&(r||a)&&(0,q.jsxs)(`button`,{onClick:()=>I(t,`receive`),className:`btn-receive-action`,style:{background:`#3b82f6`},children:[(0,q.jsx)(`i`,{className:`fa-solid fa-box-open me-1`}),` Réceptionner`]}),R&&t.status===`transit`&&!r&&!a&&(0,q.jsxs)(`span`,{className:`text-muted text-xs`,style:{fontSize:`11px`},children:[(0,q.jsx)(`i`,{className:`fa-solid fa-truck-ramp-box me-1`}),` En cours de transit...`]})]})})(),t.status===`completed`&&(0,q.jsxs)(`span`,{className:`text-lock`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-circle-check text-success me-1`}),` Livré`]})]})]},t.id))})]})})]}),(0,q.jsx)(`style`,{children:`
        .transfers-container {
          position: relative;
          width: 100%;
          min-height: 100vh;
          padding: 24px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          z-index: 1;
        }

        .transfers-layout {
          width: 100%;
          max-width: 1080px;
          padding: 32px;
          margin-top: 100px;
        }

        .transfers-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 24px;
          margin-bottom: 24px;
          text-align: left;
        }

        .transfers-subtitle {
          font-size: 13px;
          color: var(--text-muted);
          font-weight: 500;
          margin-top: 4px;
        }

        /* Statuses */
        .status-transit {
          background: rgba(59, 130, 246, 0.1);
          color: var(--color-primary);
        }

        .status-pending {
          background: rgba(245, 158, 11, 0.1);
          color: #F59E0B;
        }

        .btn-receive-action {
          padding: 6px 12px;
          font-family: var(--font-title);
          font-size: 12px;
          font-weight: 700;
          background: var(--color-primary);
          color: #FFFFFF;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .btn-receive-action:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        /* Formulaire dynamique */
        .items-section {
          margin: 24px 0 16px;
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          padding: 16px;
          background: var(--bg-input);
        }

        .items-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .items-section-header h4 {
          margin: 0;
          font-size: 14px;
          color: var(--text-main);
        }

        .btn-add-item {
          background: transparent;
          border: 1px solid var(--color-primary);
          color: var(--color-primary);
          padding: 4px 10px;
          font-size: 12px;
          font-weight: 700;
          border-radius: 4px;
          cursor: pointer;
        }

        .btn-add-item:hover {
          background: var(--primary-glow);
        }

        .item-row {
          display: flex;
          gap: 12px;
          margin-bottom: 10px;
        }

        .item-select {
          flex: 2;
        }

        .qty-input {
          width: 100px;
        }

        .btn-remove-row {
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 14px;
        }
      `})]})},hr=()=>{let{user:e,token:t}=rr(),[n,r]=(0,v.useState)(null),[i,a]=(0,v.useState)([]),[o,s]=(0,v.useState)(`10000`),[c,l]=(0,v.useState)(``),[u,d]=(0,v.useState)(`deposit`),[f,p]=(0,v.useState)(``),[m,h]=(0,v.useState)(``),[g,_]=(0,v.useState)(``),[y,b]=(0,v.useState)(``),[x,S]=(0,v.useState)(``),[C,w]=(0,v.useState)(null),[T,E]=(0,v.useState)(!1),[D,O]=(0,v.useState)(null),[k,A]=(0,v.useState)(null),j=async()=>{if(t){E(!0),O(null);try{let e=await K.get(`/v1/cash-sessions/current`);e.data&&e.data.id?r(e.data):r(null);let t=await K.get(`/v1/cash-sessions`);a(t.data.data||[])}catch{O(`Impossible de charger le module de session de caisse.`)}finally{E(!1)}}};(0,v.useEffect)(()=>{j()},[t]);let M=async e=>{e.preventDefault(),O(null),A(null);try{await K.post(`/v1/cash-sessions/open`,{opening_balance:parseFloat(o),notes:c}),A(`Caisse ouverte pour la journée !`),l(``),j()}catch(e){O(e.response?.data?.error||`Erreur lors de l'ouverture de caisse.`)}},N=async e=>{if(e.preventDefault(),O(null),A(null),!n||!n.id){O(`Impossible d'enregistrer l'opération : aucune session de caisse active (ouverte) n'a été détectée.`);return}let t=parseFloat(f);if(isNaN(t)||t<=0){O(`Veuillez saisir un montant d'opération valide et supérieur à 0.`);return}try{await K.post(`/v1/cash-sessions/${n.id}/transaction`,{type:u,amount:t,description:m}),A(u===`deposit`?`Dépôt de monnaie enregistré.`:`Retrait de caisse enregistré.`),p(``),h(``),j()}catch(e){O(e.response?.data?.error||`Erreur lors de l'enregistrement du mouvement de caisse.`)}},P=async e=>{e.preventDefault(),O(null),A(null);try{await K.post(`/v1/cash-sessions/${n.id}/close`,{closing_balance:parseFloat(g),notes:y}),A(`Caisse fermée avec succès. Résumé de clôture disponible.`),_(``),b(``),j()}catch(e){O(e.response?.data?.error||`Erreur lors de la clôture de caisse.`)}},F=async e=>{e.preventDefault(),O(null),A(null);try{await K.post(`/v1/cash-sessions/${C.id}/validate`,{validation_notes:x}),A(`Écarts validés et session régularisée.`),w(null),S(``),j()}catch(e){O(e.response?.data?.error||`Erreur lors de la validation des écarts.`)}};if(!t)return(0,q.jsx)(`div`,{className:`sessions-container`,children:(0,q.jsxs)(`div`,{className:`alert-card card`,children:[(0,q.jsx)(`span`,{className:`alert-icon`,children:(0,q.jsx)(`i`,{className:`fa-solid fa-lock text-muted`})}),(0,q.jsx)(`h3`,{children:`Accès Réservé`}),(0,q.jsx)(`p`,{children:`Vous devez vous connecter à une session pour gérer vos caisses.`})]})});let I=e?.role===`admin`||e?.role===`gerant`,L=(()=>{if(!n)return 0;let e=parseFloat(n.opening_balance)||0;return n.transactions?.forEach(t=>{let n=parseFloat(t.amount)||0;t.type===`deposit`&&(e+=n),t.type===`withdrawal`&&(e-=n)}),e})();return(0,q.jsxs)(`div`,{className:`sessions-container`,children:[(0,q.jsx)(`div`,{className:`decorator-sphere sphere-1`}),(0,q.jsx)(`div`,{className:`decorator-sphere sphere-2`}),(0,q.jsxs)(`div`,{className:`sessions-layout card`,children:[(0,q.jsx)(`div`,{className:`sessions-header`,children:(0,q.jsxs)(`div`,{children:[(0,q.jsxs)(`h2`,{children:[(0,q.jsx)(`i`,{className:`fa-solid fa-money-bill-wave me-2 text-success`}),` Gestion des Sessions de Caisses`]}),(0,q.jsx)(`p`,{className:`sessions-subtitle`,children:`Suivez vos fonds de caisse, dépôts/retraits et régularisez les écarts de clôture`})]})}),D&&(0,q.jsxs)(`div`,{className:`error-banner`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-circle-exclamation me-1`}),` `,D]}),k&&(0,q.jsxs)(`div`,{className:`success-banner`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-circle-check me-1`}),` `,k]}),(0,q.jsx)(`div`,{className:`sessions-main-grid`,children:n?(0,q.jsxs)(`div`,{className:`session-dashboard-grid`,children:[(0,q.jsxs)(`div`,{className:`session-card-block card-success-light`,children:[(0,q.jsxs)(`div`,{className:`session-status-badge`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-circle-dot text-success me-1`}),` CAISSE OUVERTE`]}),(0,q.jsxs)(`div`,{className:`session-metric`,children:[(0,q.jsx)(`span`,{className:`metric-label`,children:`Solde Théorique Actuel :`}),(0,q.jsxs)(`span`,{className:`metric-val`,children:[new Intl.NumberFormat(`fr-FR`).format(L),` XOF`]})]}),(0,q.jsxs)(`div`,{className:`session-details-list`,style:{fontSize:`13px`,marginTop:`16px`},children:[(0,q.jsxs)(`div`,{children:[`• Caissier : `,(0,q.jsx)(`strong`,{children:n.user?.name||`-`})]}),(0,q.jsxs)(`div`,{children:[`• Boutique : `,(0,q.jsx)(`strong`,{children:n.branch?.name||`-`})]}),(0,q.jsxs)(`div`,{children:[`• Ouvert le : `,(0,q.jsx)(`strong`,{children:n.opened_at?new Date(n.opened_at).toLocaleString(`fr-FR`):`-`})]}),(0,q.jsxs)(`div`,{children:[`• Fonds d'ouverture : `,(0,q.jsxs)(`strong`,{children:[new Intl.NumberFormat(`fr-FR`).format(parseFloat(n.opening_balance)||0),` XOF`]})]})]})]}),(0,q.jsxs)(`div`,{className:`session-card-block`,children:[(0,q.jsxs)(`h3`,{children:[(0,q.jsx)(`i`,{className:`fa-solid fa-arrow-right-arrow-left me-2 text-primary`}),` Entrées/Sorties de caisse`]}),(0,q.jsxs)(`form`,{onSubmit:N,className:`tx-form`,children:[(0,q.jsxs)(`div`,{className:`form-row-grid`,style:{gridTemplateColumns:`1fr 1fr`},children:[(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Type d'opération`}),(0,q.jsxs)(`select`,{className:`form-control`,value:u,onChange:e=>d(e.target.value),children:[(0,q.jsx)(`option`,{value:`deposit`,children:`Dépôt de monnaie`}),(0,q.jsx)(`option`,{value:`withdrawal`,children:`Retrait de caisse`})]})]}),(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Montant (XOF) *`}),(0,q.jsx)(`input`,{type:`number`,className:`form-control`,value:f,onChange:e=>p(e.target.value),required:!0,min:`1`})]})]}),(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Description / Motif *`}),(0,q.jsx)(`input`,{type:`text`,className:`form-control`,placeholder:`Ex: Achat fournitures de bureau, Monnaie 1000 XOF`,value:m,onChange:e=>h(e.target.value),required:!0})]}),(0,q.jsx)(`button`,{type:`submit`,className:`btn btn-primary`,style:{width:`100%`},children:`Enregistrer l'opération`})]})]}),(0,q.jsxs)(`div`,{className:`session-card-block card-danger-light`,children:[(0,q.jsxs)(`h3`,{children:[(0,q.jsx)(`i`,{className:`fa-solid fa-vault me-2 text-danger`}),` Fermeture Tiroir-Caisse`]}),(0,q.jsxs)(`form`,{onSubmit:P,children:[(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Montant réel compté dans le tiroir (XOF) *`}),(0,q.jsx)(`input`,{type:`number`,className:`form-control`,placeholder:`Comptez tout l'argent liquide disponible`,value:g,onChange:e=>_(e.target.value),required:!0,min:`0`})]}),(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Notes de clôture (Optionnel)`}),(0,q.jsx)(`input`,{type:`text`,className:`form-control`,value:y,onChange:e=>b(e.target.value)})]}),(0,q.jsx)(`button`,{type:`submit`,className:`btn btn-cancel`,style:{width:`100%`,background:`#EF4444`,color:`#FFF`},children:`🔒 Soumettre la clôture de caisse`})]})]})]}):(0,q.jsxs)(`div`,{className:`session-card-block card-secondary`,children:[(0,q.jsxs)(`h3`,{children:[(0,q.jsx)(`i`,{className:`fa-solid fa-cash-register me-2 text-danger`}),` Votre Caisse est Fermée`]}),(0,q.jsx)(`p`,{className:`block-desc`,children:`Vous devez ouvrir une session de caisse avec un fonds de tiroir-caisse pour pouvoir débuter les ventes.`}),(0,q.jsxs)(`form`,{onSubmit:M,style:{marginTop:`20px`},children:[(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Fonds de caisse d'ouverture (XOF) *`}),(0,q.jsx)(`input`,{type:`number`,className:`form-control`,value:o,onChange:e=>s(e.target.value),required:!0,min:`0`})]}),(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Notes d'ouverture (Optionnel)`}),(0,q.jsx)(`input`,{type:`text`,className:`form-control`,placeholder:`Ex: Monnaie reçue du coffre`,value:c,onChange:e=>l(e.target.value)})]}),(0,q.jsxs)(`button`,{type:`submit`,className:`btn btn-primary`,style:{width:`100%`,marginTop:`12px`},children:[(0,q.jsx)(`i`,{className:`fa-solid fa-unlock-keyhole me-1`}),` Ouvrir la caisse pour la journée`]})]})]})}),I&&(0,q.jsxs)(`div`,{className:`admin-validation-block`,style:{marginTop:`32px`},children:[(0,q.jsx)(`h3`,{className:`section-title`,children:`📋 Administration & Validation des Écarts de Caisses`}),C&&(0,q.jsx)(`div`,{className:`modal-overlay`,children:(0,q.jsxs)(`div`,{className:`modal-card card`,children:[(0,q.jsx)(`h3`,{children:`✔️ Régulariser l'écart de caisse`}),(0,q.jsxs)(`p`,{style:{fontSize:`13px`,color:`var(--text-muted)`,marginBottom:`16px`},children:[`Session de : `,(0,q.jsx)(`strong`,{children:C.user?.name}),` `,(0,q.jsx)(`br`,{}),`Solde Théorique : `,(0,q.jsxs)(`strong`,{children:[C.theoretical_balance,` XOF`]}),` `,(0,q.jsx)(`br`,{}),`Solde Réel compté : `,(0,q.jsxs)(`strong`,{children:[C.closing_balance,` XOF`]}),` `,(0,q.jsx)(`br`,{}),`Écart constaté : `,(0,q.jsxs)(`strong`,{style:{color:`var(--color-error)`},children:[C.closing_balance-C.theoretical_balance,` XOF`]})]}),(0,q.jsxs)(`form`,{onSubmit:F,children:[(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Notes de validation / Décision de régularisation *`}),(0,q.jsx)(`textarea`,{className:`form-control textarea-input`,placeholder:`Ex: Écart de 500 CFA approuvé (erreur de rendu de monnaie compensée par le caissier)`,value:x,onChange:e=>S(e.target.value),required:!0})]}),(0,q.jsxs)(`div`,{className:`modal-actions`,children:[(0,q.jsx)(`button`,{type:`button`,onClick:()=>w(null),className:`btn btn-cancel`,children:`Annuler`}),(0,q.jsx)(`button`,{type:`submit`,className:`btn btn-primary`,children:`Valider la session`})]})]})]})}),i.length===0?(0,q.jsx)(`div`,{className:`empty-state`,children:`Aucun historique de caisse disponible.`}):(0,q.jsx)(`div`,{className:`table-responsive`,children:(0,q.jsxs)(`table`,{className:`products-table`,children:[(0,q.jsx)(`thead`,{children:(0,q.jsxs)(`tr`,{children:[(0,q.jsx)(`th`,{children:`Caissier / Date`}),(0,q.jsx)(`th`,{children:`Boutique`}),(0,q.jsx)(`th`,{children:`Fonds Ouverture`}),(0,q.jsx)(`th`,{children:`Théorique / Réel`}),(0,q.jsx)(`th`,{children:`Écart`}),(0,q.jsx)(`th`,{children:`Statut`}),(0,q.jsx)(`th`,{children:`Action`})]})}),(0,q.jsx)(`tbody`,{children:i.map(e=>{let t=e.closing_balance?parseFloat(e.closing_balance)-parseFloat(e.theoretical_balance):0;return(0,q.jsxs)(`tr`,{children:[(0,q.jsxs)(`td`,{children:[(0,q.jsx)(`div`,{className:`product-title-cell`,children:e.user?.name}),(0,q.jsx)(`div`,{className:`barcode-sub`,children:new Date(e.opened_at).toLocaleDateString()})]}),(0,q.jsx)(`td`,{children:(0,q.jsx)(`div`,{className:`desc-sub`,children:e.branch?.name})}),(0,q.jsxs)(`td`,{className:`price-cell`,children:[new Intl.NumberFormat(`fr-FR`).format(e.opening_balance),` XOF`]}),(0,q.jsx)(`td`,{children:e.status===`open`?(0,q.jsx)(`span`,{style:{color:`var(--text-muted)`},children:`En cours...`}):(0,q.jsxs)(`div`,{style:{fontSize:`12px`},children:[`Th: `,new Intl.NumberFormat(`fr-FR`).format(e.theoretical_balance),` XOF `,(0,q.jsx)(`br`,{}),`Réel: `,new Intl.NumberFormat(`fr-FR`).format(e.closing_balance),` XOF`]})}),(0,q.jsx)(`td`,{style:{color:t===0?`var(--color-success)`:`var(--color-error)`,fontWeight:`700`},children:e.status===`open`?`-`:`${t>0?`+`:``}${t} XOF`}),(0,q.jsx)(`td`,{children:(0,q.jsx)(`span`,{className:`badge-status ${e.status===`open`?`status-ordered`:e.status===`closed`?`payment-unpaid`:`status-received`}`,children:e.status===`open`?`🟢 Ouverte`:e.status===`closed`?`🔴 Close`:`✔️ Validée`})}),(0,q.jsxs)(`td`,{children:[e.status===`closed`&&(0,q.jsx)(`button`,{onClick:()=>w(e),className:`btn-receive-action`,style:{padding:`4px 8px`,fontSize:`11px`},children:`✔️ Valider`}),e.status===`validated`&&(0,q.jsx)(`span`,{className:`text-lock`,style:{fontSize:`11px`},children:`Régularisé`}),e.status===`open`&&(0,q.jsx)(`span`,{className:`text-lock`,children:`-`})]})]},e.id)})})]})})]})]}),(0,q.jsx)(`style`,{children:`
        .sessions-container {
          position: relative;
          width: 100%;
          min-height: 100vh;
          padding: 24px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          z-index: 1;
        }

        .sessions-layout {
          width: 100%;
          max-width: 1080px;
          padding: 32px;
          margin-top: 100px;
        }

        .sessions-header {
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 24px;
          margin-bottom: 24px;
          text-align: left;
        }

        .sessions-subtitle {
          font-size: 13px;
          color: var(--text-muted);
          font-weight: 500;
          margin-top: 4px;
        }

        .sessions-main-grid {
          text-align: left;
        }

        .session-card-block {
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          padding: 20px;
          margin-bottom: 20px;
        }

        .card-secondary {
          border-top: 4px solid var(--color-primary);
        }

        .card-success-light {
          border-top: 4px solid var(--color-success);
        }

        .card-danger-light {
          border-top: 4px solid #EF4444;
        }

        .block-desc {
          font-size: 13px;
          color: var(--text-muted);
        }

        .session-dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr 1fr;
          gap: 20px;
        }

        .session-status-badge {
          display: inline-block;
          background: rgba(0, 166, 81, 0.1);
          color: var(--color-success);
          font-size: 11px;
          font-weight: 800;
          padding: 4px 8px;
          border-radius: 4px;
          margin-bottom: 12px;
        }

        .session-metric {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .metric-label {
          font-size: 12px;
          color: var(--text-muted);
        }

        .metric-val {
          font-size: 22px;
          font-weight: 800;
          color: var(--text-main);
        }

        .tx-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .admin-validation-block h3 {
          font-size: 16px;
          margin-bottom: 16px;
          border-left: 3px solid var(--color-primary);
          padding-left: 10px;
          text-align: left;
        }
      `})]})},gr=e=>{let t,n=new Set,r=(e,r)=>{let i=typeof e==`function`?e(t):e;if(!Object.is(i,t)){let e=t;t=r??(typeof i!=`object`||!i)?i:Object.assign({},t,i),n.forEach(n=>n(t,e))}},i=()=>t,a={setState:r,getState:i,getInitialState:()=>o,subscribe:e=>(n.add(e),()=>n.delete(e))},o=t=e(r,i,a);return a},_r=(e=>e?gr(e):gr),vr=e=>e;function yr(e,t=vr){let n=v.useSyncExternalStore(e.subscribe,v.useCallback(()=>t(e.getState()),[e,t]),v.useCallback(()=>t(e.getInitialState()),[e,t]));return v.useDebugValue(n),n}var br=e=>{let t=_r(e),n=e=>yr(t,e);return Object.assign(n,t),n},xr=(e=>e?br(e):br)((e,t)=>({cart:[],globalDiscount:0,taxSettings:{enable_tax:!0,tax_rate:18},setTaxSettings:t=>{t&&e({taxSettings:t})},addItem:n=>{let{cart:r}=t(),i=r.findIndex(e=>e.product.id===n.id);if(i>-1){let t=[...r];t[i].quantity+=1,e({cart:t})}else e({cart:[...r,{product:n,quantity:1,discount:0}]})},removeItem:n=>{let{cart:r}=t();e({cart:r.filter(e=>e.product.id!==n)})},updateQuantity:(n,r)=>{let{cart:i}=t();if(r<=0){t().removeItem(n);return}e({cart:i.map(e=>e.product.id===n?{...e,quantity:parseFloat(r)}:e)})},updateDiscount:(n,r)=>{let{cart:i}=t();e({cart:i.map(e=>e.product.id===n?{...e,discount:parseFloat(r||`0`)}:e)})},setGlobalDiscount:t=>{e({globalDiscount:parseFloat(t||`0`)})},clearCart:()=>{e({cart:[],globalDiscount:0})},getTotals:e=>{let{cart:n,globalDiscount:r,taxSettings:i}=t(),a=e||i||{enable_tax:!0,tax_rate:18},o=a.enable_tax!==!1&&a.enable_tax!==`0`&&a.enable_tax!==0,s=o?parseFloat(a.tax_rate??18):0,c=0,l=0;n.forEach(e=>{let t=parseFloat(e.product.selling_price);c+=e.quantity*t,l+=parseFloat(e.discount||`0`)});let u=l+r,d=Math.max(0,c-u),f=o?s/100*d:0,p=d+f;return{subtotal:c,discount:u,tax:f,total:p,enableTax:o,taxRate:a.tax_rate??18}}})),Sr=()=>{let{user:e,token:t}=rr(),{cart:n,globalDiscount:r,addItem:i,removeItem:a,updateQuantity:o,updateDiscount:s,setGlobalDiscount:c,clearCart:l,getTotals:u,setTaxSettings:d}=xr(),[f,p]=(0,v.useState)([]),[m,h]=(0,v.useState)([]),[g,_]=(0,v.useState)(null),[y,b]=(0,v.useState)(null),[x,S]=(0,v.useState)(``),[C,w]=(0,v.useState)(!1),[T,E]=(0,v.useState)(``),[D,O]=(0,v.useState)(null);(0,v.useRef)(null),(0,v.useRef)(null);let[k,A]=(0,v.useState)(!1),[j,M]=(0,v.useState)(`cash`),[N,P]=(0,v.useState)(``),[F,I]=(0,v.useState)(``),[L,R]=(0,v.useState)(``),[ee,te]=(0,v.useState)([]),[z,B]=(0,v.useState)(``),[V,H]=(0,v.useState)(null),[ne,U]=(0,v.useState)(!1),[re,ie]=(0,v.useState)(null),[ae,oe]=(0,v.useState)(null),se=async()=>{if(t){U(!0),ie(null);try{let e=await K.get(`/v1/cash-sessions/current`);e.data&&e.data.id?b(e.data):b(null);let t=await K.get(`/v1/products`);p(t.data.data||[]);let n=await K.get(`/v1/categories`);h(n.data||[]);let r=await K.get(`/v1/customers`);te(r.data.data||[]);try{let e=await K.get(`/v1/tenant-test`);e.data?.company?.tax_settings&&d(e.data.company.tax_settings)}catch{}}catch{ie(`Impossible de charger les données du catalogue, des clients ou de caisse.`)}finally{U(!1)}}};(0,v.useEffect)(()=>{se()},[t]);let ce=e=>{if(e.key===`Enter`){e.preventDefault();let t=x.trim();if(!t)return;let n=f.find(e=>e.barcode===t||e.sku.toLowerCase()===t.toLowerCase());if(n)i(n),oe(`Ajouté : ${n.name}`),S(``),setTimeout(()=>oe(null),1500);else{let e=f.filter(e=>e.name.toLowerCase().includes(t.toLowerCase()));e.length===1?(i(e[0]),oe(`Ajouté : ${e[0].name}`),S(``),setTimeout(()=>oe(null),1500)):e.length>1?(ie(`Plusieurs produits correspondent. Veuillez sélectionner dans la grille.`),setTimeout(()=>ie(null),2500)):(ie(`Aucun produit trouvé avec ce code-barres ou SKU.`),setTimeout(()=>ie(null),2500))}}},le=f.filter(e=>{let t=!g||e.category_id===g,n=!x||e.name.toLowerCase().includes(x.toLowerCase())||e.sku.toLowerCase().includes(x.toLowerCase());return t&&n&&e.status===`active`}),ue=u(),de=j===`cash`&&N?parseFloat(N)-ue.total:0;return t?y?(0,q.jsxs)(`div`,{className:`pos-container`,children:[(0,q.jsx)(`div`,{className:`decorator-sphere sphere-1`}),(0,q.jsx)(`div`,{className:`decorator-sphere sphere-2`}),(0,q.jsxs)(`div`,{className:`pos-layout card`,children:[re&&(0,q.jsxs)(`div`,{className:`error-banner`,children:[`⚠️ `,re]}),ae&&(0,q.jsxs)(`div`,{className:`success-banner`,children:[`✔️ `,ae]}),(0,q.jsxs)(`div`,{className:`pos-grid-columns`,children:[(0,q.jsxs)(`div`,{className:`pos-left-panel`,children:[(0,q.jsx)(`div`,{className:`pos-search-box`,children:(0,q.jsx)(`input`,{type:`text`,className:`form-control pos-search-input`,placeholder:`🔍 Rechercher ou scanner un code-barres (Appuyez sur Entrée)...`,value:x,onChange:e=>S(e.target.value),onKeyDown:ce})}),(0,q.jsxs)(`div`,{className:`pos-categories-bar`,children:[(0,q.jsx)(`button`,{onClick:()=>_(null),className:`pos-cat-btn ${g===null?`active`:``}`,children:`Tout`}),m.map(e=>(0,q.jsx)(`button`,{onClick:()=>_(e.id),className:`pos-cat-btn ${g===e.id?`active`:``}`,children:e.name},e.id))]}),le.length===0?(0,q.jsx)(`div`,{className:`empty-state`,style:{marginTop:`40px`},children:`Aucun produit trouvé dans cette catégorie.`}):(0,q.jsx)(`div`,{className:`pos-products-grid`,children:le.map(e=>(0,q.jsxs)(`div`,{onClick:()=>i(e),className:`pos-product-card`,children:[(0,q.jsxs)(`div`,{className:`pos-prod-img-box`,children:[e.image_path?(0,q.jsx)(`img`,{src:sr(e.image_path),alt:e.name,className:`pos-prod-img`}):(0,q.jsx)(`div`,{className:`pos-prod-img-placeholder`,children:(0,q.jsx)(`i`,{className:`fa-solid fa-box`})}),(0,q.jsxs)(`span`,{className:`pos-prod-price-badge`,children:[new Intl.NumberFormat(`fr-FR`).format(e.selling_price),` XOF`]})]}),(0,q.jsxs)(`div`,{className:`pos-prod-info`,children:[(0,q.jsx)(`div`,{className:`pos-prod-name`,children:e.name}),(0,q.jsx)(`div`,{className:`pos-prod-sku`,children:e.sku})]})]},e.id))})]}),(0,q.jsxs)(`div`,{className:`pos-right-panel`,children:[(0,q.jsxs)(`div`,{className:`pos-cart-header`,children:[(0,q.jsx)(`h3`,{children:`🛒 Panier`}),(0,q.jsx)(`button`,{onClick:l,className:`btn-clear-cart`,children:`Vider`})]}),(0,q.jsx)(`div`,{className:`pos-cart-list`,children:n.length===0?(0,q.jsxs)(`div`,{className:`pos-empty-cart`,children:[(0,q.jsx)(`span`,{className:`cart-empty-icon`,children:`🛒`}),(0,q.jsx)(`p`,{children:`Panier vide. Cliquez sur un produit pour l'ajouter.`})]}):n.map(e=>(0,q.jsxs)(`div`,{className:`pos-cart-item`,children:[e.product.image_path?(0,q.jsx)(`img`,{src:sr(e.product.image_path),alt:e.product.name,style:{width:`44px`,height:`44px`,objectFit:`cover`,borderRadius:`6px`,border:`1px solid var(--border-color)`,flexShrink:0,marginRight:`10px`}}):(0,q.jsx)(`div`,{style:{width:`44px`,height:`44px`,borderRadius:`6px`,background:`var(--bg-input)`,display:`flex`,alignItems:`center`,justify:`center`,color:`var(--text-muted)`,border:`1px dashed var(--border-color)`,flexShrink:0,marginRight:`10px`},children:(0,q.jsx)(`i`,{className:`fa-solid fa-box`,style:{fontSize:`16px`}})}),(0,q.jsxs)(`div`,{className:`pos-item-info`,children:[(0,q.jsx)(`div`,{className:`pos-item-name`,children:e.product.name}),(0,q.jsxs)(`div`,{className:`pos-item-price`,children:[new Intl.NumberFormat(`fr-FR`).format(e.product.selling_price),` XOF`]})]}),(0,q.jsxs)(`div`,{className:`pos-item-controls`,children:[(0,q.jsxs)(`div`,{className:`qty-picker`,children:[(0,q.jsx)(`button`,{onClick:()=>o(e.product.id,e.quantity-1),className:`qty-btn`,children:`-`}),(0,q.jsx)(`input`,{type:`number`,className:`qty-val`,value:e.quantity,onChange:t=>o(e.product.id,t.target.value)}),(0,q.jsx)(`button`,{onClick:()=>o(e.product.id,e.quantity+1),className:`qty-btn`,children:`+`})]}),(0,q.jsx)(`input`,{type:`number`,placeholder:`Remise XOF`,className:`form-control item-discount-input`,value:e.discount===0?``:e.discount,onChange:t=>s(e.product.id,t.target.value)}),(0,q.jsx)(`button`,{onClick:()=>a(e.product.id),className:`btn-remove-item`,children:`🗑️`})]})]},e.product.id))}),(0,q.jsxs)(`div`,{className:`pos-cart-totals`,children:[(0,q.jsxs)(`div`,{className:`totals-row`,children:[(0,q.jsx)(`span`,{children:`Sous-total HT :`}),(0,q.jsxs)(`span`,{children:[new Intl.NumberFormat(`fr-FR`).format(ue.subtotal),` XOF`]})]}),(0,q.jsxs)(`div`,{className:`totals-row`,children:[(0,q.jsx)(`span`,{children:`Remise Globale (XOF) :`}),(0,q.jsx)(`input`,{type:`number`,className:`global-discount-input`,value:r===0?``:r,onChange:e=>c(e.target.value)})]}),(0,q.jsxs)(`div`,{className:`totals-row`,children:[(0,q.jsxs)(`span`,{children:[`TVA `,ue.enableTax?`(${ue.taxRate}%)`:`(Désactivée)`,` :`]}),(0,q.jsxs)(`span`,{children:[new Intl.NumberFormat(`fr-FR`).format(ue.tax),` XOF`]})]}),(0,q.jsxs)(`div`,{className:`totals-row grand-total-row`,children:[(0,q.jsx)(`span`,{children:`Total TTC :`}),(0,q.jsxs)(`span`,{children:[new Intl.NumberFormat(`fr-FR`).format(ue.total),` XOF`]})]}),(0,q.jsx)(`button`,{onClick:()=>{n.length>0&&(P(ue.total.toString()),A(!0))},className:`btn-checkout`,disabled:n.length===0,children:`💵 Valider et Payer`})]})]})]})]}),k&&(0,q.jsx)(`div`,{className:`modal-overlay`,children:(0,q.jsxs)(`div`,{className:`modal-card card`,style:{maxWidth:`440px`},children:[(0,q.jsx)(`h3`,{children:`💵 Enregistrer le Paiement`}),(0,q.jsxs)(`form`,{onSubmit:async e=>{if(e.preventDefault(),ie(null),oe(null),n.length===0){ie(`Le panier est vide.`);return}if(j===`cash`&&parseFloat(N||`0`)<ue.total){ie(`Le montant reçu est inférieur au montant total de la vente.`);return}if(j===`credit`&&!z){ie(`Un client enregistré est requis pour une vente à crédit.`);return}try{let e={cash_session_id:y.id,payment_method:j,customer_id:z?parseInt(z):null,amount_received:j===`credit`?0:parseFloat(N||ue.total),client_name:F||`Client Comptant`,client_phone:L||null,global_discount:r,items:n.map(e=>({product_id:e.product.id,quantity:e.quantity,selling_price:parseFloat(e.product.selling_price),discount:e.discount}))},t=await K.post(`/v1/sales`,e),i=t.data.sale?.id;try{let e=await K.get(`/v1/sales/${i}`);H(e.data)}catch{H(t.data.sale)}oe(`✅ Vente enregistrée avec succès !`),l(),A(!1),P(``),I(``),R(``),B(``),se()}catch(e){ie(e.response?.data?.error||`Erreur lors de la validation de la vente.`)}},children:[(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Méthode de Paiement *`}),(0,q.jsxs)(`select`,{className:`form-control`,value:j,onChange:e=>M(e.target.value),required:!0,children:[(0,q.jsx)(`option`,{value:`cash`,children:`Espèces (Cash)`}),(0,q.jsx)(`option`,{value:`card`,children:`Carte Bancaire`}),(0,q.jsx)(`option`,{value:`credit`,children:`Crédit Client`})]})]}),(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsxs)(`label`,{className:`form-label`,children:[`Client enregistré `,j===`credit`?`*`:`(optionnel)`]}),(0,q.jsxs)(`select`,{className:`form-control`,value:z,onChange:e=>{B(e.target.value);let t=ee.find(t=>t.id===parseInt(e.target.value));t&&(I(t.name),R(t.phone||``))},required:j===`credit`,children:[(0,q.jsx)(`option`,{value:``,children:`-- Client de passage --`}),ee.map(e=>(0,q.jsxs)(`option`,{value:e.id,children:[e.name,` `,e.phone?`(${e.phone})`:``,` — Solde: `,new Intl.NumberFormat(`fr-FR`).format(e.debt_balance),` XOF`]},e.id))]})]}),j===`cash`&&(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsxs)(`label`,{className:`form-label`,style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`},children:[(0,q.jsx)(`span`,{children:`Montant Reçu (XOF) *`}),(0,q.jsxs)(`span`,{className:`text-muted`,style:{fontSize:`12px`},children:[`Total à payer : `,(0,q.jsxs)(`strong`,{style:{color:`var(--color-primary)`},children:[new Intl.NumberFormat(`fr-FR`).format(ue.total),` XOF`]})]})]}),(0,q.jsx)(`input`,{type:`number`,className:`form-control`,value:N,onChange:e=>P(e.target.value),required:!0,placeholder:`Ex: ${ue.total}`}),N!==``&&!isNaN(parseFloat(N))&&(0,q.jsxs)(q.Fragment,{children:[de>0&&(0,q.jsxs)(`div`,{className:`change-due-banner`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-circle-check`,style:{color:`#10b981`,fontSize:`16px`}}),(0,q.jsxs)(`span`,{children:[`Monnaie à rendre : `,(0,q.jsxs)(`strong`,{style:{fontSize:`14px`},children:[new Intl.NumberFormat(`fr-FR`).format(de),` XOF`]})]})]}),de===0&&(0,q.jsxs)(`div`,{className:`change-due-banner`,style:{background:`rgba(16, 185, 129, 0.12)`,color:`#059669`,borderColor:`rgba(16, 185, 129, 0.3)`},children:[(0,q.jsx)(`i`,{className:`fa-solid fa-circle-check`,style:{color:`#10b981`,fontSize:`16px`}}),(0,q.jsxs)(`span`,{children:[`Compte exact : `,(0,q.jsx)(`strong`,{children:`0 XOF à rendre`})]})]}),de<0&&(0,q.jsxs)(`div`,{className:`insufficient-amount-banner`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-circle-xmark`,style:{color:`#e11d48`,fontSize:`16px`}}),(0,q.jsxs)(`span`,{children:[`Le montant est insuffisant : `,(0,q.jsxs)(`strong`,{style:{fontSize:`14px`},children:[`-`,new Intl.NumberFormat(`fr-FR`).format(Math.abs(de)),` XOF`]}),` manquant(s)`]})]})]})]}),(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Nom du Client`}),(0,q.jsx)(`input`,{type:`text`,className:`form-control`,placeholder:`Ex: Client de passage`,value:F,onChange:e=>I(e.target.value)})]}),(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Téléphone Client`}),(0,q.jsx)(`input`,{type:`text`,className:`form-control`,placeholder:`Ex: +221 77 123 45 67`,value:L,onChange:e=>R(e.target.value)})]}),(0,q.jsxs)(`div`,{className:`modal-actions`,children:[(0,q.jsx)(`button`,{type:`button`,onClick:()=>A(!1),className:`btn btn-cancel`,children:`Annuler`}),(0,q.jsx)(`button`,{type:`submit`,className:`btn btn-primary`,disabled:j===`cash`&&(!N||parseFloat(N)<ue.total),children:`Confirmer & Imprimer`})]})]})]})}),V&&(0,q.jsx)(`div`,{className:`modal-overlay`,children:(0,q.jsxs)(`div`,{className:`modal-card card`,style:{maxWidth:`400px`,textAlign:`center`},children:[(0,q.jsx)(`h3`,{className:`no-print`,children:`🧾 Ticket de Caisse`}),(0,q.jsx)(`p`,{className:`no-print`,children:`Vente enregistrée avec succès. Vous pouvez imprimer le reçu ci-dessous.`}),(0,q.jsxs)(`div`,{id:`thermal-receipt`,className:`thermal-receipt-container`,children:[(0,q.jsxs)(`div`,{className:`receipt-header`,children:[(0,q.jsx)(`h2`,{children:e?.company?.name||`ApexPOS`}),(0,q.jsx)(`p`,{children:V.branch?.name||`Boutique Centrale`}),(0,q.jsx)(`p`,{children:V.branch?.address||`Dakar Plateau`}),(0,q.jsxs)(`p`,{children:[`Tél: `,V.branch?.phone||`+221 33 000 00 00`]})]}),(0,q.jsx)(`div`,{className:`receipt-divider`}),(0,q.jsxs)(`div`,{className:`receipt-details`,children:[(0,q.jsxs)(`p`,{children:[(0,q.jsx)(`strong`,{children:`N° Ticket:`}),` `,V.sale_number]}),(0,q.jsxs)(`p`,{children:[(0,q.jsx)(`strong`,{children:`Date:`}),` `,new Date(V.created_at).toLocaleString(`fr-FR`)]}),(0,q.jsxs)(`p`,{children:[(0,q.jsx)(`strong`,{children:`Caissier:`}),` `,V.user?.name||e?.name]}),(0,q.jsxs)(`p`,{children:[(0,q.jsx)(`strong`,{children:`Client:`}),` `,V.client_name]}),V.client_phone&&(0,q.jsxs)(`p`,{children:[(0,q.jsx)(`strong`,{children:`Tél Client:`}),` `,V.client_phone]})]}),(0,q.jsx)(`div`,{className:`receipt-divider`}),(0,q.jsxs)(`table`,{className:`receipt-items-table`,children:[(0,q.jsx)(`thead`,{children:(0,q.jsxs)(`tr`,{children:[(0,q.jsx)(`th`,{children:`Article`}),(0,q.jsx)(`th`,{style:{textAlign:`center`},children:`Qté`}),(0,q.jsx)(`th`,{style:{textAlign:`right`},children:`Total`})]})}),(0,q.jsx)(`tbody`,{children:V.details?.map(e=>(0,q.jsxs)(`tr`,{children:[(0,q.jsxs)(`td`,{children:[e.product?.name,(0,q.jsx)(`br`,{}),(0,q.jsxs)(`span`,{className:`item-unit-price`,children:[e.quantity,` x `,new Intl.NumberFormat(`fr-FR`).format(e.selling_price),parseFloat(e.discount)>0&&` (-${new Intl.NumberFormat(`fr-FR`).format(e.discount)})`]})]}),(0,q.jsx)(`td`,{style:{textAlign:`center`},children:e.quantity}),(0,q.jsx)(`td`,{style:{textAlign:`right`},children:new Intl.NumberFormat(`fr-FR`).format(e.total)})]},e.id))})]}),(0,q.jsx)(`div`,{className:`receipt-divider`}),(0,q.jsxs)(`div`,{className:`receipt-totals`,children:[(0,q.jsxs)(`div`,{className:`receipt-total-row`,children:[(0,q.jsx)(`span`,{children:`Sous-total HT :`}),(0,q.jsxs)(`span`,{children:[new Intl.NumberFormat(`fr-FR`).format(V.subtotal),` XOF`]})]}),parseFloat(V.discount)>0&&(0,q.jsxs)(`div`,{className:`receipt-total-row`,children:[(0,q.jsx)(`span`,{children:`Remise :`}),(0,q.jsxs)(`span`,{children:[`-`,new Intl.NumberFormat(`fr-FR`).format(V.discount),` XOF`]})]}),(0,q.jsxs)(`div`,{className:`receipt-total-row`,children:[(0,q.jsxs)(`span`,{children:[`TVA `,parseFloat(V.tax)>0?``:`(Désactivée)`,` :`]}),(0,q.jsxs)(`span`,{children:[new Intl.NumberFormat(`fr-FR`).format(V.tax),` XOF`]})]}),(0,q.jsxs)(`div`,{className:`receipt-total-row grand-total`,children:[(0,q.jsx)(`span`,{children:`TOTAL TTC :`}),(0,q.jsxs)(`span`,{children:[new Intl.NumberFormat(`fr-FR`).format(V.total),` XOF`]})]})]}),(0,q.jsx)(`div`,{className:`receipt-divider`}),(0,q.jsxs)(`div`,{className:`receipt-payment-info`,children:[(0,q.jsxs)(`p`,{children:[(0,q.jsx)(`strong`,{children:`Mode de Paiement:`}),` `,V.payment_method===`cash`?`Espèces`:V.payment_method===`credit`?`Crédit Client`:`Carte Bancaire`]}),V.payment_method===`credit`&&(0,q.jsxs)(`p`,{children:[(0,q.jsx)(`strong`,{children:`Statut:`}),` `,(0,q.jsx)(`span`,{style:{color:`#dc3545`},children:`Impayé — À crédit`})]}),V.payment_method===`cash`&&(0,q.jsxs)(q.Fragment,{children:[(0,q.jsxs)(`p`,{children:[(0,q.jsx)(`strong`,{children:`Montant Reçu:`}),` `,new Intl.NumberFormat(`fr-FR`).format(V.amount_received),` XOF`]}),(0,q.jsxs)(`p`,{children:[(0,q.jsx)(`strong`,{children:`Rendu:`}),` `,new Intl.NumberFormat(`fr-FR`).format(V.amount_change),` XOF`]})]})]}),(0,q.jsxs)(`div`,{className:`receipt-footer`,children:[(0,q.jsx)(`p`,{children:`Merci de votre confiance !`}),(0,q.jsx)(`p`,{children:`Retour ou échange sous 7 jours avec ce ticket.`}),(0,q.jsx)(`p`,{children:`À bientôt !`})]})]}),(0,q.jsxs)(`div`,{className:`modal-actions no-print`,style:{marginTop:`16px`},children:[(0,q.jsx)(`button`,{type:`button`,onClick:()=>{window.print()},className:`btn btn-primary`,children:`🖨️ Imprimer le reçu`}),(0,q.jsx)(`button`,{type:`button`,onClick:()=>H(null),className:`btn btn-cancel`,children:`Fermer`})]})]})}),(0,q.jsx)(`style`,{children:`
        .pos-container {
          position: relative;
          width: 100%;
          min-height: 100vh;
          padding: 24px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          z-index: 1;
        }

        .pos-layout {
          width: 100%;
          max-width: 1200px;
          padding: 24px;
          margin-top: 100px;
        }

        .pos-grid-columns {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 24px;
          text-align: left;
        }

        /* Grille tactile gauche */
        .pos-search-box {
          margin-bottom: 16px;
        }

        .pos-search-input {
          font-size: 14px;
          padding: 12px;
        }

        .pos-categories-bar {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 8px;
          margin-bottom: 16px;
        }

        .pos-cat-btn {
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          color: var(--text-main);
          padding: 6px 14px;
          font-size: 13px;
          font-weight: 700;
          border-radius: 20px;
          cursor: pointer;
          white-space: nowrap;
          transition: all var(--transition-fast);
        }

        .pos-cat-btn.active, .pos-cat-btn:hover {
          background: var(--color-primary);
          color: #FFF;
          border-color: var(--color-primary);
        }

        .pos-products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 12px;
          max-height: 500px;
          overflow-y: auto;
          padding-right: 8px;
        }

        .pos-product-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          padding: 8px;
          cursor: pointer;
          position: relative;
          display: flex;
          flex-direction: column;
          height: 155px;
          transition: all var(--transition-fast);
          overflow: hidden;
        }

        .pos-product-card:hover {
          border-color: var(--color-primary);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .pos-prod-img-box {
          position: relative;
          width: 100%;
          height: 85px;
          border-radius: 6px;
          overflow: hidden;
          background: var(--bg-input);
        }

        .pos-prod-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .pos-prod-img-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          font-size: 24px;
        }

        .pos-prod-price-badge {
          position: absolute;
          top: 4px;
          right: 4px;
          background: rgba(16, 185, 129, 0.95);
          color: #fff;
          font-size: 11px;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.15);
        }

        .pos-prod-info {
          margin-top: 6px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex: 1;
        }

        .pos-prod-name {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-main);
          line-height: 1.2;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .pos-prod-sku {
          font-size: 10px;
          color: var(--text-muted);
          margin-top: 2px;
        }

        /* Panier droit */
        .pos-right-panel {
          border-left: 1px solid var(--border-color);
          padding-left: 24px;
          display: flex;
          flex-direction: column;
          height: 600px;
          justify-content: space-between;
        }

        .pos-cart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 12px;
        }

        .btn-clear-cart {
          background: transparent;
          border: none;
          color: var(--color-error);
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }

        .pos-cart-list {
          flex: 1;
          overflow-y: auto;
          margin: 16px 0;
          padding-right: 8px;
        }

        .pos-empty-cart {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: var(--text-muted);
        }

        .cart-empty-icon {
          font-size: 32px;
          margin-bottom: 8px;
        }

        .pos-cart-item {
          display: flex;
          flex-direction: column;
          padding: 12px;
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          margin-bottom: 8px;
          gap: 8px;
        }

        .pos-item-info {
          display: flex;
          justify-content: space-between;
        }

        .pos-item-name {
          font-weight: 700;
          font-size: 13px;
        }

        .pos-item-price {
          font-size: 13px;
          font-weight: 800;
        }

        .pos-item-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .qty-picker {
          display: flex;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          overflow: hidden;
        }

        .qty-btn {
          background: transparent;
          border: none;
          color: var(--text-main);
          width: 24px;
          height: 24px;
          cursor: pointer;
        }

        .qty-val {
          width: 32px;
          border: none;
          border-left: 1px solid var(--border-color);
          border-right: 1px solid var(--border-color);
          text-align: center;
          font-size: 12px;
          background: transparent;
          color: var(--text-main);
        }

        .item-discount-input {
          font-size: 11px;
          padding: 4px 6px;
          width: 80px;
          height: 26px;
        }

        .btn-remove-item {
          background: transparent;
          border: none;
          cursor: pointer;
        }

        /* Totaux */
        .pos-cart-totals {
          border-top: 1px solid var(--border-color);
          padding-top: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .totals-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          align-items: center;
        }

        .global-discount-input {
          width: 80px;
          text-align: right;
          font-size: 12px;
          padding: 4px;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          background: var(--bg-input);
          color: var(--text-main);
        }

        .grand-total-row {
          font-size: 18px;
          font-weight: 800;
          color: var(--color-success);
          border-top: 1px dashed var(--border-color);
          padding-top: 8px;
        }

        .btn-checkout {
          width: 100%;
          padding: 12px;
          font-family: var(--font-title);
          font-size: 14px;
          font-weight: 800;
          background: var(--color-success);
          color: #FFF;
          border: none;
          border-radius: var(--border-radius-sm);
          cursor: pointer;
          transition: all var(--transition-fast);
          margin-top: 8px;
        }

        .btn-checkout:hover {
          opacity: 0.9;
        }

        .change-due-banner {
          background: rgba(16, 185, 129, 0.12);
          color: #059669;
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 6px;
          padding: 10px 14px;
          margin-top: 10px;
          font-size: 13px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .insufficient-amount-banner {
          background: rgba(225, 29, 72, 0.12);
          color: #e11d48;
          border: 1px solid rgba(225, 29, 72, 0.3);
          border-radius: 6px;
          padding: 10px 14px;
          margin-top: 10px;
          font-size: 13px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .geniuspay-pending-banner {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 165, 0, 0.1);
          color: #e68a00;
          border: 1px solid rgba(255, 165, 0, 0.3);
          border-radius: 6px;
          padding: 14px;
          margin-top: 12px;
          font-size: 13px;
          font-weight: 600;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 165, 0, 0.3);
          border-top-color: #e68a00;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Styles Reçu Thermique */
        .thermal-receipt-container {
          background: #FFF;
          color: #000;
          padding: 16px;
          font-family: 'Courier New', Courier, monospace;
          font-size: 12px;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          max-height: 350px;
          overflow-y: auto;
          text-align: left;
        }

        .receipt-header {
          text-align: center;
          margin-bottom: 8px;
        }

        .receipt-header h2 {
          font-size: 16px;
          margin: 0 0 4px 0;
          color: #000;
        }

        .receipt-header p {
          margin: 2px 0;
          font-size: 11px;
          color: #000;
        }

        .receipt-divider {
          border-top: 1px dashed #000;
          margin: 8px 0;
        }

        .receipt-details p {
          margin: 4px 0;
          font-size: 11px;
          color: #000;
        }

        .receipt-items-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 11px;
          margin: 8px 0;
          color: #000;
        }

        .receipt-items-table th, .receipt-items-table td {
          padding: 4px 0;
          vertical-align: top;
          color: #000;
        }

        .receipt-items-table th {
          border-bottom: 1px solid #000;
          text-align: left;
        }

        .item-unit-price {
          font-size: 9px;
          color: #555;
        }

        .receipt-totals {
          display: flex;
          flex-direction: column;
          gap: 4px;
          color: #000;
        }

        .receipt-total-row {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: #000;
        }

        .receipt-total-row.grand-total {
          font-weight: bold;
          font-size: 13px;
          border-top: 1px solid #000;
          padding-top: 4px;
          color: #000;
        }

        .receipt-payment-info p {
          margin: 4px 0;
          font-size: 11px;
          color: #000;
        }

        .receipt-footer {
          text-align: center;
          margin-top: 12px;
          font-size: 11px;
          color: #000;
        }

        /* L'impression utilise désormais les styles d'impression globaux de index.css */

        /* ══════════════════════════════════════
           RESPONSIVE — TABLETTE (≤ 1024px)
        ══════════════════════════════════════ */
        @media (max-width: 1024px) {
          .pos-layout {
            padding: 16px;
            margin-top: 80px;
          }
          .pos-grid-columns {
            grid-template-columns: 1.2fr 1fr;
            gap: 16px;
          }
          .pos-products-grid {
            grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
          }
        }

        /* ══════════════════════════════════════
           RESPONSIVE — MOBILE (≤ 768px)
        ══════════════════════════════════════ */
        @media (max-width: 768px) {
          .pos-container {
            padding: 0;
          }

          .pos-layout {
            padding: 12px;
            margin-top: 68px;
            max-width: 100%;
          }

          /* Passe en colonne unique sur mobile */
          .pos-grid-columns {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          /* Barre de recherche pleine largeur */
          .pos-search-input {
            font-size: 15px;
            padding: 12px 14px;
          }

          /* Catégories scroll horizontal */
          .pos-categories-bar {
            flex-wrap: nowrap;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            padding-bottom: 6px;
          }
          .pos-categories-bar::-webkit-scrollbar { display: none; }

          .pos-cat-btn {
            padding: 7px 14px;
            font-size: 13px;
            flex-shrink: 0;
          }

          /* Grille produits — 2 colonnes sur mobile */
          .pos-products-grid {
            grid-template-columns: repeat(2, 1fr);
            max-height: 320px;
            gap: 10px;
            padding-right: 0;
          }

          .pos-product-card {
            height: 100px;
            padding: 12px;
          }

          .pos-prod-price { font-size: 12px; }
          .pos-prod-name  { font-size: 12px; }
          .pos-prod-sku   { font-size: 10px; }

          /* Panier — sous les produits, hauteur auto */
          .pos-right-panel {
            border-left: none;
            border-top: 1px solid var(--border-color);
            padding-left: 0;
            padding-top: 16px;
            height: auto;
            min-height: 280px;
          }

          .pos-cart-list {
            max-height: 220px;
            margin: 12px 0;
          }

          /* Totaux compacts */
          .grand-total-row { font-size: 15px; }

          .btn-checkout {
            padding: 14px;
            font-size: 15px;
          }

          /* Modale plein écran sur mobile */
          .modal-card {
            max-width: 100% !important;
            width: 95vw !important;
            margin: 8px;
            max-height: 90vh;
            overflow-y: auto;
          }
          .modal-overlay {
            align-items: flex-end;
          }
        }

        /* ══════════════════════════════════════
           RESPONSIVE — TRÈS PETIT (≤ 400px)
        ══════════════════════════════════════ */
        @media (max-width: 400px) {
          .pos-products-grid {
            grid-template-columns: repeat(2, 1fr);
            max-height: 280px;
          }
          .pos-product-card { height: 90px; padding: 10px; }
          .pos-cat-btn { padding: 6px 10px; font-size: 12px; }
        }
      `})]}):(0,q.jsx)(`div`,{className:`pos-container`,children:(0,q.jsxs)(`div`,{className:`alert-card card`,style:{borderColor:`var(--color-error)`},children:[(0,q.jsx)(`span`,{className:`alert-icon`,children:`⚠️`}),(0,q.jsx)(`h3`,{children:`Session de Caisse Requise`}),(0,q.jsxs)(`p`,{children:[`Vous devez ouvrir une session de caisse dans l'onglet `,(0,q.jsx)(`strong`,{children:`💸 Caisses`}),` avant de pouvoir enregistrer des ventes.`]})]})}):(0,q.jsx)(`div`,{className:`pos-container`,children:(0,q.jsxs)(`div`,{className:`alert-card card`,children:[(0,q.jsx)(`span`,{className:`alert-icon`,children:`🔒`}),(0,q.jsx)(`h3`,{children:`Accès Réservé`}),(0,q.jsx)(`p`,{children:`Vous devez vous connecter à une session pour accéder au Terminal de Vente.`})]})})},Cr=()=>{let{token:e,user:t}=rr(),[n,r]=(0,v.useState)([]),[i,a]=(0,v.useState)(!1),[o,s]=(0,v.useState)(null),[c,l]=(0,v.useState)(1),[u,d]=(0,v.useState)(1),[f,p]=(0,v.useState)(``),[m,h]=(0,v.useState)(``),[g,_]=(0,v.useState)(``),[y,b]=(0,v.useState)(``),[x,S]=(0,v.useState)(``),[C,w]=(0,v.useState)(``),[T,E]=(0,v.useState)(``),[D,O]=(0,v.useState)(``),[k,A]=(0,v.useState)([]),[j,M]=(0,v.useState)([]),[N,P]=(0,v.useState)([]),[F,I]=(0,v.useState)(null);(0,v.useEffect)(()=>{if(!e)return;let n=(t?.role?.slug||t?.role?.name||t?.role)===`super-admin`;n&&K.get(`/v1/admin/companies`).then(e=>A(e.data.data||e.data||[])).catch(()=>{}),K.get(`/v1/branches`).then(e=>M(e.data||[])).catch(()=>{}),n?K.get(`/v1/admin/users`).then(e=>P(e.data.data||e.data||[])).catch(()=>{}):K.get(`/v1/users`).then(e=>P(e.data||[])).catch(()=>{})},[e,t]);let L=async()=>{if(e){a(!0),s(null);try{let e=await K.get(`/v1/audit-logs`,{params:{page:c,action:f||void 0,auditable_type:m||void 0,company_id:g||void 0,branch_id:y||void 0,user_id:x||void 0,date_start:C||void 0,date_end:T||void 0,search:D||void 0}});r(e.data.data||[]),d(e.data.last_page||1)}catch(e){s(e.response?.data?.error||`Erreur lors du chargement des journaux d'audit.`)}finally{a(!1)}}};(0,v.useEffect)(()=>{L()},[e,c,f,m,g,y,x,C,T,D]);let R=e=>{if(!e)return`Inconnu`;let t=e.split(`\\`),n=t[t.length-1];switch(n){case`Product`:return`Produit`;case`Purchase`:return`Achat`;case`StockTransfer`:return`Transfert de Stock`;case`Sale`:return`Vente (POS)`;case`CashSession`:return`Session de Caisse`;case`CashSessionTransaction`:return`Mouvement de Caisse`;case`Customer`:return`Client`;case`Company`:return`Entreprise`;case`Branch`:return`Point de Vente`;case`User`:return`Utilisateur / Connexion`;case`Role`:return`Rôle & Permission`;case`Category`:return`Catégorie`;case`Supplier`:return`Fournisseur`;case`StockMovement`:return`Ajustement de Stock`;default:return n}},ee=e=>{switch(e){case`created`:return(0,q.jsx)(`span`,{className:`badge badge-success`,children:`Création`});case`updated`:return(0,q.jsx)(`span`,{className:`badge badge-info`,children:`Modification`});case`deleted`:return(0,q.jsx)(`span`,{className:`badge badge-error`,children:`Suppression`});case`login_success`:case`login_pin_success`:return(0,q.jsx)(`span`,{className:`badge badge-success`,style:{background:`rgba(16, 185, 129, 0.2)`,color:`#10b981`},children:`🔑 Connexion`});case`login_failed`:case`login_pin_failed`:return(0,q.jsx)(`span`,{className:`badge badge-error`,style:{background:`rgba(239, 68, 68, 0.2)`,color:`#ef4444`},children:`🚫 Échec Connexion`});case`logout`:return(0,q.jsx)(`span`,{className:`badge badge-info`,style:{background:`rgba(59, 130, 246, 0.2)`,color:`#3b82f6`},children:`🚪 Déconnexion`});default:return(0,q.jsx)(`span`,{className:`badge`,children:e})}};return(0,q.jsxs)(`div`,{className:`audit-container`,children:[(0,q.jsx)(`div`,{className:`decorator-sphere sphere-1`}),(0,q.jsx)(`div`,{className:`decorator-sphere sphere-2`}),(0,q.jsxs)(`div`,{className:`audit-layout card`,children:[(0,q.jsxs)(`h2`,{className:`section-title`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-shield-halved me-2 text-primary`}),` Journal d'Audit & Sécurité`]}),(0,q.jsx)(`p`,{className:`section-subtitle`,children:`Consignez et inspectez l'historique complet des actions d'écritures sensibles effectuées sur la plateforme.`}),o&&(0,q.jsxs)(`div`,{className:`error-banner`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-circle-exclamation me-1`}),` `,o]}),(0,q.jsxs)(`div`,{className:`filter-bar no-print`,style:{display:`flex`,flexDirection:`column`,gap:`16px`},children:[(0,q.jsxs)(`div`,{style:{display:`flex`,gap:`16px`,flexWrap:`wrap`},children:[(0,q.jsxs)(`div`,{className:`filter-item`,style:{flex:`2 1 300px`},children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Recherche globale (IP, Caissier, Action...)`}),(0,q.jsx)(`input`,{type:`text`,className:`form-control`,placeholder:`Ex: 192.168, gérant, login...`,value:D,onChange:e=>{O(e.target.value),l(1)}})]}),(0,q.jsxs)(`div`,{className:`filter-item`,style:{flex:`1 1 150px`},children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Date de début`}),(0,q.jsx)(`input`,{type:`date`,className:`form-control`,value:C,onChange:e=>{w(e.target.value),l(1)}})]}),(0,q.jsxs)(`div`,{className:`filter-item`,style:{flex:`1 1 150px`},children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Date de fin`}),(0,q.jsx)(`input`,{type:`date`,className:`form-control`,value:T,onChange:e=>{E(e.target.value),l(1)}})]})]}),(0,q.jsxs)(`div`,{style:{display:`flex`,gap:`16px`,flexWrap:`wrap`,alignItems:`flex-end`},children:[(t?.role?.slug===`super-admin`||t?.role===`super-admin`)&&(0,q.jsxs)(`div`,{className:`filter-item`,style:{flex:`1 1 200px`},children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Entreprise (Multi-tenant)`}),(0,q.jsxs)(`select`,{className:`form-control`,value:g,onChange:e=>{_(e.target.value),l(1)},children:[(0,q.jsx)(`option`,{value:``,children:`Toutes les entreprises`}),k.map(e=>(0,q.jsx)(`option`,{value:e.id,children:e.name},e.id))]})]}),(0,q.jsxs)(`div`,{className:`filter-item`,style:{flex:`1 1 200px`},children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Point de vente (Boutique)`}),(0,q.jsxs)(`select`,{className:`form-control`,value:y,onChange:e=>{b(e.target.value),l(1)},children:[(0,q.jsx)(`option`,{value:``,children:`Toutes les boutiques`}),j.map(e=>(0,q.jsx)(`option`,{value:e.id,children:e.name},e.id))]})]}),(0,q.jsxs)(`div`,{className:`filter-item`,style:{flex:`1 1 200px`},children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Opérateur / Utilisateur`}),(0,q.jsxs)(`select`,{className:`form-control`,value:x,onChange:e=>{S(e.target.value),l(1)},children:[(0,q.jsx)(`option`,{value:``,children:`Tous les utilisateurs`}),N.map(e=>(0,q.jsxs)(`option`,{value:e.id,children:[e.name,` (`,e.email,`)`]},e.id))]})]}),(0,q.jsxs)(`div`,{className:`filter-item`,style:{flex:`1 1 150px`},children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Action`}),(0,q.jsxs)(`select`,{className:`form-control`,value:f,onChange:e=>{p(e.target.value),l(1)},children:[(0,q.jsx)(`option`,{value:``,children:`Toutes les actions`}),(0,q.jsx)(`option`,{value:`created`,children:`Création`}),(0,q.jsx)(`option`,{value:`updated`,children:`Modification`}),(0,q.jsx)(`option`,{value:`deleted`,children:`Suppression`}),(0,q.jsx)(`option`,{value:`login_success`,children:`Connexion Réussie`}),(0,q.jsx)(`option`,{value:`login_failed`,children:`Échec Connexion`}),(0,q.jsx)(`option`,{value:`logout`,children:`Déconnexion`})]})]}),(0,q.jsxs)(`div`,{className:`filter-item`,style:{flex:`1 1 150px`},children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Type d'entité`}),(0,q.jsxs)(`select`,{className:`form-control`,value:m,onChange:e=>{h(e.target.value),l(1)},children:[(0,q.jsx)(`option`,{value:``,children:`Tous les types`}),(0,q.jsx)(`option`,{value:`Product`,children:`Produits`}),(0,q.jsx)(`option`,{value:`Purchase`,children:`Achats`}),(0,q.jsx)(`option`,{value:`StockTransfer`,children:`Transferts de stocks`}),(0,q.jsx)(`option`,{value:`Sale`,children:`Ventes / POS`}),(0,q.jsx)(`option`,{value:`CashSession`,children:`Sessions de Caisse`}),(0,q.jsx)(`option`,{value:`User`,children:`Utilisateurs`}),(0,q.jsx)(`option`,{value:`Category`,children:`Catégories`}),(0,q.jsx)(`option`,{value:`Supplier`,children:`Fournisseurs`})]})]}),(0,q.jsx)(`div`,{style:{marginLeft:`auto`},children:(0,q.jsxs)(`button`,{type:`button`,onClick:()=>window.print(),className:`btn btn-primary`,style:{height:`42px`,display:`inline-flex`,alignItems:`center`,gap:`8px`},children:[(0,q.jsx)(`i`,{className:`fa-solid fa-print`}),` Exporter PDF`]})})]})]}),i?(0,q.jsx)(`div`,{className:`empty-state`,children:`Chargement des traces d'audit...`}):n.length===0?(0,q.jsx)(`div`,{className:`empty-state`,children:`Aucun log d'audit ne correspond aux filtres.`}):(0,q.jsx)(`div`,{className:`table-responsive`,children:(0,q.jsxs)(`table`,{className:`app-table`,children:[(0,q.jsx)(`thead`,{children:(0,q.jsxs)(`tr`,{children:[(0,q.jsx)(`th`,{children:`Date & Heure`}),(0,q.jsx)(`th`,{children:`Utilisateur`}),(0,q.jsx)(`th`,{children:`Type d'objet`}),(0,q.jsx)(`th`,{children:`ID`}),(0,q.jsx)(`th`,{children:`Action`}),(0,q.jsx)(`th`,{style:{textAlign:`right`},children:`Actions`})]})}),(0,q.jsx)(`tbody`,{children:n.map(e=>(0,q.jsxs)(`tr`,{className:`hover-row`,children:[(0,q.jsx)(`td`,{children:new Date(e.created_at).toLocaleString(`fr-FR`)}),(0,q.jsxs)(`td`,{children:[(0,q.jsx)(`strong`,{children:e.user?.name||`Système`}),(0,q.jsx)(`br`,{}),(0,q.jsx)(`span`,{style:{fontSize:`11px`,color:`var(--text-muted)`},children:e.user?.email||`automatique`})]}),(0,q.jsx)(`td`,{children:R(e.auditable_type)}),(0,q.jsx)(`td`,{children:(0,q.jsxs)(`code`,{children:[`#`,e.auditable_id]})}),(0,q.jsx)(`td`,{children:ee(e.action)}),(0,q.jsx)(`td`,{style:{textAlign:`right`},children:(0,q.jsxs)(`button`,{onClick:()=>I(e),className:`btn-details`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-eye me-1`}),` Inspecter`]})})]},e.id))})]})}),u>1&&(0,q.jsxs)(`div`,{className:`pagination-bar`,children:[(0,q.jsx)(`button`,{disabled:c<=1,onClick:()=>l(c-1),className:`btn btn-secondary`,children:`Précédent`}),(0,q.jsxs)(`span`,{children:[`Page `,c,` sur `,u]}),(0,q.jsx)(`button`,{disabled:c>=u,onClick:()=>l(c+1),className:`btn btn-secondary`,children:`Suivant`})]})]}),F&&(0,q.jsx)(`div`,{className:`modal-overlay`,children:(0,q.jsxs)(`div`,{className:`modal-card card`,style:{maxWidth:`650px`,textAlign:`left`},children:[(0,q.jsxs)(`h3`,{children:[`🔍 Inspection de l'Événement #`,F.id]}),(0,q.jsxs)(`div`,{className:`details-grid`,children:[(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`strong`,{children:`Opérateur :`}),` `,F.user?.name||`Système`]}),(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`strong`,{children:`Adresse IP :`}),` `,(0,q.jsx)(`code`,{children:F.ip_address||`Inconnue`})]}),(0,q.jsxs)(`div`,{style:{gridColumn:`span 2`},children:[(0,q.jsx)(`strong`,{children:`Navigateur / Agent :`}),` `,(0,q.jsx)(`span`,{style:{fontSize:`11px`,color:`var(--text-muted)`},children:F.user_agent||`Inconnu`})]})]}),(0,q.jsxs)(`div`,{className:`values-comparison`,children:[F.action===`created`&&F.new_values&&(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`h4`,{style:{color:`var(--color-success)`},children:`Données insérées`}),(0,q.jsx)(`pre`,{className:`json-block`,children:JSON.stringify(F.new_values,null,2)})]}),F.action===`deleted`&&F.old_values&&(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`h4`,{style:{color:`var(--color-error)`},children:`Données supprimées`}),(0,q.jsx)(`pre`,{className:`json-block`,children:JSON.stringify(F.old_values,null,2)})]}),F.action===`updated`&&(0,q.jsxs)(`div`,{className:`diff-panels`,children:[(0,q.jsxs)(`div`,{className:`diff-panel`,children:[(0,q.jsx)(`h4`,{style:{color:`var(--text-muted)`},children:`Avant (Ancien)`}),(0,q.jsx)(`pre`,{className:`json-block`,children:JSON.stringify(F.old_values,null,2)})]}),(0,q.jsxs)(`div`,{className:`diff-panel`,children:[(0,q.jsx)(`h4`,{style:{color:`var(--color-info)`},children:`Après (Nouveau)`}),(0,q.jsx)(`pre`,{className:`json-block`,children:JSON.stringify(F.new_values,null,2)})]})]})]}),(0,q.jsx)(`div`,{className:`modal-actions`,children:(0,q.jsx)(`button`,{type:`button`,onClick:()=>I(null),className:`btn btn-primary`,children:`Fermer l'inspection`})})]})}),(0,q.jsx)(`style`,{children:`
        .audit-container {
          position: relative;
          width: 100%;
          min-height: 100vh;
          padding: 24px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          z-index: 1;
        }

        .audit-layout {
          width: 100%;
          max-width: 1200px;
          padding: 24px;
          margin-top: 100px;
          text-align: left;
        }

        .filter-bar {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
          background: rgba(255, 255, 255, 0.05);
          padding: 16px;
          border-radius: var(--border-radius-sm);
          border: 1px solid var(--border-color);
        }

        .filter-item {
          flex: 1;
        }

        .table-responsive {
          width: 100%;
          overflow-x: auto;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .app-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 13.5px;
        }

        .app-table th {
          background: rgba(255, 255, 255, 0.02);
          color: var(--text-main);
          font-weight: 700;
          padding: 14px 18px;
          border-bottom: 2px solid var(--border-color);
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: 0.5px;
        }

        .app-table td {
          padding: 14px 18px;
          border-bottom: 1px solid var(--border-color);
          color: var(--text-main);
          vertical-align: middle;
        }

        .hover-row {
          transition: background-color var(--transition-fast) ease;
        }

        .hover-row:hover {
          background: rgba(255, 255, 255, 0.02) !important;
        }

        .btn-details {
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.2);
          color: #3b82f6;
          padding: 6px 14px;
          font-size: 12px;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          transition: all var(--transition-fast);
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .btn-details:hover {
          background: #3b82f6;
          color: #ffffff;
          border-color: #3b82f6;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.4);
        }

        .badge {
          display: inline-block;
          padding: 4px 8px;
          font-size: 11px;
          font-weight: 700;
          border-radius: 6px;
        }

        .badge-success {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .badge-info {
          background: rgba(59, 130, 246, 0.15);
          color: #3b82f6;
          border: 1px solid rgba(59, 130, 246, 0.2);
        }

        .badge-error {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          background: rgba(255, 255, 255, 0.02);
          padding: 16px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          margin-bottom: 20px;
          font-size: 13.5px;
        }

        .values-comparison {
          margin-top: 20px;
        }

        .json-block {
          background: #111827 !important;
          color: #34d399 !important;
          padding: 14px;
          border-radius: 8px;
          font-family: 'Fira Code', Consolas, Monaco, monospace;
          font-size: 12px;
          max-height: 250px;
          overflow-y: auto;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .diff-panels {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .diff-panel {
          flex: 1;
        }

        .pagination-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 24px;
          padding: 12px 18px;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 8px;
        }

        @media print {
          body {
            background: #ffffff !important;
            color: #000000 !important;
          }
          .app-main-navbar,
          .filter-bar,
          .pagination-bar,
          .decorator-sphere,
          .js-bubbles-container,
          .btn-details {
            display: none !important;
          }
          .audit-layout {
            margin-top: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            width: 100% !important;
            max-width: none !important;
          }
          .table-responsive {
            border: none !important;
            box-shadow: none !important;
          }
          .app-table th {
            border-bottom: 2px solid #000000 !important;
            color: #000000 !important;
          }
          .app-table td {
            border-bottom: 1px solid #e2e8f0 !important;
            color: #000000 !important;
          }
        }
      `})]})},wr=()=>{let{token:e}=rr(),[t,n]=(0,v.useState)(null),[r,i]=(0,v.useState)(!1),[a,o]=(0,v.useState)(null),[s,c]=(0,v.useState)(()=>{let e=new Date;return e.setDate(1),e.toISOString().split(`T`)[0]}),[l,u]=(0,v.useState)(()=>new Date().toISOString().split(`T`)[0]),d=async()=>{if(e){i(!0),o(null);try{let e=await K.get(`/v1/reports/summary`,{params:{start_date:s,end_date:l}});n(e.data)}catch(e){o(e.response?.data?.error||`Erreur lors du calcul du rapport analytique.`)}finally{i(!1)}}};if((0,v.useEffect)(()=>{d()},[e,s,l]),!t&&r)return(0,q.jsx)(`div`,{className:`reports-container`,children:(0,q.jsx)(`div`,{className:`empty-state`,children:`Génération des rapports...`})});let f=t?.sales||{count:0,total_ttc:0,total_ht:0,tax:0,discount:0,breakdown:{cash:0,card:0}},p=t?.margins||{revenue_ht:0,cogs:0,margin:0,margin_percentage:0},m=t?.aged_balance||{days_0_30:0,days_31_60:0,days_61_90:0,days_90_plus:0,total_debt:0},h=t?.stock_valuation||{value_at_cost:0,value_at_selling:0,potential_profit:0},g=t?.top_products||[];return(0,q.jsxs)(`div`,{className:`reports-container`,children:[(0,q.jsx)(`div`,{className:`decorator-sphere sphere-1`}),(0,q.jsx)(`div`,{className:`decorator-sphere sphere-2`}),(0,q.jsxs)(`div`,{className:`reports-layout card`,children:[(0,q.jsxs)(`div`,{className:`reports-header no-print`,children:[(0,q.jsxs)(`div`,{children:[(0,q.jsxs)(`h2`,{className:`section-title`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-chart-line me-2 text-primary`}),` Rapports de Clôture & Marges`]}),(0,q.jsx)(`p`,{className:`section-subtitle`,children:`Analysez les ventes, la TVA collectée, les marges sur PAMP et la balance âgée.`})]}),(0,q.jsx)(`div`,{className:`actions-header`,children:(0,q.jsxs)(`button`,{onClick:()=>window.print(),className:`btn btn-primary`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-print me-1`}),` Exporter le Rapport (PDF)`]})})]}),(0,q.jsxs)(`div`,{className:`print-only-header`,children:[(0,q.jsx)(`h1`,{children:`APEXPOS - RAPPORT DE CLÔTURE ET FINANCIER`}),(0,q.jsxs)(`p`,{children:[`Période du : `,(0,q.jsx)(`strong`,{children:new Date(s).toLocaleDateString(`fr-FR`)}),` au `,(0,q.jsx)(`strong`,{children:new Date(l).toLocaleDateString(`fr-FR`)})]}),(0,q.jsx)(`hr`,{})]}),a&&(0,q.jsxs)(`div`,{className:`error-banner`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-circle-exclamation me-1`}),` `,a]}),(0,q.jsxs)(`div`,{className:`filter-bar no-print`,children:[(0,q.jsxs)(`div`,{className:`filter-item`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Date de début`}),(0,q.jsx)(`input`,{type:`date`,className:`form-control`,value:s,onChange:e=>c(e.target.value)})]}),(0,q.jsxs)(`div`,{className:`filter-item`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Date de fin`}),(0,q.jsx)(`input`,{type:`date`,className:`form-control`,value:l,onChange:e=>u(e.target.value)})]}),(0,q.jsx)(`div`,{className:`filter-item btn-refresh-item`,children:(0,q.jsxs)(`button`,{onClick:d,className:`btn btn-secondary`,style:{width:`100%`},children:[(0,q.jsx)(`i`,{className:`fa-solid fa-arrows-rotate me-1`}),` Rafraîchir`]})})]}),(0,q.jsxs)(`div`,{className:`kpi-grid`,children:[(0,q.jsxs)(`div`,{className:`kpi-card`,children:[(0,q.jsx)(`span`,{className:`kpi-icon`,children:(0,q.jsx)(`i`,{className:`fa-solid fa-coins text-success`})}),(0,q.jsxs)(`div`,{className:`kpi-info`,children:[(0,q.jsx)(`span`,{className:`kpi-label`,children:`Volume Ventes TTC`}),(0,q.jsxs)(`span`,{className:`kpi-val`,children:[new Intl.NumberFormat(`fr-FR`).format(f.total_ttc),` XOF`]}),(0,q.jsxs)(`span`,{className:`kpi-subtext`,children:[f.count,` transaction(s) effectuée(s)`]})]})]}),(0,q.jsxs)(`div`,{className:`kpi-card`,children:[(0,q.jsx)(`span`,{className:`kpi-icon`,children:(0,q.jsx)(`i`,{className:`fa-solid fa-landmark text-info`})}),(0,q.jsxs)(`div`,{className:`kpi-info`,children:[(0,q.jsx)(`span`,{className:`kpi-label`,children:`TVA Collectée (18%)`}),(0,q.jsxs)(`span`,{className:`kpi-val`,children:[new Intl.NumberFormat(`fr-FR`).format(f.tax),` XOF`]}),(0,q.jsx)(`span`,{className:`kpi-subtext`,children:`Basée sur le montant net HT`})]})]}),(0,q.jsxs)(`div`,{className:`kpi-card`,children:[(0,q.jsx)(`span`,{className:`kpi-icon`,children:(0,q.jsx)(`i`,{className:`fa-solid fa-chart-line text-warning`})}),(0,q.jsxs)(`div`,{className:`kpi-info`,children:[(0,q.jsx)(`span`,{className:`kpi-label`,children:`Marge Brute`}),(0,q.jsxs)(`span`,{className:`kpi-val`,children:[new Intl.NumberFormat(`fr-FR`).format(p.margin),` XOF`]}),(0,q.jsxs)(`span`,{className:`kpi-subtext`,children:[`Taux moyen de `,p.margin_percentage,`% sur PAMP`]})]})]}),(0,q.jsxs)(`div`,{className:`kpi-card`,children:[(0,q.jsx)(`span`,{className:`kpi-icon`,children:(0,q.jsx)(`i`,{className:`fa-solid fa-box text-primary`})}),(0,q.jsxs)(`div`,{className:`kpi-info`,children:[(0,q.jsx)(`span`,{className:`kpi-label`,children:`Valeur du Stock (Achat)`}),(0,q.jsxs)(`span`,{className:`kpi-val`,children:[new Intl.NumberFormat(`fr-FR`).format(h.value_at_cost),` XOF`]}),(0,q.jsxs)(`span`,{className:`kpi-subtext`,children:[`Valeur de vente potentielle : `,new Intl.NumberFormat(`fr-FR`).format(h.value_at_selling),` XOF`]})]})]})]}),(0,q.jsxs)(`div`,{className:`report-sections-grid`,children:[(0,q.jsxs)(`div`,{className:`card-panel`,children:[(0,q.jsxs)(`h3`,{children:[(0,q.jsx)(`i`,{className:`fa-solid fa-credit-card me-2 text-primary`}),` Répartition des Règlements`]}),(0,q.jsxs)(`div`,{className:`payment-breakdown-list`,children:[(0,q.jsxs)(`div`,{className:`payment-item`,children:[(0,q.jsxs)(`div`,{className:`payment-label-row`,children:[(0,q.jsxs)(`span`,{children:[(0,q.jsx)(`i`,{className:`fa-solid fa-money-bill-1 me-1 text-success`}),` Espèces`]}),(0,q.jsxs)(`span`,{children:[new Intl.NumberFormat(`fr-FR`).format(f.breakdown.cash),` XOF`]})]}),(0,q.jsx)(`div`,{className:`progress-bar-bg`,children:(0,q.jsx)(`div`,{className:`progress-bar-fill progress-cash`,style:{width:`${f.total_ttc>0?f.breakdown.cash/f.total_ttc*100:0}%`}})})]}),(0,q.jsxs)(`div`,{className:`payment-item`,children:[(0,q.jsxs)(`div`,{className:`payment-label-row`,children:[(0,q.jsxs)(`span`,{children:[(0,q.jsx)(`i`,{className:`fa-solid fa-credit-card me-1 text-warning`}),` Carte Bancaire`]}),(0,q.jsxs)(`span`,{children:[new Intl.NumberFormat(`fr-FR`).format(f.breakdown.card),` XOF`]})]}),(0,q.jsx)(`div`,{className:`progress-bar-bg`,children:(0,q.jsx)(`div`,{className:`progress-bar-fill progress-card`,style:{width:`${f.total_ttc>0?f.breakdown.card/f.total_ttc*100:0}%`}})})]})]})]}),(0,q.jsxs)(`div`,{className:`card-panel`,children:[(0,q.jsxs)(`h3`,{children:[(0,q.jsx)(`i`,{className:`fa-solid fa-trophy me-2 text-warning`}),` Top 5 Articles les plus vendus`]}),g.length===0?(0,q.jsx)(`div`,{className:`empty-state`,style:{padding:`24px 0`},children:`Aucune vente enregistrée sur cette période.`}):(0,q.jsxs)(`table`,{className:`top-products-table`,children:[(0,q.jsx)(`thead`,{children:(0,q.jsxs)(`tr`,{children:[(0,q.jsx)(`th`,{children:`Article`}),(0,q.jsx)(`th`,{style:{textAlign:`center`},children:`Quantité`}),(0,q.jsx)(`th`,{style:{textAlign:`right`},children:`Chiffre d'Affaires`})]})}),(0,q.jsx)(`tbody`,{children:g.map((e,t)=>(0,q.jsxs)(`tr`,{children:[(0,q.jsx)(`td`,{children:(0,q.jsx)(`strong`,{children:e.name})}),(0,q.jsx)(`td`,{style:{textAlign:`center`},children:parseFloat(e.qty_sold)}),(0,q.jsxs)(`td`,{style:{textAlign:`right`},children:[new Intl.NumberFormat(`fr-FR`).format(e.revenue_generated),` XOF`]})]},t))})]})]})]}),(0,q.jsxs)(`div`,{className:`card-panel`,style:{marginTop:`24px`},children:[(0,q.jsxs)(`h3`,{children:[(0,q.jsx)(`i`,{className:`fa-solid fa-handshake me-2 text-info`}),` Balance Âgée Fournisseurs`]}),(0,q.jsx)(`p`,{style:{fontSize:`13px`,color:`var(--text-muted)`,marginBottom:`16px`},children:`Encours de dettes échues groupées par intervalles de jours depuis l'émission du bon d'achat.`}),(0,q.jsxs)(`div`,{className:`aged-balance-grid`,children:[(0,q.jsxs)(`div`,{className:`aged-card`,children:[(0,q.jsx)(`span`,{className:`aged-interval`,children:`0 - 30 Jours`}),(0,q.jsxs)(`span`,{className:`aged-val`,children:[new Intl.NumberFormat(`fr-FR`).format(m.days_0_30),` XOF`]})]}),(0,q.jsxs)(`div`,{className:`aged-card`,children:[(0,q.jsx)(`span`,{className:`aged-interval`,children:`31 - 60 Jours`}),(0,q.jsxs)(`span`,{className:`aged-val`,children:[new Intl.NumberFormat(`fr-FR`).format(m.days_31_60),` XOF`]})]}),(0,q.jsxs)(`div`,{className:`aged-card`,children:[(0,q.jsx)(`span`,{className:`aged-interval`,children:`61 - 90 Jours`}),(0,q.jsxs)(`span`,{className:`aged-val`,children:[new Intl.NumberFormat(`fr-FR`).format(m.days_61_90),` XOF`]})]}),(0,q.jsxs)(`div`,{className:`aged-card danger-interval`,children:[(0,q.jsx)(`span`,{className:`aged-interval`,children:`Plus de 90 Jours`}),(0,q.jsxs)(`span`,{className:`aged-val`,children:[new Intl.NumberFormat(`fr-FR`).format(m.days_90_plus),` XOF`]})]})]}),(0,q.jsxs)(`div`,{className:`aged-total-summary`,children:[(0,q.jsx)(`span`,{children:`Encours total de crédit fournisseur :`}),(0,q.jsxs)(`strong`,{children:[new Intl.NumberFormat(`fr-FR`).format(m.total_debt),` XOF`]})]})]})]}),(0,q.jsx)(`style`,{children:`
        .reports-container {
          position: relative;
          width: 100%;
          min-height: 100vh;
          padding: 24px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          z-index: 1;
        }

        .reports-layout {
          width: 100%;
          max-width: 1200px;
          padding: 24px;
          margin-top: 100px;
          text-align: left;
        }

        .reports-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 16px;
          margin-bottom: 24px;
        }

        .filter-bar {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
          align-items: flex-end;
          background: rgba(255, 255, 255, 0.03);
          padding: 16px;
          border-radius: var(--border-radius-sm);
          border: 1px solid var(--border-color);
        }

        .filter-item {
          flex: 1;
        }

        .btn-refresh-item {
          flex: 0 0 140px;
        }

        /* KPI */
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .kpi-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          backdrop-filter: var(--backdrop-blur);
        }

        .kpi-icon {
          font-size: 32px;
        }

        .kpi-info {
          display: flex;
          flex-direction: column;
        }

        .kpi-label {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .kpi-val {
          font-size: 20px;
          font-weight: 800;
          color: var(--text-main);
          margin: 4px 0;
        }

        .kpi-subtext {
          font-size: 11px;
          color: var(--text-muted);
        }

        /* Grid sections */
        .report-sections-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .card-panel {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          padding: 20px;
        }

        .card-panel h3 {
          font-size: 16px;
          margin-bottom: 16px;
          font-family: var(--font-title);
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 8px;
        }

        /* Pay breakdown */
        .payment-breakdown-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .payment-label-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          margin-bottom: 6px;
        }

        .progress-bar-bg {
          width: 100%;
          height: 8px;
          background: var(--border-color);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          border-radius: 4px;
        }

        .progress-cash { background: var(--color-success); }
        .progress-geniuspay { background: var(--color-info); }
        .progress-card { background: #9b59b6; }

        /* Top products table */
        .top-products-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }

        .top-products-table th, .top-products-table td {
          padding: 10px;
          border-bottom: 1px solid var(--border-color);
        }

        .top-products-table th {
          text-align: left;
          color: var(--text-muted);
        }

        /* Aged balance */
        .aged-balance-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .aged-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          padding: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .aged-interval {
          font-size: 12px;
          color: var(--text-muted);
          font-weight: 700;
        }

        .aged-val {
          font-size: 16px;
          font-weight: 800;
          color: var(--text-main);
        }

        .danger-interval {
          border-color: rgba(237, 28, 36, 0.4);
          background: rgba(237, 28, 36, 0.05);
        }

        .danger-interval .aged-val {
          color: var(--color-error);
        }

        .aged-total-summary {
          margin-top: 16px;
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          background: rgba(255, 255, 255, 0.05);
          padding: 12px 20px;
          border-radius: 6px;
        }

        .print-only-header {
          display: none;
        }

        /* Print styling */
        @media print {
          body {
            background: #FFF !important;
            color: #000 !important;
          }
          .reports-layout {
            margin-top: 0 !important;
            box-shadow: none !important;
            border: none !important;
            background: transparent !important;
            padding: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .print-only-header {
            display: block;
            text-align: center;
            color: #000;
          }
          .print-only-header h1 {
            font-size: 22px;
            margin-bottom: 4px;
          }
          .kpi-card, .card-panel, .aged-card {
            background: transparent !important;
            border: 1px solid #000 !important;
            color: #000 !important;
          }
          .kpi-val, .aged-val, .aged-total-summary strong {
            color: #000 !important;
          }
          .progress-bar-bg {
            border: 1px solid #000 !important;
            background: transparent !important;
          }
          .progress-bar-fill {
            background: #000 !important;
          }
        }
      `})]})},Tr=({setActiveTab:e})=>(0,q.jsxs)(`div`,{className:`home-container`,children:[(0,q.jsx)(`div`,{className:`decorator-sphere sphere-1`}),(0,q.jsx)(`div`,{className:`decorator-sphere sphere-2`}),(0,q.jsxs)(`div`,{className:`home-hero card`,children:[(0,q.jsx)(`img`,{src:ar,alt:`ApexPOS Logo`,className:`home-logo`}),(0,q.jsx)(`h1`,{className:`home-title`,children:`Bienvenue sur ApexPOS`}),(0,q.jsx)(`p`,{className:`home-subtitle`,children:`La solution professionnelle de gestion commerciale de Point de Vente (POS) multi-boutiques et multi-entreprises.`}),(0,q.jsxs)(`div`,{className:`home-actions`,children:[(0,q.jsxs)(`button`,{onClick:()=>e(`auth`),className:`btn btn-primary btn-large`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-key me-2`}),` Se Connecter`]}),(0,q.jsxs)(`button`,{onClick:()=>e(`register`),className:`btn btn-secondary btn-large`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-pen-to-square me-2`}),` Créer un Compte`]})]})]}),(0,q.jsxs)(`div`,{className:`features-grid`,children:[(0,q.jsxs)(`div`,{className:`feature-card card`,children:[(0,q.jsx)(`span`,{className:`feature-icon`,children:(0,q.jsx)(`i`,{className:`fa-solid fa-cash-register text-primary`})}),(0,q.jsx)(`h3`,{children:`Terminal Caisse Tactile`}),(0,q.jsx)(`p`,{children:`Enregistrez vos ventes rapidement avec un panier local fluide, gestion des codes-barres et calcul de monnaie.`})]}),(0,q.jsxs)(`div`,{className:`feature-card card`,children:[(0,q.jsx)(`span`,{className:`feature-icon`,children:(0,q.jsx)(`i`,{className:`fa-solid fa-layer-group text-success`})}),(0,q.jsx)(`h3`,{children:`Suivi des Stocks & PAMP`}),(0,q.jsx)(`p`,{children:`Mise à jour en temps réel lors des achats et ventes. Recalcul automatique du Prix d'Achat Moyen Pondéré (PAMP).`})]}),(0,q.jsxs)(`div`,{className:`feature-card card`,children:[(0,q.jsx)(`span`,{className:`feature-icon`,children:(0,q.jsx)(`i`,{className:`fa-solid fa-right-left text-warning`})}),(0,q.jsx)(`h3`,{children:`Logistique Inter-Boutiques`}),(0,q.jsx)(`p`,{children:`Initiez et validez des transferts de marchandises sécurisés entre vos différentes succursales en un clic.`})]}),(0,q.jsxs)(`div`,{className:`feature-card card`,children:[(0,q.jsx)(`span`,{className:`feature-icon`,children:(0,q.jsx)(`i`,{className:`fa-solid fa-shield-halved text-info`})}),(0,q.jsx)(`h3`,{children:`Audit & Rapport Financier`}),(0,q.jsx)(`p`,{children:`Consignez chaque écriture sensible et analysez vos performances financières avec export PDF professionnel.`})]})]}),(0,q.jsx)(`style`,{children:`
        .home-container {
          position: relative;
          width: 100%;
          min-height: 100vh;
          padding: 40px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          z-index: 1;
          margin-top: 80px;
        }

        .home-hero {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 800px;
          padding: 40px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          margin-bottom: 40px;
        }

        .home-logo {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid var(--color-primary);
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .home-title {
          font-family: var(--font-title);
          font-weight: 800;
          font-size: 32px;
          color: var(--text-main);
          margin: 0;
        }

        .home-subtitle {
          font-size: 16px;
          color: var(--text-muted);
          max-width: 600px;
          line-height: 1.6;
        }

        .home-actions {
          display: flex;
          gap: 16px;
          margin-top: 10px;
        }

        .btn-large {
          padding: 12px 30px;
          font-size: 15px;
          font-weight: 800;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 24px;
          width: 100%;
          max-width: 1000px;
        }

        .feature-card {
          padding: 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          transition: transform var(--transition-fast), border-color var(--transition-fast);
        }

        .feature-card:hover {
          transform: translateY(-4px);
          border-color: var(--color-primary);
        }

        .feature-icon {
          font-size: 40px;
        }

        .feature-card h3 {
          font-family: var(--font-title);
          font-weight: 700;
          font-size: 18px;
          color: var(--text-main);
          margin: 0;
        }

        .feature-card p {
          font-size: 13px;
          color: var(--text-muted);
          line-height: 1.5;
          margin: 0;
        }
      `})]}),Er=({setActiveTab:e})=>{let{login:t}=rr(),[n,r]=(0,v.useState)(``),[i,a]=(0,v.useState)(``),[o,s]=(0,v.useState)(``),[c,l]=(0,v.useState)(``),[u,d]=(0,v.useState)(``),[f,p]=(0,v.useState)(!1),[m,h]=(0,v.useState)(null),[g,_]=(0,v.useState)(null);return(0,q.jsxs)(`div`,{className:`register-container`,children:[(0,q.jsx)(`div`,{className:`decorator-sphere sphere-1`}),(0,q.jsx)(`div`,{className:`decorator-sphere sphere-2`}),(0,q.jsxs)(`div`,{className:`register-card card`,children:[(0,q.jsx)(`img`,{src:ar,alt:`ApexPOS Logo`,className:`register-logo`}),(0,q.jsx)(`h2`,{children:`Créer un compte ApexPOS`}),(0,q.jsx)(`p`,{className:`register-subtitle`,children:`Enregistrez votre entreprise et configurez votre point de vente en quelques secondes.`}),m&&(0,q.jsxs)(`div`,{className:`error-banner`,children:[`⚠️ `,m]}),g&&(0,q.jsxs)(`div`,{className:`success-banner`,children:[`✔️ `,g]}),(0,q.jsxs)(`form`,{onSubmit:async t=>{if(t.preventDefault(),p(!0),h(null),_(null),c!==u){h(`Les mots de passe ne correspondent pas.`),p(!1);return}try{await K.post(`/v1/auth/register`,{company_name:n,name:i,email:o,password:c,password_confirmation:u}),_(`Votre compte entreprise a été créé avec succès ! Redirection vers la page de connexion...`),setTimeout(()=>{e(`auth`)},2e3)}catch(e){h(e.response?.data?.message||e.response?.data?.error||`Une erreur est survenue lors de l'inscription.`)}finally{p(!1)}},className:`register-form`,children:[(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Nom de l'Entreprise *`}),(0,q.jsx)(`input`,{type:`text`,className:`form-control`,placeholder:`Ex: Quincaillerie Centrale`,value:n,onChange:e=>r(e.target.value),required:!0})]}),(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Nom du Gestionnaire Principal *`}),(0,q.jsx)(`input`,{type:`text`,className:`form-control`,placeholder:`Ex: Amadou Fall`,value:i,onChange:e=>a(e.target.value),required:!0})]}),(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Adresse E-mail *`}),(0,q.jsx)(`input`,{type:`email`,className:`form-control`,placeholder:`Ex: contact@entreprise.com`,value:o,onChange:e=>s(e.target.value),required:!0})]}),(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Mot de passe *`}),(0,q.jsx)(`input`,{type:`password`,className:`form-control`,placeholder:`Minimum 6 caractères`,value:c,onChange:e=>l(e.target.value),required:!0,minLength:6})]}),(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Confirmer le mot de passe *`}),(0,q.jsx)(`input`,{type:`password`,className:`form-control`,placeholder:`Ressaisir le mot de passe`,value:u,onChange:e=>d(e.target.value),required:!0})]}),(0,q.jsx)(`button`,{type:`submit`,className:`btn btn-primary btn-submit`,disabled:f,children:f?`Création de l'entreprise en cours...`:`Créer mon compte entreprise`})]}),(0,q.jsxs)(`div`,{className:`register-footer`,children:[`Déjà un compte ?`,` `,(0,q.jsx)(`button`,{onClick:()=>e(`auth`),className:`btn-link`,children:`Se connecter`})]})]}),(0,q.jsx)(`style`,{children:`
        .register-container {
          position: relative;
          width: 100%;
          min-height: 100vh;
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
          margin-top: 60px;
        }

        .register-card {
          width: 100%;
          max-width: 460px;
          padding: 32px;
          text-align: center;
        }

        .register-logo {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--color-primary);
          margin-bottom: 16px;
        }

        .register-card h2 {
          font-family: var(--font-title);
          font-weight: 800;
          font-size: 22px;
          margin: 0 0 8px 0;
          color: var(--text-main);
        }

        .register-subtitle {
          font-size: 13px;
          color: var(--text-muted);
          margin-bottom: 24px;
          line-height: 1.5;
        }

        .register-form {
          text-align: left;
        }

        .btn-submit {
          width: 100%;
          padding: 12px;
          font-family: var(--font-title);
          font-weight: 700;
          margin-top: 16px;
        }

        .register-footer {
          margin-top: 20px;
          font-size: 13px;
          color: var(--text-muted);
        }

        .btn-link {
          background: transparent;
          border: none;
          color: var(--color-primary);
          font-weight: 700;
          cursor: pointer;
          padding: 0;
        }

        .btn-link:hover {
          text-decoration: underline;
        }
      `})]})},Dr=({end:e,duration:t=1e3,prefix:n=``,suffix:r=``,format:i=!0})=>{let[a,o]=(0,v.useState)(0);return(0,v.useEffect)(()=>{let n=null,r=parseFloat(e)||0,i=e=>{n||=e;let a=Math.min((e-n)/t,1);o(a*r),a<1&&window.requestAnimationFrame(i)};window.requestAnimationFrame(i)},[e,t]),(0,q.jsxs)(`span`,{children:[n,i?new Intl.NumberFormat(`fr-FR`,{maximumFractionDigits:0}).format(a):Math.round(a),r]})},Or=()=>{let{token:e,user:t}=rr(),[n,r]=(0,v.useState)(`dashboard`),[i,a]=(0,v.useState)(null),[o,s]=(0,v.useState)([]),[c,l]=(0,v.useState)([]),[u,d]=(0,v.useState)(!1),[f,p]=(0,v.useState)(``),[m,h]=(0,v.useState)(``),[g,_]=(0,v.useState)(!1),[y,b]=(0,v.useState)(!1),[x,S]=(0,v.useState)(null),[C,w]=(0,v.useState)(``),[T,E]=(0,v.useState)(`active`),[D,O]=(0,v.useState)([]),[k,A]=(0,v.useState)(!1),[j,M]=(0,v.useState)(null),[N,P]=(0,v.useState)(``),[F,I]=(0,v.useState)(``),[L,R]=(0,v.useState)(null),[ee,te]=(0,v.useState)(!1),[z,B]=(0,v.useState)(!1),[V,H]=(0,v.useState)(null),[ne,U]=(0,v.useState)(null),[re,ie]=(0,v.useState)(!1),ae=t?.role===`super-admin`||t?.role?.slug===`super-admin`||t?.role?.name===`super-admin`,oe=async()=>{if(e){ie(!0),H(null);try{let e=await K.get(`/v1/admin/dashboard`);a(e.data.metrics),s(e.data.recent_activities||[])}catch{H(`Erreur de chargement des métriques du dashboard SaaS.`)}finally{ie(!1)}}},se=async()=>{if(e){d(!0),H(null);try{let e=await K.get(`/v1/admin/companies`);l(e.data.data||[])}catch{H(`Erreur de chargement de la liste des entreprises.`)}finally{d(!1)}}},ce=async()=>{if(e){A(!0),H(null);try{let e=await K.get(`/v1/admin/users`);O(e.data.data||[])}catch{H(`Erreur de chargement des utilisateurs.`)}finally{A(!1)}}},le=async()=>{if(e){te(!0),H(null);try{let e=await K.get(`/v1/admin/system/status`);R(e.data)}catch{H(`Erreur de chargement des indicateurs système.`)}finally{te(!1)}}};(0,v.useEffect)(()=>{!e||!ae||(se(),n===`dashboard`&&oe(),n===`companies`&&se(),n===`users`&&ce(),n===`system`&&le())},[e,n]);let ue=async e=>{e.preventDefault(),H(null),U(null);try{await K.post(`/v1/admin/companies`,{name:C,status:T}),U(`L'entreprise "${C}" a été enregistrée avec succès.`),_(!1),me(),se(),oe(),ce()}catch(e){H(e.response?.data?.message||`Erreur de création de l'entreprise.`)}},de=async e=>{e.preventDefault(),H(null),U(null);try{await K.post(`/v1/admin/companies/${x.id}`,{name:C,status:T}),U(`L'entreprise "${C}" a été mise à jour.`),b(!1),me(),se()}catch{H(`Erreur lors de la mise à jour de l'entreprise.`)}},fe=e=>{S(e),w(e.name),E(e.status||`active`),b(!0)},pe=async e=>{let t=e.status===`active`?`inactive`:`active`;H(null),U(null);try{await K.post(`/v1/admin/companies/${e.id}`,{status:t}),U(`Statut de l'entreprise "${e.name}" basculé vers "${t}".`),se()}catch{H(`Impossible de modifier le statut de l'entreprise.`)}},me=()=>{w(``),setCompanyPlan(`basic`),setCompanyExpiresAt(``),E(`active`),S(null)},he=async e=>{H(null),U(null);try{let t=await K.post(`/v1/admin/users/${e.id}/toggle-status`);U(t.data.message),ce()}catch{H(`Impossible de modifier le statut de l'utilisateur.`)}},ge=async e=>{if(e.preventDefault(),H(null),U(null),N!==F){H(`Les mots de passe ne correspondent pas.`);return}try{await K.post(`/v1/admin/users/${j.id}/reset-password`,{password:N,password_confirmation:F}),U(`Le mot de passe de l'utilisateur ${j.name} a été réinitialisé.`),M(null),P(``),I(``)}catch(e){H(e.response?.data?.message||`Erreur de réinitialisation.`)}},_e=async()=>{B(!0),H(null),U(null);try{let e=await K.post(`/v1/admin/system/backup`);U(`Sauvegarde réussie : Fichier ${e.data.backup_file} créé.`)}catch{H(`Erreur de sauvegarde.`)}finally{B(!1)}},ve=c.filter(e=>{let t=e.name.toLowerCase().includes(f.toLowerCase()),n=m===``||e.status===m;return t&&n});return!e||!ae?(0,q.jsx)(`div`,{className:`admin-container`,children:(0,q.jsxs)(`div`,{className:`alert-card card`,children:[(0,q.jsx)(`span`,{style:{fontSize:`40px`},children:`🔒`}),(0,q.jsx)(`h3`,{children:`Accès Réservé`}),(0,q.jsx)(`p`,{children:`Vous devez posséder les droits Super-Administrateur SaaS pour accéder à ce portail.`})]})}):(0,q.jsxs)(`div`,{className:`admin-container`,children:[(0,q.jsxs)(`div`,{className:`admin-layout card`,children:[(0,q.jsxs)(`div`,{className:`admin-header`,children:[(0,q.jsxs)(`div`,{children:[(0,q.jsxs)(`h2`,{children:[(0,q.jsx)(`i`,{className:`fa-solid fa-gears text-primary me-2`}),` Console SaaS & Plateforme`]}),(0,q.jsx)(`p`,{className:`admin-subtitle`,children:`Portail de supervision, d'abonnements et de maintenance multi-entreprises.`})]}),(0,q.jsxs)(`div`,{className:`admin-subtabs`,children:[(0,q.jsx)(`button`,{className:`subtab-btn ${n===`dashboard`?`active`:``}`,onClick:()=>r(`dashboard`),children:`📊 Supervision`}),(0,q.jsxs)(`button`,{className:`subtab-btn ${n===`companies`?`active`:``}`,onClick:()=>r(`companies`),children:[`🏢 Entreprises (`,c.length,`)`]}),(0,q.jsx)(`button`,{className:`subtab-btn ${n===`users`?`active`:``}`,onClick:()=>r(`users`),children:`👥 Utilisateurs`}),(0,q.jsx)(`button`,{className:`subtab-btn ${n===`system`?`active`:``}`,onClick:()=>r(`system`),children:`⚙️ Maintenance`})]})]}),V&&(0,q.jsxs)(`div`,{className:`error-banner mb-3`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-circle-exclamation me-1`}),` `,V]}),ne&&(0,q.jsxs)(`div`,{className:`success-banner mb-3`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-circle-check me-1`}),` `,ne]}),n===`dashboard`&&(0,q.jsx)(`div`,{children:re?(0,q.jsx)(`div`,{className:`loading-spinner`,children:`Calcul des indicateurs SaaS en cours...`}):(0,q.jsxs)(q.Fragment,{children:[(0,q.jsxs)(`div`,{className:`admin-metrics-grid animate-fade-in`,children:[(0,q.jsxs)(`div`,{className:`metric-box`,children:[(0,q.jsx)(`span`,{className:`metric-title`,children:`Entreprises Enregistrées`}),(0,q.jsx)(`span`,{className:`metric-number`,children:(0,q.jsx)(Dr,{end:i?.companies_count||0,format:!1})}),(0,q.jsxs)(`span`,{className:`kpi-badge up`,children:[`+`,i?.new_signups_count||0,` ce mois-ci`]})]}),(0,q.jsxs)(`div`,{className:`metric-box`,children:[(0,q.jsx)(`span`,{className:`metric-title`,children:`Entreprises Actives`}),(0,q.jsx)(`span`,{className:`metric-number`,children:(0,q.jsx)(Dr,{end:i?.companies_active||0,format:!1})}),(0,q.jsxs)(`span`,{className:`kpi-info-label`,style:{color:`#ef4444`},children:[i?.companies_suspended||0,` suspendues`]})]}),(0,q.jsxs)(`div`,{className:`metric-box`,children:[(0,q.jsx)(`span`,{className:`metric-title`,children:`Utilisateurs Globaux`}),(0,q.jsx)(`span`,{className:`metric-number`,children:(0,q.jsx)(Dr,{end:i?.users_count||0,format:!1})}),(0,q.jsxs)(`span`,{className:`kpi-info-label`,children:[i?.admins_count||0,` Administrateurs d'entreprises • `,i?.employees_count||0,` Employés`]})]})]}),(0,q.jsx)(`div`,{className:`admin-activity-grid mt-4`,children:(0,q.jsxs)(`div`,{className:`activity-card card`,style:{gridColumn:`span 2`},children:[(0,q.jsxs)(`h3`,{children:[(0,q.jsx)(`i`,{className:`fa-solid fa-history text-primary me-2`}),` Journal d'activité globale de la plateforme`]}),(0,q.jsx)(`div`,{className:`activity-timeline mt-3`,children:o.length===0?(0,q.jsx)(`p`,{className:`text-muted`,children:`Aucune activité enregistrée.`}):o.map(e=>(0,q.jsxs)(`div`,{className:`timeline-item`,children:[(0,q.jsx)(`div`,{className:`timeline-icon bg-primary-light`,children:(0,q.jsx)(`i`,{className:`fa-solid fa-shield-halved text-primary`})}),(0,q.jsxs)(`div`,{className:`timeline-content`,children:[(0,q.jsxs)(`p`,{className:`timeline-text`,children:[(0,q.jsx)(`strong`,{children:e.user?.name||`Système`}),` (Tenant ID: `,e.company_id||`Global`,`) a effectué l'action `,(0,q.jsx)(`code`,{children:e.action}),` sur le module `,(0,q.jsx)(`code`,{children:e.auditable_type.replace(`App\\Models\\`,``)})]}),(0,q.jsxs)(`span`,{className:`timeline-time`,children:[new Date(e.created_at).toLocaleString(`fr-FR`),` • IP: `,e.ip_address]})]})]},e.id))})]})})]})}),n===`companies`&&(0,q.jsxs)(`div`,{children:[(0,q.jsxs)(`div`,{className:`d-flex justify-content-between align-items-center mb-3`,children:[(0,q.jsxs)(`div`,{className:`filters-bar`,style:{flexGrow:1,marginRight:`20px`},children:[(0,q.jsx)(`div`,{className:`filter-group`,children:(0,q.jsx)(`input`,{type:`text`,className:`form-control`,placeholder:`Rechercher une entreprise...`,value:f,onChange:e=>p(e.target.value)})}),(0,q.jsx)(`div`,{className:`filter-group`,children:(0,q.jsxs)(`select`,{className:`form-control`,value:m,onChange:e=>h(e.target.value),children:[(0,q.jsx)(`option`,{value:``,children:`Tous les statuts`}),(0,q.jsx)(`option`,{value:`active`,children:`Actives`}),(0,q.jsx)(`option`,{value:`inactive`,children:`Suspendues`})]})})]}),(0,q.jsxs)(`button`,{onClick:()=>{me(),_(!0)},className:`btn btn-primary`,style:{height:`42px`},children:[(0,q.jsx)(`i`,{className:`fa-solid fa-plus me-1`}),` Créer Entreprise`]})]}),u?(0,q.jsx)(`div`,{className:`loading-spinner`,children:`Chargement des entreprises...`}):ve.length===0?(0,q.jsx)(`div`,{className:`empty-state`,children:(0,q.jsx)(`h4`,{children:`Aucune entreprise trouvée`})}):(0,q.jsx)(`div`,{className:`table-responsive`,children:(0,q.jsxs)(`table`,{className:`app-table`,children:[(0,q.jsx)(`thead`,{children:(0,q.jsxs)(`tr`,{children:[(0,q.jsx)(`th`,{children:`Entreprise`}),(0,q.jsx)(`th`,{children:`Points de Vente`}),(0,q.jsx)(`th`,{children:`Utilisateurs`}),(0,q.jsx)(`th`,{children:`Statut`}),(0,q.jsx)(`th`,{style:{textAlign:`right`},children:`Actions`})]})}),(0,q.jsx)(`tbody`,{children:ve.map(e=>(0,q.jsxs)(`tr`,{className:`hover-row`,children:[(0,q.jsx)(`td`,{children:(0,q.jsx)(`strong`,{children:e.name})}),(0,q.jsxs)(`td`,{children:[e.branches_count,` boutiques`]}),(0,q.jsxs)(`td`,{children:[e.users_count,` comptes`]}),(0,q.jsx)(`td`,{children:e.status===`active`?(0,q.jsx)(`span`,{className:`badge badge-success`,children:`Actif`}):(0,q.jsx)(`span`,{className:`badge badge-error`,children:`Suspendu`})}),(0,q.jsxs)(`td`,{style:{textAlign:`right`},children:[(0,q.jsxs)(`button`,{onClick:()=>fe(e),className:`btn btn-secondary me-2 btn-sm`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-pen`}),` Gérer`]}),(0,q.jsx)(`button`,{onClick:()=>pe(e),className:`btn btn-sm ${e.status===`active`?`btn-danger`:`btn-success`}`,children:e.status===`active`?`Suspendre`:`Activer`})]})]},e.id))})]})})]}),n===`users`&&(0,q.jsx)(`div`,{children:k?(0,q.jsx)(`div`,{className:`loading-spinner`,children:`Chargement des utilisateurs de la plateforme...`}):(0,q.jsx)(`div`,{className:`table-responsive`,children:(0,q.jsxs)(`table`,{className:`app-table`,children:[(0,q.jsx)(`thead`,{children:(0,q.jsxs)(`tr`,{children:[(0,q.jsx)(`th`,{children:`Opérateur`}),(0,q.jsx)(`th`,{children:`Adresse E-mail`}),(0,q.jsx)(`th`,{children:`Entreprise`}),(0,q.jsx)(`th`,{children:`Rôle`}),(0,q.jsx)(`th`,{children:`Statut du compte`}),(0,q.jsx)(`th`,{style:{textAlign:`right`},children:`Actions`})]})}),(0,q.jsx)(`tbody`,{children:D.map(e=>(0,q.jsxs)(`tr`,{className:`hover-row`,children:[(0,q.jsx)(`td`,{children:(0,q.jsx)(`strong`,{children:e.name})}),(0,q.jsx)(`td`,{children:e.email}),(0,q.jsx)(`td`,{children:e.company?.name||(0,q.jsx)(`span`,{className:`badge badge-info`,children:`PLATEFORME SAAS`})}),(0,q.jsx)(`td`,{children:(0,q.jsx)(`span`,{className:`badge bg-secondary`,children:e.role?.name||e.role?.slug||`Utilisateur`})}),(0,q.jsx)(`td`,{children:e.status===`active`?(0,q.jsx)(`span`,{className:`badge badge-success`,children:`Actif`}):(0,q.jsx)(`span`,{className:`badge badge-error`,children:`Bloqué`})}),(0,q.jsxs)(`td`,{style:{textAlign:`right`},children:[(0,q.jsxs)(`button`,{onClick:()=>M(e),className:`btn btn-secondary me-2 btn-sm`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-key me-1`}),` Mot de passe`]}),e.id!==t.id&&(0,q.jsx)(`button`,{onClick:()=>he(e),className:`btn btn-sm ${e.status===`active`?`btn-danger`:`btn-success`}`,children:e.status===`active`?`Bloquer`:`Débloquer`})]})]},e.id))})]})})}),n===`system`&&(0,q.jsx)(`div`,{children:(0,q.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`1fr 1fr`,gap:`20px`},children:[(0,q.jsxs)(`div`,{className:`card`,style:{padding:`24px`},children:[(0,q.jsxs)(`h3`,{children:[(0,q.jsx)(`i`,{className:`fa-solid fa-database text-primary me-2`}),` Outil de sauvegarde globale`]}),(0,q.jsx)(`p`,{className:`text-muted small mt-2`,children:`Générez un fichier compressé contenant un export SQL complet de l'application et les médias importés.`}),(0,q.jsx)(`div`,{style:{marginTop:`24px`},children:(0,q.jsx)(`button`,{onClick:_e,disabled:z,className:`btn btn-primary`,style:{display:`inline-flex`,alignItems:`center`,gap:`8px`},children:z?`Création de la sauvegarde en cours...`:`🚀 Lancer une sauvegarde manuelle`})})]}),(0,q.jsxs)(`div`,{className:`card`,style:{padding:`24px`},children:[(0,q.jsxs)(`h3`,{children:[(0,q.jsx)(`i`,{className:`fa-solid fa-server text-success me-2`}),` Indicateurs techniques réels`]}),ee||!L?(0,q.jsx)(`p`,{className:`text-muted`,children:`Chargement de la santé du serveur...`}):(0,q.jsxs)(`div`,{className:`server-health-stats mt-3`,style:{display:`flex`,flexDirection:`column`,gap:`15px`},children:[(0,q.jsxs)(`div`,{className:`d-flex justify-content-between`,children:[(0,q.jsxs)(`span`,{children:[`Espace Disque : `,(0,q.jsxs)(`strong`,{children:[L.disk.used_gb,` GB`]}),` / `,L.disk.total_gb,` GB`]}),(0,q.jsxs)(`strong`,{children:[L.disk.used_percent,`%`]})]}),(0,q.jsx)(`div`,{className:`bar-track`,children:(0,q.jsx)(`div`,{className:`bar-fill`,style:{"--target-width":`${L.disk.used_percent}%`,backgroundColor:`#f59e0b`}})}),(0,q.jsxs)(`div`,{className:`d-flex justify-content-between`,children:[(0,q.jsx)(`span`,{children:`Processeur (CPU)`}),(0,q.jsxs)(`strong`,{children:[L.performance.cpu_load_percent,`%`]})]}),(0,q.jsx)(`div`,{className:`bar-track`,children:(0,q.jsx)(`div`,{className:`bar-fill`,style:{"--target-width":`${L.performance.cpu_load_percent}%`,backgroundColor:`#10b981`}})}),(0,q.jsxs)(`div`,{className:`d-flex justify-content-between`,children:[(0,q.jsx)(`span`,{children:`Mémoire RAM`}),(0,q.jsxs)(`strong`,{children:[L.performance.memory_usage_percent,`%`]})]}),(0,q.jsx)(`div`,{className:`bar-track`,children:(0,q.jsx)(`div`,{className:`bar-fill`,style:{"--target-width":`${L.performance.memory_usage_percent}%`,backgroundColor:`#3b82f6`}})}),(0,q.jsxs)(`div`,{style:{marginTop:`10px`,fontSize:`13px`,display:`flex`,flexDirection:`column`,gap:`6px`},children:[(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`strong`,{children:`Version API Core :`}),` `,L.core_version]}),(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`strong`,{children:`Laravel :`}),` `,L.laravel_version]}),(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`strong`,{children:`PHP :`}),` `,L.php_version]})]})]})]})]})})]}),g&&(0,q.jsx)(`div`,{className:`modal-overlay`,onClick:()=>_(!1),children:(0,q.jsxs)(`div`,{className:`modal-card card`,onClick:e=>e.stopPropagation(),style:{maxWidth:`500px`,textAlign:`left`},children:[(0,q.jsx)(`h3`,{children:`Créer une entreprise sur la plateforme`}),(0,q.jsxs)(`form`,{onSubmit:ue,style:{marginTop:`15px`,display:`flex`,flexDirection:`column`,gap:`15px`},children:[(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Nom de l'entreprise`}),(0,q.jsx)(`input`,{type:`text`,className:`form-control`,required:!0,placeholder:`Ex: Sunu Commerce`,value:C,onChange:e=>w(e.target.value)})]}),(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Statut Initial`}),(0,q.jsxs)(`select`,{className:`form-control`,value:T,onChange:e=>E(e.target.value),children:[(0,q.jsx)(`option`,{value:`active`,children:`Actif`}),(0,q.jsx)(`option`,{value:`inactive`,children:`Suspendu`})]})]}),(0,q.jsxs)(`div`,{className:`modal-actions`,style:{display:`flex`,justifyContent:`flex-end`,gap:`10px`,marginTop:`15px`},children:[(0,q.jsx)(`button`,{type:`button`,onClick:()=>_(!1),className:`btn btn-cancel`,children:`Annuler`}),(0,q.jsx)(`button`,{type:`submit`,className:`btn btn-primary`,children:`Créer l'entreprise`})]})]})]})}),y&&(0,q.jsx)(`div`,{className:`modal-overlay`,onClick:()=>b(!1),children:(0,q.jsxs)(`div`,{className:`modal-card card`,onClick:e=>e.stopPropagation(),style:{maxWidth:`500px`,textAlign:`left`},children:[(0,q.jsxs)(`h3`,{children:[`Gérer l'entreprise : `,x?.name]}),(0,q.jsxs)(`form`,{onSubmit:de,style:{marginTop:`15px`,display:`flex`,flexDirection:`column`,gap:`15px`},children:[(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Nom de l'entreprise`}),(0,q.jsx)(`input`,{type:`text`,className:`form-control`,required:!0,value:C,onChange:e=>w(e.target.value)})]}),(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Statut`}),(0,q.jsxs)(`select`,{className:`form-control`,value:T,onChange:e=>E(e.target.value),children:[(0,q.jsx)(`option`,{value:`active`,children:`Actif (Accès autorisé)`}),(0,q.jsx)(`option`,{value:`inactive`,children:`Suspendu (Accès bloqué)`})]})]}),(0,q.jsxs)(`div`,{className:`modal-actions`,style:{display:`flex`,justifyContent:`flex-end`,gap:`10px`,marginTop:`15px`},children:[(0,q.jsx)(`button`,{type:`button`,onClick:()=>b(!1),className:`btn btn-cancel`,children:`Annuler`}),(0,q.jsx)(`button`,{type:`submit`,className:`btn btn-primary`,children:`Enregistrer les modifications`})]})]})]})}),j&&(0,q.jsx)(`div`,{className:`modal-overlay`,onClick:()=>M(null),children:(0,q.jsxs)(`div`,{className:`modal-card card`,onClick:e=>e.stopPropagation(),style:{maxWidth:`400px`,textAlign:`left`},children:[(0,q.jsx)(`h3`,{children:`Réinitialiser le mot de passe`}),(0,q.jsxs)(`p`,{className:`text-muted small`,children:[`Modification forcée du mot de passe pour `,(0,q.jsx)(`strong`,{children:j.name}),`.`]}),(0,q.jsxs)(`form`,{onSubmit:ge,style:{marginTop:`15px`,display:`flex`,flexDirection:`column`,gap:`15px`},children:[(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Nouveau mot de passe`}),(0,q.jsx)(`input`,{type:`password`,className:`form-control`,required:!0,placeholder:`Min. 8 caractères`,value:N,onChange:e=>P(e.target.value)})]}),(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Confirmer le mot de passe`}),(0,q.jsx)(`input`,{type:`password`,className:`form-control`,required:!0,placeholder:`Confirmer`,value:F,onChange:e=>I(e.target.value)})]}),(0,q.jsxs)(`div`,{className:`modal-actions`,style:{display:`flex`,justifyContent:`flex-end`,gap:`10px`,marginTop:`15px`},children:[(0,q.jsx)(`button`,{type:`button`,onClick:()=>M(null),className:`btn btn-cancel`,children:`Annuler`}),(0,q.jsx)(`button`,{type:`submit`,className:`btn btn-primary`,children:`Enregistrer`})]})]})]})}),(0,q.jsx)(`style`,{children:`
        .admin-container {
          position: relative;
          width: 100%;
          min-height: 100vh;
          padding: 24px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          z-index: 1;
        }

        .admin-layout {
          width: 100%;
          max-width: 1200px;
          padding: 32px;
          margin-top: 100px;
          text-align: left;
        }

        .admin-header {
          display: flex;
          flex-direction: column;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 24px;
          margin-bottom: 24px;
        }

        .admin-subtitle {
          font-size: 13px;
          color: var(--text-muted);
          font-weight: 500;
          margin-top: 4px;
        }

        .admin-subtabs {
          display: flex;
          gap: 12px;
          margin-top: 16px;
          flex-wrap: wrap;
        }

        .subtab-btn {
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 700;
          color: var(--text-muted);
          background: transparent;
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .subtab-btn:hover, .subtab-btn.active {
          color: var(--text-main);
          background: var(--bg-input);
          border-color: var(--text-main);
        }

        .admin-metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .metric-box {
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .metric-title {
          font-size: 11px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 700;
        }

        .metric-number {
          font-size: 26px;
          font-weight: 800;
          color: var(--text-main);
        }

        .kpi-badge {
          display: inline-flex;
          align-items: center;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 4px;
          align-self: flex-start;
        }

        .kpi-badge.up {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
        }

        .kpi-info-label {
          font-size: 11px;
          color: var(--text-muted);
        }

        .admin-charts-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 20px;
        }

        @media (max-width: 768px) {
          .admin-charts-grid {
            grid-template-columns: 1fr;
          }
        }

        .admin-activity-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }

        .activity-timeline {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .timeline-item {
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }

        .timeline-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          flex-shrink: 0;
        }

        .bg-primary-light { background: rgba(59, 130, 246, 0.15); }

        .timeline-content {
          text-align: left;
        }

        .timeline-text {
          font-size: 13px;
          color: var(--text-main);
          margin-bottom: 2px;
        }

        .timeline-time {
          font-size: 11px;
          color: var(--text-muted);
        }

        .server-health-stats {
          text-align: left;
        }

        .server-health-stats span {
          font-size: 13px;
          color: var(--text-muted);
        }

        .server-health-stats strong {
          color: var(--text-main);
        }
      `})]})},kr=()=>{let{token:e,user:t,companyId:n}=rr(),r=t?.role===`admin`||t?.role===`super-admin`||t?.role?.slug===`admin`||t?.role?.slug===`super-admin`,[i,a]=(0,v.useState)(`general`),[o,s]=(0,v.useState)(``),[c,l]=(0,v.useState)(``),[u,d]=(0,v.useState)(``),[f,p]=(0,v.useState)(``),[m,h]=(0,v.useState)(`XOF`),[g,_]=(0,v.useState)(`Africa/Dakar`),[y,b]=(0,v.useState)(`fr`),[x,S]=(0,v.useState)(null),[C,w]=(0,v.useState)(18),[T,E]=(0,v.useState)(!0),[D,O]=(0,v.useState)(!1),[k,A]=(0,v.useState)(`Caisse Principale 1`),[j,M]=(0,v.useState)(`Epson TM-T20III`),[N,P]=(0,v.useState)(`80`),[F,I]=(0,v.useState)(`USB-HID`),[L,R]=(0,v.useState)(``),[ee,te]=(0,v.useState)(``),[z,B]=(0,v.useState)(``),[V,H]=(0,v.useState)(``),[ne,U]=(0,v.useState)(``),[re,ie]=(0,v.useState)(``),[ae,oe]=(0,v.useState)([]),[se,ce]=(0,v.useState)(!1),[le,ue]=(0,v.useState)(!1),[de,fe]=(0,v.useState)(null),[pe,me]=(0,v.useState)({name:``,address:``,phone:``}),[he,ge]=(0,v.useState)(!1),[_e,ve]=(0,v.useState)([]),[ye,be]=(0,v.useState)([]),[xe,Se]=(0,v.useState)(!1),[Ce,we]=(0,v.useState)(!1),[Te,Ee]=(0,v.useState)(null),[De,Oe]=(0,v.useState)({name:``,email:``,password:``,pin_code:``,role_id:``,branch_id:``,status:`active`}),[ke,Ae]=(0,v.useState)(!1),[je]=(0,v.useState)(`v2.4.1`),[Me]=(0,v.useState)([{id:1,ip:`192.168.1.50`,agent:`Chrome (Linux)`,current:!0,date:`Connecté`},{id:2,ip:`192.168.1.121`,agent:`Firefox (Windows)`,current:!1,date:`Il y a 3 heures`}]),[Ne,Pe]=(0,v.useState)(!1),[Fe,Ie]=(0,v.useState)(null),[Le,Re]=(0,v.useState)(null),ze=async()=>{if(e){Pe(!0);try{let e=(await K.get(`/v1/tenant-test`)).data.company;e&&(s(e.name||``),l(e.email||``),d(e.phone||``),p(e.address||``),h(e.currency||`XOF`),_(e.timezone||`Africa/Dakar`),e.tax_settings&&(w(e.tax_settings.tax_rate??18),E(e.tax_settings.enable_tax??!0))),t&&(R(t.name),te(t.email))}catch{Ie(`Erreur de chargement des paramètres.`)}finally{Pe(!1)}}},Be=(0,v.useCallback)(async()=>{if(e){ce(!0);try{let e=await K.get(`/v1/branches`);oe(e.data||[])}catch{}finally{ce(!1)}}},[e]),Ve=(0,v.useCallback)(async()=>{if(e){Se(!0);try{let[e,t]=await Promise.all([K.get(`/v1/users`),K.get(`/v1/roles`)]);ve(e.data||[]),be(t.data||[])}catch{}finally{Se(!1)}}},[e]);(0,v.useEffect)(()=>{ze()},[e]),(0,v.useEffect)(()=>{i===`branches`&&Be()},[i,Be]),(0,v.useEffect)(()=>{i===`users`&&Ve()},[i,Ve]);let He=async e=>{e.preventDefault(),Re(null),Ie(null),Pe(!0);try{let e=new FormData;e.append(`name`,o),x&&e.append(`logo`,x),await K.post(`/v1/admin/companies/${n||1}`,e,{headers:{"Content-Type":`multipart/form-data`}}),Re(`✅ Paramètres de l'entreprise enregistrés.`),S(null)}catch{Ie(`Erreur lors de l'enregistrement des paramètres.`)}finally{Pe(!1)}},Ue=async e=>{e.preventDefault(),Re(null),Ie(null),O(!0);try{await K.put(`/v1/company-settings`,{tax_rate:C,enable_tax:T}),Re(`✅ TVA mise à jour : ${T?C+`%`:`désactivée`}.`)}catch(e){Ie(e.response?.data?.error||`Erreur de sauvegarde des paramètres TVA.`)}finally{O(!1)}},We=e=>{e.preventDefault(),Re(`✅ Paramètres du terminal de caisse POS mis à jour.`)},Ge=async e=>{if(e.preventDefault(),Ie(null),Re(null),ne&&ne!==re){Ie(`Les nouveaux mots de passe ne correspondent pas.`);return}Pe(!0);try{let e={name:L,email:ee};z&&(e.pin_code=z),ne&&(e.current_password=V,e.password=ne,e.password_confirmation=re);let t=await K.post(`/v1/auth/profile`,e);Re(`✅ `+t.data.message),H(``),U(``),ie(``),B(``)}catch(e){Ie(e.response?.data?.error||e.response?.data?.message||`Erreur de modification du profil.`)}finally{Pe(!1)}},W=(e=null)=>{fe(e),me(e?{name:e.name,address:e.address||``,phone:e.phone||``}:{name:``,address:``,phone:``}),ue(!0),Ie(null),Re(null)},Ke=async e=>{e.preventDefault(),ge(!0),Ie(null);try{de?(await K.put(`/v1/branches/${de.id}`,pe),Re(`✅ Boutique mise à jour avec succès.`)):(await K.post(`/v1/branches`,pe),Re(`✅ Boutique créée avec succès.`)),ue(!1),Be()}catch(e){Ie(e.response?.data?.error||`Erreur lors de la sauvegarde.`)}finally{ge(!1)}},qe=async e=>{try{await K.post(`/v1/branches/${e.id}/toggle-status`),Be()}catch(e){Ie(e.response?.data?.error||`Erreur de modification du statut.`)}},Je=async e=>{if(window.confirm(`Supprimer la boutique "${e.name}" ? Cette action est irréversible.`))try{await K.delete(`/v1/branches/${e.id}`),Re(`✅ Boutique supprimée.`),Be()}catch(e){Ie(e.response?.data?.error||`Erreur de suppression.`)}},Ye=(e=null)=>{Ee(e),Oe(e?{name:e.name,email:e.email,password:``,pin_code:``,role_id:e.role?.id||``,branch_id:e.branch?.id||``,status:e.status}:{name:``,email:``,password:``,pin_code:``,role_id:``,branch_id:``,status:`active`}),we(!0),Ie(null),Re(null)},Xe=async e=>{e.preventDefault(),Ae(!0),Ie(null);try{let e={...De};e.password||delete e.password,e.pin_code||delete e.pin_code,e.branch_id||delete e.branch_id,Te?(await K.put(`/v1/users/${Te.id}`,e),Re(`✅ Utilisateur mis à jour.`)):(await K.post(`/v1/users`,e),Re(`✅ Utilisateur créé.`)),we(!1),Ve()}catch(e){Ie(e.response?.data?.error||e.response?.data?.message||`Erreur lors de la sauvegarde.`)}finally{Ae(!1)}},Ze=async e=>{try{await K.post(`/v1/users/${e.id}/toggle-status`),Ve()}catch(e){Ie(e.response?.data?.error||`Erreur de modification du statut.`)}},Qe=async e=>{let t=window.prompt(`Saisir le nouveau code PIN (4 chiffres) pour ${e.name} :`);if(!t||t.length!==4||!/^\d{4}$/.test(t)){alert(`Code PIN invalide (4 chiffres requis).`);return}try{await K.post(`/v1/users/${e.id}/reset-pin`,{pin_code:t}),Re(`✅ Code PIN de ${e.name} réinitialisé.`)}catch(e){Ie(e.response?.data?.error||`Erreur de réinitialisation du PIN.`)}};return e?(0,q.jsxs)(`div`,{className:`settings-container`,children:[(0,q.jsxs)(`div`,{className:`settings-layout card`,children:[(0,q.jsx)(`div`,{className:`settings-header`,children:(0,q.jsxs)(`div`,{children:[(0,q.jsxs)(`h2`,{children:[(0,q.jsx)(`i`,{className:`fa-solid fa-sliders text-primary me-2`}),` Configuration & Paramètres`]}),(0,q.jsx)(`p`,{className:`settings-subtitle`,children:`Personnalisez votre boutique, la TVA, les périphériques et vos préférences de sécurité.`})]})}),Fe&&(0,q.jsxs)(`div`,{className:`error-banner mb-3`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-circle-exclamation me-1`}),` `,Fe]}),Le&&(0,q.jsxs)(`div`,{className:`success-banner mb-3`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-circle-check me-1`}),` `,Le]}),(0,q.jsxs)(`div`,{className:`settings-grid`,children:[(0,q.jsxs)(`div`,{className:`settings-sidebar`,children:[(0,q.jsxs)(`button`,{className:`settings-tab-btn ${i===`general`?`active`:``}`,onClick:()=>a(`general`),children:[(0,q.jsx)(`i`,{className:`fa-solid fa-building me-2`}),` Entreprise`]}),r&&(0,q.jsxs)(`button`,{className:`settings-tab-btn ${i===`tva`?`active`:``}`,onClick:()=>a(`tva`),children:[(0,q.jsx)(`i`,{className:`fa-solid fa-percent me-2`}),` TVA & Fiscalité`]}),(0,q.jsxs)(`button`,{className:`settings-tab-btn ${i===`pos`?`active`:``}`,onClick:()=>a(`pos`),children:[(0,q.jsx)(`i`,{className:`fa-solid fa-print me-2`}),` Terminal de caisse`]}),(0,q.jsxs)(`button`,{className:`settings-tab-btn ${i===`profile`?`active`:``}`,onClick:()=>a(`profile`),children:[(0,q.jsx)(`i`,{className:`fa-solid fa-user-gear me-2`}),` Mon Profil`]}),(0,q.jsxs)(`button`,{className:`settings-tab-btn ${i===`security`?`active`:``}`,onClick:()=>a(`security`),children:[(0,q.jsx)(`i`,{className:`fa-solid fa-shield-halved me-2`}),` Sécurité`]}),(0,q.jsxs)(`button`,{className:`settings-tab-btn ${i===`system`?`active`:``}`,onClick:()=>a(`system`),children:[(0,q.jsx)(`i`,{className:`fa-solid fa-hard-drive me-2`}),` Système`]})]}),(0,q.jsxs)(`div`,{className:`settings-content`,children:[i===`general`&&(0,q.jsxs)(`form`,{onSubmit:He,children:[(0,q.jsx)(`h3`,{children:`🏢 Informations de l'entreprise`}),(0,q.jsxs)(`div`,{className:`p-3 mb-4 rounded border d-flex justify-content-between align-items-center`,style:{background:`var(--bg-input)`,border:`2px solid var(--color-primary)`,borderRadius:`var(--border-radius)`},children:[(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`strong`,{style:{fontSize:`13px`,color:`var(--text-muted)`,textTransform:`uppercase`,letterSpacing:`1px`},children:`🔑 Code de Connexion Caisse de l'Entreprise`}),(0,q.jsx)(`div`,{style:{fontSize:`24px`,fontWeight:900,color:`var(--color-primary)`,letterSpacing:`3px`,marginTop:`2px`},children:t?.company?.code||`X8M4-K92P`}),(0,q.jsx)(`small`,{className:`text-muted`,children:`Communiquez ce code alphanumérique à vos caissiers pour la connexion par PIN.`})]}),(0,q.jsxs)(`button`,{type:`button`,className:`btn btn-secondary btn-sm`,onClick:()=>{navigator.clipboard.writeText(t?.company?.code||``),alert(`Code entreprise copié dans le presse-papier !`)},children:[(0,q.jsx)(`i`,{className:`fa-solid fa-copy me-1`}),` Copier`]})]}),(0,q.jsxs)(`div`,{className:`row mt-3`,children:[(0,q.jsxs)(`div`,{className:`col-md-6 form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Nom de la compagnie *`}),(0,q.jsx)(`input`,{type:`text`,className:`form-control`,value:o,onChange:e=>s(e.target.value),required:!0})]}),(0,q.jsxs)(`div`,{className:`col-md-6 form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Adresse E-mail de contact`}),(0,q.jsx)(`input`,{type:`email`,className:`form-control`,value:c,onChange:e=>l(e.target.value)})]})]}),(0,q.jsxs)(`div`,{className:`row`,children:[(0,q.jsxs)(`div`,{className:`col-md-6 form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Téléphone de la boutique`}),(0,q.jsx)(`input`,{type:`text`,className:`form-control`,value:u,onChange:e=>d(e.target.value)})]}),(0,q.jsxs)(`div`,{className:`col-md-6 form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Adresse physique`}),(0,q.jsx)(`input`,{type:`text`,className:`form-control`,value:f,onChange:e=>p(e.target.value)})]})]}),(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Logo officiel de l'entreprise`}),(0,q.jsx)(`input`,{type:`file`,className:`form-control`,accept:`image/*`,onChange:e=>S(e.target.files[0])})]}),(0,q.jsxs)(`div`,{className:`row`,children:[(0,q.jsxs)(`div`,{className:`col-md-4 form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Devise de transaction`}),(0,q.jsxs)(`select`,{className:`form-control`,value:m,onChange:e=>h(e.target.value),children:[(0,q.jsx)(`option`,{value:`XOF`,children:`Franc CFA (XOF)`}),(0,q.jsx)(`option`,{value:`EUR`,children:`Euro (€)`}),(0,q.jsx)(`option`,{value:`USD`,children:`Dollar ($)`})]})]}),(0,q.jsxs)(`div`,{className:`col-md-4 form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Fuseau horaire`}),(0,q.jsxs)(`select`,{className:`form-control`,value:g,onChange:e=>_(e.target.value),children:[(0,q.jsx)(`option`,{value:`Africa/Dakar`,children:`Africa/Dakar (Sénégal)`}),(0,q.jsx)(`option`,{value:`Africa/Abidjan`,children:`Africa/Abidjan (Côte d'Ivoire)`}),(0,q.jsx)(`option`,{value:`Europe/Paris`,children:`Europe/Paris (France)`})]})]}),(0,q.jsxs)(`div`,{className:`col-md-4 form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Langue`}),(0,q.jsxs)(`select`,{className:`form-control`,value:y,onChange:e=>b(e.target.value),children:[(0,q.jsx)(`option`,{value:`fr`,children:`Français`}),(0,q.jsx)(`option`,{value:`en`,children:`English`})]})]})]}),(0,q.jsx)(`div`,{className:`mt-4 text-end`,children:(0,q.jsxs)(`button`,{type:`submit`,className:`btn btn-primary`,disabled:Ne,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-circle-check me-1`}),` Enregistrer les modifications`]})})]}),i===`tva`&&r&&(0,q.jsxs)(`form`,{onSubmit:Ue,children:[(0,q.jsx)(`h3`,{children:`🧾 Paramétrage de la TVA`}),(0,q.jsx)(`p`,{className:`text-muted small mb-4`,children:`Configurez le taux de TVA appliqué sur les ventes. Ce réglage est pris en compte en temps réel sur le terminal de caisse.`}),(0,q.jsxs)(`div`,{className:`tva-card`,children:[(0,q.jsxs)(`div`,{className:`form-group`,style:{display:`flex`,alignItems:`center`,gap:`16px`,marginBottom:`24px`},children:[(0,q.jsx)(`label`,{className:`form-label mb-0`,style:{minWidth:`140px`,fontWeight:700},children:`Activer la TVA`}),(0,q.jsxs)(`button`,{type:`button`,className:`toggle-btn ${T?`toggle-on`:`toggle-off`}`,onClick:()=>E(!T),children:[(0,q.jsx)(`span`,{className:`toggle-knob`}),(0,q.jsx)(`span`,{style:{marginLeft:`8px`,fontSize:`13px`,fontWeight:600},children:T?`Activée`:`Désactivée`})]})]}),T&&(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,style:{fontWeight:700},children:`Taux de TVA (%)`}),(0,q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`12px`},children:[(0,q.jsx)(`input`,{type:`number`,className:`form-control`,style:{maxWidth:`140px`,fontSize:`20px`,fontWeight:700,textAlign:`center`},min:`0`,max:`100`,step:`0.1`,value:C,onChange:e=>w(parseFloat(e.target.value)||0),required:!0}),(0,q.jsx)(`span`,{style:{fontSize:`22px`,fontWeight:700,color:`var(--color-primary)`},children:`%`}),(0,q.jsx)(`div`,{className:`tva-presets`,children:[0,5,10,18,20].map(e=>(0,q.jsxs)(`button`,{type:`button`,className:`preset-btn ${C===e?`active`:``}`,onClick:()=>w(e),children:[e,`%`]},e))})]}),(0,q.jsx)(`small`,{className:`text-muted`,children:`Taux standards : 0% (exonéré) · 5% (réduit) · 10% · 18% (standard Sénégal) · 20% (Europe)`})]}),(0,q.jsxs)(`div`,{className:`tva-preview mt-4`,children:[(0,q.jsx)(`div`,{className:`tva-preview-label`,children:`Aperçu sur une vente de 10 000 XOF`}),(0,q.jsxs)(`div`,{className:`tva-preview-row`,children:[(0,q.jsx)(`span`,{children:`Prix HT`}),(0,q.jsx)(`span`,{children:`10 000 XOF`})]}),(0,q.jsxs)(`div`,{className:`tva-preview-row`,children:[(0,q.jsxs)(`span`,{children:[`TVA (`,T?C:0,`%)`]}),(0,q.jsxs)(`span`,{children:[T?Math.round(1e4*C/100).toLocaleString():0,` XOF`]})]}),(0,q.jsxs)(`div`,{className:`tva-preview-row tva-total`,children:[(0,q.jsx)(`span`,{children:`Prix TTC`}),(0,q.jsxs)(`span`,{children:[(1e4+(T?Math.round(1e4*C/100):0)).toLocaleString(),` XOF`]})]})]})]}),(0,q.jsx)(`div`,{className:`mt-4 text-end`,children:(0,q.jsxs)(`button`,{type:`submit`,className:`btn btn-primary`,disabled:D,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-circle-check me-1`}),D?`Enregistrement...`:`Enregistrer le paramétrage TVA`]})})]}),i===`branches`&&r&&(0,q.jsxs)(`div`,{children:[(0,q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`20px`},children:[(0,q.jsx)(`h3`,{style:{margin:0},children:`🏪 Gestion des Boutiques`}),(0,q.jsxs)(`button`,{className:`btn btn-primary btn-sm`,onClick:()=>W(),children:[(0,q.jsx)(`i`,{className:`fa-solid fa-plus me-1`}),` Nouvelle boutique`]})]}),le&&(0,q.jsxs)(`div`,{className:`inline-form-card`,children:[(0,q.jsx)(`h4`,{style:{marginBottom:`16px`,fontWeight:700},children:de?`✏️ Modifier la boutique`:`➕ Nouvelle boutique`}),(0,q.jsxs)(`form`,{onSubmit:Ke,children:[(0,q.jsxs)(`div`,{className:`row`,children:[(0,q.jsxs)(`div`,{className:`col-md-6 form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Nom de la boutique *`}),(0,q.jsx)(`input`,{type:`text`,className:`form-control`,required:!0,value:pe.name,onChange:e=>me({...pe,name:e.target.value})})]}),(0,q.jsxs)(`div`,{className:`col-md-6 form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Téléphone`}),(0,q.jsx)(`input`,{type:`text`,className:`form-control`,value:pe.phone,onChange:e=>me({...pe,phone:e.target.value})})]})]}),(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Adresse`}),(0,q.jsx)(`input`,{type:`text`,className:`form-control`,value:pe.address,onChange:e=>me({...pe,address:e.target.value})})]}),(0,q.jsxs)(`div`,{style:{display:`flex`,gap:`10px`,justifyContent:`flex-end`,marginTop:`12px`},children:[(0,q.jsx)(`button`,{type:`button`,className:`btn btn-secondary btn-sm`,onClick:()=>ue(!1),children:`Annuler`}),(0,q.jsx)(`button`,{type:`submit`,className:`btn btn-primary btn-sm`,disabled:he,children:he?`Enregistrement...`:`Enregistrer`})]})]})]}),se?(0,q.jsx)(`p`,{className:`text-muted text-center`,children:`Chargement des boutiques...`}):ae.length===0?(0,q.jsxs)(`div`,{className:`empty-state`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-store`,style:{fontSize:`32px`,color:`var(--text-muted)`,marginBottom:`12px`}}),(0,q.jsx)(`p`,{children:`Aucune boutique enregistrée.`})]}):(0,q.jsx)(`div`,{className:`management-table`,children:(0,q.jsxs)(`table`,{className:`table`,children:[(0,q.jsx)(`thead`,{children:(0,q.jsxs)(`tr`,{children:[(0,q.jsx)(`th`,{children:`Boutique`}),(0,q.jsx)(`th`,{children:`Adresse`}),(0,q.jsx)(`th`,{children:`Téléphone`}),(0,q.jsx)(`th`,{children:`Utilisateurs`}),(0,q.jsx)(`th`,{children:`Statut`}),(0,q.jsx)(`th`,{children:`Actions`})]})}),(0,q.jsx)(`tbody`,{children:ae.map(e=>(0,q.jsxs)(`tr`,{children:[(0,q.jsx)(`td`,{children:(0,q.jsx)(`strong`,{children:e.name})}),(0,q.jsx)(`td`,{children:e.address||(0,q.jsx)(`span`,{className:`text-muted`,children:`—`})}),(0,q.jsx)(`td`,{children:e.phone||(0,q.jsx)(`span`,{className:`text-muted`,children:`—`})}),(0,q.jsx)(`td`,{children:(0,q.jsx)(`span`,{className:`badge-count`,children:e.users_count??0})}),(0,q.jsx)(`td`,{children:(0,q.jsx)(`span`,{className:`status-badge ${(e.status??`active`)===`active`?`status-active`:`status-inactive`}`,children:(e.status??`active`)===`active`?`Active`:`Inactive`})}),(0,q.jsx)(`td`,{children:(0,q.jsxs)(`div`,{style:{display:`flex`,gap:`6px`},children:[(0,q.jsx)(`button`,{className:`btn btn-xs btn-secondary`,onClick:()=>W(e),title:`Modifier`,children:(0,q.jsx)(`i`,{className:`fa-solid fa-pen`})}),(0,q.jsx)(`button`,{className:`btn btn-xs ${(e.status??`active`)===`active`?`btn-warning`:`btn-success`}`,onClick:()=>qe(e),title:`Activer/Désactiver`,children:(0,q.jsx)(`i`,{className:`fa-solid ${(e.status??`active`)===`active`?`fa-pause`:`fa-play`}`})}),(0,q.jsx)(`button`,{className:`btn btn-xs btn-danger`,onClick:()=>Je(e),title:`Supprimer`,children:(0,q.jsx)(`i`,{className:`fa-solid fa-trash`})})]})})]},e.id))})]})})]}),i===`users`&&r&&(0,q.jsxs)(`div`,{children:[(0,q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`20px`},children:[(0,q.jsx)(`h3`,{style:{margin:0},children:`👥 Gestion des Utilisateurs`}),(0,q.jsxs)(`button`,{className:`btn btn-primary btn-sm`,onClick:()=>Ye(),children:[(0,q.jsx)(`i`,{className:`fa-solid fa-user-plus me-1`}),` Nouvel utilisateur`]})]}),Ce&&(0,q.jsxs)(`div`,{className:`inline-form-card`,children:[(0,q.jsx)(`h4`,{style:{marginBottom:`16px`,fontWeight:700},children:Te?`✏️ Modifier l'utilisateur`:`➕ Nouvel utilisateur`}),(0,q.jsxs)(`form`,{onSubmit:Xe,children:[(0,q.jsxs)(`div`,{className:`row`,children:[(0,q.jsxs)(`div`,{className:`col-md-6 form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Nom complet *`}),(0,q.jsx)(`input`,{type:`text`,className:`form-control`,required:!0,value:De.name,onChange:e=>Oe({...De,name:e.target.value})})]}),(0,q.jsxs)(`div`,{className:`col-md-6 form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`E-mail *`}),(0,q.jsx)(`input`,{type:`email`,className:`form-control`,required:!0,value:De.email,onChange:e=>Oe({...De,email:e.target.value})})]})]}),(0,q.jsxs)(`div`,{className:`row`,children:[(0,q.jsxs)(`div`,{className:`col-md-4 form-group`,children:[(0,q.jsxs)(`label`,{className:`form-label`,children:[`Mot de passe `,Te?`(vide = inchangé)`:`*`]}),(0,q.jsx)(`input`,{type:`password`,className:`form-control`,required:!Te,value:De.password,onChange:e=>Oe({...De,password:e.target.value})})]}),(0,q.jsxs)(`div`,{className:`col-md-4 form-group`,children:[(0,q.jsxs)(`label`,{className:`form-label`,children:[`Code PIN `,Te?`(vide = inchangé)`:`*`,` (4 chiffres)`]}),(0,q.jsx)(`input`,{type:`text`,className:`form-control`,maxLength:`4`,pattern:`\\d{4}`,required:!Te,placeholder:`Ex: 1234`,value:De.pin_code,onChange:e=>Oe({...De,pin_code:e.target.value.replace(/\D/g,``)})})]}),(0,q.jsxs)(`div`,{className:`col-md-4 form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Statut`}),(0,q.jsxs)(`select`,{className:`form-control`,value:De.status,onChange:e=>Oe({...De,status:e.target.value}),children:[(0,q.jsx)(`option`,{value:`active`,children:`Actif`}),(0,q.jsx)(`option`,{value:`inactive`,children:`Inactif`})]})]})]}),(0,q.jsxs)(`div`,{className:`row`,children:[(0,q.jsxs)(`div`,{className:`col-md-6 form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Rôle *`}),(0,q.jsxs)(`select`,{className:`form-control`,required:!0,value:De.role_id,onChange:e=>Oe({...De,role_id:e.target.value}),children:[(0,q.jsx)(`option`,{value:``,children:`— Sélectionner un rôle —`}),ye.map(e=>(0,q.jsx)(`option`,{value:e.id,children:e.name},e.id))]})]}),(0,q.jsxs)(`div`,{className:`col-md-6 form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Boutique rattachée`}),(0,q.jsxs)(`select`,{className:`form-control`,value:De.branch_id,onChange:e=>Oe({...De,branch_id:e.target.value}),children:[(0,q.jsx)(`option`,{value:``,children:`— Toutes les boutiques —`}),ae.map(e=>(0,q.jsx)(`option`,{value:e.id,children:e.name},e.id))]})]})]}),(0,q.jsxs)(`div`,{style:{display:`flex`,gap:`10px`,justifyContent:`flex-end`,marginTop:`12px`},children:[(0,q.jsx)(`button`,{type:`button`,className:`btn btn-secondary btn-sm`,onClick:()=>we(!1),children:`Annuler`}),(0,q.jsx)(`button`,{type:`submit`,className:`btn btn-primary btn-sm`,disabled:ke,children:ke?`Enregistrement...`:`Enregistrer`})]})]})]}),xe?(0,q.jsx)(`p`,{className:`text-muted text-center`,children:`Chargement des utilisateurs...`}):_e.length===0?(0,q.jsxs)(`div`,{className:`empty-state`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-users`,style:{fontSize:`32px`,color:`var(--text-muted)`,marginBottom:`12px`}}),(0,q.jsx)(`p`,{children:`Aucun utilisateur enregistré.`})]}):(0,q.jsx)(`div`,{className:`management-table`,children:(0,q.jsxs)(`table`,{className:`table`,children:[(0,q.jsx)(`thead`,{children:(0,q.jsxs)(`tr`,{children:[(0,q.jsx)(`th`,{children:`Nom`}),(0,q.jsx)(`th`,{children:`E-mail`}),(0,q.jsx)(`th`,{children:`Rôle`}),(0,q.jsx)(`th`,{children:`Boutique`}),(0,q.jsx)(`th`,{children:`Statut`}),(0,q.jsx)(`th`,{children:`Actions`})]})}),(0,q.jsx)(`tbody`,{children:_e.map(e=>(0,q.jsxs)(`tr`,{children:[(0,q.jsx)(`td`,{children:(0,q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`10px`},children:[(0,q.jsx)(`div`,{className:`user-avatar-mini`,children:e.name.charAt(0)}),(0,q.jsx)(`strong`,{children:e.name})]})}),(0,q.jsx)(`td`,{children:e.email}),(0,q.jsx)(`td`,{children:(0,q.jsx)(`span`,{className:`badge-role`,children:e.role?.name||`—`})}),(0,q.jsx)(`td`,{children:e.branch?.name||(0,q.jsx)(`span`,{className:`text-muted`,children:`—`})}),(0,q.jsx)(`td`,{children:(0,q.jsx)(`span`,{className:`status-badge ${e.status===`active`?`status-active`:`status-inactive`}`,children:e.status===`active`?`Actif`:`Inactif`})}),(0,q.jsx)(`td`,{children:(0,q.jsxs)(`div`,{style:{display:`flex`,gap:`6px`},children:[(0,q.jsx)(`button`,{className:`btn btn-xs btn-secondary`,onClick:()=>Ye(e),title:`Modifier`,children:(0,q.jsx)(`i`,{className:`fa-solid fa-pen`})}),(0,q.jsx)(`button`,{className:`btn btn-xs btn-info`,onClick:()=>Qe(e),title:`Réinitialiser le PIN`,children:(0,q.jsx)(`i`,{className:`fa-solid fa-key`})}),(0,q.jsx)(`button`,{className:`btn btn-xs ${e.status===`active`?`btn-warning`:`btn-success`}`,onClick:()=>Ze(e),title:`Activer/Désactiver`,children:(0,q.jsx)(`i`,{className:`fa-solid ${e.status===`active`?`fa-user-slash`:`fa-user-check`}`})})]})})]},e.id))})]})})]}),i===`pos`&&(0,q.jsxs)(`form`,{onSubmit:We,children:[(0,q.jsx)(`h3`,{children:`🔌 Périphériques et Terminal POS`}),(0,q.jsxs)(`div`,{className:`row mt-3`,children:[(0,q.jsxs)(`div`,{className:`col-md-6 form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Nom du Point de Vente (Caisse)`}),(0,q.jsx)(`input`,{type:`text`,className:`form-control`,value:k,onChange:e=>A(e.target.value)})]}),(0,q.jsxs)(`div`,{className:`col-md-6 form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Imprimante de Ticket par défaut`}),(0,q.jsxs)(`select`,{className:`form-control`,value:j,onChange:e=>M(e.target.value),children:[(0,q.jsx)(`option`,{value:`Epson TM-T20III`,children:`Epson TM-T20III (Thermique USB)`}),(0,q.jsx)(`option`,{value:`Star Micronics TSP143`,children:`Star Micronics TSP143 (Réseau)`}),(0,q.jsx)(`option`,{value:`Generic 80mm`,children:`Imprimante 80mm Générique`})]})]})]}),(0,q.jsxs)(`div`,{className:`row`,children:[(0,q.jsxs)(`div`,{className:`col-md-6 form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Largeur du ticket (thermique)`}),(0,q.jsxs)(`select`,{className:`form-control`,value:N,onChange:e=>P(e.target.value),children:[(0,q.jsx)(`option`,{value:`80`,children:`Large (80mm) - Recommandé`}),(0,q.jsx)(`option`,{value:`58`,children:`Compact (58mm)`})]})]}),(0,q.jsxs)(`div`,{className:`col-md-6 form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Sélecteur de Lecteur Code-barres`}),(0,q.jsxs)(`select`,{className:`form-control`,value:F,onChange:e=>I(e.target.value),children:[(0,q.jsx)(`option`,{value:`USB-HID`,children:`Clavier Émulé (USB-HID)`}),(0,q.jsx)(`option`,{value:`Virtual-COM`,children:`Port Série Virtuel (V-COM)`})]})]})]}),(0,q.jsx)(`div`,{className:`mt-4 text-end`,children:(0,q.jsxs)(`button`,{type:`submit`,className:`btn btn-primary`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-circle-check me-1`}),` Enregistrer la configuration POS`]})})]}),i===`profile`&&(0,q.jsxs)(`form`,{onSubmit:Ge,children:[(0,q.jsx)(`h3`,{children:`👤 Mon Profil Utilisateur`}),(0,q.jsxs)(`div`,{className:`row mt-3`,children:[(0,q.jsxs)(`div`,{className:`col-md-6 form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Nom complet`}),(0,q.jsx)(`input`,{type:`text`,className:`form-control`,value:L,onChange:e=>R(e.target.value),required:!0})]}),(0,q.jsxs)(`div`,{className:`col-md-6 form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Adresse E-mail`}),(0,q.jsx)(`input`,{type:`email`,className:`form-control`,value:ee,onChange:e=>te(e.target.value),required:!0})]})]}),(0,q.jsx)(`div`,{className:`row`,children:(0,q.jsxs)(`div`,{className:`col-md-6 form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Code PIN de caisse (4 chiffres)`}),(0,q.jsx)(`input`,{type:`password`,className:`form-control`,maxLength:`4`,pattern:`\\d{4}`,placeholder:`Laisser vide pour ne pas modifier`,value:z,onChange:e=>B(e.target.value.replace(/\D/g,``))}),(0,q.jsx)(`small`,{className:`text-muted`,children:`Utilisé pour la connexion rapide sur le terminal POS.`})]})}),(0,q.jsx)(`div`,{className:`panel-divider my-4`,style:{borderTop:`1px solid var(--border-color)`}}),(0,q.jsx)(`h3`,{children:`🔑 Modifier mon mot de passe (sécurisé)`}),(0,q.jsxs)(`div`,{className:`form-group mt-3`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Mot de passe actuel`}),(0,q.jsx)(`input`,{type:`password`,className:`form-control`,value:V,onChange:e=>H(e.target.value),placeholder:`Indispensable pour changer de mot de passe`})]}),(0,q.jsxs)(`div`,{className:`row`,children:[(0,q.jsxs)(`div`,{className:`col-md-6 form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Nouveau mot de passe`}),(0,q.jsx)(`input`,{type:`password`,className:`form-control`,value:ne,onChange:e=>U(e.target.value),placeholder:`Min. 8 caractères`})]}),(0,q.jsxs)(`div`,{className:`col-md-6 form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Confirmer le mot de passe`}),(0,q.jsx)(`input`,{type:`password`,className:`form-control`,value:re,onChange:e=>ie(e.target.value),placeholder:`Confirmer`})]})]}),(0,q.jsx)(`div`,{className:`mt-4 text-end`,children:(0,q.jsxs)(`button`,{type:`submit`,className:`btn btn-primary`,disabled:Ne,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-circle-check me-1`}),` Mettre à jour mon profil`]})})]}),i===`security`&&(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`h3`,{children:`🛡️ Sécurité & Double Authentification (2FA)`}),(0,q.jsx)(`p`,{className:`text-muted small mt-2`,children:`Sécurisez votre compte utilisateur contre les usurpations d'identité.`}),(0,q.jsxs)(`div`,{className:`mt-4 p-3 bg-input rounded border d-flex justify-content-between align-items-center`,style:{background:`var(--bg-input)`,border:`1px solid var(--border-color)`,borderRadius:`var(--border-radius-sm)`},children:[(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`strong`,{children:`Double Authentification par application mobile (2FA)`}),(0,q.jsx)(`p`,{className:`text-muted small mb-0`,children:`Utilisez Google Authenticator ou Authy pour valider chaque connexion.`})]}),(0,q.jsx)(`button`,{className:`btn btn-secondary btn-sm`,onClick:()=>alert(`L'activation de l'authentification 2FA nécessite la configuration de votre serveur de mails.`),children:`Activer le 2FA`})]}),(0,q.jsx)(`div`,{className:`panel-divider my-4`,style:{borderTop:`1px solid var(--border-color)`}}),(0,q.jsx)(`h3`,{children:`🖥️ Sessions de connexions actives`}),(0,q.jsx)(`div`,{className:`table-responsive mt-3`,children:(0,q.jsxs)(`table`,{className:`table table-striped table-hover align-middle mb-0`,children:[(0,q.jsx)(`thead`,{className:`table-dark`,children:(0,q.jsxs)(`tr`,{children:[(0,q.jsx)(`th`,{children:`Adresse IP`}),(0,q.jsx)(`th`,{children:`Navigateur / OS`}),(0,q.jsx)(`th`,{children:`Date & Heure`}),(0,q.jsx)(`th`,{style:{textAlign:`center`},children:`Actions`})]})}),(0,q.jsx)(`tbody`,{children:Me.map(e=>(0,q.jsxs)(`tr`,{children:[(0,q.jsxs)(`td`,{children:[(0,q.jsx)(`code`,{children:e.ip}),` `,e.current&&(0,q.jsx)(`span`,{className:`badge bg-success ms-1`,children:`Session courante`})]}),(0,q.jsx)(`td`,{children:e.agent}),(0,q.jsx)(`td`,{children:e.date}),(0,q.jsx)(`td`,{style:{textAlign:`center`},children:(0,q.jsx)(`button`,{className:`btn btn-sm btn-danger`,disabled:e.current,children:`Déconnecter`})})]},e.id))})]})})]}),i===`system`&&(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`h3`,{children:`⚙️ Diagnostics Système`}),(0,q.jsxs)(`div`,{className:`row mt-4 g-3`,children:[(0,q.jsx)(`div`,{className:`col-md-6`,children:(0,q.jsxs)(`div`,{className:`p-3 border rounded text-left`,style:{background:`var(--bg-input)`,border:`1px solid var(--border-color)`,borderRadius:`var(--border-radius-sm)`},children:[(0,q.jsx)(`strong`,{children:`Version du Core POS`}),(0,q.jsx)(`p`,{className:`text-muted small mb-0`,children:je})]})}),(0,q.jsx)(`div`,{className:`col-md-6`,children:(0,q.jsxs)(`div`,{className:`p-3 border rounded text-left`,style:{background:`var(--bg-input)`,border:`1px solid var(--border-color)`,borderRadius:`var(--border-radius-sm)`},children:[(0,q.jsx)(`strong`,{children:`Statut API Backend`}),(0,q.jsxs)(`p`,{className:`text-success small mb-0`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-circle-check me-1`}),` Opérationnel • Connexion stable`]})]})})]}),(0,q.jsx)(`div`,{className:`panel-divider my-4`,style:{borderTop:`1px solid var(--border-color)`}}),(0,q.jsx)(`h3`,{children:`🗄️ Journal Système & Diagnostic`}),(0,q.jsxs)(`div`,{className:`mt-3 p-3 bg-dark rounded border text-left`,style:{background:`#0F172A`,border:`1px solid #1E293B`,borderRadius:`var(--border-radius-sm)`,fontFamily:`Courier New, monospace`,fontSize:`11px`,color:`#10B981`},children:[`[2026-07-21 10:00:00] local.INFO: TenantManager set active company. `,(0,q.jsx)(`br`,{}),`[2026-07-21 10:00:01] local.INFO: Settings loaded dynamically. `,(0,q.jsx)(`br`,{}),`[2026-07-21 10:00:02] local.INFO: Role middleware registered OK.`]})]})]})]})]}),(0,q.jsx)(`style`,{children:`
        .settings-container { position: relative; width: 100%; min-height: 100vh; padding: 24px; display: flex; align-items: flex-start; justify-content: center; z-index: 1; }
        .settings-layout { width: 100%; max-width: 1100px; padding: 32px; margin-top: 100px; text-align: left; }
        .settings-header { border-bottom: 1px solid var(--border-color); padding-bottom: 24px; margin-bottom: 24px; }
        .settings-subtitle { font-size: 13px; color: var(--text-muted); font-weight: 500; margin-top: 4px; }
        .settings-grid { display: grid; grid-template-columns: 220px 1fr; gap: 32px; }
        @media (max-width: 768px) { .settings-grid { grid-template-columns: 1fr; gap: 20px; } }
        .settings-sidebar { display: flex; flex-direction: column; gap: 4px; }
        @media (max-width: 768px) { .settings-sidebar { flex-direction: row; overflow-x: auto; padding-bottom: 8px; white-space: nowrap; } }
        .settings-tab-btn { width: 100%; text-align: left; padding: 11px 14px; font-size: 12.5px; font-weight: 700; color: var(--text-muted); background: transparent; border: 1px solid transparent; border-radius: var(--border-radius-sm); cursor: pointer; transition: all var(--transition-fast); }
        @media (max-width: 768px) { .settings-tab-btn { width: auto; padding: 8px 14px; } }
        .settings-tab-btn:hover, .settings-tab-btn.active { color: var(--text-main); background: var(--bg-input); border-color: var(--border-color); }
        .settings-content { min-height: 400px; }
        .settings-content h3 { font-family: var(--font-title); font-size: 16px; font-weight: 800; color: var(--text-main); margin-bottom: 16px; border-left: 3px solid var(--color-primary); padding-left: 10px; }

        /* TVA */
        .tva-card { background: var(--bg-input); border: 1px solid var(--border-color); border-radius: var(--border-radius); padding: 24px; }
        .tva-presets { display: flex; gap: 8px; }
        .preset-btn { padding: 6px 14px; border-radius: 20px; border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-muted); font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .preset-btn.active, .preset-btn:hover { background: var(--color-primary); color: #fff; border-color: var(--color-primary); }
        .tva-preview { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--border-radius-sm); overflow: hidden; }
        .tva-preview-label { padding: 10px 16px; font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-muted); border-bottom: 1px solid var(--border-color); }
        .tva-preview-row { display: flex; justify-content: space-between; padding: 10px 16px; font-size: 13px; border-bottom: 1px solid var(--border-color); }
        .tva-total { font-weight: 800; color: var(--color-primary); font-size: 15px; background: rgba(var(--color-primary-rgb, 79,70,229), 0.07); }

        /* Toggle switch */
        .toggle-btn { display: inline-flex; align-items: center; padding: 4px 12px 4px 6px; border-radius: 24px; border: 2px solid; cursor: pointer; font-size: 13px; transition: all 0.2s; min-width: 110px; }
        .toggle-on  { background: var(--color-success); border-color: var(--color-success); color: #fff; }
        .toggle-off { background: var(--bg-input); border-color: var(--border-color); color: var(--text-muted); }
        .toggle-knob { width: 18px; height: 18px; border-radius: 50%; background: #fff; box-shadow: 0 1px 4px rgba(0,0,0,.2); margin-right: 4px; }

        /* Tables management */
        .management-table { overflow-x: auto; }
        .management-table .table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .management-table thead th { padding: 10px 12px; font-weight: 700; font-size: 11px; text-transform: uppercase; color: var(--text-muted); border-bottom: 2px solid var(--border-color); white-space: nowrap; }
        .management-table tbody td { padding: 10px 12px; border-bottom: 1px solid var(--border-color); vertical-align: middle; }
        .management-table tbody tr:hover { background: var(--bg-input); }

        /* Badges & états */
        .status-badge { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 11px; font-weight: 700; }
        .status-active  { background: rgba(16,185,129,.15); color: var(--color-success); }
        .status-inactive { background: rgba(239,68,68,.12); color: var(--color-danger); }
        .badge-count { display: inline-flex; align-items: center; justify-content: center; min-width: 24px; height: 24px; padding: 0 8px; border-radius: 12px; background: var(--bg-input); border: 1px solid var(--border-color); font-size: 12px; font-weight: 700; }
        .badge-role { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 11px; font-weight: 700; background: rgba(99,102,241,.12); color: var(--color-primary); }
        .user-avatar-mini { width: 30px; height: 30px; border-radius: 50%; background: var(--color-primary); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 13px; flex-shrink: 0; }

        /* Boutons XS */
        .btn-xs { padding: 4px 9px; font-size: 11px; border-radius: 6px; }
        .btn-info { background: #0ea5e9; color: #fff; border-color: #0ea5e9; }
        .btn-info:hover { background: #0284c7; }

        /* Formulaire inline */
        .inline-form-card { background: var(--bg-input); border: 1px solid var(--border-color); border-radius: var(--border-radius); padding: 20px; margin-bottom: 20px; }

        /* Vide */
        .empty-state { text-align: center; padding: 48px 24px; color: var(--text-muted); font-size: 14px; }
      `})]}):(0,q.jsx)(`div`,{className:`settings-container`,children:(0,q.jsxs)(`div`,{className:`alert-card card`,children:[(0,q.jsx)(`span`,{style:{fontSize:`40px`},children:`🔒`}),(0,q.jsx)(`h3`,{children:`Accès Réservé`}),(0,q.jsx)(`p`,{children:`Connectez-vous pour configurer l'application.`})]})})},Ar=()=>{let{token:e,user:t}=rr(),n=t?.role?.slug||t?.role?.name||t?.role,r=n===`admin`||n===`super-admin`||n===`gerant`,[i,a]=(0,v.useState)([]),[o,s]=(0,v.useState)(!1),[c,l]=(0,v.useState)(null),[u,d]=(0,v.useState)(null),[f,p]=(0,v.useState)(!1),[m,h]=(0,v.useState)(null),[g,_]=(0,v.useState)({name:``,address:``,phone:``}),[y,b]=(0,v.useState)(!1),x=(0,v.useCallback)(async()=>{if(e){s(!0);try{let e=await K.get(`/v1/branches`);a(e.data||[])}catch{l(`Impossible de charger les boutiques.`)}finally{s(!1)}}},[e]);(0,v.useEffect)(()=>{x()},[x]);let S=(e=null)=>{h(e),_(e?{name:e.name,address:e.address||``,phone:e.phone||``}:{name:``,address:``,phone:``}),p(!0),l(null),d(null)},C=async e=>{e.preventDefault(),b(!0),l(null);try{m?(await K.put(`/v1/branches/${m.id}`,g),d(`✅ Boutique mise à jour avec succès.`)):(await K.post(`/v1/branches`,g),d(`✅ Boutique créée avec succès.`)),p(!1),x()}catch(e){l(e.response?.data?.error||`Erreur lors de la sauvegarde.`)}finally{b(!1)}},w=async e=>{try{await K.post(`/v1/branches/${e.id}/toggle-status`),x()}catch(e){l(e.response?.data?.error||`Erreur de modification du statut.`)}},T=async e=>{if(window.confirm(`Supprimer la boutique "${e.name}" ? Cette action est irréversible.`))try{await K.delete(`/v1/branches/${e.id}`),d(`✅ Boutique supprimée.`),x()}catch(e){l(e.response?.data?.error||`Erreur de suppression.`)}};return e?r?(0,q.jsxs)(`div`,{className:`customers-container`,children:[(0,q.jsx)(`div`,{className:`decorator-sphere sphere-1`}),(0,q.jsx)(`div`,{className:`decorator-sphere sphere-2`}),(0,q.jsxs)(`div`,{className:`customers-layout card`,children:[(0,q.jsxs)(`div`,{className:`customers-header`,children:[(0,q.jsxs)(`div`,{children:[(0,q.jsxs)(`h2`,{className:`section-title`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-store me-2 text-primary`}),` Gestion des Boutiques`]}),(0,q.jsx)(`p`,{className:`customers-subtitle`,children:`Créez, modifiez et gérez les points de vente de votre entreprise.`})]}),(0,q.jsxs)(`button`,{className:`btn btn-primary`,onClick:()=>S(),children:[(0,q.jsx)(`i`,{className:`fa-solid fa-plus me-1`}),` Nouvelle Boutique`]})]}),c&&(0,q.jsxs)(`div`,{className:`error-banner`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-circle-exclamation me-1`}),` `,c]}),u&&(0,q.jsxs)(`div`,{className:`success-banner`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-circle-check me-1`}),` `,u]}),f&&(0,q.jsxs)(`div`,{className:`inline-form-card`,style:{marginBottom:`20px`},children:[(0,q.jsx)(`h4`,{style:{marginBottom:`16px`,fontWeight:700},children:m?`✏️ Modifier la boutique`:`➕ Nouvelle boutique`}),(0,q.jsxs)(`form`,{onSubmit:C,children:[(0,q.jsxs)(`div`,{className:`row`,children:[(0,q.jsxs)(`div`,{className:`col-md-6 form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Nom de la boutique *`}),(0,q.jsx)(`input`,{type:`text`,className:`form-control`,required:!0,placeholder:`Ex: Boutique Centre-ville`,value:g.name,onChange:e=>_({...g,name:e.target.value})})]}),(0,q.jsxs)(`div`,{className:`col-md-6 form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Téléphone`}),(0,q.jsx)(`input`,{type:`text`,className:`form-control`,placeholder:`Ex: +225 07 00 00 00`,value:g.phone,onChange:e=>_({...g,phone:e.target.value})})]})]}),(0,q.jsxs)(`div`,{className:`form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Adresse`}),(0,q.jsx)(`input`,{type:`text`,className:`form-control`,placeholder:`Ex: Rue des Palmiers, Plateau`,value:g.address,onChange:e=>_({...g,address:e.target.value})})]}),(0,q.jsxs)(`div`,{style:{display:`flex`,gap:`10px`,justifyContent:`flex-end`,marginTop:`12px`},children:[(0,q.jsx)(`button`,{type:`button`,className:`btn btn-secondary btn-sm`,onClick:()=>p(!1),children:`Annuler`}),(0,q.jsx)(`button`,{type:`submit`,className:`btn btn-primary btn-sm`,disabled:y,children:y?`Enregistrement...`:`Enregistrer`})]})]})]}),o?(0,q.jsx)(`div`,{className:`loading-spinner`,style:{textAlign:`center`,padding:`40px`},children:`Chargement des boutiques...`}):i.length===0?(0,q.jsxs)(`div`,{className:`empty-state`,children:[(0,q.jsx)(`span`,{className:`empty-icon`,children:(0,q.jsx)(`i`,{className:`fa-solid fa-store text-muted`})}),(0,q.jsx)(`h4`,{children:`Aucune boutique enregistrée`}),(0,q.jsx)(`p`,{children:`Créez votre première boutique en cliquant sur "+ Nouvelle Boutique".`})]}):(0,q.jsx)(`div`,{className:`management-table`,children:(0,q.jsxs)(`table`,{className:`table`,children:[(0,q.jsx)(`thead`,{children:(0,q.jsxs)(`tr`,{children:[(0,q.jsx)(`th`,{children:`Boutique`}),(0,q.jsx)(`th`,{children:`Adresse`}),(0,q.jsx)(`th`,{children:`Téléphone`}),(0,q.jsx)(`th`,{children:`Utilisateurs`}),(0,q.jsx)(`th`,{children:`Statut`}),(0,q.jsx)(`th`,{children:`Actions`})]})}),(0,q.jsx)(`tbody`,{children:i.map(e=>(0,q.jsxs)(`tr`,{children:[(0,q.jsx)(`td`,{children:(0,q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`10px`},children:[(0,q.jsx)(`div`,{style:{width:36,height:36,borderRadius:`8px`,background:`var(--color-primary)`,opacity:.9,display:`flex`,alignItems:`center`,justifyContent:`center`,color:`#fff`},children:(0,q.jsx)(`i`,{className:`fa-solid fa-store`,style:{fontSize:`14px`}})}),(0,q.jsx)(`strong`,{children:e.name})]})}),(0,q.jsx)(`td`,{children:e.address||(0,q.jsx)(`span`,{className:`text-muted`,children:`—`})}),(0,q.jsx)(`td`,{children:e.phone||(0,q.jsx)(`span`,{className:`text-muted`,children:`—`})}),(0,q.jsx)(`td`,{children:(0,q.jsxs)(`span`,{className:`badge-count`,children:[e.users_count??0,` utilisateur`,(e.users_count??0)===1?``:`s`]})}),(0,q.jsx)(`td`,{children:(()=>{let t=e.status||`open`;return(0,q.jsx)(`span`,{className:`status-badge ${t===`open`||t===`active`?`status-active`:`status-inactive`}`,children:t===`open`||t===`active`?`Ouverte`:t===`maintenance`?`Maintenance`:t===`suspended`?`Suspendue`:`Fermée`})})()}),(0,q.jsx)(`td`,{children:(0,q.jsxs)(`div`,{style:{display:`flex`,gap:`6px`},children:[(0,q.jsx)(`button`,{className:`btn btn-xs btn-secondary`,onClick:()=>S(e),title:`Modifier`,children:(0,q.jsx)(`i`,{className:`fa-solid fa-pen`})}),(0,q.jsx)(`button`,{className:`btn btn-xs ${e.status===`open`||e.status===`active`?`btn-warning`:`btn-success`}`,onClick:()=>w(e),title:`Ouvrir/Fermer la boutique`,children:(0,q.jsx)(`i`,{className:`fa-solid ${e.status===`open`||e.status===`active`?`fa-pause`:`fa-play`}`})}),(0,q.jsx)(`button`,{className:`btn btn-xs btn-danger`,onClick:()=>T(e),title:`Supprimer`,children:(0,q.jsx)(`i`,{className:`fa-solid fa-trash`})})]})})]},e.id))})]})})]})]}):(0,q.jsx)(`div`,{className:`customers-container`,children:(0,q.jsx)(`div`,{className:`customers-layout card`,children:(0,q.jsxs)(`div`,{className:`empty-state text-center`,children:[(0,q.jsx)(`span`,{style:{fontSize:`48px`},children:`🚫`}),(0,q.jsx)(`h3`,{children:`Accès non autorisé`}),(0,q.jsx)(`p`,{children:`Seuls les administrateurs peuvent gérer les boutiques.`})]})})}):(0,q.jsx)(`div`,{className:`customers-container`,children:(0,q.jsx)(`div`,{className:`customers-layout card`,children:(0,q.jsxs)(`div`,{className:`empty-state text-center`,children:[(0,q.jsx)(`span`,{style:{fontSize:`48px`},children:`🔒`}),(0,q.jsx)(`h3`,{children:`Accès Réservé`}),(0,q.jsx)(`p`,{children:`Connectez-vous pour gérer les boutiques.`})]})})})},jr=()=>{let{token:e,user:t}=rr(),n=t?.role===`admin`||t?.role?.slug===`admin`,[r,i]=(0,v.useState)([]),[a,o]=(0,v.useState)([]),[s,c]=(0,v.useState)([]),[l,u]=(0,v.useState)(!1),[d,f]=(0,v.useState)(null),[p,m]=(0,v.useState)(null),[h,g]=(0,v.useState)(!1),[_,y]=(0,v.useState)(null),[b,x]=(0,v.useState)(!1),[S,C]=(0,v.useState)(``),[w,T]=(0,v.useState)(``),[E,D]=(0,v.useState)({name:``,email:``,password:``,pin_code:``,role_id:``,branch_id:``,status:`active`}),O=(0,v.useCallback)(async()=>{if(e){u(!0);try{let[e,t,n]=await Promise.all([K.get(`/v1/users`),K.get(`/v1/roles`),K.get(`/v1/branches`)]);i(e.data||[]),o(t.data||[]),c(n.data||[])}catch{f(`Impossible de charger les données.`)}finally{u(!1)}}},[e]);(0,v.useEffect)(()=>{O()},[O]);let k=(e=null)=>{y(e),D(e?{name:e.name,email:e.email,password:``,pin_code:``,role_id:e.role?.id||``,branch_id:e.branch?.id||``,status:e.status}:{name:``,email:``,password:``,pin_code:``,role_id:``,branch_id:``,status:`active`}),g(!0),f(null),m(null)},A=async e=>{e.preventDefault(),x(!0),f(null);try{let e={...E};e.password||delete e.password,e.pin_code||delete e.pin_code,e.branch_id||delete e.branch_id,_?(await K.put(`/v1/users/${_.id}`,e),m(`✅ Utilisateur mis à jour avec succès.`)):(await K.post(`/v1/users`,e),m(`✅ Utilisateur créé avec succès.`)),g(!1),O()}catch(e){f(e.response?.data?.error||e.response?.data?.message||`Erreur lors de la sauvegarde.`)}finally{x(!1)}},j=async e=>{try{await K.post(`/v1/users/${e.id}/toggle-status`),O()}catch(e){f(e.response?.data?.error||`Erreur de modification du statut.`)}},M=async e=>{let t=window.prompt(`Saisir le nouveau code PIN pour ${e.name} :`);if(!t||t.length<4||!/^\d+$/.test(t)){alert(`Code PIN invalide (au moins 4 chiffres requis).`);return}try{await K.post(`/v1/users/${e.id}/reset-pin`,{pin_code:t}),m(`✅ Code PIN de ${e.name} réinitialisé.`)}catch(e){f(e.response?.data?.error||`Erreur de réinitialisation du PIN.`)}},N=r.filter(e=>{let t=!S||e.name.toLowerCase().includes(S.toLowerCase())||e.email.toLowerCase().includes(S.toLowerCase()),n=!w||(e.role?.slug||e.role?.name||``)===w;return t&&n}),P={admin:`#1E3A8A`,gerant:`#0D9488`,caissier:`#7C3AED`,comptable:`#B45309`,default:`#64748B`},F=e=>P[e]||P.default;return e?n?(0,q.jsxs)(`div`,{className:`customers-container`,children:[(0,q.jsx)(`div`,{className:`decorator-sphere sphere-1`}),(0,q.jsx)(`div`,{className:`decorator-sphere sphere-2`}),(0,q.jsxs)(`div`,{className:`customers-layout card`,children:[(0,q.jsxs)(`div`,{className:`customers-header`,children:[(0,q.jsxs)(`div`,{children:[(0,q.jsxs)(`h2`,{className:`section-title`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-users-gear me-2 text-primary`}),` Gestion du Personnel`]}),(0,q.jsx)(`p`,{className:`customers-subtitle`,children:`Gérez le personnel de votre entreprise, leurs rôles et leurs accès.`})]}),(0,q.jsxs)(`button`,{className:`btn btn-primary`,onClick:()=>k(),children:[(0,q.jsx)(`i`,{className:`fa-solid fa-user-plus me-1`}),` Nouvel Utilisateur`]})]}),d&&(0,q.jsxs)(`div`,{className:`error-banner`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-circle-exclamation me-1`}),` `,d]}),p&&(0,q.jsxs)(`div`,{className:`success-banner`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-circle-check me-1`}),` `,p]}),h&&(0,q.jsxs)(`div`,{className:`inline-form-card`,style:{marginBottom:`20px`},children:[(0,q.jsx)(`h4`,{style:{marginBottom:`16px`,fontWeight:700},children:_?`✏️ Modifier l'utilisateur`:`➕ Nouvel utilisateur`}),(0,q.jsxs)(`form`,{onSubmit:A,children:[(0,q.jsxs)(`div`,{className:`row`,children:[(0,q.jsxs)(`div`,{className:`col-md-6 form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Nom complet *`}),(0,q.jsx)(`input`,{type:`text`,className:`form-control`,required:!0,placeholder:`Ex: Jean Dupont`,value:E.name,onChange:e=>D({...E,name:e.target.value})})]}),(0,q.jsxs)(`div`,{className:`col-md-6 form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Adresse E-mail *`}),(0,q.jsx)(`input`,{type:`email`,className:`form-control`,required:!0,placeholder:`jean@exemple.com`,value:E.email,onChange:e=>D({...E,email:e.target.value})})]})]}),(0,q.jsxs)(`div`,{className:`row`,children:[(0,q.jsxs)(`div`,{className:`col-md-4 form-group`,children:[(0,q.jsxs)(`label`,{className:`form-label`,children:[`Mot de passe `,_?`(vide = inchangé)`:`*`]}),(0,q.jsx)(`input`,{type:`password`,className:`form-control`,required:!_,placeholder:`Min. 8 caractères`,value:E.password,onChange:e=>D({...E,password:e.target.value})})]}),(0,q.jsxs)(`div`,{className:`col-md-4 form-group`,children:[(0,q.jsxs)(`label`,{className:`form-label`,children:[`Code PIN `,_?`(vide = inchangé)`:`*`]}),(0,q.jsx)(`input`,{type:`text`,className:`form-control`,maxLength:`6`,required:!_,placeholder:`Ex: 1234`,value:E.pin_code,onChange:e=>D({...E,pin_code:e.target.value.replace(/\D/g,``)})})]}),(0,q.jsxs)(`div`,{className:`col-md-4 form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Statut`}),(0,q.jsxs)(`select`,{className:`form-control`,value:E.status,onChange:e=>D({...E,status:e.target.value}),children:[(0,q.jsx)(`option`,{value:`active`,children:`Actif`}),(0,q.jsx)(`option`,{value:`inactive`,children:`Inactif`})]})]})]}),(0,q.jsxs)(`div`,{className:`row`,children:[(0,q.jsxs)(`div`,{className:`col-md-6 form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Rôle *`}),(0,q.jsxs)(`select`,{className:`form-control`,required:!0,value:E.role_id,onChange:e=>D({...E,role_id:e.target.value}),children:[(0,q.jsx)(`option`,{value:``,children:`— Sélectionner un rôle —`}),a.map(e=>(0,q.jsx)(`option`,{value:e.id,children:e.name},e.id))]})]}),(0,q.jsxs)(`div`,{className:`col-md-6 form-group`,children:[(0,q.jsx)(`label`,{className:`form-label`,children:`Boutique rattachée`}),(0,q.jsxs)(`select`,{className:`form-control`,value:E.branch_id,onChange:e=>D({...E,branch_id:e.target.value}),children:[(0,q.jsx)(`option`,{value:``,children:`— Toutes les boutiques —`}),s.map(e=>(0,q.jsx)(`option`,{value:e.id,children:e.name},e.id))]})]})]}),(0,q.jsxs)(`div`,{style:{display:`flex`,gap:`10px`,justifyContent:`flex-end`,marginTop:`12px`},children:[(0,q.jsx)(`button`,{type:`button`,className:`btn btn-secondary btn-sm`,onClick:()=>g(!1),children:`Annuler`}),(0,q.jsx)(`button`,{type:`submit`,className:`btn btn-primary btn-sm`,disabled:b,children:b?`Enregistrement...`:`Enregistrer`})]})]})]}),(0,q.jsxs)(`div`,{className:`search-bar`,style:{display:`flex`,gap:`12px`,flexWrap:`wrap`},children:[(0,q.jsxs)(`div`,{style:{flex:1,minWidth:`200px`,position:`relative`},children:[(0,q.jsx)(`i`,{className:`fa-solid fa-magnifying-glass search-icon`}),(0,q.jsx)(`input`,{type:`text`,className:`form-control search-input`,placeholder:`Rechercher par nom ou e-mail...`,value:S,onChange:e=>C(e.target.value)})]}),(0,q.jsxs)(`select`,{className:`form-control`,value:w,onChange:e=>T(e.target.value),style:{minWidth:`200px`},children:[(0,q.jsx)(`option`,{value:``,children:`— Tous les rôles —`}),a.map(e=>(0,q.jsx)(`option`,{value:e.slug||e.name,children:e.name},e.id))]})]}),l?(0,q.jsx)(`div`,{className:`loading-spinner`,style:{textAlign:`center`,padding:`40px`},children:`Chargement des utilisateurs...`}):N.length===0?(0,q.jsxs)(`div`,{className:`empty-state`,children:[(0,q.jsx)(`span`,{className:`empty-icon`,children:(0,q.jsx)(`i`,{className:`fa-solid fa-users-slash text-muted`})}),(0,q.jsx)(`h4`,{children:S||w?`Aucun résultat`:`Aucun utilisateur enregistré`}),(0,q.jsx)(`p`,{children:S||w?`Essayez de modifier vos critères de recherche.`:`Créez le premier utilisateur en cliquant sur "+ Nouvel Utilisateur".`})]}):(0,q.jsxs)(`div`,{className:`management-table mt-3`,children:[(0,q.jsxs)(`table`,{className:`table`,children:[(0,q.jsx)(`thead`,{children:(0,q.jsxs)(`tr`,{children:[(0,q.jsx)(`th`,{children:`Nom`}),(0,q.jsx)(`th`,{children:`E-mail`}),(0,q.jsx)(`th`,{children:`Rôle`}),(0,q.jsx)(`th`,{children:`Boutique`}),(0,q.jsx)(`th`,{children:`Statut`}),(0,q.jsx)(`th`,{children:`Actions`})]})}),(0,q.jsx)(`tbody`,{children:N.map(e=>(0,q.jsxs)(`tr`,{children:[(0,q.jsx)(`td`,{children:(0,q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`10px`},children:[(0,q.jsx)(`div`,{className:`user-avatar-mini`,children:e.name.charAt(0).toUpperCase()}),(0,q.jsx)(`strong`,{children:e.name})]})}),(0,q.jsx)(`td`,{style:{color:`var(--text-muted)`,fontSize:`13px`},children:e.email}),(0,q.jsx)(`td`,{children:(0,q.jsx)(`span`,{style:{background:`${F(e.role?.slug)}22`,color:F(e.role?.slug),border:`1px solid ${F(e.role?.slug)}55`,padding:`2px 10px`,borderRadius:`20px`,fontSize:`12px`,fontWeight:700},children:e.role?.name||`—`})}),(0,q.jsx)(`td`,{children:e.branch?.name||(0,q.jsx)(`span`,{className:`text-muted`,children:`—`})}),(0,q.jsx)(`td`,{children:(0,q.jsx)(`span`,{className:`status-badge ${e.status===`active`?`status-active`:`status-inactive`}`,children:e.status===`active`?`Actif`:`Inactif`})}),(0,q.jsx)(`td`,{children:(0,q.jsxs)(`div`,{style:{display:`flex`,gap:`6px`},children:[(0,q.jsx)(`button`,{className:`btn btn-xs btn-secondary`,onClick:()=>k(e),title:`Modifier`,children:(0,q.jsx)(`i`,{className:`fa-solid fa-pen`})}),(0,q.jsx)(`button`,{className:`btn btn-xs btn-info`,onClick:()=>M(e),title:`Réinitialiser le PIN`,children:(0,q.jsx)(`i`,{className:`fa-solid fa-key`})}),(0,q.jsx)(`button`,{className:`btn btn-xs ${e.status===`active`?`btn-warning`:`btn-success`}`,onClick:()=>j(e),title:`Activer/Désactiver`,children:(0,q.jsx)(`i`,{className:`fa-solid ${e.status===`active`?`fa-user-slash`:`fa-user-check`}`})})]})})]},e.id))})]}),(0,q.jsxs)(`div`,{style:{padding:`10px 16px`,color:`var(--text-muted)`,fontSize:`13px`,borderTop:`1px solid var(--border-color)`},children:[N.length,` utilisateur`,N.length===1?``:`s`,` affiché`,N.length===1?``:`s`,(S||w)&&` sur ${r.length} au total`]})]})]})]}):(0,q.jsx)(`div`,{className:`customers-container`,children:(0,q.jsx)(`div`,{className:`customers-layout card`,children:(0,q.jsxs)(`div`,{className:`empty-state text-center`,children:[(0,q.jsx)(`span`,{style:{fontSize:`48px`},children:`🚫`}),(0,q.jsx)(`h3`,{children:`Accès non autorisé`}),(0,q.jsx)(`p`,{children:`Seuls les administrateurs peuvent gérer les utilisateurs.`})]})})}):(0,q.jsx)(`div`,{className:`customers-container`,children:(0,q.jsx)(`div`,{className:`customers-layout card`,children:(0,q.jsxs)(`div`,{className:`empty-state text-center`,children:[(0,q.jsx)(`span`,{style:{fontSize:`48px`},children:`🔒`}),(0,q.jsx)(`h3`,{children:`Accès Réservé`}),(0,q.jsx)(`p`,{children:`Connectez-vous pour gérer les utilisateurs.`})]})})})},Mr=()=>{let[e,t]=(0,v.useState)(`intro`);return(0,q.jsxs)(`div`,{className:`guide-container`,children:[(0,q.jsxs)(`div`,{className:`guide-layout card`,children:[(0,q.jsxs)(`div`,{className:`guide-header`,children:[(0,q.jsxs)(`h2`,{children:[(0,q.jsx)(`i`,{className:`fa-solid fa-book-open text-primary me-2`}),` Guide Utilisateur & Manuel Officiel`]}),(0,q.jsx)(`p`,{className:`guide-subtitle`,children:`Consultez l'aide interactive d'ApexPOS pour configurer votre boutique, former vos caissiers ou administrer la plateforme.`})]}),(0,q.jsxs)(`div`,{className:`guide-grid`,children:[(0,q.jsxs)(`div`,{className:`guide-sidebar`,children:[(0,q.jsx)(`button`,{className:`guide-menu-btn ${e===`intro`?`active`:``}`,onClick:()=>t(`intro`),children:`📌 1. Introduction & Concept`}),(0,q.jsx)(`button`,{className:`guide-menu-btn ${e===`roles`?`active`:``}`,onClick:()=>t(`roles`),children:`👥 2. Rôles & Accès`}),(0,q.jsx)(`button`,{className:`guide-menu-btn ${e===`login`?`active`:``}`,onClick:()=>t(`login`),children:`🔑 3. Connexion & Récupération`}),(0,q.jsx)(`button`,{className:`guide-menu-btn ${e===`pos`?`active`:``}`,onClick:()=>t(`pos`),children:`🖥️ 4. Terminal POS & Vente`}),(0,q.jsx)(`button`,{className:`guide-menu-btn ${e===`payments`?`active`:``}`,onClick:()=>t(`payments`),children:`💳 5. Encaissement & Crédits`}),(0,q.jsx)(`button`,{className:`guide-menu-btn ${e===`clients`?`active`:``}`,onClick:()=>t(`clients`),children:`🤝 6. Clients & Fournisseurs`}),(0,q.jsx)(`button`,{className:`guide-menu-btn ${e===`audit`?`active`:``}`,onClick:()=>t(`audit`),children:`🛡️ 7. Sécurité & Audit`}),(0,q.jsx)(`button`,{className:`guide-menu-btn ${e===`superadmin`?`active`:``}`,onClick:()=>t(`superadmin`),children:`⚙️ 8. Console Super-Admin SaaS`}),(0,q.jsx)(`button`,{className:`guide-menu-btn ${e===`settings`?`active`:``}`,onClick:()=>t(`settings`),children:`🔧 9. Configuration & Options`})]}),(0,q.jsxs)(`div`,{className:`guide-content`,children:[e===`intro`&&(0,q.jsxs)(`div`,{className:`animate-fade-in text-left`,children:[(0,q.jsx)(`h3`,{children:`📌 1. Introduction & Concept Multi-tenant`}),(0,q.jsxs)(`p`,{className:`mt-3`,children:[(0,q.jsx)(`strong`,{children:`ApexPOS`}),` est un progiciel de gestion intégré de point de vente multi-boutiques et multi-compagnies (SaaS). Il est conçu pour permettre le cloisonnement étanche des données commerciales de chaque entreprise tout en offrant un écosystème performant pour le commerce quotidien.`]}),(0,q.jsx)(`h4`,{className:`mt-4`,children:`Principaux atouts :`}),(0,q.jsxs)(`ul`,{className:`mt-2`,style:{paddingLeft:`20px`},children:[(0,q.jsxs)(`li`,{className:`mb-2`,children:[(0,q.jsx)(`strong`,{children:`Sécurité renforcée`}),` : Isolation des données par tenant au niveau de la base de données. Un employé d'une entreprise ne peut sous aucun prétexte accéder aux fiches produits ou aux ventes d'une autre entreprise.`]}),(0,q.jsxs)(`li`,{className:`mb-2`,children:[(0,q.jsx)(`strong`,{children:`Aéronautique visuelle (UI Kits)`}),` : Passage à la volée entre un kit classique ("Corporate") et un kit moderne dépoli ("Glassmorphism"), avec support automatique des modes sombre et clair.`]}),(0,q.jsxs)(`li`,{className:`mb-2`,children:[(0,q.jsx)(`strong`,{children:`Conception adaptative (Responsivité)`}),` : L'ensemble de la plateforme s'adapte automatiquement sur les tablettes et les smartphones pour de l'encaissement nomade.`]})]}),(0,q.jsxs)(`div`,{className:`alert-box mt-4`,children:[(0,q.jsx)(`strong`,{children:`💡 Information :`}),` Le guide ci-présent fait foi de manuel de formation. Pour toute assistance supplémentaire, contactez le support technique de la plateforme de votre zone.`]})]}),e===`roles`&&(0,q.jsxs)(`div`,{className:`animate-fade-in text-left`,children:[(0,q.jsx)(`h3`,{children:`👥 2. Rôles de la Plateforme & Habilitations`}),(0,q.jsx)(`p`,{className:`mt-3`,children:`Afin de garantir le principe du moindre privilège, ApexPOS structure les accès selon cinq profils prédéfinis.`}),(0,q.jsx)(`div`,{className:`table-responsive mt-3`,children:(0,q.jsxs)(`table`,{className:`table table-striped align-middle`,style:{width:`100%`,borderCollapse:`collapse`},children:[(0,q.jsx)(`thead`,{style:{background:`var(--color-primary)`,color:`#ffffff`},children:(0,q.jsxs)(`tr`,{children:[(0,q.jsx)(`th`,{style:{padding:`12px`},children:`Profil / Rôle`}),(0,q.jsx)(`th`,{style:{padding:`12px`},children:`Périmètre de responsabilité`}),(0,q.jsx)(`th`,{style:{padding:`12px`},children:`Fonctionnalités principales`})]})}),(0,q.jsxs)(`tbody`,{children:[(0,q.jsxs)(`tr`,{style:{borderBottom:`1px solid var(--border-color)`},children:[(0,q.jsx)(`td`,{style:{padding:`12px`},children:(0,q.jsx)(`strong`,{children:`Super-Administrateur`})}),(0,q.jsx)(`td`,{style:{padding:`12px`},children:`Supervision technique et commerciale de la plateforme globale (SaaS).`}),(0,q.jsx)(`td`,{style:{padding:`12px`},children:`Gestion des abonnements d'entreprises, état matériel du serveur, sauvegardes, et journaux d'audit globaux.`})]}),(0,q.jsxs)(`tr`,{style:{borderBottom:`1px solid var(--border-color)`},children:[(0,q.jsx)(`td`,{style:{padding:`12px`},children:(0,q.jsx)(`strong`,{children:`Administrateur d'Entreprise`})}),(0,q.jsx)(`td`,{style:{padding:`12px`},children:`Gestion complète des succursales (boutiques), des stocks et des habilitations internes.`}),(0,q.jsx)(`td`,{style:{padding:`12px`},children:`CRUD produits, ajout d'employés, édition du profil de l'entreprise et des terminaux POS, rapports financiers.`})]}),(0,q.jsxs)(`tr`,{style:{borderBottom:`1px solid var(--border-color)`},children:[(0,q.jsx)(`td`,{style:{padding:`12px`},children:(0,q.jsx)(`strong`,{children:`Gérant de Boutique`})}),(0,q.jsx)(`td`,{style:{padding:`12px`},children:`Supervision opérationnelle d'une succursale spécifique.`}),(0,q.jsx)(`td`,{style:{padding:`12px`},children:`Gestion des stocks (alertes, transferts), clôtures de caisse, et consultation des statistiques.`})]}),(0,q.jsxs)(`tr`,{style:{borderBottom:`1px solid var(--border-color)`},children:[(0,q.jsx)(`td`,{style:{padding:`12px`},children:(0,q.jsx)(`strong`,{children:`Comptable`})}),(0,q.jsx)(`td`,{style:{padding:`12px`},children:`Suivi analytique et fiscalité.`}),(0,q.jsx)(`td`,{style:{padding:`12px`},children:`Lecture des rapports de marges, TVA collectée, balances âgées et écritures d'achats.`})]}),(0,q.jsxs)(`tr`,{style:{borderBottom:`1px solid var(--border-color)`},children:[(0,q.jsx)(`td`,{style:{padding:`12px`},children:(0,q.jsx)(`strong`,{children:`Caissier`})}),(0,q.jsx)(`td`,{style:{padding:`12px`},children:`Opérateur de vente au comptoir.`}),(0,q.jsx)(`td`,{style:{padding:`12px`},children:`Saisie des articles, encaissement rapide (Espèces / Carte / Crédit), et impression des reçus thermiques.`})]})]})]})})]}),e===`login`&&(0,q.jsxs)(`div`,{className:`animate-fade-in text-left`,children:[(0,q.jsx)(`h3`,{children:`🔑 3. Authentification, Code PIN & Récupération`}),(0,q.jsx)(`p`,{className:`mt-3`,children:`ApexPOS propose deux modes de connexion distincts pour s'adapter au rythme de l'activité commerciale.`}),(0,q.jsx)(`h4`,{className:`mt-4`,children:`1. La Connexion Standard (E-mail + Mot de passe)`}),(0,q.jsx)(`p`,{className:`text-muted small`,children:`Destinée principalement aux fonctions de gestion (Admin, Gérant, Comptable). Elle nécessite la saisie des identifiants complets créés lors de l'enregistrement de l'entreprise.`}),(0,q.jsx)(`h4`,{className:`mt-4`,children:`2. La Connexion Caisse (Code PIN à 4 chiffres)`}),(0,q.jsx)(`p`,{className:`text-muted small`,children:`Conçue pour les écrans tactiles et les caissiers. L'opérateur choisit son entreprise, clique sur son nom d'utilisateur, puis tape son code PIN à 4 chiffres sur le clavier virtuel.`}),(0,q.jsxs)(`div`,{className:`alert-box mt-3`,style:{background:`rgba(59, 130, 246, 0.1)`,borderLeft:`4px solid var(--color-primary)`},children:[(0,q.jsx)(`strong`,{children:`💡 Règle d'initialisation :`}),` À la création de toute nouvelle entreprise, le premier compte d'administrateur se voit assigner le code PIN par défaut `,(0,q.jsx)(`strong`,{children:"`1234`"}),`. Vous devez le modifier dans vos paramètres de profil pour des raisons de sécurité.`]}),(0,q.jsx)(`h4`,{className:`mt-4`,children:`3. Récupération de Mot de Passe Oublié`}),(0,q.jsx)(`p`,{className:`text-muted small`,children:`En cas d'oubli de mot de passe, cliquez sur *"Mot de passe oublié ?"* sur l'interface de connexion. Saisissez votre e-mail pour générer un code de réinitialisation unique à 6 chiffres (valable 15 minutes). Saisissez ensuite ce code et définissez votre nouveau mot de passe pour retrouver l'accès à votre espace.`})]}),e===`pos`&&(0,q.jsxs)(`div`,{className:`animate-fade-in text-left`,children:[(0,q.jsx)(`h3`,{children:`🖥️ 4. Terminal de Vente (POS) & Caisse`}),(0,q.jsx)(`p`,{className:`mt-3`,children:`Le terminal POS est l'outil phare pour enregistrer les paniers de vente.`}),(0,q.jsxs)(`div`,{className:`guide-img-wrapper my-3`,children:[(0,q.jsx)(`img`,{src:`/assets/pos_terminal_1783616808314-CVyqcQ7_.png`,alt:`Terminal de Vente POS`,className:`guide-screenshot`}),(0,q.jsx)(`span`,{className:`img-caption`,children:`Figure 1 : Interface de caisse du point de vente POS.`})]}),(0,q.jsx)(`h4`,{className:`mt-4`,children:`Cycle de vie d'une Session de Caisse :`}),(0,q.jsx)(`p`,{className:`text-muted small`,children:`Pour des raisons de rigueur comptable, un caissier ne peut pas scanner d'articles sans avoir ouvert une session.`}),(0,q.jsxs)(`ul`,{className:`mt-2`,style:{paddingLeft:`20px`},children:[(0,q.jsxs)(`li`,{className:`mb-2`,children:[(0,q.jsx)(`strong`,{children:`Ouverture de session`}),` : Le caissier saisit le montant initial en espèces présent dans le tiroir-caisse (fond de caisse).`]}),(0,q.jsxs)(`li`,{className:`mb-2`,children:[(0,q.jsx)(`strong`,{children:`En cours d'activité`}),` : Les ventes s'incrémentent dans le journal. Le système calcule en temps réel le montant théorique attendu.`]}),(0,q.jsxs)(`li`,{className:`mb-2`,children:[(0,q.jsx)(`strong`,{children:`Fermeture de session`}),` : Le gérant ou le caissier compte le tiroir physique à la fin du service. En cas d'écart, la différence est calculée automatiquement et consignée dans l'historique des clôtures pour déceler d'éventuelles erreurs.`]})]})]}),e===`payments`&&(0,q.jsxs)(`div`,{className:`animate-fade-in text-left`,children:[(0,q.jsx)(`h3`,{children:`💳 5. Modes d'Encaissement & Ventes à Crédit`}),(0,q.jsx)(`p`,{className:`mt-3`,children:`ApexPOS permet d'encaisser vos transactions via plusieurs méthodes (Espèces, Carte Bancaire, Crédit Client).`}),(0,q.jsx)(`h4`,{className:`mt-4`,children:`1. Modes de Paiement`}),(0,q.jsxs)(`p`,{className:`text-muted small`,children:[`Lors de la validation d'un panier sur le terminal POS, sélectionnez le mode de paiement souhaité : - `,(0,q.jsx)(`strong`,{children:`Espèces (Cash)`}),` : Saisissez le montant reçu pour calculer automatiquement le rendu de monnaie. - `,(0,q.jsx)(`strong`,{children:`Carte Bancaire`}),` : Enregistre le règlement par terminal bancaire (TPE). - `,(0,q.jsx)(`strong`,{children:`Crédit Client`}),` : Enregistre une vente différée rattachée au compte client.`]}),(0,q.jsx)(`h4`,{className:`mt-4`,children:`2. Ventes à Crédit (Compte Dettes)`}),(0,q.jsx)(`p`,{className:`text-muted small`,children:`Pour les clients enregistrés, vous pouvez effectuer une vente à crédit. Le montant total de la facture est alors ajouté au solde de dettes de la fiche client. *Sécurité* : L'administrateur définit une limite de crédit maximum pour chaque client. Si le solde débiteur dépasse cette limite, le terminal de vente refuse de finaliser l'encaissement à crédit.`})]}),e===`clients`&&(0,q.jsxs)(`div`,{className:`animate-fade-in text-left`,children:[(0,q.jsx)(`h3`,{children:`🤝 6. Fiches Clients, Fidélité & Fournisseurs`}),(0,q.jsx)(`p`,{className:`mt-3`,children:`La fidélisation et les approvisionnements sont essentiels pour suivre la rentabilité de votre commerce.`}),(0,q.jsxs)(`div`,{className:`guide-img-wrapper my-3`,children:[(0,q.jsx)(`img`,{src:`/assets/customers_list_1783617744528-aSRQNl-w.png`,alt:`Gestion des Clients`,className:`guide-screenshot`}),(0,q.jsx)(`span`,{className:`img-caption`,children:`Figure 2 : Interface de suivi des dettes et points de fidélité.`})]}),(0,q.jsx)(`h4`,{className:`mt-4`,children:`1. Suivi de la Fidélité`}),(0,q.jsx)(`p`,{className:`text-muted small`,children:`Chaque achat effectué par un client identifié incrémente son compteur de points de fidélité (par défaut, 1 point tous les 1 000 XOF achetés). Ces points peuvent être utilisés ultérieurement pour accorder des remises ou des cadeaux commerciaux.`}),(0,q.jsx)(`h4`,{className:`mt-4`,children:`2. Suivi des Fournisseurs & Achats`}),(0,q.jsx)(`p`,{className:`text-muted small`,children:`Le module *Fournisseurs* permet de recenser vos partenaires logistiques. Lors de la réception d'une livraison, l'Administrateur enregistre un *Achat* qui met instantanément à jour les quantités en stock de la boutique et incrémente (si payé à terme) la dette fournisseur de l'entreprise.`})]}),e===`audit`&&(0,q.jsxs)(`div`,{className:`animate-fade-in text-left`,children:[(0,q.jsx)(`h3`,{children:`🛡️ 7. Journal d'Audit & Traçabilité de l'activité`}),(0,q.jsx)(`p`,{className:`mt-3`,children:`Afin de prévenir la fraude interne et de garantir la transparence, ApexPOS intègre un enregistreur d'audit automatique.`}),(0,q.jsx)(`h4`,{className:`mt-4`,children:`Qu'est-ce qui est audité ?`}),(0,q.jsx)(`p`,{className:`text-muted small`,children:`Chaque opération d'écriture sensible (création de produit, modification de prix, connexion utilisateur, ajustement de stock, annulation de vente, modification de mot de passe) déclenche la création d'un journal d'audit.`}),(0,q.jsx)(`h4`,{className:`mt-4`,children:`Informations stockées :`}),(0,q.jsxs)(`ul`,{className:`mt-2`,style:{paddingLeft:`20px`},children:[(0,q.jsx)(`li`,{className:`mb-2`,children:`L'adresse IP de la machine ayant exécuté la requête.`}),(0,q.jsx)(`li`,{className:`mb-2`,children:`Le navigateur et l'appareil utilisé (User Agent).`}),(0,q.jsx)(`li`,{className:`mb-2`,children:`L'ancien état des données ainsi que le nouvel état modifié.`}),(0,q.jsx)(`li`,{className:`mb-2`,children:`L'horodatage précis à la seconde près.`})]})]}),e===`superadmin`&&(0,q.jsxs)(`div`,{className:`animate-fade-in text-left`,children:[(0,q.jsx)(`h3`,{children:`⚙️ 8. Supervision SaaS (Super-Administrateur)`}),(0,q.jsx)(`p`,{className:`mt-3`,children:`Interface centrale réservée aux administrateurs de l'infrastructure SaaS pour gérer l'exploitation commerciale de la plateforme.`}),(0,q.jsxs)(`div`,{className:`guide-img-wrapper my-3`,children:[(0,q.jsx)(`img`,{src:`/assets/superadmin_dashboard_1783616831876-BF1IfJrI.png`,alt:`Dashboard de Supervision Super-Admin`,className:`guide-screenshot`}),(0,q.jsx)(`span`,{className:`img-caption`,children:`Figure 4 : Tableau de bord de statistiques SaaS globales.`})]}),(0,q.jsx)(`h4`,{className:`mt-4`,children:`Outils de maintenance :`}),(0,q.jsxs)(`ul`,{className:`mt-2`,style:{paddingLeft:`20px`},children:[(0,q.jsxs)(`li`,{className:`mb-2`,children:[(0,q.jsx)(`strong`,{children:`Maintenance Système`}),` : Surveillance de la charge CPU, de la consommation RAM et du stockage disque disponible de la machine serveur.`]}),(0,q.jsxs)(`li`,{className:`mb-2`,children:[(0,q.jsx)(`strong`,{children:`Sauvegarde Automatique`}),` : Lancement d'une sauvegarde complète de la base de données (Dump SQL comprimé) exportable en 1 clic.`]}),(0,q.jsxs)(`li`,{className:`mb-2`,children:[(0,q.jsx)(`strong`,{children:`Gestion des abonnements`}),` : Configuration des offres tarifaires (Free, Basic, Premium) et blocage immédiat des accès d'une entreprise en cas d'impayé.`]})]})]}),e===`settings`&&(0,q.jsxs)(`div`,{className:`animate-fade-in text-left`,children:[(0,q.jsx)(`h3`,{children:`🔧 9. Configuration & Personnalisation`}),(0,q.jsx)(`p`,{className:`mt-3`,children:`Le menu **Paramètres** permet d'adapter le logiciel à votre environnement matériel.`}),(0,q.jsxs)(`div`,{className:`guide-img-wrapper my-3`,children:[(0,q.jsx)(`img`,{src:`/assets/settings_panel_1783616847903-_rxEFo7M.png`,alt:`Panneau des Paramètres généraux`,className:`guide-screenshot`}),(0,q.jsx)(`span`,{className:`img-caption`,children:`Figure 5 : Paramètres multi-onglets de l'application.`})]}),(0,q.jsx)(`h4`,{className:`mt-4`,children:`Configuration Matérielle POS :`}),(0,q.jsx)(`p`,{className:`text-muted small`,children:`Vous pouvez configurer le format d'impression des tickets de caisse (largeur 80mm standard ou 58mm compact) et choisir le type de communication avec votre lecteur de codes-barres (USB-HID en émulation clavier ou port COM virtuel).`})]})]})]})]}),(0,q.jsx)(`style`,{children:`
        .guide-container {
          position: relative;
          width: 100%;
          min-height: 100vh;
          padding: 24px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          z-index: 1;
        }

        .guide-layout {
          width: 100%;
          max-width: 1200px;
          padding: 40px;
          margin-top: 80px;
          transition: all var(--transition-normal);
        }

        .guide-header {
          text-align: left;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 20px;
          margin-bottom: 30px;
        }

        .guide-subtitle {
          font-size: 14px;
          color: var(--text-muted);
          margin-top: 4px;
        }

        .guide-grid {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 40px;
          align-items: flex-start;
        }

        .guide-sidebar {
          display: flex;
          flex-direction: column;
          gap: 8px;
          background: var(--bg-input);
          padding: 16px;
          border-radius: var(--border-radius-md);
          border: 1px solid var(--border-color);
        }

        .guide-menu-btn {
          width: 100%;
          text-align: left;
          padding: 12px 16px;
          font-family: var(--font-title);
          font-size: 13.5px;
          font-weight: 600;
          color: var(--text-muted);
          background: transparent;
          border: none;
          border-radius: var(--border-radius-sm);
          cursor: pointer;
          transition: all var(--transition-fast);
          outline: none;
        }

        .guide-menu-btn:hover {
          background: var(--border-color);
          color: var(--text-main);
          padding-left: 20px;
        }

        .guide-menu-btn.active {
          background: var(--color-primary);
          color: #ffffff;
        }

        .guide-content {
          min-height: 400px;
        }

        .guide-content h3 {
          font-size: 22px;
          font-weight: 800;
          color: var(--text-main);
          border-bottom: 2px solid var(--border-color);
          padding-bottom: 10px;
          margin-bottom: 20px;
        }

        .guide-content h4 {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-main);
          margin-top: 24px;
          margin-bottom: 12px;
        }

        .guide-content p {
          font-size: 14.5px;
          line-height: 1.6;
          color: var(--text-muted);
        }

        .alert-box {
          background: rgba(15, 74, 134, 0.05);
          border-left: 4px solid var(--color-primary);
          padding: 16px;
          border-radius: 0 var(--border-radius-sm) var(--border-radius-sm) 0;
          font-size: 13.5px;
          color: var(--text-main);
        }

        .guide-img-wrapper {
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-md);
          padding: 16px;
          text-align: center;
        }

        .guide-screenshot {
          max-width: 100%;
          height: auto;
          border-radius: var(--border-radius-sm);
          box-shadow: var(--box-shadow);
          border: 1px solid var(--border-color);
        }

        .img-caption {
          display: block;
          margin-top: 10px;
          font-size: 12px;
          color: var(--text-muted);
          font-style: italic;
        }

        /* Responsive */
        @media (max-width: 992px) {
          .guide-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .guide-sidebar {
            flex-direction: row;
            overflow-x: auto;
            white-space: nowrap;
            gap: 12px;
            padding: 12px;
          }

          .guide-menu-btn {
            width: auto;
            padding: 8px 16px;
          }

          .guide-menu-btn:hover {
            padding-left: 16px;
          }
        }
      `})]})},Nr=()=>{let{uiKit:e}=rr(),[t,n]=(0,v.useState)([]);return(0,v.useEffect)(()=>{let e=Array.from({length:25}).map((e,t)=>({id:t,size:Math.random()*100+50,left:Math.random()*100,delay:Math.random()*8,duration:Math.random()*15+12,opacity:Math.random()*.3+.25}));n(e)},[]),(0,q.jsxs)(`div`,{className:`js-bubbles-container no-print`,children:[t.map(e=>(0,q.jsx)(`div`,{className:`js-bubble`,style:{width:`${e.size}px`,height:`${e.size}px`,left:`${e.left}%`,animationDelay:`${e.delay}s`,animationDuration:`${e.duration}s`,opacity:e.opacity,background:`radial-gradient(circle, rgba(15, 74, 134, 0.85) 0%, rgba(15, 74, 134, 0) 70%)`}},e.id)),(0,q.jsx)(`style`,{children:`
        .js-bubbles-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          z-index: 1;
          pointer-events: none;
        }

        .js-bubble {
          position: absolute;
          bottom: -130px;
          border-radius: 50%;
          animation: floatUp infinite linear;
        }

        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(0.8);
            opacity: 0;
          }
          10% {
            opacity: var(--bubble-opacity, 0.12);
          }
          90% {
            opacity: var(--bubble-opacity, 0.12);
          }
          100% {
            transform: translateY(-115vh) scale(1.25);
            opacity: 0;
          }
        }
      `})]})},Pr=({onSelectBranch:e})=>{let{user:t,switchActiveBranch:n,activeBranch:r}=rr(),[i,a]=(0,v.useState)([]),[o,s]=(0,v.useState)(!0),[c,l]=(0,v.useState)(null),[u,d]=(0,v.useState)(null);(0,v.useEffect)(()=>{(async()=>{s(!0),l(null);try{let e=await K.get(`/v1/branches`),t=e.data.branches||e.data||[];a(t)}catch{l(`Impossible de charger la liste des boutiques.`)}finally{s(!1)}})()},[]);let f=async t=>{d(t.id);let r=await n(t.id);d(null),r.success?e&&e(t):l(r.error||`Impossible de sélectionner cette boutique.`)};return(0,q.jsxs)(`div`,{className:`branch-selection-container`,children:[(0,q.jsxs)(`div`,{className:`branch-selection-card`,children:[(0,q.jsxs)(`div`,{className:`branch-header-badge`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-store me-2`}),` Espaces de travail`]}),(0,q.jsx)(`h2`,{className:`branch-title`,children:`Sélectionnez votre Boutique de travail`}),(0,q.jsxs)(`p`,{className:`branch-subtitle`,children:[`Bienvenue, `,(0,q.jsx)(`strong`,{children:t?.name}),`. Veuillez choisir la boutique dans laquelle vous souhaitez opérer aujourd'hui. Toutes vos actions seront rattachées à cet espace.`]}),c&&(0,q.jsxs)(`div`,{className:`alert alert-danger mb-4 d-flex align-items-center gap-2`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-circle-exclamation`}),` `,c]}),o?(0,q.jsxs)(`div`,{className:`text-center py-5`,children:[(0,q.jsx)(`div`,{className:`spinner-border text-primary`,role:`status`,children:(0,q.jsx)(`span`,{className:`visually-hidden`,children:`Chargement...`})}),(0,q.jsx)(`p`,{className:`mt-3 text-muted`,children:`Chargement de vos boutiques...`})]}):(0,q.jsx)(`div`,{className:`branches-grid`,children:i.map(e=>{let t=r?.id===e.id,n=u===e.id;return(0,q.jsxs)(`div`,{className:`branch-workspace-card ${t?`active`:``}`,children:[(0,q.jsxs)(`div`,{className:`d-flex justify-content-between align-items-start mb-3`,children:[(0,q.jsx)(`div`,{className:`branch-icon-box`,children:(0,q.jsx)(`i`,{className:`fa-solid fa-shop`})}),(0,q.jsx)(`span`,{className:`badge ${e.status===`open`?`bg-success`:`bg-warning`}`,children:e.status===`open`?`Ouverte`:`Fermée`})]}),(0,q.jsx)(`h4`,{className:`branch-name`,children:e.name}),(0,q.jsxs)(`p`,{className:`branch-type`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-location-dot me-1`}),` `,e.address||`Siège principal`]}),(0,q.jsx)(`button`,{className:`btn w-100 ${t?`btn-outline-primary`:`btn-primary`} mt-3`,onClick:()=>f(e),disabled:n,children:n?(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(`span`,{className:`spinner-border spinner-border-sm me-2`,role:`status`}),`Connexion à la boutique...`]}):t?(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(`i`,{className:`fa-solid fa-check me-2`}),` Espace actuel (Continuer)`]}):(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(`i`,{className:`fa-solid fa-arrow-right-to-bracket me-2`}),` Ouvrir cet espace`]})})]},e.id)})})]}),(0,q.jsx)(`style`,{children:`
        .branch-selection-container {
          min-height: 85vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
        }

        .branch-selection-card {
          width: 100%;
          max-width: 900px;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          padding: 40px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }

        .branch-header-badge {
          display: inline-block;
          padding: 6px 16px;
          border-radius: 20px;
          background: rgba(59, 130, 246, 0.1);
          color: var(--color-primary);
          font-weight: 700;
          font-size: 13px;
          margin-bottom: 16px;
        }

        .branch-title {
          font-family: var(--font-title);
          font-weight: 800;
          font-size: 28px;
          margin-bottom: 8px;
        }

        .branch-subtitle {
          color: var(--text-muted);
          font-size: 15px;
          margin-bottom: 32px;
        }

        .branches-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 24px;
        }

        .branch-workspace-card {
          background: var(--bg-input);
          border: 2px solid var(--border-color);
          border-radius: 16px;
          padding: 24px;
          transition: all 0.25s ease;
        }

        .branch-workspace-card:hover {
          border-color: var(--color-primary);
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.15);
        }

        .branch-workspace-card.active {
          border-color: var(--color-primary);
          background: rgba(59, 130, 246, 0.04);
        }

        .branch-icon-box {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--color-primary), #10b981);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .branch-name {
          font-family: var(--font-title);
          font-weight: 700;
          font-size: 18px;
          margin-bottom: 4px;
        }

        .branch-type {
          font-size: 13px;
          color: var(--text-muted);
          margin-bottom: 0;
        }
      `})]})};function Fr(){let{user:e,activeBranch:t}=rr(),[n,r]=(0,v.useState)(`home`),[i,a]=(0,v.useState)(!1),o=(0,v.useRef)(null);(0,v.useEffect)(()=>{e&&(e.role?.slug||e.role?.name||e.role)===`super-admin`&&[`catalog`,`suppliers`,`customers`,`purchases`,`stocks`,`transfers`,`cash-sessions`,`sales`,`pos`,`reports`,`settings`,`branches`].includes(n)&&r(`backoffice`)},[e,n]),(0,v.useEffect)(()=>{let e=e=>{i&&o.current&&!o.current.contains(e.target)&&a(!1)};return document.addEventListener(`mousedown`,e),()=>document.removeEventListener(`mousedown`,e)},[i]),(0,v.useEffect)(()=>(document.body.style.overflow=i?`hidden`:``,()=>{document.body.style.overflow=``}),[i]);let s=e=>{r(e),a(!1)},c=e?.role?.slug||e?.role?.name||e?.role,l=c===`super-admin`,u=c===`admin`||c===`gerant`,d=c===`admin`||l,f=()=>{if(e&&d&&!t&&n!==`select-branch`&&!l)return(0,q.jsx)(Pr,{onSelectBranch:()=>s(`home`)});switch(n){case`home`:return(0,q.jsx)(Tr,{setActiveTab:r});case`register`:return(0,q.jsx)(Er,{setActiveTab:r});case`auth`:return(0,q.jsx)(or,{setActiveTab:r});case`select-branch`:return(0,q.jsx)(Pr,{onSelectBranch:()=>s(`home`)});case`catalog`:return(0,q.jsx)(cr,{});case`suppliers`:return(0,q.jsx)(lr,{});case`customers`:return(0,q.jsx)(ur,{});case`purchases`:return(0,q.jsx)(dr,{});case`stocks`:return(0,q.jsx)(pr,{});case`transfers`:return(0,q.jsx)(mr,{});case`cash-sessions`:return(0,q.jsx)(hr,{});case`sales`:return(0,q.jsx)(fr,{});case`pos`:return(0,q.jsx)(Sr,{});case`audit`:return(0,q.jsx)(Cr,{});case`reports`:return(0,q.jsx)(wr,{});case`backoffice`:return(0,q.jsx)(Or,{});case`settings`:return(0,q.jsx)(kr,{});case`branches`:return(0,q.jsx)(Ar,{});case`users-mgmt`:return(0,q.jsx)(jr,{});case`userguide`:return(0,q.jsx)(Mr,{});default:return(0,q.jsx)(Tr,{setActiveTab:r})}},p=[{tab:`home`,icon:`fa-house`,label:`Accueil`,show:!0},{tab:`auth`,icon:e?`fa-user`:`fa-key`,label:e?`Mon Profil`:`Connexion`,show:!0},{tab:`register`,icon:`fa-pen-to-square`,label:`S'inscrire`,show:!e},{tab:`catalog`,icon:`fa-box`,label:`Catalogue`,show:!!(e&&!l)},{tab:`suppliers`,icon:`fa-handshake`,label:`Fournisseurs`,show:!!(e&&!l)},{tab:`customers`,icon:`fa-users`,label:`Clients`,show:!!(e&&!l)},{tab:`purchases`,icon:`fa-truck-ramp-box`,label:`Achats`,show:!!(e&&!l)},{tab:`stocks`,icon:`fa-layer-group`,label:`Stocks`,show:!!(e&&!l)},{tab:`transfers`,icon:`fa-right-left`,label:`Transferts`,show:!!(e&&!l)},{tab:`cash-sessions`,icon:`fa-money-bill-wave`,label:`Caisses`,show:!!(e&&!l)},{tab:`sales`,icon:`fa-receipt`,label:`Ventes`,show:!!(e&&!l)},{tab:`pos`,icon:`fa-cash-register`,label:`POS`,show:!!(e&&!l)},{tab:`branches`,icon:`fa-store`,label:`Boutiques`,show:!!(e&&!l&&(c===`admin`||c===`gerant`))},{tab:`users-mgmt`,icon:`fa-users-gear`,label:`Personnel`,show:!!(e&&d)},{tab:`audit`,icon:`fa-shield-halved`,label:`Audit`,show:!!(e&&(l||u))},{tab:`reports`,icon:`fa-chart-line`,label:`Rapports`,show:!!(e&&u)},{tab:`backoffice`,icon:`fa-gears`,label:`Back-office`,show:!!(e&&l)},{tab:`settings`,icon:`fa-sliders`,label:`Paramètres`,show:!!(e&&u)},{tab:`userguide`,icon:`fa-book-open`,label:`Aide & Guide`,show:!!e}].filter(e=>e.show);return(0,q.jsxs)(q.Fragment,{children:[(0,q.jsxs)(`header`,{className:`app-main-navbar`,children:[(0,q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`12px`},children:[(0,q.jsxs)(`button`,{className:`burger-btn`,onClick:()=>a(!0),"aria-label":`Ouvrir le menu`,children:[(0,q.jsx)(`span`,{}),(0,q.jsx)(`span`,{}),(0,q.jsx)(`span`,{})]}),(0,q.jsxs)(`div`,{className:`navbar-logo`,onClick:()=>s(`home`),style:{cursor:`pointer`},children:[(0,q.jsx)(`img`,{src:ar,alt:`Logo`,className:`navbar-logo-img`}),(0,q.jsxs)(`span`,{children:[(0,q.jsx)(`span`,{className:`logo-text-apex`,children:`Apex`}),(0,q.jsx)(`span`,{className:`logo-text-pos`,children:`POS`})]})]}),e&&!l&&(d?(0,q.jsxs)(`button`,{className:`navbar-branch-pill-btn`,onClick:()=>s(`select-branch`),title:`Changer d'espace de travail / boutique active`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-store text-primary`}),(0,q.jsx)(`span`,{className:`branch-pill-name`,children:t?.name||`Sélectionner une boutique`}),(0,q.jsx)(`i`,{className:`fa-solid fa-chevron-down ms-1 text-muted`,style:{fontSize:`10px`}})]}):(0,q.jsxs)(`div`,{className:`navbar-branch-badge-readonly`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-shop text-success me-1`}),(0,q.jsx)(`span`,{children:t?.name||e?.branch?.name||`Ma Boutique`})]}))]}),(0,q.jsx)(`div`,{className:`navbar-links`,children:p.map(({tab:e,icon:t,label:r})=>(0,q.jsxs)(`button`,{className:`navbar-tab-btn ${n===e?`active`:``}`,onClick:()=>s(e),children:[(0,q.jsx)(`i`,{className:`fa-solid ${t} me-1`}),` `,r]},e))})]}),(0,q.jsx)(`div`,{className:`drawer-overlay ${i?`open`:``}`,onClick:()=>a(!1)}),(0,q.jsxs)(`nav`,{ref:o,className:`side-drawer ${i?`open`:``}`,children:[(0,q.jsxs)(`div`,{className:`drawer-header`,children:[(0,q.jsxs)(`div`,{className:`drawer-logo`,children:[(0,q.jsx)(`img`,{src:ar,alt:`Logo`,className:`navbar-logo-img`}),(0,q.jsxs)(`span`,{children:[(0,q.jsx)(`span`,{className:`logo-text-apex`,children:`Apex`}),(0,q.jsx)(`span`,{className:`logo-text-pos`,children:`POS`})]})]}),(0,q.jsx)(`button`,{className:`drawer-close-btn`,onClick:()=>a(!1),"aria-label":`Fermer`,children:(0,q.jsx)(`i`,{className:`fa-solid fa-xmark`})})]}),(0,q.jsx)(`div`,{className:`drawer-links`,children:p.map(({tab:e,icon:t,label:r})=>(0,q.jsxs)(`button`,{className:`drawer-link-btn ${n===e?`active`:``}`,onClick:()=>s(e),children:[(0,q.jsx)(`i`,{className:`fa-solid ${t}`}),(0,q.jsx)(`span`,{children:r})]},e))}),e&&(0,q.jsx)(`div`,{className:`drawer-footer`,children:(0,q.jsxs)(`div`,{className:`drawer-user-info`,children:[(0,q.jsx)(`i`,{className:`fa-solid fa-circle-user`,style:{fontSize:`28px`,color:`var(--color-primary)`}}),(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`div`,{style:{fontWeight:700,fontSize:`14px`},children:e.name}),(0,q.jsx)(`div`,{style:{fontSize:`11px`,color:`var(--text-muted)`},children:e.email})]})]})})]}),f(),(0,q.jsx)(Nr,{}),(0,q.jsx)(`style`,{children:`
        .app-main-navbar {
          position: fixed; top: 0; left: 0; right: 0;
          min-height: 64px;
          background: var(--bg-card);
          border-bottom: 1px solid var(--border-color);
          box-shadow: var(--box-shadow);
          backdrop-filter: var(--backdrop-blur);
          z-index: 500;
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 40px; gap: 16px;
          transition: all var(--transition-normal);
        }

        /* BURGER */
        .burger-btn {
          display: none;
          flex-direction: column; justify-content: center; align-items: center; gap: 5px;
          width: 40px; height: 40px;
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          cursor: pointer; padding: 8px;
          transition: all var(--transition-fast);
          flex-shrink: 0;
        }
        .burger-btn:hover { background: var(--color-primary); border-color: var(--color-primary); }
        .burger-btn:hover span { background: #fff; }
        .burger-btn span {
          display: block; width: 20px; height: 2px;
          background: var(--text-main); border-radius: 2px;
          transition: all var(--transition-fast);
        }

        /* OVERLAY */
        .drawer-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(3px);
          z-index: 900; opacity: 0; pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .drawer-overlay.open { opacity: 1; pointer-events: all; }

        /* DRAWER */
        .side-drawer {
          position: fixed; top: 0; left: 0; bottom: 0;
          width: 280px; max-width: 85vw;
          background: var(--bg-card);
          border-right: 1px solid var(--border-color);
          box-shadow: 6px 0 40px rgba(0,0,0,0.25);
          z-index: 1000;
          display: flex; flex-direction: column;
          transform: translateX(-100%);
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }
        .side-drawer.open { transform: translateX(0); }

        .drawer-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid var(--border-color);
          background: var(--bg-input);
          flex-shrink: 0;
        }
        .drawer-logo {
          font-family: var(--font-title); font-weight: 800; font-size: 18px;
          display: flex; align-items: center; gap: 10px;
        }
        .drawer-close-btn {
          width: 34px; height: 34px; border-radius: 50%;
          background: var(--bg-card); border: 1px solid var(--border-color);
          color: var(--text-main); cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; transition: all var(--transition-fast); flex-shrink: 0;
        }
        .drawer-close-btn:hover { background: #ef4444; color: #fff; border-color: #ef4444; }

        .drawer-links {
          flex: 1; overflow-y: auto;
          padding: 12px;
          display: flex; flex-direction: column; gap: 4px;
        }
        .drawer-links::-webkit-scrollbar { width: 4px; }
        .drawer-links::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 2px; }

        .drawer-link-btn {
          display: flex; align-items: center; gap: 14px;
          width: 100%; padding: 12px 16px;
          border-radius: 12px; background: transparent; border: none;
          color: var(--text-muted);
          font-family: var(--font-title); font-weight: 600; font-size: 14px;
          cursor: pointer; text-align: left;
          transition: all var(--transition-fast);
        }
        .drawer-link-btn i { width: 20px; text-align: center; font-size: 15px; flex-shrink: 0; }
        .drawer-link-btn:hover { background: var(--bg-input); color: var(--text-main); transform: translateX(4px); }
        .drawer-link-btn.active {
          background: linear-gradient(135deg, var(--color-primary), #10b981);
          color: #fff;
          box-shadow: 0 4px 12px rgba(59,130,246,0.3);
        }

        .drawer-footer {
          padding: 16px 20px;
          border-top: 1px solid var(--border-color);
          background: var(--bg-input); flex-shrink: 0;
        }
        .drawer-user-info { display: flex; align-items: center; gap: 12px; }

        /* LOGO */
        .navbar-logo {
          font-family: var(--font-title); font-weight: 800; font-size: 22px;
          display: flex; align-items: center; gap: 12px;
          user-select: none; transition: transform var(--transition-fast) ease;
        }
        .navbar-logo:hover { transform: scale(1.02); }
        .navbar-logo-img {
          width: 38px; height: 38px; border-radius: 50%; object-fit: cover;
          border: 2px solid var(--color-primary);
          box-shadow: 0 0 10px rgba(59,130,246,0.2);
          transition: all var(--transition-normal);
        }
        .navbar-logo:hover .navbar-logo-img { box-shadow: 0 0 15px var(--color-primary); transform: rotate(5deg); }
        .logo-text-apex {
          background: linear-gradient(135deg, #3b82f6 0%, #10b981 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 900;
        }
        .logo-text-pos {
          color: var(--text-main); font-weight: 600; font-size: 18px;
          background: rgba(59,130,246,0.1); padding: 2px 8px; border-radius: 6px;
          margin-left: 2px; border: 1px solid rgba(59,130,246,0.2);
        }

        /* DESKTOP NAV */
        .navbar-links { display: flex; gap: 8px; flex-wrap: wrap; }
        .navbar-tab-btn {
          background: transparent; border: none; color: var(--text-muted);
          font-family: var(--font-title); font-weight: 600; font-size: 13px;
          padding: 6px 12px; cursor: pointer;
          border-radius: var(--border-radius-sm);
          transition: all var(--transition-fast); white-space: nowrap;
        }
        .navbar-tab-btn:hover { color: var(--text-main); background: var(--bg-input); }
        .navbar-tab-btn.active { color: #fff; background: var(--color-primary); }

        /* BRANCH SELECTOR PILL */
        .navbar-branch-pill-btn {
          display: flex; align-items: center; gap: 8px;
          background: rgba(59,130,246,0.08);
          border: 1px solid rgba(59,130,246,0.25);
          color: var(--text-main);
          padding: 5px 12px; border-radius: 20px;
          font-family: var(--font-title); font-weight: 600; font-size: 13px;
          cursor: pointer; transition: all var(--transition-fast);
          margin-left: 10px;
        }
        .navbar-branch-pill-btn:hover {
          background: rgba(59,130,246,0.18);
          border-color: var(--color-primary);
          transform: translateY(-1px);
        }
        .branch-pill-name {
          max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }

        .navbar-branch-badge-readonly {
          display: flex; align-items: center; gap: 6px;
          background: rgba(16,185,129,0.08);
          border: 1px solid rgba(16,185,129,0.25);
          color: var(--text-main);
          padding: 4px 10px; border-radius: 20px;
          font-family: var(--font-title); font-weight: 600; font-size: 12px;
          margin-left: 10px;
        }

        /* MOBILE */
        @media (max-width: 768px) {
          .app-main-navbar { padding: 10px 16px; min-height: 58px; }
          .burger-btn { display: flex; }
          .navbar-links { display: none; }
          .navbar-logo { font-size: 18px; }
          .navbar-logo-img { width: 32px; height: 32px; }
          .logo-text-pos { font-size: 15px; }
        }
      `})]})}function Ir(){return(0,q.jsxs)(nr,{children:[(0,q.jsx)(ir,{}),(0,q.jsx)(Fr,{})]})}(0,y.createRoot)(document.getElementById(`root`)).render((0,q.jsx)(v.StrictMode,{children:(0,q.jsx)(Ir,{})}));