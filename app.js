const express = require("express");
const path = require("path");
const borderParser = require("body-parser");
const router = require("./routes/appRoutes.js");

const app = express();
const port = 5000;


app.get("/", (req, res) => {
    res.sendFile(path.join(process.cwd() ,'/views/index.html'))
});

// use body
app.use(borderParser.urlencoded({extended:true}));
app.use(borderParser.json());

// static files 
app.use('/static/', express.static(path.join(__dirname, '/views')));

// add the paths to the 
app.use("/persons", router);

console.log("Database Host: " + process.env.HOST);

// start the server
app.listen(port, function() {
    console.log("Serve started");
});


// Advice on socket io implementation