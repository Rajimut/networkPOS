
app.controller('SimpleController' , function ($scope, mongoFactory) {
      $scope.names = {};
      /* Used to connect to mongodb using mongoFactory.js */
      // init();
      // function init() {
      //       mongoFactory.getMongoStuff()
      //         .then(function (invoice) {
      //           $scope.names = invoice;
      //         }, function (error) {
      //           console.error(error);
      //         });
      // };
      $scope.food = {
      A2A      : {count: 1, id:"A2A", detail: "Brick Oven Pizza", price: 15, category: "pizzas"},
      B3A      : {count: 3, id:"B3A", detail: "Glazed Donut",price: 8, category: "breakfast"},
      D4A      : {count: 1, id:"D4A", detail: "Tortilla Chips",price: 3, category: "tortilla"},
      F5B      : {count: 1, id:"F5B", detail: "Burger",price: 3, category: "snacks"},
      G6C      : {count: 1, id:"G6C", detail: "Delicious Samosas",price: 3, category: "snacks"},
      E7D      : {count: 1, id:"E7D", detail: "Cold Coffee",price: 2, category: "cold drinks"},
      E8C      : {count: 1, id:"E8C", detail: "Hot Coffee",price: 2, category: "hot drinks"},
      W9E      : {count: 1, id:"W9E", detail: "Coke",price: 2, category: "cold drinks"},
      P0W     : {count: 1, id:"P0W", detail: "Diet Coke",price: 2, category: "cold drinks"},
      Y1H     : {count: 1, id:"Y1H", detail: "Pepsi",price: 2, category: "cold drinks"}
    };
    $scope.itemsCnt = 1;
    $scope.order = [];
    $scope.isDisabled = true;

    function isEmpty(obj) {
    return Object.keys(obj).length === 0;
    }

    $scope.Emptyrow = function() {
      $scope.orderedItemCnt = 1;
      var foodItem = {
        orderedItemCnt : 1,
        totalPrice : 0,
        itemId : 0,
        id : $scope.itemsCnt,
        item : 'donut'
      };
      var cartItems = $.grep($scope.order, function(e){ return e.itemId == 0; });
      if(cartItems.length > 0  && !isEmpty($scope.order)){
            //-cartItems[0].orderedItemCnt = ++ cartItems[0].orderedItemCnt;
            cartItems[0].totalPrice = 0 * cartItems[0].orderedItemCnt;
         }
      else{
            $scope.order.push(foodItem);
            $scope.itemsCnt = $scope.order.length;
         }
    };

    $scope.change = function(item, $index) {
      $scope.orderedItemCnt = 1;
      var foodItem = {
        orderedItemCnt : 1,
        totalPrice : item.price,
        itemId : item.id,
        id : $scope.itemsCnt,
        item : item
      };
      var cartItems = $.grep($scope.order, function(e){ return e.itemId == 0; });
      if(cartItems.length > 0  && !isEmpty($scope.order)){
            //-cartItems[0].orderedItemCnt = ++ cartItems[0].orderedItemCnt;
            cartItems[0].totalPrice = item.price * cartItems[0].orderedItemCnt;
         }
      else{
            $scope.order.push(foodItem);
            //-$scope.itemsCnt = $scope.order.length;
         }
    };

    $scope.editItem = function() {
        angular.element(document.getElementById("modal")).scope().item = item;
    };

    $scope.add = function(item) {
    $scope.orderedItemCnt = 1;
    var foodItem = {
      orderedItemCnt : 1,
      totalPrice : item.price,
      itemId : item.id,
      id : $scope.itemsCnt,
      item : item
    };


      // Find if the item is already in Cart
      var cartItems = $.grep($scope.order, function(e){ return e.itemId == item.id; });

       if(cartItems.length > 0  && !isEmpty($scope.order)){
          cartItems[0].orderedItemCnt = ++ cartItems[0].orderedItemCnt;
          cartItems[0].totalPrice = item.price * cartItems[0].orderedItemCnt;
       }
       else{
          $scope.order.push(foodItem);
          $scope.itemsCnt = $scope.order.length;
       }
    };

    // $scope.addRow = function() {
    // $scope.orderedItemCnt = 1;
    // var NewfoodItem = {
    //   orderedItemCnt : 1,
    //   totalPrice : 0,
    // };

    //   // Find if the item is already in Cart
    //   var cartItems = $.grep($scope.order, function(e){ return e.itemId == $scope.item.id; });

    //    if(cartItems.length > 0  && !isEmpty($scope.order)){
    //       cartItems[0].orderedItemCnt = ++ cartItems[0].orderedItemCnt; 
    //       cartItems[0].totalPrice = item.price * cartItems[0].orderedItemCnt;
    //    }
    //    else{
    //       $scope.order.push(NewfoodItem);
    //       $scope.itemsCnt = $scope.order.length; 
    //    }
    // };

    $scope.getSum = function() {
      var i = 0,
        sum = 0;

      for(; i < $scope.order.length; i++) {
        sum += parseInt($scope.order[i].totalPrice, 10);
      }
      return sum;
    };
    $scope.addItem = function(item, index) {
          item.orderedItemCnt = ++ item.orderedItemCnt;
          item.totalPrice = item.item.price * item.orderedItemCnt;
    };
    $scope.subtractItem = function(item, $index)
    {
      if (item.orderedItemCnt > 1) {
          item.orderedItemCnt = -- item.orderedItemCnt;
          item.totalPrice = item.item.price * item.orderedItemCnt;
      }
      else{
          $scope.isDisabled = true;
          // isDisabled = false;    
         // $("#SubstractItemBtn").prop("disabled", true);
      }
    };
    $scope.deleteItem = function(index) {
      $scope.order.splice(index, 1);
    };
    
    $scope.checkout = function(index) {
      alert("Order total: $" + $scope.getSum() + "\n\nPayment received. Thanks.");
    };
    
    $scope.clearOrder = function() {
      $scope.order = [];
    };
      // $http({method: 'GET', url: '/test_data/a.json'}).success(function(buyertransactions_) {
      // $http.get("/test_data/a.json")
         // .success(function (response) {$scope.names = response.transactionrecords;});
      //$scope.names=t;
      // $scope.message = "it works!";
      // $scope.names = [ { name: 'Jon AAAAS', city: 'Phoenix' }, { name: 'Jack Wahlin', city:'San Fancisco' }, { name: 'Jill Doe', city:'Las Vegas' }, { name: 'James', city:'LA' }  ];
      // onsole.log($scope.names);
});