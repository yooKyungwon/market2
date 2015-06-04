var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
//var bodyParser= require('body-parser');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

//var adr = require('./routes/adr.js');
var api = require('./routes/api.js');
//var api = require('./routes/api.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('view engine', 'ejs');
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));

app.use(cookieParser());

app.set('port', (process.env.PORT || 5000));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: '<mtrulbutachae>',
    saveUninitialized: true,
    resave: true}));

// session 유지 부분 미들웨어
app.use(function(req, res, next) {
    var user_id = req.session.user_id;
    if(!user_id) return next();
    req.user = res.locals.user_id = user_id;
    next();
});

api(app);

// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});*/
// Exception Handler 등록
// process.on('uncaughtException', function (err) {
//  console.log('Caught exception: ' + err);
//  // 추후 trace를 하게 위해서 err.stack 을 사용하여 logging하시기 바랍니다.
//  // Published story에서 beautifule logging winston 참조
// });
app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});

module.exports = app;
