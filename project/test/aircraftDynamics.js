function AircraftDisplay(containerId, width, height){

	var x0 = 400;
	var y0 = 250;
	
	var paper = Raphael(containerId,width,height);	
	var planePic = paper.image("../images/plane1.png",x0,y0,98*2,30*2);
	var plane = spitfire;
	plane.setState(100, 0, 0, 5, 5, 0, 0)
	plane.setElevatorAngle(-10);
	return {
		tick:function(){
			var i = 0;
			var inter = setInterval(function(){			
				state = plane.tick(0.1);
				//planePic.translate(-state[5],state[6]);
				planePic.rotate(r2d*state[4], true);
				i++;
				if (i>13000) clearInterval(inter);
			},10)	
		}
	}	
}
