const { query } = require("./mysqlcon");
const createCrawlerInfo = async (crawlerInfo) => {
    // console.log(crawlerInfo);
    const dataArr = [];
    for (const i in crawlerInfo) {
        const data = [];
        const author = crawlerInfo[i].author;
        const title = crawlerInfo[i].title;
        const time = crawlerInfo[i].time;
        const push = crawlerInfo[i].push;
        const likes = crawlerInfo[i].likes;
        const channel = crawlerInfo[i].channel;
        const link = crawlerInfo[i].link;
        const content = crawlerInfo[i].article;
        const emotion = crawlerInfo[i].emotion;
        data.push(title, content, "主文", channel, link, time, push, likes, author, emotion);
        dataArr.push(data);
        for (const j in crawlerInfo[i].comments) {
            const dataComments = [];
            const author = crawlerInfo[i].comments[j].commentAuthor;
            // const title = crawlerInfo[i].title;
            const time = crawlerInfo[i].comments[j].commentTime;
            const push = null;
            const likes = crawlerInfo[i].comments[j].commentLikeCount;
            const commentEmotion = crawlerInfo[i].comments[j].emotion;
            // const likes = "test";
            // const channel = crawlerInfo[i].channel;
            // const link = crawlerInfo[i].link;
            const content = crawlerInfo[i].comments[j].comment;
            dataComments.push(title, content, "留言", channel, link, time, push, likes, author, commentEmotion);
            dataArr.push(dataComments);
        }
    }
    // console.log(dataArr);
    const sql = "INSERT INTO text_table (title, content, body_textORcomment, channel, link, time, push_number, likes_number, author, emotion) VALUES ?";
    const result = await query(sql, [dataArr]);
    console.log(result);
    return result;
};

module.exports = { createCrawlerInfo };
