/**
 * Created by WQ on 2015/5/12.
 */
var MongoClient = require( 'mongodb' ).MongoClient;

var url = 'mongodb://localhost:27017/mytest';
MongoClient.connect( url, function ( err, db ) {

    var doc = db.collection( "test1" );

    var startTime = (new Date()).getTime();

    console.log( "正在插入数据" );
    var count = 0;
    for ( var i = 0; i < 100000; i++ ) {
        doc.insertOne( {
            name : "王群",
            year : 23
        }, function ( err, result ) {
            count += 1;
            if ( count == 100000 ) {
                console.log( "结束" );
                console.log( "一共用时：" + ((new Date()).getTime() - startTime) / 1000 + "s" );
                db.close();
            }
        } );
    }

} );

