d = new Date()
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
            err : 1
        }
    },
    {
        $match : {
            year : d.getFullYear(),
            month : d.getMonth() + 1,
            day : d.getDate(),
            err : "510 Not Extended"
        }
    }
] )