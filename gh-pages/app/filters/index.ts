import * as ng from 'angular';


const moduleName = 'chunkify.filters';

export var appModule: IAppModule = {
  moduleName,

  ngModule: ng.module(moduleName, [])
};

export default appModule;
