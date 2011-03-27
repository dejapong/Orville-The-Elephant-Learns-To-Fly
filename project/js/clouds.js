function CloudsDisplay(paper,gameW,gameH){
	var NUM_CLOUDS = 12;
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
		var newCloud = cloud.clone()
			.translate(Math.random()*gameW*2-gameW,Math.random()*gameH*2-gameH);
		newCloud.speed = Math.random() + 0.1;
		newCloud.scale(newCloud.speed);
		newCloud.attr("opacity",0.7*newCloud.speed);
		clouds.push(newCloud);
	}
	
	return {
		fadeHide:function(callback){
			for (i = 0 ; i <NUM_CLOUDS; i++){
				var cloud = clouds[i];
				cloud.animate({opacity:0},500,function(){
					if (callback){
						callback();
						callback = undefined; 
					}
					this.hide();
				});			
			}
		},
		fadeShow:function(callback){ 
			for (i = 0 ; i <NUM_CLOUDS; i++){
				var cloud = clouds[i];			
				var opacity = cloud.speed*0.7;
				cloud.show();
				cloud.animate({opacity:opacity},500,function(){
					if (callback) callback();
				});	
			}
		},
		setSpeed:function(metersPerSecond){
			u = metersPerSecond/4 * Math.cos(angle*Math.PI/180);
			v = metersPerSecond/4 * Math.sin(angle*Math.PI/180);
			speed = metersPerSecond/4; 
		},
		tick:function(){
			for (i = 0 ; i <NUM_CLOUDS; i++){
				var cloud = clouds[i],
				translation = cloud.attr("translation"),
				speed = cloud.speed; 
				cloud.attr({"translation": u*speed + " " + v*speed});
				if (translation.x > gameW+cloudWidth)
					cloud.attr("translation",-(gameW+2*cloudWidth));		
				else if (translation.x < -cloudWidth)
					cloud.attr("translation",(gameW+2*cloudWidth));		
				if (translation.y > gameH+cloudWidth)
					cloud.attr("translation","0 "+ -(gameH+2*cloudWidth));
				else if (translation.y < -cloudWidth)
					cloud.attr("translation","0 "+ +(gameH+2*cloudWidth));		
			}
		},
		setAngle:function(degrees){
			angle = degrees;
			//this.setSpeed(speed);
		}
	}
}
