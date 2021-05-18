const crawlerModel = require("../models/crawler_model.js");

const request = require("request");
const cheerio = require("cheerio");
const randomUseragent = require("random-useragent");

// 將英文月份轉成
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
function pttCrawlerPush (url) {
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
                const dateandTime = list.eq(2).find(".article-meta-value").text();
                const year = dateandTime.split(" ")[4];
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
                    const data = {
                        commentAuthor: commentAuthor,
                        comment: comment,
                        commentTime: time
                    };
                    ans.push(data);
                }
                resolve(ans);
            });
        };
        crawler();
    });
}

const arrUrl = [{ url: "https://www.ptt.cc/bbs/MakeUp/index.html", page: 2 }, { url: "https://www.ptt.cc/bbs/BeautySalon/index.html", page: 2 }];

async function getPtt (req, res) {
    const crawlerInfos = [];
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
        const crawlerInfo = [];
        // for迴圈爬取多頁的文章列表和上一頁的URL
        let pageURL = arrUrl[k].url;
        for (let i = 0; i < arrUrl[k].page; i++) {
            await delay();
            const result = await pttCrawler(pageURL);
            // const lastPageUrl = result.lastURL;
            pageURL = result.lastURL;
            // for迴圈爬取每頁的作者、標題、時間、內容
            for (const j in result.info) {
                await delay();
                // for (let j = 0; j < 3; j++) {
                const link = result.info[j].link;
                const push = result.info[j].push;
                const detail = await pttCrawlerContent(`https://www.ptt.cc${link}`);
                const commentsInfo = await pttCrawlerPush(`https://www.ptt.cc${link}`);
                if (detail.length === 4) {
                    const monthEnglish = detail[2].split(" ")[1];
                    const month = getMonthFromString(monthEnglish);
                    const year = detail[2].split(" ")[4];
                    const day = detail[2].split(" ")[2];
                    const timeDetail = detail[2].split(" ")[3];
                    const timeSeg = timeDetail.split(":");
                    const time = year + "-" + month + "-" + day + " " + (timeSeg.slice(0, 2).join(":"));
                    const obj = {
                        author: detail[0],
                        title: detail[1],
                        time: time,
                        push: push,
                        channel: channel,
                        link: `https://www.ptt.cc${link}`,
                        article: detail[3].article,
                        comments: commentsInfo
                    };
                    crawlerInfo.push(obj);
                }
            }
        }
        const sqlResult = await crawlerModel.createCrawlerInfo(crawlerInfo);
        console.log(sqlResult);
        crawlerInfos.push(crawlerInfo);
    }
    console.log(crawlerInfos);
    res.send(crawlerInfos);
}

module.exports = {
    getPtt
};
