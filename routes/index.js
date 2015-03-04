var express = require('express');
var router = express();
var passport = require('passport');

module.exports = function (router, passport) {

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* POST customer is a Buyer */
router.post('/buyer', function(req, res) {
    res.location("buyer-login");
    res.redirect("buyer-login");
});

/* POST customer is a Seller */
router.post('/seller', function(req, res) {
    res.location("seller-login");
    res.redirect("seller-login");
});

/* POST to Buyer login form */
router.get('/buyer-login', function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('buyer-login', { message: req.flash('loginMessage') });
});

// Process the login form
router.post('/buyer-login', passport.authenticate('local-login', {
        successRedirect : '/myreceipts', // redirect to the secure profile section
        failureRedirect : '/buyer-login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
}));

/* POST to Seller login form */
router.get('/seller-login', function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('seller-login', { message: req.flash('loginMessage') });
});

// Process the login form
router.post('/seller-login', passport.authenticate('local-login', {
        successRedirect : '/seller-profile', // redirect to the secure profile section
        failureRedirect : '/seller-login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
}));

// =====================================
// SIGNUP ==============================
// =====================================
// show the signup form
router.get('/seller-signup', function(req, res) {
    res.render('seller-signup.jade');
    // render the page and pass in any flash data if it exists
    //res.render('signup', { message: req.flash('signupMessage') });
});

router.get('/buyer-signup', function(req, res) {
    res.render('buyer-signup.jade');
    // render the page and pass in any flash data if it exists
    //res.render('signup', { message: req.flash('signupMessage') });
});

// Process the signup form
router.post('/seller-signup', passport.authenticate('local-signup', {
        successRedirect : '/POSterminal', // redirect to the secure profile section
        failureRedirect : '/seller-signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
}));

router.post('/buyer-signup', passport.authenticate('local-signup', {
        successRedirect : '/myreceipts', // redirect to the secure profile section
        failureRedirect : '/buyer-signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
}));

// =====================================
// PROFILE SECTION =====================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)

router.get('/buyer-profile', isLoggedIn, function(req, res) {
    res.render('buyer-profile.jade', {
        user : req.user // get the user out of session and pass to template
    });
});

router.get('/seller-profile', isLoggedIn, function(req, res) {
    res.render('seller-profile.jade', {
        user : req.user // get the user out of session and pass to template
    });
});

router.get('/graphicalview', isLoggedIn, function(req, res) {
    res.render('graphicalview.jade', {
        user : req.user // get the user out of session and pass to template
    });
});

var config = require( __dirname + '/receipt.json');


var file = __dirname + '/receipt.json';

var fs = require("fs");
var data = JSON.parse(fs.readFileSync(file, "utf8"));
console.dir(data);
data = JSON.stringify(data);

var Myreceipt_data = JSON.parse(fs.readFileSync(__dirname + '/myreceipt.json', "utf8"));

// Myreceipt_data = JSON.stringify(Myreceipt_data);
router.get('/myreceipts', isLoggedIn, function(req, res) {
    res.render('myreceipts', {myreceipt_: Myreceipt_data, json_data: data});
});

router.get('/buyer-dashboard', isLoggedIn, function(req, res) {
    res.render('buyer-dashboard', {json_data: data});
});

// =====================================
// LOGOUT ==============================
// =====================================
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

/* GET Hello World page. */
router.get('/helloworld', function(req, res) {
    res.render('helloworld', { title: 'Hello, World!' });
});

router.get('/POSterminal', isLoggedIn, function(req, res) {
    res.render('POSterminal', { user : req.user, title: 'POSterminal' });
});

router.post('/print', function(req, res) {
    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var itemCode = req.body.ItemNumber;
    var itemName = req.body.itemName;
    var quantity = req.body.quantity;
    var subTotal = req.body.Subtotal;
    var vatPercentage = req.body.VATpercentage;
    var Total = req.body.Total;

    // Set our collection
    var collection = db.get('item-details');
    // Submit to the DB
    collection.insert({
        "itemcode" : itemCode,
        "itemname" : itemName,
        "quantity" : quantity,
        "subtotal" : subTotal,
        "vatpercentage" : vatPercentage,
        "total" : Total
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // If it worked, set the header so the address bar doesn't still say /adduser
            res.location("/POSterminal");
            // And forward to success page
            res.redirect("POSterminal");
        }
    });
});

/* GET Userlist page. */
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},{},function(e,docs){
        res.render('userlist', {
            "userlist" : docs
        });
    });
});

/* GET New User page. */
router.get('/newuser', function(req, res) {
    res.render('newuser', { title: 'Add New User' });
});

/* POST to Add User Service */
router.post('/adduser', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var userEmail = req.body.useremail;

    // Set our collection
    var collection = db.get('usercollection');
    console.log(collection + "username: " + userName + " email: " + userEmail);
    // Submit to the DB
    collection.insert({
        "username" : userName,
        "email" : userEmail
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // If it worked, set the header so the address bar doesn't still say /adduser
            res.location("userlist");
            // And forward to success page
            res.redirect("userlist");
        }
    });
});
}