const router = require("express").Router();

const {
    emotion
} = require("../controllers/emotion_controller");

router.route("/admin/emotion").get(emotion);

module.exports = router;
