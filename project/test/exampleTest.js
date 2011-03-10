/** 
	This test is intended to be run in node via the command line 
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



