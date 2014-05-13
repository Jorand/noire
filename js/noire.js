(function( window, undefined ){
	"use strict";

	var Noire = function( parameters ){

		return new Noire.fn.init(parameters);

	};

	Noire.fn = Noire.prototype = {
		constructor: Noire,
		init: function( parameters ){

			// Create canvas
			this.canvas = document.createElement("canvas");

			// Set it a size first
			this.resize(parameters.width, parameters.height);

			// Append it to the DOM
			document.body.appendChild(this.canvas);

			// Create a context from the canvas
			this.context = this.canvas.getContext("2d");

			// Create a variable to compare to now to create a delta time
			this.previousNow = 0;

			this.world = Block({
				points: [
					[0, 0],
					[100, 0],
					[100, 100],
					[0, 100]
				],
				color: "#FF0000"
			});

			this.objects = new Array();

			// Request first frame with Noire object as 'this'
			window.requestAnimationFrame(this.loop.bind(this));

			return this;

		},
		resize: function( width, height ){

			// Resize canvas
			this.canvas.width = width;
			this.canvas.height = height;

			this.percent = width / 100;

			return this;

		},
		addObject: function( parameters ){

			this.objects.push(Block(parameters));

			return this;

		},
		drawObject: function( object ){

			// Start path
			this.context.beginPath();

			// Draw line between each point
			for( var point = 0; point < object.points.length; point++ ){

				this.context.lineTo(object.points[point].x * this.percent, object.points[point].y * this.percent);

			};

			// Choose stroke and fill color
			this.context.strokeStyle = object.color;
			// this.context.fillStyle = object.color;

			// Draw stroke and fill color
			this.context.stroke();
			// this.context.fill();

			// End path
			this.context.closePath();

		},
		loop: function( now ){

			// Get how much milliseconds are elapsed since previous frame request
			this.deltaTime = this.previousNow - now;

			// Render the scene
			this.render();

			// Request next frame (infinite loop)
			// window.requestAnimationFrame(this.loop.bind(this));

		},
		render: function(){

			// Render the world
			this.drawObject(this.world);

			// Render objects
			for( var object = 0; object < this.objects.length; object++ ){

				this.drawObject(this.objects[object]);

			};

		}
	};

	Noire.fn.init.prototype = Noire.fn;

	window.Noire = Noire;

	var Vector2 = function( x, y ){

		return new Vector2.fn.init(x, y);

	};

	Vector2.fn = Vector2.prototype = {
		constructor: Vector2,
		init: function( x, y ){

			if( x.constructor === Vector2 ){

				Vector2.clone(x);

			}
			else {

				this.x = x;
				this.y = y;

			};

			return this;

		},
		translate: function( x, y ){

			this += x;
			this += y;

			return this;

		},
		clone: function( vector ){

			this.x = vector.x;
			this.y = vector.y;

			return this;

		}
	};

	var Line = function( vertexA, vertexB, color ){

		return new Line.fn.init(vertexA, vertexB, color);

	};

	Line.fn = Line.prototype = {
		constructor: Line,
		init: function( vertexA, vertexB, color ){

			this.from = vertexA;
			this.to = vertexB;

			this.color = color || "#000000";

			return this;

		},
		translate: function( x, y ){

			this.from.translate(x, y);
			this.to.translate(x, y);

			return this;

		}
	};

	Line.fn.init.prototype = Line.fn;

	var Block = function( parameters ){

		return new Block.fn.init(parameters);

	};

	Block.fn = Block.prototype = {
		constructor: Block,
		init: function( parameters ){

			this.color = parameters.color || "#000000";

			this.points = new Array();

			this.position = {
				x: 0,
				y: 0
			};

			this.top = 0;
			this.right = 0;
			this.bottom = 0;
			this.left = 0;

			for( var point = 0; point < parameters.points.length; point++ ){

				var vector = Vector2(parameters.points[point][0], parameters.points[point][1]);

				if( vector.x < this.left ){

					this.left = vector.x;

				}
				else if( vector.x > this.right ){

					this.right = vector.x;

				};

				if( vector.y < this.top ){

					this.top = vector.y;

				}
				else if( vector.y > this.bottom ){

					this.bottom = vector.y;

				};

				this.points.push(vector);

			};

			this.width = this.right - this.left;
			this.height = this.bottom - this.top;

			return this;

		},
		moveBy: function( x, y ){

			this.position.x += x;
			this.position.y += y;

			return this;

		},
		moveTo: function( x, y ){

			this.position.x = x;
			this.position.y = y;

			return this;

		},
		translate: function( x, y ){

			for( var vector = 0; vector < this.points.length; vector++ ){

				this.vectors[vector].translate(x, y);

			};

			return this;

		}
	};

	Block.fn.init.prototype = Block.fn;

})(window);