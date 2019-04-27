import { NormalizedBrowserBuilderSchema } from "@angular-devkit/build-angular";

export interface ElectronConfiguration {
    externals : any[];
}

export interface ElectronBrowserBuilderSchema extends NormalizedBrowserBuilderSchema {
    electron? : ElectronConfiguration;
}