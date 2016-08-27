'use strict';

const AppSettings = {
  appTitle: 'Example Application',
  apiUrl: '/api/v1'
};

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
  'myApp.dashboard'
]);

app.config(function($locationProvider, $stateProvider, $urlRouterProvider) {
  $locationProvider.hashPrefix('!');

  $urlRouterProvider.otherwise('/dashboard');
});

app.constant('AppSettings', AppSettings);


app.run(function($rootScope, AppSettings) {debugger
	$rootScope.pageTitle = AppSettings.appTitle;
});
