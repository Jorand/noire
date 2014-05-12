var Vector2 = function( x, y ){

	return new Vector2.fn.init(x, y);

};

Vector2.fn = Vector2.prototype = {
	constructor: Vector2,
	init: function( x, y ){

		if( x.constructor === Vector2 ){

			this.clone(x);

		}
		else {

			this.x = x || 0;
			this.y = y || 0;

		};

		return this;

	},
	clone: function( vector ){

		this.x = vector.x;
		this.y = vector.y;
		this.z = vector.z;

		return this;

	},
	distanceFrom: function( vector ){

		var dx = vector.x - this.x;
		var dy = vector.y - this.y;

		return Math.sqrt((dx * dx) + (dy * dy));

	}
};

Vector2.fn.init.prototype = Vector2.fn;

var testA = Vector2(100, 10);
var testB = Vector2(10, 100);

testA.distanceFrom(testB);