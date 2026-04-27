const { PDFParse } = require('pdf-parse');

module.exports = async function isTextPdf (pdfBuffer, threshold = 15) {
  let parser;
  let text;
  try {
    parser = new PDFParse({
      data: pdfBuffer,
    });
    text = await parser.getText();
  } catch (e) {
    return false;
  }
  await parser.destroy();
  const pages = text.pages.length;
  const res = text.text;

  // /\s+/ -> all whitespace
  const wordCount = res.split(/\s+/).length;
  return wordCount / pages >= threshold;
};
