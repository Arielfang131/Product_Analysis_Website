const router = require("express").Router();

const {
    getNegativeContent, insertNegative
} = require("../controllers/negativecontent_controller.js");

router.route("/negativeContent").get(getNegativeContent);
router.route("/sendNegative").get(insertNegative);

module.exports = router;
