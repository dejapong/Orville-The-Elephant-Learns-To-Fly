function AircraftDisplay(containerId, width, height){
	var x0 = 400;
	var y0 = 250;	
	var paper = Raphael(containerId,width,height);	
	var clouds = CloudsDisplay(paper,980,600);
	var planePic = paper.image("images/plane1.png",x0,y0,98*2,30*2);
	var plane = spitfire;
	plane.setState(100, 0, 0, 5, 5, 0, 0)
	plane.setElevatorAngle(-5);
	plane.setThrottle(0.5);
	return {
		changeElevatorAngle: plane.changeElevatorAngle,
		changeThrottle: plane.changeThrottle,
		getElevatorAngle: plane.getElevatorAngle,
		getThrottle: plane.getThrottle,
		tick:function(){
			var i = 0;
			var inter = setInterval(function(){			
				var state = plane.tick(0.05);
				var speed = state[0];
				var gamma = r2d*state[1];				
				var theta = r2d*state[4];
				planePic.rotate(theta, true);
				clouds.setAngle(gamma);
				clouds.setSpeed(speed);
				i++;
				if (i>13000) clearInterval(inter);
			},20)	
		}
	}	
}
