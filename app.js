
/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();

var model = require('./model');

var sys = require('sys');

// Configuration

app.configure(function(){
  // www redirect
  app.use(function(req, res, next){
    if((/^www\..+/).test(req.headers.host))
      res.redirect('http://novosnumerosonibus.com' + req.originalUrl);
    else
      next();
  });

  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(require('connect-assets')());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes
require('./routes')(app, model, sys);

app.listen(process.env.PORT || 3000);
console.log("Express server listening on port %d", app.address().port);
