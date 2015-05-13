/**
 * Created by WQ on 2015/5/13.
 */
var http = require( "http" );
var url = require( "url" );


http.createServer( function ( req, res ) {

    var path = url.parse( req.url ).pathname;
    console.log( path );

    res.writeHead( 200, {
        'Content-Type' : 'application/json; charset=utf-8',
        "Access-Control-Allow-Origin" : "*"
    } );
    res.write( JSON.stringify( {
        code : 200,
        text : ""
    } ) );
    res.end();

} ).listen( 8282, "localhost" );