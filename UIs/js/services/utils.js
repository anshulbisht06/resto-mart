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
