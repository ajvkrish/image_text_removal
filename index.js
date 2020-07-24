"use strict";
const cv = require('opencv4nodejs');
const tesseract = require("./tesseract_async");
const fsExtra = require('fs-extra')
const fs = require('fs');
const path = require("path");
var glob = require('glob-fs')



const green = new cv.Vec(0, 255, 0);
const thickness = 1;
let picFolder = "./input_images/";
let outFolder = "./output_images/";
let tempFolder = "./temp_images/";

fsExtra.emptyDirSync(outFolder)
var files = fs.readdirSync(picFolder).filter(fn => fn.endsWith('.png') || fn.endsWith('.jpeg') || fn.endsWith('.jpg'));
let matrices = {};
let output_files = {};
let binary_files = [];
for (var i = 0; i < files.length; i++) {
  var basename = path.basename(files[i]);
  var extension = path.extname(basename);
  var inputFile = picFolder + basename;
  var tempBinaryFile = tempFolder + "binary_" + i + extension;
  var outputFile = outFolder + basename;
  console.log("inputFile = " + inputFile + ", tempFile=" + tempBinaryFile + ", outputFile=" + outputFile);
  var mat = cv.imread(inputFile);
  var mat_binary = mat.threshold(127, 255, cv.THRESH_BINARY)
  cv.imwrite(tempBinaryFile, mat_binary);
  
  binary_files.push(tempBinaryFile);
  matrices[tempBinaryFile] = mat; 
  output_files[tempBinaryFile] = outputFile;
}

(async () => {
  try {
    console.log("Running tesseract recognize on " + binary_files.length + " files");
    let recognizedFiles = await tesseract.recognize(binary_files);
    let filesWithWords = recognizedFiles.filter(recognizedResult => recognizedResult.words.length > 0);
    let numberOfOutputFiles = 0;
    filesWithWords.forEach((recognizedResult) => {
      let filename = recognizedResult.filename;
      let mat = matrices[filename];
      let output_file = output_files[filename];
      let rectangle_count = 0;
      for (var word of recognizedResult.words) {
        let text = word.text.trim();
        let bbox = word.bbox;
        let confidence = word.confidence;
        let matches = text.match(/^[a-zA-Z][0-9a-zA-Z]+$/);
       
        //if (text.length > 1 && confidence > 50 && matches) {
          let point1 = new cv.Point(bbox.x0, bbox.y0);
          let point2 = new cv.Point(bbox.x1, bbox.y1);
          rectangle_count++;
          mat.drawRectangle(point1, point2, green, thickness);
          console.log("Drawing Rectangle: text=" + text + ", confidence=" + confidence + ", output_file= " + output_file )
        //} else {
          //console.log("SKIPPING: " + text + ", confidence=" + confidence + ", matches=" + matches)
        //}

      }

      if (rectangle_count > 0) {
        cv.imwrite(output_file, mat);
        numberOfOutputFiles++;
      }
    });
    console.log(numberOfOutputFiles + " files found with words that passed the confidence filter");
    fsExtra.emptyDirSync(tempFolder);
} catch (e) {
  console.log(e);
}
}) ();





