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
        res.render('reset_db');
		console.log('test');
    });

function error_fn (err, p) {
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
        console.log(obj[0]);
        
        for (var obj_in in obj)
        {
            var document_obj = new SellerDB(obj[obj_in]);
            document_obj.save();
            user_db.collection.remove({'email':obj[obj_in].seller_email}, error_fn);
            var newUser            = new UserDb();
            newUser.local.email    = obj[obj_in].seller_email;
            newUser.local.password = newUser.generateHash(obj[obj_in].seller_password);
            newUser.save();
        }

        });

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
            newUser.save();
        }

        });
        break;

        case "items_db":
        // var items = new SellerDB();
        // seller_db.collection.remove( function (err) {
        // if (err) throw err;
        // });
        break;

        case "invoice_db":
        var invoice_db = new InvoiceDb();
        invoice_db.collection.remove( function (err) {
        if (err) throw err;
        });

        fs.readFile(process.cwd() + '/public/test_data/invoice_db.json', 'utf8', function (err, data) {
        if (err) throw err;

        obj = JSON.parse(data);

        for (var obj_in in obj)
        {
            var document_obj = new InvoiceDb(obj[obj_in]);
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