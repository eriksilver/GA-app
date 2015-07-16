'use strict';

console.log("appjs before module declared");

var app = angular.module('GA_Dashboard', [
  'ui.router',
  'firebase',
  'ui.bootstrap'
]);

app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

});

//Modal auth
//As you can see, if the route requires a login and $rootScope.currentUser is not yet set,
//we will prevent the attempted state change and show the modal.
app.run(function ($rootScope) {

  $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
    var requireLogin = toState.data.requireLogin;

    if (requireLogin && typeof $rootScope.currentUser === 'undefined') {
      event.preventDefault();
      // get me a login modal!
      loginModal()
      .then(function () {
        return $state.go(toState.name, toParams); //implicily directs to the requested state
      })
      .catch(function () {
        return $state.go('welcome'); //back to welcome screen if dismissal happens
      });
    }
  });
});

// Need to address:
// how you to store or retrieve the
// currentUser between page refreshes.

// AngularJS makes intercepting incoming responses pretty easy with interceptors.
// Below we call the login modal when we receive a 401 response.
// we’ll assume that a 401 is the only precondition required to verify that a user is not logged in.
app.config(function ($httpProvider) {

  $httpProvider.interceptors.push(function ($timeout, $q, $injector) {
    var loginModal, $http, $state;

    // this trick must be done so that we don't receive
    // `Uncaught Error: [$injector:cdep] Circular dependency found`
    $timeout(function () {
      loginModal = $injector.get('loginModal');
      $http = $injector.get('$http');
      $state = $injector.get('$state');
    });

    return {
      responseError: function (rejection) {
        if (rejection.status !== 401) {
          return rejection;
        }

        var deferred = $q.defer();

        loginModal()
          .then(function () {
            deferred.resolve( $http(rejection.config) );
          })
          .catch(function () {
            $state.go('welcome');
            deferred.reject(rejection);
          });

        return deferred.promise;
      }
    };
  });
});
