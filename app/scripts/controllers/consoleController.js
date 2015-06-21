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
    $scope.percentageUpgraded=queryDockerService.percentageUpgraded;
    $scope.containersTimer=null;
    $scope.chaosSwitchStatus=queryDockerService.chaosMonkey;
    $scope.scaleSwitchStatus=queryDockerService.autoRecovery;
    $scope.upgradeSwitchStatus=queryDockerService.upgrade;
    $scope.instances=3;
    $scope.autoScalerTimer=null;
    $scope.ZTUAContainer=queryDockerService.ZTUAContainer;
    $scope.ZTUBContainer=queryDockerService.ZTUBContainer;

    function queryDockerContainers() {
    	$http.get("http://172.17.42.1:4243/containers/json")
    		.success(function (response) {
			$scope.containers.splice(0, $scope.containers.length);
			
			for (var index=0;index<response.length;index++){
				if ((response[index].Image==queryDockerService.ZTUAContainer) || (response[index].Image==queryDockerService.ZTUBContainer)) {
			    		$scope.containers.push(response[index]);
				}		
			}
			//$scope.instances=$scope.containers.length;
		});
    }

    function setInstances() {
        var numberOfInstanceA=Math.round($scope.instances*(100-$scope.percentageUpgraded)/100);
        var numberOfInstanceB=Math.round($scope.instances*($scope.percentageUpgraded)/100);
        alert('setInstances '+ $scope.ZTUAContainer +' to ' + numberOfInstanceA + ', ' + $scope.ZTUBContainer +' to ' + numberOfInstanceB);
        $http.post('http://localhost:1880/docker/scaler', {image: $scope.ZTUAContainer, instances: numberOfInstanceA}).
            success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                //alert(data);
             })


        if ($scope.ZTUBContainer.localeCompare($scope.ZTUAContainer)!=0) { //only do this if the images are different
        
            $http.post('http://localhost:1880/docker/scaler', {image: $scope.ZTUBContainer, instances: numberOfInstanceB}).
                success(function(data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
                    //alert(data);
                 })
            }
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
        $timeout.cancel($scope.autoScalerTimer);
        
        $scope.autoScalerTimer=$timeout(setInstances,1000);
        //call the web service to increase the number of instances
        // localhost:1880/docker/scaler  {"image": "lesterthomas/appserver:1.1", "instances": "3"}
        
        
        //alert('instances=' + $scope.instances);// do whatever you need with the just-changed $scope.value
    });

    $scope.$watch("percentageUpgraded", function(){
        queryDockerService.percentageUpgraded=$scope.percentageUpgraded;
        $timeout.cancel($scope.autoScalerTimer);
        
        $scope.autoScalerTimer=$timeout(setInstances,1000);
        //call the web service to increase the number of instances
        // localhost:1880/docker/scaler  {"image": "lesterthomas/appserver:1.1", "instances": "3"}
        
        
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

    $scope.$watch("ZTUAContainer", function(){
        //alert($scope.ZTUAContainer);
        queryDockerService.ZTUAContainer=$scope.ZTUAContainer;
        if ($scope.ZTUBContainer.localeCompare($scope.ZTUAContainer)==0) {
            $scope.percentageUpgraded=0;
        }
        //alert('scaleSwitchStatus=' + $scope.scaleSwitchStatus);// do whatever you need with the just-changed $scope.value
    });   

    $scope.$watch("ZTUBContainer", function(){
        queryDockerService.ZTUBContainer=$scope.ZTUBContainer;
        if ($scope.ZTUBContainer.localeCompare($scope.ZTUAContainer)==0) {
            $scope.percentageUpgraded=0;
        }
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
