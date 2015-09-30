# react-jspm-es6-karma-mocha-istanbul
React with JSPM boilerplate, including testing framework (Karma,Mocha,Istanbul) and examples.

As a bonus, these very helpful testing utilities are also part of this bundle: [Chai](http://chaijs.com/), [Chai-As-Promised](https://github.com/domenic/chai-as-promised/) and [Sinon](http://sinonjs.org/).

[Babel](https://babeljs.io/) is used as the es6 transpiler and has already the very nice [es7.asyncFunctions](https://github.com/lukehoban/ecmascript-asyncawait) enabled, which help a lot to write clean and readable testcases when using System.js API used by JSPM.

To install and run:

	$ make install

Or step by step

	$ npm install -g jspm karma-cli
	$ npm install
	$ jspm install
	$ jspm install --dev

Then just start it

	$ open src/index.html

You may need to start Chrome with a special flag in order to avoid some security restrictions when accessing local files. [This post](http://stackoverflow.com/questions/4819060/allow-google-chrome-to-use-xmlhttprequest-to-load-a-url-from-a-local-file) explains the details.

# Testing

Now let's do some testing and launch karma

	$ npm test
or
	$ npm test -- --no-single-run

# How to combine JSPM's module handling in tests

In order to get both, testcases and sourcefiles, working with es6 module loading, it is neccessary to treat imports differently:

1. Dependencies concerning testing can be loaded using plain es6 import syntax, e.g.

	import 'sinon' from 'sinon';

2. The code under test (source files, libraries like React) should be loaded directly via the system.js API, preferable inside the test cases themself. This gives us very precise control on dependency handling and empowers us to stub/mock whole modules and clean them afterwards. In `test/misc/testsystem.js`, some helpful utilities were added to make this job easier:

	import Testsystem from 'test/misc/testsystem';

	describe('foo', () => {
		let react, MyComponent;

		TestSystem.init(); // ensures a fresh and clean System.js environment

		before(async () => {
			[react, {MyComponent}] = await TestSytem.import('react', 'app/components');
		});
	});

Take a look at this file and the all other sample files for more details and examples. In particular the way to stub whole dependencies is quite nice.

# Bundeling the project

A simple way to build distribution bundles is also part of this package. It's basically all steps described in [this video](https://www.youtube.com/watch?v=NpMnRifyGyw) (minute 24:45).

	$ make dist