require('normalize.css/normalize.css');
require('styles/App.css');



// import React from 'react';
var React=require('react');
import ReactDOM from 'react-dom';
var imageDatas=require('../data/imageDatas.json');
var yeomanImage = require('../images/yeoman.png');


imageDatas=(function getImagesUrl(imageDataArrs){
	for(var i=0;i<imageDataArrs.length;i++){
		var singleImageData=imageDataArrs[i];
		singleImageData.imaUrl=require("../images/"+singleImageData.fileName);

		imageDataArrs[i]=singleImageData;
	}
	return imageDataArrs;
})(imageDatas)

// 取一个区间的随机值
function getRangeRandow(low,high){
	var result=Math.floor(Math.random()*(high-low)+low);
	return result;
}

// 取一个正负三十度的随机值
function getRotate30(){
	var result=Math.floor((Math.random()>0.5?"":"-")+Math.random()*30);
	return result;
}

var ImgFigure=React.createClass({
	
	handleClick:function(e){
		
		if(!this.props.arrange.isCenter){
			this.props.center();  // 居中
		}else{
			this.props.inverse(); // 翻转
		}

	    e.preventDefault();
    	e.stopPropagation();
	},
	
	render:function(){
		var styleObj={};
		if(this.props.arrange.pos){
			styleObj=this.props.arrange.pos;
		}
		// 给图片设置旋转的随机值
		if(this.props.arrange.rotate){
			(["MozTransform","msTransform","WebkitTransform","transform"]).forEach((function(value){
				styleObj[value]="rotate("+this.props.arrange.rotate+"deg)";
			}).bind(this));
		}

		var imgFigureClassName="img-figure";
			imgFigureClassName+=this.props.arrange.isInverse?" in-verser":"";
		return(
			<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
				<img src={this.props.data.imaUrl}
					 alt={this.props.data.fileTitle}/>
				<figureCaption>
					<h2 className="img-title">{this.props.data.fileTitle}</h2>
				</figureCaption>
				<div className="img-back">
					<p>{this.props.data.desc}</p>
				</div>
			</figure>
		);
	}
});

//控制组件
var ControllerUnit=React.createClass({
	handleClick:function(e){
		if(this.props.arrange.isCenter){
			this.props.inverse();
		}else{
			this.props.center();
		}

		e.preventDefault();
    	e.stopPropagation();
	},
	render:function(){
		var controllerUnitClassName="controller-unit";
		//判断
		if(this.props.arrange.isCenter){
			controllerUnitClassName+=" is-center";

			if(this.props.arrange.isInverse){
				controllerUnitClassName+=" is-inverse";
			}
		}
		return(
			<span className={controllerUnitClassName} onClick={this.handleClick}></span>
		);
	}	
});

var GalleryByReactApp=React.createClass({
	Constant:{
		centerPos:{
			left:0,
			top:0
		},
		hPosRange:{	//水平方向的取值范围
			leftSecX:[0,0],
			rightSecX:[0,0],
			y:[0,0]
		},
		vPosRange:{ //垂直方向的取值范围
			x:[0,0],
			topY:[0,0]
		}
	},
	/*
	*	将图片居中操作
	*/

	center:function(index){
		return function(){
			this.rearrange(index);
		}.bind(this);
	},
	/*
	*	翻转图片
	*	用闭包的方式
	*/ 

	inverse:function(index){
		return function(){
				var imgsArrangeArr=this.state.imgsArrangeArr;
				imgsArrangeArr[index].isInverse=!imgsArrangeArr[index].isInverse;
				this.setState({
					imgsArrangeArr:imgsArrangeArr
				});
			}.bind(this);
	},


	// 重新布局所有图片
	// @param centerIndex是指定那个图片居中
	rearrange:function(centerIndex){console.log("rearrange"+this.state.imgsArrangeArr.length);
		var imgsArrangeArr=this.state.imgsArrangeArr,
		Constant=this.Constant,
		centerPos=Constant.centerPos,
		hPosRange=Constant.hPosRange,
		vPosRange=Constant.vPosRange,
		hPosRangeLeftSecX=hPosRange.leftSecX,
		hPosRangeRightSecX=hPosRange.rightSecX,
		hPosRangeY=hPosRange.y,
		vPosRangeTopY=vPosRange.topY,
		vPosRangeX=vPosRange.x,
		//垂直区域的上侧区域图片位置  数量是随机的，有时候一个有时候没有。
		imgsArrangeTopArr=[],

		topImgNum=Math.floor(Math.random()*2), //一个或者没有
		// 上侧图片区域是第几个rearrange
		topImgSpliceIndex=0,
		// 居中的对象
		imgsArrangeCenterArr=imgsArrangeArr.splice(centerIndex,1);
		// 首先居中 centerIndex的图片
		imgsArrangeCenterArr[0].pos=centerPos;
		imgsArrangeCenterArr[0].rotate=0;

		imgsArrangeCenterArr[0]={
			pos:centerPos,
			rotate:0,
			isCenter:true
		}
		// 取出要布局上侧的图片状态信息
		topImgSpliceIndex=Math.floor(Math.random()*(imgsArrangeArr.length-topImgNum));
		imgsArrangeTopArr=imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

		// 给上侧区域定义位置信息
		imgsArrangeTopArr.forEach(function(value,index){
			imgsArrangeTopArr[index]={
				pos:{
					top:getRangeRandow(vPosRangeTopY[0],vPosRangeTopY[1]),
					left:getRangeRandow(vPosRangeX[0],vPosRangeX[1]),
				},
				rotate:getRotate30(),
				isCenter:false
			};
		});

		// 布局左右两侧的图片
		for(var i=0,k=imgsArrangeArr.length/2;i<imgsArrangeArr.length;i++){
			if(i<k){
				imgsArrangeArr[i]={
					pos:{
						left:getRangeRandow(hPosRangeLeftSecX[0],hPosRangeLeftSecX[1]),
						top:getRangeRandow(hPosRangeY[0],hPosRangeY[1])
					},
					rotate:getRotate30(),
					isCenter:false
				};
			}else{
				imgsArrangeArr[i]={
					pos:{
						left:getRangeRandow(hPosRangeRightSecX[0],hPosRangeRightSecX[1]),
						top:getRangeRandow(hPosRangeY[0],hPosRangeY[1])
					},
					rotate:getRotate30(),
					isCenter:false
				};
			}
		}
		//将上侧图片重新放回数组中
		if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
			imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
		}
		// 中间区域的图片塞进去
		imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);
		// 初始化state中的数组的值，当组件初始化时会重新渲染
		this.setState({
			imgsArrangeArr:imgsArrangeArr
		});
	},
	getDefaultProps:function() {
		// alert("props初始化");
	},
	//用默认的hook初始方法来
	getInitialState:function (){
		return{
			imgsArrangeArr:[
				// pos:{
				// 	left:0,
				// 	top:0 
				// 	},
				// retate:0,
				// isInverse:false,
				// isCenter:false
			]
		};
	},
	componentWillMount:function (){
		// alert("组件将要安装");
	},
	// 组件安装完成之后运行。
	componentDidMount:function(){
		//拿到舞台元素
		var stageDOM=ReactDOM.findDOMNode(this.refs.stage);
		var stageW=stageDOM.scrollWidth,
		stageH=stageDOM.scrollHeight,
		halfStageW=Math.ceil(stageW/2),
		halfStageH=Math.ceil(stageH/2);

		//拿到一个imgFigure元素的大小
		var imgFigureDom=ReactDOM.findDOMNode(this.refs.imgFigure0);
		var imgW=imgFigureDom.scrollWidth,
		imgH=imgFigureDom.scrollHeight,
		halfImgW=Math.ceil(imgW/2),
		halfImgH=Math.ceil(imgH/2);

		//中心图片的位置
		this.Constant.centerPos={
			left:halfStageW-halfImgW,
			top:halfStageH-halfImgH
		};

		//左边右边区域的取值范围
		this.Constant.hPosRange.leftSecX[0]=-halfImgW;
		this.Constant.hPosRange.leftSecX[1]=halfStageW-halfImgW * 3;
		this.Constant.hPosRange.rightSecX[0]=halfStageW+halfImgW;
		this.Constant.hPosRange.rightSecX[1]=stageW-halfImgW;

		this.Constant.hPosRange.y[0]=-halfImgH;
		this.Constant.hPosRange.y[1]=stageH-halfImgH;
		//计算上侧区域的取值范围
		this.Constant.vPosRange.x[0]=halfStageW-imgW;
		this.Constant.vPosRange.x[1]=halfStageW;

		this.Constant.vPosRange.topY[0]=-halfImgH;
		this.Constant.vPosRange.topY[1]=halfStageH-halfImgH * 3;
		// this.Constant.vPosRange.topX[0]=-halfImgW*3;
		// this.Constant.vPosRange.topX[1]=halfStageW+halfImgW * 3;

		this.rearrange(0);
	},

	render :function(){
		var controllerUnits=[];
		var imgFigures=[];

		imageDatas.forEach(function(value,index){
			// 初始化位置
			if(!this.state.imgsArrangeArr[index]){
				this.state.imgsArrangeArr[index]={
					pos:{
						left:0,
						top:0 
					},
					rotate:0,
					isInverse:false,
					isCenter:false
				}
			}
			console.log("render"+this.state.imgsArrangeArr.length);
			imgFigures.push(<ImgFigure key={index} data={value} ref={"imgFigure"+index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);

			controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
		}.bind(this));
		return (
			<section className="stage" ref="stage">
		      	<section className="img-sec">
		      		{imgFigures}
		      	</section>
		      	<nav className="controller-nav">
		      		{controllerUnits}
		      	</nav>
	      	</section>
		);
	}
});

// ReactDOM.render(
// 	<div><GalleryByReactApp/></div>,
// 	document.getElementById("app")
// );

// class AppComponent extends React.Component {
//   render() {
//     return (
//       // <div className="index">
//       //   <img src={yeomanImage} alt="Yeoman Generator" />
//       //   <div className="notice">Please edit <code>src/components/Main.js</code> to get started!</div>
//       // </div>
//       <section className="stage">
//       	<section className="img-sec">ss
//       	</section>
//       	<nav className="controller-nav">
//       	</nav>
//       </section>
//     );
//   }
// }

// AppComponent.defaultProps = {
// };

export default GalleryByReactApp;
