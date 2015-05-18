/**
 * Created by WQ on 2015/5/14.
 */
(function () {

    function getProjectList( callback ) {
        util.ajaxGet( "/getProjectList", callback );
    }

    function getUnsolvedErr( projectName, callback ) {
        util.ajaxGet( "/getUnsolvedErr?project=" + projectName, callback );
    }

    // 得到一个项目在今天每小时错误出现的次数
    function getUnsolvedErrCountInTodayByHours( projectName, callback ) {
        util.ajaxGet( "/getUnsolvedErrCountInTodayByHours?project=" + projectName, callback );
    }

    function getTheUnsolvedErrCountInTodayByHours( projectName, errName, callback ) {
        util.ajaxGet( "/getTheUnsolvedErrCountInTodayByHours?project=" + projectName + "&err=" + errName, callback );
    }

    // 删除一个项目
    function deleteOneProject( projectName, callback ) {
        util.ajaxGet()
    }


    window.inv = {
        getProjectList : getProjectList,
        getUnsolvedErr : getUnsolvedErr,
        getUnsolvedErrCountInTodayByHours : getUnsolvedErrCountInTodayByHours,
        getTheUnsolvedErrCountInTodayByHours : getTheUnsolvedErrCountInTodayByHours
    }


})();