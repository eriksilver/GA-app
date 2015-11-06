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
        var rawData = {};
        var rawDataToTransform = {};
        var chartData = {
            chartLabels: [],
            chartValues: []
        };

        // chartData.chartLabels[i] = rawData.rows[i][0];
        // chartData.chartValues[i] = rawData.rows[i][1];
        // var chartDataLabels = [];
        // var chartData = [];

        var chartUsers = {};
        var chartBounces = {};

        var profileId = 4067996;
        var rawResults = {};
        var finalChartData = {};

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
                containerId: "chart-1",
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
                containerId: "chart-2",
                chartLabel: "User Activity",
                styles: { }
            },
            "chartSessionDuration": {
                gaConfig: {
                    'ids': 'ga:' + profileId,
                    'start-date': timeFrameStart, // //timeFrameStart
                    'end-date': 'today', //timeFrameEnd
                    'metrics': 'ga:avgsessionDuration',
                    'dimensions': 'ga:date',
                    'prettyPrint': 'true'
                },
                containerId: "chart-3",
                chartLabel: "User Activity",
                styles: { }
            }
        };
        $scope.dCharts = dashboardCharts;

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
                    $log.log("obj.containerId:",obj.containerId); //=chartUsers.gaConfig

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
            $log.log("chartConfigObject WITH ContID:",chartConfigObject.containerId); //=chartUsers.containerId


            // for (var prop in chartConfigObject) {
            //
            //     // $log.log("prop,ojb:",prop+","+obj);
            //     // important check that this is objects own property
            //     // not from prototype prop inherited
            //     if(obj.hasOwnProperty(prop)){
            //         // console.log("properties in object:",prop + " = " + obj[prop]);
            //     }
            // }

            //A chart is built in 3 steps:
            // 1) get raw data 2) transform to chart data 3) build chart
            // use promises to control steps and pass in needed data

            //example Promise Function
            delay().then(function(v) { // `delay` returns a promise
                console.log(v); // log the value once it is resolved
            }).catch(function(v) {
                // or do something else if it is rejected
                // (would not happen in this example, since `reject` is not called
            });

            // getRawData(chartConfigObject['gaConfig']);
            getRawData(chartConfigObject['gaConfig'],chartConfigObject['containerId'])
            .then(function passRawData(rawData){
                // rawDataToTransform = rawData;
                console.log("promise resolved: rawData:",rawData);

                // .then(function passChartData(finalChartData){
                //     console.log("promise2 resolved: finalchartData:",finalChartData);
                //
                //     buildChart(finalChartData,chartConfigObject['containerId']);

                //same way to call key
                $log.info("chartConfigObject['containerId']:",chartConfigObject['containerId']);
                $log.info("chartConfigObject.containerId:",chartConfigObject.containerId);

                //needs to go inside the promise, otherwise the fn gets called
                transformRawData(rawData,chartConfigObject.containerId);

            }).catch(function passRawData(rawData) {
                // or do something else if it is rejected
                console.log("getRawData catch:rawData",rawData);
            });

        }
    }
}

function delay() {
  // `delay` returns a promise
  return new Promise(function(resolve, reject) {
    // only `delay` is able to resolve or reject the promise
    setTimeout(function() {
      resolve(42); // after 3s, resolve the promise with value 42
    }, 3000);
  });
}

function getRawData(chartConfig) {

    return new Promise(function rawDataFetch(resolve,reject) {
        var apiQuery = gapi.client.analytics.data.ga.get(chartConfig);
        // var query = {};
        // apiQuery.execute(query);
        // var queryResults = query;
        // console.log("queryResults:",apiQuery);
        apiQuery.execute(handleCoreReportingResults);

        function handleCoreReportingResults(results) {
            if (!results.error) {
                //call data transformation, passing in Results
                // rawData = results;
                resolve(results);
                // return handleCoreReportingResults(results);
                // Success. Do something cool!
                //transformGoogleData(results);
                console.log("promise results!!!!", results);

            } else {
                alert('There was an error: ' + results.message);
            }
        }


    });
};

function transformRawData(rawData, chartId) {
    $log.info("transform function pre-results::", rawData);
    //
    // var chartData = {
    //     chartValues: [],
    //     chartLabels: []
    // }
    //iterate over data array to prepare data in charting format
    for (var i = 0; i < rawData.rows.length; i++ ) {
        // console.log('rawData.rows[i][0]:',rawData.rows[i][0]);
        // console.log('rawData.rows[i][1]:',rawData.rows[i][1]);
        chartData.chartLabels[i] = rawData.rows[i][0];
        chartData.chartValues[i] = rawData.rows[i][1];
        console.log('chartData.chartLabels[i]:',chartData.chartLabels[i]);
        console.log('chartData.chartValues[i]:',chartData.chartValues[i]);
    }

    //Add function to format data labels


    //stuck here --not getting data into chartData....
    // console.log("chartdata still in promise:", chartData);
    // console.log("chartdata.chartValues still in promise:", chartData.chartValues);
    // console.log("chartdata.chartLabels still in promise:", chartData.chartLabels);

    //chart 1 data is correct, but not building the chart

    buildChart(chartData,chartId);

};

        function buildChart(chartData,chartId) {
            console.log("runChart-go: data: ",chartData);
            console.log("chartId: ",chartId);

            //chartJS data input format
            //how to format data labels??
            var data = {
                // labels: ["January", "February", "March", "April", "May", "June", "July"],
                labels: chartData.chartLabels,
                datasets: [
                    {
                        label: "Placeholder",
                        fillColor: "rgba(172,209,233,0.5)", //#ACD1E9
                        strokeColor: "rgba(220,220,220,0.8)",
                        highlightFill: "rgba(220,220,220,0.75)",
                        highlightStroke: "rgba(220,220,220,1)",
                        data: chartData.chartValues
                    }
                ]
            };
            // Get the context of the canvas element we want to select
            // push data into the Chart
            //there is an .update method if needed to update chart
            var ctx = document.getElementById(chartId).getContext("2d");
            var myBarChart = new Chart(ctx).Bar(data);

            // var ctx = document.getElementById("myChart2").getContext("2d");
            // var myBarChart = new Chart(ctx).Bar(data);
        };

    }]); //end DashboardCtrl
