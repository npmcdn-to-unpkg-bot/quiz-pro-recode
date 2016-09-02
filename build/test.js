var React = require('react');
var ReactDOM = require('react-dom');

var Test = React.createClass({
	getInitialState:function(){
		var name = 'pingzidong';
	},
	render:function(){
		return (
				<div>
					{this.state.name}
				</div>
		);
	}
});

ReactDom.render(<Test />,document.getElementById('test'));

