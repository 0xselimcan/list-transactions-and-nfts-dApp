const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require('dotenv-webpack');
const { ProvidePlugin } = require("webpack");


module.exports = {
    entry: "./src/index.tsx",
    output: {
        publicPath: "/",
        path: path.join(__dirname, "public"),
        filename: "index.bundle.js",
    },
    mode: process.env.NODE_ENV || "development",
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        fallback: {
            assert: require.resolve('assert'),
            buffer: require.resolve('buffer/'),
            // console: require.resolve('console-browserify'),
            // constants: require.resolve('constants-browserify'),
            // crypto: require.resolve('crypto-browserify'),
            // domain: require.resolve('domain-browser'),
            // events: require.resolve('events'),
            http: require.resolve('stream-http'),
            https: require.resolve('https-browserify'),
            os: require.resolve('os-browserify/browser'),
            path: require.resolve('path-browserify'),
            // punycode: require.resolve('punycode'),
            // process: require.resolve('process/browser'),
            // querystring: require.resolve('querystring-es3'),
            stream: require.resolve('stream-browserify'),
            // string_decoder: require.resolve('string_decoder'),
            // sys: require.resolve('util'),
            // timers: require.resolve('timers-browserify'),
            // tty: require.resolve('tty-browserify'),
            url: require.resolve('url'),
            // util: require.resolve('util'),
            // vm: require.resolve('vm-browserify'),
            // zlib: require.resolve('browserify-zlib'),
        }
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 3000,
        historyApiFallback: true,
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: ["ts-loader"],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "public", "index.html"),
        }),
        new ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
        }),
        new Dotenv({
            systemvars: true,
            path: ".env",
        }),
    ],
};