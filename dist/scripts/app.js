"use strict";angular.module("sbAdminApp",["oc.lazyLoad","ui.router","ui.bootstrap","ui.slider","angular-loading-bar"]).config(["$stateProvider","$urlRouterProvider","$ocLazyLoadProvider",function($stateProvider,$urlRouterProvider,$ocLazyLoadProvider){$ocLazyLoadProvider.config({debug:!1,events:!0}),$urlRouterProvider.otherwise("/dashboard/home"),$stateProvider.state("dashboard",{url:"/dashboard",templateUrl:"views/dashboard/main.html",resolve:{loadMyDirectives:function($ocLazyLoad){return $ocLazyLoad.load({name:"sbAdminApp",files:["scripts/directives/header/header.js","scripts/directives/header/header-notification/header-notification.js","scripts/directives/sidebar/sidebar.js","scripts/directives/sidebar/sidebar-search/sidebar-search.js"]}),$ocLazyLoad.load({name:"toggle-switch",files:["bower_components/angular-toggle-switch/angular-toggle-switch.min.js","bower_components/angular-toggle-switch/angular-toggle-switch.css"]}),$ocLazyLoad.load({name:"ngAnimate",files:["bower_components/angular-animate/angular-animate.js"]})}}}).state("dashboard.home",{url:"/home",controller:"MainCtrl",templateUrl:"views/dashboard/home.html",resolve:{loadMyFiles:function($ocLazyLoad){return $ocLazyLoad.load({name:"sbAdminApp",files:["scripts/controllers/main.js","scripts/directives/timeline/timeline.js","scripts/directives/notifications/notifications.js","scripts/directives/chat/chat.js","scripts/directives/dashboard/stats/stats.js","scripts/services/queryDocker.js"]})}}}).state("dashboard.chart",{templateUrl:"views/chart.html",url:"/chart",controller:"ChartCtrl",resolve:{loadMyFile:function($ocLazyLoad){return $ocLazyLoad.load({name:"chart.js",files:["bower_components/angular-chart.js/dist/angular-chart.min.js","bower_components/angular-chart.js/dist/angular-chart.css","scripts/services/queryDocker.js"]}),$ocLazyLoad.load({name:"sbAdminApp",files:["scripts/controllers/chartContoller.js"]})}}}).state("dashboard.table",{templateUrl:"views/table.html",url:"/table",controller:"TableCtrl",resolve:{loadMyFiles:function($ocLazyLoad){return $ocLazyLoad.load({name:"sbAdminApp",files:["scripts/controllers/tableController.js","scripts/services/queryDocker.js"]})}}}).state("dashboard.console",{templateUrl:"views/console.html",url:"/console",controller:"ConsoleCtrl",resolve:{loadMyFiles:function($ocLazyLoad){return $ocLazyLoad.load({name:"sbAdminApp",files:["scripts/controllers/consoleController.js","scripts/services/queryDocker.js"]}),$ocLazyLoad.load({name:"theaquaNg",files:["bower_components/ng-switcher/dist/ng-switcher.js","bower_components/ng-switcher/dist/ng-switcher.css"]})}}}).state("dashboard.testharness",{templateUrl:"views/testharness.html",url:"/testharness",controller:"TestCtrl",resolve:{loadMyFiles:function($ocLazyLoad){return $ocLazyLoad.load({name:"sbAdminApp",files:["scripts/controllers/testController.js","scripts/services/testService.js"]}),$ocLazyLoad.load({name:"theaquaNg",files:["bower_components/ng-switcher/dist/ng-switcher.js","bower_components/ng-switcher/dist/ng-switcher.css"]})}}}).state("dashboard.notifications",{templateUrl:"views/ui-elements/notifications.html",url:"/notifications"})}]);