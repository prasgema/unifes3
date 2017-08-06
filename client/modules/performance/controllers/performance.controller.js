'use strict';

angular.module('performance').controller('performanceController', ['$scope', '$rootScope', '$reactive', 'Employees', 'Vendors','Month','$meteor','$state',
function ($scope, $rootScope, $reactive, Employees, Vendors, Month, $meteor, $state) {

    //////////////////
    // SUBSCRIBING //
    /////////////////

    $reactive(this).attach($scope);

    this.subscribe('employees', () => {
      return [ $rootScope.getReactively('currentUser.currentTeam') ];
    });

    this.subscribe('vendors',  () => {
      return [ $rootScope.getReactively('currentUser.currentTeam') ];
    });

    /////////////////////
    // INITIAL VALUES //
    ///////////////////

    $scope.filter = {};
    $scope.display = {};
    $scope.select = {};

    $scope.select.months = Month;
    $scope.select.years = ()=>{
      var d = new Date(),
        date = d.getFullYear(),
        data = [];
      for(var i=date;i>=2017;i-- ) {
        data.push(i);
      }
      return data;
    }

    ////////////////
    // FILTERING //
    //////////////

    $scope.convertMonth = (month) =>{
      var data = {},
        month = Month.indexOf(month),
        year = $scope.getReactively('filter.year');

        data.slated = new Date(year, month, 1);
        data.due =  new Date(year, month + 1, 1);
        return data;
    }

    $scope.resetFilter = () => {
      var d = new Date(),
        year = d.getFullYear(),
        month = d.getMonth();

      $scope.filter = {
        month : Month[month],
        year : year,
        limit : 20,
        page : 1
      };
    };

    ////////////////////////////////////////
    // FILTERING FOR REPORT ALL EMPLOYEES //
    ///////////////////////////////////////

    $scope.employeesFiltering = function () {
      var queryEmployees = {};

      if($scope.getReactively('filter.name'))
        queryEmployees.name = $scope.getReactively('filter.name');

       var date = $scope.convertMonth($scope.getReactively('filter.month'));
       queryEmployees.slated = date.slated;
       queryEmployees.due = date.due;

      return queryEmployees;
    };

    ////////////////////////////////////////
    // FILTERING FOR REPORT ALL EMPLOYEES //
    ///////////////////////////////////////

    $scope.vendorsFiltering = function () {
      var queryVendors = {};

      if($scope.getReactively('filter.q'))
        queryVendors.name = new RegExp($scope.filter.q,"i");

      return queryVendors;
    };

    $scope.absence = (q) =>{
      $meteor
        .call('attendances.absence', q)
        .then((res) => {
          $scope.employees=res;
        }, (err) => {
          console.log(err);
        });
    }

    ///////////////////
    // Display Data //
    ///////////////////

    $scope.helpers({
      employees : () => {
        var queryEmployees = $scope.employeesFiltering();
        $scope.absence(queryEmployees);
        // var queryEmployees = $scope.employeesFiltering();
        //
        // return Employees.find(queryEmployees,{
        //   fields: {name:1},
        //   limit : $scope.getReactively('filter.limit'),
        //   skip : $scope.getReactively('filter.limit') * ($scope.getReactively('filter.page')-1)
        // });
      },
      employeesCount: () => {
        var queryEmployees = $scope.employeesFiltering();
        return Employees.find(queryEmployees).count();
      },
      vendors : () => {
        var queryVendors = $scope.vendorsFiltering();

        return Vendors.find(queryVendors,{
          fields: {legalName:1},
          limit : $scope.getReactively('filter.limit'),
          skip : $scope.getReactively('filter.limit') * ($scope.getReactively('filter.page')-1)
        });
      },
      vendorsCount: () => {
        var queryVendors = $scope.vendorsFiltering();
        return Vendors.find(queryVendors).count();
      }
    });

    $scope.find = () => {
      $scope.display.employee = null;
      $scope.resetFilter();
      $scope.role = true;
    };

    ////////////////////////////////
    // CONTEXT-SPECIFIC FUNCTIONS //
    ////////////////////////////////

    $scope.displayDate = () =>{
        var month = Month.indexOf($scope.getReactively('filter.month')),
          year = $scope.getReactively('filter.year'),
          firstDate = new Date (year,month,1),
          lastDate = new Date(year,month,new Date(year,month+1,0).getDate()),
          days = [];

        for (var d = firstDate; d <= lastDate; d.setDate(d.getDate() + 1)) {
            days.push(new Date(d));
        }
        $scope.days = days;
    };

    $scope.notYetDate= (due)=>{
      var date = new Date()
      if(due.getTime()>date.getTime())
        return false;

      return true;
    }

    $scope.changeRole = () =>{
      if(!$scope.getReactively('filter.role')){
        $scope.role=true;
      }
      else{
        $scope.role=false;
      }
    }

    $scope.map = (date) =>{
      return date.map(function(x) {
        return x.getDate();
      })

    }

    $scope.findOne = function () {
      $scope.display.employee = $state.params.id;
    };


  }
]);
