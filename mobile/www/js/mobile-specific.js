// TODO: try to load from website
var data = offlinedata;

var readyEvent = function(handler){
  $(document).ready(function(){
    if(!window.device)
      $(document).bind('deviceready', handler);
    else
      handler();
  });
};

