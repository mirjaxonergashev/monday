const express = require("express");
const app = express();
const auth = require("../middleware/auth")

app.use("/", require("./user"));

// app.use("/*", (req, res) => {
//     console.log(1)
//     res.render("user/404", {})
// });

module.exports = app;