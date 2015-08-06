angular.module('GA_Dashboard')
// app.config(['$logProvider', function($logProvider){
//     $logProvider.debugEnabled(true);
// }]);

.controller("DashboardCtrl", [
  "$scope", "$firebaseAuth", "$state",
  function($scope, $firebaseAuth, $state) {
    console.log("DashboardCtrl ran");

    // Step 4: Create the view selector.
    // The View selector component can be used to obtain the ids of a particular view,
    // so you can run a report for it.
    // To create a view selector, all you need is the container reference (html id in Step 1).
    // Note This creates the view selector component, but it doesn't yet render it on the page.
    // To do that you need to call execute(), which is handled in step 6.

    console.log("user authed?", gapi.analytics.auth.isAuthorized());

    gapi.analytics.ready(function() {
      console.log("gapi ready go - dashboardjs");

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
    
    viewSelector.execute();

    viewSelector.on('change', function(ids) {
      var newIds = {
        query: {
          ids: ids
        }
      }
      timeline.set(newIds).execute();
    });
  });

}]);
