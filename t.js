(function(){
'use strict';
var RE=/TizenTube/gi;
function repl(s){return typeof s==='string'?s.replace(RE,'AztvTube'):s}
function deep(o,seen){if(!o||typeof o!=='object')return o;seen=seen||new WeakSet();if(seen.has(o))return o;seen.add(o);if(Array.isArray(o)){for(var i=0;i<o.length;i++){if(typeof o[i]==='string')o[i]=repl(o[i]);else deep(o[i],seen)}return o}for(var k in o){try{if(typeof o[k]==='string')o[k]=repl(o[k]);else deep(o[k],seen)}catch(e){}}return o}
try{var jp=JSON.parse;if(!jp.__aztv){JSON.parse=function(){return deep(jp.apply(this,arguments))};JSON.parse.__aztv=true}}catch(e){}
function brandRoot(root){if(!root)return;try{if(root.nodeType===3){if(root.nodeValue)root.nodeValue=repl(root.nodeValue);return}var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),n;while((n=w.nextNode()))if(n.nodeValue)n.nodeValue=repl(n.nodeValue);var els=root.querySelectorAll?root.querySelectorAll('*'):[];for(var i=0;i<els.length;i++){var el=els[i];['title','aria-label','placeholder','alt','value'].forEach(function(a){try{var v=el.getAttribute&&el.getAttribute(a);if(v&&/TizenTube/i.test(v))el.setAttribute(a,repl(v))}catch(e){}});if(el.shadowRoot)brandRoot(el.shadowRoot)}}catch(e){}}
function brandAll(){try{document.title=repl(document.title||'AztvTube');brandRoot(document.documentElement)}catch(e){}}
try{var oldAttach=Element.prototype.attachShadow;if(oldAttach&&!oldAttach.__aztv){Element.prototype.attachShadow=function(){var r=oldAttach.apply(this,arguments);setTimeout(function(){brandRoot(r)},0);return r};Element.prototype.attachShadow.__aztv=true}}catch(e){}
function observe(){brandAll();try{new MutationObserver(function(ms){for(var i=0;i<ms.length;i++){var m=ms[i];if(m.target)brandRoot(m.target);if(m.addedNodes)for(var j=0;j<m.addedNodes.length;j++)brandRoot(m.addedNodes[j])}}).observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true})}catch(e){}setInterval(brandAll,500)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',observe,{once:true});else observe();
var CORE='https://cdn.jsdelivr.net/npm/@foxreis/tizentube/dist/userScript.js?v='+Date.now();
function load(){try{var s=document.createElement('script');s.src=CORE;s.async=false;s.defer=false;s.onload=brandAll;s.onerror=function(){setTimeout(load,1200)};(document.head||document.documentElement).appendChild(s)}catch(e){setTimeout(load,1200)}}
load();
})();