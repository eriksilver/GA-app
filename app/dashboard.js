angular.module('GA_Dashboard')
// app.config(['$logProvider', function($logProvider){
//     $logProvider.debugEnabled(true);
// }]);

.controller("DashboardCtrl", [
  "$scope", "$firebaseAuth", "$state","$log",
  function($scope, $firebaseAuth, $state, $log) {
    $log.log("DashboardCtrl ran");

    ///Google Analytics API ready function - waits until API script loads
    gapi.analytics.ready(function() {
        // Step 3: Authorize the user.

        //Need to define CLIENT ID and SCOPES
        var CLIENT_ID = '219791845501-it7kgsija2fr04vvcf2lu7ne6pfq6r7a.apps.googleusercontent.com';
        // Set authorized scope.
        var SCOPES = ['https://www.googleapis.com/auth/analytics.readonly'];
        //One-click auth button needs passed in a container reference and your client ID
        var authData = {
            container: 'auth-button',
            clientid: CLIENT_ID,
            scope: SCOPES,
        };

        //pass in authorizing data
        gapi.analytics.auth.authorize(authData,{

        });

        //With successful authorization, log response, and call function
        gapi.analytics.auth.on('success', function(response) {
            console.log("auth response",response);
            runReport();
            // runChart();
            // listAccountSummaries();
        });

    });

    //test using Google Embed API get get report data
    function runReport() {
        $log.info("runReport ran");

        var report = new gapi.analytics.report.Data({
            query: {
                ids: 'ga:4067996', //Profile ID
                metrics: 'ga:sessions',
                dimensions: 'ga:city'
            }
        });

        report.on('success', function(response) {
            console.log("runReport", response);
            var reportData = response.query;
            console.log('reportData',reportData);
            // var reportDataJSON = JSON.parse(reportData);
            // console.log('reportDataJSON',reportDataJSON);

        });
        report.execute();
    }

    function listAccountSummaries() {
        $log.info("listAccountSummaries ran");

        // Get a list of all Google Analytics accounts for this user
        var request = gapi.client.analytics.management.accountSummaries.list();
        request.execute(handleResponse)
    }

    /*
    * Example 2:
    * The results of the list method are passed as the response object.
    * The following code shows how to iterate through them.
    */
    function handleResponse(response) {
        if (response && !response.error) {
            if (response.items) {
                printAccountSummaries(response.items);
            }
        } else {
            console.log('There was an error: ' + response.message);
        }
    }


    function printAccountSummaries(accounts) {
        for (var i = 0, account; account = accounts[i]; i++) {
            console.log('Account id: ' + account.id);
            console.log('Account name: ' + account.name);
            console.log('Account kind: ' + account.kind);

            // Print the properties.
            if (account.webProperties) {
                printProperties(account.webProperties);
            }
        }
    }


    function printProperties(properties) {
        for (var j = 0, property; property = properties[j]; j++) {
            console.log('Property id: ' + property.id);
            console.log('Property name: ' + property.name);
            console.log('Property kind: ' + property.kind);
            console.log('Internal id: ' + property.internalWebPropertyId);
            console.log('Property level: ' + property.level);
            console.log('Property url: ' + property.websiteUrl);

            // Print the views (profiles).
            if (property.profiles) {
                printProfiles(property.profiles);
            }
        }
    }


    function printProfiles(profiles) {
        for (var k = 0, profile; profile = profiles[k]; k++) {
            console.log('Profile id: ' + profile.id);
            console.log('Profile name: ' + profile.name);
            console.log('Profile kind: ' + profile.kind);
            console.log('Profile type: ' + profile.type);
        }
    }

    ///////////////////BEGIN KEENIO SETUP

    var client = new Keen({
        projectId: "55f3306dc2266c7197951e78", // String (required always)
        writeKey: "803224c232778760d9165fe80bd5bc18c9658ea85495fefeb951041dc69575b49534cd9e894861be7cd0a119cf94a57f92e9681430acef6c02532d8fd9c01f5fee4ba972ec3ec80f94225e85e2c10c1c2d6f76dcaccf7dbae6086d686478c8aaf7ab997a5f3b0f990374efd9539f09a2",   // String (required for sending data)
        readKey: "1dfb786587f806c22b1b6240158b02145e8016ddbf4097e3912aaf28497935dcb479b5ae436950c3c17e966fa62b716637000c9618e416cc708b7310d18fb3e9587f7284b9d7a086c063e502fbb3e8628d25cd756f56ae131f37f243f1669006d72743aeb39457e59fa5b805f1f31a4b"      // String (required for querying data)

        // protocol: "https",         // String (optional: https | http | auto)
        // host: "api.keen.io/3.0",   // String (optional)
        // requestType: "jsonp"       // String (optional: jsonp, xhr, beacon)
    });

    // Create a data object to record multiple events
    var multipleEvents = {
      "purchases": [
        { item: "golden gadget", price: 2550, transaction_id: "f029342" },
        { item: "a different gadget", price: 1775, transaction_id: "f029342" }
      ],
      "transactions": [
        {
          id: "f029342",
          items: 2,
          total: 4325
        }
      ]
    };

    // Send multiple events to several collections
    client.addEvents(multipleEvents, function(err, res){
      if (err) {
        // there was an error!
      }
      else {
          $log.info("add purchase & transactions events = success",res);
        // see sample response below
      }
    });

}]); //end DashboardCtrl
