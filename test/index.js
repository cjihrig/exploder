'use strict';

const Boom = require('boom');
const Code = require('code');
const Lab = require('lab');
const Exploder = require('../lib');

const lab = exports.lab = Lab.script();
const expect = Code.expect;
const describe = lab.describe;
const it = lab.it;

describe('Exploder', () => {
  it('creates res.boom', (done) => {
    const exploder = Exploder();
    const res = {};

    exploder(null, res, function next () {
      expect(arguments.length).to.equal(0);
      expect(Object.keys(res)).to.equal(['boom']);
      expect(Object.keys(res.boom)).to.equal(Object.keys(Boom));
      done();
    });
  });

  it('handles multiple registrations', (done) => {
    const exploder = Exploder();
    const res = {};

    exploder(null, res, () => {
      expect(Object.keys(res.boom)).to.equal(Object.keys(Boom));
      res.boom.badRequest = -1;
      exploder(null, res, () => {
        expect(res.boom.badRequest).to.equal(-1);
        done();
      });
    });
  });

  it('only copies methods from Boom', (done) => {
    const exploder = Exploder();
    const res = {};

    Boom.__test = 99;
    exploder(null, res, () => {
      expect(Object.keys(res.boom)).to.not.equal(Object.keys(Boom));
      delete Boom.__test;
      expect(Object.keys(res.boom)).to.equal(Object.keys(Boom));
      done();
    });
  });

  it('works with Boom helper functions', (done) => {
    const exploder = Exploder();
    const res = {};

    exploder(null, res, function next () {
      const err = res.boom.create(401, 'not very authorized', { foo: 'bar' });

      expect(err).to.include({
        data: { foo: 'bar' },
        isBoom: true,
        isServer: false,
        output: {
          statusCode: 401,
          payload: {
            statusCode: 401,
            error: 'Unauthorized',
            message: 'not very authorized'
          },
          headers: {}
        }
      });
      expect(err).to.equal(Boom.create(401, 'not very authorized', { foo: 'bar' }));
      done();
    });
  });

  it('creates Boom errors', (done) => {
    const exploder = Exploder();
    let statusCode = 0;
    const res = {
      status (code) {
        statusCode = code;
        return this;
      },
      send (payload) {
        expect(statusCode).to.equal(502);
        expect(payload).to.equal({
          statusCode: 502,
          error: 'Bad Gateway',
          message: 'naughty gateway'
        });
        done();
      }
    };

    exploder(null, res, function next () {
      res.boom.badGateway('naughty gateway', { bar: 'baz' });
    });
  });

  it('supports custom format() functions', (done) => {
    const exploder = Exploder({
      format (err) {
        return {
          msg: err.message,
          output: {
            statusCode: 999,
            payload: err.data
          }
        };
      }
    });

    let statusCode = 0;
    const res = {
      status (code) {
        statusCode = code;
        return this;
      },
      send (payload) {
        expect(statusCode).to.equal(404);
        expect(payload).to.equal({
          msg: 'sorry, not found',
          output: {
            statusCode: 999,
            payload: { id: 'foo' }
          }
        });
        done();
      }
    };

    exploder(null, res, function next () {
      res.boom.notFound('sorry, not found', { id: 'foo' });
    });
  });

  it('throws if format() is not a function', (done) => {
    function fail (format) {
      expect(() => {
        Exploder({ format });
      }).to.throw(TypeError, 'format must be a function');
    }

    fail(null);
    fail({});
    fail(/foo/);
    fail(true);
    fail(false);
    fail(NaN);
    fail(Infinity);
    fail(0);
    fail(1);
    fail('');
    fail('foo');
    done();
  });
});
