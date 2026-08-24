(function(){
  'use strict';
  const ORIGINAL='https://cdn.jsdelivr.net/npm/@00sanoj00/rtxtube@1.3.3/dist/userScript.js';
  const RE=/TizenTube/g;

  function renameTextNodes(root){
    try{
      root=root||document.body;
      if(!root)return;
      if(root.nodeType===3){
        if(root.nodeValue&&root.nodeValue.indexOf('TizenTube')!==-1)root.nodeValue=root.nodeValue.replace(RE,'AztvTube');
        return;
      }
      const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
      let n;
      while((n=walker.nextNode())){
        if(n.nodeValue&&n.nodeValue.indexOf('TizenTube')!==-1)n.nodeValue=n.nodeValue.replace(RE,'AztvTube');
      }
    }catch(e){console.warn('AztvTube renameTextNodes',e);}
  }

  function renameAttrs(root){
    try{
      const all=(root||document).querySelectorAll('[aria-label],[title]');
      all.forEach(el=>{
        for(const a of ['aria-label','title']){
          const v=el.getAttribute(a);
          if(v&&v.indexOf('TizenTube')!==-1)el.setAttribute(a,v.replace(RE,'AztvTube'));
        }
      });
    }catch(e){}
  }

  function renameAll(){renameTextNodes(document.body);renameAttrs(document);}

  const s=document.createElement('script');
  s.src=ORIGINAL+'?aztvbrand='+Date.now();
  s.onload=function(){
    renameAll();
    const mo=new MutationObserver(muts=>{
      for(const m of muts){
        if(m.type==='characterData'&&m.target)renameTextNodes(m.target);
        for(const n of m.addedNodes||[])renameTextNodes(n);
      }
      renameAttrs(document);
    });
    if(document.body)mo.observe(document.body,{subtree:true,childList:true,characterData:true});
    setInterval(renameAll,800);
  };
  s.onerror=function(){console.error('AztvTube: no se pudo cargar el script original');};
  (document.head||document.documentElement).appendChild(s);
})();
