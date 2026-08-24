(function(){
  'use strict';

  const ORIGINAL='https://cdn.jsdelivr.net/npm/@00sanoj00/rtxtube@1.3.3/dist/userScript.js';
  const BRAND_FROM=/TizenTube/g;
  const BRAND_TO='AztvTube';
  const CINEMA_KEY='aztvtube-cinema-mode';
  let hideTimer=null;

  function cinemaEnabled(){
    try{return localStorage.getItem(CINEMA_KEY)==='1';}catch(e){return false;}
  }
  function setCinemaEnabled(v){
    try{localStorage.setItem(CINEMA_KEY,v?'1':'0');}catch(e){}
    applyCinema(v,true);
  }
  function ensureCinemaStyle(){
    if(document.getElementById('aztvtube-cinema-style')) return;
    const s=document.createElement('style');
    s.id='aztvtube-cinema-style';
    s.textContent=`
      html.aztvtube-cinema, html.aztvtube-cinema body { background:#000 !important; }
      html.aztvtube-cinema.aztvtube-cinema-hide [class*="player-control"],
      html.aztvtube-cinema.aztvtube-cinema-hide [class*="watch-control"],
      html.aztvtube-cinema.aztvtube-cinema-hide [class*="player-overlay"],
      html.aztvtube-cinema.aztvtube-cinema-hide [class*="watch-metadata"],
      html.aztvtube-cinema.aztvtube-cinema-hide ytlr-progress-bar,
      html.aztvtube-cinema.aztvtube-cinema-hide ytlr-redux-connect-ytlr-progress-bar {
        opacity:0 !important;
        pointer-events:none !important;
        transition:opacity .2s linear !important;
      }
    `;
    (document.head||document.documentElement).appendChild(s);
  }
  function scheduleHide(){
    clearTimeout(hideTimer);
    document.documentElement.classList.remove('aztvtube-cinema-hide');
    if(!cinemaEnabled()) return;
    hideTimer=setTimeout(()=>{
      const v=document.querySelector('video');
      if(v && !v.paused) document.documentElement.classList.add('aztvtube-cinema-hide');
    },3500);
  }
  function applyCinema(on,showToast){
    ensureCinemaStyle();
    document.documentElement.classList.toggle('aztvtube-cinema',!!on);
    if(on) scheduleHide(); else {
      clearTimeout(hideTimer);
      document.documentElement.classList.remove('aztvtube-cinema-hide');
    }
    if(showToast) console.info('AztvTube Modo Cine:',on?'ON':'OFF');
  }

  function replaceString(s){ return typeof s==='string'?s.replace(BRAND_FROM,BRAND_TO):s; }
  function replaceDeep(obj,seen){
    if(!obj || typeof obj!=='object') return obj;
    seen=seen||new WeakSet(); if(seen.has(obj)) return obj; seen.add(obj);
    if(Array.isArray(obj)){ for(let i=0;i<obj.length;i++){ if(typeof obj[i]==='string') obj[i]=replaceString(obj[i]); else replaceDeep(obj[i],seen);} return obj; }
    for(const k of Object.keys(obj)){
      try{ if(typeof obj[k]==='string') obj[k]=replaceString(obj[k]); else replaceDeep(obj[k],seen); }catch(e){}
    }
    return obj;
  }

  function replaceDom(root){
    try{
      const w=document.createTreeWalker(root||document.body,NodeFilter.SHOW_TEXT);
      let n; while((n=w.nextNode())) if(n.nodeValue && n.nodeValue.indexOf('TizenTube')>=0) n.nodeValue=n.nodeValue.replace(BRAND_FROM,BRAND_TO);
    }catch(e){}
  }

  function cinemaMenuItem(){
    const on=cinemaEnabled();
    return {compactLinkRenderer:{
      title:{simpleText:'Modo Cine'},
      subtitle:{simpleText:on?'Activado':'Desactivado'},
      icon:{iconType:'MOVIE'},
      secondaryIcon:{iconType:on?'CHECK_BOX':'CHECK_BOX_OUTLINE_BLANK'},
      serviceEndpoint:{signalAction:{customAction:{action:'AZTV_CINEMA_TOGGLE',parameters:[]}}}
    }};
  }

  function installHooks(){
    const nativeParse=JSON.parse;
    if(!nativeParse.__aztvWrapped){
      const wrapped=function(){ return replaceDeep(nativeParse.apply(this,arguments)); };
      wrapped.__aztvWrapped=true;
      JSON.parse=wrapped;
      try{for(const k in window._yttv){ if(window._yttv[k]&&window._yttv[k].JSON) window._yttv[k].JSON.parse=wrapped; }}catch(e){}
    }

    function hookResolvers(){
      try{
        for(const k in window._yttv){
          const inst=window._yttv[k]&&window._yttv[k].instance;
          if(!inst||!inst.resolveCommand||inst.resolveCommand.__aztvWrapped) continue;
          const prev=inst.resolveCommand;
          const wrapped=function(cmd,arg){
            try{
              if(cmd&&cmd.customAction&&cmd.customAction.action==='AZTV_CINEMA_TOGGLE'){
                setCinemaEnabled(!cinemaEnabled());
                return true;
              }
              if(cmd&&cmd.signalAction&&cmd.signalAction.customAction&&cmd.signalAction.customAction.action==='AZTV_CINEMA_TOGGLE'){
                setCinemaEnabled(!cinemaEnabled());
                return true;
              }
              const popup=cmd&&cmd.openPopupAction;
              if(popup&&popup.uniqueId==='playback-settings'){
                const items=popup.popup&&popup.popup.overlaySectionRenderer&&popup.popup.overlaySectionRenderer.overlay&&popup.popup.overlaySectionRenderer.overlay.overlayTwoPanelRenderer&&popup.popup.overlaySectionRenderer.overlay.overlayTwoPanelRenderer.actionPanel&&popup.popup.overlaySectionRenderer.overlay.overlayTwoPanelRenderer.actionPanel.overlayPanelRenderer&&popup.popup.overlaySectionRenderer.overlay.overlayTwoPanelRenderer.actionPanel.overlayPanelRenderer.content&&popup.popup.overlaySectionRenderer.overlay.overlayTwoPanelRenderer.actionPanel.overlayPanelRenderer.content.overlayPanelItemListRenderer&&popup.popup.overlaySectionRenderer.overlay.overlayTwoPanelRenderer.actionPanel.overlayPanelRenderer.content.overlayPanelItemListRenderer.items;
                if(Array.isArray(items) && !items.some(x=>x&&x.compactLinkRenderer&&x.compactLinkRenderer.title&&x.compactLinkRenderer.title.simpleText==='Modo Cine')) items.push(cinemaMenuItem());
              }
              replaceDeep(cmd);
            }catch(e){console.warn('AztvTube hook error',e);}
            return prev.call(this,cmd,arg);
          };
          wrapped.__aztvWrapped=true;
          inst.resolveCommand=wrapped;
        }
      }catch(e){}
    }

    hookResolvers();
    setInterval(hookResolvers,1000);

    const obs=new MutationObserver(()=>replaceDom(document.body));
    if(document.body) obs.observe(document.body,{subtree:true,childList:true,characterData:true});
    else addEventListener('DOMContentLoaded',()=>obs.observe(document.body,{subtree:true,childList:true,characterData:true}),{once:true});

    ['keydown','mousemove','pointermove','click'].forEach(ev=>addEventListener(ev,scheduleHide,true));
    setInterval(()=>{
      const v=document.querySelector('video');
      if(v&&!v.__aztvCinemaBound){
        v.__aztvCinemaBound=true;
        v.addEventListener('play',scheduleHide);
        v.addEventListener('pause',()=>document.documentElement.classList.remove('aztvtube-cinema-hide'));
      }
    },1000);
    applyCinema(cinemaEnabled(),false);
  }

  const s=document.createElement('script');
  s.src=ORIGINAL+'?aztvtube='+Date.now();
  s.onload=function(){
    try{installHooks(); replaceDom(document.body);}catch(e){console.error('AztvTube patch failed',e);}
  };
  s.onerror=function(){console.error('AztvTube: no se pudo cargar el script base');};
  (document.head||document.documentElement).appendChild(s);
})();
