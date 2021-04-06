//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');



const app = express();
mongoose.connect("mongodb://localhost:27017/userDB", {useUnifiedTopology: true, useNewUrlParser: true});


const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});

console.log(process.env.API_KEY);

const secret = "anhdasai123";

userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:['password']});
const User = mongoose.model("User",userSchema);



app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

app.route("/")
    .get(function (req,res) {
        res.render("home");
    })
app.route("/login")
    .get(function (req,res) {
        res.render("login");
    })
    .post(function(req,res) {
        const userName = req.body.username;
        const password = req.body.password;

        User.findOne({email:userName},function (err,result) {
            if(err) {
                res.render("home");
            }else {
                if(result.password === password) {
                    res.render("secrets");
                }else {
                    res.render("home");

                }
            }
        })
    })
app.route("/register")
    .get(function (req,res) {
        res.render("register");
    })
    .post(function(req,res) {
        const userName = req.body.username;
        const passWord = req.body.password;

        const userAccount = new User({
            email:userName,
            password:passWord
        });
        userAccount.save(function (err) {
            if(!err) {
                console.log("success created")
                res.render("secrets");

            }else {
                res.render("secrets");
            }
        });

    })

app.listen(3000, function() {
    console.log("Server started on port 3000");
});