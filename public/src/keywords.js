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
        for (let a = 0; a < firstArr.length; a++) {
            if (firstArr[a] === "") {
                continue;
            }
            newFirst.push(firstArr[a]);
            if (a >= 1) {
                newSymbols.push(symbols[a - 1]);
            }
        }
        if (keywords[3] !== "" || keywords[4] !== "" || keywords[5] !== "") {
            newSymbols.push(symbols[2]);
        }
        for (let b = 0; b < secondArr.length; b++) {
            if (secondArr[b] === "") {
                continue;
            }
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
    ajax("/api/1.0/keywords", data);
});
