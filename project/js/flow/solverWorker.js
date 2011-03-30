/** 
	Based on Real Time Fluid Dynamics for Games By J. Stam
	http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.12.6736&rep=rep1&type=pdf
	@author dejapong
*/
function Solver(width,height){
	/**
		Add a source matrix to the data
	*/	
	function addSource(x,sources,dt){
		for (var i =0; i < size; i++)
			x[i] += dt*sources[i];
	}
	
	/** 
		Return the single array index for the matrix coordinate i, j. 
	*/
	function ix(i, j){
		return j * (width) + i; 
	}
	
	/** 
		Diffuse a value. 
		@param b Boundary layer type
		@param x Array of values to diffuse
		@param x0 Array of previous values
		@param diff Viscosity
		@param dt timestep 
	*/
	function diffuse(b, x, x0, diff, dt){
		var a = dt * diff * internalW * internalH;
		if (a==0){
			for(var i = 1; i < internalW; i++)
				for (var j = 1; j < internalH; j++){
					var currentCell = ix(i, j);
					x[currentCell] = x0[currentCell];
				}
		}else{
			for (var k = 0; k < solverIterations; k++){
				for(var i = 1; i < internalW; i++){
					for (var j = 1; j < internalH; j++){
						var currentCell = ix(i, j); 
						var prevCell = ix(i - 1, j); 
						var nextCell = ix(i + 1, j); 
						var topCell = ix(i, j - 1);
						var bottomCell = ix(i, j + 1); 
						x[currentCell] = (x0[currentCell] + a * (
							x[prevCell] 
							+ x[nextCell] 
							+ x[topCell]
							+ x[bottomCell])) / (1 + 4 * a);
					} 
				}
			}
		}	
		setBoundaryConditions(b,x);
	}
	
	/**
		Set boundary conditions for container walls and airfoil shape
	*/
	function setBoundaryConditions(b, x){
		for(i=0;i<height;i++){
			u[i*width+width-1] = -speed;
			//u[i*width + width -1] = -speed;
			u[i*width] = speed;
		}	
		
		for(i=0;i<width;i++){
			u[i] = -u[i+width];//u[width+i];
			v[i] = -v[i+width];
			
			u[(size-width) + i] = -u[(size-width) + i - width]
			v[(size-width) + i] = -v[(size-width) + i - width]
		}
		
		for (i =0 ; i < size; i++){
			if (walls[i] == 1){
				rho[i] = 0;
				u[i] = 0; // -u[i+1];
				v[i] = 0;// -v[i+1];
			}else{
				//u[i] = 0.5;
			}
		}
	}
	
	/** Populate the walls array with a symetrical 4digit NACA airfoil */ 
	function createAirfoil(airfoil){
		var t = airfoil.t;
		var c = airfoil.c; 
		var xOffset = airfoil.xOffset;
		var yOffset = airfoil.yOffset;
		
		for (var i=0; i < size; i++)
			walls[i] = 0; 
		
		for (x =0; x < c; x++){
			var y = t * c * 5 * (
				0.2969 * Math.sqrt(x/c) 
				- 0.1260 * (x/c) 
				- 0.3516 * (x/c) * (x/c) 
				+ 0.2843 * (x/c) * (x/c) * (x/c) 
				- 0.1015 * (x/c) * (x/c) * (x/c) * (x/c) 
			);
			for (j = - y; j <  y; j++){
				var  xi = Math.round(( (x-c/2) * Math.cos(alpha) - (j-t/2) * Math.sin(alpha)) + xOffset);
				var  yi = Math.round( (x-c/2) * Math.sin(alpha) + (j-t/2) * Math.cos(alpha) + yOffset);
				walls[ix(xi,yi)] = 1;
			}
		}
	}
	
	/** 
		Advect a value
		@param b boundary layer type
		@param d Array of values to advect
		@param d0 Array of previous values
		@param u velocity in x direction
		@param v velocity in y direction
		@param dt timestep
	*/
	function advect(b, d, d0, u, v, dt){
		var i,j,i0,j0,i1,j1;
		var x, y, x0 ,t0, s1, t1; 

		for (i =1; i <= internalW; i++){
			for (j=1; j <= internalH; j++){
				x = i - dt * internalW * u[ix(i,j)];	
				y = j - dt * internalH * v[ix(i,j)];
				if (x < 0.5) x = 0.5; 	
				if (x > internalW + 0.5) x=internalW + 0.5; 
				i0 = x | 0; 
				i1 = i0 + 1;
				if (y < 0.5) y = 0.5; 	
				if (y > internalH + 0.5) y=internalH + 0.5; 
				j0 = y | 0; 
				j1 = j0 + 1;				
				s1 =x - i0; 
				s0 =1 - s1; 
				t1 = y - j0;
				t0 = 1 - t1;
				d[ix(i,j)] = s0 * (t0*d0[ix(i0,j0)] + t1*d0[ix(i0,j1)]) + s1 * (t0*d0[ix(i1,j0)] + t1*d0[ix(i1,j1)]);	
			}
		}
		setBoundaryConditions(b,d);
	}
	
	/***/
	function project(u,v,p,div){
		var i, j, k;
		h = -0.5 / Math.sqrt(internalW * internalH);
		
		for (i = 1; i <= internalW; i++) {
			for (j = 1; j <= internalH; j++) {
				div[ix(i, j)] = h * (
						u[ix(i + 1, j)] 
						- u[ix(i - 1, j)]
						+ v[ix(i, j + 1)] 
						- v[ix(i, j - 1)]);
				p[ix(i, j)] = 0;
			}
		}
		setBoundaryConditions(0, div);
		setBoundaryConditions(0, p);
		for (k = 0; k < solverIterations; k++) {
			for (i = 1; i <= internalW; i++) {
				for (j = 1; j <= internalH; j++) {
					p[ix(i, j)] = (div[ix(i, j)]
						+ p[ix(i - 1, j)] 
						+ p[ix(i + 1, j)] 
						+ p[ix(i, j - 1)] 
						+ p[ix(i, j + 1)]) / 4;
				}
			}
			setBoundaryConditions(0, p);
		}
		for (i = 1; i <= internalW; i++) {
			for (j = 1; j <= internalH; j++) {
				u[ix(i, j)] -= internalW * (p[ix(i + 1, j)] - p[ix(i - 1, j)]);
				v[ix(i, j)] -= internalH * (p[ix(i, j + 1)] - p[ix(i, j - 1)]);
			}
		}
		setBoundaryConditions(1, u);
		setBoundaryConditions(2, v);
	}
	
	/** Velocity step */
	function velStep(u,v,u0,v0,visc,dt){
		addSource(u,u0,dt); 		
		addSource(v,v0,dt);
		diffuse(1,u0,u,visc,dt);
		diffuse(2,v0,v,visc,dt);
		project(u0,v0,u,v);	
		advect(1,u,u0,u0,v0,dt); 	
		advect(2,v,v0,u0,v0,dt);
		project(u,v,u0,v0);
	}
	
	/** Density step*/
	function denseStep(x,x0,u,v,diff,dt){
		addSource(x,x0,dt);
		diffuse(0,x0,x,diff,dt);
		advect(0,x,x0,u,v,dt);
	}
	
	/** Initialize */
	var currentAirfoil = {
		t:.2,
		c:20,
		xOffset:32,
		yOffset:32
	};
	var size = width * height;
	var internalW = width-2; 
	var internalH = height-2; 
	var solverIterations = 20; 
	var alpha = 0; //airfoil angle of attack 
	var speed = 0.06; 
	var visc = 0.0;
	var dens = 0.3; //input density
	var rakeSpacing = 2; 
	var rho =[], rhoPrev =[], u =[], v =[], uPrev = [], vPrev = [],walls =[];
	for (var i=0; i < size; i++)
		rho[i] = rhoPrev[i] = u[i] = v[i] = uPrev[i] = vPrev[i] = walls[i] = 0; 
 

	/** Functions to present publicly*/
	return {
		/** Called each time cycle*/
		tick:function(){
			var dt = .01;
			for (i=1;i<internalH;i +=rakeSpacing){
				rho[i*width+1] = dens;
			}
			velStep(u,v,uPrev,vPrev,visc,dt);
			denseStep(rho,rhoPrev,u,v,visc,dt);
		},
		/** Return the density value array for plotting */
		getDensity:function(){
			return rho; 
		},
		setAlpha:function(_alpha ){
			alpha = _alpha * Math.PI / 180;
			createAirfoil(currentAirfoil); 
		},
		setSpeed:function(_speed){
			speed = _speed;
		},
		setViscosity:function(_visc){
			visc = _visc;
		},
		setDensity:function(_dens){
			dens = _dens; 
		},
		setRakeSpacing:function(_space){
			rakeSpacing = Math.round(_space); 
		},
		getWalls:function(){
			return walls; 
		},
		setAirfoil:function(airfoil){
			currentAirfoil = airfoil;
			createAirfoil(airfoil);
		}
	}
}

var solver;
self.onmessage = function(e){
	switch(e.data.cmd){
	case "init":
		solver = Solver(e.data.width,e.data.height);
		self.postMessage({cmd:"ready"});
		break;
	case "airfoil":
		solver.setAirfoil(e.data.airfoil);
		break;
	case "alpha":
		solver.setAlpha(e.data.alpha)
		break;
	case "tick":
		solver.tick(); 
		var density = solver.getDensity();
		self.postMessage({cmd:"ticked",density:density});
		break;
	}
}