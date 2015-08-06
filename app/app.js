'use strict';

//console.log("appjs before module declared");

var myApp = angular.module('GA_Dashboard', [
  'ui.router',
  'firebase'
]);

myApp.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

});

// myApp.controller("ApplicationController", [
//   "$log",
//   "$rootScope",
//   "$scope",
//   function($log, $rootScope, $scope) {
//     $scope.thingOnAppCtrl = {
//       foo: "asdfasdfasdf",
//     };
//     $log.info("From ApplicationController-Appjs:", $scope.thingOnAppCtrl.foo);
//   }
// ]);


myApp.service('sharedProperties', function () {
  var property = { Property1: 'First' };

  return property;
  $log.info("From sharedProperties service:", property);
});

myApp.run(["$rootScope", "$state", function ($rootScope, $state) {

  // For each user, create a profile object when Registered
  // Separate when user registers -UID is created
  // vs When user logs in - authData is created
  // When User is authorized, check if they have a Profile
  // If not, save their authdata as a User


  //Uses the onAuth() method to listen for changes in user authentication state
  function authDataCallback(authData) {
    if (authData) {
      // Get a database reference to our users
      var ref = new Firebase("https://dazzling-torch-1941.firebaseio.com/users");
      // Attach an asynchronous callback to read the data at our users reference
      ref.once("value", function(snapshot) {
        var profileCheck = snapshot.val();

        //if user does NOT have a profile; SAVE profile data
        if (profileCheck.profileExist === false) {
          // save the user's profile into the database so we can list users,
          // use them in Security and Firebase Rules, and show profiles

          ref.child(authData.uid).set({
            profileExist: true,
            provider: authData.provider,
            email: authData.password.email,
            name: getName(authData)
          });
          // find a suitable name based on the meta info given by each provider
          function getName(authData) {
            switch(authData.provider) {
              case 'password':
              return authData.password.email.replace(/@.*/, '');
              case 'twitter':
              return authData.twitter.displayName;
              case 'facebook':
              return authData.facebook.displayName;
            }
          } //end getName
        } //end Profile SAVE
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });

      //if authData is not null; then we have a User logged in via Firebase authentication
      //Here we assign the logged in user to the rootscope.currentUser
      $rootScope.currentUser = authData;
      //Console log to confirm a user is logged in
      console.log("***User " + authData.uid + " is logged in with " + authData.provider);
      //Could be more granular on what properties we want current user to have
      // $rootScope.currentUser = {
      //   id: authData

    //if authData is null (user is logged out); be explicit with rootscope.currentUser
    } else {
      $rootScope.currentUser = null;
      //Console log to confirm user is logged out
      console.log("***User is logged out");
    } //end If(authdata)
  } //end authDataCallback

  // Register a callback to fire the abov function every time auth state changes
  var ref = new Firebase("https://dazzling-torch-1941.firebaseio.com");
  ref.onAuth(authDataCallback);

  //subscribes to $stateChangeStart to inspect for requireLogin property
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
    // console.log("$on.$stateChangeStart ran");
    //checks for data property "requirelogin" (true/false) in the stateprovider
    var requireLogin = toState.data.requireLogin;
    //true if $rootScope.currentUser is defined and is not null
    var currentUserExists = angular.isDefined($rootScope.currentUser) && $rootScope.currentUser !== null;
    //true if requireLogin is required and user is logged out (currentUser is null)
    var shouldRedirectToLogin = requireLogin && !currentUserExists;
    //if true, direct to login page
    if (shouldRedirectToLogin) {
      event.preventDefault();
      // redirect back to login
      $state.go("login");
    }
  }); //end $stateChangeStart

}]); //end myApp.run
