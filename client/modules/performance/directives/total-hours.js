'use strict';

angular.module('performance').directive('totalHours', function() {
  return {
    restrict: 'E',
    scope: {
      id: '=',
      month: '=',
      year: '='
    },
    controller: ['$scope','$rootScope','$reactive','Attendances','$meteor', 'Month',
      function ($scope, $rootScope, $reactive, Attendances, $meteor, Month){

      $reactive(this).attach($scope);
      this.subscribe('attendances', () => {
        return [ $rootScope.getReactively('currentUser.currentTeam') ];
      });


      $scope.convertMonth = () =>{
        var data = {},
          month = Month.indexOf($scope.month),
          year = $scope.year;


          data.slated = new Date(year, month, 1);
          data.due =  new Date(year, month + 1, 1);
          return data;
      }

      $scope.date = () =>{
        var id = $scope.getReactively('id'),
          date = $scope.convertMonth ();

        $meteor
        .call('attendances.totalHours','vendor',id,date.slated,date.due)
        .then((res) => {
          $scope.totalHours=res[0].totalHours;
        }, (err) => {
          console.log(err);
        });
      }

    }],
    templateUrl: '/client/modules/performance/directives/total-hours.html'
  };
});
