
//console.log('login JS before controller');

angular.module('GA_Dashboard')
// app.config(['$logProvider', function($logProvider){
//     $logProvider.debugEnabled(true);
// }]);

.controller("LoginCtrl", [
  "$scope", "$firebaseAuth", "$state","$log",
  function($scope, $firebaseAuth, $state, $log) {
    $log.log("LoginCtrl ran");


    //login method | submits form after iniital validation has occurred
    $scope.submitLogin = function (isValid) {
      var ref = new Firebase("https://dazzling-torch-1941.firebaseio.com/");
      $scope.authObj = $firebaseAuth(ref);

      // check to make sure the form is completely valid
      if (isValid) {
        alert('our form is amazing');
        $scope.authObj.$authWithPassword({
          email    : $scope.newUser.email,
          password : $scope.newUser.password
        }).then(function(authData) {
          //with successful login, direct to Connect page
          $state.go("dashboard");
          // $log.info("Logged in as:", authData.uid);
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

        $scope.resetForm ();
      }; //end isValid
    }; //end submitLogin



    //login method | submits form after iniital validation has occurred
    $scope.submitRegister = function (isValid) {
      var ref = new Firebase("https://dazzling-torch-1941.firebaseio.com/");

      // check to make sure the form is completely valid
      if (isValid) {
        alert('our form is amazing');

        //use Firebase method createUser to add user with email & password credentials
        //note this only give user a UID, no other info attached to user and NOT authenticated (logged in)
        $log.info("$scope.userRegister.firstName-1",$scope.userRegister.firstName);

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
            $log.info("Successfully created user account with uid:", userData);

            $log.info("$scope.userRegister.firstName-2",$scope.userRegister.firstName);
            //save user at Registration with UID and empty object
            var ref = new Firebase("https://dazzling-torch-1941.firebaseio.com/");

            ref.child("users").child(userData.uid).set({
              profileExist: true,
              provider: " ",
              email: $scope.userRegister.email,
              name: $scope.userRegister.name
            });
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
    $scope.resetRegisterForm = function (name,email,password) {
      $scope.userRegister = {name: '', email: '', password: ''};
    };

    //resets newUser object
    $scope.resetForm = function (email,password) {
      $scope.newUser = {email: '', password: ''};
    };

  }]); //end LoginCtrl
