import {
  BuilderContext,
  BuilderConfiguration,
  BuildEvent
} from "@angular-devkit/architect";
import { BrowserBuilder, NormalizedBrowserBuilderSchema, BrowserBuilderSchema } from "@angular-devkit/build-angular";
import { Path, virtualFs } from '@angular-devkit/core';
import { Observable } from "rxjs";
import * as fs from 'fs';
import { electronConfig } from '../electron-webpack-config';
import { ElectronBrowserBuilderSchema, ElectronConfiguration } from "./schema";

const webpackMerge = require('webpack-merge');

export class ElectronBuilder extends BrowserBuilder {

  constructor(public context: BuilderContext) {
    super(context);
  }

  run(builderConfig: BuilderConfiguration<BrowserBuilderSchema>): Observable<BuildEvent> {
    return super.run(builderConfig);
  }

  buildWebpackConfig(
    root: Path,
    projectRoot: Path,
    host: virtualFs.Host<fs.Stats>,
    options: ElectronBrowserBuilderSchema,
  ) {

    let browserConfig = super.buildWebpackConfig(root, projectRoot, host, options);

    const webpackConfigs: {}[] = [
      browserConfig,
      electronConfig((options.electron || {} as ElectronConfiguration).externals)
    ];

    

    return webpackMerge(webpackConfigs);
  }
}

export default ElectronBuilder;
