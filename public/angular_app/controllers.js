
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
      }
      // $http({method: 'GET', url: '/test_data/a.json'}).success(function(buyertransactions_) {
      // $http.get("/test_data/a.json")
         // .success(function (response) {$scope.names = response.transactionrecords;});
      //$scope.names=t;
      // $scope.message = "it works!";
      // $scope.names = [ { name: 'Jon AAAAS', city: 'Phoenix' }, { name: 'Jack Wahlin', city:'San Fancisco' }, { name: 'Jill Doe', city:'Las Vegas' }, { name: 'James', city:'LA' }  ];
      // onsole.log($scope.names);
});