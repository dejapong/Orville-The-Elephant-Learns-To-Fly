Aircraft = function(args){

	g = 9.81,
	d2r = Math.PI/180,
	r2d = 180/Math.PI,
	rho = 1.225;
	
	var
		wing = args.wing, 
		tail = args.tail, 
		xwing = args.xwing, 
		ywing = args.ywing, 
		xtail = args.xtail, 
		ytail = args.ytail, 
		xcg = args.xcg, 
		m = args.m, 
		Iyy = args.Iyy, 
		maxT = args.maxT, 
		dynPress = args.dynPress;
	var
		sw = wing.getSref(),		// Wing area
		st = tail.getSref(),		// Tail area
		cw = wing.getCref(),		// Wing MAC
		ct = tail.getCref(),		// Tail MAC
		xacw = xwing + 0.25*cw,	// Wing a.c. location
		xact = xtail + 0.25*ct,	// Tail a.c. location
		throttle = 0., 	// Ranges from 0 to 1
		elevatorAngle = 0, 			// Negative is elevator up
		speed, gamma, 
		q, alpha, theta, 		// u, alpha, q, theta		
		x, z,
		T;
		
	var updateBodyForces = function(){
		dynPress = 0.5*rho*speed*speed;
		// Get alpha in degrees to feed to wing
		alphaDeg = r2d*alpha;
		wing.setAlpha(alphaDeg);
		// Similarly for tail
		// TODO: add downwash effects etc.
		u = speed*Math.cos(alpha);
		w = speed*Math.sin(alpha);
		alphat = alphaDeg + elevatorAngle + r2d*Math.atan((w + q*(xtail - xcg))/u);			
		tail.setAlpha(alphat);
		// get CL values
		clw = wing.getCl();
		clt = tail.getCl();
		cdw = wing.getCd();
		cdt = tail.getCd();
		//console.log([clw, clt, cdw, cdt]);
		// Multiply by respective areas
		lw = clw*sw;
		lt = clt*st;
		// Dimensional forces
		L = dynPress*(lw + lt);
		D = dynPress*(cdw*sw + cdt*st);
		// Dimensional moment
		M = dynPress*(wing.getCm()*cw*sw - lw*(xacw - xcg) + tail.getCm()*ct*st - lt*(xact - xcg));
		
		// Aerodynamic forces in body axis (nose is forwards)
		T = maxT*throttle;
	};
		
	function setThrottle(value){
			throttle = Math.min(Math.max(value, 0), 1);
	};
	function setElevatorAngle(value){
			elevatorAngle = Math.min(Math.max(value, -25), 25);
	};		
	
	return {
		setState:function(speed0, gamma0, q0, alpha0, theta0, x0, z0){
			speed = speed0;
			gamma = d2r*gamma0;
			q = q0;
			alpha = d2r*alpha0;
			theta = d2r*theta0;
			x = x0;
			z = z0;
		},
		setThrottle:setThrottle,
		setElevatorAngle:setElevatorAngle,		
		changeElevatorAngle:function(delta){		
			console.log(this);
			setElevatorAngle(elevatorAngle+delta);
		},
		changeThrottle:function(delta){
			setThrottle(throttle+delta);
		},
		getElevatorAngle:function(){
			return elevatorAngle;
		},
		getThrottle:function(){
			return throttle;
		},
		tick:function(dt){
			updateBodyForces();
						
			speeddot = 1/m*(T*Math.cos(alpha) - D - m*g*Math.sin(gamma));			
			gammadot = 1/(speed*m)*(T*Math.sin(alpha) + L - m*g*Math.cos(gamma));			
			qdot = M/Iyy;

			speed = speed + speeddot*dt;
			gamma = gamma + gammadot*dt;			
			q = q + qdot*dt;		
			dtheta = q*dt;
			theta = theta + dtheta;
			alpha = theta - gamma;

			dx = speed*Math.cos(gamma)*dt;
			dz = speed*Math.sin(gamma)*dt;
			x = x + dx;
			z = z + dz;
			//console.log([speed, r2d*gamma, r2d*alpha, r2d*theta]);
			return [speed, gamma, q, alpha, theta, dx, -dz, -dtheta];
		}
	}
}

var spitfireWing = new Wing({sref:22.5, ar:6, cl0: 0, clalpha: 0.1, clmax: 1.8, cmac: -0.1, cd0: 0.01, e:0.9});
var spitfireTail = new Wing({sref:4.0, ar:3, cl0: 0, clalpha: 0.1, clmax: 1.4, cmac: 0.1, cd0: 0.01, e:0.8});
spitfire = new Aircraft({wing: spitfireWing, tail: spitfireTail, xwing: 2.5, ywing: 0, xtail: 7.7, ytail: 0.5, xcg: 1.0, m: 2900, Iyy: 60000, maxT: 10000, dynPress: 6125});


