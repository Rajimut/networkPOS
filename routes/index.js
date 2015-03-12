var express     = require('express.io');
var router      = express();
var passport    = require('passport');
var _           = require('underscore');
var crypto      = require('crypto');

//Define Models for each Schema created
var InvoiceDetail = require('../models/invoice-detail');
var Receipt = require('../models/receipt');

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

// Method to pull receipts for a certain buyer
router.get('/myreceipts', isLoggedIn, function(req, res) {

    // Create an instance of the Invoice Details Schema
    //var temp_invoice_details = new InvoiceDetails();

    // Create an array of the Receipt Schema
    var receipt = new Receipt();

    console.log("Buyer : " + req.user.local.email);

    /* var myReceipts = function(req) {
        InvoiceDetail.aggregate([
            { $match: { "_id": 1 , "buyer_username": req.user.local.email } }
            ,{ $group: { transaction_id: "" } } ],
            function (err, result) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    console.log(result);
            });
    } */

    //Look up the invoice database using the buyer's username
    InvoiceDetail.find({ 'buyer_name' : req.user.local.email }, function(err,invoice) {
        console.log(invoice + "Length: " + invoice.length);
        
        //receipt.seller_name = 

        _.groupBy(invoice, 'buyer_username');
        /* _.chain(invoice)
         .groupBy("transaction_id")
         .value(); */
        console.log("grouped_invoice length: " + invoice);

        /* for(var i = 0; i < grouped_invoice.length;i++) {
            console.log("grouped_invoice[" + i + "]: " + grouped_invoice[i]);
        } */
    });

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
    
    req.session.current_receipt_no = crypto.randomBytes(3).toString('hex'); //Date.now();  //uniquely generate transaction id - time based

    console.log("req.session.current_receipt_no" + req.session.current_receipt_no);
    res.render('POSterminal', { 'receipt_no', { "receipt_no" : req.session.current_receipt_no }, title: 'POSterminal' });
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

//Notification that billing has stopped - insert json into db
router.post('/stop-billing', function(req, res) {

    // Create an instance of the Invoice Details Schema
    var temp_invoice_details = new InvoiceDetail();

    temp_invoice_details.transaction_id     = req.session.current_receipt_no;  //uniquely generate transaction id - time based

    // Set current_receipt_no in session variable to null since we store in the DB which is persistent.
    req.session.current_receipt_no = null;

    //extract information from form
    temp_invoice_details.transaction_date   = new Date();               //Get current date for date for transaction
    temp_invoice_details.seller_username    = req.user._id;             //extract currently logged in seller
    temp_invoice_details.buyer_username     = req.body.buyer_username;  //For future updates. Needs flash login of Buyer.
    temp_invoice_details.paymenttype        = req.body.paymenttype;
    temp_invoice_details.tax                = req.body.tax;    
    temp_invoice_details.beforetax          = req.body.beforetax;
    temp_invoice_details.aftertax           = req.body.aftertax;
    temp_invoice_details.item_details       = req.body.item_details;

    console.log("temp_invoice_details : " + temp_invoice_details);
    
    temp_invoice_details.save(function(error, data){
         if(error){
             console.log("error case" + error);
             res.send("There was a problem adding the information to the database." + error);
         }
         else{
             res.location("POSterminal");
             // And forward to success page
             res.redirect("POSterminal");
         }
    });
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