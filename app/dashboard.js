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

    // //test using Google Embed API to generate a Chart
    // function runChart() {
    //     $log.info("runChart ran");
    //     var chart = new gapi.analytics.googleCharts.DataChart({
    //         query: {
    //             ids: 'ga:4067996', //Profile ID
    //             metrics: 'ga:sessions',
    //             dimensions: 'ga:date'
    //         },
    //         chart: {
    //             type: 'LINE',
    //             container: 'line-chart',
    //             options: {
    //                 title: 'Sessions over the past week.',
    //                 fontSize: 12
    //             }
    //         }
    //     });
    //     chart.on('success', function(response) {
    //         console.log("chart response", response);
    //         // response.chart; // the Google Chart instance.
    //         // response.data : the Google Chart data object.
    //     });
    //
    //     chart.execute();
    // }

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
}]); //end DashboardCtrl
