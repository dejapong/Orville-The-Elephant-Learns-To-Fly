/** 
	Example of a command line test for javascript for Dev. 
	
	This test can be run in node via the command line 
	To run, use: 
	
	node exampleTest.js
	
	sys.puts("string") to display a string
	sys.inspect(object) to return a string representation of an object
*/

var sys = require("sys"),
	aircraft = require("../js/aircraft.js"); 
	
var green = "\033[32m";
var red = "\033[1;31m";
var white = "\033[1;37m";

var aircraft = new Aircraft(); 

sys.puts("Aircraft Object looks like:\n " + green + sys.inspect(aircraft) + white);

sys.puts("Setting Throttle"); 
aircraft.setThrottle(5); 

sys.puts("Setting Elevator Alpha"); 
aircraft.setElevatorAlpha(5); 

sys.puts("Running one tick of aircraft");
aircraft.tick(); 

sys.puts("Aircraft X is: " + aircraft.getX()); 
sys.puts("Aircraft Y is: " + aircraft.getY());
sys.puts("Aircraft Alpha is: " + aircraft.getAlpha()); 

/*
	Fastest loop in javascript without Duff's device or reversed
	iteration looks like this: 
*/
for (var i =0, il = 100; i < il; i++){
	//loop body
}

/** To iterate through an object's members you can do this: */
var testObject = {
	name:"Deja",
	age:"25",
	interests:"Long walks on the beach",
}

for (member in testObject){ 
	sys.puts(member + " : " + testObject[member]);
}

/** 
	That's a lot slower than the first loop. Basically, only use this 
	if you don't know what members exist in an object. 
	
	Also, you can use both dot and array notation on objects
*/
testObject.name == testObject["name"] ? sys.puts(green+"True"+white) : sys.puts(red+"False"+white);

/** 
	On the UI thread, if you want the interface to update between 
	iterations, you can use setInterval(). This repeats the passed 
	function at some interval in milliseconds. setTimeout() is related
	but only calls the provided function once, after the timeout has 
	elapsed. 
	
	This calls aircraft.tick every 100 milliseconds. Most browsers have 
	resolution of 15ms, so this isn't very accurate. 
*/
var int1 = setInterval(aircraft.tick,100);

/*
	Stop intervals like this
*/
clearInterval(int1);


/** Of course you inline the function like this: */
var int2 = setInterval(function(){
	//do whatever
	aircraft.tick(); 
	
	/*
		The keyword "this" refers to the current object. 
		Here it refers to the calling interval. So we can kill this
		interval after one tick like this: 
	*/
	clearInterval(this);
	/*
		really, if you wanted to do that though, you should use
		setTimeout(); Usually, you would have some condition you 
		watch for to clear the interval. 
	*/
},100);
