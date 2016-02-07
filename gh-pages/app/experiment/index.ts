import * as angular from 'angular';
import {ExperimentCtrl} from './experiment-ctrl';


const ngModuleName = 'experiment';

angular
  .module(ngModuleName, [])
.controller('ExperimentCtrl', ExperimentCtrl);


export default {ngModuleName};
