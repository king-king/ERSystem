/**
 * Created by WQ on 2015/5/14.
 */
var http = require( 'http' );
var url = require( "url" );


http.createServer( function ( req, res ) {

    console.log( url.parse( req.url, true ) );

    res.writeHead( 200, {'Content-Type' : 'text/plain', "Access-Control-Allow-Origin" : "*"} );
    res.end( 'Hello Worl' );
} ).listen( 8383, 'localhost' );