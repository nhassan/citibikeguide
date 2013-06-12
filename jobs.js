var dao = require('./dao');
var needle = require('needle');




// ------------------------------------------------
// Update Citi Bike Data
// ------------------------------------------------

exports.updateCitiBikeData = function() {

  needle.get('http://citibikenyc.com/stations/json/', function(err, response, body) {
    if (err) {
      console.error(err);
      return;
    }

    var statusJSON = JSON.parse(body);
    var executionTime = new Date(statusJSON.executionTime);
    dao.getStatusDAO().hasDataForDate(executionTime, function(err, hasData) {
      if (err) {
        console.error(err);
        return;
      }

      if (hasData) {
        console.log('Already have this data, no need!');
      } else {

        var newStatus = dao.getStatusDAO().createNewStatus({
          fetchedOn: executionTime,
          stations: statusJSON.stationBeanList
        });

        // update existing stations
        newStatus.get('stations').forEach(function(station) {
          dao.getStationDAO().getStationByStationId(station.stationId, function(err, doc) {
            if (err) {
              console.error(err);
            } else {
              if (!doc) {
                doc = dao.getStationDAO().createNewStation(station);
              }

              doc.set('stationId', station.id);
              doc.set('availableBikes', station.availableBikes);
              doc.set('totalDocks', station.totalDocks);
              doc.set('availableDocks', station.availableDocks);
              doc.set('statusValue', station.statusValue);

              doc.save();
            }
          });
        });

        newStatus.save(function() {
          if (err) {
            console.error('issue storing');
          } else {
            console.log('Stored this new status!');
          }
        });
      }
    });
  });

};