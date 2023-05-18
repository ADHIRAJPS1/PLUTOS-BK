const multer = require("multer");

const multerStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "public/files/campaign_promo");
	},
	filename: (req, file, cb) => {
		cb(null, `batch-${Date.now()}.${file.originalname}`);
	},
});
const multerFilter = (req, file, cb) => {
	if (
		file.mimetype ==
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
	) {
		cb(null, true);
	} else {
		cb("Please upload a valid excel sheet.", false);
	}
};

const upload = multer({
	fileFilter: multerFilter,
	storage: multerStorage,
	
});

module.exports = upload;
