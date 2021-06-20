// ajax to get saved keywords
let admin = "";
function ajax (src, callback, callbackTwo) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const res = JSON.parse(xhr.responseText);
            if (res.msg === "null") {
                Swal.fire({
                    icon: "warning",
                    title: "請先登入會員",
                    confirmButtonText: "確認"
                }).then(() => {
                    window.location.href = "member.html";
                });
            } else {
                const newXhr = new XMLHttpRequest();
                newXhr.onreadystatechange = function () {
                    if (newXhr.readyState === 4 && newXhr.status === 200) {
                        if (res.admin === "yes") {
                            admin = "yes";
                        }
                        const data = JSON.parse(newXhr.responseText);
                        callback(data);
                        if (res.admin === "yes") {
                            callbackTwo();
                        }
                    }
                };
                newXhr.open("GET", "api/1.0/keywords");
                newXhr.setRequestHeader("Content-Type", "application/json");
                const accessToken = localStorage.getItem("access_token");
                newXhr.setRequestHeader("Authorization", "bearer " + accessToken);
                newXhr.send();
            }
        }
    };
    xhr.open("GET", src);
    xhr.setRequestHeader("Content-Type", "application/json");
    const accessToken = localStorage.getItem("access_token");
    xhr.setRequestHeader("Authorization", "bearer " + accessToken);
    xhr.send();
}

// ajax to send keywords
function ajaxKeywords (src, data, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const res = JSON.parse(xhr.responseText);
            if (res.admin === "yes") {
                const newXhr = new XMLHttpRequest();
                newXhr.onreadystatechange = function () {
                    if (newXhr.readyState === 4 && newXhr.status === 200) {
                        const res = JSON.parse(newXhr.responseText);
                        const boxes = document.querySelectorAll(".view_keyword");
                        if (boxes) {
                            for (let i = 0; i < boxes.length; i++) {
                                boxes[i].remove();
                            }
                        }
                        const noResult = document.querySelector(".no_result");
                        if (noResult) {
                            noResult.remove();
                        }
                        callback(res);
                        const insertN = new XMLHttpRequest();
                        insertN.onreadystatechange = function () {
                            if (insertN.readyState === 4 && insertN.status === 200) {
                                // update negative counts
                                const getNeg = new XMLHttpRequest();
                                getNeg.onreadystatechange = function () {
                                    if (getNeg.readyState === 4 && getNeg.status === 200) {
                                        const response = JSON.parse(getNeg.responseText);
                                        const counts = response.length;
                                        localStorage.setItem("negativeCounts", counts);
                                        const deleteItem = document.querySelector("#alert");
                                        if (deleteItem) {
                                            deleteItem.remove();
                                        }
                                        getNegativeCounts();
                                    };
                                };
                                getNeg.open("GET", "api/1.0/negativeContent");
                                getNeg.setRequestHeader("Content-Type", "application/json");
                                const accessToken = localStorage.getItem("access_token");
                                getNeg.setRequestHeader("Authorization", "bearer " + accessToken);
                                getNeg.send();
                            }
                        };
                        insertN.open("GET", "api/1.0/sendNegative");
                        insertN.setRequestHeader("Content-Type", "application/json");
                        insertN.send();
                    } else if (newXhr.readyState === 4 && newXhr.status === 400) {
                        Swal.fire("error");
                    } else if (newXhr.readyState === 4 && newXhr.status === 401) {
                        Swal.fire("請勿包含特殊字元");
                    } else if (newXhr.readyState === 4 && newXhr.status === 403) {
                        Swal.fire("驗證過期，請重新登入");
                    } else if (newXhr.readyState === 4 && newXhr.status === 401.1) {
                        Swal.fire("Unauthorized");
                    }
                };
                newXhr.open("POST", "api/1.0/keywords");
                newXhr.setRequestHeader("Content-Type", "application/json");
                const accessToken = localStorage.getItem("access_token");
                newXhr.setRequestHeader("Authorization", "bearer " + accessToken);
                newXhr.send(JSON.stringify(data));
            }
        }
    };
    xhr.open("GET", src);
    xhr.setRequestHeader("Content-Type", "application/json");
    const accessToken = localStorage.getItem("access_token");
    xhr.setRequestHeader("Authorization", "bearer " + accessToken);
    xhr.send(JSON.stringify(data));
}

// DOM to get saved keywords
function getSavedKeywords (response) {
    const keywordsBox = document.getElementById("view_keywords");
    if (response.length === 0) {
        const noResult = document.createElement("div");
        noResult.className = "no_result";
        noResult.innerHTML = "目前無設定";
        keywordsBox.append(noResult);
    }
    for (const i in response) {
        const keywordBox = document.createElement("div");
        keywordBox.className = "view_keyword";
        keywordBox.id = `${response[i].topicId}`;
        const topicBox = document.createElement("div");
        topicBox.className = "view_topic";
        topicBox.innerText = response[i].topicName;
        const keywordList = document.createElement("div");
        keywordList.className = "keyword_list";
        const keywords = response[i].keywords;
        const symbols = response[i].symbols;
        const symbolsArr = symbols.split(",");
        const firstArr = (keywords.split("+")[0]).split(",");
        const secondArr = (keywords.split("+")[1]).split(",");

        let firstString = `${firstArr[0]} `;
        firstString += `${symbolsArr.shift()} `;

        // If secondArr is empty, it does not need to be displayed
        if (secondArr[0] !== "") {
            let secondString = "";
            if (secondArr.length === 1) {
                secondString = secondArr[0];
            } else {
                secondString = "( ";
                for (const k in secondArr) {
                    if (parseInt(k) === (secondArr.length - 1)) {
                        secondString += `${secondArr[k]} `;
                        secondString += ") ";
                        continue;
                    }
                    secondString += `${secondArr[k]} `;
                    secondString += `${symbolsArr.shift()} `;
                }
            }
            keywordList.innerHTML = firstString + secondString;
        } else {
            keywordList.innerHTML = firstString;
        }
        if (admin === "yes") {
            const remove = document.createElement("div");
            remove.className = "remove";
            remove.innerHTML = `<img id=${response[i].topicId} class="icon_trash" src="./styles/images/trash.png" title="刪除">`;
            keywordBox.append(topicBox, keywordList, remove);
        } else {
            keywordBox.append(topicBox, keywordList);
        }
        keywordsBox.append(keywordBox);
    }
    // delete keywords button
    const trash = document.querySelectorAll(".icon_trash");
    for (let i = 0; i < trash.length; i++) {
        trash[i].addEventListener("click", function (event) {
            Swal.fire({
                title: "確定刪除?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "刪除",
                cancelButtonText: "取消"
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire(
                        "刪除成功!"
                    );

                    const parentElement = document.querySelectorAll(".view_keyword");
                    let data = {};
                    for (let j = 0; j < parentElement.length; j++) {
                        if (event.target.id === parentElement[j].id) {
                            data = {
                                topicId: event.target.id
                            };
                            parentElement[j].remove();
                        }
                    }
                    calculateNumber();
                    const xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === 4 && xhr.status === 200) {
                            const insertN = new XMLHttpRequest();
                            insertN.onreadystatechange = function () {
                                if (insertN.readyState === 4 && insertN.status === 200) {
                                    // update negative counts
                                    const getNeg = new XMLHttpRequest();
                                    getNeg.onreadystatechange = function () {
                                        if (getNeg.readyState === 4 && getNeg.status === 200) {
                                            const response = JSON.parse(getNeg.responseText);
                                            const counts = response.length;
                                            localStorage.setItem("negativeCounts", counts);
                                            const deleteItem = document.querySelector("#alert");
                                            if (deleteItem) {
                                                deleteItem.remove();
                                            }
                                            getNegativeCounts();
                                        };
                                    };
                                    getNeg.open("GET", "api/1.0/negativeContent");
                                    getNeg.setRequestHeader("Content-Type", "application/json");
                                    const accessToken = localStorage.getItem("access_token");
                                    getNeg.setRequestHeader("Authorization", "bearer " + accessToken);
                                    getNeg.send();
                                }
                            };
                            insertN.open("GET", "api/1.0/sendNegative");
                            insertN.setRequestHeader("Content-Type", "application/json");
                            insertN.send();
                        }
                    };
                    xhr.open("POST", "api/1.0/deleteKeywords");
                    xhr.setRequestHeader("Content-Type", "application/json");
                    xhr.send(JSON.stringify(data));
                    const newParentElement = document.querySelectorAll(".view_keyword");
                    if (newParentElement.length === 0) {
                        const noResult = document.createElement("div");
                        noResult.className = "no_result";
                        noResult.innerHTML = "目前無設定";
                        keywordsBox.append(noResult);
                    }
                }
            });
        });
    }
}

ajax("api/1.0/profile", getSavedKeywords, modifiedKeywords);

function calculateNumber () {
    const viewBoxes = document.querySelectorAll(".view_keyword");
    const topic = document.querySelectorAll(".topic");
    for (let i = 0; i < topic.length; i++) {
        topic[i].value = `群組${(viewBoxes.length + i + 1)}`;
    }
}

// Add input keywords field
function inputKeywords () {
    const ajaxBox = document.getElementById("ajax");
    const inputBoxes = document.querySelectorAll(".keywords_box");
    const viewBoxes = document.querySelectorAll(".view_keyword");
    const boxesLength = inputBoxes.length;
    const keywordsBox = document.createElement("div");
    keywordsBox.className = "keywords_box";
    const count = document.querySelectorAll(".keywords_box");
    const id = count.length + 1;
    keywordsBox.id = id;
    const addItem = document.createElement("div");
    addItem.className = "add";
    addItem.innerHTML = "<img class=\"icon_add\" src=\"./styles/images/add.png\" title=\"新增\">";
    const deleteItem = document.createElement("div");
    deleteItem.innerHTML = "<img class=\"delete\" src=\"./styles/images/trash.png\" title=\"刪除\">";
    const topic = document.createElement("input");
    topic.value = `群組${(inputBoxes.length + viewBoxes.length + 1)}`;
    topic.type = "text";
    topic.className = "topic";
    const keyword1 = document.createElement("input");
    keyword1.type = "text";
    keyword1.className = `keyword${boxesLength + 1}`;
    keyword1.placeholder = "必填：品牌";
    const select3 = document.createElement("select");
    select3.className = `symbol${boxesLength + 1}`;
    select3.id = "symbol";
    const option5 = document.createElement("option");
    option5.value = "and";
    option5.text = "and";
    const option6 = document.createElement("option");
    option6.value = "or";
    option6.text = "or";
    select3.append(option5, option6);
    const brackets3 = document.createElement("div");
    brackets3.className = "brackets";
    brackets3.innerHTML = "(";
    const keyword4 = document.createElement("input");
    keyword4.type = "text";
    keyword4.className = `keyword${boxesLength + 1}`;
    keyword4.placeholder = "選填，建議可填產品";
    const select4 = document.createElement("select");
    select4.className = `symbol${boxesLength + 1}`;
    select4.id = "symbol2";
    const option7 = document.createElement("option");
    option7.value = "or";
    option7.text = "or";
    const option8 = document.createElement("option");
    option8.value = "and";
    option8.text = "and";
    select4.append(option7, option8);
    const keyword5 = document.createElement("input");
    keyword5.type = "text";
    keyword5.className = `keyword${boxesLength + 1}`;
    const select5 = document.createElement("select");
    select5.className = `symbol${boxesLength + 1}`;
    select5.id = "symbol3";
    const option9 = document.createElement("option");
    option9.value = "or";
    option9.text = "or";
    const option10 = document.createElement("option");
    option10.value = "and";
    option10.text = "and";
    select5.append(option9, option10);
    const keyword6 = document.createElement("input");
    keyword6.type = "text";
    keyword6.className = `keyword${boxesLength + 1}`;
    const brackets4 = document.createElement("div");
    brackets4.className = "brackets";
    brackets4.innerHTML = ")";
    keywordsBox.append(addItem, deleteItem, topic, keyword1, select3, brackets3, keyword4, select4, keyword5, select5, keyword6, brackets4);
    addItem.addEventListener("click", function () {
        const button = document.getElementById("button");
        button.remove();
        inputKeywords();
        addButton();
    });
    deleteItem.addEventListener("click", function (event) {
        const allDeleteItems = document.querySelectorAll(".delete");
        if (allDeleteItems.length === 1) {
            Swal.fire("無法刪除最後一項");
        } else {
            const parentElement = deleteItem.parentElement;
            const allElements = document.querySelectorAll(".keywords_box");
            const modifiedLength = allElements.length - parseInt(parentElement.id);
            // modified calssName name
            for (let i = 0; i < modifiedLength; i++) {
                const startDiv = document.getElementById(`${parseInt(parentElement.id) + i + 1}`);
                const modifiedKeyword = startDiv.querySelectorAll(`:scope >.keyword${parseInt(parentElement.id) + i + 1}`);
                const modifiedSymbol = startDiv.querySelectorAll(`:scope >.symbol${parseInt(parentElement.id) + i + 1}`);
                for (let j = 0; j < modifiedKeyword.length; j++) {
                    modifiedKeyword[j].className = `keyword${parseInt(parentElement.id) + i}`;
                    if (j < modifiedKeyword.length - 1) {
                        modifiedSymbol[j].className = `symbol${parseInt(parentElement.id) + i}`;
                    }
                }
            }
            // modified id name
            keywordsBox.remove();
            const update = document.querySelectorAll(".keywords_box");
            for (let i = 0; i < update.length; i++) {
                update[i].id = i + 1;
            }
            calculateNumber();
        }
    });
    ajaxBox.append(keywordsBox);
}

function addButton () {
    const ajaxBox = document.getElementById("ajax");
    const button = document.createElement("button");
    button.type = "button";
    button.id = "button";
    button.className = "btn btn-secondary";
    button.innerHTML = "儲存";
    ajaxBox.append(button);
    // click button to add keywords
    button.addEventListener("click", function () {
        const topicEl = document.querySelectorAll(".topic");
        // Confirm the number of groups and the number of all keywords
        let topicCount = 0;
        let totalKeywordsCount = 0;
        const data = [];
        for (let i = 0; i < topicEl.length; i++) {
            const topic = topicEl[i].value;
            let keywordsCount = 0;
            if (topic !== "" && topic.length <= 50) {
                topicCount += 1;
            }
            if (topic.length > 50) {
                Swal.fire("群組字數不可大於50字");
                return;
            }
            const keywordsEl = document.querySelectorAll(`.keyword${i + 1}`);
            const keywords = [];
            // every keyword
            for (let j = 0; j < keywordsEl.length; j++) {
                const keyword = keywordsEl[j].value;
                if (keyword.length >= 50) {
                    Swal.fire("群組字數不可大於50字");
                    return;
                }
                keywords.push(keyword);
            }
            // every symbol
            const symbolsEl = document.querySelectorAll(`.symbol${i + 1}`);
            const symbols = [];
            for (let k = 0; k < symbolsEl.length; k++) {
                const symbol = symbolsEl[k].value;
                symbols.push(symbol);
            }
            const firstArr = [keywords[0]];
            const secondArr = [keywords[1], keywords[2], keywords[3]];
            // group name is filled, but the first keyword is empty
            if (topic !== "" && keywords[0] === "") {
                Swal.fire("若需設定群組，請於第一個空格內填入一個關鍵字");
                return;
            }
            const newFirst = [];
            const newSecond = [];
            const newSymbols = [];
            keywordsCount += 1;
            totalKeywordsCount += 1;
            // Put the keywords in the new array
            newFirst.push(firstArr[0]);
            // If the second Array is all empty, don’t put the symbol in the middle
            if (keywords[1] !== "" || keywords[2] !== "" || keywords[3] !== "") {
                newSymbols.push(symbols[0]);
            }
            // check second array
            for (let b = 0; b < secondArr.length; b++) {
                // if keyword is empty,skip
                if (secondArr[b] === "") {
                    continue;
                }
                keywordsCount += 1;
                totalKeywordsCount += 1;
                // Determine whether to put the symbol in
                newSecond.push(secondArr[b]);
                if (b !== 0) {
                    newSymbols.push(symbols[b]);
                }
            }
            if (topic === "" && keywordsCount !== 0) {
                Swal.fire("若需設定群組，請填入群組名稱");
                return;
            }

            const finalArr = [];
            finalArr.push(newFirst, newSecond);
            const obj = { topicNumber: (i + 1), topic: topic, keywords: finalArr, symbols: newSymbols };
            data.push(obj);
        }
        if (topicCount === 0 & totalKeywordsCount === 0) {
            Swal.fire("請輸入至少一組群組");
            return;
        }
        const oldKeywords = document.querySelectorAll(".view_keyword");
        const newKeywords = document.querySelectorAll(".keywords_box");
        if ((oldKeywords.length + newKeywords.length) > 6) {
            Swal.fire("最多只能有六個群組，請刪減");
            return;
        }
        Swal.fire("已儲存，請至文章列表搜尋內容");
        ajaxKeywords("/api/1.0/profile", data, getSavedKeywords);
        const items = document.querySelectorAll(".keywords_box");
        const viewBoxes = document.querySelectorAll(".view_keyword");
        if (items) {
            const keyword1 = document.querySelectorAll(".keyword1");
            const topic = document.querySelectorAll(".topic");
            for (let i = 0; i < keyword1.length; i++) {
                if (topic[i]) {
                    topic[i].value = `群組${viewBoxes.length + items.length + 1}`;
                }
                keyword1[i].value = "";
            }
            for (let i = 1; i < items.length; i++) {
                items[i].remove();
            }
        }
    });
}

function modifiedKeywords () {
    const ajaxBox = document.getElementById("ajax");
    const text = document.createElement("div");
    text.className = "text";
    text.innerHTML = "新增/修改關鍵字：最多六組";
    ajaxBox.append(text);
    inputKeywords();
    addButton();
}

// The rule is hidden by default, click to open
const ruleDetails = document.getElementById("rule_details");
ruleDetails.style.display = "none";
const question = document.getElementById("icon_question");
question.addEventListener("click", () => {
    if (ruleDetails.style.display === "none") {
        ruleDetails.style.display = "block";
    } else {
        ruleDetails.style.display = "none";
    }
});

// get negative counts
function getNegativeCounts () {
    const negativeCounts = localStorage.getItem("negativeCounts");
    if (parseInt(negativeCounts) > 0) {
        const alertElement = document.createElement("div");
        alertElement.id = "alert";
        alertElement.innerHTML = negativeCounts;
        const parentElement = document.getElementById("little_menu");
        parentElement.append(alertElement);
    }
}
getNegativeCounts();

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
