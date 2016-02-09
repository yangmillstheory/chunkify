import 'babel-polyfill';
import * as angular from 'angular';
import experiment from './experiment-state';
import experimentView from './experiment-view';
import common from '../common';


angular
  .module('chunkify', [
    common.ngModuleName,
    experiment.ngModuleName,
    experimentView.ngModuleName
  ]);
