// load the things we need
var mongoose = require('mongoose');

// PROMISE LIBRARY USED FOR ASYNC FLOW
var promise = require("bluebird");

var Schema = mongoose.Schema, ObjectId = Schema.Types.ObjectId;
var SellerDB       = require('../models/seller-details');
var BuyerDB         = require('../models/buyer-details');

var invoice_db = mongoose.createConnection('localhost:27020/invoiceDB'); //connect to invoice DB

var itemdetailSchema = new Schema({
    itemcode         :   Number,
    itemname         :   String,
    category         :   String,
    unitprice        :   Number,
    quantity         :   Number,
    subtotal_ln      :   Number
});
var testSchema = new Schema({

    name:String
});
// define the schema for our invoice details model
var invoicedetailSchema = new Schema({
    seller_name      :   String,
    seller_id        :   { type: ObjectId, ref: 'SellerDB' },
    buyer_name       :   String,
    buyer_id         :   { type: ObjectId, ref: 'BuyerDB '},
    transaction_id   :   String,
    transaction_date :   Date,
    paymenttype      :   String,
    item_details     :   [itemdetailSchema],
    tax              :   Number,
    beforetax        :   Number,
    aftertax         :   Number
});


invoicedetailSchema.pre('save', function(next) {
    // SET SELLER AND BUYER IDs BEFORE SAVING
     var self = this;
     SellerDB.seller_idAsync(self.seller_name)
     .then( function (seller)
        {
        self.seller_id=seller._id;
        return seller;
        })
     .then (function (buyer){

    return BuyerDB.buyer_idAsync(self.buyer_name)
     .then( function (buyer){
        self.buyer_id=buyer._id;
        return buyer;
     });
    })
     .finally(function ( es){
        next();

     })
     .catch(
        function (e) {
        console.log ('errr ' + e );
        //next(e);

     });

});

var InvoiceModel = invoice_db.model('InvoiceDetail', invoicedetailSchema);
// create the model for seller and expose it to our app
promise.promisifyAll(InvoiceModel);
promise.promisifyAll(InvoiceModel.prototype);
module.exports = InvoiceModel;
