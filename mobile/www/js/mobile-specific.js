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

var has_pos_fix = true;
var pos_fix_support = {Android: 2.2, iPhone: 5, iPad: 5};

var readyEvent = function(handler){
  var go = function() {
    var save_search = function(){
      localStorage.last_search = JSON.stringify({type: this.id, value: this.value});
    };
    
    $('input').keydown(save_search).keyup(save_search).blur(save_search);
    
    var info = $('#info');
    var main = $('#main');
    
    $('#open-info').click(function(){
      info.toggleClass('hidden');
      main.toggleClass('hidden');
    });
    
    var end = device.platform.indexOf(' ');
    if(end < 0) end = device.platform.length;
    var p = device.platform.substr(0, end);
    var v = parseFloat(device.version.substr(0, 3));
    
    has_pos_fix = pos_fix_support[p] && pos_fix_support[p] <= v;
    
    if(!has_pos_fix)
      $('#footer').css('position', 'static');
    
    $(window).resize(function(){
      if(has_pos_fix)
        $('body').css('padding-bottom', $('#footer').outerHeight());
    });
        
    handler();
    if(localStorage.last_search){
      var s = JSON.parse(localStorage.last_search);
      $('#' + s.type).val(s.value).blur();
    }
    navigator.splashscreen.hide();
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

