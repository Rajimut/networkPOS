angular.module('HelloWorld')
  .factory('mongoFactory', function ($q, $http) {
    return {
      getMongoStuff: function () {
        var deferred = $q.defer(),
          httpPromise = $http.get('/api/components');
 
        httpPromise.success(function (invoice) {
          deferred.resolve(invoice);
        })
          .error(function (error) {
            console.error('Error: ' + error);
          });
 
        return deferred.promise;
      }
    };
  });