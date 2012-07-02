var remote_url = 'http://novosnumerosonibus.com/';

// while debugging
remote_url = 'http://192.168.1.101:3000/';

window.data = offlinedata;

var persist_data = function(){
  localStorage.data = JSON.stringify(data);
  localStorage.updated_at = data.updated_at;
};

var purge_off_data = function(){
  if(window.offlinedata){
    window.offlinedata = null;
    delete window.offlinedata;
  }
};

var readyEvent = function(handler){
  var go = function() {
    navigator.splashscreen.hide();
    handler();
  };
  
  var download_data = function(){
    $.getJSON(remote_url + 'data.json', function(d){
      data = d;
      persist_data();
      purge_off_data();
      go();
    })
    .error(function(e) {
      go();
    });
  };

  var newhandler = function(){
    if(!localStorage.data)
      persist_data();
    else {
      data = JSON.parse(localStorage.data);
      purge_off_data();
    }
    
    data.updated_at = new Date(data.updated_at);
    
    // try to load from website
    navigator.app.clearCache();
    $.getJSON(remote_url + 'data_info.json', function(i){
      var new_upd = new Date(i.updated_at);
      if(data.updated_at < new_upd) {
        download_data();
      }
      else {
        go();
      }
    })
    .error(function(e) {
      go();
    });
  };

  $(document).ready(function(){
    if(!window.device)
      $(document).bind('deviceready', newhandler);
    else
      newhandler();
  });
};

