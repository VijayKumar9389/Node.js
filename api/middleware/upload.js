const multer = require('multer');

var fileStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './tmp/');
    },
    filename: (req, file, callback) => {
        callback(null, 'ProjectBook.xlsx');
    }
});

var upload = multer({ storage: fileStorage });


module.exports = upload;

