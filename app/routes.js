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
        controller: 'LoginCtrl',
        data: {
          requireLogin: false
        }
      })
      .state('app', {
        abstract: true,
        // ...
        data: {
          requireLogin: true // this property will apply to all children of 'app'
        }
      })
      // example of child state
      // .state('app.dashboard', {
      //   // child state of `app`
      //   // requireLogin === true
      // })
      .state('app.connect', {
        url: '/connect',
        templateUrl: 'app/connect.html',
        controller: 'ConnectCtrl'
      })
      .state('app.dashboard', {
        url: '/dashboard',
        templateUrl: 'app/dashboard.html',
        controller: 'ConnectCtrl' //update controller
      })
      .state('app.profile', {
        url: '/profile',
        templateUrl: 'app/profile.html',
        controller: 'ConnectCtrl' //update controller
      })
      //testing states for HelloAnalytics GA demo
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
