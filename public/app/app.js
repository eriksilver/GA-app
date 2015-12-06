// 'use strict';

//console.log("appjs before module declared");

var myApp = angular.module('GA_Dashboard', [
    'ui.router',
    'firebase',
    'ui.bootstrap',
]);

myApp.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    //     $logProvider.debugEnabled(true);
});

myApp.controller("AppCtrl", ["$scope", function($scope){
$scope.date = new Date();    
}])

myApp.factory("AlertService", ["$log",
function($log) {
    var alerts = [];

    function add_alert(alert) {
        alerts.push(alert);
    }

    function remove_alert(index) {
        alerts.splice(index, 1);
    }

    return {
        alerts: alerts,
        add: add_alert,
        remove: remove_alert,
    };
}
])

myApp.service('currentUser', ['$log', '$firebaseAuth', '$firebaseArray', '$q','$rootScope',
function ($log, $firebaseAuth, $firebaseArray, $q, $rootScope) {
    // $log.info("begin currentUser service");
    // For each user, create a profile object when Registered
    // When user registers, Firebase UID is created
    // When user logs in, Firebsae authData is created
    // When User is authorized, check if they have a Profile
    // If not, save their authdata as a User

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

    //variable self setup to pull out userID from authCheck service
    //so other functions in the service can use the userID
    var self = this;

    this.authCheck = function () {
        var userID = " ";

        function authDataCallback(authData) {

            if (authData) {
                //if authData is not null; then we have a User logged in via Firebase authentication
                //Here we capture the user UID from the authdata
                userID = authData.uid;

                //Console log to confirm a user is logged in
                $log.info("***User " + authData.uid + " is logged in with " + authData.provider);

            } else {
                //if authData is null (user is logged out); be explicit with currentUser service
                userID = null;
                //Console log to confirm user is logged out
                $log.info("***User is logged out");

            }//end if(authdata)

            //gets the userID and self.userID can be used in other function in the service
            self.userID = userID;

            return userID;
        } //end authDataCallback


        //Uses the onAuth() method to listen for changes in user authentication state
        var ref = new Firebase("https://dazzling-torch-1941.firebaseio.com");
        ref.onAuth(authDataCallback);

        return userID;
    }; //end authCheck

    this.accessUserData = function () {
        var deferred = $q.defer();
        var ref = new Firebase("https://dazzling-torch-1941.firebaseio.com/users");

        ref.once("value", function(snapshot) {
            var userData = snapshot.child(self.userID).val();
            deferred.resolve(userData);
        });

        // $log.info("deferred.promise:", deferred.promise);
        return deferred.promise;
    }; //end accessUserData

    this.saveUserData = function (userEmail,userName) {
        var ref = new Firebase("https://dazzling-torch-1941.firebaseio.com/users");

        //callback to log success/error of saving data to Firebase
        var onComplete = function(error) {
            if (error) {
                $log.debug('saveUserData Sync to Firebase failed');
                $rootScope.$broadcast('saveProfileAlert', {message: "Save failed, please try again.",result: "danger"});
            } else {
                //confirms data saved to firebase
                $log.debug('saveUserData Sync to Firebase success');
                $rootScope.$broadcast('saveProfileAlert', {message: "Profile Updated", result: "success"});
            }
        };

        //firebase method to update user data
        ref.child(self.userID).update({
            email: userEmail,
            name: userName
            //onComplete is a callback that fires when data write to Firebase is a success
        },onComplete);

    }; //end saveUserData


    // $log.info("end currentUser service:");
}]); //end currentUser service


myApp.run(["$rootScope", "$state", "$log", "currentUser", function ($rootScope, $state, $log, currentUser) {

    //subscribes to $stateChangeStart to inspect for requireLogin property
    //default for UI router to fire this at the $rootScope level
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
        //checks for data property "requirelogin" (true/false) in the stateprovider
        var requireLogin = toState.data.requireLogin;
        //true if currentUser.uid is defined and is not null
        var currentUserExists = angular.isDefined(currentUser.authCheck()) && currentUser.uid !== null;
        $log.info("currentUserExists in myApp.run:",currentUserExists);
        //true if requireLogin is required and user is logged out (currentUser is null)
        var shouldRedirectToLogin = requireLogin && !currentUserExists;
        //if true, direct to login page
        if (shouldRedirectToLogin) {
            event.preventDefault();
            // redirect back to login
            $state.go("login");
        }
    }); //end $stateChangeStart

    //get current state on rootScope; so header element can be hidden on welcome/landing page
    $rootScope.$state = $state;

}]); //end myApp.run
