var remote_url = 'http://novosnumerosonibus.com/';

// while debugging
remote_url = 'http://192.168.1.101:3000/';
var in_debug = false;

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

var debug = null;
var begin = new Date();

var dbg = function(what){
  if(!in_debug) return;
  
  if(!debug) debug = $('#debug');
  var e = new Date() - begin;
  var elapsed = e.toString() + ' ms';
  debug.append('[' + elapsed + '] ' + what + '<br />');
};

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

var searches = [];

var on_search = function(input) {
  if(!$('#result').hasClass('hidden')){
    var s = {type: input.attr('id'), value: input.val()};
    var last_search = searches.length ? searches[searches.length-1] : {};
    
    if(last_search.type != s.type || last_search.value != s.value)
      searches.push(s);
  }
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
  
  var is_curr_search = function(s){
    return $('#' + s.type).val() == s.value;
  };
  
  var search_num = function(s){
    if(!s){
      s = searches.pop();
      if(is_curr_search(s)) s = searches.pop();
    }
    $('#search input').val('');
    $('#' + s.type).val(s.value).blur();
  };
  
  var go = function() {
    dbg('after having data');
    
    // saves last search to local storage
    var save_search = function(){
      localStorage.last_search = JSON.stringify({type: this.id, value: this.value});
    };

    $('input').keydown(save_search).keyup(save_search).blur(save_search);
    
    var s = $('#search');
    var inp = s.find('input:first');
    s.width(inp.position().left + inp.outerWidth() + $('#scroll').outerWidth());

    dbg('after setting search width');
    
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
        search_num({type: 'prev', value: '2113'});
        update_help();
      }
      help.toggleClass('hidden');
    });

    dbg('after info & help');

    handle_pos_fix();

    dbg('after position fix');
    
    // handles back button
    $(document).bind('backbutton', function() {
      if(!help.hasClass('hidden'))
        open_h.click();
      else if(!info.hasClass('hidden'))
        open_i.click();
      else if(searches.length && (searches.length > 1 || !is_curr_search(searches[searches.length - 1])))
        search_num();
      else
        navigator.app.exitApp();
    });

    // hooks to resize to handle help pane position
    $(window).resize(update_help);
    update_help();

    dbg('after help');

    // calls regular handler
    handler();

    dbg('after regular handler');

    // retrieves last search
    if(localStorage.last_search)
      search_num(JSON.parse(localStorage.last_search));

    dbg('after last search (end)');
    
    // hides splash screen
    navigator.splashscreen.hide();
  };
  
  var download_data = function(){
    $.getJSON(remote_url + 'data.json?' + (new Date()).getTime(), function(d){
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
    dbg('first handler');

    if(!localStorage.data)
      persist_data();
    else {
      // only loads from local storage if different from already loaded js
      if(new Date(data.updated_at) < new Date(localStorage.updated_at)) {
        data = JSON.parse(localStorage.data);
        purge_off_data();
      }
    }
    
    data.updated_at = new Date(data.updated_at);
    
    dbg('after handling offline data');

    // try to load from website when on wifi
    var conn = navigator.network.connection.type;
    if(conn == Connection.WIFI || conn == Connection.ETHERNET){
      $.getJSON(remote_url + 'data_info.json?' + (new Date()).getTime(), function(i){
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
    }
    else
      go();
  };

  $(document).ready(function(){
    $(document).bind('deviceready', newhandler);
  });
};

