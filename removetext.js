const cv = require('opencv4nodejs');
const tesseract = require("./tesseract");
const opencv = require('./opencv');
//cv.imshow('a window name', mat);
//cv.imshow('bgr2rgb', bgr2rgb);
//cv.waitKey();


const green = new cv.Vec(0, 255, 0);
const thickness = -1;
const fs = require('fs'); 
const path = require("path");
var glob = require("glob")


var picFolder = "./jpegs"
glob(picFolder + "/*.jpeg", function (err, items) {
    for (var i=0; i<items.length; i++) {
      var basename = path.basename(items[i]);
      var inputFile = picFolder + "/" + basename;
      var tempBinaryFile = "output_jpegs/" + "binary_" + i + ".jpg";
      var outputFile = './output_jpegs/' + basename;
      var mat = cv.imread(inputFile);
      var mat_binary = mat.threshold(127, 255, cv.THRESH_BINARY)
      cv.imwrite(tempBinaryFile, mat_binary);
      tesseract.recognize(tempBinaryFile, mat, cv, green, outputFile);
    }

});




