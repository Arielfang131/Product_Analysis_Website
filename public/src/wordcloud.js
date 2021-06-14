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
    const parentElement = document.querySelector(".littleBox_topic");
    if (data.length === 0) {
        const noResult = document.createElement("div");
        noResult.innerHTML = "無主題，請先設定主題";
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

// const checkboxTwo = document.querySelectorAll("#cbox2");
const checkboxThree = document.querySelectorAll("#cbox3");
const startDate = document.getElementById("cbox2_start");
const endDate = document.getElementById("cbox2_end");

let timeSeleted = "0"; // 選擇時間區間回傳值
// FOR SELECT DAYS
const selectDays = document.querySelectorAll(".days");
for (let i = 0; i < selectDays.length; i++) {
    selectDays[i].addEventListener("click", (event) => {
        timeSeleted = event.target.id;
        // 初始化
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

        // 初始化
        startDate.value = "";
        endDate.value = "";
        document.querySelector(".day-selected-title").innerHTML = "請選擇時間";
    });
}

// 自選日期被點選後，前面的點選都回到預設值
startDate.addEventListener("click", () => {
    // 初始化
    timeSeleted = "0";
    document.querySelector(".day-selected-title").innerHTML = "請選擇時間";
    document.querySelector(".month-selected-title").innerHTML = "請選擇月份";
});

endDate.addEventListener("click", () => {
    // 初始化
    timeSeleted = "0";
    document.querySelector(".day-selected-title").innerHTML = "請選擇時間";
    document.querySelector(".month-selected-title").innerHTML = "請選擇月份";
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

let count = 0; // counter of button
const button = document.getElementById("button");
button.addEventListener("click", function (event) {
    count += 1;
    if (count === 1) {
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
        const timeValue = timeSeleted;
        const channel = [];
        // const emotion = [];
        let selectTopic = 0;
        let selectChannel = 0;
        // let selectEmotion = 0;
        for (let i = 0; i < checkboxOne.length; i++) {
            if (checkboxOne[i].checked === true) {
                topicId = checkboxOne[i].value;
                selectTopic += 1;
            }
        }
        if (selectTopic === 0) {
            // alert("請選擇群組");
            Swal.fire("請選擇群組");
            count = 0;
            return;
        }
        if (startDate.value !== "" && endDate.value === "") {
            // alert("請選擇結束日期");
            Swal.fire("請選擇結束日期");
            count = 0;
            return;
        }
        if (startDate.value === "" && endDate.value !== "") {
            // alert("請選擇起始日期");
            Swal.fire("請選擇起始日期");
            count = 0;
            return;
        }

        if (timeValue === "0" && startDate.value === "" && endDate.value === "") {
            Swal.fire("請選擇期間");
            count = 0;
            return;
        }

        if (Date.parse(startDate.value).valueOf() > Date.parse(endDate.value).valueOf()) {
            // alert("起始日期不可大於結束日期");
            Swal.fire("起始日期不可大於結束日期");
            count = 0;
            return;
        }

        // 定義當日
        const date = new Date();
        let dateInfo = ""; // 今天日期
        const dateString = date.getDate().toString();
        if (dateString.length === 1) {
            const dateZero = ("0" + dateString);
            dateInfo = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + dateZero;
        } else {
            dateInfo = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        }
        if (Date.parse(startDate.value).valueOf() > Date.parse(dateInfo).valueOf()) {
            // alert("起始日期不可大於今天");
            Swal.fire("起始日期不可大於今天");
            count = 0;
            return;
        }

        // if (Date.parse(endDate.value).valueOf() > Date.parse(dateInfo).valueOf()) {
        //     // alert("起始日期不可大於今天");
        //     Swal.fire("結束日期不可大於今天");
        //     count = 0;
        //     return;
        // }

        // 建議日期不要小於15日
        const beginDay = new Date(startDate.value);
        const finishDay = new Date(endDate.value);
        const difference = finishDay.getTime() - beginDay.getTime();
        if ((difference / (1000 * 3600 * 24)) < 15) {
            // alert("建議日期不要小於15日");
            Swal.fire("建議日期不要小於15日");
            count = 0;
            return;
        }

        if (timeSeleted.length > 1) { // 月份字數必定大於1
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
            // alert("請選擇來源");
            Swal.fire("請選擇來源");
            count = 0;
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
        const loading = document.getElementById("loading");
        loading.style = "display:block";
        ajax("/api/1.0/wordcloud", data, view);
    }
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
    count = 0;
    const loading = document.getElementById("loading");
    loading.style = "display:none";
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
        gridSize: 9, // 密集程度 數字越小越密集
        weightFactor: 1, // 字體大小=原始大小*weightFactor
        maxFontSize: 15, // 最大字號
        minFontSize: 4, // 最小字號
        fontWeight: "normal", // 字體粗細
        fontFamily: "Times, serif", // 字體
        color: "random-light" // 字體顏色 'random-dark' 或者 'random-light'
    });
    WordCloud(content, options);
}

// ajax("api/1.0/wordcloud", view);

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
