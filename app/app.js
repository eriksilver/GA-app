'use strict';

//console.log("appjs before module declared");

var myApp = angular.module('GA_Dashboard', [
    'ui.router',
    'firebase',
]);

myApp.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    //     $logProvider.debugEnabled(true);
});

myApp.service('currentUser', ['$log', '$firebaseAuth', '$firebaseArray',
function ($log, $firebaseAuth, $firebaseArray) {
    $log.info("begin currentUser service");


    this.createInitialProfile = function (userData) {
        //note userData consists solely of firebase UID
        //this function makes an empty user profile to be filled in when user logs in with authData method

        $log.info("begin createInitialProfile");
        // Get a database reference to our users
        var ref = new Firebase("https://dazzling-torch-1941.firebaseio.com/");
        ref.child("users").child(userData.uid).set({
            email: " ",
            name: " ",
            profileExist: false,
            provider: " "
        });

        $log.info("Successfully created user account with uid:", userData.uid);
    }; //end createInitialProfile


    this.checkUserProfile = function (authData) {
        $log.info("begin checkUserProfile");

        //save current user id, e.g. simplelogin:3
        var currentUser = authData.uid;

        // Get a database reference to our users
        var ref = new Firebase("https://dazzling-torch-1941.firebaseio.com/users");

        // Attach an asynchronous callback to read the data at our users reference
        ref.once("value", function(snapshot) {
            //get data snapshot of a specific (current) user
            var userSnapshot = snapshot.child(currentUser);
            //get the profileExist key data from that snapshot (true/false)
            var profileExist = userSnapshot.child("profileExist").val();
            $log.info("current profileExist:", profileExist);

            //if user does NOT have a profile; SAVE profile data
            if (profileExist === false) {
                // save the user's profile into Firebase database
                ref.child(authData.uid).set({
                    profileExist: true,
                    provider: authData.provider, //authentication method, e.g. password
                    email: authData.password.email,
                    name: getName(authData)
                });
                // find a suitable name based on the meta info given by each provider
                function getName(authData) {
                    switch(authData.provider) {
                        case 'password':
                        return authData.password.email.replace(/@.*/, '');
                        // use below if twitter or facebook authentication is used
                        //     // case 'twitter':
                        //     // return authData.twitter.displayName;
                        //     // case 'facebook':
                        //     // return authData.facebook.displayName;
                    } //end switch
                } //end getName
            } //end if profileExist
            //Firebase "ref.once" check, error object result
        }, function (errorObject) {
            $log.info("The read failed: " + errorObject.code);
        }); //end Firebase ref.once
    }; //end checkUserProfile

    this.userTest = function () {
        uid: null
        $log.info("inside var userTest :");
    };

    //Uses the onAuth() method to listen for changes in user authentication state
    this.authCheck = function () {

        function authDataCallback(authData) {
            $log.info("inside authDataCallback :");

            if (authData) {

                //use currentUser service to check if user has logged in before (has a profile)
                //currentUser.checkUserProfile();

                //if authData is not null; then we have a User logged in via Firebase authentication
                //Here we assign the logged in user to the currentUser service
                //currentUser.uid = authData.uid;

                //Console log to confirm a user is logged in
                $log.info("***User " + authData.uid + " is logged in with " + authData.provider);
                // $log.info("service test - current user id:",currentUser.uid);

            } else {
                //if authData is null (user is logged out); be explicit with currentUser service
                //currentUser.uid = null;
                //Console log to confirm user is logged out
                $log.info("***User is logged out");
                //$log.info("service test - current user id null:",currentUser.uid);

            }//end if(authdata)


        } //end authDataCallback
        // Register the callback to be fired every time auth state changes
        var ref = new Firebase("https://dazzling-torch-1941.firebaseio.com");
        ref.onAuth(authDataCallback);
    }; //end authCheck


    $log.info("end currentUser service:");
}]); //end currentUser service

myApp.run(["$rootScope", "$state", "$log", "currentUser", function ($rootScope, $state, $log, currentUser) {

    // For each user, create a profile object when Registered
    // Separate when user registers -UID is created
    // vs When user logs in - authData is created
    // When User is authorized, check if they have a Profile
    // If not, save their authdata as a User
    currentUser.userTest();

    currentUser.authCheck();

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
