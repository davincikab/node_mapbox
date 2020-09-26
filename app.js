const express = require("express");
const path = require("path");
const borderParser = require("body-parser");
const router = require("./routes/appRoutes.js");

const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = process.env.PORT;

console.log("Port: " + process.env.PORT);


// app.get("/mapa", (req, res) => {
//     res.sendFile(path.join(process.cwd() ,'./views/index.html'))
// });

// use body
app.use(borderParser.urlencoded({extended:true}));
app.use(borderParser.json());

// static files 
app.use('/mapa/', express.static(path.join(__dirname, './views')));

// add the paths to the 
app.use("/persons", router);

console.log("Database Host: " + process.env.HOST);

// start the server
app.listen(port, function() {
    console.log("Serve started");
});


// Advice on socket io implementation