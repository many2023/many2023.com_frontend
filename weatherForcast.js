var http = require("http");

String.prototype.format=function()  
{  
  if(arguments.length==0) return this;  
  for(var s=this, i=0; i<arguments.length; i++)  
    s=s.replace(new RegExp("\\{"+i+"\\}","g"), arguments[i]);  
  return s;  
}; 

var url = "http://api.ipinfodb.com/v3/ip-city/?key=3ba0e6e2d21254d8b5e122fe49bb6de2653220d10e31839938b3d1b504ce95e8&format=json&ip=";
var url2 = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20geo.places%20where%20text%3D%22{0}%22&format=json&diagnostics=true";
var url3 = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%3D{0}&format=json&diagnostics=true";
var url4 = "http://aqicn.org/aqicn/json/android/{0}/json"

var locationName = "";

function getLocationByIP(request, callback){
	httpGet(url + getIP(request), getLocationID, callback);
}


function getIP(req) {
    return req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
};

function getLocationID(data, callback) {
	locationName = data.cityName;
	httpGet(url2.format(locationName), getWeather, callback);
}

function getWeather(data, callback) {
	var locationID = data.query.results.place[0].woeid;
	httpGet(url3.format(locationID), getWeatherDetail, callback);
}

function getWeatherDetail(data, callback) {
	var  weatherDetail = data.query.results.channel
	httpGet(url4.format(locationName), getAQI, callback, weatherDetail);
}

function getAQI(data, callback) {
	var weatherDetail = data[0];
	var aqi = data[1];

	weatherDetail.aqi = aqi;

	callback(weatherDetail);
}

function httpGet(url, callback, callback2, parentData) {
	http.get(url, function(res){
	    var data = "";

		res.on("data", function(chunk){
		    data+=chunk;
		});

		res.on("end", function(){
			console.log(data);
			var dataObj = JSON.parse(data);
			var resData;
			
			if(parentData != null) {
				resData = [parentData, dataObj];
			}
			else {
				resData = dataObj;
			}
		    callback(resData, callback2);
		});
	});
}

function weatherForecast(request, callback) {
	getLocationByIP(request, callback);
}

exports.weatherForecast = weatherForecast;