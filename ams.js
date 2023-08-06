//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//IMPORT THINGS ON THE TOP
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const http = require('http');
const path = require('path');
const cors = require('cors');
const express = require("express");
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const multer = require('multer');
const morgan = require('morgan');
const fs = require('fs');
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//ROUTE IMPORT
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const main_route = require("./routes/main");



// const main_route = require("./config/mysqlRemortORM");
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//CONFIG
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const app = express();
const server = http.createServer(app);
const main_server_port = parseInt(process.env.PORT, 10) || 9000;

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//EXPRESS MIDDLEWARE
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
app.use(
    cors({
        origin: "*",
        methods: ['GET', 'POST'],
        credentials: true
    })
)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, './public')));
app.use(express.static(path.join(__dirname, './client')));
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//ROUTE SECTION START
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
app.use('/api', main_route);
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//SERVER
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Error handling middleware for file upload

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // A multer error occurred when uploading the file
        res.status(400).json({ message: err.message });
    } else {
        // Another type of error occurred
        res.status(500).json({ message: err.message });
    }
});

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// FOR LOGGING AND PRODUCTION
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const accessLogStream = fs.createWriteStream(path.join(__dirname, './public/access.log'), { flags: 'a' });

app.use(morgan('combined', { stream: accessLogStream }));

if (process.env.NODE_ENV === "production") {
    console.log = function () { };
}


//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// FOR FRONTEND
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
app.get('/*', (req, res, next) => {
    res.sendFile(path.join(__dirname, './client/index.html'))
    //use index.maintenance.html for maintenance mode.
});

server.listen(main_server_port, () => {
    console.log('Example app listening at port: http://localhost:' + main_server_port);
});


