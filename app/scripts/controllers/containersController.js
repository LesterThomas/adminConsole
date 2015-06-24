'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:TableCtrl
 * @description
 * # MainCtrls
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('ContainersCtrl', ['$scope', '$timeout','$interval','$http',  function ($scope, $timeout,$interval,$http) {

    $http.get("http://127.0.0.1:4243/containers/json")
    		.success(function (response) {
			//alert('response received');
			$scope.containers = response;
			});

}]);
