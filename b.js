(function(){
  'use strict';
  const ORIGINAL='https://cdn.jsdelivr.net/npm/@00sanoj00/rtxtube@1.3.3/dist/userScript.js';
  const re=/TizenTube/g;

  // IMPORTANT: Do not patch JSON.parse, resolveCommand, network data, or player data.
  // YouTube TV shares those paths and broad interception can prevent it from loading.
  function patchVisibleSettingsText(root){
    try{
      root=root||document.body;
      if(!root)return;
      const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
      let n;
      while((n=walker.nextNode())){
        const value=n.nodeValue;
        if(!value||value.indexOf('TizenTube')<0)continue;
        // Only alter visible branding strings. Internal identifiers remain untouched.
        n.nodeValue=value.replace(re,'AztvTube');
      }
    }catch(e){}
  }

  function startBrandObserver(){
    patchVisibleSettingsText(document.body);
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
              patchVisibleSettingsText(node);
            }
          }
        }
      }
    });
    observer.observe(document.body,{subtree:true,childList:true,characterData:true});
  }

  const s=document.createElement('script');
  s.src=ORIGINAL+'?aztv-safe='+Date.now();
  s.onload=function(){
    if(document.body)startBrandObserver();
    else addEventListener('DOMContentLoaded',startBrandObserver,{once:true});
  };
  s.onerror=function(){console.error('AztvTube: failed to load original rtxtube script');};
  (document.head||document.documentElement).appendChild(s);
})();
