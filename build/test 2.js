var Quiz = require('./Question.js');

module.exports = function Person(){
	
	this.sayHello = function(name){
		console.log('hello world'+name);
	}
}