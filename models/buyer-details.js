// load the things we need
var mongoose = require('mongoose');
var Buyer_db = mongoose.createConnection('mongodb://localhost:27020/buyerDB'); //connect to buyer DB


// PROMISE LIBRARY USED FOR ASYNC FLOW
var promise = require("bluebird");
// mongoose.connection.on('error', function(err){});
// buyer_db.on('error', console.error.bind(console, 'connection error:'));
// buyer_db.once('open', function callback () {
// });

// define the schema for our buyer details model
var buyerSchema = new mongoose.Schema({
    buyer_name       :   String,
    buyer_email      :   String,
    buyer_pic        :   String,
    buyer_sex        :   String,
    buyer_dob        :   Date,
    buyer_st_addr    :   String,
    buyer_city       :   String,
    buyer_state      :   String,
    buyer_zipcode    :   String,
    buyer_country    :   String,
    buyer_sharedata  :   String, // Is the buyer willing to share his abstract data for analytics
    customer_flag    :   String  // Set to either Buyer or Seller for appropriate DB retrieval
});

buyerSchema.statics.buyer_id = function(_email, cb) {

    return this.findOne({ 'buyer_email': _email }, cb);
    // RETURNS BUYER ID WHEN PRESENTED WITH EMAIL

};

var BuyerModel = Buyer_db.model('BuyerDB', buyerSchema);
promise.promisifyAll(BuyerModel);
promise.promisifyAll(BuyerModel.prototype);
// create the model for seller and expose it to our app
module.exports = BuyerModel;
