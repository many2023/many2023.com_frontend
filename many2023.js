var http = require("http");
var https = require("https");
var express = require('express');

var app = express();
// var server = http.createServer(function(req, res){}).listen(9090);

var google_earth_json_url = "https://raw.githubusercontent.com/limhenry/earthview/master/earthview.json";
google_earth_json = null;
var google_image = null;
var data = "";
var server = app.listen(9090, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("server run at http://%s:%s", host, port);


  many2023_gets(google_earth_json_url, google_earth_json, str2json);

})


var str2json =  function many2023_str2json(str){
                  google_earth_json = JSON.parse(str);

}

function many2023_gets(url, obj, callback){
  https.get(url, function(res){
//    var data = "";

    res.on("data", function(chunk){
        data+=chunk;
    });

    res.on("end", function(){
//        console.log("get end data:%s", data)

        callback(data);
    });
  });
}

function many2023_getImageByGoogleEarth(response){
    var index = randomInt(0, google_earth_json.length);

    var google_image = google_earth_json[index];

    var google_returnObject = generateReturnObject(google_image.country + " " + google_image.region, google_image.map);

    getImageBase64(google_image.image, response, google_returnObject, returnImage);
}

var returnImage = function many2023_returnImage(res, retObj, data){
    retObj.data = data;

    res.send(retObj);
}

function getImageBase64(url, response, retObj, callback){
    var base64data = "";
    var data_uri_prefix = "";
    https.get(url, function(res){
        var imgData = "";
        data_uri_prefix = "data:" + res.headers["content-type"] + ";base64,";
        res.setEncoding("binary"); 

        res.on("data", function(chunk){
            imgData+=chunk;
        });

        res.on("end", function(){
            base64data = new Buffer(imgData).toString('base64');
            
            callback(response, retObj, data_uri_prefix + base64data);
        });
    });
}
app.get('/', function (req, res) {
//   res.send(data_uri_prefix + base64data);
    console.log("google earth json length: %d",google_earth_json.length);

    many2023_getImageByGoogleEarth(res);
})

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

function generateReturnObject(from, url, data){
    var returnObject = {
                           'from': from,
                           'url' : url
                       };

    return returnObject;
}
