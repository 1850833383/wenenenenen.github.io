mapboxgl.accessToken = 'pk.eyJ1Ijoiemhpd2VuaiIsImEiOiJjand2eGlzb2MwYWg3NDlyMXNmbGJyZGh2In0.VCR4KV-QWW2vBugH2G6cDw';
var map,style;

// var style = {
//     "version": 8,
//     "sources": {
//         "bj_geoJson": {
//             "type": "geojson",
//             "data": "https://geo.datav.aliyun.com/areas_v2/bound/110000_full.json"
//         }
//     },
//     "layers": []
// };
//疫情数据
getJson('https://lab.isaaclin.cn/nCoV/api/area?latest=1&province=北京市').then(function(yqjson){
    if(yqjson.success){
        let properties = yqjson.results[0].cities;
        //北京geojson
        getJson('assets/json/beijing.json').then(function(bjgeojson){
            let features = bjgeojson.features;
            let legendcolordom = $('.legendli1');let legendnumdom = $('.legendli2');
                    for (let p = 0; p < properties.length; p++) {
                        const city = properties[p];
                        for (let f = 0; f < features.length; f++) {
                            const feature = features[f];
                            if(city.locationId == feature.properties.adcode){
                                feature.properties.currentConfirmedCount = city.currentConfirmedCount;
                                feature.id = feature.properties.adcode;
                                    if(city.currentConfirmedCount == 0){//1<= deliverNumber && deliverNumber<= 8
                                        feature.properties.yqcolor = '#ffffff';
                                        legendcolordom.css('background-color','#ffffff');
                                        legendcolordom.html('0');
                                    }else if(0 < city.currentConfirmedCount && city.currentConfirmedCount < 10){
                                        feature.properties.yqcolor = '#ffe5db';
                                        legendcolordom.css('background-color','#ffe5db');
                                        legendcolordom.html('0-9');
                                    }else if(10 <= city.currentConfirmedCount && city.currentConfirmedCount < 50){
                                        feature.properties.yqcolor = '#ffc4b3';
                                        legendcolordom.css('background-color','#ffc4b3');
                                        legendcolordom.html('10-49');
                                    }else if(50 <= city.currentConfirmedCount && city.currentConfirmedCount < 100){
                                        feature.properties.yqcolor = '#ff9985';
                                        legendcolordom.css('background-color','#ff9985');
                                        legendcolordom.html('50-99');
                                    }else if(100 <= city.currentConfirmedCount && city.currentConfirmedCount < 1000){
                                        feature.properties.yqcolor = '#f57567';
                                        legendcolordom.css('background-color','#f57567');
                                        legendcolordom.html('100-999');
                                    }else if(1000 <= city.currentConfirmedCount){
                                        feature.properties.yqcolor = '#e64546';
                                        legendcolordom.css('background-color','#e64546');
                                        legendcolordom.html('>=1000');
                                    }
                            }else if(feature.properties.adcode == 110117){
                                feature.properties.yqcolor = '#ffffff';
                            }
                            
                        }
                    }
                    style = {
                         "version": 8,
                         "sources": {
                             "bj_geoJson": {
                                 "type": "geojson",
                                 "data": bjgeojson
                             }
                         },
                         "layers": [],
                         "glyphs": "mapbox://fonts/mapbox/{fontstack}/{range}.pbf"
                    }

                    map = new mapboxgl.Map({
                        container: 'map',
                        style: style, // stylesheet location
                        center: [116.38475021500989, 39.92216392261716], // starting position [lng, lat]
                        zoom: 5 // starting zoom
                    });

                    map.flyTo({
                        zoom: 8,
                        speed: 0.2,
                        pitch: 40
                    });
                    var hoveredStateId =  null;
                    map.once("styledata",function(){
                        map.addLayer({
                            "id": "beijing_fill",
                            "type": "fill",
                            "source": "bj_geoJson",
                            "layout": {
                        
                            },
                            'paint': {
                                'fill-color': ['get','yqcolor'],
                                "fill-opacity": ["case",
                                    ["boolean", ["feature-state", "hover"], false],
                                    1,
                                    0.4
                                ]
                            }
                        });
                        map.addLayer({
                            "id": "beijing_line",
                            "type": "line",
                            "source": "bj_geoJson",
                            "layout": {
                    
                            },
                            'paint': {
                                'line-color': 'black',
                                'line-width': 0.5
                            }
                        });
                        map.addLayer({
                            "id": "beijing_symbol",
                            "type": "symbol",
                            "source": "bj_geoJson",
                            "layout": {
                                "text-field": ['format',
                                ['downcase', ['get', 'name']], { 'font-scale': .6 }],
                            }
                        });
                    });
                    
                    var popup = new mapboxgl.Popup({
                        closeButton: false,
                        closeOnClick: false,
                        offset:[0,-10]
                    });
                
                    map.on("mousemove", "beijing_fill", function(e) {
                        if (e.features.length > 0) {
                            let geometry = e.features[0].geometry;
                            if (hoveredStateId) {
                                map.setFeatureState({source: 'bj_geoJson', id: hoveredStateId}, { hover: false});
                            }
                            hoveredStateId = e.features[0].id;
                            map.setFeatureState({source: 'bj_geoJson', id: hoveredStateId}, { hover: true});
                            var name = e.features[0].properties.name;
                            var curr = e.features[0].properties.currentConfirmedCount;
                            if(!curr){
                                curr = 0;
                            }
                            let des = '<div>'+name+'</div><div>现存确诊</div><div style="font-size:20px;color:red;">'+curr+'人</div>';
                            popup.setLngLat(e.lngLat)
                            .setHTML(des)
                            .addTo(map);
                        }
                    });
                    
                    map.on('mouseleave', "beijing_fill", function() {
                        if (hoveredStateId) {
                            map.setFeatureState({source: 'bj_geoJson', id: hoveredStateId}, { hover: false});
                        }
                        hoveredStateId =  null;

                        popup.remove();
                    });
        });
    }
});

//同步获取数据
function getJson(url) {
    return new Promise(function(resolve, reject) {
        $.get(url, (response) => {
            resolve(response);
        });
    });
}