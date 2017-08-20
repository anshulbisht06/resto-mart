angular.module('app.directives').directive('jsgrid', [ 'utils', function(utils, $timeout){
    return {
        restrict: 'E',
        replace: true,
        scope: '=',
        bindToController: true,
        link: function(scope, el, attrs) {

            scope.$watchCollection("viewGrid.data", function(newVal, oldVal) {
               if(newVal.length !== 0){
                   el.jsGrid({
                       width: "100%",
                       height: "auto",
                       // controller: {
                       //     loadData: $.noop,
                       //     insertItem: $.noop,
                       //     updateItem: $.noop,
                       //     deleteItem: $.noop
                       // },
                       filtering: attrs.pageSize || true,
                       editing: attrs.editing || true,
                       sorting: attrs.sorting || true,
                       paging: attrs.paging || true,
                       pageSize: attrs.pageSize || 15,
                       data: scope.viewGrid.data,
                       fields: scope.viewGrid.fields,
                       noDataContent: "Not found",
                       confirmDeleting: true,
                       deleteConfirm: function(v){
                           // console.log(v);
                           return "Do you really want to delete "+ scope.tl + " (" + v[scope.tk] + ") ?";
                       },
                       updateOnResize: true
                   });
               }
            });
        }
    }
}]);
