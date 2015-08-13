
//console.log('login JS before controller');

angular.module('GA_Dashboard')
// app.config(['$logProvider', function($logProvider){
//     $logProvider.debugEnabled(true);
// }]);

.controller("LoginCtrl", [
    "$scope", "$firebaseAuth", "$state","$log","currentUser",
    function($scope, $firebaseAuth, $state, $log, currentUser) {
        $log.log("LoginCtrl ran");

        //establish Firebase reference to be used by all functions in the controller
        var ref = new Firebase("https://dazzling-torch-1941.firebaseio.com/");
        $scope.authObj = $firebaseAuth(ref);


        //login method | submits form after initial validation has occurred
        $scope.submitLogin = function (isValid) {

            // check to make sure the form is completely valid
            if (isValid) {

                //firebase method to authorize user with email and password
                $scope.authObj.$authWithPassword({
                    email    : $scope.userLogin.email,
                    password : $scope.userLogin.password
                }).then(function(authData) {

                    //user currentUser Service to check if user is new (no Profile)
                    //if new, the Service will create a Profile
                    currentUser.checkUserProfile(authData);

                    //with successful login, direct to Dashboard page
                    //$state.go("dashboard");

                    $log.info("Authenticated successfully with payload:", authData);

                    //catch method used for error handling
                }).catch(function(error) {

                    $log.info("showError before switch",$scope.showError);
                    switch (error.code) {
                        case "INVALID_EMAIL":
                        $scope.showError=true;
                        $log.error("The specified user account email is invalid.");
                        break;
                        case "INVALID_PASSWORD":
                        $log.error("The specified user account password is incorrect.");
                        break;
                        case "INVALID_USER":
                        $scope.showError=true;
                        $log.error("The specified user account does not exist.");
                        break;
                        default:
                        $log.error("Error logging user in:", error);
                    };
                    $log.info("showError after switch",$scope.showError);
                });

            }; //end isValid

            //call resetForm to clear user form entry
            $scope.resetForm ();
        }; //end submitLogin



        //login method | submits form after iniital validation has occurred
        $scope.submitRegister = function (isValid) {

            // check to make sure the form is completely valid
            if (isValid) {

                $log.info("$scope.userRegister.firstName-1",$scope.userRegister.firstName);
                var ref = new Firebase("https://dazzling-torch-1941.firebaseio.com/");

                //use Firebase method createUser to add user with email & password credentials
                //note this only give user a UID, no other info attached to user and NOT authenticated (logged in)
                ref.createUser({
                    email    : $scope.userRegister.email,
                    password : $scope.userRegister.password
                }, function(error, userData) {
                    if (error) {
                        switch (error.code) {
                            case "EMAIL_TAKEN":
                            $log.error("The new user account cannot be created because the email is already in use.");
                            break;
                            case "INVALID_EMAIL":
                            $log.error("The specified email is not a valid email.");
                            break;
                            default:
                            $log.error("Error creating user:", error);
                        }
                    } else {

                        //call currentUser service to create iniital profile for user
                        currentUser.createInitialProfile(userData);

                    } //end function
                }); //end createUser

            } //end isValid
            // clear entry fields on user Registration form
            $scope.resetRegisterForm ();
        }; //end submitRegister

        //logout user
        $scope.logout = function () {

            //call firebase unauth method to log out user
            ref.unauth();
        };

        //resets userRegister object
        $scope.resetRegisterForm = function (email, password) {
            $scope.userRegister = {email: '', password: ''};
        };

        //resets userLogin object
        $scope.resetForm = function (email, password) {
            $scope.userLogin = {email: '', password: ''};
        };

    }]); //end LoginCtrl
