var http = require('http');

function runTest(socket, config, testNum){
  var start = new Date();

var req = http.request(config.connection_options, function(res) {
    console.log("statusCode: ", res.statusCode);
    console.log('Request ('+  testNum + ') took:', new Date() - start, 'ms');
    socket.emit('TestFinished', {
      testNumber: testNum,
      statusCode: res.statusCode,
      duration:  new Date() - start
      });

    res.setEncoding('utf8');
    res.on('data', function(d) {  });
  });
  req.end();

  req.on('error', function(e) {
    console.error(e);
  });
}

function runTests(socket, config){
  for(var i = 1; i <= config.test_options.iterations; i++) {
    console.log("Running " + i);
    socket.emit('TestStarted', { testNumber: i });
    runTest(socket,config,i);
  }
}

module.exports.runTests=runTests;
