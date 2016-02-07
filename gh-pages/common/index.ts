import * as angular from 'angular';
import {titlecase} from './title-case-filter';
import {progressBar} from './progress-bar-directive';
import {resizingContainer} from './resizing-container-directive';


const ngModuleName = 'common';

angular
  .module(ngModuleName)
  .filter('titlecase', titlecase)
  .directive('progressBar', progressBar)
  .directive('resizingContainer', resizingContainer);

export default {ngModuleName};
