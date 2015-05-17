/**
 * Created by acer on 2015/5/17.
 */

(function () {

	var svgElement = function ( tag, attributes, parent ) {
		var el = document.createElementNS( "http://www.w3.org/2000/svg", tag );
		for ( var key in attributes ) {
			el.setAttribute( key, attributes[key] );
		}
		parent && parent.appendChild( el );
		return el;
	};

	var SVG = function ( w, h, parent ) {
		var svg = svgElement( "svg", {
			width : w,
			height : h,
		}, parent );
		return svg;
	};


	function getMax( num ) {
		var result = 0;
		var x = Math.log10( num ) << 0;
		if ( x < 1 ) {
			result = 10;
		}
		else {
			x = Math.pow( 10, x - 1 );
			result = Math.ceil( num / x + 0.00001 ) * x;
		}
		return result;
	}

	function lineChart( data, color, w, h, x, y, parent ) {
		var svg = SVG( w, h, parent );
		var x0 = 20, y0 = h - 20;

		function px( x ) {
			return x + x0;
		}

		function py( y ) {
			return y0 - y;
		}

		function point( x, y, color, title ) {
			return svgElement( "circle", {
				r : 4,
				cx : px( x ),
				cy : py( y ),
				fill : color,
				title : title,
				stroke : "white",
				"stroke-width" : 2
			} );
		}

		function line( x1, y1, x2, y2, color, width ) {
			return svgElement( "line", {
				x1 : px( x1 ),
				y1 : py( y1 ),
				x2 : px( x2 ),
				y2 : py( y2 ),
				stroke : color,
				"shape-rendering" : "crispedges",
				"stroke-width" : width ? width : 2
			} );
		}

		function text( x, y, text ) {
			var t = svgElement( "text", {
				x : px( x ),
				y : py( y )
			} );
			t.innerHTML = text;
			return t;
		}

		function polyline( points, color ) {
			return svgElement( "polyline", {
				fill : "none",
				stroke : color,
				"stroke-width" : 2,
				points : positions
			} );
		}

		var max = 0;
		var points = [];
		var dx = (w - 40) / (data.length - 1) << 0;
		var dy = (h - 40) / 4 << 0;
		data.forEach( function ( d, i ) {
			if ( max < d.value ) {
				max = d.value;
			}
			svg.appendChild( line( dx * i, 0, dx * i, y0 - 20, "#aaa", 1 ) );
		} );
		util.loop( 5, function ( i ) {
			svg.appendChild( line( 0, dy * i, w - 40, dy * i, "#aaa", 1 ) );
			var t = text( -2, dy * i - 5, dy * i );
			t.style["text-anchor"] = "end";
			t.style.fill = "#aaa";
			t.style["font-size"] = "10px";
			svg.appendChild( t );
		} );
		max = getMax( max );

		var positions = "";
		data.forEach( function ( d, i ) {
			var x = dx * i,
				y = d.value / max * (h - 40) << 0;
			positions += px( x ) + "," + py( y ) + " ";
		} );
		svg.appendChild( polyline( positions, color ) );
		data.forEach( function ( d, i ) {
			var x = dx * i,
				y = d.value / max * (h - 40) << 0;
			var p = point( x, y, color, d.value );
			points.push( p );
			svg.appendChild( p );
		} );
		return svg;
	}


	window.Chart = {
		lineChart : lineChart
	}

})();