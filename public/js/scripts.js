String.prototype.startsWith = function(input){
    return this.substring(0, input.length) === input;
};

String.prototype.endsWith = function(input) {
    return this.substr(-1) === input;
};

String.prototype.trim = function() {
    return this.replace(/^\s*|\s*$/g, '');
};

var brs_source = '';

$(document).ready(function(){
  var inpts = $('#search input');
  var prev_inpt = $('#search input#prev');
  var curr_inpt = $('#search input#curr');
  var btn = $('#search button');
  brs_source = $('#brs-source').attr('href');

  var container = $('div#result');
  var template_row = container.find('div:first').detach();
  
  var search = function (all_items){
    var search_result = [];
    
    if(all_items){
      search_result = items;
    }
    else{
      var num = prev_inpt.val().toLowerCase();
      var prev = true;
      if(!num) {
        num = curr_inpt.val().toLowerCase();
        prev = false;
        location.href = '#';
      }
      else
        location.href = '#' + num;

      if(num){
        for(var i = 0; i < items.length; i++){
          var item_num = prev ? items[i].previous_number : items[i].current_number;
          if(item_num.toLowerCase() == num)
            search_result.push(items[i]);
        }
      }
    }
    
    render_lines(search_result, container, template_row, num, prev);
  };
  
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
    if(hash == 'todas')
      search(true);
    else{
      prev_inpt.val(hash);
      search();
    }
  }
});

function render_lines(items, container, template_row, num, prev){
  container.empty();
  var summary = $('#summary');
  
  for(var i = 0; i < items.length; i++){
    var item = items[i];
    var row = template_row.clone();
    
    row.find('.area').html(item.area);
    row.find('.prev-num').html(item.previous_number);
    row.find('.curr-num').html(item.current_number);
    row.find('.it').html(item.itinerary);
    row.addClass(area_classes[item.area]);
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
