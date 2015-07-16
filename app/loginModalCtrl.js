// LoginModalCtrl.js

//Note The UsersApi is just a service that makes an ajax call to authenticate the user

app.controller('LoginModalCtrl', function ($scope, UsersApi) {

  this.cancel = $scope.$dismiss;

  this.submit = function (email, password) {
    UsersApi.login(email, password).then(function (user) {
      $scope.$close(user);
    });
  };

});
