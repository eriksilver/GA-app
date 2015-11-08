angular.module('GA_Dashboard')
// app.config(['$logProvider', function($logProvider){
//     $logProvider.debugEnabled(true);
// }]);

.controller("DashboardCtrl", [
    "$scope", "$firebaseAuth", "$state","$log",
    function($scope, $firebaseAuth, $state, $log) {
        $log.log("DashboardCtrl ran");

        //SET page variables
        var rawData = {};
        var chartData = {
            chartLabels: [],
            chartValues: []
        };
        // var currentTimeFrame = "7daysago";

        var chartUsers = {};
        var chartBounces = {};
        var chartSessionDuration = {};
        var gaChartType = "";
        var setTimeFrame = "";

        var profileId = 4067996;

        $scope.chartType = "ga:users";
        //set default chartType
        var currentChartType = "$scope.chartType"; //$scope.chartType;

        //Handle View Chart Time Frame
        //set chartTimeFrame default value
        $scope.chartTimeFrame = "7daysAgo";
        //define global timeFrameStart variable
        var currentTimeFrame = "$scope.chartTimeFrame";


                ///Google Analytics API ready function - waits until API script loads
                function apiReadyWrapper() {
                    gapi.analytics.ready(function() {
                        $log.info("gapi.analytics.ready - run");
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
                            $log.log("auth call made");
                            console.log("auth response",response);
                            $log.info("gapi-auth: currentTimeFrame, currentChartType:",currentTimeFrame,currentChartType);

                            getRawData(currentTimeFrame,currentChartType);
                        });

                        gapi.analytics.auth.on('error', function(response) {
                            console.log("auth response-error",response);

                        });

                    });
                }

        //using $scope watch to see when the chartTimeFrame button is Updated
        //**issue I think with .foreach where it is iterating on the time frame name by
        //the amount of letters in the world, e.g. sixty = 5, thirty = 6
        $scope.$watch('chartTimeFrame', function (newVal, oldVal) {
            $log.info("scope watch-CharttimeFrame- passing vals:",newVal,oldVal);

            if (newVal !== oldVal) {
                $log.log("new val doesnt equal old val");
                currentTimeFrame = newVal;
                // apiReadyWrapper();
                // setTimeFrameStart(currentTimeFrame,currentChartType);
                getRawData(currentTimeFrame,currentChartType);

            }
            else {
                $log.log("use old/current val");
                currentTimeFrame = oldVal;
                apiReadyWrapper();
                // setTimeFrameStart(currentTimeFrame,currentChartType);
            }
        });

        $scope.$watch('chartType', function (newVal, oldVal) {
            $log.info("scope watch -chartType - passing vals:",newVal,oldVal);

            if (newVal !== oldVal) {
                $log.log("chartType - new val doesnt equal old val");
                currentChartType = newVal;

                getRawData(currentTimeFrame,currentChartType);

            }
            else {
                $log.log("chartType- use old/current val");
                currentChartType = oldVal;
                apiReadyWrapper();

            }
        });

        //Handle View Chart Type Frame
        //set chartType default value
        // $scope.chartType = "chartUsers";
        // //define global timeFrameStart variable
        // var currentChartType = "";
        // //set default chartType
        // currentChartType = $scope.chartType;

        //using $scope watch to see when the chartTimeFrame button is Updated
        //**issue I think with .foreach where it is iterating on the time frame name by
        //the amount of letters in the world, e.g. sixty = 5, thirty = 6
        // $scope.$watchCollection('chartType', function () {
        //     angular.forEach($scope.chartType, function (value, key) {
        //         if (value) {
        //             currentChartType = $scope.chartType;
        //             $log.log("scope-watch-currentChartType:",  currentChartType);
        //
        //             setChartType(currentChartType);
        //
        //         }
        //     });
        // });

        $log.info("check chartType:",currentChartType);
        $log.info("check timeFrame:",currentTimeFrame);


//         function setTimeFrameStart(currentTimeFrame,currentChartType) {
//             $log.info("setTimeFrameStart-fn-run:", currentTimeFrame);
// // debugger
//             // if (timeFrameStart == '7') {
//             //     setTimeFrame = timeFrameStart + "daysAgo";
//             // }
//             // switch(currentChartType) {
//                 // case 'chartUsers':
//                 // return 'ga:users';
//                 // case 'chartBounces':
//                 // return 'ga:bounces';
//                 // case 'chartSessionDuration':
//                 // return 'ga:avgsessionDuration';
//             // }
//             getRawData(currentTimeFrame,currentChartType);
//
//         };
//
//         function setChartType(currentChartType) {
//             $log.info("setChartType-fn-run:", currentChartType);
//
//             if (currentChartType == 'chartUsers') {
//                 gaChartType = 'ga:users';
//             }
//             // switch(currentChartType) {
//                 // case 'chartUsers':
//                 // return 'ga:users';
//                 // case 'chartBounces':
//                 // return 'ga:bounces';
//                 // case 'chartSessionDuration':
//                 // return 'ga:avgsessionDuration';
//             // }
//             getRawData(currentTimeFrame,gaChartType);
//
//         };

        // $log.info('gaChartType:',gaChartType);

        // debugger

        function getRawData(currentTimeFrame,currentChartType) {

            $log.info('fn-getRaw-gaChartType:',gaChartType);
            $log.info('fn-getRaw-profileId:',profileId);
            $log.info('fn-getRaw-currentChartType:',currentChartType);

                // debugger

            var apiQuery = gapi.client.analytics.data.ga.get({
                'ids': 'ga:' + profileId,
                'start-date': currentTimeFrame, //'2015-10-15',
                'end-date': 'today', //timeFrameEnd
                'metrics': currentChartType, //'''ga:users' gaChartType
                'dimensions': 'ga:date',
                'prettyPrint': 'true'
            });

            apiQuery.execute(handleCoreReportingResults);
// debugger

            function handleCoreReportingResults(results) {
                if (!results.error) {
                    // return handleCoreReportingResults(results);

                    //transformRawData(results);
                    console.log("results!!!!", results);

                    rawData = results;
                    transformRawData(rawData);

                } else {
                    console.log('There was an error: ' + results.message);
                    console.log('There was an error: ' + results);

                }
// debugger

            }
        };

    function transformRawData(rawData) {
        $log.info("transformData fn::rawData:", rawData);

        //iterate over data array to prepare data in charting format
        for (var i = 0; i < rawData.rows.length; i++ ) {
            // console.log('rawData.rows[i][0]:',rawData.rows[i][0]);
            // console.log('rawData.rows[i][1]:',rawData.rows[i][1]);
            chartData.chartLabels[i] = rawData.rows[i][0];
            chartData.chartValues[i] = rawData.rows[i][1];
            // console.log('chartData.chartLabels[i]:',chartData.chartLabels[i]);
            // console.log('chartData.chartValues[i]:',chartData.chartValues[i]);
        }

        //Add function to format data labels

        buildChart(chartData);

    };

    function buildChart(chartData) {
        console.log("runChart-go: data: ",chartData);
        // console.log("chartId - inside buildChart: ",chartId);

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
        var ctx = document.getElementById("barChart").getContext("2d");
        var myBarChart = new Chart(ctx).Bar(data);

        // var ctx = document.getElementById("myChart2").getContext("2d");
        // var myBarChart = new Chart(ctx).Bar(data);
    };

}]); //end DashboardCtrl
