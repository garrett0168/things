'use strict';

angular.module('thingsApp.controllers', []);
angular.module('thingsApp.models', []);
angular.module('thingsApp.directives', []);
var thingsApp = angular.module('thingsApp', ['ui.bootstrap', 'thingsApp.controllers', 'thingsApp.models', 'thingsApp.directives']);
thingsApp.config(['$httpProvider', function($httpProvider) {
  $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
}]);

