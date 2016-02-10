var request = require('request');
var striptags = require('striptags');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var THEATER = "http://eapmovies.com/component/eapmovies/index.php";

function EAPMovieNotifer(options) {
  this.options = options;
  this.iterator = null;
  EventEmitter.call(this);
}

util.inherits(EAPMovieNotifer, EventEmitter);

function create(options) {
  return new EAPMovieNotifer(options);
}


EAPMovieNotifer.prototype.listen = function() {
  var that = this;
  this.iterator = setInterval(function() {
    getMovies(function(error, movies) {
      movies.forEach(function(movie) {
        if (movie == that.options.search.toLowerCase()) {
          that.emit('found');
          that.stop();
        }
      });
    });
  }, that.options.interval);
};

EAPMovieNotifer.prototype.stop = function() {
  clearInterval(this.iterator);
};


var getMovies = function(callback) {
  request.post(
    THEATER, {
      form: {
        "controller": "buyticket",
        "format": "raw",
        "option": "com_eapmovies",
        "task": "movielist",
        "tid": "3"
      }
    },
    function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var movies = striptags(body)
          .trim()
          .toLowerCase()
          .split('\n');
        movies.shift();
        callback(null, movies);
      } else {
        return callback(error, null);
      }
    });
};

module.exports = EAPMovieNotifer;
module.exports.create = create;
