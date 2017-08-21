'use strict';

function printReceipt (inputs) {
	debugger
	var buildItems = composeItems(inputs);

	var totalPrice = calculateTotalPrice(buildItems);

	var printText = toString(buildItems, totalPrice);

	console.log(printText);
}

function composeItems(inputs){
	var compose = [];

	inputs.forEach(function(input){
		var item = compose.find(function(item){
			return item.barcode === input.barcode;
		});
		if(item) {
			item.count += 1;
		} else {
			compose.push(Object.assign({}, input, {count: 1})); 			
		}
	});
	return compose;



	// var arrayObject = [];
	// for (var i = 0; i < inputs.length;) {
	//     var count = 0;
	//     for (var j = i; j < inputs.length; j++) {
	//       if (inputs[i].barcode === inputs[j].barcode) {
	//         count++;
	//       }
	//     }
	//     arrayObject.push({
	//       barcode: inputs[i].barcode,
	//       name: inputs[i].name,
	//       unit: inputs[i].unit,
	//       price: inputs[i].price,
	//       count: count
	//     })
	//     i += count;
 //  	}
 //  	return arrayObject;
}

function calculateTotalPrice(items){
	var totalPrice = items.reduce(function(sum, item){
		return sum + item.count * item.price;
	},0);
	return totalPrice;
}

function toString(buildItems, totalPrice){
	var header = '***<没钱赚商店>收据***\n';
	var itemsBody = buildItemsString(buildItems);
	var footer = '\n----------------------\n总计：' + formatPrice(totalPrice) + '(元)\n**********************';

	return header + itemsBody + footer;

}

function buildItemsString(buildItems){
	var itemsStr = buildItems.map(function(item){
		return '名称：' + item.name 
			+'，数量：' + item.count + item.unit 
			+'，单价：' + formatPrice(item.price) 
			+ '(元)，小计：' + formatPrice(item.count * item.price) + '(元)';
	});
	return itemsStr.join('\n');
}

function formatPrice(price){
	var NUMBER = 2;
	return price.toFixed(NUMBER);
}

