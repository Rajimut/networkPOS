// load the things we need
var invoice_mongoose = require('mongoose');

var Schema = invoice_mongoose.Schema, ObjectId = Schema.ObjectId;

var invoice_db = invoice_mongoose.createConnection('localhost:27020/invoicedetail'); //connect to invoice DB
invoice_db.on('error', console.error.bind(console, 'connection error:'));
invoice_db.once('open', function callback () {
});

// define the schema for our invoice details model
var invoicedetailSchema = new Schema({
    seller_name      :   String,
    buyer_name       :   String,
    transaction_id   :   Number,
    transaction_date :   Date,
    itemcode         :   Number,
    itemname         :   String,
    category         :   String,
    unitprice        :   Number,
    quantity         :   Number,
    subtotal         :   Number
});

// create the model for seller and expose it to our app
module.exports = invoice_db.model('InvoiceDetail', invoicedetailSchema);