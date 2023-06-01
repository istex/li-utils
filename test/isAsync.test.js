const expect = require('expect.js');
const { isAsync } = require('../helpers/isAsync');

describe('isAsync(fn)', () => {
  it('should return true if arg is an async function and false otherwise', () => {
    expect(isAsync((''))).to.be(false);
    expect(isAsync((618))).to.be(false);
    expect(isAsync((null))).to.be(false);
    expect(isAsync((undefined))).to.be(false);
    expect(isAsync(({}))).to.be(false);
    expect(isAsync(([]))).to.be(false);
    expect(isAsync(() => {})).to.be(false);
    expect(isAsync(() => { return new Promise(); })).to.be(false);
    expect(isAsync(async () => { return new Promise(); })).to.be(true);
    expect(isAsync(async () => {})).to.be(true);
  });
});
