'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrls
 * Controller of the sbAdminApp
 */


//**********************NOT USED**********

var adminApp = angular.module('sbAdminApp');

/**
 * The `queryDocker` service queries the Docker API.
 *
  */
adminApp.factory('queryDockerFactory',  function() {

  var eventsArray = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];



  return function() {
	//alert('queryDockerFactory called');
	return eventsArray;
      }

});

