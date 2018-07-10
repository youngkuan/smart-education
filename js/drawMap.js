var ip = "http://202.117.54.42:8082";

var category = "";
var nodename = "";
var svg2;
var layer = 1; // 当前的层级
var graph; // 课程的图数据
var categories = []; // 社团的类别
var showNodeSymbolSize = 0; // 展示的标签的节点大小


//初始化界面
function init() {
    $(document).ready(function () {

        // 获取页面的第一颗默认主题分面树
        $.ajax({
            type: "POST",
            // old api
            // url:  ip + "/AssembleAPI/getTreeByDomain?ClassName=" + domainName,
            // new api:
            url: ip + "/topic/getFirstTopicByDomainName?domainName=" + domainName,
            data: {},
            async: false,
            dataType: "json",
            success: function (response) {
                $("#learningstatus").on('shown.bs.modal', function () {
                    data = response["data"];
                    d3.selectAll("svg").remove();
                    svg2 = d3.select("div#mysvg2")
                        .append("svg")
                        .attr("width", "100%")
                        .attr("height", "100%");
                    //分面树根的位置   
                    var root_x = $("#mysvg2").width() / 2;
                    var root_y = $("#mysvg2").height() * 7 / 8; //
                    var seed4 = {
                        x: root_x,
                        y: root_y,
                        name: data.topicName
                    };
                    var tree4 = buildTree(data, seed4, 0.8);
                    draw_tree(tree4, seed4, svg2, 0.8);
                    /*****************************************************/
                    //对分面树进行缩放
                    multiple = 1;
                    $("div#mydiv1").bind('mousewheel', function (evt) {
                        var temp = multiple;//判断是保持0.25或者1.25不变
                        if (0.3 < multiple && multiple < 1) {
                            multiple += evt.originalEvent.wheelDelta / 5000;
                        } else if (multiple < 0.3) {
                            if (evt.originalEvent.wheelDelta > 0) {
                                multiple += evt.originalEvent.wheelDelta / 5000;
                            }
                        } else {
                            if (evt.originalEvent.wheelDelta < 0) {
                                multiple += evt.originalEvent.wheelDelta / 5000;
                            }
                        }
                        //if(multiple<0.25){return;}
                        d3.selectAll("svg").remove(); //删除之前的svg
                        svg = d3.select("div#mysvg2")
                            .append("svg")
                            .attr("width", "100%")
                            .attr("height", "100%");
                        var seed0 = { x: root_x, y: root_y, name: data.data.topicName };
                        var tree0 = buildTree(data, seed0, multiple);
                        draw_tree(tree0, seed0, svg, multiple);
                    });
                });

                /*****************************************************/
            }
        });

        // 获取主题的状态信息：后期由田老师组提供
        // $.ajax({
        //     type :"GET",
        //     url :ip + "/DomainTopicAPI/getDomainTopicForWangyuanTest?ClassName=" + domainName,
        //     datatype :"json",
        //     async:false,
        //     success : function(data, status){
        //         topics = data;
        //     }
        // });

        // api获取图数据
        var xml;
        $.ajax({
            type: "POST",
            // old api
            // url :ip + "/DependencyAPI/getGexfByClassName?ClassName=" + domainName,
            // new api
            url: ip + "/dependency/getDependenciesByDomainNameSaveAsGexf?domainName=" + domainName,
            datatype: "json",
            async: false,
            success: function (data, status) {
                xml = data.data;
                // console.log(xml);
            }
        });

        //画力关系图
        var dom = document.getElementById("echarts1");
        var myChart = echarts.init(dom);

        $("#learningstatus").on('shown.bs.modal', function () {
            myChart.resize();
        })

        var option = null;
        graph = echarts.dataTool.gexf.parse(xml);
        var studied = 0;
        var studying = 0;
        var studysoon = 0;
        // 获取社团数量
        if (graph == null || states == null) {
            console.log("没有认知路径");
        } else {
            categories[2] = { name: '已学习' };
            categories[1] = { name: '正在学习' };
            categories[0] = { name: '未学习' };
            // 设置节点格式
            graph.nodes.forEach(function (node) {
                node.itemStyle = null;
                node.value = node.symbolSize;
                node.symbol = "path://M537.804,174.688c0-44.772-33.976-81.597-77.552-86.12c-12.23-32.981-43.882-56.534-81.128-56.534   c-16.304,0-31.499,4.59-44.514,12.422C319.808,17.949,291.513,0,258.991,0c-43.117,0-78.776,31.556-85.393,72.809   c-3.519-0.43-7.076-0.727-10.71-0.727c-47.822,0-86.598,38.767-86.598,86.598c0,2.343,0.172,4.638,0.354,6.933   c-24.25,15.348-40.392,42.333-40.392,73.153c0,27.244,12.604,51.513,32.273,67.387c-0.086,1.559-0.239,3.107-0.239,4.686   c0,47.822,38.767,86.598,86.598,86.598c14.334,0,27.817-3.538,39.723-9.696c16.495,11.848,40.115,26.67,51.551,23.715   c0,0,4.255,65.905,3.337,82.64c-1.75,31.843-11.303,67.291-18.025,95.979h104.117c0,0-15.348-63.954-16.018-85.307   c-0.669-21.354,6.675-60.675,6.675-60.675l36.118-37.36c13.903,9.505,30.695,14.908,48.807,14.908   c44.771,0,81.597-34.062,86.12-77.639c32.98-12.23,56.533-43.968,56.533-81.214c0-21.994-8.262-41.999-21.765-57.279   C535.71,195.926,537.804,185.561,537.804,174.688z M214.611,373.444c6.942-6.627,12.766-14.372,17.212-22.969l17.002,35.62   C248.816,386.096,239.569,390.179,214.611,373.444z M278.183,395.438c-8.798,1.597-23.782-25.494-34.416-47.517   c11.791,6.015,25.102,9.477,39.254,9.477c3.634,0,7.201-0.296,10.72-0.736C291.006,374.286,286.187,393.975,278.183,395.438z    M315.563,412.775c-20.35,5.651-8.167-36.501-2.334-60.904c4.218-1.568,8.301-3.413,12.183-5.604   c2.343,17.786,10.069,33.832,21.516,46.521C337.011,401.597,325.593,409.992,315.563,412.775z";
                node.symbolOffset = [0, '-100%'];
                node.label = {
                    normal: {
                        show: node.symbolSize > showNodeSymbolSize
                    }
                };
                // console.log(index);
                // node.category = Number(states[index]);
                //console.log(states);
                if(node.id == "(Start)数据结构"){
                    node.category = 2;
                    return;
                }else{
                    topics.forEach(function(topic,index){
                        if(topic["topicName"] == node.id ){
                            node.category = Number(states[index]);
                            return;
                        }
                    });
                }

                //console.log(node.category);
                // node.category = states[getTopicIdByTopicName(topics,node.id)];
                // console.log(topics);
                switch (node.category) {
                    case 2:
                        studied++;
                        break;
                    case 1:
                        studying++;
                        break;
                    case 0:
                        studysoon++;
                        break;
                }
                // console.log(node);
            });
            graph.links.forEach(function (link) {

            });
            option = {
                title: {
                    text: domainName,  // 课程名
                    subtext: 'Default layout',
                    top: 'bottom',
                    left: 'right'
                },
                tooltip: {},
                legend: [{
                    data: categories.map(function (a) {
                        return a.name;
                    })
                }],
                animationDuration: 1500,
                animationEasingUpdate: 'quinticInOut',
                // 绿色、猩红色、黑色（红绿灯版本）
                color: ['#848484', '#DC143C', '#008000'],
                // 绿色、金色、深灰色 （地铁版本）
                // color:['#008000','#FFD700','#A9A9A9'],
                series: [{
                    name: domainName,
                    type: 'graph',
                    layout: 'none',
                    data: graph.nodes,
                    links: graph.links,
                    edgeSymbol: ['circle', 'arrow'],
                    edgeSymbolSize: [4, 10],
                    categories: categories,
                    roam: true,
                    // focusNodeAdjacency: true,
                    label: {
                        normal: {
                            position: 'right',
                            formatter: '{b}'
                        }
                    },
                    lineStyle: {
                        normal: {
                            curveness: 0.25,
                            color: 'source',
                            width: 3,
                        }
                    }
                }, {
                    data: [
                        { name: '已学习', value: studied },
                        { name: '正在学习', value: studying },
                        { name: '未学习', value: studysoon }
                    ],
                    color: ['#008000', '#DC143C', '#848484'],
                    name: '学习进度',
                    type: 'pie',
                    center: ['15%', '80%'],
                    radius: '25%',
                    z: 100
                }]
            };
            myChart.setOption(option);
            // 点击节点跳转到社团结构
            myChart.on('click', function (params) {
                if (params.dataType == 'node') {
                    // console.log(params);
                    $.ajax({
                        type: "POST",
                        // url: ip+"/AssembleAPI/getTreeByTopicForFragment",
                        url: ip + "/topic/getCompleteTopicByNameAndDomainNameWithHasFragment",
                        data: $.param({
                            domainName: domainName,
                            topicName: params.name,
                            hasFragment: true
                        }),
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },

                        success: function (response) {
                            $("#learningstatus").on('shown.bs.modal', function () {
                                data = response["data"];
                                d3.selectAll("svg").remove();
                                svg2 = d3.select("div#mysvg2")
                                    .append("svg")
                                    .attr("width", "100%")
                                    .attr("height", "100%");
                                //分面树根的位置   
                                var root_x = $("#mysvg2").width() / 2;
                                var root_y = $("#mysvg2").height() * 7 / 8; //
                                var seed4 = {
                                    x: root_x,
                                    y: root_y,
                                    name: data.topicName
                                };
                                var tree4 = buildTree(data, seed4, 0.8);
                                draw_tree(tree4, seed4, svg2, 0.8);
                                /*****************************************************/
                                //对分面树进行缩放
                                multiple = 1;
                                $("div#mydiv1").bind('mousewheel', function (evt) {
                                    var temp = multiple;//判断是保持0.25或者1.25不变
                                    if (0.3 < multiple && multiple < 1) {
                                        multiple += evt.originalEvent.wheelDelta / 5000;
                                    } else if (multiple < 0.3) {
                                        if (evt.originalEvent.wheelDelta > 0) {
                                            multiple += evt.originalEvent.wheelDelta / 5000;
                                        }
                                    } else {
                                        if (evt.originalEvent.wheelDelta < 0) {
                                            multiple += evt.originalEvent.wheelDelta / 5000;
                                        }
                                    }
                                    //if(multiple<0.25){return;}
                                    d3.selectAll("svg").remove(); //删除之前的svg
                                    svg = d3.select("div#mysvg2")
                                        .append("svg")
                                        .attr("width", "100%")
                                        .attr("height", "100%");
                                    var seed0 = { x: root_x, y: root_y, name: data.name };
                                    var tree0 = buildTree(data, seed0, multiple);
                                    draw_tree(tree0, seed0, svg, multiple);
                                });
                            })
                            data = response["data"];
                            d3.selectAll("svg").remove();
                            svg2 = d3.select("div#mysvg2")
                                .append("svg")
                                .attr("width", "100%")
                                .attr("height", "100%");
                            //分面树根的位置   
                            var root_x = $("#mysvg2").width() / 2;
                            var root_y = $("#mysvg2").height() * 7 / 8; //
                            var seed4 = {
                                x: root_x,
                                y: root_y,
                                name: data.topicName
                            };
                            var tree4 = buildTree(data, seed4, 0.8);
                            draw_tree(tree4, seed4, svg2, 0.8);
                            /*****************************************************/
                            //对分面树进行缩放
                            multiple = 1;
                            $("div#mydiv1").bind('mousewheel', function (evt) {
                                var temp = multiple;//判断是保持0.25或者1.25不变
                                if (0.3 < multiple && multiple < 1) {
                                    multiple += evt.originalEvent.wheelDelta / 5000;
                                } else if (multiple < 0.3) {
                                    if (evt.originalEvent.wheelDelta > 0) {
                                        multiple += evt.originalEvent.wheelDelta / 5000;
                                    }
                                } else {
                                    if (evt.originalEvent.wheelDelta < 0) {
                                        multiple += evt.originalEvent.wheelDelta / 5000;
                                    }
                                }
                                //if(multiple<0.25){return;}
                                d3.selectAll("svg").remove(); //删除之前的svg
                                svg = d3.select("div#mysvg2")
                                    .append("svg")
                                    .attr("width", "100%")
                                    .attr("height", "100%");
                                var seed0 = { x: root_x, y: root_y, name: data.name };
                                var tree0 = buildTree(data, seed0, multiple);
                                draw_tree(tree0, seed0, svg, multiple);
                            });
                            /*****************************************************/
                        }
                    });
                }
            });
        }

    })
}

function getTopicIdByTopicName(topics,topicName){
    for(var i =0;i<topics.length;i++){
        if(topics[i]['topicName'] == topicName){
            return topics[i]['topicId'];
        }
    }
    return -1;
}

