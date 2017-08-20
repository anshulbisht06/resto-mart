// angular.module('app.directives').directive('toaster', function($timeout){
//     return {
//         restrict: 'E',
//         template: "<div class='ui icon message'><i class='notched circle loading icon'></i><div class='content'><div class='header'>Just one second</div><p>We're fetching that content for you.</p></div></div>",
//         scope: '=',
//         replace: true,
//         link: function(scope, el, attrs) {
//             console.log(attrs);
//             el.transition({
//                 animation  : attrs.effect1 || 'jiggle',
//                 duration   : '3s',
//                 onComplete : function() {
//                     // alert('done');
//                 }
//             });
//         }
//     }
// });
