const cv = require('opencv4nodejs');


//cv.imshow('a window name', mat);
//cv.imshow('bgr2rgb', bgr2rgb);
//cv.waitKey();

const Tesseract = require('tesseract.js');
const green = new cv.Vec(0, 255, 0);
const thickness = -1;
const fs = require('fs'); 

var picFolder = "./jpegs"
fs.readdir(picFolder, (err, items) => {
 
    for (var i=1; i<items.length; i++) {

      var inputFile = picFolder + "/" + items[i];
      var tempBinaryFile = "output_jpegs/" + "/binary_" + i + ".jpg";
      var outputFile = './output_jpegs/' + items[i];
      console.log("FileNames", items[i], inputFile, tempBinaryFile, outputFile);

      var mat = cv.imread(inputFile);
      var mat_binary = mat.threshold(127, 255, cv.THRESH_BINARY)
      cv.imwrite(tempBinaryFile, mat_binary);
      recognize(tempBinaryFile);
    }

});


function recognize(filename) {
  Tesseract.recognize(tempBinaryFile, 'eng',
  ).then(({ data: { words, text, lines, paragraphs } }) => {
    for (var word of words) {
      var text = word.text.trim()
      var bbox = word.bbox
      var confidence = word.confidence
      var matches = text.match(/^[0-9a-zA-Z]+$/);
      
      // if (text.length > 1 &&  !matches) {
      //   console.log("SKIPPING: " + text + ", confidence=" + confidence)
      // }
      if (text.length > 1 && confidence > 30 && matches) {
        mat.drawRectangle(new cv.Point(word.bbox.x0, word.bbox.y0), new cv.Point(word.bbox.x1, word.bbox.y1), green, 1);
        // console.log('drawing rectangle for word ' + text + ", confidence = " + confidence);
      }
      
    }
    cv.imwrite(outputFile, mat);

  })
}



