/**
 * This is the server that does everything. It serves the index.html web page.
 * It opens a streaming connection to Twitter and retrieves the tweets. It
 * publishes all of the geotagged tweets to a Socket.io socket.
 */

/**
 * EXPRESS BOILERPLATE GOES HERE
 */
var express = require('express'),
    app = express(),
    http = require('http').Server(app);

// Serve index.html at the root.
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index-map.html');
});

// Serve static files in the public directory.
app.use(express.static('public'));

// Run on port 3000.
http.listen(80, function() {
  console.log('listening on 80');
});

/**
 * Create a stupid EventEmitter so that we can decouple the Twitter listener
 * and the socket.io socket.
 */
var EventEmitter = require('events'),
    util = require('util');

function TweetEmitter() {
  EventEmitter.call(this);
}
util.inherits(TweetEmitter, EventEmitter);

var tweetEmitter = new TweetEmitter();

/**
 * Here's all the socket.io stuff
 */

var io = require('socket.io')(http);

tweetEmitter.on('tweet', function(tweet) {
  console.log(tweet);
  io.emit('tweet', tweet);
});

// a helper function to average coordinate pairs
function average(coordinates) {
  var n = 0, lon = 0.0, lat = 0.0;
  coordinates.forEach(function(latLongs) {
    latLongs.forEach(function(latLong) {
      lon += latLong[0];
      lat += latLong[1];
      n += 1;
    })
  });
  return [lon / n, lat / n];
}

// Twitter stuff
var Twitter = require('twitter'),
    credentials = require('./credentials.js'),
    client = new Twitter(credentials);

var query = process.argv[2] || 'trump';
var raleigh = "-79.15,35.6,-78.40,36.1";
var ruston =  "-95.00,31.0,-90.00,34.0";

client.stream('statuses/filter', {locations:ruston} , function(stream) {
  // Every time we receive a tweet...
  stream.on('data', function(tweet) {
    // ... that has the `place` field populated ...
    if (tweet.place) {
      // ... extract only the fields needed by the client ...
      var tweetSmall = {
        id: tweet.id_str,
        user: tweet.user.screen_name,
        text: tweet.text,
        placeName: tweet.place.full_name,
        latLong: average(tweet.place.bounding_box.coordinates),
      }


      // ... and notify the tweetEmitter.
      console.log(tweet.place.place_type + "," + tweet.place.bounding_box.coordinates);
      if(tweet.place.place_type=="city") {
        tweetEmitter.emit('tweet', tweetSmall);
      }
    }
  });
});
