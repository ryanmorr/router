# Router
[![GitHub version](https://badge.fury.io/gh/ryanmorr%2Frouter.svg)](https://badge.fury.io/gh/ryanmorr%2Frouter) [![Build Status](https://travis-ci.org/ryanmorr/router.svg)](https://travis-ci.org/ryanmorr/router) ![Size](https://badge-size.herokuapp.com/ryanmorr/router/master/dist/router.min.js.svg?color=blue&label=file%20size)

> Simple router to bind URL paths to callback functions

## Usage

```javascript
const router = Router()
    .route('/', () => {
        // Handle home page 
    })
    .route('/posts', () => {
        // Handle posts
    })
    .route('/post/:id', () => {
        // Handle single post with `id` provided as a parameter
    });

// Dispatch the router when the history is changed
window.addEventListener('popstate', router.dispatch.bind(router), false);
```

## API

### Router([routes])

Create a new 'Router' instance with or without the new operator. Optionally pass an object of routes that map the path to the callback function.

```javascript
// Create a `Router` instance with routes
const router = Router({
    '/foo': () => {
        // Do something 
    },
    '/bar/:id': () => {
        // Do something 
    }
});
```

### Router#route(path, fn)

Add a new route to the router with a path which may or may not contain embedded parameters from which to extract from a matching URL and pass to the provided callback function. Returns the router instance for method chaining.

```javascript
router.route('/foo/:bar/:baz', (bar, baz) => {
    // Do something 
});
```

### Router#dispatch([path])

Test a URL against all the routes and invoke the callback function of the first matching pattern, passing all if any parameters. If no path is given, the current window's URL path (`location.pathname`) is used. Returns the router instance for method chaining.

```javascript
// Dispatch a path
router.dispatch('/foo');

// Dispatch using the window's current URL path
router.dispatch();
```

## Installation

Router is [CommonJS](http://www.commonjs.org/) and [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) compatible with no dependencies. You can download the [development](http://github.com/ryanmorr/router/raw/master/dist/router.js) or [minified](http://github.com/ryanmorr/router/raw/master/dist/router.min.js) version, or install it in one of the following ways:

``` sh
npm install ryanmorr/router

bower install ryanmorr/router
```

## Tests

Run unit tests by issuing the following commands:

``` sh
npm install
npm install -g gulp
gulp test
```

## License

This project is dedicated to the public domain as described by the [Unlicense](http://unlicense.org/).