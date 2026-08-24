(function(){
  'use strict';
  const ORIGINAL='https://cdn.jsdelivr.net/npm/@00sanoj00/rtxtube@1.3.3/dist/userScript.js';
  const re=/TizenTube/g;

  function renameString(s){return typeof s==='string'?s.replace(re,'AztvTube'):s;}
  function renameDeep(o,seen){
    if(!o||typeof o!=='object')return o;
    seen=seen||new WeakSet();
    if(seen.has(o))return o;
    seen.add(o);
    if(Array.isArray(o)){
      for(let i=0;i<o.length;i++){
        try{if(typeof o[i]==='string')o[i]=renameString(o[i]);else renameDeep(o[i],seen);}catch(e){}
      }
      return o;
    }
    for(const k of Object.keys(o)){
      try{if(typeof o[k]==='string')o[k]=renameString(o[k]);else renameDeep(o[k],seen);}catch(e){}
    }
    return o;
  }

  function patchJSON(){
    try{
      const p=JSON.parse;
      if(!p.__aztvbrand){
        const w=function(){return renameDeep(p.apply(this,arguments));};
        w.__aztvbrand=true;
        JSON.parse=w;
      }
      for(const k in window._yttv){
        try{
          if(window._yttv[k]&&window._yttv[k].JSON&&window._yttv[k].JSON.parse&&!window._yttv[k].JSON.parse.__aztvbrand){
            const op=window._yttv[k].JSON.parse;
            const wp=function(){return renameDeep(op.apply(this,arguments));};
            wp.__aztvbrand=true;
            window._yttv[k].JSON.parse=wp;
          }
        }catch(e){}
      }
    }catch(e){}
  }

  function patchResolvers(){
    try{
      for(const k in window._yttv){
        const inst=window._yttv[k]&&window._yttv[k].instance;
        if(!inst||!inst.resolveCommand||inst.resolveCommand.__aztvbrand)continue;
        const prev=inst.resolveCommand;
        const wrapped=function(cmd,arg){
          try{renameDeep(cmd);renameDeep(arg);}catch(e){}
          return prev.call(this,cmd,arg);
        };
        wrapped.__aztvbrand=true;
        inst.resolveCommand=wrapped;
      }
    }catch(e){}
  }

  function patchDOM(){
    try{
      if(!document.body)return;
      const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
      let n;
      while((n=w.nextNode())){
        if(n.nodeValue&&n.nodeValue.indexOf('TizenTube')>=0)n.nodeValue=n.nodeValue.replace(re,'AztvTube');
      }
    }catch(e){}
  }

  patchJSON();
  const timer=setInterval(()=>{patchJSON();patchResolvers();patchDOM();},300);

  const s=document.createElement('script');
  s.src=ORIGINAL+'?aztvbrand='+Date.now();
  s.onload=function(){patchJSON();patchResolvers();patchDOM();};
  s.onerror=function(){console.error('AztvTube: failed to load original rtxtube script');};
  (document.head||document.documentElement).appendChild(s);
})();
