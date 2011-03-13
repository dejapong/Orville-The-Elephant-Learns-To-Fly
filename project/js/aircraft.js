AircraftBuilder = function(){
	var wing, tail, xwing, ywing, xtail, ytail, xcg, m, Iyy, maxT;
	
	return {
		setWing:function(wing){
			this.wing = wing;
		}
		getWing:function(){
			return this.wing;
		}		
		build:function(){
			return new Aircraft(wing, tail, xwing, ywing, xtail, ytail, xcg, m, Iyy, maxT);
		}
	}	
}

Aircraft = function(wing, tail, xwing, ywing, xtail, ytail, xcg, m, Iyy, maxT, qS){
	
	var
		g = 9.81,
		d2r = Math.PI/180,
		r2d = 180/Math.PI,
		sw = wing.getSref(),		// Wing area
		st = tail.getSref(),		// Tail area
		cw = wing.getCref(),		// Wing MAC
		ct = tail.getCref(),		// Tail MAC
		xacw = xwing + 0.25*cw,	// Wing a.c. location
		xact = xtail + 0.25*ct,	// Tail a.c. location
		throttlePosition = 0, 	// Ranges from 0 to 1
		elevatorAngle = 0, 			// Negative is elevator up
		u, alpha, q, theta, 		// u, alpha, q, theta		
		w,
		Fx, Fz,
		x, z;
		
	var updateBodyForces = function(){
		wing.setAlpha(alpha);
		alphat = alpha + d2r*elevatorAngle;			// TODO: add downwash effects etc.
		tail.setAlpha(alphat);
		clw = wing.getCl();
		clt = tail.getCl();
		lw = clw*sw;
		lt = clt*st;
		M = qS*(wing.getCm()*cw - lw*xacw + tail.getCm()*ct - lt*xact);
		L = qS*(lw + lt);
		D = qS*(wing.getCd() + tail.getCd());
		Fx = L*Math.sin(alpha) - D*Math.cos(alpha) + maxT*throttlePosition;
		Fz = L*Math.cos(alpha) + D*Math.sin(alpha);
	};
		
	return {
		setThrottle:function(value){
			throttlePosition = Math.min(Math.max(value, 0), 1);
		},
		setElevatorAngle:function(value){
			elevatorAngle = Math.min(Math.max(value, -25), 25);
		},		
		tick:function(dt){
			this.updateBodyForces();
			w = u*Math.sin(alpha);
			udot = Fx/m - g*Math.sin(theta) - q*w;
			wdot = Fz/m + g*Math.cos(theta) + q*u;
			qdot = M/Iyy;
			xdot = u*Math.cos(theta) + w*Math.sin(theta);
			zdot = w*Math.cos(theta) - u*Math.sin(theta);
			u = u + udot*dt;
			w = w + wdot*dt;
			q = q + qdot*dt;
			theta = theta + q*dt;
			alpha = Math.atan(w/u);
			x = x + xdot*dt;
			z = z + zdot*dt;
			return [u, w, alpha, q, theta, x, y];
		}
	}
}

var sys = require("sys")
var wing = new Wing(	
	10, 		// sref 
	8, 			// ar
	0.1,		// cl0
	0.1,		// clalpha
	1.2,		// clmax
	-0.1,		// cmac	
	0.01,		// cd0
	0.9			// e
)
var tail = new Wing(	
	2, 		// sref 
	4, 			// ar
	0.0,		// cl0
	0.06,		// clalpha
	1.0,		// clmax
	0.0,		// cmac	
	0.01,		// cd0
	0.85			// e
)

var testAircraft = new Aircraft(wing, tail, )
