// load the things we need
var seller_mongoose = require('mongoose');

var Schema = seller_mongoose.Schema, ObjectId = Schema.ObjectId;

var seller_db = seller_mongoose.createConnection('localhost:27020/sellerDB'); //connect to seller DB
seller_db.on('error', console.error.bind(console, 'connection error:'));
seller_db.once('open', function callback () {
});

// var categorylistSchema = new Schema({
//     category         :   String //category of products sold
// });

// define the schema for our seller details model
var sellerdbSchema = new Schema({
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

// create the model for seller and expose it to our app
module.exports = seller_db.model('SellerDB', sellerdbSchema);