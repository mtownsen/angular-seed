'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'myApp.dashboard'
]).
config(['$locationProvider', '$stateProvider', '$urlRouterProvider', function($locationProvider, $stateProvider, $urlRouterProvider) {
  $locationProvider.hashPrefix('!');

  $urlRouterProvider.otherwise('/dashboard');
}]);
