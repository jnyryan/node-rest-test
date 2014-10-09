'use strict';

var app = angular.module("app", []);

function RunTest(){
  var socket = io.connect();
  socket.emit('BeginTestProcess', {
     connection_options : {
      hostname: '0.0.0.0',
      port: 5000,
      path: '/',
      method: 'GET',
      auth: 'glguser:GLgroup123'
    },
    test_options:{
      iterations: 1000
    }
  });
}

/////////////////////////////////////////////
// Controllers
angular.module("app")
  .controller('LoadTestCtrl',  ['$scope', 'SavedOptionsService', function($scope,SavedOptionsService){
      $scope.l = RunTest;
    }]);

/////////////////////////////////////////////
// Services
angular.module("app")
  .service("SavedOptionsService", [function(){
    console.log("here");
    this.GetSavedOptions = function(){
      return {
        connection_options : {
          hostname: '0.0.0.0',
          port: 5000,
          path: '/',
          method: 'GET',
          auth: 'glguser:GLgroup123'
        },
        test_options:{
          transport: 'HTTP',
          iterations: 1000
        }
      };
    };
  }])
