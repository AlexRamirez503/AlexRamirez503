(function(){
'use strict';
var ORIGINAL='https://cdn.jsdelivr.net/npm/@00sanoj00/rtxtube@1.3.3/dist/userScript.js';
var LIVE='https://raw.githubusercontent.com/AlexRamirez503/AlexRamirez503/main/live.js';

function banner(){
  try{
    var d=document.createElement('div');
    d.id='aztv-remote-ok';
    d.textContent='AZTV REMOTO OK';
    d.style.cssText='position:fixed;top:24px;right:24px;z-index:2147483647;background:#111;color:#fff;border:2px solid #e53935;border-radius:10px;padding:14px 20px;font-size:24px;font-weight:700;font-family:sans-serif;';
    (document.body||document.documentElement).appendChild(d);
    setTimeout(function(){try{d.remove();}catch(e){}},3000);
  }catch(e){}
}

function loadLiveLater(){
  setTimeout(function(){
    var u=LIVE+'?aztv='+Date.now()+'-'+Math.random().toString(36).slice(2);
    try{
      var s=document.createElement('script');
      s.src=u;
      s.async=true;
      s.onerror=function(){console.error('AztvTube: no se pudo cargar live.js');};
      (document.head||document.documentElement).appendChild(s);
    }catch(e){}
  },8000);
}

var originalLoaded=false;
try{
  var x=new XMLHttpRequest();
  x.open('GET',ORIGINAL,false);
  x.send(null);
  if((x.status>=200&&x.status<300)||x.status===0){
    (0,eval)(x.responseText+'\n//# sourceURL=rtxtube-original.js');
    originalLoaded=true;
  }
}catch(e){console.warn('AztvTube original sync load failed',e);}

function afterOriginal(){
  if(document.body)banner();else addEventListener('DOMContentLoaded',banner,{once:true});
  loadLiveLater();
}

if(originalLoaded){
  afterOriginal();
}else{
  var s=document.createElement('script');
  s.src=ORIGINAL;
  s.async=false;
  s.onload=afterOriginal;
  s.onerror=function(){console.error('AztvTube: no se pudo cargar el script original');};
  (document.head||document.documentElement).appendChild(s);
}
})();
