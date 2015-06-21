'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrls
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('ChartCtrl', ['$scope', '$timeout','$interval','$http', 'queryDockerService',  function ($scope, $timeout,$interval,$http,queryDockerService) {

    

    $scope.line = {
	    labels: ['','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','',''],
	    series: ['Hits'],
	    data:  queryDockerService.hitsArray,
 	    options: {animation:false},
	    onClick: function (points, evt) {
	      console.log(points, evt);
	    }
    };
    $scope.logs=[];

    function queryDocker() {
      	//alert('queryDocker called');
      	$('#heartbeat').toggle();
    	
    	//call log component to get latest log data
        $http.get("http://localhost:4000/logs")
            .success(function (response) {
                $scope.logs.splice(0, $scope.logs.length);  //reset logs array to zero elements (without creating new array)
                
                for (var index=0;index<response.length;index++){
                    if ((response[index].image==queryDockerService.ZTUAContainer) || (response[index].image==queryDockerService.ZTUBContainer)) {
                            $scope.logs.push(response[index]);
                    }       
                }
                //alert($scope.logs.length);
                $scope.line.data[0].push($scope.logs.length);
        });

	
        if ($scope.line.data[0].length>40) {
	       $scope.line.data[0].shift();
	    }
    }
  
    //start periodic checking
    //alert(queryDockerService.initiated);
    if (queryDockerService.initiated) {
      	} else {
      	$scope.intervalTimer=$interval(queryDocker, 1000);
    	queryDockerService.initiated=true;
      	//alert('starting interval');     
      	}
    var time=Date.now();

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

/*
    $scope.bar = {
	    labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
		series: ['Series A'],

		data: [
		   [28, 48, 40, 19, 86, 27, 90]
		]
    	
    };

    $scope.donut = {
    	labels: ["Download Sales", "In-Store Sales", "Mail-Order Sales"],
    	data: [300, 500, 100]
    };

    $scope.radar = {
    	labels:["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"],

    	data:[
    	    [65, 59, 90, 81, 56, 55, 40],
    	    [28, 48, 40, 19, 96, 27, 100]
    	]
    };

    $scope.pie = {
    	labels : ["Download Sales", "In-Store Sales", "Mail-Order Sales"],
    	data : [300, 500, 100]
    };

    $scope.polar = {
    	labels : ["Download Sales", "In-Store Sales", "Mail-Order Sales", "Tele Sales", "Corporate Sales"],
    	data : [300, 500, 100, 40, 120]
    };

    $scope.dynamic = {
    	labels : ["Download Sales", "In-Store Sales", "Mail-Order Sales", "Tele Sales", "Corporate Sales"],
    	data : [300, 500, 100, 40, 120],
    	type : 'PolarArea',

    	toggle : function () 
    	{
    		this.type = this.type === 'PolarArea' ?
    	    'Pie' : 'PolarArea';
		}
    };
*/
}]);
