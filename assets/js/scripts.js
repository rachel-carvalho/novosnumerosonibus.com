String.prototype.startsWith = function(input){
    return this.substring(0, input.length) === input;
};

String.prototype.endsWith = function(input){
    return this.substr(-1 * input.length) === input;
};

String.prototype.trim = function() {
    return this.replace(/^\s*|\s*$/g, '');
};

var brs_source = '';

var desktop_ad = '<script type="text/javascript"><!--\r\n' +
'google_ad_client = "ca-pub-6782658805468575";\r\n' +
'/* novosnumerosonibus */\r\n' +
'google_ad_slot = "0611967022";\r\n' +
'google_ad_width = 468;\r\n' +
'google_ad_height = 60;\r\n' +
'//-->\r\n' +
'</script>\r\n' +
'<script type="text/javascript" src="http://pagead2.googlesyndication.com/pagead/show_ads.js"></script>';

var mobile_ad = '<script type="text/javascript"><!--\r\n' +
'  // XHTML should not attempt to parse these strings, declare them CDATA.\r\n' +
'  /* <![CDATA[ */\r\n' +
'  window.googleAfmcRequest = {\r\n' +
'    client: "ca-mb-pub-6782658805468575",\r\n' +
'    format: "320x50_mb",\r\n' +
'    output: "html",\r\n' +
'    slotname: "6751409080",\r\n' +
'  };\r\n' +
'  /* ]]> */\r\n' +
'//--></script>\r\n' +
'<script type="text/javascript" src="http://pagead2.googlesyndication.com/pagead/show_afmc_ads.js"></script>';

var ua = navigator.userAgent;
var isAndroid = ua.match(/Android/i) != null;
var isMobile = ua.match(/iPad/i) != null || ua.match(/iPhone/i) != null || ua.match(/iPod/i) != null || isAndroid;
var summary = null;

var onready = function(){
  var inpts = $('#search input');
  var prev_inpt = $('#search input#prev');
  var curr_inpt = $('#search input#curr');
  var btn = $('#search button');
  brs_source = $('#brs-source').attr('href');
  summary = $('#summary');
  var scroll = $('#scroll');
  
  if(!isMobile || isAndroid){
    for(var i = 0; i < inpts.length; i++)
      inpts[i].type = 'text';
    
    if(!isAndroid)
      $('div.ad').addClass('spaced');
  }

  var container = $('div#result');
  var template_row = container.find('div:first').detach();
  
  var calculate_button_pos = function (active_inpt){
    if (!active_inpt)
      active_inpt = prev_inpt.val() ? prev_inpt : curr_inpt;

    var off = active_inpt.offset();
    scroll.css({ top: off.top, left: off.left + active_inpt.outerWidth(), height: active_inpt.outerHeight() });
  };
  
  $(window).resize(function(){
    calculate_button_pos();
  });
  
  var search = function (all_items){
    var search_result = [];
    
    if(all_items){
      search_result = data.items;
    }
    else{
      var num = prev_inpt.val().toLowerCase();
      var prev = true;
      if(!num) {
        num = curr_inpt.val().toLowerCase();
        prev = false;
        if(!window.device)      
          location.href = '#/novo/' + num;
      }
      else
        if(!window.device)    
          location.href = '#/antigo/' + num;


      if(num){
        var parts = num.match(/[a-z]+|\d+/ig);
        
        for(var j = 0; j < parts.length; j++)
          if(!isNaN(parts[j])) parts[j] = Number(parts[j]).toString();
        
        num = parts.join('');

        for(var i = 0; i < data.items.length; i++){
          var item_num = prev ? data.items[i].previous_number : data.items[i].current_number;
          
          var parts = item_num.match(/[a-z]+|\d+/ig);
          
          if(parts){
            for(var j = 0; j < parts.length; j++)
              if(!isNaN(parts[j])) parts[j] = Number(parts[j]).toString();
            
            item_num = parts.join('');
          }
          
          if(item_num.toLowerCase() == num)
            search_result.push(data.items[i]);
        }
      }
    }
    
    var active_inpt = prev ? prev_inpt : curr_inpt;
    
    prev_inpt.removeClass('not-found').removeClass('found');
    curr_inpt.removeClass('not-found').removeClass('found');
    scroll.addClass('hidden');

    if(num){
      if(search_result.length == 0) {
        active_inpt.addClass('not-found');
      }
      else {
        active_inpt.addClass('found');
        calculate_button_pos();
        scroll.removeClass('hidden');
      }
    }
    
    render_lines(search_result, container, template_row, num, prev);
    
    if(typeof(on_search) == 'function') on_search();
  };
  
  scroll.click(function(){
    $('html:not(:animated),body:not(:animated)').animate({ scrollTop: summary.offset().top });
  });
  
  inpts.focus(function(){
    if(this.id == prev_inpt.attr('id'))
      curr_inpt.val('');
    else if(this.id == curr_inpt.attr('id'))
      prev_inpt.val('');
    search();
  });
    
  inpts.keydown(function(e) {
    if (e.keyCode == 13)
      search();
  });
  
  inpts.keyup(function(){
    search();
  });
  
  inpts.blur(function(){
    search();
  });
  
  $('#list-all').click(function(){
    inpts.val('');
    search(true);
  });
  
  if(location.hash && location.hash.length > 1) {
    var hash = location.hash.substring(1);
    if(hash == '/todas/')
      search(true);
    else{
      var path_prev = '/antigo/';
      var path_curr = '/novo/';
      if(hash.startsWith(path_prev))
        prev_inpt.val(hash.substring(path_prev.length));
      else if(hash.startsWith(path_curr))
        curr_inpt.val(hash.substring(path_curr.length));
      search();
    }
  }
};

function render_lines(items, container, template_row, num, prev){
  container.empty();
  
  for(var i = 0; i < items.length; i++){
    var item = items[i];
    var row = template_row.clone();
    
    var prev = row.find('.prev-num');
    
    row.find('.area').html(item.area);
    prev.html(item.previous_number);
    if(!item.previous_number)
      prev.html('(inexistente)').addClass('inexistant');
    
    row.find('.curr-num').html(item.current_number);
    row.find('.it').html(item.itinerary);
    row.addClass('area-' + data.areas[item.area]);
    var extras = row.find('.extras');
    if(item.extras.length > 0){
      var treated_extras = [];
      for(var j = 0; j < item.extras.length; j++){
        if(item.extras[j].toLowerCase().startsWith('brs')){
          treated_extras.push('<a href="'+ brs_source +'" target="_blank" title="Mais informações sobre BRS" class="brs">' + item.extras[j] + '</a>');
        }
        else {
          treated_extras.push(item.extras[j]);
        }
      }
      extras.html(treated_extras.join(', '));
    }
    else extras.parent().remove();
    
    container.append(row);
  }
  
  if (items.length > 0){
    container.removeClass('hidden');
    var plural = items.length > 1 ? 's' : '';
    summary.html('<strong>' + items.length.toString() + '</strong> linha' + plural + ' encontrada' + plural + ':').removeClass('hidden');
  }
  else{
    container.addClass('hidden');
    if(num){
      var prevText = prev ? 'antigo' : 'novo';
      summary.html('O número ' + prevText + ' <strong>' + num + '</strong> não existe.').removeClass('hidden');
    }
    else
      summary.addClass('hidden'); 
  }
}

if(typeof(readyEvent) == 'undefined')
  $(document).ready(onready);
else
  readyEvent(onready);


