/**
 * Created by WQ on 2015/5/12.
 */

var MongoClient = require( 'mongodb' ).MongoClient,
    http = require( "http" );


var dbUrl = 'mongodb://localhost:27017/errlog',
    database = null;

MongoClient.connect( dbUrl, function ( err, db ) {
    if ( !err ) {
        database = db;
        // 开启http服务器
        http.createServer( function ( req, res ) {
            if ( req.url == "/insert" ) {
                res.writeHead( 200, {
                    'Content-Type' : 'application/json; charset=utf-8',
                    "Access-Control-Allow-Origin" : "*"
                } );
                // 将错误记录到mongodb当中
                var doc = {};
                doc.origin = req.headers.origin;
                doc.userAgent = req.headers["user-agent"];
                doc.date = new Date();
                var data = "";
                req.on( "data", function ( s ) {
                    data += s;
                } );
                req.on( "end", function () {
                    data = JSON.parse( data );
                    doc.err = data.err;
                    doc.mark = data.mark || "";
                    if ( !data.project || !data.err ) {
                        // 如果没有没有必选的数据，则不进行处理，直接返回400
                        res.write( JSON.stringify( {
                            code : 400,
                            text : "缺少project或err字段"
                        } ) );
                        res.end();
                    }
                    else {
                        // 插入数据
                        var col = db.collection( data.project );
                        col.insertOne( doc, function ( err, result ) {
                            if ( !err ) {
                                res.write( JSON.stringify( {
                                    code : 200,
                                    text : ""
                                } ) );
                            }
                            else {
                                res.write( JSON.stringify( {
                                    code : 400,
                                    text : "数据库插入操作失败"
                                } ) );
                            }
                            res.end();
                        } );
                    }
                } );
            }

        } ).listen( 8181, "127.0.0.1" );
    }
    else {
        // 1min后退出程序，由父进程监听到exit事件后重启
        setTimeout( function () {
            process.exit();
        }, 1000 * 60 );
    }
} );

process.on( "exit", function () {
    database && database.close();
} );