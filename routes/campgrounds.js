var express = require("express");
var router = express.Router();
var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");
var middleware = require("../middleware")

//=============================
// CAMPGROUND ROUTES
//=============================

//INDEX
router.get("/campgrounds", function(req,res){

	Campground.find({},function(err, allCampgrounds){
		if (err){
			console.log(err);
		} else {
			res.render("campgrounds/index",{camps:allCampgrounds,page: 'campgrounds'});
		}
		
	});
});


//NEW 
router.get ("/campgrounds/new", middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new")
})

//CREATE 
router.post("/campgrounds", middleware.isLoggedIn,function(req,res){
	
	var name = req.body.name
	var price = req.body.price
	var imgurl = req.body.imgurl
	var desc = req.body.description
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCamp = {name:name, price:price, img:imgurl, description:desc, author:author}	
	Campground.create(newCamp, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	})
})

//SHOW 
router.get("/campgrounds/:id", function(req,res){
	//find the component with provided id
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if (err) {
			console.log(err)
		} else {
			// render show template with that component
			res.render("campgrounds/show", {camps: foundCampground})
		}
	})

});

//EDIT
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership,function(req,res){
	Campground.findById(req.params.id, function (err, foundCampground){
		res.render("campgrounds/edit", {camps:foundCampground});
	});
});

//UPDATE
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership,function(req,res){

	Campground.findByIdAndUpdate(req.params.id,req.body.camps,function(err,updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
})

//DESTROY
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds")
		} else {
			req.flash("success", "Campground Deleted");
			res.redirect("/campgrounds")
		}
	});
});



module.exports = router;