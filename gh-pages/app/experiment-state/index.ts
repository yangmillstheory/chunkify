import * as angular from 'angular';
import {ExperimentCtrl} from './experiment-controller';
import {experimentOptions} from './experiment-options-directive.ts';


const ngModuleName = 'experiment';

angular
  .module(ngModuleName, [])
.controller('ExperimentCtrl', ExperimentCtrl)
.directive('experimentOptions', experimentOptions);

export default {ngModuleName};
