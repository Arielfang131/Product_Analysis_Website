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
                xhrSec.open("GET", "api/1.0/contentlist");
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

ajaxTopic("/api/1.0/profile", getTopic);

const checkboxTwo = document.querySelectorAll("#cbox2");
const checkboxThree = document.querySelectorAll("#cbox3");
// const checkboxFour = document.querySelectorAll("#cbox4");
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
            // startDate.placeholder = "yyyy-mm-dd";
            // endDate.placeholder = "yyyy-mm-dd";
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
    const content = document.getElementById("content");
    const noContent = document.getElementById("noContent");
    if (noContent) {
        noContent.remove();
    }
    if (content) {
        content.remove();
    }
    const checkboxOne = document.querySelectorAll("#cbox1");
    let topicId = "";
    let timeValue = "";
    const channel = [];
    // const emotion = [];
    let selectTopic = 0;
    let selectTime = 0;
    let selectChannel = 0;
    // let selectEmotion = 0;
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
    const month = document.querySelector(".month");
    const nowMonth = (new Date().getMonth() + 1);
    if (parseInt(month.value) > nowMonth) {
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
    alert("查詢中，請稍等");

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
        console.log(nowDateString);
        if (nowDateString.length === 1) {
            const deadlineZero = ("0" + nowDateString);
            deadline = date.getFullYear() + "-" + (nowDate.getMonth() + 1) + "-" + deadlineZero;
        } else {
            deadline = nowDate.getFullYear() + "-" + (nowDate.getMonth() + 1) + "-" + nowDate.getDate();
        }
    } else if (timeValue === "30") {
        const nowDate = new Date();
        nowDate.setDate(date.getDate() - 30);
        // console.log(nowDate.setDate(date.getDate() - 30));
        const nowDateString = nowDate.getDate().toString();
        console.log(nowDateString);
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
        console.log(monthEnd);
        const monthStart = monthBefore.replace(/^[0]/g, "");
        console.log(monthStart);
        dateInfo = endDate.value.split("-")[0] + "-" + monthEnd + "-" + endDate.value.split("-")[2];
        deadline = startDate.value.split("-")[0] + "-" + monthStart + "-" + startDate.value.split("-")[2];
    }
    // const timeDetail = date.toString().split(" ")[4];
    // const timeInfo = timeDetail.split(":").slice(0, 2).join(":");
    // const time = dateInfo + " " + timeInfo;
    const data = {
        topicId: topicId,
        timeValue: timeValue,
        nowTime: dateInfo,
        deadline: deadline,
        channel: channel
    };
    console.log(data);
    ajax("/api/1.0/wordcloud", data, view);
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

function view (response) {
    const contents = document.getElementById("contents");
    if (response.length === 0) {
        const noContent = document.createElement("div");
        noContent.id = "noContent";
        noContent.innerHTML = "<h3>沒有符合的內容<h3>";
        contents.append(noContent);
        return;
    }
    const content = document.createElement("div");
    content.id = "content";
    contents.append(content);
    const options = eval({
        list: response, // 或者[['各位觀衆',45],['詞雲', 21],['來啦!!!',13]],只要格式滿足這樣都可以
        gridSize: 6, // 密集程度 數字越小越密集
        weightFactor: 1, // 字體大小=原始大小*weightFactor
        maxFontSize: 18, // 最大字號
        minFontSize: 3, // 最小字號
        fontWeight: "normal", // 字體粗細
        fontFamily: "Times, serif", // 字體
        color: "random-light" // 字體顏色 'random-dark' 或者 'random-light'
    // backgroundColor: "#333", // 背景顏色
    // rotateRatio: 1 // 字體傾斜(旋轉)概率，1代表總是傾斜(旋轉)
    });
    // WordCloud(test, { list: list });
    WordCloud(content, options);
}

ajax("api/1.0/wordcloud", view);
