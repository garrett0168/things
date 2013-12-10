'use strict';

var MapsMock = {
  LatLng: function() {

  },
  MapTypeId: {
    ROADMAP: 1
  },
  Map: function() {

  },
  event: {
    addListener: function() {

    }
  }
};

describe('Thing controllers', function() {
  var $scope = null;
  var $controller = null;
  var $httpBackend = null;

  beforeEach(function() {
    this.addMatchers({
      toEqualData: function(expect) {
        return angular.equals(expect, this.actual);
      }
    });
  });

  beforeEach(module('thingsApp'));
  beforeEach(module('thingsApp.controllers', function ($provide) {
    $provide.value('Maps', MapsMock);
  }));

  beforeEach(inject(function($rootScope, _$controller_, _$httpBackend_) {
    $scope = $rootScope.$new();
    $controller = _$controller_;
    $httpBackend = _$httpBackend_;
  }));

  describe('ThingsController', function() {
    it('will make sure you have valid input before it searches', function() {
      // Expect that the resource (or http) makes a request.
      var ctrl = $controller('ThingsController', {$scope: $scope});
      $scope.mapData.selectedPoint = null;
      $scope.distance = null;
      
      expect($scope.error).toBeNull();

      $scope.search();
    
      expect($scope.searching).toBe(false);
      expect($scope.error).not.toBeNull();
    });

    it('can search for some things', function() {
      // Expect that the resource (or http) makes a request.
      var things = [{id:1, name:'thing 1', location:'POINT(0.1 1.0)'}, {id:2, name:'thing 2', location:'POINT(0.2 0.5)'}];
      $httpBackend.expect('GET', '/things/search?distance=2000&latitude=0.75&longitude=0.1&page=1&per_page=10').respond({total: 2, things: things});
    
      var ctrl = $controller('ThingsController', {$scope: $scope});
    
      expect($scope.things).toEqual([]);
    
      $scope.mapData.selectedPoint = {longitude: "0.1", latitude: "0.75"};
      $scope.distance = "2000";

      // Before search
      expect($scope.searching).toBe(false);
      expect($scope.thingsSearched).toBe(false);
      $scope.search();

      expect($scope.searching).toBe(true);
      // Simulate server response.
      $httpBackend.flush();
    
      expect($scope.searching).toBe(false);
      expect($scope.thingsSearched).toBe(true);
      expect($scope.things).toEqualData(things);
      expect($scope.totalThings).toEqual(2);
    });

    it('can handle an empty result set', function() {
      // Expect that the resource (or http) makes a request.
      $httpBackend.expect('GET', '/things/search?distance=2000&latitude=0.75&longitude=0.1&page=1&per_page=10').respond({total: 0, things: []});
    
      var ctrl = $controller('ThingsController', {$scope: $scope});
    
      expect($scope.things).toEqual([]);
    
      $scope.mapData.selectedPoint = {longitude: "0.1", latitude: "0.75"};
      $scope.distance = "2000";

      // Before search
      expect($scope.searching).toBe(false);
      expect($scope.thingsSearched).toBe(false);
      $scope.search();

      expect($scope.searching).toBe(true);
      // Simulate server response.
      $httpBackend.flush();
    
      expect($scope.searching).toBe(false);
      expect($scope.thingsSearched).toBe(true);
      expect($scope.things).toEqualData([]);
      expect($scope.totalThings).toEqual(0);
    });

    it('can handle search failure', function() {
      // Expect that the resource (or http) makes a request.
      $httpBackend.expect('GET', '/things/search?distance=2000&latitude=0.75&longitude=0.1&page=1&per_page=10').respond(500, {message: "Server broke down"});
    
      var ctrl = $controller('ThingsController', {$scope: $scope});
    
      expect($scope.things).toEqual([]);
    
      $scope.mapData.selectedPoint = {longitude: "0.1", latitude: "0.75"};
      $scope.distance = "2000";

      // Before search
      expect($scope.searching).toBe(false);
      expect($scope.thingsSearched).toBe(false);
      $scope.search();

      expect($scope.searching).toBe(true);
      // Simulate server response.
      $httpBackend.flush();
    
      expect($scope.searching).toBe(false);
      expect($scope.thingsSearched).toBe(true);
      expect($scope.searchError).not.toBeNull();
      expect($scope.things).toEqual([]);
      expect($scope.totalThings).toEqual(0);
    });
  });
});
