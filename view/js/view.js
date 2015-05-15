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
        util.forEach( errlist.result.slice( 0, 6 ), function ( item, i ) {
            piChartData.push( {
                value : item.count / sum,
                color : colors[i]
            } );
            cur += item.count;
        } );
        errlist.result.length > 6 && piChartData.push( {
            value : 1 - cur / sum,
            color : colors[6]
        } );
        console.log( errlist );
        chart.pieChart( canvas, piChartData, 0, Math.PI * 2 );
        detailLoadingIcon.classList.add( "hide" );
        forEach( errlist.result, function ( item, i ) {
            var itemBorder = element( "div", {
                classList : "detail-list-item"
            }, detailContent );
            element( "div", {
                classList : "detail-list-item-color-cursor",
                css : {
                    "background-color" : colors[i > 5 ? 6 : i]
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
                            inv.getUnsolvedErr( item.name, function ( errlist ) {
                                if ( errlist.code == 200 ) {
                                    generateDetailList( errlist );
                                }
                            } );
                        }
                    };
                    projectListDom.push( it );
                } );
                // 获取第一个项目的错误列表
                if ( data.result.length != 0 ) {
                    detailLoadingIcon.classList.remove( "hide" );
                    projectListDom[0].classList.add( "select" );
                    inv.getUnsolvedErr( data.result[0].name, function ( errlist ) {
                        if ( errlist.code == 200 ) {
                            generateDetailList( errlist );
                        }
                    } );
                }
            }
        } )
    }()

})();