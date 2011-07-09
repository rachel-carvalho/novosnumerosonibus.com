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
  
  inpts.keydown(function(e) {
    if (e.keyCode == 13)
      btn.click();
  });

  var table = $('table');
  var template_row = table.find('tbody tr:first').detach();
  
  btn.click(function(){
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
      
    render_lines(search_result, table, template_row);
  });
  
  if(location.hash && location.hash.length > 1) {
    prev_inpt.val(location.hash.substring(1));
    btn.click();
  }
  else {
    //render_lines(items, table, template_row);
  }
});

function render_lines(items, table, template_row){
  var tbody = table.find('tbody');
  
  tbody.empty();
  
  for(var i = 0; i < items.length; i++){
    var item = items[i];
    var tr = template_row.clone();
    
    tr.find('td.area').html(item.area);
    tr.find('td.prev-num').html(item.previous_number);
    tr.find('td.curr-num').html(item.current_number);
    tr.find('td.it').html(item.itinerary);
    tr.find('td.extras').html(item.extras.join(', '));
    
    tbody.append(tr);
  }
  
  if (items.length > 0)
    table.removeClass('hidden');
}
