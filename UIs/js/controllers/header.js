angular.module('app.controllers', []).controller('header', ['$scope', '$window', '$state', function($scope, $window, $state) {

  $('.ui.dropdown').dropdown();
  angular.extend($scope, {
    lg: function(){
      if($window.confirm('Do you want to logout?')){
        $scope.logout();
      }
    }
  })

}]);
