'use strict';

const Boom = require('boom');
const helpers = ['wrap', 'create'];


module.exports = function exploder () {
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

          return res.status(output.statusCode).send(output.payload);
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
