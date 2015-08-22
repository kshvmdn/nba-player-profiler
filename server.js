var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var api = require('./app/routes/api');

var port = process.env.PORT || 3000;

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', api);

app.get('/', function(req,res) {
  res.sendFile(__dirname + '/public/views/index.html');
});

app.listen(port);
console.log('Listening at http://localhost/'+port);
