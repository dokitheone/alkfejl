"use strict";

const fs = require('fs');
const jimp = require('jimp');
const DataStore = require('nedb-promise');
const co = require('co');


const path = 'gyak02/images/';
const db = new DataStore({
    filename: 'images.nedb',
    autoload: true,
});

function readdir(path) {
    return new Promise(function (resolve, reject) {
        fs.readdir(path, function (err, files) {
            if (err) {
                reject(err);
            } else {
                resolve(files);
            }
        });
    });
}

function processFile(fileName) {
    let theImage;
    return jimp.read(path + fileName)
        .then(function (image) {
            theImage = image;
            const {width, height} = image.bitmap;
            return db.insert({ fileName, width, height });
        })
        .then(function (insertedImage) {
            theImage.resize(100, jimp.AUTO);
            return theImage.write(`gyak02/converted/${insertedImage._id}.png`);
        })
        .then(function () {
            console.log(fileName, 'atmeretezve es kiirva');
        })
}

co(function* () {
    const numRemoved = yield db.remove({}, { multi: true });
    console.log(numRemoved, 'törölve');
    const files = yield readdir(path);
    files.forEach(co.wrap(function (fileName) {
    //for(let fileName of files) {
        const image = yield jimp.read(path + fileName);
        const {width, height} = image.bitmap;
        const insertedImage = yield db.insert({ fileName, width, height });
        image.resize(100, jimp.AUTO);
        yield image.write(`gyak02/converted/${insertedImage._id}.png`);
        console.log(fileName, 'atmeretezve es kiirva');    
    }));
    console.log('VÉGE');
})
