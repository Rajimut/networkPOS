// load the things we need
var buyer_mongoose = require('mongoose');

var Schema = buyer_mongoose.Schema, ObjectId = Schema.ObjectId;

var buyer_db = buyer_mongoose.createConnection('localhost:27020/buyerDB'); //connect to buyer DB
buyer_db.on('error', console.error.bind(console, 'connection error:'));
buyer_db.once('open', function callback () {
});

// define the schema for our buyer details model
var buyerdbSchema = new Schema({
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

// create the model for buyer and expose it to our app
module.exports = buyer_db.model('BuyerDB', buyerdbSchema);