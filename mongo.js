/**
 * Created by WQ on 2015/5/12.
 */
var MongoClient = require( 'mongodb' ).MongoClient;

var deleteDB = require( "deleteDB" );

var url = 'mongodb://localhost:27017/test';
MongoClient.connect( url, function ( err, db ) {

    db.dropCollection( "student", function ( err, result ) {
        console.log( err ? err : result );
        db.close();
    } )
} );

