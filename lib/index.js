'use strict';

const Boom = require('boom');
const helpers = ['wrap', 'create'];


module.exports = function exploder (options) {
  options = Object.assign({}, options);
  const format = options.format;

  if (format !== undefined && typeof format !== 'function') {
    throw new TypeError('format must be a function');
  }

  return function exploderMiddleware (req, res, next) {
    if (res.boom !== undefined) {
      return next();
    }

    res.boom = {};

    Object.keys(Boom).forEach(function methodInit (key) {
      const fn = Boom[key];

      if (typeof fn !== 'function') {
        return;
      }

      if (helpers.indexOf(key) === -1) {
        res.boom[key] = function () {
          const err = fn.apply(Boom, arguments);
          const output = err.output;
          const status = output.statusCode;
          const payload = format ? format(err) : output.payload;

          return res.status(status).send(payload);
        };
      } else {
        res.boom[key] = function () {
          return fn.apply(Boom, arguments);
        };
      }
    });

    next();
  };
};
