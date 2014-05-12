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

			// Request first frame with Noire object as 'this'
			window.requestAnimationFrame(this.loop.bind(this));

			return this;

		},
		resize: function( width, height ){

			// Resize canvas
			this.canvas.width = width;
			this.canvas.height = height;

			return this;

		},
		loop: function( now ){

			// Get how much milliseconds are elapsed since previous frame request
			this.deltaTime = this.previousNow - now;

			// Render the scene
			this.render();

			// Request next frame (infinite loop)
			window.requestAnimationFrame(this.loop.bind(this));

		},
		render: function(){

			

		}
	};

	Noire.fn.init.prototype = Noire.fn;

	window.Noire = Noire;

	var Vector2 = function( x, y ){



	};

})(window);