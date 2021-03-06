'use strict';

var AppSettings = {
  appTitle: 'Example Application',
  apiUrl: 'http://localhost:3000'
};

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
  'myApp.dashboard',
  'myApp.auth'
]);

app.config(function($locationProvider, $stateProvider, $urlRouterProvider) {
  $locationProvider.hashPrefix('!');

  $urlRouterProvider.otherwise('/dashboard');
});

app.constant('AppSettings', AppSettings);

app.factory('requestHeaders', function() {
    return function() {
        return {
            'X-USER-EMAIL': localStorage.email,
            'X-USER-TOKEN': localStorage.token
        };
    }
});

app.run(function($rootScope, AppSettings) {
	$rootScope.pageTitle = AppSettings.appTitle;

  if (localStorage.token) {
    console.log("The user is logged in.");
  } else {
    $location.path('/login');
  }
});
