angular.module('app.directives.addRow', [])
	.directive('addRow', function() {
		return {
			restrict: 'AEC',
			scope: {
				data: '='

				},
			template: '<div class="col-md-6 col-sm-6 text-left"><div class="input-group"><span class="input-group-addon"><strong>Billed‌·to</strong></span><input class="form-control" type="text" name="buyer_name"></div></div>',
			controller: function($scope, $interval){
				//-alert('controller');
				console.log($scope.data);
			}
		};
	});