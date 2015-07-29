'use strict';
//console.log("routes.js declared");
angular.module('GA_Dashboard')

  .config(function ($stateProvider,$urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode({
      enabled: true,
      // requireBase: false
    });
    // For any unmatched url, send to /
    // $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('welcome', {
        url: '/',
        templateUrl: 'app/welcome.html',
        controller: 'ApplicationController', 
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
      //YES login required
      .state('connect', {
        url: '/connect',
        templateUrl: 'app/connect.html',
        controller: 'ConnectCtrl',
        data: {
          requireLogin: true
        }
      })
      //YES login required
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'app/dashboard.html',
        // controller: 'ConnectCtrl', //update controller
        data: {
          requireLogin: true
        }
      })
      //YES login required
      .state('profile', {
        url: '/profile',
        templateUrl: 'app/profile.html',
        controller: 'ProfileCtrl',
        data: {
          requireLogin: true
        }
      })
});
