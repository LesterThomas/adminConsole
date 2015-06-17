'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
	.controller('MainCtrl', ['$scope', '$timeout','$interval','$http', 'queryDockerService',    function ($scope, $timeout,$interval,$http,queryDockerService) {
  	
    $scope.myData = {};
    $scope.containers=queryDockerService.containers;
    $scope.containersColour="red";

    $scope.chaosMonkey="Off";
    $scope.chaosMonkeyColour="yellow";
    if (queryDockerService.chaosMonkey) {
    	$scope.chaosMonkey="On";
    	$scope.chaosMonkeyColour="green";
    };    

    $scope.autoRecovery="Off";
    $scope.autoRecoveryColour="yellow";
    if (queryDockerService.autoRecovery) {
    	$scope.autoRecovery="On";
    	$scope.autoRecoveryColour="green";
    };
    
    $http.get("http://172.17.42.1:4243/containers/json")
    		.success(function (response) {
			$scope.containers.splice(0, $scope.containers.length);
			
			for (var index=0;index<response.length;index++){
				if ((response[index].Image==queryDockerService.ZTUAContainer) || (response[index].Image==queryDockerService.ZTUBContainer)) {
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



    
