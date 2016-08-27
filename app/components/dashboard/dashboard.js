'use strict';

angular.module('myApp.dashboard', [ 'ui.router'])

.config(['$stateProvider', function($stateProvider) {
	$stateProvider
	 .state('dashboard', {
      url: "/dashboard",
      templateUrl: "/components/dashboard/dashboard.html",
      controller: 'DashboardCtrl'
    })
}])

.controller('DashboardCtrl', [function() {

}]);