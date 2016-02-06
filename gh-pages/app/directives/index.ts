import * as angular from 'angular';
import {progressBar} from './progress-bar-directive';
import {resizingContainer} from './resizing-container-directive';


const moduleName = 'chunkify.directives';


angular
  .module(moduleName, [])
  .directive('progressBar', progressBar)
  .directive('resizingContainer', resizingContainer);

export default moduleName;
