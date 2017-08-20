angular.module('app.directives',[]).directive('appsDropdown', function($timeout){
    return {
        restrict: 'E',
        template: '<div id="apps-dropdown" class="ui floating dropdown labeled selection icon button"><i class="world icon"></i><span class="text">{{app === \'rmart\'? \'RMart\':\'Fresh Foods\'}}</span><div class="menu"><div class="item">RMart</div><div class="item">Fresh Foods</div></div></div>',
        scope: '=',
        replace: true,
        link: function(scope, el, attrs) {
            el.dropdown({
                onChange: function (val) {
                    scope.app = val.replace(' ', '');
                    scope.$apply();
                }
            });
          }
        }
      });
