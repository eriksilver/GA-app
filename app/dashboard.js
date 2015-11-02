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
        timeFrameStart = $scope.chartTimeFrame + "daysAgo";


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
                buildChartsLoop();
                // runReport();
                // runReport2();
            });

        });

        var googleData = [];
        var chartLabels = [];
        var chartData = [];

        var chartUsers = {};
        var chartBounces = {};

        var profileId = 4067996;

        var dashboardCharts = {

            "chartUsers": {
                gaConfig: {
                    'ids': 'ga:' + profileId,
                    'start-date': timeFrameStart, //'2015-10-15', //
                    'end-date': 'today', //timeFrameEnd
                    'metrics': 'ga:users',
                    'dimensions': 'ga:date',
                    'prettyPrint': 'true'
                },
                containerId: "showChartUsers",
                chartLabel: "User Activity",
                styles: { }
            },
            "chartBounces": {
                gaConfig: {
                    'ids': 'ga:' + profileId,
                    'start-date': timeFrameStart, // //timeFrameStart
                    'end-date': 'today', //timeFrameEnd
                    'metrics': 'ga:bounces',
                    'dimensions': 'ga:date',
                    'prettyPrint': 'true'
                },
                containerId: "showChartUsers",
                chartLabel: "User Activity",
                styles: { }
            },
        };

        //test to access object data
        $log.log("chartUsers.gaConfig:",dashboardCharts.chartUsers.gaConfig );
        $log.log("chartBounces.gaConfig.ids:",dashboardCharts.chartBounces.gaConfig.ids);

        //DASHBOARD CHARTS DATA STRUCTURE
        //note: A (key, value) entry in an object is called a property.
        //dashBoard charts is an object, with 2 objects (chartUsers and chartBounces)
        //chartUsers is an object with properties: gaConfig(obj), containerId, chartLabel, Styles(obj)
        //gaConfig is an object with properties: ids, startdate, end date, metrics, dimensions
        // style is an object that is currently empty

        //TEST loop that iterates over Dashboard Charts two keys/objects: chartUsers and chartBounces
        // and displays their properties: gaConfig(obj), containerId, chartLabel, Styles(obj)
        for (var key in dashboardCharts) {
            if (dashboardCharts.hasOwnProperty(key)) {
                $log.log("dashboardCharts.key:",key); //=chartUsers
                var obj = dashboardCharts[key];
                for (var prop in obj) {
                    $log.log("obj.gaConfig:",obj.gaConfig); //=chartUsers.gaConfig

                    // $log.log("prop,ojb:",prop+","+obj);
                    // important check that this is objects own property
                    // not from prototype prop inherited
                    if(obj.hasOwnProperty(prop)){
                        // console.log("properties in object:",prop + " = " + obj[prop]);
                    }
                }
            }
        };
//
// for(var obj in data) {
//  results.innerHTML += obj;
//  results.innerHTML += '<ul>';
//
// for(var country in data[obj]) {
//    var objLen = data[obj].length;
//     if(typeof objLen != 'undefined')

//LIVE loop to pull data, format it, and build charts
function buildChartsLoop () {
    for (var key in dashboardCharts) {
        if (dashboardCharts.hasOwnProperty(key)) {
            //For each of the dashboard charts - do stuff
            var chartConfigObject = dashboardCharts[key];
            $log.log("chartConfigObject.gaConfig:",chartConfigObject.gaConfig); //=chartUsers.gaConfig

            // for (var prop in chartConfigObject) {
            //
            //     // $log.log("prop,ojb:",prop+","+obj);
            //     // important check that this is objects own property
            //     // not from prototype prop inherited
            //     if(obj.hasOwnProperty(prop)){
            //         // console.log("properties in object:",prop + " = " + obj[prop]);
            //     }
            // }

            runReport(chartConfigObject['gaConfig']);

            //runtransformData(pass in data)
            //run chartBuilder(pass in data)

        }
    }
}

function runReport(chartConfig) {
    var chartConfigData = chartConfig;

    var apiQuery = gapi.client.analytics.data.ga.get(chartConfigData)

    apiQuery.execute(handleCoreReportingResults);
}

function handleCoreReportingResults(results) {
    if (!results.error) {
        console.log("big time results!!!!", results);
        // Success. Do something cool!
    } else {
        alert('There was an error: ' + results.message);
    }
}
        //
        // //call data from Google Analytics Core Reporting API
        // function runReport(chartConfig) {
        //     $log.info("runReport ran");
        //     $log.info("chartConfig:",chartConfig);
        //     $log.info("chartConfig.ids:",chartConfig.ids);
        //     $log.info("chartConfig.metrics:",chartConfig.metrics);
        //     $log.info("chartConfig.start-date:",chartConfig['start-date']);
        //     $log.info("chartConfig.end-date:",chartConfig['end-date']);
        //
        //     var chartConfigData = chartConfig;
        //
        //     gapi.client.analytics.data.ga.get(chartConfigData)
        //     //GA data response
        //     .then(function(response) {
        //         console.log("results from chart config:", response);
        //
        //         //+use response method to retrieve data and then transform it and
        //         //build a chart with the data with the runChart function
        //         // googleData = response.result.rows;
        //         // transformGoogleData();
        //         // runChart();
        //     })
        //     //GA data response - errors
        //     .then(function(error) {
        //         // Log any errors.
        //         console.log(error);
        //     });
        // };

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
            //there is an .update method if needed to update chart
            var ctx = document.getElementById("myChart").getContext("2d");
            var myBarChart = new Chart(ctx).Bar(data);

            // var ctx = document.getElementById("myChart2").getContext("2d");
            // var myBarChart = new Chart(ctx).Bar(data);
        };

        ///////////REPORT TWO ////////////////////////

        //steps:
        //runReport to get API response
        //pass data through transformGoogleData() to format it
        //runChart to pass data to ChartJS/ into DOM

        var googleData2 = [];
        var chartLabels2 = [];
        var chartData2 = [];

        //pull data from Google Analytics Core Reporting API
        function runReport2() {
            $log.info("runReport2 ran");

            var profileId = 4067996;

            gapi.client.analytics.data.ga.get({
                'ids': 'ga:' + profileId,
                'start-date': timeFrameStart, // //timeFrameStart
                'end-date': 'today', //timeFrameEnd
                'metrics': 'ga:bounces',
                'dimensions': 'ga:date',
                'prettyPrint': 'true'
            })
            //GA data response
            .then(function(response) {
                console.log("raw response2", response);
                //var formattedJson = JSON.stringify(response.result, null, 2);
                //console.log("formattedJson response", formattedJson);

                // console.log("raw rows 0- 0", response.result.rows[0].array[0]);
                //console.log("formattedJson - array", response.result.rows[0][0]);

                //use response method to retrieve data and then transform it and
                //build a chart with the data with the runChart function
                googleData2 = response.result.rows;
                transformGoogleData2();
                runChart2();
            })
            //GA data response - errors
            .then(function(err) {
                // Log any errors.
                console.log(err);
            });
        };

        function transformGoogleData2() {
            //iterate over data array to prepare data in charting format
            for (var i = 0; i < googleData.length-1; i++ ) {
                chartLabels2[i] = googleData2[i][0];
                chartData2[i] = googleData2[i][1];
            }
            console.log("chartLabels2:",chartLabels2);
            console.log("chartData2:",chartData2);
        };

        function runChart2(data) {
            console.log("runChart-go");
            //chartJS data input format
            //how to format data labels??
            var data = {
                // labels: ["January", "February", "March", "April", "May", "June", "July"],
                labels: chartLabels2,
                datasets: [
                    {
                        label: "My First dataset",
                        fillColor: "rgba(172,209,233,0.5)", //#ACD1E9
                        strokeColor: "rgba(220,220,220,0.8)",
                        highlightFill: "rgba(220,220,220,0.75)",
                        highlightStroke: "rgba(220,220,220,1)",
                        data: chartData2
                    }
                ]
            };
            // Get the context of the canvas element we want to select
            // push data into the Chart
            //there is an .update method if needed to update chart
            var ctx = document.getElementById("myChart2").getContext("2d");
            var myBarChart = new Chart(ctx).Bar(data);
        };

    }]); //end DashboardCtrl
