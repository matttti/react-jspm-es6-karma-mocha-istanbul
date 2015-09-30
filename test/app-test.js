import * as TestSystem from 'test/misc/testsystem';

describe('<HelloWorld> Component', function() {
	let React, ReactDOM, TestUtils, HelloWorld;

	TestSystem.init();

	before(async () => {
		[React, ReactDOM, TestUtils] = await TestSystem.import('react', 'react-dom', 'react/lib/ReactTestUtils');
		[{HelloWorld}] = await TestSystem.import('app/main');
	});

	it('should show the name property', function() {
		let dom = TestUtils.renderIntoDocument(<HelloWorld name="Foobar"/>);
		TestUtils.findRenderedDOMComponentWithTag(dom, 'h1').textContent.should.contain('Foobar');
	});
});
