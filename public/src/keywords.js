function ajax (src, data) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // JSON.parse(xhr.responseText);
            // console.log(JSON.parse(xhr.responseText));
        }
    };
    xhr.open("POST", src);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(data));
}

const button = document.getElementById("button");
button.addEventListener("click", function () {
    const topicEl = document.querySelectorAll(".topic");
    const data = [];
    for (let i = 0; i < topicEl.length; i++) {
        const topic = topicEl[i].value;
        const keywordsEl = document.querySelectorAll(`.keyword${i + 1}`);
        const keywords = [];
        // 每一個主題的關鍵字
        for (let j = 0; j < keywordsEl.length; j++) {
            const keyword = keywordsEl[j].value;
            // if (keyword !== "") {
            keywords.push(keyword);
            // }
        }
        // 每一個主題的符號(換成兩個array)
        const symbolsEl = document.querySelectorAll(`.symbol${i + 1}`);
        const symbols = [];
        for (let k = 0; k < symbolsEl.length; k++) {
            const symbol = symbolsEl[k].value;
            symbols.push(symbol);
        }

        const firstArr = [keywords[0], keywords[1], keywords[2]];
        const secondArr = [keywords[3], keywords[4], keywords[5]];
        const newFirst = [];
        const newSecond = [];
        const newSymbols = [];
        // 檢查第一個Array有沒有空的
        for (let a = 0; a < firstArr.length; a++) {
            // 若關鍵字是空的，跳過
            if (firstArr[a] === "") {
                continue;
            }
            // 關鍵字放到新的array
            newFirst.push(firstArr[a]);
            // 若後面有關鍵字，前面的符號才需要放進去
            if (a >= 1) {
                newSymbols.push(symbols[a - 1]);
            }
        }
        // 若第二個Array全部是空的，中間的符號不要放
        if (keywords[3] !== "" || keywords[4] !== "" || keywords[5] !== "") {
            newSymbols.push(symbols[2]);
        }
        // 檢查第二個array
        for (let b = 0; b < secondArr.length; b++) {
            // 若關鍵字是空的，跳過
            if (secondArr[b] === "") {
                continue;
            }
            // 關鍵字放到新的array(有問題)
            newSecond.push(secondArr[b]);
            if (b < secondArr.length - 1) {
                newSymbols.push(symbols[b + 3]);
            }
        }
        const finalArr = [];
        finalArr.push(newFirst, newSecond);
        const obj = { topicId: (i + 1), topic: topic, keywords: finalArr, symbol: newSymbols };
        data.push(obj);
    }
    console.log(data);
    alert("已儲存");
    ajax("/api/1.0/keywords", data);
});
