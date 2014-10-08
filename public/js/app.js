'use strict';

var app = angular.module("app", []);

function RunTest(){
  var socket = io.connect();
  socket.emit('BeginTestProcess', { });
}
function LoadTestCtrl($scope){
  $scope.RunTest = RunTest;
}

angular.module("app", [])
  .controller('LoadTestCtrl', LoadTestCtrl);
