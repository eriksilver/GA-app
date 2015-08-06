
//console.log('login JS before controller');

angular.module('GA_Dashboard')
// app.config(['$logProvider', function($logProvider){
//     $logProvider.debugEnabled(true);
// }]);

.controller("LoginCtrl", [
  "$scope", "$firebaseAuth", "$state",
  function($scope, $firebaseAuth, $state) {
    console.log("LoginCtrl ran");
    var ref = new Firebase("https://dazzling-torch-1941.firebaseio.com/");
    $scope.authObj = $firebaseAuth(ref);

    $scope.currentUser = null;
    // console.log("here is scope.authObj:", $scope.authObj);

    //login method
    $scope.login = function () {

      $scope.authObj.$authWithPassword({
        email    : $scope.newUser.email,
        password : $scope.newUser.password
      }).then(function(authData) {
        //?? currentUser picks up only email from authData
        $scope.currentUser = authData.password.email;
          console.log("Logged in as:", authData.uid);
          console.log("Authenticated successfully with payload:", authData);

        // //with successful login, direct to Connect page
        // $state.go("connect");

        //catch method used for error handling
      }).catch(function(error) {
        switch (error.code) {
          case "INVALID_EMAIL":
          console.log("The specified user account email is invalid.");
          break;
          case "INVALID_PASSWORD":
          console.log("The specified user account password is incorrect.");
          break;
          case "INVALID_USER":
          console.log("The specified user account does not exist.");
          break;
          default:
          console.log("Error logging user in:", error);
        };
      });

      $scope.resetForm ();
    };


    //register user method
    $scope.register = function () {
      //use Firebase method createUser to add user with email & password credentials
      //note this registed, NOT authenticated (logged in)
      ref.createUser({
        email    : $scope.newUser.email,
        password : $scope.newUser.password
      }, function(error, userData) {
        if (error) {
          switch (error.code) {
            case "EMAIL_TAKEN":
            console.log("The new user account cannot be created because the email is already in use.");
            break;
            case "INVALID_EMAIL":
            console.log("The specified email is not a valid email.");
            break;
            default:
            console.log("Error creating user:", error);
          }
        } else {
          //note userData consists solely of UID
          console.log("Successfully created user account with uid:", userData);

          //save user at Registration with UID and empty object
          var ref = new Firebase("https://dazzling-torch-1941.firebaseio.com");
          ref.child("users").child(userData.uid).set({
            profileExist: false,
            provider: " ",
            email: $scope.newUser.email,
            name: " ",
            emailGA: " ",
            webProperty: " "
          });
        }
      });

      $scope.resetForm ();
    };

    //logout user
    $scope.logout = function () {
      ref.unauth();
    };

    //resets newUser object
    $scope.resetForm = function (email,password) {
      $scope.newUser = {email: '', password: ''};
    };

    ///Google Analytics Auth
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


}]);
