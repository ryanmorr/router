/**
 * Import utils
 */
import { hasOwnProperty, getRouteMatcher, normalizeURLPath } from './util';

/**
 * Router for dispatching callbacks
 * based on a URI
 *
 * @class PathRouter
 * @api private
 */
class PathRouter {

    /**
     * Create a new 'Router' and optionally
     * provide an object of routes that map
     * the path to the callback function
     *
     * @constructor
     * @param {Object} routes (optional)
     * @api public
     */
    constructor(routes = null) {
        this.routes = new Map();
        if (routes) {
            for (const path in routes) {
                if (hasOwnProperty(routes, path)) {
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
    route(path, callback) {
        path = normalizeURLPath(path);
        this.routes.set(getRouteMatcher(path), callback);
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
    dispatch(path) {
        path = normalizeURLPath(path);
        for (const [matcher, callback] of this.routes) {
            const params = matcher(path);
            if (params) {
                callback.call(null, params);
                return this;
            }
        }
        return this;
    }
}

/**
 * Factory function for creating
 * a `PathRouter` instance
 *
 * @param {Object} routes (optional)
 * @return {PathRouter}
 * @api public
 */
export default function Router(routes) {
    return new PathRouter(routes);
}
