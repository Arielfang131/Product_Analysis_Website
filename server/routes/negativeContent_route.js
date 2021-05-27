const router = require("express").Router();

const {
    getNegativeContent
} = require("../controllers/negativeContent_controller.js");

router.route("/negativeContent").get(getNegativeContent);

module.exports = router;
