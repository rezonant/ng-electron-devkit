var nodeExternals = require('webpack-node-externals');

var scopedModuleRegex = new RegExp('@[a-zA-Z0-9][\\w-.]+\/[a-zA-Z0-9][\\w-.]+([a-zA-Z0-9.\/]+)?', 'g');

function getModuleName(request : any, includeAbsolutePaths : any) {
    var req = request;
    var delimiter = '/';

    if (includeAbsolutePaths) {
        req = req.replace(/^.*?\/node_modules\//, '');
    }
    // check if scoped module
    if (scopedModuleRegex.test(req)) {
        // reset regexp
        scopedModuleRegex.lastIndex = 0;
        return req.split(delimiter, 2).join(delimiter);
    }
    return req.split(delimiter)[0];
}

export function electronConfig(externals : any[] = []) {
    return {
        target: 'electron-renderer',
        externals: [
            (context : any, request : any, callback : any) => {
                var moduleName = getModuleName(request, true);
                if (externals.includes(moduleName))
                    return callback(null, `commonjs ${request}`);

                return callback();
            }
        ],
        node: {
            __dirname: false,
        },
        module: {
            rules: [
                {
                    test: /\.node$/,
                    use: 'node-loader'
                }
            ]
        }
    };
}