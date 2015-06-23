'use strict';

console.log("routes.js declared");

angular.module('GA_Dashboard')

  .config(function ($stateProvider,$urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });

    // For any unmatched url, send to route1
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('landing', {
        url: '/',
        templateUrl: '/index.html',
        controller: 'LoginCtrl'
      })

      .state('home', {
        url: '/home',
        templateUrl: '/home.html',
        controller: 'LoginCtrl'
      })

      .state('login', {
        url: '/login',
        templateUrl: '/login.html',
        controller: 'LoginCtrl'
      })

});
