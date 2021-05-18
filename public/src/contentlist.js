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

function render (info) {
    const contents = document.getElementById("contents");
    for (const i in info) {
        const content = document.createElement("div");
        content.className = "content";
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
        const emotion = document.createElement("div");
        emotion.className = "emotion";
        emotion.innerHTML = `情緒：${info[i].emotion}`;
        information.append(channel, push, likes, author, time, emotion);
        content.append(link, paragraph, information);
        contents.append(content);
    }
}

const checkboxOne = document.querySelectorAll("#cbox1");
const checkboxTwo = document.querySelectorAll("#cbox2");
const checkboxThree = document.querySelectorAll("#cbox3");

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
    let topicId = "";
    let timeValue = "";
    const channel = [];
    // let noSelectTopic = true;
    for (let i = 0; i < checkboxOne.length; i++) {
        if (checkboxOne[i].checked === true) {
            topicId = checkboxOne[i].value;
        // } else {
        //     noSelectTopic = false;
        // }
        }
    }
    // if (noSelectTopic === false) {
    //     alert("請選擇主題");
    //     return;
    // }
    // let noSelectTime = true;
    for (let i = 0; i < checkboxTwo.length; i++) {
        if (checkboxTwo[i].checked === true) {
            timeValue = checkboxTwo[i].value;
        // } else {
        //     noSelectTime = false;
        // }
        }
    }
    // if (noSelectTime === false) {
    //     alert("請選擇時間");
    //     return;
    // }
    for (let i = 0; i < checkboxThree.length; i++) {
        if (checkboxThree[i].checked === true) {
            if (checkboxThree[i].value !== "all") {
                channel.push(checkboxThree[i].value);
            }
        }
    }
    alert("查詢中，請稍等");

    const data = {
        topicId: topicId,
        timeValue: timeValue,
        channel: channel
    };
    ajax("/api/1.0/contentlist", data, render);
});

// ajax("/api/1.0/contentlist",data, render);
