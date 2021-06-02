// Express Initialization
const express = require("express");
const app = express();

// public html
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api/" + "1.0",
    [
        require("./server/routes/crawler_route"),
        require("./server/routes/contentlist_route"),
        require("./server/routes/keywords_route"),
        require("./server/routes/member_route"),
        require("./server/routes/emotion_route"),
        require("./server/routes/negativeContent_route"),
        require("./server/routes/PNValue_route"),
        require("./server/routes/wordcloud_route")
    ]
);

app.listen(3000, () => {
    console.log("Server is running on localhost:3000!");
});

module.exports = app;
