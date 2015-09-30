import * as TestSystem from './misc/testsystem';
import {expect} from 'chai';

describe('Testsystem', function() {
	this.slow(1000);
	TestSystem.init();

	it('creates a proper SystemJs instance', () => {
		global.System._loader.loads.should.be.empty;
	});

	it('#import()', async () => {
		TestSystem.reset();
		let [a,b] = await TestSystem.import('testing/testsystem-testmoduleA', 'testing/testsystem-testmoduleB');
		a.should.respondTo('default', 'b');
		b.should.respondTo('default', 'bar');
	});

	it('#importDefault()', async () => {
		TestSystem.reset();
		let [a,b] = await TestSystem.importDefault('testing/testsystem-testmoduleA', 'testing/testsystem-testmoduleB');
		a.name.should.be.equal('a');
		b.name.should.be.equal('foo');
	});

	it('#reset()', async () => {
		TestSystem.reset();
		let [a] = await TestSystem.import('testing/testsystem-testmoduleA');
		a.increase_counter().should.be.equal(1);
		a.increase_counter().should.be.equal(2);
		TestSystem.reset();
		[a] = await TestSystem.import('testing/testsystem-testmoduleA');
		a.increase_counter().should.be.equal(1);
	});

	it('#rerequire()', async () => {
		TestSystem.reset();
		let [a] = await TestSystem.import('testing/testsystem-testmoduleA');
		a.increase_counter().should.be.equal(1);
		a.increase_counter().should.be.equal(2);

		[a] = await TestSystem.import('testing/testsystem-testmoduleA');
		a.increase_counter().should.be.equal(3);

		[a] = await TestSystem.rerequire('testing/testsystem-testmoduleA');
		a.increase_counter().should.be.equal(1);
	});


	describe('Stubs on Module Dependencies', () => {
		TestSystem.init();
		let a,b;

		before(async () => {
			[a] = await TestSystem.importDefault('testing/testsystem-testmoduleA');
			a.should.throw('foo called');
			TestSystem.reset();
		});

		TestSystem.stubModule('testing/testsystem-testmoduleB');

		it('stub is used as module dependency', async () => {
			//TestSystem.reset();
			[a] = await TestSystem.importDefault('testing/testsystem-testmoduleA');
			[b] = await TestSystem.importDefault('testing/testsystem-testmoduleB');
			a.should.not.throw();
			a();
			b.should.be.calledTwice;
		});

		it('resetting should also clean stubs', async () => {
			a.should.not.throw();
			TestSystem.reset();
			[a] = await TestSystem.importDefault('testing/testsystem-testmoduleA');
			a.should.throw('foo called');
		});
	});

	describe('Nullification of Modules', () => {
		TestSystem.init();
		TestSystem.nullifyModule('testing/testsystem-testmoduleB');

		it('nullify stub', async () => {
			let [a] = await TestSystem.importDefault('testing/testsystem-testmoduleA');
			a.should.not.throw();
		});
	});

	describe('Stubs on modules with React Components', () => {
		let React, ReactDOM, TestUtils, SampleComponent;
		TestSystem.init();
		TestSystem.stubModule('testing/testsystem-testmoduleC');

		before(async () => {
			[React, ReactDOM, TestUtils] = await TestSystem.import('react', 'react-dom', 'react/lib/ReactTestUtils');
		});

		it('ES6 class component gets fake implementation', async () => {
			let [{Es6Component}] = await TestSystem.import('testing/testsystem-testmoduleC');
			let sample = TestUtils.renderIntoDocument(
				<Es6Component><img/></Es6Component>
			);

			TestUtils.scryRenderedDOMComponentsWithTag(sample, 'img').should.have.length(1);
		});

		it('React.createClass component gets fake implementation', async () => {
			let [{CreateClassComponent}] = await TestSystem.import('testing/testsystem-testmoduleC');
			let sample = TestUtils.renderIntoDocument(
				<CreateClassComponent><img/></CreateClassComponent>
			);

			TestUtils.scryRenderedDOMComponentsWithTag(sample, 'img').should.have.length(1);
		});
	});

	let nativeXMLHttpRequest = global.XMLHttpRequest;

	describe('DOM, fakeXHR and fetch', () => {
		TestSystem.reset();
		let requests = TestSystem.initFakeXHR();

		it('should create global properties', () => {
			global.should.have.property('fetch');
			global.XMLHttpRequest.name.should.be.equal('FakeXMLHttpRequest');
			global.XMLHttpRequest.should.not.be.equal(nativeXMLHttpRequest);
		});

		it('should intercept AJAX requests', () => {
			let p1 = fetch('http://musterurl.com').should.be.fulfilled.then((response) =>{
				response.ok.should.be.true;
				response.status.should.equal(299);
			});

			requests.current().should.be.equal(requests[0])
			requests.current().should.be.equal(requests.next());
			requests.current().respond(299);
			expect(requests.next()).to.not.exist;

			return p1;
		});
	});

	//this test is about proper removing in the after() hook. Must be in a new describe() block to ensure execution order.
	describe('DOM, fakeXHR and fetch(2): teardown', () => {
		it('no traces left in new scope', () => {
			global.XMLHttpRequest.should.be.equal(nativeXMLHttpRequest);
		});
	});

});
