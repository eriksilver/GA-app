//console.log('Connect JS before controller');

angular.module('GA_Dashboard')
// app.config(['$logProvider', function($logProvider){
//     $logProvider.debugEnabled(true);
// }]);

.controller("ConnectCtrl", [
  "$log",
  "$scope", "$rootScope", "$firebaseAuth",
  function($log, $scope, $rootScope, $firebaseAuth) {
      $log.info("ConnectCtrl ran");

      //test of scope is transferring down from parent ApplicationController
      $log.info($scope.thingOnAppCtrl.foo);

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


      gapi.analytics.ready(function() {

      // <!-- When the library is fully loaded, any callbacks passed to gapi.analytics.ready will be invoked -->
      // gapi.analytics.ready(function() {
      console.log("analytics fn ready");

      /**
      * Create a new ViewSelector instance to be rendered inside of an
      * element with the id "view-selector-container".
      */
      var viewSelector = new gapi.analytics.ViewSelector({
        container: 'view-selector-container'
      });

      // Render the view selector to the page.
      viewSelector.execute();

      /**
      * Create a table chart showing top browsers for users to interact with.
      * Clicking on a row in the table will update a second timeline chart with
      * data from the selected browser.
      */
      var mainChart = new gapi.analytics.googleCharts.DataChart({
        query: {
          'dimensions': 'ga:mobileDeviceInfo,ga:source',
          'metrics': 'ga:sessions,ga:pageviews,ga:sessionDuration',
          'sort': '-ga:pageviews',
          'segment': 'gaid::-14',
          'max-results': '40'
        },
        chart: {
          type: 'TABLE',
          container: 'main-chart-container',
          options: {
            width: '100%'
          }
        }
      });


      /**
      * Create a timeline chart showing sessions over time for the browser the
      * user selected in the main chart.
      */
      var breakdownChart = new gapi.analytics.googleCharts.DataChart({
        query: {
          'dimensions': 'ga:date',
          'metrics': 'ga:sessions',
          'start-date': '7daysAgo',
          'end-date': 'yesterday'
        },
        chart: {
          type: 'LINE',
          container: 'breakdown-chart-container',
          options: {
            width: '100%'
          }
        }
      });


      /**
      * Store a refernce to the row click listener variable so it can be
      * removed later to prevent leaking memory when the chart instance is
      * replaced.
      */
      var mainChartRowClickListener;


      /**
      * Update both charts whenever the selected view changes.
      */
      viewSelector.on('change', function(ids) {
        var options = {query: {ids: ids}};

        // Clean up any event listeners registered on the main chart before
        // rendering a new one.
        if (mainChartRowClickListener) {
          google.visualization.events.removeListener(mainChartRowClickListener);
        }

        mainChart.set(options).execute();
        breakdownChart.set(options);

        // Only render the breakdown chart if a browser filter has been set.
        if (breakdownChart.get().query.filters) breakdownChart.execute();
      });


      /**
      * Each time the main chart is rendered, add an event listener to it so
      * that when the user clicks on a row, the line chart is updated with
      * the data from the browser in the clicked row.
      */
      mainChart.on('success', function(response) {

        var chart = response.chart;
        var dataTable = response.dataTable;

        // Store a reference to this listener so it can be cleaned up later.
        mainChartRowClickListener = google.visualization.events
        .addListener(chart, 'select', function(event) {

          // When you unselect a row, the "select" event still fires
          // but the selection is empty. Ignore that case.
          if (!chart.getSelection().length) return;

          var row =  chart.getSelection()[0].row;
          var browser =  dataTable.getValue(row, 0);
          var options = {
            query: {
              filters: 'ga:browser==' + browser
            },
            chart: {
              options: {
                title: browser
              }
            }
          };

          breakdownChart.set(options).execute();
        });
      });

    });

}]); //end ConnectCtrl
