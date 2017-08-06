'use strict';

// library sources
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import ngSanitize from 'angular-sanitize';
import ngMaterial from 'angular-material';
import uiRouter from 'angular-ui-router';
import mdDataTable from 'angular-material-data-table';
import dndLists from 'angular-drag-and-drop-lists';
import ngclipboard from 'ngclipboard';

// configuration sources
import config from './config';
import theme from './theme';
import init from './init';

// add application name here
export const name = 'vauth';

// add dependancies here
var dependencies = [
  angularMeteor,
  ngSanitize,
  ngMaterial,
  uiRouter,
  mdDataTable,
  'dndLists',
  ngclipboard
];

// add application submodules here
var modules = [
  'core',
  'auth',
  'account',
  'commisionings',
  'approvals',
  'teams',
  'timesheets',
  'finance',
  'employees',
  'roles',
  'identity',
  'licenses',
  'attendances',
  'violations',
  'invitation',
  'vendors',
  'jobtitle',
  'visitors',
  'assets',
  'performance',
  'inspections',
  'hazards',
  'audits',
  'investigations'
];

angular.module(name, dependencies)
  .config(config)
  .config(theme)
  .run(init);

for(var x in modules){
  angular.module(modules[x], dependencies || []);
  angular.module(name).requires.push(modules[x]);
}
