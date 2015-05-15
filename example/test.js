/**
 * Created by WQ on 2015/5/15.
 */


var img = new Image();
img.src = "1111.jpg";
img.onerror = function ( e ) {
    console.log( e )
};