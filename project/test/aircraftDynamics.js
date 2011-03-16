function AircraftDisplay(containerId, width, height){

	var x0 = 800;
	var y0 = 250;
	
	var paper = Raphael(containerId,width,height);	
	var plane = paper.image("../images/plane1.png",x0,y0,98,30);

	return {
		tick:function(){
			plane.translate(-10,0);
		}
	}	
}
