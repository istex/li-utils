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

  __getObjectId () {
    return {
      prototypeChain: getPrototypeChain(this),
      npmName: pkg.name,
      npmVersion: pkg.version,
    };
  }
};

function getPrototypeChain (o) {
  const result = [];
  result.push(o?.constructor?.name);
  const parent = Object.getPrototypeOf(o);
  if (!parent) return result;
  return result.concat(getPrototypeChain(parent));
}
