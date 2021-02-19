require('dotenv').config();

var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
	passport      = require("passport"),
	flash         = require("connect-flash"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	Campground    = require("./models/campground"),
	Comment       = require("./models/comments"),
	User          = require("./models/user"),
	seedDB        = require("./seeds");

//API=======================================================================================================================
// key=API_KEY
// AIzaSyCWnxZSkBl_276679NBPc7NVHrQW8we7E0

//Requiring Routes===========================================================================================================

var commentRoutes    = require("./routes/comment"),
	campgroundRoutes = require("./routes/campground"),
	indexRoutes      = require("./routes/index");

//seedDB(); // seed the database
mongoose.connect("mongodb://localhost/yelp_camp_11", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use( express.static(__dirname + "/public" ) );
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');

//Passport Configuration========================================================================================================

app.use(require("express-session")({
		secret:"Real Madrid wins club of the century",
		resave: false,
	    saveUninitialized: false
		}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use( "/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

//SERVER===============================================SERVER=======================================================SERVER=========
app.listen(3000, function(){
	console.log("The YelpCamp Server Has Launched!")
});