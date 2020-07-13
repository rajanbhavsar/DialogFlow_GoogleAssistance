'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
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
    const reqUrl = encodeURI(`https://staging.theflyingflea.com/api/rest/sitestore/product/browse?limit=10&page=1&oauth_consumer_key=pnejcga9zs7fa8kaksjlf79j0qhc3t8q&oauth_consumer_secret=tkp93qmdcrg8q47z66utvgzlj6bp3660&oauth_secret=8jdfjgmpv1idv641w3d7i7jbapgvc3su`);
    console.log("Url-------------- " + reqUrl);
    https.get(reqUrl, (responseFromAPI) => {
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

