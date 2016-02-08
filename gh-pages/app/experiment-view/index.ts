import * as angular from 'angular';
import {experimentCode} from './experiment-code-filter';
import {experimentView} from './experiment-view-directive';


const ngModuleName = 'experiment-view';

angular
  .module(ngModuleName, [])
.filter('experimentCode', experimentCode)
.directive('experimentView', experimentView);


export default {ngModuleName, foo: 'foo'};
