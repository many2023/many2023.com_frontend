var http = require("http");
var https = require("https");
var express = require('express');
var weatherForcast = require('./weatherForcast.js')

var app = express();
// var server = http.createServer(function(req, res){}).listen(9090);

var google_earth_json_url = "https://raw.githubusercontent.com/limhenry/earthview/master/earthview.json";
google_earth_json = null;
var google_image = null;
var data = "";

var unsplashCategoryArray = new Array("buildings", "food", "nature", "people", "technology", "objects");
var unsplashUrl = "https://source.unsplash.com/category/";

var flickrImageListLength = 50;
var flickrUrl = "https://api.flickr.com/services/rest/?api_key=b760f0b628ad7831be832fcb2ff5a29c&extras=url_o,geo,path_alias&format=json&method=flickr.interestingness.getList&per_page=" + flickrImageListLength;
var flickrGetLocaltionUrl = "https://api.flickr.com/services/rest/?api_key=b760f0b628ad7831be832fcb2ff5a29c&format=json&method=flickr.places.resolvePlaceId&place_id=";


var px500Url = "https://api.500px.com/v1/photos?feature=fresh_today&sort=created_at&image_size=2048&consumer_key=cZicK4iowToDCXU8kY4uuNRihGC9bxOe7hlcDNTH";

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

    var re = /@(.*),(.*),(.*)\/.*/i

    var result = re.exec(google_image.map);

    var google_returnObject = generateReturnObject(google_image.country + " " + google_image.region, google_image.map, "map", result[1], result[2]);

    getImageBase64(google_image.image, response, google_returnObject);
}

function many2023_getImageByUnsplash(response){
    var index = randomInt(0, unsplashCategoryArray[index].length);
    
    var category = unsplashCategoryArray[index];

    var unsplashReturnObject = generateReturnObject(category, null, category, null, null);

    getImageBase64(unsplashUrl + category, response, unsplashReturnObject);
}

function many2023_getImageByFlickr(response){
    var flickrImageListResponse = null;

    many2023_gets(flickrUrl, flickrImageListResponse, function(data){
        flickrImageListResponse = JSON.parse(data);
         
         var index = -1;
         var imageJson = null;

         do {
             index = randomInt(0, flickrImageListResponse.photo.lenth);
        
             var imageJson = flickrImageListResponse.photo[index];
         }while(imageJson.url_o == null && imageJson.url_k == null)

         if(imageJson.place_id != null){
             many2023_gets(flickrGetLocaltionUrl+imageJson.place_id, null, function(res){
                 var locationJson = JSON.parse(res);

                 var location = locationJson.locality._content;

                 var flickrReturnObject = generateReturnObject(location, null, null, null, null);
                 
                 var imageUrl = imageJson.url_o == null ? imageJson.url_k : imageJson.url_o;
                 
                 getImageBase64(imageUrl, response, flickrReturnObject);
             });
         }
    });
}

function getImageBy500px(response){
    var px500ReturnObject = generateReturnObject("fresh_today", null, "fresh_today", null, null);

    getImageBase64(px500Url, response, px500ReturnObject);
}

var returnImage = function many2023_returnImage(res, retObj, data){
    retObj.data = data;

    res.send(retObj);
}

function getImageBase64(url, response, retObj){
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
            base64data = new Buffer(imgData, 'binary').toString('base64');
            
            retObj.data = data_uri_prefix + base64data;

            response.send(retObj);
            // callback(response, retObj, data_uri_prefix + base64data);
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

function generateReturnObject(from, url, category, a, b){
    var returnObject = {
                           'from': from,
                           'url' : url,
                           'category': category,
                           'a': a,
                           'b': b
                       };

    return returnObject;
}
