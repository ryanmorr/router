/**
 * Common variables
 */
const has = {}.hasOwnProperty;
const removeTrailingSlashRe = /\/$/;

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
export function hasOwnProperty(obj, name) {
    return has.call(obj, name);
}

/**
 * Normalize a URL path for consistency
 *
 * @param {String} path
 * @return {RegExp}
 * @api private
 */
export function normalizeURLPath(path) {
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
export function getRouteMatcher(path) {
    if (path === '/') {
        return (p) => (p === '/' ? {} : null);
    }
    const keys = [];
    const pattern = path.split('/').map((part) => {
        if (!part) {
            return part;
        }
        const length = part.length;
        const code = part.charCodeAt(0);
        if (code === 42) {
            keys.push('wildcard');
            return '/(.*)';
        } else if (code === 58) {
            const optional = part.charCodeAt(length - 1) === 63;
            keys.push(part.substring(1, optional ? length - 1 : length));
            if (optional) {
                return '(?:/([^/]+?))?';
            }
            return '/([^/]+?)';
        }
        return '/' + part;
    });
    const regex = new RegExp('^' + pattern.join('') + '/?$', 'i');
    return (path) => {
        const matches = regex.exec(path);
        if (matches && matches[0]) {
            return matches
                .slice(1)
                .map(decodeURI)
                .map(coerce)
                .reduce((map, value, i) => {
                    map[keys[i]] = value;
                    return map;
                }, {});
        }
        return null;
    };
}
