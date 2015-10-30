angular.module('GA_Dashboard')
// app.config(['$logProvider', function($logProvider){
//     $logProvider.debugEnabled(true);
// }]);

.controller("DashboardCtrl", [
    "$scope", "$firebaseAuth", "$state","$log",
    function($scope, $firebaseAuth, $state, $log) {
        $log.log("DashboardCtrl ran");

        //set chartTimeFrame default value
        $scope.chartTimeFrame = "7";
        //define global timeFrameStart variable
        var timeFrameStart = "";

        //using $scope watch to see when the chartTimeFrame button is Updated
        //**issue I think with .foreach where it is iterating on the time frame name by
        //the amount of letters in the world, e.g. sixty = 5, thirty = 6
        $scope.$watchCollection('chartTimeFrame', function () {
            angular.forEach($scope.chartTimeFrame, function (value, key) {
                if (value) {
                    timeFrameStart = $scope.chartTimeFrame + "daysAgo";
                    $log.log("timeFrameStart:",  timeFrameStart);
                }
            });
        });


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
            });

        });

        var googleData = [];
        var chartLabels = [];
        var chartData = [];


        //pull data from Google Analytics Core Reporting API
        function runReport() {
            $log.info("runReport ran");

            var profileId = 4067996;

            gapi.client.analytics.data.ga.get({
                'ids': 'ga:' + profileId,
                'start-date': timeFrameStart, // //timeFrameStart
                'end-date': 'today', //timeFrameEnd
                'metrics': 'ga:users',
                'dimensions': 'ga:date',
                'prettyPrint': 'true'
            })
            //GA data reponse
            .then(function(response) {
                console.log("raw response", response);
                //var formattedJson = JSON.stringify(response.result, null, 2);
                //console.log("formattedJson response", formattedJson);

                // console.log("raw rows 0- 0", response.result.rows[0].array[0]);
                //console.log("formattedJson - array", response.result.rows[0][0]);

                //use response method to retrieve data and then transform it and
                //build a chart with the data with the runChart function
                googleData = response.result.rows;
                transformGoogleData();
                runChart();
            })
            //GA data response - errors
            .then(function(err) {
                // Log any errors.
                console.log(err);
            });
        };

        function transformGoogleData() {
            //iterate over data array to prepare data in charting format
            for (var i = 0; i < googleData.length-1; i++ ) {
                chartLabels[i] = googleData[i][0];
                chartData[i] = googleData[i][1];
            }
            console.log("chartLabels:",chartLabels);
            console.log("chartData:",chartData);
        };

        function runChart(data) {
            console.log("runChart-go");
            //chartJS data input format
            //how to format data labels??
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
            // push data into the Chart
            var ctx = document.getElementById("myChart").getContext("2d");
            var myBarChart = new Chart(ctx).Bar(data);
        };

    }]); //end DashboardCtrl
