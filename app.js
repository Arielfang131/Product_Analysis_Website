// Express Initialization
const express = require("express");
const app = express();
const path = require("path");

// public html
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api/" + "1.0",
    [
        require("./server/routes/contentlist_route"),
        require("./server/routes/keywords_route"),
        require("./server/routes/member_route"),
        require("./server/routes/emotion_route"),
        require("./server/routes/negativecontent_route"),
        require("./server/routes/pnvalue_route"),
        require("./server/routes/wordcloud_route")
    ]
);

app.get(["/"], (req, res) => {
    res.sendFile(path.join(__dirname, "/public/contentlist.html"));
});

app.listen(3000, () => {
    console.log("Server is running on localhost:3000!");
});

module.exports = app;
