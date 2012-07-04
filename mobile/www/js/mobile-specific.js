var remote_url = 'http://novosnumerosonibus.com/';

// while debugging
remote_url = 'http://192.168.1.101:3000/';

if(navigator.appCodeName == 'Mozilla'){
  window.device = {platform: 'Android', version: '2.3'};
  navigator.app = {clearCache: function(){}};
  navigator.splashscreen = {hide:function(){}};
}

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

var help = null;

var h_spans = null;

var update_help = function(){
  if(!h_spans){
    h_spans = { old: $('#old'), _new: $('#new'),
      color: $('#color'), num: $('#numbers'), it: $('#it'), 
      ex: $('#ex'), sector: $('#sector') };
  }
  
  var top = $('h1').outerHeight();
  var h = Math.max($(document).outerHeight(), $(window).height());
  help.css({top: top, height: h - top});
  
  if($('#result').hasClass('hidden'))
    return;

  var was_hidden = false;
  if(help.hasClass('hidden')){
    help.css('opacity', 0).removeClass('hidden');
    was_hidden = true;
  }
  
  var orig = $('#prev');
  
  var t = orig.position().top + Math.round(orig.outerHeight()/2) - top - Math.round(h_spans.old.outerHeight()/2);
  var l = orig.position().left + Math.round(orig.outerWidth()/2) - Math.round(h_spans.old.outerWidth()/2);
  h_spans.old.css({top: t, left: l });
  

  orig = $('#curr');

  t = orig.position().top + Math.round(orig.outerHeight()/2) - top - Math.round(h_spans._new.outerHeight()/2);
  l = orig.position().left + Math.round(orig.outerWidth()/2) - Math.round(h_spans._new.outerWidth()/2);
  h_spans._new.css({top: t, left: l });

  // color
  orig = $('div.numbers:first');
  
  t = orig.position().top - top - Math.round(h_spans.color.outerHeight() * 0.8);
  l = Math.round(orig.position().left/2);
  h_spans.color.css({top: t, left: l });

  // numbers (same original)
  var orig2 = $('span.curr-num:first');
  var orig3 = $('span.prev-num:first');
  
  t = orig.position().top + Math.round(orig.outerHeight()/2) - top - Math.round(h_spans.num.outerHeight()/2);
  l = Math.max(Math.round(orig3.position().left * 1.2), orig.position().left + Math.round((orig2.position().left + orig2.outerWidth())/2) 
    - Math.round(h_spans.num.outerWidth()/2));
  h_spans.num.css({top: t, left: l });

  // itinerary
  orig = $('div.it:first');
  var sp = orig.wrapInner('<span />').find('span');
  var w = sp.width();
  orig.text(sp.text());
  
  t = orig.position().top + Math.round(orig.outerHeight()/2) - top - Math.round(h_spans.it.outerHeight()/2);
  l = orig.position().left + Math.round(w/2) - Math.round(h_spans.it.outerWidth()/2) + parseInt(orig.css('padding-left').replace('px', ''), 10);
  h_spans.it.css({top: t, left: l });

  // extras
  orig = $('div.extras:first');

  t = orig.position().top + Math.round(orig.outerHeight()/2*1.3) - top - Math.round(h_spans.ex.outerHeight()/2);
  l = orig.position().left + Math.round(w/2);
  h_spans.ex.css({top: t, left: l });
  
  // sector
  orig = $('div.area:first');

  t = orig.position().top + Math.round(orig.outerHeight() * 0.7) - top;
  l = orig.position().left + Math.round(parseInt(orig.css('padding-left').replace('px', ''), 10)*0.5);
  h_spans.sector.css({top: t, left: l });
  
  if(was_hidden)
    help.css('opacity', 1).addClass('hidden');
};

var on_search = function() {
  update_help();
};

var readyEvent = function(handler){
  var handle_pos_fix = function(){
    var end = device.platform.indexOf(' ');
    if(end < 0) end = device.platform.length;
    var p = device.platform.substr(0, end);
    var v = parseFloat(device.version.substr(0, 3));
    
    has_pos_fix = pos_fix_support[p] && pos_fix_support[p] <= v;
    
    var footer = $('#footer');
    if(!has_pos_fix)
      footer.css('position', 'static');
    else
      $('body').css('padding-bottom', footer.height());
  };
  
  var go = function() {
    // saves last search to local storage
    var save_search = function(){
      localStorage.last_search = JSON.stringify({type: this.id, value: this.value});
    };
        
    $('input').keydown(save_search).keyup(save_search).blur(save_search);
    
    var s = $('#search');
    var inp = s.find('input:first');
    s.width(inp.position().left + inp.outerWidth() + $('#scroll').outerWidth());
    
    // handles info & help buttons
    var info = $('#info');
    var main = $('#main');
    help = $('#help');
    var open_i = $('#open-info');
    var open_h = $('#open-help');

    open_i.click(function(){
      info.toggleClass('hidden');
      main.toggleClass('hidden');
      open_h.toggle();
      open_i.toggleClass('close');
    });
    
    open_h.click(function(){
      open_i.toggle();
      open_h.toggleClass('close');
      if($('#result').hasClass('hidden')){
        $('#prev').val('2113').blur();
        update_help();
      }
      help.toggleClass('hidden');
    });
        
    handle_pos_fix();

    // hooks to resize to handle help pane position
    $(window).resize(update_help);
    update_help();

    // calls regular handler
    handler();

    // retrieves last search
    if(localStorage.last_search){
      var s = JSON.parse(localStorage.last_search);
      $('#' + s.type).val(s.value).blur();
    }
    
    // hides splash screen
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

