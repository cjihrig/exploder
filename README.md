# exploder

[![Current Version](https://img.shields.io/npm/v/exploder.svg)](https://www.npmjs.org/package/exploder)
[![Build Status via Travis CI](https://travis-ci.org/cjihrig/exploder.svg?branch=master)](https://travis-ci.org/cjihrig/exploder)
![Dependencies](http://img.shields.io/david/cjihrig/exploder.svg)
[![belly-button-style](https://img.shields.io/badge/eslint-bellybutton-4B32C3.svg)](https://github.com/cjihrig/belly-button)

HTTP-friendly error objects. This is a port of the [boom](https://www.npmjs.com/package/boom) module as [express](https://www.npmjs.com/package/express) middleware. It is based on [express-boom](https://www.npmjs.com/package/express-boom).

## Example

```javascript
const Express = require('express');
const Exploder = require('exploder');

const app = Express();

app.use(Exploder());

app.use(function (req, res) {
  res.boom.notFound(); // Responds with a 404 status code
});
```

## API

For a complete list of methods offered by boom, see the [boom](https://www.npmjs.com/package/boom) documentation.

`exploder` also provides the following options when setting up the middleware:

- `format(err)` (function) - A function that formats the boom error before replying to the client. This only applies to functions that send a response to the client (i.e. not `wrap()` or `create()`). By default, the boom error's `output.payload` is sent as the response payload. If a `format()` function is provided, the complete boom error is passed as the only argument, and the return value is sent as the response payload.
