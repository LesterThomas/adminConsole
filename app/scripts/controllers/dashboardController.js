'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
	.controller('DashboardCtrl', ['$scope', '$timeout','$interval','$http', 'containersService',    function ($scope, $timeout,$interval,$http,containersService) {
  	
    $scope.myData = {};
    $scope.containers=containersService.containers;
    $scope.containersColour="red";

    $scope.chaosMonkey="Off";
    $scope.chaosMonkeyColour="yellow";
    if (containersService.chaosMonkey) {
    	$scope.chaosMonkey="On";
    	$scope.chaosMonkeyColour="green";
    };    

    $scope.autoRecovery="Off";
    $scope.autoRecoveryColour="yellow";
    if (containersService.autoRecovery) {
    	$scope.autoRecovery="On";
    	$scope.autoRecoveryColour="green";
    };
    
    $http.get("http://172.17.42.1:4243/containers/json")
    		.success(function (response) {
			$scope.containers.splice(0, $scope.containers.length);
			
			for (var index=0;index<response.length;index++){
				if ((response[index].Image==containersService.ZTUAContainer) || (response[index].Image==containersService.ZTUBContainer)) {
			    		$scope.containers.push(response[index]);
				}		
			}
			$scope.instances=$scope.containers.length;
		});

	$scope.$watch("containers.length", function(){
    	//alert('$scope.containers.length=' + $scope.containers.length);// do whatever you need with the just-changed $scope.value
	    $scope.containersColour="red";
	    if ($scope.containers.length>0) {
	    	$scope.containersColour="yellow";
	    }
	    if ($scope.containers.length>2) {
	    	$scope.containersColour="green";
	    }
	    //alert("$scope.containersColour="+$scope.containersColour)
	});



  }]);



    
