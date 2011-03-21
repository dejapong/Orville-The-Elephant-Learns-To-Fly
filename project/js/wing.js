Wing = function(args){

 	var 
 		sref = args.sref, 
 		ar = args.ar, 
 		cl0 = args.cl0, 
 		clalpha = args.clalpha, 
 		clmax = args.clmax, 
 		cmac = args.cmac, 
 		cd0 = args.cd0, 
 		e = args.e;
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


