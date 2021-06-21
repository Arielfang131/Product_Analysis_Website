const router = require("express").Router();

const {
    getTopicList,
    getContentList
} = require("../controllers/content_list_controller");

router.route("/contentlist").get(getTopicList);
router.route("/contentlist").post(getContentList);

module.exports = router;
