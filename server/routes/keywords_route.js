const router = require("express").Router();

const {
    getKeywords
} = require("../controllers/keywords_controller");

router.route("/keywords").post(getKeywords);

module.exports = router;
