import * as angular from 'angular';
import {titlecase} from './title-case-filter';
import {progressBar} from './progress-bar-directive';
import {resizingContainer} from './resizing-container-directive';
import {wisp} from './wisp-directive';


export const ngModuleName = 'common';

angular
  .module(ngModuleName, [])
.filter('titlecase', titlecase)
.directive('progressBar', progressBar)
.directive('wisp', wisp)
.directive('resizingContainer', resizingContainer);

export default {ngModuleName};
