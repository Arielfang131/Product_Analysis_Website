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

function render (info) {
    const contents = document.getElementById("contents");
}

ajaxTopic("/api/1.0/profile", getTopic);

const checkboxTwo = document.querySelectorAll("#cbox2");
const checkboxThree = document.querySelectorAll("#cbox3");

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
    });
}

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
    const content = document.querySelectorAll(".content");
    const noContent = document.getElementById("noContent");
    if (noContent) {
        noContent.remove();
    }

    for (let i = 0; i < content.length; i++) {
        content[i].remove();
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
        alert("請選擇主題");
        return;
    }
    for (let i = 0; i < checkboxTwo.length; i++) {
        if (checkboxTwo[i].checked === true) {
            timeValue = checkboxTwo[i].value;
            selectTime += 1;
        }
    }
    if (selectTime === 0) {
        alert("請選擇期間");
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

    const date = new Date();
    let dateInfo = "";
    const dateString = date.getDate().toString();
    if (dateString.length === 1) {
        const dateZero = ("0" + dateString);
        dateInfo = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + dateZero;
    } else {
        dateInfo = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    }
    let deadline = "";
    if (timeValue === "0") {
        deadline = dateInfo;
    } else if (timeValue === "7") {
        const nowDate = new Date();
        nowDate.setDate(date.getDate() - 7);
        const nowDateString = nowDate.getDate().toString();
        if (nowDateString.length === 1) {
            const deadlineZero = ("0" + nowDateString);
            deadline = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + deadlineZero;
        } else {
            deadline = nowDate.getFullYear() + "-" + (nowDate.getMonth() + 1) + "-" + nowDate.getDate();
        }
    } else if (timeValue === "15") {
        const nowDate = new Date();
        nowDate.setDate(date.getDate() - 15);
        const nowDateString = nowDate.getDate().toString();
        if (nowDateString.length === 1) {
            const deadlineZero = ("0" + nowDateString);
            deadline = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + deadlineZero;
        } else {
            deadline = nowDate.getFullYear() + "-" + (nowDate.getMonth() + 1) + "-" + nowDate.getDate();
        }
    } else if (timeValue === "30") {
        const nowDate = new Date();
        nowDate.setDate(date.getDate() - 30);
        const nowDateString = nowDate.getDate().toString();
        if (nowDateString.length === 1) {
            const deadlineZero = ("0" + nowDateString);
            deadline = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + deadlineZero;
        } else {
            deadline = nowDate.getFullYear() + "-" + (nowDate.getMonth() + 1) + "-" + nowDate.getDate();
        }
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
    ajax("/api/1.0/contentlist", data, render);
});
