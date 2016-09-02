var React = require('react');
var ReactDOM = require('react-dom');

var Test = React.createClass({
	getInitialState:function(){
		return {
			name:'pingzidong'
		}
	},
	render:function(){
		return (
				<div>
					{this.state.name}
				</div>
		);
	}
});

ReactDOM.render(<Test />,document.getElementById('test'));

