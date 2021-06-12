const router = require("express").Router();

const {
    viewKeywords,
    getKeywords,
    deleteKeywords
} = require("../controllers/keywords_controller");

const { authentication } = require("../../util/util");

router.route("/keywords").get(viewKeywords);
router.route("/keywords").post(authentication(), getKeywords);
router.route("/deleteKeywords").post(deleteKeywords);

module.exports = router;
