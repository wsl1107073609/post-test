'use strict';
function printReceipt(tags){

	var buyItems = buildBuyItems(loadAllItems(), tags);
	var cartItems = generateCartItems(buyItems, loadPromotions());
	var totalAndPromoPrice = calcAllPriceOfCartItems(cartItems);
	var printReceipt = toString(cartItems, totalAndPromoPrice);

	console.log(printReceipt);
}

function buildBuyItems(allItems, tags){
	var barcodeCounts = getBarcodeCount(tags);
	var buyItems = [];
	allItems.forEach(function(item){
		var count = barcodeCounts[item.barcode];
		if(count){
			buyItems.push({item: item, count: count, totalPrice: item.price * count});
		}
	})
	return buyItems;
}

function getBarcodeCount(tags){
	//calculate the barcodeCount of tags
	var barcodeCounts = {};
	tags.forEach(function(tag){
		var tagArray = tag.split('-');
		var barcode = tagArray[0];
		var count = parseFloat(tagArray[1] || 1);

		barcodeCounts[barcode] = barcodeCounts[barcode] ? barcodeCounts[barcode] + count : count;		
	});
	return barcodeCounts;
}

function generateCartItems(buyItems, loadPromotions){
	return buyItems.map(function(buyItem){
		var promotionType = findPromotionType(buyItem.item.barcode, loadPromotions);
		var discountPrice = calcDiscountPriceForItem(promotionType, buyItem);
		return Object.assign({}, buyItem, {discountPrice: discountPrice, totalPrice: buyItem.totalPrice - discountPrice});
	});
}

function findPromotionType(barcode, allPromotions) {
	return allPromotions.filter(function(promotion){
		//method: some() => return boolean
		//return promotion.barcodes.some(promotionBarcode => promotionBarcode === barcode);
		
		//return promotion.barcodes.some(function(promotionBarcode){
		// 	return promotionBarcode === barcode;
		//})

		//method: find() => return an element
		return promotion.barcodes.find(function(promotionBarcode){
			return promotionBarcode === barcode;
		});

	}).map(function(promotion){
		return promotion.type;
	})
}

function calcDiscountPriceForItem(promotionType, buyItem){
	switch(promotionType[0]){
		case 'BUY_TWO_GET_ONE_FREE':
			return parseInt(buyItem.count / 3) * buyItem.item.price;
			break;
		case 'BUY_THREE_GET_ONE_FREE':
			return parseInt(buyItem.count / 4) * buyItem.item.price;
			break;
		default:
			return 0;
	}
}

function calcAllPriceOfCartItems(cartItems){
	return cartItems.reduce(function(priceObject, cartItem){
		return Object.assign({}, priceObject, {
			totalPrice: priceObject.totalPrice + cartItem.totalPrice,
			discountPrice: priceObject.discountPrice + cartItem.discountPrice 
		})
	}, {totalPrice: 0, discountPrice: 0});
}

function toString(cartItems, totalAndPromoPrice){
	var header = '***<没钱赚商店>收据***\n';
	var itemsBody = cartItems.map(function(cartItem){
		return '名称：' + cartItem.item.name 
			+'，数量：' + cartItem.count + cartItem.item.unit 
			+'，单价：' + formatPrice(cartItem.item.price) 
			+ '(元)，小计：' + formatPrice(cartItem.totalPrice) + '(元)';
	}).join('\n');
	var footer = '\n----------------------\n总计：' 
				+ formatPrice(totalAndPromoPrice.totalPrice) + '(元)\n节省：'
				+ formatPrice(totalAndPromoPrice.discountPrice) + '(元)\n'
				+'**********************';

	return header + itemsBody + footer;
}

function formatPrice(price){
	var NUMBER = 2;
	return price.toFixed(NUMBER);
}
