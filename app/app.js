'use strict';

console.log("appjs before module declared");

var myApp = angular.module('GA_Dashboard', [
  'ui.router',
  'firebase'
]);

myApp.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {


});
