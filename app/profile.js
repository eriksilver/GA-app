
angular.module('GA_Dashboard')

.controller("ProfileCtrl", [
  "$scope", "$state", "$log", "currentUser","$rootScope",
  function($scope, $state, $log, currentUser, rootScope) {
    $log.info("ProfileCtrl ran");

    //use currentUser service to get current user email and name
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
        //use currentUser service to save email and name updates
        currentUser.saveUserData($scope.userEmail,$scope.userName);

        //receive Broadcast to Alert user Firebase sync failed
        $scope.$on('saveProfileFail', function(event,args) {
            $log.info("args:", args.message);
            $scope.visibleFail = true;
            $scope.$apply();
        });

        //receive Broadcast to Alert user Firebase sync success
        $scope.$on('saveProfileSuccess', function(event,args) {
            $log.info("args:", args.message);
            $scope.visibleSuccess = true;
            $scope.$apply();
        });

    };


}]);
