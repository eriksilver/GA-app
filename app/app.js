'use strict';

//console.log("appjs before module declared");

var myApp = angular.module('GA_Dashboard', [
  'ui.router',
  'firebase',
  'ngMessages'
]);

myApp.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

});

myApp.service('currentUser', ['$log', function ($log) {
    $log.info("begin currentUser service");
    var currentUser = {
      uid: null
    };

    return currentUser;
    $log.info("end currentUser service:");
}]);

myApp.run(["$rootScope", "$state", "$log", "currentUser", function ($rootScope, $state, $log, currentUser) {

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
        $log.info("The read failed: " + errorObject.code);
      });

      //if authData is not null; then we have a User logged in via Firebase authentication
      //Here we assign the logged in user to the currentUser service
      currentUser.uid = authData.uid;
      $log.info("service test - current user id:",currentUser.uid);
      //Console log to confirm a user is logged in
      $log.info("***User " + authData.uid + " is logged in with " + authData.provider);

    //if authData is null (user is logged out); be explicit with currentUser service
    } else {
      currentUser.uid = null;
      //Console log to confirm user is logged out
      $log.info("***User is logged out");
      $log.info("service test - current user id null:",currentUser.uid);

    } //end If(authdata)
  } //end authDataCallback

  // Register a callback to fire the abov function every time auth state changes
  var ref = new Firebase("https://dazzling-torch-1941.firebaseio.com");
  ref.onAuth(authDataCallback);

  //subscribes to $stateChangeStart to inspect for requireLogin property
  //default for UI router to fire this at the $rootScope level
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
    //checks for data property "requirelogin" (true/false) in the stateprovider
    var requireLogin = toState.data.requireLogin;
    //true if currentUser.uid is defined and is not null
    var currentUserExists = angular.isDefined(currentUser.uid) && currentUser.uid !== null;
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
