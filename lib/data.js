/**
 * all data
 */

//  dependencies
const fs = require('fs');
const path = require('path');

// moudle scaffolding

const lib = {};

// base directory of the data folder
lib.baseDir = path.join(__dirname, '../.data/');

// write data files
lib.create = (dir, file, data, callback) => {
  // open file for writeing
  fs.open(`${lib.baseDir + dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      // convert data to string
      const stringData = JSON.stringify(data);

      // write data to file then write
      fs.writeFile(fileDescriptor, stringData, (err2) => {
        if (!err2) {
          fs.close(fileDescriptor, (err3) => {
            if (!err3) {
              callback(false);
            } else {
              callback('error closing the new file');
            }
          });
        } else {
          callback('error writing to new file');
        }
      });
    } else {
      callback(err);
    }
  });
};

// read data from file
lib.read = (dir, file, callback) => {
  fs.readFile(`${lib.baseDir + dir}/${file}.json`, 'utf8', (err, data) => {
    callback(err, data);
  });
};

// update esisting file
lib.update = (dir, file, data, callback) => {
  // file open for writeing
  fs.open(`${lib.baseDir + dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      // convert the data to string
      const stringData = JSON.stringify(data);

      // truncate the file
      fs.ftruncate(fileDescriptor, (err2) => {
        if (!err2) {
          // write to the new file
          fs.writeFile(fileDescriptor, stringData, (err3) => {
            if (!err3) {
              // close the new file
              fs.close(fileDescriptor, (err4) => {
                if (!err4) {
                  callback(false);
                } else {
                  callback('error closing file');
                }
              });
            } else {
              callback('error writing to new file');
            }
          });
        } else {
          callback('error truncate fille');
        }
      });
    } else {
      callback(err);
    }
  });
};

// delete existing file
lib.delete = (dir, file, callback) => {
  // unlink
  fs.unlink(`${lib.baseDir + dir}/${file}.json`, (err) => {
    if (!err) {
      callback(false);
    } else {
      callback('error deleting file');
    }
  });
};

// list all the item databse

lib.list = (dir, callback) => {
  fs.readdir(`${lib.baseDir + dir}`, (err, fileNames) => {
    if (!err && fileNames && fileNames.length > 0) {
      // .json remove to file name
      const trimFileName = [];
      fileNames.forEach((fileName) => {
        trimFileName.push(fileName.replace('.json', ''));
      });

      callback(false, trimFileName);
    } else {
      callback('error reading directory');
    }
  });
};

module.exports = lib;
