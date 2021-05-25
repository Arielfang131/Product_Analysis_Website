const router = require("express").Router();

const {
    getTopicList,
    getContentList
} = require("../controllers/contentlist_controller");

router.route("/contentlist").get(getTopicList);
router.route("/contentlist").post(getContentList);

module.exports = router;
