/**
 * Created by WQ on 2015/5/12.
 */
var MongoClient = require( 'mongodb' ).MongoClient;

var deleteDB = require( "deleteDB" );


var url = 'mongodb://localhost:27017/errlog';
MongoClient.connect( url, function ( err, db ) {

	// 将北京时间今日0点构造成utc时间
	var d0 = new Date();
	d0.setMinutes( 0 );
	d0.setSeconds( 0 );
	d0.setHours( 0 );

	// 将北京当前时间构造成utc时间
	var dn = new Date();

	var chuye = db.collection( "chuye" );
	chuye.aggregate(
		[
			{
				$match : {
					solve : false
				}
			},
			{
				$project : {
					hour : {$hour : "$date"},
					err : 1,
					date : 1
				}
			},
			{
				$match : {
					date : {
						$gte : d0,
						$lte : dn
					}
				}
			},
			{
				$group : {
					_id : {
						"hour" : "$hour"
					},
					count : {
						$sum : 1
					}
				}
			}
		],
		function ( err, reslut ) {
			console.log( err ? err : reslut );
			db.close();
		}
	)

} );

