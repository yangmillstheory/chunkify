import * as ng from 'angular';
import directives from './directives';
import filters from './filters';


const moduleName = 'chunkify';

export var appModule: IAppModule = {
  moduleName,

  ngModule: ng.module(moduleName, [
    directives.moduleName,
    filters.moduleName
  ]),
};

export default appModule;
