var Jasmine = require('jasmine');
var JasmineCore = require('jasmine-core');
global.getJasmineRequireObj = function() {
  return JasmineCore
}

// global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest
require('jasmine-ajax');
