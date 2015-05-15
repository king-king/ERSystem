// 将北京时间今日0点构造成utc时间
var d0 = new Date();
d0.setMinutes( 0 );
d0.setSeconds( 0 );
d0.setHours( d0.getHours() - 8 );

// 将北京当前时间构造成utc时间
var dn = new Date();
dn.setHours( dn.getHours() - 8 );

db.chuye.aggregate( [
    {
        $match : {
            solve : false
        }
    },
    {
        $project : {
            year : {$year : "$date"},
            month : {$month : "$date"},
            day : {$dayOfMonth : "$date"},
            hour : {$hour : "$date"},
            err : 1,
            date : 1
        }
    },
    {
        $match : {
            year : {
                $gte : d0.getFullYear(),
                $lte : dn.getFullYear()
            },
            month : {
                $gte : d0.getMonth() + 1,
                $lte : dn.getMonth() + 1
            },
            day : {
                $gte : d0.getDate(),
                $lte : dn.getDate()
            },
            err : "503 Service Unavailable"
        }
    },
    {
        $group : {
            _id : {
                year : 1,
                month : 1,
                data : 1,
                hour : 1
            }
        }
    }
] )