(function(){
'use strict';
var base='https://raw.githubusercontent.com/AlexRamirez503/AlexRamirez503/main/live.js';
var u=base+'?aztv='+Date.now()+'-'+Math.random().toString(36).slice(2);
function load(){
  try{
    var x=new XMLHttpRequest();
    x.open('GET',u,false);
    x.setRequestHeader('Cache-Control','no-cache, no-store, max-age=0');
    x.setRequestHeader('Pragma','no-cache');
    x.send(null);
    if((x.status>=200&&x.status<300)||x.status===0){
      (0,eval)(x.responseText+'\n//# sourceURL=aztvtube-live.js');
      return true;
    }
  }catch(e){}
  return false;
}
if(!load()){
  var s=document.createElement('script');
  s.src=u;
  s.async=false;
  (document.head||document.documentElement).appendChild(s);
}
})();
