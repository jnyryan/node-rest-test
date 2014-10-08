var http = require('http');

var options = {
  hostname: '0.0.0.0',
  port: 5000,
  path: '/',
  method: 'GET',
  auth: 'glguser:GLgroup123'
};

function runTest(socket,testNum){
  var start = new Date();

  var req = http.request(options, function(res) {
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

function runTests(socket){
  for(var i = 1; i <= 1; i++) {
    console.log("Running " + i);
    socket.emit('TestStarted', { testNumber: i });
    runTest(socket,i);
  }
}

module.exports.runTests=runTests;
