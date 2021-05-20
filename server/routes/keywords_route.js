const router = require("express").Router();

const {
    getKeywords
} = require("../controllers/keywords_controller");

router.route("/contentlist").post(getKeywords);

module.exports = router;
