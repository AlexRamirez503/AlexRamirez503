(function(){
'use strict';
var ORIGINAL='https://cdn.jsdelivr.net/npm/@00sanoj00/rtxtube/dist/userScript.js?ver=';
var LIVE='https://raw.githubusercontent.com/AlexRamirez503/AlexRamirez503/main/live.js';

function banner(){
  try{
    var d=document.createElement('div');
    d.id='aztv-remote-ok';
    d.textContent='AZTV REMOTO OK';
    d.style.cssText='position:fixed;top:24px;right:24px;z-index:2147483647;background:#111;color:#fff;border:2px solid #e53935;border-radius:10px;padding:14px 20px;font-size:24px;font-weight:700;font-family:sans-serif;';
    (document.body||document.documentElement).appendChild(d);
    setTimeout(function(){try{d.remove();}catch(e){}},3500);
  }catch(e){}
}

function loadLive(){
  var u=LIVE+'?aztv='+Date.now()+'-'+Math.random().toString(36).slice(2);
  try{
    var x=new XMLHttpRequest();
    x.open('GET',u,false);
    x.setRequestHeader('Cache-Control','no-cache, no-store, max-age=0');
    x.setRequestHeader('Pragma','no-cache');
    x.send(null);
    if((x.status>=200&&x.status<300)||x.status===0){
      (0,eval)(x.responseText+'\n//# sourceURL=aztvtube-live.js');
      return;
    }
  }catch(e){}
  var s=document.createElement('script');
  s.src=u;
  s.async=false;
  (document.head||document.documentElement).appendChild(s);
}

function boot(){
  if(document.body)banner();else addEventListener('DOMContentLoaded',banner,{once:true});
  loadLive();
}

// Load the exact original rtxtube script FIRST. This restores the server/settings behavior.
var original=document.createElement('script');
original.src=ORIGINAL+Date.now();
original.async=false;
original.onload=boot;
original.onerror=function(){console.error('AztvTube: no se pudo cargar el script original');};
(document.head||document.documentElement).appendChild(original);
})();
