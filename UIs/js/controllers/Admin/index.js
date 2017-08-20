angular.module('app.controllers').controller('adminIndex', ['$scope', 'requests', '$cookies', '$state', function($scope, requests, $cookies, $state) {

angular.extend($scope, {
  l: {
    email: '',
    password: '',
    recaptcha: ''
  },

  login: function(d, app){
      // login api called
    d.app = app;
    requests.postOrPut("admin/login/").save(d).$promise.then(function(r) {
          if (r.success) {
            $cookies.putObject('access_token', r.data.token, {
                expires: new Date(new Date().getTime() + r.data.settings.expires * 1000)
              });
            $state.go(app + '-dashboard');
          }
          $.notify(r.data.message, r.type);
        });
  },

  setWidgetId: function(widgetId){
    $scope.l.recaptcha = widgetId;
  },

  setResponse: function(response){
    // console.log(response);
  },

  cbExpiration: function(){
    $scope.l.recaptcha = '';
  }

});

}]);
