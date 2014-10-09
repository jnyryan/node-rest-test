var http = require('http');

//cstr
function TestLoader(io){
  io.on('connection',function(socket){
    console.log('connection established ...')

    socket.on('BeginTestProcess', function (config) {
      console.log('BeginTestProcess');
      RunTestGroup(socket, config);
    });
  });
}

function RunTestGroup(socket, config){
  socket.emit('TestGroupStarted', config);
  for(var i = 1; i <= config.test_options.iterations; i++) {
    console.log("Running " + i);
    RunTestIteration(socket,config,i);
  }
};

function RunTestIteration(socket, config, testNum){
    var start = new Date();
    socket.emit('TestStarted', { testNumber: testNum });
    var req = http.request(config.connection_options, function(res) {
    console.log("statusCode: ", res.statusCode);
    console.log('Request ('+  testNum + ') took:', new Date() - start, 'ms');

    if(res.statusCode==200)
      socket.emit('TestPassed', {
        testNumber: testNum,
        statusCode: res.statusCode,
        duration:  new Date() - start
        });
    else
      socket.emit('TestFailed', {
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
};

module.exports = TestLoader;
