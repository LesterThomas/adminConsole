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
    $scope.containersTimer=null;
    $scope.chaosSwitchStatus=queryDockerService.chaosMonkey;
    $scope.scaleSwitchStatus=queryDockerService.autoRecovery;
    $scope.upgradeSwitchStatus=queryDockerService.upgrade;

    function queryDockerContainers() {
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
    }

    //start periodic checking
    //alert(queryDockerService.initiated);
    if ($scope.containersTimer) { }
		else {
      	$scope.containersTimer=$interval(queryDockerContainers, 1000);
    	}

    $scope.$on('$destroy', function() {
	  // Make sure that the interval is destroyed too
  	  if ($scope.containersTimer) {
            $interval.cancel($scope.containersTimer);
	    $scope.containersTimer=null;
	    //alert('stopping interval');
	    }
	});	 	

    $scope.$watch("instances", function(){
    	queryDockerService.instances=$scope.instances;

    	//call the web service to increase the number of instances

    	
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
