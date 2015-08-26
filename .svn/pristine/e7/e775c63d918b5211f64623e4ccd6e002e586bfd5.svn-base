var chromecast_module = angular.module('chromecast_module', []);

function chromecast_controller($scope, $http, $compile) {
	
	$scope.load = function(){
		$http({
		    url: '/list', 
		    method: "GET",
		    params: {list : ['T_Drive/TV','USB_Storage/TV/']},
			headers: {
				'Content-Type': 'json'
			}
		 }).success(function(data) {
			 console.log(data)
			$scope.folders = data;
		}).error(function(data) {
			console.log('Error1: ' + data);
		});
	};
	
	$scope.populate = function(path){
		console.log(path)
		$http({
		    url: '/list', 
		    method: "GET",
		    params: {list : [path]},
			headers: {
			   'Content-Type': 'json'
			 }
		 }).success(function(data) {
			 console.log(data)
			$scope.files = data;
		}).error(function(data) {
			console.log('Error1: ' + data);
		});
	};
	
	$scope.open_media = function(data){
		console.log(data)
		$scope.video = "ftp://69.122.11.113:2000/shares/" + data;
	}

}