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
            runChart();

            // document.getElementById('query-output').value = formattedJson;
            // console.log("formattedJson from runReport", formattedJson);
        })
        .then(null, function(err) {
            // Log any errors.
            console.log(err);
        });
    }


function runChart() {
    console.log("runKeen-go");
    var data = [
    {
        value: 300,
        color:"#F7464A",
        highlight: "#FF5A5E",
        label: "Red"
    },
    {
        value: 50,
        color: "#46BFBD",
        highlight: "#5AD3D1",
        label: "Green"
    },
    {
        value: 100,
        color: "#FDB45C",
        highlight: "#FFC870",
        label: "Yellow"
    },
    {
        value: 40,
        color: "#949FB1",
        highlight: "#A8B3C5",
        label: "Grey"
    },
    {
        value: 120,
        color: "#4D5360",
        highlight: "#616774",
        label: "Dark Grey"
    }

    ];


    // Get the context of the canvas element we want to select
    var ctx = document.getElementById("myChart").getContext("2d");
    var myNewChart = new Chart(ctx).PolarArea(data);
    new Chart(ctx).PolarArea(data, options);

//NOTE ON DATA FORMAT required
//A batch of events should be a JSON object, keyed by event collection names,
//each of which point to a JSON array of events.

    // console.log('reportData - outside of function',reportData);

    // var reportDataJSON = JSON.stringify(reportData);
    //alert(reportDataJSON);
    // reportDataJSON = {"data": reportData, "keen": {}} ; //makes reportData an object with "data" key
    //order data by date key?
    //store data by report?
    //might be harder to chart nested data
    //test data in keen first
    //maybe use Firebase to store data instead?, but lose built in charting w/ Keen

    // console.log("reportDataJSON", reportDataJSON);



}

}]); //end DashboardCtrl
