
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const API_KEY = require('./apiKey');
const port = process.env.PORT || 8000;
const server = express();
server.use(bodyParser.urlencoded({
    extended: true
}));

server.use(bodyParser.json());

server.post('/webhook', (req, res) => {

    const movieToSearch = req.body.queryResult.parameters['geo-city'];
    console.log("Search Query-------------- " + movieToSearch);
    const reqUrl = encodeURI(`http://api.openweathermap.org/data/2.5/weather?q=${movieToSearch}&appid=${API_KEY}`);
    console.log("Url-------------- " + reqUrl);
    http.get(reqUrl, (responseFromAPI) => {
        let completeResponse = '';
        responseFromAPI.on('data', (chunk) => {
            completeResponse += chunk;
        });
        responseFromAPI.on('end', () => {
            var movie = JSON.parse(completeResponse);
            prettyJSON(movie);
            let dataToSend = movieToSearch === '' ? `Unable to Get weather Information.\n` : '';
            dataToSend += `Right Now its ${movie.main.temp}  degree with  ${movie.weather[0].description}`;
			return res.json({
				fulfillmentText: dataToSend,
				fulfillmentMessage: dataToSend,
                speech: dataToSend,
                displayText: dataToSend,
                source: 'get-movie-details'
            });
        });
    }, (error) => {
        return res.json({
            speech: 'Something went wrong!',
            displayText: 'Something went wrong!',
            source: 'get-movie-details'
        });
    });
});

function prettyJSON(obj) {
    console.log(JSON.stringify(obj, null, 2));
}

server.listen(port, () => {
    console.log("App is running on port " + port);
});

/*var apikey = 'f6dacb03346d39ed9172cd49941688a3';
var result


function cb(err, response,body){
	if(err != null){
	console.log('Error',err);
	}

	var weather = JSON.parse(body)
	if(weather.message == 'city not found'){
		result = 'Unable to Get weather'+weather.message;
	}
	else{
		result = 'Right Now its'+weather.main.temp+' degree with '+weather.weather[0].description;
	}
}

function getWeather(city){
	result = undefined;
	var url  = "http://api.openweathermap.org/data/2.5/weather?q={city}&units=emperial&appid={apikey}";
	console.log(url);
	var req =request(url,cb);
	while(result == undefined){
	require('deasync').runLoopOnce();
	}
	return result;
}


app.post('/webhook' function (req,res) {

	consoloe.log('Received Post request');
	if(!req.body) return res.sendStatus(400)
	res.setHeader('Content-Type','application/json');
	var city = req.body.queryResult.parameters['geo-city'];
	var w = getWeather(city);
	let response ="";
	let responseObject = {

		"fulfillmentText":response
		"fulfillmentMessage":[{"text":{"text":[w]}}]
		"source":""
	}
	return res.json(responseObject);

})*/