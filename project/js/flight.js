var skyWidth = 0; 
var width = 64; 
var height = 64;

var fuselageFill;
var groundBlocks = []; 

function displayFlowSolver(canvasId,windModelId){
	var canvas = document.getElementById(canvasId),
		windModel = document.getElementById(windModelId),
		ctx = canvas.getContext("2d"),
		windCtx = windModel.getContext("2d"),
		imageData = ctx.createImageData(width,height),
		worker = new Worker("js/flow/solverWorker.js");
	
	canvas.width = width;
	canvas.height = height;
	worker.postMessage({cmd:"init",width:width,height:height});
	var img = new Image();
	img.src = "images/plane1.png";
	windCtx.drawImage(img,58,8,400,90);
	worker.onmessage = function(e){
		switch(e.data.cmd){
			case "ready":
				setInterval(function(){
					worker.postMessage({cmd:"tick"});
				},10);
				break;
			case "ticked":
				var rho = e.data.density; 
				for (i = 0, il = (width)*(height)*4 ; i < il; i += 4){
					var index = i/4;
					imageData.data[i] = 255;
					imageData.data[i+1] = 255;
					imageData.data[i+2] = 255;
					imageData.data[i+3] = rho[index]*405;
				}
				ctx.putImageData(imageData,0,0);
			break;
		}
	};
}
 