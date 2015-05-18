/**
 * Created by WQ on 2015/5/14.
 */
(function () {

    var element = util.element,
        forEach = util.forEach;

    var querySelector = document.querySelector.bind( document );


    // dom
    var projectListBorder = querySelector( ".project-list-border" ),
        projectListLoadingIcon = querySelector( ".project-list-border .loading" ),
        detailListBorder = querySelector( ".detail-list-border" ),
        detailContent = querySelector( ".detail-content" ),
        detailLoadingIcon = querySelector( ".detail-list-border  .loading" );

    var projectListDom = [];
    var curProjectIndex = 0;

    var colors = ["#FC4141", "#C6CF05", "#12CC09", "#1FB6B1", "#2158B4", "#AD20B5", "#7B7644"];

    function generateDetailList( errlist ) {
        // 生成扇形图
        detailListBorder.querySelector( ".piChart" ) && detailListBorder.querySelector( ".piChart" ).remove();
        var canvas = util.element( "canvas", {
            width : 200,
            height : 200,
            classList : "piChart"
        }, detailListBorder );
        var sum = 0;
        var piChartData = [];
        util.forEach( errlist.result, function ( item ) {
            sum += item.count;
        } );
        var cur = 0;
        util.forEach( errlist.result.slice( 0, colors.length - 1 ), function ( item, i ) {
            piChartData.push( {
                value : item.count / sum,
                color : colors[i]
            } );
            cur += item.count;
        } );
        errlist.result.length > (colors.length - 1) && piChartData.push( {
            value : 1 - cur / sum,
            color : colors[colors.length - 1]
        } );
        //console.log( errlist );
        chart.pieChart( canvas, piChartData, 0, Math.PI * 2 );
        detailLoadingIcon.classList.add( "hide" );
        forEach( errlist.result, function ( item, i ) {
            var itemBorder = element( "div", {
                classList : "detail-list-item"
            }, detailContent );
            element( "div", {
                classList : "detail-list-item-color-cursor",
                css : {
                    "background-color" : colors[i > colors.length - 2 ? colors.length - 1 : i]
                }
            }, itemBorder );
            var text = element( "div", {
                classList : "text",
                innerHTML : item["_id"]
            }, itemBorder );
            text.title = item["_id"];
            element( "count", {
                classList : "count",
                innerHTML : item.count
            }, itemBorder );
        } );
    }

    function generateProjectItem( name ) {
        var item = element( "div", {
            classList : "project-list-item",
            innerHTML : name
        }, projectListBorder );
        element( "div", {
            classList : "project-list-item-select-icon"
        }, item );
        return item;
    }

    var lineChartTimeStamp = 0;

    !function () {
        inv.getProjectList( function ( data ) {
            if ( data.code == 200 ) {
                projectListLoadingIcon.remove();
                forEach( data.result, function ( item, i ) {
                    var it = generateProjectItem( item.name );
                    it.onclick = function () {
                        if ( curProjectIndex != i ) {
                            detailLoadingIcon.classList.remove( "hide" );
                            projectListDom[curProjectIndex].classList.remove( "select" );
                            curProjectIndex = i;
                            projectListDom[curProjectIndex].classList.add( "select" );
                            detailContent.innerHTML = "";
                            detailLoadingIcon.classList.remove( "hide" );
                            // 当点击左侧列表中的项目时候，要在右侧显示内容，先获取没有解决的错误列表
                            inv.getUnsolvedErr( item.name, function ( errlist ) {
                                if ( errlist.code == 200 ) {
                                    generateDetailList( errlist );
                                }
                            } );
                            // 得到当前项目的出错时间分布（当天）
                            inv.getUnsolvedErrCountInTodayByHours( data.result[i].name, function ( data ) {
                                var sendStamp = (new Date()).getTime();
                                if ( lineChartTimeStamp < sendStamp ) {
                                    lineChartTimeStamp = sendStamp;
                                }
                                var lineData = [];
                                var curHour = (new Date()).getHours();
                                util.loop( 24, function ( i ) {
                                    lineData.push( {
                                        value : i <= curHour ? 0 : -1
                                    } );
                                } );
                                if ( data.code == 200 ) {
                                    if ( lineChartTimeStamp <= sendStamp ) {
                                        util.forEach( data.result, function ( item ) {
                                            lineData[(item["_id"].hour + 8) % 24].value = item.count;
                                        } );
                                        detailListBorder.querySelector( ".line-chart" ) && detailListBorder.querySelector( ".line-chart" ).remove();
                                        var lineChart = chart.lineChart( lineData, "red", detailListBorder.offsetWidth - 400, 200, detailListBorder );
                                        lineChart.svg.classList.add( "line-chart" );
                                        lineChart.svg.css( {
                                            position : "absolute",
                                            top : "50px",
                                            left : "270px"
                                        } );
                                    }
                                }
                            } );
                        }
                    };
                    projectListDom.push( it );
                } );
                if ( data.result.length != 0 ) {
                    detailLoadingIcon.classList.remove( "hide" );
                    projectListDom[0].classList.add( "select" );
                    // 获取第一个项目的错误列表
                    inv.getUnsolvedErr( data.result[0].name, function ( errlist ) {
                        if ( errlist.code == 200 ) {
                            generateDetailList( errlist );
                        }
                    } );
                    // 获取第一个项目的出错时间分布
                    inv.getUnsolvedErrCountInTodayByHours( data.result[0].name, function ( data ) {
                        var sendStamp = (new Date()).getTime();
                        lineChartTimeStamp = sendStamp;
                        var lineData = [];
                        var curHour = (new Date()).getHours();
                        util.loop( 24, function ( i ) {
                            lineData.push( {
                                value : i <= curHour ? 0 : -1
                            } );
                        } );
                        if ( data.code == 200 ) {
                            if ( lineChartTimeStamp <= sendStamp ) {
                                // 如果這個請求是最新的才會更新折綫圖
                                util.forEach( data.result, function ( item ) {
                                    lineData[(item["_id"].hour + 8) % 24].value = item.count;
                                } );
                                var lineChart = chart.lineChart( lineData, "red", detailListBorder.offsetWidth - 400, 200, detailListBorder );
                                lineChart.svg.classList.add( "line-chart" );
                                lineChart.svg.css( {
                                    position : "absolute",
                                    top : "50px",
                                    left : "270px"
                                } );
                            }
                        }
                    } );
                }
            }
        } )
    }()

})();