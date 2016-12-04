var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

// NEW
var firebase = require('firebase');


var SerialPort = require("serialport");
var port = new SerialPort("/dev/tty.usbmodem1412", {
  baudRate: 9600,
  parser: SerialPort.parsers.readline("\n")
});

// initialize firebase

 var config = {
    apiKey: "AIzaSyA3OrvG4g7fb3PELJKTJKekOo7yan8k5HE",
    authDomain: "microbit-5b696.firebaseapp.com",
    databaseURL: "https://microbit-5b696.firebaseio.com",
    storageBucket: "microbit-5b696.appspot.com",
    messagingSenderId: "72543783488"
  };


firebase.initializeApp(config);

var rootRef = firebase.database().ref();



port.on('data', function (data) {
	//console.log(data);
	fader = data.split(',')[0];
	pitch1 = data.split(',')[2];
	pitch2 = data.split(',')[1];
	play1 = data.split(',')[4];
	play2 = data.split(',')[3];
	rootRef.update({"fader":""+fader});
	rootRef.update({"pitch1":""+pitch1});
	rootRef.update({"pitch2":""+pitch2});
	rootRef.update({"play1":""+play1});
	rootRef.update({"play2":""+play2});
	// rootRef.update({"p"})
});



var temp;


// open errors will be emitted as an error event
port.on('error', function(err) {
  console.log('Error: ', err.message);
})




var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


port = 5000 || process.env.PORT;
app.listen(port, function(){
	console.log("Listening on port" + port);
});

module.exports = app;
