var http = require("http");

var url = "http://api.ipinfodb.com/v3/ip-city/?key=3ba0e6e2d21254d8b5e122fe49bb6de2653220d10e31839938b3d1b504ce95e8&format=json&ip="

function getRequestIp(request){

	console.log(url + getIP(request));

	http.get(url + getIP(request), function(res){
	    var data = "";

		res.on("data", function(chunk){
		    data+=chunk;
		});

		res.on("end", function(){
			console.log(data);
		    return data.countryName;
		});
	});
}


function getIP(req) {
    return req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
};

exports.getRequestIp = getRequestIp;