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
    
    this.console={
    containers:[],
    containersTimer:null,
    autoScalerTimer:null,
    chaosMonkeyTimer:null,
    instances:3,
    autoRecovery:false,
    autoScale:false,
    chaosMonkey:false,
    upgrade:false,
    ZTUA:100,
    ZTUAContainer:'lesterthomas/appserver:1.0',   
    ZTUB:0,
    ZTUBContainer:'lesterthomas/appserver:1.1',
    initiated:false,
    percentageUpgraded:0,
    maxCPUSeconds:0,
    minCPUSeconds:0,

    //call the docker API to stop a running container
    stopContainer:function(containerId) {
        //alert(containerId);
        $('#'+containerId).toggleClass('danger');
        $http.post('http://172.17.42.1:4243/containers/' + containerId + '/stop', {}).
            success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                //alert(data);
             })
        },  

    //turn the event-based Auto-Recovery function on or off.
    eventAutoRecovery:function(inStart) {
        $http.post('http://localhost:1880/docker/maintainer', {image: console.ZTUAContainer, autorestart: inStart}).
            success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                //alert(data);
             })
        },

    //call the docker API to get the list of running containers. Store the containers that match the image name for the Application Servers.
    queryDockerContainers: function(inScope){
            $http.get("http://172.17.42.1:4243/containers/json")
                .success(function (response) {
                //inScope.console.containers.splice(0, inScope.console.containers.length);     
                //remove containers from array if they are missing in the response
                for (var index=0;index<inScope.console.containers.length;index++){
                    var found=false;
                    for (var respIndex=0;respIndex<response.length;respIndex++) {
                        if (response[respIndex].Id==inScope.console.containers[index].Id)
                        {
                            found=true;
                        }
                    }
                    if (found==false) {
                        inScope.console.containers.splice(index,1);
                    }
                } 

                //add containers to the array if they are new
                for (var respIndex=0;respIndex<response.length;respIndex++){
                    if ((response[respIndex].Image==inScope.console.ZTUAContainer) || (response[respIndex].Image==inScope.console.ZTUBContainer)) {
                        var found=false;
                        for (var j=0;j<inScope.console.containers.length;j++){
                            if (response[respIndex].Id==inScope.console.containers[j].Id) {
                                found=true;
                                //update the status of the container
                                inScope.console.containers[j].Status=response[respIndex].Status;
                            }
                            
                        }
                        if (found==false) {
                            response[respIndex].line={ //create placeholder for Line Graph
                                                id: response[respIndex].Id.substring(0,12),
                                                series: 'cpu',
                                                image: response[respIndex].Image,
                                                labels:['','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','',''],
                                                data:[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],
                                                options: {animation:false, scaleOverride:true, scaleStepWidth: 20, scaleStartValue: 0, scaleSteps:5},
                                                onClick: function (points, evt) {
                                                  console.log(points, evt);
                                                }
                                        };

                            inScope.console.containers.push(response[respIndex]);
                        }

                    }       
                }
                if (inScope.console.autoRecovery==false) { //if auto-scale switch is off then set instances to currently running.
                     inScope.console.instances=inScope.console.containers.length;
                }
            });







        },

    scaleDockerInstances:function(inObject){
        $http.post('http://localhost:1880/docker/scaler', inObject).
            success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                //alert(data);
             })
        }            

    };
    


});

