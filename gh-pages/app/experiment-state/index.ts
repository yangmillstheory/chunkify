import * as angular from 'angular';
import {ExperimentCtrl} from './experiment-controller';
import {experimentOptions} from './experiment-options-directive.ts';
import {ExperimentAction} from './experiment-action';


const ngModuleName = 'experiment';

angular
  .module(ngModuleName, [])
.controller('ExperimentCtrl', ExperimentCtrl)
.directive('experimentOptions', experimentOptions);

export var Action = ExperimentAction;
export default {ngModuleName};
