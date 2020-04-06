var express 		= require ("express"),
	app 			= express(),
	bodyParser		= require("body-parser"),
	mongoose		= require("mongoose"),
	flash			= require("connect-flash"),
	passport		= require("passport"),
	LocalStrategy	= require("passport-local"),
	methodOverride	= require("method-override"),
	Campground		= require("./models/campground"),
	Comment			= require("./models/comment"),
	User			= require("./models/user"),
	seedDB			= require("./seeds")

var campgroundRoutes	= require("./routes/campgrounds"),
	commentRoutes		= require("./routes/comments"),
	indexRoutes			= require("./routes/index.js")
	

// mongoose.connect("mongodb://localhost:27017/yelp_camp_Dyn",{useNewUrlParser: true, useUnifiedTopology: true})
mongoose.connect("mongodb+srv://babakmahjoub:yelpcamp@cluster0-ir5bx.mongodb.net/test?retryWrites=true&w=majority",{useNewUrlParser: true, useUnifiedTopology: true})

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// seedDB();

//PASSPORT CONFIG
app.use(require("express-session")({
	secret: "I am a web Developer",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});

app.use(indexRoutes);
app.use(commentRoutes);
app.use(campgroundRoutes)




app.listen ("3000", function(){
	console.log("Server started on port 3000")
});
