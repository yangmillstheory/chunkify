import * as angular from 'angular';
import {ExperimentCtrl} from './experiment-ctrl';
import {ExperimentAction} from './action';


const ngModuleName = 'experiment';

angular
  .module(ngModuleName, [])
.controller('ExperimentCtrl', ExperimentCtrl);

export var Action = ExperimentAction;
export default {ngModuleName};
