const expect = require('expect.js');
const isTextPdf = require('../src/isTextPdf');
const fs = require('fs');
const { readdir, readFile } = require('fs/promises');
const path = require('path');

describe('isTextPdf(pdfBuffer, threshold = 15)', () => {
  it('Should return true for small pdf', async () => {
    const pdfBuffer = fs.readFileSync('test/data/small.pdf');
    expect(await isTextPdf(pdfBuffer)).to.be(true);
  });
  it('Should return true for single-page pdf', async () => {
    const pdfBuffer = fs.readFileSync('test/data/single_page.pdf');
    expect(await isTextPdf(pdfBuffer)).to.be(true);
  });
  it('Should return true for multiple-page pdf', async () => {
    const pdfBuffer = fs.readFileSync('test/data/multiple_pages.pdf');
    expect(await isTextPdf(pdfBuffer)).to.be(true);
  });
  it('Should return true for heavy pdf', async () => {
    const pdfBuffer = fs.readFileSync('test/data/heavy.pdf');
    expect(await isTextPdf(pdfBuffer)).to.be(true);
  });
  it('Should return false for empty pdf', async () => {
    const pdfBuffer = fs.readFileSync('test/data/empty.pdf');
    expect(await isTextPdf(pdfBuffer)).to.be(false);
  });
  it('Should return true for false pdf', async () => {
    const pdfBuffer = fs.readFileSync('test/data/false.pdf');
    expect(await isTextPdf(pdfBuffer)).to.be(false);
  });
  it('Should return true for image pdf', async () => {
    const pdfBuffer = fs.readFileSync('test/data/image.pdf');
    expect(await isTextPdf(pdfBuffer)).to.be(false);
  });
  it('Should return true for big image pdf', async () => {
    const pdfBuffer = fs.readFileSync('test/data/image_big.pdf');
    expect(await isTextPdf(pdfBuffer)).to.be(false);
  });
  it('Should return true for protected pdf', async () => {
    const pdfBuffer = fs.readFileSync('test/data/protected.pdf');
    expect(await isTextPdf(pdfBuffer)).to.be(false);
  });
  it('Should return true for all the test Open Access text pdfs', async function () {
    this.timeout(10000);
    const textPdfs = await getBuffersFromDir('test/data/oa/textPdfs');
    for (const pdfBuffer of textPdfs) {
      expect(await isTextPdf(pdfBuffer)).to.be(true);
    }
  });
});

async function getBuffersFromDir (dirPath) {
  const files = await readdir(dirPath);

  const buffers = await Promise.all(
    files.map((file) => {
      const fullPath = path.join(dirPath, file);
      return readFile(fullPath);
    }),
  );

  return buffers;
}
