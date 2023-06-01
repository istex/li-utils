const EventEmitter = require('node:events');
const assert = require('assert').strict;
const { isObject } = require('lodash');

module.exports = class AbstractBusiness extends EventEmitter {
  constructor ({ config = {} } = {}) {
    super();
    if (this.constructor === AbstractBusiness) {
      throw new TypeError('Abstract class "AbstractBusiness" cannot be instantiated directly');
    }
    assert.ok(isObject(config), 'Expect <config> to be an {object}');
    this.config = config;
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
};
