const router = require("express").Router();

const {
    getTopicInfo,
    getPNValue
} = require("../controllers/pnvalue_controller.js");

router.route("/pnValue").get(getTopicInfo);
router.route("/pnValue").post(getPNValue);

module.exports = router;
