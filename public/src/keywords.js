let admin = "";
function ajax (src, callback, callbackTwo) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const res = JSON.parse(xhr.responseText);
            if (res.msg === "null") {
                window.location.href = "member.html";
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
                            // console.log("hhh");
                            // console.log(insertN.readyState);
                            // console.log(insertN.status);
                            if (insertN.readyState === 4 && insertN.status === 200) {
                                // const test = this.responseText;
                                // console.log(test);
                                // 更新負評數量
                                const getNeg = new XMLHttpRequest();
                                getNeg.onreadystatechange = function () {
                                    if (getNeg.readyState === 4 && getNeg.status === 200) {
                                        const response = JSON.parse(getNeg.responseText);
                                        console.log(response);
                                        const counts = response.length;
                                        localStorage.setItem("negativeCounts", counts);
                                        const deleteItem = document.querySelector("#alert");
                                        deleteItem.remove();
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
                    } else if (newXhr.readyState === 4 && newXhr.status === 404) {
                        Swal.fire("請勿包含特殊字元");
                    } else if (newXhr.readyState === 4 && newXhr.status === 403) {
                        Swal.fire("驗證過期，請重新登入");
                    } else if (newXhr.readyState === 4 && newXhr.status === 401) {
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

// DOM
let oldKeywordsCounts = 0;
function view (response) {
    console.log(response);
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

        // let firstString = "( ";
        // for (const j in firstArr) {
        //     if (parseInt(j) === (firstArr.length - 1)) {
        //         firstString += `${firstArr[j]} `;
        //         firstString += ") ";
        //         firstString += `${symbolsArr.shift()} `;
        //         continue;
        //     }
        let firstString = `${firstArr[0]} `;
        firstString += `${symbolsArr.shift()} `;
        // }
        // 若secondArr是空的，就不需要顯示在前端
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
        // const totalBoxes = document.querySelectorAll(".keywords_box");
        const oldKeywordsBox = document.querySelectorAll(".view_keyword");
        // console.log(totalBoxes.length);
        oldKeywordsCounts = oldKeywordsBox.length;
    }
    // 刪除按鈕
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
                            // console.log("hhh");
                            // console.log(insertN.readyState);
                            // console.log(insertN.status);
                                if (insertN.readyState === 4 && insertN.status === 200) {
                                // const test = this.responseText;
                                // console.log(test);
                                // 更新負評數量
                                    const getNeg = new XMLHttpRequest();
                                    getNeg.onreadystatechange = function () {
                                        if (getNeg.readyState === 4 && getNeg.status === 200) {
                                            const response = JSON.parse(getNeg.responseText);
                                            console.log(response);
                                            const counts = response.length;
                                            localStorage.setItem("negativeCounts", counts);
                                            const deleteItem = document.querySelector("#alert");
                                            deleteItem.remove();
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

ajax("api/1.0/profile", view, modifiedKeywords);

function calculateNumber () {
    // console.log(index);
    // const inputBoxes = document.querySelectorAll(".keywords_box");
    const viewBoxes = document.querySelectorAll(".view_keyword");
    const topic = document.querySelectorAll(".topic");
    for (let i = 0; i < topic.length; i++) {
        // if (index < i) {
        //     topic[i].value = `群組${(inputBoxes.length + viewBoxes.length + 1)}`;
        // } else {
        topic[i].value = `群組${(viewBoxes.length + i + 1)}`;
        // }
    }
}

// 新增輸入keywords欄位
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
            // alert("無法刪除最後一項");
            Swal.fire("無法刪除最後一項");
        } else {
            const parentElement = deleteItem.parentElement;
            const allElements = document.querySelectorAll(".keywords_box");
            const modifiedLength = allElements.length - parseInt(parentElement.id);
            // 改className名稱
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
            // 改id名稱
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
    // 點選按鈕，新增關鍵字
    button.addEventListener("click", function () {
        const topicEl = document.querySelectorAll(".topic");
        // 確認群組數量和全部關鍵字的數量
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
            // 每一個主題的關鍵字
            for (let j = 0; j < keywordsEl.length; j++) {
                const keyword = keywordsEl[j].value;
                if (keyword.length >= 50) {
                    Swal.fire("群組字數不可大於50字");
                    return;
                }
                keywords.push(keyword);
            }
            // console.log(keywords);
            // 每一個主題的符號=u
            const symbolsEl = document.querySelectorAll(`.symbol${i + 1}`);
            const symbols = [];
            for (let k = 0; k < symbolsEl.length; k++) {
                const symbol = symbolsEl[k].value;
                symbols.push(symbol);
            }
            // console.log(symbols);
            const firstArr = [keywords[0]];
            const secondArr = [keywords[1], keywords[2], keywords[3]];
            // 有填主題，但第一個關鍵字是空的
            if (topic !== "" && keywords[0] === "") {
                // console.log(topic);
                // console.log(keywords[0]);
                Swal.fire("若需設定群組，請於第一個空格內填入一個關鍵字");
                // alert("若需設定主題，請於第一個空格內填入一個關鍵字");
                return;
            }
            const newFirst = [];
            const newSecond = [];
            const newSymbols = [];
            // 檢查第一個Array有沒有空的
            // for (let a = 0; a < firstArr.length; a++) {
            // 若關鍵字是空的，跳過
            // if (firstArr[0] === "") {
            //     continue;
            // }
            keywordsCount += 1;
            totalKeywordsCount += 1;
            // 關鍵字放到新的array
            newFirst.push(firstArr[0]);
            // 若後面有關鍵字，前面的符號才需要放進去
            // if (a >= 1) {
            //     newSymbols.push(symbols[a - 1]);
            // }
            // }
            // 若第二個Array全部是空的，中間的符號不要放
            if (keywords[1] !== "" || keywords[2] !== "" || keywords[3] !== "") {
                newSymbols.push(symbols[0]);
            }
            // 檢查第二個array
            for (let b = 0; b < secondArr.length; b++) {
                // 若關鍵字是空的，跳過
                if (secondArr[b] === "") {
                    continue;
                }
                keywordsCount += 1;
                totalKeywordsCount += 1;
                // 判斷符號要不要放進去
                newSecond.push(secondArr[b]);
                // if (b < secondArr.length - 1) {
                if (b !== 0) {
                    newSymbols.push(symbols[b]);
                }
            }
            if (topic === "" && keywordsCount !== 0) {
                Swal.fire("若需設定群組，請填入群組名稱");
                // alert("若需設定主題，請填入主題名稱");
                return;
            }

            const finalArr = [];
            finalArr.push(newFirst, newSecond);
            const obj = { topicNumber: (i + 1), topic: topic, keywords: finalArr, symbols: newSymbols };
            console.log(obj);
            data.push(obj);
        }
        if (topicCount === 0 & totalKeywordsCount === 0) {
            Swal.fire("請輸入至少一組群組");
            // alert("請輸入至少一組主題");
            return;
        }
        const oldKeywords = document.querySelectorAll(".view_keyword");
        const newKeywords = document.querySelectorAll(".keywords_box");
        if ((oldKeywords.length + newKeywords.length) > 6) {
            Swal.fire("最多只能有六個群組，請刪減");
            // alert("最多只能有六個群組，請刪減");
            return;
        }
        Swal.fire("已儲存，請至文章列表搜尋內容");
        ajaxKeywords("/api/1.0/profile", data, view);
        const items = document.querySelectorAll(".keywords_box");
        const viewBoxes = document.querySelectorAll(".view_keyword");
        if (items) {
            const keyword1 = document.querySelectorAll(".keyword1");
            const topic = document.querySelectorAll(".topic");
            // console.log(keyword1);
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
    // const modifiedBox = document.createElement("div");
    // modifiedBox.id = "modified_box";
    const text = document.createElement("div");
    text.className = "text";
    text.innerHTML = "新增/修改關鍵字：最多六組";
    ajaxBox.append(text);
    inputKeywords();
    addButton();
}

// 規則預設為隱藏，點選才開啟
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

// 取得負評數量
function getNegativeCounts () {
    const negativeCounts = localStorage.getItem("negativeCounts");
    if (parseInt(negativeCounts) > 0) {
        // const deleteItem = document.querySelector("#alert");
        // deleteItem.remove();
        const alertElement = document.createElement("div");
        alertElement.id = "alert";
        alertElement.innerHTML = negativeCounts;
        const parentElement = document.getElementById("little_menu");
        parentElement.append(alertElement);
    }
}
getNegativeCounts();

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

// // // 滑動icon memeber會變化
// const iconMember = document.getElementById("icon_profile");
// iconMember.addEventListener("mouseover", function () {
//     iconMember.style = "cursor: pointer; display:none";
//     const menuBar = document.querySelectorAll(".menu_bar");
//     const logout = document.createElement("a");
//     logout.id = "logout";
//     logout.innerHTML = "會員登出";
//     logout.href = "profile.html";
//     logout.style = "cursor: pointer; font-weight:bold; font-size:18px";
//     menuBar[1].append(logout);
//     console.log(logout);
//     // positive.style = "color:#d81616";
// });
// iconMember.addEventListener("mouseout", function () {
//     iconMember.style = "cursor: pointer; display:block";
//     const logout = document.getElementById("logout");
//     logout.remove();
//     // logout.style = "display:none";
// });
