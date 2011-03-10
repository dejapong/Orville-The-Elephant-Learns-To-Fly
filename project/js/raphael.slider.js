Raphael.fn.slider = function(id,options){
	var o = {
		min:0,
		max:100,
		width:300,
		height:30,
		initial:0,
		callback:function(){}
	}
	for (name in options) {o[name] = options[name];}
	
	var handleWidth = 10,
		trackHeight = 5,
		mouseDown = false,
		paper = Raphael(id,o.width,o.height),
		track = paper.rect(
		handleWidth*0.5,
		o.height*0.5-trackHeight*0.5,
		o.width-handleWidth,trackHeight),
		handle = paper.rect(0,0,handleWidth,o.height,3);
	
	setValue (o.initial); 
	handle.attr({fill:"#ccc"});
	track.attr({fill:"#555"});
	handle.drag(move, start, up);
	
	function setHandle(location){
		if (location > o.width-handleWidth)
			location = o.width-handleWidth;
		if (location <= 0)
			location = 0; 
		handle.attr({"x":location}); 
		return (location/(o.width-handleWidth)) * (o.max - o.min) + o.min;
	}

	function setValue(value){
		var location = (o.width-handleWidth)*(value - o.min)/(o.max - o.min)	
		setHandle(location);
	}
	
	function start(){handle.ox = this.attr("x");}
	function up(e){}
	function move(x,y){ o.callback(setHandle(x+this.ox));};
	return {setValue:setValue}
}