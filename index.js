const express = require("express");
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
// app.use('/admin', express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use("/", require("./app/app"));


const port = process.env.PORT || 1313;
app.listen(port, () => {
    console.log("Create Server " + port);
})