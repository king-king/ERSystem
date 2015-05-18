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
            height : h
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

    function lineChart( data, color, w, h, parent ) {
        var svg = SVG( w, h, parent );
        var x0 = 40, y0 = h - 20;

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
                "stroke-width" : 2,
                "class" : "point"
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

        function text( x, y, words ) {
            var t = svgElement( "text", {
                x : px( x ),
                y : py( y )
            } );
            t.innerHTML = words;
            return t;
        }

        function polyline( points, color ) {
            return svgElement( "polyline", {
                fill : "none",
                stroke : color,
                "stroke-width" : 2,
                points : points,
                "class" : "polyline"
            } );
        }

        var max = 0;
        var dx = (w - x0 - 20) / (data.length - 1) << 0;
        var dy = ( y0 - 20) / 4 << 0;
        // 制作经纬线
        data.forEach( function ( d, i ) {
            if ( max < d.value ) {
                max = d.value;
            }
            svg.appendChild( line( dx * i, 0, dx * i, y0 - 20, "#ccc", 1 ) );
            if ( i != 0 ) {
                var t = text( dx * i, -14, i );
                t.style["text-anchor"] = "middle";
                t.style.fill = "#aaa";
                t.style["font-size"] = "10px";
                svg.appendChild( t );
            }
        } );
        // 得到纵坐标的最大值
        max = getMax( max );
        util.loop( 5, function ( i ) {
            svg.appendChild( line( 0, dy * i, w - x0 - 20, dy * i, "#ccc", 1 ) );
            var t = text( -2, dy * i - 5, max / 4 * i );
            t.classList.add( "y-value" );
            t.style["text-anchor"] = "end";
            t.style.fill = "#aaa";
            t.style["font-size"] = "10px";
            svg.appendChild( t );
        } );

        var positions = "";
        data.forEach( function ( d, i ) {
            if ( d.value ) {
                var x = dx * i,
                    y = d.value / max * (h - 40) << 0;
                positions += px( x ) + "," + py( y ) + " ";
            }
        } );
        svg.appendChild( polyline( positions, color ) );
        data.forEach( function ( d, i ) {
            if ( d.value ) {
                var x = dx * i,
                    y = d.value / max * (h - 40) << 0;
                svg.appendChild( point( x, y, color, d.value ) );
            }
        } );

        function removeAll( els ) {
            util.forEach( els, function ( el, i ) {
                el.remove();
            } );
        }

        return {
            svg : svg,
            redraw : function ( data, color ) {
                // 纵坐标擦掉，重新绘制
                removeAll( svg.querySelectorAll( ".y-value" ) );

                // 擦掉所有点，重新绘制
                removeAll( svg.querySelectorAll( ".point" ) );

                // 擦掉折线，重新绘制
                svg.querySelector( ".polyline" ).remove();
            }
        };
    }


    window.Chart = {
        lineChart : lineChart
    }

})();