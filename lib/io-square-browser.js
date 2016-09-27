(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.IO = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IO = function () {
  function IO(ioFunc) {
    var _this = this;

    _classCallCheck(this, IO);

    this.then = function (cb) {
      return ioFunc(function () {
        if ((arguments.length <= 0 ? undefined : arguments[0]) instanceof Error) {
          _this.err(arguments.length <= 0 ? undefined : arguments[0]);
        } else {
          cb.apply(undefined, arguments);
        }
      });
    };
    this.err = function (e) {
      return console.log(e.message);
    };
  }

  _createClass(IO, [{
    key: "error",
    value: function error(handler) {
      this.err = handler;
      return this;
    }
  }, {
    key: "reject",
    value: function reject(pred) {
      var saveThen = this.then;
      this.then = function (cb) {
        saveThen(function () {
          var result = pred.apply(undefined, arguments);
          if (result !== null) {
            if (Array.isArray(result)) {
              cb.apply(undefined, _toConsumableArray(result));
            } else {
              cb(result);
            }
          }
        });
      };
      return this;
    }
  }, {
    key: "map",
    value: function map(transform) {
      var saveThen = this.then;
      this.then = function (cb) {
        saveThen(function () {
          var result = transform.apply(undefined, arguments);
          if (Array.isArray(result)) {
            cb.apply(undefined, _toConsumableArray(result));
          } else {
            cb(result);
          }
        });
      };
      return this;
    }
  }, {
    key: "bind",
    value: function bind(ioFunc) {
      var saveThen = this.then;
      this.then = function (cb) {
        saveThen(function () {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          var io = ioFunc.apply(undefined, args);
          io.then(function () {
            for (var _len2 = arguments.length, ioargs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              ioargs[_key2] = arguments[_key2];
            }

            return cb.apply(undefined, args.concat(ioargs));
          });
        });
      };
      return this;
    }
  }]);

  return IO;
}();

module.exports = IO;
},{}],2:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ioSquare = require('io-square');

var _ioSquare2 = _interopRequireDefault(_ioSquare);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var createRequest = function createRequest(method, url, cb) {
  var request = new window.XMLHttpRequest();
  request.addEventListener('load', function () {
    if (request.status === 200) {
      cb(request);
    } else {
      cb(new Error(request.statusText));
    }
  });
  request.addEventListener('timeout', function () {
    return cb(new Error('Request timed out'));
  });
  request.addEventListener('abort', function () {
    return cb(new Error('Request aborted'));
  });
  request.addEventListener('error', function () {
    return cb(new Error('Request failed'));
  });
  request.open(method, url);
  return request;
};

var IOBrowser = function (_IO) {
  _inherits(IOBrowser, _IO);

  function IOBrowser() {
    _classCallCheck(this, IOBrowser);

    return _possibleConstructorReturn(this, (IOBrowser.__proto__ || Object.getPrototypeOf(IOBrowser)).apply(this, arguments));
  }

  _createClass(IOBrowser, null, [{
    key: 'get',
    value: function get(url) {
      return new _ioSquare2.default(function (cb) {
        var request = createRequest('GET', url, cb);
        request.send();
      }).map(function (request) {
        return request.responseText;
      });
    }
  }, {
    key: 'getJSON',
    value: function getJSON(url) {
      return new _ioSquare2.default(function (cb) {
        var request = createRequest('GET', url, cb);
        request.responseType = 'json';
        request.send();
      }).map(function (request) {
        return [request.response];
      });
    }
  }, {
    key: 'getBlob',
    value: function getBlob(url) {
      return new _ioSquare2.default(function (cb) {
        var request = createRequest('GET', url, cb);
        request.responseType = 'blob';
        request.send();
      }).map(function (request) {
        return new window.Blob([request.response]);
      });
    }
  }, {
    key: 'postJSON',
    value: function postJSON(url, obj) {
      return new _ioSquare2.default(function (cb) {
        var request = createRequest('POST', url, cb);
        request.setRequestHeader('Content-Type', 'application/json');
        request.responseType = 'json';
        request.send(JSON.stringify(obj));
      }).map(function (request) {
        return [request.response];
      });
    }
  }, {
    key: 'click',
    value: function click(elem) {
      return new _ioSquare2.default(function (cb) {
        return elem.addEventListener('click', cb);
      });
    }
  }, {
    key: 'change',
    value: function change(elem) {
      return new _ioSquare2.default(function (cb) {
        return elem.addEventListener('change', cb);
      }).map(function (e) {
        return e.target.value;
      });
    }
  }]);

  return IOBrowser;
}(_ioSquare2.default);

module.exports = IOBrowser;

},{"io-square":1}]},{},[2])(2)
});