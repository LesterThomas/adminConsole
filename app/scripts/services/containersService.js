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
adminApp.service('containersService',     function($http) {
  
    this.containers=[];
    this.instances=3;
    this.autoRecovery=false;
    this.chaosMonkey=false;
    this.upgrade=false;
    this.ZTUA=100;
    this.ZTUAContainer='lesterthomas/appserver:1.0';    
    this.ZTUB=0;
    this.ZTUBContainer='lesterthomas/appserver:1.1';
    this.initiated=false;
    this.percentageUpgraded=0; 
});

