//Buyer or Seller
var readline = require('readline');

var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

rl.question("Are you a Buyer or Seller?", function(answer) {
	if (answer == 'Buyer') {
    	console.log('You are a Buyer')
	} else if (answer == 'Seller') {
		console.log('You are a Seller')
	} else {
		console.log('Take a hike!')
	}
	rl.close();
});
