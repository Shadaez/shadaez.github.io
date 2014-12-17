'use strict';


// Declare app level module which depends on filters, and services
angular.module('StreamerUI', [
  'ngRoute',
  'StreamerUI.filters',
  'StreamerUI.services',
  'StreamerUI.directives',
  'StreamerUI.controllers'
]);

StreamerUI.config(['$routeProvider', function($routeProvider){
  $routeProvider
    .when('/gamepad', {
      templateUrl: '/partials/gamepad.html',
      controller: 'gamepadCtrl'
    })
    .when('/',{
      templateUrl: '/partials/index.html'
    })
    .otherwise({
      redirectTo: '/'
    });
}]);
