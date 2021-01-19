//Load and initialize the serial modem and set parser
var SerialPort = require('serialport');
var Readline = require('@serialport/parser-readline');
var port = new SerialPort(global.modemPort);

var parser = port.pipe(new Readline({ delimiter: '\n' }));

parser.on('data', function(data) {
    console.log('Data received: ' + data);
    //If data contains a number extract it and activate the current caller.
    if(data.indexOf("NMBR=") > -1){
        var phoneNumber = data.substring(5);
        phoneNumber = phoneNumber.substring(0, phoneNumber.length-1);
        console.log('Callers number: ' + phoneNumber);
        global.callHandler.receiveCall(phoneNumber);
    }
});

port.write("AT+VCID=1\r", function(err) {
    if (err) {
        return console.log('Error on write: ', err.message);
    }
    console.log('Enabling CallerId nice');
});


//Make listPorts function available to other parts of the program.
module.exports = {
  listPorts: function (callback) {
    listPorts(callback);
  }
};

//List ports that are available on this system.
function listPorts(callback){
    serialport.list(function (err, ports) {
        callback(ports);
    });
}
