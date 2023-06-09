const EventEmitter = require('node:events');
const assert = require('node:assert').strict;
const { isPlainObject, _ } = require('lodash');
const { isAsync } = require('../helpers/isAsync');
const AbstractBusiness = require('./AbstractBusiness');

class LegacyBusinessWrapper extends AbstractBusiness {
  constructor (legacyBusinessModule, { props = {} } = {}) {
    super();
    assert.ok(isPlainObject(legacyBusinessModule), 'Expect <businessModule> to be a plain {object}');
    this._businessModule = _promisify(legacyBusinessModule);
    Object.assign(this, { props } ,this._businessModule);
  }
}

module.exports = LegacyBusinessWrapper;

function _promisify (businessModule) {
  return _.chain(businessModule)
    .pickBy(_.isFunction)
    .mapValues((fn) => {
      if (isAsync(fn)) return fn;
      return ({
        [fn.name]: async function (...args) {
          return new Promise((resolve, reject) => {
            fn.call(this, ...args, (err, result) => {
              handleOptionsLog.call(this, result);
              if (err) return reject(err);
              resolve();
            });
          });
        },
      })[fn.name];
    })
    .value();
}

function handleOptionsLog(value){
  _.chain(value)
    .get('processLogs')
    .forEach((processLog)=>{this.emit('info', processLog)})
    .value();

  _.chain(value)
    .get('errLogs')
    .forEach((errorLog)=>{this.emit('error', errorLog)})
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