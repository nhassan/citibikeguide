var schedule = require('node-schedule');
var jobs = require('./jobs');


// ---------------------------------
// SCHEDULE THE TASKS
// ---------------------------------

var everyMinuteReccurrenceRule = new schedule.RecurrenceRule();
schedule.scheduleJob(everyMinuteReccurrenceRule, jobs.updateCitiBikeData);


// ---------------------------------
// DEBUG
// ---------------------------------

exports.debug = function() {
  jobs.updateCitiBikeData();
};

jobs.updateCitiBikeData();