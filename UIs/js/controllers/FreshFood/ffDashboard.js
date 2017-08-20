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
