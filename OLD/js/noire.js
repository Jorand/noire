var Noire = function(){

	return new Noire.fn.init();

};

var RAD = 0;

Noire.fn = Noire.prototype = {
	constructor: Noire,
	init: function(){

		var canvas = this.canvas = document.createElement("canvas");
		var context = this.context = canvas.getContext("2d");

		canvas.id = "noire";
		document.body.appendChild(canvas);

		this.gravity = 5;
		this.velocity = 12;

		this.worldScroll = 0;

		this.lightColor = "rgba(255, 255, 255, 0.5)";
		this.lightDistance = 100;

		this.hero = {
			x: 20,
			y: 0,
			width: 25,
			height: 57,
			speed: 200,
			direction: "right",
			color: "#000000",
			isJumping: false,
			isInAir: false,
			velocity: this.velocity
		};

		this.resize();

		this.offsetTop = 0;

		this.floors = new Array();

		this.firstFloor();

		this.needFloor();

		this.keysPressed = new Object();

		window.addEventListener("resize", this.resize.bind(this), false);

		window.addEventListener("touchstart", function( event ){

			event.preventDefault();

			this.touchIsActive = true;
			this.previousTime = new Date().getTime();

			this.previousTouchX = event.touches[0].clientX;
			this.previousTouchY = event.touches[0].clientY;

			this.touchX = event.touches[0].clientX;
			this.touchY = event.touches[0].clientY;

			this.deltaTouchX = 0;
			this.deltaTouchY = 0;

			if( this.touchX > this.hero.x ){

				this.hero.direction = "right";

			}
			else if( this.touchX < this.hero.x ){

				this.hero.direction = "left";

			};

		}.bind(this), false);


		window.addEventListener("touchmove", function( event ){

			event.preventDefault();

			console.log(this.worldScroll);

			this.touchX = event.touches[0].clientX;
			this.touchY = event.touches[0].clientY;

			this.deltaTouchX = event.touches[0].clientX - this.previousTouchX;
			this.deltaTouchY = event.touches[0].clientY - this.previousTouchY;

			if( this.touchX > this.hero.x ){

				this.hero.direction = "right";

			}
			else if( this.touchX < this.hero.x ){

				this.hero.direction = "left";

			};

			console.log( this.previousTime - new Date().getTime() )

			if( (this.previousTime - new Date().getTime()) < 50 && this.deltaTouchY < -10 ){

				if( this.hero.isJumping === false && this.hero.isInAir === false ){

					this.hero.isJumping = true;

				};

			};

			this.previousTouchX = event.touches[0].clientX;
			this.previousTouchY = event.touches[0].clientY;

			this.previousTime = new Date().getTime();

		}.bind(this), false);

		window.addEventListener("touchend", function( event ){

			event.preventDefault();

			this.touchIsActive = false;

		}.bind(this), false);

		window.addEventListener("touchcancel", function( event ){

			event.preventDefault();

			this.touchIsActive = false;

		}, false);

		window.addEventListener("devicemotion", function( event ){

			// alert( event.rotationRate );

		});
		
		// window.addEventListener("keydown", function( event ) {

		// 	this.keysPressed[event.keyCode] = true;

		// }.bind(this), false);

		// window.addEventListener("keyup", function( event ){

		// 	this.keysPressed[event.keyCode] = false;

		// }.bind(this), false);

		this.now = 0;
		this.lastNow = 0;

		window.requestAnimationFrame(this.loop.bind(this));

		return this;

	},
	resize: function(){

		this.width = this.canvas.width = 320;
		this.height = this.canvas.height = window.innerHeight;

		this.worldLimits = new Array(
			Line(Vector2(0, 0), Vector2(this.width, 0), "#0000FF"),
			Line(Vector2(this.width, 0), Vector2(this.width, this.height), "#0000FF"),
			Line(Vector2(this.width, this.height), Vector2(0, this.height), "#0000FF"),
			Line(Vector2(0, this.height), Vector2(0, 0), "#0000FF")
		);

	},
	drawHero: function(){

		var vectorDown = Vector2(this.hero.x + (this.hero.width / 2), this.hero.y + this.hero.height);
		var lineDown = Line(vectorDown, Vector2(this.hero.x + (this.hero.width / 2), this.height + 1));

		var vectorLeft = Vector2(this.hero.x + (this.hero.width / 2), this.hero.y + (this.hero.height / 1.5));
		var lineLeft = Line(vectorLeft, Vector2(-1, this.hero.y + (this.hero.height / 1.5)));

		var vectorRight = Vector2(this.hero.x + (this.hero.width / 2), this.hero.y + (this.hero.height / 1.5));
		var lineRight = Line(vectorRight, Vector2(this.width + 1, this.hero.y + (this.hero.height / 1.5)));

		// this.drawLine(lineDown);
		// this.drawLine(lineLeft);
		// this.drawLine(lineRight);

		var intersectionDown = this.getNearestIntersection(vectorDown, lineDown, true, true);

		if( intersectionDown.vector !== undefined ){

			// this.drawCircle(intersectionDown.vector, 5);

			var ground = intersectionDown.vector.y - 1;

			if( this.hero.isJumping ){

				if( this.hero.velocity > 0 ){

					this.hero.y -= this.hero.velocity;
					this.hero.velocity--;
					this.hero.isInAir = true;

				}
				else {

					this.hero.isJumping = false;
					this.hero.velocity = this.velocity;

				};

			}
			else {

				this.hero.isJumping = false;

				if( (this.hero.y + this.hero.height) < ground ){

					this.hero.isInAir = true;

					this.hero.y += this.gravity;

					if( (this.hero.y + this.hero.height) >= ground ){

						this.hero.y = ground - this.hero.height;
						this.hero.isInAir = false;

					};

				};

			};

		};

		var intersectionLeft = this.getNearestIntersection(vectorLeft, lineLeft, true, true);

		if( intersectionLeft.vector !== undefined ){

			var left = intersectionLeft.vector.x + 1;

			// this.drawCircle(intersectionLeft.vector, 5);

			if( this.hero.x > left ){

				if( this.touchIsActive === true && this.touchX < this.hero.x ){

					this.hero.x -= Math.abs(this.touchX - this.hero.x) / 10;

				};

				if( this.hero.x < left ){

					this.hero.x = left;

				};

			};

		};

		var intersectionRight = this.getNearestIntersection(vectorRight, lineRight, true, true);

		if( intersectionRight.vector !== undefined ){

			var right = intersectionRight.vector.x - 1;

			// this.drawCircle(intersectionRight.vector, 5);

			if( (this.hero.x + this.hero.width) < right ){

				if( this.touchIsActive === true && this.touchX > this.hero.x ){

					var deltaX = Math.abs(this.touchX - this.hero.x) / 10;

					if( deltaX > 10 ){

						deltaX += 10;

					};

					this.hero.x += deltaX;

				};

				if( (this.hero.x + this.hero.width) > right ){

					this.hero.x = right - this.hero.width;

				};

			};

		};

		for( var f = 0; f < this.floors.length; f++ ){

			var floor = this.floors[f];

			for( var monster = 0; monster < floor.monsters.length; monster++ ){

				var monsterObj = floor.monsters[monster];
				var heroObj = this.hero;

				if( ( ( heroObj.x + heroObj.width/2 ) > monsterObj.x ) && 
					( (( heroObj.x + heroObj.width/2 ) + ( heroObj.width/2 )) < (monsterObj.x + monsterObj.w) ) &&
					( ( heroObj.y + heroObj.height/2 ) > monsterObj.y ) &&
					( (( heroObj.y + heroObj.height/2 ) + ( heroObj.height/2 )) < (monsterObj.y + monsterObj.h) )
					) {

					console.log('hourra monster');
				}

			
			};

			for( var power = 0; power < floor.powers.length; power++ ){
				
				var pileObj = floor.powers[power];
				var heroObj = this.hero;
				//heroObj.offsetTop = heroObj.offsetTop-45;

				if( ( ( heroObj.x + heroObj.width/2 ) > pileObj.x ) && 
					( (( heroObj.x + heroObj.width/2 ) + ( heroObj.width/2 )) < (pileObj.x + pileObj.w) ) &&
					( ( heroObj.y + heroObj.height/2 + 10 ) > pileObj.y  ) &&
					( (( heroObj.y + heroObj.height/2 + 10 ) + ( heroObj.height/2 )) < (pileObj.y + pileObj.h) )
					) {

					console.log('hourra pile');
				}

			};

		};

		// this.context.beginPath();

		// this.context.rect(this.hero.x, this.hero.y, this.hero.width, this.hero.height);

		// this.context.fillStyle = "#000000";
		// this.context.fill();

		// this.context.closePath();

		this.context.fillStyle = "#FFFFFF";

		var d = 0;

		if (this.hero.direction == "left") {
			d = 6;
		};
	
		this.context.beginPath();
		
		//this.context.rect(this.hero.x, this.hero.y, this.hero.width, this.hero.height);
		this.context.arc(this.hero.x + 10 + d, this.hero.y + 6, 2, Math.PI, 2 * Math.PI);
		this.context.moveTo(this.hero.x + 12 + d, this.hero.y + 6);
		this.context.lineTo(this.hero.x + 12 + d, this.hero.y + 10);
		this.context.arc(this.hero.x + 10 + d, this.hero.y + 10, 2, 2 * Math.PI, Math.PI);
		this.context.lineTo(this.hero.x + 8 + d, this.hero.y + 6);

		this.context.fill();

		this.context.closePath();

		this.context.beginPath();

		this.context.arc(this.hero.x + 16 - d, this.hero.y + 8, 2, Math.PI, 2 * Math.PI);
		this.context.moveTo(this.hero.x + 18 - d, this.hero.y + 8);
		this.context.lineTo(this.hero.x + 18 - d, this.hero.y + 10);
		this.context.arc(this.hero.x + 16 - d, this.hero.y + 10, 2, 2 * Math.PI, Math.PI);
		this.context.lineTo(this.hero.x + 14 - d, this.hero.y + 8);

		this.context.fill();

		this.context.closePath();

	},

	moveWorld: function(){

		// this.worldScroll = this.hero.y;

	},
	firstFloor: function(){

		console.log("first floor");

		this.addFloor(0);

	},
	needFloor: function(){

		var lastFloor = this.floors[this.floors.length - 1];

		while( lastFloor.offsetTop - this.worldScroll <= this.height ){

			this.addFloor();
			lastFloor = this.floors[this.floors.length - 1];

		};

	},
	addFloor: function( number ){

		console.log("add floor", number);

		if( number === undefined ){

			number = Math.floor(Math.random() * (lvl.length - 1)) + 1;

		};

		var floor = new Object();

		floor.offsetTop = this.offsetTop;

		floor.height = 10;

		var color = "#" + Math.floor(Math.random() * 16777215).toString(16);

		var randomFloor = lvl[number];

		floor.lines = new Array();

		for( var line = 0; line < randomFloor.lines.length; line++ ){

			floor.lines.push(Line(Vector2(randomFloor.lines[line][0], randomFloor.lines[line][1] + this.offsetTop), Vector2(randomFloor.lines[line][2], randomFloor.lines[line][3] + this.offsetTop), randomFloor.lines[line][4]));

		};

		floor.monsters = new Array();

		if (randomFloor.monsters) {

			for( var monster = 0; monster < randomFloor.monsters.length; monster++ ){

				floor.monsters.push({
					x: randomFloor.monsters[monster].x,
					y: floor.offsetTop + floor.offsetTop - this.hero.height,
					w: this.hero.width,
					h: this.hero.height,
				});

			};

		};

		floor.powers = new Array();

		if (randomFloor.powers) {

			for( var power = 0; power < randomFloor.powers.length; power++ ){

				floor.powers.push({
					x: randomFloor.powers[power].x,
					y: floor.offsetTop + floor.offsetTop - 30,
					w: 20,
					h: 20,
				});

			};

		};

		// floor.lines = new Array(
		// 	Line(Vector2(0, this.offsetTop), Vector2(200, this.offsetTop), color),
		// 	Line(Vector2(200, this.offsetTop), Vector2(200, this.offsetTop + floor.height), color),
		// 	Line(Vector2(200, this.offsetTop + floor.height), Vector2(0, this.offsetTop + floor.height), color),
		// 	Line(Vector2(0, this.offsetTop + floor.height), Vector2(0, this.offsetTop), color),

		// 	Line(Vector2(250, this.offsetTop), Vector2(this.width, this.offsetTop), color),
		// 	Line(Vector2(this.width, this.offsetTop), Vector2(this.width, this.offsetTop + floor.height), color),
		// 	Line(Vector2(250, this.offsetTop + floor.height), Vector2(this.width, this.offsetTop + floor.height), color),
		// 	Line(Vector2(250, this.offsetTop + floor.height), Vector2(250, this.offsetTop), color)
		// );

		this.offsetTop += 170;

		this.floors.push(floor);

		return this;

	},
	getAllLines: function(){

		var middle = 170;
		var middleDistance = middle - (this.hero.y + this.hero.height);
		var middleDelta = middleDistance / 200;

		this.worldScroll += middleDelta;

		this.lines = new Array();

		this.hero.y -= 2;

		for( var floor = 0; floor < this.floors.length; floor++ ){

			for( var line = 0; line < this.floors[floor].lines.length; line++ ){

				this.floors[floor].lines[line].translateY(middleDelta);

				this.lines.push(this.floors[floor].lines[line]);

			};

			for( var power = 0; power < this.floors[floor].powers.length; power++ ){

				this.floors[floor].powers[power].y += middleDelta;

			};

			for( var monster = 0; monster < this.floors[floor].monsters.length; monster++ ){

				this.floors[floor].monsters[monster].y += middleDelta;

			};

		};

		for( var line = 0; line < this.worldLimits.length; line++ ){

			this.lines.push(this.worldLimits[line]);

		};

	},
	getNearestIntersection: function( vector, masterLine, onLineA, onLineB ){

		var nearest = new Object();

		for( var line = 0; line < this.lines.length; line++ ){

			var slaveLine = this.lines[line];

			var intersection = masterLine.getInteresectionWith(slaveLine);

			if( intersection.x !== null && intersection.y !== null ){

				var newVector = Vector2(intersection.x, intersection.y);
				var newDistance = vector.distanceFrom(newVector);

				if( nearest.vector === undefined && (onLineA === false || intersection.lineA === true) && (onLineB === false || intersection.lineB === true) ){

					nearest.vector = newVector;
					nearest.distance = newDistance;
					nearest.line = slaveLine;

				}
				else if( newDistance < nearest.distance && (onLineA === false || intersection.lineA === true) && (onLineB === false || intersection.lineB === true) ){

					nearest.vector = newVector;
					nearest.distance = newDistance;
					nearest.line = slaveLine;

				};

			};

		};

		return nearest;

	},
	drawLine: function( line ){

		var context = this.context;

		context.beginPath();

		context.moveTo(line.start.x, line.start.y);
		context.lineTo(line.end.x, line.end.y);
		context.strokeStyle = line.color;
		context.stroke();

		context.closePath();

		return this;

	},
	drawCircle: function( vector, radius ){

		var context = this.context;

		context.beginPath();

		context.arc(vector.x, vector.y, radius, 2 * Math.PI, false);
		context.fillStyle = "green";
		context.fill();

		context.closePath();

	},
	drawLight: function( vector ){

		var context = this.context;
		var radian = 0.0;
		var radius = this.height;
		var precision = 0.01;

		var vectorCenter;

		if( this.hero.direction === "left" ){

			vectorCenter = Vector2(this.hero.x, this.hero.y + (this.hero.height / 2));

		}
		else if( this.hero.direction === "right" ){

			vectorCenter = Vector2(this.hero.x + this.hero.width, this.hero.y + (this.hero.height / 2));

		};

		var gradient = context.createRadialGradient(vectorCenter.x, vectorCenter.y, 0, vectorCenter.x, vectorCenter.y, 400);
		gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
		gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

		context.save();

		var lightDirection;

		if( this.hero.direction === "left" ){

			lightDirection = -radius;

		}
		else if( this.hero.direction === "right" ){

			lightDirection = radius;

		};

		var lightRadianStart = -1.0;
		var lightRadianEnd = Math.PI / 2.5;

		context.beginPath();
		context.moveTo(vectorCenter.x, vectorCenter.y);
		context.lineTo(vectorCenter.x + (lightDirection * Math.cos(lightRadianStart)), vectorCenter.y + (lightDirection * Math.sin(lightRadianStart)));
		context.lineTo(vectorCenter.x + (lightDirection * Math.cos(lightRadianEnd)), vectorCenter.y + (lightDirection * Math.sin(lightRadianEnd)));
		context.lineTo(vectorCenter.x, vectorCenter.y);
		context.closePath();

		context.clip();

		var previousIntersection;

		this.context.beginPath();

		while( radian < Math.PI * 2 ){

			var line = Line(vectorCenter, Vector2(160 + (radius * Math.cos(radian)), 50 + (radius * Math.sin(radian))), this.lightColor);

			var intersection = this.getNearestIntersection(vectorCenter, line, true, true);

			if( intersection.vector !== undefined ){

				targetedLine = intersection.line;

				if( previousIntersection === undefined ){

					previousIntersection = intersection;

					context.moveTo(intersection.vector.x, intersection.vector.y);

				};

				if( targetedLine.id ){

				};

				if( targetedLine.id !== previousIntersection.line.id ){

					var context = this.context;

					context.lineTo(previousIntersection.vector.x, previousIntersection.vector.y);
					context.lineTo(intersection.vector.x, intersection.vector.y);

				};

			};

			previousIntersection = intersection;
			radian += precision;

		};

		// this.context.fillStyle = this.lightColor;
		context.fillStyle = gradient;
		context.fill();

		this.context.closePath();

		context.restore();

	},

	loop: function( now ){

		this.now = now;

		this.moveWorld();
		this.needFloor();
		this.getAllLines();
		this.render();

		this.lastNow = now;
		window.requestAnimationFrame(this.loop.bind(this));

	},
	render: function(){

		var context = this.context;

		context.clearRect(0, 0, this.width, this.height);

		context.beginPath();
		context.rect(0, 0, this.width, this.height);
		context.fillStyle = "#000000";
		context.fill();
		context.closePath();

		// for( var line = 0; line < this.worldLimits.length; line++ ){

		// 	this.drawLine(this.worldLimits[line]);

		// };

		for( var f = 0; f < this.floors.length; f++ ){

			var floor = this.floors[f];

			for( var monster = 0; monster < floor.monsters.length; monster++ ){

				var d = 0;

				if( floor.monsters[monster].direction == "left" ){

					d = 6;

				};

				this.context.fillStyle = "#F44747";

				this.context.beginPath();
				
				this.context.moveTo(floor.monsters[monster].x + 12 + d, floor.monsters[monster].y + 7);
				this.context.lineTo(floor.monsters[monster].x + 12 + d, floor.monsters[monster].y + 10);
				this.context.arc(floor.monsters[monster].x + 10 + d, floor.monsters[monster].y + 10, 2, 2 * Math.PI, Math.PI);
				this.context.lineTo(floor.monsters[monster].x + 8 + d, floor.monsters[monster].y + 6);
				this.context.fill();
				this.context.closePath();

				this.context.beginPath();
				this.context.moveTo(floor.monsters[monster].x + 18 - d, floor.monsters[monster].y + 8);
				this.context.lineTo(floor.monsters[monster].x + 18 - d, floor.monsters[monster].y + 10);
				this.context.arc(floor.monsters[monster].x + 16 - d, floor.monsters[monster].y + 10, 2, 2 * Math.PI, Math.PI);
				this.context.lineTo(floor.monsters[monster].x + 14 - d, floor.monsters[monster].y + 8);
				this.context.fill();
				this.context.closePath();			

			};

			for( var power = 0; power < floor.powers.length; power++ ){

				context.beginPath();
				var image = new Image(); 
				image.src = 'img/pile.png';
				context.drawImage(image, floor.powers[power].x, floor.powers[power].y); 
				context.closePath();

			};

		};

		this.drawLight();

		// for( var f = 0; f < this.floors.length; f++ ){

		// 	var floor = this.floors[f];

		// 	context.beginPath();

		// 	for( var line = 0; line < floor.lines.length; line++ ){

		// 		this.drawLine(floor.lines[line]);

		// 	};

		// 	context.strokeStyle = floor.color;
		// 	context.stroke();

		// 	context.closePath();

		// };

		this.drawHero();


		return this;

	}
};

Noire.fn.init.prototype = Noire.fn;