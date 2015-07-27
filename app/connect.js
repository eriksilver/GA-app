//console.log('Connect JS before controller');

angular.module('GA_Dashboard')
// app.config(['$logProvider', function($logProvider){
//     $logProvider.debugEnabled(true);
// }]);

.controller("ConnectCtrl", [
  "$scope", "$rootScope", "$firebaseAuth",
  function($scope, $rootScope, $firebaseAuth) {
    console.log("ConnectCtrl ran")

    //pull out UID from $rootScope currentUser
    var userID = $rootScope.currentUser.uid

    // Get a database reference to our users
    var ref = new Firebase("https://dazzling-torch-1941.firebaseio.com/users");

    // Attach a Firebase callback to read the data from users reference
    ref.once("value", function(snapshot) {
      //get snapshot of specific user
      var userSnapshot = snapshot.child(userID);
      //get data from that snapshot
      var userData = userSnapshot.val();
      console.log("current userData", userData);

      //make data available in $scope to display in the view
      $scope.userEmail = userData.email;
      $scope.userName = userData.name;

      //using $scope.$apply() to make sure data fills in view;
      //otherwise it was requiring a click in the form element to populate
      $scope.$apply();
    });

    $scope.userGA = function () {
      var http = "http://";
      var fullUrl = http.concat($scope.userProperty);

      ref.child(userID).update({
        emailGA: $scope.userEmailGA,
        webProperty: fullUrl
      })
    };


    //Start GA Auth
    function authorize(event) {

      // Replace with your client ID from the developer console.
      var CLIENT_ID = '219791845501-it7kgsija2fr04vvcf2lu7ne6pfq6r7a.apps.googleusercontent.com';

      // Set authorized scope.
      var SCOPES = ['https://www.googleapis.com/auth/analytics.readonly'];

      console.log("event authorized");

      // Handles the authorization flow.
      // `immediate` should be false when invoked from the button click.
      var useImmdiate = event ? false : true;
      var authData = {
        client_id: CLIENT_ID,
        scope: SCOPES,
        immediate: useImmdiate
      };

      gapi.auth.authorize(authData, function(response) {
        var authButton = document.getElementById('auth-button');
        if (response.error) {
          authButton.hidden = false;
        }
        else {
          authButton.hidden = true;
          listProperties();
        }
      });
      console.log("authdata completed");
    }


    /*
     * Note: This code assumes you have an authorized Analytics client object.
     * See the Web Property Developer Guide for details.
     */

    /*
     * Example 1:
     * Requests a list of all properties for the authorized user.
     */
     function listProperties() {
       // Load the Google Analytics client library.
       gapi.client.load('analytics', 'v3').then(function() {

         // Get a list of all web properties for this account
         var request = gapi.client.analytics.management.webproperties.list({
           'accountId': '2209662'
         });
         request.execute(printProperties);
       });
     }
    /*
     * Example 2:
     * The results of the list method are passed as the results object.
     * The following code shows how to iterate through them.
     */
    function printProperties(results) {
      console.log("results object",results);
      if (results && !results.error) {
        var properties = results.items;
        for (var i = 0, property; property = properties[i]; i++) {
          console.log('Account Id: ' + property.accountId);
          console.log('Property Id: ' + property.id);
          console.log('Property Name: ' + property.name);
          console.log('Property Profile Count: ' + property.profileCount);
          console.log('Property Industry Vertical: ' + property.industryVertical);
          console.log('Property Internal Id: ' + property.internalWebPropertyId);
          console.log('Property Level: ' + property.level);
          if (property.websiteUrl) {
            console.log('Property URL: ' + property.websiteUrl);
          }

          console.log('Created: ' + property.created);
          console.log('Updated: ' + property.updated);
        }
      }
    }

    console.log("before event listener");
    // Add an event listener to the 'auth-button'.
    //document.getElementById('auth-button').addEventListener('click', authorize);

    $scope.authorizeGA= function () {
      console.log("authorizeGA fn running");

      authorize();

    }; //end authorizeGA


}]); //end ConnectCtrl
