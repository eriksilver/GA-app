'use strict';
//console.log("routes.js declared");
angular.module('GA_Dashboard')

  .config(function ($stateProvider,$urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode({
      enabled: true,

    });
    // For any unmatched url, send to /
    // $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('welcome', {
        url: '/',
        templateUrl: 'app/welcome.html',
        data: {
          requireLogin: false
        }
      })
      .state('login', {
        url: '/login',
        templateUrl: 'app/login.html',
        controller: 'LoginCtrl',
        data: {
          requireLogin: false
        }
      })
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'app/dashboard.html',
        controller: 'DashboardCtrl',
        data: {
          requireLogin: true
        }
      })
      .state('profile', {
        url: '/profile',
        templateUrl: 'app/profile.html',
        controller: 'ProfileCtrl',
        data: {
          requireLogin: true
        }
      })
});
