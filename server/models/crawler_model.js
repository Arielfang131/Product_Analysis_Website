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
        data.push("1", title, content, "主文", channel, link, time, push, likes, author, "中立");
        dataArr.push(data);
        for (const j in crawlerInfo[i].comments) {
            const dataComments = [];
            const author = crawlerInfo[i].comments[j].commentAuthor;
            // const title = crawlerInfo[i].title;
            const time = crawlerInfo[i].comments[j].commentTime;
            const push = null;
            const likes = crawlerInfo[i].comments[j].likes;
            // const likes = "test";
            // const channel = crawlerInfo[i].channel;
            // const link = crawlerInfo[i].link;
            const content = crawlerInfo[i].comments[j].comment;
            dataComments.push("1", title, content, "留言", channel, link, time, push, likes, author, "中立");
            dataArr.push(dataComments);
        }
    }
    // console.log(dataArr);
    const sql = "INSERT INTO text_table (topic_id, title, content, body_textORcomment, channel, link, time, push_number, likes_number, author, emotion) VALUES ?";
    const result = await query(sql, [dataArr]);
    console.log(result);
};

module.exports = { createCrawlerInfo };
