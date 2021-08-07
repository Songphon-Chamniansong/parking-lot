const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: './src/app.ts',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: [/node_modules/]
            }
        ]
    },
    target: 'node',
    externals: [
        nodeExternals()
    ],
    mode: "development",
    watch: true,
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        fallback: {
            net: false,
            fs: false
        }
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    },
    plugins: [
        new CopyPlugin({
            patterns: [
              { from: "env/dev/.env"},
            ]
        })
    ]
};