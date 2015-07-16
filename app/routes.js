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
      .state('welcome', {
        url: '/welcome',
        templateUrl: 'app/welcome.html',
        controller: 'ConnectCtrl', //update controller
        data: {
          requireLogin: false
        }
      })
      .state('login', {
        url: '/',
        templateUrl: 'app/login.html',
        controller: 'LoginCtrl'
      })

      .state('connect', {
        url: '/connect',
        templateUrl: 'app/connect.html',
        controller: 'ConnectCtrl'
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
