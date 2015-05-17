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

		var max = 0;
		var points = [];
		var dx = (w - 40) / (data.length - 1) << 0;
		data.forEach( function ( d, i ) {
			if ( max < d.value ) {
				max = d.value;
			}
			svg.appendChild( line( dx * i, 0, dx * i, y0 - 20, "#aaa", 1 ) );
		} );

		if ( Math.log10( max ) << 0 == 0 ) {
			max = 10;
		}
		else {
			max = Math.ceil( max / (((Math.log10( max ) << 0) - 1)*10 ) )* (Math.log10( max ) << 0 - 1);
		}

		return svg;
	}

	window.Chart = {
		lineChart : lineChart
	}

})();