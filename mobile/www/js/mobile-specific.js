var remote_url = 'http://novosnumerosonibus.com/';

// while debugging
remote_url = 'http://192.168.1.101:3000/';

var data = offlinedata;

var readyEvent = function(handler){
  var go = function() {
    navigator.splashscreen.hide();
    handler();
  };
  
  var download_data = function(){
    $.getJSON(remote_url + 'data.json', function(d){
      data = d;
      alert('new data ' + d.updated_at);
      go();
    })
    .error(function(e) {
      alert('offline data (actual data)');
      go();
    });
  };

  var newhandler = function(){
    data.updated_at = new Date(data.updated_at);
    data.updated_at = new Date(2010,1,1);
    
    // try to load from website
    navigator.app.clearCache();
    $.getJSON(remote_url + 'data_info.json', function(i){
      var new_upd = new Date(i.updated_at);
      if(data.updated_at < new_upd) {
        download_data();
      }
      else {
        alert('data is up to date (' + data.updated_at + ', ' + new Date(i.updated_at) + ')');
        go();
      }
    })
    .error(function(e) {
      alert('offline data (data info)');
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

