'use strict';

angular.module('core').controller('UserTeamsController', ['$scope', '$rootScope', '$reactive', '$window', '$meteor', 'Teams', 'Employees',
  function ($scope, $rootScope, $reactive, $window, $meteor, Teams, Employees) {
    ////////////////////
    // INITIAL VALUES //
    ////////////////////

    $reactive(this).attach($scope);
    this.subscribe('employments');

    ///////////////////
    // STANDARD CRUD //
    ///////////////////

    $scope.helpers({
      employments: () => {
        return Employees.find({ user: $rootScope.getReactively('currentUser._id') });
      }
    });

    $rootScope.helpers({
      currentEmployee: () => {
        return Employees.findOne({
          team: $rootScope.getReactively('currentUser.currentTeam'),
          user: $rootScope.getReactively('currentUser._id')
        });
      },
      currentTeam: () => {
        return Teams.findOne($rootScope.getReactively('currentUser.currentTeam'));
      }
    });

    ////////////////////////////////
    // CONTEXT-SPECIFIC FUNCTIONS //
    ////////////////////////////////

    $scope.changeTeam = function (teamId) {
      console.log(teamId);
      $meteor.call('selectTeam', teamId);
    };
  }
]);
