const TRAILING_SLASH_RE = /\/$/;

function isNumeric(value) {
    return !Number.isNaN(parseFloat(value)) && isFinite(value);
}

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

function normalizeURLPath(path) {
    path = path.trim();
    return path === '/' ? path : path.replace(TRAILING_SLASH_RE, '');
}

function getRouteMatcher(path) {
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

class PathRouter {

    constructor(routes = null) {
        this.routes = new Map();
        if (routes) {
            for (const path in routes) {
                this.route(path, routes[path]);
            }
        }
    }

    route(path, callback) {
        path = normalizeURLPath(path);
        this.routes.set(getRouteMatcher(path), callback);
        return this;
    }

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

export default function Router(routes) {
    return new PathRouter(routes);
}
