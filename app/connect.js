//console.log('Connect JS before controller');

angular.module('GA_Dashboard')
// app.config(['$logProvider', function($logProvider){
//     $logProvider.debugEnabled(true);
// }]);

.controller("ConnectCtrl", [
  "$log","$scope", "$rootScope", "$firebaseAuth", "gaAuth",
  function($log, $scope, $rootScope, $firebaseAuth, gaAuth) {
      $log.info("ConnectCtrl ran");

      //test of scope is transferring down from parent ApplicationController
      //$log.info("test data from parent controller:", $scope.thingOnAppCtrl.foo);


      //$log.info("In ConnectCtrl-sharedProperties.Property1:", sharedProperties.Property1);

      //Snippet to pull userName - maybe make into service?
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

      //call GAauth service
      //gaAuth.this;
      gapi.analytics.ready(function() {

        // Step 3: Authorize the user.

        var CLIENT_ID = '219791845501-it7kgsija2fr04vvcf2lu7ne6pfq6r7a.apps.googleusercontent.com';
        //One-click auth button needs passed in a container reference and your client ID
        gapi.analytics.auth.authorize({
          container: 'auth-button',
          clientid: CLIENT_ID,
        });

        // Step 4: Create the view selector.
        //The View selector component can be used to obtain the ids of a particular view,
        //so you can run a report for it.
        //To create a view selector, all you need is the container reference (html id in Step 1).
        //Note This creates the view selector component, but it doesn't yet render it on the page.
        //To do that you need to call execute(), which is handled in step 6.

        var viewSelector = new gapi.analytics.ViewSelector({
          container: 'view-selector'
        });

        // Step 5: Create the timeline chart.
        // The Embed API provides you with a chart component that is both a Google chart as well as a report object
        // in one. This greatly simplifies the process for displaying data as the chart object will run your reports
        // behind the scene and automatically update itself with the results.
        // To create a chart component you'll need to specify the API query parameters as well as the chart options.
        // Within the chart options is a reference to the ID of the container you created in step 1.
        // Note: As with the view selector, this creates the chart component but to render it to the page you
        // need to call execute(), which will be explained in the next step

        var timeline = new gapi.analytics.googleCharts.DataChart({
          reportType: 'ga',
          query: {
            'dimensions': 'ga:date',
            'metrics': 'ga:sessions, ga:pageviews',
            'start-date': '90daysAgo',
            'end-date': 'yesterday',
          },
          chart: {
            type: 'LINE',
            container: 'timeline'
          }
        });

        // Step 6: Hook up the components to work together.
        //
        // Embed API components emit events when various things happen such as successful authorization,
        // selecting a new view, or a chart being fully rendered.
        //
        // The example application in this guide waits to render the view selector until after authorization
        // has happened, and it updates the timeline chart whenever a new view is selected from the view selector

        gapi.analytics.auth.on('success', function(response) {
          viewSelector.execute();
        });

        viewSelector.on('change', function(ids) {
          var newIds = {
            query: {
              ids: ids
            }
          }
          timeline.set(newIds).execute();
        });
      });

      $log.info("end ConnectCtrl");

}]); //end ConnectCtrl
