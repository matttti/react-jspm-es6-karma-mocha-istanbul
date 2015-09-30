// this module is just a helper to test run mocha tests on our testsystem itself

import foo, {bar} from 'testing/testsystem-testmoduleB';

var counter = 0;

export default function a() {
	return foo(123);
}

export function b() {
	return bar('abc');
}

export function increase_counter() {
	return ++counter;
}