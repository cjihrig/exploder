# exploder

[![Current Version](https://img.shields.io/npm/v/exploder.svg)](https://www.npmjs.org/package/exploder)
[![Build Status via Travis CI](https://travis-ci.org/continuationlabs/exploder.svg?branch=master)](https://travis-ci.org/continuationlabs/exploder)
![Dependencies](http://img.shields.io/david/continuationlabs/exploder.svg)

[![belly-button-style](https://cdn.rawgit.com/continuationlabs/belly-button/master/badge.svg)](https://github.com/continuationlabs/belly-button)

HTTP-friendly error objects. This is a port of [hapi](https://www.npmjs.com/package/hapi)'s [boom](https://www.npmjs.com/package/boom) module as [express](https://www.npmjs.com/package/express) middleware. It is based on [express-boom](https://www.npmjs.com/package/express-boom).

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

For a complete list of methods, see the [boom](https://www.npmjs.com/package/boom) documentation.
