var dao = require('./dao');


// ------------------------------------------------
// GET /
// ------------------------------------------------

exports.home = function(request, response) {
  response.render('home');
};


// ------------------------------------------------
// GET /api/stations
// ------------------------------------------------

exports.stations = function(request, response) {
  dao.getStationDAO().getAllStations(function(err, docs) {
    if (err) {
      console.error(err);
      response.json({
        error: 'Something went wrong. We\'ve been notified'
      });
    } else {

      var stationsTrimmed = [];
      docs.forEach(function(station) {
        stationsTrimmed.push({
          stationId: station.stationId,
          stationName: station.stationName,
          availableBikes: station.availableBikes,
          availableDocks: station.availableDocks,
          workingDocs: station.workingDocs,
          numLatestTips: station.numLatestTips
        });
      });

      response.json({
        stations: stationsTrimmed
      });
    }
  });
};


// ------------------------------------------------
// GET /api/station/:id
// ------------------------------------------------

exports.station = function(request, response) {
  dao.getStationDAO().getStationByStationId(request.params.id, function(err, station) {
    if (err) {
      console.error(err);
      response.json({
        error: 'Something went wrong. We\'ve been notified'
      });
    } else {

      dao.getStationTipDAO().getTipsByStationId(request.params.id, function(err, tips) {
        if (err) {
          console.error(err);
          response.json({
            error: 'Something went wrong. We\'ve been notified.'
          });
        } else {
          response.json({
            station: station,
            tips: tips
          });
        }
      });
    }
  });
};



// ------------------------------------------------
// POST /api/station/:id
// ------------------------------------------------

exports.stationAddTip = function(request, response) {
  var newTip = dao.getStationTipDAO().createStationTip({
    tip: request.body.tip,
    name: request.body.name,
    stationId: request.params.id,
    ipAddress: request.remoteAddress
  });

  newTip.save(function() {
    response.json({
      tip: newTip
    });
  });
};