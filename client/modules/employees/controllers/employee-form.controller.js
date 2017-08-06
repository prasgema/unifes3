'use strict';

angular.module('employees').controller('EmployeeFormController', ['$scope', '$rootScope', '$reactive', '$meteor', '$state', '$mdDialog', 'Employees', 'EmployeeMultistepform',
  function ($scope,$rootScope, $reactive, $meteor, $state, $mdDialog,  Employees, EmployeeMultistepform) {
    $reactive(this).attach($scope);
    this.subscribe('allUsers');

    $scope.steps = EmployeeMultistepform.steps;
    $scope.display.id = $state.params.id;

    $scope.$watch('employee.user', function (){
      if($scope.employee && !$scope.employee.name)
        $scope.employee.name = $scope.display.user.profile.name;
    });

    $scope.helpers({
      employee : () => {
        return Employees.findOne($scope.getReactively('display.id'));
      },
    });

    $scope.create = () => {
      $meteor
        .call('employees.insert', $scope.employee)
        .then((res) => {
          $state.go('employee.update');
        }, (err) => {
          $scope.display.error = err;
          console.log(err);
        });
    };

    $scope.update = function (employee) {
      $meteor
        .call('employees.update', $scope.display.id, employee)
        .then((res) => {
          $scope.next();
        }, (err) => {
          $state.go('employees.list');
        });
    };

    $scope.next = () => {
      var current = $state.current.name,
        next = EmployeeMultistepform.next(current);
      
      if(!next) $state.go('employees.list');
        
      $state.go(next, { id: $scope.display.id });
    };
  }
]);
