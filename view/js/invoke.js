/**
 * Created by WQ on 2015/5/14.
 */
(function () {

    // 得到项目列表
    function getProjectList( callback ) {
        util.ajaxGet( "/getProjectList", callback );
    }

    // 得到某个项目的未解决err
    function getUnsolvedErr( projectName, callback ) {
        util.ajaxGet( "/getUnsolvedErr?project=" + projectName, callback );
    }

    window.inv = {
        getProjectList : getProjectList,
        getUnsolvedErr : getUnsolvedErr
    }


})();