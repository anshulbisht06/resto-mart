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
