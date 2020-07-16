// Node.js program to demonstrate the 
// fs.stat() method 
  
// Import the filesystem module 
const fs = require('fs'); 

fs.readdir('./jpegs', (err, items) => {
 
    for (var i=0; i<items.length; i++) {
        console.log(items[i]);
    }
});