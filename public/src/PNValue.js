function ajaxTopic (src, callback) {
    const newXhr = new XMLHttpRequest();
    newXhr.onreadystatechange = function () {
        if (newXhr.readyState === 4 && newXhr.status === 200) {
            const res = JSON.parse(newXhr.responseText);
            if (res.msg === "null") {
                window.location.href = "member.html";
            } else {
                const xhrSec = new XMLHttpRequest();
                xhrSec.onreadystatechange = function () {
                    if (xhrSec.readyState === 4 && xhrSec.status === 200) {
                        const response = JSON.parse(xhrSec.responseText);
                        callback(response);
                    }
                };
                xhrSec.open("GET", "api/1.0/PNValue");
                xhrSec.setRequestHeader("Content-Type", "application/json");
                const accessToken = localStorage.getItem("access_token");
                xhrSec.setRequestHeader("Authorization", "bearer " + accessToken);
                xhrSec.send();
            }
        }
    };
    newXhr.open("GET", src);
    newXhr.setRequestHeader("Content-Type", "application/json");
    const accessToken = localStorage.getItem("access_token");
    newXhr.setRequestHeader("Authorization", "bearer " + accessToken);
    newXhr.send();
}

// 點選篩選條件，取得正負評、中立數量
function ajax (src, data, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(JSON.parse(xhr.responseText));
            // console.log(JSON.parse(xhr.responseText));
        }
    };
    xhr.open("POST", src);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(data));
}

// // 取得正負評、中立文章列表
// function ajaxContent (src) {
//     const xhr = new XMLHttpRequest();
//     xhr.onreadystatechange = function () {
//         if (xhr.readyState === 4 && xhr.status === 200) {
//             // callback(JSON.parse(xhr.responseText));
//             console.log(JSON.parse(xhr.responseText));
//         }
//     };
//     xhr.open("GET", src);
//     xhr.setRequestHeader("Content-Type", "application/json");
//     xhr.send();
// }

function getTopic (data) {
    const littleBox = document.querySelectorAll(".littleBox");
    const parentElement = littleBox[0];
    if (data.length === 0) {
        const noResult = document.createElement("div");
        noResult.innerHTML = "無主題，請先設定主題";
        parentElement.append(noResult);
    }
    for (let i = 0; i < data.length; i++) {
        const input = document.createElement("input");
        input.type = "checkbox";
        input.id = "cbox1";
        input.name = `cbox1_option_${(i + 1)}`;
        const label = document.createElement("label");
        input.value = data[i].topicId;
        label.innerHTML = `${data[i].topicName}<br>`;
        parentElement.append(input, label);
    }
    const checkboxOne = document.querySelectorAll("#cbox1");
    // 選項只能單選
    for (let i = 0; i < checkboxOne.length; i++) {
        checkboxOne[i].addEventListener("change", function (event) {
            for (let j = 0; j < checkboxOne.length; j++) {
                if (checkboxOne[j].name === event.target.name) {
                    checkboxOne[j].checked = true;
                } else {
                    checkboxOne[j].checked = false;
                }
            }
        });
    }
}

// 正、負、中立文章列表DOM
function contentInfo (info) {
    const details = document.getElementById("details");

    if (info.length === 0) {
        const noContent = document.createElement("div");
        noContent.id = "noContent";
        noContent.innerHTML = "<h3>沒有符合的內容</h3>";
        details.append(noContent);
    }
    for (const i in info) {
        const detail = document.createElement("div");
        detail.className = "detail";
        // const contentTitle = document.createElement("div");
        const link = document.createElement("a");
        link.className = "content_title";
        link.innerHTML = `${info[i].title}`;
        link.href = `${info[i].link}`;
        link.target = "_blank";
        // contentTitle.innerHTML = `${info[i].title} <a href = ${info[i].link}>`;
        const paragraph = document.createElement("div");
        paragraph.className = "paragraph";
        const tag = document.createElement("div");
        tag.className = "tag";
        tag.innerHTML = `${info[i].body_textORcomment}`;
        const article = document.createElement("div");
        article.className = "article";
        const str = `${info[i].content}`;
        if (str.length > 200) {
            article.innerHTML = `${info[i].content}`.substring(0, 200) + "...(更多)"; ;
        } else {
            article.innerHTML = `${info[i].content}`;
        }
        paragraph.append(tag, article);
        const information = document.createElement("div");
        information.className = "information";
        const channel = document.createElement("div");
        channel.className = "channel";
        channel.innerHTML = `${info[i].channel}`;
        const push = document.createElement("div");
        push.className = "push";
        if (info[i].push_number === null) {
            push.innerHTML = "共0則推文";
        } else {
            push.innerHTML = `共${info[i].push_number}則推文`;
        }
        const likes = document.createElement("div");
        likes.className = "likes";
        if (info[i].likes_number === null) {
            likes.innerHTML = "共0個讚";
        } else {
            likes.innerHTML = `共${info[i].likes_number}個讚`;
        }
        const author = document.createElement("div");
        author.className = "author";
        author.innerHTML = `作者：${info[i].author}`;
        const time = document.createElement("div");
        time.className = "time";
        time.innerHTML = `時間：${info[i].time}`;
        const emotionInfo = document.createElement("div");
        emotionInfo.className = "emotion_info";
        const rawEmotion = info[i].emotion;
        const float = parseFloat(rawEmotion);
        const emotionFinal = float.toFixed(2); ;
        if (emotionFinal > 0.25) {
            emotionInfo.innerHTML = "情緒：正面";
        } else if (emotionFinal >= -0.25 && emotionFinal <= 0.25) {
            emotionInfo.innerHTML = "情緒：中立";
        } else if (emotionFinal < -0.25) {
            emotionInfo.innerHTML = "情緒：負面";
        } else {
            emotionInfo.innerHTML = "情緒：舊資料";
        }
        information.append(channel, push, likes, author, time, emotionInfo);
        detail.append(link, paragraph, information);
        details.append(detail);
    }
}

// 取得正負評數字
function getPNValue (info) {
    const loading = document.getElementById("loading");
    loading.style = "display:none";
    const contents = document.getElementById("contents");
    const positive = document.createElement("div");
    positive.className = "emotion";
    const neutral = document.createElement("div");
    neutral.className = "emotion";
    const negative = document.createElement("div");
    negative.className = "emotion";
    positive.innerHTML = `正評：${info.positive}`;
    neutral.innerHTML = `中立：${info.neutral}`;
    negative.innerHTML = `負評：${info.negative}`;
    const valueElement = document.createElement("div");
    valueElement.className = "value";
    const PNValue = (parseInt(info.positive) / parseInt(info.negative)).toFixed(2);
    if (isNaN(PNValue)) {
        valueElement.innerHTML = "正負PN值：0";
    } else if (parseInt(info.positive) >= 1 && parseInt(info.negative) === 0) {
        valueElement.innerHTML = "沒有負評";
    } else {
        valueElement.innerHTML = `正負PN值：${PNValue}`;
    }
    contents.append(positive, neutral, negative, valueElement);

    // 點選正評、中立、負評出現文章列表
    const emotionButton = document.querySelectorAll(".emotion");

    // 正評Button
    emotionButton[0].addEventListener("click", function () {
        const removeDetails = document.querySelectorAll(".detail");
        const noContent = document.getElementById("noContent");
        if (noContent) {
            noContent.remove();
        }
        for (let i = 0; i < removeDetails.length; i++) {
            removeDetails[i].remove();
        }
        contentInfo(info.positiveInfo);
    });
    // 中立Button
    emotionButton[1].addEventListener("click", function () {
        const noContent = document.getElementById("noContent");
        if (noContent) {
            noContent.remove();
        }
        const removeDetails = document.querySelectorAll(".detail");
        for (let i = 0; i < removeDetails.length; i++) {
            removeDetails[i].remove();
        }
        contentInfo(info.neutralInfo);
    });
    // 負面Button
    emotionButton[2].addEventListener("click", function () {
        const noContent = document.getElementById("noContent");
        if (noContent) {
            noContent.remove();
        }
        const removeDetails = document.querySelectorAll(".detail");
        for (let i = 0; i < removeDetails.length; i++) {
            removeDetails[i].remove();
        }
        contentInfo(info.negativeInfo);
    });
}

ajaxTopic("/api/1.0/profile", getTopic);

const checkboxTwo = document.querySelectorAll("#cbox2");
const checkboxThree = document.querySelectorAll("#cbox3");
const startDate = document.getElementById("cbox2_start");
const endDate = document.getElementById("cbox2_end");

// 時間只能單選
for (let i = 0; i < checkboxTwo.length; i++) {
    checkboxTwo[i].addEventListener("change", function (event) {
        for (let j = 0; j < checkboxTwo.length; j++) {
            if (checkboxTwo[j].name === event.target.name) {
                checkboxTwo[j].checked = true;
            } else {
                checkboxTwo[j].checked = false;
            }
        }
        if (checkboxTwo[0].checked === true || checkboxTwo[1].checked === true || checkboxTwo[2].checked === true || checkboxTwo[3].checked === true) {
            checkboxTwo[4].selectedIndex = 0;
            startDate.value = "";
            endDate.value = "";
        }
        if (checkboxTwo[4].checked === true) {
            startDate.value = "";
            endDate.value = "";
        }
    });
}
// 自選日期被點選後，前面的點選都回到預設值
startDate.addEventListener("click", () => {
    for (let i = 0; i < checkboxTwo.length; i++) {
        checkboxTwo[i].checked = false;
        checkboxTwo[4].selectedIndex = 0;
    }
});

endDate.addEventListener("click", () => {
    for (let i = 0; i < checkboxTwo.length; i++) {
        checkboxTwo[i].checked = false;
        checkboxTwo[4].selectedIndex = 0;
    }
});

// 頻道點選全選，再點取消全選
for (let i = 0; i < checkboxThree.length; i++) {
    checkboxThree[i].addEventListener("change", function (event) {
        const isNotChecked = event.target.name === "cbox3_option1" && event.target.checked === true;
        const isChecked = event.target.name === "cbox3_option1" && event.target.checked === false;
        if (isChecked) {
            for (let j = 0; j < checkboxThree.length; j++) {
                checkboxThree[j].checked = false;
            }
        } else if (isNotChecked) {
            for (let j = 0; j < checkboxThree.length; j++) {
                checkboxThree[j].checked = true;
            }
        }
    });
}

const button = document.getElementById("button");
button.addEventListener("click", function (event) {
    const emotion = document.querySelectorAll(".emotion");
    const value = document.querySelector(".value");
    for (let i = 0; i < emotion.length; i++) {
        emotion[i].remove();
    }
    if (value) {
        value.remove();
    }
    const removeDetails = document.querySelectorAll(".detail");
    const noContent = document.getElementById("noContent");
    if (noContent) {
        noContent.remove();
    }
    for (let i = 0; i < removeDetails.length; i++) {
        removeDetails[i].remove();
    }
    const checkboxOne = document.querySelectorAll("#cbox1");
    let topicId = "";
    let timeValue = "";
    const channel = [];
    let selectTopic = 0;
    let selectTime = 0;
    let selectChannel = 0;
    for (let i = 0; i < checkboxOne.length; i++) {
        if (checkboxOne[i].checked === true) {
            topicId = checkboxOne[i].value;
            selectTopic += 1;
        }
    }
    if (selectTopic === 0) {
        alert("請選擇群組");
        return;
    }
    if (startDate.value !== "" && endDate.value === "") {
        alert("請選擇結束日期");
        return;
    }
    if (startDate.value === "" && endDate.value !== "") {
        alert("請選擇起始日期");
        return;
    }
    for (let i = 0; i < checkboxTwo.length; i++) {
        if (checkboxTwo[i].checked === true) {
            timeValue = checkboxTwo[i].value;
            selectTime += 1;
        }
    }
    if (selectTime === 0 && startDate.value === "" && endDate.value === "") {
        alert("請選擇期間");
        return;
    }
    if (Date.parse(startDate.value).valueOf() > Date.parse(endDate.value).valueOf()) {
        alert("起始日期不可大於結束日期");
        return;
    }
    // 定義當日
    const date = new Date();
    let dateInfo = "";
    const dateString = date.getDate().toString();
    if (dateString.length === 1) {
        const dateZero = ("0" + dateString);
        dateInfo = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + dateZero;
    } else {
        dateInfo = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    }
    if (Date.parse(startDate.value).valueOf() > Date.parse(dateInfo).valueOf()) {
        alert("起始日期不可大於今天");
        return;
    }
    const monthElement = document.querySelector(".month");
    const month = monthElement.value;
    function getMonthFromString (mon) {
        return new Date(Date.parse(mon + " 1, 2021")).getMonth() + 1;
    }
    const nowMonth = (new Date().getMonth() + 1);
    if (getMonthFromString(month) > nowMonth) {
        alert("月份不可大於當月");
        return;
    }
    for (let i = 0; i < checkboxThree.length; i++) {
        if (checkboxThree[i].checked === true) {
            selectChannel += 1;
            if (checkboxThree[i].value !== "all") {
                channel.push(checkboxThree[i].value);
            }
        }
    }
    if (selectChannel === 0) {
        alert("請選擇來源");
        return;
    }

    // alert("查詢中，請稍等");

    let deadline = "";
    if (timeValue === "3") {
        const nowDate = new Date();
        nowDate.setDate(date.getDate() - 3);
        const nowDateString = nowDate.getDate().toString();
        if (nowDateString.length === 1) {
            const deadlineZero = ("0" + nowDateString);
            deadline = date.getFullYear() + "-" + (nowDate.getMonth() + 1) + "-" + deadlineZero;
        } else {
            deadline = nowDate.getFullYear() + "-" + (nowDate.getMonth() + 1) + "-" + nowDate.getDate();
        }
    } else if (timeValue === "7") {
        const nowDate = new Date();
        nowDate.setDate(date.getDate() - 7);
        const nowDateString = nowDate.getDate().toString();
        if (nowDateString.length === 1) {
            const deadlineZero = ("0" + nowDateString);
            deadline = date.getFullYear() + "-" + (nowDate.getMonth() + 1) + "-" + deadlineZero;
        } else {
            deadline = nowDate.getFullYear() + "-" + (nowDate.getMonth() + 1) + "-" + nowDate.getDate();
        }
    } else if (timeValue === "15") {
        const nowDate = new Date();
        nowDate.setDate(date.getDate() - 15);
        const nowDateString = nowDate.getDate().toString();
        if (nowDateString.length === 1) {
            const deadlineZero = ("0" + nowDateString);
            deadline = date.getFullYear() + "-" + (nowDate.getMonth() + 1) + "-" + deadlineZero;
        } else {
            deadline = nowDate.getFullYear() + "-" + (nowDate.getMonth() + 1) + "-" + nowDate.getDate();
        }
    } else if (timeValue === "30") {
        const nowDate = new Date();
        nowDate.setDate(date.getDate() - 30);
        const nowDateString = nowDate.getDate().toString();
        if (nowDateString.length === 1) {
            const deadlineZero = ("0" + nowDateString);
            deadline = date.getFullYear() + "-" + (nowDate.getMonth() + 1) + "-" + deadlineZero;
        } else {
            deadline = nowDate.getFullYear() + "-" + (nowDate.getMonth() + 1) + "-" + nowDate.getDate();
        }
    } else if (timeValue === "Jan") {
        dateInfo = "2021-1-31";
        deadline = "2021-1-01";
    } else if (timeValue === "Feb") {
        dateInfo = "2021-2-28";
        deadline = "2021-2-01";
    } else if (timeValue === "Mar") {
        dateInfo = "2021-3-31";
        deadline = "2021-3-01";
    } else if (timeValue === "Apr") {
        dateInfo = "2021-4-30";
        deadline = "2021-4-01";
    } else if (timeValue === "May") {
        dateInfo = "2021-5-31";
        deadline = "2021-5-01";
    } else if (timeValue === "June") {
        dateInfo = "2021-6-30";
        deadline = "2021-6-01";
    } else if (timeValue === "July") {
        dateInfo = "2021-7-31";
        deadline = "2021-7-01";
    } else if (timeValue === "Aug") {
        dateInfo = "2021-8-31";
        deadline = "2021-8-01";
    } else if (timeValue === "Sep") {
        dateInfo = "2021-9-30";
        deadline = "2021-9-01";
    } else if (timeValue === "Oct") {
        dateInfo = "2021-10-31";
        deadline = "2021-10-01";
    } else if (timeValue === "Nov") {
        dateInfo = "2021-11-30";
        deadline = "2021-11-01";
    } else if (timeValue === "Dec") {
        dateInfo = "2021-12-31";
        deadline = "2021-12-01";
    } else {
        const monthAfter = endDate.value.split("-")[1];
        const monthBefore = startDate.value.split("-")[1];
        const monthEnd = monthAfter.replace(/^[0]/g, "");
        const monthStart = monthBefore.replace(/^[0]/g, "");
        dateInfo = endDate.value.split("-")[0] + "-" + monthEnd + "-" + endDate.value.split("-")[2];
        deadline = startDate.value.split("-")[0] + "-" + monthStart + "-" + startDate.value.split("-")[2];
    }

    const data = {
        topicId: topicId,
        timeValue: timeValue,
        nowTime: dateInfo,
        deadline: deadline,
        channel: channel
    };
    console.log(data);
    const loading = document.getElementById("loading");
    loading.style = "display:block";
    ajax("/api/1.0/PNValue", data, getPNValue);
});

// 取得負評數量
const negativeCounts = localStorage.getItem("negativeCounts");
if (parseInt(negativeCounts) > 0) {
    const alertElement = document.createElement("div");
    alertElement.id = "alert";
    alertElement.innerHTML = negativeCounts;
    const parentElement = document.getElementById("little_menu");
    parentElement.append(alertElement);
}

// When the user scrolls the page, execute myFunction
window.onscroll = function () { myFunction(); };

// Get the navbar
const navbar = document.querySelector(".box1");

// Get the offset position of the navbar
const sticky = navbar.offsetTop;

// Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
function myFunction () {
    const box3 = document.querySelector(".box3");
    if (window.pageYOffset >= sticky) {
        box3.style = "display:flex";
        navbar.classList.add("sticky");
    } else {
        navbar.classList.remove("sticky");
        box3.style = "display:none";
    }
}
