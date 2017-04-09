
var express = require('express');
var router = express.Router();
var flickr = require("flickrapi");
var google_maps_key = 'AIzaSyD1GPoQj-oO50V8JJJ01xRNVxwYb2WyQoU';
var request = require("request");
var Flickr = require("flickrapi"),
    flickrOptions = {
        api_key: "65655937b6264a3872c5a808c754747c",
        secret: "ba5154c1f75e6918"
    };


router.post('/', function(req, res, next) {
    var geocodeURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + req.location + "&key=" + google_maps_key;
    var stuff = "";
    var longitude;
    var latitude;
    var pictureURLS = [];
    var request = require('request');
    // get request to google for coordinates
    request(geocodeURL, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var obj = JSON.parse(body);
            longitude = obj.results[0].geometry.location.lng; // FOR FLICKR API
            latitude = obj.results[0].geometry.location.lat; // FOR FLICKR API
            console.log('hellooooo');

            // change time+date to epoch/unix
            var temp = req.body.daterange.split("-");
            var start = temp[0];
            var end = temp[1];
            var test = start + " "+ end;
            var startEpochTime = new Date(start).getTime() / 1000; // FOR FLICKR API
            var endEpochTime = new Date(end).getTime() / 1000; // FOR FLICKR API

            Flickr.tokenOnly(flickrOptions, function(error, flickr) {
                flickr.photos.search({
                    // text: "red+panda"
                    lat: 34.9683009,
                    lon: 135.7727,
                    min_taken_date: 1491000000,
                    max_taken_date: 1491713952
                    // lat: latitude,
                    // lon: longitude,
                    // min_taken_date: endEpochTime,
                    // max_taken_date: startEpochTime,
                    // radius: 10
                }, function(err, result) {
                    for (i=0;i<result.photos.photo.length; i++) {
                        pictureURLS[i] = "https://farm" + result.photos.photo[i].farm.toString() +
                            ".staticflickr.com/" + result.photos.photo[i].server +"/"+ result.photos.photo[i].id +
                            "_" + result.photos.photo[i].secret+".jpg";
                        //console.log(pictureURLS[i]);
                    }
                    console.log(pictureURLS);
                    res.render('result', { title: 'Express', photo_array: pictureURLS});
                });
            });
        }
    })
});

module.exports = router;