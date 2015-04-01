var express = require('express');
var UserDb          = require('../models/user');
var SellerDB        = require('../models/seller-details');
var BuyerDB         = require('../models/buyer-details');
var InvoiceDb       = require('../models/invoice-detail');
var fs = require('fs');
var obj;


module.exports = (function() {
    var test = express.Router();


    test.get('/', function(req, res) {
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = mongoose.createConnection('mongodb://localhost/tests');
var db_ = mongoose.createConnection('mongodb://localhost/testA');

var CarSchema = new Schema({
    carplate: { type:String, index: true, required: true},
    features: { optA: String, optB: String},
    notes : String
},{strict: "throw"});

var ReservationSchema = new Schema({
    car: {type: Schema.Types.ObjectId, ref: 'Car'},
}, {strict: "throw"});


var Car = db.model('Car', CarSchema);
var Reservation = db_.model('Reservation', ReservationSchema);

Car.remove({}, function() {
  Reservation.remove({}, function() {
    Car.create({ carplate: 'BACONATOR', features: { optA: 'A', optB: 'B' } }, function(err, car) {
      console.log('err: ' + err);
      Reservation.create({ car: car._id }, function(err, reservation) {
        console.log('err2: ' + err);
        Reservation.findOne({}).populate('car', '', Car).exec(function(err, reservation) {
          console.log('err3: ' + err);
          console.log(JSON.stringify(reservation));
          console.log(reservation.features);
        });
      });
    });
  });
});

    res.end('{"success" : "Updated Successfully", "status" : 200}');

    });

function error_fn (err, p) {
    //console.log('deleted..');
            }

test.post('/', function(req, res) {
    console.log (req.body.action);
    var user_db = new UserDb();
    switch (req.body.action){
        case "seller_db":
        var seller_db = new SellerDB();

        seller_db.collection.remove( function (err) {
            console.log('Seller Db reset error + ' + err);
        if (err) throw err;
        });

        //READ JSON
        fs.readFile(process.cwd() + '/public/test_data/seller_db.json', 'utf8', function (err, data) {
        if (err) throw err;

        obj = JSON.parse(data);
        
        for (var obj_in in obj)
        {
            var document_obj = new SellerDB(obj[obj_in]);
            document_obj.save();
            user_db.collection.remove({'email':obj[obj_in].seller_email}, error_fn);
            var newUser            = new UserDb();
            newUser.local.email    = obj[obj_in].seller_email;
            newUser.local.password = newUser.generateHash(obj[obj_in].seller_password);
            newUser.local.customer_flag = 'Seller';
            newUser.save();
        }

        });
        console.log('Seller Db Reset Successful');
        break;

        case "buyer_db":
        var buyer_db = new BuyerDB();
        buyer_db.collection.remove( function (err) {
        if (err) throw err;
        });



        //READ JSON
        fs.readFile(process.cwd() + '/public/test_data/buyer_db.json', 'utf8', function (err, data) {
        if (err) throw err;

        obj = JSON.parse(data);
        
        for (var obj_in in obj)
        {
            var document_obj = new BuyerDB(obj[obj_in]);
            document_obj.save();
            user_db.collection.remove({'email':obj[obj_in].buyer_email}, error_fn);
            var newUser            = new UserDb();
            newUser.local.email    = obj[obj_in].buyer_email;
            newUser.local.password = newUser.generateHash(obj[obj_in].buyer_password);
            newUser.local.customer_flag = 'Buyer';
            newUser.save();
        }

        });
        console.log('Buyer Db Reset Successful');
        break;

        case "items_db":
        // var items = new SellerDB();
        // seller_db.collection.remove( function (err) {
        // if (err) throw err;
        // });
        break;

        case "invoice_db":
        var invoice_db = new InvoiceDb.Invoice_Detail();
        invoice_db.collection.remove( function (err) {
        if (err) throw err;
        });

        fs.readFile(process.cwd() + '/public/test_data/invoice_db.json', 'utf8', function (err, data) {
        if (err) throw err;

        obj = JSON.parse(data);

        for (var obj_in in obj)
        {
            var document_obj = new InvoiceDb.Invoice_Detail(obj[obj_in]);
            document_obj.save();
        }
        });
        break;

    }
    res.setHeader("Content-Type", "text/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.end('{"success" : "Updated Successfully", "status" : 200}');

});


    return test;
})();