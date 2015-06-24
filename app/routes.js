'use strict';

console.log("routes.js declared");

angular.module('GA_Dashboard')

  .config(function ($stateProvider,$urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });

    // For any unmatched url, send to /
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('landing', {
        url: '/',
        templateUrl: '/login.html',
        controller: 'LoginCtrl'
      })

      .state('home', {
        url: '/home',
        templateUrl: '/home.html',
        controller: 'HomeCtrl'
      })

      .state('login', {
        url: '/login',
        templateUrl: '/login.html',
        controller: 'LoginCtrl'
      })

      .state('test', {
        url: '/test',
        templateUrl: '/HelloAnalytics.html',
        controller: 'LoginCtrl'
      })


});
