const express = require("express");
const cors = require("cors");
const { homePage, getLogs } = require("./controllers");

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', homePage);

app.get("/logs", getLogs);

app.use("*", (req, res) => {
    res.status(404).json({error: "Page Not Found"});
});

app.listen(5000, () => {
    console.log("server started on port 5000");
})

module.exports = {
    app
};
