module.exports = function(app, model, sys){

  app.get('/', function(req, res){
    var items = model.bus_lines.find_all();
    res.render('index', {
      title: 'home',
      items: items,
      codes: ['var items = ' + sys.inspect(items) + ';']
    });
  });

};

