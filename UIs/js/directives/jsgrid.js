angular.module('app.directives').directive('jsgrid', [ 'utils', function(utils, $timeout){
    return {
        restrict: 'E',
        replace: true,
        scope: '=',
        bindToController: true,
        link: function(scope, el, attrs) {
            scope.$watchCollection("viewGrid.data", function(newVal, oldVal) {
               if(newVal.length !== 0){
                   var p = {
                       width: "100%",
                       height: "auto",
                       controller: scope.viewGrid.controller,
                       filtering: true,
                       editing: utils.parseJSON(attrs.editing, false) || true,
                       sorting: utils.parseJSON(attrs.sorting, false) || true,
                       paging: utils.parseJSON(attrs.paging, false) || true,
                       pageSize: utils.parseJSON(attrs.pageSize, false) || 15,
                       data: scope.viewGrid.data || [],
                       fields: scope.viewGrid.fields || [],
                       noDataContent: "Not found",
                       confirmDeleting: true,
                       deleteConfirm: function(v){
                           // console.log(v);
                           return "Do you really want to delete "+ scope.tl + " (" + v[scope.tk] + ") ?";
                       },
                       updateOnResize: true
                   };
                   if(scope.editRowRenderer){
                       p.editRowRenderer = scope.editRowRenderer;
                   }
                   el.jsGrid(p);
               }
            });
        }
    }
}]);
