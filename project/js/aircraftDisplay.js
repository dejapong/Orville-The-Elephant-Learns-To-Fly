function AircraftDisplay(){
	worker = new Worker("js/aircraft.js");
	
	var elevatorAngle = 0;
	var throttle = 0;
	var state = [];
	
	worker.onmessage = function(e){
		switch(e.data.mesg){
			case "ticked":				
				state = e.data.state;				
				break;
			case "elevatorAngle":
				elevatorAngle = e.data.elevatorAngle;
				break;
			case "throttle":	
				throttle = e.data.throttle;
				break;
			case "inited":				
				break;
		}		
	}
	return {
		tick:function(dt){
			worker.postMessage({
				cmd:"tick", dt:dt,				
			})			
			return state;
		},
		setElevatorAngle:function(angle){
			worker.postMessage({
				cmd:"setElevatorAngle", elevatorAngle:angle
			})
		},
		setThrottle:function(throttle){
			worker.postMessage({
				cmd:"setThrottle", throttle:throttle
			})
		},
		changeElevatorAngle:function(angle){
			worker.postMessage({
				cmd:"changeElevatorAngle",elevatorAngle:angle
			})
		},
		changeThrottle:function(throttle){
			worker.postMessage({
				cmd:"changeThrottle",throttle:throttle
			})
		},
		setState:function(speed0, gamma0, q0, alpha0, theta0, x0, z0){
			state = [speed0, gamma0, q0, alpha0, theta0, x0, z0];
			worker.postMessage({
				cmd:"setState", speed0:speed0, gamma0:gamma0, q0:q0, alpha0:alpha0, theta0:theta0, x0:x0, z0:z0
			})
		},
		getElevatorAngle:function(){
			return elevatorAngle;
		},
		getThrottle:function(){
			return throttle;
		}
	}
}

