/*
 * CitiBike Guide
 */

var express = require('express');
var dao = require('./dao');
var app = express();
var worker = require('./citibike-worker');
var requests = require('./requests');

// ------------------------------
// CONFIGURE
// ------------------------------

app.use(express.logger());
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').renderFile);
app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());


// ------------------------------
// REQUESTS
// ------------------------------

app.get('/', requests.home);
app.get('/api/stations', requests.stations);
app.get('/api/station/:id', requests.station);
app.post('/api/station/:id', requests.stationAddTip);


// ------------------------------
// STARTUP
// ------------------------------

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Citi Bike Guide App Server');
  console.log("Listening on port " + port + " in " + app.settings.env + " mode");
});