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
