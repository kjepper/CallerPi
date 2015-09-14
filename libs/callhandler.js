//Load and initialize the database with callhistory and caller names
var Datastore = require('nedb');
db = {};
db.callers = new Datastore('db/callers.db');
db.callHistory = new Datastore('db/callHsitory.db');
db.callers.loadDatabase();
db.callHistory.loadDatabase();

//Initialize library for sending linux commands to the system
var sys = require('sys');
var exec = require('child_process').exec;

//Make certain functions available for the rest of the program
module.exports = {
  receiveCall: function (phoneNumber){
	receiveCall(phoneNumber);
  },
  getCallHistory: function (callback, max){
	getCallHistory(callback, max);
  },
  setCaller: function (phoneNumber, firstName, lastName){
	setCaller(phoneNumber, firstName, lastName);
  }  
};

//Main function for handling incoming calls.
function receiveCall(phoneNumber){
	reviveMonitorFromStandby();
	setActiveCaller(phoneNumber);
	setActiveCallerTimeOut();
	addCallerToHistory(phoneNumber);
}

//Revive the monitor from standby
function reviveMonitorFromStandby(){
    console.log("revived from standby");
    exec("su pi -c 'xscreensaver-command -deactivate &'");	
}

//Set the active caller, try to find stored details or show "unknown" caller.
function setActiveCaller(phoneNumber){
    db.callers.findOne({ _id: phoneNumber }, function (err, doc) {
		if(doc){
			activeCaller = {activeCaller: true, callerDetails: {firstName:doc.firstName, lastName:doc.lastName, phoneNumber: doc._id}};
		} else {
			activeCaller = {activeCaller:true, callerDetails: {firstName:"", lastName:"Onbekend", phoneNumber: phoneNumber}};
		}
    }); 
}

//Set the amount of time the active caller is shown.
function setActiveCallerTimeOut(){
	clearTimeout(activeCallerTimeOut);
	activeCallerTimeOut = setTimeout(function() {
		activeCaller = {activeCaller:false};
	}, 300000);
}

//Add a caller to the history of recently called
function addCallerToHistory(phoneNumber){
	var currentTime = new Date().getTime();
    var doc = { _id: currentTime
                   , phoneNumber: phoneNumber};
    db.callHistory.insert(doc);
}

//Return the call history, with limit on amount of returned records sorted on newest first.
function getCallHistory(callback, max){
    db.callHistory.find({}).sort({ _id: 1 }).limit(max).exec(function (err, docs) {
        var numberOfResults = docs.length;
        var counter = 0;
        docs.forEach(function(historyDoc) {
            db.callers.findOne({ _id: historyDoc.phoneNumber }, function (err, doc) {
                var callerDetails = null;
                if(doc){
                    callerDetails = {firstName: doc.firstName , lastName: doc.lastName , phoneNumber: historyDoc.phoneNumber};
                } else {
                    callerDetails = {firstName:"Onbekend", lastName:"Onbekend", phoneNumber: historyDoc.phoneNumber};
                }
                
                historyDoc.callerDetails = callerDetails;
                counter++;
                if(counter === numberOfResults){
                    callback(docs);
                }
            });
        });
    });    
}

//Insert a name for a number
function setCaller(phoneNumber, firstName, lastName){
    var doc = { _id: phoneNumber
                , firstName: firstName
                , lastName: lastName};
    db.callers.insert(doc);
}


