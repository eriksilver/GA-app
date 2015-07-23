'use strict';

//console.log("appjs before module declared");

var myApp = angular.module('GA_Dashboard', [
  'ui.router',
  'firebase'
]);

myApp.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

});

myApp.run(["$rootScope", "$state", function ($rootScope, $state) {

  // For each user, create a profile object
  // Separate when user registers -UID is created
  // vs When user logs in - authData is created
  // When User is authorized, check if they have a Profile
  // If not, save their authdata as a User


  //Uses the onAuth() method to listen for changes in user authentication state
  function authDataCallback(authData) {
    if (authData) {
      //if authData is not null; then we have a User logged in via Firebase authentication
      //Here we assign the logged in user to the rootscope.currentUser
      $rootScope.currentUser = authData;
      //Console log to confirm a user is logged in
      console.log("***User " + authData.uid + " is logged in with " + authData.provider);
        //Could be more granular on what properties we want current user to have
          // $rootScope.currentUser = {
          //   id: authData.id,
          // };
    } else {
      //if authData is null (user is logged out); be explicit with rootscope.currentUser
      $rootScope.currentUser = null;
      //Console log to confirm user is logged out
      console.log("***User is logged out");
    }
  }
  // Register a callback to fire the abov function every time auth state changes
  var ref = new Firebase("https://dazzling-torch-1941.firebaseio.com");
  ref.onAuth(authDataCallback);


  //subscribes to $stateChangeStart to inspect for requireLogin property
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
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
  });

  // we would probably save a profile when we register new users on our site
  // we could also read the profile to see if it's null
  // here we will just simulate this with an isNewUser boolean
  // var isNewUser = true;
  // var ref = new Firebase("https://<YOUR-FIREBASE-APP>.firebaseio.com");
  // ref.onAuth(function(authData) {
  //   if (authData && isNewUser) {
  //     // save the user's profile into the database so we can list users,
  //     // use them in Security and Firebase Rules, and show profiles
  //     ref.child("users").child(authData.uid).set({
  //       provider: authData.provider,
  //       name: getName(authData)
  //     });
  //   }
  // });
  // // find a suitable name based on the meta info given by each provider
  // function getName(authData) {
  //   switch(authData.provider) {
  //     case 'password':
  //     return authData.password.email.replace(/@.*/, '');
  //     case 'twitter':
  //     return authData.twitter.displayName;
  //     case 'facebook':
  //     return authData.facebook.displayName;
  //   }
  // }

}]);
