/**
 * Created by WQ on 2015/5/12.
 */

var MongoClient = require( 'mongodb' ).MongoClient,
    http = require( "http" ),
    lookMime = require( "mime" ).look,
    url = require( "url" ),
    fs = require( "fs" ),
    pt = require( "path" ),
    query = require( "queryDB" );


var dbUrl = 'mongodb://localhost:27017/errlog',
    database = null;

MongoClient.connect( dbUrl, function ( err, db ) {
    if ( !err ) {
        database = db;
        // 开启http服务器
        http.createServer( function ( req, res ) {
            var path = url.parse( req.url ).pathname;
            var extName = pt.extname( path );
            var mimeType = lookMime( extName );
            if ( extName ) {
                //  按照文件处理
                fs.exists( "view" + path, function ( is ) {
                    if ( is ) {
                        res.writeHead( 200, {
                            'Content-Type' : mimeType
                        } );
                        var rs = fs.createReadStream( "view" + path );
                        rs.pipe( res );
                        rs.on( "end", function () {
                            res.end();
                        } );
                    }
                    else {
                        res.writeHead( 404 );
                        res.end();
                    }
                } );
            }

            // 插入一条数据
            else if ( req.url == "/insert" ) {
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
                    doc.version = data.version || 0;
                    doc.solve = false;
                    if ( !data.project || !data.err ) {
                        // 如果没有没有必选的数据，则不进行处理，直接返回400
                        res.write( JSON.stringify( {
                            code : 400,
                            result : "缺少project或err字段"
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
                                    result : ""
                                } ) );
                            }
                            else {
                                res.write( JSON.stringify( {
                                    code : 400,
                                    result : "数据库插入操作失败"
                                } ) );
                            }
                            res.end();
                        } );
                    }
                } );
            }

            // 得到所有集合
            else if ( req.url == "/getProjectList" ) {
                res.writeHead( 200, {
                    'Content-Type' : 'application/json; charset=utf-8',
                    "Access-Control-Allow-Origin" : "*"
                } );
                query.getCollectionList( db, function ( err, projectList ) {
                    if ( err ) {
                        res.write( JSON.stringify( {
                            code : 500,
                            result : err
                        } ) );
                    }
                    else {
                        res.write( JSON.stringify( {
                            code : 200,
                            result : projectList
                        } ) );
                    }
                    res.end();
                } )
            }

            //得到某个项目的所有未解决错误
            else if ( /^\/getUnsolvedErr\?/.test( req.url ) ) {
                var projectName = url.parse( req.url, true ).query.project;
                if ( projectName ) {
                    res.writeHead( 200, {
                        'Content-Type' : 'application/json; charset=utf-8',
                        "Access-Control-Allow-Origin" : "*"
                    } );
                    query.findAllUnsolvedErr( db, projectName, function ( err, result ) {
                        if ( err ) {
                            res.write( JSON.stringify( {
                                code : 500,
                                result : err
                            } ) );
                        }
                        else {
                            res.write( JSON.stringify( {
                                code : 200,
                                result : result
                            } ) );
                        }
                        res.end();
                    } );

                }
                else {
                    // query中必须包含project的名称
                    res.writeHead( 400 );
                    res.end();
                }
            }

            else {
                // 不能处理的url都按照400处理
                res.writeHead( 400 );
                res.end();
            }
        } ).listen( 8181, "127.0.0.1" );
    }
    else {
        console.log( "mongodb服务器链接失败，http服务器已经关闭" );
        // 1min后退出程序，由父进程监听到exit事件后重启
        setTimeout( function () {
            process.exit();
        }, 1000 * 60 );
    }
} );

process.on( "exit", function () {
    database && database.close();
} );