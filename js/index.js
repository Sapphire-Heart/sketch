var sketch=angular.module("sketch",[]);
sketch.controller('sketchController', ['$scope', function($scope){
	$scope.canvasWH={width:1000,height:560};
	$scope.csState={strokeStyle:"#00000",fillStyle:"#00000",lineWidth:1,style:"stroke"};
	$scope.tool="line";
	$scope.setStyle=function(s){
		$scope.csState.style=s;
	}
	$scope.newSketch=function(){
    	if(previous){
    		if(confirm("是否保存")){
                location.href=canvas.toDataURL();
    		}
    	}
    	clearCanvas();
    	previous=null;
    }
    $scope.save=function(ev){
    	if(previous){
    		ev.srcElement.href=canvas.toDataURL();
    	   	ev.srcElement.download="mypic.png";
    	}else{
    		alert('空画布');
    	}
    }
    $scope.xiankuan=[1,3,5,7,9,11,13,15];
	$scope.tools={"直线":"line", "圆":"arc", "矩形":"rect", "橡皮":"erase", "铅笔":"pen"};
	// $scope.iconfont={"画线":"&#xe604;","画线":"&#xe604;","画线":"&#xe604;","画线":"&#xe604;"};
	$scope.settool=function(tool){
		$scope.tool=tool;
	}
	var canvas=document.querySelector("#canvas");
	var ctx=canvas.getContext("2d");
	//清除画布
	var clearCanvas=function(){
		ctx.clearRect(0,0,$scope.canvasWH.width,$scope.canvasWH.height);
	}
	var previous;
	var setmousemove={
		// 画线
		line:function(e){
			canvas.onmousemove=function(ev){
				clearCanvas();
				if(previous){
					ctx.putImageData(previous,0,0)
				}
				ctx.beginPath();
				ctx.moveTo(e.offsetX,e.offsetY);
				ctx.lineTo(ev.offsetX,ev.offsetY);
				ctx.stroke();
			}
		},
		// 画圆
		arc:function(e){
			canvas.onmousemove=function(ev){
				clearCanvas();
				if(previous){
					ctx.putImageData(previous,0,0)
				}
				ctx.beginPath();
				var r=Math.abs(ev.offsetX-e.offsetX);
				ctx.arc(e.offsetX,e.offsetY,r,0,Math.PI*2);
				if($scope.csState.style=="fill"){
					ctx.fill();
				}else{
					ctx.stroke();
				}
			}
		},
		// 画矩形
		rect:function(e){
			canvas.onmousemove=function(ev){
				clearCanvas();
				if(previous){
					ctx.putImageData(previous,0,0)
				}
				ctx.beginPath();
				var w=ev.offsetX-e.offsetX;
				var h=ev.offsetY-e.offsetY;
				ctx.strokeRect(e.offsetX,e.offsetY,w,h)
				if($scope.csState.style=="fill"){
					ctx.fillRect(e.offsetX-0.5,e.offsetY-0.5,w,h);
				}else{
					ctx.strokeRect(e.offsetX-0.5,e.offsetY-0.5,w,h);
				}
			}
		},
		//铅笔
		pen:function(e){
			ctx.beginPath();
			ctx.moveTo(e.offsetX,e.offsetY);
			canvas.onmousemove=function(ev){
				ctx.lineTo(ev.offsetX,ev.offsetY);
				ctx.stroke();
			}
		},
		//橡皮
		erase:function(e){
			canvas.onmousemove=function(ev){
				ctx.clearRect(ev.offsetX,ev.offsetY,40,40);
			}
		}
	}
	// $scope.setmousemove="rect";
	canvas.onmousedown=function(e){
		setmousemove[$scope.tool](e);
		ctx.fillStyle=$scope.csState.fillStyle;
		ctx.strokeStyle=$scope.csState.strokeStyle;
		ctx.lineWidth=$scope.csState.lineWidth;
		document.onmouseup=function(){
			canvas.onmousemove=null;
			canvas.onmouseup=null;
			previous=ctx.getImageData(0,0,$scope.canvasWH.width,$scope.canvasWH.height);
		}
	}
}])