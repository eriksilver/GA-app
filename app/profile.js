
//+setup profile controller and scope to read/write to page
//user will be logged in
//display user data from Firebase

//display data in view
//allow user to edit data

angular.module('GA_Dashboard')

.controller("ProfileCtrl", [
  "$scope", "$firebaseArray", "$state", "$rootScope",
  function($scope, $firebaseArray, $state, $rootScope) {
    console.log("ProfileCtrl ran");

    // //setup userData to contain current users
    // var userData = new Firebase("https://dazzling-torch-1941.firebaseio.com/users");
    //
    // // create a synchronized array
    // $scope.user = $firebaseArray(userData);
    // console.log("$scope.user", $scope.user);
    console.log("rootScope.currentUser", $rootScope.currentUser);

    var userID = $rootScope.currentUser.uid
    console.log("user uid", userID);
    //
    // //all current user data is in rootscope
    // //put user data in local variable and use $scope to show in view
    // //not sure if we want/need 3 way binding
    // $scope.user = $rootScope.currentUser;
    //
    // Get a database reference to our users
    var ref = new Firebase("https://dazzling-torch-1941.firebaseio.com/users");
    // Attach an asynchronous callback to read the data at our users reference
    ref.once("value", function(snapshot) {
      var userSnapshot = snapshot.child(userID);
      //console.log("current userSnapshot", userSnapshot);
      var userData = userSnapshot.val();
      console.log("current userData", userData);
      console.log("current userData.email", userData.email);
      console.log("current userData.name", userData.name);


      $scope.userEmail = userData.email;
      $scope.userName = userData.name;

      //using $scope.$apply() to make sure data fills in view; otherwise it was requiring a click in the form element to populate
      $scope.$apply();
    });

    $scope.saveUser = function () {
      ref.child(userID).set({
        email: $scope.userEmail,
        name: $scope.userName
      });
    };
    // console.log("user details"; )
}]);
