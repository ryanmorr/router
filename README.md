# router

[![Version Badge][version-image]][project-url]
[![License][license-image]][license-url]
[![Build Status][build-image]][build-url]

> A minimalist universal router for web applications

## Install

Download the [CJS](https://github.com/ryanmorr/router/raw/master/dist/cjs/router.js), [ESM](https://github.com/ryanmorr/router/raw/master/dist/esm/router.js), [UMD](https://github.com/ryanmorr/router/raw/master/dist/umd/router.js) versions or install via NPM:

``` sh
npm install @ryanmorr/router
```

## Usage

Create a router that matches different routes and extracts the parameters to pass to the callback function:

```javascript
import Router from '@ryanmorr/router';

const router = Router({
    '/': () => {
        // Handle home page 
    },
    '/foo': () => {
        // Handle "/foo"
    },
    '/foo/:bar': ({bar}) => {
        // Parameters are indicated by a prefixed colon
    },
    '/foo/:bar/:baz?': ({bar, baz}) => {
        // Optional parameters are indicated by a suffixed question mark
    },
    '/foo/qux/*': ({wildcard}) => {
        // An asterisk indicates a wildcard that will match anything
    }
});

// Finds the first matching route and invokes the callback function
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
const http = require('http');
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
[version-image]: https://img.shields.io/github/package-json/v/ryanmorr/router?color=blue&style=flat-square
[build-url]: https://github.com/ryanmorr/router/actions
[build-image]: https://img.shields.io/github/actions/workflow/status/ryanmorr/router/node.js.yml?style=flat-square
[license-image]: https://img.shields.io/github/license/ryanmorr/router?color=blue&style=flat-square
[license-url]: UNLICENSE