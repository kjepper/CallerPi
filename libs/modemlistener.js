//Load and initialize the serial modem and set parser
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var sp = new SerialPort(modemPort, {
  parser: serialport.parsers.readline("\n")
});

//Actively listen to the in app.js configured port.
sp.on("open", function () {
    console.log("Listening on port: " + modemPort);
	//Send command to modem to show caller-id in nice format.
    sp.write("AT+VCID=1", function(err, results) {
        sp.drain(console.log('Enabling CallerId nice format: ' + results));
    });    
    
	//Respond to data received from modem
    sp.on('data', function(data) {
        console.log('Data received: ' + data);
		//If data contains a number extract it and activate the current caller.
        if(data.indexOf("NMBR=") > -1){
            var phoneNumber = data.substring(5);
			console.log('Callers number: ' + phoneNumber);			
			global.callHandler.receiveCall(phoneNumber);
        }
    });
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