
angular.module('GA_Dashboard')

.controller("ProfileCtrl", [
  "$scope", "$state", "$log", "currentUser",
  function($scope, $state, $log, currentUser) {
    $log.info("ProfileCtrl ran");

    currentUser.accessUserData()
    .then(function(data) {
        //promise fulfilled
        //make data available in $scope to display in the view
        $scope.userEmail = data.email;
        $scope.userName = data.name;
    }, function(error) {
        //promise error
        $log.debug("accessUserData promise error");
    });


    $scope.saveUser = function () {
        //call userservice
        currentUser.saveUserData($scope.userEmail,$scope.userName);
    };

}]);
