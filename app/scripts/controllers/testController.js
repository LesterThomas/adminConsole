'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:ConsoleCtrl
 * @description
 * # MainCtrls
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('TestCtrl', ['$scope', '$timeout','$interval','$http', 'testService',    function ($scope, $timeout,$interval,$http,testService) {
  	
    $scope.hits=testService.hits;
    $scope.testSwitchStatus=testService.testSwitchStatus;


    $scope.$watch("hits", function(){
      //alert('instances=' + $scope.instances);// do whatever you need with the just-changed $scope.value
      testService.hits=$scope.hits;
      if (testService.testSwitchStatus) {  //stop & start the intervalTimer

          $interval.cancel(testService.intervalTimer);
          testService.intervalTimer=$interval(testHarness, 1000/$scope.hits);
               
        }
     });

    $scope.$watch("testSwitchStatus", function(){
      //alert('instances=' + $scope.instances);// do whatever you need with the just-changed $scope.value
          //start periodic checking
          //alert(containersService.initiated);
          testService.testSwitchStatus=$scope.testSwitchStatus;
          if (testService.testSwitchStatus) {
            if (testService.initiated) {
                } else {
                testService.initiated=true;
                testService.intervalTimer=$interval(testHarness, 1000/$scope.hits);
                //alert('starting interval');     
                }
              } else {
                testService.initiated=false;
                $interval.cancel(testService.intervalTimer);
              }
     });
 
    function testHarness() {
      	//alert('testHarness called');
      	
    	
    	//call log component to get latest log data
        $http.get("http://localhost")
            .success(function (response) {
                
        });


    }
  

/*
	$scope.$on('$destroy', function() {
	  // Make sure that the interval is destroyed too
  	  if (angular.isDefined($scope.intervalTimer)) {
            $interval.cancel($scope.intervalTimer);
	    $scope.intervalTimer=null;
	    //alert('stopping interval');
	    }
	});	
    */



}]);
