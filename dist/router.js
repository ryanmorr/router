/*! Router v2.0.0 | https://github.com/ryanmorr/router */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Router = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Common variables
 */
var has = {}.hasOwnProperty;
var paramRe = /:([^\/.\\]+)/g;

/**
 * Create a new 'Router' instance with or
 * without the new operator. Optionally pass
 * an object of routes that map the path to
 * the callback function
 *
 * @constructor
 * @param {Object} routes (optional)
 * @api public
 */
function Router(routes) {
    if (!(this instanceof Router)) {
        return new Router(routes);
    }
    this.routes = [];
    if (routes) {
        for (var path in routes) {
            if (has.call(routes, path)) {
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
 * callback function:
 *
 * Router().route('/foo/:bar', function(bar){
 *
 * });
 *
 * @param {String} path
 * @param {Function} callback
 * @return {Router}
 * @api public
 */
Router.prototype.route = function route(path, callback) {
    paramRe.lastIndex = 0;
    var regexp = path + '',
        match = void 0;
    while (match = paramRe.exec(path)) {
        regexp = regexp.replace(match[0], '([^/\\\\]+)');
    }
    this.routes.push({ regexp: new RegExp('^' + regexp + '$'), callback: callback });
    return this;
};

/**
 * Test a URL against all the routes and invoke
 * the callback function of the first matching
 * pattern, passing all if any parameters
 *
 * @param {String} path (optional)
 * @return {Router}
 * @api public
 */
Router.prototype.dispatch = function dispatch() {
    var path = arguments.length <= 0 || arguments[0] === undefined ? window.location.pathname : arguments[0];

    for (var i = 0, len = this.routes.length, route, matches; i < len; i++) {
        route = this.routes[i];
        matches = route.regexp.exec(path);
        if (matches && matches[0]) {
            route.callback.apply(null, matches.slice(1));
            return this;
        }
    }
    return this;
};

/**
 * Export `Router` class
 */
exports.default = Router;
module.exports = exports['default'];

},{}]},{},[1])(1)
});

