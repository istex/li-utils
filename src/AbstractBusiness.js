const EventEmitter = require('node:events');
const assert = require('assert').strict;
const { isObject } = require('lodash');
const pkg = require('../package.json');

module.exports = class AbstractBusiness extends EventEmitter {
  constructor ({ props = {} } = {}) {
    super();
    if (this.constructor === AbstractBusiness) {
      throw new TypeError('Abstract class "AbstractBusiness" cannot be instantiated directly');
    }
    assert.ok(isObject(props), 'Expect <props> to be an {object}');
    this.props = props;
  }

  async doTheJob (docObject = {}) {
    return docObject;
  }

  async initialJob () {}

  async finalJob (docObjects = []) {
    return { errors: [], results: docObjects };
  }

  async beforeAnyJob () {}

  async afterAllTheJobs () {}

  // links event emitted from one instance of EventEmitter to Business events listeners
  // Limited to specifics events that are listed below
  linksEventEmitter (ee) {
    // Event by severity RFC5424
    const events = {
      error: 0,
      warn: 1,
      info: 2,
      http: 3,
      verbose: 4,
      debug: 5,
      silly: 6,
    };

    Object
      .keys(events)
      .forEach((event) => {
        ee.on(event, (...args) => {
          this.emit(event, ...args);
        });
      });
  }

  __getObjectId () {
    return {
      prototypeChain: _getPrototypeChain(this),
      npmName: pkg.name,
      npmVersion: pkg.version,
    };
  }
};

// helpers
function _getPrototypeChain (o) {
  const result = [];
  result.push(o?.constructor?.name);
  const parent = Object.getPrototypeOf(o);
  if (!parent) return result;
  return result.concat(_getPrototypeChain(parent));
}
