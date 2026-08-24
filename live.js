(function(){
'use strict';
var ORIGINAL='https://cdn.jsdelivr.net/npm/@00sanoj00/rtxtube@1.3.3/dist/userScript.js';
var CINEMA_KEY='aztvtube-cinema-mode';
var BRAND=/TizenTube/g;
var hideTimer=null;

function remoteBanner(){
  try{
    var old=document.getElementById('aztv-live-proof');if(old)old.remove();
    var d=document.createElement('div');d.id='aztv-live-proof';d.textContent='AZTV REMOTO ACTIVO 2';
    d.style.cssText='position:fixed;top:92px;right:24px;z-index:2147483647;background:#111;color:#fff;border:2px solid #00c853;border-radius:10px;padding:14px 20px;font-size:24px;font-weight:700;font-family:sans-serif;';
    (document.body||document.documentElement).appendChild(d);
    setTimeout(function(){try{d.remove();}catch(e){}},6000);
  }catch(e){}
}
function cinemaOn(){try{return localStorage.getItem(CINEMA_KEY)==='1';}catch(e){return false;}}
function ensureStyle(){if(document.getElementById('aztvtube-cinema-style'))return;var st=document.createElement('style');st.id='aztvtube-cinema-style';st.textContent='html.aztv-cinema,html.aztv-cinema body{background:#000!important}html.aztv-cinema.aztv-hide-controls ytlr-progress-bar,html.aztv-cinema.aztv-hide-controls ytlr-redux-connect-ytlr-progress-bar,html.aztv-cinema.aztv-hide-controls [class*="player-control"],html.aztv-cinema.aztv-hide-controls [class*="watch-control"],html.aztv-cinema.aztv-hide-controls [class*="player-overlay"],html.aztv-cinema.aztv-hide-controls [class*="watch-metadata"]{opacity:0!important;visibility:hidden!important;pointer-events:none!important;transition:opacity .2s linear!important}[data-aztv-cinema-row="1"]{cursor:pointer!important}';(document.head||document.documentElement).appendChild(st);}
function showControls(){clearTimeout(hideTimer);document.documentElement.classList.remove('aztv-hide-controls');if(!cinemaOn())return;hideTimer=setTimeout(function(){var v=document.querySelector('video');if(v&&!v.paused)document.documentElement.classList.add('aztv-hide-controls');},3500);}
function applyCinema(v){ensureStyle();document.documentElement.classList.toggle('aztv-cinema',!!v);if(v)showControls();else{clearTimeout(hideTimer);document.documentElement.classList.remove('aztv-hide-controls');}}
function patchBrand(root){try{root=root||document.body;if(!root)return;var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),n;while((n=w.nextNode()))if(n.nodeValue&&n.nodeValue.indexOf('TizenTube')>=0)n.nodeValue=n.nodeValue.replace(BRAND,'AztvTube');}catch(e){}}
function allText(root){var a=[];try{var w=document.createTreeWalker(root||document.body,NodeFilter.SHOW_TEXT),n;while((n=w.nextNode()))if((n.nodeValue||'').trim())a.push(n);}catch(e){}return a;}
function findCodec(){var a=allText(document.body);for(var i=0;i<a.length;i++){var s=(a[i].nodeValue||'').trim().toLowerCase();if(s.indexOf('códec de video preferido')>=0||s.indexOf('codec de video preferido')>=0||s.indexOf('preferred video codec')>=0)return a[i];}return null;}
function chooseRow(node){var el=node&&node.parentElement;for(var i=0;i<8&&el&&el!==document.body;i++,el=el.parentElement){try{var r=el.getBoundingClientRect(),sib=el.parentElement&&el.parentElement.children&&el.parentElement.children.length>=3;if(r.height>=35&&r.height<=180&&sib)return el;}catch(e){}}return node&&node.parentElement;}
function refreshCinemaRow(){var row=document.querySelector('[data-aztv-cinema-row="1"]');if(!row)return;var nodes=allText(row);if(nodes[0])nodes[0].nodeValue='Modo Cine';if(nodes[1])nodes[1].nodeValue=cinemaOn()?'Activado':'Desactivado';row.setAttribute('aria-label','Modo Cine '+(cinemaOn()?'Activado':'Desactivado'));}
function saveCinema(v){try{localStorage.setItem(CINEMA_KEY,v?'1':'0');}catch(e){}applyCinema(v);refreshCinemaRow();}
function injectCinemaRow(){if(document.querySelector('[data-aztv-cinema-row="1"]')){refreshCinemaRow();return;}var tn=findCodec();if(!tn)return;var row=chooseRow(tn);if(!row||!row.parentElement)return;var clone=row.cloneNode(true);try{if(clone.id)clone.removeAttribute('id');clone.querySelectorAll('[id]').forEach(function(x){x.removeAttribute('id');});}catch(e){}var nodes=allText(clone);if(nodes[0])nodes[0].nodeValue='Modo Cine';if(nodes[1])nodes[1].nodeValue=cinemaOn()?'Activado':'Desactivado';for(var i=2;i<nodes.length;i++)nodes[i].nodeValue='';clone.setAttribute('data-aztv-cinema-row','1');clone.setAttribute('aria-label','Modo Cine '+(cinemaOn()?'Activado':'Desactivado'));var toggle=function(ev){if(ev&&ev.type==='keydown'&&![13,32].includes(ev.keyCode))return;if(ev){ev.preventDefault();ev.stopPropagation();}saveCinema(!cinemaOn());};clone.addEventListener('click',toggle,true);clone.addEventListener('keydown',toggle,true);row.parentElement.insertBefore(clone,row.nextSibling);}
function enhancements(){ensureStyle();applyCinema(cinemaOn());patchBrand(document.body);injectCinemaRow();try{var obs=new MutationObserver(function(){patchBrand(document.body);injectCinemaRow();});if(document.body)obs.observe(document.body,{subtree:true,childList:true,characterData:true});}catch(e){}['keydown','keyup','click','mousemove','pointermove'].forEach(function(ev){addEventListener(ev,showControls,true);});setInterval(function(){var v=document.querySelector('video');if(v&&!v.__aztvCinemaBound){v.__aztvCinemaBound=true;v.addEventListener('play',showControls);v.addEventListener('pause',function(){document.documentElement.classList.remove('aztv-hide-controls');});}injectCinemaRow();},1000);}
function afterOriginal(){if(document.body){remoteBanner();enhancements();}else addEventListener('DOMContentLoaded',function(){remoteBanner();enhancements();},{once:true});}

// The cached c.js on Fire TV loads live.js directly. Restore the original private-server script here first.
var s=document.createElement('script');
s.src=ORIGINAL+'?restore='+Date.now();
s.async=false;
s.onload=afterOriginal;
s.onerror=function(){if(document.body)remoteBanner();else addEventListener('DOMContentLoaded',remoteBanner,{once:true});console.error('AztvTube: no se pudo restaurar el script original');};
(document.head||document.documentElement).appendChild(s);
})();
