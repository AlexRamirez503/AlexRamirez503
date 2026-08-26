(function(){
'use strict';
var CORE='https://cdn.jsdelivr.net/npm/@foxreis/tizentube/dist/userScript.js?v='+Date.now();
function loadCore(){try{var s=document.createElement('script');s.src=CORE;s.async=false;s.defer=false;s.onerror=function(){setTimeout(loadCore,1200)};(document.head||document.documentElement).appendChild(s)}catch(e){setTimeout(loadCore,1200)}}
function showIntro(){try{if(window.__aztvIntroShown)return;window.__aztvIntroShown=true;var wrap=document.createElement('div');wrap.id='aztv-intro';wrap.style.cssText='position:fixed;inset:0;z-index:2147483647;background:#000;display:flex;align-items:center;justify-content:center;';var v=document.createElement('video');v.autoplay=true;v.playsInline=true;v.controls=false;v.style.cssText='width:100%;height:100%;object-fit:cover;background:#000;';v.src='file:///android_asset/intro.mp4';function done(){try{v.pause()}catch(e){};try{wrap.remove()}catch(e){if(wrap.parentNode)wrap.parentNode.removeChild(wrap)}}v.addEventListener('ended',done,{once:true});v.addEventListener('error',done,{once:true});wrap.appendChild(v);(document.body||document.documentElement).appendChild(wrap);try{var p=v.play();if(p&&p.catch)p.catch(function(){})}catch(e){}}catch(e){}}
loadCore();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',showIntro,{once:true});else showIntro();
})();