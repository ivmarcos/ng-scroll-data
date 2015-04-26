var app = angular.module('app', ['ng-scroll-data']);
app.controller('testController', function($scope){

	$scope.data = [];
		
	function createModels(size){
		for (var i = 0; i < size; i++){
			var model = {
				id : i,		
				title : 'Sample model ' + i
			};
			$scope.data.push(model);
		}
	};

	createModels(1000);
});


