/* global module */
module.exports = function (config) {
	'use strict';
	config.set({
		autoWatch: true,
		singleRun: true,
		//logLevel: config.LOG_DEBUG,

		frameworks: ['jspm', 'mocha'],

		files: [
			'node_modules/karma-babel-preprocessor/node_modules/babel-core/browser-polyfill.js'
		],

		client: {
			mocha: {
				reporter: 'html', // change Karma's debug.html to the mocha web reporter
				ui: 'bdd'
			}
		},


		jspm: {
			config: 'src/config.js',
			loadFiles: [
				'test/*-test.js'
			],
			serveFiles: [
				'src/!(jspm_packages)/*.js',
				'test/misc/*.js',
			]
		},

		proxies: {
			'/base': '/base/src',
		},

		// browsers: ['PhantomJS_debug'],
		browsers: ['PhantomJS'],

		customLaunchers: {
			'PhantomJS_debug': {
				base: 'PhantomJS',
				debug: true
			}
		},

		// add all paths you added to src/ as a new line (wildcards like '**' don't work properly)
		preprocessors: {
			'src/app/*.js': ['babel', 'sourcemap', 'coverage'],
			'test/misc/testsystem.js': ['babel', 'sourcemap', 'coverage'],
			'test/*.js': ['babel']
		},

		babelPreprocessor: {
			options: {
				sourceMap: 'inline',
				blacklist: ['useStrict']
			},
			sourceFileName: function(file) {
				return file.originalPath;
			}
		},

		reporters: [/*'mocha',*/ 'coverage', 'progress'],

		coverageReporter: {
			instrumenters: {isparta: require('isparta')},
			instrumenter: {
				'src/**/*.js': 'isparta'
			},

			reporters: [
				{
					type: 'text-summary',
					subdir: normalizationBrowserName
				},
				{
					type: 'html',
					dir: 'coverage/',
					subdir: normalizationBrowserName
				}
			]
		}
	});

	function normalizationBrowserName(browser) {
		return browser.toLowerCase().split(/[ /-]/)[0];
	}
};
