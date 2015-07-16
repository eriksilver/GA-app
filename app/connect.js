console.log('Connect JS before controller');

angular.module('GA_Dashboard')
// app.config(['$logProvider', function($logProvider){
//     $logProvider.debugEnabled(true);
// }]);

.controller("ConnectCtrl", [
  "$scope", "$firebaseAuth",
  function($scope, $firebaseAuth) {
    console.log("ConnectCtrl ran");
    var ref = new Firebase("https://dazzling-torch-1941.firebaseio.com/");


}]);
