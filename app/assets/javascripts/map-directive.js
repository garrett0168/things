angular.module('thingsApp.directives').directive('googleMap', ['Maps', function(Maps) {
  return {
    restrict: 'E',
    template: '<div class="map-view" id="google-map"></div>',
    scope: 
    {
      center: '=',
      markers: '=',
      selectedPoint: '=',
      zoom: '='
    },
    link: function (scope, element, attrs) {
      var mapObj = null;
      var initialMarker = null;
      var mapsInitialized = false;

      var initializeMap = function()
      {
        var center = new Maps.LatLng(scope.center.latitude, scope.center.longitude);
        var mapOptions = {
          zoom: scope.zoom,
          center: center,
          mapTypeId: Maps.MapTypeId.ROADMAP,
        };
        mapObj = new Maps.Map(document.getElementById("google-map"), mapOptions);

        Maps.event.addListener(mapObj, 'click', function(event) {
          if(!initialMarker)
          {
            initialMarker = new Maps.Marker({
              position: event.latLng,
              map: mapObj
            });
            initialMarker.setMap(mapObj);
          }
          else
          {
            initialMarker.setPosition(event.latLng);
          }
          mapObj.setCenter(event.latLng);
          scope.selectedPoint = {latitude: event.latLng.lat(), longitude: event.latLng.lng()};
        });

        mapsInitialized = true;
      };

      renderMarkers = function()
      {
        if(mapsInitialized && scope.markers.length > 0)
        {
          var fullBounds = new Maps.LatLngBounds();
          for(var m in scope.markers)
          {
            var marker = scope.markers[m];
            fullBounds.extend(marker.position);

            marker.setMap(mapObj);
          }
          mapObj.fitBounds(fullBounds);
        }
      }

      scope.$watch('center', function(newCenter, oldCenter) {
        if(!mapsInitialized && newCenter)
        {
          initializeMap();
        }
      });

      scope.$watch('markers', function(newMarkers) {
        renderMarkers();
      });
    }
  };
}]);
