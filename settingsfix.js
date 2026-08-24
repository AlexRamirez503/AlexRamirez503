(function(){
'use strict';
var ORIGINAL='https://cdn.jsdelivr.net/npm/@00sanoj00/rtxtube@1.3.3/dist/userScript.js';
try{
  document.write('<script src="'+ORIGINAL+'"><\/script>');
}catch(e){
  var s=document.createElement('script');s.src=ORIGINAL;s.async=false;(document.head||document.documentElement).appendChild(s);
}
function patch(){
  try{
    if(!document.body)return;
    var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),n;
    while((n=w.nextNode())){
      if(n.nodeValue&&n.nodeValue.indexOf('TizenTube')>=0){n.nodeValue=n.nodeValue.replace(/TizenTube/g,'AztvTube');}
    }
  }catch(e){}
}
function start(){patch();try{new MutationObserver(patch).observe(document.body,{subtree:true,childList:true,characterData:true});}catch(e){} }
if(document.readyState==='loading')addEventListener('DOMContentLoaded',start,{once:true});else start();
})();