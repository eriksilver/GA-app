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

    var googleData = [];
    var chartLabels = [];
    var chartData = [];



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
            //var formattedJson = JSON.stringify(response.result, null, 2);
            //console.log("formattedJson response", formattedJson);
            // var columnHeaders = formattedJson.columnHeaders;
            // console.log("formattedJson columnHeaders", columnHeaders);
            // var rows = formattedJson.rows;
            // console.log("formattedJson rows", rows);
            // console.log("raw rows 0- 0", response.result.rows[0].array[0]);
            //console.log("formattedJson - array", response.result.rows[0][0]);

            googleData = response.result.rows;
            // console.log("adfafdf", reportData);
            transformGoogleData();
            runChart();


            // document.getElementById('query-output').value = formattedJson;
            // console.log("formattedJson from runReport", formattedJson);
        })
        .then(null, function(err) {
            // Log any errors.
            //console.log(err);
        });
    }

    function transformGoogleData() {
            for (var i = 0; i < googleData.length-1; i++ ) {
                chartLabels[i] = googleData[i][0];
                chartData[i] = googleData[i][1];
            }
            console.log("chartLabels:",chartLabels);
            console.log("chartData:",chartData);

    }

//     //Add loop to pull out labels and format data
//     //sinlge helper function to take in Google data and spit out chart js format
// var foo = function() {};
// function helperFunction(data) {
//     return {};
// };
// function runChart(data, ryan) {
//     if (ryan) {
//         data = ryan(data);
//     }
//
//     // do the chart
// };
// runChart(gData, helperFunction);
// runChart(gData, function() {});
// runChart(gData, function foobar() {});
//
// //mobile web friendly vs more native like
// //chrome app is web app with certain file structure
// //use bootstrap docs to make mobile friendly
// //design from smallest, xs, need to add medium, large, small



function runChart(data, dataTrasformFunction) {
    console.log("runChart-go");
    var data = {
    // labels: ["January", "February", "March", "April", "May", "June", "July"],
    labels: chartLabels,
    datasets: [
        {
            label: "My First dataset",
            fillColor: "rgba(172,209,233,0.5)", //#ACD1E9
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: chartData
        }
    ]
};


    // Get the context of the canvas element we want to select
    var ctx = document.getElementById("myChart").getContext("2d");
    var myBarChart = new Chart(ctx).Bar(data);
    new Chart(ctx).Bar(data, options);

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
