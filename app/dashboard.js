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

    var reportData = { };
    var reportDataJSON = { };
    var keen = { }; //nest data in a "keen" object to avoid getting keen timestamp on data
    //test using Google Embed API get get report data
    function runReport() {
        $log.info("runReport ran");

        var profileId = 4067996;

        gapi.client.analytics.data.ga.get({
            'ids': 'ga:' + profileId,
            'start-date': '2015-07-01', //'7daysAgo',
            'end-date': '2015-07-30',
            'metrics': 'ga:users',
            'dimensions': 'ga:date',
            'prettyPrint': 'true'
        })

        .then(function(response) {
            console.log("raw response", response);
            var formattedJson = JSON.stringify(response.result, null, 2);
            console.log("formattedJson response", formattedJson);
            var columnHeaders = formattedJson.columnHeaders;
            console.log("formattedJson columnHeaders", columnHeaders);
            var rows = formattedJson.rows;
            console.log("formattedJson rows", rows);
            console.log("raw rows", response.result.rows);
            reportData = response.result.rows;
            runKeen();

            // document.getElementById('query-output').value = formattedJson;
            // console.log("formattedJson from runReport", formattedJson);
        })
        .then(null, function(err) {
            // Log any errors.
            console.log(err);
        });
    }

    ///////////////////BEGIN KEEN IO SETUP
function runKeen() {
    console.log("runKeen-go");
    var client = new Keen({
        projectId: "55f3306dc2266c7197951e78", // String (required always)
        writeKey: "803224c232778760d9165fe80bd5bc18c9658ea85495fefeb951041dc69575b49534cd9e894861be7cd0a119cf94a57f92e9681430acef6c02532d8fd9c01f5fee4ba972ec3ec80f94225e85e2c10c1c2d6f76dcaccf7dbae6086d686478c8aaf7ab997a5f3b0f990374efd9539f09a2",   // String (required for sending data)
        readKey: "1dfb786587f806c22b1b6240158b02145e8016ddbf4097e3912aaf28497935dcb479b5ae436950c3c17e966fa62b716637000c9618e416cc708b7310d18fb3e9587f7284b9d7a086c063e502fbb3e8628d25cd756f56ae131f37f243f1669006d72743aeb39457e59fa5b805f1f31a4b"      // String (required for querying data)

        // protocol: "https",         // String (optional: https | http | auto)
        // host: "api.keen.io/3.0",   // String (optional)
        // requestType: "jsonp"       // String (optional: jsonp, xhr, beacon)
    });

    // // Create a data object to record multiple events
    // var multipleEvents = {
    //   "purchases": [
    //     { item: "golden gadget", price: 2550, transaction_id: "f029342" },
    //     { item: "a different gadget", price: 1775, transaction_id: "f029342" }
    //   ],
    //   "transactions": [
    //     {
    //       id: "f029342",
    //       items: 2,
    //       total: 4325
    //     }
    //   ]
    // };

    // Create a data object to record multiple events
    var querySimpleViews = {
            // "time": {"first": "1441123601", "second": "1441469201", "third": "1441901201"},
            "time": {"first": "2015-09-01T20:39:30.202Z", "second": "2015-09-05T20:39:30.202Z", "third": "2015-09-10T20:39:30.202Z"},
            "views": {"first": 100, "second": 200, "third": 300}

    };

//NOTE ON DATA FORMAT required
//A batch of events should be a JSON object, keyed by event collection names,
//each of which point to a JSON array of events.

    // console.log('reportData - outside of function',reportData);

    // var reportDataJSON = JSON.stringify(reportData);
    //alert(reportDataJSON);
    reportDataJSON = {"data": reportData, "keen": {}} ; //makes reportData an object with "data" key
    //order data by date key?
    //store data by report?
    //might be harder to chart nested data
    //test data in keen first
    //maybe use Firebase to store data instead?, but lose built in charting w/ Keen

    // console.log("reportDataJSON", reportDataJSON);



    // Send multiple events to several collections
    client.addEvent("Queries7",querySimpleViews, function(err, res){
      if (err) {
          $log.info("add Event = error",err);

        // there was an error!
      }
      else {
          $log.info("add Event = success",res);
        // see sample response below
      }
    });
}

}]); //end DashboardCtrl
