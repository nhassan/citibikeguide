angular.module('citibikeguide', []).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/', {
        templateUrl: 'partials/home.html',
        controller: StationsCntrl
      })
      .when('/station/:stationId', {
        templateUrl: 'partials/station.html',
        controller: StationCtrl
      }).
      otherwise({redirectTo: '/'});
}]);

/*
 * STATIONS
 * CONTROLLER
 */
function StationsCntrl($scope, $http) {

  function refreshStationData() {
    $http.get('/api/stations').success(function(data) {
      setStationsData(data.stations, $scope.search);

      setTimeout(refreshStationData, 10000);
    });
  }

  refreshStationData();

  var fullStationsData;
  function setStationsData(data, filter) {
    fullStationsData = data;
    var finalData = [];

    if (!!filter && filter != '') {
      var propertiesToCheck = ['stationName'];
      var reg = new RegExp(filter.split('').join('\\w*').replace(/\W/, ""), 'i');
      for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < propertiesToCheck.length; j++) {
          var propName = propertiesToCheck[j];

          if (data[i][propName].match(reg)) {
            finalData.push(data[i]);
          }
        }
      }
    } else {
      finalData = finalData.concat(data);
      $scope.noResults = false;
    }


    $scope.noResults = (finalData.length === 0);
    $scope.stations = finalData;
  }

  // search
  $scope.updateResults = function() {
    setStationsData(fullStationsData, $scope.search);
  };
}


/*
 * SINLGE STATION
 * CONTROLLER
 */

function StationCtrl($scope, $routeParams, $http) {
  $scope.stationId = $routeParams.stationId;

  function refreshStationData() {
    $http.get('/api/station/' + $routeParams.stationId).success(function(data) {
      $scope.station = data.station;
      $scope.tips = data.tips.map(function(tip) {
        tip.addedOn = getRelativeTime(new Date(tip.addedOn));
        return tip;
      });

      setTimeout(refreshStationData, 10000);
    });
  }

  refreshStationData();

  $scope.save = function(tip) {
    if (!tip || !tip.message) {
      alert('Please enter a tip to submit.');
      return;
    }

    $http.post('/api/station/' + $routeParams.stationId, {
      tip: tip.message,
      name: tip.name
    }).success(function(data) {

      $scope.submittedTip = true;
      refreshStationData();
    });
  };
}


/*
 * Utility for relative time
 */
function getRelativeTime(date, current) {
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = (current || new Date()) - date;

  if (elapsed < msPerMinute) {
       return Math.round(elapsed/1000) + ' seconds ago';   
  }

  else if (elapsed < msPerHour) {
       return Math.round(elapsed/msPerMinute) + ' minutes ago';   
  }

  else if (elapsed < msPerDay ) {
       return Math.round(elapsed/msPerHour ) + ' hours ago';   
  }

  else if (elapsed < msPerMonth) {
      return 'approximately ' + Math.round(elapsed/msPerDay) + ' days ago';   
  }

  else if (elapsed < msPerYear) {
      return 'approximately ' + Math.round(elapsed/msPerMonth) + ' months ago';   
  }

  else {
      return 'approximately ' + Math.round(elapsed/msPerYear ) + ' years ago';   
  }
}