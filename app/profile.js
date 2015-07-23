
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

    //setup userData to contain current users
    var userData = new Firebase("https://dazzling-torch-1941.firebaseio.com/users");

    // create a synchronized array
    $scope.user = $firebaseArray(userData);
    console.log("$scope.user", $scope.user);
    console.log("rootScope.currentUser", $rootScope.currentUser);

    //all current user data is in rootscope
    //put user data in local variable and use $scope to show in view
    //not sure if we want/need 3 way binding
    

    //$scope.firstName = "John";

}]);
