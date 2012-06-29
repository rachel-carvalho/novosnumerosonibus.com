// TODO: try to load from website
var data = offlinedata;

var readyEvent = function(handler){
  var newhandler = function(){
    navigator.splashscreen.hide();
    handler();
  };
  $(document).ready(function(){
    if(!window.device)
      $(document).bind('deviceready', newhandler);
    else
      newhandler();
  });
};

