const cron = require("node-cron");
require("dotenv").config();
const mysql = require("mysql");
const mysqlPromise = require("mysql2/promise");

const crawlerModel = require("../server/models/crawler_model");
const negativeModel = require("../server/models/negativecontent_model");
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

// create mysqlPromise connection
const pool = mysqlPromise.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: "side_project_test",
    waitForConnections: true,
    connectionLimit: 20
});

pool.getConnection((err) => {
    if (err) throw err;
    console.log("mysql(pool) connecting...");
});

db.getConnection(function (err, connection) {
    if (err) {
        throw err;
    } else {
        console.log("MySqlpool Connected...in cron");
        connection.release();
        if (err) throw err;
    }
});

// get month from string to number
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

// Crawl the list of PTT articles, get links and links to the previous page
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
                const $ = cheerio.load(body);
                const lastPage = $(".wide");
                const lastURL = "https://www.ptt.cc/" + lastPage.eq(1).attr("href");
                const list = $(".r-list-container .r-ent");
                const ans = { lastURL: lastURL };
                ans.info = [];
                for (let i = 0; i < list.length; i++) {
                    const title = list.eq(i).find(".title a").text();
                    const pushNumber = list.eq(i).find(".nrec").text();
                    const link = list.eq(i).find(".title a").attr("href");
                    if (link !== undefined) {
                        const data = {
                            title: title,
                            push: pushNumber,
                            link: link
                        };
                        ans.info.push(data);
                    }
                }
                resolve(ans);
            });
        };
        crawler();
    });
}

// Enter the PTT inside page and crawl the content of the main article
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
                const $ = cheerio.load(body);
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
                resolve(arr);
            });
        };
        crawler();
    });
}

// Enter the PTT inside page, crawl the comments
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
                const $ = cheerio.load(body);
                const list = $(".bbs-screen .article-metaline");
                const dateandTime = list.eq(2).find(".article-meta-value").text();
                let year = "";
                if (dateandTime.split(" ").includes("")) {
                    year = dateandTime.split(" ")[5];
                } else {
                    year = dateandTime.split(" ")[4];
                }
                const comments = $(".push");
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
                    await delay();
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
        const arrUrl = [{ url: "https://www.ptt.cc/bbs/MakeUp/index.html", page: 3 }, { url: "https://www.ptt.cc/bbs/BeautySalon/index.html", page: 3 }];
        for (const k in arrUrl) {
            const mainUrl = arrUrl[k].url;
            const letters = mainUrl.split("/");
            let channel = "";
            if (letters.includes("BeautySalon")) {
                channel = "Ptt > BeautySalon";
            } else {
                channel = "Ptt > Makeup";
            }

            // for loop to crawl article list and the URL of the previous page
            let pageURL = arrUrl[k].url;
            for (let i = 0; i < arrUrl[k].page; i++) {
                console.log("page: " + i + " in " + arrUrl[k].page);
                const result = await pttCrawler(pageURL);
                pageURL = result.lastURL;
                // for loop to crawl the author, title, time, and content of each page
                for (const j in result.info) {
                    const crawlerInfo = [];
                    const link = result.info[j].link;
                    console.log(link);
                    const push = result.info[j].push;
                    const detail = await pttCrawlerContent(`https://www.ptt.cc${link}`);
                    console.log(`title: ${detail[1]}`);
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
                        await delay();
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
                        const checkResult = await crawlerModel.checkCrawlerInfo(`https://www.ptt.cc${link}`);
                        if (checkResult.length === 0) {
                            await crawlerModel.createCrawlerInfo(crawlerInfo);
                        } else {
                            await crawlerModel.updateCrawlerInfo(crawlerInfo, `https://www.ptt.cc${link}`);
                        }
                    }
                }
            }
            console.log("finished");
        }
    } catch (err) {
        console.log("test21");
        console.log(err);
    }
}

async function alterEmotion () {
    await googleEmotion.modifiedEmotion();
    console.log("modified");
}

async function getNegativeInfo () {
    const negativeInfo = await negativeModel.insertAllNegative();
    console.log(negativeInfo);
}

cron.schedule("00 12 * * *", async () => {
    await getPtt();
    await alterEmotion();
    await getNegativeInfo();
});
