(function(){
  'use strict';

  const ORIGINAL='https://cdn.jsdelivr.net/npm/@00sanoj00/rtxtube@1.3.3/dist/userScript.js';
  const BRAND_RE=/TizenTube/g;
  const CINEMA_KEY='aztvtube-cinema-mode';
  let hideTimer=null;

  function cinemaEnabled(){try{return localStorage.getItem(CINEMA_KEY)==='1';}catch(e){return false;}}
  function saveCinema(v){try{localStorage.setItem(CINEMA_KEY,v?'1':'0');}catch(e){} applyCinema(v);}

  function ensureStyle(){
    if(document.getElementById('aztvtube-cinema-style'))return;
    const s=document.createElement('style');
    s.id='aztvtube-cinema-style';
    s.textContent=`
      html.aztvtube-cinema,html.aztvtube-cinema body{background:#000!important;overflow:hidden!important}
      html.aztvtube-cinema video{background:#000!important;max-width:100vw!important;max-height:100vh!important}
      html.aztvtube-cinema.aztvtube-cinema-hide ytlr-redux-connect-ytlr-progress-bar,
      html.aztvtube-cinema.aztvtube-cinema-hide ytlr-progress-bar,
      html.aztvtube-cinema.aztvtube-cinema-hide [class*="player-controls"],
      html.aztvtube-cinema.aztvtube-cinema-hide [class*="watch-controls"],
      html.aztvtube-cinema.aztvtube-cinema-hide [class*="player-overlay"],
      html.aztvtube-cinema.aztvtube-cinema-hide [class*="watch-metadata"]{
        opacity:0!important;visibility:hidden!important;pointer-events:none!important;transition:opacity .2s linear!important
      }
    `;
    (document.head||document.documentElement).appendChild(s);
  }

  function scheduleHide(){
    clearTimeout(hideTimer);
    document.documentElement.classList.remove('aztvtube-cinema-hide');
    if(!cinemaEnabled())return;
    hideTimer=setTimeout(()=>{
      const v=document.querySelector('video');
      if(v&&!v.paused)document.documentElement.classList.add('aztvtube-cinema-hide');
    },3500);
  }

  function applyCinema(on){
    ensureStyle();
    document.documentElement.classList.toggle('aztvtube-cinema',!!on);
    if(on)scheduleHide();
    else{clearTimeout(hideTimer);document.documentElement.classList.remove('aztvtube-cinema-hide');}
    console.info('AztvTube Modo Cine',on?'ACTIVADO':'DESACTIVADO');
  }

  function renameString(s){return typeof s==='string'?s.replace(BRAND_RE,'AztvTube'):s;}
  function renameDeep(o,seen){
    if(!o||typeof o!=='object')return o;
    seen=seen||new WeakSet();if(seen.has(o))return o;seen.add(o);
    if(Array.isArray(o)){for(let i=0;i<o.length;i++){if(typeof o[i]==='string')o[i]=renameString(o[i]);else renameDeep(o[i],seen);}return o;}
    for(const k of Object.keys(o)){try{if(typeof o[k]==='string')o[k]=renameString(o[k]);else renameDeep(o[k],seen);}catch(e){}}
    return o;
  }

  function titleOf(item){
    try{
      const r=item.compactLinkRenderer||item.settingActionRenderer||item.settingBooleanRenderer||item.settingSingleOptionMenuRenderer;
      const t=r&&r.title;
      if(!t)return'';
      if(typeof t.simpleText==='string')return t.simpleText;
      if(Array.isArray(t.runs))return t.runs.map(x=>x.text||'').join('');
    }catch(e){}
    return'';
  }

  function cinemaItem(){
    const on=cinemaEnabled();
    return {compactLinkRenderer:{
      title:{simpleText:'Modo Cine'},
      subtitle:{simpleText:on?'Activado':'Desactivado'},
      icon:{iconType:'MOVIE'},
      secondaryIcon:{iconType:on?'CHECK_BOX':'CHECK_BOX_OUTLINE_BLANK'},
      serviceEndpoint:{signalAction:{customAction:{action:'AZTV_CINEMA_TOGGLE',parameters:[]}}}
    }};
  }

  function looksLikePlayerSettings(arr){
    if(!Array.isArray(arr)||arr.length<2)return false;
    const titles=arr.map(titleOf).filter(Boolean).join('|').toLowerCase();
    const es=(titles.includes('calidad de video preferida')&&titles.includes('códec de video preferido'))||
             (titles.includes('parchear interfaz del reproductor')&&titles.includes('incrementos de ajuste de velocidad'));
    const en=(titles.includes('preferred video quality')&&titles.includes('preferred video codec'))||
             (titles.includes('video player')&&titles.includes('speed'));
    return es||en;
  }

  function injectCinemaAnywhere(root,seen){
    if(!root||typeof root!=='object')return;
    seen=seen||new WeakSet();if(seen.has(root))return;seen.add(root);
    if(Array.isArray(root)){
      if(looksLikePlayerSettings(root)&&!root.some(x=>titleOf(x)==='Modo Cine'))root.push(cinemaItem());
      for(const x of root)injectCinemaAnywhere(x,seen);
      return;
    }
    for(const k of Object.keys(root))try{injectCinemaAnywhere(root[k],seen);}catch(e){}
  }

  function hasCinemaAction(o,seen){
    if(!o||typeof o!=='object')return false;
    seen=seen||new WeakSet();if(seen.has(o))return false;seen.add(o);
    if(o.action==='AZTV_CINEMA_TOGGLE')return true;
    for(const k of Object.keys(o))try{if(hasCinemaAction(o[k],seen))return true;}catch(e){}
    return false;
  }

  function patchObject(o){renameDeep(o);injectCinemaAnywhere(o);return o;}

  function replaceDom(){
    try{
      const root=document.body;if(!root)return;
      const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;
      while((n=w.nextNode()))if(n.nodeValue&&n.nodeValue.includes('TizenTube'))n.nodeValue=n.nodeValue.replace(BRAND_RE,'AztvTube');
    }catch(e){}
  }

  function installHooks(){
    const previousParse=JSON.parse;
    if(!previousParse.__aztvCinema2){
      const wrapped=function(){return patchObject(previousParse.apply(this,arguments));};
      wrapped.__aztvCinema2=true;
      JSON.parse=wrapped;
      try{for(const k in window._yttv)if(window._yttv[k]&&window._yttv[k].JSON)window._yttv[k].JSON.parse=wrapped;}catch(e){}
    }

    function hookResolvers(){
      try{
        for(const k in window._yttv){
          const inst=window._yttv[k]&&window._yttv[k].instance;
          if(!inst||!inst.resolveCommand||inst.resolveCommand.__aztvCinema2)continue;
          const prev=inst.resolveCommand;
          const wrapped=function(cmd,arg){
            try{
              if(hasCinemaAction(cmd)){saveCinema(!cinemaEnabled());return true;}
              patchObject(cmd);
            }catch(e){console.warn('AztvTube resolver patch',e);}
            return prev.call(this,cmd,arg);
          };
          wrapped.__aztvCinema2=true;
          inst.resolveCommand=wrapped;
        }
      }catch(e){}
    }

    hookResolvers();setInterval(hookResolvers,750);
    const mo=new MutationObserver(()=>replaceDom());
    if(document.body)mo.observe(document.body,{subtree:true,childList:true,characterData:true});
    else addEventListener('DOMContentLoaded',()=>mo.observe(document.body,{subtree:true,childList:true,characterData:true}),{once:true});

    ['keydown','keyup','mousemove','pointermove','click'].forEach(ev=>addEventListener(ev,scheduleHide,true));
    setInterval(()=>{
      const v=document.querySelector('video');
      if(v&&!v.__aztvCinema2){
        v.__aztvCinema2=true;
        v.addEventListener('play',scheduleHide);
        v.addEventListener('pause',()=>document.documentElement.classList.remove('aztvtube-cinema-hide'));
      }
    },750);

    applyCinema(cinemaEnabled());
    replaceDom();
  }

  const s=document.createElement('script');
  s.src=ORIGINAL+'?aztvtube2='+Date.now();
  s.onload=()=>{try{installHooks();}catch(e){console.error('AztvTube patch failed',e);}};
  s.onerror=()=>console.error('AztvTube: no se pudo cargar el script base');
  (document.head||document.documentElement).appendChild(s);
})();
