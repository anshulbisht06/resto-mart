angular.module('app.directives').directive('popup', ['utils', function(utils){
  return {
    restrict: 'A',
    link: function(scope, el, attrs) {
      var v = utils.parseJSON(attrs.popup, {});
      console.log(v);
      el.popup({
        on: v.mode || 'click',
        position: 'bottom center',
        // target: v.target || el,
        transition: v.transition || 'fade',
        // inline: v.inline || false
      });
    }
  }
}]);
