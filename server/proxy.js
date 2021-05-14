const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");

const proxys = ["http://tihyjcyk-dest:sr9mbjac4xab@45.130.60.107:9634",
    "http://tihyjcyk-dest:sr9mbjac4xab@185.95.157.117:6138",
    "http://tihyjcyk-dest:sr9mbjac4xab@45.131.212.138:6187",
    "http://tihyjcyk-dest:sr9mbjac4xab@45.92.247.141:6649",
    "http://tihyjcyk-dest:sr9mbjac4xab@45.92.247.241:6749",
    "http://tihyjcyk-dest:sr9mbjac4xab@45.87.249.249:7827",
    "http://tihyjcyk-dest:sr9mbjac4xab@193.151.160.57:8144",
    "http://tihyjcyk-dest:sr9mbjac4xab@193.151.160.143:8230",
    "http://tihyjcyk-dest:sr9mbjac4xab@193.151.161.119:8462",
    "http://tihyjcyk-dest:sr9mbjac4xab@193.151.161.60:8403"];

// request({
//     url: url,
//     method: "GET",
//     headers: {
//         "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36"
//     } // 給個瀏覽器頭，不然網站拒絕訪問
// }, function (error, response, body) {
//     if (!error) {
//         // var $ = cheerio.load(body);
//         // var trs = $("#ip_list tr");
//         for (let i = 1; i < proxys.length; i++) {
//             const proxy = {};
//             tr = trs.eq(i);
//             tds = tr.children("td");
//             proxy.ip = tds.eq(1).text();
//             proxy.port = tds.eq(2).text();
//             let speed = tds.eq(6).children("div").attr("title");
//             speed = speed.substring(0, speed.length - 1);
//             let connectTime = tds.eq(7).children("div").attr("title");
//             connectTime = connectTime.substring(0, connectTime.length - 1);
//             if (speed <= 5 && connectTime <= 1) { // 用速度和連線時間篩選一輪
//                 proxys.push(proxy);
//             }
//         }
//     }
//     check();
// });

/**
 * 過濾無效的代理
 */
function check () {
    // 嘗試請求百度的靜態資源公共庫中的jquery檔案
    const url = "http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js";
    let flag = proxys.length; // 檢查是否所有非同步函式都執行完的標誌量
    for (let i = 0; i < proxys.length; i++) {
        const proxy = proxys[i];
        request({
            url: url,
            proxy: "http://" + proxy.ip + ":" + proxy.port,
            method: "GET",
            timeout: 20000 // 20s沒有返回則視為代理不行
        }, function (error, response, body) {
            if (!error) {
                if (response.statusCode == 200) {
                    // 這裡因為nodejs的非同步特性，不能push(proxy),那樣會存的都是最後一個
                    useful.push(response.request.proxy.href);
                    console.log(response.request.proxy.href, "useful!");
                } else {
                    console.log(response.request.proxy.href, "failed!");
                }
            } else {
                // console.log("One proxy failed!");
            }
            flag--;
            if (flag == 0) {
                saveProxys();
            }
        });
    }
}

/**
 * 把獲取到的有用的代理儲存成json檔案，以便在別處使用
 */
function saveProxys () {
    fs.writeFileSync("proxys.json", JSON.stringify(useful));
    console.log("Save finished!");
}

getXici(); // 啟動這個爬蟲
