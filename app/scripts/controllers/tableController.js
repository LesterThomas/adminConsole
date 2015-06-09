'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:TableCtrl
 * @description
 * # MainCtrls
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('TableCtrl', ['$scope', '$timeout','$interval','$http',  function ($scope, $timeout,$interval,$http) {

    //alert('loaded TableController');	
    $scope.names = [{Id:1, Image:"LesterThomas",Status:"Up 5 Mins"}];
    $http.get("http://192.168.1.106:4243/containers/json")
    		.success(function (response) {
			//alert('response received');
			$scope.names = response;
			});



}]);
