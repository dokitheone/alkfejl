"use strict";

const fs = require('fs');
const jimp = require('jimp');
const DataStore = require('nedb');

const path = 'gyak02/images/';
const db = new DataStore({
    filename: 'images.nedb',
    autoload: true,
});

//piramid of doom, callback hell
db.remove({}, { multi: true }, function (err, numRemoved) {
    fs.readdir(path, function (err, files) {
        if (err) throw err;

        files.forEach(fileName => {
            jimp.read(path + fileName, function (err, image) {
                const {width, height} = image.bitmap;
                // const width = image.bitmap.width;
                // const height = image.bitmap.height;
                console.log(fileName, width, height);
                db.insert({ fileName, width, height }, function (err, insertedImage) {
                    //console.log(insertedImage);
                    image.resize(100, jimp.AUTO);
                    image.write(`gyak02/converted/${insertedImage._id}.png`, function (err) {
                        if (err) throw err;

                        console.log(fileName, 'atmeretezve es kiirva')
                    });
                });
            });
        });
    });
});