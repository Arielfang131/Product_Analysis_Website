const router = require("express").Router();
const request = require("request");
const cheerio = require("cheerio");

router.route("/test").get();

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
                ans.linkArr = [];
                ans.info = [];
                for (let i = 0; i < list.length; i++) {
                    const title = list.eq(i).find(".title a").text();
                    // const author = list.eq(i).find(".meta .author").text();
                    // const date = list.eq(i).find(".meta .date").text();
                    const pushNumber = list.eq(i).find(".nrec").text();
                    const link = list.eq(i).find(".title a").attr("href");
                    ans.linkArr.push(link);
                    const data = {
                        title: title,
                        push: pushNumber,
                        link: link
                    };
                    ans.info.push(data);
                }
                // console.log(ans);
                resolve(ans);
            });
        };
        crawler();
    });
}

// 進入PTT內頁，爬取內容
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

let mainUrl = "https://www.ptt.cc/bbs/MakeUp/index.html";
async function main () {
    const arr = [];
    // for迴圈爬取多頁的文章列表和上一頁的URL
    for (let i = 0; i < 5; i++) {
        const result = await pttCrawler(mainUrl);
        const lastPageUrl = result.lastURL;
        mainUrl = lastPageUrl;
        // for迴圈爬取每頁的作者、標題、時間、內容
        for (const j in result.info) {
            const link = result.info[j].link;
            const push = result.info[j].push;
            const detail = await pttCrawlerContent(`https://www.ptt.cc${link}`);
            // console.log(detail);
            if (detail.length == 4) {
                console.log(detail);
                const obj = {
                    author: detail[0],
                    title: detail[1],
                    time: detail[2],
                    push: push,
                    link: `https://www.ptt.cc${link}`,
                    article: detail[3].article
                };
                arr.push(obj);
            }
        }
    }
    console.log("==============");
    console.log(arr);
}
main();

module.exports = router;
