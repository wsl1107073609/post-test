'use strict';

//TODO: 请在该文件中实现练习要求并删除此注释
function printReceipt(tags){
	
	var cartItems = getCartItems(tags, Item.all());

	var cartItemsRecipts = getCartItemsRecipt(cartItems, Promotion.all());

	var discountAndTotalPrice = calcDiscountAndTotalPrice(cartItemsRecipts);

	var printRecepit = toString(cartItemsRecipts, discountAndTotalPrice);

	console.log(printRecepit);

}

function getCartItems(tags, allItems){
	var barcodeCounts = getBarcodeCounts(tags);
	var cartItems = [];
	allItems.forEach(function(allItem){
		var count = barcodeCounts[allItem.barcode];
		if(count){			
		 	cartItems.push({allItem, count: count, totalPrice:  allItem.price * count});
		}
	});
	return cartItems;
}


function getBarcodeCounts(tags){
	var barcodeCounts = {};
	tags.forEach(function(tag){
		var tagArray = tag.split('-');
		var barcode = tagArray[0];
		var count = parseFloat(tagArray[1] || 1);

		barcodeCounts[barcode] = barcodeCounts[barcode] ? barcodeCounts[barcode] + count : count;
	});
	return barcodeCounts;
}

function getCartItemsRecipt(cartItems, allPromotions){
	return cartItems.map(function(cartItem){
		var cartItemPromotionType = getCartItemsPromotionType(cartItem.allItem.barcode, allPromotions);
		var promotionPrice = calcPromotionPrice(cartItem, cartItemPromotionType);

		return Object.assign({}, cartItem, {
			promotionPrice: promotionPrice, 
			totalPrice: cartItem.totalPrice - promotionPrice
		});
	});
}

function getCartItemsPromotionType(barcode, allPromotions){
	return allPromotions.filter(function(allPromotion){
		return allPromotion.barcodes.some(function(promotionBarcode){
			return barcode === promotionBarcode;
		})
	}).map(function(promotion){
		return promotion.type;
	});
}

function calcPromotionPrice(cartItem, cartItemPromotionType){
	switch(cartItemPromotionType[0]){
		case 'BUY_TWO_GET_ONE_FREE':
			return parseInt(cartItem.count / 3) * cartItem.allItem.price;
			break;
		default:
			return 0;
	}
}

function calcDiscountAndTotalPrice(cartItemsRecipts){
	return cartItemsRecipts.reduce(function(priceObject, cartItemsRecipt){
		return Object.assign({}, priceObject, {
			discountTotalPrice: priceObject.discountTotalPrice + cartItemsRecipt.promotionPrice,
			payTotalPrice: priceObject.payTotalPrice + cartItemsRecipt.totalPrice
		});
	}, {discountTotalPrice: 0, payTotalPrice: 0});
}

function toString(cartItemsRecipts, discountAndTotalPrice){
	var header = '***<没钱赚商店>收据***\n';
	var printDate = '打印时间：'+ printReceiptDate() +'\n----------------------\n'
	var itemsBody = cartItemsRecipts.map(function(cartItemsRecipt){
		return '名称：' + cartItemsRecipt.allItem.name 
			+'，数量：' + cartItemsRecipt.count + cartItemsRecipt.allItem.unit 
			+'，单价：' + formatPrice(cartItemsRecipt.allItem.price) 
			+ '(元)，小计：' + formatPrice(cartItemsRecipt.totalPrice) + '(元)';
	}).join('\n');
	var footer = '\n----------------------\n总计：' 
				+ formatPrice(discountAndTotalPrice.payTotalPrice) + '(元)\n节省：'
				+ formatPrice(discountAndTotalPrice.discountTotalPrice) + '(元)\n'
				+'**********************';

	return header + printDate + itemsBody + footer;
}

function formatPrice(price){
	var NUMBER = 2;
	return price.toFixed(NUMBER);
}


function printReceiptDate(){
	const dateDigitToString = num => (num < 10 ? `0${num}` : num);
	const currentDate = new Date(),
      year = dateDigitToString(currentDate.getFullYear()),
      month = dateDigitToString(currentDate.getMonth() + 1),
      date = dateDigitToString(currentDate.getDate()),
      hour = dateDigitToString(currentDate.getHours()),
      minute = dateDigitToString(currentDate.getMinutes()),
      second = dateDigitToString(currentDate.getSeconds()),
      formattedDateString = `${year}年${month}月${date}日 ${hour}:${minute}:${second}`;
    return formattedDateString;
}