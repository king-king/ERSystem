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

    function element( tag, arg, parent ) {
        var t = document.createElement( tag );
        for ( var key in arg ) {
            switch ( key ) {
                case "classList" :
                    t.classList.add( arg[key] );
            }
        }
        parent && parent.appendChild( t );
        return t;
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