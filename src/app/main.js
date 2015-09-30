import React from 'react';
import ReactDOM  from'react-dom';

export class HelloWorld extends React.Component {
	render() {
		return (
			<h1>Hello, {this.props.name}</h1>
		);
	}
}

ReactDom.render(<HelloWorld name="World" />, document.body);