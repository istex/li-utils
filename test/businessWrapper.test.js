const expect = require('expect.js');
const BusinessWrapper = require('../src/LegacyBusinessWrapper');
const EventEmitter = require('node:events');

function buildBusiness (businessModule) { return new BusinessWrapper(businessModule); }

describe('BusinessWrapper(businessModule)', () => {
  it('Should not throw if <businessModule> is a plain {object}', () => {
    expect(buildBusiness).withArgs({}).to.not.throwException();
  });

  it('Should throw if <businessModule> is not a plain {object}', () => {
    function Foo () {}

    expect(buildBusiness).withArgs(new Foo()).to.throwException();
  });

  it('Should return an {object} that extend <EventEmitter>', () => {
    const business = new BusinessWrapper({});
    expect(business).to.be.a(EventEmitter);
  });

  it('Should return an {object} with methods #doTheJob that emit events', (done) => {
    const businessModule = {
      doTheJob: function (docObject, cb) {
        this.emit?.('info', 'INFORMATIONS');
        return cb();
      },
    };
    const business = new BusinessWrapper(businessModule);
    business.on('info', (info) => {
      expect(info).to.be('INFORMATIONS');
      done();
    });
    business.doTheJob({});
  });

  it('Should return an {object} with methods that keep their original name', () => {
    const businessModule = {
      doTheJob: function (docObject, cb) { return cb(); },
      beforeAnyJob: async function (cb) { return cb(); },
      afterAllTheJobs: function (cb) { return cb(); },
      initialJob: function (cb) { return cb(); },
      finalJob: async function (docObjects, cb) { return cb(); },
    };
    const business = new BusinessWrapper(businessModule);
    expect(business.doTheJob.name).to.be('doTheJob');
    expect(business.beforeAnyJob.name).to.be('beforeAnyJob');
    expect(business.afterAllTheJobs.name).to.be('afterAllTheJobs');
    expect(business.initialJob.name).to.be('initialJob');
    expect(business.finalJob.name).to.be('finalJob');
  });

  it('Should return an {object} with methods #afterAllTheJobs that emit events', (done) => {
    const businessModule = {
      afterAllTheJobs: function (cb) {
        this.emit?.('info', 'INFORMATIONS');
        return cb();
      },
    };
    const business = new BusinessWrapper(businessModule);
    business.on('info', (info) => {
      expect(info).to.be('INFORMATIONS');
      done();
    });
    business.afterAllTheJobs()
      .catch(done);
  });

  it('Should return an {object} that has promesified/async method #dotTheJob', (done) => {
    const businessModule = {
      doTheJob: function (docObject, cb) { return cb(); },
    };
    const business = new BusinessWrapper(businessModule);
    const docObject = {};
    business.doTheJob(docObject)
      .then((result) => { expect(result).to.be(docObject); })
      .then(done)
      .catch(done);
  });

  it('Should return an {object} that has method #afterAllTheJobs', (done) => {
    const businessModule = {
      afterAllTheJobs: function (cb) { return cb(); },
    };
    const business = new BusinessWrapper(businessModule);

    business.afterAllTheJobs()
      .then(done)
      .catch(done);
  });
});
