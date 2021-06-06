const { query } = require("./mysqlcon");

const sqlModifiedEmotion = async function () {
    try {
        const sql = "SELECT * FROM text_table";
        const result = await query(sql);
        const specialWords = ["好燒", "燒到", "生火", "被燒"];
        const newResult = [];
        for (const i in result) {
            for (const j in specialWords) {
                const specialWord = new RegExp(specialWords[j]);
                if (specialWord.test(result[i].content) === true) {
                    result[i].emotion = 0.3;
                }
            }
            newResult.push(result[i]);
        }
        const dataArr = [];
        for (const i in newResult) {
            const data = [];
            const author = newResult[i].author;
            const title = newResult[i].title;
            const time = newResult[i].time;
            const push = newResult[i].push_number;
            const likes = newResult[i].likes_number;
            const channel = newResult[i].channel;
            const link = newResult[i].link;
            const content = newResult[i].content;
            const emotion = newResult[i].emotion;
            const bodyTextORcomment = newResult[i].body_textORcomment;
            const modifiedTime = new Date();
            data.push(title, content, bodyTextORcomment, channel, link, time, push, likes, author, emotion, modifiedTime);
            dataArr.push(data);
        }
        // console.log(dataArr);
        const sqlInsert = "INSERT INTO text_table_modified (title, content, body_textORcomment, channel, link, time, push_number, likes_number, author, emotion,modified_time) VALUES ?";
        const modifiedResult = await query(sqlInsert, [dataArr]);
        console.log("modified emotion");
        return modifiedResult;
    } catch (err) {
        console.log("test23");
        console.log(err);
        return {};
    }
};

module.exports = {
    sqlModifiedEmotion
};
