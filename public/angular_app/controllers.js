
app.controller('SimpleController' , function ($scope, mongoFactory) {
      $scope.names = {};
      init();
      function init() {
            mongoFactory.getMongoStuff()
              .then(function (invoice) {
                $scope.names = invoice;
              }, function (error) {
                console.error(error);
              });
      };
      $scope.food = {
      pizza       : {count: 1, id:2, detail: "Brick Oven Pizza", price: 15, category: "pizzas"},
      donut       : {count: 3, id:3, detail: "Glazed Donut",price: 8, category: "breakfast"},
      tortilla    : {count: 1, id:4, detail: "Tortilla Chips",price: 3, category: "tortilla"},
      burger      : {count: 1, id:5, detail: "Burger",price: 3, category: "snacks"},
      samosa      : {count: 1, id:6, detail: "Delicious Samosas",price: 3, category: "snacks"},
      coldcoffee  : {count: 1, id:7, detail: "Cold Coffee",price: 2, category: "cold drinks"},
      hotcoffee   : {count: 1, id:8, detail: "Hot Coffee",price: 2, category: "hot drinks"},
      coke        : {count: 1, id:9, detail: "Coke",price: 2, category: "cold drinks"},
      dietcoke    : {count: 1, id:10, detail: "Diet Coke",price: 2, category: "cold drinks"},
      pepsi       : {count: 1, id:11, detail: "Pepsi",price: 2, category: "cold drinks"}
    };
    $scope.itemsCnt = 1;
    $scope.order = [];
    $scope.isDisabled = true;

    function isEmpty(obj) {
    return Object.keys(obj).length === 0;
    }
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
    }
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

// app.controller('POSController' , function ($scope, mongoFactory) {
//           function updateTime() {
//           var $scope.myDate = new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
//             //- var d = new Date;
//             //- var hours = d.getHours();
//             //- var mins = d.getMinutes();
//             //- var secs = d.getSeconds();
//             //- if(hours > 12){
//             //-     var hour = (hours - 12);
//             //-     var ampm = "PM";
//             //- }
//             //- else{
//             //-     var hour = hours;
//             //-     var ampm = "AM";
//             //- } 
//             //- var time = hour + ":" + mins + ':' + secs + ' ' + ampm;
//             $("#clock").html(myDate);
//             }
//           $(document).ready(function(){
//             updateTime();
//             $scope.clock = window.setInterval(updateTime, 1000);
//             var i=1;
//           $("#add_row").on("click", function(){
//                 if ($(this).attr("disabled")==true ) return;
//                 $('#summaryrow').before('<tr id="addr'+(i)+'"></tr>');
//                 $('#addr'+(i)).html("<td><input name='itemcode["+i+"]' type='text' placeholder='567797' class='form-control input-md' /> </td>"
//                     + "<td><input  name='itemname["+i+"]' type='text' placeholder='Cafe Latte'  class='form-control input-md'></td>"
//                     + "<td><div class='form-control category' value='' name='category["+i+"]'></div></td>"
//                     + "<td><div class='input-group'><span class ='input-group-addon'>$</span><input  name='unitprice["+i+"]'  placeholder='$12.00' value='0.00'  class='price form-control input-md'></div></td>"
//                     + "<td><input  name='quantity["+i+"]' placeholder='2'  value='1' class='qty form-control input-md'></td>"
//                     + "<td><div class='input-group'><span class ='input-group-addon'>$</span><div  name='subtotal_ln["+i+"]'  placeholder='0.00' value='0.00'  class='subtotal Text-right form-control input-md'>0.00</div></td>"
//                     + "<td class='text-center'><a id='delete_row_"+i+"'  type='text' placeholder='Mobile'  class='btn btn-danger fa fa-trash-o fa-lg'></td>");
//                     //- + "<td class='text-center'><a id='add_row'  type='text' placeholder='Mobile'  class='btn btn-success btn-sm pull-right'>+</td>");

//                 i++;


//               });
//             });

//           $(document).on("click",'[id^=delete_row]',function(){
//               if ($(this).attr("disabled")==true ) return;
//               var $scope.i = $(this).attr('id').replace(/delete_row_/, '');

//               if($scope.i>=1){
//               $("#addr"+($scope.i)).html('');
//               }
//               else{
//               $("#addr0").find('input').val('');
//               $("#addr0").find("[name='quantity[0]']").val('1');
//               $("#addr0").find('.subtotal').text('0.00');
//               }

//               var $scope.total = 0;
//               $("#tab_logic  [name*='subtotal_ln']").each(function(){
//               var $scope.subT = parseFloat($(this).text());
//               if (! $.isNumeric($scope.subT))
//                {
//                $(this).text('0.00');
//                }
//                $scope.total += parseFloat($(this).text());
//                });

//                $("#tab_logic  [name='beforetax']").text( $scope.total.toFixed(2));
//                $("#tab_logic  [name='tax']").text( (0.0875*$scope.total).toFixed(2));
//                $("#tab_logic  [name='aftertax']").text((1.0875*$scope.total).toFixed(2));
//               });

//           $(document).on("keyup","#tab_logic [name*='unitprice'], #tab_logic [name*='quantity'], [name*='itemcode']",function(){

//             this.value = this.value.replace(/[^0-9\.]/g,''); // TO ENSURE NUMERIC IS ENTERED
//             var $scope.E=jQuery(this).parents('tr').filter(':first');
//             var $scope.subT=parseInt($scope.E.find("[name*='quantity']").val(),10) * parseFloat($scope.E.find("[name*='unitprice']").val());
//             if ($.isNumeric(subT))
//              {
//              $scope.E.find('.subtotal').text(subT.toFixed(2));
//              }
//             else
//              {
//              $scope.E.find('.subtotal').text('0.00');
//              }
//               var $scope.total = 0;
//               $("#tab_logic  [name*='subtotal_ln']").each(function(){
//                $scope.total += parseFloat(this.innerHTML)
//                });
//                $("#tab_logic  [name='beforetax']").text($scope.total.toFixed(2));
//                $("#tab_logic  [name='tax']").text( (0.0875*$scope.total).toFixed(2));
//                $("#tab_logic  [name='aftertax']").text((1.0875*$scope.total).toFixed(2));
//               });
//             $( document.body ).on( 'click', '.dropdown-menu li', function( event )
//             {
//               var $scope.target = $( event.currentTarget );
//               $target.closest( '.btn-group' )
//               .find( '[data-bind="label"]' ).text( $target.text() )
//               .end()
//               .children( '.dropdown-toggle' ).dropdown( 'toggle' );
//               return false;
//               });


//             $(document).on('ready', function() {

//             $('form#trans_complete').bind('submit', function(event){
//             event.preventDefault();
//             if ($("#tab_logic  [name='aftertax']").text()== '0.00') return true;
//             $('#transaction_btn').text('Posting'); //  CHANGE BUTTON NAME
//             $('#transaction_btn').attr("disabled","disabled"); // DISABLE BUTTON TO PREVENT ACCIDENTAL POSTING



//             var $scope.bill_detail = new Object();
//             var $scope.table = $('form#trans_complete[name]').serialize();
//             var $scope.item_data = [];
//             var $scope.row_patt = /\[(\d+)\]$/; // Gets the row number inside []
//             var $scope.name_patt = /^[^\[]+/; // Gets the name without the [0]

//             $('#trans_complete [name]').each( function(index, ele){
//                 var $scope.el_val ='';
//                 if ($scope.ele.tagName == "INPUT"  || $scope.ele.tagName == "SELECT"){
//                   $scope.el_val = $scope.ele.value;
//                   }
//                 else
//                   {
//                   $scope.el_val = $(this).text();
//                   }
//                 // Get the name of input and row number
//                 if ( row_patt.exec($(this).attr('name')) === null)  {
//                   //var obj={};
                  
//                   bill_detail[$(this).attr('name')] = el_val;
//                   //bill_detail.push(obj);

//                 } // USE IT FOR REGULAR USE
//               else
//                 {
                
//                 var rowNum = parseInt(row_patt.exec($(this).attr('name'))[1]);
//                 var name = name_patt.exec($(this).attr('name'));
//                  if( item_data[rowNum] === undefined ){
//                     item_data[rowNum] = {};
//                 }

//                 item_data[rowNum][name] = el_val;
//                 }
//             });
  
//             bill_detail['item_details']=item_data;
//             //bill_detail.push(obj);
//             //-  PUSH AJAX
//             //UPON SUCCESS - REMOVE CONTENT AND GIVE SUCCESS MESSAGE
//             var _post_req = $.ajax({
//             url: '/post-billing',
//             type: 'POST',
//             dataType   : 'json', //EXPECTING JSON TO BE RETURNED
//             contentType: 'application/json; charset=UTF-8',
//             data: JSON.stringify(bill_detail) 
//             });

//             _post_req.success(function(data){
//                 $('#transaction_btn').text('Success'); //  CHANGE BUTTON NAME
//                 $('#trans_complete [name]').prop('disabled',true);
//                 $('[id^=delete_row], [id^=add_row]').attr("disabled",true);
//                 $('#new_receipt').removeAttr('disabled');
//                 $('#print_receipt').removeAttr('disabled');


                
//             })

//             _post_req.fail(function(jqXHR, textStatus) {
//             console.log("Request failed: " + textStatus); // MESSAGE AREA WITH ERROR
//             $('#transaction_btn').removeAttr('disabled'); // DISABLE BUTTON TO PREVENT ACCIDENTAL POSTING
//             $('#transaction_btn').text('Post Bill');

//             });

//               });
//             });

//           $('#new_receipt').click(function(event) {
//             event.preventDefault();

//             var _post_req = $.ajax({
//             url: '/new-billing',
//             type: 'POST',
//             dataType   : 'json', //EXPECTING JSON TO BE RETURNED
//             contentType: 'application/json; charset=UTF-8'
//             });

//             _post_req.success(function(data){

//             $('#receipt_no').text(data['receipt_no']);
//             $('#transaction_btn').text('Post Bill'); //  CHANGE BUTTON NAME
//             $('#transaction_btn').attr("disabled",false); //  CHANGE BUTTON NAME
//             $('#trans_complete [name]').prop('disabled',false);
//             $('[id^=delete_row], [id^=add_row]').attr("disabled",false);
//             $('#new_receipt').attr('disabled',true);
//             $('#print_receipt').attr('disabled',true);
//             $('[id^=addr]:not(:first)').remove(); // REMOVE ALL OTHER NEW ROWS

//             $('#trans_complete').find('input:text, input:password, input:file, textarea').val(''); // RESET FORM
//             $('#trans_complete').find('input:radio, input:checkbox').removeAttr('checked').removeAttr('selected');   // RESET FORM   
//             $('div[name]').each(function(){
//                 $(this).text($(this).attr('value')); //RESET FORM
//               });

//              })

//             //window.location.reload(true);

         
//           });