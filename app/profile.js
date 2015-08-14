
angular.module('GA_Dashboard')

.controller("ProfileCtrl", [
  "$scope", "$rootScope","$firebaseArray", "$state", "$log", "currentUser",
  function($scope, $rootScope, $firebaseArray, $state, $log, currentUser) {
    $log.info("ProfileCtrl ran test");

    //get out UID from currentUser service
    $log.info("from profileCtrl currentUser UID:", currentUser.authCheck());

    var userUID = currentUser.authCheck();
    var userDetails = currentUser.accessUserData(userUID);
    $log.info("userDetails:", userDetails);

      //make data available in $scope to display in the view
      $scope.userEmail = userDetails.email;
      $scope.userName = userDetails.name;

      //using $scope.$apply() to make sure data fills in view;
      //otherwise it was requiring a click in the form element to populate
      //$scope.$apply();


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
