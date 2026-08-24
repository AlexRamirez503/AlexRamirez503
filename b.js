(function(){
  'use strict';
  const ORIGINAL='https://cdn.jsdelivr.net/npm/@00sanoj00/rtxtube@1.3.3/dist/userScript.js';
  const re=/TizenTube/g;
  const CINEMA_KEY='aztvtube-cinema-mode';
  let cinemaTimer=null;

  function cinemaOn(){try{return localStorage.getItem(CINEMA_KEY)==='1';}catch(e){return false;}}
  function saveCinema(v){try{localStorage.setItem(CINEMA_KEY,v?'1':'0');}catch(e){} applyCinema(v); updateCinemaLabel();}

  function ensureCinemaStyle(){
    if(document.getElementById('aztvtube-cinema-style'))return;
    const s=document.createElement('style');
    s.id='aztvtube-cinema-style';
    s.textContent=`
      html.aztvtube-cinema,html.aztvtube-cinema body{background:#000!important}
      html.aztvtube-cinema video{background:#000!important}
      html.aztvtube-cinema.aztvtube-cinema-hide ytlr-redux-connect-ytlr-progress-bar,
      html.aztvtube-cinema.aztvtube-cinema-hide ytlr-progress-bar,
      html.aztvtube-cinema.aztvtube-cinema-hide [class*="player-control"],
      html.aztvtube-cinema.aztvtube-cinema-hide [class*="watch-control"],
      html.aztvtube-cinema.aztvtube-cinema-hide [class*="player-overlay"],
      html.aztvtube-cinema.aztvtube-cinema-hide [class*="watch-metadata"]{
        opacity:0!important;visibility:hidden!important;pointer-events:none!important;transition:opacity .2s linear!important
      }
    `;
    (document.head||document.documentElement).appendChild(s);
  }

  function showControlsThenHide(){
    clearTimeout(cinemaTimer);
    document.documentElement.classList.remove('aztvtube-cinema-hide');
    if(!cinemaOn())return;
    cinemaTimer=setTimeout(function(){
      const v=document.querySelector('video');
      if(v&&!v.paused)document.documentElement.classList.add('aztvtube-cinema-hide');
    },3500);
  }

  function applyCinema(on){
    ensureCinemaStyle();
    document.documentElement.classList.toggle('aztvtube-cinema',!!on);
    if(on)showControlsThenHide();
    else{clearTimeout(cinemaTimer);document.documentElement.classList.remove('aztvtube-cinema-hide');}
  }

  function patchVisibleText(root){
    try{
      root=root||document.body;
      if(!root)return;
      const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
      let n;
      while((n=walker.nextNode())){
        const v=n.nodeValue;
        if(v&&v.indexOf('TizenTube')>=0)n.nodeValue=v.replace(re,'AztvTube');
      }
    }catch(e){}
  }

  function allTextNodes(root){
    const out=[];
    try{
      const w=document.createTreeWalker(root||document.body,NodeFilter.SHOW_TEXT);
      let n;while((n=w.nextNode()))out.push(n);
    }catch(e){}
    return out;
  }

  function findTextNode(text){
    const nodes=allTextNodes(document.body);
    return nodes.find(n=>(n.nodeValue||'').trim()===text)||nodes.find(n=>(n.nodeValue||'').includes(text));
  }

  function rowAncestor(node){
    if(!node)return null;
    let el=node.parentElement,best=null;
    for(let i=0;el&&i<8;i++,el=el.parentElement){
      try{
        const r=el.getBoundingClientRect();
        if(r.width>250&&r.height>45&&r.height<180){best=el;break;}
      }catch(e){}
    }
    return best;
  }

  function updateCinemaLabel(){
    const row=document.getElementById('aztvtube-cinema-row');
    if(!row)return;
    const nodes=allTextNodes(row);
    let main=nodes.find(n=>(n.nodeValue||'').includes('Modo Cine'));
    if(main)main.nodeValue='Modo Cine — '+(cinemaOn()?'Activado':'Desactivado');
  }

  function injectCinemaRow(){
    try{
      if(document.getElementById('aztvtube-cinema-row')){updateCinemaLabel();return;}
      const title=findTextNode('Configuración del reproductor de video');
      const codec=findTextNode('Códec de video preferido');
      if(!title||!codec)return;
      const row=rowAncestor(codec);
      if(!row||!row.parentElement)return;
      const clone=row.cloneNode(true);
      clone.id='aztvtube-cinema-row';
      clone.removeAttribute('aria-selected');
      clone.setAttribute('tabindex','0');
      clone.style.cursor='pointer';
      const texts=allTextNodes(clone);
      let changed=false;
      for(const n of texts){
        const t=(n.nodeValue||'').trim();
        if(!changed&&t){n.nodeValue='Modo Cine — '+(cinemaOn()?'Activado':'Desactivado');changed=true;}
        else if(t)n.nodeValue='';
      }
      const toggle=function(e){
        if(e&&e.type==='keydown'&&![13,32].includes(e.keyCode))return;
        if(e){e.preventDefault();e.stopPropagation();}
        saveCinema(!cinemaOn());
      };
      clone.addEventListener('click',toggle,true);
      clone.addEventListener('keydown',toggle,true);
      row.parentElement.insertBefore(clone,row.nextSibling);
    }catch(e){console.warn('AztvTube cinema row error',e);}
  }

  function startObservers(){
    patchVisibleText(document.body);
    injectCinemaRow();
    if(!document.body)return;
    const observer=new MutationObserver(function(mutations){
      for(const m of mutations){
        if(m.type==='characterData'){
          const n=m.target;
          if(n&&n.nodeValue&&n.nodeValue.indexOf('TizenTube')>=0)n.nodeValue=n.nodeValue.replace(re,'AztvTube');
        }else{
          for(const node of m.addedNodes){
            if(node.nodeType===Node.TEXT_NODE){
              if(node.nodeValue&&node.nodeValue.indexOf('TizenTube')>=0)node.nodeValue=node.nodeValue.replace(re,'AztvTube');
            }else if(node.nodeType===Node.ELEMENT_NODE){patchVisibleText(node);}
          }
        }
      }
      injectCinemaRow();
    });
    observer.observe(document.body,{subtree:true,childList:true,characterData:true});
  }

  ['keydown','keyup','mousemove','pointermove','click'].forEach(ev=>addEventListener(ev,showControlsThenHide,true));
  setInterval(function(){
    const v=document.querySelector('video');
    if(v&&!v.__aztvCinemaBound){
      v.__aztvCinemaBound=true;
      v.addEventListener('play',showControlsThenHide);
      v.addEventListener('pause',()=>document.documentElement.classList.remove('aztvtube-cinema-hide'));
    }
  },1000);

  // Keep original rtxtube behavior. This wrapper only adds visible branding and DOM-only cinema mode.
  let loaded=false;
  try{
    const xhr=new XMLHttpRequest();
    xhr.open('GET',ORIGINAL+'?aztv-sync='+Date.now(),false);
    xhr.send(null);
    if((xhr.status>=200&&xhr.status<300)||xhr.status===0){
      (0,eval)(xhr.responseText+'\n//# sourceURL=rtxtube-original.js');
      loaded=true;
    }
  }catch(e){console.warn('AztvTube sync load failed',e);}

  function boot(){
    applyCinema(cinemaOn());
    if(document.body)startObservers();
    else addEventListener('DOMContentLoaded',startObservers,{once:true});
  }

  if(!loaded){
    const s=document.createElement('script');
    s.src=ORIGINAL+'?aztv-fallback='+Date.now();
    s.onload=boot;
    s.onerror=function(){console.error('AztvTube: failed to load original rtxtube script');boot();};
    (document.head||document.documentElement).appendChild(s);
  }else boot();
})();
