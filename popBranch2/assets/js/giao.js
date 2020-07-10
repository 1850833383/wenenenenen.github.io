(function($) {
    $('.map').click(function(){
        layer.open({
            type: 2,
            title: '北京市实时疫情地图',
            shadeClose: true,
            shade: false,
            maxmin: true, //开启最大化最小化按钮
            area: ['893px', '600px'],
            content: '../assets/page/map.html'
          });
    });
    $('.wifi').click(function(){
        $.ajax({
            url:'https://api.yonyoucloud.com/apis/dst/ncov/country',
            type:'get',
            dateType:'json',
            headers:{'authoration':'apicode','apicode':'3734c998fd7447468a75753a409f7e76'},
            success:function(data){
                console.log(data);
            },
            error:function(error){
                console.log(error);
            }
        });
    });
})(jQuery);