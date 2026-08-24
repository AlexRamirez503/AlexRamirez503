(function(){
  'use strict';
  const ORIGINAL='https://cdn.jsdelivr.net/npm/@00sanoj00/rtxtube@1.3.3/dist/userScript.js';
  const re=/TizenTube/g;

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

  function startBrandObserver(){
    patchVisibleText(document.body);
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
            }else if(node.nodeType===Node.ELEMENT_NODE){
              patchVisibleText(node);
            }
          }
        }
      }
    });
    observer.observe(document.body,{subtree:true,childList:true,characterData:true});
  }

  // Load the original script immediately in this same execution path.
  // This avoids the timing change caused by appending a second async <script> element.
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

  if(!loaded){
    const s=document.createElement('script');
    s.src=ORIGINAL+'?aztv-fallback='+Date.now();
    s.onload=function(){
      if(document.body)startBrandObserver();
      else addEventListener('DOMContentLoaded',startBrandObserver,{once:true});
    };
    s.onerror=function(){console.error('AztvTube: failed to load original rtxtube script');};
    (document.head||document.documentElement).appendChild(s);
    return;
  }

  if(document.body)startBrandObserver();
  else addEventListener('DOMContentLoaded',startBrandObserver,{once:true});
})();
