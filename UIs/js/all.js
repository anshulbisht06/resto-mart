/** Copyright 2017 Vigilant: Compliance Simplified, Inc. */
var interceptor = function($window, $q, $cookies) {
  return {
    request: function(config) {
      var t = $cookies.get('access_token');
      if (t) {
        config.headers.authorization = t.toString();
      } else {
        //console.log('Please login first');
      }
      return config;
    },
    requestError: function(config) {
      return config;
    },

    response: function(res) {
      return res;
    },
    responseError: function(res) {
      // console.log('responseError', res)
      return $q.reject(res);
    }
  }
};

angular
.module('app', [
  'ui.router',
  'ui.router.state.events',
  'ngResource',
  'app.env',
  'app.services',
  'app.directives',
  'app.controllers',
  'ngCookies',
  'vcRecaptcha',
  // 'frapontillo.bootstrap-switch'
])
.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', '$sceDelegateProvider',function($stateProvider,
  $urlRouterProvider, $locationProvider, $httpProvider, $sceDelegateProvider) {
    //$qProvider.errorOnUnhandledRejections(false);
    // push interceptor to app's httpProvider to intercept each request made.
    $httpProvider.interceptors.push(interceptor);
    jsGrid.validators.empty = {
      message: "Empty value not allowed.",
      validator: function(value, item) {
        return value.replace(/\s/g, '').length !== 0;
      }
    };
    jsGrid.validators.noUndefinedOrNull = {
      message: "Empty value not allowed.",
      validator: function(value, item) {
        // console.log(value, item, 'noUndefinedOrNull');
        return value !== null && value !== undefined;
      }
    };
    // $sceDelegateProvider.resourceUrlWhitelist([
    //     'http://www.refsnesdata.no/**'
    // ]);
    $stateProvider
    .state('admin', {
      url: "/admin",
      views: {
        "content": {
          'templateUrl': "views/Admin/index.html"
        },
        "header": {
          'templateUrl': "views/no-header.html"
        },
        "footer": {
          'templateUrl': "views/no-footer.html"
        }
      }
    })
    .state('freshfoods-dashboard', {
      url: "/freshfoods/dashboard",
      views: {
        "content": {
          'templateUrl': "views/FreshFood/dashboard.html"
        },
        "header": {
          'templateUrl': "views/header.html"
        },
        "footer": {
          'templateUrl': "views/footer.html"
        }
      }
    })
    .state('rmart-dashboard', {
      url: "/rmart/dashboard",
      views: {
        "content": {
          'templateUrl': "views/RMart/dashboard.html"
        },
        "header": {
          'templateUrl': "views/header.html"
        },
        "footer": {
          'templateUrl': "views/footer.html"
        }
      }
    })
    .state('freshfoods-view-all', {
      url: "/freshfoods/view/all/:v",
      views: {
        "content": {
          'templateUrl': "views/FreshFood/viewAll.html"
        },
        "header": {
          'templateUrl': "views/header.html"
        },
        "footer": {
          'templateUrl': "views/footer.html"
        }
      }
    })
    .state("otherwise", {
      url: '*path',
      views: {
        "mainContent": {
          'templateUrl': "views/404.html"
        },
        "header": {
          'templateUrl': "views/header.html"
        },
        "footer": {
          'templateUrl': "views/footer.html"
        }
      }
    });
    $urlRouterProvider.otherwise('/');
  }])
  .run(['$rootScope', '$state', '$window', '$cookies', 'utils', function($rootScope, $state, $window, $cookies, utils) {

    var exemptedUrls = [ 'logout' ];
    angular.extend($rootScope, {
      app: 'rmart',
      logout: function(){
        // $window.sessionStorage.clear();
        $cookies.remove('access_token');
        $state.go('admin');
      },
      changeApp: function(app){
        $rootScope.app = app;
      },
      fillUp: function(token){
        var decoded = utils.parseJwt($cookies.get('access_token'));
        $rootScope.app = decoded.app;
        $rootScope.email = decoded.email;
        $rootScope.role = decoded.role;
        return decoded;
      }
    });

    $rootScope.$on('$stateChangeStart', function(event, next, toParams, from, fromParams ) {
      if (exemptedUrls.indexOf(next.name) === -1) {
        var token = $cookies.get('access_token');
        if (next.name === 'admin' && next.url === '/admin') {
          if (token !== undefined) {
            $rootScope.fillUp(utils.parseJwt(token));
            event.preventDefault();
            $state.go($rootScope.app + '-dashboard');
          }
        } else {
          if (token === undefined) {
            event.preventDefault();
            $rootScope.logout();
          } else {
            $rootScope.fillUp(utils.parseJwt(token));
          }
        }
      }

    });


  }]);
"use strict";

 angular.module('app.env', [])

.constant('ENV', {NAME:'development',API_URL:'//localhost:3000/v1/',UI_URL:'//localhost:7000/',VERSION:'1.0.0'})

;angular.module('app.directives',[]).directive('appsDropdown', function($timeout){
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
angular.module('app.services', []).service('requests', ['$resource', 'ENV', function($resource, ENV) {

  this.postOrPut = function(url, method, params, isArray) {
    return $resource(ENV.API_URL + url, params, {
      save: {
        method: method || 'POST',
        isArray: isArray || false
      }
    }, {
      stripTrailingSlashes: false
    });
  }

  this.getAll = function(url, params, isArray) {
    return $resource(ENV.API_URL + url, params, {
      query: {
        method: 'GET',
        isArray: isArray || false,
      }
    }, {
      stripTrailingSlashes: false
    });
  }

  this.delete = function(url, params) {
    return $resource(ENV.API_URL + url, params, {
      delete: {
        method: 'DELETE'
      }
    }, {
      stripTrailingSlashes: false
    });
  }

  // this.postOrPutWithFile = function(url, params, method, data){
  //   return Upload.upload({
  //     url: ENV.API_URL + url,
  //     params: params,
  //     method: method || 'POST',
  //     data: data,
  //     // resumeChunkSize: '5MB',
  //   })
  // }

}]);
angular.module('app.services').service('utils', function() {

  this.parseJwt = function(t) {
    try{
      var base64Url = t.split('.')[1];
      var base64 = base64Url.replace('-', '+').replace('_', '/');
      return this.parseJSON(window.atob(base64));
    }catch(error){
      console.log('parseJwt error ', error)
      return false;
    }
  },

  this.capitalize = function(v){
    if(typeof v === "string"){
      v = v[0].toUpperCase()+v.slice(1);
    }
    return v;
  },

  this.parseJSON = function(v, r){
    try{
      return JSON.parse(v);
    }catch(e){
      return r || [];
    }
  },

  this.date = function(d, format, keepAsMoment){
    try{
      if(keepAsMoment){
        d = moment(d, format || 'DD-MM-YYYY hh:mm:ss a');
      }else{
        d = moment(d).format(format || 'DD-MM-YYYY hh:mm:ss a');
      }
      return d;
    }catch(e){
      return 'NA';
    }
  },

  this.areDatesEqual = function(d, d1, format){
    try{
      d = moment(d, format);
      d1 = moment(d1, format);
      if (d > d1) return 1;
      else if (d < d1) return -1;
      else return 0;
    }catch(e){
      return 'NA';
    }
  },

  this.foodGridHTML= function(l, view){
    var t;
    if(view){
      t = '<div class="ui labels">', c = {
        'Full': 'black',
        'Half': 'brown',
        'Quarter': 'white'
      };
      for(var i = 0 ; i < l.length; i++){
        t += '<a class="ui label ' + c[l[i].quantity] + '">'+l[i].cost+'</a>';
      }
      t += '<div>';
    }else{
      t = '<tr class="jsgrid-row">' +
      '<td class="jsgrid-cell" style="width: 20%;">'+l.name+'</td>' +
      '<td class="jsgrid-cell" style="width: 5%;"><div class="row text-center"><i class="circle icon center '+ (l.isVeg ? 'green': 'red') +'"></i></div></td>' +
      '<td class="jsgrid-cell jsgrid-align-center" style="width: 7%;">' + l.cuisine + '</td>' +
      '<td class="jsgrid-cell jsgrid-align-center" style="width: 8%;">' + l.status + '</td>' +
      '<td class="jsgrid-cell jsgrid-align-center" style="width: 20%;">' + l.foodCategory + '</td>' +
      '<td class="jsgrid-cell" style="width: 16%;">' + this.foodGridHTML(l.foodCostForFoodItem, true) + '</td>' +
      '<td class="jsgrid-cell" style="width: 10%;">' + this.date(l.createdAt) + '</td>' +
      '<td class="jsgrid-cell" style="width: 10%;">' + this.date(l.updatedAt) + '</td>' +
      '<td class="jsgrid-cell jsgrid-control-field jsgrid-align-center" style="width: 9%;"><input class="jsgrid-button jsgrid-edit-button" type="button" title="Edit"><input class="jsgrid-button jsgrid-delete-button" type="button" title="Delete"></td>' +
      '</tr>';
    }
    return t;
  }

});
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
angular.module('app.controllers').controller('ffDashboard', ['$scope', 'requests', '$state', 'utils', function($scope, requests, $state, utils) {


  var l1 = ['isClosed', 'discountForAll', 'discountForItem', 'discountForCategory'];
  angular.extend($scope, {
    config: {
      closedDate: utils.date(new Date(), 'DD/MM/YYYY'),
      closedTimeFrom: '',
      closedTimeTo: '',
      for: $scope.app,
      discountForAll: false,
      isClosed: false,
      discountForItem: false,
      discountForCategory: false,
      done: false
    },
    discount: {
      rate: 0.0
    },
    submitForm: function(ty){
      var m, t = 'error';
      if(ty === 0){
        requests.postOrPut('freshmartconfig/', 'PUT', {
          id: $scope.config.id
        }, true).save($scope.config).$promise.then(function(r) {
          m = 'Cannot save the settings!';
          if(r.length === 1){
            m = 'Settings saved!';
            t = 'success';
            $scope.config.done = true;
          }
          $.notify(m, t);

        }).catch(function(r){
          console.log(r, 'ssssssssssssss');
          alert('Server error!');
        })

      }else if(ty === 1){
        if($scope.config.discountForAll){
          if($scope.discount !== undefined){
            m = 'Cannot set the discount';
            requests.postOrPut('fooddiscount/', 'PUT', {
              id: $scope.discount.id
            }, true).save({
              rate: $scope.discount
            }).$promise.then(function(r){
              if(r.length === 1){
                m = 'Discount saved on all foods.';
                t = 'success';
              }
              $.notify(m, t);
            }).catch(function(r){
              console.log(r, 'ssss111111111ssssssssss');
              alert('Server error!');
            })
          }
        }
      }

    }
  });

  // $timeout(function(){
  //   $scope.exitMsg = false
  // }, 3000);

  requests.getAll($scope.app+"/food/stats/", null).query().$promise.then(function(r) {
        if (r.success) {
          $scope.stats = r.data;
          // console.log('$scope.stats', $scope.stats);
        }
      });


      requests.getAll("fooddiscount", {
        foodItemId: null,
        foodCategoryId: null
      }, true).query().$promise.then(function(r) {
        r = angular.copy(r);
        if(r.length !== 0){
          r[0] = parseFloat(r[0].rate);
          $scope.discount = r[0];
        }
        });


      requests.getAll("freshmartconfig/", {
        for: $scope.app
      }, true).query().$promise.then(function(r) {
            r = angular.copy(r);
            if(r.length !== 0){
              r = r[0];
              var t, l = ['closedDate', 'closedTimeFrom', 'closedTimeTo'];
              for(var i = 0; i < l.length; i++){
                r[l[i]] = r[l[i]].trim();
                if(r[l[i]] === "Invalid date" || r[l[i]].length === 0){
                  r[l[i]] = '';
                }
                else{
                  if(i === 0){
                    var t1 = utils.date(new Date(), 'DD/MM/YYYY');
                    if(r[l[i]] !== t1){
                      r[l[i]] = t1;
                      $scope.config.done = false;
                    }else{
                      $scope.config.done = true;
                    }
                  }else{
                    r[l[i]] = new Date(r[l[i]]);
                  }
                  // r[l[i]] = new Date(r[l[i]]);
                }
              }
              for(var i = 0; i < l1.length; i++){
                $('#'+l1[i]).prop('checked', r[l1[i]]);
              }
              $scope.config = angular.merge({}, $scope.config, r);
            }

          });

          $('#discountForAll1').checkbox({
            onChange: function() {
              $scope.config.discountForAll = !$scope.config.discountForAll;
              $scope.$apply();
            }
          });
          $('#discountForItem1').checkbox({
            onChange: function() {
              $scope.config.discountForItem = !$scope.config.discountForItem;
              $scope.$apply();
            }
          });
          $('#discountForCategory1').checkbox({
            onChange: function() {
              $scope.config.discountForCategory = !$scope.config.discountForCategory;
              $scope.$apply();
            }
          });
          $('#isClosed1').checkbox({
            onChange: function() {
              $scope.config.isClosed = !$scope.config.isClosed;
              $scope.$apply();
            }
          });

}]);
angular.module('app.controllers').controller('ffView', ['$scope', 'requests', '$state', '$stateParams', 'utils', function($scope, requests, $state, $stateParams, utils) {


  var v = $stateParams.v, tempFCObj = {}, tObj;
  $scope.v = (v === '0' ? 'fooditem': 'foodcategory');
  $scope.t = utils.capitalize($scope.v.slice(0, 4)) + ' ' + utils.capitalize($scope.v.slice(4));

  angular.extend($scope, {
    error: false,
    viewGrid: {
      data: [],
      fields: [],
      controller: {}
    },
    editRowRenderer: false,
    tl: $scope.t.toLowerCase()
  });


  $scope.add = function(f){
    // console.log(f, '1111111');
    requests.postOrPut($scope.v+'/create/').save(f).$promise.then(function(r) {
      if(r.success){
        getAllFoodGridValues();
        $('div.ui.popup').popup('hide all');
      }
      $.notify(r.data.message, r.type);
    });
  }


  function getAllFoodGridValues(){
    requests.getAll($scope.v, null, true).query().$promise.then(function(r) {
      r = angular.copy(r);
      // console.log(r, 'ffff');
      $scope.viewGrid.data = [];
      $scope.viewGrid.data = $scope.viewGrid.data.concat(r);
    });
  }

  function loadData(v){
    if(['0', '1'].indexOf(v) !== -1){
      tObj = {
        name: '',
        isVeg: false,
        cuisine: '',
        status: '',
        foodCategoryId: 0,
        quantity: {}
      },
      fields = [
        {
          name: "name", title: "Food Item", type: "text", width: '20%', validate: "empty", filtering: true, width: '20%', editing: false
        },
        {
          name: "isVeg", type: "checkbox", title: "Is Veg?", sorting: false, width: '5%', editing: false, filtering: true,
          itemTemplate: function(v) {
            return '<div class="row text-center"><i class="circle icon center ' + (v ? 'green': 'red') + '"></i></div>';
          },
        },
      ], tk = 'name', w = '10%', controller = {
        loadData: function(filter){
          return $.grep($scope.viewGrid.data, function(item) {
            // console.log('filter', filter);
            // console.log('item', item);
            var check = true;
            if(filter.name !== undefined && filter.name.trim().length !== 0){
              var filterName = filter.name.toLowerCase().trim(), itemName = item.name.toLowerCase().trim();
              check = (filterName.indexOf(itemName) !== -1  || itemName.indexOf(filterName) !== -1);
            }
            if(filter.isVeg !== undefined){
              check = (filter.isVeg === item.isVeg);
            }
            if(filter.cuisine !== undefined && filter.cuisine.trim().length !== 0){
              check = item.cuisine.toLowerCase().trim().startsWith(filter.cuisine.toLowerCase().trim());
            }
            if(filter.status !== undefined && filter.status.trim().length !== 0){
              check = item.status.toLowerCase().trim().startsWith(filter.status.toLowerCase().trim());
            }
            if(filter.foodCategoryId !== undefined && filter.foodCategoryId.trim().length !== 0){
              check = (tempFCObj[item.foodCategoryId] === filter.foodCategoryId.toLowerCase().trim());
            }
            // console.log(tempFCObj, 'tempFCObj');
            // if(foodConfigs.cuisines[filter.cuisine] !== undefined){
            //   check = check || (foodConfigs.cuisines[filter.cuisine] === item.cuisine);
            // }
            return check;
          });
        },
        updateItem: function(v){
          // console.log(v, 'updateItem');
          requests.postOrPut($scope.v+'/update/', 'PUT').save(v).$promise.then(function(r) {
            $.notify(r.data.message, r.type);
          });
        },
        editItem: function(v){
          // console.log(v, 'editItem');
        },
        deleteItem: function(v){
          // console.log(v, 'deleteItem');
          requests.delete($scope.v+'/'+v.id).delete().$promise.then(function(r) {
            $.notify($scope.t + ' ('+v.category+') Deleted.', 'success');
          });
        }
      }
      if(v === '1'){
        controller = {
          updateItem: function(v){
            requests.postOrPut($scope.v+'/'+v.id, 'PUT').save(v).$promise.then(function(r) {
              $.notify($scope.t + ' ('+v.category+') Updated.', 'success');
            });
          },
          deleteItem: function(v){
            requests.delete($scope.v+'/'+v.id).delete().$promise.then(function(r) {
              $.notify($scope.t + ' ('+v.category+') Deleted.', 'success');
            });
          },
          loadData: function(filter) {
            return $.grep($scope.viewGrid.data, function(item) {
              // do filtering
              var check;
              if((filter.category !== undefined || filter.category.length !== 0)&& filter.foodItemsForFoodCategory === undefined){
                check = (filter.category.toLowerCase() === item.category.toLowerCase());
              }
              else if((filter.category === undefined || filter.category.length === 0) && filter.foodItemsForFoodCategory !== undefined){
                check = (item.foodItemsForFoodCategory.length === filter.foodItemsForFoodCategory);
              }
              else{
                check = (filter.category.toLowerCase() === item.category.toLowerCase()) && (item.foodItemsForFoodCategory.length === filter.foodItemsForFoodCategory);
              }

              return check;

            });
          }
        }
        w = '12.5%';
        tk = 'category';
        tObj = {
          category: '',
          error: ''
        };
        fields = [{
          name: "category", title: "Food Category", type: "text", width: '35%', validate: "empty", filtering: true
        },{
          title: "Total food(s) inside", name: "foodItemsForFoodCategory", type: "number", width: '10%', editing: false, filtering: true,
          itemTemplate: function(v) {
            return v.length;
          }
        },{
          name: "createdAt", title: "Created On", type: "text", width: w, editing: false, filtering: false,
          itemTemplate: function(v) {
            return utils.date(v);
          }
        },{
          name: "updatedAt", title: "Updated On",type: "text", width: w, editing: false, filtering: false,
          itemTemplate: function(v) {
            return utils.date(v);
          }
        },{
          type: 'control'
        }];
        $scope.viewGrid.fields = angular.copy(fields);
      }else if(v === '0'){

        $scope.editRowRenderer = function(item, idx){
          var grid = this, foodConfigs = $scope.foodConfigs, allCategories = $scope.allCategories;
          var name = $("<input>").attr("type", "text").attr("name", "name").val(item.name),
              isVeg = $("<input>").attr("type", "checkbox").attr("name", "isVeg"),
              cuisine = $("<select>").attr("name", "cuisine"),
              status = $("<select>").attr("name", "status"),
              foodCategory = $("<select>").attr("name", "foodCategory"),
              quantities = {};

            for(var i = 0; i < foodConfigs.cuisines.length; i++){
              if(foodConfigs.cuisines[i].length !== 0){
                cuisine.append('<option value="'+foodConfigs.cuisines[i]+'">'+foodConfigs.cuisines[i]+'</option>');
              }
            }
            for(var i = 0; i < foodConfigs.statuses.length; i++){
              if(foodConfigs.statuses[i].length !== 0){
                status.append('<option value="'+foodConfigs.statuses[i]+'">'+foodConfigs.statuses[i]+'</option>');
              }
            }
            for(var i = 0; i < foodConfigs.quantities.length; i++){
              if(foodConfigs.quantities[i].length !== 0){
                quantities[foodConfigs.quantities[i]] = $("<input>").attr("type", "number").attr('min', '0').attr('step', '1').attr('placeholder', foodConfigs.quantities[i] + ' cost').attr("name", foodConfigs.quantities[i]);
              }
            }
            for(var i = 0; i < item.foodCostForFoodItem.length; i++){
              quantities[item.foodCostForFoodItem[i].quantity].val(item.foodCostForFoodItem[i].cost);
            }
            for(var i = 0; i < allCategories.length; i++){
              if(allCategories[i] !== ''){
                foodCategory.append('<option value="'+allCategories[i].id+'">'+allCategories[i].category+'</option>');
              }
            }
            if(item.isVeg){
              isVeg = isVeg.attr('checked', 'checked');
            }else{
              isVeg = isVeg.removeAttr('checked');
            }

            var $updateButton = $("<input>").attr("type", "button").addClass("jsgrid-button jsgrid-update-button"),
                $cancelButton = $("<input>").attr("type", "button").addClass("jsgrid-button jsgrid-cancel-button"),
                  t = Object.keys(quantities),
                  t1 = $("<td class='jsgrid-cell text-center' width='16%;'>"),
                  t3 = "<td class='jsgrid-cell ";

            for(var i = 0; i < t.length; i++){
              t1.append(quantities[t[i]]);
            }

            cuisine.val(item.cuisine);
            status.val(item.status);
            foodCategory.val(item.foodCategoryId.toString());

						$updateButton.on("click", function() {
              r1 = { name: name.val(),
                isVeg: isVeg.is(':checked'),
                cuisine: cuisine.find(":selected").text(),
                status: status.find(":selected").text(),
                foodCategoryId: foodCategory.find(":selected").val() };
              var t2;

              item.foodCostForFoodItem = [];

              for(var i = 0; i < t.length; i++){
                t2 = parseInt(quantities[t[i]].val());
                if(!isNaN(t2) && t2 > 0){
                  item.foodCostForFoodItem.push({
                    cost: t2,
                    quantity: t[i]
                  });
                }
              }
              if(r1.name !== undefined && r1.name.length !== 0){
                grid.updateItem(item, r1);
              }
            });

						$cancelButton.on("click", function() {
            	grid.cancelEdit();
            });

            var r = $("<tr class='jsgrid-edit-row'>")
              .append($(t3+"' width='20%;'>").append(name))
              .append($(t3+"text-center' width='5%;'>").append(isVeg))
              .append($(t3+"text-center' width='10%;'>").append(cuisine))
              .append($(t3+"text-center' width='11%;'>").append(status))
              .append($(t3+"text-center' width='14%;'>").append(foodCategory));

              return r.append(t1)
              .append($(t3+"text-center' width='10%;'>").append('&nbsp;'))
              .append($(t3+"text-center' width='10%;'>").append('&nbsp;'))
              .append($(t3+"jsgrid-control-field jsgrid-align-center' style='width: 9%;'>").append($updateButton).append($cancelButton));

        };

        requests.getAll('fooditem/config/', {
          include: 'foodcategory'
        }, false).query().$promise.then(function(r) {
          if(r.success){

            r.data.cuisines.splice(0,0,'');
            r.data.statuses.splice(0,0,'');
            r.data.quantities.splice(0,0,'');
            r.data.foodCategories.splice(0,0,'');
            // console.log('ddd', r);

            $scope.foodConfigs = {
              statuses: r.data.statuses,
              cuisines: r.data.cuisines,
              quantities: r.data.quantities,
            };

            $scope.allCategories = r.data.foodCategories;
            for(var i = 0; i < $scope.allCategories.length; i++){
              tempFCObj[$scope.allCategories[i].id] = $scope.allCategories[i].category;
            }

            fields = fields.concat([{
              name: "cuisine",
              title: "Cuisine",
              type: "text",
              // items: r.data.cuisines,
              width: '10%',
              validate: "empty",
              filtering: true,
              itemTemplate: function(v) {
                return v;
              }
            },{
              name: "status",
              title: "Status",
              type: "text",
              // items: r.data.statuses,
              validate: "empty",
              width: '11%',
              filtering: true,
              itemTemplate: function(v) {
                return v;
              },
            },{
              name: "foodCategoryId",
              title: "Food Category",
              type: "select",
              items: $scope.allCategories,
              validate: "noUndefinedOrNull",
              width: '14%',
              editing: false,
              valueField: "category",
              textField: "category",
              filtering: true,
              itemTemplate: function(v) {
                return tempFCObj[v];
              },
            //   filterValue: function() {
            //     return 'ddd'
            // }
          },
          {
            name: "foodCostForFoodItem",
            title: 'Food Cost',
            editing: false,
            width: '16%',
            itemTemplate:  function(v){
              return utils.foodGridHTML(v, true);
            }
          },
          {
              name: "createdAt", title: "Created On", type: "text", width: w, editing: false, filtering: false,
              itemTemplate: function(v) {
                return utils.date(v);
              }
            },{
              name: "updatedAt", title: "Updated On",type: "text", width: w, editing: false, filtering: false,
              itemTemplate: function(v) {
                return utils.date(v);
              }
            },{
              type: 'control',
              width: '9%'
            }]);
            $scope.viewGrid.fields = angular.copy(fields);
            for(var i = 0; i < r.data.quantities.length; i++){
              $scope.create.quantity[r.data.quantities[i]] = 0.0;
            }
          }else{
            $.notify(r.data.message, r.type);
          }
        });


        $scope.openFoodItemModal = function(el){
          $(el).modal("setting", {
            closable: false,
            onApprove: function () {
              // console.log('approve', $scope.create);
              $scope.add($scope.create);
              return true;
            },
            onHide: function () {
              // console.log('cancel', tObj);
              $scope.create = angular.copy(tObj);
              $scope.$apply();
              return true;
            },
            onShow: function(){
              $('select.dropdown').dropdown();
              $('.ui.checkbox').checkbox({
                onChange: function() {
                  $scope.create.isVeg = !$scope.create.isVeg;
                }
              });
              // return true;
            }
          }).modal('toggle');
        }
      }


      $scope.create = angular.copy(tObj);
      $scope.tk = tk;
      $scope.viewGrid.controller = controller;
    }else{
      $state.go('404');
    }

    getAllFoodGridValues();
  }

  loadData(v);
}]);
angular.module('app.controllers').controller('rmDashboard', ['$scope', 'requests', '$state', 'utils', function($scope, requests, $state, utils) {

  angular.extend($scope, {
  });

}]);
