import 'babel-polyfill';
import * as angular from 'angular';
import directives from './directives';
import filters from './filters';
import common from '../common';


angular
  .module('chunkify', [
    common,
    filters
  ]);
