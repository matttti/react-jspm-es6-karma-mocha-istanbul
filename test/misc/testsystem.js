import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';

chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised);

export function initFakeXHR() {
	let xhr, requests = [];
	//initXHR();

	//remove native implementation of fetch (e.g. in Chrome browsers)
	fetch = null;

	let request_counter = 0;
	requests.next = () => requests[request_counter++];
	requests.current = () => requests[requests.length-1];

	before(async () => {
		await _import('fetch');
		xhr = sinon.useFakeXMLHttpRequest();
		xhr.onCreate = function (xhr_) {
			requests.push(xhr_);
		};
	});

	after(() => {
		xhr.restore();
	});

	return requests;
}

function deleteInternalModuleTraces(normalized_name) {
	delete System._loader.modules[normalized_name];
	delete System.defined[normalized_name];
	delete System._loader.importPromises[normalized_name];
	delete System._loader.moduleRecords[normalized_name];
}

export function init() {
	before(reset);
}

export async function rerequire(module_name) {
	let	normalized_name = await System.normalize(module_name);
	deleteInternalModuleTraces(normalized_name);
	return await _import(module_name);
}

export function reset() {
	let ignore_prefixes = ['@', 'npm:', 'github:'];

	Object.keys(System._loader.modules)
	.filter((module) =>
		ignore_prefixes.every((prefix) => !module.startsWith(prefix))
	)
	.forEach(deleteInternalModuleTraces);
}

function detectReactComponent(obj) {
	//React.createClass and es6-class versions
	return obj.prototype.setState;

	//an alternative detection way for some cases could be:
	// || (obj.__proto__.prototype && obj.__proto__.prototype.setState);
}

async function createReactStub() {
	let [React] = await _import('react');

	return React.createClass({
		render: function() {
			return React.createElement('div', null, this.props.children);
		}
	});
}

export function stubModule(module_name) {
	let orig_module, normalized_name;
	before(async () => {
		try {
			normalized_name = await System.normalize(module_name);

			//first time: remove potential stub traces, allows re-initialization of a stub.
			deleteInternalModuleTraces(normalized_name);
			orig_module = await System.import(normalized_name);

			//second time: remove original module
			deleteInternalModuleTraces(normalized_name);

			var new_module = Object.assign({}, orig_module);

			for (let prop in new_module) {
				if (typeof new_module[prop] === "function") {
					if(detectReactComponent(new_module[prop])) {
						sinon.stub(new_module, prop, await createReactStub());
					}
					else {
						sinon.stub(new_module, prop);
					}
				}
			}

			System.set(normalized_name, System.newModule(new_module));

			return new_module;
		}
		catch(e) {
			throw e;
		}
	});

	after(() => {
		deleteInternalModuleTraces(normalized_name);
		System.set(normalized_name, System.newModule(orig_module));
	});
}

export function nullifyModule(module_name) {
	let normalized_name;

	before(async () => {
		normalized_name = await System.normalize(module_name);

		System.set(normalized_name, System.newModule({
			default: sinon.spy()
		}));
	});

	after(() => {
		deleteInternalModuleTraces(normalized_name);
	});
}

export async function _import(...names) {
	try {
		return await* names.map(async (name) => {
			return await System.import(name);
		});
	}
	catch(e) {
		throw e;
	}
}

exports.import = _import;

export async function importDefault(...names) {
	try {
		return (await _import(...names)).map((i) => i.default);
	}
	catch(e) {
		throw e;
	}
}
