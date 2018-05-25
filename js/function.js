
ip_yotta = "";
ip_gexinghua = "";
topics = [];
facets = {};
assembles = {};

// angularjs控制
var app = angular.module('app', []);
app.controller('yangkuanController', function($scope, $http, $sce) {


    /**
     * 页面加载时根据默认主题推荐方式及课程名，查询推荐主题
     */
    $http({
        method: 'GET',
        url: "http://localhost:8080/yotta/topic/getTopicsByDomainName?domainName=数据结构"
      }).then(function successCallback(response) {
          $scope.topics = response.data.data;
          topics = $scope.topics;
          console.log($scope.topics);
        }, function errorCallback(response) {
          // 请求失败执行代码
      });
    /**
     * 页面加载时根据默认课程名及主题，查询推荐主题列表下所有分面
     */
    $http({
        url : ip_yotta + "/getFacetsByDomainNameAndTopicNames",
        method : 'get',
        params:{  
            domainName:$scope.NowClass,
            topicName:topics
        }  
    }).success(function(response) {
        response = response["data"];
        $scope.facets = response;
        facets = $scope.facets;
    }).error(function(response){
        console.log('获取分面出错...');
    });


    /**
     * 页面加载时根据课程名及默认推荐主题列表，查询该主题下所有碎片
     */
    $http({
            url : ip_yotta + "/getAssemblesByDomainNameAndTopicNames",
            method : 'get',
             params:{  
                domainName:domainName,
                topicNames:topics
            }  
        }).success(function(response) {
            response = response["data"];
            $scope.assembles = response;
            assembles = $scope.assembles;
            /*assembleContent
            assembleText
            assembleScratchTime
            topicName
            facetName
            domainName
            sourceName*/
        }).error(function(response){
            console.log('获取碎片出错...');
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
        url : ip_yotta + "/getFacetsByDomainNameAndTopicNames",
        method : 'get',
        params:{  
            domainName:domainName,
            topicName:topicName
                }  
        }).success(function(response) {
            response = response["data"];
            $scope.facets = response;
            facets = $scope.facets;
        }).error(function(response){
            console.log('获取分面出错...');
        });
     }


    /**
     * 重新选择主题推荐方式时，查询推荐主题列表下所有碎片
     */
    $scope.getAssemblesByDomainNameAndTopicNames = function(domainName,topicNames){
         
        $http({
            url : ip_yotta + "/getAssemblesByDomainNameAndTopicNames",
            method : 'get',
             params:{  
                domainName:domainName,
                topicNames:topicNames
                     }  
        }).success(function(response) {
            response = response["data"];
            $scope.assembles = response;
            assembles = $scope.assembles;
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
     }

     /**
     * 点击某一推荐分面，查询碎片
     */
     $scope.getAssemblesByTopicNameAndFacetName = function(topicName,facetName){
        assemblesTmp = assembles[topicName];
        $scope.assembles = [];
        for(var i=0;i<assemblesTmp.length;i++){
            if(assemblesTmp[i]["facetName"]==facetName){
                $scope.assembles.push(assemblesTmp[i]);
            }
        }
     }
//angular end
});



