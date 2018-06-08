
ip_yotta = "http://202.117.54.42:8082";
ip_gexinghua = "";
var domainName = "数据结构";
topics = [];
topicNames = "";
facets = {};
assembles = {};
topicIndex = 0;
var courseId = "";
var CourseWareName = "";
var CourseCode = "";
var studentCode = "1069800109030205";
var coursewareid = "";
var domainId = "1";
var states = [];
var learnt = 0;
var learning = 0;
var willlearn = 0;

$(document).ready(function () {
    parse_URL_params();
});



// angularjs控制
var app = angular.module('app', [
    'ui.bootstrap'
]);
app.controller('yangkuanController', function ($scope, $http, $sce) {

    /**
     * 声明主题推荐方式名
     */
    $scope.recnames = [
        "主题推荐方式一",
        "主题推荐方式二",
        "主题推荐方式三",
        "主题推荐方式四",
        "主题推荐方式五",
        "主题推荐方式六",
        "主题推荐方式七"
    ]

    $scope.domainname = domainName;

    $scope.shownname = "选择主题推荐方式";

    $scope.color = [{ "color": "#008000" }, { "color": "#DC143C" }, { "color": "#848484" }];
    $scope.backcolor = [{ "background-color": "#008000" }, { "background-color": "#DC143C" }, { "background-color": "#848484" }];

    $scope.showdropdown = false;
    /**
     * 页面加载时根据默认主题推荐方式及课程名，查询推荐主题
     */
    $http({
        method: 'GET',
        url: ip_yotta + "/topic/getTopicsByDomainName",
        params: {
            domainName: domainName,
        }
    }).then(function successCallback(response) {
        //截取前10个主题
        //   $scope.topics = response.data.data.slice(0,10);
        $scope.topics = response.data.data;
        topics = $scope.topics;
        for (var i = 0; i < topics.length - 1; i++) {
            topicNames = topicNames + topics[i]["topicName"] + ",";
        }
        topicNames = topicNames + topics[topics.length - 1]["topicName"];
        /**
       * 页面加载时根据默认课程名及主题，查询推荐主题列表下所有分面
       */
        $scope.getFacetsByDomainNameAndTopicNames(domainName, topicNames);
        /**
       * 页面加载时根据课程名及默认推荐主题列表，查询该主题下所有碎片
       */
        $scope.getAssemblesByDomainNameAndTopicNames(domainName, topicNames);
        $scope.isCollapsed = true;
        $scope.isCollapsedchildren = true;
    }, function errorCallback(response) {
        // 请求失败执行代码
    });

    //get states
    $http({
        url: ip_yotta + "/state/getByDomainIdAndUserId",
        method: 'get',
        params: {
            domainId: domainId,
            userId: studentCode
        }
    }).success(function (response) {
        $scope.states = response.data.states.split(',');
        states = $scope.states;
    }).error(function (response) {

    });


    /**
     * 重新选择主题推荐方式时，查询该课程及推荐方式下的推荐主题列表
     */
    $scope.getTopicNamesByRecommendedWayAndDomainName = function (recommendedWay, domainName) {
        $http({
            url: ip_gexinghua + "/getTopicNamesByRecommendedWayAndDomainName",
            method: 'get',
            params: {
                recommendedWay: recommendedWay,
                domainName: domainName
            }
        }).success(function (response) {
            response = response["data"];
            $scope.topics = response;
            topics = $scope.topics;
        }).error(function (response) {
            console.log('获取主题出错...');
        });
    }

    /**
    * 重新选择主题推荐方式时，查询该课程及推荐主题列表下的分面列表
    */
    $scope.getFacetsByDomainNameAndTopicNames = function (domainName, topicNames) {
        $http({
            url: ip_yotta + "/facet/getFacetsByDomainNameAndTopicNames",
            method: 'get',
            params: {
                domainName: domainName,
                topicNames: topicNames
            }
        }).success(function (response) {
            response = response["data"];
            facets = response;
            $scope.facets = facets[topics[0]["topicName"]];
        }).error(function (response) {
            console.log('获取分面出错...');
        });
    }


    /**
     * 重新选择主题推荐方式时，查询推荐主题列表下所有碎片
     */
    $scope.getAssemblesByDomainNameAndTopicNames = function (domainName, topicNames) {

        $http({
            url: ip_yotta + "/assemble/getAssemblesByDomainNameAndTopicNames",
            method: 'get',
            params: {
                domainName: domainName,
                topicNames: topicNames
            }
        }).success(function (response) {
            response = response["data"];
            assembles = response;

            $scope.assembles = [];
            $scope.assembles = assembles[topics[0]["topicName"]];
            $scope.assembleNumber = $scope.assembles.length;
            /*assembleContent
            assembleText
            assembleScratchTime
            topicName
            facetName
            domainName
            sourceName*/
        }).error(function (response) {
            console.log('获取主题出错...');
        });
    }

    /**
     * 点击某一推荐主题，查询分面
     */
    $scope.getFacetsByTopicName = function (topicName) {
        $scope.facets = facets[topicName];
    }

    /**
     * update facets by click
     */
    $scope.getFacetsByTopicNameThroughClick = function (topicName) {
        $scope.clickfacets = facets[topicName];
    }
    /**
     * 点击某一推荐主题，查询碎片
     */
    $scope.getAssemblesByTopicName = function (topicName) {

        $scope.assembles = assembles[topicName];
        $scope.assembleNumber = ($scope.assembles == undefined) ? 0 : $scope.assembles.length;
    }

    /**
    * 点击某一推荐一级分面，查询碎片
    */
    $scope.getAssemblesByTopicNameAndFirstLayerFacetName = function (topicName, facetName) {
        assemblesTmp = assembles[topicName];
        $scope.assembles = [];
        if (assemblesTmp == undefined) return;
        for (var i = 0; i < assemblesTmp.length; i++) {
            if (assemblesTmp[i]["firstLayerFacetName"] == facetName) {
                $scope.assembles.push(assemblesTmp[i]);
            }
        }
        $scope.assembleNumber = $scope.assembles.length;
    }

    /**
   * 点击某一推荐二级分面，查询碎片
   */
    $scope.getAssemblesByTopicNameAndsecondLayerFacetName = function (topicName, facetName) {
        assemblesTmp = assembles[topicName];
        $scope.assembles = [];
        if (assemblesTmp == undefined) return;
        for (var i = 0; i < assemblesTmp.length; i++) {
            if (assemblesTmp[i]["secondLayerFacetName"] == facetName) {
                $scope.assembles.push(assemblesTmp[i]);
            }
        }
        $scope.assembleNumber = $scope.assembles.length;
    }

    /**
     * 点击某一主题推荐方式
     */
    $scope.updateRecname = function (recname) {
        $scope.shownname = recname;
    }

    /**
     * @param {当前所在页面} pageKind 
     * @param {主题名} topicName
     * @param {主题id} topicId
     */
    $scope.post_log_of_mouseover_topic = function (pageKind, topicName, topicId) {
        var actionType = "点击-主题";
        post_log_of_action(studentCode, pageKind, actionType,
            courseId, domainName, topicName, topicId,
            null, null, null, null,
            null, null, null, null);

    }

    /**
     * 
     * @param {当前所在页面} pageKind 
     * @param {行为分类} actionType 
     * @param topicName 主题名字
     * @param topicId 主题id
     * @param facetNameLevel1Name 1级分面名字
     * @param facetNameLevel1Id 1级分面id
     * @param facetNameLevel2Name 2级分面名字
     * @param facetNameLevel2Id 2级分面id
     */
    $scope.post_log_of_mouseclick_facet = function (pageKind, actionType, topicName, topicId
        , facetNameLevel1Name, facetNameLevel1Id, facetNameLevel2Name, facetNameLevel2Id) {
        post_log_of_action(studentCode, pageKind, actionType,
            courseId, domainName, topicName, topicId,
            facetNameLevel1Name, facetNameLevel1Id, facetNameLevel2Name, facetNameLevel2Id,
            null, null, null, null);
    }

    /**
     * 
     * @param {当前所在页面} pageKind 
     * @param topicName 主题名字
     * @param topicId 主题id
     * @param facetNameLevel1Name 1级分面名字
     * @param facetNameLevel1Id 1级分面id
     * @param facetNameLevel2Name 2级分面名字
     * @param facetNameLevel2Id 2级分面id
     * @param {碎片id} fragmentId 
     */
    $scope.post_log_of_mouseclick_assemble = function (pageKind, topicName, topicId
        , facetNameLevel1Name, facetNameLevel1Id, facetNameLevel2Name, facetNameLevel2Id
        , fragmentId) {
        var actionType = "点击-碎片";
        post_log_of_action(studentCode, pageKind, actionType,
            courseId, domainName, topicName, topicId,
            facetNameLevel1Name, facetNameLevel1Id, facetNameLevel2Name, facetNameLevel2Id,
            fragmentId, null, null, null);
    }

    $scope.post_log_of_mouseclick_URL = function (pageKind, jumpTargetType, jumpTargetUrl) {
        var actionType = "跳转";
        post_log_of_action(studentCode, pageKind, actionType,
            courseId, domainName, null, null,
            null, null, null, null,
            null, jumpTargetType, jumpTargetUrl, null);
    }
    /**
     * 推荐路径
     */
    $scope.post_log_of_mouseclick_recommendation = function (pageKind, recommendationMethod) {
        var actionType = "点击推荐路径类型";
        post_log_of_action(studentCode, pageKind, actionType,
            courseId, domainName, null, null,
            null, null, null, null,
            null, null, null, recommendationMethod);
    }

    /**
     * 点击鸟瞰图
     */
    $scope.post_log_of_mouseclick_Global_Graph = function (pageKind) {
        var actionType = "点击鸟瞰图";
        post_log_of_action(studentCode, pageKind, actionType,
            courseId, domainName, null, null,
            null, null, null, null,
            null, null, null, null);
    }


    //angular end
});


//获取地址栏里（URL）传递的课程名参数  
function parse_URL_params() {
    //url例子：http://yotta.xjtushilei.com:888/Yotta/module/construct/pages/kg_wangyuan/index.html?
    // courseid=16
    // &CourseWareName=%E7%BC%96%E8%AF%91%E5%8E%9F%E7%90%86(yotta)
    // &CourseCode=JS008
    // &studentcode=1069800109030205
    // &coursewareid=2681
    var url = decodeURI(location.search); //?className=数据结构;
    if (url.indexOf("?") != -1) {//url中存在问号，也就说有参数。 
        var str = url.substr(1);  //得到?后面的字符串
        var args = str.split("&");
        courseId = args[0].split("=")[1];
        CourseWareName = args[1].split("=")[1];
        CourseCode = args[2].split("=")[1];
        studentCode = args[3].split("=")[1];
        coursewareid = args[4].split("=")[1];

        $.ajax({
            type: "GET",
            url: ip + "/wangyuan/getDomainByCourseId?courseId=" + courseId,
            data: {},
            async: false,
            dataType: "json",
            success: function (response) {
                domainId = response.data.wiki.domainId;
                domainName = response.data.wiki.domainName;
                $.ajax({
                    type: "GET",
                    url: ip + "/state/getByDomainIdAndUserId?domainId=" + domainId + "&userId=" + studentCode,
                    data: {},
                    async: false,
                    dataType: "json",
                    success: function (response) {
                        states = response.data.states.split(',');
                        init();
                        for (var i = 0; i < states.length; i++) {
                            switch (states[i]) {
                                case '0':
                                    learnt++;
                                    break;
                                case '1':
                                    learning++;
                                    break;
                                case '2':
                                    willlearn++;
                                    break;
                            }
                        }
                        $('#learnt').html(learnt.toString());
                        $('#learning').html(learning.toString());
                        $('#willlearn').html(willlearn.toString());
                        $('#sumtopic').html(states.length.toString())
                    }
                });
            }
        });
    }
}


