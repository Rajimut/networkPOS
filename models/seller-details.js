// load the things we need
var mongoose = require('mongoose');

// PROMISE LIBRARY USED FOR ASYNC FLOW
var promise = require("bluebird");

// mongoose.connection.on('error', function(err){});
// require fs for uploading images
var fs = require('fs');

var seller_db = mongoose.createConnection('mongodb://localhost:27020/sellerDB'); //connect to seller DB
// seller_db.on('error', console.error.bind(console, 'connection error:'));
// seller_db.once('open', function callback () {
// });
var User            = require('../models/user');

// define the schema for our seller details model
var sellerSchema = new mongoose.Schema({
    seller_name         :   String,
    seller_email        :   String,
    seller_logo         :   String,
    seller_st_addr      :   String,
    seller_city         :   String,
    seller_state        :   String,
    seller_zipcode      :   String,
    seller_country      :   String,
    seller_category     :   String, // This should be seller category : coffee shop retalier etc. Product level category should be in item detail. // Array of category of products sold.
    customer_flag       :   String // Set to either Buyer or Seller for appropriate DB retrieval.
});



sellerSchema.pre('save', function(next) {
    // SET USER TYPE FLAG AFTER SIGNUP
    var self = this;
    User.update({'local.email':self.seller_email},
        {$set:{'local.customer_flag':self.customer_flag}},function(err){


            if (!err) {next();}
            else
            {
            console.log('error : ' + err);
            }

        });


});
sellerSchema.statics.seller_id = function(_email, cb) {

    return this.findOne({ 'seller_email': _email }, cb);

};

var SellerModel = seller_db.model('SellerDB', sellerSchema);
promise.promisifyAll(SellerModel);
promise.promisifyAll(SellerModel.prototype);
// create the model for seller and expose it to our app
module.exports = SellerModel;