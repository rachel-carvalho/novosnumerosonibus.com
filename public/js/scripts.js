$(document).ready(function(){
  var inpts = $('#search input');
  var prev_inpt = $('#search input#prev');
  var curr_inpt = $('#search input#curr');
  var btn = $('#search button');
  
  inpts.focus(function(){
    if(this.id == prev_inpt.attr('id'))
      curr_inpt.val('');
    else if(this.id == curr_inpt.attr('id'))
      prev_inpt.val('');
  });

  var container = $('div#result');
  var template_row = container.find('div:first').detach();
  
  var search = function (){
    var num = prev_inpt.val().toLowerCase();
    var prev = true;
    if(!num) {
      num = curr_inpt.val().toLowerCase();
      prev = false;
      location.href = '#';
    }
    else
      location.href = '#' + num;
    
    var search_result = [];

    if(!num){
      search_result = items;
    }
    else{
      for(var i = 0; i < items.length; i++){
        var item_num = prev ? items[i].previous_number : items[i].current_number;
        if(item_num.toLowerCase() == num)
          search_result.push(items[i]);
      }
    }
      
    render_lines(search_result, container, template_row);
  };
    
  inpts.keydown(function(e) {
    if (e.keyCode == 13)
      search();
  });
  
  inpts.keyup(function(){
    if($(this).val())
      search();
  });
  
  inpts.blur(function(){
    if($(this).val())
      search();
  });
  
  if(location.hash && location.hash.length > 1) {
    prev_inpt.val(location.hash.substring(1));
    search();
  }
});

function render_lines(items, container, template_row){
  container.empty();
  
  for(var i = 0; i < items.length; i++){
    var item = items[i];
    var row = template_row.clone();
    
    row.find('.area').html(item.area);
    row.find('.prev-num').html(item.previous_number);
    row.find('.curr-num').html(item.current_number);
    row.find('.it').html(item.itinerary);
    var extras = row.find('.extras');
    if(item.extras.length > 0) extras.html(item.extras.join(', '));
    else extras.parent().remove();
    
    container.append(row);
  }
  
  if (items.length > 0)
    container.removeClass('hidden');
}
