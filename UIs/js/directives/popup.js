angular.module('app.directives').directive('popup', ['utils', function(utils){
  return {
    restrict: 'A',
    link: function(scope, el, attrs) {
      var v = utils.parseJSON(attrs.popup, {});
      el.popup({
        on: v.mode || 'click',
        position: 'bottom center',
        transition: v.transition || 'fade'
      });
    }
  }
}]);
