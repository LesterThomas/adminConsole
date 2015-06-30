'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:ConsoleCtrl
 * @description
 * # ConsoleCtrls
 * Controller of the Console view of the Admin App. It links to the containersService and manages starting and stopping container instances, the Chaos Monkey process
 * and thezero-downtime upgrade process.
 */
angular.module('sbAdminApp')
  .controller('ConsoleCtrl', ['$scope', '$timeout','$interval','$http', 'containersService','logsService',    function ($scope, $timeout,$interval,$http,containersService,logsService) {
  	
    $scope.console = containersService.console;
    $scope.logger = logsService.logger;

    containersService.console.queryDockerContainers($scope);

    //stop a running container instance.
    $scope.stopContainer=function(inInstanceToStop){
        containersService.console.stopContainer(inInstanceToStop);
        $scope.logger.addEvent({image:'fa-bolt', text:'Stopping container ' + inInstanceToStop, time: (new Date).toLocaleTimeString()});
    }

    

    //this function is called at intervals when the Chaos Monkey switch is turned on. It randomly kills one of the running instances
    $scope.chaosMonkeyAction=function() {
        //alert('Chaos Monkey');
        // stopContainer(containerId)
        if ($scope.console.containers.length>0) {
            var index=Math.floor((Math.random() * $scope.console.containers.length));
            var id=$scope.console.containers[index].Id;
            containersService.console.stopContainer(id);
            $scope.logger.addEvent({image:'fa-bolt', text:'Chaos Monkey killing container ' + id, time: (new Date).toLocaleTimeString()});
        }
    }



    function setInstances() {
        var numberOfInstanceA=Math.round($scope.console.instances*(100-$scope.console.percentageUpgraded)/100);
        var numberOfInstanceB=Math.round($scope.console.instances*($scope.console.percentageUpgraded)/100);
        //alert('setInstances '+ $scope.console.ZTUAContainer +' to ' + numberOfInstanceA + ', ' + $scope.console.ZTUBContainer +' to ' + numberOfInstanceB);

        containersService.console.scaleDockerInstances({image: $scope.console.ZTUAContainer, instances: numberOfInstanceA});

        if ($scope.console.ZTUBContainer.localeCompare($scope.console.ZTUAContainer)!=0) { //only do this if the images are different
            containersService.console.scaleDockerInstances({image: $scope.console.ZTUBContainer, instances: numberOfInstanceB});
            }
    }


    function getRunningContainers() {

        containersService.console.queryDockerContainers($scope)
            
    }

    //start periodic checking
    //alert(containersService.initiated);
    if ($scope.console.containersTimer) { }
		else {
      	$scope.console.containersTimer=$interval(getRunningContainers, 1000);
    	}

    //function called at intervals to update the Graph data by calling the Stats and Logs functions
    $scope.queryDockerLogsStats=function() {
        $('#heartbeat').toggle();
        $scope.logger.getDockerStats($scope);
        $scope.logger.getDockerLogs($scope);
    }

    //start periodic checking. Once the interval timer is created, it is never destroyed (so the graph continue even if you are on a different page).
    if (containersService.console.initiated) {
        } else {
          $scope.logger.intervalTimer=$interval($scope.queryDockerLogsStats, 1000);
            containersService.console.initiated=true;
        //alert('starting interval');     
        }


    $scope.$on('$destroy', function() {
      // Make sure that the interval is destroyed too
      /*  if ($scope.console.containersTimer) {    
            $interval.cancel($scope.console.containersTimer);
            $scope.console.containersTimer=null;
            }     
      // Make sure that the interval is destroyed too
        if ($scope.console.autoScalerTimer) {    
            $interval.cancel($scope.console.autoScalerTimer);
            $scope.console.autoScalerTimer=null;
            }  
       // Make sure that the interval is destroyed too
        if ($scope.console.chaosMonkeyTimer) {    
            $interval.cancel($scope.console.chaosMonkeyTimer);
            $scope.console.chaosMonkeyTimer=null;
            }     
        //if scale switch is on then start background auto-scaling
        if ($scope.console.autoRecovery){
            containersService.console.eventAutoRecovery(true);
            } */
	});	 	




	$scope.$watch("console.autoRecovery", function(){
		
    	//alert('recoverySwitchStatus=' + containersService.autoRecovery);// do whatever you need with the just-changed $scope.value
    	if ($scope.console.autoRecovery){
            if ($('#autoScale').is(":visible")==false)  { //only show if it was hidden
        		$('#autoScale').show(10);
                $('#instancesSlider').show(400);
                if ($scope.console.autoScalerTimer) { }
                    else {
                        //alert('start autoscaler');
                        $scope.console.autoScalerTimer=$interval(setInstances, 3000);
                        containersService.console.eventAutoRecovery(false);
                        $scope.logger.addEvent({image:'fa-upload', text:'Auto-recovery started', time: (new Date).toLocaleTimeString()});
                    }
                }
            } else {
                if ($('#autoScale').is(":visible")==true)  { //only hide if it was visible
                    $('#autoScale').hide(10);
        			$('#instancesSlider').hide(400);
                    if ($scope.console.autoScalerTimer) {
                        $interval.cancel($scope.console.autoScalerTimer);
                        $scope.console.autoScalerTimer=null;
                        $scope.logger.addEvent({image:'fa-download', text:'Auto-recovery stopped', time: (new Date).toLocaleTimeString()});
                        $scope.console.autoScale=false; //also, switch auto-scale off
                }
            }
		}
	});


    $scope.$watch("console.autoScale", function(){
        
        //alert('recoverySwitchStatus=' + $scope.console.autoRecovery);// do whatever you need with the just-changed $scope.value
        if ($scope.console.autoScale){

            $scope.logger.addEvent({image:'fa-upload', text:'Auto-scale started', time: (new Date).toLocaleTimeString()});

        } else {
            $scope.logger.addEvent({image:'fa-download', text:'Auto-scale stopped', time: (new Date).toLocaleTimeString()});
        }
    });
 
    $scope.$watch("console.chaosMonkey", function(){
        if ($scope.console.chaosMonkey) {
            //start interval timer for Chaos Monkey
            if ($scope.console.chaosMonkeyTimer==null) {
                $scope.console.chaosMonkeyTimer=$interval($scope.chaosMonkeyAction, 7000);
                $scope.logger.addEvent({image:'fa-upload', text:'Chaos Monkey started', time: (new Date).toLocaleTimeString()});
            }
        } else {
            //stop interval timer for Chaos Monkey
            if ($scope.console.chaosMonkeyTimer) {
                $scope.logger.addEvent({image:'fa-download', text:'Chaos Monkey stopped', time: (new Date).toLocaleTimeString()});
                $interval.cancel($scope.console.chaosMonkeyTimer);
                $scope.console.chaosMonkeyTimer=null;
            }
        }

    });     

    $scope.$watch("console.ZTUAContainer", function(){
        //alert($scope.console.ZTUAContainer);
        if ($scope.console.ZTUBContainer.localeCompare($scope.console.ZTUAContainer)==0) {
            $scope.console.percentageUpgraded=0;
            $scope.logger.addEvent({image:'fa-tasks', text:'Upgrade console: image #1 and #2 are identical - resetting upgrade', time: (new Date).toLocaleTimeString()});

        }
        //alert('recoverySwitchStatus=' + $scope.console.autoRecovery);// do whatever you need with the just-changed $scope.value
    });   

    $scope.$watch("console.ZTUBContainer", function(){
        if ($scope.console.ZTUBContainer.localeCompare($scope.console.ZTUAContainer)==0) {
            $scope.console.percentageUpgraded=0;
             $scope.logger.addEvent({image:'fa-tasks', text:'Upgrade console: image #1 and #2 are identical - resetting upgrade', time: (new Date).toLocaleTimeString()});
       }
        //alert('recoverySwitchStatus=' + $scope.console.autoRecovery);// do whatever you need with the just-changed $scope.value
    });     

    $scope.$watch("console.upgrade", function(){
        
        //alert('recoverySwitchStatus=' + $scope.console.autoRecovery);// do whatever you need with the just-changed $scope.value
        if ($scope.console.upgrade){
            $('#appImage2').show(400);
            $('#percentageSlider').show(400);
            $scope.console.autoRecovery=true; //make sure autoRecovery is on
            $scope.logger.addEvent({image:'fa-upload', text:'Zero-downtime upgrade console started', time: (new Date).toLocaleTimeString()});

        } else {
            $('#appImage2').hide(400);
            $('#percentageSlider').hide(400);
            $scope.logger.addEvent({image:'fa-download', text:'Zero-downtime upgrade console stopped', time: (new Date).toLocaleTimeString()});
        }
    });




	
 



}]);
