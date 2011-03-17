var gameW = 980, 
	gameH = 600,
	gw = gameW*0.5, 
	gh = gameH*0.5;
	
function OpeningScene(frontId,backId,solver){
	var front = Raphael(frontId,gameW,gameH); 	
	var back = Raphael(backId,gameW,gameH); 	
	var sky = back.rect(0,0,gameW,gameH);
	sky.attr({fill:"90-#13354a-#132149"}).toBack();

	var airfoil = front.set();
	 path9=front.path("M200.99,3.89c3.17,0.54,6.38,1.1,9.62,1.66"
	 +"C137.29,13.45,19.06,18.49,2.06,5.57   c-2.34-1.78-2.76-3.9-0.87-6.4"
	 +"C20.88-20.52,85.28-15.9,200.99,3.89z");
	path9.attr({stroke:"#4a4",fill:"#006838","stroke-width":3});
	airfoil.push(path9);
	airfoil.translate(400,gh);
	airfoil.scale(1.5);
	airfoil.drag(move,start,stop);
	
	var textSet = back.set();
	var title=back.image("images/logo.png",220,-100,520,75);
	title.animate({"y":gh-100},1000,"bounce",drawIntro)
	textSet.push(title);
	
	function drawIntro(){ 
		solver.start();
		setTimeout(drawTitle,300);
		textSet.push(title);
	}
	
	function drawTitle(){
		var title = back.text(gameW/2,gh+70,"Flying in Air");
		title.attr({"fill":"#fff","font-size":52,"font-weight":"bold"});			
		solver.setAirfoil({
			t:.2,
			c:22,
			xOffset:32,
			yOffset:32
		});	
		textSet.push(title);
		drawInstructions();
	}
	
	function drawInstructions(){
		var title = back.text(gw,gh+120,"Drag the green airfoil to begin");
		title.attr({"fill":"#fff","font-size":12,"font-weight":"bold"});	
		textSet.push(title);
	}
	
	function start(){
		startLesson1(); 
		this.startX = this._drag.x - this.paper.canvas.offsetParent.offsetLeft; 
		this.startY = this._drag.y - this.paper.canvas.offsetParent.offsetTop; 
		 (this.startX < 490) ? this.reverse = true : this.reverse = false; 
	};
	
	function move(dx,dy){
		var x = this.startX +dx;
		var y = this.startY +dy;
		var angle = Raphael.angle(x,y,485,gh);
		if (this.reverse) angle += 180;
		solver.setAlpha(angle);
		airfoil.rotate(angle,485,gh);
		OnAirfoilMoved(angle);
	}
	
	function stop(){}
	
	function startLesson1(){
		textSet.animate({opacity:0},500,function(){
			textSet.remove();
		});
		setTimeout(function(){Lesson1(back,front)},1000);
		startLesson1 = function(){};
	}
}

function OnAirfoilMoved(angle){}

function Lesson1(back,front){
	var message; 
	setTimeout(textPane1,1000);
	
	function textPane1(){
		message = PopUp(front,
			"Air is all around us. More text about pressure and shear forces, on some level.",
			textPane2);
	}
	
	function textPane2(){ 
		message.hide(function(){		
			message = PopUp(front,
				"More text about the air and educational stuff. Talk about Lift, drag and stalls",
				textPane3);
		}); 
	}
	
	function textPane3(){
		var liftArrow = new LiftArrow(front);
		var dragArrow = new DragArrow(front); 
		OnAirfoilMoved = function(angle){
			liftArrow.setValue(angle);
			dragArrow.setValue(angle);
		}
	}
}

function PopUp(paper,msg,callback){
	var message = paper.set();
	var box = paper.rect(0,gameH,gameW,100,10); 
	var text = paper.text(gameW/2,gameH+20,msg);
	text.attr({"font-size":20});
	message.push(box); message.push(text); 
	box.animate({y:gameH-100},600,">");
	text.animate({y:gameH-80},600,">",function(){
		message.push(paper.rect(gameW/2-50,gameH-30,100,20,5).click(callback).attr({"cursor":"pointer","fill":"#fa3"}));
		message.push(paper.text(gameW/2,gameH-20,"Ok").attr({"font-size":20,"cursor":"pointer"}).click(callback));
	});
	box.attr({fill:"#fff",opacity:0.5}); 
	return{
		hide:function(callback){
			message.animate({y:gameH+50},600,"<",function(){
				message.remove();
				callback();
			});
		}
	}
}

function LiftArrow(paper){
	var magnitude=0, gw = gameW*0.5, gh = gameH*0.5;
	var arrow =  paper.path("M"+ gw + " " +gh+ "L" + gw + " " +  gh)
	.attr({"stroke-width":4,"stroke":"#7f7"});
	return{ setValue:function(value){
			magnitude = value; 
			arrow.attr("path","M"+ gw + " " +gh+ "L" + gw + " " +  (gh-magnitude));
	}}
}

function DragArrow(paper){
	var magnitude=0;
	var arrow =  paper.path("M"+ gw + " " +gh+ "L" + gw + " " +  gh)
	.attr({"stroke-width":4,"stroke":"#f77"});
	return{ setValue:function(value){
			magnitude = value; 
			arrow.attr("path","M"+ gw + " " +gh+ "L" + (gw+magnitude) + " " +  gh);
	}}
}