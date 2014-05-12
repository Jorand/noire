var Line = function( VectorA, VectorB, VectorX, color ){

	return new Line.fn.init(VectorA, VectorB, VectorX, color);

};

Line.fn = Line.prototype = {
	constructor: Line,
	init: function( VectorA, VectorB, VectorX, color ){

		this.vectorA = {
			x: vectorA.x,
			y: vectorA.y
		};

		this.vectorB = {
			x: vectorB.x,
			y: vectorB.y
		};

		this.vectorC = {
			x: vectorC.x,
			y: vectorC.y
		};

		this.color = color;

		return this;

	},
	interesectWith: function( line ){

		var result = {
			x: null,
			y: null,
			lineA: false,
			lineB: false
		};

		var denominator = ((line.end.y - line.start.y) * (this.end.x - this.start.x)) - ((line.end.x - line.start.x) * (this.end.y - this.start.y));

		if( denominator === 0 ){

			return result;

		}
		else {

			var a = this.start.y - line.start.y;
			var b = this.start.x - line.start.x;

			var numeratorA = ((line.end.x - line.start.x) * a) - ((line.end.y - line.start.y) * b);
			var numeratorB = ((this.end.x - this.start.x) * a) - ((this.end.y - this.start.y) * b);

			a = numeratorA / denominator;
			b = numeratorB / denominator;

			// On infinite lines, they intersect here (works with lineB too)
			result.x = this.start.x + (a * (this.end.x - this.start.x));
			result.y = this.start.y + (a * (this.end.y - this.start.y));

			// If this is a segment and lineB is infinite, they intesect if
			if( a > 0 && a < 1 ){

				result.lineA = true;

			};

			// If lineB is a segment and this is infinite, they intesect if
			if( b > 0 && b < 1 ){

				result.lineB = true;

			};

			// If this and lineB are both segment, they interesect if both are true
			return result;

		};

	}
};

Line.fn.init.prototype = Line.fn;