function ajax (src, data) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            JSON.parse(xhr.responseText);
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
        for (let j = 0; j < keywordsEl.length; j++) {
            const keyword = keywordsEl[j].value;
            // if (keyword !== "") {
            keywords.push(keyword);
            // }
        }
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
        for (let i = 0; i < firstArr.length; i++) {
            if (firstArr[i] === "") {
                continue;
            }
            newFirst.push(firstArr[i]);
            if (i >= 1) {
                newSymbols.push(symbols[i - 1]); // 有問題 i-1有問題
            }
        }
        newSymbols.push(symbols[2]);
        for (let i = 0; i < secondArr.length; i++) {
            if (secondArr[i] === "") {
                continue;
            }
            newSecond.push(secondArr[i]);
            if (i < secondArr.length - 1) {
                newSymbols.push(symbols[i + 3]); // 有問題
            }
        }
        const finalArr = [];
        finalArr.push(newFirst, newSecond);
        const obj = { topic: topic, keywords: finalArr, symbol: newSymbols };
        data.push(obj);
    }
    console.log(data);
    ajax("/api/1.0/keywords", data);
});
