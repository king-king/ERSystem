/**
 * Created by WQ on 2015/5/14.
 */

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

exports.loop = loop;
exports.forEach = forEach;