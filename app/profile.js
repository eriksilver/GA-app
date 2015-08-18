
angular.module('GA_Dashboard')

// .controller("ProfileAlertsController", [
//     "$log",
//     "$scope",
//     "AlertService",
//     function($log, $scope, AlertService) {
//         $scope.alerts = AlertService.alerts;
//     }
// ])

.controller("ProfileCtrl", [
  "$scope", "$state", "$log", "currentUser","$rootScope", "AlertService",
  function($scope, $state, $log, currentUser, rootScope, AlertService) {
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
    };

    //setup alerts in controller scope
    $scope.alerts = AlertService.alerts;

    //receive Broadcast to Alert user Firebase sync failed
    $scope.$on('saveProfileAlert', function(event,args) {
        AlertService.add({
            message: args.message,
            type: args.result,
            timeout: 6000,
        });
        $scope.$apply();
    });

    $scope.closeAlert = function (index) {
        AlertService.remove(index);
    };

    //testing AlertService
    // var testAlert = {message: "testing 123"};
    // AlertService.add(testAlert);

}]);
