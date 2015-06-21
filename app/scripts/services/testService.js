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
adminApp.service('testService',     function($http) {
  
    this.hits=1;
    this.initiated=false;
    this.intervalTimer=null;
    this.testSwitchStatus=false;
    
 
});

