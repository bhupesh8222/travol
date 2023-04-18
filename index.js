require('dotenv').config()
var express = require('express');
var request = require('request');
var bodyparser = require('body-parser');
var app = express();
var methodOverride = require("method-override");
app.use(methodOverride("_method"));
var mongoose = require("mongoose");
var campModel = require("./models/campground");
var commentModel = require('./models/comments.js')
var flash = require("connect-flash");
var path = require("path");

app.use(flash()); //flash() is function.

//AUTHENTICATION PART
var passport = require("passport");
var expressSession = require("express-session");
var passportLocal = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var userModel = require("./models/user.js");
//index




const URI = process.env.MONGO_URL;
console.log("URI", URI);

mongoose.connect(URI, { useUnifiedTopology: true, useNewUrlParser: true })
    .then((res) => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log("Encountered error...");
        console.log("error : " + err);
    });



mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);



//CONFIGURE PASSPORT
app.use(expressSession({
    secret: "This is the secret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


//user.authenticate comes with passport-local-mongoose, here we are using local strategy for userModel
passport.use(new passportLocal(userModel.authenticate()));
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

app.use(express.static(path.join(__dirname, '/views')));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/css')));
app.use('/css', express.static('css'));
//We are using the css folder for retrieving the css files

app.use('/partials', express.static('partials'));

//reverted

//Whatever function is passed here will be called on every route, this is a middleware
app.use(function (req, res, next) {
    //res.locals.userName will be the variable to be passed.  //req.user contains the details of the user.
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
    //next function means to move in the next route.
})

//we have added currentuser in the response object.

app.set('view engine', 'ejs');


//ADDING ROUTES
var campsroutes = require(__dirname + "/routes/camproutes.js");
var commentroutes = require(__dirname + "/routes/commentroutes.js");
var authroutes = require(__dirname + "/routes/authroutes.js");


//We are specifying that the all camproutes must start with /camps & in camproutes file we can remove /camps from routes

//We are able to write shorter route declarartion
app.use("/camps", campsroutes);
app.use("/camps/:id/comments", commentroutes); //we will need to merge params.
app.use(authroutes);

const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("SERVER HAS STARTED!!");
});