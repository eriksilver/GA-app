
angular.module('GA_Dashboard')

.controller("ProfileCtrl", [
  "$scope", "$rootScope","$firebaseArray", "$state", "$log", "currentUser",
  function($scope, $rootScope, $firebaseArray, $state, $log, currentUser) {
    $log.info("ProfileCtrl ran test");
    ////NOTES
    // currentUser service stores user id (uid)
    // put user data in local variable and use $scope to show in view

    //get out UID from currentUser service
    var userID = currentUser.uid;

    // Get a database reference to our users
    var ref = new Firebase("https://dazzling-torch-1941.firebaseio.com/users");

    // Attach a Firebase callback to read the data from users reference
    ref.once("value", function(snapshot) {
      //get snapshot of specific user
      var userSnapshot = snapshot.child(userID);
      //get data from that snapshot
      var userData = userSnapshot.val();
      $log.info("current userData:", userData);

      //make data available in $scope to display in the view
      $scope.userEmail = userData.email;
      $scope.userName = userData.name;
      $scope.userUrl = userData.webProperty;

      //using $scope.$apply() to make sure data fills in view;
      //otherwise it was requiring a click in the form element to populate
      $scope.$apply();
    });

    $scope.saveUser = function () {
      ref.child(userID).update({
        email: $scope.userEmail,
        name: $scope.userName
      })
      //NEED to add some way of error handling email entry
      //Also add Success message when data is saved

      // //catch method used for error handling
      // .catch(function(error) {
      //   switch (error.code) {
      //     case "INVALID_EMAIL":
      //     console.log("The specified user account email is invalid.");
      //     break;
      //     case "INVALID_PASSWORD":
      //     console.log("The specified user account password is incorrect.");
      //     break;
      //     case "INVALID_USER":
      //     console.log("The specified user account does not exist.");
      //     break;
      //     default:
      //     console.log("Error logging user in:", error);
      //   };
      // });
    };

}]);
