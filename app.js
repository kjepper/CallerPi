//The current active caller
global.activeCaller = {activeCaller:false};
//Timeout for when current call ends (since we can't monitor if call is still ongoing)
global.activeCallerTimeOut = null;
//global.modemPort = "/dev/ttyACM0";
global.modemPort = "COM1";

//Loading own libraries
global.callHandler = require('./libs/callhandler');
global.modemListener = require('./libs/modemlistener');

//Loading webserver library
var express = require('express');
var app = express();

//Map public folder to outside world
app.use('/', express.static(__dirname + '/public'));

//Returns the active caller
app.get('/api/getactivecaller', function (req, res) {
    console.log(activeCaller);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(activeCaller));    
});

//Returns the call latest call history (limited at 4)
app.get('/api/getcallhistory', function (req, res) {
    global.callHandler.getCallHistory(sendResponse, 4);
    function sendResponse(result){
        console.log(result);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result));        
    }     
});

//Insert a name for a specific number
app.get('/api/insert', function (req, res) {
    console.log(req.query.phoneNumber);
    console.log(req.query.firstName);  
    console.log(req.query.lastName);
	if(req.query.phoneNumber && (req.query.firstName || req.query.lastName)){
		console.log("Inserting caller details");
		global.callHandler.setCaller(req.query.phoneNumber, req.query.firstName, req.query.lastName);
	}
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify("ok"));        
});

//DEBUG FUNCTIONALITY
app.get('/api/debug/listports', function (req, res) {
    global.modemListener.listPorts(sendResponse);
    function sendResponse(result){
        console.log(result);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result));        
    }    
});

app.get('/api/debug/fakecall/:phonenumber', function (req, res) {
    global.callHandler.receiveCall(req.params.phonenumber);
	res.setHeader('Content-Type', 'application/json');
	res.end(JSON.stringify("ok"));        
});

var server = app.listen(80);
