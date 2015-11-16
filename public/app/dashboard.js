angular.module('GA_Dashboard')
// app.config(['$logProvider', function($logProvider){
//     $logProvider.debugEnabled(true);
// }]);

.controller("DashboardCtrl", [
    "$scope", "$firebaseAuth", "$state","$log",
    function($scope, $firebaseAuth, $state, $log) {
        $log.log("DashboardCtrl ran");

        //SET page variables
        var chartData = {
            chartLabels: [],
            chartValues: []
        };

        //set chartType default value for view
        $scope.chartType = "users";
        //currentChartType value equals value from the view
        var currentChartType = 'ga:'+ $scope.chartType; //$scope.chartType;

        //set chartTimeFrame default value for view
        $scope.chartTimeFrame = "7daysAgo";
        //currentTimeFrame value equals value from the view
        var currentTimeFrame = "$scope.chartTimeFrame";


        apiReadyWrapper();
        
        //manually set ga account profile
        // var profileId = ga:4067996;
        var profileId = "";
        function viewSelectorWrapper() {
            var viewSelector = new gapi.analytics.ViewSelector({
                container: 'view-selector'
            });
            $log.log("gapi viewSelector run");

            viewSelector.execute();

            viewSelector.on('change', function(ids) {
                var newIds = {
                    query: {
                        ids: ids
                    }
                }
                profileId = viewSelector.ids;
                $log.info("profileID from viewSelector", viewSelector.ids);

                getRawData(currentTimeFrame,currentChartType);
            });
        };


        //set chartJS global defaults
        Chart.defaults.global.responsive = true;

        ///Google Analytics API ready function - waits until API script loads
        function apiReadyWrapper() {
            gapi.analytics.ready(function() {
                $log.log("gapi.analytics.ready - run");

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
                    $log.info("auth response",response);
                    $log.info("gapi-auth: currentTimeFrame, currentChartType:",currentTimeFrame,currentChartType);
                    viewSelectorWrapper();
                });

                gapi.analytics.auth.on('error', function(response) {
                    $log.info("auth response-error",response);

                });

            });
        }

        //using $scope watch to see when the chartTimeFrame button is updated
        $scope.$watch('chartTimeFrame', function (newVal, oldVal) {
            $log.info("scope watch-CharttimeFrame- passing vals:",newVal,oldVal);

            //if chartTimeFrame has been updated
            if (newVal !== oldVal) {
                $log.log("new val doesnt equal old val");
                currentTimeFrame = newVal;
                // apiReadyWrapper();
                // setTimeFrameStart(currentTimeFrame,currentChartType);
                getRawData(currentTimeFrame,currentChartType);

            }
            //if chartTimeFrame has NOT been updated
            else {
                $log.log("use old/current val");
                currentTimeFrame = oldVal;
                getRawData(currentTimeFrame,currentChartType);

                // apiReadyWrapper();
                // setTimeFrameStart(currentTimeFrame,currentChartType);
            }
        });

        //using $scope watch to see when the chartType button is updated
        $scope.$watch('chartType', function (newVal, oldVal) {
            $log.info("scope watch -chartType - passing vals:",newVal,oldVal);

            if (newVal !== oldVal) {
                $log.log("chartType - new val doesnt equal old val");

                currentChartType = 'ga:' + newVal;
                getRawData(currentTimeFrame,currentChartType);

            }
            else {
                $log.log("chartType- use old/current val");

                currentChartType = 'ga:' + oldVal;
                getRawData(currentTimeFrame,currentChartType);
            }
        });

        function getRawData(currentTimeFrame,currentChartType) {

            //log data to make sure getting passed in correctly
            $log.info('fn-getRaw-currentTimeFrame:',currentTimeFrame);
            $log.info('fn-getRaw-currentChartType:',currentChartType);
            $log.info('fn-getRaw-profileId:',profileId);

            var apiQuery = gapi.client.analytics.data.ga.get({
                'ids': profileId,
                'start-date': currentTimeFrame, //'2015-10-15',
                'end-date': 'yesterday',
                'metrics': currentChartType,
                'dimensions': 'ga:date',
                'prettyPrint': 'false'
            });

            apiQuery.execute(handleCoreReportingResults);

            function handleCoreReportingResults(results) {
                if (!results.error) {
                    $log.info("api call results:", results);

                    transformRawData(results);

                } else {
                    console.log('There was an error: ' + results.message);
                }

            }
        };

        function transformRawData(rawData) {
            $log.info("data check - transformRawData:rawData:", rawData);

            var filteredChartLabels= [];
            //iterate over data array to prepare data in charting format
            for (var i = 0; i < rawData.rows.length; i++ ) {

                //angular filter doesn't work because the date YYYYMMDD is not a recoginzed format
                // chartData.chartLabels[i] = $filter('date')(rawData.rows[i][0], 'MMM dd');

                chartData.chartLabels[i] = moment(rawData.rows[i][0],"YYYYMMDD").format('dd MMM D');
                chartData.chartValues[i] = rawData.rows[i][1];

            }
            $log.info("chartData",chartData);
            buildChart(chartData);

        };

        function buildChart(chartData) {
            $log.info("runChart-go: data: ",chartData);

            var data = {
                labels: chartData.chartLabels, //format: ["January", "February", "March", "April", "May", "June", "July"],
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
            var ctx = document.getElementById("barChart").getContext("2d");
            var myBarChart = new Chart(ctx).Bar(data);
        };

    }]); //end DashboardCtrl
