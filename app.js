// Express Initialization
const express = require("express");
const app = express();

// public html
app.use(express.static("public"));

// API routes
app.use("/api/" + "1.0",
    [
        require("./server/routes/crawler_route")
    ]
);

app.listen(3000, () => {
    console.log("Server is running on localhost:3000!");
});

module.exports = app;
