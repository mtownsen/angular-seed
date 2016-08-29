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

app.config(["$locationProvider", "$stateProvider", "$urlRouterProvider", function($locationProvider, $stateProvider, $urlRouterProvider) {
  $locationProvider.hashPrefix('!');

  $urlRouterProvider.otherwise('/dashboard');
}]);

app.constant('AppSettings', AppSettings);

app.factory('requestHeaders', function() {
    return function() {
        return {
            'X-USER-EMAIL': localStorage.email,
            'X-USER-TOKEN': localStorage.token
        };
    }
});

app.run(["$rootScope", "AppSettings", function($rootScope, AppSettings) {
	$rootScope.pageTitle = AppSettings.appTitle;

  if (localStorage.token) {
    console.log("The user is logged in.");
  } else {
    $location.path('/login');
  }
}]);

var authApp = angular.module('myApp.auth', []);

authApp.controller('AuthenticationCtrl', ["$scope", "$http", "$location", "AppSettings", "StoreLoginData", function($scope, $http, $location, AppSettings, StoreLoginData) {

    $scope.go = function(path) {
        $location.path(path);
    };

    var rails_server_path = AppSettings.apiUrl;
    
    $scope.registerUser = function(first_name, last_name, user_email, user_password, user_password_confirmation) {
        var credentials = {
            user: {
                first_name: first_name,
                last_name: last_name,
                email: user_email,
                password: user_password,
                password_confirmation: user_password_confirmation
            }
        };
        $http({
            method: 'POST',
            url: rails_server_path + '/users.json',
            data: credentials
        }).then(function successCallback(response) {
            $scope.loginUser(user_email, user_password);
        }, function errorCallback(error) {
            $scope.registrationStatus = -1;
        });
    }

    $scope.loginUser = function(user_email, user_password) {
        var credentials = {
            user: {
                email: user_email,
                password: user_password
            }
        };
        $http({
            method: 'POST',
            url: rails_server_path + '/users/sign_in.json',
            data: credentials
        }).then(function successCallback(response) {
            StoreLoginData(user_email, response.data.authentication_token);
            $location.path('/dashboard');
        }, function errorCallback(error) {
            $scope.loginStatus = -1;
        });
    }

    $scope.forgotPassword = function(user_email) {
        $http({
            method: 'GET',
            url: rails_server_path + '/send_password.json?user_email=' + user_email
        }).then(function successCallback(response) {
            $scope.emailSent = 1;
        }, function errorCallback(error) {
            $scope.emailSent = -1;
        });
    }

    $scope.resetPassword = function(new_password, confirm_new_password) {
        var reset_token = $location.search().reset_password_token;
        $http({
            method: 'PUT',
            url: rails_server_path + '/users/password.json',
            data: {
                user: {
                    password: new_password,
                    confirm_password: confirm_new_password,
                    reset_password_token: reset_token
                }
            }
        }).then(function successCallback(response) {
            $location.search('reset_password_token', null);
            $location.path('/login');
        }, function errorCallback(error) {
            $scope.resetStatus = -1;
        });
    }
}]);

authApp.factory('Logout', ["$window", "$location", "$http", "AppSettings", function($window, $location, $http, AppSettings) {
    var rails_server_path = AppSettings.apiUrl;
    return function() {
        $http({
            headers: {
                'X-USER-EMAIL': localStorage.email,
                'X-USER-TOKEN': localStorage.token
            },
            method: 'DELETE',
            url: rails_server_path + '/users/sign_out.json'
        }).then(function successCallback(response) {
            delete localStorage.email;
            delete localStorage.token;
            $location.path('/login');
        });
    }
}]);

authApp.factory('StoreLoginData', function() {
    return function(user_email, auth_token) {
        localStorage.email = user_email;
        localStorage.token = auth_token;
    }
});

authApp.config(["$stateProvider", function($stateProvider) {
    $stateProvider
        .state('login', {
            url: "/login",
            templateUrl: "/components/authentication/login.html",
            controller: 'AuthenticationCtrl'
        })
        .state('signup', {
            url: "/sign_up",
            templateUrl: "/components/authentication/sign_up.html",
            controller: 'AuthenticationCtrl'
        })
        .state('forgotpassword', {
            url: "/forgot_password",
            templateUrl: "/components/authentication/forgot_password.html",
            controller: 'AuthenticationCtrl'
        })
        .state('resetpassword', {
            url: "/reset_password",
            templateUrl: "/components/authentication/reset_password.html",
            controller: 'AuthenticationCtrl'
        });
}]);


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