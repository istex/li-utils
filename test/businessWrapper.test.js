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

  it('Should return an {object} that has promesified/async method #dotTheJob that accepts cb', (done) => {
    const businessModule = {
      doTheJob: function (docObject, cb) { return cb(null, { body: 'expectedResult' }); },
    };
    const business = new BusinessWrapper(businessModule);
    business.doTheJob(
      {},
      (err, result) => {
        if (err) return done(err);
        expect(result.body).to.be('expectedResult');
        business.doTheJob({})
          .then((result) => { expect(result.body).to.be('expectedResult'); })
          .then(done)
          .catch(done);
      });
  });

  it('Should return an {object} that has method #finalJob that accepts cb', (done) => {
    const businessModule = {
      finalJob: async function (docObjects) { return { body: 'expectedResult' }; },
    };
    const business = new BusinessWrapper(businessModule);

    business.finalJob(
      [],
      (err, result) => {
        if (err) return done(err);
        expect(result.body).to.be('expectedResult');
        business.finalJob([])
          .then((result) => { expect(result.body).to.be('expectedResult'); })
          .then(done)
          .catch(done);
      });
  });

  it('Should return an {object} that has method #afterAllTheJobs that accepts cb', (done) => {
    const businessModule = {
      afterAllTheJobs: function (cb) { return cb(null, { body: 'expectedResult' }); },
    };
    const business = new BusinessWrapper(businessModule);

    business.afterAllTheJobs(
      (err, result) => {
        if (err) return done(err);
        expect(result.body).to.be('expectedResult');
        business.afterAllTheJobs()
          .then((result) => { expect(result.body).to.be('expectedResult'); })
          .then(done)
          .catch(done);
      });
  });
});
