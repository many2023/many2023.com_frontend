var getIP = require("./weatherForcast.js");
var express = require('express');

var app = express();

var server = app.listen(9090, function () {

  	var host = server.address().address
  	var port = server.address().port

  	console.log("server run at http://%s:%s", host, port);
})

app.get('/', function (req, res) {
//   res.send(data_uri_prefix + base64data);
    getIP.weatherForecast(req, function(data){
    	console.log(data);
    	res.send(data);
    });
})
