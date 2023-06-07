var mysql = require('mysql');
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var app = express();
const dotenv = require("dotenv")
const cookieParser = require("cookie-parser");


var server = require('http').Server(app);

var port = process.env.PORT || 3001;

// to support JSON-encoded and URL-encoded bodies
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// to avoid cors policy problems
app.use(
    cors({
      origin: [
        `${process.env.FRONT_URL}`,
        'http://localhost:3000',
        'http://localhost:3001',
      ],
      credentials: true
    })
  );

// configure dotenv to access env variables
dotenv.config()

app.use(cookieParser());

// Require all defined routes
const zimmerroutes = require('./route/zimmer.route')
const zusatzleistungroutes = require('./route/zusatzleistung.route')
const buchungroutes = require('./route/buchung.route')
const bewertungroutes = require('./route/bewertung.route')
const profilroutes = require('./route/profil.route')
const emailroutes = require('./route/email.route')
const userroutes = require('./route/user.route')
const authroutes = require('./route/auth.route')

// using as middleware
app.use('/zimmer', zimmerroutes)
app.use('/zusatzleistung', zusatzleistungroutes)
app.use('/buchung', buchungroutes)
app.use('/bewertung', bewertungroutes)
app.use('/profil', profilroutes)
app.use('/email', emailroutes)
app.use('/user', userroutes)
app.use('/auth', authroutes)

// root path
app.get("/", (req, res, next) => {
	res.json("HeimaAPI is running!");
});

server.listen(port, () => {
    console.log('Listening on port: ' + port);
});