var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mongoConnectUrl = process.env.MONGOLAB_URI || 'mongodb://localhost/citibikeguide';
mongoose.connect(mongoConnectUrl);

console.log('MongoService ' + mongoConnectUrl + ' [OK]');

/*jslint supernew:true*/

// ------------------------------------
// StationDAO
// ------------------------------------

var StationDAO = new (function(mongoose) {

  var Station = mongoose.model('Station', {
    stationId: String,
    stationName: String,
    availableDocks: Number,
    totalDocks: Number,
    latitude: Number,
    longitude: Number,
    statusValue: String,
    statusKey: Number,
    availableBikes: Number,
    stAddress1: String,
    stAddress2: String
  });

  // PUBLIC METHODS
  this.getStationByStationId = function(stationId, callback) {
    Station.findOne({
      stationId: stationId
    }, function(err, doc) {
      if (err) {
        callback(err);
      } else {
        callback(null, doc);
      }
    });
  };

  this.getAllStations = function(callback) {
    Station.find({}, callback);
  };

  this.createNewStation = function(data) {
    return new Station(data);
  };

})(mongoose);

exports.getStationDAO = function() { return StationDAO; };

// ------------------------------------
// StationTipDAO
// ------------------------------------

var StationTipDAO = new (function(mongoose) {

  var Tip = mongoose.model('Tip', {
    stationId: String,
    ipAddress: String,
    name: String,
    tip: String,
    addedOn: {
      type: Date,
      'default': Date.now
    }
  });

  // PUBLIC METHODS
  this.getTipsByStationId = function(stationId, callback) {
    Tip
      .find({ stationId: stationId })
      .sort('-addedOn')
      .exec(function(err, docs) {
        if (err) {
          callback(err);
        } else {
          callback(null, docs);
        }
      });
  };

  this.createStationTip = function(data) {
    return new Tip(data);
  };

})(mongoose);

exports.getStationTipDAO = function() { return StationTipDAO; };

// ------------------------------------
// StatusDAO
// ------------------------------------

var StatusDAO = new (function(mongoose) {

  var Status = mongoose.model('Status', {
    fetchedOn: Date,
    stations: [Schema.Types.Mixed]
  });

  // PUBLIC METHODS
  this.hasDataForDate = function(date, callback) {
    Status.findOne({
      fetchedOn: date
    }, function(err, doc) {
      if (err) {
        callback(err);
      } else if (!!doc) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    });
  };

  this.createNewStatus = function(data) {
    return new Status(data);
  };

  this.getLatestStatus = function(callback) {
    Status.findOne({}).sort('-fetchedOn').exec(function(err, doc) {
      if (err) {
        callback(err);
      } else {
        callback(null, doc);
      }
    })
  };

})(mongoose);

exports.getStatusDAO = function() { return StatusDAO; };