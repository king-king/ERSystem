/**
 * Created by WQ on 2015/5/8.
 */

var fs = require( "fs" );

fs.open( "log/wq.json", "w+", function ( err, fd ) {
    if ( !err ) {
        console.log( fd )
    }
} );