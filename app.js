
/**
 * Module dependencies.
 */

var express = require('express')
  , http    = require('http')
  , path    = require('path')
  , layout  = require('express-ejs-layouts');

var app = express();

var settings = require('./settings');

// Configure for everything
app.configure(function(){
  app.set('port', process.env.PORT || settings.http.port); // process.env.PORT for modulus.io
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.set('layout', 'layout'); // defaults to 'views/layout.ejs'   
  app.use(layout);
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.favicon(__dirname + '/public/img/favicon.ico', { maxAge: 2592000000 }));
});

// Configure for development
app.configure('development', function(){
  app.use(express.errorHandler());
});


// Routes
var welcome = require('./routes/welcome')
  , article = require('./routes/article');

app.get('/', welcome.index);
app.get('/article/:cat/:id', article.index);

// Start Server
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
