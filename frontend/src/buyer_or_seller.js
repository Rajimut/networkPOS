//Buyer or Seller
var readline = require('readline');

var choice = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

choice.question("Are you a Buyer or Seller?\n", function(answer) {
	console.log('\n');
	if (answer == 'Buyer') {
    	Buyer();
	} else if (answer == 'Seller') {
		choice.close();
		Seller();
	} else {
		console.log('Take a hike!')
	}
	choice.close();
});

function Buyer() {
	console.log('You are a Buyer\n');
}

function Seller() {
	console.log('You are a Seller\n');
	
    var Total = 0;

    var Sub_Total = 0;
    var readline = require('readline');
	var item_name = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
    
	item_name.question("Enter the name of the item: ", function(answer) {
		if (answer == null) {
			console.log('Error: Null item name.\n');
			return 1;
		}
	});
	//item_name.close();

    /* var readline = require('readline');
	var unit_price = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	unit_price.question("Enter unit price of the item: ", function(answer) {
		if (answer == 0) {
			console.log('Error: No unit price.\n');
			return 1;
		}
	});
	unit_price.close();
	product_details.question("Enter the name of the item: ", function(quantity) {
		if (quantity == 0) {
			console.log('Error: Null item name.\n');
			return 1;
		}
	});
    Sub_Total = unit_price*quantity; 
    console.log('    '+unit_price+'    '+quantity+'    '+Sub_Total);
	Total = Total + Sub_Total;
	console.log('Total: '+Total); */
}






