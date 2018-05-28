
ip_yotta = "http://202.117.54.42:8080/yotta";
ip_gexinghua = "";
domainName = "数据结构";
topics = [];
topicNames = "";
facets = {};
assembles = {};
topicIndex = 0;


// angularjs控制
var app=angular.module('app',[
    'ui.bootstrap'
]);
app.controller('yangkuanController', function($scope, $http, $sce) {

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
    $scope.shownname = "选择主题推荐方式";
    /**
     * 页面加载时根据默认主题推荐方式及课程名，查询推荐主题
     */
    $http({
        method: 'GET',
        url: "http://202.117.54.42:8080/yotta/topic/getTopicsByDomainName?domainName=数据结构"
      }).then(function successCallback(response) {
          $scope.topics = response.data.data;
          topics = $scope.topics;
          for(var i=0;i<topics.length-1;i++){
            topicNames = topicNames + topics[i]["topicName"] + ",";
          }
          topicNames = topicNames + topics[topics.length-1]["topicName"];
          /**
         * 页面加载时根据默认课程名及主题，查询推荐主题列表下所有分面
         */
          $scope.getFacetsByDomainNameAndTopicNames(domainName,topicNames);
          /**
         * 页面加载时根据课程名及默认推荐主题列表，查询该主题下所有碎片
         */
          $scope.getAssemblesByDomainNameAndTopicNames(domainName,topicNames);
          $scope.isCollapsed = true;
          $scope.isCollapsedchildren = true;
        }, function errorCallback(response) {
          // 请求失败执行代码
      });


    /**
     * 重新选择主题推荐方式时，查询该课程及推荐方式下的推荐主题列表
     */
     $scope.getTopicNamesByRecommendedWayAndDomainName = function(recommendedWay,domainName){
        $http({
        url : ip_gexinghua + "/getTopicNamesByRecommendedWayAndDomainName",
        method : 'get',
        params:{  
            recommendedWay:recommendedWay,
            domainName:domainName
                }  
        }).success(function(response) {
            response = response["data"];
            $scope.topics = response;
            topics = $scope.topics;
        }).error(function(response){
            console.log('获取主题出错...');
        });
     }

     /**
     * 重新选择主题推荐方式时，查询该课程及推荐主题列表下的分面列表
     */
     $scope.getFacetsByDomainNameAndTopicNames = function(domainName,topicNames){
        $http({
        url : ip_yotta + "/facet/getFacetsByDomainNameAndTopicNames",
        method : 'get',
        params:{  
            domainName:domainName,
            topicNames:topicNames
                }  
        }).success(function(response) {
            response = response["data"];
            facets = response;
            $scope.facets = facets[topics[0]["topicName"]];
            console.log($scope.facets);
        }).error(function(response){
            console.log('获取分面出错...');
        });
     }


    /**
     * 重新选择主题推荐方式时，查询推荐主题列表下所有碎片
     */
    $scope.getAssemblesByDomainNameAndTopicNames = function(domainName,topicNames){
         
        $http({
            url : ip_yotta + "/assemble/getAssemblesByDomainNameAndTopicNames",
            method : 'get',
             params:{  
                domainName:domainName,
                topicNames:topicNames
                     }  
        }).success(function(response) {
            response = response["data"];
            assembles = response;
            $scope.assembles = assembles[topics[0]["topicName"]];
            $scope.assembleNumber = $scope.assembles.length;
            /*assembleContent
            assembleText
            assembleScratchTime
            topicName
            facetName
            domainName
            sourceName*/
        }).error(function(response){
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
     * 点击某一推荐主题，查询碎片
     */
     $scope.getAssemblesByTopicName = function(topicName){
        $scope.assembles = assembles[topicName];
        $scope.assembleNumber = ($scope.assembles == undefined) ? 0 : $scope.assembles.length;
     }

     /**
     * 点击某一推荐分面，查询碎片
     */
     $scope.getAssemblesByTopicNameAndFacetName = function(topicName,facetName){
        assemblesTmp = assembles[topicName];
        $scope.assembles = [];
        if(assemblesTmp == undefined) return;
        for(var i=0;i<assemblesTmp.length;i++){
            if(assemblesTmp[i]["facetName"]==facetName){
                $scope.assembles.push(assemblesTmp[i]);
            }
        }
        $scope.assembleNumber = $scope.assembles.length;
     }

     /**
      * 点击某一主题推荐方式
      */
     $scope.updateRecname = function(recname){
        $scope.shownname = recname;
     }
//angular end
});



