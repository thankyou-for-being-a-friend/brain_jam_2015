var express = require('express');
var ejs = require('ejs');
var port = process.env.PORT || 3000;

var server = express();

server.use(express.static('public'));

server.set('view engine', 'ejs')

server.get('/', function(req, res) {
  res.render('index');
});

server.listen(port, function() {
  console.log('I\'m listeningnngngng')
});