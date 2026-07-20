const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, path.join(__dirname, "../public/images"));
    },
    filename:(req, file, cb) =>{
        cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g,"_"))
    },
});

const upload = multer({ storage: storage });

module.exports = upload;