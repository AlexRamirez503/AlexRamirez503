(function(){
'use strict';
var ORIGINAL='https://cdn.jsdelivr.net/npm/@00sanoj00/rtxtube@1.3.3/dist/userScript.js';
var LIVE='https://raw.githubusercontent.com/AlexRamirez503/AlexRamirez503/main/live-v2.js';
function show(){try{var d=document.createElement('div');d.textContent='AZTV REMOTO V2 PRUEBA 3';d.style.cssText='position:fixed;top:24px;right:24px;z-index:2147483647;background:#111;color:#fff;border:2px solid #e53935;border-radius:10px;padding:14px 20px;font-size:24px;font-weight:700;font-family:sans-serif';(document.body||document.documentElement).appendChild(d);setTimeout(function(){try{d.remove()}catch(e){}},4000)}catch(e){}}
function loadLive(){var u=LIVE+'?t='+Date.now()+'-'+Math.random().toString(36).slice(2);try{var s=document.createElement('script');s.src=u;s.async=true;(document.head||document.documentElement).appendChild(s)}catch(e){}}
var s=document.createElement('script');s.src=ORIGINAL+'?r2='+Date.now();s.async=false;s.onload=function(){if(document.body)show();else addEventListener('DOMContentLoaded',show,{once:true});setTimeout(loadLive,6000)};s.onerror=function(){console.error('AztvTube V2: original script failed')};(document.head||document.documentElement).appendChild(s);
})();