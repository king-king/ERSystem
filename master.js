/**
 * Created by WQ on 2015/5/12.
 */
var cd = require( "child_process " );


var httpServer = cd.fork( "server-worker.js" );

httpServer.on( "exit", function () {
    setTimeout( function () {
        // 1min 后重启
        httpServer = cd.fork( "server-worker.js" )
    }, 1000 * 60 );
} );