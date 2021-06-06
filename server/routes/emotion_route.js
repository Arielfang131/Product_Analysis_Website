const router = require("express").Router();

const {
    emotion,
    modifiedEmotion
} = require("../controllers/emotion_controller");

router.route("/admin/emotion").get(emotion);
router.route("/admin/modifiedemotion").get(modifiedEmotion);

module.exports = router;
