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
			if (cl > clmax) {
				cl = cl0 + 0.25*clalpha*alpha;
//  			cl = Math.min(cl, 2*clmax);
//				cl = clmax/2;
			}
			else if (cl < -clmax) {
				cl += cl0 + 0.25*clalpha*alpha;
// 				 dcl = clmax - cl;				
//  				cl += dcl;
//  				cl = Math.max(cl, -2*clmax);
				//cl += Math.exp(-dcl*dcl/4);	
				//cl = -clmax/2;
			}
			return cl;
		},
		getCd:function(){
			cl = cl0 + clalpha*alpha;	
			cd = cd0 + K*cl*cl;
// 			dcl = 0;
// 			if (cl > clmax)
// 				dcl = cl - clmax;			
// 			else if (cl < -clmax)
// 				dcl = -clmax - cl;
// 			cd += K*dcl*dcl;
			return cd;
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


