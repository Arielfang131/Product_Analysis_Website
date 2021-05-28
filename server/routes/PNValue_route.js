const router = require("express").Router();

const {
    getTopicInfo,
    getPNValue
} = require("../controllers/PNValue_controller.js");

router.route("/PNValue").get(getTopicInfo);
router.route("/PNValue").post(getPNValue);

module.exports = router;
