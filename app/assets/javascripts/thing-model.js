angular.module('thingsApp.models').factory('Thing', ['$http', '$q', function ThingsController($http, $q) {
  var factory = function()
  {
    this.search = function(longitude, latitude, distance, currentPage, thingsPerPage)
    {
      var searchResult = $q.defer();
      var url = "/things/search";
      var params = {longitude: longitude, latitude: latitude, distance: distance, page: currentPage, per_page: thingsPerPage};
      $http({method: 'GET', url: url, params: params}).
        success(function(data, status, headers, config) 
        {
          searchResult.resolve(data);
        }).
        error(function(data, status, headers, config) 
        {
          searchResult.reject({data: data, status: status});
        });
      return searchResult.promise;
    }
  };

  return new factory();
}]);
