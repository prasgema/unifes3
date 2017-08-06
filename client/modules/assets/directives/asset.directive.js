'use strict';

angular.module('assets').directive('asset', function() {
  return {
    restrict: 'E',
    scope: {
      id: '='
    },
    controller: ['$scope', '$rootScope', '$reactive', 'Assets', function ($scope, $rootScope, $reactive, Assets){
      $reactive(this).attach($scope);
      this.subscribe('assets', () => {
        return [ $rootScope.getReactively('currentUser.currentTeam') ];
      });

      $scope.helpers({
        asset : () => {
          return Assets.findOne($scope.getReactively('id'));
        },
      });
    }],
    templateUrl: '/client/modules/assets/directives/asset.directive.html'
  };
});
