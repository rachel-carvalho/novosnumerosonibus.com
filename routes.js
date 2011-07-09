var fs = require('fs');

String.prototype.startsWith = function(input){
    return this.substring(0, input.length) === input;
}

String.prototype.endsWith = function(input) {
    return this.match(input + '$') == input;
};

String.prototype.trim = function() {
    return this.replace(/^\s*|\s*$/g, '');
}

module.exports = function(app, model, sys){

  app.get('/', function(req, res){
    var items = model.bus_lines.find_all();
    res.render('index', {
      items: items,
      codes: ['var items = ' + JSON.stringify(items) + ';']
    });
  });
  
  app.get('/heya', function(req, res){
    res.header('Content-Type', 'text/plain');
    res.send('howdy ho');
  });
  
  app.get('/import', function(req, res){
    var raw = fs.readFileSync('./data.txt', 'utf-8');
    
    var lines = raw.split('\r\n');
    
    var area = '';
    
    var items = [];
    
    for(var i = 0; i < lines.length; i++){
      var line = lines[i];
      
      if(!line || line.trim().startsWith('==')) continue;
      
      var parts = line.split('|');

      if(parts.length == 0) continue;
      
      if(parts.length == 1){
        area = line;
        continue;
      }
      
      var item = { area: area, extras: [] };

      if(parts.length == 2 && parts[1].trim()){
        var extras = parts[1].trim().split(' ');
        for(var j = 0; j < extras.length; j++){
          switch(extras[j].toLowerCase()){
            case 'c':
              item.extras.push('Circular');
              break;
            case 'r':
              item.extras.push('Rápido');
              break;
            case 'e':
              item.extras.push('Expresso');
              break;
            case 'p':
              item.extras.push('Parador');
              break;
          }
        }
      }
      
      parts = parts[0].trim().split(' ');
      
      item.previous_number = parts[0];
      if(item.previous_number.length < 7)
        item.previous_number = item.previous_number.toUpperCase();
      item.current_number = parts[1];
      if(item.current_number.length < 7)
        item.current_number = item.current_number.toUpperCase();
      item.itinerary = parts.slice(2).join(' ');
      
      items.push(item);
    }
    
    res.charset = 'utf-8';
    res.header('Content-Type', 'text/plain');
    res.send(JSON.stringify(items));
  });

};

