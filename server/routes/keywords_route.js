const router = require("express").Router();

const {
    viewKeywords,
    getKeywords
} = require("../controllers/keywords_controller");

router.route("/keywords").get(viewKeywords);
router.route("/keywords").post(getKeywords);

module.exports = router;
