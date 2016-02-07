import * as angular from 'angular';
import {experimentCode} from './experiment-code-filter';
import {experimentView} from './experiment-view-directive';


const moduleName = 'experiment-view';

angular
  .module(moduleName, [])
  .filter('experimentCode', experimentCode)
  .directive('experimentView', experimentView);


export default {moduleName};
