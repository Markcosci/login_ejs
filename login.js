var mysql = require("mysql");
var express = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
var path = require("path");
const { response } = require("express");
const { report } = require("process");

var connect = mysql.createConnection({
    host:"locahost",
    user: "root",
    password: "",
    database: "nodeloginX"
});

var app = express();

app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');

app.use(
    session({
        secret: "secret",
        resave: true,
        saveUninitialized: true
    })
);

app.use*(express.urlencoded({ extended: true}));
app.use(express.json());

app.get("/login", function(request, response) {
    response.sendFile(path.join(__dirname + "/login.html"));
});



app.post("/auth", function(request, response){
    var username = request.body.username;
    var password = request.body.password;

    if (username && password) {
        connect.query(
            "SELECT * FROM accounts WHERE username = ? AND password = ?",
            [username, password],
            function(error ,result , fields) {
                if (result.length > 0) {
                    request.session.loggedin = true;
                    request.session.username = username;

                    response.redirect("/webboard");
                }
                else {
                    response.send("Incorret Username and/or Password!");
                }
                response.end()
            }
        );
    }
    else {
        response.send("Please enter Username and Password!");
        response.end();
    }
})

app.get("/home", function(request, response) {
    if (request.session.loggedin) {
        response.send("Welcome back," + request.session.username + "!");
    }
    else {
        response.send("Plesase login to view this Page!");
    }
    response.end();
});

app.get("/signout", function(request, response){
    request.session.destroy(function (err) {
        response.send("signout ready!");
        response.end();
    });
});

app.get("/webboard",function (request, response) {
    if (req.session.loggedin)
        connect.query("SELECT * FROM accounts", function(err, result) {
            response.render("index.ejs", {
                post: result
            });
        console.log(result)
        });
    else
        response.send("LOGIN FIRST");
        console.log

});



app.listen(9000);
console.log("running on port 9000...");
