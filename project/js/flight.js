var skyWidth = 0; 
var width = 64; 
var height = 64;
var solver = Solver(width,height);
var fuselageFill;
var groundBlocks = []; 

function displayFlowSolver(canvasId){
	var canvas = document.getElementById(canvasId); 
	var ctx = canvas.getContext("2d"); 
	
	canvas.width = width;
	canvas.height = height;
	
	var imageData = ctx.createImageData(width,height);
	
	setInterval(function(){
		solver.tick();
		var rho = solver.getDensity(); 
		var walls = solver.getWalls(); 
		
		for (i = 0, il = (width)*(height)*4 ; i < il; i += 4){
			var index = i/4;
			if (walls[index] != 1){	
				imageData.data[i] = rho[index]*300+30;
				imageData.data[i+1] = rho[index]*300+125;
				imageData.data[i+2] = 255;
				imageData.data[i+3] = 255;
			}else{
				imageData.data[i] = 255;
				imageData.data[i+1] = 255;
				imageData.data[i+2] = 0;
				imageData.data[i+3] = 255;
			}
		}
	ctx.putImageData(imageData,0,0);	
	},10);
}

function drawControls(divId){
	new Raphael.fn.slider(divId,{
		min:-90,
		max:90,
		initial:0,
		callback:function(value){
			solver.setAlpha(value);
			fuselageFill.rotate(value,300,200);
		}
	});
}

function drawSky(divId,width,height){
	paper = new Raphael(divId,width,height);
	var rect = paper.rect(0,0,width,height); 
	rect.attr({fill:"90-#fff4b9-#50b0ff"});
	skyWidth = width;
	skyHeight = height;
}

function createPlane(){
	fuselageFill = paper.path("M679.08,271.24L678,297.11c-51.22,8.53-169.42,49.14-274.09,60.86c-112.49,2.17-208.73,8.391-282.91-61.99C222.08,232.94,567.16,260,679.08,271.24z");
	fuselageFill.scale(-0.25,0.25);
	fuselageFill.translate(-250,70);
	fuselageFill.attr({"fill":"90-#660000-#ff0000","stroke-width":2});
	console.log(fuselageFill.attr("translation"));
}

function drawPlane(y,angle){
	if (y < 0) y = 0;
	y = y / 100;
	diff = (fuselageFill.attr("translation").y - (70 + y));

	fuselageFill.attr({"rotation":angle,"translation":"0 " + diff });
}

function drawGround(x){
	for (var i = 0 ; i < skyWidth ; i += 100){
		if (x > skyWidth) x = x % skyWidth; 
		var offset = i-x;
		if (offset < 0) offset += skyWidth;
		groundBlocks[i].attr({x:offset});
	 }
}

function createGround(){
	 for (var i = 0 ; i < skyWidth ; i += 100){
	 	groundBlocks[i] = paper.rect(i,skyHeight-7,90,10);
	 }
}

