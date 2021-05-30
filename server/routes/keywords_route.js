const router = require("express").Router();

const {
    viewKeywords,
    getKeywords,
    deleteKeywords
} = require("../controllers/keywords_controller");

router.route("/keywords").get(viewKeywords);
router.route("/keywords").post(getKeywords);
router.route("/deleteKeywords").post(deleteKeywords);

module.exports = router;
