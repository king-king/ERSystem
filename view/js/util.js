/**
 * Created by WQ on 2015/5/14.
 */
(function () {
    function loop( c, func ) {
        for ( var i = 0; i < c; i++ ) {
            func( i );
        }
    }

    function forEach( array, func ) {
        for ( var i = 0; i < array.length; i++ ) {
            func( array[i], i );
        }
    }

    function ajaxPost( url, data, callback ) {
        var xhr = new XMLHttpRequest();
        xhr.open( "post", url, true );
        xhr.send( JSON.stringify( data ) );
        xhr.onreadystatechange = function () {
            if ( xhr.readyState == 4 ) {
                callback( JSON.parse( xhr.responseText ) );
            }
        }
    }

    function ajaxGet( url, callback ) {
        var xhr = new XMLHttpRequest();
        xhr.open( "get", url, true );
        xhr.send();
        xhr.onreadystatechange = function () {
            if ( xhr.readyState == 4 ) {
                callback( JSON.parse( xhr.responseText ) );
            }
        }
    }

    Node.prototype.position = function ( x, y ) {
        this.style.setProperty( "-webkit-transform", "translate3d(" + x + "px," + y + "px,0)", null );
    };

    Node.prototype.remove = function () {
        this.parentNode.removeChild( this );
    };

    Node.prototype.css = function ( styles ) {
        for ( var key in styles ) {
            this.style.setProperty( key, styles[key], null );
        }
    };

    function element( tag, arg, parent ) {
        var el = document.createElement( tag );
        for ( var key in arg ) {
            switch ( key ) {
                case "classList" :
                    el.classList.add( arg[key] );
                    break;
                case "css":
                    el.css( arg.css );
                    break;
                default :
                    el[key] = arg[key];
            }
        }
        parent && parent.appendChild( el );
        return el;
    }


    window.util = {
        loop : loop,
        forEach : forEach,

        element : element,

        //ajax
        ajaxPost : ajaxPost,
        ajaxGet : ajaxGet
    }
})();