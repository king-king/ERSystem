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

    function generateDetailList( errlist ) {
        detailLoadingIcon.classList.add( "hide" );
        forEach( errlist.result, function ( item ) {
            var itemBorder = element( "div", {
                classList : "detail-list-item"
            }, detailContent );
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


    !function () {
        inv.getProjectList( function ( data ) {
            var item0;
            if ( data.code == 200 ) {
                projectListLoadingIcon.remove();
                forEach( data.result, function ( item, i ) {
                    var it = element( "div", {
                        classList : "project-list-item",
                        innerHTML : item.name
                    }, projectListBorder );
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