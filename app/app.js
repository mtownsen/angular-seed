'use strict';

const AppSettings = {
  appTitle: 'Example Application',
  apiUrl: 'http://localhost:3000'
};

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
  'myApp.dashboard',
  'myApp.auth'
]);

app.config(function($location, $locationProvider, $stateProvider, $urlRouterProvider) {
  $locationProvider.hashPrefix('!');

	if (localStorage.token) {
	    console.log("The user is logged in.");
	} else {
	    $location.path('/login');
	}

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

app.run(function($rootScope, AppSettings) {debugger
	$rootScope.pageTitle = AppSettings.appTitle;
});
