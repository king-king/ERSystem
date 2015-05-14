/**
 * Created by WQ on 2015/5/12.
 */
var MongoClient = require( 'mongodb' ).MongoClient;
var query = require( "queryDB" ).findAllUnsolvedErr;


// Connection URL
var url = 'mongodb://localhost:27017/errlog';
// Use connect method to connect to the Server
MongoClient.connect( url, function ( err, db ) {
    console.log( "Connected correctly to server" );
    //var student = db.collection( "student2" );

    db.collections( function ( err, collections ) {
        console.log( collections );
        db.close();
    } );

    //console.log( "hello" );
    //
    //query( db, "chuye", function ( err, result ) {
    //    if ( err ) {
    //        console.log( err );
    //    }
    //    else {
    //        console.log( result )
    //    }
    //    db.close();
    //} );


    // 查询
    //student.find( {} ).toArray( function ( err, docs ) {
    //    console.dir( docs[0].name );
    //    db.close();
    //} );

    // 插入
    //student.insert( [
    //    {
    //        name : "李小雪",
    //        year : 23,
    //        sex : "woman",
    //        birth : new Date( "1992/10/1" )
    //    },
    //    {
    //        name : "张卫国",
    //        year : 22,
    //        sex : "man",
    //        birth : new Date( "1993/5/23" )
    //    },
    //    {
    //        name : "赵玛西",
    //        year : 24,
    //        sex : "man",
    //        birth : new Date( "1991/1/28" )
    //    }
    //], function ( err, result ) {
    //    if ( !err ) {
    //        console.log( result );
    //    }
    //} );

    // 条件查询
    //student.find( {birth : new Date( "1991/6/24" )} ).toArray( function ( err, docs ) {
    //    console.log( docs );
    //    db.close();
    //} );
} );

