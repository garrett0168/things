angular.module('thingsApp.controllers').controller('ThingsController', ['$scope', 'Thing', 'Maps', function ThingsController($scope, Thing, Maps) {
  $scope.longitude = null;
  $scope.latitude = null;
  $scope.distance = null;
  $scope.searching = false;
  $scope.things = [];
  $scope.thingsSearched = false;
  $scope.searchError = null;
  $scope.error = null;

  $scope.totalThings = 0;
  $scope.currentPage = 1;
  $scope.thingsPerPage = 10;

  var POINT_REGEX = /\((-?[\d\.]+) (-?[\d\.]+)\)/;

  $scope.mapData = 
  {
    selectedPoint: null,
    defaultCenter:
    {
      latitude: -25.363882,
      longitude: 131.044922
    },
    center: null,
    markers: [],
    zoom: 7
  };

  $scope.search = function()
  {
    if(!$scope.mapData.selectedPoint || !$scope.distance)
    {
      $scope.error = "Please fill in all the fields!";
      return;
    }
    $scope.searching = true;
    clearThings();
    var result = Thing.search($scope.mapData.selectedPoint.longitude, $scope.mapData.selectedPoint.latitude, $scope.distance, $scope.currentPage, $scope.thingsPerPage);
    result.then(handleSearchSuccess, handleFailure).finally(searchComplete);
  };

  $scope.searchAgain = function()
  {
    $scope.error = null;
    $scope.thingsSearched = false;
    $scope.searchError = null;
    resetPagination();
  };

  function handleFailure(response)
  {
    $scope.things = [];
    $scope.searchError = response.data.message;
  };

  function handleSearchSuccess(response)
  {
    $scope.things = response.things;
    $scope.totalThings = response.total;
  };

  function searchComplete()
  {
    $scope.error = null;
    $scope.searching = false;
    $scope.thingsSearched = true;
    setupMarkers();
  }

  function resetPagination()
  {
     $scope.totalThings = 0;
     $scope.currentPage = 1;
     $scope.thingsPerPage = 10;
  };

  $scope.$watch('currentPage', function(newVal, oldVal) {
    if(newVal != oldVal && $scope.thingsSearched)
    {
      $scope.search();
    }
  });

  $scope.geolocationAvailable = navigator.geolocation ? true : false;
  function onCreate()
  {
    if($scope.geolocationAvailable) 
    {
      navigator.geolocation.getCurrentPosition(function(position) {
        $scope.$apply(function() {
          $scope.mapData.center = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };	
        });
      }, function() { });
    }
    else
    {
      $scope.$apply(function() {
        $scope.mapData.center = $scope.mapData.defaultCenter;
      });
    }
  };

  function clearThings()
  {
    for(var m in $scope.mapData.markers)
    {
      $scope.mapData.markers[m].setMap(null);
    }
    $scope.mapData.markers = [];
  }

  function setupMarkers()
  {
    var newMarkerSet = [];
    var image = "/assets/bunny.png";
    for(var t in $scope.things)
    {
      var thing = $scope.things[t];
      var matches = POINT_REGEX.exec(thing.location);
      
      var googleLatlng = new Maps.LatLng(matches[2],matches[1]);
      
      var marker = new Maps.Marker({
        position: googleLatlng,
        icon: image
      });

      newMarkerSet.push(marker);
    }
    $scope.mapData.markers = newMarkerSet;
  }

  onCreate();
}]);
