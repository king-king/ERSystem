/**
 * Created by WQ on 2015/5/14.
 */
(function () {

    // �õ���Ŀ�б�
    function getProjectList( callback ) {
        util.ajaxGet( "/getProjectList", callback );
    }

    // �õ�ĳ����Ŀ��δ���err
    function getUnsolvedErr( projectName, callback ) {
        util.ajaxGet( "/getUnsolvedErr?project=" + projectName, callback );
    }

    window.inv = {
        getProjectList : getProjectList,
        getUnsolvedErr : getUnsolvedErr
    }


})();