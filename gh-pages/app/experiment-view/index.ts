import * as angular from 'angular';
import {experimentCode} from './code-filter';
import {experimentView} from './view-directive';


const ngModuleName = 'experiment-view';

angular
  .module(ngModuleName, [])
  .filter('experimentCode', experimentCode)
  .directive('experimentView', experimentView);


export default {ngModuleName};
