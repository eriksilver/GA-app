
//console.log('login JS before controller');

angular.module('GA_Dashboard')
// app.config(['$logProvider', function($logProvider){
//     $logProvider.debugEnabled(true);
// }]);

.controller("LoginCtrl", [
  "$scope", "$firebaseAuth", "$state","$log",
  function($scope, $firebaseAuth, $state, $log) {
    $log.log("LoginCtrl ran");

    //establish Firebase reference to be used by all functions in the controller
    var ref = new Firebase("https://dazzling-torch-1941.firebaseio.com/");
    $scope.authObj = $firebaseAuth(ref);


    //login method | submits form after iniital validation has occurred
    $scope.submitLogin = function (isValid) {

      // check to make sure the form is completely valid
      if (isValid) {

        $scope.authObj.$authWithPassword({
          email    : $scope.userLogin.email,
          password : $scope.userLogin.password
        }).then(function(authData) {
          //with successful login, direct to Dashboard page
          //$state.go("dashboard");

          $log.info("Authenticated successfully with payload:", authData);
          // //create user profile with login authdata
          // ref.child("users").child(authData.uid).set({
          //   email: $scope.userLogin.email,
          //   name: getName(authData),
          //   profileExist: true,
          //   provider: authData.provider, //authentication method, e.g. password
          // });
          //
          // // find a suitable name for the user based on the meta info given by each provider
          // function getName(authData) {
          //   switch(authData.provider) {
          //     case 'password':
          //     return authData.password.email.replace(/@.*/, '');
          //     // use below if twitter or facebook authentication is used
          //     // case 'twitter':
          //     // return authData.twitter.displayName;
          //     // case 'facebook':
          //     // return authData.facebook.displayName;
          // }
          // }


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

        $scope.resetForm ();
      }; //end isValid
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
            //note userData consists solely of UID
            //this sets up empty user profile - will be filled in when user logs in with authData method
            ref.child("users").child(userData.uid).set({
              email: " ",
              name: " ",
              profileExist: false,
              provider: " "
            });

            //note userData consists solely of UID
            $log.info("Successfully created user account with uid:", userData.uid);

            //$log.info("$scope.userRegister.firstName-2",$scope.userRegister.firstName);
          } //end function
        }); //end createUser

      } //end isValid

      $scope.resetRegisterForm ();
    }; //end submitRegister

    //logout user
    $scope.logout = function () {
      ref.unauth();
    };

    //resets newUser object
    $scope.resetRegisterForm = function (email, password) {
      $scope.userRegister = {email: '', password: ''};
    };

    //resets newUser object
    $scope.resetForm = function (email,password) {
      $scope.newUser = {email: '', password: ''};
    };

  }]); //end LoginCtrl
