import 'core-js/fn/object/assign';
import React from 'react';
import ReactDOM from 'react-dom';
import Main from './components/Main';

// Render the main component into the dom
ReactDOM.render(
	<div>
		<Main />
	</div>,
	document.getElementById('app')
);
