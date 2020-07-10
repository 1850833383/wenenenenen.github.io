var CanvasParticle = (function(){
	//查找标签名
	function getElementByTag(name){
		return document.getElementsByTagName(name);
	}
	//查找id
	function getELementById(id){
		return document.getElementById(id);
	}
	// 根据传入的config初始化画布
	function canvasInit(canvasConfig){
		canvasConfig = canvasConfig || {};
		var html = getElementByTag("html")[0];
		// 获取body作为背景
		// var body = getElementByTag("body")[0];

		// 获取特定div作为背景
		// mydiv是你想要将其作为背景的div的ID
		var body = document.getElementById("mydiv");
		var canvasObj = document.createElement("canvas");
		var canvas = {
			element: canvasObj,
			points : [],
			// 默认配置
			config: {
				vx: canvasConfig.vx || 4,
				vy:  canvasConfig.vy || 4,
				height: canvasConfig.height || 2,
				width: canvasConfig.width || 2,
				count: canvasConfig.count || 100,
				color: canvasConfig.color || "121, 162, 185",
				stroke: canvasConfig.stroke || "130,255,255",
//				color: canvasConfig.color || "254,39,46",
//				stroke: canvasConfig.stroke || "130,255,255",
				dist: canvasConfig.dist || 6000,
				e_dist: canvasConfig.e_dist || 20000,
				max_conn: 10
			}
		};
		// 获取context
		if(canvas.element.getContext("2d")){
			canvas.context = canvas.element.getContext("2d");
		}else{
			return null;
		}
		body.style.padding = "0";
		body.style.margin = "0";
		// body.replaceChild(canvas.element, canvasDiv);
		body.appendChild(canvas.element);
		canvas.element.style = "position: fixed; top: 0; left: 0; z-index: -1;";
		canvasSize(canvas.element);
		window.onresize = function(){
			canvasSize(canvas.element);
		}
		body.onmousemove = function(e){
			var event = e || window.event;
			canvas.mouse = {
				x: event.clientX,
				y: event.clientY
			}
		}
		document.onmouseleave = function(){
			canvas.mouse = undefined;
		}
		setInterval(function(){
			drawPoint(canvas);
		}, 40);
	}
	// 设置canvas大小
	function canvasSize(canvas){
		// 获取窗口的宽高
		// canvas.width = window.innerWeight || document.documentElement.clientWidth || document.body.clientWidth;
		// canvas.height = window.innerWeight || document.documentElement.clientHeight || document.body.clientHeight;

		// 获取特定div的宽高
		var width = document.getElementById("mydiv").style.width;
		var height = document.getElementById("mydiv").style.height;
		width = parseInt(width);
		height = parseInt(height);
		canvas.width = width || window.innerWeight || document.documentElement.clientWidth || document.body.clientWidth;
		canvas.height = height || window.innerWeight || document.documentElement.clientHeight || document.body.clientHeight;
	}
	// 画点
	function drawPoint(canvas){
		var context = canvas.context,point,dist;
		context.clearRect(0, 0, canvas.element.width, canvas.element.height);
		context.beginPath();
		context.fillStyle = "rgb("+ canvas.config.color +")";
		for(var i = 0, len = canvas.config.count; i < len; i++){
			if(canvas.points.length != canvas.config.count){
				// 初始化所有点
				point = {
					x: Math.floor(Math.random() * canvas.element.width),
					y: Math.floor(Math.random() * canvas.element.height),
					vx: canvas.config.vx / 2 - Math.random() * canvas.config.vx,
					vy: canvas.config.vy / 2 - Math.random() * canvas.config.vy
				}
			}else{
				// 处理球的速度和位置，并且做边界处理
				point =	borderPoint(canvas.points[i], canvas);
			}
			context.fillRect(point.x - canvas.config.width / 2, point.y - canvas.config.height / 2, canvas.config.width, canvas.config.height);
			
//			var xx = point.x - canvas.config.width / 2;
//			var yy = point.y - canvas.config.height / 2;
//			var zz = canvas.config.width;
//			var mm = canvas.config.height;
//			var oo = xx + zz/2;
//			var pp = yy + mm/2;
//			context.arc(oo,pp,2,0,2*Math.PI,false);			
			
			canvas.points[i] = point;
		}
//		context.stroke();
		drawLine(context, canvas, canvas.mouse);
		context.closePath();
	}
	// 边界处理
	function borderPoint(point, canvas){
		var p = point;
		if(point.x <= 0 || point.x >= canvas.element.width){
			p.vx = -p.vx;
			p.x += p.vx;
		}else if(point.y <= 0 || point.y >= canvas.element.height){
			p.vy = -p.vy;
			p.y += p.vy;
		}else{
			p = {
				x: p.x + p.vx,
				y: p.y + p.vy,
				vx: p.vx,
				vy: p.vy
			}
		}
		return p;
	}
	// 画线
	function drawLine(context, canvas, mouse){
		context = context || canvas.context;
		for(var i = 0, len = canvas.config.count; i < len; i++){
			// 初始化最大连接数
			canvas.points[i].max_conn = 0;
			// point to point
			for(var j = 0; j < len; j++){
				if(i != j){
					dist = Math.round(canvas.points[i].x - canvas.points[j].x) * Math.round(canvas.points[i].x - canvas.points[j].x) + 
						   Math.round(canvas.points[i].y - canvas.points[j].y) * Math.round(canvas.points[i].y - canvas.points[j].y);
					// 两点距离小于吸附距离，而且小于最大连接数，则画线
					if(dist <= canvas.config.dist && canvas.points[i].max_conn <canvas.config.max_conn){
						canvas.points[i].max_conn++;
						// 线条样式
						context.lineWidth = 0.4 - dist / canvas.config.dist;//随着距离增加，线条变细
						context.strokeStyle = "rgba("+ canvas.config.stroke + ","+ (0.6 - dist / canvas.config.dist) +")"
						context.beginPath();
						context.moveTo(canvas.points[i].x, canvas.points[i].y);
						context.lineTo(canvas.points[j].x, canvas.points[j].y);
						context.stroke();
					}
				}
			}
			// 鼠标进入画布
			// point to mouse
			if(mouse){
				if(canvasHover){
					dist = Math.round(canvas.points[i].x - mouse.x) * Math.round(canvas.points[i].x - mouse.x) + 
						   Math.round(canvas.points[i].y - mouse.y) * Math.round(canvas.points[i].y - mouse.y);
					// 遇到鼠标吸附距离时加速，直接改变point的x，y值达到加速效果
					if(dist > canvas.config.dist && dist <= canvas.config.e_dist){
						canvas.points[i].x = canvas.points[i].x + (mouse.x - canvas.points[i].x) / 20;
						canvas.points[i].y = canvas.points[i].y + (mouse.y - canvas.points[i].y) / 20;
					}
					if(dist <= canvas.config.e_dist){
						context.lineWidth = 0.6;//鼠标吸附线宽
						//鼠标吸附线颜色及透明度
						context.strokeStyle = "rgba("+ canvas.config.stroke + ","+ (0.6 - dist / canvas.config.e_dist) +")";
						context.beginPath();
						context.moveTo(canvas.points[i].x, canvas.points[i].y);
						context.lineTo(mouse.x, mouse.y);
						context.stroke();
					}
				}
			}
		}
	}
	return canvasInit;
})();
var canvasHover = true;
	//配置
    var config = {
        vx: 4,	//小球x轴速度,正为右，负为左
        vy: 4,	//小球y轴速度
        height: 1,	//小球高宽，其实为正方形，所以不宜太大
        width: 1,
        count: 300,		//点个数
//        color: "121, 162, 185", 	//点颜色
//        stroke: "130,255,255", 		//线条颜色
        color: "191, 224, 247", 	//点颜色
        stroke: "196,252,252", 		//线条颜色
        dist: 6000, 	//点吸附距离
        e_dist: 20000, 	//鼠标吸附加速距离
        max_conn: 10 	//点到点最大连接数
    };
    //调用
	CanvasParticle(config);


	document.addEventListener("DOMContentLoaded", function(){
		let rise = function(trigEl) {
				trigEl.blur();
	
				let ul = document.querySelector("ul");
	
				ul.classList.add("rise");
				trigEl.classList.add("pop");
	
				setTimeout(function(){
					trigEl.focus();
	
					ul.classList.remove("rise");
					trigEl.classList.remove("pop");
				}, 1000);
			};
	
		this.querySelectorAll("li a").forEach(function(el){
			let rt = document.querySelector(":root"),
				di = +el.getAttribute("data-item");
	
			el.addEventListener("blur",function(){
				//var getRt = +window.getComputedStyle(el).getPropertyValue('--rotateTimes');
				//console.log(getRt);
				//this.classList.add("current");
			});
			el.addEventListener("focus",function(){
				rt.style.setProperty("--rotateTimes",di);
				//this.classList.remove("current");
			});
			el.addEventListener("dblclick",function(){
				rise(this);
			});
			el.addEventListener("keyup",function(e){
				if (e.keyCode === 13) {
					rise(this);
				}
			});
		});
	});