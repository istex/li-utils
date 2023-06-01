const EventEmitter = require('node:events');
const assert = require('node:assert').strict;
const { isPlainObject, _ } = require('lodash');
const { isAsync } = require('../helpers/isAsync');

class BusinessWrapper extends EventEmitter {
  constructor (businessModule = {}) {
    super();
    assert.ok(isPlainObject(businessModule), 'Expect <businessModule> to be a plain {object}');
    this._businessModule = _promisify(businessModule);
    Object.assign(this, _ensureMethodsAcceptsCb(this._businessModule));
  }
}

module.exports = BusinessWrapper;

function _promisify (businessModule) {
  return _.chain(businessModule)
    .pickBy(_.isFunction)
    .mapValues((fn) => {
      if (isAsync(fn)) return fn;
      return ({
        [fn.name]: async function (...args) {
          return new Promise((resolve, reject) => {
            fn.call(this, ...args, (err, result) => {
              if (err) return reject(err);
              resolve(result);
            });
          });
        },
      })[fn.name];
    })
    .value();
}

function _ensureMethodsAcceptsCb (businessModule) {
  return _.chain(businessModule)
    .pickBy(_.isFunction)
    .mapValues((fn) => {
      return ({
        [fn.name]: function (...args) {
          const maybeCb = _.last(args);
          if (typeof maybeCb === 'function') {
            fn.call(this, ..._.initial(args))
              .then((result) => { maybeCb(null, result); })
              .catch((reason) => {
                return maybeCb(reason);
              });
          } else {
            return fn.call(this, ...args)
              .catch((reason) => {
                throw reason;
              });
          }
        },
      })[fn.name];
    })
    .value();
}
