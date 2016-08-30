'use strict';
var webpack = require('webpack');
var path = require('path');
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var ImageminPlugin = require('imagemin-webpack-plugin').default;
module.exports = {
	entry:{
		bundle1:'./js/common.js',
		bundle2:'./js/Question.js',
		bundle3:'./js/load.js'
	},
	output:{
		path:path.resolve(__dirname,'build'),
		filename:'[name].js'
	},
	module:{
		loaders:[
			{test:/\.css$/,loader:'style-loader!css-loader'},
			{test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'}
		]
	},
	"scripts": {
    	"build": "webpack",
    	"dev": "webpack-dev-server --devtool eval --progress --colors --hot --content-base build"
  	},
  	plugins: [
	    new webpack.optimize.UglifyJsPlugin({
	     compress: {
	       warnings: false
	     }
   		}),
    	// new CommonsChunkPlugin('init.js'),
    	new ImageminPlugin({
	      disable: false,
	      optipng: {
	        optimizationLevel: 3
	      },
	      gifsicle: {
	        optimizationLevel: 1
	      },
	      jpegtran: {
	        progressive: false
	      },
	      svgo: {
	      },
	      pngquant: null, // pngquant is not run unless you pass options here
	      plugins: []
    	}),
	]
}