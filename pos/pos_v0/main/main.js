'use strict';

function printReceipt(inputs) {
  var items = buildItems(inputs);
  var totalPrice = calculateTotalPrice(inputs);
  var result = toString(items, totalPrice);
 console.log(result);
}

function buildItems(inputs){
  return inputs.map(function (input) {
    return '名称：' + input.name
      + '，数量：' + input.count + input.unit
      + '，单价：' + formatPrice(input.price)
      + '(元)，小计：' + formatPrice(input.count * input.price) + '(元)';
  });
}

function calculateTotalPrice (inputs) {
  return formatPrice(inputs.reduce(function(total,input){
    return total + input.count * input.price;
  },0));

}

function toString (items, totalPrice) {
  var header = '***<没钱赚商店>收据***\n';
  var body = items.join('\n');
  var footer ='\n----------------------\n'
     +'总计：'+ totalPrice + '(元)\n'
     + '**********************';
  return header + body + footer;
}

function formatPrice (price) {
  var NUMBER = 2;
  return price.toFixed(NUMBER);
}

var data1 = [
  {
    tf:"1",
    bf:"2"
  },
  {
    tf:"3",
    bf:"4"
  },
  {
    tf:"5",
    bf:"6"
  }
]

var output = [
  {
    ab:"1",
    cd:"2"
  },
  {
    ab:"3",
    cd:"4"
  },
  {
    ab:"5",
    cd:"6"
  }

]
formatKey();

function formatKey () {
  var keyValue = {
    'tf': 'ab',
    'bf': 'cd'
  }

  var array =  data1.map(function (data) {
    var object = {};
    for(var key in data){
      var oKey = keyValue[key];
      object[oKey] = data[key];
    }
    return object;
  })


}


