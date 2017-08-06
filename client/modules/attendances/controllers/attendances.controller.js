'use strict';

angular.module('attendances').controller('AttendancesController', ['$scope', '$rootScope', '$reactive', '$meteor', '$state', '$mdDialog',
  function ($scope, $rootScope, $reactive, $meteor, $state, $mdDialog) {
    ////////////////////
    // INITIAL VALUES //
    ////////////////////

    $reactive(this).attach($scope);
    this.subscribe('attendances', function (){
      return [ $rootScope.getReactively('currentUser.currentTeam') ];
    });

    $scope.display = {};
    $scope.filter = {};


    ////////////////////
    // FORM FUNCTIONS //
    ////////////////////
    $scope.resetForm = function () {
      $scope.attendance = {};
      $scope.display.edit = true;
    };

    //====FILTERING===//
    $scope.resetFilter = function () {
      var d=new Date(),
        year = d.getFullYear(),
        month = d.getMonth(),
        lastDate = new Date(year,month+1,0).getDate();

      $scope.filter = {
        slated : new Date(year,month,1),
        due : new Date(year,month,lastDate),
        limit : 20,
        page : 1
      };
    };

    $scope.filtering = function () {
      var query = {};

      if(!$scope.getReactively('filter.role'))
        query.employee = {$exists:true};

      if($scope.getReactively('filter.role'))
        query.visitor = {$exists:true};

      query.in={};
      if($scope.getReactively('filter.slated'))
        query.in.$gte = $scope.getReactively('filter.slated');

      if($scope.getReactively('filter.due'))
        query.in.$lte = $scope.getReactively('filter.due');

      if($scope.getReactively('filter.employee'))
        query.employee = $scope.getReactively('filter.employee');

      if($scope.getReactively('filter.visitor'))
        query.visitor = $scope.getReactively('filter.visitor');

      if($scope.getReactively('filter.status'))
        query.status = $scope.filter.status;

      return query;
    };

    ///////////////////
    // STANDARD CRUD //
    ///////////////////
    $scope.find = function () {
      $scope.resetFilter();
      delete $scope.id;
      $scope.display.edit = false;
    };

  }
]);
