const language = require("@google-cloud/language");
const client = new language.LanguageServiceClient();
const emotionModel = require("../models/emotion_model.js");

function emotion (text) {
    return new Promise((resolve, reject) => {
        // Format for Cloud Natural Language API
        const document = {
            type: "PLAIN_TEXT",
            content: text
        };

        // Call Cloud Natural Language API sentiment analyzer and console log results
        async function emotionScore () {
            const result = await client.analyzeSentiment({ document: document });
            // console.log(result[0].documentSentiment.score);
            const score = result[0].documentSentiment.score;
            resolve(score);
        }
        emotionScore();
    });
}

async function modifiedEmotion (req, res) {
    await emotionModel.sqlModifiedEmotion();
}

module.exports = {
    emotion,
    modifiedEmotion
};
