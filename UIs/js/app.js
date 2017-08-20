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
