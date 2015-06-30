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

//Angular store current user

//use Service to share data between contollers -adds dependency to each contoller
///somewhat more verbose
//or use root or application controller
///
//my current controllers are independent, without parents

//could create my own auth that extracts Firebase data
