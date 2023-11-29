const expect = require('expect.js');
const AbstractBusiness = require('../src/AbstractBusiness');

describe('AbstractBusiness', () => {
  it('Should inherit #__getObjectId()', () => {
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
      npmName: '@istex/li-utils',
      npmVersion: '1.1.0',
    });
  });
});
