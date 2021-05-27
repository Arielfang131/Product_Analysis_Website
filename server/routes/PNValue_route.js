const router = require("express").Router();

const {
    getTopicInfo
} = require("../controllers/PNValue_controller.js");

router.route("/PNValue").get(getTopicInfo);

module.exports = router;
