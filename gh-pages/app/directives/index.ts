import * as ng from 'angular';


const moduleName = 'chunkify.directives';

export var appModule: IAppModule = {
  moduleName,

  ngModule: ng.module(moduleName, [])
};

export default appModule;
