(function(){
'use strict';
var ORIGINAL='https://cdn.jsdelivr.net/npm/@foxreis/tizentube/dist/userScript.js';
try{document.write('<script src="'+ORIGINAL+'"><\/script>')}catch(e){var s=document.createElement('script');s.src=ORIGINAL;s.async=false;(document.head||document.documentElement).appendChild(s)}

var sx=0,sy=0,st=0,moved=false;
function nearestActionable(el){
  if(!el||el===document)return null;
  var cur=el;
  for(var i=0;i<8&&cur&&cur!==document.body;i++,cur=cur.parentElement){
    try{
      if(cur.matches&&cur.matches('button,a,[role="button"],[tabindex],ytlr-button,ytlr-icon-button,ytlr-tile-renderer,ytlr-guide-entry-renderer,ytlr-menu-item-renderer,ytlr-settings-row-renderer'))return cur;
      if(cur.hasAttribute&&cur.hasAttribute('aria-label'))return cur;
    }catch(e){}
  }
  return el;
}
function fire(el,type){
  try{el.dispatchEvent(new MouseEvent(type,{bubbles:true,cancelable:true,view:window,button:0}))}catch(e){}
}
function activate(target){
  var el=nearestActionable(target); if(!el)return;
  try{if(el.focus)el.focus({preventScroll:true})}catch(e){try{el.focus()}catch(_){} }
  fire(el,'mousedown');fire(el,'mouseup');fire(el,'click');
  try{el.click&&el.click()}catch(e){}
  try{el.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',code:'Enter',keyCode:13,which:13,bubbles:true,cancelable:true}))}catch(e){}
  try{el.dispatchEvent(new KeyboardEvent('keyup',{key:'Enter',code:'Enter',keyCode:13,which:13,bubbles:true,cancelable:true}))}catch(e){}
}
function start(e){var t=e.touches&&e.touches[0];if(!t)return;sx=t.clientX;sy=t.clientY;st=Date.now();moved=false}
function move(e){var t=e.touches&&e.touches[0];if(!t)return;if(Math.abs(t.clientX-sx)>14||Math.abs(t.clientY-sy)>14)moved=true}
function end(e){if(moved||Date.now()-st>700)return;var t=e.changedTouches&&e.changedTouches[0];var target=(t&&document.elementFromPoint)?document.elementFromPoint(t.clientX,t.clientY):e.target;activate(target)}
function init(){
  document.addEventListener('touchstart',start,{passive:true,capture:true});
  document.addEventListener('touchmove',move,{passive:true,capture:true});
  document.addEventListener('touchend',end,{passive:true,capture:true});
  document.documentElement.style.touchAction='manipulation';
}
if(document.readyState==='loading')addEventListener('DOMContentLoaded',init,{once:true});else init();
})();