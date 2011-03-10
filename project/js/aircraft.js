Aircraft = function(){
	var throttlePosition = 0,
		elevatorAlpha = 0, //in aircraft axis
		aircraftAlpha = 0; //in earth axis
		x = 0,
		y = 0;
	
	return {
		setThrottle:function(value){
			throttlePosition = value;
		},
		setElevatorAlpha:function(value){
			elevatorAlpha = value;
		},
		getX:function(){
			return x; 
		},
		getY:function(){
			return y;
		},
		getAlpha:function(){
			return aircraftAlpha; 
		},
		tick:function(dt){
			aircraftAlpha = elevatorAlpha * throttlePosition; 
			x = 12; 
			y = 12;
		}
	}
}