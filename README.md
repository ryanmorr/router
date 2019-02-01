# Router

[![Version Badge][version-image]][project-url]
[![Build Status][build-image]][build-url]
[![License][license-image]][license-url]

> A minimalist universal router for web applications

## Install

Download the [development](http://github.com/ryanmorr/router/raw/master/dist/router.js) or [minified](http://github.com/ryanmorr/router/raw/master/dist/router.min.js) version, or install via NPM:

``` sh
npm install @ryanmorr/router
```

## Usage

Create a router that matches different routes and extracts the parameters to pass to the callback functions:

```javascript
import Router from '@ryanmorr/router';

const router = Router()
    .route('/', () => {
        // Handle home page 
    })
    .route('/foo', () => {
        // Handle "/foo"
    })
    .route('/foo/:bar', ({bar}) => {
        // Parameters are indicated by a prefixed colon
    })
    .route('/foo/:bar/:baz?', ({bar, baz}) => {
        // Optional parameters are indicated by a suffixed question mark
    })
    .route('/foo/qux/*', ({wildcard}) => {
        // An asterisk indicates a wildcard that will match anything
    });

// Find the route matching "/foo" and invoke the callback function
router.dispatch('/foo');
```

Use in a browser:

```javascript
window.addEventListener('popstate', () => {
    router.dispatch(window.location.pathname);
});
```

Use in Node.js:

```javascript
const http = require('http'),
const url = require('url');
 
const server = http.createServer((req, res) => {
    const path = url.parse(req.url).pathname;
    router.dispatch(path);
});

server.listen(8888);
```

## License

This project is dedicated to the public domain as described by the [Unlicense](http://unlicense.org/).

[project-url]: https://github.com/ryanmorr/router
[version-image]: https://badge.fury.io/gh/ryanmorr%2Frouter.svg
[build-url]: https://travis-ci.org/ryanmorr/router
[build-image]: https://travis-ci.org/ryanmorr/router.svg
[license-image]: https://img.shields.io/badge/license-Unlicense-blue.svg
[license-url]: UNLICENSE