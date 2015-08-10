
//console.log('login JS before controller');

angular.module('GA_Dashboard')
// app.config(['$logProvider', function($logProvider){
//     $logProvider.debugEnabled(true);
// }]);

.controller("LoginCtrl", [
  "$scope", "$firebaseAuth", "$state","$log",
  function($scope, $firebaseAuth, $state, $log) {
    $log.log("LoginCtrl ran");
    var ref = new Firebase("https://dazzling-torch-1941.firebaseio.com/");
    $scope.authObj = $firebaseAuth(ref);

    //$scope.currentUser = null;

    //login method
    $scope.login = function () {

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
        switch (error.code) {
          case "INVALID_EMAIL":
          $log.error("The specified user account email is invalid.");
          break;
          case "INVALID_PASSWORD":
          $log.error("The specified user account password is incorrect.");
          break;
          case "INVALID_USER":
          $log.error("The specified user account does not exist.");
          break;
          default:
          $log.error("Error logging user in:", error);
        };
      });

      $scope.resetForm ();
    };


    //register user method
    $scope.register = function () {
      //use Firebase method createUser to add user with email & password credentials
      //note this registed, NOT authenticated (logged in)
      ref.createUser({
        email    : $scope.newUser.email,
        password : $scope.newUser.password
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

          //save user at Registration with UID and empty object
          var ref = new Firebase("https://dazzling-torch-1941.firebaseio.com");
          ref.child("users").child(userData.uid).set({
            profileExist: false,
            provider: " ",
            email: $scope.newUser.email,
            name: " ",
            emailGA: " ",
            webProperty: " "
          });
        }
      });

      $scope.resetForm ();
    };

    //logout user
    $scope.logout = function () {
      ref.unauth();
    };

    //resets newUser object
    $scope.resetForm = function (email,password) {
      $scope.newUser = {email: '', password: ''};
    };


}]);
