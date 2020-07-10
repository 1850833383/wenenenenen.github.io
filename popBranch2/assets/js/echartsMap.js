var dom = document.getElementById("echartsMap");
var myChart = echarts.init(dom);
var app = {};
option = null;
myChart.showLoading();
//疫情数据
$.get('https://lab.isaaclin.cn/nCoV/api/area?latest=1&province=北京市',function(yqjson){
    if(yqjson.success){
        let properties = yqjson.results[0].cities;
        //北京geojson
        $.get('assets/json/beijing.json',function(bjgeojson){
            myChart.hideLoading();

            echarts.registerMap('BJ', bjgeojson, {
                // '门头沟区': {
                //     left: -110,
                //     top: 28,
                //     width: 5
                // }
            });

            var option = {
                title: {
                    text: '北京实时疫情地图',
                    subtext: '数据来源为丁香园，开放给所有有需要的人',
                    sublink: 'https://lab.isaaclin.cn/nCoV'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{b}<br/><font color="red">{c}</font> (人)'
                },
                /*toolbox: {
                    show: true,
                    orient: 'vertical',
                    left: 'right',
                    top: 'center',
                    feature: {
                        dataView: {readOnly: false},
                        restore: {},
                        saveAsImage: {}
                    }
                },*/
                visualMap: {
                    min: 0,
                    max: 500,
                    text: ['高风险', '低风险'],
                    realtime: false,
                    calculable: true,
                    inRange: {
                        color: ['#ffffff', '#ff9985', '#e64546']
                    }
                },
                series: [
                    {
                        name: '北京疫情',
                        type: 'map',
                        mapType: 'BJ', // 自定义扩展图表类型
                        label: {
                            show: true
                        },
                        data: [
                            {name: '东城区', value: 10},
                            {name: '西城区', value: 11},
                            {name: '朝阳区', value: 100},
                            {name: '丰台区', value: 250},
                            {name: '石景山区', value: 30},
                            {name: '海淀区', value: 89},
                            {name: '门头沟区', value: 75},
                            {name: '房山区', value: 54},
                            {name: '通州区', value: 125},
                            {name: '顺义区', value: 24},
                            {name: '昌平区', value: 78},
                            {name: '大兴区', value: 153},
                            {name: '怀柔区', value: 102},
                            {name: '平谷区', value: 53},
                            {name: '密云区', value: 95},
                            {name: '延庆区', value: 42}
                        ]
                    }
                ]
            };
        
            myChart.setOption(option);
        });
    }
});
if (option && typeof option === "object") {
    myChart.setOption(option, true);
}

//同步获取数据
function getJson(url) {
    return new Promise(function(resolve, reject) {
        $.get(url, (response) => {
            resolve(response);
        });
    });
}