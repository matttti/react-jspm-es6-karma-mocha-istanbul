// require('sinon') needs a working XMLHttpRequest instance as a sideeffect to enable sinon.useFakeXMLHttpRequest
var jsdom = require('jsdom').jsdom('<!doctype html><html><body></body></html>');
global.XMLHttpRequest = jsdom.defaultView.XMLHttpRequest;
require('sinon');
delete global.XMLHttpRequest;

require("babel/register")({
	"stage": 1,
	"optional": [
	   "runtime"
	],
	"blacklist": []
});

