'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
	.controller('DashboardCtrl', ['$scope', '$timeout','$interval','$http', 'containersService','logsService',    function ($scope, $timeout,$interval,$http,containersService,logsService ) {
  	
    $scope.console = containersService.console;
    $scope.logger = logsService.logger;
    $scope.containersColour="red";

    

    $scope.chaosMonkey="Off";
    $scope.chaosMonkeyColour="yellow";
    if (containersService.console.chaosMonkey) {
    	$scope.chaosMonkey="On";
    	$scope.chaosMonkeyColour="green";
    };    

    $scope.autoRecovery="Off";
    $scope.autoRecoveryColour="yellow";
    if (containersService.console.autoRecovery) {
    	$scope.autoRecovery="On";
    	$scope.autoRecoveryColour="green";
    };
    
    containersService.console.queryDockerContainers($scope);

	$scope.$watch("console.containers.length", function(){
    	//alert('$scope.containers.length=' + $scope.containers.length);// do whatever you need with the just-changed $scope.value
	    $scope.containersColour="red";
	    if ($scope.console.containers.length>0) {
	    	$scope.containersColour="yellow";
	    }
	    if ($scope.console.containers.length>2) {
	    	$scope.containersColour="green";
	    }
	    //alert("$scope.containersColour="+$scope.containersColour)
	});



  }]);



    
