function CloudsDisplay(paper,gameW,gameH){
	var NUM_CLOUDS = 10;
	var CLOUD_LAYERS = 3; 
	var clouds = [];
	var cloudWidth = 300; 
	var u =0, v = 0;
	var angle = 0;
	var speed = 0;
	var cloud = paper.path("M73,106.5c0,15.2-0.711,29.5,72.25,29.5c0,8.844,85.75,11,109.75-7.5"
				+"c30,12.5,81.5,2,81.5-13.5c0-19.898-23.034-36-51.5-36"
				+"c0-8.567-15.431-15.5-34.5-15.5c0-11.331-34.887-20.5-78-20.5"
				+"C142.376,43,118,55.076,118,70C93.127,70,73,86.325,73,106.5z")
		.attr({fill:"#fff","stroke-width":0,opacity:0.0});
			
	for (i = 0 ; i < NUM_CLOUDS; i++){
		clouds.push(cloud.clone().translate(Math.random()*gameW*2-gameW,Math.random()*gameH*2-gameH)
			.animate({opacity:0.75},2000));
	}
	
	var cloudInt = startClouds(); 
	function startClouds(){
		return setInterval(function(){			
			for (i = 0 ; i <NUM_CLOUDS; i++){
				var translation = clouds[i].attr("translation");
				var cloud = clouds[i];
				cloud.attr({"translation": u + " " + v});
				
				if (translation.x > gameW+cloudWidth)
					cloud.attr("translation",-(gameW+2*cloudWidth));		
				else if (translation.x < -cloudWidth)
					cloud.attr("translation",(gameW+2*cloudWidth));		
					
				if (translation.y > gameH+cloudWidth)
					cloud.attr("translation","0 "+ -(gameH+2*cloudWidth));
				else if (translation.y < -cloudWidth)
					cloud.attr("translation","0 "+ +(gameH+2*cloudWidth));		
			}
		},30);	
	}
	
	return {
		fadeHide:function(callback){
			clearInterval(cloudInt);
			for (i = 0 ; i <NUM_CLOUDS; i++) clouds[i].animate({opacity:0},function(){this.hide();});
			if (callback) callback();
		},
		fadeShow:function(callback){
			cloudInt = startClouds();
			for (i = 0 ; i <NUM_CLOUDS; i++) clouds[i].animate({opacity:1},function(){this.show();});
			if (callback) callback();
		},
		setSpeed:function(metersPerSecond){
			u = metersPerSecond/4 * Math.cos(angle*Math.PI/180);
			v = metersPerSecond/4 * Math.sin(angle*Math.PI/180);
			speed = metersPerSecond/4; 
		},
		setAngle:function(degrees){
			angle = degrees;
			//this.setSpeed(speed);
		}
	}
}
