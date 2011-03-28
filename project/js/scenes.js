function Scenes(frontId,backId,flowSolver,dynamics){
	var gameW = 980, 
		gameH = 600,
		gw = gameW*0.5, 
		gh = gameH*0.5,
		greenAirfoil = {stroke:"#4a4",fill:"#006838","stroke-width":3},
		redAirfoil = {stroke:"#a44",fill:"#680038","stroke-width":3},
		dialogStyle = {	"fill":"#fff","font-size":20,
						"font-family":"CrimeFighter BB"},
		messageBox, 
		draggable = true,
		renderLoop, renderMethods = {}; 
	
	var front = Raphael(frontId,gameW,gameH),
		back = Raphael(backId,gameW,gameH),
		sky = back.rect(0,0,gameW,gameH).attr({fill:"90-#13354a-#132149"}).toBack(),
		aircraft = AircraftDisplay(),		
		airfoil = AirfoilDisplay(), 
		solver = SolverDisplay(),
		clouds = CloudsDisplay(back,gameW,gameH), linkage; 
	//airfoil.fadeShow();
	//******************************************************************************
	//****	KickOff 
	//****	Open with tile text and fly it away, kicking off scene two
	//******************************************************************************/
	(function(){
		var titleText = ["Orville","the","Elephant","\nLearns","How","to","Fly"], 
			textSet = back.set(),
			buttonSet = front.set();
			
		clouds.setSpeed(90);
		renderMethods["clouds"] = clouds.tick;
		drawIntro();
		
		function drawIntro(){ 
			textSet.push(back.image("images/logo.png",220,-100,520,75)
				.animate({"y":gh-220},1000,"bounce",function(){
					setTimeout(drawTitle,1000);
			}));
		}
		
		function drawTitle(){
			var title = back.text(gameW/2,gh-30,"")
				.attr({	"fill":"#fff","font-size":52,
						"font-weight":"bold","stroke-width":2,stroke:"#000",
						"font-family":"Arfmoochikncheez"});
			textSet.push(title);
			drawNextWord();
			var titleSoFar = "", i = 0;
			function drawNextWord(){
				setTimeout(function(){
					titleSoFar +=" "+titleText[i];
					title.attr({"text":titleSoFar});
					if (++i >= titleText.length){
						drawOptionButtons();
					}
					else drawNextWord();
				},200)
			}
		}
		
		function drawOptionButtons(){
			var optionButtonStyle = {
				"fill":"#fff","stroke":"#a60",
				"font-size":25,
				"font-family":"Arfmoochikncheez",
				"cursor":"pointer"
			};
			var optionButtonFaceStyle={"fill":"#fa0", "cursor":"pointer"}			
			buttonSet.push(front.rect(170,gh+85,200,50,4).attr(optionButtonFaceStyle)
					.click(startFlightSchool))
				.push(front.rect(390,gh+85,200,50,4).attr(optionButtonFaceStyle)
					.click(startFreeFlight))
				.push(front.rect(610,gh+85,200,50,4).attr(optionButtonFaceStyle)
					.click(startWindTunnel))
				.push(front.text(270,gh+112,"Flight School").attr(optionButtonStyle)
					.click(startFlightSchool))
				.push(front.text(490,gh+112,"Free Flight").attr(optionButtonStyle)
					.click(startFreeFlight))
				.push(front.text(710,gh+112,"Wind Tunnel").attr(optionButtonStyle)
					.click(startWindTunnel));
		}
		
		function blowAwayIntro(){
			textSet.animate({"x":-980},1000,">",textSet.hide);
			buttonSet.animate({"x":-980},1000,">",buttonSet.hide);
		}
		function startWindTunnel(){
			Scene2();
			clouds.fadeHide(function(){delete renderMethods.clouds});
			blowAwayIntro();
		}
		
		function startFlightSchool(){
			Scene1();
			blowAwayIntro();
		}
		
		function startFreeFlight(){
			Scene4();
			aircraft.fadeShow();
			aircraft.scale(0.5);
			aircraft.fadeOutFront();
			blowAwayIntro();
		}		
		renderLoop = setInterval(function(){
			for (r in renderMethods){
				renderMethods[r](); 
			}
		},30);
	})();
	
	/*
	aircraft.fadeShow();
	aircraft.scale(0.5);
	aircraft.fadeOutFront();
	Scene4()
	

	//******************************************************************************
	//****	SCENE1 
	//****	aircraft flies in. orville reaches for controls and fails
	//******************************************************************************/
	function Scene1(){
		back.image("images/controlTower.png",10,450,150,150);
		var dialog = back.text(gw,480,"Orville... is that you?").attr(dialogStyle);
		aircraft.toFront();
		aircraft.flyIn(function(){
		aircraft.lookAtUser(function(){
		aircraft.fadeOutFront(startDialog);});});
		function startDialog(){
			dialog.attr("text","What are you doing! you are an elephant, \n"
							+"you can't fly! \nYou can't even reach the controls!");
			setTimeout(tryReaching,2000);
			//end fade out front
		}	
		function tryReaching(){
			aircraft.tryReaching(function(){
				dialog.attr("text","Dont' worry, We'll get you down, \n"
						+"First, I'll have to explain a few things.\n Listen carefully.");				
				endScene(); 
			});
		}
		function endScene(){
			setTimeout(function(){					
				aircraft.fadeHide(function(){});			
				clouds.fadeHide(function(){delete renderMethods["clouds"]});
				dialog.attr("text", "Air over the wings creates an upward force");
				Scene2();
			},2000);
		}
	}
	
	//******************************************************************************
	//****	SCENE2
	//****	Start flow solver, show lift arrows, let user play with airfoil
	//******************************************************************************/
	function Scene2(){
		airfoil.scaleShow();
		solver.start();	
		setTimeout(textPane1,1000);
		function textPane1(){
			messageBox = PopUp(front,
				"Air is all around us. More text about pressure and shear forces, on some level.",
				textPane2);
		}	
		function textPane2(){ 
			messageBox.hide(function(){		
				messageBox = PopUp(front,
					"More text about the air and educational stuff. Talk about Lift, drag and stalls",
					textPane3);
			});
		}
		function textPane3(){ 
			var liftArrow = new LiftArrow(front),
				dragArrow = new DragArrow(front); 
			OnAirfoilMoved = function(angle){
				liftArrow.setValue(angle);
				dragArrow.setValue(angle);
			}
			messageBox.hide(function(){
				setTimeout(function(){
					messageBox = PopUp(front,
					"When you're ready, click ok to learn about stalls",
					Scene3);
				},2000);
			});
		}
	}
	
	//******************************************************************************
	//****	SCENE3 
	//****	stall stuff, show separated and attached flows
	//******************************************************************************/
	var Scene3 = function(){
		var topLine, bottomLine, streamLines, streamInt,neg = -1;
		//start with attached
		draggable = false;
		//rotate, then draw
		airfoil.turnRed(DrawAttached);
		//show box to move on
		messageBox.hide(function(){
			messageBox = PopUp(front,
				"You can see attached flow here",
				DrawSeparated);		
		});
		solver.setAlpha(0);
				
		function DrawAttached(){
			topLine = back.path("M692.39,127.945l-269.25-25.969c-23.125-8-125.5-24-176.25-24c-63.375,0-68.25,18.748-75,18.748h-269");
			bottomLine = back.path("M-97.109,100.976h269c6.625,0,10.125,14.375,69.375,14.375c7.875,0,84.625,0.75,180.375-10.125l270.75,25.219");
			topLine.translate(215,206).scale(1.4).attr({stroke:"#66d"});
			bottomLine.translate(215,212).scale(1.4).attr({stroke:"#d66"});		
			streamLines = back.set(),offset= 970, 
			topLine.node.style.strokeDasharray = "7,7",
			bottomLine.node.style.strokeDasharray = "7,7";			
			streamLines.push(topLine).push(bottomLine);
			streamInt = setInterval(function(){
				offset -= 1;
				topLine.node.style.strokeDashoffset = (neg)*offset;
				bottomLine.node.style.strokeDashoffset = offset;
			},10);
			streamLines.attr({"stroke-width":6});
		}

		function DrawSeparated(){
			messageBox.hide(function(){
				messageBox = PopUp(front,
					"You can see separated flow here",
				endSolver);
				topLine.hide(), bottomLine.hide();					
				solver.setAlpha(20);
				airfoil.setAlpha(20,function(){
					neg = 1; topLine.show(), bottomLine.show();
					topLine.attr("path","M-5,103l205,0.5c16.473,0,18.622-10.636,43-6.875c32.583,5.027,276.084,27.374,378.667-6.625");
					bottomLine.attr("path","M-5,115.5h201.189c19.311,0,143.463,65,213.811,65h211.667");
					topLine.translate(200,150).scale(2.5).attr({stroke:"#66d"});
					bottomLine.translate(220,183).scale(2.5).attr({stroke:"#d66"});					
				});
			});
		}

		function endSolver(){				
			clearInterval(streamInt);
			topLine.remove(); bottomLine.remove(); streamLines.remove();
			solver.fadeHide();
			airfoil.setAlpha(0,function(){
				aircraft.fadeShow();
				aircraft.scale(0.5);
				solver.fadeHide();
				clouds.fadeShow();
				airfoil.scaleHide();
				renderMethods["clouds"] = clouds.tick;
				messageBox.hide(function(){}); 
				Scene4();
			});
		}
	} //end stalls
	
	//******************************************************************************
	//****	SCENE4 
	//****	Flying with centered aircraft
	//******************************************************************************/	
	function Scene4(){
		var 	
			g = 9.81,
			d2r = Math.PI/180,
			r2d = 180/Math.PI;

		var i = 0;
		dynamics.setElevatorAngle(0);
		dynamics.setThrottle(0.5);
		dynamics.setState(100, 0, 0, 5, 5, 0, 0);
		function dynamicsTick(){
		
			var state = dynamics.tick(0.1);
			var speed = state[0];
			var gamma = r2d*state[1];		
			var theta = r2d*state[4];
			aircraft.rotate(theta);
			aircraft.changeElevator(dynamics.getElevatorAngle());
			clouds.setAngle(gamma);
			clouds.setSpeed(speed);
		}
		renderMethods["dynamics"] = dynamicsTick; 
	}
	
	/** 
		Fade in the aircraft then zoom out. 	
		Put in some clouds in motion. Allow the user to rotate the plane in place
		show lift arrows
	*/
	function AircraftDisplay(){
		var aircraftSet = back.set(),
			startX = 100,
			startY = 110,
			endX = 840,
			scale = 1,
			alpha = 0, 
			aircraftBack = back.image("images/plane1.png",startX,startY,780,250),
			orville = back.image("images/orvilleSeated.png",startX + 280,startY+63,137,142),
			orvillesEye = back.circle(startX + 347,201,3).attr({fill:"#000"}),
			orvillesArm =  back.image("images/orvillesArm.png",startX + 346,startY + 135,30,28),
			aircraftFront = front.image("images/plane1solid.png",startX,startY,780,250),
			eX = 750, eY = 220, eL =130, tt = 5,
			elevatorPath = front.path(
				"M"+eX+","+eY+"L"+(eX+eL)+","+eY
			).attr({stroke:"#0f0","stroke-width":3,"opacity":0})
		
		aircraftSet.push(aircraftFront,aircraftBack,orville,orvillesEye,orvillesArm)
			.attr("opacity",0);
		var eox=0, eoy=0;
		return {
			flyIn:function(callback){
				aircraftSet.translate(endX, 0);
				aircraftSet.attr("opacity",1)
					.animate({"translation":"-"+endX+" "+ 0},4000,"elastic",function(){
					if (callback) callback();
				});
			},
			fadeOutFront:function(callback){
				aircraftFront.animate({"opacity":0},1000,function(){
					aircraftFront.remove();
					if (callback) callback();
				});
			},
			lookAtUser:function(callback){
				orvillesEye.animate({"translation":"3.5 " + 0},600,"<>",function(){ if (callback) callback();});		
			},
			tryReaching:function(callback){
				orvillesArm.animate({"rotation":"70","x":435,"y":242},600,">",function(){
				orvillesArm.animate({"translation":"-2 0"},400,"bounce",function(){
				orvillesArm.animate({"translation":"2 0"},1000,">",function(){
				orvillesArm.animate({"rotation":"0","x":445,"y":242},600,">",function(){
				orvillesEye.animate({"translation":"2,3"},600,"<>",function(){
					if (callback) callback();
				}); }); }); }); });
			},
			fadeHide:function(callback){					
				aircraftSet.animate({opacity:0},1000,function(){
					aircraftSet.hide();
					if (callback) callback();
				});
			},
			fadeShow:function(callback){
				aircraftSet.show().toFront();
				aircraftSet.animate({opacity:1},1000,function(){
					if (callback) callback();
				});
				elevatorPath.animate({opacity:1},1000);
			},
			getLEX:function(){
				return startX-230; 
			},
			getLEZ:function(){
				return startY-107; 
			},
			getScale:function(){return scale;},
			toFront:function(){
				aircraftSet.toFront();
				aircraftFront.toFront();
			},
			rotate:function(angle){
				alpha = angle;  
				aircraftSet.rotate(angle,gw,gh);
			},
			changeElevator:function(angle){
				xloc = (eX+gw) * scale;
				yloc = (eY+gh) * scale; 
				var rangle =  0.01745*(angle),
					ralpha =  0.01745*(alpha),
					cos = Math.cos, sin = Math.sin,
					calpha = cos(ralpha),
					salpha = sin(ralpha);					
				var newX = 130 * calpha + 40 * salpha;
				var newY = 130 * salpha - 40 * calpha;
				var newTX =  70 * cos(ralpha+rangle);
				var newTY =  70 * sin(ralpha+rangle);
				
				newTX += (newX );
				newTY += (newY );
				elevatorPath.attr("path",
					"M"+(newX+gw)+","+(newY+gh)
					+"L"+(newTX+gw)+","+(newTY+gh));
			},
			scale:function(_scale){
				scale = _scale;
				aircraftSet.animate({"scale":_scale + " " + _scale + " "+gw+" "+ gh},1000);
				elevatorPath.animate({"scale":_scale + " " + _scale + " "+gw+" "+ gh},1000);
			}
		}
	}

	function AirfoilDisplay(){
		var _airfoil = front.set();
		path9 = front.path("M200.99,3.89c3.17,0.54,6.38,1.1,9.62,1.66"
		 +"C137.29,13.45,19.06,18.49,2.06,5.57   c-2.34-1.78-2.76-3.9-0.87-6.4"
		 +"C20.88-20.52,85.28-15.9,200.99,3.89z");
		path9.attr(greenAirfoil);
		_airfoil.push(path9)
			.translate(400,gh)
			.scale(1.1)
			.drag(move,start,stop)
			.attr("opacity",0);

		function start(){  
			this.startX = this._drag.x - this.paper.canvas.offsetParent.offsetLeft; 
			this.startY = this._drag.y - this.paper.canvas.offsetParent.offsetTop; 
			(this.startX < 490) ? this.reverse = true : this.reverse = false; 
		};
		
		function move(dx,dy){
			if (!draggable) return; 
			var x = this.startX +dx,
				y = this.startY +dy,
				angle = Raphael.angle(x,y,485,gh);
			if (this.reverse) angle += 180; 
			solver.setAlpha(angle);
			_airfoil.rotate(angle,485,gh);
			OnAirfoilMoved(angle);
		}
		
		function stop(){}		

		return{
			fadeShow:function(){
				_airfoil.animate({opacity:1});
			},
			scaleShow:function(){
				_airfoil.translate(aircraft.getLEX(),aircraft.getLEZ())
				.attr("opacity",1)
				.animate({scale:1.5,"translation":130 + " " + -3},1000);
			},
			setAlpha:function(angle,callback){
				_airfoil.animate({"rotation":angle+",485,"+gh},500, callback);
			},
			fadeHide:function(callback){
				_airfoil.animate({opacity:0},500, callback);
			},
			scaleHide:function(callback){
				_airfoil.animate({opacity:0,"scale":1,"translation":-130 +","+3},500, function(){
					_airfoil.hide();
				});
			},
			turnRed:function(callback){
				_airfoil.attr(redAirfoil);
				this.setAlpha(0,callback); 
			}
		}
	}
	
	/** 
		Starts the solver, lets the user drag the airfoil. 
	*/
	function SolverDisplay(){
		return {
			start:function(){
				flowSolver.start();
				flowSolver.setAirfoil({t:.2,c:22,xOffset:32,yOffset:32});
			},
			setAlpha:flowSolver.setAlpha,
			fadeHide:flowSolver.fadeHide
		}
	}
	
	/** External function called when airfoil moves*/
	function OnAirfoilMoved(angle){}
	
	/** Pop up a message from the bottom of the screen */
	function PopUp(paper,msg,callback){
		var message = paper.set(),
			box = paper.rect(0,gameH,gameW,100,10),
			text = paper.text(gameW/2,gameH+20,msg).attr({"font-size":20});
		message.push(box).push(text); 
		box.animate({y:gameH-100},600,">");
		text.animate({y:gameH-80},600,">",function(){
			message.push(paper.rect(gameW/2-50,gameH-30,100,20,5).click(callback).attr({"cursor":"pointer","fill":"#fa3"}));
			message.push(paper.text(gameW/2,gameH-20,"Ok").attr({"font-size":20,"cursor":"pointer"}).click(callback));
		});
		box.attr({fill:"#fff",opacity:0.5}); 
		var hide = function(callback){
			message.animate({y:gameH+50},600,"<",function(){
				message.remove();
				callback();
			});
		}
		return{hide:hide}
	}
	
	/** Draw a lift arrow */
	function LiftArrow(paper){
		var magnitude=0, gw = gameW*0.5, gh = gameH*0.5;
		var arrow =  paper.path("M"+ gw + " " +gh+ "L" + gw + " " +  gh)
		.attr({"stroke-width":4,"stroke":"#7f7"});
		return{ setValue:function(value){
				magnitude = value; 
				arrow.attr("path","M"+ gw + " " +gh+ "L" + gw + " " +  (gh-magnitude));
		}}
	}
	
	/** Draw a drag arrow */
	function DragArrow(paper){
		var magnitude=0;
		var arrow =  paper.path("M"+ gw + " " +gh+ "L" + gw + " " +  gh)
		.attr({"stroke-width":4,"stroke":"#f77"});
		return{ setValue:function(value){
				magnitude = value; 
				arrow.attr("path","M"+ gw + " " +gh+ "L" + (gw+magnitude) + " " +  gh);
		}}
	}
	
	function DrawControls(){
		var linkage = new Linkage(front,{
			stickLength:80, stickJoinLocation:15, stickPivotX:420, stickPivotY:325,
			elevPivotX:770, elevPivotY:275, hornLength:30, elevChord:150, elevThickness:7,
			minAngle:-40, maxAngle:40
		});
	}
	
	return {
		changeElevatorAngle:function(angle){
			
		}
	}
}
