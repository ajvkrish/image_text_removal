const Tesseract = require('tesseract.js');

const recognize = function (filename, mat, cv, color, outputFile) {
    console.log("filename=" + filename); 
    Tesseract.recognize(filename, 'eng',
    ).then(({ data: { words, text, lines, paragraphs } }) => {
      for (var word of words) {
        var text = word.text.trim()
        var bbox = word.bbox
        var confidence = word.confidence
        var matches = text.match(/^[a-zA-Z][0-9a-zA-Z]+$/);
        
        if (text.length > 1 && confidence >= 33 && matches) {
          mat.drawRectangle(new cv.Point(word.bbox.x0, word.bbox.y0), new cv.Point(word.bbox.x1, word.bbox.y1), color, 1);
          console.log("drawing rectangle for word " + text + ", confidence = " + confidence);
        } else {
          //console.log("SKIPPING: " + text + ", confidence=" + confidence + ", matches=" + matches)
        }
        
      }
      cv.imwrite(outputFile, mat);
  
    })
  }
  

module.exports = {recognize}; 