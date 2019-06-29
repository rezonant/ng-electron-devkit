import { BuilderContext, createBuilder } from "@angular-devkit/architect";
import { executeBrowserBuilder, BrowserBuilderOutput, BrowserBuilderOptions } from "@angular-devkit/build-angular";
import { json } from '@angular-devkit/core';
import { Observable } from "rxjs";
import { electronConfig } from '../electron-webpack-config';
import { ElectronBrowserBuilderSchema, ElectronConfiguration } from "./schema";

const webpackMerge = require('webpack-merge');

export type ElectronBrowserSchema = BrowserBuilderOptions & ElectronBrowserBuilderSchema;

export function buildElectronBrowser(options: ElectronBrowserSchema, context: BuilderContext): Observable<BrowserBuilderOutput> {
  return executeBrowserBuilder(options, context, {
    webpackConfiguration: (browserConfig) => {
      const webpackConfigs: {}[] = [
        browserConfig,
        electronConfig((options.electron || {} as ElectronConfiguration).externals)
      ];

      return webpackMerge(webpackConfigs);
    }
  });
}

export default createBuilder<json.JsonObject & ElectronBrowserSchema>(buildElectronBrowser);