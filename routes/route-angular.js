var express = require('express.io');
var router = express();
var passport = require('passport');
var crypto = require('crypto');
var mongoose = require('mongoose');


//Define Models for each Schema created

var SellerDB = require('../models/seller-details');
var buyerDB = require('../models/buyer-details');
var User = require('../models/user');
var InvoiceDetail = require('../models/invoice-detail');
//var InvoiceDetail = require('../models/test-model');
var fs = require('fs');

module.exports = function(router, passport) {
    router.get('/partials/desktop/:name', function(req, res) {

            var name = req.params.name;
            res.render('angular/desktop/' + name);

    });
};
