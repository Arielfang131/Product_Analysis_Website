const crawlerModel = require("../models/crawler_model.js");

const request = require("request");
const cheerio = require("cheerio");
// const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// 將英文月份轉成
function getMonthFromString (mon) {
    return new Date(Date.parse(mon + " 1, 2021")).getMonth() + 1;
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

// function dcardCrawler (url) {
//     return new Promise((resolve, reject) => {
//         const request = new XMLHttpRequest();
//         request.open("get", url, true);
//         // 只要讀取資料的話，填null空值即可
//         request.send(null);
//         request.onload = function () {
//             const data = JSON.parse(request.responseText);
//             resolve(data);
//         };
//     });
// }

// let mainUrl = "https://www.ptt.cc/bbs/MakeUp/index.html";
const arrUrl = [{ url: "https://www.ptt.cc/bbs/MakeUp/index.html", page: 2 }, { url: "https://www.ptt.cc/bbs/BeautySalon/index.html", page: 2 }];

async function main (req, res) {
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
            const result = await pttCrawler(pageURL);
            // const lastPageUrl = result.lastURL;
            pageURL = result.lastURL;
            // for迴圈爬取每頁的作者、標題、時間、內容
            for (const j in result.info) {
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
        await crawlerModel.createCrawlerInfo(crawlerInfo);
        // console.log(crawlerInfo);
        crawlerInfos.push(crawlerInfo);
    }
    res.send(crawlerInfos);
}

function dcardCrawler (url) {
    return new Promise((resolve, reject) => {
        request({
            url: url,
            method: "GET"
        }, (err, res, body) => {
            if (err || !body) {
                return;
            }
            const data = body;
            resolve(data);
        });
    });
};

// 爬取Dcard文章列表，標題、id、作者、讚數、留言數
async function getDcard (req, res) {
    const result = [];
    let lastUrl = "https://www.dcard.tw/service/api/v2/forums/makeup/posts?limit=100";
    for (let i = 0; i < 1; i++) {
        const dcardInfo = await dcardCrawler(lastUrl);
        const pageLimit = dcardInfo.length - 1;
        const beforeId = dcardInfo[pageLimit].id;
        lastUrl = `https://www.dcard.tw/service/api/v2/forums/makeup/posts?limit=100&&before=${beforeId}`;
        for (let j = 0; j < dcardInfo.length; j++) {
            const id = dcardInfo[j].id;
            const title = dcardInfo[j].title;
            const author = dcardInfo[j].school;
            const commentCount = dcardInfo[j].commentCount;
            const likeCount = dcardInfo[j].likeCount;
            // 將Dcard的時間戳處理
            const date = new Date(dcardInfo[j].createdAt);
            const dateInfo = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
            const timeDetail = date.toTimeString();
            const timeInfo = timeDetail.split(" ")[0];
            const time = dateInfo + " " + timeInfo;
            // 選取文章id後，進到文章內頁爬文
            const contentUrl = `https://www.dcard.tw/service/api/v2/posts/${id}`;
            const contentInfo = await dcardCrawler(contentUrl);
            const content = contentInfo.content;
            const data = {
                author: author,
                title: title,
                time: time,
                push: commentCount,
                likes: likeCount,
                channel: "Dcard > 美妝",
                link: `https://www.dcard.tw/f/makeup/p/${id}`,
                article: content

            };
            result.push(data);
            // const commentsUrl = `https://www.dcard.tw/service/api/v2/posts/${id}/comments`;
            const commentsUrl = "https://www.dcard.tw/service/api/v2/posts/235957965/comments";
            const commentsData = await dcardCrawler(commentsUrl);
            data.comments = [];
            for (const k in commentsData) {
                const comment = commentsData[k].content;
                const commentDate = new Date(commentsData[k].createdAt);
                const commentDateInfo = commentDate.getFullYear() + "-" + (commentDate.getMonth() + 1) + "-" + commentDate.getDate();
                const commentTimeDetail = commentDate.toString();
                const commentTimeInfo = commentTimeDetail.split(" ")[0];
                const commentTime = commentDateInfo + " " + commentTimeInfo;
                const commentSchool = commentsData[k].school;
                const commentLikeCount = commentsData[k].likeCount;
                const object = {
                    commentAuthor: commentSchool,
                    comment: comment,
                    commentTime: commentTime,
                    commentLikeCount: commentLikeCount
                };
                data.comments.push(object);
            }
        }
    }
    console.log(result);
    res.send(result);
}

module.exports = {
    main,
    getDcard
};
