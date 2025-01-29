const expect = require('expect.js');
const AbstractBusiness = require('../src/AbstractBusiness');
const pkg = require('../package.json');

describe('AbstractBusiness', () => {
  it('Should make instance inherit #__getObjectId()', () => {
    const Business = class Business extends AbstractBusiness {};
    const business = new Business();
    const result = business.__getObjectId();
    expect(result).to.be.eql({
      prototypeChain: [
        'Business',
        'Business',
        'AbstractBusiness',
        'EventEmitter',
        'Object',
      ],
      npmName: pkg.name,
      npmVersion: pkg.version,
    });
  });
});
