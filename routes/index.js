var express = require('express.io');
var router = express();
var passport = require('passport');
//var underscore = require('underscore.js');

//Define Models for each Schema created
var InvoiceDetails = require('../models/invoice-details');

module.exports = function (router, passport) {

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Welcome' });
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


router.get('/buyer-transactions', isLoggedIn, function(req, res) {
    res.render('buyer-transactions', {json_data: data});
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

//Notification that billing has started - start building json object
/* router.post('/start-billing', function(req, res) {

    // Create an instance of the Invoice Details Schema
    var temp_invoice_details = new InvoiceDetails();

    temp_invoice_details.seller_username = req.user._id;    //extract currently logged in seller
    //temp_invoice_details.buyer_username = <Needs to be filled somehow>; //For future updates. Needs flash login of Buyer.
    temp_invoice_details.transaction_id = Date.now();       //uniquely generate transaction id - time based
    temp_invoice_details.transaction_date = new Date();     //Get current date for date for transaction

    req.session.current_transaction = temp_seller_data.transaction_id;
    console.log("Start billing: " + req.session.current_transaction);

    temp_seller_data.save(function(error, data){
        if(error){
            res.json(error);
        }
        else{
            //temp_seller_data.close();
            res.location("/POSterminal");
            // And forward to success page
            res.redirect("POSterminal");
        }
    });
}); */

//Notification that next item on bill has been entered - continue to build json
router.post('/next-item', function(req, res) {
    // NEEDS TO BE AJAXIFIED SO THE PAGE IS NOT REALOADED
    // OR UPLOAD EVERYTHING IN ONE SHOT
    // Create an instance of the Invoice Details Schema
    var temp_invoice_details = new InvoiceDetails();

    if (req.session.current_transaction === null) {
        //First item in transaction - Store it in the session variable for future retrieval.
        req.session.current_transaction = Date.now();       //uniquely generate transaction id - time based      
    }
    
    // Store transaction id into item pertaining to this invoice
    temp_invoice_details.transaction_id = req.session.current_transaction;
    
    //extract information from form
    temp_invoice_details.seller_username    = req.user._id;    //extract currently logged in seller
    //temp_invoice_details.buyer_username   = <Needs to be filled somehow>; //For future updates. Needs flash login of Buyer.
    temp_invoice_details.transaction_date   = new Date();     //Get current date for date for transaction
    temp_invoice_details.itemcode           = req.body.ItemNumber;
    temp_invoice_details.itemname           = req.body.ItemName;
    temp_invoice_details.unitprice          = req.body.UnitPrice;
    temp_invoice_details.quantity           = req.body.Quantity;
    temp_invoice_details.subtotal           = req.body.Subtotal;

    temp_invoice_details.save(function(error, data){
        if(error){
            res.json(error);
        }
        else{
            res.location("/POSterminal");
            // And forward to success page
            res.redirect("POSterminal");
        }
    });
});

//Notification that billing has stopped - insert json into db
router.post('/stop-billing', function(req, res) {

    //Generate the receipt in the proprietary format
    InvoiceDetails.find({'transaction_id' : req.session.current_transaction}, function(err,invoice) {
        console.log(invoice);
    });

    //Null the current transaction in the session variable since this transaction has been completed.
    req.session.current_transaction = null;

    res.location("/POSterminal");
    // And forward to success page
    res.redirect("POSterminal");
});

/* GET Userlist page. */
router.get('/userlist', function(req, res) {
    var db = req.db;
    console.log("DB name :" + db);
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
};