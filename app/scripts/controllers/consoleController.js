'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:ConsoleCtrl
 * @description
 * # MainCtrls
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('ConsoleCtrl', ['$scope', '$timeout','$interval','$http', 'containersService',    function ($scope, $timeout,$interval,$http,containersService) {
  	
    $scope.myData = {};
    $scope.containers=containersService.containers;
    $scope.percentageUpgraded=containersService.percentageUpgraded;
    $scope.containersTimer=null;
    $scope.chaosSwitchStatus=containersService.chaosMonkey;
    $scope.scaleSwitchStatus=containersService.autoRecovery;
    $scope.upgradeSwitchStatus=containersService.upgrade;
    $scope.instances=containersService.instances;
    $scope.autoScalerTimer=null;
    $scope.chaosMonkeyTimer=null;
    $scope.ZTUAContainer=containersService.ZTUAContainer;
    $scope.ZTUBContainer=containersService.ZTUBContainer;

    $scope.stopContainer=function(containerId) {
        //alert(containerId);
        $('#'+containerId).toggleClass('danger');
        
        
        $http.post('http://172.17.42.1:4243/containers/' + containerId + '/stop', {}).
            success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                //alert(data);
             })
    }    



    function eventAutoScaling(inStart) {
        $http.post('http://localhost:1880/docker/maintainer', {image: $scope.ZTUAContainer, autorestart: inStart}).
            success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                //alert(data);
             })
    }

    $scope.chaosMonkeyAction=function() {
        //alert('Chaos Monkey');
        // stopContainer(containerId)
        if ($scope.containers.length>0) {
            var index=Math.floor((Math.random() * $scope.containers.length));
            var id=$scope.containers[index].Id;
            var htmlId='#'+id;
            $scope.stopContainer(id);
        }
    }

    function queryDockerContainers() {
    	$http.get("http://172.17.42.1:4243/containers/json")
    		.success(function (response) {
			$scope.containers.splice(0, $scope.containers.length);
			
			for (var index=0;index<response.length;index++){
				if ((response[index].Image==containersService.ZTUAContainer) || (response[index].Image==containersService.ZTUBContainer)) {
			    		$scope.containers.push(response[index]);
				}		
			}
            if ($scope.scaleSwitchStatus==false) { //if auto-scale switch is off then set instances to currently running.
			     $scope.instances=$scope.containers.length;
            }
		});
    }

    function setInstances() {
        var numberOfInstanceA=Math.round($scope.instances*(100-$scope.percentageUpgraded)/100);
        var numberOfInstanceB=Math.round($scope.instances*($scope.percentageUpgraded)/100);
        //alert('setInstances '+ $scope.ZTUAContainer +' to ' + numberOfInstanceA + ', ' + $scope.ZTUBContainer +' to ' + numberOfInstanceB);
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
    //alert(containersService.initiated);
    if ($scope.containersTimer) { }
		else {
      	$scope.containersTimer=$interval(queryDockerContainers, 2000);
    	}



    $scope.$on('$destroy', function() {
      // Make sure that the interval is destroyed too
        if ($scope.containersTimer) {    
            $interval.cancel($scope.containersTimer);
            $scope.containersTimer=null;
            }    
      // Make sure that the interval is destroyed too
        if ($scope.autoScalerTimer) {    
            $interval.cancel($scope.autoScalerTimer);
            $scope.autoScalerTimer=null;
            }  
       // Make sure that the interval is destroyed too
        if ($scope.chaosMonkeyTimer) {    
            $interval.cancel($scope.chaosMonkeyTimer);
            $scope.chaosMonkeyTimer=null;
            }     
        //if scale switch is on then start background auto-scaling
        if ($scope.scaleSwitchStatus){
            eventAutoScaling(true);
            } 

            
	});	 	


    $scope.$watch("instances", function(){
        containersService.instances=$scope.instances;
        
        //call the web service to increase the number of instances
        // localhost:1880/docker/scaler  {"image": "lesterthomas/appserver:1.1", "instances": "3"}
        
        
        //alert('instances=' + $scope.instances);// do whatever you need with the just-changed $scope.value
    });

    $scope.$watch("percentageUpgraded", function(){
        containersService.percentageUpgraded=$scope.percentageUpgraded;
       
        //call the web service to increase the number of instances
        // localhost:1880/docker/scaler  {"image": "lesterthomas/appserver:1.1", "instances": "3"}
        
        
        //alert('instances=' + $scope.instances);// do whatever you need with the just-changed $scope.value
    });

	$scope.$watch("scaleSwitchStatus", function(){
		containersService.autoRecovery=$scope.scaleSwitchStatus;
    	//alert('scaleSwitchStatus=' + containersService.autoRecovery);// do whatever you need with the just-changed $scope.value
    	if ($scope.scaleSwitchStatus){
    		$('#instancesSlider').show(400);
            if ($scope.autoScalerTimer) { }
                else {
                    //alert('start autoscaler');
                    $scope.autoScalerTimer=$interval(setInstances, 3000);
                    eventAutoScaling(false);
                }
            } else {
			$('#instancesSlider').hide(400);
            if ($scope.autoScalerTimer) {
                $interval.cancel($scope.autoScalerTimer);
                $scope.autoScalerTimer=null;
                //alert('stopping interval');
        }

		}
	});
 
    $scope.$watch("chaosSwitchStatus", function(){
        containersService.chaosMonkey=$scope.chaosSwitchStatus;
        if ($scope.chaosSwitchStatus) {
            //start interval timer for Chaos Monkey
            $scope.chaosMonkeyTimer=$interval($scope.chaosMonkeyAction, 7000);
        } else {
            //stop interval timer for Chaos Monkey
            $interval.cancel($scope.chaosMonkeyTimer);
            $scope.chaosMonkeyTimer=null;
        }

    });     

    $scope.$watch("ZTUAContainer", function(){
        //alert($scope.ZTUAContainer);
        containersService.ZTUAContainer=$scope.ZTUAContainer;
        if ($scope.ZTUBContainer.localeCompare($scope.ZTUAContainer)==0) {
            $scope.percentageUpgraded=0;
        }
        //alert('scaleSwitchStatus=' + $scope.scaleSwitchStatus);// do whatever you need with the just-changed $scope.value
    });   

    $scope.$watch("ZTUBContainer", function(){
        containersService.ZTUBContainer=$scope.ZTUBContainer;
        if ($scope.ZTUBContainer.localeCompare($scope.ZTUAContainer)==0) {
            $scope.percentageUpgraded=0;
        }
        //alert('scaleSwitchStatus=' + $scope.scaleSwitchStatus);// do whatever you need with the just-changed $scope.value
    });     

	$scope.$watch("upgradeSwitchStatus", function(){
		containersService.upgrade=$scope.upgradeSwitchStatus;
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
