import { createBuilder, BuilderContext, targetFromTargetString  } from '@angular-devkit/architect';
import { BrowserBuilderOptions, executeDevServerBuilder, DevServerBuilderOptions, DevServerBuilderOutput } from '@angular-devkit/build-angular';
import { Path, virtualFs, json } from '@angular-devkit/core';
import * as fs from 'fs';
import { electronConfig } from '../electron-webpack-config';
import { ElectronBrowserBuilderSchema } from 'src/renderer/schema';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

const webpackMerge = require('webpack-merge');

export function serveElectronBrowser(options: DevServerBuilderOptions, context: BuilderContext): Observable<DevServerBuilderOutput> {
    async function setup() {
        const browserTarget = targetFromTargetString(options.browserTarget);
        return context.getTargetOptions(browserTarget) as unknown as ElectronBrowserBuilderSchema;
    }

    return from(setup())
        .pipe(
            switchMap(
                settings => executeDevServerBuilder(options, context, {
                    webpackConfiguration: (browserConfig) => {
                        return webpackMerge(browserConfig, electronConfig(settings.electron ? settings.electron.externals : []));
                    }
                })
            )
        );
}

export default createBuilder<json.JsonObject & ElectronBrowserBuilderSchema>(serveElectronBrowser);