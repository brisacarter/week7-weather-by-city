/*
Name: Brisa Carter
Assignment: Week 7 - Weather by City
Description: FInd the weather by city name using the OpenWeather API - extending from Debasis code
Date: 03/01/25
*/

const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const mySecret = process.env['ics385_week7'];

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// Displays index.html of root path
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

// Invoked after hitting go in the html form
app.post("/", function(req, res) {
  // Takes in the city from the html form
  var cityInput = String(req.body.cityInput);
  console.log(req.body.cityInput);

  // Build up the URL for the JSON query
  const units = "imperial";
  const apiKey = mySecret;
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${cityInput}&limit=1&appid=${apiKey}`;

  // This gets the data from OpenWeather API
  https.get(url, function(response) {
    console.log(response.statusCode);

    response.on("data", function(data) {
      const locationData = JSON.parse(data);

      if (locationData.length > 0) {
        const lat = locationData[0].lat;
        const lon = locationData[0].lon;

        // Use the obtained latitude and longitude to query the weather
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;

        https.get(weatherUrl, function(weatherResponse) {
          console.log(weatherResponse.statusCode);

          weatherResponse.on("data", function(weatherData) {
            const weather = JSON.parse(weatherData);
            const temp = weather.main.temp;
            const feels_like = weather.main.feels_like;
            const city = weather.name;
            const humidity = weather.main.humidity;
            const speed = weather.wind.speed;
            const gust = weather.wind.gust;
            const weatherDescription = weather.weather[0].description;
            const icon = weather.weather[0].icon;
            const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

            // Displays the output of the results
            res.write(`<h1>The weather is ${weatherDescription}</h1>`);
            res.write(`<h2>The Temperature in ${city} is ${temp} &deg;F but...</h2>`);
              res.write(`<h2>it feels like ${feels_like} &deg;F</h2>`);
            res.write(`<h2>The Humidity is ${humidity} %</h2>`);
              res.write(`<h2>The Wind Speed is ${speed} mph, with Wind Gusts of ${gust} mph</h2>`);
            res.write(`<img src=${imageURL}>`);
            res.send();
          });
        });
      } else {
        res.write("<h1>City not found!</h1>");
        res.send();
      }
    });
  });
});

// Code will run on port 3000 or any available open port
app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port");
});
