import * as angular from 'angular';
import {} from './experiment-ctrl';
import {ExperimentAction} from './action';

const ngModuleName = 'experiment';


angular
  .module(ngModuleName, []);


export var Action = ExperimentAction;

export default {ngModuleName};
