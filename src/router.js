/**
 * Common variables
 */
const has = {}.hasOwnProperty;
const paramRe = /:([^\/.\\]+)/g;

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
        for (const path in routes) {
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
    let regexp = path + '', match;
    while ((match = paramRe.exec(path))) {
        regexp = regexp.replace(match[0], '([^/\\\\]+)');
    }
    this.routes.push({regexp: new RegExp('^' + regexp + '$'), callback});
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
Router.prototype.dispatch = function dispatch(path = window.location.pathname) {
    for (let i = 0, len = this.routes.length, route, matches; i < len; i++) {
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
export default Router;
