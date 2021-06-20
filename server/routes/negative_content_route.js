const router = require("express").Router();

const {
    getNegativeContent, insertNegative
} = require("../controllers/negative_content_controller");

router.route("/negativeContent").get(getNegativeContent);
router.route("/sendNegative").get(insertNegative);

module.exports = router;
