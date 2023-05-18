const multer = require("multer");

const multerStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		if (file.fieldname === "logo") {
			cb(null, "public/images/client/logos");
		} else if (file.fieldname === "icon") {
			cb(null, "public/images/client/icons");
		}
	},
	filename: (req, file, cb) => {
		if (file.fieldname === "logo") {
			cb(null, `client_logo-${Date.now()}.${file.originalname}`);
		} else if (file.fieldname === "icon") {
			cb(null, `client_icon-${Date.now()}.${file.originalname}`);
		}
	},
});

const multerFilter = (req, file, cb) => {
	if (file.mimetype.startsWith("image")) {
		cb(null, true);
	} else {
		cb("Please upload only images.", false);
	}
};

const upload = multer({
	storage: multerStorage,
	fileFilter: multerFilter,
});

module.exports = upload;
