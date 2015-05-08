/**
 * Created by WQ on 2015/5/8.
 */

var http = require( "http" );
var fs = require( "fs" );

var maxCacheLen = 10;
global.fileHandlers = [];

var c = 0;

http.createServer( function ( req, res ) {
    var item = {};
    item.origin = req.headers.origin;
    item.userAgent = req.headers["user-agent"];
    var text = "";
    var data = "";
    req.on( "data", function ( s ) {
        data += s;
    } );
    req.on( "end", function () {
        var resdata = JSON.parse( data );
        var project = resdata.project;
        text = resdata.text || "";
        item.project = project;
        item.text = resdata.text || "";
        var file = isCache( project );
        if ( !file ) {
            console.log( "has not" );
            // 如果没有缓存
            if ( fileHandlers.length >= maxCacheLen ) {
                fs.close( fileHandlers[0].fd, function ( err ) {
                    if ( !err ) {
                        fileHandlers.shift();
                    }
                } );
                fs.open( "log/" + item.project + ".json", "w+", function ( err, fd ) {
                    if ( !err ) {
                        fileHandlers.push( {project : item.project, fd : fd} );
                        fs.write( fd, ++c + "\n", function ( err ) {
                        } );
                    }
                } );
            }
            else {
                fs.open( "log/" + item.project + ".json", "w+", function ( err, fd ) {
                    if ( !err ) {
                        fileHandlers.push( {project : item.project, fd : fd} );
                        fs.write( fd, ++c + "\n", function ( err ) {
                        } );
                    }
                } );
            }
        }
        else {
            // 有缓存，直接写入文件
            fs.write( file.fd, ++c + "\n" );
            console.log( "has" )
        }
    } );

    res.writeHead( 200, {
        'Content-Type' : 'application/json; charset=utf-8',
        "Access-Control-Allow-Origin" : "*"
    } );
    var a = {
        code : 200,
        status : "ok"
    };
    res.write( JSON.stringify( a ) );
    res.end();


} ).listen( 8282, '127.0.0.1' );


function isCache( project ) {
    var len = fileHandlers.length;
    if ( len == 0 ) {
        return null;
    }
    for ( var i = 0; i < len; i++ ) {
        if ( fileHandlers[i].project == project ) {
            return fileHandlers[i];
        }
    }
    return null;
}

