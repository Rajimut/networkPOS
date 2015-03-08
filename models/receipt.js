// load the things we need
var receipt_mongoose = require('mongoose');

var Schema = receipt_mongoose.Schema, ObjectId = Schema.ObjectId;

// define the schema for our receipt details model
var receiptdetailsSchema = new Schema({
    itemcode    	 :   Number,
    itemname    	 :   String,
    unitprice   	 :   Number,
    quantity    	 :   Number,
    subtotal    	 :   Number
});

// define the schema for our receipt model
var receiptSchema = new Schema({
    seller_name  	 	:   String,
    transaction_date 	:   Date,
    category			: 	String,
    receipt_details		: 	[receiptdetailsSchema],
    total 				: 	Number,
    payment_type		:   String 
});

// create the model for receipt and expose it to our app
module.exports = receipt_mongoose.model('Receipt', receiptSchema);