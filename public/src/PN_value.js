function ajaxTopic (src, callback) {
    const newXhr = new XMLHttpRequest();
    newXhr.onreadystatechange = function () {
        if (newXhr.readyState === 4 && newXhr.status === 200) {
            const res = JSON.parse(newXhr.responseText);
            if (res.msg === "null") {
                Swal.fire({
                    icon: "warning",
                    title: "請先登入會員",
                    confirmButtonText: "確認"
                }).then(() => {
                    window.location.href = "member.html";
                });
            } else {
                const xhrSec = new XMLHttpRequest();
                xhrSec.onreadystatechange = function () {
                    if (xhrSec.readyState === 4 && xhrSec.status === 200) {
                        const response = JSON.parse(xhrSec.responseText);
                        callback(response);
                    }
                };
                xhrSec.open("GET", "api/1.0/pnValue");
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

// Click on the filter to obtain positive、negative and neutral numbers
function ajax (src, data, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(JSON.parse(xhr.responseText));
        }
    };
    xhr.open("POST", src);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(data));
}

function getTopic (data) {
    const parentElement = document.querySelector(".littleBox_topic");
    if (data.length === 0) {
        const noResult = document.createElement("a");
        noResult.id = "noResult";
        noResult.innerHTML = "請至此設定關鍵字群組";
        noResult.href = "/keywords.html";
        parentElement.append(noResult);
    }
    for (let i = 0; i < data.length; i++) {
        const topicFlex = document.createElement("div");
        topicFlex.className = "topic_flex";
        const input = document.createElement("input");
        input.type = "checkbox";
        input.id = "cbox1";
        input.name = `cbox1_option_${(i + 1)}`;
        const label = document.createElement("label");
        input.value = data[i].topicId;
        label.innerHTML = `${data[i].topicName}`;
        label.className = "label_name";
        topicFlex.append(input, label);
        parentElement.append(topicFlex);
    }
    const checkboxOne = document.querySelectorAll("#cbox1");
    // The topic options can only be single-selected
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

// positvie、negative、neutral content DOM
function getContentInfo (info) {
    const details = document.getElementById("details");

    if (info.length === 0) {
        const noContent = document.createElement("div");
        noContent.id = "noContent";
        noContent.innerHTML = "沒有符合的內容";
        details.append(noContent);
    }
    for (const i in info) {
        const detail = document.createElement("div");
        detail.className = "detail";
        const link = document.createElement("a");
        link.className = "content_title";
        link.innerHTML = `${info[i].title}`;
        link.href = `${info[i].link}`;
        link.target = "_blank";
        detail.append(link);
        const timeAndChannel = document.createElement("div");
        timeAndChannel.className = "timeAndChannel";
        const time = document.createElement("div");
        time.className = "time";
        time.innerHTML = `${info[i].time}`;
        const channel = document.createElement("div");
        channel.innerHTML = `${info[i].channel}`;
        if (`${info[i].channel}`.includes("Makeup")) {
            channel.className = "makeup";
        } else if (`${info[i].channel}`.includes("BeautySalon")) {
            channel.className = "beautysalon";
        }
        timeAndChannel.append(time, channel);
        detail.append(timeAndChannel);
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
        const push = document.createElement("div");
        push.className = "push";
        if (info[i].push_number === null) {
            push.innerHTML = "共0則推文";
        } else {
            push.innerHTML = `共${info[i].push_number}則推文`;
        }
        const author = document.createElement("div");
        author.className = "author";
        author.innerHTML = `作者：${info[i].author}`;
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
        information.append(author, emotionInfo, push);
        detail.append(paragraph, information);
        details.append(detail);
    }
}
let count = 0; // counter of button
// get positive and negative number to calculate PN value
function getPNValue (info) {
    count = 0;
    const loading = document.getElementById("loading");
    loading.style = "display:none";
    const content = document.getElementById("content");
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
    const hover1 = document.createElement("div");
    hover1.className = "hover";
    hover1.style = "display:none";
    hover1.innerHTML = "閱讀正面文章";
    const hover2 = document.createElement("div");
    hover2.className = "hover";
    hover2.style = "display:none";
    hover2.innerHTML = "閱讀中立文章";
    const hover3 = document.createElement("div");
    hover3.className = "hover";
    hover3.style = "display:none";
    hover3.innerHTML = "閱讀負面文章";
    positive.append(hover1);
    neutral.append(hover2);
    negative.append(hover3);
    const pnValue = (parseInt(info.positive) / parseInt(info.negative)).toFixed(2);
    if (isNaN(pnValue)) {
        valueElement.innerHTML = "正負PN值：0";
    } else if (parseInt(info.positive) >= 1 && parseInt(info.negative) === 0) {
        valueElement.innerHTML = "正負PN值：沒有負評";
    } else {
        valueElement.innerHTML = `正負PN值：${pnValue}`;
    }
    content.append(positive, neutral, negative, valueElement);
    positive.addEventListener("mouseover", function () {
        positive.innerHTML = "點選閱讀正評文章";
        positive.style = "cursor: pointer; color:#FFFFFF";
    });
    positive.addEventListener("mouseout", function () {
        positive.innerHTML = `正評：${info.positive}`;
        positive.style = "color:#FFFFFF";
    });
    neutral.addEventListener("mouseover", function () {
        neutral.innerHTML = "點選閱讀中立文章";
        neutral.style = "cursor: pointer;color:#FFFFFF";
    });
    neutral.addEventListener("mouseout", function () {
        neutral.innerHTML = `中立：${info.neutral}`;
        neutral.style = "color:#FFFFFF";
    });
    negative.addEventListener("mouseover", function () {
        negative.innerHTML = "點選閱讀負評文章";
        negative.style = "cursor: pointer;color:#FFFFFF";
    });
    negative.addEventListener("mouseout", function () {
        negative.innerHTML = `負評：${info.negative}`;
        negative.style = "color:#FFFFFF";
    });

    // click buttons to show content
    // positvie Button
    positive.addEventListener("click", function () {
        const removeDetails = document.querySelectorAll(".detail");
        const noContent = document.getElementById("noContent");
        if (noContent) {
            noContent.remove();
        }
        for (let i = 0; i < removeDetails.length; i++) {
            removeDetails[i].remove();
        }
        getContentInfo(info.positiveInfo);
    });
    // neutral Button
    neutral.addEventListener("click", function () {
        const noContent = document.getElementById("noContent");
        if (noContent) {
            noContent.remove();
        }
        const removeDetails = document.querySelectorAll(".detail");
        for (let i = 0; i < removeDetails.length; i++) {
            removeDetails[i].remove();
        }
        getContentInfo(info.neutralInfo);
    });
    // negative Button
    negative.addEventListener("click", function () {
        const noContent = document.getElementById("noContent");
        if (noContent) {
            noContent.remove();
        }
        const removeDetails = document.querySelectorAll(".detail");
        for (let i = 0; i < removeDetails.length; i++) {
            removeDetails[i].remove();
        }
        getContentInfo(info.negativeInfo);
    });
}

ajaxTopic("/api/1.0/profile", getTopic);

const checkboxThree = document.querySelectorAll("#cbox3");
const startDate = document.getElementById("cbox2_start");
const endDate = document.getElementById("cbox2_end");
let timeSeleted = "0"; // default to time selection to zero

// FOR SELECT DAYS
const selectDays = document.querySelectorAll(".days");
for (let i = 0; i < selectDays.length; i++) {
    selectDays[i].addEventListener("click", (event) => {
        timeSeleted = event.target.id;

        // initialization
        startDate.value = "";
        endDate.value = "";
        document.querySelector(".month-selected-title").innerHTML = "請選擇月份";
    });
}

// FOR SELECT MONTH
const selectMonth = document.querySelectorAll(".months");
for (let i = 0; i < selectMonth.length; i++) {
    selectMonth[i].addEventListener("click", (event) => {
        timeSeleted = event.target.id;

        // initialization
        startDate.value = "";
        endDate.value = "";
        document.querySelector(".day-selected-title").innerHTML = "請選擇時間";
    });
}

startDate.addEventListener("click", () => {
    // initialization
    timeSeleted = 0;
    document.querySelector(".day-selected-title").innerHTML = "請選擇時間";
    document.querySelector(".month-selected-title").innerHTML = "請選擇月份";
});

endDate.addEventListener("click", () => {
    // initialization
    timeSeleted = 0;
    document.querySelector(".day-selected-title").innerHTML = "請選擇時間";
    document.querySelector(".month-selected-title").innerHTML = "請選擇月份";
});

// channel can click to select all, and then click to cancel the select all
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

// click button to filter condition
const button = document.getElementById("button");
button.addEventListener("click", function (event) {
    count += 1;
    if (count === 1) {
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
        const timeValue = timeSeleted;
        const channel = [];
        let selectTopic = 0;
        let selectChannel = 0;
        for (let i = 0; i < checkboxOne.length; i++) {
            if (checkboxOne[i].checked === true) {
                topicId = checkboxOne[i].value;
                selectTopic += 1;
            }
        }
        if (selectTopic === 0) {
            Swal.fire("請選擇群組");
            count = 0;
            return;
        }
        if (startDate.value !== "" && endDate.value === "") {
            Swal.fire("請選擇結束日期");
            count = 0;
            return;
        }
        if (startDate.value === "" && endDate.value !== "") {
            Swal.fire("請選擇起始日期");
            count = 0;
            return;
        }
        if (timeSeleted === "0" && startDate.value === "" && endDate.value === "") {
            Swal.fire("請選擇期間");
            count = 0;
            return;
        }
        if (Date.parse(startDate.value).valueOf() > Date.parse(endDate.value).valueOf()) {
            Swal.fire("起始日期不可大於結束日期");
            count = 0;
            return;
        }
        // define today
        const date = new Date();
        let dateInfo = ""; // today
        const dateString = date.getDate().toString();
        if (dateString.length === 1) {
            const dateZero = ("0" + dateString);
            dateInfo = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + dateZero;
        } else {
            dateInfo = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        }
        if (Date.parse(startDate.value).valueOf() > Date.parse(dateInfo).valueOf()) {
            Swal.fire("起始日期不可大於今天");
            count = 0;
            return;
        }

        if (timeSeleted.length > 1) { // month length must larger than one
            function getMonthFromString (mon) {
                return new Date(Date.parse(mon + " 1, 2021")).getMonth() + 1;
            }
            const nowMonth = (new Date().getMonth() + 1);
            if (getMonthFromString(timeSeleted) > nowMonth) {
                Swal.fire("月份不可大於當月");
                count = 0;
                return;
            }
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
            Swal.fire("請選擇來源");
            count = 0;
            return;
        }

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
        const loading = document.getElementById("loading");
        loading.style = "display:block";
        ajax("/api/1.0/pnValue", data, getPNValue);
    }
});

// update negative counts
const negativeCounts = localStorage.getItem("negativeCounts");
if (parseInt(negativeCounts) > 0) {
    const alertElement = document.createElement("div");
    alertElement.id = "alert";
    alertElement.innerHTML = negativeCounts;
    const parentElement = document.getElementById("little_menu");
    parentElement.append(alertElement);
}

// sticky sidebar
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

// jquery
$(".menu1 a").click(function () {
    $(".btn1:first-child").html($(this).text() + " <span class=\"sr-only\"></span>");
});

$(".menu2 a").click(function () {
    $(".btn2:first-child").html($(this).text() + " <span class=\"sr-only\"></span>");
});
