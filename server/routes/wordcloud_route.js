const router = require("express").Router();

const {
    getWordcloud
} = require("../controllers/wordcloud_controller.js");

router.route("/wordcloud").post(getWordcloud);

module.exports = router;
