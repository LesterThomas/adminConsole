'use strict';
/**
 * @ngdoc overview
 * @name sbAdminApp
 * @description
 * # sbAdminApp
 *
 * Main module of the application.
 */
angular
  .module('sbAdminApp', [
    'oc.lazyLoad',
    'ui.router',
    'ui.bootstrap',    
    'ui.slider',
    'angular-loading-bar',
  ])
  .config(['$stateProvider','$urlRouterProvider','$ocLazyLoadProvider',function ($stateProvider,$urlRouterProvider,$ocLazyLoadProvider) {
    


    $ocLazyLoadProvider.config({
      debug:false,
      events:true,
    });

    $urlRouterProvider.otherwise('/dashboard/home');

    $stateProvider
      .state('dashboard', {
        url:'/dashboard',
        templateUrl: 'views/main.html',
        resolve: {
            loadMyDirectives:function($ocLazyLoad){
                return $ocLazyLoad.load(
                {
                    name:'sbAdminApp',
                    files:[
                    'scripts/directives/header/header.js',
                    'scripts/directives/header/header-notification/header-notification.js',
                    'scripts/directives/sidebar/sidebar.js',
                    'scripts/directives/sidebar/sidebar-search/sidebar-search.js'
                    ]
                }),
                $ocLazyLoad.load(
                {
                   name:'toggle-switch',
                   files:["bower_components/angular-toggle-switch/angular-toggle-switch.min.js",
                          "bower_components/angular-toggle-switch/angular-toggle-switch.css"
                      ]
                }),
                $ocLazyLoad.load(
                {
                  name:'ngAnimate',
                  files:['bower_components/angular-animate/angular-animate.js']
                })
                $ocLazyLoad.load(
                {
                  name:'ngCookies',
                  files:['bower_components/angular-cookies/angular-cookies.js']
                })
                $ocLazyLoad.load(
                {
                  name:'ngResource',
                  files:['bower_components/angular-resource/angular-resource.js']
                })
                $ocLazyLoad.load(
                {
                  name:'ngSanitize',
                  files:['bower_components/angular-sanitize/angular-sanitize.js']
                })
                $ocLazyLoad.load(
                {
                  name:'ngTouch',
                  files:['bower_components/angular-touch/angular-touch.js']
                })
            }
        }
    })
      .state('dashboard.home',{
        url:'/home',
        controller: 'DashboardCtrl',
        templateUrl:'views/dashboard.html',
        resolve: {
          loadMyFiles:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'sbAdminApp',
              files:[
              'scripts/controllers/dashboardController.js',
              'scripts/directives/timeline/timeline.js',
              'scripts/directives/notifications/notifications.js',
              'scripts/directives/chat/chat.js',
              'scripts/directives/dashboard/stats/stats.js',
	            'scripts/services/containersService.js'
              ]
            })
          }
        }
      })
      .state('dashboard.performance',{
        templateUrl:'views/performance.html',
        url:'/performance',
        controller:'PerformanceCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'chart.js',
              files:[
                'bower_components/angular-chart.js/dist/angular-chart.min.js',
                'bower_components/angular-chart.js/dist/angular-chart.css',
	              'scripts/services/containersService.js',
                'scripts/services/logsService.js'
              ]
            }),
            $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/performanceContoller.js']
            })
          }
        }
    })
      .state('dashboard.containers',{ 
        templateUrl:'views/containers.html',
        url:'/containers',
	controller:'ContainersCtrl',
	resolve: {
          loadMyFiles:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'sbAdminApp',
              files:['scripts/controllers/containersController.js','scripts/services/containersService.js']
            })
          }
	}
      })
      .state('dashboard.console',{ 
        templateUrl:'views/console.html',
        url:'/console',
  controller:'ConsoleCtrl',
  resolve: {
          loadMyFiles:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'sbAdminApp',
              files:['scripts/controllers/consoleController.js','scripts/services/containersService.js']
            }),
                $ocLazyLoad.load(
                {
                   name:'theaquaNg',
                   files:['bower_components/ng-switcher/dist/ng-switcher.js',
                          'bower_components/ng-switcher/dist/ng-switcher.css']
                })
          }
  }
      })
.state('dashboard.test',{ 
        templateUrl:'views/test.html',
        url:'/test',
  controller:'TestCtrl',
  resolve: {
          loadMyFiles:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'sbAdminApp',
              files:['scripts/controllers/testController.js','scripts/services/testService.js']
            }),
                $ocLazyLoad.load(
                {
                   name:'theaquaNg',
                   files:['bower_components/ng-switcher/dist/ng-switcher.js',
                          'bower_components/ng-switcher/dist/ng-switcher.css']
                })
          }
  }
      })


      .state('dashboard.notifications',{
        templateUrl:'views/ui-elements/notifications.html',
        url:'/notifications'
    })
  }]);

    
