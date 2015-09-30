import * as TestSystem from 'test/misc/testsystem';

describe('<HelloWorld> Component', function() {
	let React, ReactDOM, TestUtils, HelloWorld;

	TestSystem.init();

	before(async () => {
		[React, ReactDOM, TestUtils] = await TestSystem.import('react', 'react-dom', 'react/lib/ReactTestUtils');
		[{HelloWorld}] = await TestSystem.import('app/main');
	});

	beforeEach(function() {
		navigationbar = TestUtils.renderIntoDocument(
			<Nav.NavigationBar>
				<Nav.Brand target='/' title="Grin" imgSrc="https://cdn.grin.com/images/brand/1/mobile-logo.png"/>
				<Nav.Main>
					<Nav.Item target='/foo'>Foo</Nav.Item>
				</Nav.Main>
				<Nav.Picture name="Walter"/>
				<Nav.Dropdown name="Hello, Ursula">
					<Nav.Item target='/bar'>Bar</Nav.Item>
					<Nav.Item separator/>
					<Nav.Item target='/logout'>Baz</Nav.Item>
				</Nav.Dropdown>
	 		</Nav.NavigationBar>
		);
	});

	it('should have double amount of <Link> Nodes', function() {
		let dom = TestUtils.renderIntoDocument(<HelloWorld name="Foobar"/>
		TestUtils.findRenderedComponentWithTag(dom, 'h1').should.contain('Foobar');

	});
});
