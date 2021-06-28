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
        require("./server/routes/content_list_route"),
        require("./server/routes/keywords_route"),
        require("./server/routes/member_route"),
        require("./server/routes/emotion_route"),
        require("./server/routes/negative_content_route"),
        require("./server/routes/PN_value_route.js"),
        require("./server/routes/wordcloud_route")
    ]
);

app.get(["/"], (req, res) => {
    res.sendFile(path.join(__dirname, "/public/member.html"));
});

app.listen(3000, () => {
    console.log("Server is running on localhost:3000!");
});

module.exports = app;
