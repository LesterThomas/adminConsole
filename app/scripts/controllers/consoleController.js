'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:ConsoleCtrl
 * @description
 * # MainCtrls
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('ConsoleCtrl', ['$scope', '$timeout','$interval','$http', 'queryDockerService',    function ($scope, $timeout,$interval,$http,queryDockerService) {
  	
    $scope.myData = {};
    $scope.containers=queryDockerService.containers;
    $scope.percentageUpgraded=0;
    $scope.chaosSwitchStatus=queryDockerService.chaosMonkey;
    $scope.scaleSwitchStatus=queryDockerService.autoRecovery;
    $scope.upgradeSwitchStatus=queryDockerService.upgrade;
    
    $http.get("http://127.0.0.1:4243/containers/json")
    		.success(function (response) {
			$scope.containers.splice(0, $scope.containers.length);
			
			for (var index=0;index<response.length;index++){
				if ((response[index].Image==queryDockerService.ZTUAContainer) || (response[index].Image==queryDockerService.ZTUBContainer)) {
			    		$scope.containers.push(response[index]);
				}		
			}
			$scope.instances=$scope.containers.length;
		});

    $scope.$watch("instances", function(){
    	queryDockerService.instances=$scope.instances;
    	//alert('instances=' + $scope.instances);// do whatever you need with the just-changed $scope.value
	});

	$scope.$watch("scaleSwitchStatus", function(){
		queryDockerService.autoRecovery=$scope.scaleSwitchStatus;
    	//alert('scaleSwitchStatus=' + queryDockerService.autoRecovery);// do whatever you need with the just-changed $scope.value
    	if ($scope.scaleSwitchStatus){
    		$('#instancesSlider').show(400);
		} else {
			$('#instancesSlider').hide(400);
		}
	});
 
 	$scope.$watch("chaosSwitchStatus", function(){
 		queryDockerService.chaosMonkey=$scope.chaosSwitchStatus;
    	//alert('scaleSwitchStatus=' + $scope.scaleSwitchStatus);// do whatever you need with the just-changed $scope.value
	}); 	

	$scope.$watch("upgradeSwitchStatus", function(){
		queryDockerService.upgrade=$scope.upgradeSwitchStatus;
    	//alert('scaleSwitchStatus=' + $scope.scaleSwitchStatus);// do whatever you need with the just-changed $scope.value
    	if ($scope.upgradeSwitchStatus){
    		$('#appImage2').show(400);
    		$('#percentageSlider').show(400);
		} else {
			$('#appImage2').hide(400);
			$('#percentageSlider').hide(400);
		}
	});


	
 



}]);
