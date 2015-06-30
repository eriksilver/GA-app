'use strict';
console.log("routes.js declared");
angular.module('GA_Dashboard')

  .config(function ($stateProvider,$urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode({
      enabled: true,
      // requireBase: false
    });
    // For any unmatched url, send to /
    // $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('login', {
        url: '/',
        templateUrl: 'app/login.html',
        controller: 'LoginCtrl'
      })
      .state('home', {
        url: '/home',
        templateUrl: 'app/home.html',
        controller: 'HomeCtrl'
      })
      .state('test', {
        url: '/test',
        templateUrl: 'app/HelloAnalytics.html',
        controller: 'LoginCtrl'
      })
      .state('OauthHandler', {
        url: '/handler',
        templateUrl: 'OauthHandler.html',
        controller: 'LoginCtrl'
      })
});
