require("dotenv").config();

var moment = require("moment");
var Spotify = require("node-spotify-api");
var axios = require("axios");
var fs = require("fs");
var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);

var command = process.argv[2];
var term = process.argv.slice(3).join(" ");

if (command === "concert-this") {
    console.log("Searching for a concert");
    findConcert();
} else if (command === "spotify-this-song") {
    console.log("Searching for a song");
    spotifyThis();
} else if (command === "movie-this") {
    console.log("Searching for a movie")
    findMovie();
} else if (command === "do-what-it-says") {
    console.log("Searching for a random command")
    doRandom();
}

function findConcert() {
    var URL = "https://rest.bandsintown.com/artists/" + term + "/events?app_id=codingbootcamp"
    axios.get(URL).then(
        function (response) {
            var JSONdata = response.data[0];
            var dateFormat = "MM/DD/YYYY";
            var convertedDate = moment(JSONdata.datetime).format(dateFormat);
            var text = `
------------------------------------------------
    Artist: ${term}
    Concert Venue: ${JSONdata.venue.name}
    Venue Location: ${JSONdata.venue.city}, ${JSONdata.venue.region}
    Concert Date: ${convertedDate}
------------------------------------------------`;
            console.log(text);
            fs.appendFile("log.txt", text, function (err) {

                // If an error was experienced we will log it.
                if (err) {
                    console.log(err);
                }
                // If no error is experienced, we'll log the phrase "Content Added" to our node console.
                else {
                    console.log("Content Added!");
                }
            });
        }
    );
};

function spotifyThis() {

    if (!term) {
        term = "The Sign"
    }
    spotify
        .search({ type: 'track', query: term })
        .then(function (response) {
            var songData = response.tracks.items[0];
            var text = `
--------------------------------------------------------
    Song Artist(s): ${songData.album.artists[0].name}
    Song Name: ${songData.name}
    Preview URL: ${songData.preview_url}
    Album Name: ${songData.album.name}`
            console.log(text);
            fs.appendFile("log.txt", text, function (err) {

                // If an error was experienced we will log it.
                if (err) {
                    console.log(err);
                }
                // If no error is experienced, we'll log the phrase "Content Added" to our node console.
                else {
                    console.log("Content Added!");
                }
            });
        })
        .catch(function (err) {
            console.log(err);
        });
}

function findMovie() {
    if (!term) {
        term = "Mr Nobody";
    }
    var URL = "http://www.omdbapi.com/?t=" + term + "&y=&plot=short&apikey=trilogy"
    axios.get(URL).then(
        function (response) {
            var movieInfo = response.data;
            var text = `
----------------------------------------------------------
    Movie Title: ${movieInfo.Title}
    Movie Year: ${movieInfo.Year}
    IMDB Rating: ${movieInfo.imdbRating}
    Rotten Tomatoes Rating: ${movieInfo.Ratings[1].Value}
    Country Produced: ${movieInfo.Country}
    Movie Language: ${movieInfo.Language}
    Movie Plot: ${movieInfo.Plot}
    Actors: ${movieInfo.Actors}
----------------------------------------------------------`;
            console.log(text);
            fs.appendFile("log.txt", text, function (err) {

                // If an error was experienced we will log it.
                if (err) {
                    console.log(err);
                }
                // If no error is experienced, we'll log the phrase "Content Added" to our node console.
                else {
                    console.log("Content Added!");
                }
            });
        }
    );
};

function doRandom() {
    fs.readFile("random.txt", "utf8", function (error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }

        var random = data.split(",");
        command = random[0];
        term = random[1];

        spotify
            .search({ type: 'track', query: term })
            .then(function (response) {
                var songData = response.tracks.items[0];
                var text = `
--------------------------------------------------------
    Song Artist(s): ${songData.album.artists[0].name}
    Song Name: ${songData.name}
    Preview URL: ${songData.preview_url}
    Album Name: ${songData.album.name}`
                console.log(text);
                fs.appendFile("log.txt", text, function (err) {

                    // If an error was experienced we will log it.
                    if (err) {
                        console.log(err);
                    }
                    // If no error is experienced, we'll log the phrase "Content Added" to our node console.
                    else {
                        console.log("Content Added!");
                    }
                });
            })
            .catch(function (err) {
                console.log(err);
            });
    })
}