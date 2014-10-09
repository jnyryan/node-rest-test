'use strict';

var app = angular.module('app', []);

/////////////////////////////////////////////
// Controllers
angular.module('app')
  .controller('LoadTestCtrl',  ['$scope', 'socket', 'SavedOptionsService', function($scope,socket,SavedOptionsService){
    $scope.testStartedCount = 0;
    $scope.testFinishedCount = 0;
    $scope.testPassedCount = 0;
    $scope.testFailedCount = 0;

    $scope.RunTest = function(){
      $('#results').empty();
      var opt=SavedOptionsService.GetSavedOptions();
      socket.emit('BeginTestProcess', opt);
    };

    socket.on('TestGroupStarted', function (config) {
      $scope.summaryData={
        transport: config.test_options.transport,
        iterations: config.test_options.iterations,
        hostname:  config.connection_options.hostname,
        port: config.connection_options.port,
        path: config.connection_options.path,
        method: config.connection_options.method,
        auth: config.connection_options.auth
      };
    });

    socket.on('TestStarted', function (data) {
      console.log(data);
      var elementId = "testResult" + data.testNumber;
      $('#results').append($('<span id="' + elementId + '" style="float:left;color: #4F9CEF; font-size: 20px;">&#x2B22;</span>'));
      $scope.testStartedCount = $scope.testStartedCount + 1;
    });

    socket.on('TestPassed', function (data) {
      console.log(data);
      $('#testResult' + data.testNumber).css("color","#6C6");
      $scope.testPassedCount = $scope.testPassedCount+1;
      $scope.testCompletedCount = $scope.testPassedCount + $scope.testFailedCount;
    });

    socket.on('TestFailed', function (data) {
      console.log(data);
      $('#testResult' + data.testNumber).css("color","red");
      $scope.testFailedCount = $scope.testFailedCount + 1;
      $scope.testCompletedCount = $scope.testPassedCount + $scope.testFailedCount;
    });

    $scope.data = SavedOptionsService.GetSavedOptions();

  }]);

/////////////////////////////////////////////
// Services
angular.module('app')
  .service('SavedOptionsService', [function(){
    this.GetSavedOptions = function(){
      return {
        connection_options : {
          hostname: '0.0.0.0',
          port: 3000,
          path: '/',
          method: 'GET',
          auth: 'glguser:GLgroup123'
        },
        test_options:{
          transport: 'HTTPS',
          iterations: 2000
        }
      };
    };
  }])

angular.module('app')
  .factory('socket', ['$rootScope', function ($rootScope) {

    var socket = io.connect();

    return {
      on: function (eventName, callback) {
        socket.on(eventName, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        })
      }
    };

  }]);
