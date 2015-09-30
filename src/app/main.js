import React from 'react';
import ReactDOM  from'react-dom';

export class HelloWorld extends React.Component {
	render() {
		return (
			<div>
				<h1>Hello, {this.props.name}</h1>
			</div>
		);
	}
}

// detect test runner, there's for sure a better way
if(typeof window.it !== 'function')
	ReactDOM.render(<HelloWorld name="World" />, document.getElementById('App'));
