'use strict';

//console.log("appjs before module declared");

var myApp = angular.module('GA_Dashboard', [
  'ui.router',
  'firebase'
]);

myApp.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

});

myApp.run(["$rootScope", "$state", function ($rootScope, $state) {

  //Uses the onAuth() method to listen for changes in user authentication state
  function authDataCallback(authData) {
    if (authData) {
      console.log("***User " + authData.uid + " is logged in with " + authData.provider);
      $rootScope.currentUser = authData;
      // $rootScope.currentUser = {
      //   id: authData.id,
      // };
    } else {
      console.log("***User is logged out");
      $rootScope.currentUser = null;
    }
  }
  // Register the callback to be fired every time auth state changes
  var ref = new Firebase("https://dazzling-torch-1941.firebaseio.com");
  ref.onAuth(authDataCallback);



  //subscribes to $stateChangeStart to inspect for requireLogin property
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
    var requireLogin = toState.data.requireLogin;

    //assumes currentUser is on rootScope --how to tie into Firebase?
    //authdata !== 'undefined'
    //$rootScope.currentUser
    var currentUserExists = angular.isDefined($rootScope.currentUser) && $rootScope.currentUser !== null;
    var shouldRedirectToLogin = requireLogin && !currentUserExists;
    if (shouldRedirectToLogin) {
      event.preventDefault();
      // redirect back to login
      $state.go("login");
    }

  });
}]);
