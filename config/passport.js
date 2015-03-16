// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User            = require('../models/user');
var SellerDB        = require('../models/seller-details');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        typeField     : 'customertype',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {
        console.log("passport: " + email);
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {

                // if there is no user with that email
                // create the user
                var newUser            = new User();

                // set the user's local credentials
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password);

                //Needs to be removed & set in seller-signup.jade - UMA TO TAKE A LOOK.
                req.body.customertype = "Seller";

                if (req.body.customertype == "Seller") {
                    // Insert into sellerDB
                    var temp_seller_details = new SellerDB();

                    temp_seller_details.seller_name         =   req.body.companyname;
                    temp_seller_details.seller_email        =   req.body.email;
                    temp_seller_details.seller_logo         =   "/var/mushroomDB/seller/images" + req.body.sellerlogo;
                    temp_seller_details.seller_st_addr      =   req.body.streetAddress; 
                    temp_seller_details.seller_city         =   req.body.city;
                    temp_seller_details.seller_state        =   req.body.state;
                    temp_seller_details.seller_zipcode      =   req.body.zip;
                    //temp_seller_details.seller_categories =   req.body.  //Future item
                    temp_seller_details.customer_flag       =   "Seller";

                    console.log("temp_seller_details : " + temp_seller_details);
    
                    temp_seller_details.save(function(error, data){
                        if (error){
                            console.log("error case" + error);
                            res.send("There was a problem adding the information to the seller database." + error);
                        } else {
                            // And forward to success page
                            console.log("Seller added to DB");
                            // Change login from Seller-Signup to Seller-Loggedin
                            req.login = "Seller-Loggedin";  
                        }
                    });
                } else if (req.body.customertype == "Buyer") {
                    // Insert into buyerDB
                    req.login = "Buyer_Loggedin";
                }

                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });    

        });

    }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        });

    }));
};