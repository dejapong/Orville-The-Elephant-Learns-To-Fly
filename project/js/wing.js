Wing = function(sref, ar, cl0, clalpha, clmax, cmac, cd0, e){

	var alpha = 0;
	var K = 1/(Math.PI*ar*e);
	var cbar = Math.sqrt(sref/ar);
	
	return {
		setAlpha:function(value){
			alpha = value;
		},
		getAlpha:function(){
			return alpha; 
		},
		getCl:function(){
			cl = cl0 + clalpha*alpha;
			if (cl > clmax) cl = clmax/2;
			if (cl < -clmax) cl = -clmax/2;			
			return cl;
		},
		getCd:function(){
			cl = cl0 + clalpha*alpha;	
			return cd0 + K*cl*cl;
		},
		getCm:function(){
			return cmac;
		},
		getSref:function(){
			return sref;
		},
		getCref:function(){
			return cbar;
		}
	}
}

var sys = require("sys")
var testWing = new Wing(
	10, 		// sref 
	8, 			// ar
	0.1,		// cl0
	0.1,		// clalpha
	1.2,		// clmax
	-0.1,		// cmac	
	0.01,		// cd0
	0.9			// e
	);

function WingTest(testWing, alpha){
	testWing.setAlpha(alpha);	
	sys.puts("alpha = " + alpha.toFixed(2));
	sys.puts("CL = " + testWing.getCl().toFixed(2));
	sys.puts("CD = " + testWing.getCd().toFixed(2));
	sys.puts("Cm = " + testWing.getCm().toFixed(2));
	sys.puts("")
}

WingTest(testWing, 5.0)
WingTest(testWing, 7.5)
WingTest(testWing, 10.0)
WingTest(testWing, 25.0)
WingTest(testWing, -15.0)
