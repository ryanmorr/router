/*! @ryanmorr/router v3.0.2 | https://github.com/ryanmorr/router */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Router = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Router;

var _util = require("./util");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Router for dispatching callbacks
 * based on a URI
 *
 * @class PathRouter
 * @api private
 */
var PathRouter =
/*#__PURE__*/
function () {
  /**
   * Create a new 'Router' and optionally
   * provide an object of routes that map
   * the path to the callback function
   *
   * @constructor
   * @param {Object} routes (optional)
   * @api public
   */
  function PathRouter() {
    var routes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    _classCallCheck(this, PathRouter);

    this.routes = new Map();

    if (routes) {
      for (var path in routes) {
        if ((0, _util.hasOwnProperty)(routes, path)) {
          this.route(path, routes[path]);
        }
      }
    }
  }
  /**
   * Add a new route to the router with a path
   * which may or may not contain embedded
   * parameters from which to extract from
   * a matching URL and pass to the provided
   * callback function
   *
   * @param {String} path
   * @param {Function} callback
   * @return {PathRouter}
   * @api public
   */


  _createClass(PathRouter, [{
    key: "route",
    value: function route(path, callback) {
      path = (0, _util.normalizeURLPath)(path);
      this.routes.set((0, _util.getRouteMatcher)(path), callback);
      return this;
    }
    /**
     * Test a URL against all the routes and invoke
     * the callback function of the first matching
     * route
     *
     * @param {String} path
     * @return {PathRouter}
     * @api public
     */

  }, {
    key: "dispatch",
    value: function dispatch(path) {
      path = (0, _util.normalizeURLPath)(path);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.routes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 2),
              matcher = _step$value[0],
              callback = _step$value[1];

          var params = matcher(path);

          if (params) {
            callback.call(null, params);
            return this;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return this;
    }
  }]);

  return PathRouter;
}();
/**
 * Factory function for creating
 * a `PathRouter` instance
 *
 * @param {Object} routes (optional)
 * @return {PathRouter}
 * @api public
 */


function Router(routes) {
  return new PathRouter(routes);
}

module.exports = exports.default;

},{"./util":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasOwnProperty = hasOwnProperty;
exports.normalizeURLPath = normalizeURLPath;
exports.getRouteMatcher = getRouteMatcher;

/**
 * Common variables
 */
var has = {}.hasOwnProperty;
var removeTrailingSlashRe = /\/$/;
/**
 * Check if a string value is numeric
 *
 * @param {String} value
 * @return {Boolean}
 * @api private
 */

function isNumeric(value) {
  return !Number.isNaN(parseFloat(value)) && isFinite(value);
}
/**
 * Convert strings of primitives
 * into their natural type
 *
 * @param {String} value
 * @return {String|Number|Boolean|Null|Undefined}
 * @api private
 */


function coerce(value) {
  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  if (value === 'undefined') {
    return null;
  }

  if (isNumeric(value)) {
    return Number(value);
  }

  return value;
}
/**
 * Determine whether an object has the specified
 * property as a direct property of that object
 *
 * @param {Object} obj
 * @param {String} name
 * @return {Boolean}
 * @api private
 */


function hasOwnProperty(obj, name) {
  return has.call(obj, name);
}
/**
 * Normalize a URL path for consistency
 *
 * @param {String} path
 * @return {RegExp}
 * @api private
 */


function normalizeURLPath(path) {
  path = path.trim();
  return path === '/' ? path : path.replace(removeTrailingSlashRe, '');
}
/**
 * Parse a URL route and return a function that
 * can match the URL and extract the parameters
 *
 * @param {String} path
 * @return {Function}
 * @api private
 */


function getRouteMatcher(path) {
  if (path === '/') {
    return function (p) {
      return p === '/' ? {} : null;
    };
  }

  var keys = [];
  var pattern = path.split('/').map(function (part) {
    if (!part) {
      return part;
    }

    var length = part.length;
    var code = part.charCodeAt(0);

    if (code === 42) {
      keys.push('wildcard');
      return '/(.*)';
    } else if (code === 58) {
      var optional = part.charCodeAt(length - 1) === 63;
      keys.push(part.substring(1, optional ? length - 1 : length));

      if (optional) {
        return '(?:/([^/]+?))?';
      }

      return '/([^/]+?)';
    }

    return '/' + part;
  });
  var regex = new RegExp('^' + pattern.join('') + '\/?$', 'i');
  return function (path) {
    var matches = regex.exec(path);

    if (matches && matches[0]) {
      return matches.slice(1).map(decodeURI).map(coerce).reduce(function (map, value, i) {
        map[keys[i]] = value;
        return map;
      }, {});
    }

    return null;
  };
}

},{}]},{},[1])(1)
});

