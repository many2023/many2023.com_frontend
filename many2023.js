var http = require("http");
var https = require("https");
var express = require('express');
var weatherForcast = require('./weatherForcast.js')
var getBackground = require('./getBackground.js')

var app = express();
// var server = http.createServer(function(req, res){}).listen(9090);

var server = app.listen(9090, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("server run at http://%s:%s", host, port);

  getBackground.init();
})



app.get('/getBackground', function (req, res) {
    getBackground.many2023_getImageByGoogleEarth(res);
})

app.get('/getWeather', function (req, res) {
    weatherForcast.weatherForecast(req, function(data){
    	console.log(data);
    	res.send(data);
    });
})

