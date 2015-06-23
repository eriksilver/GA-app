console.log('Home JS before controller');

angular.module('GA_Dashboard')
// app.config(['$logProvider', function($logProvider){
//     $logProvider.debugEnabled(true);
// }]);

.controller("HomeCtrl", [
  "$scope", "$firebaseAuth",
  function($scope, $firebaseAuth) {
    console.log("HomeCtrl ran");
    var ref = new Firebase("https://dazzling-torch-1941.firebaseio.com/");

    
}]);
