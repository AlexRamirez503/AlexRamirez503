(function(){
  'use strict';
  const LIVE='https://raw.githubusercontent.com/AlexRamirez503/AlexRamirez503/main/live.js';
  try{
    const s=document.createElement('script');
    s.src=LIVE+'?t='+Date.now();
    s.async=false;
    s.onerror=function(){console.error('AztvTube: no se pudo cargar live.js');};
    (document.head||document.documentElement).appendChild(s);
  }catch(e){console.error('AztvTube remote loader failed',e);}
})();
