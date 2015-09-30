// this module is just a helper to test run mocha tests on our testsystem itself

import React from 'react';

export default function foo() {
	throw 'foo called';
}

export function bar() {
	throw 'bar called';
}

export class SampleComponent extends React.Component {
	render() {
		return (<section />);
	};
}