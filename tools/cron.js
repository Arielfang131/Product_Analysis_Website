// Express Initialization
const express = require("express");
const app = express();

const cron = require("node-cron");
require("dotenv").config();
const mysql = require("mysql");

const crawlerModel = require("../server/models/crawler_model");
const googleEmotion = require("../server/controllers/emotion_controller");

const request = require("request");
const cheerio = require("cheerio");

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: "side_project_test",
    waitForConnections: true,
    connectionLimit: 20
});

db.getConnection(function (err, connection) {
    if (err) {
        throw err;
    } else {
        console.log("MySqlpool Connected...in cron");
        // 釋放連線
        connection.release();
        // 不要再使用釋放過後的連線了，這個連線會被放到連線池中，供下一個使用者使用
        if (err) throw err;
    }
});

// // SQL function
// function dbsql (sql, value) {
//     const result = new Promise((resolve, reject) => {
//         db.query(sql, value, (err, result) => {
//         // if (err) throw err;
//             if (err) reject(err);
//             resolve(result);
//         });
//     });
//     return result;
// }
function getMonthFromString (mon) {
    return new Date(Date.parse(mon + " 1, 2021")).getMonth() + 1;
}

function delay () {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve("delay");
        }, 1500);
    });
}

// 爬取PTT文章列表，取得文章連結和上頁連結
function pttCrawler (url) {
    return new Promise((resolve, reject) => {
        const crawler = () => {
            request({
                url: url,
                method: "GET"
            }, (err, res, body) => {
                if (err || !body) {
                    return;
                }
                const $ = cheerio.load(body); // 載入 body
                const lastPage = $(".wide");
                const lastURL = "https://www.ptt.cc/" + lastPage.eq(1).attr("href");
                const list = $(".r-list-container .r-ent");
                const ans = { lastURL: lastURL };
                // ans.linkArr = [];
                ans.info = [];
                for (let i = 0; i < list.length; i++) {
                    const title = list.eq(i).find(".title a").text();
                    // const author = list.eq(i).find(".meta .author").text();
                    // const date = list.eq(i).find(".meta .date").text();
                    const pushNumber = list.eq(i).find(".nrec").text();
                    const link = list.eq(i).find(".title a").attr("href");
                    if (link !== undefined) {
                        // ans.linkArr.push(link);
                        const data = {
                            title: title,
                            push: pushNumber,
                            link: link
                        };
                        ans.info.push(data);
                    }
                }
                // console.log(ans);
                resolve(ans);
            });
        };
        crawler();
    });
}

// 進入PTT內頁，爬取主文內容
function pttCrawlerContent (url) {
    return new Promise((resolve, reject) => {
        const crawler = () => {
            request({
                url: url,
                method: "GET"
            }, (err, res, body) => {
                if (err || !body) {
                    return;
                }
                const $ = cheerio.load(body); // 載入 body
                const list = $(".bbs-screen .article-metaline");
                const arr = [];
                for (let i = 0; i < list.length; i++) {
                    const text = list.eq(i).find(".article-meta-value").text();
                    arr.push(text);
                }
                const contentValue = $("#main-content");
                const preArticle = contentValue.text().split("--")[0];
                const articles = preArticle.split("\n");
                const lastArticle = articles.slice(1);
                const article = lastArticle.join("\n");
                const content = { article: article };
                arr.push(content);
                // console.log(arr);
                resolve(arr);
            });
        };
        crawler();
    });
}

// 進入PTT內頁，爬取留言
async function pttCrawlerPush (url) {
    return new Promise((resolve, reject) => {
        const crawler = () => {
            request({
                url: url,
                method: "GET"
            }, async (err, res, body) => {
                if (err || !body) {
                    return;
                }
                const $ = cheerio.load(body); // 載入 body
                const list = $(".bbs-screen .article-metaline");
                const dateandTime = list.eq(2).find(".article-meta-value").text();
                let year = "";
                if (dateandTime.split(" ").includes("")) {
                    year = dateandTime.split(" ")[5];
                } else {
                    year = dateandTime.split(" ")[4];
                }
                const comments = $(".push");
                // for (const i in comments) {
                const ans = [];
                for (let i = 0; i < comments.length; i++) {
                    const commentAuthor = comments.eq(i).find(".push-userid").text();
                    const comment = comments.eq(i).find(".push-content").text();
                    const ipDateTime = comments.eq(i).find(".push-ipdatetime").text();
                    const splitTime = ipDateTime.split(" ");
                    const timeInfo = splitTime.slice(-2).toString();
                    const timeComma = timeInfo.replace("\n", "");
                    const timeSlash = timeComma.replace(",", " ");
                    const timeZero = timeSlash.replace("/", "-");
                    const time = year + "-" + timeZero.replace(/^[0]/g, "");
                    const commentEmotion = await googleEmotion.emotion(comment);
                    const data = {
                        commentAuthor: commentAuthor,
                        comment: comment,
                        commentTime: time,
                        emotion: commentEmotion
                    };
                    ans.push(data);
                }
                resolve(ans);
            });
        };
        crawler();
    });
}

async function getPtt () {
    try {
        // const arrUrl = [{ url: "https://www.ptt.cc/bbs/MakeUp/index.html", page: 13 }, { url: "https://www.ptt.cc/bbs/BeautySalon/index.html", page: 19 }];
        const arrUrl = [{ url: "https://www.ptt.cc/bbs/BeautySalon/index.html", page: 19 }];
        // const crawlerInfos = [];
        for (const k in arrUrl) {
            const mainUrl = arrUrl[k].url;
            const letters = mainUrl.split("/");
            let channel = "";
            if (letters.includes("BeautySalon")) {
                channel = "Ptt > BeautySalon";
                // channel = arrUrl[i];
            } else {
                channel = "Ptt > Makeup";
                // channel = arrUrl[i];
            }

            // for迴圈爬取多頁的文章列表和上一頁的URL
            let pageURL = arrUrl[k].url;
            for (let i = 0; i < arrUrl[k].page; i++) {
                console.log("page: " + i + " in " + arrUrl[k].page);
                await delay();
                const result = await pttCrawler(pageURL);
                // const lastPageUrl = result.lastURL;
                pageURL = result.lastURL;
                // for迴圈爬取每頁的作者、標題、時間、內容
                for (const j in result.info) {
                    await delay();
                    // for (let j = 0; j < 3; j++) {
                    const crawlerInfo = [];
                    const link = result.info[j].link;
                    console.log(link);
                    const push = result.info[j].push;
                    const detail = await pttCrawlerContent(`https://www.ptt.cc${link}`);
                    const commentsInfo = await pttCrawlerPush(`https://www.ptt.cc${link}`);
                    if (detail.length === 4) {
                        let year = "";
                        let day = "";
                        let timeDetail = "";
                        if (detail[2].split(" ").includes("")) {
                            year = detail[2].split(" ")[5];
                            day = detail[2].split(" ")[3];
                            timeDetail = detail[2].split(" ")[4];
                        } else {
                            year = detail[2].split(" ")[4];
                            day = detail[2].split(" ")[2];
                            timeDetail = detail[2].split(" ")[3];
                        }
                        if (day.length === 1) {
                            day = ("0" + day);
                        }
                        const monthEnglish = detail[2].split(" ")[1];
                        const month = getMonthFromString(monthEnglish);
                        const timeSeg = timeDetail.split(":");
                        const time = year + "-" + month + "-" + day + " " + (timeSeg.slice(0, 2).join(":"));
                        const emotion = await googleEmotion.emotion(detail[3].article);
                        const obj = {
                            author: detail[0],
                            title: detail[1],
                            time: time,
                            push: push,
                            channel: channel,
                            link: `https://www.ptt.cc${link}`,
                            article: detail[3].article,
                            emotion: emotion,
                            comments: commentsInfo
                        };
                        crawlerInfo.push(obj);
                    }
                    const checkResult = await crawlerModel.checkCrawlerInfo(`https://www.ptt.cc${link}`);
                    console.log(checkResult.length);
                    if (checkResult.length === 0) {
                        console.log("add");
                        const sqlResult = await crawlerModel.createCrawlerInfo(crawlerInfo);
                        console.log(sqlResult);
                    } else {
                        console.log("delete");
                        // const sqldelete = await crawlerModel.deleteCrawlerInfo(`https://www.ptt.cc${link}`);
                        const sqlResult = await crawlerModel.updateCrawlerInfo(crawlerInfo, `https://www.ptt.cc${link}`);
                        console.log(sqlResult);
                    }
                }
            }
            console.log("finised");

            // crawlerInfos.push(crawlerInfo);
        }
    } catch (err) {
        console.log("test21");
        console.log(err);
    }

    // console.log(crawlerInfos);
}

console.log("123");
cron.schedule("43 20 * * *", async () => {
    console.log("testEveryOneHour");
    console.log("========================================");
    // await getPtt();
});

// const CronJob = require("cron").CronJob;

// new CronJob({
//     cronTime: process.env.CRONJOB_TIME, // 請編輯.env檔填上自己的爬蟲時段喔
//     onTick: async function () {
//         console.log("開始執行爬蟲排程作業");
//         await pttCrawler.getPtt();
//         console.log("排程作業執行完畢！");
//     },
//     start: true,
//     timeZone: "Asia/Taipei"
// });
