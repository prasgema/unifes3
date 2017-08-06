'use strict';

angular.module('audits').controller('AuditsController', ['$scope', '$rootScope', '$reactive', '$meteor', '$state', '$mdDialog', 'Audits',
  function ($scope, $rootScope, $reactive, $meteor, $state, $mdDialog,  Audits) {
    ////////////////////
    // INITIAL VALUES //
    ////////////////////

    $reactive(this).attach($scope);
    this.subscribe('audits', () => {
      return [ $rootScope.getReactively('currentUser.currentTeam') ];
    });

    $scope.permission = false;
    $scope.audit = {};
    $scope.display = {};
    $scope.filter = {};

    ////////////////////
    // FORM FUNCTIONS //
    ////////////////////
    $scope.resetForm = () => {
      $scope.audit = {};
      $scope.display.edit = true;
    };

    $scope.auditType = false;

    $scope.requestE = (id, audits) => {
        var reqE = $mdDialog.confirm()
          .title('REQUESTING PERMISSION')
          .textContent('Do you want to request to edit ' + audits.inspected + ' information?')
          .ok('Request')
          .cancel('Cancel');

          $mdDialog.show(reqE).then( () => {
            //Buat sementara
            $scope.permissionE = true;
          });
    };

    $scope.requestP = (id) => {
      var reqP = $mdDialog.confirm()
        .title('REQUESTING PERMISSION')
        .textContent('Do you want to request permission to see Inspection Data?')
        .ok('Request')
        .cancel('Cancel');

        $mdDialog.show(reqP).then( () => {
          //Buat sementara
          $scope.permissionP = true;
        });
    };
    ////////////////////////////
    // SWITCH FILTER FUNCTION //
    ///////////////////////////

    $scope.changeType = (auditType) => {
      if(auditType) {
        $scope.auditType = true;
        $scope.auditTypeText = "Inspection";
      }
      else {
        $scope.auditType = false;
        $scope.auditTypeText = "Observation";
      }
    }
    ///////////////////
    // STANDARD CRUD //
    ///////////////////

    $scope.filtering = () => {
      var query = {
        status:{ $ne : 'x' }
      };

      $scope.resetFilter = () => {
        var d=new Date();
        var year = d.getFullYear();
        var month = d.getMonth();
        var lastDate = new Date(year,month+1,0).getDate();

      $scope.filter = {
        slated : new Date(year,month,1),
        due : new Date(year,month,lastDate),
        limit : 20,
        page : 1
        };
      };

      query.slated = {};

      if($scope.getReactively('filter.slated'))
        query.slated.$gte = $scope.getReactively('filter.slated');

      if($scope.getReactively('filter.due'))
        query.slated.$lte = $scope.getReactively('filter.due');

      if($scope.getReactively('filter.inspected'))
        query.inspected = new RegExp($scope.filter.inspected,"i");

      if($scope.getReactively('filter.findings'))
        query.findings.finding = $scope.filter.findings;

      if($scope.getReactively('filter.status'))
        query.status = $scope.filter.status;

      return query;
    };

    $scope.helpers({
      audits : () => {
        var query = $scope.filtering();

        return Audits.find(query, {
          limit: $scope.getReactively('filter.limit'),
          skip: $scope.getReactively('filter.limit') * ($scope.getReactively('filter.page')-1)
        });
      },
      auditCount : () => {
        var query = $scope.filtering();

        return Audits.find(query).count();
      },
      audit : () => {
        return Audits.findOne($scope.getReactively('display.id'));
      }
    });

    $scope.find = () => {
      delete $scope.id;
      $scope.resetFilter();
      $scope.display.edit = false;
    };

    $scope.findOne = () => {
      $scope.display.id = $state.params.id;
    };

    $scope.resetForm = () => {
      $scope.audit = {};
      $scope.display.edit = true;
    };

    $scope.create = (audit) => {
      $meteor.call('audits.insert', audit)
        .then((res) => {
          $state.go('audits.list');
        }, (err) => {

        });
    };

    $scope.update = (audit) => {
      $meteor.call('audits.update', $scope.display.id, audit)
        .then((res) => {
          $state.go('audits.list');
        }, (err) => {

        });
    };

    $scope.delete = (audit) => {
      var confirm = $mdDialog.confirm()
        .title('Delete Audit Data')
        .textContent('Are you sure you want to delete ' + audit.inspected + '?')
        .ok('Yes')
        .cancel('No');
      $mdDialog.show(confirm).then( () => {

        $meteor.call('audits.remove', audit._id, (res) => {
        });
      });
    };

  }
]);
