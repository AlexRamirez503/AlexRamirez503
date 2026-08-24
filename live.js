(function(){
  'use strict';
  const ORIGINAL='https://cdn.jsdelivr.net/npm/@00sanoj00/rtxtube@1.3.3/dist/userScript.js';
  const CINEMA_KEY='aztvtube-cinema-mode';
  const BRAND=/TizenTube/g;
  let hideTimer=null;

  function cinemaOn(){try{return localStorage.getItem(CINEMA_KEY)==='1';}catch(e){return false;}}
  function saveCinema(v){try{localStorage.setItem(CINEMA_KEY,v?'1':'0');}catch(e){} applyCinema(v); refreshCinemaRow();}

  function ensureStyle(){
    if(document.getElementById('aztvtube-cinema-style'))return;
    const st=document.createElement('style');
    st.id='aztvtube-cinema-style';
    st.textContent=`
      html.aztv-cinema,html.aztv-cinema body{background:#000!important}
      html.aztv-cinema.aztv-hide-controls ytlr-progress-bar,
      html.aztv-cinema.aztv-hide-controls ytlr-redux-connect-ytlr-progress-bar,
      html.aztv-cinema.aztv-hide-controls [class*="player-control"],
      html.aztv-cinema.aztv-hide-controls [class*="watch-control"],
      html.aztv-cinema.aztv-hide-controls [class*="player-overlay"],
      html.aztv-cinema.aztv-hide-controls [class*="watch-metadata"]{opacity:0!important;visibility:hidden!important;pointer-events:none!important;transition:opacity .2s linear!important}
      [data-aztv-cinema-row="1"]{cursor:pointer!important}
    `;
    (document.head||document.documentElement).appendChild(st);
  }

  function showControls(){
    clearTimeout(hideTimer);
    document.documentElement.classList.remove('aztv-hide-controls');
    if(!cinemaOn())return;
    hideTimer=setTimeout(()=>{
      const v=document.querySelector('video');
      if(v&&!v.paused)document.documentElement.classList.add('aztv-hide-controls');
    },3500);
  }

  function applyCinema(v){
    ensureStyle();
    document.documentElement.classList.toggle('aztv-cinema',!!v);
    if(v)showControls(); else {clearTimeout(hideTimer);document.documentElement.classList.remove('aztv-hide-controls');}
  }

  function patchBrand(root){
    try{
      root=root||document.body;if(!root)return;
      const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;
      while((n=w.nextNode()))if(n.nodeValue&&n.nodeValue.includes('TizenTube'))n.nodeValue=n.nodeValue.replace(BRAND,'AztvTube');
    }catch(e){}
  }

  function text(el){return (el&&el.textContent||'').trim();}
  function findCodecTextNode(){
    if(!document.body)return null;
    const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
    while((n=w.nextNode())){
      const s=(n.nodeValue||'').trim().toLowerCase();
      if(s.includes('códec de video preferido')||s.includes('codec de video preferido')||s.includes('preferred video codec'))return n;
    }
    return null;
  }

  function chooseRow(node){
    let el=node&&node.parentElement;
    for(let i=0;i<7&&el&&el!==document.body;i++,el=el.parentElement){
      const r=el.getBoundingClientRect?el.getBoundingClientRect():null;
      const focusable=el.hasAttribute('tabindex')||el.getAttribute('role')==='button'||el.tagName.includes('ITEM')||el.tagName.includes('LINK');
      const siblingish=el.parentElement&&el.parentElement.children&&el.parentElement.children.length>=3;
      if(r&&r.height>=35&&r.height<=180&&(focusable||siblingish))return el;
    }
    return node&&node.parentElement;
  }

  function cleanCloneIds(el){
    try{if(el.id)el.removeAttribute('id');el.querySelectorAll('[id]').forEach(x=>x.removeAttribute('id'));}catch(e){}
  }

  function rewriteClone(clone){
    const nodes=[];const w=document.createTreeWalker(clone,NodeFilter.SHOW_TEXT);let n;
    while((n=w.nextNode()))if((n.nodeValue||'').trim())nodes.push(n);
    if(nodes.length){nodes[0].nodeValue='Modo Cine';if(nodes[1])nodes[1].nodeValue=cinemaOn()?'Activado':'Desactivado';}
    clone.setAttribute('data-aztv-cinema-row','1');
    clone.setAttribute('aria-label','Modo Cine '+(cinemaOn()?'Activado':'Desactivado'));
  }

  function refreshCinemaRow(){
    document.querySelectorAll('[data-aztv-cinema-row="1"]').forEach(row=>{
      const w=document.createTreeWalker(row,NodeFilter.SHOW_TEXT);let n;const nodes=[];
      while((n=w.nextNode()))if((n.nodeValue||'').trim())nodes.push(n);
      if(nodes[0])nodes[0].nodeValue='Modo Cine';
      if(nodes[1])nodes[1].nodeValue=cinemaOn()?'Activado':'Desactivado';
      row.setAttribute('aria-label','Modo Cine '+(cinemaOn()?'Activado':'Desactivado'));
    });
  }

  function injectCinemaRow(){
    if(document.querySelector('[data-aztv-cinema-row="1"]')){refreshCinemaRow();return;}
    const tn=findCodecTextNode();if(!tn)return;
    const row=chooseRow(tn);if(!row||!row.parentElement)return;
    const clone=row.cloneNode(true);cleanCloneIds(clone);rewriteClone(clone);
    const toggle=function(ev){
      if(ev&&ev.type==='keydown'&&!['Enter',' ','NumpadEnter'].includes(ev.key)&&![13,32].includes(ev.keyCode))return;
      if(ev){ev.preventDefault();ev.stopPropagation();}
      saveCinema(!cinemaOn());
    };
    clone.addEventListener('click',toggle,true);
    clone.addEventListener('keydown',toggle,true);
    row.parentElement.insertBefore(clone,row.nextSibling);
  }

  function initEnhancements(){
    ensureStyle();applyCinema(cinemaOn());patchBrand(document.body);injectCinemaRow();
    const obs=new MutationObserver(()=>{patchBrand(document.body);injectCinemaRow();});
    if(document.body)obs.observe(document.body,{subtree:true,childList:true,characterData:true});
    ['keydown','keyup','click','mousemove','pointermove'].forEach(ev=>addEventListener(ev,showControls,true));
    setInterval(()=>{
      const v=document.querySelector('video');
      if(v&&!v.__aztvCinemaBound){v.__aztvCinemaBound=true;v.addEventListener('play',showControls);v.addEventListener('pause',()=>document.documentElement.classList.remove('aztv-hide-controls'));}
      injectCinemaRow();
    },1000);
  }

  const s=document.createElement('script');
  s.src=ORIGINAL+'?aztv='+Date.now();
  s.onload=()=>{if(document.body)initEnhancements();else addEventListener('DOMContentLoaded',initEnhancements,{once:true});};
  s.onerror=()=>console.error('AztvTube: no se pudo cargar el script original');
  (document.head||document.documentElement).appendChild(s);
})();
