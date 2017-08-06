'use strict';

angular.module('core').controller('TeamDetailsController', ['$scope', 'Industries',
  function ($scope, Industries) {
    $scope.industries = Industries;
  }
]);