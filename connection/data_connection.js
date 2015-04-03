
var mongoose = require('mongoose'),
    mongoURI = 'mongodb://localhost:27020';

module.exports = db_conn = mongoose.createConnection(mongoURI);