$(document).ready(function(){
  var inpt = $('#search input');
  var btn = $('#search button');
  
  inpt.keydown(function(e) {
    if (e.keyCode == 13)
      btn.click();
  });

  var table = $('table');
  var templateRow = table.find('tbody tr:first').detach();
  
  renderLines(items, table, templateRow);
  
  btn.click(function(){
    var num = inpt.val().toLowerCase();
    
    var search_result = [];

    if(!num)
      search_result = items;
    else{
      for(var i = 0; i < items.length; i++)
        if(items[i].previous_number.toLowerCase() == num)
          search_result.push(items[i]);
    }
      
    renderLines(search_result, table, templateRow);
  });
});

function renderLines(items, table, templateRow){
  var tbody = table.find('tbody');
  
  tbody.empty();
  
  for(var i = 0; i < items.length; i++){
    var item = items[i];
    var tr = templateRow.clone();
    
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
