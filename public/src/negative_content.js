function ajax (src, callback) {
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
                xhrSec.open("GET", "api/1.0/negativeContent");
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

async function getNegativeContent (info) {
    const loading = document.getElementById("loading");
    loading.style = "display:none";
    const parentElement = document.getElementById("main");
    if (info.length === 0) {
        const noContent = document.createElement("div");
        noContent.id = "noContent";
        noContent.innerHTML = "沒有負評內容";
        parentElement.append(noContent);
    }
    for (const i in info) {
        const bigBox = document.createElement("div");
        bigBox.className = "big_box";
        const content = document.createElement("div");
        content.className = "content";
        const link = document.createElement("a");
        link.className = "content_title";
        link.innerHTML = `${info[i].title}`;
        link.href = `${info[i].link}`;
        link.target = "_blank";
        content.append(link);
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
        content.append(timeAndChannel);
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
            push.innerHTML = "<img class=\"icon_comment\" src=\"./styles/images/comment.png\">";
            push.innerHTML += " 0";
        } else {
            push.innerHTML = "<img class=\"icon_comment\" src=\"./styles/images/comment.png\">";
            push.innerHTML += ` ${info[i].push_number}`;
        }
        const author = document.createElement("div");
        author.className = "author";
        author.innerHTML = `作者：${info[i].author}`;
        const emotion = document.createElement("div");
        emotion.className = "emotion";
        const rawEmotion = info[i].emotion;
        const float = parseFloat(rawEmotion);
        const emotionFinal = float.toFixed(2);
        if (emotionFinal > 0.25) {
            emotion.innerHTML = "情緒：正面";
        } else if (emotionFinal >= -0.25 && emotionFinal <= 0.25) {
            emotion.innerHTML = "情緒：中立";
        } else if (emotionFinal < -0.25) {
            emotion.innerHTML = "情緒：負面";
        } else {
            emotion.innerHTML = "情緒：舊資料";
        }
        information.append(author, emotion, push);
        content.append(paragraph, information);
        parentElement.append(content);
    }
}

ajax("api/1.0/profile", getNegativeContent);

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
