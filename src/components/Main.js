require('normalize.css/normalize.css');
require('styles/App.css');



import React from 'react';
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


class AppComponent extends React.Component {
  render() {
    return (
      // <div className="index">
      //   <img src={yeomanImage} alt="Yeoman Generator" />
      //   <div className="notice">Please edit <code>src/components/Main.js</code> to get started!</div>
      // </div>
      <section className="stage">
      	<section className="img-sec">
      	</section>
      	<nav className="controller-nav">
      	</nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
