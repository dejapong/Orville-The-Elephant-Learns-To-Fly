function AircraftDisplay(holderId,width,height){
	var paper = Raphael(holderId,width,height);
	var linkage = new Linkage(paper,{
		stickLength:80, stickJoinLocation:15, stickPivotX:400, stickPivotY:225,
		elevPivotX:790, elevPivotY:165, hornLength:30, elevChord:150, elevThickness:7,
		minAngle:-40, maxAngle:40
	});
	paper.image("images/plane1.png",25,0,900,300).toBack();
}

function Linkage(paper, options){
	//Defaults
	var o = {
		stickLength:80, stickJoinLocation:15, stickPivotX:240, stickPivotY:260,
		elevPivotX:530, elevPivotY:235, hornLength:30, elevChord:100, elevThickness:5,
		minAngle:-40, maxAngle:40
	};
	for (option in options) o[option] = options[option];
	
	//Local Vars
	var sX = o.stickPivotX, sY = o.stickPivotY, sL = o.stickLength, sJ = o.stickJoinLocation,
		eX = o.elevPivotX, eY = o.elevPivotY, eL = o.hornLength,
		tt = o.elevThickness, ct = o.elevChord,
		startX, startY, onStick;
		
	//Materials and Colors
	var metalPart = {"fill":"#ccc","stroke":"#999"},
		grip = {"fill":"#a44","stroke":"#300"},
		skin = {"fill":"#4a4","stroke":"#030"},
		stick = paper.rect(sX-3,sY-sL,6,sL),
		stickHub = paper.circle(sX,sY,10),
		handle = paper.rect(sX-5,sY-sL,10,30,3);

	//Control Stick
	stickSet = paper.set();
	stickSet.push(stick);
	stickSet.push(handle);
	stickSet.drag(move, startS, upS);
	
	stick.attr(metalPart);
	stickHub.attr(metalPart);
	handle.attr(grip);
	
	//Elevator
	var horn = paper.rect(eX-3,eY-eL+3,6,eL);
	var elevator = paper.path(
		"M"+ eX + " " + (eY - tt - eL)
		+ "L" + (eX + ct - 10) + " " + (eY - eL)
		+ "L" + eX + " " + (eY + tt -eL)
		+ "L" + (eX - 10) + " " + (eY - eL) 
		+ "L"+ eX + " " + (eY - tt - eL) 
	);
	var hornHub = paper.circle(eX,eY-eL,5);
	elevator.attr(skin);
	hornHub.attr(skin);
	horn.attr(metalPart);
	elevatorSet = paper.set(); 
	elevatorSet.push(horn);
	elevatorSet.push(elevator);
	elevatorSet.drag(move, startE, upE);

	//Arm
	var arm = paper.path("M" + sX + " " + (sY-sJ) + "L" + eX + " " + eY );
	arm.attr({"stroke-width":3,"stroke":"#999"});
	arm.insertBefore(stick);
	
	//Drag functions
	function move(dx,dy){	
		var x = this.startX + dx; 
		var y = this.startY + dy;  
		var oX, oY; 
		if (onStick){ oX = sX; oY = sY;} else{ oX = eX; oY = eY - eL;}
		var angle = Raphael.angle(oX,oY,x,y)-90;    
		if (!onStick) angle = angle * -1 + 90;
		if (angle > o.minAngle && angle < o.maxAngle){
			var radAngle = angle * Math.PI/180; 
			stickSet.rotate(angle,sX,sY);
			elevatorSet.rotate(-angle/2,eX,eY-eL);
			var sJX = sX + sJ * Math.sin(radAngle);
			var sJY = sY - sJ * Math.cos(radAngle);
			var eJX = eX - eL * Math.sin(-radAngle/2);
			var eJY = (eY-eL) + eL * Math.cos(-radAngle/2);
			arm.attr("path","M" + sJX + " " + sJY + "L" + eJX + " " + eJY);
		}
	};
	
	function startS(){  
		onStick = true;
		this.startX = this._drag.x - this.paper.canvas.offsetLeft; 
		this.startY = this._drag.y - this.paper.canvas.offsetTop;  
	};
	function startE(){ 
		onStick = false;
		this.startX = this._drag.x - this.paper.canvas.offsetLeft; 
		this.startY = this._drag.y - this.paper.canvas.offsetTop;  
	};
	function upS(){};
	function upE(){};	
}