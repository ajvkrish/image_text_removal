'use strict';
const { createWorker, createScheduler } = require('tesseract.js');

const scheduler = createScheduler();
const worker1 = createWorker();
const worker2 = createWorker();


const recognize = async function (filenames) {

    await worker1.load();
    await worker2.load();
    await worker1.loadLanguage('eng');
    await worker2.loadLanguage('eng');
    await worker1.initialize('eng');
    await worker2.initialize('eng');
    scheduler.addWorker(worker1);
    scheduler.addWorker(worker2);
    let promises = [];
    filenames.forEach((filename) => {
        let p = new Promise((resolve, reject) => {
            let schedulerPromise = scheduler.addJob('recognize', filename);
            schedulerPromise.then((data) => {
                let result = [];
                let words = data.data.words;
                words.forEach(word => {
                    result.push({ "text": word.text, "confidence": word.confidence, "bbox": word.bbox });
                });
                resolve({ "filename": filename, "words": result })
            });
        });
        promises.push(p);
    })
    const results = await Promise.all(promises);
    await scheduler.terminate();
    return results;
}

module.exports = { recognize }