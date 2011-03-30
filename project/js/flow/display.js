function FlowSolverDisplay(canvasId){
	var width =98; 
	var height =60;
	var canvas = document.getElementById(canvasId),
		ctx = canvas.getContext("2d"),
		imageData = ctx.createImageData(width,height),
		worker = new Worker("js/flow/solverWorker.js"),
		globalAlpha = 505,
		solverInt; 
		
	canvas.width = width;
	canvas.height = height;

	worker.onmessage = function(e){
		switch(e.data.cmd){
			case "ready":
				solverInt = setInterval(function(){
					worker.postMessage({cmd:"tick"});
				},50);
				break;
			case "ticked":
				var rho = e.data.density; 
				for (i = 0, il = (width)*(height)*4 ; i < il; i += 4){
					var index = i/4;
					imageData.data[i] = 255;
					imageData.data[i+1] = 255;
					imageData.data[i+2] = 255;
					imageData.data[i+3] = rho[index]*globalAlpha;
				}
				ctx.putImageData(imageData,0,0);
			break;
		}
	};
	return{
		start:function(){
			worker.postMessage({cmd:"init",width:width,height:height});
		},
		setAirfoil:function(airfoil){
			worker.postMessage({cmd:"airfoil",airfoil:airfoil}); 
		},
		setAlpha:function(alpha){
			worker.postMessage({cmd:"alpha",alpha:alpha}); 
		},
		fadeHide:function(){
			var step = globalAlpha / (10); 
			var fadeInt = setInterval(function(){
				globalAlpha -= step;
				if (globalAlpha <= 0){
					clearInterval(fadeInt);
					clearInterval(solverInt);
					ctx.clearRect(0,0,width,height);
				}
			},30);
		}
	}
}
 