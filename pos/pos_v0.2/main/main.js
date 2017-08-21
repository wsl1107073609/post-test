'use strict';

function printReceipt(inputs) {

	var barcodeCount = calculateBarcodeCount(inputs);
	var cartItems = buildCartItems(barcodeCount, loadAllItems());


	// var validItems = composeValidItems(loadAllItems(), inputs);

	// var buildItemsPrint = buildItemsToPrint(validItems);

	var totalPrice = calculateTotalPrice(cartItems);

	var printReceipt = toString(cartItems, totalPrice);

  	console.log(printReceipt);
}

function calculateBarcodeCount(inputs){
	var barcodeCount = {};
	inputs.forEach(function(input){
		barcodeCount[input] = barcodeCount[input] ? barcodeCount[input] + 1 : 1;
		// if(barcodeCount[input]){
		// 	barcodeCount[input] += 1;
		// } else {
		// 	barcodeCount[input] = 1;
		// }
	});
	return barcodeCount;
}

function buildCartItems(barcodeCount, allItems){
	var cartItems = [];
	allItems.forEach(function(allItem){
		var count = barcodeCount[allItem.barcode];
		if (count) {
			cartItems.push(
				Object.assign({}, allItem, {count: count, totalPrice: count * allItem.price})
			);
		}
	});
	return cartItems;
}


// function composeValidItems(items, inputs){

// 	var allItems = composeItemsByInputs(items, inputs);

// 	var composeTwo = [];
// 	allItems.forEach(function(itemELement){
// 		var item = composeTwo.find(function(item){
// 			return item.barcode === itemELement.barcode;
// 		});
// 		if(item) {
// 			item.count += 1;
// 		} else {
// 			composeTwo.push(Object.assign({}, itemELement, {count: 1})); 			
// 		}
// 	});
// 	return composeTwo;
// }

// function composeItemsByInputs(items, inputs){
// 	var composeOne = [];
// 	inputs.forEach(function(input){
// 		var item = items.find(function(item){
// 			return input === item.barcode;
// 		});
// 		if(item){
// 			composeOne.push(item);
// 		}
// 	});
// 	return composeOne;

// }

// function buildItemsToPrint(validItems){
// 	var printItems = validItems.map(function(validItem){
// 		return '名称：' + validItem.name 
// 			+'，数量：' + validItem.count + validItem.unit 
// 			+'，单价：' + formatPrice(validItem.price) 
// 			+ '(元)，小计：' + formatPrice(validItem.count * validItem.price) + '(元)';
// 	});
// 	return printItems.join('\n');
// }


function calculateTotalPrice(cartItems){
	return cartItems.reduce(function(sum, cartItem){
		return sum + cartItem.totalPrice;
	},0);
}

function toString(cartItems, totalPrice){
	var header = '***<没钱赚商店>收据***\n';
	var itemsBody = cartItems.map(function(cartItem){
		return '名称：' + cartItem.name 
			+'，数量：' + cartItem.count + cartItem.unit 
			+'，单价：' + formatPrice(cartItem.price) 
			+ '(元)，小计：' + formatPrice(cartItem.totalPrice) + '(元)';
	}).join('\n');
	var footer = '\n----------------------\n总计：' + formatPrice(totalPrice) + '(元)\n**********************';

	return header + itemsBody + footer;
}

function formatPrice(price){
	var NUMBER = 2;
	return price.toFixed(NUMBER);
}

//another method:
//first: traverse inputs to compose an array object and every object has the barcode and count key
//second: traverse the array object and the fixtures to compse the validItemsArray
//third: compose items to printString
//fouth: calculate the totalPrice according validItemsArray
//last: pint the text




