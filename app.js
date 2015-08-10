var http = require("http"); // Required for making HTTP get request
var moment = require("moment"); // Required for calculating time diff
var config = require("./config.json"); // Contains api_key and app_id

var url = "http://transportapi.com/v3/uk/bus/stop/450012815/live.json?group=route&nextbus=yes";
var api_key = config.api_key;
var app_id = config.app_id;
var end_point = url + "&app_id=" + app_id + "&api_key=" + api_key; // Formulated URL

var request = http.get(end_point, function(resp) {
    console.log("Requesting data from: " + end_point);

    var body = ""; // contains json object
    // On data event
    resp.on('data', function(d) {
        console.log('Data received from HTTP');
        //console.log("Data event: " + d);
        body += d;
    });

    resp.on('end', function() {
        console.log("HTTP end");
        try {
            var parsed = JSON.parse(body);
        } catch (err) {
            console.error('Error parsing JSON response.', err);
            return err;
        }

        var one_six_three, fourty;

        // Get first 163
        if (parsed.departures[163] !== null) {
            one_six_three = parsed.departures[163][0];
            //console.log(one_six_three);
        }

        // Get first 40
        if (parsed.departures[40] !== null) {
            fourty = parsed.departures[40][0];
            //console.log(fourty);
        }

        // Get current time
        var startDate = new Date();

        // Construct 163 bus time in date time format
        var endDate = new Date(startDate.toDateString() + " " + one_six_three.aimed_departure_time);

        // Calculate time difference (for 163) in seconds and append to the object
        one_six_three.countdown_seconds = moment(endDate).diff(startDate, 'seconds');

        // Construct 40 bus time in date time format
        var endDate = new Date(startDate.toDateString() + " " + fourty.aimed_departure_time);

        // Calculate time difference (for 40) in seconds and append to the object
        fourty.countdown_seconds = moment(endDate).diff(startDate, 'seconds');

        console.log(one_six_three);
        console.log(fourty);
    });
});
