
console.log('login JS before controller');

angular.module('GA_Dashboard')
// app.config(['$logProvider', function($logProvider){
//     $logProvider.debugEnabled(true);
// }]);

.controller("LoginCtrl", [
  "$scope", "$firebaseAuth", "$state",
  function($scope, $firebaseAuth, $state) {
    console.log("LoginCtrl ran");
    var ref = new Firebase("https://dazzling-torch-1941.firebaseio.com/");
    $scope.authObj = $firebaseAuth(ref);

    $scope.currentUser = null;
    // console.log("here is scope.authObj:", $scope.authObj);

    //login method
    $scope.login = function () {

      $scope.authObj.$authWithPassword({
        email    : $scope.newUser.email,
        password : $scope.newUser.password
      }).then(function(authData) {
        $scope.currentUser = authData.password.email;
        console.log("Logged in as:", authData.uid);
        console.log("Full authData:", authData);
        $state.go("connect");

      }).catch(function(error) {
        console.error("Authentication failed:", error);
      });

      $scope.resetForm ();
    };


    //register method
    $scope.register = function () {
      ref.createUser({
        email    : $scope.newUser.email,
        password : $scope.newUser.password
      }, function(error, userData) {
        if (error) {
          console.log("Error creating user:", error);
        } else {
          console.log("Successfully created user account with uid:", userData.uid);
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
