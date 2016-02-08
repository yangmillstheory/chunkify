import * as angular from 'angular';
import {ExperimentCtrl} from './experiment-ctrl';
import {experimentOptions} from './options-directive';
import {ExperimentAction} from './action';


const ngModuleName = 'experiment';

angular
  .module(ngModuleName, [])
.controller('ExperimentCtrl', ExperimentCtrl)
.directive('experimentOptions', experimentOptions);

export var Action = ExperimentAction;
export default {ngModuleName};
