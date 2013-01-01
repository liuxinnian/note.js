
/**
 * Module dependencies.
 * 载入核心模块
 */
var settings = require('./settings');

var express = require('express')
  , http    = require('http')
  , domain  = require('domain')
  , path    = require('path')
  , layout  = require('express-ejs-layouts');

var app = express();

// Connect to Mongodb when the app initializes
// 为整个应用链接数据库
var mongoose = require('mongoose'),
    db = mongoose.connect(settings.dsn);

// Configure for everything
// 应用全局配置
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

// URL Routes
// URL 路由
var note = require('./routes/note');
app.get('(/|/note|/note/:cat)', note.index);
app.get('/note/:cat/:id', note.show);

// custom 404 page
// 自定义404页面
app.use(function(req, res, next){
  res.status(404);
  // respond with html page
  if (req.accepts('html')) {
    res.render('other/404', { title:'Page Not found',url: req.url });
    return;
  }
  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }
  // default to plain-text. send()
  res.type('txt').send('Not found');
});


// Start Server. but in method,the server will die on unhandled exception
// 启动服务,不过这种方式启动，在遇到异常时服务会挂掉
// http.createServer(app).listen(app.get('port'), function(){
//   console.log("Express server listening on port " + app.get('port'));
// });

// Start Server,but in this method, the server won't die on unhandled exception
// 启动服务,以这种方式启动服务，会捕获未知异并通知，服务不会挂掉(官方建议)
// more about: http://nodejs.org/api/domain.html
var serverDomain = domain.create();

serverDomain.run(function() {
  // server is created in the scope of serverDomain
  http.createServer(app,function(req, res) {
    // req and res are also created in the scope of serverDomain
    // however, we'd prefer to have a separate domain for each request.
    // create it first thing, and add req and res to it.
    var reqd = domain.create();
    reqd.add(req);
    reqd.add(res);
    reqd.on('error', function(er) {
      console.error('Error', er, req.url);
      try {
        res.writeHead(500);
        res.end('Error occurred, sorry.');
        res.on('close', function() {
          // forcibly shut down any other things added to this domain
          reqd.dispose();
        });
      } catch (er) {
        console.error('Error sending 500', er, req.url);
        // tried our best.  clean up anything remaining.
        reqd.dispose();
      }
    });
  }).listen(app.get('port'),function(){
    console.log("Express server listening on port " + app.get('port'));
  });
});

